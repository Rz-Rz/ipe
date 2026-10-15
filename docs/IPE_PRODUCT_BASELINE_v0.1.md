# IPE — Product Vision & Needs Baseline

**Integrated Publishing Environment · Version 0.1 · 13 October 2026**  
**Status:** Consolidated proposal for product-owner approval. Not an approved implementation plan.  
**Purpose:** The reference from which product specifications, architecture decisions, development tasks, and acceptance tests are derived.

This document consolidates the creator’s stated ambitions and the capabilities developed in the preceding discussion. Detailed behaviors and acceptance examples are proposed requirements, not claims about an existing product. Inclusion in the product vision does not commit a capability to the first release.

## 1. Product purpose

**IPE helps people turn ideas, research, and inspiration into deliberate, coherent, publishable work—while retaining control over meaning, style, evidence, and authorship.**

It brings together the activities surrounding substantial writing: capturing thoughts, studying other works, developing notes, researching, planning, drafting, analyzing, revising, translating, illustrating, collaborating, and publishing.

AI should be able to participate throughout this process, including writing passages when requested. It should work from the author’s chosen context and intentions, not replace them with generic preferences. Authors should be able to use existing AI access where the provider officially supports that use.

The defining experience is continuity: an observation from reading can become a developed note, a writing experiment, a scene, an illustration, and part of a finished publication without losing its origin or the decisions behind it.

**Success means greater creative control and a stronger finished work—not simply more generated text.**

## 2. Audience and scope

IPE serves fiction writers, including science-fiction, fantasy, and game-inspired fiction; academics and researchers; journalists and nonfiction authors; translators; roleplayers and campaign creators; and creators adapting written work into illustrated narratives or manhua-style comics.

These audiences share a workspace but need different practices. Fiction must accommodate invention and deliberate ambiguity. Research and journalism need evidence and attribution. Translation needs source–target relationships. Roleplaying needs separate plans, actual events, and participant knowledge. No single writing template should govern everyone.

**Confirmed direction:** broad web availability and cross-platform reach; substantial writing and research; project-wide understanding; Markdown; optional Vim/Neovim-style power-user workflows; extensibility; book-study and note-development workflows; configurable status windows; AI-assisted illustrations; existing-provider AI access; and drafting from written or spoken notes.

**Technical choices are not established here.** Earlier framework, editor, hosting, database, and desktop-wrapper suggestions are not requirements. Lua remains an explicitly expressed scripting preference to assess against the extensibility need, not an implicit decision about the whole product. Broad accessibility is a goal; exact supported environments and release sequencing remain to be specified.

## 3. Product principles

**IPE-P01 — Authorial control.** Authors choose the purpose, style, degree of assistance, and permitted actions. They can write manually, request critique, or authorize generation. AI suggestions do not become accepted manuscript content or established project facts merely by being generated.

**IPE-P02 — Evidence and uncertainty.** The product distinguishes source material, direct observations, interpretations, hypotheses, and creative proposals. Substantive analytical claims should be traceable to supporting material; incomplete analysis must be recognizable.

**IPE-P03 — Context before judgment.** Guidance must account for the work’s audience, discipline, genre, voice, and intentional exceptions. There is no universal score that defines good writing.

**IPE-P04 — Preservation and reversibility.** Important transformations preserve recoverable originals, decisions, and alternatives. Authors should understand what changed and be able to recover previous work.

**IPE-P05 — Ownership and portability.** Authors control their projects and authorized sharing. Changing providers, devices, or services must not strand their work. Essential writing remains useful without AI.

**IPE-P06 — Approachable depth.** Ordinary writing should remain simple. Advanced analyses, visual authoring, automation, and keyboard customization should be available without becoming mandatory obstacles.

## 4. Capability needs

The identifiers below are permanent reference points. They express user outcomes, not components, screens, implementation order, or engineering solutions.

### IPE-N01 — Organize and write substantial projects

**Need:** Develop a work as a connected project rather than a collection of unrelated files and conversations.

Authors should organize manuscripts, chapters, scenes, research, notes, references, and assets; write continuously across sections; and inspect the same material through outlines, hierarchical organization, cards, or focused writing views. Rearranging material should preserve its meaningful associations.

Drafting should include side-by-side reference use, annotations, bookmarks, search, and comfortable long-form editing. Footnotes, citations, figures, tables, equations, captions, and cross-references should be available where the work requires them. Markdown and formatted writing should be usable without silent loss of unsupported material.

