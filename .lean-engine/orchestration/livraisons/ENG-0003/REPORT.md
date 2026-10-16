# ENG-0003: delivery report

## Result

PASS against the definition_of_done of ENG-0003 (four criteria, each with the evidence that proves it):

1. Met: `apps/desktop` holds an Electron shell (`src/main/main.ts`, `src/main/preload.ts`) whose main process hosts the kernel on the Node adapters (`src/main/service.ts`), and a React interface (`src/renderer/`) that imports no Node module and reaches the core through one typed channel (`src/api.ts`, the `IpeApi` contract). The channel is carried by Electron's message channel in the application (`ipcRenderer.invoke` behind `contextBridge`, exposed as `window.ipe`) and by a local HTTP bridge for the tests and for a browser (`src/bridge/server.ts`, run by `scripts/bridge.mjs`). `apps/desktop/test/renderer-imports.test.ts` proves that the interface imports no Node, Electron or adapter module and the kernel as types only; `pnpm typecheck` compiles the renderer with the DOM library and without the Node types.
2. Met: TST-PRJ-001a, TST-PRJ-001b, TST-PRJ-002a, TST-PRJ-003a, TST-PRJ-003b, TST-PRJ-004a, TST-PRJ-005b and TST-PRJ-006c (browser, `e2e/prj.spec.ts`), TST-PRJ-005a (kernel, `packages/kernel/test/prj-005.test.ts`), TST-PRJ-006a and TST-PRJ-006b (adapters, `packages/adapters-node/test/prj-006.test.ts`) exist under their names and pass. The browser tests run with Playwright against the interface served by Vite, the service behind the HTTP bridge (`playwright.config.ts` starts both). The Electron application launches under the display of the machine in `e2e/electron.spec.ts`: started on a project folder, it opens the project, shows its first unit in the editor with the state saved, and the test checks that the interface talks through the message channel, not the bridge.
3. Met: a user does each gesture in the running application, and the tests captured one screenshot per gesture (kept under `e2e/screenshots/`, regenerated under `test-results/screenshots/` by every run):
   - create a project folder: `01-create-project.png` (TST-PRJ-001a: the project Serial with three chapters);
   - open a project folder: `02-open-project.png` (TST-PRJ-001a: the same project reopened after a reload, units in order), and `10-electron-application.png` (the Electron window on a folder of Markdown files adopted as a project);
   - write in a unit with the save state visible: `03-editing-saved.png` (TST-PRJ-003a: the text typed, the indicator at saved), `04-conflict-both-texts.png` (the unit changed on disk: both texts, Keep mine or Take the disk version, both exercised by the test), `07-save-failed-text-kept.png` (TST-PRJ-003b: the folder unwritable, the text kept on screen, the reason and a Retry);
   - reorder units from the outline: `08-outline-reordered.png` (TST-PRJ-004a: C moved above B, then back down, then B renamed in place), `05-move-unit-carrying-objects.png` (TST-PRJ-002a: The ford and its beat Dusk moved under Chapter 2, "moved, 3 object(s) carried", a deleted object left out), `06-inspector-after-move.png` (the inspector on an object carried by the move, its anchor intact);
   - search the project: `09-search-hits.png` (TST-PRJ-005b: three hits for "bell" across two chapters, each with its unit and excerpt);
   - reopen a unit byte-identical: TST-PRJ-001b (three adopted files, LF, CRLF and without final newline, each selected in the editor, bytes compared), TST-PRJ-006c (a CRLF unit and a unit with trailing spaces edited in the interface, bytes compared), TST-PRJ-006a and 006b at the storage (no screenshot: the proof is the byte comparison in the tests).
4. Met: this report.

From the repository root: `pnpm typecheck` passes; `pnpm test` reports 21 files, 61 tests, all passing (kernel 39, adapters 12, desktop 10); `pnpm e2e` builds the application, then reports 9 passed (8 browser, 1 Electron), run under the display of the machine (`DISPLAY=:0`, WSLg).

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title (`test.describe > test` for Playwright).

