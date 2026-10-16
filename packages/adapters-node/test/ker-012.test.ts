// SPEC-KER-012: Consistent state after interruption.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { Kernel, canonicalJson, type Storage } from "@ipe/kernel";
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

  it("TST-KER-012b: with the disk full, the write is refused, the previous state is intact, and the same kernel saves again once there is room", async () => {
    const { root, unit } = await seeded("disk-full");
    const { kernel, faulty } = await faultyKernel(root);
    const full = Object.assign(new Error("ENOSPC: no space left on device"), { code: "ENOSPC" });
    const longer = "A longer text that will not fit.";
    faulty.error = full;
    faulty.failAt = 1;
    await expect(kernel.writeUnit(unit.id, longer)).rejects.toMatchObject({ code: "ENOSPC" });
    const reopened = await openProject(root);
    expect(reopened.openReport.externalChanges).toEqual([]);
    expect(reopened.openReport.interrupted).toBe(false);
    expect(reopened.readUnit(unit.id)).toBe(TEXT);
    expect(reopened.listObjects().length).toBe(1);
    // The refused text was never written: the kernel still holds the text the disk holds, the disk
    // is no external edit, and the retry is an ordinary save that lands.
    expect(kernel.readUnit(unit.id)).toBe(TEXT);
    expect(await kernel.externalText(unit.id)).toBeNull();
    faulty.failAt = Number.POSITIVE_INFINITY;
    const retry = await kernel.writeUnit(unit.id, longer);
    expect(retry.version?.action).toBe("write");
    expect(await fs.readFile(path.join(root, "chapter-1.md"), "utf8")).toBe(longer);
    const afterRetry = await openProject(root);
    expect(afterRetry.readUnit(unit.id)).toBe(longer);
    expect(afterRetry.openReport.externalChanges).toEqual([]);
    expect(afterRetry.openReport.interrupted).toBe(false);
  });

  it("TST-KER-012d: a save refused at any write step, the unit file included, completes when the same text is saved again in the same kernel", async () => {
    const probe = await seeded("retry-probe");
    const { kernel: probeKernel, faulty: counter } = await faultyKernel(probe.root);
    const longer = `${TEXT} And then the rain.`;
    await probeKernel.writeUnit(probe.unit.id, longer);
    const steps = counter.count;
    expect(steps).toBeGreaterThanOrEqual(4);
    for (let failAt = 1; failAt <= steps; failAt++) {
      const { root, unit } = await seeded(`retry-${failAt}`);
      const { kernel, faulty } = await faultyKernel(root);
      const versionsBefore = kernel.versions().length;
      faulty.failAt = failAt;
      await expect(kernel.writeUnit(unit.id, longer)).rejects.toThrow("injected interruption");
      faulty.failAt = Number.POSITIVE_INFINITY;
      // The same text again, in the same kernel: the save runs whole and returns a version of its own.
      const retried = await kernel.writeUnit(unit.id, longer);
      expect(retried.version?.action, `step ${failAt}`).toBe("write");
      // One version for one effective save, except when the state alone was refused: the index already held one.
      expect(kernel.versions().length - versionsBefore, `step ${failAt}: versions recorded`).toBe(failAt === steps ? 2 : 1);
      expect(await kernel.readVersion(unit.id, retried.version?.id ?? ""), `step ${failAt}: blob`).toBe(longer);
      const reopened = await openProject(root);
      expect(reopened.readUnit(unit.id), `step ${failAt}`).toBe(longer);
      expect(reopened.openReport.externalChanges, `step ${failAt}`).toEqual([]);
      expect(reopened.openReport.interrupted, `step ${failAt}`).toBe(false);
      expect(reopened.listObjects().length, `step ${failAt}`).toBe(1);
      expect(reopened.currentVersion()?.id, `step ${failAt}`).toBe(retried.version?.id);
      // Every object file holds the live object, and the reopened objects are the live ones.
      for (const live of kernel.listObjects()) {
        expect(await fs.readFile(path.join(root, ".ipe", "objects", `${live.id}.json`), "utf8"), `step ${failAt}: object file`).toBe(canonicalJson(live));
        expect(reopened.getObject(live.id), `step ${failAt}: reopened object`).toEqual(live);
      }
      // Saved once, the same text is a no-op again: no new version for nothing.
      const again = await kernel.writeUnit(unit.id, longer);
      expect(again.version?.id, `step ${failAt}`).toBe(retried.version?.id);
    }
  });

  it("TST-KER-012e: a save refused past the unit file still completes at the retry when another unit was saved in between", async () => {
    const longer = `${TEXT} And then the rain.`;
    for (const failAt of [2, 3]) {
      const { root, unit } = await seeded(`interleaved-${failAt}`);
      const { kernel, faulty } = await faultyKernel(root);
      const other = await kernel.addUnit("Chapter 2");
      faulty.count = 0;
      faulty.failAt = failAt;
      await expect(kernel.writeUnit(unit.id, longer)).rejects.toThrow("injected interruption");
      faulty.failAt = Number.POSITIVE_INFINITY;
      // Another unit saved in between completes its own save and repairs nothing of the first.
      await kernel.writeUnit(other.id, "The second chapter, whole.");
      const retried = await kernel.writeUnit(unit.id, longer);
      expect(retried.version?.action, `step ${failAt}`).toBe("write");
      expect(retried.version?.units[unit.id], `step ${failAt}`).toBe(nodeHash.sha256(longer));
      expect(await kernel.readVersion(unit.id, retried.version?.id ?? ""), `step ${failAt}: blob`).toBe(longer);
      const reopened = await openProject(root);
      expect(reopened.readUnit(unit.id), `step ${failAt}`).toBe(longer);
      expect(reopened.readUnit(other.id), `step ${failAt}`).toBe("The second chapter, whole.");
      expect(reopened.openReport.externalChanges, `step ${failAt}`).toEqual([]);
      expect(reopened.openReport.interrupted, `step ${failAt}`).toBe(false);
      for (const live of kernel.listObjects()) {
        expect(await fs.readFile(path.join(root, ".ipe", "objects", `${live.id}.json`), "utf8"), `step ${failAt}: object file`).toBe(canonicalJson(live));
        expect(reopened.getObject(live.id), `step ${failAt}: reopened object`).toEqual(live);
      }
    }
  });
});
