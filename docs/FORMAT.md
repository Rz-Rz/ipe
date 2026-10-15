# Project folder format, version 1

This document describes everything IPE writes inside a project folder, completely enough that a program written from it alone reads a whole project without IPE (SPEC-KER-008). The kernel writes every file through this description; a change to the description is a change to the format and raises the schema version.

## 1. Guarantees

1. A project is one folder. Nothing about the project lives outside it.
2. The manuscript is plain Markdown files, one per unit, readable by any editor. IPE never rewrites a unit's text except through the author's own save.
3. Everything IPE records about the work lives under `.ipe/`, in JSON text files with keys sorted at every level, two-space indentation, and one trailing newline.
4. Every write is atomic: a file is either its previous content or its new content, never a mixture. A save writes blobs, then objects, then the versions index, then the state, in that order; the state is the last consistent snapshot.
5. Unit contents are stored by content hash (SHA-256 of the UTF-8 bytes, lowercase hexadecimal), so every earlier state of every unit is recoverable and identical content is stored once.

## 2. `ipe.json`, the manifest

```json
{
  "name": "My serial",
  "schema": 1,
  "units": [
    { "children": [], "id": "7c6c…", "path": "chapter-1.md", "title": "Chapter 1" }
  ]
}
```

- `schema`: the format version, `1`.
- `name`: the project's name, free text.
- `units`: an ordered tree. Each node: `id` (stable identifier, never reused), `title`, `path` (the unit's Markdown file, relative to the project folder, POSIX separators), `children` (nodes, same shape). Order in the tree is the order of the work.

## 3. Manuscript units

One UTF-8 text file per unit at the manifest's `path`. The content is what the author wrote; IPE adds nothing to it. A unit moved or renamed keeps its `id`; only `path` or `title` changes in the manifest.

## 4. `.ipe/objects/<id>.json`, one object per file

```json
{
  "anchors": [
    { "after": " counted the boats twice.", "before": "The harbour was quiet. ", "candidates": [], "current": null, "end": 40, "start": 23, "state": "intact", "text": "Mara counted the boats twice.", "unit": "7c6c…" }
  ],
  "body": { "about": "the boats" },
  "deleted": false,
  "dependsOn": [],
  "id": "0f2a…",
  "kind": "note",
  "provenance": { "action": "note", "approval": "accepted", "approvedAt": "2026-10-15T20:03:11.000Z", "approvedBy": "author", "createdAt": "2026-10-15T20:03:11.000Z", "origin": "author" },
  "stale": false,
  "title": "note on the boats",
  "version": "9b1e…"
}
```

- `id`: the file name without `.json` and the object's identifier; the two agree, and two files never carry the same `id`.
- `kind`: a short string owned by the feature that created the object (`note`, `fact`, `display`, `check`).
- `title`: free text. `body`: any JSON owned by the creating feature; `null` when none.
- `anchors`: the passages the object rests on. Each: `unit` (a unit `id`), `start` and `end` (character offsets in the unit's text, `end` exclusive), `text` (the exact passage the object rests on; never changed by IPE's own re-resolution), `before` and `after` (up to 40 characters of context on each side), `state` (one of `intact`, `changed`, `ambiguous`, `orphaned`), `candidates` (for `ambiguous`: the places the passage was found, each `{ unit, start, end }`), `current` (for `changed`: the passage the range covers now; `null` otherwise).
- `dependsOn`: identifiers of objects this one was derived from. The graph has no cycle.
- `provenance`: `origin` (one of `author`, `assistant`, `import`), `action` (the action that created it, free short string), `createdAt` (ISO-8601 UTC), `approval` (one of `proposed`, `accepted`, `rejected`), `approvedAt` and `approvedBy` (ISO-8601 and actor name, or `null`).
- `version`: the identifier of the manuscript version the object rests on (Section 5).
- `stale`: `true` when a passage the object rests on changed since that version, or a dependency is stale.
- `deleted`: `true` for a tombstone. A deleted object is kept, excluded from the live counts, and restorable.

A file under `.ipe/objects/` that is not valid JSON is reported by name when the project opens and skipped; the other objects load. A file that is JSON but breaks this description (a field missing, a value outside its enumeration) refuses the project with the file named.

## 5. `.ipe/versions/index.json` and `.ipe/versions/blobs/`

`index.json` is an array, oldest first:

```json
[
  { "action": "create", "at": "2026-10-15T20:00:00.000Z", "id": "a1…", "units": {} },
  { "action": "write", "at": "2026-10-15T20:03:00.000Z", "id": "9b1e…", "units": { "7c6c…": "e3b0c442…" } }
]
```

- `id`: the version identifier objects refer to. `at`: ISO-8601 UTC. `action`: what produced it (`create`, `write`, `external`, `add-unit`).
- `units`: for every unit at that moment, its content hash.

An `index.json` that cannot be read is kept, as found, under `index.json.unreadable-<time>` before a fresh index replaces it at the next save; a reader may ignore those files.

`blobs/<hash>` holds the UTF-8 content whose SHA-256 is `<hash>`. To read a unit as it stood in a version: take the hash under `units` for that unit, read the blob. A version that names a hash without a blob is reported as unverifiable, and kept.

## 6. `.ipe/journal.jsonl`, the events

One JSON object per line, appended, never rewritten:

```json
{"id":"…","at":"2026-10-15T20:04:00.000Z","kind":"accept","actor":"author","objectId":"0f2a…","before":{…object…},"after":{…object…},"note":null}
```

- `kind`: one of `create`, `edit`, `accept`, `reject`, `delete`, `undo`, `refresh`, `refused`.
- `before` and `after`: full snapshots of the object (Section 4), or `null`. Undo restores `before`.
- A line that is not JSON is skipped and counted when the project opens.

## 7. `.ipe/state.json`, the last consistent state

```json
{ "schema": 1, "units": { "7c6c…": "e3b0c442…" }, "version": "9b1e…" }
```

Written last by every save. `units` holds the content hash of every unit as last saved; `version` names the last version recorded. When a unit file's hash differs from `units` at opening, the unit was edited outside IPE (or a save was interrupted before the state was written): IPE keeps the file's content, reports the unit, and re-resolves the anchors that rest on it. When the index holds a version newer than `version`, a save was interrupted after the index was written: IPE reports it and rewrites the state.

## 8. Reading a project without IPE

1. Read `ipe.json`; walk `units` to list the units and their files.
2. Read each unit file as UTF-8 text.
3. List `.ipe/objects/`; parse each `*.json`; a passage is `unit text`.slice(`start`, `end`) for an anchor in state `intact` or `changed`.
4. Read `.ipe/versions/index.json`; for any version and unit, read `.ipe/versions/blobs/<hash>`.
5. Read `.ipe/journal.jsonl` line by line for the history of each object.
6. Read `.ipe/state.json` to know whether the folder is consistent with the last save.

Nothing else is needed. The test `TST-KER-008a` is such a reader, written from this document, and it reads a project IPE wrote.

## 9. Compatibility

`schema` is `1` in the manifest and in the state. A reader that meets a higher number stops and says so. Fields are only ever added within a schema version; a field removed or changed in meaning raises the version.
