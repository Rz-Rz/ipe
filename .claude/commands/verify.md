---
description: "Verify a delivered commitment under a mandate token and file the verdict. Load it when asked to review, approve or reject the delivery of a commitment."
---
# /verify: verifying a delivery

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

Whoever implements never judges. The verdict requires a MANDATE token, distinct from the lease,
on a diff whose fingerprint is frozen.

1. `lean mandat ENG-NNNN` issues the mandate and freezes the fingerprint of the diff.
2. Compare the diff against the definition of done, the requirements cited, and the Constitution.
   Run every test through `lean essai "command" --sorties file`: it records the command, its
   output and its exit code in the raw outputs file.
3. `lean verdict ENG-NNNN --jeton J --sens approve|reject|arbitrage --empreinte E
   --tests "command;command" --sorties file --constats verdict.json`. Every test cited must have
   been run through `essai`, a red test is never approved, and a rejection names at least one
   violation in the JSON of `--constats`; otherwise the verdict is refused. One verdict record is
   kept per mandate, and a rejection writes `.eng/REWORK.md` in the worktree.
4. On `approve`, the verdict integrates in the same transaction: the branch is merged into master,
   the commitment is marked `tenu`, the lease and the claims are settled, the steering record is
   committed, master is pushed to its remote, and the worktree and its branch are removed. Merge
   nothing and push nothing by hand.
5. If the integration is refused (conflict, uncommitted work, main checkout off master), the verdict
   stands and the refusal names the gesture. Once the cause is removed, run `lean integrer ENG-NNNN`.

**A mandate that is already open.** A second claim is refused (`mandat_deja_reclame`) while a mandate
is open, because a verifier holds it. If that verifier is dead, the mandate is stale, and there is
one path and no other:

- Read it, never touch it: `lean mandat ENG-NNNN --etat` gives its number, its issue time and
  its expiry. You never edit, move or delete the mandate record, you never wait for the expiry in
  silence, and you never file a verdict under a token you did not claim.
- Tell the operator what you read, and why you hold the verifier to be dead. Voiding a mandate is
  the gesture of the operator alone, because it throws away the work of a verifier that may still
  be alive. It is offered by the cockpit only (`Lean: void a verification mandate`, also in the
  menu of a commitment under verification), behind a confirmation that names the mandate and its
  age. No command line voids a mandate, and no flag stands for the confirmation of the operator.
- Once the operator has voided it, `lean mandat ENG-NNNN` issues its successor, and the
  verification starts again from the diff as it stands. A verdict filed under the voided mandate
  is refused (`mandat_revoque`): the verifier that receives that refusal stops and says so.

A delivery is verified as soon as it is pushed, by a verifier that did not implement it. The
session that delivered launches the `verifier` subagent itself: a subagent starts from a clean
context, and that is the independence the rule asks for. The operator is asked neither to trigger
the verification nor to carry out the merge or the push.

The verdict command answers with three blocks: the result (PASS, FAIL or HELD FOR ARBITRATION) with
the commitment restated, what is required from you, and what is for information only. Your closing
message to the operator keeps that order, and before you write it you settle the open points:

- A point you can close alone, with no effect on a requirement, a milestone, an interface or a
  scope, is closed now. It is never handed to the operator.
- A point you cannot close alone is filed at once, without waiting for the operator, under a
  reserved number. That holds for the conclusion of the report as well, when it calls for a
  structuring decision or for new commitments: a substantive choice as a DA with
  its options and your recommendation (`/arbitrage`), work that remains as a commitment
  (`lean numero ENG`), a change of requirement as an SCP (`/delta`).
- What needs no action is stated under a heading that says so: for information, no action required.
- An `arbitrage` verdict takes `--motif-arbitrage "..."`, and the DA is filed at once.
- A document that the delivery makes false or incomplete, and that lies outside the scope of the
  session that delivered, is updated now from the draft of the report. When a document changed, or
  one is left to change, your closing message ends with `## Documentation updated`: one line per
  document changed and what changed in it, then what is still to be applied and by whom. When no
  document changed and none is left to change, leave the section out.
