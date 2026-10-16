# ENG-0003: delivery report

## Result

PASS against the definition_of_done of ENG-0003 (four criteria, each with the evidence that proves it):

1. Met: `apps/desktop` holds an Electron shell (`src/main/main.ts`, `src/main/preload.ts`) whose main process hosts the kernel on the Node adapters (`src/main/service.ts`), and a React interface (`src/renderer/`) that imports no Node module and reaches the core through one typed channel (`src/api.ts`, the `IpeApi` contract). The channel is carried by Electron's message channel in the application (`ipcRenderer.invoke` behind `contextBridge`, exposed as `window.ipe`) and by a local HTTP bridge for the tests and for a browser (`src/bridge/server.ts`, run by `scripts/bridge.mjs`). `apps/desktop/test/renderer-imports.test.ts` proves that the interface imports no Node, Electron or adapter module and the kernel as types only; `pnpm typecheck` compiles the renderer with the DOM library and without the Node types.
2. Met: TST-PRJ-001a, TST-PRJ-001b, TST-PRJ-002a, TST-PRJ-003a, TST-PRJ-003b, TST-PRJ-004a and TST-PRJ-005b (browser, `e2e/prj.spec.ts`), TST-PRJ-005a (kernel, `packages/kernel/test/prj-005.test.ts`), TST-PRJ-006a and TST-PRJ-006b (adapters, `packages/adapters-node/test/prj-006.test.ts`) exist under their names and pass. The browser tests run with Playwright against the interface served by Vite, the service behind the HTTP bridge (`playwright.config.ts` starts both). The Electron application launches under the display of the machine in `e2e/electron.spec.ts`: started on a project folder, it opens the project, shows its first unit in the editor with the state saved, and the test checks that the interface talks through the message channel, not the bridge.
3. Met: a user does each gesture in the running application, and the tests captured one screenshot per gesture (kept under `e2e/screenshots/`, regenerated under `test-results/screenshots/` by every run):
   - create a project folder: `01-create-project.png` (TST-PRJ-001a: the project Serial with three chapters);
   - open a project folder: `02-open-project.png` (TST-PRJ-001a: the same project reopened after a reload, units in order), and `10-electron-application.png` (the Electron window on a folder of Markdown files adopted as a project);
   - write in a unit with the save state visible: `03-editing-saved.png` (TST-PRJ-003a: the text typed, the indicator at saved), `04-conflict-both-texts.png` (the unit changed on disk: both texts, Keep mine or Take the disk version), `07-save-failed-text-kept.png` (TST-PRJ-003b: the folder unwritable, the text kept on screen, the reason and a Retry);
   - reorder units from the outline: `08-outline-reordered.png` (TST-PRJ-004a: C moved above B), `05-move-unit-carrying-objects.png` (TST-PRJ-002a: The ford moved under Chapter 2, "moved, 2 object(s) carried"), `06-inspector-after-move.png` (the inspector on an object carried by the move, its anchor intact);
   - search the project: `09-search-hits.png` (TST-PRJ-005b: three hits for "bell" across two chapters, each with its unit and excerpt);
   - reopen a unit byte-identical: TST-PRJ-001b and TST-PRJ-006a and 006b (no screenshot: the proof is the byte comparison in the tests).
4. Met: this report.

From the repository root: `pnpm typecheck` passes; `pnpm test` reports 20 files, 57 tests, all passing (kernel 39, adapters 12, desktop 6); `pnpm e2e` reports 8 passed (7 browser, 1 Electron), run under the display of the machine (`DISPLAY=:0`, WSLg).

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title (`test.describe > test` for Playwright).

