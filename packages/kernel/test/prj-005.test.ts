// SPEC-PRJ-005: Project search, at the kernel: every occurrence in units and objects, with its place.
import { describe, expect, it } from "vitest";
import { freshProject, noteOn } from "./support/project.js";

describe("SPEC-PRJ-005 Project search", () => {
  it("TST-PRJ-005a: every occurrence in units and objects is returned with unit and passage", async () => {
    const { kernel } = await freshProject();
    const one = await kernel.addUnit("One");
    const two = await kernel.addUnit("Two");
    await kernel.writeUnit(one.id, "The bell rang once. The bell rang twice.");
    await kernel.writeUnit(two.id, "No bell at all here. Bells elsewhere.");
    const note = await noteOn(kernel, one.id, "rang twice", { title: "the bell question", body: { about: "a bell" } });
    const hits = kernel.search("bell");
    const inUnits = hits.filter((h) => h.unit !== null);
    expect(inUnits.map((h) => [h.unit, h.start])).toEqual([[one.id, 4], [one.id, 24], [two.id, 3], [two.id, 21]]);
    for (const h of inUnits) expect(kernel.readUnit(h.unit ?? "").slice(h.start, h.end).toLowerCase()).toBe("bell");
    const inObjects = hits.filter((h) => h.objectId !== null);
    expect(inObjects.map((h) => h.objectId)).toEqual([note.id]);
    expect(kernel.search("")).toEqual([]);
    expect(kernel.search("absent word")).toEqual([]);
    expect(kernel.search("BELL").length).toBe(hits.length);
  });
});
