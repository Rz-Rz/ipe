---
description: "Start steering a product: vision, domains, milestones, first requirements and first commitments. Load it when the project has no domain declared in dossier-recette/02_CODIFICATION.md, no milestone, or no commitment yet, which is the state right after the system is installed, and when `lean conseils` names /bootstrap. Run it with the operator."
---
# /bootstrap: start steering a product

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

Run this ONCE, on a repository that has neither a requirements folder nor milestones. Every step
is taken WITH the operator: an agent informs, it does not decide the product.

**Step 0, the survey.** `lean conformite` reports what the repository already carries: rules,
requirements folder, state tree, commitments and commands. Nothing existing is overwritten.

**Step 1, the vision.** Ask the operator three questions. Which problem does the product solve,
for whom, and how will we know that it is solved. One sentence per answer, not one page.

**Step 2, the domains.** List the subsystems with the operator. Each takes a short code, which
becomes the requirement identifier (`SPEC-<CODE>-NNN`). Fill in the table of
`dossier-recette/02_CODIFICATION.md`.

**Step 3, the milestones.** Turn the objectives into milestones in `<state>/MILESTONES.md`. A
milestone groups requirements and serves as the beneficiary of commitments. Give no delay estimate.

**Step 4, the first requirements.** For the FIRST milestone only, because the rest of the work is
not specified in advance. Each requirement is written so that it can be verified, with a named
actor and figures. See the writing rules in the repository rules.

**Step 5, the first commitments.** `lean backlog` shows what no commitment covers, and
`lean draft SPEC-...` files a draft. Complete scope.paths, depends_on and the beneficiary, then run
`lean verifier`.

**Step 6, the check.** `lean verifier` must be green, and `lean frontiere` must offer at least one
commitment ready to pull. Without that, no session can start.