| Requirement | Tests | Status the coordinator can set |
|---|---|---|
| SPEC-PRJ-001 | `e2e/prj.spec.ts` > SPEC-PRJ-001 Project on disk > TST-PRJ-001a, TST-PRJ-001b | IMPLEMENTED |
| SPEC-PRJ-002 | `e2e/prj.spec.ts` > SPEC-PRJ-002 Reorder and move without loss > TST-PRJ-002a | IMPLEMENTED |
| SPEC-PRJ-003 | `e2e/prj.spec.ts` > SPEC-PRJ-003 Long-form editing with visible save state > TST-PRJ-003a, TST-PRJ-003b | IMPLEMENTED (the limit case stays an open point, below) |
| SPEC-PRJ-004 | `e2e/prj.spec.ts` > SPEC-PRJ-004 Outline view > TST-PRJ-004a | IMPLEMENTED |
| SPEC-PRJ-005 | `packages/kernel/test/prj-005.test.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005a; `e2e/prj.spec.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005b (added) | IMPLEMENTED |
| SPEC-PRJ-006 | `packages/adapters-node/test/prj-006.test.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006a, TST-PRJ-006b; `e2e/prj.spec.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006c (added at rework) | IMPLEMENTED |

Implementation: `apps/desktop/src/api.ts` (the contract), `apps/desktop/src/main/service.ts` (the service: one open project on the kernel and the Node adapters), `apps/desktop/src/main/main.ts` and `preload.ts` (the shell and the message channel), `apps/desktop/src/bridge/server.ts` (the HTTP bridge), `apps/desktop/src/renderer/App.tsx`, `text.ts`, `client.ts`, `main.tsx`, `styles.css` (the interface), `packages/kernel/src/kernel.ts` (`search`, `adoptUnit`, `takeExternal`), `packages/adapters-node/src/index.ts` (the round trip through the storage).

## What the implementation decided inside its scope

