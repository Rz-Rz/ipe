// Anchors across edits (SPEC-KER-003, design note Section 3).
//
// An anchor is re-resolved from what it recorded: the exact passage, and two context windows.
// The kernel never deletes an anchor and never updates its `text`: that text is what the object
// rests on. It updates the range, the context windows and the state, and lists candidates when
// it cannot choose. Nothing here guesses: a tie that context does not break is ambiguous.

import type { Anchor, AnchorCandidate, UnitId } from "./types.js";

/** Length of the context windows kept around a passage. */
export const CONTEXT = 40;

export interface UnitText {
  unit: UnitId;
  text: string;
}

export function contextOf(text: string, start: number, end: number): { before: string; after: string } {
  return {
    before: text.slice(Math.max(0, start - CONTEXT), start),
    after: text.slice(end, Math.min(text.length, end + CONTEXT)),
  };
}

/** A fresh, intact anchor on a passage of a unit. */
export function makeAnchor(unit: UnitId, text: string, start: number, end: number): Anchor {
  const { before, after } = contextOf(text, start, end);
  return { unit, start, end, text: text.slice(start, end), before, after, state: "intact", candidates: [], current: null };
}

/** Every occurrence of `needle` in `haystack`, overlapping occurrences included. */
export function findAll(haystack: string, needle: string): number[] {
  const positions: number[] = [];
  if (needle.length === 0) return positions;
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(needle, from);
    if (i < 0) return positions;
    positions.push(i);
    from = i + 1;
  }
}

/** Does the recorded context surround position `p`? An empty window matches anywhere. */
function contextMatches(text: string, p: number, anchor: Anchor): boolean {
  const beforeOk = anchor.before.length === 0 || text.slice(Math.max(0, p - anchor.before.length), p) === anchor.before;
  const end = p + anchor.text.length;
  const afterOk = anchor.after.length === 0 || text.slice(end, end + anchor.after.length) === anchor.after;
  return beforeOk && afterOk;
}

function intactAt(anchor: Anchor, unit: UnitId, text: string, start: number): Anchor {
  const end = start + anchor.text.length;
  // Intact at the same place: the anchor is returned as it is, so that an object the edit did
  // not touch stays byte-identical on disk (SPEC-KER-011). Its context windows are refreshed
  // only when it moves.
  const { before, after } = contextOf(text, start, end);
  if (unit === anchor.unit && start === anchor.start && end === anchor.end && anchor.state === "intact" && before === anchor.before && after === anchor.after) {
    return anchor;
  }
  return { ...anchor, unit, start, end, before, after, state: "intact", candidates: [], current: null };
}

/** Changed in place: the range is the edited region, the windows are refreshed around it, the text is kept. */
function changedAt(anchor: Anchor, text: string, start: number, end: number): Anchor {
  const { before, after } = contextOf(text, start, end);
  return { ...anchor, start, end, before, after, state: "changed", candidates: [], current: text.slice(start, end) };
}

/** The shortest surviving part of a window still taken as evidence of a context. */
const MIN_CONTEXT = 12;

interface WindowHit {
  at: number;
  /** The whole window was found, not a surviving part of it. */
  full: boolean;
}

/** Where the before-window ends in the text: the full window, else its longest surviving suffix. */
function findBeforeEnds(text: string, before: string): WindowHit[] {
  const floor = Math.min(MIN_CONTEXT, before.length);
  for (let length = before.length; length >= floor && length > 0; length--) {
    const needle = before.slice(before.length - length);
    const found = findAll(text, needle);
    if (found.length > 0) return found.map((p) => ({ at: p + length, full: length === before.length }));
  }
  return [];
}

/** Where the after-window starts in the text: the full window, else its longest surviving prefix. */
function findAfterStarts(text: string, after: string): WindowHit[] {
  const floor = Math.min(MIN_CONTEXT, after.length);
  for (let length = after.length; length >= floor && length > 0; length--) {
    const found = findAll(text, after.slice(0, length));
    if (found.length > 0) return found.map((p) => ({ at: p, full: length === after.length }));
  }
  return [];
}

/**
 * Re-resolves one anchor against the current text of its unit, and against the other units
 * when the passage left its unit. Pure: returns a new anchor, the input is untouched.
 */
