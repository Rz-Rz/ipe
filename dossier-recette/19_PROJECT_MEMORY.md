# Domain MEM: project memory

This file holds the MEM requirements of milestone J-MEM: the memory of a project as objects that connect what the work establishes (people, places, things, institutions, concepts, terms, events, relationships, rules) to the passages that support it, the distinction between what the text states and what is inferred, the author's corrections, the staleness that revisions cause, and the question "why does the project say this?". Sharing memory across a series (N09) and the chronology of events (N10, milestone J-CHR) are specified when their milestones approach the frontier. Parent need: N09; parent principles: P01, P02, P04, P07; parent quality requirements: Q02, Q07.

Terms of this domain, repeated from the index: a **memory entry** is an object of the project memory: a claim about the work, of one category, anchored to the passages that support it; an **explicit** entry states what the text says in so many words; an **inferred** entry states what the assistant or the author derived from the text; an **established fact** is an entry the author accepted; a **disputed** entry is one the author marked as contested; a **plan** is an entry about the future of the work, which establishes nothing about its present text.

### SPEC-MEM-001: Memory entries as provenance-bearing objects

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P07
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must keep each memory entry as an object of the project that carries a claim in one sentence, a category among person, place, thing, institution, concept, term, event, relationship and rule, the name of what it is about, and anchors to every passage that supports it.

