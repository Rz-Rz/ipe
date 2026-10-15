# ENG-0001: delivery report

## Result

PASS against the definition_of_done of ENG-0001 (four criteria, each with the evidence that proves it):

1. Met: `packages/kernel` is a TypeScript package whose runtime code imports nothing from Node or the DOM (`grep -rn "from \"node:\|require(\|window.\|document." packages/kernel/src` returns nothing; its `tsconfig.json` compiles with `types: []` and `lib: ["ES2022"]`). From the repository root, `pnpm typecheck` passes and `pnpm test` reports 12 files, 36 tests, all passing.
2. Met: every planned test of the eleven requirements exists under its identifier in the title, runs on the in-memory adapters, and passes; five tests were added by the reworks (TST-KER-003g, 003h, 006c, 006d, 007c). The table below names each file and title.
3. Met: the property tests draw their inputs from a seeded generator and use independent oracles: TST-KER-003f and TST-KER-011b take the generator's own record of which passages an edit touched (and the test's own graph walk for dependents) as ground truth; TST-KER-005d checks an invariant on the data and asserts that stale objects and refreshes were observed; TST-KER-014a recounts from the JSON files with its own walk under the requirement's definition; the SHA-256 test is differential against the platform digest on random Unicode strings.
4. Met: this report.

## Rework

### After MAN-ENG-0001-2 (one mark)

- V1: `undo` now refuses an actor other than the author when the undo would change the approval state (the undo of an acceptance or of a rejection), with code `not_author` and a `refused` event recorded; the object is untouched. An undo that leaves the approval state as it is (an edit, a deletion, a refresh) stays open to the actor. Proof: `ker-006.test.ts` > TST-KER-006d. Mutant "a non-author may undo an acceptance or a rejection" falls under it.

### After MAN-ENG-0001-1 (six marks)

Answers to the marks of verdict MAN-ENG-0001-1.

