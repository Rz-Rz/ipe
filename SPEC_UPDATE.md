# ENG-0001: requirement updates to apply in dossier-recette/10_PROVENANCE_KERNEL.md

The session cannot write the requirements folder. The coordinator applies the lines below at integration: status, implementation field, and the test artefacts (file path, then `describe > it` title, as the codification asks). Every test listed passed in `pnpm test` from the repository root (12 files, 36 tests).

| Requirement | New status | Implementation | Tests |
|---|---|---|---|
| SPEC-KER-001 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001a (unit), TST-KER-001b (unit), TST-KER-001c (property) |
| SPEC-KER-002 | IMPLEMENTED | `packages/kernel/src/kernel.ts`, `packages/kernel/src/layout.ts` | `packages/kernel/test/ker-002.test.ts` > SPEC-KER-002 Provenance record > TST-KER-002a (unit), TST-KER-002b (unit) |
| SPEC-KER-003 | IMPLEMENTED | `packages/kernel/src/anchors.ts`, `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003a (unit), TST-KER-003b (unit), TST-KER-003c (unit), TST-KER-003d (unit), TST-KER-003e (integration), TST-KER-003f (property), TST-KER-003g (unit, added: the ambiguous state), TST-KER-003h (unit, added: a passage deleted with its neighbours rewritten stays orphaned) |
| SPEC-KER-004 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004a (unit), TST-KER-004b (unit), TST-KER-004c (system) |
| SPEC-KER-005 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005a (unit), TST-KER-005b (unit), TST-KER-005c (unit), TST-KER-005d (property) |
| SPEC-KER-006 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006a (unit), TST-KER-006b (unit), TST-KER-006c (unit, added: creation of an author object by another actor refused), TST-KER-006d (unit, added: an undo that would change the approval state is the author's only) |
| SPEC-KER-007 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007a (unit), TST-KER-007b (system), TST-KER-007c (unit, added: the degraded case, history unwritable) |
| SPEC-KER-010 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-010.test.ts` > SPEC-KER-010 Provenance query > TST-KER-010a (unit), TST-KER-010b (unit) |
| SPEC-KER-011 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-011.test.ts` > SPEC-KER-011 Incremental invalidation > TST-KER-011a (unit), TST-KER-011b (property) |
| SPEC-KER-013 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-013.test.ts` > SPEC-KER-013 Dependencies between objects > TST-KER-013a (unit), TST-KER-013b (unit) |
| SPEC-KER-014 | IMPLEMENTED | `packages/kernel/src/kernel.ts` | `packages/kernel/test/ker-014.test.ts` > SPEC-KER-014 Kernel inspection > TST-KER-014a (unit) |

Coverage notes to add to the requirements, under their limit or exclusion cases, so that the folder says no more than the tests prove:

- SPEC-KER-003, exclusion: a passage rewritten so that neither of its context windows survives whole, and no part of at least 12 characters of a window survives near the original range in order, is reported orphaned, not changed; the author re-anchors the object. When both whole windows recur elsewhere with new text between them, the anchor follows them as changed.
- SPEC-KER-003, limit: two identical candidates told apart by nothing yield the ambiguous state with the candidates listed; the object is invalidated and stale until one copy goes or the author re-anchors it.
- SPEC-KER-006, error: an object of origin author is created by the author only; an undo that would change the approval state is the author's only; in both cases another actor is refused (not_author) and the refusal recorded.
- SPEC-KER-007, degraded: proved by TST-KER-007c: with a history that cannot be written, a deletion, an acceptance and an edit are refused and the object is untouched.
- SPEC-KER-014, nominal: the counts by state (intact, changed, ambiguous, orphaned) are counts of live objects, an object counting once per state it carries; the counts of anchors by state stand beside them under anchorsByState.
- SPEC-KER-011, nominal: an object anchored in the edited unit whose anchor stays intact may have its context windows refreshed on disk; it is neither invalidated nor stale. Byte-identity is asserted for objects anchored elsewhere.
- SPEC-KER-011, limit: an anchor already non-intact that degrades further does not invalidate its object again.
