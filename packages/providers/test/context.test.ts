// SPEC-PRV-003: explicit sending within the chosen scope, at the assembly: the preview says what
// leaves, item by item, and its total is the size of what leaves.
import { describe, expect, it } from "vitest";
import { Kernel, memoryAdapters } from "@ipe/kernel";
import { ContextError, PREAMBLE, assembleContext, previewOf } from "../src/index.js";

async function project() {
  const kernel = await Kernel.create(memoryAdapters(), "Scoped");
  const one = await kernel.addUnit("Chapter 1");
  const two = await kernel.addUnit("Chapter 2");
  await kernel.writeUnit(one.id, "The harbour was quiet. Mara counted the boats twice.");
  await kernel.writeUnit(two.id, "Nobody answered the bell that night. ZEBRA-ONLY-IN-TWO.");
  return { kernel, one, two };
}

describe("SPEC-PRV-003 Explicit sending within the chosen scope", () => {
  it("TST-PRV-003b: the preview lists each item with its size and a total equal to the size of what is sent", async () => {
    const { kernel, one } = await project();
    for (const scope of [
      { kind: "passage" as const, unit: one.id, start: 23, end: 52 },
      { kind: "unit" as const, unit: one.id },
      { kind: "project" as const },
    ]) {
      const context = assembleContext(kernel, scope, { instructions: "Write in British English.", question: "Who counted?" });
      const preview = previewOf(context);
      expect(preview.items.map((i) => i.kind)[0]).toBe("instructions");
      expect(preview.items[preview.items.length - 1]?.kind).toBe("question");
      for (const item of preview.items) expect(item.characters).toBeGreaterThan(0);
      expect(preview.total).toBe(context.system.length + context.input.length);
      expect(preview.total).toBe(preview.items.reduce((n, i) => n + i.characters, 0));
      expect(context.system.startsWith(PREAMBLE)).toBe(true);
      expect(context.system).toContain("Write in British English.");
    }
    const passage = assembleContext(kernel, { kind: "passage", unit: one.id, start: 23, end: 52 });
    expect(passage.input).toContain("Mara counted the boats twice.");
    expect(passage.input).not.toContain("The harbour was quiet.");
    expect(passage.items.find((i) => i.kind === "passage")?.title).toBe("Chapter 1");
    const unit = assembleContext(kernel, { kind: "unit", unit: one.id });
    expect(unit.input).toContain("The harbour was quiet.");
    expect(unit.input).not.toContain("ZEBRA-ONLY-IN-TWO");
    const whole = assembleContext(kernel, { kind: "project" });
    expect(whole.input).toContain("ZEBRA-ONLY-IN-TWO");
    expect(whole.items.filter((i) => i.kind === "unit").length).toBe(2);
    expect(assembleContext(kernel, { kind: "unit", unit: one.id }).system).toBe(PREAMBLE);
  });

  it("a scope that names an absent unit, or a passage outside its text, is refused before anything is sent", async () => {
    const { kernel, one } = await project();
    expect(() => assembleContext(kernel, { kind: "unit", unit: "nope" })).toThrow(ContextError);
    try {
      assembleContext(kernel, { kind: "passage", unit: one.id, start: 10, end: 10_000 });
      expect.unreachable("an out-of-range passage must be refused");
    } catch (e) {
      expect((e as ContextError).code).toBe("invalid_range");
    }
    const empty = await Kernel.create(memoryAdapters(), "Empty");
    expect(() => assembleContext(empty, { kind: "project" })).toThrow(/no unit/);
  });
});
