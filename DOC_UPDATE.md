# ENG-0004: documentation impacts, one block per requirement

## SPEC-KER-012

impact : docs/KERNEL_DESIGN.md, Section 5: after a save refused at any step past the unit's file, the kernel keeps the save marked incomplete and the next save of the same text in the same kernel runs whole (objects, blob, index, state) and returns a new version; the opening report of a kernel reopened after such a refusal still carries the external change or the interruption, as before. docs/FORMAT.md needs no change: the files and their order are the same.
