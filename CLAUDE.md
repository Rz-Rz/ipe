# IPE: agent rules

1. Product intent: `docs/IPE_PRODUCT_BASELINE.md` (version in its header). Vision on one page: `docs/IPE_VISION_A3.md`. Kernel design note: `docs/KERNEL_DESIGN.md`. Decisions live in the state tree (`lean show DA-NNNN`, `lean show ADR-NNNN`); three are decided: DA-0001 first release, DA-0002 local-first desktop first, DA-0003 TypeScript kernel with an Electron shell.
2. Requirements: `dossier-recette/` (`SPEC-DOM-NNN`, conventions in `dossier-recette/02_CODIFICATION.md`). Requirements are written for the first milestone only. A requirement changes by SCP; a scope or architecture choice goes through a DA. An agent informs; it does not decide the product.
3. Steering: the Lean Engine, installed in this repository (`.lean-engine/`, source at `/home/ultimatron/projects/cercle/lean-engine`). Commands: `node .lean-engine/bin/lean.cjs` and `node .lean-engine/bin/eng.cjs`; session commands `/etat`, `/eng`, `/verify`, `/delta`, `/arbitrage`. Milestones: `.lean-engine/orchestration/MILESTONES.md`.
4. Writing: English. No em-dash. No calendar estimate in a planning document. No invented figure; an unknown value is written "target value, to confirm". "must", "should", and "may" are never mixed in one requirement. One term, one concept: the glossary is Appendix B of the baseline.
5. Commits: no AI tooling name and no attribution trailer, in the message or in the content. The author identity is the repository owner's, admitted through `lean identite`.
6. Architecture: ADR-0003. The kernel package imports nothing from Node or the DOM; storage, clock, identifiers and hashing are adapters; the interface imports no Node module and reaches the core through one message channel, so the browser surface reuses it.

<!-- lean-engine:debut -->

## Lean Engine: rules for agents

1. **The mutation lock is the authority on taking work.** Every transaction (pull, push,
   release, revoke, decide, reserve a number) runs in process under the lock of the state
   tree, executed by whoever asks for it: an agent session, or the VS Code cockpit. There is
   no server, no port and no daemon to start.
2. No commitment, no lease. A session works on the product only after it has pulled its
   commitment. Work is taken from the frontier of the graph, never by pushing work that is not
   ready. Commit messages follow the convention of the repository, with the suffix
   `[ENG-NNNN]`.
3. A number (ENG, SCP, ADR, DA) is **reserved** from the authority. It is never guessed by
   looking at the files that happen to be present.
4. Sources of truth: requirements live in `dossier-recette/` (identifiers `SPEC-DOM-NNN`), and
   steering lives in the state tree. Never duplicate a source of truth.
5. A substantive blocker becomes an arbitration request, addressed to a named decider, with
   enumerated options and a fallback. An agent never settles a substantive choice.
   When a delivery report or a verdict concludes that a structuring decision is needed, or that
   new commitments must be opened, the session that integrates files them at once, without
   waiting for the operator: the decision as an arbitration request with its options and the
   option recommended, the work as commitments with their scope and their definition of done,
   each under a reserved number. The operator acts on commitments and on arbitration requests,
   and is never asked to carry out a gesture of orchestration.
6. Commitments carry no deadline, because an agent does not work at the pace of a human. The
   temporal record is kept: creation, pull, delivery and release are all timestamped.

### 7. Writing style, and it applies to everything you write

   The working language of this repository is **standard business English**, without
   exception. That covers code, comments, identifiers, rendered strings, file names,
   documentation and specifications. The only exceptions are proper nouns, delivered locale
   catalogues, frozen corpora and oracles, and literal quotations of an output inside a dated
   record. **Write no French.**

   Write complete sentences. State the actor of every requirement, and give figures with
   their units rather than adjectives that cannot be measured.

   **The em dash is forbidden**, with no nuance. Use a colon, a comma, a brief parenthesis, or
   split the sentence in two. Punctuation stays sober: no exclamation marks, no ellipses, no
   emoji, and no chains of dashes or slashes standing in for a clause.

   Give no delay estimate in planning. State what is not known as an open point rather than
   presenting an estimate as a fact.

   These rules are not advisory. The `guard_style` hook refuses a write that breaks them, at
   the moment you write it, and `lean style` reports where the repository stands.

