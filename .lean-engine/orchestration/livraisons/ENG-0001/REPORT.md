# ENG-0001: delivery report

## Result

PASS

1. Met: `packages/kernel` is a TypeScript package whose runtime code imports nothing from Node or the DOM (`grep -rn "from \"node:\|require(\|window.\|document." packages/kernel/src` returns nothing; its `tsconfig.json` compiles with `types: []` and `lib: ["ES2022"]`). From the repository root, `pnpm typecheck` passes and `pnpm test` reports 12 files, 31 tests, all passing.
2. Met: every planned test of the eleven requirements exists under its identifier in the title, runs on the in-memory adapters, and passes. The table below names each file and title.
3. Met: the property tests draw their inputs from a seeded generator and use independent oracles: TST-KER-003f and TST-KER-011b take the generator's own record of which passages an edit touched (and the test's own graph walk for dependents) as ground truth; TST-KER-005d checks an invariant on the data; TST-KER-014a recounts from the JSON files with its own walk; the SHA-256 test is differential against the platform digest on random Unicode strings.
4. Met: this report.

## Requirements and the tests that prove them

Executable references follow the codification: file path, then `describe > it` title.

| Requirement | Tests (file: `packages/kernel/test/…`) | Status the coordinator can set |
|---|---|---|
| SPEC-KER-001 | `ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001a, TST-KER-001b, TST-KER-001c | IMPLEMENTED |
| SPEC-KER-002 | `ker-002.test.ts` > SPEC-KER-002 Provenance record > TST-KER-002a, TST-KER-002b | IMPLEMENTED |
| SPEC-KER-003 | `ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003a to TST-KER-003f | IMPLEMENTED |
| SPEC-KER-004 | `ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004a, TST-KER-004b, TST-KER-004c | IMPLEMENTED |
| SPEC-KER-005 | `ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005a to TST-KER-005d | IMPLEMENTED |
| SPEC-KER-006 | `ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006a, TST-KER-006b | IMPLEMENTED |
| SPEC-KER-007 | `ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007a, TST-KER-007b | IMPLEMENTED |
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
5. A context window that is no longer found is matched by its longest surviving suffix (before) or prefix (after), down to 6 characters, so that an edit near the passage does not hide an in-place rewrite.
6. The journal is one JSON object per line; `undo` restores the full snapshot an event replaced, for edit, accept, reject, delete and refresh events, including after a reopen.

## Known limits, stated

- A passage rewritten together with both of its context windows beyond their last 6 characters is reported orphaned rather than changed; the author re-anchors the object (edit of its anchors). The code comments say so.
- Anchor ranges of an orphaned anchor keep their last known values; they may exceed the current unit length. Readers use the state, not the range, for an orphaned anchor.
- The in-memory adapters are the only adapters delivered; the Node adapters, the documented format and the fault injection belong to ENG-0002.

## Open points that need someone else

None. No requirement, milestone, interface or scope needed a change.

## For information, no action required

- Identifiers from the sequence adapter are shared by objects, versions and events, so the numbers in a test interleave; the Node adapter will use random identifiers.
- The kernel writes blobs, then objects, then the versions index, then the state, on every save; the Node adapter of ENG-0002 makes each write atomic and the tests of SPEC-KER-012 inject faults between these steps.

## Documentation updated

- `docs/KERNEL_DESIGN.md` is outside this scope and is now incomplete: Section 2 must add the `current` field of an anchor, and Section 3 must add two rules: a changed anchor follows the passage it currently covers, an orphaned anchor returns only through its exact text. To be applied by the coordinator at integration, from this report.
- `dossier-recette/10_PROVENANCE_KERNEL.md`: the test tables of the eleven requirements receive the executable references of the table above, the `Implementation` field receives `packages/kernel/src/kernel.ts`, and the status becomes IMPLEMENTED. To be applied by the coordinator at integration.
