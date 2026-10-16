# ENG-0005: requirement updates to apply in dossier-recette/14_PROVIDERS.md and 15_ASSISTANT_ACTIONS.md

The session cannot write the requirements folder. The coordinator applies the lines below at integration: status, implementation field, and the test artefacts (file path, then `describe > it` title, as the codification asks). Every test listed passed in `pnpm test` from the repository root (26 files, 76 tests: 75 passed, 1 skipped), except TST-PRV-007b, skipped for want of a key and reported as not verified.

| Requirement | New status | Implementation | Tests (artefacts of this delivery) |
|---|---|---|---|
| SPEC-PRV-002 | PARTIAL | `packages/providers/src/catalogue.ts`, `packages/providers-claude/src/catalogue.ts`, `packages/assistant/src/index.ts` | `packages/providers-claude/test/catalogue.test.ts` > SPEC-PRV-002 Capability and cost disclosure > TST-PRV-002a (unit); `packages/assistant/test/ask.test.ts` > SPEC-PRV-002 Capability and cost disclosure > TST-PRV-002b (integration) |
| SPEC-PRV-003 | PARTIAL | `packages/providers/src/context.ts`, `packages/assistant/src/index.ts` | `packages/assistant/test/ask.test.ts` > SPEC-PRV-003 Explicit sending within the chosen scope > TST-PRV-003a (integration); `packages/providers/test/context.test.ts` > SPEC-PRV-003 Explicit sending within the chosen scope > TST-PRV-003b (unit) |
| SPEC-PRV-004 | PARTIAL | `packages/assistant/src/index.ts` | `packages/assistant/test/ask.test.ts` > SPEC-PRV-004 Provider change without loss and without silent switching > TST-PRV-004b (unit); TST-PRV-004a stays planned for ENG-0006 |
| SPEC-PRV-005 | IMPLEMENTED | `packages/assistant/src/index.ts` | `packages/assistant/test/ask.test.ts` > SPEC-PRV-005 Call record with provenance > TST-PRV-005a (integration), TST-PRV-005b (unit) |
| SPEC-PRV-006 | PARTIAL | `packages/providers/src/failures.ts`, `packages/providers-claude/src/index.ts`, `packages/assistant/src/index.ts` | `packages/assistant/test/ask.test.ts` > SPEC-PRV-006 Failure states of a call > TST-PRV-006a (integration), TST-PRV-006b (integration) |
| SPEC-PRV-007 | IMPLEMENTED | `packages/providers-claude/src/index.ts`, `packages/providers-claude/src/catalogue.ts` | `packages/providers-claude/test/claude.test.ts` > SPEC-PRV-007 The Claude provider on its Messages API > TST-PRV-007a (integration), TST-PRV-007b (system, skipped without a key) |
| SPEC-AST-001 | PARTIAL | `packages/assistant/src/index.ts`, `packages/providers/src/context.ts` | `packages/assistant/test/ask.test.ts` > SPEC-AST-001 Ask about a chosen scope > TST-AST-001b (unit); TST-AST-001a stays planned for ENG-0006; the degraded case remains, see the coverage note |

PARTIAL as the codification defines it: the core logic is coded and tested; the integration link (the interface, ENG-0006) remains.

Coverage notes to add or restate, so that the folder says no more than the tests prove:

- SPEC-PRV-002, limit: a model absent from the catalogue by identifier and by display name shows "price not known" with the catalogue's date (TST-PRV-002a); a provider that reports no usage shows "not reported" (TST-PRV-002b).
- SPEC-PRV-003, error: a scope that names an absent unit, a passage outside its unit's text, or a project without a unit is refused before any call (`packages/providers/test/context.test.ts`, second test; no named artefact).
- SPEC-PRV-004, error: an action with no connection is refused with code no_provider and the gesture named; with a connection and no model, with code no_model (TST-PRV-004b).
- SPEC-PRV-005, limit: the record holds the preview of what was sent (identifiers, titles, sizes) and the version, never the text (TST-PRV-005a asserts the text is absent from the record).
- SPEC-PRV-006, nominal: the states are no_network, auth_refused, billing_refused, rate_limited, timed_out, cancelled, overloaded, invalid_request, provider_error, unparseable (two more than the requirement lists: a billing refusal and a provider fault).
- SPEC-PRV-006, degraded: a cancellation after the provider answered leaves a record with outcome cancelled and no answer object (TST-PRV-006b).
- SPEC-PRV-007, degraded: without a key in the environment, TST-PRV-007b is skipped and reported as not verified; it was not run for this delivery.
- SPEC-AST-001, nominal: a project scope anchors the answer to every unit with text; the call record keeps the version read (TST-AST-001b).
- SPEC-AST-001, degraded: not met by this delivery. When the scoped text changes during the call, the answer object is created against the version current at its creation, not the version sent: its anchors are read from the new text at the offsets of the passage sent, their state is intact and stale is false; only the call record keeps the version read. The kernel creates objects against the current version only, so the clause remains, with the kernel change it needs (an object created against a named version), for the commitment drafted in REPORT.md under the open points. No test of this delivery proves this clause.
