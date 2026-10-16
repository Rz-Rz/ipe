// SPEC-KER-004: Manuscript versions.
import { describe, expect, it } from "vitest";
import { Kernel, VERSIONS_INDEX, objectPath } from "../src/index.js";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-004 Manuscript versions", () => {
  it("TST-KER-004a: any earlier version of a unit is recovered byte for byte", async () => {
    const { kernel, unit } = await withUnit("first draft\n");
    const v1 = kernel.currentVersion();
    await kernel.writeUnit(unit.id, "second draft, longer\n");
    const v2 = kernel.currentVersion();
    await kernel.writeUnit(unit.id, "third\n");
    const v3 = kernel.currentVersion();
    expect(await kernel.readVersion(unit.id, v1?.id ?? "")).toBe("first draft\n");
    expect(await kernel.readVersion(unit.id, v2?.id ?? "")).toBe("second draft, longer\n");
    expect(await kernel.readVersion(unit.id, v3?.id ?? "")).toBe("third\n");
    expect(kernel.versions().length).toBeGreaterThanOrEqual(4);
    expect(await kernel.readVersion(unit.id, "no-such-version")).toBeNull();
  });

  it("TST-KER-004b: an object naming a missing version is reported unverifiable and kept", async () => {
    const { kernel, storage, adapters, unit } = await withUnit("A passage to note.");
    const o = await noteOn(kernel, unit.id, "passage");
    const path = objectPath(o.id);
    storage.files.set(path, (storage.files.get(path) ?? "").replace(o.version, "version-that-never-was"));
    const reopened = await Kernel.open(adapters);
    const chain = reopened.explain(o.id);
    expect(chain.versionFound).toBe(false);
    expect(chain.version).toBeNull();
    expect(chain.object.id).toBe(o.id);
    expect(reopened.listObjects().map((x) => x.id)).toEqual([o.id]);
  });

  it("TST-KER-004c: a project with corrupted history opens with its current text editable", async () => {
    const { kernel, storage, adapters, unit } = await withUnit("still here\n");
    await noteOn(kernel, unit.id, "still");
    storage.files.set(VERSIONS_INDEX, "{ this is not json");
    const reopened = await Kernel.open(adapters);
    expect(reopened.openReport.historyUnreadable).toBe(true);
    expect(reopened.readUnit(unit.id)).toBe("still here\n");
    const result = await reopened.writeUnit(unit.id, "still here, and edited\n");
    expect(result.version).not.toBeNull();
    expect(reopened.readUnit(unit.id)).toBe("still here, and edited\n");
    expect(reopened.versions().length).toBe(1);
    // The unreadable index was kept under another name before the fresh one replaced it.
    const kept = [...storage.files.keys()].filter((p) => p.startsWith(`${VERSIONS_INDEX}.unreadable-`));
    expect(kept).toHaveLength(1);
    expect(storage.files.get(kept[0] ?? "")).toBe("{ this is not json");
  });
});
