// The service behind the channel, on real folders: adoption of a folder of Markdown files,
// the conflict answer, the count a move carries. The interface tests then drive the same service
// through the bridge.
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { IpeService } from "../src/main/service.js";
import { startBridge } from "../src/bridge/server.js";

async function tmp(name: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), `ipe-service-${name}-`));
}

describe("IpeService", () => {
  it("adopts a folder of Markdown files without rewriting any of them (SPEC-PRJ-001 limit case)", async () => {
    const root = await tmp("adopt");
    await fs.writeFile(path.join(root, "b.md"), "# B\n", "utf8");
    await fs.writeFile(path.join(root, "a.md"), "# A\n", "utf8");
    const service = new IpeService();
    const view = await service.openProject(root);
    expect(view.units.map((u) => [u.title, u.path])).toEqual([["a", "a.md"], ["b", "b.md"]]);
    expect(await fs.readFile(path.join(root, "a.md"), "utf8")).toBe("# A\n");
    expect(await fs.readFile(path.join(root, "b.md"), "utf8")).toBe("# B\n");
    expect((await service.readUnit(view.units[0]?.id ?? "")).text).toBe("# A\n");
  });

  it("refuses a folder with neither a project nor Markdown files", async () => {
    const root = await tmp("empty");
    await expect(new IpeService().openProject(root)).rejects.toMatchObject({ code: "no_project" });
  });

  it("answers a conflict with both texts, then saves when forced (SPEC-PRJ-003 degraded case)", async () => {
    const root = await tmp("conflict");
    const service = new IpeService();
    await service.createProject(root, "Conflict");
    const unit = await service.addUnit("Chapter", null);
    await service.writeUnit(unit.id, "mine, first");
    await fs.writeFile(path.join(root, unit.path), "theirs", "utf8");
    const answer = await service.writeUnit(unit.id, "mine, second");
    expect(answer).toMatchObject({ conflict: true, disk: "theirs", mine: "mine, second" });
    const forced = await service.writeUnit(unit.id, "mine, second", { force: true });
    expect("conflict" in forced).toBe(false);
    expect(await fs.readFile(path.join(root, unit.path), "utf8")).toBe("mine, second");
  });

  it("counts the live objects a move carries, on the unit and on its descendants, tombstones left out (SPEC-PRJ-002)", async () => {
    const root = await tmp("move");
    const service = new IpeService();
    await service.createProject(root, "Move");
    const chapter = await service.addUnit("Chapter 1", null);
    const scene = await service.addUnit("Scene", null);
    const beat = await service.addUnit("Beat", scene.id);
    await service.writeUnit(scene.id, "A passage to note.");
    await service.writeUnit(beat.id, "A beat inside the scene.");
    await service.createObject({ kind: "note", title: "n", origin: "author", action: "note", anchors: [{ unit: scene.id, start: 2, end: 9 }] }, "author");
    await service.createObject({ kind: "fact", title: "f", origin: "assistant", action: "extract", anchors: [{ unit: scene.id, start: 10, end: 14 }] }, "assistant");
    await service.createObject({ kind: "note", title: "on the beat", origin: "author", action: "note", anchors: [{ unit: beat.id, start: 2, end: 6 }] }, "author");
    const gone = await service.createObject({ kind: "note", title: "deleted before the move", origin: "author", action: "note", anchors: [{ unit: scene.id, start: 0, end: 1 }] }, "author");
    await service.deleteObject(gone.id);
    const moved = await service.moveUnit(scene.id, chapter.id, 0);
    expect(moved.carried).toBe(3);
    expect(moved.units[0]?.children[0]?.id).toBe(scene.id);
    expect(moved.units[0]?.children[0]?.children[0]?.id).toBe(beat.id);
    expect((await service.objects()).every((o) => o.anchors.every((a) => a.state === "intact"))).toBe(true);
  });

  it("takes the disk's text after a conflict, so that the next save lands (SPEC-PRJ-003 degraded case)", async () => {
    const root = await tmp("take-disk");
    const service = new IpeService();
    await service.createProject(root, "Take");
    const unit = await service.addUnit("Chapter", null);
    await service.writeUnit(unit.id, "first");
    await fs.writeFile(path.join(root, unit.path), "disk version", "utf8");
    expect(await service.writeUnit(unit.id, "first, edited")).toMatchObject({ conflict: true, disk: "disk version" });
    const taken = await service.takeDisk(unit.id);
    expect(taken.text).toBe("disk version");
    expect((await service.readUnit(unit.id)).text).toBe("disk version");
    expect((await service.versions()).at(-1)?.action).toBe("external");
    const saved = await service.writeUnit(unit.id, "disk version, then edited");
    expect("conflict" in saved).toBe(false);
    expect(await fs.readFile(path.join(root, unit.path), "utf8")).toBe("disk version, then edited");
  });

  it("returns the first hits and the total count, so that a cut list is never silent (SPEC-PRJ-005)", async () => {
    const root = await tmp("search");
    const service = new IpeService();
    await service.createProject(root, "Search");
    const unit = await service.addUnit("Chapter", null);
    await service.writeUnit(unit.id, "bell ".repeat(250));
    const result = await service.search("bell");
    expect(result.hits.length).toBe(200);
    expect(result.total).toBe(250);
    expect((await service.search("absent")).total).toBe(0);
  });

  it("serves the same calls over the bridge, with errors carried as data", async () => {
    const root = await tmp("bridge");
    const bridge = await startBridge(new IpeService());
    try {
      const call = async (method: string, args: unknown[]) => {
        const r = await fetch(`http://127.0.0.1:${bridge.port}/api/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ args }) });
        return (await r.json()) as { ok: boolean; result?: unknown; error?: { code: string } };
      };
      expect((await call("current", [])).result).toBeNull();
      expect((await call("readUnit", ["x"])).error?.code).toBe("no_project_open");
      const created = await call("createProject", [root, "Bridged"]);
      expect((created.result as { name: string }).name).toBe("Bridged");
      const unit = (await call("addUnit", ["Chapter", null])).result as { id: string };
      expect((await call("writeUnit", [unit.id, "hello"])).ok).toBe(true);
      expect(((await call("readUnit", [unit.id])).result as { text: string }).text).toBe("hello");
      expect((await call("nope", [])).error?.code).toBe("not_found");
      expect((await fetch(`http://127.0.0.1:${bridge.port}/health`)).ok).toBe(true);
    } finally {
      await bridge.close();
    }
  });
});
