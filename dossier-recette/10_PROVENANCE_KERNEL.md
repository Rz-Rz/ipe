# Domain KER: provenance kernel

The kernel holds the objects a project records about a work, anchors them to passages, versions the manuscript, marks objects stale when their sources change, and stores everything on disk in documented formats. It contains no assistant and calls no provider. Every other domain reads and writes through it. Parent principles: P04, P05, P07; parent quality requirements: Q01, Q07.

All requirements of this domain belong to milestone J-KER.

### SPEC-KER-001: Stable object identity

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-P04
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must assign every object an identifier that is unique within the project and that survives edits, moves, and renames of the manuscript units the object rests on.

**Coverage.** Nominal: the identifier is unchanged after the anchored passage is edited. Limit: the manuscript unit is moved to another folder or renamed; the identifier is unchanged. Error: two objects with the same identifier are refused at load, with a report naming both. Degraded: a project copied to another device keeps every identifier. Exclusion: identifiers are not derived from file paths or from passage text.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-001a | planned | unit | After edit, move, and rename, each object keeps its identifier. |
| TST-KER-001b | planned | unit | A store with two objects sharing an identifier is refused with both named. |
| TST-KER-001c | planned | property | For random sequences of edits, moves, and renames, no identifier changes. |

### SPEC-KER-002: Provenance record

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-P02
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must record for every object its origin (author, assistant, or import), the action that created it, the creation time, the manuscript version it rests on, its anchors, and its approval state.

**Coverage.** Nominal: all fields are present and readable. Limit: an object with no anchor (a project-level note) is allowed with an empty anchor list. Error: an object written without origin or without approval state is refused. Degraded: none. Exclusion: the content of assistant prompts is not part of provenance in this milestone; it is specified with domain AST.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-002a | planned | unit | Every stored object exposes the six provenance fields. |
| TST-KER-002b | planned | unit | A write without origin, or without approval state, is refused. |

### SPEC-KER-003: Anchors survive edits

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N01, IPE-P07
- Implementation: none
- Acceptance priority: critical

**Requirement.** An anchor must continue to designate its passage after edits elsewhere in the manuscript unit and after the passage moves to another manuscript unit, and must enter the orphaned state, never disappear, when the passage is deleted.

**Coverage.** Nominal: insertions and deletions before and after the passage leave the anchor intact. Limit: an edit inside the passage keeps the anchor and marks it changed; a passage cut and pasted whole into another unit is re-anchored by content identity. Error: the passage is deleted; the anchor is orphaned, the object is kept, and the orphaned state is visible in every query. Degraded: the unit was edited outside the product; at reopen the kernel re-anchors by content match, else marks the anchor orphaned. Exclusion: re-anchoring does not choose among several identical candidate passages; it marks the anchor ambiguous and lists the candidates.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-003a | planned | unit | Edits around the passage leave the anchor intact. |
| TST-KER-003b | planned | unit | An edit inside the passage yields state changed. |
| TST-KER-003c | planned | unit | A whole passage moved to another unit is re-anchored there. |
| TST-KER-003d | planned | unit | A deleted passage yields state orphaned; the object remains. |
| TST-KER-003e | planned | integration | An external edit yields re-anchoring or orphaned, never a lost object. |
| TST-KER-003f | planned | property | For random edit scripts, every anchor is in exactly one of the states intact, changed, ambiguous, orphaned. |

### SPEC-KER-004: Manuscript versions

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P04, IPE-N17
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must record manuscript versions such that any earlier version of any manuscript unit is recoverable, and every object must name the version it rests on.

**Coverage.** Nominal: a version is recorded at each save. Limit: the number of versions grows without the project folder exceeding the documented bound (bound: target value, to confirm). Error: a version named by an object cannot be found; the kernel reports it, marks the object unverifiable, and never deletes it. Degraded: the history is unreadable; the current text stays editable and the history is reported absent. Exclusion: the version semantics of external tools are not required; the kernel may use them.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-004a | planned | unit | Any earlier version of a unit is recovered byte for byte. |
| TST-KER-004b | planned | unit | An object naming a missing version is reported unverifiable and kept. |
| TST-KER-004c | planned | system | A project with corrupted history opens with its current text editable. |

