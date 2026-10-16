// Failures of a call as named states (SPEC-PRV-006). The HTTP status maps as the providers
// document it; what the platform throws (a refused connection, an abort) maps too.

import { ProviderError, type AbortSignalLike, type FailureState } from "./contract.js";

export function stateForStatus(status: number): FailureState {
  if (status === 401 || status === 403) return "auth_refused";
  if (status === 402) return "billing_refused";
  if (status === 429) return "rate_limited";
  if (status === 529) return "overloaded";
  if (status === 504 || status === 408) return "timed_out";
  if (status >= 400 && status < 500) return "invalid_request";
  if (status >= 500) return "provider_error";
  return "unparseable";
}

/** The seconds of a retry-after header, or null when absent or not a number of seconds. */
export function retryAfterSeconds(header: string | null): number | null {
  if (header === null) return null;
  const n = Number(header.trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const WORDS: Record<FailureState, string> = {
  no_network: "no network: the provider could not be reached",
  auth_refused: "authentication refused by the provider",
  billing_refused: "refused by the provider for a billing reason",
  rate_limited: "rate limited by the provider",
  timed_out: "the call timed out",
  cancelled: "cancelled",
  overloaded: "the provider is overloaded",
  invalid_request: "the provider refused the request",
  provider_error: "the provider failed",
  unparseable: "the provider's answer could not be read",
};

export function describeState(state: FailureState): string {
  return WORDS[state];
}

/** A ProviderError from an HTTP status and what the provider said. */
export function failureFromStatus(status: number, providerMessage: string | null, retryAfter: string | null): ProviderError {
  const state = stateForStatus(status);
  const seconds = state === "rate_limited" ? retryAfterSeconds(retryAfter) : null;
  const detail = providerMessage ? `: ${providerMessage}` : ` (status ${status})`;
  return new ProviderError(state, `${describeState(state)}${detail}`, providerMessage, seconds, status);
}

/** A ProviderError from what the platform threw: an abort is a cancellation, anything else is no network. */
export function failureFromThrown(error: unknown, signal?: AbortSignalLike): ProviderError {
  if (error instanceof ProviderError) return error;
  const name = typeof error === "object" && error !== null && "name" in error ? String((error as { name: unknown }).name) : "";
  if (signal?.aborted || name === "AbortError") return new ProviderError("cancelled", describeState("cancelled"));
  if (name === "TimeoutError") return new ProviderError("timed_out", describeState("timed_out"));
  const message = error instanceof Error ? error.message : String(error);
  return new ProviderError("no_network", `${describeState("no_network")}: ${message}`, null, null, null);
}
