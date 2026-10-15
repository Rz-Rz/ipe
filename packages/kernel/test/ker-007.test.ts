// SPEC-KER-007: Reversible object actions.
import { describe, expect, it } from "vitest";
import { JOURNAL, Kernel, MemoryStorage, SequenceIds, SteppingClock, objectPath } from "../src/index.js";

/** A storage whose journal cannot be written: the history is unavailable. */
class JournalUnwritable extends MemoryStorage {
  override async append(path: string, text: string): Promise<void> {
    if (path === JOURNAL) throw new Error("the journal cannot be written");
    return super.append(path, text);
  }
  override async write(path: string, text: string): Promise<void> {
    if (path === JOURNAL) throw new Error("the journal cannot be written");
    return super.write(path, text);
  }
}
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

  it("TST-KER-007c: a deletion, an acceptance or an edit while the history cannot be written is refused, and the object is untouched", async () => {
    const { kernel, storage, unit } = await withUnit("A passage and another passage.");
    const o = await noteOn(kernel, unit.id, "A passage", { origin: "assistant" });
    const unwritable = new JournalUnwritable();
    for (const [path, text] of storage.files) unwritable.files.set(path, text);
    const crippled = await Kernel.open({ storage: unwritable, clock: new SteppingClock(), ids: new SequenceIds("x") });
    const fileBefore = unwritable.files.get(objectPath(o.id));
    const eventsBefore = crippled.journalEvents().length;
    await expect(crippled.deleteObject(o.id, "author")).rejects.toThrow("the journal cannot be written");
    await expect(crippled.accept(o.id, "author")).rejects.toThrow("the journal cannot be written");
    await expect(crippled.editObject(o.id, { title: "renamed" }, "author")).rejects.toThrow("the journal cannot be written");
    expect(crippled.listObjects().map((x) => x.id)).toContain(o.id);
    expect(crippled.getObject(o.id).deleted).toBe(false);
    expect(crippled.getObject(o.id).title).toBe(o.title);
    expect(crippled.getObject(o.id).provenance.approval).toBe("proposed");
    expect(unwritable.files.get(objectPath(o.id))).toBe(fileBefore);
    expect(crippled.journalEvents().length).toBe(eventsBefore);
    const plain = new MemoryStorage();
    for (const [path, text] of unwritable.files) plain.files.set(path, text);
    const reopened = await Kernel.open({ storage: plain, clock: new SteppingClock(), ids: new SequenceIds("y") });
    expect(reopened.getObject(o.id).deleted).toBe(false);
    expect(reopened.journalEvents().filter((e) => e.kind === "delete")).toEqual([]);
  });
});