1. One contract, two transports. `IpeApi` is a list of calls with JSON arguments and results; `API_METHODS` names them once, and both the preload and the bridge build their side from that list. The interface asks `connect()`, which takes `window.ipe` when the preload exposed it and otherwise the bridge named by `?bridge=<url>` or `VITE_BRIDGE`. Errors cross the channel as data (`{ ok: false, error: { code, message } }`) and are rethrown on the interface side with their code, so a conflict, a missing project or a refused folder keeps its meaning.
2. SPEC-PRJ-001, limit case: a folder that holds Markdown files and no manifest is adopted: the service creates the manifest and registers each `.md` file as a unit through `adoptUnit`, in file-name order, and rewrites none of them (TST-PRJ-001b compares the bytes before and after). A folder with neither a project nor Markdown files is refused with code `no_project`; a platform refusal (permissions) comes back with its own code and message.
3. SPEC-PRJ-002: the count the author sees is the number of live objects anchored to the moved unit or to any of its descendants: the subtree is taken before the move, the objects counted after it, and the kernel's move touches the manifest only, so the two agree; tombstones are left out. Shown as "moved, N object(s) carried". Anchors rest on unit identifiers, so a move between chapters changes no anchor; the inspector shows them intact after the move (TST-PRJ-002a with a beat under the moved scene and a deleted object; `service.test.ts`).
4. SPEC-PRJ-003: the editor is CodeMirror 6 with the Markdown language and the Vim extension (a checkbox, remembered in the browser's storage). A change marks the state unsaved and schedules one save, bound to the unit and the text of that change, 600 ms after the last change; an edit reverted within the interval cancels it and the state returns to saved; a unit left within the interval is saved first, and the author stays on it when that save is refused or in conflict; saves run one after the other, never overtaking one another; a load of a unit into the editor schedules nothing. A save answered as a conflict shows both texts and two gestures: Keep mine (saves with force) and Take the disk version (the kernel takes the disk's text, re-anchors, records an external version, and the editor shows it at saved); nothing is written until the author chooses. A save the platform refuses leaves the state unsaved, keeps the text on screen, shows the reason, and offers Retry; the next change retries as well (TST-PRJ-003a, TST-PRJ-003b).
5. SPEC-PRJ-004: the outline is the manifest tree with, per unit, rename (an input in place, Enter commits, Escape cancels), move up, move down, move under the previous unit, move out after its parent, and add a child unit; a reorder or a rename writes the manifest and nothing else (TST-PRJ-004a compares the unit files and the paths before and after, for move up, move down and rename).
6. SPEC-PRJ-005: the kernel's `search` is case-insensitive and returns every occurrence in every unit with its offsets and an excerpt, then one hit per live object whose title or body holds the term, with no cap of its own; the service returns the first 200 hits and the total; the interface lists the hits with their unit's title and, when the list was cut, says "showing 200 of N hits" so that nothing is left out in silence; a click selects the passage in the editor (positions mapped for CRLF units) or opens the inspector on the object (TST-PRJ-005a at the kernel, TST-PRJ-005b in the browser, added for the panel and the cut list).
7. SPEC-PRJ-006: the storage writes the bytes of the string it is given and reads them back as they are; the editor splits a unit on the unit's own line break (CRLF when every line break is CRLF, LF otherwise) and joins with the same, so a uniform unit comes back byte-identical through the editor; a unit that mixes CRLF and LF is split on LF with its stray carriage returns kept as characters (the editor marks them), so it comes back byte-identical too; the author is told, and a line break typed in such a unit is LF. TST-PRJ-006a is a property test at the storage: 60 documents assembled at random (seeded) from Markdown pieces, including CRLF, tabs, trailing spaces, raw HTML, math, footnotes and non-Latin text, each written, read back, and reopened byte-identical. TST-PRJ-006b is the corpus of constructs the editor does not render, at the storage. TST-PRJ-006c edits a CRLF unit and a unit with trailing spaces in the interface and compares the bytes.
8. The Electron shell: `contextIsolation`, `sandbox` and no `nodeIntegration`; the preload exposes `window.ipe` (the channel) and `window.ipeShell` (choose a folder through the native dialog, and the project the application was started on). Started with `IPE_OPEN_PROJECT=<folder>`, the interface opens that project through the channel at once, so that what the window shows and what the service holds never diverge. `IPE_RENDERER_URL` points the window at the Vite server during development; `IPE_BRIDGE_PORT` exposes the bridge from the application for tools that drive it from outside.
9. A failure of the interface itself is shown in words (an error boundary in `main.tsx`), never as a blank page: a page without any channel says so.
10. `pnpm e2e` builds the application before Playwright runs, so the Electron smoke test never runs against a stale build.

## Mutants: each property is guarded by a test that falls when the property is broken

Run with the script that injects one mutant at a time, runs the named test (the one Playwright test or the one test file) and restores the source. Every mutant made its test fail; the sources are unchanged afterwards.

