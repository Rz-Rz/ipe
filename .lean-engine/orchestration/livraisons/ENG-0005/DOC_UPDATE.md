# ENG-0005: documentation impacts, one block per requirement

A block with `impact :` names what a document outside the scope of this session must say now; the coordinator applies it at integration. A block with `sans_impact :` states why no document changes.

## SPEC-PRV-002

impact : docs/PROVIDER_DESIGN.md, Section 3: the catalogue is a typed TypeScript constant (`CLAUDE_CATALOGUE` in `packages/providers-claude/src/catalogue.ts`) with the fields the section lists, `consultedOn` and `source`; prices are bands (`tiers`, each with a bound on the input tokens or none), so that the two bands of one model are stated as the provider prices them; a model the source names without an identifier is listed by display name and matched on the display name the live list gives. The three answers of a cost are an estimate with its date and sources, "price not known", and "not reported".

## SPEC-PRV-003

sans_impact : Section 4 of the design note describes the assembly as delivered: the preamble and the instructions as the system prompt, the scoped material then the question as the user message, the preview's total equal to the size of what is sent.

## SPEC-PRV-004

sans_impact : the refusal without a chosen connection is as the requirement states; the instructions file and the switch in the interface are ENG-0006's.

## SPEC-PRV-005

impact : docs/PROVIDER_DESIGN.md, Section 5: the call record enters accepted with origin `author` and action `call` (the author's act, not a proposal of the assistant); its body also carries the question, the preview of what was sent (`sent`), the size of the instructions, and the request identifier; the answer carries the question, the text, the usage, the cost and the stop reason.

## SPEC-PRV-006

impact : docs/PROVIDER_DESIGN.md, Sections 2 and 6: the failure states are no_network, auth_refused, billing_refused, rate_limited, timed_out, cancelled, overloaded, invalid_request, provider_error, unparseable; 402 maps to billing_refused, 504 and 408 to timed_out, other 4xx to invalid_request, other 5xx to provider_error, the rest as the section says; the adapter sets no timer, the caller's signal is the timeout, and a timeout armed on that signal is recognised by the name TimeoutError of the rejection or of the signal's reason, tested before the abort; the ask action reads the signal when the answer arrives and again immediately before the answer object is created, once the record is completed, and the window that remains is that creation.

## SPEC-PRV-007

impact : docs/PROVIDER_DESIGN.md, Section 2: `complete` takes `maxOutputTokens`, returns `requestId`; `models` returns `lifecycle` beside the limits; the fixtures of the documented exchanges live under `packages/providers-claude/test/fixtures/`.

## SPEC-AST-001

impact : docs/PROVIDER_DESIGN.md, Section 5: the answer object is created against the version current at its creation, since the kernel creates objects against the current version only; the call record keeps the version read. When the scoped text changes during the call, the answer's anchors are read from the new text and are not marked stale: the degraded case of the requirement remains for the commitment drafted in REPORT.md (an object created against a named version).
