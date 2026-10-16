# ENG-0002: delivery report

## Result

PASS against the definition_of_done of ENG-0002 (three criteria, each with the evidence that proves it):

1. Met: `docs/FORMAT.md` documents the project folder (manifest, Markdown units, `.ipe/objects`, versions index and blobs, journal, state, the write order, the atomicity contract, how to read without IPE). TST-KER-008a is an independent reader written from that document alone, with the file system only, and it reads a whole project IPE wrote: name, units and their texts, every object with its anchors checked against the texts, the versions and their blobs, the state, the journal.
2. Met: `packages/adapters-node` implements the kernel's adapters on Node: a storage rooted at the project folder with atomic writes (temporary file in the same folder, then one rename), append, list, remove, exists; the system clock; random identifiers; the platform digest; with `createProject` and `openProject`. The tests TST-KER-008a to 008c, TST-KER-009a to 009c and TST-KER-012a to 012c exist under their names on temporary folders and pass: the fault injection at each step of a save (TST-KER-012a, the number of steps measured on a clean run, every step tried), the full-disk simulation (TST-KER-012b), and a crash after the temporary file and before the rename (TST-KER-012c, added).
3. Met: this report.

From the repository root, `pnpm typecheck` passes and `pnpm test` reports 16 files, 48 tests, all passing (kernel 38, adapters 10).

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title.

| Requirement | Tests (file: `packages/adapters-node/test/…`) | Status the coordinator can set |
|---|---|---|
| SPEC-KER-008 | `ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008a, TST-KER-008b, TST-KER-008c, TST-KER-008d | IMPLEMENTED |
| SPEC-KER-009 | `ker-009.test.ts` > SPEC-KER-009 External edits are never discarded > TST-KER-009a, TST-KER-009b, TST-KER-009c | IMPLEMENTED |
| SPEC-KER-012 | `ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012a, TST-KER-012b, TST-KER-012c | IMPLEMENTED |

Implementation: `packages/adapters-node/src/index.ts` (the adapters, `createProject`, `openProject`) and `packages/kernel/src/kernel.ts` (unreadable object files reported, conflict detection, `externalText`, the unreadable index kept). The format: `docs/FORMAT.md`.

## What the implementation decided inside its scope

1. SPEC-KER-008, error case: an object file that is not JSON is reported by its path in `openReport.unreadableObjects` and skipped; the other objects load. A file that is JSON but breaks the format still refuses the project with the file named, so that SPEC-KER-002's error case keeps its force. TST-KER-008c proves the first, TST-KER-002b the second.
2. SPEC-KER-009: conflicts are detected by content, never by a timestamp. Before a save, the kernel reads the unit's file and compares it with the text it last read or wrote; a difference refuses the save with code `conflict` unless `force` is given, and `externalText(unitId)` returns the disk text so that the interface can show both. The cost is one file read per save. TST-KER-009b and TST-KER-009c.
3. SPEC-KER-009 at opening: a unit whose hash on disk differs from the last consistent state is an external edit; its content is kept, the anchors that rest on it are re-resolved, a version with action `external` is recorded, and the report names the unit and the anchor changes. TST-KER-009a.
4. SPEC-KER-012: a save writes the unit file, then the objects, then the blob, then the versions index, then the state. After a fault at any of these steps, the project reopens in a consistent state: the unit is whole (the old text or the new one, never a mixture), every object file parses, a new text without its state is reported as an external change or an interruption and absorbed, and a second opening reports nothing. TST-KER-012a.
5. The Node storage's rename step is a method of its own (`moveIntoPlace`), so that a test can make the crash happen between the temporary file and the rename; a failure there removes the temporary file and leaves the target untouched. TST-KER-012c. The mutant that writes the target in place falls under it.
6. From the first verifier's note on ENG-0001: an unreadable versions index is kept, as found, under `index.json.unreadable-<time>` before a fresh index replaces it at the next save. TST-KER-004c (kernel) extended; the format says so.
7. `listObjects` returns a stable order, creation time then identifier, the same in memory and after a reopen; the order used to follow the load order of the files, which random identifiers scramble. TST-KER-008b showed it.
8. Groundwork for ENG-0003, inside the kernel: `adoptUnit` registers an existing Markdown file as a unit without rewriting it, proved by `packages/kernel/test/adopt.test.ts`; `writeUnit` takes an options argument (`force`).

## Mutants: each property is guarded by a test that falls when the property is broken

Run with the script that injects one mutant at a time, runs the named test file from its package, and restores the source. Every mutant made its test file fail; the sources are unchanged afterwards.

