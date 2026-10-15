// The on-disk layout of a project (design note Section 5) and the reading of each file with
// its validation. Everything the kernel writes goes through `canonicalJson`, so that an
// unchanged object is byte-identical on disk and a changed one differs for a reason.

import type { Anchor, AnchorState, Approval, Event, IpeObject, Manifest, Origin, State, UnitNode, Version } from "./types.js";

export const MANIFEST = "ipe.json";
export const IPE_DIR = ".ipe";
export const OBJECTS_DIR = ".ipe/objects";
export const VERSIONS_INDEX = ".ipe/versions/index.json";
export const BLOBS_DIR = ".ipe/versions/blobs";
export const JOURNAL = ".ipe/journal.jsonl";
export const STATE = ".ipe/state.json";

export const objectPath = (id: string): string => `${OBJECTS_DIR}/${id}.json`;
export const blobPath = (hash: string): string => `${BLOBS_DIR}/${hash}`;

export class KernelError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "KernelError";
  }
}

/** JSON with keys sorted at every level, two-space indentation, one trailing newline. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value), null, 2) + "\n";
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) out[key] = sortKeys((value as Record<string, unknown>)[key]);
    return out;
  }
  return value;
}

const ORIGINS: readonly Origin[] = ["author", "assistant", "import"];
const APPROVALS: readonly Approval[] = ["proposed", "accepted", "rejected"];
const ANCHOR_STATES: readonly AnchorState[] = ["intact", "changed", "ambiguous", "orphaned"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function expect(condition: boolean, file: string, what: string): void {
  if (!condition) throw new KernelError("invalid_object", `${file}: ${what}`);
}

function parseJson(text: string, file: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch (e) {
    throw new KernelError("invalid_json", `${file}: not JSON (${String((e as Error).message)})`);
  }
}

export function parseAnchor(v: unknown, file: string): Anchor {
  expect(isRecord(v), file, "an anchor must be an object");
  const a = v as Record<string, unknown>;
  expect(typeof a["unit"] === "string", file, "anchor.unit must be a string");
  expect(typeof a["start"] === "number" && typeof a["end"] === "number", file, "anchor.start and anchor.end must be numbers");
  expect(typeof a["text"] === "string" && typeof a["before"] === "string" && typeof a["after"] === "string", file, "anchor text and context must be strings");
  expect(ANCHOR_STATES.includes(a["state"] as AnchorState), file, `anchor.state must be one of ${ANCHOR_STATES.join(", ")}`);
  const candidates = Array.isArray(a["candidates"]) ? a["candidates"] : [];
  return {
    unit: a["unit"] as string,
    start: a["start"] as number,
    end: a["end"] as number,
    text: a["text"] as string,
    before: a["before"] as string,
    after: a["after"] as string,
    state: a["state"] as AnchorState,
    current: typeof a["current"] === "string" ? (a["current"] as string) : null,
    candidates: candidates.map((c) => {
      expect(isRecord(c) && typeof c["unit"] === "string" && typeof c["start"] === "number" && typeof c["end"] === "number", file, "a candidate must carry unit, start, end");
      const r = c as Record<string, unknown>;
      return { unit: r["unit"] as string, start: r["start"] as number, end: r["end"] as number };
    }),
  };
}

/** Reads and validates one object file. A field missing or out of its enumeration refuses the object. */
export function parseObject(text: string, file: string): IpeObject {
  const v = parseJson(text, file);
  expect(isRecord(v), file, "an object must be a JSON object");
  const o = v as Record<string, unknown>;
  expect(typeof o["id"] === "string" && (o["id"] as string).length > 0, file, "id must be a non-empty string");
  expect(typeof o["kind"] === "string" && (o["kind"] as string).length > 0, file, "kind must be a non-empty string");
  expect(typeof o["title"] === "string", file, "title must be a string");
  expect(Array.isArray(o["anchors"]), file, "anchors must be an array");
  expect(Array.isArray(o["dependsOn"]) && (o["dependsOn"] as unknown[]).every((d) => typeof d === "string"), file, "dependsOn must be an array of identifiers");
  expect(isRecord(o["provenance"]), file, "provenance must be an object");
  const p = o["provenance"] as Record<string, unknown>;
  expect(ORIGINS.includes(p["origin"] as Origin), file, `provenance.origin must be one of ${ORIGINS.join(", ")}`);
  expect(typeof p["action"] === "string", file, "provenance.action must be a string");
  expect(typeof p["createdAt"] === "string", file, "provenance.createdAt must be a string");
  expect(APPROVALS.includes(p["approval"] as Approval), file, `provenance.approval must be one of ${APPROVALS.join(", ")}`);
  expect(typeof o["version"] === "string", file, "version must be a string");
  expect(typeof o["stale"] === "boolean", file, "stale must be a boolean");
  expect(typeof o["deleted"] === "boolean", file, "deleted must be a boolean");
  return {
    id: o["id"] as string,
    kind: o["kind"] as string,
    title: o["title"] as string,
    body: o["body"] ?? null,
    anchors: (o["anchors"] as unknown[]).map((a) => parseAnchor(a, file)),
    dependsOn: [...(o["dependsOn"] as string[])],
    provenance: {
      origin: p["origin"] as Origin,
      action: p["action"] as string,
      createdAt: p["createdAt"] as string,
      approval: p["approval"] as Approval,
      approvedAt: typeof p["approvedAt"] === "string" ? (p["approvedAt"] as string) : null,
      approvedBy: typeof p["approvedBy"] === "string" ? (p["approvedBy"] as string) : null,
    },
    version: o["version"] as string,
    stale: o["stale"] as boolean,
    deleted: o["deleted"] as boolean,
  };
}

