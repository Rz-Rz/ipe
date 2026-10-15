# ADR-0002: decision of DA-0002

- Context: On which surface and data locality does IPE ship first?
- Decision: A. Local-first core; the desktop application is the first delivery surface; browser access is a committed later surface served by the same core.
- Reason: the option satisfies N04 eligibility, Q01 offline drafting, and P05 ownership at once, and keeps the browser surface reachable on condition that the interface is built in browser technology and the core reaches desktop-only facilities only through an adapter. The operator decided desktop first in session.
- Date: 2026-10-15
- Consequences: the baseline's confirmed direction no longer names broad web availability as the first surface (Sections 2, 7, N20); derived architecture must show how one core serves both surfaces or raise a DA (Section 8); provider eligibility for a desktop product is verified before the provider domain is specified.
- Reversibility: by an SCP referencing this ADR (anti-oscillation guard).
