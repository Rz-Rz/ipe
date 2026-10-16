// The catalogue: capabilities, billing and prices per model, with the source and the date they
// come from (SPEC-PRV-002). A cost is always an estimate from the catalogue, never a figure the
// product invents: a model the catalogue does not price yields "price not known", and a call whose
// provider reported no usage yields "not reported".

import type { Catalogue, CatalogueModel, PriceTier, Usage } from "./contract.js";

export type CostEstimate =
  | { kind: "estimate"; usd: number; catalogueDate: string; source: string[]; tier: PriceTier }
  | { kind: "price_not_known"; catalogueDate: string }
  | { kind: "not_reported" };

/** The catalogue entry of a model: by identifier first, then by the display name the provider lists. */
export function findModel(catalogue: Catalogue, modelId: string, displayName: string | null = null): CatalogueModel | null {
  const byId = catalogue.models.find((m) => m.id !== null && m.id === modelId);
  if (byId) return byId;
  if (displayName !== null) {
    const byName = catalogue.models.find((m) => m.displayName.toLowerCase() === displayName.toLowerCase());
    if (byName) return byName;
  }
  return null;
}

/** The price band of a call: the first tier whose bound the input does not exceed. */
export function tierFor(model: CatalogueModel, inputTokens: number): PriceTier | null {
  if (model.tiers === null || model.tiers.length === 0) return null;
  for (const tier of model.tiers) {
    if (tier.maxInputTokens === null || inputTokens <= tier.maxInputTokens) return tier;
  }
  return null;
}

export function estimateCost(catalogue: Catalogue, modelId: string, usage: Usage | null, displayName: string | null = null): CostEstimate {
  if (usage === null) return { kind: "not_reported" };
  const model = findModel(catalogue, modelId, displayName);
  const tier = model === null ? null : tierFor(model, usage.inputTokens);
  if (tier === null) return { kind: "price_not_known", catalogueDate: catalogue.consultedOn };
  const usd = (usage.inputTokens * tier.inputPerMillion + usage.outputTokens * tier.outputPerMillion) / 1_000_000;
  return { kind: "estimate", usd: Math.round(usd * 1_000_000) / 1_000_000, catalogueDate: catalogue.consultedOn, source: catalogue.source, tier };
}

/** The sentence the interface shows for an estimate, never a bare number. */
export function formatEstimate(estimate: CostEstimate): string {
  if (estimate.kind === "not_reported") return "usage not reported by the provider";
  if (estimate.kind === "price_not_known") return `price not known (catalogue of ${estimate.catalogueDate})`;
  // Two significant figures below a cent, so that a small call never reads as free.
  const amount = estimate.usd >= 0.01 ? estimate.usd.toFixed(4) : estimate.usd.toPrecision(2);
  return `about $${amount}, estimated from the catalogue of ${estimate.catalogueDate}`;
}

/** What the catalogue says a model supports, or null when the catalogue does not know it. */
export function capabilitiesOf(catalogue: Catalogue, modelId: string, displayName: string | null = null): Pick<CatalogueModel, "capabilities" | "billing" | "limits"> | null {
  const model = findModel(catalogue, modelId, displayName);
  return model === null ? null : { capabilities: model.capabilities, billing: model.billing, limits: model.limits };
}

/** The faults of a catalogue: a figure without a source or a date, a negative or empty price band. */
export function catalogueProblems(catalogue: Catalogue): string[] {
  const problems: string[] = [];
  if (catalogue.source.length === 0) problems.push("no source");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(catalogue.consultedOn)) problems.push("consultedOn is not an ISO date");
  if (catalogue.currency !== "USD") problems.push("currency is not USD");
  for (const m of catalogue.models) {
    if (m.id === null && m.displayName.trim() === "") problems.push("a model with neither identifier nor display name");
    if (m.tiers !== null) {
      if (m.tiers.length === 0) problems.push(`${m.displayName}: empty price bands`);
      for (const t of m.tiers) {
        if (!(t.inputPerMillion >= 0) || !(t.outputPerMillion >= 0)) problems.push(`${m.displayName}: a negative or missing price`);
      }
      const last = m.tiers[m.tiers.length - 1];
      if (last !== undefined && last.maxInputTokens !== null) problems.push(`${m.displayName}: the last price band has a bound, so large inputs have no price`);
    }
  }
  return problems;
}
