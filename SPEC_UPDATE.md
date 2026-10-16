# ENG-0003: requirement updates to apply in dossier-recette/11_PROJECT_STRUCTURE.md

The session cannot write the requirements folder. The coordinator applies the lines below at integration: status, implementation field, and the test artefacts (file path, then `describe > it` title, as the codification asks). Every test listed passed: `pnpm test` from the repository root (20 files, 57 tests) and `pnpm e2e` (8 tests, 7 in the browser and 1 in Electron).

| Requirement | New status | Implementation | Tests |
|---|---|---|---|
| SPEC-PRJ-001 | IMPLEMENTED | `apps/desktop/src/main/service.ts`, `apps/desktop/src/renderer/App.tsx`, `packages/kernel/src/kernel.ts` | `e2e/prj.spec.ts` > SPEC-PRJ-001 Project on disk > TST-PRJ-001a (integration), TST-PRJ-001b (unit) |
| SPEC-PRJ-002 | IMPLEMENTED | `apps/desktop/src/main/service.ts`, `apps/desktop/src/renderer/App.tsx` | `e2e/prj.spec.ts` > SPEC-PRJ-002 Reorder and move without loss > TST-PRJ-002a (integration) |
| SPEC-PRJ-003 | IMPLEMENTED | `apps/desktop/src/renderer/App.tsx`, `apps/desktop/src/main/service.ts` | `e2e/prj.spec.ts` > SPEC-PRJ-003 Long-form editing with visible save state > TST-PRJ-003a (unit), TST-PRJ-003b (system) |
| SPEC-PRJ-004 | IMPLEMENTED | `apps/desktop/src/renderer/App.tsx`, `apps/desktop/src/main/service.ts` | `e2e/prj.spec.ts` > SPEC-PRJ-004 Outline view > TST-PRJ-004a (e2e) |
| SPEC-PRJ-005 | IMPLEMENTED | `packages/kernel/src/kernel.ts`, `apps/desktop/src/renderer/App.tsx` | `packages/kernel/test/prj-005.test.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005a (unit); `e2e/prj.spec.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005b (e2e, added: the search panel lists every hit with its unit and jumps to it) |
| SPEC-PRJ-006 | IMPLEMENTED | `packages/adapters-node/src/index.ts`, `apps/desktop/src/renderer/App.tsx` | `packages/adapters-node/test/prj-006.test.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006a (property), TST-PRJ-006b (unit) |

Coverage notes to add or restate, so that the folder says no more than the tests prove:

- SPEC-PRJ-001, limit: a folder of Markdown files without a manifest is adopted in file-name order, each file registered as a unit through `adoptUnit`, none rewritten (TST-PRJ-001b, bytes compared).
- SPEC-PRJ-001, error: a folder with neither a project nor Markdown files is refused with code `no_project` (`apps/desktop/test/service.test.ts`); a folder the platform refuses to read comes back with the platform's code and message, shown to the author (not tested under a named artefact).
- SPEC-PRJ-002, nominal: the count shown is the number of live objects anchored to the moved unit or its descendants; anchors rest on unit identifiers, so a move between chapters changes none of them (TST-PRJ-002a, the inspector shows intact).
- SPEC-PRJ-002, limit and error: a passage moved inside a unit is re-resolved by the kernel's anchor resolver (SPEC-KER-003, SPEC-KER-004 tests); an anchor that cannot be re-resolved is reported ambiguous or orphaned by the same resolver and never dropped.
- SPEC-PRJ-003, nominal: the interval implemented is 600 ms of quiet after the last change (value chosen by the delivery; "target value, to confirm" stays until the SCP drafted in REPORT.md is decided).
- SPEC-PRJ-003, limit: not fixed and not tested by this delivery (maximum size and response bound stay "target value, to confirm").
- SPEC-PRJ-003, error: a refused save shows unsaved, keeps the text on screen, shows the reason and offers Retry; the next change retries as well (TST-PRJ-003b).
- SPEC-PRJ-003, degraded: a conflict shows both texts, nothing is written until the author chooses Keep mine or Take the disk version (TST-PRJ-003a).
- SPEC-PRJ-004, limit: an empty project shows an empty outline with the Add unit gesture (exercised by TST-PRJ-001a before the first unit is added; no named artefact).
- SPEC-PRJ-005, limit: an empty term or an absent word yields an empty list (TST-PRJ-005a); the search is case-insensitive and caps at 200 hits.
- SPEC-PRJ-006, limit: front matter, HTML blocks, footnotes, math, trailing spaces, CRLF and a missing final newline are preserved verbatim (TST-PRJ-006b corpus; TST-PRJ-006a random documents).
