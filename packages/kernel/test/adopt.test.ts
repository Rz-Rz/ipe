// Groundwork for the adoption of a folder of Markdown files (SPEC-PRJ-001, limit case): a unit is
// registered from an existing file, which is read as it is and never rewritten.
import { describe, expect, it } from "vitest";
import { MANIFEST } from "../src/index.js";
import { freshProject } from "./support/project.js";

describe("Kernel.adoptUnit", () => {
  it("registers an existing file as a unit without writing it", async () => {
    const { kernel, storage } = await freshProject();
    storage.files.set("draft.md", "# Draft\n\nAs found on disk.\n");
    const writesBefore = storage.writes.length;
    const node = await kernel.adoptUnit("Draft", "draft.md");
    expect(node.path).toBe("draft.md");
    expect(kernel.readUnit(node.id)).toBe("# Draft\n\nAs found on disk.\n");
    expect(storage.writes.slice(writesBefore).map((w) => w.path)).not.toContain("draft.md");
    expect(storage.files.get(MANIFEST)).toContain('"draft.md"');
    expect(kernel.currentVersion()?.action).toBe("adopt-unit");
    expect(await kernel.readVersion(node.id, kernel.currentVersion()?.id ?? "")).toBe("# Draft\n\nAs found on disk.\n");
  });

  it("refuses a missing file and a file already registered", async () => {
    const { kernel, storage } = await freshProject();
    await expect(kernel.adoptUnit("Ghost", "ghost.md")).rejects.toMatchObject({ code: "unknown_unit" });
    storage.files.set("twice.md", "once\n");
    await kernel.adoptUnit("Twice", "twice.md");
    await expect(kernel.adoptUnit("Twice again", "twice.md")).rejects.toMatchObject({ code: "invalid_input" });
  });
});
