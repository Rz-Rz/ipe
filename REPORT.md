# ENG-0004: delivery report

## Result

PASS against the definition_of_done of ENG-0004 (four criteria, each with the evidence that proves it):

1. Met: after a save refused at any step after the unit's file was written, a retry of the identical text in the same kernel completes the save. The kernel keeps the set of the units whose last save did not complete (`incomplete`): a unit enters once its file is written and leaves once the state of that save is written; `writeUnit` answers the previous version without writing only when the text is already held and the unit's last save completed, and runs the whole save otherwise: the unit's file, every object whose file does not hold its current content, the blob, the versions index, the state, and a new version returned; a version the index refused leaves the history, so one save records one version (`packages/kernel/src/kernel.ts`).
2. Met: TST-KER-012d (`packages/adapters-node/test/ker-012.test.ts`, added) measures the write steps of a save on a clean run, then for each step injects a refusal at that step, retries the same text in the same kernel, and reopens the project: the unit holds the text, the blob of the retried version holds it, one version was recorded (two when the state alone was refused, since the index already held one), the opening report shows neither an external change nor an interruption, every object file holds its live object and the reopened objects equal the live ones, and the current version is the one the retry returned; a further save of the same text is a no-op that returns the same version. TST-KER-012e (added at rework) refuses the object or the blob write of one unit, saves another unit in between, retries the first, and checks the version, the blob, the object files and the reopened project. TST-KER-012b (the refusal at the first step, from ENG-0002) stays and passes.
3. Met: five mutants fall under TST-KER-012d and 012e: the unconditional early return restored, the unit never leaving the incomplete set, the retry writing only the objects its re-anchoring touched, any completed save clearing every unit's mark, and a version the index refused kept in the history.
4. Met: this report.

From the repository root: `pnpm typecheck` passes; `pnpm test` reports 21 files, 63 tests, all passing (kernel 39, adapters 14, desktop 10).

## Requirements and the tests that prove them

| Requirement | Tests | Status the coordinator can set |
|---|---|---|
| SPEC-KER-012 | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012a, TST-KER-012b, TST-KER-012c, TST-KER-012d (added), TST-KER-012e (added at rework) | IMPLEMENTED (already; the degraded case now holds at every step) |

Implementation: `packages/kernel/src/kernel.ts` (`incomplete`, `writeUnit`, `recordVersion`).

## What the implementation decided inside its scope

1. The incomplete saves are tracked per unit: a unit enters the set once its file is written (a refusal at the file itself leaves nothing to repair) and leaves it once the state of its own save is written; a save of another unit in between repairs nothing of it and clears nothing of it.
2. A retry after a refusal records a new version with action `write` even when the unit's file already held the text: the version is what the state names, and the state is what the refusal left unwritten. A version the index refused is removed from the history at once, so that the retry records one version for one save; when the state alone was refused, the index already holds the version and the retry adds a second one with the same content.
3. The steps of a save, the fault injection and the counting of steps are those of ENG-0002: nothing of the storage or of the format changes.

## Mutants: each property is guarded by a test that falls when the property is broken

| Requirement | Mutant injected in the source | Test file that falls |
|---|---|---|
| SPEC-KER-012 | the early return answers the previous version after a refused save | ker-012.test.ts |
| SPEC-KER-012 | every save of the same text recorded again, the unit never leaving the incomplete set | ker-012.test.ts |
| SPEC-KER-012 | the retry writes only the objects its re-anchoring touched (rework, V1) | ker-012.test.ts |
| SPEC-KER-012 | any completed save clears every unit's incomplete mark (rework, V3) | ker-012.test.ts |
| SPEC-KER-012 | a version the index refused stays in the history | ker-012.test.ts |

## Rework

Answers to the marks of `.eng/REWORK.md` (MAN-ENG-0004-1, minor reject), each with the change and the test that proves it.

- V1: on a retry, `writeUnit` persists every object whose file does not hold its current content (`persistTouched` over every object identifier; `persistObject` skips the unchanged ones through the written map), not only the ones the re-anchoring touched. TST-KER-012d now asserts, at every step, that each object file equals the canonical form of the live object and that the reopened object equals the live one; the mutant that persists the touched objects only falls.
- V2: TST-KER-012d asserts the object files and the reopened objects against the live objects, the blob of the retried version, and the count of versions recorded (one, or two when the state alone was refused); the coverage note of SPEC_UPDATE.md says what the test proves.
- V3: the incomplete saves are tracked per unit (`incomplete: Set<UnitId>`, the unit added once its file is written and removed once the state of its save is written). TST-KER-012e (added) refuses the object or the blob write of one unit, saves another unit in between, retries the first, and checks the version recorded, the blob, the object files and the reopened project; the mutant that clears every unit's mark on any completed save falls.
- Beside the marks, from the verifier's information: a version the index refused leaves the history (the retry records one version for one save; a mutant guards it), and the mark is raised only once the unit's file is written, so a refusal at the file itself leaves nothing to repair.

## Known limits, stated

- The incomplete set lives in memory: a kernel reopened after a refusal does not know of it, and the opening report carries the external change or the interruption instead, as ENG-0002 delivered.
- When the state alone was refused, the retry records a second version with the same content as the one the index already holds: two versions for one effective save, both whole.
- A refusal during `addUnit`, `adoptUnit`, `takeExternal` or a move is not covered by the flag; those write fewer steps and were not the finding of MAN-ENG-0002-2.

## Open points that need someone else

None.

## For information, no action required

- The design note's Section 5 can say that a save refused past the unit's file completes at the next save of the same text; drafted in DOC_UPDATE.md.