- V1: TST-KER-005d now edits inside the anchored word (operation 0 replaces a middle character, so the passage changes and the object becomes stale), keeps the revert and refresh operations, and asserts at the end that stale objects were observed and that explicit refreshes happened. Proof: `ker-005.test.ts` > TST-KER-005d; the mutant "a non-intact anchor does not make its object stale" falls under it.
- V2: `createObject` refuses an origin `author` from an actor other than the author, with code `not_author` and a `refused` event recorded (`kernel.ts`, createObject). Proof: `ker-006.test.ts` > TST-KER-006c. Mutant "anyone may create an object of origin author" falls.
- V3: the context fallback is bounded (`anchors.ts`): a whole window counts wherever it stands; a surviving part of a window counts only when it is at least 12 characters long, lies within two windows and one passage length of the original range, and keeps its order; the region between the parts may not exceed three passage lengths, or one passage plus two windows. Beyond that, the anchor is orphaned. Proof: `ker-003.test.ts` > TST-KER-003h (the verifier's probe as a test: the passage deleted, both neighbours rewritten, parts of both windows recurring far away with new text between them, reported orphaned). Mutant "surviving window parts matched anywhere, at any distance" falls under it. The known limit and the SPEC-KER-003 reservation are restated below.
- V4: in `createObject`, `editObject`, `accept`, `reject`, `deleteObject`, `undo` and `refresh`, the journal event is written before the object is changed in memory or on disk, and the event enters the in-memory journal only once the disk took it; when the history cannot be written, the action is refused and the object is untouched. Proof: `ker-007.test.ts` > TST-KER-007c (a storage whose journal cannot be written: deletion, acceptance and edit refused, object file byte-identical, no event, nothing to undo after a reopen). Mutant "the tombstone is persisted before its event" falls.
- V5: TST-KER-003g exercises the ambiguous state: two candidates listed, the object invalidated with an `anchorChanges` entry to ambiguous, the object stale, `counts().ambiguous` and `anchorsByState.ambiguous` at 1, `explain` returning no passage, and the anchor back to intact when one copy goes. `explain` returns a passage for an intact or changed anchor only. Mutant "an ambiguous passage is resolved to its first candidate" falls. A dependency on a tombstone is refused (`deleted_dependency`), asserted in TST-KER-013b.
- V6: `Counts.intact`, `changed`, `ambiguous` and `orphaned` count the live objects that carry at least one anchor in the state (an object counts once per state it carries); `Counts.anchorsByState` carries the anchor counts beside. TST-KER-014a walks the files with that definition and holds an object with two intact anchors, so that the two definitions differ. Mutant "states counted per anchor instead of per object" falls.

Also from the verifier's notes: `createObject` refuses an identifier the adapter hands out twice (`duplicate_id`); the comment on `Version.action` no longer lists a relocation, since a move, a rename or a relocation changes the manifest only.

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title.

| Requirement | Tests (file: `packages/kernel/test/…`) | Status the coordinator can set |
|---|---|---|
| SPEC-KER-001 | `ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001a, TST-KER-001b, TST-KER-001c | IMPLEMENTED |
| SPEC-KER-002 | `ker-002.test.ts` > SPEC-KER-002 Provenance record > TST-KER-002a, TST-KER-002b | IMPLEMENTED |
| SPEC-KER-003 | `ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003a to TST-KER-003h | IMPLEMENTED |
| SPEC-KER-004 | `ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004a, TST-KER-004b, TST-KER-004c | IMPLEMENTED |
| SPEC-KER-005 | `ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005a to TST-KER-005d | IMPLEMENTED |
| SPEC-KER-006 | `ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006a, TST-KER-006b, TST-KER-006c, TST-KER-006d | IMPLEMENTED |
| SPEC-KER-007 | `ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007a, TST-KER-007b, TST-KER-007c | IMPLEMENTED |
| SPEC-KER-010 | `ker-010.test.ts` > SPEC-KER-010 Provenance query > TST-KER-010a, TST-KER-010b | IMPLEMENTED |
| SPEC-KER-011 | `ker-011.test.ts` > SPEC-KER-011 Incremental invalidation > TST-KER-011a, TST-KER-011b | IMPLEMENTED |
| SPEC-KER-013 | `ker-013.test.ts` > SPEC-KER-013 Dependencies between objects > TST-KER-013a, TST-KER-013b | IMPLEMENTED |
| SPEC-KER-014 | `ker-014.test.ts` > SPEC-KER-014 Kernel inspection > TST-KER-014a | IMPLEMENTED |

Implementation field for all eleven: `packages/kernel/src/kernel.ts` (anchors in `anchors.ts`, layout and validation in `layout.ts`, model in `types.ts`).

## What the implementation decided inside its scope

1. SPEC-KER-011, "every other object untouched": an object anchored in another unit is byte-identical on disk after the edit (asserted). An object anchored in the edited unit whose anchor stays intact is neither invalidated nor stale, but its context windows are refreshed when they changed, so its file may be rewritten. The test states this interpretation in a comment.
2. The invalidated set is seeded by anchors that go from intact to a non-intact state in this edit, plus their transitive dependents. An anchor already non-intact that degrades further (changed to orphaned) does not invalidate its object again: it already needs re-evaluation.
3. An orphaned anchor comes back only through its exact text: a revert in its unit, or a move to another unit, found once. Text appearing where the passage stood is new text, not the passage. Context windows locate an in-place rewrite only for an anchor that was intact or changed.
4. A changed anchor records the passage its range covers now (field `current`), so that it follows that passage across later edits; the text the object rests on (`text`) is never updated by the kernel.
5. Context windows: a whole window counts wherever it stands; a surviving part of a window counts only when it is at least 12 characters long, near the original range (within two windows and one passage length), in its original order, with a region between the parts of at most three passage lengths or one passage plus two windows. Context locates; it never invents a match.
6. The journal is one JSON object per line, written before the object it describes; `undo` restores the full snapshot an event replaced, for edit, accept, reject, delete and refresh events, including after a reopen.
7. Counts by state are counts of objects; the anchor counts stand beside them under `anchorsByState`.

## Mutants: each property is guarded by a test that falls when the property is broken

Run with the script that injects one mutant at a time in the source, runs the named test file, and restores the source. Every mutant made its test file fail; the source is unchanged afterwards (`git status` clean).

| Requirement | Mutant injected in the source | Test file that falls |
|---|---|---|
| SPEC-KER-001 | a unit's identifier derived from its path instead of a fresh identifier | ker-001.test.ts |
| SPEC-KER-002 | an object without approval state accepted at load | ker-002.test.ts |
| SPEC-KER-003 | a deleted passage reported intact | ker-003.test.ts |
| SPEC-KER-003 | an ambiguous passage resolved to its first candidate | ker-003.test.ts |
| SPEC-KER-003 | surviving window parts matched anywhere, at any distance | ker-003.test.ts |
| SPEC-KER-004 | unit contents not stored by hash | ker-004.test.ts |
| SPEC-KER-005 | a non-intact anchor does not make its object stale | ker-005.test.ts |
| SPEC-KER-006 | anyone may accept or reject | ker-006.test.ts |
| SPEC-KER-006 | anyone may create an object of origin author | ker-006.test.ts |
| SPEC-KER-006 | a non-author may undo an acceptance or a rejection | ker-006.test.ts |
| SPEC-KER-007 | undo restores the current state instead of the previous one | ker-007.test.ts |
| SPEC-KER-007 | the tombstone persisted before its event | ker-007.test.ts |
| SPEC-KER-010 | a dependency cycle accepted | ker-010.test.ts |
| SPEC-KER-011 | dependents not invalidated | ker-011.test.ts |
| SPEC-KER-013 | a dependency on an unknown object accepted | ker-013.test.ts |
| SPEC-KER-014 | tombstones not counted | ker-014.test.ts |
| SPEC-KER-014 | states counted per anchor instead of per object | ker-014.test.ts |

## Known limits, stated

- A passage rewritten so that neither of its context windows survives whole, and no part of 12 characters of them survives near the original range in order, is reported orphaned rather than changed; the author re-anchors the object (edit of its anchors). Conversely, when both whole windows recur elsewhere with new text between them, the anchor follows them as changed: eighty characters of exact context are taken as the passage's place.
- Anchor ranges of an orphaned anchor keep their last known values; they may exceed the current unit length. Readers use the state, not the range, for an orphaned anchor.
- The in-memory adapters are the only adapters delivered; the Node adapters, the documented format and the fault injection belong to ENG-0002.

## Open points that need someone else

One, drafted in full for the coordinator to file under a reserved number (SCP):

**SCP, change of SPEC-KER-006 (vehicle: SCP; decided by the operator).** Intent: say what an edit, a deletion or a refresh of an accepted object by an actor other than the author does, since the requirement rules the approval state only and principle P01 says nothing becomes accepted content by an assistant's action. Scope: the requirement text and coverage of SPEC-KER-006, kernel domain only. Proposed modification, current text: "An object created by the assistant or by an import must enter the project as a proposal, and only an author action must change it to accepted or rejected." New text: the same sentence, followed by "An edit of an accepted object's anchors, title or body by an actor other than the author must return the object to the proposed state; a deletion or a refresh of an accepted object by such an actor must be refused with not_author and recorded." Example: the assistant rewrites the body of an accepted fact; the fact shows as proposed until the author accepts it again; the assistant cannot delete it. Recommendation: accept, because the alternative (an assistant edit leaving the object accepted) lets generated content stand as accepted without an author action; the cost is two cases in the kernel and their tests, inside the kernel domain. Validation: TST-KER-006e (edit by non-author returns to proposed), TST-KER-006f (deletion and refresh by non-author refused).

## For information, no action required

- Identifiers from the sequence adapter are shared by objects, versions and events, so the numbers in a test interleave; the Node adapter will use random identifiers.
- The kernel writes blobs, then objects, then the versions index, then the state, on every save; the Node adapter of ENG-0002 makes each write atomic and the tests of SPEC-KER-012 inject faults between these steps.
- The actor rule of SPEC-KER-006 is applied wherever the approval state can change: creation of an author object, acceptance, rejection, and the undo of either. `editObject`, `deleteObject` and `refresh` do not change the approval state and apply no actor rule; what an edit or a deletion of an accepted object by a non-author actor should do is the SCP drafted under the open points.

## Documentation updated

- `docs/KERNEL_DESIGN.md` is outside this scope and is now incomplete: Section 2 must add the `current` field of an anchor; Section 3 must state the bounded context rule (whole windows anywhere, surviving parts of at least 12 characters near the original range and in order, a bounded region between them), that a changed anchor follows the passage it currently covers, and that an orphaned anchor returns only through its exact text; Section 4 must state the seeding of the invalidated set. To be applied by the coordinator at integration, from this report and DOC_UPDATE.md.
- `dossier-recette/10_PROVENANCE_KERNEL.md`: the test tables of the eleven requirements receive the executable references of the table above and the four added rows, the `Implementation` field receives `packages/kernel/src/kernel.ts`, the status becomes IMPLEMENTED, and the reservations of SPEC_UPDATE.md enter the coverage. To be applied by the coordinator at integration.
