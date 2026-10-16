// SPEC-KER-008: Documented on-disk formats.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { createProject, openProject } from "../src/index.js";
import { tmpFolder } from "./support/tmp.js";

/**
 * An independent reader, written from docs/FORMAT.md alone, with the file system only. It knows
 * nothing of the kernel: it reads the manifest, the unit files, the object files, the versions
 * index and blobs, the journal and the state, as the document describes them.
 */
async function readProjectIndependently(root: string) {
  const json = async (rel: string) => JSON.parse(await fs.readFile(path.join(root, rel), "utf8")) as Record<string, unknown>;
  const manifest = await json("ipe.json");
  const units: Array<{ id: string; title: string; path: string; text: string }> = [];
  const walk = async (nodes: Array<Record<string, unknown>>) => {
    for (const n of nodes) {
      units.push({ id: n["id"] as string, title: n["title"] as string, path: n["path"] as string, text: await fs.readFile(path.join(root, n["path"] as string), "utf8") });
      await walk((n["children"] as Array<Record<string, unknown>>) ?? []);
    }
  };
  await walk(manifest["units"] as Array<Record<string, unknown>>);
  const objects = new Map<string, Record<string, unknown>>();
  for (const file of (await fs.readdir(path.join(root, ".ipe", "objects"))).filter((f) => f.endsWith(".json"))) {
    const o = await json(path.join(".ipe", "objects", file));
    objects.set(o["id"] as string, o);
  }
  const versions = JSON.parse(await fs.readFile(path.join(root, ".ipe", "versions", "index.json"), "utf8")) as Array<{ id: string; units: Record<string, string> }>;
  const blob = (hash: string) => fs.readFile(path.join(root, ".ipe", "versions", "blobs", hash), "utf8");
  const state = (await json(".ipe/state.json")) as { schema: number; version: string | null; units: Record<string, string> };
  const journal = (await fs.readFile(path.join(root, ".ipe", "journal.jsonl"), "utf8")).split("\n").filter((l) => l.trim() !== "").map((l) => JSON.parse(l) as Record<string, unknown>);
  return { name: manifest["name"] as string, schema: manifest["schema"], units, objects, versions, blob, state, journal };
}

async function seededProject(name: string) {
  const root = await tmpFolder(name);
  const kernel = await createProject(root, "Seeded");
  const one = await kernel.addUnit("One");
  const two = await kernel.addUnit("Two");
  await kernel.writeUnit(one.id, "The harbour was quiet. Mara counted the boats twice.");
  await kernel.writeUnit(two.id, "Nobody answered the bell that night.");
  const a = await kernel.createObject({ kind: "note", title: "boats", origin: "author", action: "note", anchors: [{ unit: one.id, start: 23, end: 52 }] }, "author");
  const b = await kernel.createObject({ kind: "fact", title: "bell", origin: "assistant", action: "extract", anchors: [{ unit: two.id, start: 0, end: 24 }], dependsOn: [a.id] }, "assistant");
  const c = await kernel.createObject({ kind: "fact", title: "gone", origin: "import", action: "import" }, "author");
  await kernel.accept(b.id, "author");
  await kernel.deleteObject(c.id, "author");
  return { root, kernel, one, two, a, b, c };
}

describe("SPEC-KER-008 Documented on-disk formats", () => {
  it("TST-KER-008a: an independent reader reads the whole store from the documented format alone", async () => {
    const { root, kernel, one, two } = await seededProject("format");
    const seen = await readProjectIndependently(root);
    expect(seen.schema).toBe(1);
    expect(seen.name).toBe("Seeded");
    expect(seen.units.map((u) => u.id)).toEqual([one.id, two.id]);
    for (const u of seen.units) expect(u.text).toBe(kernel.readUnit(u.id));
    const all = kernel.listObjects({ includeDeleted: true });
    expect([...seen.objects.keys()].sort()).toEqual(all.map((o) => o.id).sort());
    for (const o of all) {
      const stored = seen.objects.get(o.id) as { anchors: Array<{ unit: string; start: number; end: number; text: string; state: string }>; provenance: { approval: string }; deleted: boolean };
      expect(stored.provenance.approval).toBe(o.provenance.approval);
      expect(stored.deleted).toBe(o.deleted);
      for (const anchor of stored.anchors) {
        const unit = seen.units.find((u) => u.id === anchor.unit);
        expect(unit, `unit of an anchor of ${o.id}`).toBeDefined();
        if (anchor.state === "intact") expect(unit?.text.slice(anchor.start, anchor.end)).toBe(anchor.text);
      }
    }
    const last = seen.versions[seen.versions.length - 1];
    expect(last?.id).toBe(kernel.currentVersion()?.id);
    expect(seen.state.version).toBe(last?.id);
    for (const [unitId, hash] of Object.entries(last?.units ?? {})) expect(await seen.blob(hash)).toBe(kernel.readUnit(unitId));
    expect(seen.journal.length).toBe(kernel.journalEvents().length);
    expect(seen.journal.map((e) => e["kind"])).toEqual(kernel.journalEvents().map((e) => e.kind));
  });

  it("TST-KER-008b: a copied project folder opens with identical objects and text", async () => {
    const { root, kernel, one } = await seededProject("copy");
    const copy = await tmpFolder("copy-target");
    await fs.cp(root, copy, { recursive: true });
    const reopened = await openProject(copy);
    expect(reopened.openReport.externalChanges).toEqual([]);
    expect(reopened.openReport.interrupted).toBe(false);
    expect(reopened.listObjects({ includeDeleted: true })).toEqual(kernel.listObjects({ includeDeleted: true }));
    expect(reopened.readUnit(one.id)).toBe(kernel.readUnit(one.id));
    expect(reopened.versions()).toEqual(kernel.versions());
  });

  it("TST-KER-008c: one corrupted object file is reported by name; the other objects load", async () => {
    const { root, kernel, a, b } = await seededProject("corrupt");
    const file = path.join(".ipe", "objects", `${a.id}.json`);
    await fs.writeFile(path.join(root, file), "{ this is not json", "utf8");
    const reopened = await openProject(root);
    expect(reopened.openReport.unreadableObjects).toEqual([file.split(path.sep).join("/")]);
    expect(reopened.listObjects().map((o) => o.id)).toEqual([b.id]);
    expect(reopened.getObject(b.id).title).toBe(kernel.getObject(b.id).title);
  });

  it("TST-KER-008d: a truncated last journal line is skipped at opening and its count is reported", async () => {
    const { root, kernel } = await seededProject("truncated");
    const journal = path.join(root, ".ipe", "journal.jsonl");
    const whole = await fs.readFile(journal, "utf8");
    const lines = whole.split("\n").filter((l) => l.trim() !== "");
    const last = lines[lines.length - 1] ?? "";
    expect(last.length).toBeGreaterThan(2);
    // A crash in the middle of an append: the last line stops half way, without its newline.
    await fs.writeFile(journal, `${whole}${last.slice(0, Math.floor(last.length / 2))}`, "utf8");
    const reopened = await openProject(root);
    expect(reopened.openReport.journalLinesSkipped).toBe(1);
    expect(reopened.journalEvents().map((e) => e.id)).toEqual(kernel.journalEvents().map((e) => e.id));
    expect(reopened.listObjects().map((o) => o.id).sort()).toEqual(kernel.listObjects().map((o) => o.id).sort());
  });
});
