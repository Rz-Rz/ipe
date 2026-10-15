# ENG-0001: documentation impacts, one block per requirement

A block with `impact :` names what a document outside the scope of this session must say now; the coordinator applies it at integration. A block with `sans_impact :` states why no document changes.

## SPEC-KER-001

sans_impact : the design note already describes stable identifiers (Section 2); the implementation follows it.

## SPEC-KER-002

sans_impact : the design note already describes the provenance record (Section 2); the implementation follows it.

## SPEC-KER-003

impact : docs/KERNEL_DESIGN.md, Section 2: the anchor gains a field `current`, the passage a changed anchor covers now, null otherwise. Section 3, rule 5 becomes: a whole window counts wherever it stands; a surviving part of a window counts only when it is at least 12 characters long, lies within two windows and one passage length of the original range and keeps its order, with a region between the parts of at most three passage lengths or one passage plus two windows; context locates, it never invents a match. Add two rules: a changed anchor follows the passage it currently covers across later edits, and an orphaned anchor returns only through its exact text (a revert in its unit, or a move to another unit), never through context.

## SPEC-KER-004

sans_impact : the design note already describes content-addressed versions (Sections 2 and 5); the implementation follows it.

## SPEC-KER-005

sans_impact : the design note already describes staleness (Section 4); the implementation follows it.

## SPEC-KER-006

sans_impact : the design note already describes proposals and acceptance (Section 2); the implementation follows it.

## SPEC-KER-007

sans_impact : the design note already describes the journal and undo (Section 2); the implementation follows it.

## SPEC-KER-010

sans_impact : the design note already describes the provenance query (Section 7); the implementation follows it.

## SPEC-KER-011

impact : docs/KERNEL_DESIGN.md, Section 4: state that the invalidated set is seeded by anchors that go from intact to a non-intact state in the edit, plus their transitive dependents, and that an object anchored in the edited unit whose anchor stays intact may have its context windows refreshed on disk without being invalidated.

## SPEC-KER-013

sans_impact : the design note already describes dependencies (Section 4); the implementation follows it.

## SPEC-KER-014

impact : docs/KERNEL_DESIGN.md, Section 7: state that the counts by anchor state are counts of objects (an object counts once per state it carries), with the counts of anchors beside them.