**Success example:** A writer moves a scene to another chapter without losing its notes, source links, or review history.

### IPE-N02 — Capture and develop written and spoken ideas

**Need:** Start from rough thoughts without first making them orderly enough for a formal document.

Authors should capture typed fragments, dictated text, and recorded or imported voice notes, then organize them into ideas, questions, outlines, arguments, or scenes. Transcription should be correctable, with uncertainty visible. Recording retention and deletion should be under user control; retained recordings should remain locatable from the related notes.

The original capture, corrected transcript, expanded notes, and resulting prose must remain distinguishable. The assistant should clarify, enrich, challenge, connect, or reorganize notes while preserving the original thought and identifying its additions.

**Success example:** A spoken scene idea becomes a reviewed outline and draft, while the writer can still recover what they originally said.

### IPE-N03 — Draft passages from an explicit creative or editorial brief

**Need:** Turn selected notes and intentions into useful prose rather than generic completion.

Authors should request a sentence, passage, dialogue, scene, section, or alternative version, specifying purpose, audience, language, tone, point of view, length, required content, and prohibited changes. Project-wide instructions may be refined for particular chapters, narrators, or characters.

Generation should respect chosen sources, terminology, established facts, and permitted invention. In nonfiction, missing evidence must not be filled with invented citations or findings. In fiction, newly invented details should remain proposals until accepted. Preserve ambiguity, quotations, and uncertainty when requested.

Authors should compare alternatives, accept selected changes, or retain a proposal outside the manuscript.

**Success example:** “Develop these voice notes into a tense confrontation. Keep the narrator detached, preserve the secret, and do not introduce new world rules.”

### IPE-N04 — Use existing AI access and choose providers

**Need:** Use AI access the author already pays for, where officially supported, without making the project dependent on one provider.

Authors should connect, select, replace, and disconnect supported AI access. Subscription-backed access is a first-class objective, not an assumption that any consumer plan can power any third-party application. Other authorized access should be available where appropriate, with charges clearly distinguished.

The product should explain which features a connection supports, whether usage draws from a subscription allowance or another balance, and what happens when limits are reached. Text assistance, transcription, research, and image generation may have different availability.

Changing a provider must preserve project context and approved instructions. The product must not quietly change provider, expose additional material, or begin separately billed usage outside the author’s authorization.

**Success example:** An author changes the service used for drafting without rebuilding their project brief or losing their notes.

### IPE-N05 — Direct AI assistance across the project

**Need:** Ask useful questions and delegate bounded editorial work without repeatedly reconstructing the project context.

Authors should choose an action and its scope: a passage, chapter, source collection, project, or series. Assistance should support discovery, explanation, critique, brainstorming, research, and editing as distinct activities.

The author should be able to inspect what material was considered, what was excluded, and whether the analysis is current. Imported documents and quoted content must not authorize actions or override the author’s instructions. External access and manuscript changes require appropriate user permission.

Actions should be interruptible, reviewable, and recoverable. Optional proactive suggestions should be configurable, including a quiet mode.

**Success example:** “Find contradictions in the current draft, quote the evidence, and suggest questions for me. Do not rewrite anything.”

### IPE-N06 — Study books chapter by chapter

**Need:** Understand how existing works produce their effects and use that understanding as inspiration.

Readers should study available books or passages at passage, scene, chapter, and whole-work levels. Analysis should distinguish events from craft: chapter construction, narrative techniques, style, imagery, character revelation, exposition, and possible reader effects.

Interpretations must connect to the material actually examined and allow competing readings. The product should state its coverage and identify the relevant edition or translation where available. A title alone must not be treated as access to a book’s contents.

First-reading analysis should respect spoiler boundaries; retrospective study should connect earlier setup with later developments. Original reader reactions should remain available.

**Success example:** Compare how three chapters build unease, with supporting passages and no information beyond the selected reading boundary.

### IPE-N07 — Build a personal library of craft and ideas

**Need:** Turn reading observations and scattered notes into reusable understanding.

Authors should highlight, annotate, link, group, and revisit notes; develop them with assistance; and preserve source passages, personal observations, AI interpretations, and original writing ideas as distinct contributions.

A useful observation should become a reusable craft note describing a technique, examples, possible effects, limitations, and an experiment for the author’s own work. Notes should support comparison across works and reuse across projects with explicit scope and sharing controls.

