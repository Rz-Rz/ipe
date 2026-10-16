# Domain KER: provenance kernel

The kernel holds the objects a project records about a work, anchors them to passages, versions the manuscript, marks objects stale when their sources change, and stores everything on disk in documented formats. It contains no assistant and calls no provider. Every other domain reads and writes through it. Parent principles: P04, P05, P07; parent quality requirements: Q01, Q07.

All requirements of this domain belong to milestone J-KER.

### SPEC-KER-001: Stable object identity

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-P04
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** The kernel must assign every object an identifier that is unique within the project and that survives edits, moves, and renames of the manuscript units the object rests on.

**Coverage.** Nominal: the identifier is unchanged after the anchored passage is edited. Limit: the manuscript unit is moved to another folder or renamed; the identifier is unchanged. Error: two objects with the same identifier are refused at load, with a report naming both. Degraded: a project copied to another device keeps every identifier. Exclusion: identifiers are not derived from file paths or from passage text.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-001a | `packages/kernel/test/ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001a: after edit, move, and rename, each object keeps its identifier | unit | After edit, move, and rename, each object keeps its identifier. |
| TST-KER-001b | `packages/kernel/test/ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001b: a store with two objects sharing an identifier is refused, with both files named | unit | A store with two objects sharing an identifier is refused with both named. |
| TST-KER-001c | `packages/kernel/test/ker-001.test.ts` > SPEC-KER-001 Stable object identity > TST-KER-001c: for random sequences of edits, moves, renames and relocations, no identifier changes | property | For random sequences of edits, moves, and renames, no identifier changes. |

### SPEC-KER-002: Provenance record

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-P02
- Implementation: `packages/kernel/src/kernel.ts`, `packages/kernel/src/layout.ts`
- Acceptance priority: critical

**Requirement.** The kernel must record for every object its origin (author, assistant, or import), the action that created it, the creation time, the manuscript version it rests on, its anchors, and its approval state.

**Coverage.** Nominal: all fields are present and readable. Limit: an object with no anchor (a project-level note) is allowed with an empty anchor list. Error: an object written without origin or without approval state is refused. Degraded: none. Exclusion: the content of assistant prompts is not part of provenance in this milestone; it is specified with domain AST.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-002a | `packages/kernel/test/ker-002.test.ts` > SPEC-KER-002 Provenance record > TST-KER-002a: every stored object exposes origin, action, creation time, version, anchors and approval state | unit | Every stored object exposes the six provenance fields. |
| TST-KER-002b | `packages/kernel/test/ker-002.test.ts` > SPEC-KER-002 Provenance record > TST-KER-002b: a write without origin, or without approval state, is refused | unit | A write without origin, or without approval state, is refused. |