| Requirement | Tests | Status the coordinator can set |
|---|---|---|
| SPEC-PRJ-001 | `e2e/prj.spec.ts` > SPEC-PRJ-001 Project on disk > TST-PRJ-001a, TST-PRJ-001b | IMPLEMENTED |
| SPEC-PRJ-002 | `e2e/prj.spec.ts` > SPEC-PRJ-002 Reorder and move without loss > TST-PRJ-002a | IMPLEMENTED |
| SPEC-PRJ-003 | `e2e/prj.spec.ts` > SPEC-PRJ-003 Long-form editing with visible save state > TST-PRJ-003a, TST-PRJ-003b | IMPLEMENTED (the limit case stays an open point, below) |
| SPEC-PRJ-004 | `e2e/prj.spec.ts` > SPEC-PRJ-004 Outline view > TST-PRJ-004a | IMPLEMENTED |
| SPEC-PRJ-005 | `packages/kernel/test/prj-005.test.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005a; `e2e/prj.spec.ts` > SPEC-PRJ-005 Project search > TST-PRJ-005b (added) | IMPLEMENTED |
| SPEC-PRJ-006 | `packages/adapters-node/test/prj-006.test.ts` > SPEC-PRJ-006 Markdown round trip > TST-PRJ-006a, TST-PRJ-006b | IMPLEMENTED |

Implementation: `apps/desktop/src/api.ts` (the contract), `apps/desktop/src/main/service.ts` (the service: one open project on the kernel and the Node adapters), `apps/desktop/src/main/main.ts` and `preload.ts` (the shell and the message channel), `apps/desktop/src/bridge/server.ts` (the HTTP bridge), `apps/desktop/src/renderer/App.tsx`, `client.ts`, `main.tsx`, `styles.css` (the interface), `packages/kernel/src/kernel.ts` (`search`, `adoptUnit`), `packages/adapters-node/src/index.ts` (the round trip through the storage).

## What the implementation decided inside its scope

1. One contract, two transports. `IpeApi` is a list of calls with JSON arguments and results; `API_METHODS` names them once, and both the preload and the bridge build their side from that list. The interface asks `connect()`, which takes `window.ipe` when the preload exposed it and otherwise the bridge named by `?bridge=<url>` or `VITE_BRIDGE`. Errors cross the channel as data (`{ ok: false, error: { code, message } }`) and are rethrown on the interface side with their code, so a conflict, a missing project or a refused folder keeps its meaning.
2. SPEC-PRJ-001, limit case: a folder that holds Markdown files and no manifest is adopted: the service creates the manifest and registers each `.md` file as a unit through `adoptUnit`, in file-name order, and rewrites none of them (TST-PRJ-001b compares the bytes before and after). A folder with neither a project nor Markdown files is refused with code `no_project`; a platform refusal (permissions) comes back with its own code and message.
3. SPEC-PRJ-002: the count the author sees is the number of live objects anchored to the moved unit or to any of its descendants, computed by the service before the move and shown as "moved, N object(s) carried". Anchors rest on unit identifiers, so a move between chapters changes no anchor; the inspector shows them intact after the move (TST-PRJ-002a).
4. SPEC-PRJ-003: the editor is CodeMirror 6 with the Markdown language and the Vim extension (a checkbox, remembered in the browser's storage). A change marks the state unsaved and a save runs 600 ms after the last change; saves run one after the other, never overtaking one another. A save answered as a conflict shows both texts and two gestures: Keep mine (saves with force) and Take the disk version (reloads the unit); nothing is written until the author chooses. A save the platform refuses leaves the state unsaved, keeps the text on screen, shows the reason, and offers Retry; the next change retries as well (TST-PRJ-003b).
5. SPEC-PRJ-004: the outline is the manifest tree with, per unit, rename, move up, move down, move under the previous unit, move out after its parent, and add a child unit; a reorder writes the manifest and nothing else (TST-PRJ-004a compares the unit files before and after).
6. SPEC-PRJ-005: the kernel's `search` is case-insensitive, returns every occurrence in every unit with its offsets and an excerpt, then one hit per live object whose title or body holds the term; the interface lists each hit with its unit's title, and a click selects the passage in the editor or opens the inspector on the object (TST-PRJ-005a at the kernel, TST-PRJ-005b in the browser, added for the panel).
7. SPEC-PRJ-006: the editor holds the text as a string and the storage writes the bytes of that string; no normalisation anywhere. TST-PRJ-006a is a property test: 60 documents assembled at random (seeded) from Markdown pieces, including CRLF, tabs, trailing spaces, raw HTML, math, footnotes and non-Latin text, each written, read back, and reopened byte-identical. TST-PRJ-006b is the corpus of constructs the editor does not render.
8. The Electron shell: `contextIsolation`, `sandbox` and no `nodeIntegration`; the preload exposes `window.ipe` (the channel) and `window.ipeShell` (choose a folder through the native dialog, and the project the application was started on). Started with `IPE_OPEN_PROJECT=<folder>`, the interface opens that project through the channel at once, so that what the window shows and what the service holds never diverge. `IPE_RENDERER_URL` points the window at the Vite server during development; `IPE_BRIDGE_PORT` exposes the bridge from the application for tools that drive it from outside.
9. A failure of the interface itself is shown in words (an error boundary in `main.tsx`), never as a blank page: a page without any channel says so.

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
| criterion 1 | a Node module imported by the interface | renderer-imports.test.ts |

## Known limits, stated

- The save interval is 600 ms of quiet after the last change, a value chosen by this delivery; SPEC-PRJ-003 says "target value, to confirm". The limit case of SPEC-PRJ-003 (a unit of the maximum size, the response bound) is not fixed and not tested by this delivery: the two values are open (below).
- A unit deleted on disk while open is not reported; the next save recreates it. A unit changed on disk while open is detected at the next save, as a conflict, not at the moment of the change: the interface does not watch the file system.
- TST-PRJ-003b makes the project folder unwritable with permission bits; it is skipped on Windows and as root, where permission bits do not refuse a write.
- The Electron smoke test needs a display (`DISPLAY=:0` under WSLg here) and the `--no-sandbox` flag, which it passes itself; a machine without a display cannot run it and must say so.
- The search is a plain substring search, as SPEC-PRJ-005 excludes fuzzy and semantic search; it caps at 200 hits.
- The HTTP bridge listens on the loopback only and sets permissive CORS headers for the Vite page; it is a tool for tests and the later browser surface, not a server to expose.

## Open points that need someone else

1. SCP on SPEC-PRJ-003 (specification change, for the coordinator to file under a reserved number): the three values written "target value, to confirm" need a decision. Draft: the save interval is 600 ms of quiet after the last change (what this delivery implements; its only cost is one write per pause); the maximum unit size and the response bound are to be chosen by the operator, since no measurement in this delivery fixes them (option A: 100 000 characters and 100 ms per keystroke, to measure; option B: leave both open until a long-form user asks). Recommended: option A, with a measurement test added under TST-PRJ-003c once decided.

## For information, no action required

- The design note's `IpeApi` sketch (docs/KERNEL_DESIGN.md Section 7) differs from the delivered contract: drafted in DOC_UPDATE.md for the coordinator.
- The design note names `undo(eventId)` in the interface; the kernel has it, the interface does not expose it yet. It belongs with the review surface of a later milestone.
- `pnpm e2e` is a root script; `pnpm --filter @ipe/desktop start` runs the application on the built files (`apps/desktop/README.md` says how).
- Screenshots under `e2e/screenshots/` are the copies of one run; the tests write theirs under `test-results/screenshots/`, ignored by git, so a verification run leaves the worktree clean.

## Documentation updated

- `apps/desktop/README.md`: created; how to run the application, the bridge, the tests, the environment variables.
- `docs/KERNEL_DESIGN.md` (outside this scope) is now incomplete: Section 7 must carry the delivered contract and the two transports. Drafted in DOC_UPDATE.md for the coordinator at integration.
- `dossier-recette/11_PROJECT_STRUCTURE.md`: statuses, implementation fields and executable references per SPEC_UPDATE.md, with TST-PRJ-005b added. To be applied by the coordinator at integration.
