// SPEC-KER-007: Reversible object actions.
import { describe, expect, it } from "vitest";
import { Kernel } from "../src/index.js";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-007 Reversible object actions", () => {
  it("TST-KER-007a: each of the four actions is undone to the exact previous state", async () => {
    const { kernel, unit } = await withUnit("A passage and another passage.");
    const o = await noteOn(kernel, unit.id, "A passage", { origin: "assistant" });

    const beforeEdit = kernel.getObject(o.id);
    await kernel.editObject(o.id, { title: "edited", body: { changed: true } }, "author");
    const editEvent = kernel.journalEvents().find((e) => e.kind === "edit");
    await kernel.undo(editEvent?.id ?? "", "author");
    expect(kernel.getObject(o.id)).toEqual(beforeEdit);

    const beforeAccept = kernel.getObject(o.id);
    await kernel.accept(o.id, "author");
    const acceptEvent = kernel.journalEvents().find((e) => e.kind === "accept");
    await kernel.undo(acceptEvent?.id ?? "", "author");
    expect(kernel.getObject(o.id)).toEqual(beforeAccept);

    const beforeReject = kernel.getObject(o.id);
    await kernel.reject(o.id, "author");
    const rejectEvent = kernel.journalEvents().find((e) => e.kind === "reject");
    await kernel.undo(rejectEvent?.id ?? "", "author");
    expect(kernel.getObject(o.id)).toEqual(beforeReject);

    const beforeDelete = kernel.getObject(o.id);
    await kernel.deleteObject(o.id, "author");
    expect(kernel.listObjects().map((x) => x.id)).not.toContain(o.id);
    const deleteEvent = kernel.journalEvents().find((e) => e.kind === "delete");
    await kernel.undo(deleteEvent?.id ?? "", "author");
    expect(kernel.getObject(o.id)).toEqual(beforeDelete);
    expect(kernel.listObjects().map((x) => x.id)).toContain(o.id);
  });

  it("TST-KER-007b: after close and reopen, the previous state is still recoverable", async () => {
    const { kernel, adapters, unit } = await withUnit("A passage and another passage.");
    const o = await noteOn(kernel, unit.id, "another passage");
    const before = kernel.getObject(o.id);
    await kernel.deleteObject(o.id, "author");
    const deleteEvent = kernel.journalEvents().find((e) => e.kind === "delete");

    const reopened = await Kernel.open(adapters);
    expect(reopened.listObjects().map((x) => x.id)).not.toContain(o.id);
    const restored = await reopened.undo(deleteEvent?.id ?? "", "author");
    expect(restored.deleted).toBe(false);
    expect(reopened.getObject(o.id)).toEqual(before);
    expect(reopened.listObjects().map((x) => x.id)).toContain(o.id);
  });
});
