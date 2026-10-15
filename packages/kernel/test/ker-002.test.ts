// SPEC-KER-002: Provenance record.
import { describe, expect, it } from "vitest";
import { Kernel, objectPath } from "../src/index.js";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-002 Provenance record", () => {
  it("TST-KER-002a: every stored object exposes origin, action, creation time, version, anchors and approval state", async () => {
    const { kernel, storage, unit } = await withUnit("One passage here, another passage there.");
    const byAuthor = await noteOn(kernel, unit.id, "One passage");
    const byAssistant = await noteOn(kernel, unit.id, "another passage", { origin: "assistant" });
    const byImport = await kernel.createObject({ kind: "fact", title: "imported", origin: "import", action: "import csv" }, "author");
    for (const o of [byAuthor, byAssistant, byImport]) {
      const stored = JSON.parse(storage.files.get(objectPath(o.id)) ?? "{}") as Record<string, unknown>;
      const p = stored["provenance"] as Record<string, unknown>;
      expect(typeof p["origin"]).toBe("string");
      expect(typeof p["action"]).toBe("string");
      expect(typeof p["createdAt"]).toBe("string");
      expect(typeof stored["version"]).toBe("string");
      expect(Array.isArray(stored["anchors"])).toBe(true);
      expect(["proposed", "accepted", "rejected"]).toContain(p["approval"]);
    }
    expect(byAuthor.provenance.approval).toBe("accepted");
    expect(byAuthor.provenance.approvedAt).not.toBeNull();
    expect(byAssistant.provenance.approval).toBe("proposed");
    expect(byAssistant.provenance.approvedAt).toBeNull();
    expect(byImport.provenance.approval).toBe("proposed");
    expect(byImport.anchors).toEqual([]);
    expect(byImport.version).toBe(kernel.currentVersion()?.id);
  });

  it("TST-KER-002b: a write without origin, or without approval state, is refused", async () => {
    const { kernel, storage, adapters, unit } = await withUnit("A passage.");
    await expect(
      kernel.createObject({ kind: "note", title: "x", origin: "nobody" as never, action: "test" }, "author"),
    ).rejects.toMatchObject({ code: "invalid_input" });
    await expect(kernel.createObject({ kind: "note", title: "x", origin: "author", action: "" }, "author")).rejects.toMatchObject({ code: "invalid_input" });

    const o = await noteOn(kernel, unit.id, "passage");
    const path = objectPath(o.id);
    const stored = JSON.parse(storage.files.get(path) ?? "{}") as { provenance: Record<string, unknown> };
    delete stored.provenance["approval"];
    storage.files.set(path, JSON.stringify(stored));
    await expect(Kernel.open(adapters)).rejects.toMatchObject({ code: "invalid_object" });
    await expect(Kernel.open(adapters)).rejects.toThrow(path);
  });
});
