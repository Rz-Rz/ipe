# ENG-0005: delivery report

## Result

PASS against the definition_of_done of ENG-0005 (four criteria, each with the evidence that proves it):

1. Met: `packages/providers` holds the provider contract (`Provider`: `models`, `complete`, the network injected as `FetchLike`, an `AbortSignalLike`), the request and answer model, the catalogue format with `source` and `consultedOn` (`Catalogue`, `catalogueProblems`), the failure states and their mapping rules (`stateForStatus`, `failureFromStatus`, `failureFromThrown`), the context assembly for a passage, a unit and the project (`assembleContext`), the preview whose total is the size of what is sent (`previewOf`), and a fake provider with deterministic answers and programmable failures (`FakeProvider`). `packages/providers-claude` implements the contract on the Claude provider's Messages API (`ClaudeProvider`: `POST /v1/messages`, `GET /v1/models`, the documented headers, the documented error shape) with a dated catalogue that names its two sources (`CLAUDE_CATALOGUE`, consulted on 2026-10-16), and request and response fixtures recorded as the API documents them (`test/fixtures/`). `packages/assistant` holds the ask action (`ask`): the call record is created before the request leaves, the answer is a proposed object anchored to the scope with the record as its dependency, and a failure or a cancellation is written into the record with nothing else created. The three packages compile with `lib: ES2022` and `types: []`: no Node and no DOM module.
2. Met: TST-PRV-002a (`packages/providers-claude/test/catalogue.test.ts`), TST-PRV-002b, 003a, 004b, 005a, 005b, 006a, 006b and TST-AST-001b (`packages/assistant/test/ask.test.ts`), TST-PRV-003b (`packages/providers/test/context.test.ts`), TST-PRV-007a and 007b (`packages/providers-claude/test/claude.test.ts`) exist under their names and pass; TST-PRV-007b is skipped and reported as not verified when `IPE_CLAUDE_API_KEY` is absent from the environment, which was the case for this delivery.
3. Met: every figure of the catalogue carries its source (the provider's pricing and models pages) and its date; a model the pages name without an identifier is listed by display name only, and a model absent from the catalogue is shown with "price not known", never a number (TST-PRV-002a).
4. Met: this report; the tests that remain for ENG-0006 are listed per requirement below.

From the repository root: `pnpm typecheck` passes; `pnpm test` reports 26 files, 76 tests: 75 passed, 1 skipped (TST-PRV-007b, no key in the environment).

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title.

| Requirement | Tests of this delivery | Remaining for ENG-0006 | Status the coordinator can set |
|---|---|---|---|
| SPEC-PRV-002 | `packages/providers-claude/test/catalogue.test.ts` > SPEC-PRV-002 Capability and cost disclosure > TST-PRV-002a; `packages/assistant/test/ask.test.ts` > SPEC-PRV-002 Capability and cost disclosure > TST-PRV-002b | the display in the interface | PARTIAL |
| SPEC-PRV-003 | `packages/assistant/test/ask.test.ts` > SPEC-PRV-003 Explicit sending within the chosen scope > TST-PRV-003a; `packages/providers/test/context.test.ts` > SPEC-PRV-003 Explicit sending within the chosen scope > TST-PRV-003b | the preview shown before the first call | PARTIAL |
| SPEC-PRV-004 | `packages/assistant/test/ask.test.ts` > SPEC-PRV-004 Provider change without loss and without silent switching > TST-PRV-004b | TST-PRV-004a | PARTIAL |
| SPEC-PRV-005 | `packages/assistant/test/ask.test.ts` > SPEC-PRV-005 Call record with provenance > TST-PRV-005a, TST-PRV-005b | none | IMPLEMENTED |
| SPEC-PRV-006 | `packages/assistant/test/ask.test.ts` > SPEC-PRV-006 Failure states of a call > TST-PRV-006a, TST-PRV-006b | the states shown with retry and abandon | PARTIAL |
| SPEC-PRV-007 | `packages/providers-claude/test/claude.test.ts` > SPEC-PRV-007 The Claude provider on its Messages API > TST-PRV-007a, TST-PRV-007b (skipped without a key) | none | IMPLEMENTED |
| SPEC-AST-001 | `packages/assistant/test/ask.test.ts` > SPEC-AST-001 Ask about a chosen scope > TST-AST-001b | TST-AST-001a | PARTIAL |

Implementation: `packages/providers/src/{contract,catalogue,failures,context,fake}.ts`, `packages/providers-claude/src/{index,catalogue}.ts`, `packages/assistant/src/index.ts`.

## What the implementation decided inside its scope

1. The network and the clock are injected. `FetchLike` is the shape the contract needs of `fetch` (a status, headers, a text body), so that the platform's `fetch` is wrapped in one line on the Node and browser sides and the tests give a fake; `AbortSignalLike` is the shape of an abort signal; the ask action takes `now` for the record's times and defaults to the platform's clock. No package of this delivery imports Node or the DOM.
2. SPEC-PRV-002: a cost is one of three things, never a bare number: an estimate from the price band the input falls in, with the catalogue's date and sources; "price not known" when the catalogue has no price for the model (by identifier, then by the display name the provider lists); "not reported" when the provider returned no usage. The Claude catalogue carries the base prices of the pricing page and the four current models of the overview page with their identifiers, context window and output limit; the legacy models the pages price without an identifier are listed by display name. The two Haiku 5.5 price bands (prompts up to 100,000 tokens, prompts above) are the only tiered entry.
3. SPEC-PRV-003: what is sent is the concatenation of the preview's items, so the preview's total is the size of what is sent by construction: the preamble and the project's instructions as the system prompt, the scoped material as the user message (the unit's title and its text, or the passage alone), then the question. A scope that names an absent unit or a passage outside its unit's text is refused before any call (`ContextError`).
4. SPEC-PRV-004 at this layer: an action with no connection is refused with code `no_provider` and the gesture that connects one; with a connection and no model, with code `no_model`. No default is picked. The switch of provider in the interface and the provider-neutral instructions file belong to ENG-0006.
5. SPEC-PRV-005: the call record is an object of kind `call` with origin `author` and action `call`, accepted at creation: it records the author's act, not a judgment of the assistant. Its body holds the provider, the model, the scope, the manuscript version read, the question, the preview of what was sent (identifiers, titles and sizes, never the text), the times, the outcome, the usage, the cost and the failure. The answer is an object of kind `answer`, origin `assistant`, action `ask`, approval proposed, anchored to the scope (the passage; the whole text of a unit; every unit of the project), with the record in `dependsOn`.
6. SPEC-PRV-006: the states are `no_network`, `auth_refused`, `billing_refused`, `rate_limited`, `timed_out`, `cancelled`, `overloaded`, `invalid_request`, `provider_error`, `unparseable`. The HTTP statuses map as the provider documents them (401 and 403 to auth_refused, 402 to billing_refused, 429 to rate_limited with the retry-after header in seconds when present, 529 to overloaded, 504 to timed_out, other 4xx to invalid_request, other 5xx to provider_error); an abort maps to cancelled; a rejection of fetch to no_network; an answer that is not the documented shape to unparseable with the status. A cancellation after the provider answered keeps nothing of the answer: the record says cancelled and no object is created. Retry is a new call with a new record.
7. SPEC-PRV-007: the adapter sends `x-api-key`, `anthropic-version: 2023-06-01` and `content-type`, a body with `model`, `max_tokens`, `messages: [{ role: "user", content }]` and `system` when the system prompt is not empty, reads the text blocks of `content`, `stop_reason`, `usage.input_tokens` and `usage.output_tokens`, and takes the `request-id` header or the message `id`. `GET /v1/models?limit=1000` lists the models with `display_name`, `max_input_tokens`, `max_tokens` and `lifecycle`. The fixtures under `test/fixtures/` are the request and response examples of the provider's documentation and its table of error types, consulted on 2026-10-16.