function parseUnitNode(v: unknown, file: string): UnitNode {
  expect(isRecord(v), file, "a unit must be an object");
  const u = v as Record<string, unknown>;
  expect(typeof u["id"] === "string" && (u["id"] as string).length > 0, file, "unit.id must be a non-empty string");
  expect(typeof u["title"] === "string", file, "unit.title must be a string");
  expect(typeof u["path"] === "string" && (u["path"] as string).length > 0, file, "unit.path must be a non-empty string");
  const children = Array.isArray(u["children"]) ? u["children"] : [];
  return { id: u["id"] as string, title: u["title"] as string, path: u["path"] as string, children: children.map((c) => parseUnitNode(c, file)) };
}

export function parseManifest(text: string, file: string = MANIFEST): Manifest {
  const v = parseJson(text, file);
  expect(isRecord(v), file, "the manifest must be a JSON object");
  const m = v as Record<string, unknown>;
  expect(m["schema"] === 1, file, "manifest.schema must be 1");
  expect(typeof m["name"] === "string", file, "manifest.name must be a string");
  expect(Array.isArray(m["units"]), file, "manifest.units must be an array");
  return { schema: 1, name: m["name"] as string, units: (m["units"] as unknown[]).map((u) => parseUnitNode(u, file)) };
}

export function parseVersions(text: string, file: string = VERSIONS_INDEX): Version[] {
  const v = parseJson(text, file);
  expect(Array.isArray(v), file, "the versions index must be an array");
  return (v as unknown[]).map((e) => {
    expect(isRecord(e), file, "a version must be an object");
    const r = e as Record<string, unknown>;
    expect(typeof r["id"] === "string" && typeof r["at"] === "string" && isRecord(r["units"]), file, "a version carries id, at, units");
    const units: Record<string, string> = {};
    for (const [k, h] of Object.entries(r["units"] as Record<string, unknown>)) {
      expect(typeof h === "string", file, "a unit hash must be a string");
      units[k] = h as string;
    }
    return { id: r["id"] as string, at: r["at"] as string, action: typeof r["action"] === "string" ? (r["action"] as string) : "unknown", units };
  });
}

export function parseState(text: string, file: string = STATE): State {
  const v = parseJson(text, file);
  expect(isRecord(v), file, "the state must be a JSON object");
  const s = v as Record<string, unknown>;
  expect(s["schema"] === 1, file, "state.schema must be 1");
  expect(s["version"] === null || typeof s["version"] === "string", file, "state.version must be a string or null");
  expect(isRecord(s["units"]), file, "state.units must be an object");
  const units: Record<string, string> = {};
  for (const [k, h] of Object.entries(s["units"] as Record<string, unknown>)) {
    expect(typeof h === "string", file, "a unit hash must be a string");
    units[k] = h as string;
  }
  return { schema: 1, version: (s["version"] as string | null) ?? null, units };
}

/** The journal, one event per line; a line that is not JSON is skipped and counted. */
export function parseEvents(text: string): { events: Event[]; skipped: number } {
  const events: Event[] = [];
  let skipped = 0;
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue;
    try {
      const v = JSON.parse(line) as unknown;
      if (!isRecord(v) || typeof v["id"] !== "string" || typeof v["kind"] !== "string" || typeof v["objectId"] !== "string") {
        skipped += 1;
        continue;
      }
      const e = v as Record<string, unknown>;
      events.push({
        id: e["id"] as string,
        at: typeof e["at"] === "string" ? (e["at"] as string) : "",
        kind: e["kind"] as Event["kind"],
        actor: typeof e["actor"] === "string" ? (e["actor"] as string) : "",
        objectId: e["objectId"] as string,
        before: isRecord(e["before"]) ? parseObject(JSON.stringify(e["before"]), "journal") : null,
        after: isRecord(e["after"]) ? parseObject(JSON.stringify(e["after"]), "journal") : null,
        note: typeof e["note"] === "string" ? (e["note"] as string) : null,
      });
    } catch {
      skipped += 1;
    }
  }
  return { events, skipped };
}
