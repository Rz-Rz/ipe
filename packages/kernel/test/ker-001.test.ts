// SPEC-KER-001: Stable object identity.
import { describe, expect, it } from "vitest";
import { Kernel, OBJECTS_DIR, objectPath } from "../src/index.js";
import { Random, distinctWords } from "./support/random.js";
import { freshProject, noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-001 Stable object identity", () => {
  it("TST-KER-001a: after edit, move, and rename, each object keeps its identifier", async () => {
    const { kernel, unit } = await withUnit("Alpha beta gamma. Delta epsilon.");
    const o = await noteOn(kernel, unit.id, "beta gamma");
    await kernel.writeUnit(unit.id, "Prefix. Alpha beta gamma. Delta epsilon. Suffix.");
    const second = await kernel.addUnit("Chapter 2");
    await kernel.moveUnit(unit.id, second.id, 0);
    await kernel.renameUnit(unit.id, "Renamed");
    await kernel.relocateUnit(unit.id, "folder/renamed.md");
    expect(kernel.getObject(o.id).id).toBe(o.id);
    expect(kernel.listObjects().map((x) => x.id)).toEqual([o.id]);
    expect(kernel.getObject(o.id).anchors[0]?.unit).toBe(unit.id);
    expect(kernel.getObject(o.id).anchors[0]?.state).toBe("intact");
    expect(kernel.units()[0]?.children[0]?.path).toBe("folder/renamed.md");
  });

  it("TST-KER-001b: a store with two objects sharing an identifier is refused, with both files named", async () => {
    const { kernel, storage, adapters, unit } = await withUnit("Some text to anchor on.");
    const o = await noteOn(kernel, unit.id, "text to anchor");
    const original = objectPath(o.id);
    const copy = `${OBJECTS_DIR}/zz-copy.json`;
    storage.files.set(copy, storage.files.get(original) ?? "");
    await expect(Kernel.open(adapters)).rejects.toMatchObject({ code: "duplicate_id" });
    await expect(Kernel.open(adapters)).rejects.toThrow(original);
    await expect(Kernel.open(adapters)).rejects.toThrow(copy);
  });

  it("TST-KER-001c: for random sequences of edits, moves, renames and relocations, no identifier changes", async () => {
    const rnd = new Random(11);
    for (let round = 0; round < 12; round++) {
      const { kernel } = await freshProject();
      const units = [];
      for (let u = 0; u < 3; u++) {
        const node = await kernel.addUnit(`Unit ${u}`);
        await kernel.writeUnit(node.id, distinctWords(rnd, 8).join(" "));
        units.push(node);
      }
      const ids = new Set<string>();
      for (let n = 0; n < 5; n++) {
        const unit = rnd.pick(units);
        const words = kernel.readUnit(unit.id).split(" ");
        const o = await noteOn(kernel, unit.id, rnd.pick(words));
        ids.add(o.id);
      }
      for (let step = 0; step < 15; step++) {
        const unit = rnd.pick(units);
        switch (rnd.int(0, 3)) {
          case 0: {
            const text = kernel.readUnit(unit.id);
            const at = rnd.int(0, text.length);
            await kernel.writeUnit(unit.id, `${text.slice(0, at)} ${rnd.word()} ${text.slice(at)}`);
            break;
          }
          case 1: {
            const other = rnd.pick(units);
            if (other.id !== unit.id) {
              try {
                await kernel.moveUnit(unit.id, rnd.next() < 0.5 ? other.id : null, rnd.int(0, 2));
              } catch {
                // moving under its own descendant is refused: that refusal is correct, not a failure
              }
            }
            break;
          }
          case 2:
            await kernel.renameUnit(unit.id, rnd.word());
            break;
          default:
            await kernel.relocateUnit(unit.id, `${rnd.word()}/${rnd.word()}.md`);
        }
        const now = new Set(kernel.listObjects().map((o) => o.id));
        expect(now).toEqual(ids);
        for (const o of kernel.listObjects()) for (const a of o.anchors) expect(units.map((u) => u.id)).toContain(a.unit);
      }
    }
  });
});