## Mutants: each property is guarded by a test that falls when the property is broken

Run with the script that injects one mutant at a time, runs the test file that guards the property from its package, and restores the source. Every mutant made its test file fail; the sources are unchanged afterwards.

| Requirement | Mutant injected in the source | Test file that falls |
|---|---|---|
| SPEC-PRV-003 | a passage scope sends the whole unit | ask.test.ts |
| SPEC-PRV-003 | the preview total omits the system prompt | context.test.ts |
| SPEC-PRV-002 | the first price band applies to every input size | catalogue.test.ts (providers) |
| SPEC-PRV-002 | a provider reporting no usage priced at zero | ask.test.ts |
| SPEC-PRV-002 | the usage the provider reported dropped from the record | ask.test.ts |
| SPEC-PRV-004 | a fake connection picked when none is chosen | ask.test.ts |
| SPEC-PRV-005 | the answer no longer depends on the call record | ask.test.ts |
| SPEC-PRV-005 | a failed call recorded as completed | ask.test.ts |
| SPEC-PRV-006 | an answer kept after the author cancelled | ask.test.ts |
| SPEC-PRV-006 | a rate limit reported as an invalid request | claude.test.ts |
| SPEC-PRV-007 | the key sent under an undocumented header | claude.test.ts |
| SPEC-PRV-007 | the usage the provider returned ignored | claude.test.ts |
| SPEC-PRV-002 | a catalogue without a date | catalogue.test.ts (providers-claude) |
| SPEC-AST-001 | the answer created as the author's own, accepted at birth | ask.test.ts |
| SPEC-AST-001 | a passage answer anchored to the whole unit | ask.test.ts |

