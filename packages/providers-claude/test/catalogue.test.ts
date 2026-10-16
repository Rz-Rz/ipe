// SPEC-PRV-002 at the Claude catalogue: every figure carries its source and its date; the
// capability table and the prices come from it; a model it does not know yields "price not known".
import { describe, expect, it } from "vitest";
import { capabilitiesOf, catalogueProblems, estimateCost, formatEstimate } from "@ipe/providers";
import { CLAUDE_CATALOGUE } from "../src/index.js";

describe("SPEC-PRV-002 Capability and cost disclosure", () => {
  it("TST-PRV-002a: the capability table and the prices come from the catalogue, with the source and the date it states; an unknown model yields price not known", () => {
    expect(catalogueProblems(CLAUDE_CATALOGUE)).toEqual([]);
    expect(CLAUDE_CATALOGUE.source.every((s) => s.startsWith("https://platform.claude.com/docs/"))).toBe(true);
    expect(CLAUDE_CATALOGUE.consultedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const model of CLAUDE_CATALOGUE.models) {
      expect(model.capabilities).toEqual(["text"]);
      expect(model.billing).toBe("separate_balance");
      expect(model.tiers?.length).toBeGreaterThan(0);
    }
    const sonnet = estimateCost(CLAUDE_CATALOGUE, "claude-sonnet-5-5", { inputTokens: 1_000_000, outputTokens: 1_000_000 });
    expect(sonnet).toMatchObject({ kind: "estimate", usd: 12, catalogueDate: CLAUDE_CATALOGUE.consultedOn });
    expect(formatEstimate(sonnet)).toContain(`estimated from the catalogue of ${CLAUDE_CATALOGUE.consultedOn}`);
    const haikuSmall = estimateCost(CLAUDE_CATALOGUE, "claude-haiku-5-5", { inputTokens: 100_000, outputTokens: 1_000 });
    const haikuLarge = estimateCost(CLAUDE_CATALOGUE, "claude-haiku-5-5", { inputTokens: 100_001, outputTokens: 1_000 });
    expect(haikuSmall).toMatchObject({ kind: "estimate", usd: 0.0105 });
    expect(haikuLarge.kind).toBe("estimate");
    expect(haikuLarge.kind === "estimate" ? haikuLarge.usd : 0).toBeCloseTo(0.0525005, 5);
    expect(estimateCost(CLAUDE_CATALOGUE, "claude-opus-4-6-20260101", { inputTokens: 10, outputTokens: 10 }, "Claude Opus 4.6").kind).toBe("estimate");
    expect(estimateCost(CLAUDE_CATALOGUE, "claude-model-of-the-future", { inputTokens: 10, outputTokens: 10 })).toEqual({ kind: "price_not_known", catalogueDate: CLAUDE_CATALOGUE.consultedOn });
    expect(capabilitiesOf(CLAUDE_CATALOGUE, "claude-opus-5-5")).toEqual({ capabilities: ["text"], billing: "separate_balance", limits: null });
    expect(capabilitiesOf(CLAUDE_CATALOGUE, "unknown")).toBeNull();
  });
});
