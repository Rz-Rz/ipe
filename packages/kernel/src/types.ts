// The model of the provenance kernel (baseline P07, design note Section 2).
// Every type here is plain data: it is what the on-disk store holds, byte for byte,
// once serialised canonically (layout.ts).

export type ObjectId = string;
export type UnitId = string;
export type VersionId = string;
export type EventId = string;

/** Who produced an object. */
export type Origin = "author" | "assistant" | "import";

/** Whether the author took the object in. An author's own object is accepted at birth. */
export type Approval = "proposed" | "accepted" | "rejected";

/** How an anchor stands against the current text of its unit. */
export type AnchorState = "intact" | "changed" | "ambiguous" | "orphaned";

export interface AnchorCandidate {
  unit: UnitId;
  start: number;
  end: number;
}

/**
 * The link between an object and a passage. `text` is the exact passage the object rests
 * on; it changes only when the object is re-grounded (edited or refreshed), never by the
 * kernel's re-resolution. `before` and `after` are short context windows used to break ties.
 */
export interface Anchor {
  unit: UnitId;
  start: number;
  end: number;
  text: string;
  before: string;
  after: string;
  state: AnchorState;
  candidates: AnchorCandidate[];
  /** For a changed anchor, the passage its range covers now; null otherwise. */
  current: string | null;
}

/** What a caller gives to anchor an object: the passage is read from the unit. */
export interface AnchorInput {
  unit: UnitId;
  start: number;
  end: number;
}

export interface Provenance {
  origin: Origin;
  /** The action that created the object: a free short string owned by the creating domain. */
  action: string;
  createdAt: string;
  approval: Approval;
  approvedAt: string | null;
  approvedBy: string | null;
}

export interface IpeObject {
  id: ObjectId;
  /** Short string owned by the domain that creates the object: note, fact, display, check. */
  kind: string;
  title: string;
  /** JSON owned by the creating domain. */
  body: unknown;
  anchors: Anchor[];
  dependsOn: ObjectId[];
  provenance: Provenance;
  /** The manuscript version the object rests on. */
  version: VersionId;
  stale: boolean;
  /** A tombstone: the object is kept, recoverable, and excluded from the live counts. */
  deleted: boolean;
}

export interface UnitNode {
  id: UnitId;
  title: string;
  /** Relative path of the Markdown file inside the project folder. */
  path: string;
  children: UnitNode[];
}

export interface Manifest {
  schema: 1;
  name: string;
  units: UnitNode[];
}

/** A state of the whole manuscript: each unit's content hash. Contents live in blobs. */
export interface Version {
  id: VersionId;
  at: string;
  /** The action that produced it: create, write, external, add-unit. A move, a rename or a relocation changes the manifest only. */
  action: string;
  units: Record<UnitId, string>;
}

export type EventKind = "create" | "edit" | "accept" | "reject" | "delete" | "undo" | "refresh" | "refused";

/** One entry of the append-only journal. `before` and `after` are full snapshots. */
export interface Event {
  id: EventId;
  at: string;
  kind: EventKind;
  actor: string;
  objectId: ObjectId;
  before: IpeObject | null;
  after: IpeObject | null;
  note: string | null;
}

/** The last consistent state, written last by every save. */
export interface State {
  schema: 1;
  version: VersionId | null;
  units: Record<UnitId, string>;
}

export interface AnchorChange {
  objectId: ObjectId;
  index: number;
  from: AnchorState;
  to: AnchorState;
}

export interface ChangeResult {
  version: Version | null;
  /** The objects that need re-evaluation: anchors no longer intact, and their dependents, transitively. */
  invalidated: ObjectId[];
  anchorChanges: AnchorChange[];
}

export interface ChainAnchor extends Anchor {
  /** The current text at the anchor's range, or null when the anchor is orphaned. */
  passage: string | null;
}

export interface ProvenanceChain {
  object: IpeObject;
  anchors: ChainAnchor[];
  version: Version | null;
  /** False when the version the object names is not in the history: the object is unverifiable, and kept. */
  versionFound: boolean;
  /** Transitive dependencies, nearest first. */
  dependencies: IpeObject[];
  /** The objects that depend on this one, directly. */
  dependents: ObjectId[];
}

export interface Counts {
  /** Live objects (tombstones excluded). */
  total: number;
  byKind: Record<string, number>;
  proposed: number;
  accepted: number;
  rejected: number;
  current: number;
  stale: number;
  /** Live objects with at least one anchor. */
  anchored: number;
  /** Live objects with at least one anchor in the state; an object counts once per state it carries. */
  intact: number;
  changed: number;
  ambiguous: number;
  orphaned: number;
  deleted: number;
  /** Anchors of live objects, by state. */
  anchorsByState: Record<AnchorState, number>;
}

export interface Hit {
  unit: UnitId | null;
  objectId: ObjectId | null;
  start: number;
  end: number;
  excerpt: string;
}

export interface OpenReport {
  /** Units whose content on disk differs from the last consistent state. */
  externalChanges: UnitId[];
  /** The history holds a version the state does not name: a save was interrupted after the index was written. */
  interrupted: boolean;
  historyUnreadable: boolean;
  /** Units the manifest names whose file is absent. */
  missingUnits: UnitId[];
  /** Object files that are not JSON: reported by path and skipped. */
  unreadableObjects: string[];
  /** Journal lines that are not an event (a last line cut by a crash in an append): skipped, and counted here. */
  journalLinesSkipped: number;
  anchorChanges: AnchorChange[];
}

export interface CreateObjectInput {
  kind: string;
  title: string;
  body?: unknown;
  anchors?: AnchorInput[];
  dependsOn?: ObjectId[];
  origin: Origin;
  action: string;
}

export interface ObjectPatch {
  title?: string;
  body?: unknown;
  anchors?: AnchorInput[];
  dependsOn?: ObjectId[];
}