**Coverage.** Nominal: an entry created by the author or proposed by the assistant is listed in the memory with its claim, category, subject and passages; the passages are read from the anchors, never copied into the entry. Limit: an entry with no supporting passage (a plan, an author's note) is allowed and shown as unanchored. Error: an entry whose category is outside the list is refused at creation. Degraded: none. Exclusion: images and tables as support (N16).

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-001a | planned | unit | An entry is created with its claim, category, subject and anchors; the passages are read from the anchors; a category outside the list is refused. |
| TST-MEM-001b | planned | integration | An entry survives a close and a reopen with its anchors re-resolved, as any object (SPEC-KER-002, SPEC-KER-003). |

### SPEC-MEM-002: Explicit, inferred, established, disputed

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P02, IPE-Q02
- Implementation: none
- Acceptance priority: critical

**Requirement.** Each memory entry must carry whether it is explicit (the text states it) or inferred (derived from the text), whether it is a plan, and whether the author marked it disputed, and the product must show an entry as an established fact only once the author accepted it.

**Coverage.** Nominal: an entry proposed by the assistant is a proposal whatever its basis; the author's acceptance makes it an established fact; the entry keeps its basis (explicit or inferred) after acceptance. Limit: a character's belief, a line of dialogue, or a passage of an abandoned outline supports an entry only as inferred, never as explicit about the world of the work; the entry says whose belief it records. Error: a proposal that the author rejects stays in the memory as rejected, excluded from the established facts and from what is sent to the assistant as established. Degraded: an entry marked disputed stays visible with its passages and is excluded from the established facts until the author settles it. Exclusion: automatic resolution of disputes.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-002a | planned | unit | The basis (explicit, inferred, plan) and the disputed mark are kept through acceptance and rejection; the established facts are the accepted, undisputed, non-plan entries and nothing else. |
| TST-MEM-002b | planned | corpus evaluation | On the fixture corpus with planted beliefs, dialogue and an abandoned outline, every entry the product builds from the recorded answers that rests on such a passage carries the basis inferred and names whose belief it is; the evaluation reports the counts per basis. |

### SPEC-MEM-003: Extraction of the memory from a scope

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-N05, IPE-P01
- Implementation: none
- Acceptance priority: critical

**Requirement.** The author must be able to ask the assistant to extract the memory of a chosen scope, and the product must propose each entry the assistant returns as a proposal anchored to the passage the assistant quotes, located in the text by the product, and must flag an entry whose quote is not found in the scope as unanchored rather than drop it or invent a location.

**Coverage.** Nominal: the entries proposed are listed for review, each with its quote located as an anchor, its category, its basis and its subject; the call is recorded as every call is (SPEC-PRV-005). Limit: a quote found more than once in the scope anchors the entry at the first occurrence and says the quote is repeated. Error: an answer the product cannot read as entries (not the format asked) is a failure with the state unparseable and creates nothing; an entry with a category outside the list is kept with the category other and flagged. Degraded: a quote that differs from the text by spacing or punctuation only is located all the same and the difference is shown. Exclusion: extraction from imported sources (N08).

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-003a | planned | corpus evaluation | On the fixture corpus with its recorded answers, every entry whose quote is in the scope is anchored to a passage that holds the quote; every entry whose quote is absent is flagged unanchored; the counts of anchored, unanchored, repeated and normalised quotes are reported. |
| TST-MEM-003b | planned | integration | An answer that is not the format asked creates no entry and leaves a call record with the state unparseable; the scope sent is exactly the scope chosen (SPEC-PRV-003). |

### SPEC-MEM-004: The provenance question on an entry

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P07
- Implementation: none
- Acceptance priority: critical

**Requirement.** For any memory entry, the product must answer why the project holds it: the passages it rests on with their current state, whether it is explicit or inferred, who created it and through which call, the manuscript version it rests on, and whether it is stale.

**Coverage.** Nominal: the answer lists each passage with its anchor state (intact, changed, ambiguous, orphaned) and its text as the manuscript holds it now; the basis; the origin and the call record; the version; the stale mark. Limit: an unanchored entry answers with no passage and says so. Error: an entry whose version is not in the history is answered as unverifiable, and kept (SPEC-KER-005). Degraded: none. Exclusion: none.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-004a | planned | e2e | From the memory panel, the question on an inferred entry shows its passages with their state, the basis inferred, the call that proposed it and the version; the same on an unanchored entry says it rests on no passage. |

### SPEC-MEM-005: Revisions make entries stale; re-extraction reconciles

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-Q07, IPE-P04
- Implementation: none
- Acceptance priority: critical

**Requirement.** When a passage an entry rests on changes, the product must show the entry as stale, and a new extraction of the same scope must reconcile its result with the existing entries: an entry with the same subject and claim is refreshed, a new one is proposed, and an existing one the answer no longer supports is flagged as no longer supported, never deleted by the product.

**Coverage.** Nominal: an edit of a passage marks the entries resting on it stale (SPEC-KER-004); a re-extraction of the unit refreshes the entries it finds again (anchors moved to the quoted passages, the stale mark cleared), proposes the others, and flags the rest. Limit: a re-extraction of one unit touches only the entries anchored in that unit (Q07). Error: none. Degraded: an entry the author edited is never refreshed over the author's words; the new claim is proposed beside it. Exclusion: automatic re-extraction on save.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-005a | planned | integration | After an edit, the entries on the edited passage are stale; a re-extraction with recorded answers refreshes the matching entries, proposes the new ones, flags the unsupported ones, and touches no entry of another unit. |
| TST-MEM-005b | planned | unit | An author-edited entry is not refreshed by a re-extraction; the differing claim is proposed beside it. |

### SPEC-MEM-006: Author corrections

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P01, IPE-P04
- Implementation: none
- Acceptance priority: major

**Requirement.** The author must be able to correct a memory entry (its claim, its category, its subject, its basis), mark it disputed or settled, add or remove a supporting passage, merge two entries about the same thing, and recover any of these changes.

**Coverage.** Nominal: each correction is an edit of the object with its event in the journal, undoable (SPEC-KER-007); a merge keeps the anchors of both entries and the provenance of each, the merged entry naming the two it came from. Limit: a correction of an assistant's entry keeps the origin assistant and records the author's edit. Error: a merge of entries with different categories is refused with the reason. Degraded: none. Exclusion: bulk corrections by the assistant.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-006a | planned | unit | Each correction is recorded and undoable; a merge keeps both anchor sets and names its sources; a merge across categories is refused. |
| TST-MEM-006b | planned | e2e | From the memory panel, the author edits a claim, marks an entry disputed, merges two entries, and undoes the merge. |

### SPEC-MEM-007: Browsing the memory

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N09, IPE-P06
- Implementation: none
- Acceptance priority: major

**Requirement.** The product must list the memory by category and by subject, must filter it by unit and by state (proposed, established, disputed, stale, unanchored), must find entries by text, and must show, for the unit open in the editor, the entries that rest on it.

**Coverage.** Nominal: the panel lists entries grouped by category, each with its state; a filter by unit keeps the entries anchored in that unit; the entries of the open unit are listed beside the editor and a click selects the passage. Limit: an empty memory shows an explicit empty state with the extraction gesture. Error: none. Degraded: none. Exclusion: graph views.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-MEM-007a | planned | e2e | The panel groups by category, filters by unit and by state, finds by text, lists the entries of the open unit and jumps to a passage. |
