// SPEC-KER-009: External edits are never discarded.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { createProject, openProject } from "../src/index.js";
import { tmpFolder } from "./support/tmp.js";

const TEXT = "The harbour was quiet. Mara counted the boats twice. Nobody answered the bell.";

async function projectWithNote(name: string) {
  const root = await tmpFolder(name);
  const kernel = await createProject(root, "External");
  const unit = await kernel.addUnit("Chapter 1");
  await kernel.writeUnit(unit.id, TEXT);
  const note = await kernel.createObject({ kind: "note", title: "boats", origin: "author", action: "note", anchors: [{ unit: unit.id, start: 23, end: 52 }] }, "author");
  return { root, kernel, unit, note, file: path.join(root, unit.path) };
}

describe("SPEC-KER-009 External edits are never discarded", () => {
  it("TST-KER-009a: an external edit is detected at the next opening, kept, and reported with its affected anchors", async () => {
    const { root, unit, note, file } = await projectWithNote("external");
    await fs.writeFile(file, "A prologue. The harbour was quiet. Nobody answered the bell.", "utf8");
    const reopened = await openProject(root);
    expect(reopened.openReport.externalChanges).toEqual([unit.id]);
    expect(reopened.readUnit(unit.id)).toBe("A prologue. The harbour was quiet. Nobody answered the bell.");
    expect(await fs.readFile(file, "utf8")).toBe("A prologue. The harbour was quiet. Nobody answered the bell.");
    expect(reopened.openReport.anchorChanges).toEqual([{ objectId: note.id, index: 0, from: "intact", to: "orphaned" }]);
    expect(reopened.getObject(note.id).anchors[0]?.state).toBe("orphaned");
    const again = await openProject(root);
    expect(again.openReport.externalChanges).toEqual([]);
  });

  it("TST-KER-009b: a conflict on an open unit presents both texts and overwrites nothing without the author's choice", async () => {
    const { kernel, unit, file } = await projectWithNote("conflict");
    await fs.writeFile(file, "Edited outside while open.", "utf8");
    await expect(kernel.writeUnit(unit.id, "Edited inside.")).rejects.toMatchObject({ code: "conflict" });
    expect(await kernel.externalText(unit.id)).toBe("Edited outside while open.");
    expect(kernel.readUnit(unit.id)).toBe(TEXT);
    expect(await fs.readFile(file, "utf8")).toBe("Edited outside while open.");
    const result = await kernel.writeUnit(unit.id, "Edited inside.", { force: true });
    expect(result.version).not.toBeNull();
    expect(await fs.readFile(file, "utf8")).toBe("Edited inside.");
    expect(await kernel.externalText(unit.id)).toBeNull();
  });

  it("TST-KER-009c: with timestamps frozen, the external edit is still detected by content", async () => {
    const { root, unit, file } = await projectWithNote("timestamps");
    const before = await fs.stat(file);
    await fs.writeFile(file, "Same length text here, changed content, same stamp!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "utf8");
    await fs.utimes(file, before.atime, before.mtime);
    const after = await fs.stat(file);
    expect(Math.abs(after.mtimeMs - before.mtimeMs)).toBeLessThan(2);
    const reopened = await openProject(root);
    expect(reopened.openReport.externalChanges).toEqual([unit.id]);
  });
});
