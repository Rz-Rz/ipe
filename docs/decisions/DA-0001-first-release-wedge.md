# DA-0001: Which first release does IPE build?

```yaml
statut: decidee
decideur: "Karim Dhrif"
demandeur: "coordinator"
defaut_si_silence: "A"
engagement: null
ouverte_le: '2026-10-15T00:00:00+00:00'
```

## Context

The baseline v0.1 (13 October 2026) names seven audiences, twenty needs, and eight acceptance journeys, and states in Section 7 that no first release is approved. Under the steering method, requirements are written for the first milestone only, so no requirement can be written until a first release is chosen. The baseline also says that selecting a first release must not erase the wider vision. Four candidate wedges were compared on countable facts from the baseline and its Appendix A. No market figures were available and none are invented here.

## What is at stake

The requirements folder, the milestone table, and the first commitments all wait on this choice. Without it, either nothing is specified, or the whole vision is specified up front, which the method forbids and which would precede any user evidence by a long way.

## Closed question

Which first release does IPE build: A, B, C, or D?

## Options and consequences

**A. Long-serial continuity and system displays.** Writers of progression-fantasy and LitRPG serials. Needs N01 (lean), N03, N09, N10, N15, N17, N19, plus the provider access they require (N04). It makes the product a continuity and display tool for very long works before anything else. It costs the kernel, project, provider, generation, memory, chronology, display, revision, and publishing domains.

**B. Evidence-based nonfiction.** Academics and journalists. Needs N01, N05, N08, N13, N17, N19, plus N04. It makes the product a research and argument tool first. It costs the kernel, project, provider, assistant, research, argument, revision, and publishing domains, plus PDF ingestion and external discovery.

**C. Reading study and craft library.** Readers who write. Needs N01, N06, N07, N12, plus N04. It makes the product a study tool first. It costs the kernel, project, provider, study, library, and style domains, and depends on the reader supplying the text of the works studied.

**D. Visual adaptation.** Comic adapters. Needs N01, N15, N16, plus N04. It makes the product a storyboard and image tool first. It costs the kernel, project, provider, display, and visual domains, and depends on image-generation access and on consistency across generated images.

| Criterion (countable, sourced) | A | B | C | D |
|---|---|---|---|---|
| Needs covered, of 20, plus N04 in every case | 7 | 6 | 4 | 3 |
| Needs with no competitor named in the review of 15 October 2026 | 1 (N15) | 0 | 0 | 1 (N16 provenance) |
| Established tools covering the core activity (coordinator's review, to verify) | 1: NovelCrafter codex, a project memory without story-time state or provenance | 4 or more: Zotero, Overleaf, Elicit, Scite | 2: Readwise Reader, reading notes in chat tools | 2 or more: Clip Studio Paint, generic image generators |
| Provider capabilities required | text | text, external discovery | text | text, image generation |
| Documented plan-usage route covers the required capability (baseline Appendix A) | yes for text [S2] | text yes [S2]; discovery not documented | yes for text [S2] | image generation excluded [S4] |
| Third-party text the user must supply | none, own manuscript | sources and PDFs | the studied works; protected contents cannot be retrieved | none |
| Domains to specify before first value | 9 | 8 | 6 | 5 |
| Reversibility | the kernel serves every other wedge | same | same | same |

## Recommendation

**A.** The two needs with no competitor and the strongest moat, a project memory with story-time state, land in A. Serial writers produce the longest works, publish without an editorial pass, and adopt AI assistance heavily, so continuity pain is highest there. A needs text capability only, which both documented plan-usage routes cover. What was checked: the needs and Appendix A of the baseline. What remains unknown: no market sizing was done; no pilot writer has been consulted; the precision of knowledge-timing checks on real serials is unmeasured.

## Fallback

A

## Decision (filled by the decider only)

```yaml
choix: A
motif: "Operator accepted the coordinator's recommendation in session on 2026-10-15. The wider vision stays in the baseline; deferred needs keep their identifiers."
date: 2026-10-15
```
