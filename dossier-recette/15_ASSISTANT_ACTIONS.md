# Domain AST: assistant actions, scope, and permissions

This file holds the AST requirements of milestone J-PRV: one bounded action that proves the provider path end to end, from the author's chosen scope to an object with provenance. Discovery, critique, editing and proactive suggestions (N05) are specified when their milestones approach the frontier. Parent need: N05; parent quality requirement: Q02; principles P01, P02, P03.

### SPEC-AST-001: Ask about a chosen scope

- Status: PARTIAL
- Source: Specified (product need)
- Parent need: IPE-N05, IPE-P01, IPE-P03
- Implementation: `packages/assistant/src/index.ts`, `packages/providers/src/context.ts`
- Acceptance priority: critical

**Requirement.** The author must be able to ask a question about a chosen scope (a passage, a unit, or the whole project) through a chosen connection, and the product must record the answer as a proposed object anchored to the scope, depending on the call record, which the author can accept, reject, or delete, and must never change the manuscript by this action.

**Coverage.** Nominal: question and unit chosen; the answer appears as a proposed object of kind answer in the objects panel, anchored to the unit's text, and its provenance shows the model, the version sent and the material considered; a project scope anchors the answer to every unit with text, and the call record keeps the version read (TST-AST-001b). Limit: an empty answer is recorded as an answer with an empty body and reported. Error: a failed call leaves no answer object and shows the failure state (SPEC-PRV-006). Degraded: when the scoped text changes during the call, the answer rests on the version sent and the kernel marks it stale. This case is not met by ENG-0005: the answer object is created against the version current at its creation, its anchors are read from the new text at the offsets of the passage sent, their state is intact and stale is false, and only the call record keeps the version read; the kernel creates objects against the current version only, so the clause is carried by ENG-0009, and no test proves it yet. Exclusion: manuscript edits proposed by the assistant (milestone J-GEN), proactive suggestions, several providers in one action.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-AST-001a | planned | e2e | From the interface, with a fake provider, the author asks about a unit, sees the answer as a proposed object, accepts it, and reads its provenance in the inspector. |
| TST-AST-001b | `packages/assistant/test/ask.test.ts` > SPEC-AST-001 Ask about a chosen scope > TST-AST-001b: the answer object is proposed, of origin assistant, anchored to the scope's passages, depends on the call record, and the manuscript is unchanged | unit | The answer object is proposed, of origin assistant, anchored to the scope's passages, depends on the call record, and the manuscript is unchanged. |

### SPEC-AST-002: Extract the memory of a chosen scope

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N05, IPE-N09, IPE-P01
- Implementation: none
- Acceptance priority: critical

**Requirement.** The author must be able to run the extraction of the memory on a chosen scope through a chosen connection, with the preview of what will be sent, the call recorded, the entries returned as proposals the author reviews one by one (accept, reject, correct), and the manuscript untouched by the action.

**Coverage.** Nominal: the extraction asks the provider for entries in a documented structured form, with the established facts of the project given as context so that the assistant proposes what is new; the proposals are reviewed in the memory panel. Limit: a scope with no text yields an empty proposal list and says so. Error: a failed call shows its state (SPEC-PRV-006) and creates nothing. Degraded: a partial answer (some entries readable, the rest not) proposes the readable entries and reports the rest as unreadable. Exclusion: proactive extraction, edits of the manuscript.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-AST-002a | planned | e2e | From the interface, with a fake provider replaying a recorded answer, the author extracts a unit, reviews the proposals, accepts one, rejects one, and reads the established fact in the memory. |
| TST-AST-002b | planned | unit | The request carries the documented form, the established facts as context and nothing outside the scope; a partial answer proposes the readable entries and reports the rest. |
