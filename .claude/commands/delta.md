---
description: "Change a requirement through a specification change request (SCP). Load it whenever a requirement of the requirements folder must change: a requirement is never edited by hand."
---
# /delta: changing a specification

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

A requirement is modified ONLY by an accepted SCP. Never by hand, and never from a form.

1. `lean numero SCP` reserves the identifier from the authority, and `lean modele SCP` prints the
   template with the latest SCP as an example: read nothing else to learn the form.
2. Write the SCP to the template: intent (from the product point of view, with no solution), scope
   and non-goals, the proposed modification, **a concrete example**, and validation.
3. Acceptance is an operator gesture. It authorises the change to the requirements folder, it does
   not write it.
4. Once the SCP is accepted, the change is written at once, by the session that holds the role for
   it: the requirement, then every document that the change makes false or incomplete. It is never
   left for a later pass. When a document changed, the closing message ends with
   `## Documentation updated`: one line per document changed and what changed in it, then what is
   still to be applied and by whom. When no document changed, leave the section out.