### SPEC-KER-003: Anchors survive edits

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-P07
- Implementation: `packages/kernel/src/anchors.ts`, `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** An anchor must continue to designate its passage after edits elsewhere in the manuscript unit and after the passage moves to another manuscript unit, and must enter the orphaned state, never disappear, when the passage is deleted.

**Coverage.** Nominal: insertions and deletions before and after the passage leave the anchor intact. Limit: an edit inside the passage keeps the anchor and marks it changed; a passage cut and pasted whole into another unit is re-anchored by content identity. Error: the passage is deleted; the anchor is orphaned, the object is kept, and the orphaned state is visible in every query. Degraded: the unit was edited outside the product; at reopen the kernel re-anchors by content match, else marks the anchor orphaned. Exclusion: re-anchoring does not choose among several identical candidate passages; it marks the anchor ambiguous and lists the candidates; the object is invalidated and stale until one copy goes or the author re-anchors it. A passage rewritten so that neither of its context windows survives whole, and no part of at least 12 characters of a window survives near the original range in order, is reported orphaned, not changed; the author re-anchors the object. When both whole windows recur elsewhere with new text between them, the anchor follows them as changed. An orphaned anchor returns only through its exact text: a revert in its unit, or a move to another unit.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-003a | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003a: edits around the passage leave the anchor intact, at its new position | unit | Edits around the passage leave the anchor intact. |
| TST-KER-003b | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003b: an edit inside the passage yields state changed, and the text the object rests on is kept | unit | An edit inside the passage yields state changed. |
| TST-KER-003c | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003c: a whole passage moved to another unit is re-anchored there | unit | A whole passage moved to another unit is re-anchored there. |
| TST-KER-003d | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003d: a deleted passage yields state orphaned; the object remains and says so | unit | A deleted passage yields state orphaned; the object remains. |
| TST-KER-003e | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003e: an edit made outside the product yields re-anchoring or orphaned, never a lost object | integration | An external edit yields re-anchoring or orphaned, never a lost object. |
| TST-KER-003f | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003f: for random edit scripts, every anchor is in the one state its edit history commands | property | For random edit scripts, every anchor is in exactly one of the states intact, changed, ambiguous, orphaned. |
| TST-KER-003g | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003g: a passage that now occurs twice, told apart by nothing, is ambiguous with its candidates, and resolves when one copy goes | unit | Two identical candidates told apart by nothing: ambiguous with both candidates listed, the object invalidated and stale, no passage in the chain, intact again when one copy goes. |
| TST-KER-003h | `packages/kernel/test/ker-003.test.ts` > SPEC-KER-003 Anchors survive edits > TST-KER-003h: a passage deleted together with its neighbours stays orphaned, even when parts of its windows recur elsewhere | unit | A passage deleted with both neighbours rewritten, parts of its windows recurring far away: orphaned, with no current passage. |

### SPEC-KER-004: Manuscript versions

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P04, IPE-N17
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** The kernel must record manuscript versions such that any earlier version of any manuscript unit is recoverable, and every object must name the version it rests on.

**Coverage.** Nominal: a version is recorded at each save. Limit: the number of versions grows without the project folder exceeding the documented bound (bound: target value, to confirm). Error: a version named by an object cannot be found; the kernel reports it, marks the object unverifiable, and never deletes it. Degraded: the history is unreadable; the current text stays editable and the history is reported absent; the unreadable index is kept, as found, under index.json.unreadable-<time> before a fresh index replaces it at the next save. Exclusion: the version semantics of external tools are not required; the kernel may use them.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-004a | `packages/kernel/test/ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004a: any earlier version of a unit is recovered byte for byte | unit | Any earlier version of a unit is recovered byte for byte. |
| TST-KER-004b | `packages/kernel/test/ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004b: an object naming a missing version is reported unverifiable and kept | unit | An object naming a missing version is reported unverifiable and kept. |
| TST-KER-004c | `packages/kernel/test/ker-004.test.ts` > SPEC-KER-004 Manuscript versions > TST-KER-004c: a project with corrupted history opens with its current text editable | system | A project with corrupted history opens with its current text editable. |

### SPEC-KER-005: Staleness

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-N09
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** The kernel must mark an object stale when any passage it rests on, or any object it depends on, changed after the version the object names, and must present stale objects with that marker in every query and view.

**Coverage.** Nominal: an edit of an anchored passage makes the object stale. Limit: staleness propagates through dependencies; an edit reverted to byte-identical text returns the object to current. Error: none. Degraded: an object whose anchors are orphaned is both stale and orphaned. Exclusion: whether a stale object is still correct is not decided by the kernel.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-005a | `packages/kernel/test/ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005a: editing an anchored passage marks the object stale | unit | Editing an anchored passage marks the object stale. |
| TST-KER-005b | `packages/kernel/test/ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005b: staleness propagates to dependent objects, transitively | unit | Staleness propagates to dependent objects, transitively. |
| TST-KER-005c | `packages/kernel/test/ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005c: reverting to identical text returns the object, and its dependents, to current | unit | Reverting to identical text returns the object to current. |
| TST-KER-005d | `packages/kernel/test/ker-005.test.ts` > SPEC-KER-005 Staleness > TST-KER-005d: no sequence of operations makes a stale object current without identical content or an explicit re-evaluation | property | No sequence of operations makes a stale object current without identical content or an explicit re-evaluation. |

