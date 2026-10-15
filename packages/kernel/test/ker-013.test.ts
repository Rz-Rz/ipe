// SPEC-KER-013: Dependencies between objects.
import { describe, expect, it } from "vitest";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-013 Dependencies between objects", () => {
  it("TST-KER-013a: a recorded dependency appears in the provenance query and propagates staleness and invalidation", async () => {
    const { kernel, unit } = await withUnit("The letter arrived on Tuesday. She burned it on Wednesday.");
    const arrival = await noteOn(kernel, unit.id, "The letter arrived on Tuesday.");
    const burning = await noteOn(kernel, unit.id, "She burned it on Wednesday.");
    const gap = await kernel.createObject({ kind: "inference", title: "one day between", origin: "assistant", action: "chronology", dependsOn: [arrival.id, burning.id] }, "assistant");
    expect(kernel.explain(gap.id).dependencies.map((d) => d.id).sort()).toEqual([arrival.id, burning.id].sort());
    expect(kernel.explain(arrival.id).dependents).toEqual([gap.id]);
    const result = await kernel.writeUnit(unit.id, "The letter arrived on Monday. She burned it on Wednesday.");
    expect(result.invalidated.sort()).toEqual([arrival.id, gap.id].sort());
    expect(kernel.getObject(gap.id).stale).toBe(true);
    expect(kernel.getObject(burning.id).stale).toBe(false);
  });

  it("TST-KER-013b: a dependency on an unknown object is refused", async () => {
    const { kernel, unit } = await withUnit("A passage.");
    await expect(
      kernel.createObject({ kind: "inference", title: "x", origin: "assistant", action: "test", dependsOn: ["ghost"] }, "assistant"),
    ).rejects.toMatchObject({ code: "unknown_dependency" });
    const o = await noteOn(kernel, unit.id, "passage");
    await expect(kernel.editObject(o.id, { dependsOn: ["ghost"] }, "author")).rejects.toMatchObject({ code: "unknown_dependency" });
    expect(kernel.listObjects()).toHaveLength(1);
    const gone = await kernel.createObject({ kind: "fact", title: "gone", origin: "import", action: "import" }, "author");
    await kernel.deleteObject(gone.id, "author");
    await expect(kernel.editObject(o.id, { dependsOn: [gone.id] }, "author")).rejects.toMatchObject({ code: "deleted_dependency" });
  });
});
