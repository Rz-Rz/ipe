# Requirements folder: IPE

Version 0.3, 16 October 2026. This folder is the normative reference of the IPE product. It states, requirement by requirement, what the product must do, attaches each requirement to its implementation and to the tests that verify it, and declares its status. It is derived from the product baseline (`docs/IPE_PRODUCT_BASELINE.md`, version 0.2) under the rules of that document's Section 8: the baseline carries intent, this folder carries requirements.

The folder is written for the milestones at or near the frontier of the commitment graph: J-KER (kernel and project on disk), J-PRV (provider connection and the first assistant action) and J-MEM (project memory). Requirements for later milestones are written when those milestones approach the frontier, never in advance.

## 1. Object and scope

At this version the folder covers the provenance kernel (domain KER), the minimal project structure it needs (domain PRJ), the provider connection (domain PRV), the assistant actions (domain AST) and the project memory (domain MEM). No assistant, no provider, no export beyond the kernel's own documented formats.

The folder does not cover: the internal design of algorithms, user documentation, the vision and audiences (baseline Sections 1 and 2), and decisions (decision records).

## 2. Product in one paragraph

IPE is a local-first writing environment for substantial works. Project data lives on the author's device in documented formats, the manuscript in Markdown. Everything the product records about a work beyond the text is an object that carries provenance: origin, source passages, manuscript version, approval state, staleness. Views such as project memory, chronology, status windows, and revision impact read these objects. An assistant can act on the project within the author's permissions and on the providers the author chooses. The desktop application ships first; the browser surface follows on the same core.

## 3. Invariants

Seven principles and seven quality requirements of the baseline bind every requirement here. They are cited by code: P01 authorial control, P02 evidence and uncertainty, P03 context before judgment, P04 preservation and reversibility, P05 ownership and portability, P06 approachable depth, P07 provenance-bearing objects; Q01 dependable preservation, Q02 honest assistance, Q03 privacy and permission, Q04 visible cost and capability, Q05 accessible operation, Q06 portability without silent loss, Q07 cost scales with change.

Two of them govern the kernel above all: an object is never shown as current when its sources changed (P07), and the work needed to bring a project up to date scales with the change, not with the project (Q07).

## 4. Use cases of the first milestone

The use cases orient the reading of the requirements. They are not requirements.

1. A writer creates a project on disk, writes chapters as Markdown files, and reorders scenes. Notes attached to a scene follow it.
2. The writer edits a file outside the product. On reopening, the product reports what changed and re-anchors the objects that rest on the edited text, or marks them orphaned.
3. The writer asks why the project holds a given object and receives its provenance: passages, version, origin, creating action, dependencies.
4. The product is closed, or crashes, during a save. On restart the project is in its last consistent state and the files on disk remain readable by other tools.
5. The writer connects a provider with their own API key, sees what it supports and what each call costs, asks a question about a chapter, reads what will be sent before it leaves the device, and receives the answer as a proposed object whose provenance names the model and the manuscript version sent.
6. The writer replaces the provider: the project's instructions and every object stay as they were, and the next call names the new provider.
7. The writer asks the assistant to extract the memory of a chapter: people, places, events and rules come back as proposals anchored to the passages that support them, explicit or inferred; the writer accepts some as established facts, disputes one, and asks why the project says two characters have met.
8. The writer revises the chapter: the entries resting on the changed passages show as stale; a new extraction refreshes what still holds, proposes what is new, and flags what the text no longer supports, deleting nothing.

## 5. Structure of the folder

| File | Content |
|---|---|
| `00_INDEX.md` | This document: scope, invariants, use cases, glossary of the first milestone. |
| `02_CODIFICATION.md` | Identifiers, statuses, domain codes, requirement template, test natures, normative vocabulary. |
| `10_PROVENANCE_KERNEL.md` | Domain KER. |
| `11_PROJECT_STRUCTURE.md` | Domain PRJ, requirements of milestone J-KER only. |
| `14_PROVIDERS.md` | Domain PRV, requirements of milestone J-PRV. |
| `15_ASSISTANT_ACTIONS.md` | Domain AST, the actions of milestones J-PRV and J-MEM. |
| `19_PROJECT_MEMORY.md` | Domain MEM, requirements of milestone J-MEM. |
| `90_TRACEABILITY_MATRIX.md` | Generated by the steering kit; never edited by hand. |

## 6. Glossary of the first milestone

The master glossary is Appendix B of the baseline. The terms below are repeated so that this folder can be read alone. Their definitions are identical to the master's.

- **Project:** the container of a work: manuscript units, notes, research, assets, objects, and history.
- **Manuscript unit:** a chapter, scene, section, or episode held as one editable Markdown text.
- **Passage:** a contiguous span of manuscript text that an object can rest on.
- **Object:** anything the product records about a work beyond the manuscript text itself.
- **Provenance:** the record of an object's origin (author, assistant, or import), the passages and manuscript version it rests on, the action that created it, and its approval state.
- **Proposal:** an object produced by the assistant or by an import that the author has not accepted. The other states are **accepted** and **rejected**.
- **Established fact:** a statement about the work's world or subject that the author has accepted as true.
- **Inference:** a statement derived from passages that the author has not accepted.
- **Stale:** the state of an object whose sources changed after the manuscript version it describes.
- **Anchor:** the link between an object and a passage, maintained across edits of the manuscript. Its states are intact, changed, ambiguous, and orphaned.
- **Orphaned:** the state of an anchor whose passage no longer exists in the manuscript.
- **Ambiguous:** the state of an anchor whose passage matches several candidate locations after an edit.
- **Manuscript version:** an identifiable state of all manuscript units at one moment, recoverable after later edits.
- **Dependency:** a link from one object to another object it was derived from.
- **Provider:** an external AI service connection (baseline, N04).
- **Connection:** a provider the author connected with an access key, with its state and the models it offers.
- **Call:** one request to a provider and its answer, or its failure.
- **Call record:** the object that records a call: provider, model, time, scope sent with its manuscript version, usage, outcome.
- **Scope:** the material the author chose for an action: a passage, a unit, or the whole project.
- **Catalogue:** the versioned, dated table of a provider's models, capabilities and prices, naming its source.
- **Memory entry:** an object of the project memory: a claim about the work, of one category, anchored to the passages that support it.
- **Explicit:** the basis of an entry the text states in so many words; **inferred:** the basis of an entry derived from the text; **plan:** an entry about the future of the work.
- **Disputed:** the mark of an entry the author contests; a disputed entry is no established fact until settled.
