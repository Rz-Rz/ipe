# Provider layer design note (milestone J-PRV)

Version 0.1, 16 October 2026. Companion of `docs/KERNEL_DESIGN.md`. Requirements: `dossier-recette/14_PROVIDERS.md` (SPEC-PRV-001 to 007) and `15_ASSISTANT_ACTIONS.md` (SPEC-AST-001). Decision: DA-0004 (the first provider).

## 1. Shape

Three packages, all pure TypeScript with no Node and no DOM import, following ADR-0003:

- `packages/providers`: the contract every provider implements, the request and answer model, the catalogue format, the failure states, the context assembly and the preview, and a fake provider for tests.
- `packages/providers-claude`: the adapter for the Claude provider's Messages API, with its dated catalogue.
- `packages/assistant`: the actions. At J-PRV, one action: ask about a scope. An action assembles the context from the kernel, calls the provider, records the call as an object, and creates the derived object with its dependency.

The desktop application (`apps/desktop`) adds the key store (Electron's `safeStorage`, the operating system's secret store; session memory when it is unavailable), the connection, capability, cost, preview and failure panels, and the channel calls. The HTTP bridge serves the same calls with a session-only key store, so that the browser tests and the later browser surface run the same code.

## 2. The provider contract

```ts
interface Provider {
  id: string;                                   // "claude"
  name: string;
  catalogue: Catalogue;                         // versioned, dated, with its source
  models(key: string, signal?: AbortSignal): Promise<ModelInfo[]>;        // what this key can reach
  complete(key: string, request: CompletionRequest, signal?: AbortSignal): Promise<Completion>;
}
interface CompletionRequest { model: string; system: string; input: string; maxOutputTokens: number }
interface Completion { text: string; usage: Usage | null; stopReason: string | null; raw?: unknown }
interface Usage { inputTokens: number; outputTokens: number }
type FailureState = "no_network" | "auth_refused" | "rate_limited" | "timed_out" | "cancelled" | "overloaded" | "invalid_request" | "unparseable";
class ProviderError extends Error { state: FailureState; providerMessage: string | null; retryAfterSeconds: number | null }
```

`fetch` is injected at construction (`new ClaudeProvider({ fetch })`), so the adapter runs in Node and in a browser and the tests give it a fake.

## 3. The catalogue

One JSON file per provider, versioned in the package, with `source` (the URL of the provider's pricing and model pages), `consultedOn` (ISO date), and per model: `id`, `label`, `capabilities` (`text`, `transcription`, `image`), `billing` (`separate_balance` or `subscription_allowance`), `inputPricePerMillionTokens`, `outputPricePerMillionTokens` (numbers in US dollars, or `null` when not known), and `limits` (free text from the source, or `null`). The cost estimate is `usage.inputTokens * input / 1e6 + usage.outputTokens * output / 1e6`, shown as "about $x, estimated from the catalogue of <date>"; a model absent from the catalogue or with `null` prices shows "price not known". No figure is written in the catalogue without its source and date.

## 4. Context assembly and preview

A scope is `{ kind: "passage", unit, start, end } | { kind: "unit", unit } | { kind: "project" }`. The assembly reads the kernel: for a passage, the unit's title and the passage text; for a unit, its title and text; for the project, every unit in manifest order with its title. The project's instructions (`.ipe/instructions.md`, provider-neutral Markdown the author edits; absent means none) go in the system prompt with a fixed preamble that states the assistant's role and that it answers from the material given. The preview is the list of items `{ kind, id, title, characters }` and the total; the request's `input` is the concatenation of the items in that order, so that the total of the preview equals the size of what is sent (TST-PRV-003b).

## 5. The call record

A call is an object of kind `call` created before the request leaves, with `origin: "assistant"`, `action: "call"`, body `{ provider, model, scope, version, instructionsHash, startedAt, outcome: "running" }`, then updated with `usage`, `outcome` (`completed`, `failed`, `cancelled`), `failure` (state and reason) and `finishedAt`. It is accepted at creation (a record, not a proposal). The answer object (kind `answer`, origin `assistant`, approval `proposed`, anchored to the scope) lists the call record in `dependsOn`. The record holds identifiers and the version, not the text: the version recovers it.

## 6. Failures and cancellation

Every provider error becomes a `ProviderError` with its state (Section 2). The HTTP status maps as the provider documents: 401 and 403 to `auth_refused`, 429 to `rate_limited` with `retry-after` when present, 529 to `overloaded`, 400 and 404 to `invalid_request`, a fetch rejection to `no_network`, an abort to `cancelled`, a timeout (the caller's signal) to `timed_out`, a response the adapter cannot read to `unparseable` with the raw status. The action writes the failure into the call record and creates nothing else. Retry is a new call with a new record.

## 7. The key store

Keys live in the application's data folder (`app.getPath("userData")/providers.json`), each value encrypted with `safeStorage.encryptString` and stored as base64; when `safeStorage.isEncryptionAvailable()` is false, the store keeps keys in memory for the session and reports it. The project folder never holds a key. The bridge used by the tests and the browser surface keeps keys in memory.

## 8. Channel additions

```ts
providers(): Promise<ConnectionView[]>;                 // provider, state, models, capabilities, keyStore ("os" | "session")
connectProvider(id, key): Promise<ConnectionView>;      // stores, then tests
testProvider(id): Promise<ConnectionView>;
disconnectProvider(id): Promise<void>;
previewAsk(scope): Promise<Preview>;
ask(scope, question, { provider, model }): Promise<AskResult>;   // the call record id, then the answer object or the failure
cancelCall(callId): Promise<void>;
calls(): Promise<IpeObject[]>;                           // the call records
readInstructions() / writeInstructions(text)
```

## 9. Tests

`packages/providers` tests run with the fake provider; `packages/providers-claude` tests run against recorded exchanges (fixtures under `test/fixtures/`, request and response JSON as the API documents them) and one live test guarded by `IPE_CLAUDE_API_KEY`, skipped and reported as not verified without it. The browser tests start the bridge with the fake provider registered beside the real one, so that the interface is driven as a user with no network.
