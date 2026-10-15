// SPEC-KER-006: Proposals and acceptance.
import { describe, expect, it } from "vitest";
import { noteOn, withUnit } from "./support/project.js";

describe("SPEC-KER-006 Proposals and acceptance", () => {
  it("TST-KER-006a: objects of origin assistant or import are stored as proposals; the author's are accepted", async () => {
    const { kernel, unit } = await withUnit("A sentence with a claim in it.");
    const assistant = await noteOn(kernel, unit.id, "a claim", { origin: "assistant" });
    const imported = await kernel.createObject({ kind: "fact", title: "from a file", origin: "import", action: "import" }, "author");
    const author = await noteOn(kernel, unit.id, "A sentence");
    expect(assistant.provenance.approval).toBe("proposed");
    expect(imported.provenance.approval).toBe("proposed");
    expect(author.provenance.approval).toBe("accepted");
    const accepted = await kernel.accept(assistant.id, "author");
    expect(accepted.provenance.approval).toBe("accepted");
    expect(accepted.provenance.approvedBy).toBe("author");
    expect(accepted.provenance.approvedAt).not.toBeNull();
    const rejected = await kernel.reject(imported.id, "author");
    expect(rejected.provenance.approval).toBe("rejected");
    expect(kernel.journalEvents().map((e) => e.kind)).toEqual(["create", "create", "create", "accept", "reject"]);
  });

  it("TST-KER-006b: an acceptance by a non-author actor is refused and recorded", async () => {
    const { kernel, unit } = await withUnit("A sentence with a claim in it.");
    const proposal = await noteOn(kernel, unit.id, "a claim", { origin: "assistant" });
    await expect(kernel.accept(proposal.id, "assistant")).rejects.toMatchObject({ code: "not_author" });
    await expect(kernel.reject(proposal.id, "import-script")).rejects.toMatchObject({ code: "not_author" });
    expect(kernel.getObject(proposal.id).provenance.approval).toBe("proposed");
    const refused = kernel.journalEvents().filter((e) => e.kind === "refused");
    expect(refused.map((e) => e.actor)).toEqual(["assistant", "import-script"]);
    expect(refused[0]?.objectId).toBe(proposal.id);
  });
});
