---
description: "Query the steering state through the lean CLI instead of reading files. Load it BEFORE answering any question about a commitment (ENG-NNNN), a requirement (SPEC-DOM-NNN), an arbitration (DA), a specification change (SCP), a decision (ADR), the frontier, sessions, batches, milestones or environment pitfalls, and before opening, listing or grepping any file of the state tree or of the requirements folder."
---
# /etat: query the state, and know what to do

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

Nothing here mutates anything. These commands read without the lock and without risk.
**Always start with `conseils`.** The others answer a precise question, and this one tells you
which question is being asked.

## Reading one thing: never by hand

A file of the state tree carries the record, never the computed state (frozen, waiting, ready,
under lease). Reading it with `cat`, `ls` or `grep` is refused by the `guard_lecture` hook. Ask:

- `lean show ENG-NNNN [--json]` gives the record of a commitment AND its computed state, its
  dependencies with their state, what it unblocks, the status of its requirements and its report.
- `lean show SPEC-DOM-NNN` gives the text of a requirement, its status, and the commitments
  that carry it. `lean show DA-NNNN`, `SCP-NNNN` and `ADR-NNNN` give those documents and their links.
- `lean search <terms> [--genre engagement|spec|da|scp|adr] [--statut S] [--json]` finds what
  matches every term, ignoring case and accents. Use it instead of filtering `etat` with a script.
- `lean pitfalls <terms>` returns only the sections of the environment pitfalls that
  concern your problem (for example `wsl path`). Read them before fighting the environment.

## Steering questions

- `lean conseils [--json]` lists what calls for action NOW. Each entry carries the observation,
  its reason, and the exact command. Three severities, in this order: `bloquant` (nothing moves
  until it is handled), `attente` (someone is waiting for an answer), and `hygiene`. An empty list
  means that nothing is due.
- `lean etat` gives the full projection. `lean dashboard` renders the board.
- `lean frontiere` lists the commitments **ready to pull now**, dependencies satisfied. That is
  where work is taken, and nowhere else.
- `lean sessions` shows what is **under way**, by whom, and the state of the leases.
- `lean lots [--json]` gives the **parallel batches** and their mutual exclusions. Two commitments
  whose `scope.paths` overlap are not pulled together, because they would rebase on each other.
  Ask before starting several sessions.
- `lean arbitrages [--toutes] [--json]` lists arbitration requests, **open ones by default**.
  `--toutes` adds those already settled, with their ADR.
- `lean streams [--json]` lists the **streams** the repository declares: the domains each one
  owns, the folder of its requirements, the paths it owns, and its commitments by state. A
  commitment belongs to the stream of its domains, and `show` names it. A repository that declares
  no stream has one implicit stream that owns everything. `frontiere`, `lots`, `sessions`,
  `conseils` and `dashboard` group by stream and take `--stream NAME`. A file that another stream
  owns is asked of that stream: `eng request-change --paths "a,b" --reason "why"`.
- `lean impact ENG-NNNN` states what this commitment unblocks, and what it freezes.
- `lean lignees` shows breakage that propagates. `lean backlog` shows the work left to do.
- `eng contexte [--json]` reports, from a worktree, what concerns THIS session.

## When a resequencing is needed

You do not guess it. `conseils` says so, and gives the command. There are three cases.

1. **Frozen by upstream breakage.** A commitment depends on one marked `rompu`, or replaced by one
   that is (a predecessor marked `abandonne` holds nothing back, and one marked `remplace` is read
   through its `remplace_par`). It will NEVER
   become ready on its own. The gesture is `lean resequencer ENG-NNNN --deps "..."`, to attach it
   to what actually carries it, or a variance if the work is no longer due.
2. **Path collision between ready commitments.** Reported at pull time and by `lots`. This is not
   a blocker, it is a serialisation. Pull one, deliver it, then pull the other.
3. **Bottleneck.** The frontier empties while the work left does not shrink. `conseils` names the
   commitment that unblocks the most, and that is the one to push through.

A resequencing changes the graph, so it is an operator gesture and not an agent initiative. If you
believe that one is needed and `conseils` does not offer it, open an arbitration request
(`/arbitrage`) rather than rewiring the dependencies yourself.