Assistance should deepen thinking rather than merely increase word count, and should not disguise borrowed passages as original writing.

**Success example:** “Find techniques in my reading notes that could make this negotiation threatening without physical violence.”

### IPE-N08 — Research with traceable evidence

**Need:** Connect claims and creative decisions to research that can be inspected and revisited.

Authors should collect documents, interviews, references, and research notes; retain source details and precise locations where available; and distinguish quotation, paraphrase, interpretation, and invention.

Research should track supporting and conflicting accounts, open questions, verification status, and the relationship between a statement and its evidence. Historical work should preserve period, place, uncertainty, and deliberate departures from documented material.

The product should support research from selected materials and, when authorized, external discovery. It must distinguish absence of evidence from evidence against a claim and identify unavailable sources rather than pretend to have reviewed them.

**Success example:** A writer can inspect whether a historical detail is documented, disputed, reconstructed, or intentionally fictionalized.

### IPE-N09 — Maintain an inspectable project memory

**Need:** Find what the work establishes without relying on opaque summaries.

The project should connect people, characters, places, objects, institutions, concepts, terminology, events, relationships, and rules to their supporting passages. Entries should distinguish explicit statements, author-approved facts, inferences, disputes, future plans, and alternative drafts.

A character’s belief is not automatically a world fact; an abandoned outline is not current canon. Authors should be able to correct interpretations, control what is shared across a series, and see when revisions make an earlier analysis stale.

**Success example:** “Why does the project say these characters have met?” returns the relevant passages and identifies whether the relationship is explicit or inferred.

### IPE-N10 — Track chronology, location, and knowledge

**Need:** Understand what happens when and where, and who knows what at each point.

Authors should distinguish event chronology, presentation order, character knowledge, narrator statements, and reader knowledge. Timelines should allow relative, approximate, disputed, and fictional dates without fabricating precision.

Location and movement checks should use the work’s established constraints. Character beliefs, secrets, and discoveries should be time-sensitive. The same need covers historical investigation, nonlinear fiction, and roleplaying with participant-specific knowledge.

Potential inconsistencies should be presented with evidence and possible explanations, including intentional deception or missing information.

**Success example:** IPE identifies a character acting on knowledge before its established discovery, while allowing the writer to mark that apparent discrepancy as intentional.

### IPE-N11 — Develop narrative structure, characters, and worlds

**Need:** See how individual scenes contribute to a larger narrative.

Authors should inspect narrative strands, points of view, setups, clues, promises, payoffs, unresolved questions, and scene dependencies. Character development should cover changing goals, agency, decisions, relationships, and consequences, not just static descriptions.

Worldbuilding should support established rules and deliberate exceptions, including their costs. Roleplaying should distinguish intended scenarios from events that actually occurred, and separate different campaigns or continuities.

Structural guidance must accommodate experimentation, quiet scenes, and deliberate non-resolution rather than enforce a universal narrative formula.

**Success example:** “Which scenes prepare the reader for this betrayal, and which parts of the character’s change currently lack preparation?”

### IPE-N12 — Examine style, rhetoric, and reader experience

**Need:** Understand how language produces effects and revise it intentionally.

Authors should inspect figures of speech, imagery, motifs, rhythm, syntax, diction, register, narrative distance, and voice at different scales. Comparisons should distinguish narrators, characters, languages, and deliberate changes of context.

Analysis should separate observable patterns from interpretive judgments. Writers should be able to explore what a reader has been told, what remains ambiguous, and where comprehension may depend on unexplained information. Simulated reactions must remain distinguishable from actual reader feedback.

Suggestions should explain trade-offs and respect the editorial brief instead of automatically simplifying or normalizing prose.

**Success example:** “Show how the imagery changes after this turning point, and distinguish your interpretation from the patterns you can demonstrate.”

### IPE-N13 — Build and review arguments and nonfiction

**Need:** Make reasoning, evidence, and attribution as inspectable as narrative continuity.

Researchers and nonfiction authors should connect claims, definitions, assumptions, methods, evidence, objections, qualifications, and conclusions. They should review terminology, notation, numerical statements, cross-references, and whether conclusions exceed the evidence presented.

Academic workflows should support literature synthesis, bibliography management, discipline-specific expectations, and reviewer responses linked to revisions. Journalism should support source and quotation traceability, allegations distinguished from established facts, outstanding verification, and restricted source information.

