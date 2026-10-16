# Provenance kernel: design note

Design document for milestone J-KER. It explains how the requirements of domains KER and PRJ are met under ADR-0003. It redefines no requirement; where it conflicts with the requirements folder, the folder wins.

## 1. Packages

| Package | Content | Dependencies |
|---|---|---|
| `packages/kernel` | The kernel: project model, objects, anchors, versions, staleness, invalidation, queries, on-disk layout. Pure TypeScript: no Node module, no DOM. | none at runtime |
| `packages/adapters-node` | The adapters the kernel declares, implemented on Node: storage with atomic writes, clock, identifiers. | `node:fs`, `node:path`, `node:crypto` |
| `apps/desktop` | The Electron shell (main process hosts the kernel on the Node adapter) and the React interface (renderer, no Node import), joined by one message channel. | electron, react, vite, codemirror |

The interface reaches the kernel through one typed interface, `IpeApi`, carried by Electron's message channel in the application and by a local HTTP bridge for end-to-end tests and for the later browser surface. The interface code is the same in both cases.

## 2. Model

- **Project**: a folder. `ipe.json` is the manifest: the ordered tree of manuscript units, each with a stable identifier and a relative path to its Markdown file. `.ipe/` holds everything the kernel records.
- **Manuscript unit**: one Markdown file. Identified by its manifest identifier, never by its path.
- **Object**: `{ id, kind, title, body, anchors, dependsOn, provenance, version, stale, deleted }`. `kind` is a short string owned by the domain that creates it (`note`, `fact`, later `display`, `check`). `body` is JSON owned by that domain. `version` is the manuscript version the object rests on.
- **Provenance**: `{ origin: author | assistant | import, action, createdAt, approval: proposed | accepted | rejected, approvedAt }`.
- **Anchor**: `{ unit, start, end, text, before, after, state, candidates, current }`. `text` is the exact passage the object rests on, never updated by re-resolution; `before` and `after` are short context windows; `state` is one of intact, changed, ambiguous, orphaned; `current` is, for a changed anchor, the passage its range covers now, null otherwise.
- **Version**: `{ id, at, units: { unitId: contentHash } }`. Unit contents are stored content-addressed under `.ipe/versions/blobs/<hash>`, so any earlier state of any unit is recoverable and identical content is stored once.
- **Event**: every change to an object appends `{ at, kind, objectId, before, after }` to `.ipe/journal.jsonl`; undo replays `before`. Deletion is a tombstone (`deleted: true`), never a removal; a purge is a separate explicit action.

## 3. Anchors across edits (SPEC-KER-003)

When a unit's text changes, from the editor or from the disk, the kernel re-resolves every anchor of that unit against the old text (from the version store) and the new text:

1. Compute a diff between old and new text. Map the anchor's range through the diff.
2. If the mapped range holds the same `text`: intact (the passage may have moved inside the unit).
3. If the range survived with edits inside it: changed, with the new range.
4. If the range was deleted: search the exact `text` in every unit of the project. One match: intact, re-anchored to that unit. Several matches: ambiguous, with the candidates listed. No match: orphaned.
5. Context (`before`, `after`) breaks ties among identical passages and locates an in-place rewrite: a whole window counts wherever it stands; a surviving part of a window counts only when it is at least 12 characters long, lies within two windows and one passage length of the original range and keeps its order, with a region between the parts of at most three passage lengths or one passage plus two windows. Context locates; it never invents a match.
6. A changed anchor follows the passage it currently covers (`current`) across later edits, still changed against the text it rests on.
7. An orphaned anchor returns only through its exact text: a revert in its unit, or a move to another unit found once. Text that appears where its passage stood is new text, not the passage.

An anchor is never deleted by the kernel. The object keeps it, in its state, until the author acts.

## 4. Staleness and invalidation (SPEC-KER-005, SPEC-KER-011, SPEC-KER-013)

After a batch of unit changes, the kernel re-resolves anchors, then marks stale every object with an anchor in state changed, ambiguous or orphaned, and propagates staleness along `dependsOn` transitively. The invalidated set the kernel returns is seeded by the anchors that go from intact to a non-intact state in the edit, plus their transitive dependents; an anchor already non-intact that degrades further does not invalidate its object again. An object anchored in the edited unit whose anchor stays intact is neither invalidated nor stale, though its context windows may be refreshed on disk; an object anchored elsewhere is untouched, byte for byte. An object becomes current again when its domain re-evaluates it and records the new version, or when its anchors are all intact again with the text identical to the one the object rests on.

## 5. On-disk layout (SPEC-KER-008, documented format)

```
<project>/
  ipe.json                 manifest: units tree, identifiers, paths; schema version
  <unit>.md                manuscript units, Markdown, wherever the manifest points
  .ipe/
    objects/<id>.json      one object per file, pretty-printed JSON
    versions/index.json    the versions, newest last; an unreadable one is kept as index.json.unreadable-<time>
    versions/blobs/<hash>  unit contents, content-addressed (sha-256)
    journal.jsonl          append-only events
    state.json             the last consistent state: version id, unit hashes, written last
```

