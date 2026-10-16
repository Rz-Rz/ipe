# Project memory design note (milestone J-MEM)

Version 0.1, 16 October 2026. Companion of `docs/KERNEL_DESIGN.md` and `docs/PROVIDER_DESIGN.md`. Requirements: `dossier-recette/19_PROJECT_MEMORY.md` (SPEC-MEM-001 to 007) and `15_ASSISTANT_ACTIONS.md` (SPEC-AST-002).

## 1. Entries are objects

A memory entry is a kernel object of kind `entry`. Its body:

```ts
interface EntryBody {
  claim: string;                       // one sentence
  category: "person" | "place" | "thing" | "institution" | "concept" | "term" | "event" | "relationship" | "rule" | "other";
  subject: string;                     // the name of what the entry is about
  basis: "explicit" | "inferred" | "plan";
  believedBy: string | null;           // whose belief the entry records, when it rests on a belief or a line of dialogue
  disputed: boolean;
  unanchored: boolean;                 // the quote was not found in the scope
  quote: string | null;                // what the assistant quoted, kept for the record; the passage itself is read from the anchors
  quoteNote: "repeated" | "normalised" | null;
  mergedFrom: string[];                // the entries a merge took in
  noLongerSupported: boolean;          // set by a reconciliation; never deleted by the product
}
```

Everything else is the kernel's: anchors (the supporting passages), provenance (origin, action, approval), version, stale, dependencies (the call record that proposed it). An established fact is an entry with `approval: accepted`, `disputed: false` and `basis !== "plan"`; the kernel's `accept` and `reject` are the author's decisions; a correction is `editObject` by the author, undoable through the journal (SPEC-KER-007). Categories outside the list are refused at creation by the entry module, not by the kernel, which owns no kinds.

## 2. The extraction

The action `extract` (packages/assistant) assembles the scope as `ask` does (SPEC-PRV-003), adds the established facts of the project as context (claims only, with their subjects, so the assistant proposes what is new), and asks for a JSON array in the system prompt:

```
Return a JSON array. Each element: { "subject": "...", "category": "person|place|thing|institution|concept|term|event|relationship|rule", "claim": "one sentence", "basis": "explicit|inferred", "believedBy": null or "who", "quote": "the exact words of the text that support the claim, copied verbatim" }. No prose outside the array.
```

The product reads the answer as JSON (the first `[`...`]` block when prose surrounds it); an answer with no readable array is the failure state `unparseable` (SPEC-PRV-006) and creates nothing; a partial array (some elements not of the shape) proposes the readable elements and reports the count of the others. Each readable element becomes a proposed entry, origin assistant, action `extract`, depending on the call record. The quote is located in the scope's text: exact first, then with whitespace and punctuation normalised (`quoteNote: normalised`); found more than once, anchored at the first occurrence (`quoteNote: repeated`); not found, the entry is created without anchor and `unanchored: true`. The anchor's `text` is the passage as the text holds it, never the quote.

## 3. Reconciliation

A new extraction of a scope matches each returned element against the live entries anchored in the scope's units: same `subject` (case-insensitive, whitespace-normalised) and same `claim` after the same normalisation is the same entry; it is refreshed (anchors replaced by the located quote, `stale` cleared by the kernel's refresh, `noLongerSupported: false`), unless the author edited it (an `edit` event by the author in its journal), in which case the element is proposed as a new entry beside it. An element with no match is proposed. A live entry of those units that no element matched is flagged `noLongerSupported: true` and shown as such; the product deletes nothing. Entries of other units are never touched (Q07).

## 4. The provenance question

`explain(entryId)` of the kernel gives the passages with their state, the version, the dependencies (the call record) and the staleness; the entry module adds the basis, `believedBy`, the disputed mark and the unanchored mark. The memory panel shows them in one answer.

## 5. Corrections and merges

Claim, category, subject, basis and the disputed mark are edited through `editObject` by the author (the origin stays what it was; the journal holds the edit). Adding or removing a supporting passage edits the anchors. A merge of two entries of the same category creates the merged entry with both anchor sets, `mergedFrom` naming the two, and deletes the two (tombstones, recoverable); undo restores them. A merge across categories is refused.

## 6. The corpus evaluation

`packages/assistant/test/corpus/` holds a fixture corpus: four short chapters of a serial with planted facts (explicit statements, inferences, a belief a character holds that the narration contradicts, a line of dialogue, an abandoned outline as a unit titled as such), a list of the planted facts with their expected basis, and recorded answers of a provider for each unit, in the documented JSON shape, replayed by the fake provider. The evaluation runs offline and reports, per basis and per flag, the counts of entries anchored, unanchored, repeated and normalised, and checks the product's invariants: an entry whose quote is in the text is anchored to a passage that holds it; an entry resting on the belief, the dialogue or the outline carries `inferred` and `believedBy` as the recorded answer states; nothing is created from an unreadable answer. The judgment of the model itself is not asserted offline: with `IPE_CLAUDE_API_KEY` in the environment, the same corpus runs live and the report lists the model's counts against the planted facts, as evidence for the operator, without a threshold until one is set by a specification change.

## 7. The memory panel

A panel of the desktop interface: entries grouped by category, each with its state (proposed, established, disputed, stale, unanchored, no longer supported) and its subject; filters by unit and by state; a text search; the entries of the open unit listed beside the editor, a click selecting the passage; the extraction gesture on the chosen scope with the preview and the review of the proposals (accept, reject, correct, one by one); the provenance question on any entry; the corrections and the merge. Channel additions: `entries(filter?)`, `createEntry`, `editEntry`, `mergeEntries`, `extract(scope, { provider, model, ticket })`, `reconcileReport`.
