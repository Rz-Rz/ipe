# Domain PRV: AI providers and access

This file holds the PRV requirements of milestone J-PRV: the connection of an AI provider with access the author supplies, what the author sees of its capabilities and its cost, what leaves the device and when, and the record every call leaves in the project. Subscription-backed routes (an author's consumer plan used through a sign-in) are outside this milestone: the baseline's Appendix A records them as unverified, and a later requirement adds a route once its eligibility is verified against the provider's documentation at a stated date. Parent needs: N04; parent quality requirements: Q01, Q03, Q04, Q06; principles P02, P07.

Terms of this domain, repeated from the index: a **provider** is an external AI service; a **connection** is a provider the author connected with an access key; a **call** is one request to a provider and its answer; the **scope** of an action is the material the author chose for it; a **call record** is the object that records a call in the project.

### SPEC-PRV-001: Provider connection with author-supplied access

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N04, IPE-Q03
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must let the author connect a supported provider with an access key the author supplies, test the connection, and disconnect it, and must keep the key outside the project folder, in the secret store of the operating system where one exists.

**Coverage.** Nominal: the author pastes a key, the connection is listed with its provider, its state (untested, working, refused, unreachable) and the models it offers; a test makes one minimal call and shows the result; a disconnection erases the key. Limit: a key entered while the provider is unreachable is kept with the state unreachable and tested again on demand. Error: a key the provider refuses is kept with the state refused and the provider's reason, so the author can replace it; a key is never shown again in full once entered. Degraded: when the operating system offers no secret store, the key is kept for the session only and the author is told; the product never writes a key in clear to a file. Exclusion: sign-in routes and subscription allowances (Appendix A of the baseline).

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-001a | planned | e2e | The author connects, tests and disconnects a provider from the interface; the states shown follow the provider's answers. |
| TST-PRV-001b | planned | system | After a connection, no file under the project folder and no file of the application's data folder holds the key in clear. |

### SPEC-PRV-002: Capability and cost disclosure

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N04, IPE-Q04
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must show, for each connection, the features it supports (text assistance, transcription, image generation), whether usage draws from a subscription allowance or from a separately charged balance, and the known usage limits, and must show for each call the usage the provider reported and a cost estimate marked as an estimate, or the statement that the provider reported no usage.

**Coverage.** Nominal: the capability table of each provider comes from a versioned, dated catalogue that names its source; after a call, the usage shown equals the usage the provider reported, and the estimate is computed from the catalogue's prices for that model and dated. Limit: a model absent from the catalogue shows its usage and "price not known", never a number. Error: a provider that reports no usage shows "not reported". Degraded: a catalogue older than the date it states is still shown, with its date. Exclusion: live balance queries at the provider.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-002a | planned | unit | The capability table and the prices come from the catalogue, with the source and the date it states; an unknown model yields "price not known". |
| TST-PRV-002b | planned | integration | After a call, the usage recorded equals the usage the provider reported; the estimate is marked as an estimate; a provider reporting no usage yields "not reported". |

### SPEC-PRV-003: Explicit sending within the chosen scope

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-Q03, IPE-N05
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must send to a provider only the material inside the scope the author chose for an action, must show the author what the action will send (each unit, passage, object and instruction, with its size) before the first call of the action, and must send nothing to any provider outside an action the author started.

**Coverage.** Nominal: the preview lists each item with its size in characters and the total; the request the provider receives holds every item of the scope and nothing outside it. Limit: a scope of one passage sends that passage with the unit title and nothing else of the unit. Error: a scope that names a unit absent from the project is refused before any call. Degraded: none. Exclusion: automatic background calls (quiet mode is the only mode of this milestone).

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-003a | planned | integration | The request body a fake provider captures holds every item of the scope and nothing outside it, for a passage, a unit and the whole project. |
| TST-PRV-003b | planned | unit | The preview lists each item with its size and a total equal to the size of what is sent. |

### SPEC-PRV-004: Provider change without loss and without silent switching

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N04, IPE-Q06
- Implementation: none
- Acceptance priority: major

**Requirement.** The product must keep the project's instructions in the project folder in a provider-neutral form, so that connecting another provider or replacing a key changes no instruction and no object, and must never run an action on a provider or a model the author did not choose.

**Coverage.** Nominal: the author switches the provider of an action; the same instructions are sent, the call record names the new provider, and every object of the project is unchanged. Limit: a disconnected provider leaves its call records in the project, readable. Error: an action started with no provider chosen is refused with the gesture that chooses one; no default is picked. Degraded: none. Exclusion: migration of a provider's own conversation history.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-004a | planned | e2e | After a switch of provider, the same action sends the same instructions, the call record names the new provider, and the objects are unchanged. |
| TST-PRV-004b | planned | unit | An action with no provider chosen is refused with code no_provider and the gesture named; nothing is sent. |

### SPEC-PRV-005: Call record with provenance

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-P07, IPE-P02
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must record every call to a provider as an object of the project that carries the provider and model, the time, the scope sent (unit identifiers with the manuscript version, object identifiers, instructions), the usage reported and the outcome, and must link every object derived from the answer to that record by a dependency.

**Coverage.** Nominal: a completed call leaves one record; the object built from its answer depends on it; the provenance question on that object shows the record, the model and the version sent. Limit: the record holds the identifiers and the version of what was sent, not the text itself, which the version recovers. Error: a failed or cancelled call leaves a record with the outcome and the reason, and no derived object. Degraded: none. Exclusion: the provider's own logs.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-005a | planned | integration | A completed call leaves a record; the derived object depends on it; the provenance chain of the derived object names the record, the model and the version sent. |
| TST-PRV-005b | planned | unit | A failed call leaves a record with outcome failed and the reason, and no derived object. |

### SPEC-PRV-006: Failure states of a call

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-Q01
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must report a failed or interrupted call (no network, authentication refused, rate limited, timed out, cancelled by the author, provider overloaded) as a named state with the provider's reason where it gives one, must leave the project unchanged by the failure, and must let the author retry or abandon the action.

**Coverage.** Nominal: each failure shows its state and reason, the action offers retry and abandon. Limit: a rate limit with a retry delay from the provider shows that delay. Error: an answer the product cannot parse is reported as a failure with the raw status, never as an empty answer. Degraded: a cancellation after the provider answered keeps nothing of the answer. Exclusion: automatic retries without the author.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-006a | planned | integration | Authentication refused, rate limited, timed out, overloaded and no network each yield their state and reason; the project is unchanged. |
| TST-PRV-006b | planned | integration | A call cancelled by the author leaves a record with outcome cancelled and no derived object, before and after the provider answered. |

### SPEC-PRV-007: The Claude provider on its Messages API

- Status: PLANNED
- Source: Specified (product need)
- Parent need: IPE-N04
- Implementation: none
- Acceptance priority: critical

**Requirement.** The product must include an adapter for the Claude provider that speaks the provider's Messages API with the author's API key, lists the models the key can reach, maps the provider's errors to the failure states, and reports the usage the provider returns.

**Coverage.** Nominal: a request with a system instruction and one user message is sent as the API documents, the text answer and the usage are read from the response. Limit: a model the key cannot reach is refused by the provider and shown as such. Error: the provider's error types (authentication, permission, rate limit, overloaded, invalid request) each map to a failure state with the provider's message. Degraded: without a key in the environment of the test machine, the live test is skipped and declared not verified, never assumed to pass. Exclusion: streaming, tools, images, batches.

| Test | Artefact | Nature | Expected result |
|---|---|---|---|
| TST-PRV-007a | planned | integration | Against recorded exchanges of the API (request and response fixtures), the adapter builds the documented request and reads the answer, the usage and each error type. |
| TST-PRV-007b | planned | system | With a key in the environment, one live call returns a text answer and a usage; without a key the test is skipped and reported as not verified. |