The format is specified by `docs/FORMAT.md` (version 1), the authority for every file the kernel writes. Every write is atomic (temporary file, then rename). A save writes the unit file, then the objects, then the blob, then the versions index, then `state.json`, so that an interruption at any step leaves the last consistent state. At open, the kernel compares the unit hashes on disk with `state.json`: a difference is an external edit (SPEC-KER-009) or an interrupted save (SPEC-KER-012); the content on disk is kept, the anchors that rest on it are re-resolved, a version with action `external` is recorded, and the unit and the anchor changes are reported. An object file that is not JSON is reported by its path and skipped; a file that breaks the format refuses the project. An unreadable versions index is kept under another name before a fresh one replaces it; a journal line that is not an event is skipped and counted in the opening report (`journalLinesSkipped`); a file whose name ends in `.tmp`, left by an interrupted write, is ignored. An independent reader in the test suite reads the whole store from `docs/FORMAT.md` alone.

## 6. Adapters

```ts
interface Storage { read(path): Promise<string | null>; write(path, text): Promise<void>; append?(path, text): Promise<void>; list(dir): Promise<string[]>; remove(path): Promise<void>; exists(path): Promise<boolean> }
interface Clock { now(): string }       // ISO-8601
interface Ids { next(): string }         // unique, sortable
interface Hash { sha256(text): string }
```

`write` is atomic by contract. The Node storage (`packages/adapters-node`) writes through a temporary file in the same folder and one rename (`moveIntoPlace`), removes the temporary file on failure, and appends the journal with the platform's append. The kernel takes `{ storage, clock, ids, hash }` at construction and nothing else; `hash` defaults to the kernel's own SHA-256.

## 7. Interface (SPEC-PRJ-001 to 006)

The interface (`apps/desktop/src/renderer/`) shows an outline (the manifest tree, reorderable: rename, move up, move down, move under the previous unit, move out after its parent, add a child unit), an editor (CodeMirror 6 with Markdown and the Vim extension behind a checkbox), a save state indicator, a search panel, and an inspector that answers the provenance query for any object. It imports no Node, Electron or adapter module, the kernel as types only, and calls the one contract of `apps/desktop/src/api.ts`:

```ts
interface IpeApi {
  createProject(root, name): Promise<ProjectView>;              // the folder is created when absent and must hold no project
  openProject(root): Promise<ProjectView>;                      // a folder of Markdown files without manifest is adopted, nothing rewritten
  current(): Promise<ProjectView | null>;
  readUnit(unitId): Promise<UnitText>;                          // the text and its content hash
  writeUnit(unitId, text, { force? }): Promise<SaveResult | ConflictResult>;   // a conflict carries both texts; force keeps the author's
  takeDisk(unitId): Promise<UnitText>;                          // the disk's text taken as the unit's text after a conflict (kernel takeExternal)
  addUnit(title, parentId): Promise<UnitNode>;
  renameUnit(unitId, title): Promise<UnitNode[]>;
  moveUnit(unitId, parentId, index): Promise<MoveResult>;       // the units, and the count of live objects the move carried, descendants included
  search(term): Promise<SearchResult>;                          // the first 200 hits and the total; the kernel returns every occurrence
  objects(): Promise<IpeObject[]>;
  createObject(input, actor): Promise<IpeObject>;
  acceptObject(objectId) / rejectObject(objectId): Promise<IpeObject>;
  deleteObject(objectId): Promise<void>;                        // a tombstone, as the author
  explain(objectId): Promise<ProvenanceChain>;
  counts(): Promise<Counts>;                                    // counts by anchor state are counts of objects; anchor counts stand beside
  versions(): Promise<Version[]>;
}
```

The contract is carried by two transports that run the same service (`apps/desktop/src/main/service.ts`, one open project on the kernel and the Node adapters). In the application, Electron's message channel: the preload exposes `window.ipe`, one function per call, with `contextIsolation` and `sandbox` on and no `nodeIntegration`; `window.ipeShell` adds the native folder dialog and the project the application was started on (`IPE_OPEN_PROJECT`). For the tests and for a browser, a local HTTP bridge on the loopback (`POST /api/<method>` with `{ "args": [...] }`, `GET /health`), which the page takes from `?bridge=<url>` or `VITE_BRIDGE`. Errors cross both transports as data (`{ ok: false, error: { code, message } }`) and keep their code on the interface side. `IPE_RENDERER_URL` points the window at the Vite server during development; `IPE_BRIDGE_PORT` exposes the bridge from the application.

The save state is one of saved, unsaved, conflict. A change marks the unit unsaved and schedules one save, bound to the unit and the text of that change, 600 ms after the last change; an edit reverted within the interval cancels it; a unit is left only once its pending save ran, and the author stays on a unit whose save is refused or in conflict; saves run one after the other; a load of a unit into the editor schedules nothing. A save answered as a conflict shows both texts and two gestures, Keep mine (saves with force) and Take the disk version (the kernel's `takeExternal`: the disk's text taken, re-anchored, an external version recorded); nothing is written until the author chooses. A save the platform refuses leaves the state unsaved, keeps the text on screen, shows the reason and offers Retry; the next change retries as well. The editor splits and joins a unit on the unit's own line break (CRLF when every line break is CRLF, LF otherwise) and keeps every other byte as a character, so every unit comes back byte-identical; a line break the author types follows that separator; a unit that mixes line endings is announced. A hit of the search in a unit selects the passage in the editor (positions mapped for CRLF units); a hit in an object opens the inspector on it; when the list was cut, the panel says how many hits there are in all. A rename is an input in place in the outline. The kernel's `undo` is not exposed by this interface yet; it belongs with the review surface of a later milestone.

## 8. Tests

Kernel tests run on an in-memory storage adapter; adapter tests run on a temporary folder; interface tests run with Playwright against the interface served by Vite with the HTTP bridge; the Electron launch is a smoke test under the display available on the machine. The planned tests of each requirement are listed in the requirements folder and are the definition of done of the commitments.
