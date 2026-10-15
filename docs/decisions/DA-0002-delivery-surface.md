# DA-0002: On which surface and data locality does IPE ship first?

```yaml
statut: decidee
decideur: "Karim Dhrif"
demandeur: "coordinator"
defaut_si_silence: "A"
engagement: null
ouverte_le: '2026-10-15T00:00:00+00:00'
```

## Context

The baseline v0.1 lists "broad web availability and cross-platform reach" as a confirmed direction and states that later desktop availability must not replace the web-access requirement. Three other needs pull the other way: offline drafting (Q01), project files that remain usable without the product (P05, the Markdown need), and the use of AI access the author already pays for (N04), whose documented OpenAI route names open-source and locally hosted apps and directs paid or remotely hosted applications to an interest process (baseline Appendix A, S2, S3). The first release (DA-0001) is single-user; collaboration (N18) is deferred.

## What is at stake

The kernel's storage model, the provider integration path, and every quality requirement about offline operation and preservation depend on where the data lives and which surface ships first. Choosing by default would leave the baseline's web statement in force while the requirements assume local files.

## Closed question

On which surface and data locality does IPE ship first: A, B, or C?

## Options and consequences

**A. Local-first core, desktop application first, browser surface later.** Data on disk in documented formats. It changes the baseline's confirmed direction. It costs builds and code signing for several operating systems and defers browser access to a later surface served by the same core.

**B. Local-first browser application first.** Data in browser storage, with optional sync. It keeps immediate web access. It costs the files-on-disk promise, since browser storage is subject to eviction and filesystem access is not available in every browser, and it leaves the plan-usage eligibility of a browser-delivered app unverified.

**C. Hosted web application first.** Data on a server with accounts. It keeps immediate web access and makes later collaboration native. It costs offline drafting, files on disk, and server operation with accounts before the first user, and it matches the provider route that goes through an interest process.

| Criterion (countable, sourced) | A | B | C |
|---|---|---|---|
| Documented plan-usage route for this surface (baseline Appendix A) | named: locally hosted apps [S2] | not named; unverified | interest process for remotely hosted apps [S2][S3] |
| Offline drafting (Q01) | full | subject to browser storage eviction | none without additional sync |
| Project files on disk in documented formats (P05, Markdown need) | yes | not in every browser | no |
| Build targets | 3 operating systems, signing per OS | 1 | 1 plus server |
| Servers to operate before the first user | 0 | 0, static host | 1 or more, plus accounts |
| Collaboration (N18, deferred) | needs a sync service later | same | native |
| Baseline statement "broad web availability" | deferred to a later surface | kept | kept |
| Reversibility toward the other surfaces | the browser surface reuses the interface if it is built in browser technology; condition of the decision | desktop wrapper later | local-first retrofit costs a storage rewrite |

## Recommendation

**A.** It satisfies three needs at once, N04 eligibility, Q01 offline, and P05 ownership, and keeps B reachable under one condition: the interface is built in browser technology and the core does not depend on desktop-only facilities except through an adapter, so one core serves both surfaces. What was checked: the provider routes in baseline Appendix A as reviewed on 13 October 2026. What remains unknown: whether a desktop IPE qualifies for either provider route, which needs verification before the provider domain is specified; the exact operating systems to support.

## Fallback

A

## Decision (filled by the decider only)

```yaml
choix: A
motif: "Operator decided desktop first in session on 2026-10-15. Condition kept: the browser surface remains a committed later deliverable, and derived architecture must show how one core serves both surfaces or raise a DA."
date: 2026-10-15
```
