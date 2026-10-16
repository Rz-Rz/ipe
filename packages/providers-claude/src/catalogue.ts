// The Claude provider's catalogue: models, capabilities, billing and base prices, every figure
// from the provider's pages consulted on the date below. Prices are US dollars per million tokens,
// base rates (no batch discount, no cache rates). A model the pages name without an identifier is
// listed by display name only; the live model list supplies identifiers, and a model absent here
// is shown with "price not known". Capabilities: these models take text (and images) in and give
// text out; the product offers neither transcription nor image generation through them.

import type { Catalogue } from "@ipe/providers";

export const CLAUDE_CATALOGUE: Catalogue = {
  provider: "claude",
  source: [
    "https://platform.claude.com/docs/en/about-claude/pricing",
    "https://platform.claude.com/docs/en/about-claude/models/overview",
  ],
  consultedOn: "2026-10-16",
  currency: "USD",
  models: [
    { id: "claude-fable-5-1", displayName: "Claude Fable 5.1", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 10, outputPerMillion: 50 }], limits: null, contextWindowTokens: 1_000_000, maxOutputTokens: 128_000 },
    { id: "claude-opus-5-5", displayName: "Claude Opus 5.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 4, outputPerMillion: 20 }], limits: null, contextWindowTokens: 1_000_000, maxOutputTokens: 128_000 },
    { id: "claude-sonnet-5-5", displayName: "Claude Sonnet 5.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 2, outputPerMillion: 10 }], limits: null, contextWindowTokens: 1_000_000, maxOutputTokens: 128_000 },
    { id: "claude-haiku-5-5", displayName: "Claude Haiku 5.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: 100_000, inputPerMillion: 0.1, outputPerMillion: 0.5 }, { maxInputTokens: null, inputPerMillion: 0.5, outputPerMillion: 2.5 }], limits: "the lower band applies to prompts up to 100,000 tokens, the higher band above", contextWindowTokens: 1_000_000, maxOutputTokens: 128_000 },
    { id: "claude-sonnet-5", displayName: "Claude Sonnet 5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 2, outputPerMillion: 10 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: "claude-opus-5", displayName: "Claude Opus 5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 5, outputPerMillion: 25 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Fable 5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 10, outputPerMillion: 50 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Opus 4.8", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 5, outputPerMillion: 25 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Opus 4.7", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 5, outputPerMillion: 25 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Opus 4.6", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 5, outputPerMillion: 25 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Opus 4.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 5, outputPerMillion: 25 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Sonnet 4.6", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 3, outputPerMillion: 15 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Sonnet 4.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 3, outputPerMillion: 15 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
    { id: null, displayName: "Claude Haiku 4.5", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 1, outputPerMillion: 5 }], limits: null, contextWindowTokens: null, maxOutputTokens: null },
  ],
};
