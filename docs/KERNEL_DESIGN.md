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
- **Anchor**: `{ unit, start, end, text, before, after, state, candidates }`. `text` is the exact passage; `before` and `after` are short context windows. `state` is one of intact, changed, ambiguous, orphaned.
- **Version**: `{ id, at, units: { unitId: contentHash } }`. Unit contents are stored content-addressed under `.ipe/versions/blobs/<hash>`, so any earlier state of any unit is recoverable and identical content is stored once.
- **Event**: every change to an object appends `{ at, kind, objectId, before, after }` to `.ipe/journal.jsonl`; undo replays `before`. Deletion is a tombstone (`deleted: true`), never a removal; a purge is a separate explicit action.

## 3. Anchors across edits (SPEC-KER-003)

When a unit's text changes, from the editor or from the disk, the kernel re-resolves every anchor of that unit against the old text (from the version store) and the new text:

1. Compute a diff between old and new text. Map the anchor's range through the diff.
2. If the mapped range holds the same `text`: intact (the passage may have moved inside the unit).
3. If the range survived with edits inside it: changed, with the new range.
4. If the range was deleted: search the exact `text` in every unit of the project. One match: intact, re-anchored to that unit. Several matches: ambiguous, with the candidates listed. No match: orphaned.
5. Context (`before`, `after`) breaks ties among identical passages; it never invents a match.

An anchor is never deleted by the kernel. The object keeps it, in its state, until the author acts.

## 4. Staleness and invalidation (SPEC-KER-005, SPEC-KER-011, SPEC-KER-013)

After a batch of unit changes, the kernel re-resolves anchors, then marks stale every object with an anchor in state changed, ambiguous or orphaned, and propagates staleness along `dependsOn` transitively. The set of objects marked, plus the dependents, is the invalidated set the kernel returns; every other object file is untouched, byte for byte. An object becomes current again when its domain re-evaluates it and records the new version, or when its anchors are all intact again with the text identical to the one the object rests on.

## 5. On-disk layout (SPEC-KER-008, documented format)

```
<project>/
  ipe.json                 manifest: units tree, identifiers, paths; schema version
  <unit>.md                manuscript units, Markdown, wherever the manifest points
  .ipe/
    objects/<id>.json      one object per file, pretty-printed JSON
    versions/index.json    the versions, newest last
    versions/blobs/<hash>  unit contents, content-addressed (sha-256)
    journal.jsonl          append-only events
    state.json             the last consistent state: version id, unit hashes, written last
```

Every write is atomic (temporary file, then rename). A save writes blobs, then objects, then the versions index, then `state.json`. At open, the kernel compares the unit hashes on disk with `state.json`: a difference is an external edit (SPEC-KER-009) or an interrupted save (SPEC-KER-012); both are reported, neither is overwritten. An independent reader in the test suite reads the whole store from this description alone.

## 6. Adapters

```ts
interface Storage { read(path): Promise<string | null>; write(path, text): Promise<void>; list(dir): Promise<string[]>; remove(path): Promise<void>; exists(path): Promise<boolean> }
interface Clock { now(): string }       // ISO-8601
interface Ids { next(): string }         // unique, sortable
interface Hash { sha256(text): string }
```

`write` is atomic by contract. The kernel takes `{ storage, clock, ids, hash }` at construction and nothing else.

## 7. Interface (SPEC-PRJ-001 to 006)

The renderer shows an outline (the manifest tree, reorderable), an editor (CodeMirror 6 with Markdown and the Vim extension available), a save state indicator (saved, unsaved, conflict), a search panel, and an inspector that answers the provenance query for any object. It calls `IpeApi` only:

```ts
interface IpeApi {
  openProject(path): Promise<ProjectView>;
  readUnit(unitId): Promise<string>;
  writeUnit(unitId, text): Promise<SaveResult>;        // returns invalidated objects and anchor changes
  moveUnit(unitId, parentId, index): Promise<ProjectView>;
  search(term): Promise<Hit[]>;
  objects(filter?): Promise<ObjectSummary[]>;
  explain(objectId): Promise<ProvenanceChain>;
  counts(): Promise<Counts>;
  accept(objectId) / reject(objectId) / undo(eventId)
}
```

## 8. Tests

Kernel tests run on an in-memory storage adapter; adapter tests run on a temporary folder; interface tests run with Playwright against the interface served by Vite with the HTTP bridge; the Electron launch is a smoke test under the display available on the machine. The planned tests of each requirement are listed in the requirements folder and are the definition of done of the commitments.
