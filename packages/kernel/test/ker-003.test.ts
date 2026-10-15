// SPEC-KER-003: Anchors survive edits.
import { describe, expect, it } from "vitest";
import { Kernel } from "../src/index.js";
import { Random, distinctWords } from "./support/random.js";
import { freshProject, noteOn, withUnit } from "./support/project.js";

const BASE = "The harbour was quiet. Mara counted the boats twice. Nobody answered the bell.";

describe("SPEC-KER-003 Anchors survive edits", () => {
  it("TST-KER-003a: edits around the passage leave the anchor intact, at its new position", async () => {
    const { kernel, unit } = await withUnit(BASE);
    const o = await noteOn(kernel, unit.id, "counted the boats twice");
    await kernel.writeUnit(unit.id, `A new first sentence. ${BASE} And a last one.`);
    const a = kernel.getObject(o.id).anchors[0];
    expect(a?.state).toBe("intact");
    expect(kernel.readUnit(unit.id).slice(a?.start, a?.end)).toBe("counted the boats twice");
    expect(a?.text).toBe("counted the boats twice");
  });

  it("TST-KER-003b: an edit inside the passage yields state changed, and the text the object rests on is kept", async () => {
    const { kernel, unit } = await withUnit(BASE);
    const o = await noteOn(kernel, unit.id, "counted the boats twice");
    await kernel.writeUnit(unit.id, BASE.replace("counted the boats twice", "counted the small boats three times"));
    const a = kernel.getObject(o.id).anchors[0];
    expect(a?.state).toBe("changed");
    expect(a?.text).toBe("counted the boats twice");
    expect(kernel.readUnit(unit.id).slice(a?.start, a?.end)).toBe("counted the small boats three times");
  });

  it("TST-KER-003c: a whole passage moved to another unit is re-anchored there", async () => {
    const { kernel, unit } = await withUnit(BASE);
    const second = await kernel.addUnit("Chapter 2");
    await kernel.writeUnit(second.id, "Elsewhere, the night went on.");
    const o = await noteOn(kernel, unit.id, "Mara counted the boats twice.");
    await kernel.writeUnit(unit.id, BASE.replace(" Mara counted the boats twice.", ""));
    expect(kernel.getObject(o.id).anchors[0]?.state).toBe("orphaned");
    await kernel.writeUnit(second.id, "Elsewhere, the night went on. Mara counted the boats twice.");
    const a = kernel.getObject(o.id).anchors[0];
    expect(a?.state).toBe("intact");
    expect(a?.unit).toBe(second.id);
    expect(kernel.readUnit(second.id).slice(a?.start, a?.end)).toBe("Mara counted the boats twice.");
  });

  it("TST-KER-003d: a deleted passage yields state orphaned; the object remains and says so", async () => {
    const { kernel, unit } = await withUnit(BASE);
    const o = await noteOn(kernel, unit.id, "Nobody answered the bell.");
    await kernel.writeUnit(unit.id, "The harbour was quiet. Mara counted the boats twice.");
    const object = kernel.getObject(o.id);
    expect(object.anchors[0]?.state).toBe("orphaned");
    expect(object.deleted).toBe(false);
    expect(kernel.explain(o.id).anchors[0]?.passage).toBeNull();
    expect(kernel.listObjects().map((x) => x.id)).toContain(o.id);
  });

  it("TST-KER-003e: an edit made outside the product yields re-anchoring or orphaned, never a lost object", async () => {
    const { kernel, storage, adapters, unit } = await withUnit(BASE);
    const moved = await noteOn(kernel, unit.id, "counted the boats twice");
    const gone = await noteOn(kernel, unit.id, "Nobody answered the bell.");
    storage.files.set(unit.path, "Prologue. The harbour was quiet. Mara counted the boats twice.");
    const reopened = await Kernel.open(adapters);
    expect(reopened.openReport.externalChanges).toEqual([unit.id]);
    expect(reopened.getObject(moved.id).anchors[0]?.state).toBe("intact");
    expect(reopened.readUnit(unit.id).slice(reopened.getObject(moved.id).anchors[0]?.start, reopened.getObject(moved.id).anchors[0]?.end)).toBe("counted the boats twice");
    expect(reopened.getObject(gone.id).anchors[0]?.state).toBe("orphaned");
    expect(reopened.listObjects().map((x) => x.id).sort()).toEqual([moved.id, gone.id].sort());
    expect(reopened.openReport.anchorChanges.map((c) => c.objectId)).toContain(gone.id);
  });

  it("TST-KER-003g: a passage that now occurs twice, told apart by nothing, is ambiguous with its candidates, and resolves when one copy goes", async () => {
    const { kernel, unit } = await withUnit("alpha beta gamma delta");
    const o = await noteOn(kernel, unit.id, "beta");
    const result = await kernel.writeUnit(unit.id, "zeta beta beta delta");
    const a = kernel.getObject(o.id).anchors[0];
    expect(a?.state).toBe("ambiguous");
    expect(a?.candidates).toEqual([
      { unit: unit.id, start: 5, end: 9 },
      { unit: unit.id, start: 10, end: 14 },
    ]);
    expect(a?.current).toBeNull();
    expect(result.invalidated).toEqual([o.id]);
    expect(result.anchorChanges).toEqual([{ objectId: o.id, index: 0, from: "intact", to: "ambiguous" }]);
    expect(kernel.getObject(o.id).stale).toBe(true);
    expect(kernel.counts().ambiguous).toBe(1);
    expect(kernel.counts().anchorsByState.ambiguous).toBe(1);
    expect(kernel.explain(o.id).anchors[0]?.passage).toBeNull();
    await kernel.writeUnit(unit.id, "zeta beta delta");
    const back = kernel.getObject(o.id).anchors[0];
    expect(back?.state).toBe("intact");
    expect(back?.start).toBe(5);
    expect(kernel.getObject(o.id).stale).toBe(false);
  });

  it("TST-KER-003h: a passage deleted together with its neighbours stays orphaned, even when parts of its windows recur elsewhere", async () => {
    const first = "The town slept under a thin rain, and the lamps along the quay guttered one by one.";
    const passage = "Mara counted the boats twice before she trusted the number.";
    const last = "The bell rang once more at the end of the watch, and nobody answered it.";
    const { kernel, unit } = await withUnit(`${first} ${passage} ${last}`);
    const o = await noteOn(kernel, unit.id, passage);
    // The passage goes, both neighbours are rewritten, and parts of both windows (26 and 24
    // characters, exact) recur far away with new text between them: a match there would be invented.
    const rewritten = "Nothing of the quay remained in the morning light; the rain had stopped before dawn and the clerk filed the inventory without reading a line of it. "
      + "The harbour master signed the ledger twice. Hours later, far from the water, someone remembered how the quay guttered one by one. Then silence. The bell rang once more, and then nothing.";
    await kernel.writeUnit(unit.id, rewritten);
    const a = kernel.getObject(o.id).anchors[0];
    expect(rewritten.indexOf("quay guttered one by one. ") - (a?.start ?? 0)).toBeGreaterThan(150);
    expect(a?.state).toBe("orphaned");
    expect(a?.current).toBeNull();
    expect(kernel.explain(o.id).anchors[0]?.passage).toBeNull();
  });

  it("TST-KER-003f: for random edit scripts, every anchor is in the one state its edit history commands", async () => {
    const rnd = new Random(3);
    for (let round = 0; round < 25; round++) {
      const { kernel } = await freshProject();
      const unit = await kernel.addUnit("Unit");
      const words = distinctWords(rnd, 14);
      await kernel.writeUnit(unit.id, words.join(" "));
      const anchored = words.slice(0, 5);
      const expected = new Map<string, "intact" | "changed" | "orphaned">();
      const objects = new Map<string, string>();
      for (const w of anchored) {
        const o = await noteOn(kernel, unit.id, w);
        objects.set(w, o.id);
        expected.set(w, "intact");
      }
      const untouched = () => anchored.filter((w) => expected.get(w) === "intact");
      for (let step = 0; step < 8; step++) {
        const text = kernel.readUnit(unit.id);
        const op = rnd.int(0, 2);
        if (op === 0 || untouched().length === 0) {
          const extra = distinctWords(rnd, 1)[0] ?? "zz";
          await kernel.writeUnit(unit.id, rnd.next() < 0.5 ? `${extra} ${text}` : `${text} ${extra}`);
        } else if (op === 1) {
          const w = rnd.pick(untouched());
          const half = Math.floor(w.length / 2);
          await kernel.writeUnit(unit.id, text.replace(w, `${w.slice(0, half)}X${w.slice(half + 1)}`));
          expected.set(w, "changed");
        } else {
          const w = rnd.pick(untouched());
          await kernel.writeUnit(unit.id, text.replace(w, "").replace(/ {2,}/g, " ").trim());
          expected.set(w, "orphaned");
        }
        for (const w of anchored) {
          const a = kernel.getObject(objects.get(w) ?? "").anchors[0];
          expect(["intact", "changed", "ambiguous", "orphaned"]).toContain(a?.state);
          expect(a?.state, `word ${w} after step ${step}`).toBe(expected.get(w));
        }
      }
    }
  });
});
