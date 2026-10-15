// SPEC-KER-011: Incremental invalidation.
import { describe, expect, it } from "vitest";
import { objectPath } from "../src/index.js";
import { Random, distinctWords } from "./support/random.js";
import { freshProject, noteOn, objectFiles } from "./support/project.js";

describe("SPEC-KER-011 Incremental invalidation", () => {
  it("TST-KER-011a: the invalidated set equals the affected objects; unaffected objects are byte-identical before and after", async () => {
    const { kernel, storage } = await freshProject();
    const u1 = await kernel.addUnit("Unit 1");
    const u2 = await kernel.addUnit("Unit 2");
    await kernel.writeUnit(u1.id, "The first passage. The second passage, much later in the unit.");
    await kernel.writeUnit(u2.id, "A passage in the other unit.");
    const o1 = await noteOn(kernel, u1.id, "The second passage");
    const o2 = await noteOn(kernel, u2.id, "the other unit");
    const o3 = await kernel.createObject({ kind: "inference", title: "depends on o1", origin: "assistant", action: "test", dependsOn: [o1.id] }, "assistant");
    const o4 = await noteOn(kernel, u1.id, "The first passage");
    const before = objectFiles(storage);

    const result = await kernel.writeUnit(u1.id, "The first passage. The second paragraph, much later in the unit.");
    expect(result.invalidated.sort()).toEqual([o1.id, o3.id].sort());
    // o2 rests on another unit: the edit never touched it, its file is byte-identical. o4 rests on
    // the edited unit, intact: not invalidated, not stale, though its context window may be refreshed.
    expect(storage.files.get(objectPath(o2.id))).toBe(before.get(objectPath(o2.id)));
    expect(kernel.getObject(o4.id).anchors[0]?.state).toBe("intact");
    expect(kernel.getObject(o4.id).stale).toBe(false);
    expect(kernel.getObject(o2.id).stale).toBe(false);
  });

  it("TST-KER-011b: for random edits, the invalidated set equals the set a brute-force reference computes from what the edit touched", async () => {
    const rnd = new Random(23);
    for (let round = 0; round < 25; round++) {
      const { kernel } = await freshProject();
      const unitA = await kernel.addUnit("A");
      const unitB = await kernel.addUnit("B");
      const wordsA = distinctWords(rnd, 10);
      const wordsB = distinctWords(rnd, 10).filter((w) => !wordsA.some((x) => x.includes(w) || w.includes(x)));
      await kernel.writeUnit(unitA.id, wordsA.join(" "));
      await kernel.writeUnit(unitB.id, wordsB.join(" "));
      // Anchored objects, then a random acyclic dependency graph on top of them.
      const anchoredWord = new Map<string, { unit: string; word: string }>();
      const ids: string[] = [];
      for (const w of wordsA.slice(0, 3)) {
        const o = await noteOn(kernel, unitA.id, w);
        ids.push(o.id);
        anchoredWord.set(o.id, { unit: unitA.id, word: w });
      }
      for (const w of wordsB.slice(0, 2)) {
        const o = await noteOn(kernel, unitB.id, w);
        ids.push(o.id);
        anchoredWord.set(o.id, { unit: unitB.id, word: w });
      }
      const dependsOn = new Map<string, string[]>();
      for (let n = 0; n < 4; n++) {
        const count = rnd.int(1, 2);
        const deps = new Set<string>();
        for (let i = 0; i < count; i++) deps.add(rnd.pick(ids));
        const o = await kernel.createObject({ kind: "inference", title: `d${n}`, origin: "assistant", action: "test", dependsOn: [...deps] }, "assistant");
        ids.push(o.id);
        dependsOn.set(o.id, [...deps]);
      }
      const dependentsOf = (seed: Set<string>): Set<string> => {
        const out = new Set(seed);
        let grew = true;
        while (grew) {
          grew = false;
          for (const [id, deps] of dependsOn) {
            if (!out.has(id) && deps.some((d) => out.has(d))) {
              out.add(id);
              grew = true;
            }
          }
        }
        return out;
      };
      const touched = new Set<string>();
      for (let step = 0; step < 6; step++) {
        const candidates = ids.filter((id) => anchoredWord.has(id) && !touched.has(id));
        const op = rnd.int(0, 2);
        let expected: string[] = [];
        if (op === 0 || candidates.length === 0) {
          const unit = rnd.pick([unitA.id, unitB.id]);
          const result = await kernel.writeUnit(unit, `${kernel.readUnit(unit)} ${distinctWords(rnd, 1)[0] ?? "zz"}`);
          expect(result.invalidated).toEqual([]);
          continue;
        }
        const id = rnd.pick(candidates);
        const target = anchoredWord.get(id);
        if (target === undefined) continue;
        const text = kernel.readUnit(target.unit);
        const edited = op === 1 ? text.replace(target.word, `${target.word.slice(0, 2)}Z${target.word.slice(3)}`) : text.replace(target.word, "").replace(/ {2,}/g, " ").trim();
        const result = await kernel.writeUnit(target.unit, edited);
        touched.add(id);
        expected = [...dependentsOf(new Set([id]))].sort();
        expect(result.invalidated.sort(), `round ${round} step ${step}`).toEqual(expected);
      }
    }
  });
});
