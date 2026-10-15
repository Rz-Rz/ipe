// SPEC-KER-012: Consistent state after interruption.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { Kernel, type Storage } from "@ipe/kernel";
import { NodeStorage, RandomIds, SystemClock, createProject, nodeHash, openProject } from "../src/index.js";
import { tmpFolder } from "./support/tmp.js";

const TEXT = "The gate was locked at dusk. The watchman kept the key.";

/** A storage that fails on one write, counted from the moment it is armed: the interruption. */
class FaultyStorage implements Storage {
  count = 0;
  failAt = Number.POSITIVE_INFINITY;
  error: Error = new Error("injected interruption");
  constructor(private readonly inner: NodeStorage) {}
  read(p: string) { return this.inner.read(p); }
  async write(p: string, t: string) {
    this.count += 1;
    if (this.count === this.failAt) throw this.error;
    return this.inner.write(p, t);
  }
  append(p: string, t: string) { return this.inner.append(p, t); }
  list(d: string) { return this.inner.list(d); }
  remove(p: string) { return this.inner.remove(p); }
  exists(p: string) { return this.inner.exists(p); }
}

async function seeded(name: string) {
  const root = await tmpFolder(name);
  const kernel = await createProject(root, "Interrupted");
  const unit = await kernel.addUnit("Chapter 1");
  await kernel.writeUnit(unit.id, TEXT);
  await kernel.createObject({ kind: "note", title: "key", origin: "author", action: "note", anchors: [{ unit: unit.id, start: 29, end: 55 }] }, "author");
  return { root, unit };
}

async function faultyKernel(root: string): Promise<{ kernel: Kernel; faulty: FaultyStorage }> {
  const faulty = new FaultyStorage(new NodeStorage(root));
  const kernel = await Kernel.open({ storage: faulty, clock: new SystemClock(), ids: new RandomIds(), hash: nodeHash });
  return { kernel, faulty };
}

describe("SPEC-KER-012 Consistent state after interruption", () => {
  it("TST-KER-012a: with a fault injected at each step of a write, the project reopens in its last consistent state", async () => {
    // How many writes a save makes, measured once on a clean run.
    const probe = await seeded("probe");
    const { kernel: probeKernel, faulty: counter } = await faultyKernel(probe.root);
    await probeKernel.writeUnit(probe.unit.id, `${TEXT} And then the rain.`);
    const steps = counter.count;
    expect(steps).toBeGreaterThanOrEqual(4);

    for (let failAt = 1; failAt <= steps; failAt++) {
      const { root, unit } = await seeded(`fault-${failAt}`);
      const { kernel, faulty } = await faultyKernel(root);
      faulty.failAt = failAt;
      await expect(kernel.writeUnit(unit.id, `${TEXT} And then the rain.`)).rejects.toThrow("injected interruption");

      const reopened = await openProject(root);
      const text = reopened.readUnit(unit.id);
      expect([TEXT, `${TEXT} And then the rain.`], `step ${failAt}: the unit is whole, old or new`).toContain(text);
      expect(reopened.listObjects().length, `step ${failAt}: every object file parses`).toBe(1);
      expect(reopened.openReport.unreadableObjects, `step ${failAt}`).toEqual([]);
      if (text !== TEXT) expect(reopened.openReport.externalChanges.concat(reopened.openReport.interrupted ? ["interrupted"] : []).length, `step ${failAt}: a new text without a state is reported`).toBeGreaterThan(0);
      const files = await fs.readdir(path.join(root, ".ipe", "objects"));
      expect(files.filter((f) => f.endsWith(".tmp")), `step ${failAt}: no temporary file left behind`).toEqual([]);

      // Once reopened, the project is consistent: a second opening reports nothing.
      const again = await openProject(root);
      expect(again.openReport.externalChanges, `step ${failAt}`).toEqual([]);
      expect(again.openReport.interrupted, `step ${failAt}`).toBe(false);
      expect(again.readUnit(unit.id)).toBe(text);
    }
  });

  it("TST-KER-012c: a failure in the middle of a write leaves the target as it was, and no temporary file behind", async () => {
    const { root, unit } = await seeded("mid-write");
    const file = path.join(root, "chapter-1.md");
    // The crash happens after the temporary file is written and before it takes the target's place.
    class CrashBeforeRename extends NodeStorage {
      protected override moveIntoPlace(): Promise<void> {
        return Promise.reject(Object.assign(new Error("EIO: crash in the middle of the write"), { code: "EIO" }));
      }
    }
    const storage = new CrashBeforeRename(root);
    await expect(storage.write("chapter-1.md", "a text that never lands")).rejects.toMatchObject({ code: "EIO" });
    expect(await fs.readFile(file, "utf8")).toBe(TEXT);
    const leftovers = (await fs.readdir(root)).filter((f) => f.endsWith(".tmp"));
    expect(leftovers).toEqual([]);
    const reopened = await openProject(root);
    expect(reopened.readUnit(unit.id)).toBe(TEXT);
    expect(reopened.openReport.externalChanges).toEqual([]);
  });

  it("TST-KER-012b: with the disk full, the write is refused and the previous state is intact", async () => {
    const { root, unit } = await seeded("disk-full");
    const { kernel, faulty } = await faultyKernel(root);
    const full = Object.assign(new Error("ENOSPC: no space left on device"), { code: "ENOSPC" });
    faulty.error = full;
    faulty.failAt = 1;
    await expect(kernel.writeUnit(unit.id, "A longer text that will not fit.")).rejects.toMatchObject({ code: "ENOSPC" });
    const reopened = await openProject(root);
    expect(reopened.openReport.externalChanges).toEqual([]);
    expect(reopened.openReport.interrupted).toBe(false);
    expect(reopened.readUnit(unit.id)).toBe(TEXT);
    expect(reopened.listObjects().length).toBe(1);
  });
});
