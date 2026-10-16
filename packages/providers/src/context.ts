// Context assembly and its preview (SPEC-PRV-003). The scope the author chose is the only
// material that leaves the device: a passage, a unit, or the whole project, with the project's
// provider-neutral instructions in front. The preview lists each item with its size, and its
// total is the size of what is sent, because what is sent is the concatenation of the items.

import type { UnitNode } from "@ipe/kernel";

export type Scope =
  | { kind: "passage"; unit: string; start: number; end: number }
  | { kind: "unit"; unit: string }
  | { kind: "project" };

/** What the assembly needs of a kernel. */
export interface ContextReader {
  units(): UnitNode[];
  readUnit(unitId: string): string;
}

export type ContextItemKind = "instructions" | "unit" | "passage" | "question";

export interface ContextItem {
  kind: ContextItemKind;
  /** The unit identifier for a unit or a passage; null otherwise. */
  id: string | null;
  title: string;
  /** The text exactly as it is sent, headers included. */
  text: string;
  characters: number;
}

export interface AssembledContext {
  scope: Scope;
  items: ContextItem[];
  /** The system prompt: the preamble and the project's instructions. */
  system: string;
  /** The user message: the scoped material, then the question. */
  input: string;
  /** The size of what is sent: system and input together. */
  total: number;
}

export interface PreviewItem {
  kind: ContextItemKind;
  id: string | null;
  title: string;
  characters: number;
}

export interface Preview {
  scope: Scope;
  items: PreviewItem[];
  total: number;
}

export class ContextError extends Error {
  constructor(
    readonly code: "unknown_unit" | "invalid_range" | "empty_scope",
    message: string,
  ) {
    super(message);
    this.name = "ContextError";
  }
}

export const PREAMBLE =
  "You are the assistant inside IPE, a writing environment. Answer the author's question from the material given below and from nothing else. " +
  "Quote the passages you rely on. When the material does not settle the question, say so plainly.";

function flatten(nodes: UnitNode[], out: UnitNode[] = []): UnitNode[] {
  for (const n of nodes) {
    out.push(n);
    flatten(n.children, out);
  }
  return out;
}

function findUnit(reader: ContextReader, unitId: string): UnitNode {
  const unit = flatten(reader.units()).find((u) => u.id === unitId);
  if (unit === undefined) throw new ContextError("unknown_unit", `no unit ${unitId} in the project`);
  return unit;
}

function unitItem(unit: UnitNode, text: string, kind: "unit" | "passage" = "unit"): ContextItem {
  const rendered = `## ${unit.title}\n\n${text}\n\n`;
  return { kind, id: unit.id, title: unit.title, text: rendered, characters: rendered.length };
}

/**
 * The material of a scope, the instructions in front and the question behind. Throws a
 * ContextError for a unit absent from the project or a passage outside its unit's text.
 */
export function assembleContext(reader: ContextReader, scope: Scope, options: { instructions?: string | null; question?: string } = {}): AssembledContext {
  const items: ContextItem[] = [];
  const instructions = options.instructions?.trim() ? `\n\nProject instructions:\n${options.instructions.trim()}` : "";
  const system = PREAMBLE + instructions;
  items.push({ kind: "instructions", id: null, title: instructions ? "Preamble and project instructions" : "Preamble", text: system, characters: system.length });

  if (scope.kind === "passage") {
    const unit = findUnit(reader, scope.unit);
    const text = reader.readUnit(unit.id);
    if (!(scope.start >= 0 && scope.end <= text.length && scope.start < scope.end)) {
      throw new ContextError("invalid_range", `the passage ${scope.start}..${scope.end} lies outside the text of ${unit.title} (${text.length} characters)`);
    }
    items.push(unitItem(unit, text.slice(scope.start, scope.end), "passage"));
  } else if (scope.kind === "unit") {
    const unit = findUnit(reader, scope.unit);
    items.push(unitItem(unit, reader.readUnit(unit.id)));
  } else {
    const all = flatten(reader.units());
    if (all.length === 0) throw new ContextError("empty_scope", "the project holds no unit");
    for (const unit of all) items.push(unitItem(unit, reader.readUnit(unit.id)));
  }

  if (options.question !== undefined) {
    const q = `Question: ${options.question.trim()}\n`;
    items.push({ kind: "question", id: null, title: "Question", text: q, characters: q.length });
  }
  const input = items.filter((i) => i.kind !== "instructions").map((i) => i.text).join("");
  return { scope, items, system, input, total: system.length + input.length };
}

/** The preview of an assembled context: each item with its size, and the total of what is sent. */
export function previewOf(context: AssembledContext): Preview {
  return {
    scope: context.scope,
    items: context.items.map((i) => ({ kind: i.kind, id: i.id, title: i.title, characters: i.characters })),
    total: context.items.reduce((n, i) => n + i.characters, 0),
  };
}