export function resolveAnchor(anchor: Anchor, unitText: string, others: UnitText[]): Anchor {
  if (anchor.text.length === 0) {
    return anchor.start <= unitText.length ? intactAt(anchor, anchor.unit, unitText, anchor.start) : { ...anchor, state: "orphaned", candidates: [], current: null };
  }

  const positions = findAll(unitText, anchor.text);
  if (positions.length === 1) return intactAt(anchor, anchor.unit, unitText, positions[0] ?? 0);

  if (positions.length > 1) {
    const byContext = positions.filter((p) => contextMatches(unitText, p, anchor));
    if (byContext.length === 1) return intactAt(anchor, anchor.unit, unitText, byContext[0] ?? 0);
    const stillThere = positions.includes(anchor.start) && (byContext.length === 0 || byContext.includes(anchor.start));
    if (stillThere) return intactAt(anchor, anchor.unit, unitText, anchor.start);
    const pool = byContext.length > 0 ? byContext : positions;
    const candidates: AnchorCandidate[] = pool.map((p) => ({ unit: anchor.unit, start: p, end: p + anchor.text.length }));
    return { ...anchor, state: "ambiguous", candidates, current: null };
  }

  // A changed anchor knows the passage it covers now: when that passage is still here, once, the
  // anchor follows it, still changed against the text it rests on.
  if (anchor.current !== null && anchor.current.length > 0) {
    const nowAt = findAll(unitText, anchor.current);
    if (nowAt.length === 1) return changedAt(anchor, unitText, nowAt[0] ?? 0, (nowAt[0] ?? 0) + anchor.current.length);
  }

  // The passage is not in its unit as recorded. Locate the edited region between its two
  // context windows; an empty window stands for the boundary of the unit. A whole window counts
  // wherever it stands. A surviving part of a window counts only when it is at least 12
  // characters long, lies within two windows and one passage length of the original range, and
  // keeps its order; the region between the parts may not exceed three passage lengths, or one
  // passage plus two windows. Context locates an in-place rewrite; it never invents a match.
  // A change needs text between the windows: windows that touch, or overlap, mean the passage
  // was removed here. An anchor that was already orphaned is not revived by context: text that
  // appears where its passage stood is new text, not the passage. It comes back through its
  // exact text only (a revert, or a move to another unit).
  if (anchor.state !== "orphaned") {
    const beforeEnds: WindowHit[] = anchor.before.length > 0 ? findBeforeEnds(unitText, anchor.before) : [{ at: 0, full: true }];
    const afterStarts: WindowHit[] = anchor.after.length > 0 ? findAfterStarts(unitText, anchor.after) : [{ at: unitText.length, full: true }];
    const near = 2 * CONTEXT + anchor.text.length;
    const widest = Math.max(3 * anchor.text.length, anchor.text.length + 2 * CONTEXT);
    let best: { start: number; end: number } | null = null;
    for (const b of beforeEnds) {
      for (const a of afterStarts) {
        const s = b.at;
        const e = a.at;
        if (e <= s) continue;
        const partial = !(b.full && a.full);
        if (partial && (Math.abs(s - anchor.start) > near || e - s > widest)) continue;
        const closer = best !== null && e - s === best.end - best.start && Math.abs(s - anchor.start) < Math.abs(best.start - anchor.start);
        if (best === null || e - s < best.end - best.start || closer) best = { start: s, end: e };
      }
    }
    if (best !== null) return changedAt(anchor, unitText, best.start, best.end);
  }

  // Nothing of it remains here: did the whole passage move to another unit?
  const elsewhere: AnchorCandidate[] = [];
  for (const other of others) {
    for (const p of findAll(other.text, anchor.text)) elsewhere.push({ unit: other.unit, start: p, end: p + anchor.text.length });
  }
  if (elsewhere.length === 1) {
    const c = elsewhere[0];
    if (c) {
      const text = others.find((o) => o.unit === c.unit)?.text ?? "";
      return intactAt(anchor, c.unit, text, c.start);
    }
  }
  if (elsewhere.length > 1) return { ...anchor, state: "ambiguous", candidates: elsewhere, current: null };
  return { ...anchor, state: "orphaned", candidates: [], current: null };
}

export function sameAnchor(a: Anchor, b: Anchor): boolean {
  return (
    a.unit === b.unit && a.start === b.start && a.end === b.end && a.text === b.text && a.before === b.before &&
    a.after === b.after && a.state === b.state && a.current === b.current && a.candidates.length === b.candidates.length &&
    a.candidates.every((c, i) => c.unit === b.candidates[i]?.unit && c.start === b.candidates[i]?.start && c.end === b.candidates[i]?.end)
  );
}
