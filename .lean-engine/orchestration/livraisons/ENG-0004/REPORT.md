# ENG-0004: delivery report

## Result

PASS against the definition_of_done of ENG-0004 (four criteria, each with the evidence that proves it):

1. Met: after a save refused at any step after the unit's file was written, a retry of the identical text in the same kernel completes the save. The kernel keeps a flag, `incomplete`, raised at the first write of a save and cleared once the state is written; `writeUnit` answers the previous version without writing only when the text is already held and the last save completed, and runs the whole save otherwise: the unit's file, the touched objects, the blob, the versions index, the state, and a new version returned (`packages/kernel/src/kernel.ts`).
2. Met: TST-KER-012d (`packages/adapters-node/test/ker-012.test.ts`, added) measures the write steps of a save on a clean run, then for each step injects a refusal at that step, retries the same text in the same kernel, and reopens the project: the unit holds the text, the opening report shows neither an external change nor an interruption, the one object is there, and the current version is the one the retry returned; a further save of the same text is a no-op that returns the same version. TST-KER-012b (the refusal at the first step, from ENG-0002) stays and passes.
3. Met: the mutant that restores the unconditional early return falls under TST-KER-012d, and so does the mutant that never clears the flag (every save of the same text recorded again).
4. Met: this report.

From the repository root: `pnpm typecheck` passes; `pnpm test` reports 21 files, 62 tests, all passing (kernel 39, adapters 13, desktop 10).

## Requirements and the tests that prove them

| Requirement | Tests | Status the coordinator can set |
|---|---|---|
| SPEC-KER-012 | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012a, TST-KER-012b, TST-KER-012c, TST-KER-012d (added) | IMPLEMENTED (already; the degraded case now holds at every step) |

Implementation: `packages/kernel/src/kernel.ts` (`incomplete`, `writeUnit`, `recordVersion`).

## What the implementation decided inside its scope

1. The flag is one boolean for the kernel, not one per unit: a save is a sequence of writes for one unit, and the kernel runs one save at a time; a refusal leaves the flag raised until a save completes, whichever unit it is for. The cost of a raised flag is one save of a text already held, which is the repair.
2. A retry after a refusal records a new version with action `write` even when the unit's file already held the text: the version is what the state names, and the state is what the refusal left unwritten.
3. The steps of a save, the fault injection and the counting of steps are those of ENG-0002: nothing of the storage or of the format changes.

## Mutants: each property is guarded by a test that falls when the property is broken

| Requirement | Mutant injected in the source | Test file that falls |
|---|---|---|
| SPEC-KER-012 | the early return answers the previous version after a refused save | ker-012.test.ts |
| SPEC-KER-012 | every save of the same text recorded again, the flag never cleared | ker-012.test.ts |

## Known limits, stated

- The flag lives in memory: a kernel reopened after a refusal does not know of it, and the opening report carries the external change or the interruption instead, as ENG-0002 delivered.
- A refusal during `addUnit`, `adoptUnit`, `takeExternal` or a move is not covered by the flag; those write fewer steps and were not the finding of MAN-ENG-0002-2.

## Open points that need someone else

None.

## For information, no action required

- The design note's Section 5 can say that a save refused past the unit's file completes at the next save of the same text; drafted in DOC_UPDATE.md.