**Success example:** An author revises a conclusion and sees which supporting claims and qualifications must also be reconsidered.

### IPE-N14 — Translate and adapt with contextual fidelity

**Need:** Preserve intended meaning and effects across languages or versions while making deliberate changes explicit.

Translators should work with aligned source and target material, contextual terminology, voice and register guidance, annotations, and a record of translation decisions. Assistance should expose possible omissions and discrepancies without treating one literal rendering as universally correct.

Authors should control ambiguity, humor, interpersonal distance, and intentional adaptation. Changes to the source should identify affected target passages and earlier decisions for review.

**Success example:** A source revision highlights affected translated passages while preserving approved names, terminology, and character-specific speech choices.

### IPE-N15 — Author game-like status windows and system displays

**Need:** Include immersive, visually designed game-system information in written fiction.

Authors should define which attributes, resources, skills, ranks, conditions, quests, and other fields exist; what is visible to the reader; and how displays look. Reusable designs should support exact editable labels and values, with appropriate manuscript and publication previews.

Each display must represent a specific story moment, not the character’s latest state. Progression, temporary effects, hidden information, and optional rules should be trackable without requiring a playable game. Similar displays may include item cards, achievements, and system notifications.

**Success example:** A Chapter 4 status window remains correct after a Chapter 8 level-up; a revision to an earlier event identifies later displays needing review.

### IPE-N16 — Create illustrations and sequential visual narratives

**Need:** Develop original illustrations and AI-assisted manhua-style work connected to the written project.

Creators should establish a visual direction, approve character and environment references, and direct composition, expression, clothing, objects, and story-time details. Generated images remain proposals until approved; individual elements should be revisable without intentionally discarding the entire composition.

Comic authoring should cover adaptation scripts, storyboards, panel sequencing, pages or vertical episodes, and independently editable dialogue, captions, and system displays. Visual consistency should be inspectable rather than assumed.

Assets should retain relevant references, approval history, and usage information. Manuscript changes should identify potentially outdated images.

**Success example:** A prose scene becomes a reviewed six-panel storyboard before artwork is generated, with a reveal reserved for the final panel.

### IPE-N17 — Revise with visible consequences

**Need:** Understand what a substantial change affects before committing to it.

Authors should explore alternative openings, structures, endings, translations, and factual revisions. They should compare versions, accept selected changes, protect important passages, and recover discarded material.

Impact analysis should identify affected references, scenes, evidence, timelines, character states, translations, and visual assets, distinguishing definite dependencies from interpretive concerns. Analyses and comments should identify the version they describe.

**Success example:** “Move the assassination two weeks earlier; do not edit yet” produces a reviewable account of affected travel, witnesses, dates, motivations, and status displays.

### IPE-N18 — Collaborate without losing editorial accountability

**Need:** Coordinate coauthors, editors, researchers, translators, reviewers, and readers around the same work.

Collaboration should support roles, assignments, scoped access, passage-level and structural feedback, suggested changes, and a history of decisions. Simultaneous work should not obscure who changed what or silently discard another person’s contribution.

Confidential research and spoiler boundaries must govern both human access and AI access. Feedback should remain understandable after revisions, and actual reader reactions should remain separate from automated interpretations.

**Success example:** A reviewer comments on assigned chapters without accessing restricted source identities or later plot revelations.

### IPE-N19 — Assemble, publish, and retain ownership of the work

**Need:** Produce appropriate deliverables while keeping the underlying project reusable.

Authors should assemble submissions, editions, manuscripts, papers, ebooks, or illustrated episodes from selected material without deleting excluded content. Pre-publication review should expose unresolved placeholders, missing references, numbering problems, and incomplete captions.

Import and export should preserve supported content and clearly report limitations. Authors should be able to retrieve text, relevant notes, sources, references, assets, annotations, and structure in documented usable forms—not only a flattened final publication.

**Success example:** A writer prepares an ebook and a submission manuscript from the same project while retaining research and alternative scenes outside both outputs.

### IPE-N20 — Personalize the environment and work across contexts

**Need:** Use IPE comfortably across supported devices, languages, abilities, and writing practices.

The product should offer broad browser access, appropriate cross-device continuity, accessible interaction, multilingual and right-to-left writing, and a clear offline experience. Supported environments and offline limitations must be explicit rather than implied by “runs everywhere.”

