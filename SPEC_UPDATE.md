# ENG-0004: requirement updates to apply in dossier-recette/10_PROVENANCE_KERNEL.md

The coordinator applies the lines below at integration. Every test listed passed in `pnpm test` from the repository root (21 files, 63 tests).

| Requirement | New status | Implementation | Tests |
|---|---|---|---|
| SPEC-KER-012 | IMPLEMENTED (unchanged) | `packages/adapters-node/src/index.ts`, `packages/kernel/src/kernel.ts` | add `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012d: a save refused at any write step, the unit file included, completes when the same text is saved again in the same kernel (unit); TST-KER-012e: a save refused past the unit file still completes at the retry when another unit was saved in between (unit) |

Coverage note to restate:

- SPEC-KER-012, degraded: the reservation written at ENG-0002's integration ("the save of the same text completes at a retry only once ENG-0004 is held") is lifted: after a refusal at any step of the save, the same kernel saves the same text again and the save completes: the object files hold the live objects, the blob of the retried version holds the text, one version is recorded (two when the state alone was refused), and the reopened project reports neither an external change nor an interruption (TST-KER-012d); a save of another unit in between changes nothing of it (TST-KER-012e).
