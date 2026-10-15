# ENG-0002: documentation impacts, one block per requirement

A block with `impact :` names what a document outside the scope of this session must say now; the coordinator applies it at integration. A block with `sans_impact :` states why no document changes. `docs/FORMAT.md` lies inside the scope and was written by this delivery.

## SPEC-KER-008

impact : docs/KERNEL_DESIGN.md, Section 5: the on-disk layout is specified by docs/FORMAT.md (version 1), which the section cites as the authority; add that an object file that is not JSON is reported by its path at opening and skipped, while a file that breaks the format refuses the project; add that an unreadable versions index is kept under `index.json.unreadable-<time>` before a fresh index replaces it.

## SPEC-KER-009

impact : docs/KERNEL_DESIGN.md, Section 7: `writeUnit(unitId, text, { force? })` refuses with code `conflict` when the unit's file changed on disk since the kernel last read or wrote it, unless forced; `externalText(unitId)` returns the disk text when it differs, else null; detection is by content hash, never by timestamp. Section 5: at opening, an external edit is absorbed (content kept, anchors re-resolved, a version with action `external` recorded, the unit and the anchor changes reported).

## SPEC-KER-012

impact : docs/KERNEL_DESIGN.md, Section 6: the Node storage writes through a temporary file in the same folder and one rename (`moveIntoPlace`), removes the temporary file on failure, and appends the journal with the platform's append; Section 5 keeps the write order (unit file, objects, blob, versions index, state) and says that after a fault at any step the project reopens in its last consistent state, absorbing a new text that has no state as an external change.
