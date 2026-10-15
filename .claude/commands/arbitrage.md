---
description: "Open or read an arbitration request (DA). Load it when a substantive choice blocks the work, or before settling any question of substance: an agent informs, a named decider settles."
---
# /arbitrage: arbitration request

> In this file, `lean` and `eng` mean `node .lean-engine/bin/lean.cjs` and
> `node .lean-engine/bin/eng.cjs`, run from the root of the repository or of the worktree.

A DA asks a CLOSED question of a named decider. An agent informs, it does not settle.

What is already filed: `lean arbitrages` for the open ones, or `--toutes` to add those settled, with
the ADR that settled them. Read them before opening a new one, because the question may already
have its answer.

1. `lean numero DA` reserves the identifier, and `lean modele DA` prints the template with the
   latest request as an example: read nothing else to learn the form.
2. Investigate before you ask. Then write the request for a reader who has none of your context:
   the decider reads the page of the request and nothing else. Explain every identifier at its
   first use, in plain words, and state what the product does today before what went wrong.
3. An open DA passes a gate where it is written, and it is refused until it holds all of this:
   - `## Context`, at least 300 characters: what the product does today, what happened, and why
     that is a problem.
   - `## What is at stake`: what waits for the decision, and what happens if it is not taken.
   - `## Closed question`: one question, with its question mark, answered by naming an option.
   - `## Options and consequences`: **at least two options**, each with what it changes and what it
     costs. They are read from paragraphs opened by `**A. Title.**` followed by the consequences,
     from a table with one column per option (`A: title`) whose rows are the criteria, or from a
     list `- A: Title. Consequences`.
   - `## Recommendation`, which opens with **the option you recommend**, then why.
   - The fallback in the header (`defaut_si_silence` or `escalade`).
   A concrete example is asked for as well, under `## Concrete example`; the gate does not check it.
   The gate reads what the page of the decider shows, and `lean conseils` names any open request
   that does not pass it. The gate measures that each part is written, never that it is understood.
4. **A request returned for study.** The decider who cannot decide on a request sends it back, with
   the reason. `lean conseils` then names it, and `lean show DA-NNNN` gives the reason under
   `## Returned for study`. You do not settle the question and you do not patch a sentence: you
   investigate the problem again, from the code and the records, and you rewrite the context, the
   stake and the options. Then `lean republier DA-NNNN` puts the request back to its decider. It
   refuses a request that reads as it did when it was returned, and one that does not pass the gate.
5. A commitment blocked on a choice of substance has no question of its own: its `BLOCKED.md` is
   written with the sections of a request, and its delivery files it as DA-NNNN, open, under a
   reserved number. Nothing is answered from the page of the commitment. `lean arbitrer ENG-NNNN`
   files the request from a report delivered before this rule. The session that waits runs
   `eng attendre DA-NNNN` in the background: the decision wakes it, and it resumes by itself.
6. The decision is a human gesture: `lean decider DA-NNNN --choix X --motif "..."`, which produces
   the ADR and settles the commitment to answer.
7. Once the DA is decided, what the decision implies is carried out at once, without waiting for the
   operator: the commitments it calls for are filed under reserved numbers, the change of
   requirement it calls for is filed as an SCP (`/delta`), and every document that the decision
   makes false or incomplete is updated. When a document changed, the closing message ends with
   `## Documentation updated`: one line per document changed and what changed in it, then what is
   still to be applied and by whom. When no document changed, leave the section out.