Power users should have optional Vim/Neovim-style modal workflows, configurable commands, shortcuts, macros, and extensions. Extensions should support custom checks, templates, transformations, views, and publishing workflows with understandable permissions and recoverable effects. Lua is an expressed preference for scripting to evaluate during technical specification.

**Success example:** A user writes with the ordinary interface or a customized keyboard workflow without maintaining separate versions of the manuscript.

## 5. Quality requirements across all capabilities

**IPE-Q01 — Dependable preservation.** Save, synchronization, conflict, and recovery states must be understandable. Interruptions, failed analyses, expired access, and provider outages must not destroy authored work. Offline drafting is a product need; its supported boundaries require explicit specification.

**IPE-Q02 — Honest assistance.** Report analyzed scope, version, uncertainty, and missing evidence. Do not fabricate sources, exact book passages, capabilities, quota balances, or verification results. Interpretive guidance needs representative user evaluation, not just successful execution.

**IPE-Q03 — Privacy and permission.** Let authors control what is sent to external services, retained, shared, or used beyond the requested task. Protect confidential material and provider access. Do not equate access to a project with permission to redistribute its sources.

**IPE-Q04 — Visible cost and capability.** Show available services, known allowances, separate charges, and usage limitations. Honor user-authorized spending and action boundaries; identify uncertain estimates or unavailable provider accounting rather than promising false precision.

**IPE-Q05 — Accessible, unobtrusive operation.** Writing and navigation should remain responsive during analysis. Support assistive interaction and understandable progress, cancellation, and recovery. Detailed performance and compatibility targets require later validation.

**IPE-Q06 — Portability without silent loss.** Mode changes, imports, exports, revisions, and provider changes must preserve supported material or explicitly identify what cannot be preserved. Account disconnection must not erase the project.

## 6. End-to-end acceptance journeys

These are product validation scenarios, not a release backlog or a promise of perfect AI interpretation.

| Journey | Observable outcome | Related needs |
|---|---|---|
| Spoken idea to passage | Capture an idea, correct the transcript, develop notes, generate a constrained passage, accept selected edits, and recover the original. | N02, N03, N05, N17 |
| Existing AI access | Use an eligible connection, see what it supports and charges, handle a limit without surprise billing, and preserve the project when switching access. | N04, N05, N20 |
| Reading to original craft | Analyze actual chapters without spoilers, develop a source-linked note, and apply the technique to original writing without silently copying the source. | N06, N07, N12 |
| Coherent long-form revision | Change an event and review affected chronology, knowledge, scenes, and world rules before accepting changes. | N09, N10, N11, N17 |
| Evidence-based publication | Trace a claim to its source, expose conflicting evidence, revise the argument, and assemble a reviewed output. | N08, N13, N19 |
| Immersive visual fiction | Insert an exact, story-time-correct status window and create approved visual panels with editable lettering. | N15, N16, N17 |
| Translation and editorial review | Revise a source passage, locate affected translations, preserve terminology decisions, and coordinate scoped reviewer feedback. | N14, N17, N18 |
| Continue and leave safely | Recover work after interruption, continue with AI unavailable, and export the project with disclosed limitations. | N01, N19, N20; Q01, Q06 |

Validation should assess author control, traceability, useful versus dismissed warnings, preservation of intended meaning, recoverability, and export fidelity. Numerical targets must be established through representative projects and user evaluation, not invented in the vision document.

## 7. Open product decisions and boundaries

**First release:** No initial audience, feature subset, delivery dates, or release order is approved by this document. Selecting a first release must not erase the wider vision.

**Distribution and access:** Exact supported browsers, operating systems, mobile capabilities, and offline scope remain open. Later desktop availability must not replace the web-access requirement.

**Commercial model and licensing:** Open-source versus proprietary distribution, pricing, included AI usage, and responsibility for usage charges remain undecided. Provider eligibility may depend on these choices.

**Supported formats and languages:** The exact import/export matrix, language coverage, and desired round-trip fidelity need explicit acceptance criteria. Markdown is a stated need, not a decision about internal storage.

**Provider feasibility:** Connection methods, eligible plans, capabilities, and user-facing costs require maintained, dated verification. Model names and subscription rules belong in a compatibility record, not permanent product requirements.

**Not implicit scope:** IPE is not automatically a playable game engine, social network, general illustration editor, or autonomous publishing service. It does not guarantee literary quality, perfect historical verification, perfect visual consistency, or unrestricted access to every AI subscription.

