# A3: The IPE vision

```yaml
version: 0.1
date: 2026-10-15
owner: Karim Dhrif
sources: [docs/IPE_PRODUCT_BASELINE.md (v0.2), docs/decisions/DA-0001, docs/decisions/DA-0002]
usage: internal; this page orients decisions; the requirements folder remains the only normative reference for requirements
```

This document fits on one page: context, stake, vision, users, value, non-goals, measures. It orients decisions. It contains no requirement.

## 1. Context: the problem

Writers of substantial works juggle three tool families that do not connect: organizers (Scrivener, Ulysses), note graphs (Obsidian, Notion), and AI writing assistants (Sudowrite, NovelCrafter, chat windows). Three facts structure the need:

1. **Continuity breaks silently.** Facts, timelines, and who knows what at which point live in the author's head or in notes detached from the text. Errors surface after publication. Serial writers publish chapters for years with no editorial pass between them.
2. **AI assistance forgets and flattens.** A chat window loses the project between sessions. Generation normalizes voice. Nothing records what was generated, what was accepted, and what it rested on, so the author cannot tell their own decisions from the machine's.
3. **Ownership is fragile.** Hosted tools hold the work. A lapsed subscription or a changed provider policy strands it. Exports flatten structure, notes, and history into text.

## 2. Stake: the vacant layer

Each tool family covers one activity. None carries provenance across the whole loop (reading, notes, research, drafting, revision, publication), and none tracks the state of a work over story time. The ambition in one sentence: **IPE wants to be, for substantial writing, what a version-controlled development environment is for code: the place where every fact, note, and generated passage keeps its origin.**

## 3. Vision: local-first, provenance-bearing, assistant under authorial control

Project data lives on the author's device in documented formats, Markdown for the manuscript. Four layers: files on disk; a provenance kernel (objects anchored to passages, versioned, marked stale when their sources change); views over those objects (project memory, chronology, structure, status windows, revision impact); and assistant actions that are scoped, permissioned, and run on the providers the author chooses. The desktop application ships first; the browser surface follows on the same core (DA-0002).

Three principles govern each decision: authorial control (nothing becomes manuscript or established fact by being generated); honesty (scope, version, uncertainty, and missing evidence are reported, never fabricated); cost scales with change (a project is kept current by re-evaluating what an edit touched, not by re-reading the project).

## 4. Users

| Persona | What they expect from the product | What loses them |
|---|---|---|
| **Serial writer** of progression fantasy or LitRPG (first release, DA-0001) | Hundreds of chapters without continuity slips; status windows correct at their story time; export to the serial platform and to EPUB in one gesture; AI that drafts in their voice from their notes | A rewrite of their voice; a continuity error found by readers; a chat that forgot last week's chapter; a warning flood they stop reading |
| **Novelist with a series** | Established facts and timelines across books; the impact of a change before making it | Opaque summaries they cannot verify; alternatives lost when a draft is abandoned |
| **Academic or nonfiction author** (later) | Claims traced to evidence; conflicting sources tracked; reviewer responses linked to revisions | An invented citation; a conclusion that exceeds the evidence without warning |
| **Translator** (later) | Aligned source and target; terminology decisions preserved; source edits that point at affected target passages | One literal rendering treated as correct; decisions lost between versions |
| **Campaign creator** (later) | Planned scenarios distinct from what happened; participant knowledge tracked | A spoiler leaked to a player; two continuities merged |
| **Comic adapter** (later) | Storyboards from prose; references approved before generation; lettering editable | A whole composition discarded to fix one element; images silently out of date |

## 5. Reference use cases of the first release

A weekly chapter is drafted from the writer's notes under a brief, with a status window inserted at its story time. "Did she know this yet?" is answered with passages and a verdict: explicit, inferred, or not established. "Move the betrayal one chapter earlier, do not edit yet" returns the affected scenes, knowledge, and displays. The project exports to serial-platform HTML and EPUB while the research and alternative scenes stay in the project. The provider is swapped without rebuilding the brief, and the project keeps working with no provider at all.

## 6. Value proposition and differentiators

1. **Proof over promise.** Every honesty and preservation requirement is a test or a corpus evaluation that fails if it regresses. Limits are stated with the same precision as capabilities.
2. **Provenance by construction.** Objects carry origin, sources, version, approval state, and staleness. Views are projections, so continuity, chronology, displays, and impact analysis agree because they read the same objects.
3. **Story-time-correct displays.** A status window is a fact at a moment, not the character's latest state.
4. **Your files, your providers.** Markdown on disk, a documented object store, author-supplied provider access as the floor, subscription routes where verified.
5. **Writing stays simple.** The ordinary surface is a writing environment; analyses and automation are available, never mandatory.

## 7. Non-goals

IPE is not a playable game engine, a social network, a general illustration editor, or an autonomous publishing service. It does not guarantee literary quality, perfect historical verification, or perfect visual consistency, and it does not promise access to every AI subscription. The first release is single-user; hosted collaboration is a later surface. IPE is not a platform for running software-development agents.

## 8. Measures of success and limits stated to date

Success is measured by the movement of requirements from planned to partial to implemented on the traceability matrix; by promises kept in the commitment registry; on pilot projects, by the share of warnings a writer acts on against those dismissed, by the recovery of originals after assisted edits, and by export round-trip fidelity; and by writers who keep a project in IPE after the pilot. Numerical targets are set from pilot measurements, not here.

Limits to date: no code exists; no pilot has run; provider subscription routes are unverified for a desktop product; the browser surface is committed but unscheduled.
