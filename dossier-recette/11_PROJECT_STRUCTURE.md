# Domain PRJ: project structure and long-form writing

This file holds only the PRJ requirements of milestone J-KER: the minimal project a writer needs on disk for the kernel to have something to anchor to. Outlines with cards, side-by-side references, annotations, footnotes, citations, figures, tables, and equations (N01) are specified when a later milestone approaches the frontier. Parent need: N01; parent quality requirements: Q01, Q05, Q06.

### SPEC-PRJ-001: Project on disk

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-P05
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must create and open a project as a folder on the author's device that contains the manuscript units as Markdown files and a documented manifest of their order and hierarchy.

**Coverage.** Nominal: a new project is a folder with a manifest and no unit; units are added as files. Limit: a folder that holds Markdown files but no manifest opens with a generated manifest and no file rewritten. Error: an unreadable folder is refused with the reason. Degraded: none. Exclusion: synchronization with cloud storage.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-001a | planned | integration | A created project reopens with the same units in the same order. |
| TST-PRJ-001b | planned | unit | A folder of Markdown files without manifest opens; no existing file is modified. |

### SPEC-PRJ-002: Reorder and move without loss

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: none
- Acceptance priority: critical

**Requirement.** Moving or reordering a manuscript unit or a passage must keep every object anchored to it, with its anchors re-resolved, and the product must show the author the count of objects carried by the move.

**Coverage.** Nominal: a scene moved to another chapter keeps its notes and their anchors intact. Limit: a passage moved inside a unit keeps its anchors. Error: an anchor that cannot be re-resolved after the move is reported as ambiguous or orphaned, never dropped. Degraded: none. Exclusion: none.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-002a | planned | integration | After a scene moves between chapters, every object anchored to it is intact and the count shown equals the count carried. |

### SPEC-PRJ-003: Long-form editing with visible save state

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-Q01, IPE-Q05
- Implementation: none
- Acceptance priority: critical

**Requirement.** The editor must save the open manuscript unit automatically and must show at all times whether the text on screen is saved, unsaved, or in conflict with the disk.

**Coverage.** Nominal: a change is saved within the documented interval (interval: target value, to confirm) and the state shows saved. Limit: a unit of the documented maximum size (size: target value, to confirm) stays editable within the documented response bound (bound: target value, to confirm). Error: a failed save shows unsaved, keeps the text in memory, and offers recovery. Degraded: a conflict with the disk shows conflict and never overwrites silently. Exclusion: rich-text editing; the editor edits Markdown.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-003a | planned | unit | The displayed state follows saved, unsaved, and conflict transitions exactly. |
| TST-PRJ-003b | planned | system | With the save path made unwritable, the text is kept and recoverable. |

### SPEC-PRJ-004: Outline view

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: none
- Acceptance priority: major

**Requirement.** The product must present the manuscript as an outline of its units and must allow the author to reorder units from the outline.

**Coverage.** Nominal: the outline lists units in manifest order; a reorder updates the manifest. Limit: an empty project shows an empty outline. Error: none. Degraded: none. Exclusion: cards and focused writing views.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-004a | planned | e2e | Reordering in the outline changes the manifest order and nothing else. |

### SPEC-PRJ-005: Project search

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: none
- Acceptance priority: major

**Requirement.** The product must find a text string across all manuscript units and all objects of the project and must show each hit with its unit and passage.

**Coverage.** Nominal: hits in text and in objects are listed with their location. Limit: no hit yields an explicit empty result. Error: none. Degraded: none. Exclusion: fuzzy and semantic search.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-005a | planned | unit | Every occurrence in units and objects is returned with unit and passage. |

### SPEC-PRJ-006: Markdown round trip

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-Q06
- Implementation: none
- Acceptance priority: critical

**Requirement.** A manuscript unit saved by the product must reopen with text identical to what was saved, and any Markdown construct the editor does not render must be preserved verbatim.

**Coverage.** Nominal: ordinary prose round-trips byte for byte. Limit: front matter, HTML blocks, footnotes, and math are preserved verbatim. Error: none. Degraded: none. Exclusion: rendering of unsupported constructs.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-006a | planned | property | Random Markdown documents round-trip byte-identical. |
| TST-PRJ-006b | planned | unit | A corpus of constructs the editor does not render is preserved verbatim. |
