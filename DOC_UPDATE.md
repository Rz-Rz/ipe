# ENG-0003: documentation impacts, one block per requirement

A block with `impact :` names what a document outside the scope of this session must say now; the coordinator applies it at integration. A block with `sans_impact :` states why no document changes. `apps/desktop/README.md` lies inside the scope and was written by this delivery.

## SPEC-PRJ-001

impact : docs/KERNEL_DESIGN.md, Section 7: replace the `IpeApi` sketch by the delivered contract of `apps/desktop/src/api.ts`: `createProject(root, name)`, `openProject(root)` (a folder of Markdown files without manifest is adopted, nothing rewritten), `current()`, `readUnit(unitId)` (text and content hash), `writeUnit(unitId, text, { force? })` (a `SaveResult` or a `ConflictResult` carrying both texts), `takeDisk(unitId)` (the disk's text taken as the unit's text after a conflict), `addUnit`, `renameUnit`, `moveUnit` (the units and the count of live objects carried, descendants included), `search` (the first 200 hits and the total), `objects`, `createObject`, `acceptObject`, `rejectObject`, `deleteObject`, `explain`, `counts`, `versions`. State the two transports: Electron's message channel through the preload (`window.ipe`, `contextIsolation` and `sandbox` on, no `nodeIntegration`), and the local HTTP bridge (`POST /api/<method>` with `{ "args": [...] }`, `GET /health`, loopback only), the renderer taking the bridge from `?bridge=<url>` or `VITE_BRIDGE`. Name the environment variables `IPE_OPEN_PROJECT`, `IPE_RENDERER_URL` and `IPE_BRIDGE_PORT`. A README at the repository root does not exist; the coordinator may add one that points to `apps/desktop/README.md`.

## SPEC-PRJ-002

impact : docs/KERNEL_DESIGN.md, Section 7: `moveUnit` returns the count of live objects anchored to the moved unit or its descendants, which the interface shows as "moved, N object(s) carried"; anchors rest on unit identifiers, so the move itself re-resolves nothing.

## SPEC-PRJ-003

impact : docs/KERNEL_DESIGN.md, Section 7: the save state is one of saved, unsaved, conflict; a change schedules one save bound to its unit and its text, 600 ms after the last change, cancelled by a reverted edit and flushed before another unit shows; saves run one after the other; a refused save leaves unsaved with the reason and a Retry, and the author stays on the unit; a conflict shows both texts with Keep mine (force) and Take the disk version (the kernel's `takeExternal`: the disk's text taken, re-anchored, an external version recorded). The editor is CodeMirror 6 with Markdown and the Vim extension behind a checkbox; it splits and joins a unit on the unit's own line break (CRLF when uniform, LF otherwise) and keeps every other byte as a character, so every unit comes back byte-identical; a line break the author types follows that separator, and a mixed unit is announced.

## SPEC-PRJ-004

sans_impact : the outline the design note describes (the manifest tree, reorderable) is what was delivered; the gestures (rename, move up, move down, move under the previous unit, move out after its parent, add a child unit) are details of the interface, not of the design.

## SPEC-PRJ-005

impact : docs/KERNEL_DESIGN.md, Section 7: a hit in a unit selects the passage in the editor (positions mapped for CRLF units); a hit in an object opens the inspector on that object; the kernel's `search` is case-insensitive and returns every occurrence; the service returns the first 200 with the total, and the interface says when the list was cut.

## SPEC-PRJ-006

impact : docs/KERNEL_DESIGN.md, Section 7 (with SPEC-PRJ-003 above): the line-ending rule of the editor, every unit byte-identical through it, a typed line break following the unit's separator, mixed units announced. Section 5 already says the units are plain Markdown files that IPE never rewrites except through the author's save; a load into the editor is no save.
