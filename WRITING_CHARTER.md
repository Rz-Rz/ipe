# Writing charter for technical specifications

This charter applies to every requirement, decision record, change proposal, commitment and technical document of the repository. The style guard hook applies its mechanical rules at edit time; the rest is applied in review.

## 1. Stance

Write impersonally and prescriptively, in the present tense. The document describes and prescribes; it does not persuade: no position-taking, no value judgment, no formula of adhesion ("we believe that"). The authority of the text rests on its precision, not on its tone.

Use a stable and unambiguous normative vocabulary: "must" for a mandatory requirement, "should" for a recommendation, "may" for an option. Do not mix these registers in one requirement.

## 2. Precision and verifiability

Each requirement is written so that it can be verified: a reviewer must be able to decide without ambiguity whether it is satisfied. Ban unmeasurable qualifiers ("fast", "ergonomic", "robust", "performant") in favour of figures with units, thresholds and tolerances ("response time under 200 ms at the 95th percentile").

Prefer the raw figure to the adjective. When a value is provisional or estimated, say so ("target value, to confirm") rather than presenting it as settled. No invented data: what is not known is marked as an open point.

## 3. Coverage

A specification covers the nominal case, the limit cases, the error cases and the degraded behaviors. What is not specified is deemed undetermined: state the exclusions of scope and the behaviors deliberately left free, rather than passing them over in silence.

## 4. Lexicon

One term, one concept: the same object carries the same name throughout, without synonym or variant. Classical technical terms of the domain are used without definition; any term specific, ambiguous or proper to the project is defined at its first occurrence or referred to the glossary. The reader is technically literate but not an expert of the domain: explain what must be explained, professionally and concisely, without metaphor.

Acronyms are expanded at their first occurrence. Established technical anglicisms are admitted when a translation would be less clear; they then stay constant throughout the text.

## 5. Sentence structure

Short, direct, mostly simple sentences: subject, verb, complement. One sentence carries one requirement and one only; two requirements call for two sentences. Active voice by preference, the actor of each requirement named ("the system records", not "it is recorded").

No convoluted sentences, no nested subordinates, no double negations, no implicit back-references ("the latter", "this one") when the antecedent can be confused: repeat the exact term.

## 6. Punctuation and typography

The em-dash is forbidden. Parentheses are used sparingly, only for a brief precision; a long aside becomes a sentence of its own. No nested enumerations and no cascades of commas: beyond three items, an enumeration is numbered.

## 7. Register

Professional and sober. Neither familiar nor loose, but without literary ambition: the specification does not have to shine, it has to be exact. Avoid emphasis, superlatives and absolutes that are hard to demonstrate ("always", "never", "totally") unless they express a truly absolute constraint, in which case they are assumed as a formal requirement.

## 8. Rhetoric

None. No rhetorical question, no gradation, no stylistic effect, no narrative thread. The text informs and prescribes; any figure meant to win adhesion is out of place in this format.

## 9. Grounding

Every value, constraint or structuring hypothesis is sourced: a normative reference, an upstream requirement, an architecture decision, a measurement. The reference is explicit and identifiable (requirement identifier, document reference, note). A constraint without a traceable origin is flagged as a hypothesis.

## 10. Forbidden

1. A vague or subjective term, unquantified, in a requirement.
2. A requirement that cannot be verified or that names no actor.
3. A synonym for a term already defined.
4. An em-dash; parentheses beyond a brief precision.
5. Invented data, or an estimate presented as a fact.
6. A rhetorical effect or a position-taking.
7. A calendar estimate in a planning document.
8. The name of the AI tooling provider, anywhere in the repository.