| Requirement | Mutant injected in the source | Test that falls |
|---|---|---|
| SPEC-PRJ-001 | the project created under a fixed name, not the author's | TST-PRJ-001a |
| SPEC-PRJ-001 | the first Markdown file of a folder not adopted | TST-PRJ-001b |
| SPEC-PRJ-002 | the count carried always zero | TST-PRJ-002a |
| SPEC-PRJ-003 | a conflict shown as saved | TST-PRJ-003a |
| SPEC-PRJ-003 | a refused save shown as saved, without reason | TST-PRJ-003b |
| SPEC-PRJ-004 | move up moving the unit down | TST-PRJ-004a |
| SPEC-PRJ-005 | objects skipped by the search | TST-PRJ-005a |
| SPEC-PRJ-005 | the panel listing one hit only | TST-PRJ-005b |
| SPEC-PRJ-006 | trailing spaces stripped at write | TST-PRJ-006a, TST-PRJ-006b |
| SPEC-PRJ-006 | CRLF normalised at read | TST-PRJ-006a |
| SPEC-PRJ-003 | a unit left within the interval not saved before the next one shows (rework, V1) | TST-PRJ-003a |
| SPEC-PRJ-003 | an edit reverted within the interval still saved (rework, V2) | TST-PRJ-003a |
| SPEC-PRJ-003 | the take-disk gesture showing the kernel's text, not the disk's (rework, V3) | TST-PRJ-003a |
| SPEC-PRJ-001, 006 | a CRLF unit loaded and saved with LF (rework, V4) | TST-PRJ-001b |
| SPEC-PRJ-004 | move down moving the unit up (verifier's X2) | TST-PRJ-004a |
| SPEC-PRJ-002 | objects anchored to descendants of the moved unit not counted (verifier's X4) | TST-PRJ-002a |
| SPEC-PRJ-002 | tombstones counted as carried (verifier's X5) | service.test.ts |
| SPEC-PRJ-005 | the total hidden when the list is cut (rework, V7) | TST-PRJ-005b |
| criterion 1 | a Node module imported by the interface | renderer-imports.test.ts |

## Rework

Answers to the marks of `.eng/REWORK.md` (MAN-ENG-0003-1, minor reject), each with the change and the test that proves it.

- V1: a save is bound to its unit and its text at the moment of the change (`pending` in `App.tsx`), and a unit is left only once the pending save ran: `openUnit`, `openFolder` and `doCreate` flush it first, and the author stays on a unit whose save is refused or in conflict. TST-PRJ-003a types in Chapter 1 and selects Chapter 2 within the interval, then reads both files: Chapter 1 holds the edit, Chapter 2 is untouched. The mutant that drops the flush falls under it.
- V2: every change cancels the pending save before it schedules its own, so an edit reverted within the interval leaves nothing pending and the state returns to saved. TST-PRJ-003a types a character, deletes it, waits past the interval, and reads the file unchanged. The mutant that keeps the earlier timer falls under it.
- V3: Take the disk version calls the new channel call `takeDisk`, which the service answers with the kernel's new `takeExternal`: the disk's text becomes the unit's text, the anchors are re-resolved, a version with action external is recorded, and the editor shows the text at saved. TST-PRJ-003a takes the disk version after a conflict, reads the disk text in the editor, and makes the next edit land without a conflict; `service.test.ts` proves the service and the version recorded. The verifier's mutant X3 (the gesture a no-op) falls under TST-PRJ-003a.
- V4: the editor is given the unit's own line break (`lineBreakOf` in `text.ts`: CRLF when every line break is CRLF, LF otherwise) and gives the text back with it (`sliceDoc`); given a separator explicitly, it keeps every other byte as a character, so a mixed unit comes back byte-identical too, its stray carriage returns marked, and the author is told. A load replaces the editor's state, which schedules no save. Positions of search hits are mapped for CRLF units (`docPosition`). TST-PRJ-001b (bytes, nothing typed) and TST-PRJ-006c (bytes after an edit) prove it; `text.test.ts` proves the two functions; the mutant that always answers LF falls under TST-PRJ-006c (a line break typed in a CRLF unit would be LF).
- V5: TST-PRJ-001b now adopts a LF file, a CRLF file and a file without final newline, selects each unit from the outline, waits past the interval, and compares the bytes with `Buffer.equals`; TST-PRJ-006c (added) edits a CRLF unit and a unit with trailing spaces in the interface and compares the bytes.
- V6: `service.test.ts` moves a scene that has a beat, with objects on both and one deleted object, and expects 3 carried; TST-PRJ-002a does the same in the browser ("moved, 3 object(s) carried"); the channel gains `deleteObject` for the test and the later review surface. The verifier's mutants X4 (descendants not counted) and X5 (tombstones counted) fall.
- V7: the kernel's `search` no longer caps; the service returns the first 200 hits and the total; the interface says "showing 200 of N hits" when the list was cut. TST-PRJ-005b writes 250 occurrences in a unit and reads the cut list with its total; `service.test.ts` proves the service. The mutant that hides the total falls. The requirement's own wording (every occurrence listed, or the first N with the total shown) is for the SCP drafted below.
- Beside the marks: the rename gesture no longer uses `window.prompt`, which the Electron window refuses; it is an input in place, exercised by TST-PRJ-004a together with move down (the verifier's X2 falls). The artefacts say what the named tests prove (items 3, 4, 6 and 7 above; SPEC_UPDATE.md).

## Known limits, stated

- The save interval is 600 ms of quiet after the last change, a value chosen by this delivery; SPEC-PRJ-003 says "target value, to confirm". The limit case of SPEC-PRJ-003 (a unit of the maximum size, the response bound) is not fixed and not tested by this delivery: the two values are open (below).
- A unit that mixes CRLF and LF line endings is split on LF, its stray carriage returns kept as marked characters, so its bytes survive an edit elsewhere in the unit; a line break the author types in it is LF. A uniform unit, CRLF or LF, comes back byte-identical and a typed line break follows its separator. The policy is for the SCP drafted below.
- The search panel lists the first 200 hits and the total count; the rest are reached by narrowing the search. Whether the requirement asks for every hit listed or for the first N with the total is for the SCP drafted below.
- A unit deleted on disk while open is not reported; the next save recreates it. A unit changed on disk while open is detected at the next save, as a conflict, not at the moment of the change: the interface does not watch the file system.
- TST-PRJ-003b makes the project folder unwritable with permission bits; it is skipped on Windows and as root, where permission bits do not refuse a write.
- The Electron smoke test needs a display (`DISPLAY=:0` under WSLg here) and the `--no-sandbox` flag, which it passes itself; a machine without a display cannot run it and must say so.
- The search is a plain substring search, as SPEC-PRJ-005 excludes fuzzy and semantic search.
- The HTTP bridge listens on the loopback only and sets permissive CORS headers for the Vite page; it is a tool for tests and the later browser surface, not a server to expose.

## Open points that need someone else

1. SCP on SPEC-PRJ-003 (specification change, for the coordinator to file under a reserved number): the three values written "target value, to confirm" need a decision. Draft: the save interval is 600 ms of quiet after the last change (what this delivery implements; its only cost is one write per pause); the maximum unit size and the response bound are to be chosen by the operator, since no measurement in this delivery fixes them (option A: 100 000 characters and 100 ms per keystroke, to measure; option B: leave both open until a long-form user asks). Recommended: option A, with a measurement test added under TST-PRJ-003c once decided.
2. SCP on SPEC-PRJ-005 (for the coordinator to file): does the product list every occurrence (option A: no cap, a virtualised panel), or the first N with the total shown (option B: N = 200 as delivered, the panel says "showing 200 of N hits")? Recommended: B, as delivered, with the total shown.
3. SCP on SPEC-PRJ-006 and the limit case of SPEC-PRJ-001 (for the coordinator to file): the line-separator policy. Option A: the editor keeps every byte of a unit and a line break the author types follows the unit's separator (CRLF in a uniform CRLF unit, LF otherwise, mixed units announced); option B: the product normalises every unit to LF at the author's first save and the requirement says so. Recommended: A, as delivered.

## For information, no action required

- The design note's `IpeApi` sketch (docs/KERNEL_DESIGN.md Section 7) differs from the delivered contract: drafted in DOC_UPDATE.md for the coordinator.
- The design note names `undo(eventId)` in the interface; the kernel has it, the interface does not expose it yet. It belongs with the review surface of a later milestone.
- `pnpm e2e` is a root script; `pnpm --filter @ipe/desktop start` runs the application on the built files (`apps/desktop/README.md` says how).
- Screenshots under `e2e/screenshots/` are the copies of one run; the tests write theirs under `test-results/screenshots/`, ignored by git, so a verification run leaves the worktree clean.

## Documentation updated

- `apps/desktop/README.md`: created; how to run the application, the bridge, the tests, the environment variables.
- `docs/KERNEL_DESIGN.md` (outside this scope) is now incomplete: Section 7 must carry the delivered contract (with `takeDisk`, `deleteObject` and the search result with its total) and the two transports. Drafted in DOC_UPDATE.md for the coordinator at integration.
- `dossier-recette/11_PROJECT_STRUCTURE.md`: statuses, implementation fields and executable references per SPEC_UPDATE.md, with TST-PRJ-005b added. To be applied by the coordinator at integration.
