# ENG-0002: requirement updates to apply in dossier-recette/10_PROVENANCE_KERNEL.md

The session cannot write the requirements folder. The coordinator applies the lines below at integration: status, implementation field, and the test artefacts (file path, then `describe > it` title, as the codification asks). Every test listed passed in `pnpm test` from the repository root (16 files, 48 tests).

| Requirement | New status | Implementation | Tests |
|---|---|---|---|
| SPEC-KER-008 | IMPLEMENTED | `packages/adapters-node/src/index.ts`, `packages/kernel/src/kernel.ts`, `docs/FORMAT.md` | `packages/adapters-node/test/ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008a (integration), TST-KER-008b (system), TST-KER-008c (unit), TST-KER-008d (unit, added at rework: a truncated last journal line is skipped at opening and its count is reported) |
| SPEC-KER-009 | IMPLEMENTED | `packages/kernel/src/kernel.ts`, `packages/adapters-node/src/index.ts` | `packages/adapters-node/test/ker-009.test.ts` > SPEC-KER-009 External edits are never discarded > TST-KER-009a (integration), TST-KER-009b (integration), TST-KER-009c (unit) |
| SPEC-KER-012 | IMPLEMENTED | `packages/adapters-node/src/index.ts`, `packages/kernel/src/kernel.ts` | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012a (system), TST-KER-012b (system), TST-KER-012c (unit, added: a crash after the temporary file and before the rename leaves the target as it was and no temporary file behind) |

Coverage notes to add or restate, so that the folder says no more than the tests prove:

- SPEC-KER-008, error: an object file that is not JSON is reported by its path and skipped, the other objects load; a file that is JSON but breaks the format refuses the project with the file named (SPEC-KER-002).
- SPEC-KER-008, exclusion: the journal is appended, not written through a renamed temporary file; a truncated last line is skipped at opening and the count of skipped lines is reported in the opening report (TST-KER-008d).
- SPEC-KER-009, limit: the save of a unit whose file changed on disk since the kernel last read or wrote it is refused with code conflict; the disk text is returned beside the author's; a save with force keeps the author's text.
- SPEC-KER-009, degraded: detection is by content hash, never by timestamp.
- SPEC-KER-012, limit: a crash between the temporary file and the rename leaves the target as it was and removes the temporary file (TST-KER-012c). A crash of the operating system during the rename itself relies on the file system and is not tested.
- SPEC-KER-012, degraded: the full-disk case is simulated by an adapter error carrying ENOSPC; after the refusal the same kernel saves again once there is room, and the author's text lands (TST-KER-012b).
- SPEC-KER-004, degraded (already IMPLEMENTED by ENG-0001): an unreadable versions index is kept under index.json.unreadable-<time> before a fresh index replaces it at the next save; TST-KER-004c asserts the kept copy.
