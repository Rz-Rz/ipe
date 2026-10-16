// The provider contract (SPEC-PRV-001 to 007, design note docs/PROVIDER_DESIGN.md Section 2).
//
// A provider is an external AI service reached with a key the author supplies. The contract
// names what every provider offers to the product: the models a key can reach, one completion
// at a time, a dated catalogue of capabilities and prices, and failures as named states. The
// network is injected (`FetchLike`), so the same code runs in Node and in a browser, and the
// tests give it a fake.

export type Capability = "text" | "transcription" | "image";

/** Whether usage draws from a separately charged balance or from a subscription allowance. */
export type Billing = "separate_balance" | "subscription_allowance";

/** A price band: it applies while the input of a call is at most `maxInputTokens` (null: no bound). */
export interface PriceTier {
  maxInputTokens: number | null;
  /** US dollars per million input tokens. */
  inputPerMillion: number;
  /** US dollars per million output tokens. */
  outputPerMillion: number;
}

export interface CatalogueModel {
  /** The identifier the API accepts, or null when the source gives the display name only. */
  id: string | null;
  displayName: string;
  capabilities: Capability[];
  billing: Billing;
  /** Null when the source states no price. */
  tiers: PriceTier[] | null;
  /** The usage limits the source states, as text, or null when it states none. */
  limits: string | null;
  contextWindowTokens: number | null;
  maxOutputTokens: number | null;
}

/** A versioned, dated table of a provider's models; every figure in it comes from `source`. */
export interface Catalogue {
  provider: string;
  source: string[];
  /** ISO date on which the sources were consulted. */
  consultedOn: string;
  currency: "USD";
  models: CatalogueModel[];
}

export interface ModelInfo {
  id: string;
  displayName: string;
  maxInputTokens: number | null;
  maxOutputTokens: number | null;
  lifecycle: string | null;
}

export interface CompletionRequest {
  model: string;
  system: string;
  input: string;
  maxOutputTokens: number;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

export interface Completion {
  text: string;
  /** Null when the provider reported no usage. */
  usage: Usage | null;
  stopReason: string | null;
  requestId: string | null;
}

export type FailureState =
  | "no_network"
  | "auth_refused"
  | "billing_refused"
  | "rate_limited"
  | "timed_out"
  | "cancelled"
  | "overloaded"
  | "invalid_request"
  | "provider_error"
  | "unparseable";

export const FAILURE_STATES: readonly FailureState[] = [
  "no_network", "auth_refused", "billing_refused", "rate_limited", "timed_out", "cancelled", "overloaded", "invalid_request", "provider_error", "unparseable",
];

/** A failure of a call, as a named state with what the provider said, when it said anything. */
export class ProviderError extends Error {
  constructor(
    readonly state: FailureState,
    message: string,
    readonly providerMessage: string | null = null,
    readonly retryAfterSeconds: number | null = null,
    readonly status: number | null = null,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

/** What the contract needs of an abort signal; the platform's AbortSignal satisfies it. */
export interface AbortSignalLike {
  readonly aborted: boolean;
  addEventListener(type: "abort", listener: () => void): void;
  removeEventListener(type: "abort", listener: () => void): void;
}

export interface FetchResponseLike {
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

export interface FetchInit {
  method: string;
  headers: Record<string, string>;
  body?: string;
  signal?: AbortSignalLike;
}

/** The network, injected: the platform's fetch wrapped in one line, or a fake in the tests. */
export type FetchLike = (url: string, init: FetchInit) => Promise<FetchResponseLike>;

export interface Provider {
  readonly id: string;
  readonly name: string;
  readonly catalogue: Catalogue;
  /** The models this key can reach, as the provider lists them. */
  models(key: string, signal?: AbortSignalLike): Promise<ModelInfo[]>;
  /** One completion. Rejects with a ProviderError, never with anything else. */
  complete(key: string, request: CompletionRequest, signal?: AbortSignalLike): Promise<Completion>;
}
