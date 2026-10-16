// The one channel between the interface and the core (design note Section 7, ADR-0003).
// The interface calls this and nothing else. In the application the channel is Electron's
// message channel; in tests and for the browser surface it is a local HTTP bridge. Both carry
// the same calls, with JSON arguments and results.

import type { ChangeResult, Counts, CreateObjectInput, Hit, IpeObject, OpenReport, ProvenanceChain, UnitNode, Version } from "@ipe/kernel";

export interface ProjectView {
  root: string;
  name: string;
  units: UnitNode[];
  report: OpenReport;
}

export interface UnitText {
  unitId: string;
  text: string;
  /** The content hash the text was read at, to detect a conflict at save. */
  hash: string;
}

export interface SaveResult extends ChangeResult {
  hash: string;
}

export interface ConflictResult {
  conflict: true;
  unitId: string;
  /** What the disk holds now. */
  disk: string;
  /** What the interface wanted to save. */
  mine: string;
}

export interface MoveResult {
  units: UnitNode[];
  /** The live objects anchored to the moved unit or its descendants: what the move carried. */
  carried: number;
}

export interface IpeApi {
  /** Creates a project in a folder; the folder is created when absent and must hold no project. */
  createProject(root: string, name: string): Promise<ProjectView>;
  /** Opens a project; a folder holding Markdown files and no manifest is adopted, nothing rewritten. */
  openProject(root: string): Promise<ProjectView>;
  /** The project currently open, or null. */
  current(): Promise<ProjectView | null>;
  readUnit(unitId: string): Promise<UnitText>;
  /** Saves a unit. Refused as a conflict when the disk changed since the text was read, unless forced. */
  writeUnit(unitId: string, text: string, options?: { force?: boolean }): Promise<SaveResult | ConflictResult>;
  addUnit(title: string, parentId: string | null): Promise<UnitNode>;
  renameUnit(unitId: string, title: string): Promise<UnitNode[]>;
  moveUnit(unitId: string, parentId: string | null, index: number): Promise<MoveResult>;
  search(term: string): Promise<Hit[]>;
  objects(): Promise<IpeObject[]>;
  /** Creates an object on the open project; the actor is `author` for the author's own objects. */
  createObject(input: CreateObjectInput, actor: string): Promise<IpeObject>;
  acceptObject(objectId: string): Promise<IpeObject>;
  rejectObject(objectId: string): Promise<IpeObject>;
  explain(objectId: string): Promise<ProvenanceChain>;
  counts(): Promise<Counts>;
  versions(): Promise<Version[]>;
}

/** The names of the calls, for the two transports. */
export const API_METHODS: Array<keyof IpeApi> = [
  "createProject", "openProject", "current", "readUnit", "writeUnit", "addUnit", "renameUnit", "moveUnit",
  "search", "objects", "createObject", "acceptObject", "rejectObject", "explain", "counts", "versions",
];