### SPEC-KER-006: Proposals and acceptance

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P01, IPE-P07
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** An object created by the assistant or by an import must enter the project as a proposal, and only an author action must change it to accepted or rejected.

**Coverage.** Nominal: a proposal becomes accepted or rejected by one author action, recorded with its time. Limit: the author accepts several proposals in one action; each change is recorded. Error: an actor that is not the author attempts to accept, to create an object of origin author, or to undo a decision in a way that would change the approval state; the attempt is refused with not_author and recorded. Degraded: none. Exclusion: this milestone has no assistant; the kernel exposes the states and the actor rule, tested with simulated actors.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-006a | `packages/kernel/test/ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006a: objects of origin assistant or import are stored as proposals; the author's are accepted | unit | Objects of origin assistant or import are stored as proposals. |
| TST-KER-006b | `packages/kernel/test/ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006b: an acceptance by a non-author actor is refused and recorded | unit | An acceptance by a non-author actor is refused and recorded. |
| TST-KER-006c | `packages/kernel/test/ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006c: an object of origin author is created by the author only; another actor is refused and recorded | unit | An object of origin author created by another actor is refused with not_author, the refusal is recorded, nothing is created. |
| TST-KER-006d | `packages/kernel/test/ker-006.test.ts` > SPEC-KER-006 Proposals and acceptance > TST-KER-006d: an undo that would change the approval state is the author's only; another actor is refused and recorded | unit | An undo that would change the approval state, attempted by another actor, is refused with not_author and recorded; the author's undo restores the state; an undo that leaves the approval state stays open to the actor. |

### SPEC-KER-007: Reversible object actions

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P04
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: major

**Requirement.** Accepting, rejecting, editing, and deleting an object must be undoable, and the previous state must be recoverable after the product is closed and reopened.

**Coverage.** Nominal: undo within the session restores the previous state. Limit: undo after close and reopen restores it as well. Error: none. Degraded: a deletion, an acceptance or an edit requested while the history cannot be written is refused with a message, never performed; the event is written before the object, so the object is untouched. Exclusion: a permanent purge is a separate explicit action, recorded.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-007a | `packages/kernel/test/ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007a: each of the four actions is undone to the exact previous state | unit | Each of the four actions is undone to the exact previous state. |
| TST-KER-007b | `packages/kernel/test/ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007b: after close and reopen, the previous state is still recoverable | system | After close and reopen, the previous state is still recoverable. |
| TST-KER-007c | `packages/kernel/test/ker-007.test.ts` > SPEC-KER-007 Reversible object actions > TST-KER-007c: a deletion, an acceptance or an edit while the history cannot be written is refused, and the object is untouched | unit | With a history that cannot be written, a deletion, an acceptance and an edit are refused; the object file is byte-identical and no event exists, before and after a reopen. |

### SPEC-KER-008: Documented on-disk formats

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P05, IPE-Q06, IPE-N01
- Implementation: `packages/adapters-node/src/index.ts`, `packages/kernel/src/kernel.ts`, `docs/FORMAT.md`
- Acceptance priority: critical

**Requirement.** The kernel must store the manuscript as Markdown files and the objects as text files in a documented format, inside the project folder, such that another program can read both without the product.

**Coverage.** Nominal: a project opens from its folder alone. Limit: a project folder copied elsewhere opens identically. Error: an object file that is not JSON is reported by its path and skipped, and the rest of the project opens; a file that is JSON but breaks the format refuses the project with the file named. Degraded: none. Exclusion: binary assets are stored as files and referenced, never embedded in the object store; the journal is appended, not written through a renamed temporary file, and a truncated last line is skipped at opening, the count of skipped lines being reported in the opening report.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-008a | `packages/adapters-node/test/ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008a: an independent reader reads the whole store from the documented format alone | integration | A minimal independent reader, kept in the test suite, reads the whole object store from the documented format alone. |
| TST-KER-008b | `packages/adapters-node/test/ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008b: a copied project folder opens with identical objects and text | system | A copied project folder opens with identical objects and text. |
| TST-KER-008c | `packages/adapters-node/test/ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008c: one corrupted object file is reported by name; the other objects load | unit | One corrupted object file is reported by name; the other objects load. |
| TST-KER-008d | `packages/adapters-node/test/ker-008.test.ts` > SPEC-KER-008 Documented on-disk formats > TST-KER-008d: a truncated last journal line is skipped at opening and its count is reported | unit | A truncated last journal line is skipped at opening and its count is reported. |

