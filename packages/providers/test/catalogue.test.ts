// SPEC-PRV-002 at the catalogue: an estimate comes from a price band of a dated catalogue, or it
// is no figure at all. SPEC-PRV-006 at the mapping: each status and each thrown error is a state.
import { describe, expect, it } from "vitest";
import { FAKE_CATALOGUE, ProviderError, catalogueProblems, estimateCost, failureFromStatus, failureFromThrown, formatEstimate, stateForStatus } from "../src/index.js";

describe("the catalogue and the estimate", () => {
  it("prices from the band the input falls in, dated and sourced; unknown or unpriced models give no figure", () => {
    const small = estimateCost(FAKE_CATALOGUE, "fake-tiered", { inputTokens: 1_000, outputTokens: 500 });
    expect(small).toMatchObject({ kind: "estimate", usd: 0.002, catalogueDate: "2026-01-01" });
    const large = estimateCost(FAKE_CATALOGUE, "fake-tiered", { inputTokens: 1_001, outputTokens: 500 });
    expect(large).toMatchObject({ kind: "estimate", usd: 0.02001 });
    expect(estimateCost(FAKE_CATALOGUE, "fake-unpriced", { inputTokens: 10, outputTokens: 10 })).toEqual({ kind: "price_not_known", catalogueDate: "2026-01-01" });
    expect(estimateCost(FAKE_CATALOGUE, "never-heard-of", { inputTokens: 10, outputTokens: 10 })).toEqual({ kind: "price_not_known", catalogueDate: "2026-01-01" });
    expect(estimateCost(FAKE_CATALOGUE, "fake-priced", null)).toEqual({ kind: "not_reported" });
    expect(estimateCost(FAKE_CATALOGUE, "unknown-id", { inputTokens: 1, outputTokens: 1 }, "Fake priced").kind).toBe("estimate");
    expect(formatEstimate(small)).toMatch(/^about \$0\.0020, estimated from the catalogue of 2026-01-01$/);
    expect(formatEstimate({ kind: "price_not_known", catalogueDate: "2026-01-01" })).toBe("price not known (catalogue of 2026-01-01)");
    expect(formatEstimate({ kind: "not_reported" })).toBe("usage not reported by the provider");
    expect(catalogueProblems(FAKE_CATALOGUE)).toEqual([]);
    expect(catalogueProblems({ ...FAKE_CATALOGUE, source: [], consultedOn: "yesterday" })).toEqual(["no source", "consultedOn is not an ISO date"]);
  });

  it("maps each status and each thrown error to a named failure state", () => {
    expect(stateForStatus(401)).toBe("auth_refused");
    expect(stateForStatus(403)).toBe("auth_refused");
    expect(stateForStatus(402)).toBe("billing_refused");
    expect(stateForStatus(429)).toBe("rate_limited");
    expect(stateForStatus(529)).toBe("overloaded");
    expect(stateForStatus(504)).toBe("timed_out");
    expect(stateForStatus(400)).toBe("invalid_request");
    expect(stateForStatus(404)).toBe("invalid_request");
    expect(stateForStatus(500)).toBe("provider_error");
    const limited = failureFromStatus(429, "Your organization has hit a rate limit", "12");
    expect(limited.state).toBe("rate_limited");
    expect(limited.retryAfterSeconds).toBe(12);
    expect(limited.message).toContain("rate limited");
    expect(limited.message).toContain("Your organization has hit a rate limit");
    expect(failureFromStatus(401, null, null).message).toContain("status 401");
    expect(failureFromThrown(Object.assign(new Error("aborted"), { name: "AbortError" })).state).toBe("cancelled");
    // A timeout armed on the caller's signal: the platform rejects with an error named TimeoutError and the signal aborted.
    const timeout = Object.assign(new Error("signal timed out"), { name: "TimeoutError" });
    const timedOutSignal = { aborted: true, reason: timeout, addEventListener() {}, removeEventListener() {} };
    expect(failureFromThrown(timeout, timedOutSignal).state).toBe("timed_out");
    expect(failureFromThrown(new Error("the request was aborted"), timedOutSignal).state).toBe("timed_out");
    const abortedSignal = { aborted: true, reason: Object.assign(new Error("aborted"), { name: "AbortError" }), addEventListener() {}, removeEventListener() {} };
    expect(failureFromThrown(new Error("the request was aborted"), abortedSignal).state).toBe("cancelled");
    expect(failureFromThrown(new TypeError("fetch failed")).state).toBe("no_network");
    expect(failureFromThrown(new ProviderError("overloaded", "x")).state).toBe("overloaded");
  });
});
