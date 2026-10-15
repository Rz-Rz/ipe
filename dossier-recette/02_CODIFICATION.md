# Codification and requirement template

This document fixes the conventions of the requirements folder. It describes how requirements are written and attached to tests. It describes no product function.

## 1. Requirement identifiers

Each requirement carries a unique, stable identifier of the form:

```
SPEC-<CODE>-<NNN>
```

- `<CODE>` is the three-letter code of the domain, defined in the table of Section 4.
- `<NNN>` is a three-digit sequence number, per domain, never reused after the deletion of a requirement.

An identifier is never recycled. The deletion of a requirement retires its number; the following requirements are not renumbered.

## 2. Test identifiers

Each test attached to a requirement carries an identifier of the form:

```
TST-<CODE>-<NNN><letter>
```

The prefix repeats the requirement covered. The letter (`a`, `b`, `c`) distinguishes several tests of one requirement. A test may cover several requirements; it is then cited in each table under distinct identifiers that point to the same artefact.

The artefact is referenced in an executable way:

1. Rust: crate name, test file path, and function name.
2. TypeScript: test file path, then the `describe > it` title.
3. System or end-to-end test: suite name and scenario name.
4. Corpus evaluation: evaluation suite, corpus identifier, and the metric reported.

The traceability matrix (`90_TRACEABILITY_MATRIX.md`) aggregates the whole and is generated, never edited by hand.

## 3. Status

| Status | Meaning | Consequence for acceptance |
|---|---|---|
| `IMPLEMENTED` | The behavior is coded and covered by at least one passing automated test or evaluation. | Acceptable now. |
| `PARTIAL` | The core logic is coded and tested; an integration link (user interface, input and output, provider call) remains. | Partial acceptance: the tested part is acceptable, the remainder is deferred and stated. |
| `PLANNED` | The requirement is written; the code is not. | Not acceptable; deferred. |

The status is factual and verifiable: it follows from the presence of code and tests, not from an appraisal.

## 4. Domain codes

| Code | Domain | File |
|---|---|---|
| KER | Provenance kernel: objects, anchors, versions, staleness, local storage | `10_PROVENANCE_KERNEL.md` |
| PRJ | Project structure and long-form writing | `11_PROJECT_STRUCTURE.md` |
| CAP | Capture of written and spoken ideas | `12_CAPTURE.md` |
| GEN | Drafting from an explicit brief | `13_GENERATION.md` |
| PRV | AI providers and access | `14_PROVIDERS.md` |
| AST | Assistant actions, scope, and permissions | `15_ASSISTANT_ACTIONS.md` |
| STU | Study of existing works | `16_STUDY.md` |
| LIB | Craft and idea library | `17_CRAFT_LIBRARY.md` |
| RES | Research and evidence | `18_RESEARCH.md` |
| MEM | Project memory | `19_PROJECT_MEMORY.md` |
| CHR | Chronology, location, and knowledge | `20_CHRONOLOGY.md` |
| NAR | Narrative structure, characters, and worlds | `21_NARRATIVE.md` |
| STY | Style, rhetoric, and reader experience | `22_STYLE.md` |
| ARG | Arguments and nonfiction | `23_ARGUMENT.md` |
| TRN | Translation and adaptation | `24_TRANSLATION.md` |
| SYS | Status windows and system displays | `25_SYSTEM_DISPLAYS.md` |
| VIS | Illustrations and sequential visual narratives | `26_VISUALS.md` |
| REV | Revision impact and version comparison | `27_REVISION.md` |
| COL | Collaboration and accountability | `28_COLLABORATION.md` |
| PUB | Assembly, publishing, import, and export | `29_PUBLISHING.md` |
| ENV | Environment, surfaces, accessibility, and extensibility | `30_ENVIRONMENT.md` |

The codes are permanent. A file exists only once its domain has at least one requirement; the files of domains not yet specified are created when the domain approaches the frontier. The mapping of codes to the needs of the baseline is in baseline Appendix B.

## 5. Origin and parent of a requirement

Two fields state where a requirement comes from.

- `Source` takes one of two values: `Specified (product need)` when the requirement translates a need of the baseline; `Not specified, reconstructed from code` when a function present in the code is integrated for complete coverage.
- `Parent need` names one or more identifiers of the baseline (`IPE-N##`, `IPE-P##`, `IPE-Q##`). The field is required (baseline Section 8). It is the only reference to a document outside this folder; the requirement text itself is self-contained.

## 6. Template of a requirement

Each requirement follows the template below. Empty fields are marked "none", never omitted.

```
### SPEC-<CODE>-<NNN>: <short title>

- Status: PLANNED | PARTIAL | IMPLEMENTED
- Source: Specified (product need) | Not specified, reconstructed from code
- Parent need: IPE-N## (one or more)
- Implementation: <crate / package / file(:line)> or none
- Acceptance priority: critical | major | minor

**Requirement.** <one prescriptive, verifiable sentence, present tense, named actor; "must", "should", or "may", never mixed>

**Coverage.** <nominal case; limit cases; error cases; degraded behavior; exclusions of scope>

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-<CODE>-<NNN>a | <executable reference, or "planned"> | unit / integration / e2e / property / system / corpus evaluation | <assertion verified> |
```

A requirement without an attached test carries, in place of the table, the explicit mention "No automated test attached" with a reason. A `PLANNED` requirement lists the tests that will prove it, with the artefact marked "planned": the table is then the acceptance evidence an implementor must produce.

## 7. Test natures and the rules that bind them

1. `unit`, `integration`, `e2e`, `property`, `system`: as named. A property test draws its inputs at random and states an invariant.
2. `corpus evaluation`: the nature reserved for assistant judgments (contradictions, knowledge timing, structural preparation, style patterns). The artefact is a fixture corpus with planted defects and held-out cases. The evaluation reports a detection rate and a false-alarm rate. It carries a mutation check: removing the detection of one planted defect must make the evaluation fail. Thresholds are set per requirement from pilot measurements and are marked "target value, to confirm" until measured.
3. A test never takes the implementation as its oracle. When a requirement states that two computations agree, the agreement is proved by a differential test on inputs drawn at random.
4. A property stated in absolute terms in this folder is guarded by a named test or stated with its reservation. A property that enters this folder has its guard proved by mutant injection: the code is changed to violate the property and a test must fail.
5. A figure published in this folder is generated from a versioned artefact, never copied from one run.

## 8. Normative vocabulary

- "must": mandatory requirement.
- "should": recommendation.
- "may": option.

The three registers are not mixed in one requirement. Figures carry their units and tolerances. A value not yet settled is marked "target value, to confirm".

## 9. Writing rules

The working language is English. Writing is impersonal and prescriptive, in the present tense, with the actor named. One sentence carries one requirement. No em-dash. No unquantified qualifier in a requirement. No calendar estimate. No invented data: what is unknown is marked as an open point. One term, one concept: the glossary of `00_INDEX.md` and of baseline Appendix B is used without synonym.
