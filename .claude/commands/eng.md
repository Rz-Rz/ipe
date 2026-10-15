---
description: "Steer commitments: pull the next one from the frontier, report status, draft from the backlog, close a commitment as held or broken. Load it when starting work on the product, when asked what to work on next, or when a commitment must change status."
---
# /eng: steering commitments

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

The mutation lock is the authority. Every gesture below is a transaction.

Before deciding anything, run `lean conseils` (see `/etat`). It states what is due, and whether a
resequencing is required.

- `next` runs `lean verifier` then `lean frontiere`. Offer the first commitment to the operator with
  its record. On agreement, run `eng pull <ENG> --promettant <name>`. The transaction places the
  claims, the `pris` status, the worktree and the lease, atomically, then commits its records and
  pushes master by itself: a take protects the work only once the remote holds it. Its output says
  `published`, or `NOT PUBLISHED` with the cause, and that cause is then removed and master pushed
  by hand. The same holds for a delivery, a blocker, a release and a decision. The work is done in
  a live session pointed at the worktree that was returned.
- Every change made by hand to the steering state is published at once, before anything else: a
  draft completed, a commitment amended, narrowed or withdrawn, a precedence rewired, a milestone
  planned, a DA or an SCP written. Run `lean verifier`, then
  `lean publier "chore(steering): what changed and why [ENG-NNNN]"`, which commits the state tree and
  pushes master. Until then another workstation reads the former state and can take the commitment
  as it stood.
- Prior work is read before any work starts. The pull reads the remote and refuses with `prior_work`
  a commitment that the remote shows taken, closed or worked on elsewhere: merge the remote master,
  read `lean show <ENG>` and `lean rapport <ENG>`, and pull again only if the work is still
  due, with `--acknowledged "what exists, and why the work is still due"`. The pull also lists the
  similar commitments of the registry, and the context pack repeats them: the session reads their
  records and reports before it writes. `lean prior <ENG>` gives the same answer at any time, and
  is run on every commitment that is opened by hand, before it is committed.
- `status` runs `lean dashboard`, then summarises the arbitrations awaiting an answer, the
  anomalies, the commitments in flight, and the state of the leases (`lean sessions`).
- `backlog [DOM]` runs `lean backlog [--domaine DOM]`, the objective work left in the requirements
  folder. Formalise only what approaches the frontier.
- `draft SPEC-ID...` runs `lean draft <IDs>`. Complete the draft (scope.paths, depends_on,
  beneficiary), then finish with `lean verifier`.
- `tenu ENG-NNNN` needs no gesture after an approving verdict: `/verify` merges, marks the commitment
  `tenu`, pushes master and removes the worktree in one transaction. `lean integrer ENG-NNNN` repeats that
  transaction when it was refused, once the cause named by the refusal is removed.
- The chain runs without the operator: pull, implementation in the worktree, `eng push --livraison`,
  then `/verify` at once by the `verifier` subagent that the delivering session launches (a subagent
  starts from a clean context, so it did not implement), then the automatic integration and push.
- A delivery report opens with `## Result`, whose first line is `PASS` or `FAIL` against the definition
  of done. The session closes alone every open point it can close inside its scope, drafts the
  others in full under `## Open points that need someone else` (a DA with its options and the option
  recommended, an ENG, or an SCP), and puts the rest under `## For information, no action required`.
  The delivery command answers in the same three blocks.
- When a delivery report or a verdict concludes that a structuring decision is needed or that new
  commitments must be opened, file them at once, without waiting for the operator: reserve the
  numbers (`lean numero DA|ENG|SCP`; `lean modele DA|ENG|SCP` prints the template and the latest
  record of the family as an example), open the DA with its options and the option recommended
  (`/arbitrage`), write the commitments with their scope, their definition of done and their
  dependencies, then run `lean verifier`. Filing is orchestration and is never handed to the
  operator. Settling is not: the operator decides the DA, and acts on the commitments.
- Documentation follows the work. When a commitment, a DA or an SCP that completes makes a document
  false or incomplete, update it at once, and apply at once what a report drafted for a document
  outside the scope of its session. When a document changed, or one is left to change, the report
  and the closing message end with `## Documentation updated`: one line per document changed and
  what changed in it, then what is still to be applied and by whom. When no document changed and
  none is left to change, the section is left out: nothing is written in its place.
- `lean abandonner ENG-NNNN --motif "..."` and `lean remplacer ENG-NNNN --par ENG-XXXX` close a
  record without a broken promise: withdrawn (its work void, done elsewhere or no longer wanted), or
  carried by another record; neither counts in the PPC, and the obeya hides both.
- `rompu ENG-NNNN <reason>` sets the status to `rompu` with its variance, runs
  `lean relacher ENG-NNNN`, then shows the impact (`lean impact`) and proposes a new commitment if
  the work is still due.

From a worktree under lease, a session asks what concerns it with `eng contexte`: its state, and
the next step. Before pulling a SECOND commitment in parallel, check `lean lots`, because two
overlapping scopes have to be serialised.
