// SPEC-KER-014: Kernel inspection.
import { describe, expect, it } from "vitest";
import { noteOn, objectFiles, withUnit } from "./support/project.js";

/** An independent walk over the object files: the categories recomputed from the JSON alone, with the
 *  requirement's definition: an object counts once per anchor state it carries; anchors are counted beside. */
function walk(files: Map<string, string>) {
  const c = {
    total: 0, proposed: 0, accepted: 0, rejected: 0, current: 0, stale: 0, anchored: 0, intact: 0, changed: 0, ambiguous: 0, orphaned: 0, deleted: 0,
    byKind: {} as Record<string, number>,
    anchorsByState: { intact: 0, changed: 0, ambiguous: 0, orphaned: 0 } as Record<string, number>,
  };
  for (const text of files.values()) {
    const o = JSON.parse(text) as { kind: string; deleted: boolean; stale: boolean; anchors: Array<{ state: string }>; provenance: { approval: string } };
    if (o.deleted) {
      c.deleted += 1;
      continue;
    }
    c.total += 1;
    c.byKind[o.kind] = (c.byKind[o.kind] ?? 0) + 1;
    if (o.provenance.approval === "proposed") c.proposed += 1;
    if (o.provenance.approval === "accepted") c.accepted += 1;
    if (o.provenance.approval === "rejected") c.rejected += 1;
    if (o.stale) c.stale += 1;
    else c.current += 1;
    if (o.anchors.length > 0) c.anchored += 1;
    const states = new Set(o.anchors.map((a) => a.state));
    if (states.has("intact")) c.intact += 1;
    if (states.has("changed")) c.changed += 1;
    if (states.has("ambiguous")) c.ambiguous += 1;
    if (states.has("orphaned")) c.orphaned += 1;
    for (const a of o.anchors) c.anchorsByState[a.state] = (c.anchorsByState[a.state] ?? 0) + 1;
  }
  return c;
}

describe("SPEC-KER-014 Kernel inspection", () => {
  it("TST-KER-014a: the reported counts equal the counts computed from the store by an independent walk", async () => {
    const { kernel, storage, unit } = await withUnit("Alpha beta. Gamma delta. Epsilon zeta. Eta theta.");
    const a = await noteOn(kernel, unit.id, "Alpha beta");
    const b = await noteOn(kernel, unit.id, "Gamma delta", { origin: "assistant", kind: "fact" });
    const c = await noteOn(kernel, unit.id, "Epsilon zeta", { origin: "assistant", kind: "fact" });
    const d = await kernel.createObject({ kind: "inference", title: "d", origin: "assistant", action: "test", dependsOn: [a.id] }, "assistant");
    // An object with two intact anchors: it counts once as an object, twice among the anchors.
    const e = await kernel.createObject(
      { kind: "note", title: "two anchors", origin: "author", action: "test", anchors: [{ unit: unit.id, start: 0, end: 5 }, { unit: unit.id, start: 40, end: 43 }] },
      "author",
    );
    expect(e.anchors).toHaveLength(2);
    await kernel.accept(b.id, "author");
    await kernel.reject(c.id, "author");
    await kernel.deleteObject(d.id, "author");
    await kernel.writeUnit(unit.id, "Alpha BETA. Gamma delta. Eta theta.");
    const counts = kernel.counts();
    expect(counts).toEqual(walk(objectFiles(storage)));
    expect(counts.total).toBe(4);
    expect(counts.deleted).toBe(1);
    expect(counts.changed).toBe(1);
    expect(counts.orphaned).toBe(1);
    expect(counts.intact).toBe(2);
    expect(counts.anchorsByState).toEqual({ intact: 3, changed: 1, ambiguous: 0, orphaned: 1 });
    expect(counts.stale).toBe(2);
    expect(counts.byKind).toEqual({ note: 2, fact: 2 });
  });
});
