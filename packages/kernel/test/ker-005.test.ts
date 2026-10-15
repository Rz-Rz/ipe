// SPEC-KER-005: Staleness.
import { describe, expect, it } from "vitest";
import { Random, distinctWords } from "./support/random.js";
import { freshProject, noteOn, withUnit } from "./support/project.js";

const TEXT = "The gate was locked at dusk. The watchman kept the key. Rain came after midnight.";

describe("SPEC-KER-005 Staleness", () => {
  it("TST-KER-005a: editing an anchored passage marks the object stale", async () => {
    const { kernel, unit } = await withUnit(TEXT);
    const o = await noteOn(kernel, unit.id, "The watchman kept the key.");
    expect(kernel.getObject(o.id).stale).toBe(false);
    await kernel.writeUnit(unit.id, TEXT.replace("kept the key", "lost the key"));
    expect(kernel.getObject(o.id).stale).toBe(true);
  });

  it("TST-KER-005b: staleness propagates to dependent objects, transitively", async () => {
    const { kernel, unit } = await withUnit(TEXT);
    const fact = await noteOn(kernel, unit.id, "The gate was locked at dusk.");
    const inference = await kernel.createObject({ kind: "inference", title: "nobody entered", origin: "assistant", action: "test", dependsOn: [fact.id] }, "assistant");
    const conclusion = await kernel.createObject({ kind: "inference", title: "the thief came by the river", origin: "assistant", action: "test", dependsOn: [inference.id] }, "assistant");
    await kernel.writeUnit(unit.id, TEXT.replace("locked at dusk", "open all night"));
    expect(kernel.getObject(fact.id).stale).toBe(true);
    expect(kernel.getObject(inference.id).stale).toBe(true);
    expect(kernel.getObject(conclusion.id).stale).toBe(true);
    expect(kernel.getObject(inference.id).anchors).toEqual([]);
  });

  it("TST-KER-005c: reverting to identical text returns the object, and its dependents, to current", async () => {
    const { kernel, unit } = await withUnit(TEXT);
    const fact = await noteOn(kernel, unit.id, "Rain came after midnight.");
    const dependent = await kernel.createObject({ kind: "inference", title: "wet roads", origin: "assistant", action: "test", dependsOn: [fact.id] }, "assistant");
    await kernel.writeUnit(unit.id, TEXT.replace("after midnight", "before dawn"));
    expect(kernel.getObject(fact.id).stale).toBe(true);
    await kernel.writeUnit(unit.id, TEXT);
    expect(kernel.getObject(fact.id).stale).toBe(false);
    expect(kernel.getObject(fact.id).anchors[0]?.state).toBe("intact");
    expect(kernel.getObject(dependent.id).stale).toBe(false);
  });

  it("TST-KER-005d: no sequence of operations makes a stale object current without identical content or an explicit re-evaluation", async () => {
    const rnd = new Random(5);
    for (let round = 0; round < 20; round++) {
      const { kernel } = await freshProject();
      const unit = await kernel.addUnit("Unit");
      const words = distinctWords(rnd, 10);
      await kernel.writeUnit(unit.id, words.join(" "));
      const ids: string[] = [];
      for (const w of words.slice(0, 4)) ids.push((await noteOn(kernel, unit.id, w)).id);
      const refreshed = new Set<string>();
      for (let step = 0; step < 10; step++) {
        const text = kernel.readUnit(unit.id);
        const op = rnd.int(0, 3);
        if (op === 0) {
          const w = rnd.pick(words.slice(0, 4));
          if (text.includes(w)) await kernel.writeUnit(unit.id, text.replace(w, `${w}Q`));
        } else if (op === 1) {
          await kernel.writeUnit(unit.id, words.join(" "));
        } else if (op === 2) {
          await kernel.writeUnit(unit.id, `${text} ${distinctWords(rnd, 1)[0] ?? "zz"}`);
        } else {
          const id = rnd.pick(ids);
          const o = kernel.getObject(id);
          if (o.stale && o.anchors.every((a) => a.state === "changed" || a.state === "intact")) {
            await kernel.refresh(id, "author");
            refreshed.add(id);
          }
        }
        for (const id of ids) {
          const o = kernel.getObject(id);
          if (o.stale) continue;
          const current = kernel.readUnit(unit.id);
          const restsOnIdenticalText = o.anchors.every((a) => a.state === "intact" && current.slice(a.start, a.end) === a.text);
          expect(restsOnIdenticalText || refreshed.has(id), `object ${id} is current at step ${step}`).toBe(true);
        }
      }
    }
  });
});
