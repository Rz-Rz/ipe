// SPEC-KER-010: Provenance query.
import { describe, expect, it } from "vitest";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-010 Provenance query", () => {
  it("TST-KER-010a: the chain lists every anchor with its passage, the version, origin, action, state, staleness and transitive dependencies", async () => {
    const { kernel, unit } = await withUnit("Kestrel left at noon. She reached the ford by dusk. The bridge was gone.");
    const leftAtNoon = await noteOn(kernel, unit.id, "Kestrel left at noon.");
    const reachedFord = await noteOn(kernel, unit.id, "She reached the ford by dusk.");
    const travel = await kernel.createObject(
      { kind: "inference", title: "six hours on the road", origin: "assistant", action: "chronology", dependsOn: [leftAtNoon.id, reachedFord.id] },
      "assistant",
    );
    const consequence = await kernel.createObject(
      { kind: "inference", title: "she crossed before the flood", origin: "assistant", action: "chronology", dependsOn: [travel.id], anchors: [{ unit: unit.id, start: 0, end: 7 }] },
      "assistant",
    );
    const chain = kernel.explain(consequence.id);
    expect(chain.object.id).toBe(consequence.id);
    expect(chain.anchors).toHaveLength(1);
    expect(chain.anchors[0]?.passage).toBe("Kestrel");
    expect(chain.anchors[0]?.state).toBe("intact");
    expect(chain.versionFound).toBe(true);
    expect(chain.version?.id).toBe(consequence.version);
    expect(chain.object.provenance.origin).toBe("assistant");
    expect(chain.object.provenance.action).toBe("chronology");
    expect(chain.object.provenance.approval).toBe("proposed");
    expect(chain.object.stale).toBe(false);
    expect(chain.dependencies.map((d) => d.id)).toEqual([travel.id, leftAtNoon.id, reachedFord.id]);
    expect(kernel.explain(travel.id).dependents).toEqual([consequence.id]);
    expect(() => kernel.explain("no-such-object")).toThrow(/no object/);
  });

  it("TST-KER-010b: a write that would create a dependency cycle is refused", async () => {
    const { kernel, unit } = await withUnit("One. Two. Three.");
    const a = await noteOn(kernel, unit.id, "One.");
    const b = await kernel.createObject({ kind: "inference", title: "b", origin: "assistant", action: "test", dependsOn: [a.id] }, "assistant");
    const c = await kernel.createObject({ kind: "inference", title: "c", origin: "assistant", action: "test", dependsOn: [b.id] }, "assistant");
    await expect(kernel.editObject(a.id, { dependsOn: [c.id] }, "author")).rejects.toMatchObject({ code: "dependency_cycle" });
    await expect(kernel.editObject(a.id, { dependsOn: [a.id] }, "author")).rejects.toMatchObject({ code: "dependency_cycle" });
    expect(kernel.getObject(a.id).dependsOn).toEqual([]);
  });
});