### 8. Signature and attribution

   Only the people the repository admits sign, each under their own name: they are listed in
   `.lean-engine/identities`, and `lean identite list` shows them with the identity of this
   workstation. When a user asks to work under their identity, run
   `lean identite use "Name" mail@example.org`: it admits the identity, sets git on it and
   aligns the guards, in one gesture. Run it at the request of that person only, never on your
   own initiative, and never set a git identity by another command. A pull records the person
   whose workstation took the commitment (`reserve_par`), besides the session that implements:
   that person is the one to warn when something goes wrong. The name of the tooling
   vendor appears nowhere: not in versioned content, not in a commit message, not in an author
   address, and not in an attribution trailer. Never add a `Co-authored-by`, `Generated with`
   or equivalent trailer, and never use a tool no-reply address. Produce no attribution
   artefact of any kind. `guard_identite` and `guard_style` refuse these forms, both when you
   write and when you commit.

### 9. Never infer the state by reading files. Ask for it

   `lean conseils` states what calls for action and why. `frontiere` lists what can be
   pulled, `sessions` what is under way, `lots` what can run in parallel, `arbitrages` what
   is open, and `streams` the streams the repository declares, with their domains, folders and
   paths. When a resequencing is needed, `conseils` says so: it is never guessed.
   One commitment, requirement or document: `lean show ID`. Anything by subject:
   `lean search <terms>`. Environment trouble: `lean pitfalls <terms>`. Standard and
   Program followed on the manifests (classification, tag, direction of a dependency,
   versions): `lean editions`, to run before you deliver a change of a manifest. Reading the
   state tree with `cat`, `ls` or `grep` is refused by `guard_lecture`. See `/etat` for the
   full surface.

### 10. Documentation follows the work, and the report says so

   When the completion of a commitment, of an arbitration request (DA) or of a specification
   change (SCP) makes a document false or incomplete, update that document at once, with the
   work that causes the change. It is never left for a later pass, because the session that
   knows why the document changed has ended by then. A session under lease updates what lies
   inside its scope and drafts in full what lies outside it, and the session that integrates
   applies that draft at once.

   When a document changed, or one is left to change, the report and the closing message end with
   a section `## Documentation updated`: one line per document changed and what changed in it,
   then what is still to be applied and by whom. When no document changed and none is left to
   change, the section is left out: nothing is written in its place.

### 11. Prior work is read before any work starts

   The files of a clone say what that clone knows, and nothing more. ENG-0272 was realised twice
   on 2026-10-11, because a session resumed on its local state while the commitment had been
   taken, realised and integrated on another clone.

   Before a commitment is opened, run `lean search <terms>` on its subject, then
   `lean prior ENG-NNNN` once its record is written. Before work starts, `eng pull` reads the
   remote: it refuses a commitment that the remote shows taken, closed or worked on elsewhere,
   and it lists the similar commitments, which the session reads first (`lean show`,
   `lean rapport`). When a session opens or resumes, and at each `eng push --progress`, the
   remote is read again. A session told that work on its commitment exists elsewhere stops
   writing and declares it (`eng push --blocage`): it never goes on from its local state.

   A take protects the work only once the remote holds it. Every steering transaction (pull,
   delivery, blocker, release, decision) therefore commits its records and pushes master by
   itself, and the cockpit fetches the remote on a period and fast-forwards master when that
   needs no merge. When a transaction answers `NOT PUBLISHED`, or `lean conseils` names
   commits that the remote lacks, remove the cause and push master: nobody else sees the work
   until then.

   The phases of a commitment are published too. A delivery records a commit on the branch of
   the commitment and pushes the branch, so that a verifier on another workstation reads it. An
   approval records a second one, and the branch is pushed again when the merge is left to
   another workstation. Commit your work before you deliver: what is not committed is not on
   the published branch. The main checkout stays on master: never check a branch out there,
   and work each commitment in its own worktree.

   A change made by hand is no transaction, and nothing publishes it for you. Every
   resequencing, milestone planning, opening, amendment, narrowing or withdrawal of a
   commitment, and every arbitration request or specification change written, is committed
   and pushed at once, before anything else is done:
   `lean publier "chore(steering): what changed and why [ENG-NNNN]"`. Until it is pushed,
   another workstation reads the former state and can take the commitment as it stood.
   `--acknowledged "reason"` pulls past a refusal, once what exists has been read.

Tools, run from the root of the repository or of a worktree:

```bash
node .lean-engine/bin/lean.cjs conseils  # what to do now, and why
node .lean-engine/bin/lean.cjs --help    # steering: state, frontier, batches, arbitrations
node .lean-engine/bin/eng.cjs --help         # agent session: pull, push, contexte, release
```

<!-- lean-engine:fin -->