### SPEC-KER-005: Staleness

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-N09
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must mark an object stale when any passage it rests on, or any object it depends on, changed after the version the object names, and must present stale objects with that marker in every query and view.

**Coverage.** Nominal: an edit of an anchored passage makes the object stale. Limit: staleness propagates through dependencies; an edit reverted to byte-identical text returns the object to current. Error: none. Degraded: an object whose anchors are orphaned is both stale and orphaned. Exclusion: whether a stale object is still correct is not decided by the kernel.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-005a | planned | unit | Editing an anchored passage marks the object stale. |
| TST-KER-005b | planned | unit | Staleness propagates to dependent objects, transitively. |
| TST-KER-005c | planned | unit | Reverting to identical text returns the object to current. |
| TST-KER-005d | planned | property | No sequence of operations makes a stale object current without identical content or an explicit re-evaluation. |

### SPEC-KER-006: Proposals and acceptance

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P01, IPE-P07
- Implementation: none
- Acceptance priority: critical

**Requirement.** An object created by the assistant or by an import must enter the project as a proposal, and only an author action must change it to accepted or rejected.

**Coverage.** Nominal: a proposal becomes accepted or rejected by one author action, recorded with its time. Limit: the author accepts several proposals in one action; each change is recorded. Error: an actor that is not the author attempts to accept; the attempt is refused and recorded. Degraded: none. Exclusion: this milestone has no assistant; the kernel exposes the states and the actor rule, tested with simulated actors.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-006a | planned | unit | Objects of origin assistant or import are stored as proposals. |
| TST-KER-006b | planned | unit | An acceptance by a non-author actor is refused and recorded. |

### SPEC-KER-007: Reversible object actions

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P04
- Implementation: none
- Acceptance priority: major

**Requirement.** Accepting, rejecting, editing, and deleting an object must be undoable, and the previous state must be recoverable after the product is closed and reopened.

**Coverage.** Nominal: undo within the session restores the previous state. Limit: undo after close and reopen restores it as well. Error: none. Degraded: a deletion requested while the history cannot be written is refused with a message, never performed silently. Exclusion: a permanent purge is a separate explicit action, recorded.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-007a | planned | unit | Each of the four actions is undone to the exact previous state. |
| TST-KER-007b | planned | system | After close and reopen, the previous state is still recoverable. |

### SPEC-KER-008: Documented on-disk formats

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P05, IPE-Q06, IPE-N01
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must store the manuscript as Markdown files and the objects as text files in a documented format, inside the project folder, such that another program can read both without the product.

**Coverage.** Nominal: a project opens from its folder alone. Limit: a project folder copied elsewhere opens identically. Error: one unreadable object file is reported by name and the rest of the project opens. Degraded: none. Exclusion: binary assets are stored as files and referenced, never embedded in the object store.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-008a | planned | integration | A minimal independent reader, kept in the test suite, reads the whole object store from the documented format alone. |
| TST-KER-008b | planned | system | A copied project folder opens with identical objects and text. |
| TST-KER-008c | planned | unit | One corrupted object file is reported by name; the other objects load. |

### SPEC-KER-009: External edits are never discarded

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-Q01, IPE-Q06
- Implementation: none
- Acceptance priority: critical

**Requirement.** When a manuscript unit changed on disk outside the product, the kernel must detect the change at the next access, keep the external text, and report which units changed and which anchors were affected.

