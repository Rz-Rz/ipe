# Domain PRJ: project structure and long-form writing

This file holds only the PRJ requirements of milestone J-KER: the minimal project a writer needs on disk for the kernel to have something to anchor to. Outlines with cards, side-by-side references, annotations, footnotes, citations, figures, tables, and equations (N01) are specified when a later milestone approaches the frontier. Parent need: N01; parent quality requirements: Q01, Q05, Q06.

### SPEC-PRJ-001: Project on disk

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-P05
- Implementation: `apps/desktop/src/main/service.ts`, `apps/desktop/src/renderer/App.tsx`, `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** The product must create and open a project as a folder on the author's device that contains the manuscript units as Markdown files and a documented manifest of their order and hierarchy.

**Coverage.** Nominal: a new project is a folder with a manifest and no unit; units are added as files. Limit: a folder that holds Markdown files but no manifest opens with a generated manifest, each file registered as a unit in file-name order, and no file rewritten, not even once shown in the editor (LF, CRLF and no-final-newline files compared byte for byte); a file that mixes line endings keeps its bytes too and is announced when shown. Error: a folder with neither a project nor Markdown files is refused with code no_project; a folder the platform refuses to read is refused with the platform's code and message, shown to the author. Degraded: none. Exclusion: synchronization with cloud storage.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-001a | `e2e/prj.spec.ts` > SPEC-PRJ-001 Project on disk > TST-PRJ-001a: a created project reopens with the same units in the same order | integration | A created project reopens with the same units in the same order. |
| TST-PRJ-001b | `e2e/prj.spec.ts` > SPEC-PRJ-001 Project on disk > TST-PRJ-001b: a folder of Markdown files without manifest opens; no existing file is modified | unit | A folder of Markdown files without manifest opens; no existing file is modified. |

### SPEC-PRJ-002: Reorder and move without loss

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: `apps/desktop/src/main/service.ts`, `apps/desktop/src/renderer/App.tsx`
- Acceptance priority: critical

**Requirement.** Moving or reordering a manuscript unit or a passage must keep every object anchored to it, with its anchors re-resolved, and the product must show the author the count of objects carried by the move.

**Coverage.** Nominal: a scene moved to another chapter keeps its notes and their anchors intact; the count shown is the number of live objects anchored to the moved unit or its descendants, tombstones left out, and anchors rest on unit identifiers, so the move itself changes none. Limit: a passage moved inside a unit keeps its anchors, re-resolved by the kernel's resolver (SPEC-KER-003, SPEC-KER-004). Error: an anchor that cannot be re-resolved after the move is reported as ambiguous or orphaned by the same resolver, never dropped. Degraded: none. Exclusion: none.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-002a | `e2e/prj.spec.ts` > SPEC-PRJ-002 Reorder and move without loss > TST-PRJ-002a: after a scene moves between chapters, every object anchored to it is intact and the count shown equals the count carried | integration | After a scene moves between chapters, every object anchored to it is intact and the count shown equals the count carried. |

### SPEC-PRJ-003: Long-form editing with visible save state

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-Q01, IPE-Q05
- Implementation: `apps/desktop/src/renderer/App.tsx`, `apps/desktop/src/main/service.ts`
- Acceptance priority: critical

**Requirement.** The editor must save the open manuscript unit automatically and must show at all times whether the text on screen is saved, unsaved, or in conflict with the disk.

**Coverage.** Nominal: a change is saved within the documented interval (interval implemented: 600 ms of quiet after the last change; target value, to confirm by the SCP drafted at the delivery of ENG-0003) and the state shows saved; a save is bound to the unit and the text of the change that scheduled it, a unit left within the interval is saved before the next one shows, and an edit reverted within the interval leaves nothing to save. Limit: a unit of the documented maximum size (size: target value, to confirm) stays editable within the documented response bound (bound: target value, to confirm); not fixed and not tested by ENG-0003. Error: a failed save shows unsaved, keeps the text on screen, shows the reason and offers Retry; the next change retries as well; the author stays on a unit whose save was refused or is in conflict. Degraded: a conflict with the disk shows conflict with both texts and never overwrites silently; Keep mine saves the author's text, Take the disk version makes the disk's text the unit's text, re-anchored and recorded as an external version, and the next edit lands without a conflict. Exclusion: rich-text editing; the editor edits Markdown.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-003a | `e2e/prj.spec.ts` > SPEC-PRJ-003 Long-form editing with visible save state > TST-PRJ-003a: the displayed state follows saved, unsaved, and conflict transitions exactly | unit | The displayed state follows saved, unsaved, and conflict transitions exactly. |
| TST-PRJ-003b | `e2e/prj.spec.ts` > SPEC-PRJ-003 Long-form editing with visible save state > TST-PRJ-003b: with the save path made unwritable, the text is kept and recoverable | system | With the save path made unwritable, the text is kept and recoverable. |

### SPEC-PRJ-004: Outline view

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: `apps/desktop/src/renderer/App.tsx`, `apps/desktop/src/main/service.ts`
- Acceptance priority: major

**Requirement.** The product must present the manuscript as an outline of its units and must allow the author to reorder units from the outline.

**Coverage.** Nominal: the outline lists units in manifest order; move up, move down and a rename in place each write the manifest and nothing else, the files and the paths compared before and after. Limit: an empty project shows an empty outline with the gesture that adds a unit (exercised before the first unit is added in TST-PRJ-001a; no named artefact). Error: none. Degraded: none. Exclusion: cards and focused writing views.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-004a | `e2e/prj.spec.ts` > SPEC-PRJ-004 Outline view > TST-PRJ-004a: reordering in the outline changes the manifest order and nothing else | e2e | Reordering in the outline changes the manifest order and nothing else. |

### SPEC-PRJ-005: Project search

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01
- Implementation: `packages/kernel/src/kernel.ts`, `apps/desktop/src/renderer/App.tsx`
- Acceptance priority: major

**Requirement.** The product must find a text string across all manuscript units and all objects of the project and must show each hit with its unit and passage.

**Coverage.** Nominal: the kernel returns every occurrence; the interface lists the first 200 and, when the list was cut, says how many it holds in all; which of the two the requirement promises is for an SCP. Limit: no hit, an empty term or an absent word yields an explicit empty result; the search is case-insensitive. Error: none. Degraded: none. Exclusion: fuzzy and semantic search.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-005a | `packages/kernel/test/prj-005.test.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005a: every occurrence in units and objects is returned with unit and passage | unit | Every occurrence in units and objects is returned with unit and passage. |
| TST-PRJ-005b | `e2e/prj.spec.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005b: the search panel lists every hit with its unit and jumps to it | e2e | The search panel lists every hit with its unit and jumps to it, and says when the list was cut. |

### SPEC-PRJ-006: Markdown round trip

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-Q06
- Implementation: `packages/adapters-node/src/index.ts`, `apps/desktop/src/renderer/text.ts`, `apps/desktop/src/renderer/App.tsx`
- Acceptance priority: critical

**Requirement.** A manuscript unit saved by the product must reopen with text identical to what was saved, and any Markdown construct the editor does not render must be preserved verbatim.

**Coverage.** Nominal: ordinary prose round-trips byte for byte, through the storage and through the editor, which splits and joins a unit on the unit's own line break and keeps every other byte. Limit: front matter, HTML blocks, footnotes, math, trailing spaces, CRLF and a missing final newline are preserved verbatim; a unit that mixes CRLF and LF keeps its bytes, and a line break typed in it is LF (the policy is for an SCP). Error: none. Degraded: none. Exclusion: rendering of unsupported constructs.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRJ-006a | `packages/adapters-node/test/prj-006.test.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006a: random Markdown documents round-trip byte-identical | property | Random Markdown documents round-trip byte-identical. |
| TST-PRJ-006b | `packages/adapters-node/test/prj-006.test.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006b: a corpus of constructs the editor does not render is preserved verbatim | unit | A corpus of constructs the editor does not render is preserved verbatim. |
| TST-PRJ-006c | `e2e/prj.spec.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006c: a unit edited in the interface keeps its bytes, line endings and trailing spaces included | e2e | A unit edited in the interface keeps its bytes, line endings and trailing spaces included. |

