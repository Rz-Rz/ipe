// SPEC-KER-014: Kernel inspection.
import { describe, expect, it } from "vitest";
import { noteOn, objectFiles, withUnit } from "./support/project.js";

/** An independent walk over the object files: the categories recomputed from the JSON alone. */
function walk(files: Map<string, string>) {
  const c = { total: 0, proposed: 0, accepted: 0, rejected: 0, current: 0, stale: 0, anchored: 0, intact: 0, changed: 0, ambiguous: 0, orphaned: 0, deleted: 0, byKind: {} as Record<string, number> };
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
    for (const a of o.anchors) {
      if (a.state === "intact") c.intact += 1;
      if (a.state === "changed") c.changed += 1;
      if (a.state === "ambiguous") c.ambiguous += 1;
      if (a.state === "orphaned") c.orphaned += 1;
    }
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
    await kernel.accept(b.id, "author");
    await kernel.reject(c.id, "author");
    await kernel.deleteObject(d.id, "author");
    await kernel.writeUnit(unit.id, "Alpha BETA. Gamma delta. Eta theta.");
    const counts = kernel.counts();
    expect(counts).toEqual(walk(objectFiles(storage)));
    expect(counts.total).toBe(3);
    expect(counts.deleted).toBe(1);
    expect(counts.changed).toBe(1);
    expect(counts.orphaned).toBe(1);
    expect(counts.intact).toBe(1);
    expect(counts.stale).toBe(2);
    expect(counts.byKind).toEqual({ note: 1, fact: 2 });
  });
});