**Coverage.** Nominal: a unit edited by another program is reported at reopen with its affected anchors. Limit: the unit changes while open in the product; the product presents both texts and never overwrites the external one without the author's choice. Error: none. Degraded: when file timestamps are unreliable, detection falls back to content comparison. Exclusion: automatic merging of concurrent edits is not required; the author chooses.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-009a | planned | integration | An external edit is detected and reported with affected anchors. |
| TST-KER-009b | planned | integration | A conflict on an open unit presents both texts; neither is lost. |
| TST-KER-009c | planned | unit | With timestamps frozen, detection still succeeds by content. |

### SPEC-KER-010: Provenance query

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P07
- Implementation: none
- Acceptance priority: critical

**Requirement.** The kernel must answer, for any object, a query that returns its provenance chain: its anchors with their passages and states, the version it rests on, its origin and creating action, its approval state, its staleness, and the objects it depends on, transitively.

**Coverage.** Nominal: the chain is complete for an accepted object with anchors and dependencies. Limit: a dependency cycle is refused at write. Error: an unknown object yields an explicit not-found answer. Degraded: none. Exclusion: a natural-language explanation of the chain belongs to domain MEM.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-010a | planned | unit | The chain lists every anchor, the version, origin, action, state, staleness, and transitive dependencies. |
| TST-KER-010b | planned | unit | A write that would create a dependency cycle is refused. |

### SPEC-KER-011: Incremental invalidation

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-Q07
- Implementation: none
- Acceptance priority: critical

**Requirement.** After an edit, the kernel must identify as needing re-evaluation exactly the objects whose anchors or dependencies were affected by that edit, and must leave every other object untouched.

**Coverage.** Nominal: an edit of one passage invalidates the objects anchored to it and their dependents, and nothing else. Limit: an edit touching many passages invalidates each affected object once. Error: none. Degraded: when an anchor is ambiguous, the kernel includes the ambiguous objects and says so. Exclusion: re-evaluation itself is performed by views and by the assistant, not by the kernel.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-011a | planned | unit | The invalidated set equals the affected objects; unaffected objects are byte-identical before and after. |
| TST-KER-011b | planned | property | For random edits, the invalidated set equals the set computed by brute force over anchors and dependencies. |

### SPEC-KER-012: Consistent state after interruption

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-Q01
- Implementation: none
- Acceptance priority: critical

**Requirement.** An interruption of the product at any point of a write must leave the project folder in the last consistent state, with the manuscript and the object store readable.

**Coverage.** Nominal: an interruption during a save leaves the previous save intact. Limit: an interruption between the manuscript write and the object write is detected at reopen and reported, both files kept. Error: none. Degraded: on a full disk the write is refused with a message and the previous state is intact. Exclusion: failure of the storage medium itself.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-012a | planned | system | With a fault injected at each step of a write, the project reopens in its last consistent state. |
| TST-KER-012b | planned | system | With the disk full, the write is refused and the previous state is intact. |

### SPEC-KER-013: Dependencies between objects

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-N17
- Implementation: none
- Acceptance priority: major

**Requirement.** An object may declare dependencies on other objects, and the kernel must record them so that staleness and invalidation propagate along them.

**Coverage.** Nominal: a dependency is recorded and returned by the provenance query. Limit: an object with many dependencies is handled once per propagation. Error: a dependency on an unknown object is refused. Degraded: none. Exclusion: the meaning of a dependency is defined by the domain that creates it.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-013a | planned | unit | A recorded dependency appears in the provenance query and propagates staleness. |
| TST-KER-013b | planned | unit | A dependency on an unknown object is refused. |

### SPEC-KER-014: Kernel inspection

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-Q02
- Implementation: none
- Acceptance priority: minor

**Requirement.** The kernel must report on request the count of objects by kind and by state: proposal, accepted, rejected; current, stale; anchored, orphaned, ambiguous.

**Coverage.** Nominal: the counts match the store. Limit: an empty project reports zero in every category. Error: none. Degraded: none. Exclusion: presentation of the report belongs to domain PRJ or ENV.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-KER-014a | planned | unit | The reported counts equal the counts computed from the store by an independent walk. |