### SPEC-KER-009: External edits are never discarded

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-Q01, IPE-Q06
- Implementation: `packages/kernel/src/kernel.ts`, `packages/adapters-node/src/index.ts`
- Acceptance priority: critical

**Requirement.** When a manuscript unit changed on disk outside the product, the kernel must detect the change at the next access, keep the external text, and report which units changed and which anchors were affected.

**Coverage.** Nominal: a unit edited by another program is reported at reopen with its affected anchors. Limit: the unit changes while open in the product; the save is refused with code conflict, the disk text is returned beside the author's, the product presents both and never overwrites the external one without the author's choice; a save with force keeps the author's text. Error: none. Degraded: detection is by content hash, never by timestamp; frozen timestamps change nothing. Exclusion: automatic merging of concurrent edits is not required; the author chooses.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-009a | `packages/adapters-node/test/ker-009.test.ts` > SPEC-KER-009 External edits are never discarded > TST-KER-009a: an external edit is detected at the next opening, kept, and reported with its affected anchors | integration | An external edit is detected and reported with affected anchors. |
| TST-KER-009b | `packages/adapters-node/test/ker-009.test.ts` > SPEC-KER-009 External edits are never discarded > TST-KER-009b: a conflict on an open unit presents both texts and overwrites nothing without the author's choice | integration | A conflict on an open unit presents both texts; neither is lost. |
| TST-KER-009c | `packages/adapters-node/test/ker-009.test.ts` > SPEC-KER-009 External edits are never discarded > TST-KER-009c: with timestamps frozen, the external edit is still detected by content | unit | With timestamps frozen, detection still succeeds by content. |

### SPEC-KER-010: Provenance query

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P07
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** The kernel must answer, for any object, a query that returns its provenance chain: its anchors with their passages and states, the version it rests on, its origin and creating action, its approval state, its staleness, and the objects it depends on, transitively.

**Coverage.** Nominal: the chain is complete for an accepted object with anchors and dependencies. Limit: a dependency cycle is refused at write. Error: an unknown object yields an explicit not-found answer. Degraded: none. Exclusion: a natural-language explanation of the chain belongs to domain MEM.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-010a | `packages/kernel/test/ker-010.test.ts` > SPEC-KER-010 Provenance query > TST-KER-010a: the chain lists every anchor with its passage, the version, origin, action, state, staleness and transitive dependencies | unit | The chain lists every anchor, the version, origin, action, state, staleness, and transitive dependencies. |
| TST-KER-010b | `packages/kernel/test/ker-010.test.ts` > SPEC-KER-010 Provenance query > TST-KER-010b: a write that would create a dependency cycle is refused | unit | A write that would create a dependency cycle is refused. |

### SPEC-KER-011: Incremental invalidation

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-Q07
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** After an edit, the kernel must identify as needing re-evaluation exactly the objects whose anchors or dependencies were affected by that edit, and must leave every other object untouched.

**Coverage.** Nominal: an edit of one passage invalidates the objects anchored to it and their dependents, and nothing else; an object anchored in the edited unit whose anchor stays intact may have its context windows refreshed on disk, and is neither invalidated nor stale; byte-identity is asserted for objects anchored elsewhere. Limit: an edit touching many passages invalidates each affected object once; an anchor already non-intact that degrades further does not invalidate its object again. Error: none. Degraded: when an anchor is ambiguous, the kernel includes the ambiguous objects and says so. Exclusion: re-evaluation itself is performed by views and by the assistant, not by the kernel.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-011a | `packages/kernel/test/ker-011.test.ts` > SPEC-KER-011 Incremental invalidation > TST-KER-011a: the invalidated set equals the affected objects; unaffected objects are byte-identical before and after | unit | The invalidated set equals the affected objects; unaffected objects are byte-identical before and after. |
| TST-KER-011b | `packages/kernel/test/ker-011.test.ts` > SPEC-KER-011 Incremental invalidation > TST-KER-011b: for random edits, the invalidated set equals the set a brute-force reference computes from what the edit touched | property | For random edits, the invalidated set equals the set computed by brute force over anchors and dependencies. |