| Requirement | Mutant injected in the source | Test file that falls |
|---|---|---|
| SPEC-KER-008 | an object file that is not JSON refuses the whole project | ker-008.test.ts |
| SPEC-KER-008 | objects written under a name the format does not document | ker-008.test.ts |
| SPEC-KER-009 | a save overwrites a unit changed on disk without a word | ker-009.test.ts |
| SPEC-KER-009 | an external edit is not detected at opening | ker-009.test.ts |
| SPEC-KER-012 | the target written in place, not through a renamed temporary file | ker-012.test.ts |
| SPEC-KER-012 | a failed write leaves its temporary file behind | ker-012.test.ts |
| SPEC-KER-004 | an unreadable versions index overwritten without a copy | ker-004.test.ts (kernel) |
| SPEC-KER-012 | the in-memory text replaced before the storage write (rework, V1) | ker-012.test.ts |
| SPEC-KER-008 | the count of skipped journal lines discarded at opening (rework, V5) | ker-008.test.ts |

## Rework

Answers to the marks of `.eng/REWORK.md` (MAN-ENG-0002-1, minor reject), each with the change and the test that proves it.

- V1: `writeUnit` now writes the unit's file first and replaces the kernel's text only once the storage accepted the write (`packages/kernel/src/kernel.ts`, writeUnit). After a refused write the kernel holds the disk's text: `externalText` answers null, the retry is an ordinary save, and the author's text lands. TST-KER-012b (`packages/adapters-node/test/ker-012.test.ts`) now goes on in the same kernel after the ENOSPC refusal: it asserts the text held, the null `externalText`, the retried save, the file on disk, and the reopened project holding the author's text. The mutant that sets the text before the write falls under it.
- V2: `docs/FORMAT.md` Section 1, item 4 states the order the kernel follows: the unit's file, then the objects it touched, then the blob, then the versions index, then the state. The header comment of `packages/kernel/src/kernel.ts` states the same order. TST-KER-012a counts the five steps; TST-KER-008a reads the store.
- V3: `docs/FORMAT.md` Section 5 enumerates `adopt-unit` with the other version actions, each with what produces it. `packages/kernel/test/adopt.test.ts` records such a version; TST-KER-008a reads the index.
- V4: `docs/FORMAT.md` Section 1, item 3 excepts the journal: one compact JSON object per line, keys in the order the kernel writes them, as Section 6 shows. TST-KER-008a parses the journal line by line.
- V5: the count of skipped journal lines is reported: `OpenReport.journalLinesSkipped` (`packages/kernel/src/types.ts`), set by `Kernel.open` from `parseEvents`. `docs/FORMAT.md` Section 6 says so. TST-KER-008d (added) cuts the last journal line in half, reopens, and asserts a count of 1 with every complete event kept. The mutant that discards the count falls under it.
- V6: `docs/FORMAT.md` Section 1, item 4 names the `<target>.<pid>.<time>.<random>.tmp` file an interrupted write can leave, and Section 8 tells a reader to ignore every file whose name ends in `.tmp`; the kernel lists only `*.json` under the objects folder. TST-KER-012c asserts no temporary file after a failed write.

## Known limits, stated

- The journal is appended with the platform's append, not through a renamed temporary file. A crash in the middle of an append leaves a truncated last line, which the reader skips, the count being reported at opening (`journalLinesSkipped`); since the event is written before the object, the action it described was not performed, and the project stays consistent. An append that succeeded before a failed object write leaves an event whose `after` snapshot the object does not show; undoing it restores the state the object already has.
- TST-KER-012a injects faults in the storage adapter, between the kernel's steps; TST-KER-012c covers the step between the temporary file and the rename. A crash of the operating system during the rename itself relies on the file system's guarantee, which is not tested here.
- The full-disk case is simulated by an adapter error carrying `ENOSPC`, not by a full file system.
- The conflict check reads the unit's file at every save; on a slow disk this is the cost of never overwriting an external edit.

## Open points that need someone else

None. No requirement, milestone, interface or scope needed a change.

## For information, no action required

- The Node identifiers are random UUIDs, so objects, versions and events no longer interleave their numbers as the sequence adapter of the kernel tests does.
- The interface of ENG-0003 shows a conflict with both texts (the kernel returns them) and offers to keep the author's or take the disk's.
- `pnpm-lock.yaml` changed for the new workspace package only.

## Documentation updated

- `docs/FORMAT.md`: created; the on-disk format, version 1, with the preserved unreadable index; corrected at rework (write order, `adopt-unit`, journal line shape, skipped-line count, temporary files).
- `docs/KERNEL_DESIGN.md` (outside this scope) is now incomplete: Section 5 must add that an unreadable index is kept under another name and that object files that are not JSON are reported and skipped; Section 6 may name the rename step of the Node storage; Section 7 must add that `writeUnit` refuses a conflict unless forced, that `externalText` returns the disk text, and that the opening report carries `journalLinesSkipped`. Drafted in DOC_UPDATE.md for the coordinator at integration.
- `dossier-recette/10_PROVENANCE_KERNEL.md`: statuses, implementation fields and executable references per SPEC_UPDATE.md; the SPEC-KER-004 degraded case gains the kept copy. To be applied by the coordinator at integration.
