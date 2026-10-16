// A provider for the tests: deterministic answers, programmable failures, a captured request
// per call, a catalogue with one priced and one unpriced model. It needs no network and no
// platform timer: a sleep is injected when a test wants a call to take time.

import { ProviderError, type AbortSignalLike, type Catalogue, type Completion, type CompletionRequest, type FailureState, type ModelInfo, type Provider, type Usage } from "./contract.js";
import { describeState } from "./failures.js";

export const FAKE_CATALOGUE: Catalogue = {
  provider: "fake",
  source: ["test fixture: no real provider"],
  consultedOn: "2026-01-01",
  currency: "USD",
  models: [
    { id: "fake-priced", displayName: "Fake priced", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: null, inputPerMillion: 1, outputPerMillion: 2 }], limits: null, contextWindowTokens: 100_000, maxOutputTokens: 4_096 },
    { id: "fake-tiered", displayName: "Fake tiered", capabilities: ["text"], billing: "separate_balance", tiers: [{ maxInputTokens: 1_000, inputPerMillion: 1, outputPerMillion: 2 }, { maxInputTokens: null, inputPerMillion: 10, outputPerMillion: 20 }], limits: "a limit stated by the fixture", contextWindowTokens: 100_000, maxOutputTokens: 4_096 },
    { id: "fake-unpriced", displayName: "Fake unpriced", capabilities: ["text", "transcription"], billing: "subscription_allowance", tiers: null, limits: null, contextWindowTokens: null, maxOutputTokens: null },
  ],
};

export type Sleep = (ms: number, signal?: AbortSignalLike) => Promise<void>;

export interface FakeFailure {
  state: FailureState;
  message?: string;
  retryAfterSeconds?: number;
}

export class FakeProvider implements Provider {
  readonly id = "fake";
  readonly name = "Fake provider";
  readonly catalogue = FAKE_CATALOGUE;
  /** Every request received, in order, with the key it came with. */
  captured: Array<{ key: string; request: CompletionRequest }> = [];
  /** The answer to give; it may abort the caller's signal to simulate a cancellation after the answer. */
  answer: (request: CompletionRequest) => string = (r) => `An answer about ${r.input.length} characters of material.`;
  /** The usage to report; null simulates a provider that reports none. */
  usage: ((request: CompletionRequest, text: string) => Usage | null) | null = (r, t) => ({ inputTokens: Math.ceil(r.input.length / 4), outputTokens: Math.ceil(t.length / 4) });
  failWith: FakeFailure | null = null;
  delayMs = 0;
  modelList: ModelInfo[] = [
    { id: "fake-priced", displayName: "Fake priced", maxInputTokens: 100_000, maxOutputTokens: 4_096, lifecycle: "active" },
    { id: "fake-unpriced", displayName: "Fake unpriced", maxInputTokens: null, maxOutputTokens: null, lifecycle: "active" },
  ];
  private counter = 0;

  constructor(private readonly sleep: Sleep = async () => undefined) {}

  async models(key: string, signal?: AbortSignalLike): Promise<ModelInfo[]> {
    if (signal?.aborted) throw new ProviderError("cancelled", describeState("cancelled"));
    if (key === "bad-key") throw new ProviderError("auth_refused", describeState("auth_refused"), "invalid x-api-key", null, 401);
    if (key === "") throw new ProviderError("auth_refused", describeState("auth_refused"), "no key", null, 401);
    return this.modelList.map((m) => ({ ...m }));
  }

  async complete(key: string, request: CompletionRequest, signal?: AbortSignalLike): Promise<Completion> {
    this.captured.push({ key, request: { ...request } });
    this.counter += 1;
    if (signal?.aborted) throw new ProviderError("cancelled", describeState("cancelled"));
    if (key === "bad-key") throw new ProviderError("auth_refused", describeState("auth_refused"), "invalid x-api-key", null, 401);
    if (this.delayMs > 0) await this.sleep(this.delayMs, signal);
    if (signal?.aborted) throw new ProviderError("cancelled", describeState("cancelled"));
    if (this.failWith !== null) {
      const f = this.failWith;
      throw new ProviderError(f.state, `${describeState(f.state)}${f.message ? `: ${f.message}` : ""}`, f.message ?? null, f.retryAfterSeconds ?? null, null);
    }
    const text = this.answer(request);
    return { text, usage: this.usage === null ? null : this.usage(request, text), stopReason: "end_turn", requestId: `fake-${this.counter}` };
  }
}