## 8. Rules for deriving technical work

Once approved, this baseline is the authority for product intent. Architecture documents explain how approved needs will be met; they do not silently redefine those needs.

Every derived specification or task must identify its parent need IDs, intended user outcome, proposed behavior, acceptance evidence, applicable quality requirements, and any unresolved product decision. Technical feasibility findings may propose a scope change, but may not approve it on the product owner’s behalf.

Architecture choices must explain relevant trade-offs against the needs. A task completed, a demonstration working, or tests passing does not by itself establish that a capability is complete. Delivery reports must distinguish implemented behavior, tested behavior, limitations, and deferred work.

New needs receive new identifiers. Existing identifiers must not be reused for unrelated meanings. Product-scope changes record the reason, affected IDs, approval, and version. External provider facts are refreshed separately so a changed subscription policy does not rewrite the product’s purpose.

**Two kinds of agents must remain distinct:** AI assistants inside IPE help authors with their works; engineering agents outside the product implement IPE from these requirements. A general platform for running software-development agents is not added to product scope by this document.

**Derivation chain:** Approved product need → behavioral specification → technical decision → implementation task → acceptance evidence.

## Appendix A. AI-access reality check — reviewed 13 October 2026

This appendix is a dated feasibility note, not a guarantee of integration eligibility. Recheck provider documentation before implementation and release.

**OpenAI: ordinary API billing.** OpenAI documents ChatGPT subscriptions and ordinary API billing separately. A ChatGPT subscription alone must not be presented as a general balance for all API use. [S1]

**OpenAI: subscription-backed integration paths.** OpenAI also documents optional ChatGPT plan usage through Sign in with ChatGPT for eligible requests in open-source and locally hosted apps; paid or remotely hosted applications are directed to an interest process. The documented website sign-in route is a limited trial for selected commercial partners. This is conditional support, not a universal promise that IPE’s eventual hosted offering will qualify. [S2][S3]

**OpenAI: capability limits.** The documented plan-usage preview excludes image-generation tools and transcription/audio input through that route. Permission to use a plan for text assistance must therefore not be presented as covering every proposed IPE AI feature. The plan-usage documentation also says it does not grant access to ChatGPT conversations or other account context. [S2][S4]

**Anthropic: plan benefits.** Anthropic’s documentation reports monthly Claude API credits for eligible Max and Team plans, claimed through a linked Console organization. Those credits are separate from usage limits in the Claude applications; eligibility does not extend to every Claude plan. [S5]

**Anthropic: integration boundaries.** Anthropic’s 7 October 2026 support update describes continued subscription-limit use for its Agent SDK and certain third-party usage. Its compliance documentation separately restricts third-party collection or intermediation of Claude login credentials and distinguishes permitted use of unmodified Claude Code from a third-party application offering its own Claude login. These statements should not be reduced to blanket permission to relay subscribers’ sessions through IPE. The proposed integration path requires specific verification. [S6][S7]

**Product consequence:** Preserve “use the AI access I already pay for” as a first-class need. Implement only verified, authorized paths; disclose eligibility and feature coverage; provide an explicit alternative when a chosen path is unavailable. Do not quietly substitute separately billed access or change the business model to fit a provider program.

### Official sources

All sources below were consulted on 13 October 2026. Provider pages are live documents and may change.

- **S1.** OpenAI, [Managing billing for ChatGPT and the API platform](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform).
- **S2.** OpenAI, [ChatGPT plan usage: overview](https://developers.openai.com/siwc/token-sharing-open-source).
- **S3.** OpenAI, [Sign in with ChatGPT on your website](https://developers.openai.com/siwc/website).
- **S4.** OpenAI, [ChatGPT plan usage: preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations).
- **S5.** Anthropic, [Monthly API credits for Max and Team plans](https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-and-team-plans).
- **S6.** Anthropic, [Use the Claude Agent SDK with your Claude plan](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan).
- **S7.** Anthropic, [Claude Code legal and compliance](https://code.claude.com/docs/en/legal-and-compliance).

## Change log

**v0.1 — 13 October 2026:** Initial consolidation of the product vision and prior feature discussion, including book study, developed reading notes, game-system displays, manhua-style visual authoring, existing-provider AI access, and written/voice-note-to-prose assistance. Architecture and first-release choices remain unapproved.