### SPEC-KER-012: Consistent state after interruption

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-Q01
- Implementation: `packages/adapters-node/src/index.ts`, `packages/kernel/src/kernel.ts`
- Acceptance priority: critical

**Requirement.** An interruption of the product at any point of a write must leave the project folder in the last consistent state, with the manuscript and the object store readable.

**Coverage.** Nominal: an interruption during a save leaves the previous save intact. Limit: an interruption between the manuscript write and the object write is detected at reopen and reported, both files kept; a crash between the temporary file and the rename leaves the target as it was and removes the temporary file; a crash of the operating system during the rename itself relies on the file system and is not tested. Error: none. Degraded: on a full disk the write is refused with a message and the previous state is intact (simulated by an adapter error carrying ENOSPC at the first write of the save, the unit's file); after the refusal the same kernel saves again once there is room, and the author's text lands. A refusal at a later step of the save leaves the unit's file with the new text, which a reopen absorbs as an external change: nothing is lost, and the save of the same text completes at a retry only once ENG-0004 is held. Exclusion: failure of the storage medium itself.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-012a | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012a: with a fault injected at each step of a write, the project reopens in its last consistent state | system | With a fault injected at each step of a write, the project reopens in its last consistent state. |
| TST-KER-012b | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012b: with the disk full, the write is refused, the previous state is intact, and the same kernel saves again once there is room | system | With the disk full, the write is refused and the previous state is intact. |
| TST-KER-012c | `packages/adapters-node/test/ker-012.test.ts` > SPEC-KER-012 Consistent state after interruption > TST-KER-012c: a failure in the middle of a write leaves the target as it was, and no temporary file behind | unit | A crash after the temporary file and before the rename leaves the target as it was, removes the temporary file, and the project reopens unchanged. |

### SPEC-KER-013: Dependencies between objects

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-N17
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: major

**Requirement.** An object may declare dependencies on other objects, and the kernel must record them so that staleness and invalidation propagate along them.

**Coverage.** Nominal: a dependency is recorded and returned by the provenance query. Limit: an object with many dependencies is handled once per propagation. Error: a dependency on an unknown object is refused. Degraded: none. Exclusion: the meaning of a dependency is defined by the domain that creates it.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-013a | `packages/kernel/test/ker-013.test.ts` > SPEC-KER-013 Dependencies between objects > TST-KER-013a: a recorded dependency appears in the provenance query and propagates staleness and invalidation | unit | A recorded dependency appears in the provenance query and propagates staleness. |
| TST-KER-013b | `packages/kernel/test/ker-013.test.ts` > SPEC-KER-013 Dependencies between objects > TST-KER-013b: a dependency on an unknown object is refused | unit | A dependency on an unknown object is refused. |

### SPEC-KER-014: Kernel inspection

- Status: IMPLEMENTED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-Q02
- Implementation: `packages/kernel/src/kernel.ts`
- Acceptance priority: minor

**Requirement.** The kernel must report on request the count of objects by kind and by state: proposal, accepted, rejected; current, stale; anchored, orphaned, ambiguous.

**Coverage.** Nominal: the counts match the store; the counts by state (intact, changed, ambiguous, orphaned) are counts of live objects, an object counting once per state it carries, and the counts of anchors by state stand beside them. Limit: an empty project reports zero in every category. Error: none. Degraded: none. Exclusion: presentation of the report belongs to domain PRJ or ENV.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-014a | `packages/kernel/test/ker-014.test.ts` > SPEC-KER-014 Kernel inspection > TST-KER-014a: the reported counts equal the counts computed from the store by an independent walk | unit | The reported counts equal the counts computed from the store by an independent walk. |
