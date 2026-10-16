# ENG-0003: documentation impacts, one block per requirement

A block with `impact :` names what a document outside the scope of this session must say now; the coordinator applies it at integration. A block with `sans_impact :` states why no document changes. `apps/desktop/README.md` lies inside the scope and was written by this delivery.

## SPEC-PRJ-001

impact : docs/KERNEL_DESIGN.md, Section 7: replace the `IpeApi` sketch by the delivered contract of `apps/desktop/src/api.ts`: `createProject(root, name)`, `openProject(root)` (a folder of Markdown files without manifest is adopted, nothing rewritten), `current()`, `readUnit(unitId)` (text and content hash), `writeUnit(unitId, text, { force? })` (a `SaveResult` or a `ConflictResult` carrying both texts), `addUnit`, `renameUnit`, `moveUnit` (the units and the count carried), `search`, `objects`, `createObject`, `acceptObject`, `rejectObject`, `explain`, `counts`, `versions`. State the two transports: Electron's message channel through the preload (`window.ipe`, `contextIsolation` and `sandbox` on, no `nodeIntegration`), and the local HTTP bridge (`POST /api/<method>` with `{ "args": [...] }`, `GET /health`, loopback only), the renderer taking the bridge from `?bridge=<url>` or `VITE_BRIDGE`. Name the environment variables `IPE_OPEN_PROJECT`, `IPE_RENDERER_URL` and `IPE_BRIDGE_PORT`. A README at the repository root does not exist; the coordinator may add one that points to `apps/desktop/README.md`.

## SPEC-PRJ-002

impact : docs/KERNEL_DESIGN.md, Section 7: `moveUnit` returns the count of live objects anchored to the moved unit or its descendants, which the interface shows as "moved, N object(s) carried"; anchors rest on unit identifiers, so the move itself re-resolves nothing.

## SPEC-PRJ-003

impact : docs/KERNEL_DESIGN.md, Section 7: the save state is one of saved, unsaved, conflict; a save runs 600 ms after the last change and saves run one after the other; a refused save leaves unsaved with the reason and a Retry; a conflict shows both texts with Keep mine (force) and Take the disk version (reload). The editor is CodeMirror 6 with Markdown and the Vim extension behind a checkbox.

## SPEC-PRJ-004

sans_impact : the outline the design note describes (the manifest tree, reorderable) is what was delivered; the gestures (rename, move up, move down, move under the previous unit, move out after its parent, add a child unit) are details of the interface, not of the design.

## SPEC-PRJ-005

impact : docs/KERNEL_DESIGN.md, Section 7: a hit in a unit selects the passage in the editor; a hit in an object opens the inspector on that object; the kernel's `search` is case-insensitive and capped at 200 hits.

## SPEC-PRJ-006

sans_impact : the editor edits the Markdown text as a string and the storage writes its bytes; the design note already says the units are plain Markdown files that IPE never rewrites except through the author's save.