## Known limits, stated

- TST-PRV-007b, the live call, ran skipped in this delivery: no key is in the environment of the build machine, and the operator's key is never written in a test or a fixture. It is reported as not verified. The verifier can run it with `IPE_CLAUDE_API_KEY` set in the shell.
- The catalogue is a table consulted on 2026-10-16; prices and models change on the provider's side. The date is shown with every estimate, and the live model list is the provider's own.
- The usage reported by the fake provider is a count of characters divided by four; it stands for the provider's count in the tests and nowhere else.
- The adapter sends no `thinking` or `effort` parameter: the provider's defaults apply. Streaming, tools, images and batches are out of scope.
- A timeout is the caller's signal: the adapter sets no timer of its own, since the platform's timers are not available to a package that imports no platform module. ENG-0006 arms the signal with a timeout in the shell and in the bridge.
- The cancellation check after the provider answered relies on the signal's `aborted` flag at the moment the answer arrives; a cancellation that reaches the action after the answer object was created is a deletion the author makes.

## Open points that need someone else

None. No requirement, milestone, interface or scope needed a change.

## For information, no action required

- The design note names the failure states of Section 2 and the catalogue as "one JSON file per provider"; the delivery holds the catalogue as a TypeScript constant (`src/catalogue.ts`), typed by the contract, so that no JSON import is needed in a package without platform modules, and adds the states `billing_refused` and `provider_error`. Drafted in DOC_UPDATE.md for the coordinator.
- The record's `scope` and `sent` fields let the interface show the material considered without reading the text again; the text is recovered from the version (`readVersion`).
- `pnpm-lock.yaml` changed for the three new workspace packages only.

## Documentation updated

- `docs/PROVIDER_DESIGN.md` (outside this scope) is now incomplete: Section 2 must list the ten failure states, Section 3 must say the catalogue is a typed TypeScript constant with the same fields, Section 5 must say the record enters accepted with origin author and action call, and Section 6 must map 402 and 5xx. Drafted in DOC_UPDATE.md for the coordinator at integration.
- `dossier-recette/14_PROVIDERS.md` and `15_ASSISTANT_ACTIONS.md`: statuses, implementation fields and executable references per SPEC_UPDATE.md. To be applied by the coordinator at integration.
