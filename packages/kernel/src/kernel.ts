// The provenance kernel (SPEC-KER-001 to SPEC-KER-014, design note Sections 2 to 6).
//
// One instance holds one project: its manifest, the current text of every unit, the live
// objects, the versions, the journal. Every save is persisted through the storage adapter in
// the order unit file, touched objects, blob, versions index, state, so that an interruption
// leaves the last consistent state behind (state is written last). The kernel reaches no
// platform API.

import type { Adapters, Clock, Hash, Ids, Storage } from "./adapters.js";
import { makeAnchor, resolveAnchor, sameAnchor, type UnitText } from "./anchors.js";
import {
  BLOBS_DIR, JOURNAL, KernelError, MANIFEST, OBJECTS_DIR, STATE, VERSIONS_INDEX, blobPath, canonicalJson, objectPath,
  parseEvents, parseManifest, parseObject, parseState, parseVersions,
} from "./layout.js";
import { sha256Hex } from "./sha256.js";
import type {
  Anchor, AnchorChange, AnchorInput, ChainAnchor, ChangeResult, Counts, CreateObjectInput, Event, EventKind, Hit, IpeObject,
  Manifest, ObjectId, ObjectPatch, OpenReport, ProvenanceChain, State, UnitId, UnitNode, Version, VersionId,
} from "./types.js";

/** The actor allowed to accept, reject and otherwise decide: the author of the project. */
export const AUTHOR = "author";

const defaultHash: Hash = { sha256: sha256Hex };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function flatten(nodes: UnitNode[], out: UnitNode[] = []): UnitNode[] {
  for (const n of nodes) {
    out.push(n);
    flatten(n.children, out);
  }
  return out;
}

function slug(title: string): string {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s.length > 0 ? s : "unit";
}

export class Kernel {
  private readonly storage: Storage;
  private readonly clock: Clock;
  private readonly ids: Ids;
  private readonly hash: Hash;
  private manifest: Manifest;
  private readonly texts = new Map<UnitId, string>();
  private readonly objects = new Map<ObjectId, IpeObject>();
  /** What each object file holds on disk, to write only what changed. */
  private readonly written = new Map<ObjectId, string>();
  private history: Version[] = [];
  private unreadableIndexKept = false;
  /**
   * The units whose last save did not complete: a unit enters once its file is written and leaves
   * once the state of that save is written. A refused save leaves its unit here, and the next save
   * of the same text in the same kernel runs whole, whatever was saved in between (SPEC-KER-012).
   */
  private incomplete = new Set<UnitId>();
  private events: Event[] = [];
  private state: State;
  readonly openReport: OpenReport;

  private constructor(adapters: Adapters, manifest: Manifest, state: State, report: OpenReport) {
    this.storage = adapters.storage;
    this.clock = adapters.clock;
    this.ids = adapters.ids;
    this.hash = adapters.hash ?? defaultHash;
    this.manifest = manifest;
    this.state = state;
    this.openReport = report;
  }

  // ------------------------------------------------------------------ lifecycle

  /** Creates a project in an empty folder: manifest, an initial version, the state. */
  static async create(adapters: Adapters, name: string): Promise<Kernel> {
    if (await adapters.storage.exists(MANIFEST)) throw new KernelError("project_exists", `${MANIFEST} already exists`);
    const manifest: Manifest = { schema: 1, name, units: [] };
    const report: OpenReport = { externalChanges: [], interrupted: false, historyUnreadable: false, missingUnits: [], unreadableObjects: [], journalLinesSkipped: 0, anchorChanges: [] };
    const kernel = new Kernel(adapters, manifest, { schema: 1, version: null, units: {} }, report);
    await kernel.storage.write(MANIFEST, canonicalJson(manifest));
    await kernel.recordVersion("create", null);
    return kernel;
  }

  /** Opens a project, validates its store, absorbs the changes made outside the product. */
  static async open(adapters: Adapters): Promise<Kernel> {
    const storage = adapters.storage;
    const manifestText = await storage.read(MANIFEST);
    if (manifestText === null) throw new KernelError("no_project", `${MANIFEST} not found`);
    const manifest = parseManifest(manifestText);
    const report: OpenReport = { externalChanges: [], interrupted: false, historyUnreadable: false, missingUnits: [], unreadableObjects: [], journalLinesSkipped: 0, anchorChanges: [] };

    let state: State = { schema: 1, version: null, units: {} };
    const stateText = await storage.read(STATE);
    if (stateText !== null) state = parseState(stateText);

    const kernel = new Kernel(adapters, manifest, state, report);

    for (const unit of flatten(manifest.units)) {
      const text = await storage.read(unit.path);
      if (text === null) {
        report.missingUnits.push(unit.id);
        kernel.texts.set(unit.id, "");
      } else {
        kernel.texts.set(unit.id, text);
      }
    }

    const files = (await storage.list(OBJECTS_DIR)).filter((f) => f.endsWith(".json")).sort();
    const seen = new Map<ObjectId, string>();
    for (const file of files) {
      const path = `${OBJECTS_DIR}/${file}`;
      const text = await storage.read(path);
      if (text === null) continue;
      let object: IpeObject;
      try {
        object = parseObject(text, path);
      } catch (e) {
        // A file that is not JSON is reported and skipped; a file that is JSON but breaks the
        // description refuses the project, with the file named (SPEC-KER-002, SPEC-KER-008).
        if (e instanceof KernelError && e.code === "invalid_json") {
          report.unreadableObjects.push(path);
          continue;
        }
        throw e;
      }
      const previous = seen.get(object.id);
      if (previous !== undefined) {
        throw new KernelError("duplicate_id", `two object files carry the identifier ${object.id}: ${previous} and ${path}`);
      }
      seen.set(object.id, path);
      kernel.objects.set(object.id, object);
      kernel.written.set(object.id, text);
    }

    const indexText = await storage.read(VERSIONS_INDEX);
    if (indexText !== null) {
      try {
        kernel.history = parseVersions(indexText);
      } catch {
        report.historyUnreadable = true;
        kernel.history = [];
      }
    }

    const journalText = await storage.read(JOURNAL);
    if (journalText !== null) {
      const parsed = parseEvents(journalText);
      kernel.events = parsed.events;
      report.journalLinesSkipped = parsed.skipped;
    }

    const last = kernel.history[kernel.history.length - 1];
    if (last !== undefined && state.version !== last.id) report.interrupted = true;

    for (const [unitId, text] of kernel.texts) {
      const known = state.units[unitId];
      if (known !== undefined && known !== kernel.hash.sha256(text)) report.externalChanges.push(unitId);
    }

    if (report.externalChanges.length > 0) {
      const changes = kernel.reanchor(new Set(report.externalChanges));
      report.anchorChanges = changes.anchorChanges;
      await kernel.persistTouched(changes.touched);
      await kernel.recordVersion("external", null);
    } else if (report.interrupted) {
      await kernel.writeState();
    }
    return kernel;
  }

  // ------------------------------------------------------------------ units

  units(): UnitNode[] {
    return clone(this.manifest.units);
  }

  name(): string {
    return this.manifest.name;
  }

  readUnit(unitId: UnitId): string {
    const text = this.texts.get(unitId);
    if (text === undefined) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    return text;
  }

  private findNode(unitId: UnitId): UnitNode | null {
    return flatten(this.manifest.units).find((u) => u.id === unitId) ?? null;
  }

  private detachNode(unitId: UnitId): UnitNode | null {
    const detach = (nodes: UnitNode[]): UnitNode | null => {
      const i = nodes.findIndex((n) => n.id === unitId);
      if (i >= 0) return nodes.splice(i, 1)[0] ?? null;
      for (const n of nodes) {
        const found = detach(n.children);
        if (found) return found;
      }
      return null;
    };
    return detach(this.manifest.units);
  }

  private uniquePath(wanted: string): string {
    const taken = new Set(flatten(this.manifest.units).map((u) => u.path));
    if (!taken.has(wanted)) return wanted;
    const base = wanted.replace(/\.md$/, "");
    for (let i = 2; ; i++) {
      const candidate = `${base}-${i}.md`;
      if (!taken.has(candidate)) return candidate;
    }
  }

  /** Adds a unit with an empty text, as the last child of `parentId` (or at the root). */
  async addUnit(title: string, options: { path?: string; parentId?: UnitId | null; index?: number } = {}): Promise<UnitNode> {
    const id = this.ids.next();
    const path = this.uniquePath(options.path ?? `${slug(title)}.md`);
    const node: UnitNode = { id, title, path, children: [] };
    const siblings = options.parentId ? this.findNode(options.parentId)?.children : this.manifest.units;
    if (siblings === undefined) throw new KernelError("unknown_unit", `no unit ${String(options.parentId)}`);
    siblings.splice(options.index ?? siblings.length, 0, node);
    this.texts.set(id, "");
    await this.storage.write(path, "");
    await this.storage.write(MANIFEST, canonicalJson(this.manifest));
    await this.recordVersion("add-unit", id);
    return clone(node);
  }

  /** Registers an existing Markdown file as a unit, reading it as it is; nothing is rewritten. */
  async adoptUnit(title: string, path: string, options: { parentId?: UnitId | null; index?: number } = {}): Promise<UnitNode> {
    if (flatten(this.manifest.units).some((u) => u.path === path)) throw new KernelError("invalid_input", `${path} is already a unit`);
    const text = await this.storage.read(path);
    if (text === null) throw new KernelError("unknown_unit", `no file ${path} to adopt`);
    const id = this.ids.next();
    const node: UnitNode = { id, title, path, children: [] };
    const siblings = options.parentId ? this.findNode(options.parentId)?.children : this.manifest.units;
    if (siblings === undefined) throw new KernelError("unknown_unit", `no unit ${String(options.parentId)}`);
    siblings.splice(options.index ?? siblings.length, 0, node);
    this.texts.set(id, text);
    await this.storage.write(MANIFEST, canonicalJson(this.manifest));
    await this.recordVersion("adopt-unit", id);
    return clone(node);
  }

  /**
   * The text of a unit as the disk holds it now, when it differs from the text the kernel last
   * read or wrote; null when the disk agrees. An edit made outside the product while the project
   * is open is detected by content, never by a timestamp (SPEC-KER-009).
   */
  async externalText(unitId: UnitId): Promise<string | null> {
    const node = this.findNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    const known = this.readUnit(unitId);
    const onDisk = await this.storage.read(node.path);
    if (onDisk === null || onDisk === known) return null;
    return onDisk;
  }

  /**
   * Takes the text on disk as the current text of a unit: the author's choice after a conflict
   * (SPEC-PRJ-003). The anchors that rest on it are re-resolved and a version with action
   * external is recorded; the project is unchanged when the disk and the kernel agree.
   */
  async takeExternal(unitId: UnitId): Promise<ChangeResult & { text: string }> {
    const node = this.findNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    const onDisk = await this.storage.read(node.path);
    if (onDisk === null) throw new KernelError("missing_unit", `the file of unit ${unitId} is absent from the disk`);
    if (onDisk === this.readUnit(unitId)) return { version: this.currentVersion(), invalidated: [], anchorChanges: [], text: onDisk };
    this.texts.set(unitId, onDisk);
    const changes = this.reanchor(new Set([unitId]));
    await this.persistTouched(changes.touched);
    const version = await this.recordVersion("external", unitId);
    return { version, invalidated: changes.invalidated, anchorChanges: changes.anchorChanges, text: onDisk };
  }

  /**
   * Writes the text of a unit, re-resolves the anchors that rest on it, records a version.
   * Refused with code `conflict` when the disk changed since the kernel last read or wrote the
   * unit, unless `force` is given: the author chooses, the product never overwrites silently.
   */
  async writeUnit(unitId: UnitId, text: string, options: { force?: boolean } = {}): Promise<ChangeResult> {
    const previous = this.readUnit(unitId);
    const node = this.findNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    if (!options.force) {
      const external = await this.externalText(unitId);
      if (external !== null) throw new KernelError("conflict", `unit ${unitId} changed on disk since it was read: read externalText, then write with force to keep yours`);
    }
    // A text already held is saved again only when the last save did not complete: a refusal past
    // the unit's file leaves the objects, the blob, the index or the state behind (SPEC-KER-012).
    const retry = this.incomplete.has(unitId);
    if (previous === text && !retry) return { version: this.currentVersion(), invalidated: [], anchorChanges: [] };
    // The disk first: a write the storage refuses leaves the kernel's text as it was, so that the
    // next save is neither a false conflict nor a silent no-op (SPEC-KER-012, SPEC-KER-009).
    await this.storage.write(node.path, text);
    // From here the disk holds the new text: whatever is refused below leaves this save incomplete.
    this.incomplete.add(unitId);
    this.texts.set(unitId, text);
    const changes = this.reanchor(new Set([unitId]));
    // On a retry, every object whose file does not hold its current content is written again, not
    // only the ones this re-anchoring touched: the refused write may have been another one's.
    await this.persistTouched(retry ? new Set(this.objects.keys()) : changes.touched);
    const version = await this.recordVersion("write", unitId);
    this.incomplete.delete(unitId);
    return { version, invalidated: changes.invalidated, anchorChanges: changes.anchorChanges };
  }

  /** Moves a unit under another parent (or the root) at an index. Anchors rest on identifiers: nothing to re-resolve. */
  async moveUnit(unitId: UnitId, parentId: UnitId | null, index: number): Promise<void> {
    if (parentId !== null && (parentId === unitId || flatten(this.findNode(unitId)?.children ?? []).some((c) => c.id === parentId))) {
      throw new KernelError("invalid_input", "a unit cannot be moved under itself");
    }
    const node = this.detachNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    const siblings = parentId === null ? this.manifest.units : this.findNode(parentId)?.children;
    if (siblings === undefined) {
      this.manifest.units.push(node);
      throw new KernelError("unknown_unit", `no unit ${parentId}`);
    }
    siblings.splice(Math.max(0, Math.min(index, siblings.length)), 0, node);
    await this.storage.write(MANIFEST, canonicalJson(this.manifest));
  }

  async renameUnit(unitId: UnitId, title: string): Promise<void> {
    const node = this.findNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    node.title = title;
    await this.storage.write(MANIFEST, canonicalJson(this.manifest));
  }

  /** Moves the file of a unit to another path. The identifier, and every anchor, stay. */
  async relocateUnit(unitId: UnitId, newPath: string): Promise<void> {
    const node = this.findNode(unitId);
    if (node === null) throw new KernelError("unknown_unit", `no unit ${unitId}`);
    if (node.path === newPath) return;
    if (flatten(this.manifest.units).some((u) => u.path === newPath)) throw new KernelError("invalid_input", `${newPath} is already a unit`);
    const oldPath = node.path;
    await this.storage.write(newPath, this.readUnit(unitId));
    node.path = newPath;
    await this.storage.write(MANIFEST, canonicalJson(this.manifest));
    await this.storage.remove(oldPath);
  }

  // ------------------------------------------------------------------ versions

  versions(): Version[] {
    return clone(this.history);
  }

  currentVersion(): Version | null {
    const last = this.history[this.history.length - 1];
    return last === undefined ? null : clone(last);
  }

  /** The text of a unit as it stood in a version, or null when the version or the blob is absent. */
  async readVersion(unitId: UnitId, versionId: VersionId): Promise<string | null> {
    const version = this.history.find((v) => v.id === versionId);
    const hash = version?.units[unitId];
    if (hash === undefined) return null;
    return this.storage.read(blobPath(hash));
  }

  private async recordVersion(action: string, changedUnit: UnitId | null): Promise<Version> {
    const units: Record<UnitId, string> = {};
    for (const [id, text] of this.texts) units[id] = this.hash.sha256(text);
    const toStore = changedUnit === null ? [...this.texts.keys()] : [changedUnit];
    for (const id of toStore) {
      const text = this.texts.get(id);
      const hash = units[id];
      if (text === undefined || hash === undefined) continue;
      if (!(await this.storage.exists(blobPath(hash)))) await this.storage.write(blobPath(hash), text);
    }
    const version: Version = { id: this.ids.next(), at: this.clock.now(), action, units };
    this.history.push(version);
    // An index that could not be read is kept under another name before a fresh one replaces it:
    // nothing of a history is thrown away, even unreadable.
    if (this.openReport.historyUnreadable && !this.unreadableIndexKept) {
      const broken = await this.storage.read(VERSIONS_INDEX);
      if (broken !== null) await this.storage.write(`${VERSIONS_INDEX}.unreadable-${this.clock.now().replace(/[:.]/g, "-")}`, broken);
      this.unreadableIndexKept = true;
    }
    try {
      await this.storage.write(VERSIONS_INDEX, canonicalJson(this.history));
    } catch (e) {
      // The index does not hold the version, so the history must not either: the retry then records
      // one version for one save, not a phantom beside it.
      this.history.pop();
      throw e;
    }
    this.state = { schema: 1, version: version.id, units };
    await this.writeState();
    return clone(version);
  }

  private async writeState(): Promise<void> {
    const units: Record<UnitId, string> = {};
    for (const [id, text] of this.texts) units[id] = this.hash.sha256(text);
    const last = this.history[this.history.length - 1];
    this.state = { schema: 1, version: last?.id ?? null, units };
    await this.storage.write(STATE, canonicalJson(this.state));
  }

  // ------------------------------------------------------------------ objects

  getObject(id: ObjectId): IpeObject {
    const o = this.objects.get(id);
    if (o === undefined) throw new KernelError("unknown_object", `no object ${id}`);
    return clone(o);
  }

  /** Live objects, optionally filtered by kind. */
  listObjects(filter: { kind?: string; includeDeleted?: boolean } = {}): IpeObject[] {
    const out: IpeObject[] = [];
    for (const o of this.objects.values()) {
      if (o.deleted && !filter.includeDeleted) continue;
      if (filter.kind !== undefined && o.kind !== filter.kind) continue;
      out.push(clone(o));
    }
    // A stable order, the same in memory and after a reopen: creation time, then identifier.
    out.sort((x, y) => x.provenance.createdAt.localeCompare(y.provenance.createdAt) || x.id.localeCompare(y.id));
    return out;
  }

  private buildAnchors(inputs: AnchorInput[]): Anchor[] {
    return inputs.map((a) => {
      const text = this.texts.get(a.unit);
      if (text === undefined) throw new KernelError("unknown_unit", `no unit ${a.unit}`);
      if (!(Number.isInteger(a.start) && Number.isInteger(a.end) && a.start >= 0 && a.start <= a.end && a.end <= text.length)) {
        throw new KernelError("range_out_of_bounds", `anchor ${a.start}..${a.end} does not fit unit ${a.unit} (${text.length} characters)`);
      }
      return makeAnchor(a.unit, text, a.start, a.end);
    });
  }

  private checkDependencies(objectId: ObjectId | null, dependsOn: ObjectId[]): void {
    for (const d of dependsOn) {
      const target = this.objects.get(d);
      if (target === undefined) throw new KernelError("unknown_dependency", `no object ${d} to depend on`);
      if (target.deleted) throw new KernelError("deleted_dependency", `object ${d} is deleted and cannot be depended on`);
      if (d === objectId) throw new KernelError("dependency_cycle", `${d} cannot depend on itself`);
    }
    if (objectId === null) return;
    const stack = [...dependsOn];
    const visited = new Set<ObjectId>();
    while (stack.length > 0) {
      const current = stack.pop() as ObjectId;
      if (current === objectId) throw new KernelError("dependency_cycle", `a dependency of ${objectId} leads back to it`);
      if (visited.has(current)) continue;
      visited.add(current);
      for (const next of this.objects.get(current)?.dependsOn ?? []) stack.push(next);
    }
  }

  private versionIdForNewObjects(): VersionId {
    const last = this.history[this.history.length - 1];
    if (last === undefined) throw new KernelError("no_version", "the project has no version to rest on");
    return last.id;
  }

  /** Creates an object. The author's objects are accepted at birth; the assistant's and imports are proposals. */
  async createObject(input: CreateObjectInput, actor: string): Promise<IpeObject> {
    if (!["author", "assistant", "import"].includes(input.origin)) throw new KernelError("invalid_input", `origin must be author, assistant or import`);
    if (typeof input.action !== "string" || input.action.length === 0) throw new KernelError("invalid_input", "action is required");
    if (typeof input.kind !== "string" || input.kind.length === 0) throw new KernelError("invalid_input", "kind is required");
    if (input.origin === "author" && actor !== AUTHOR) {
      const reason = `${actor} may not create an object of origin author: only the author does`;
      await this.journal("refused", actor, "(none)", null, null, reason);
      throw new KernelError("not_author", reason);
    }
    const dependsOn = [...(input.dependsOn ?? [])];
    this.checkDependencies(null, dependsOn);
    const anchors = this.buildAnchors(input.anchors ?? []);
    const now = this.clock.now();
    const accepted = input.origin === "author";
    const object: IpeObject = {
      id: this.ids.next(),
      kind: input.kind,
      title: input.title,
      body: input.body ?? null,
      anchors,
      dependsOn,
      provenance: {
        origin: input.origin,
        action: input.action,
        createdAt: now,
        approval: accepted ? "accepted" : "proposed",
        approvedAt: accepted ? now : null,
        approvedBy: accepted ? actor : null,
      },
      version: this.versionIdForNewObjects(),
      stale: dependsOn.some((d) => this.objects.get(d)?.stale === true),
      deleted: false,
    };
    if (this.objects.has(object.id)) throw new KernelError("duplicate_id", `the identifier adapter handed out ${object.id} twice`);
    await this.journal("create", actor, object.id, null, object, null);
    this.objects.set(object.id, object);
    await this.persistObject(object);
    return clone(object);
  }

  /** Edits title, body, anchors or dependencies. New anchors re-ground the object on the current text. */
  async editObject(id: ObjectId, patch: ObjectPatch, actor: string): Promise<IpeObject> {
    const current = this.live(id);
    const before = clone(current);
    if (patch.dependsOn !== undefined) this.checkDependencies(id, patch.dependsOn);
    const next: IpeObject = clone(current);
    if (patch.title !== undefined) next.title = patch.title;
    if (patch.body !== undefined) next.body = patch.body;
    if (patch.dependsOn !== undefined) next.dependsOn = [...patch.dependsOn];
    if (patch.anchors !== undefined) {
      next.anchors = this.buildAnchors(patch.anchors);
      next.version = this.versionIdForNewObjects();
    }
    await this.journal("edit", actor, id, before, next, null);
    this.objects.set(id, next);
    this.recomputeStaleness();
    await this.persistTouched(new Set(this.objects.keys()));
    return this.getObject(id);
  }

  async accept(id: ObjectId, actor: string): Promise<IpeObject> {
    return this.decide(id, actor, "accepted", "accept");
  }

  async reject(id: ObjectId, actor: string): Promise<IpeObject> {
    return this.decide(id, actor, "rejected", "reject");
  }

  private async decide(id: ObjectId, actor: string, approval: "accepted" | "rejected", kind: EventKind): Promise<IpeObject> {
    const current = this.live(id);
    if (actor !== AUTHOR) {
      await this.journal("refused", actor, id, null, null, `${actor} may not ${kind} an object: only the author decides`);
      throw new KernelError("not_author", `${actor} may not ${kind} an object: only the author decides`);
    }
    const before = clone(current);
    const now = this.clock.now();
    const next: IpeObject = { ...clone(current), provenance: { ...current.provenance, approval, approvedAt: now, approvedBy: actor } };
    await this.journal(kind, actor, id, before, next, null);
    this.objects.set(id, next);
    await this.persistObject(next);
    return clone(next);
  }

  /** A tombstone: the object stays, recoverable, out of the live counts. */
  async deleteObject(id: ObjectId, actor: string): Promise<void> {
    const current = this.live(id);
    const before = clone(current);
    const next: IpeObject = { ...clone(current), deleted: true };
    // The event first: a deletion whose history cannot be written is refused, never performed.
    await this.journal("delete", actor, id, before, next, null);
    this.objects.set(id, next);
    await this.persistObject(next);
    this.recomputeStaleness();
    await this.persistTouched(new Set(this.objects.keys()));
  }

  /** Restores the state an event replaced. Works across a close and a reopen: the journal is on disk. */
  async undo(eventId: string, actor: string): Promise<IpeObject> {
    const event = this.events.find((e) => e.id === eventId);
    if (event === undefined) throw new KernelError("unknown_event", `no event ${eventId}`);
    if (event.before === null || !["edit", "accept", "reject", "delete", "refresh"].includes(event.kind)) {
      throw new KernelError("not_undoable", `event ${eventId} (${event.kind}) has no previous state to restore`);
    }
    const current = this.objects.get(event.objectId);
    if (current === undefined) throw new KernelError("unknown_object", `no object ${event.objectId}`);
    const snapshot = clone(current);
    const restored = clone(event.before);
    // An undo that would change the approval state is the author's gesture, like the decision it reverses.
    if (actor !== AUTHOR && restored.provenance.approval !== current.provenance.approval) {
      const reason = `${actor} may not undo ${eventId}: it would change the approval state, which only the author decides`;
      await this.journal("refused", actor, current.id, null, null, reason);
      throw new KernelError("not_author", reason);
    }
    await this.journal("undo", actor, restored.id, snapshot, restored, `undo of ${eventId}`);
    this.objects.set(restored.id, restored);
    this.reanchorObject(restored);
    this.recomputeStaleness();
    await this.persistTouched(new Set(this.objects.keys()));
    return this.getObject(restored.id);
  }

  /** The domain re-evaluated the object: it rests on the current text, at its anchors' current ranges. */
  async refresh(id: ObjectId, actor: string): Promise<IpeObject> {
    const current = this.live(id);
    if (current.anchors.some((a) => a.state === "orphaned" || a.state === "ambiguous")) {
      throw new KernelError("cannot_refresh", `object ${id} has an orphaned or ambiguous anchor: edit its anchors instead`);
    }
    const before = clone(current);
    const next: IpeObject = {
      ...clone(current),
      anchors: current.anchors.map((a) => makeAnchor(a.unit, this.readUnit(a.unit), a.start, a.end)),
      version: this.versionIdForNewObjects(),
    };
    await this.journal("refresh", actor, id, before, next, null);
    this.objects.set(id, next);
    this.recomputeStaleness();
    await this.persistTouched(new Set(this.objects.keys()));
    return this.getObject(id);
  }

  journalEvents(): Event[] {
    return clone(this.events);
  }

  private live(id: ObjectId): IpeObject {
    const o = this.objects.get(id);
    if (o === undefined) throw new KernelError("unknown_object", `no object ${id}`);
    if (o.deleted) throw new KernelError("deleted_object", `object ${id} is deleted`);
    return o;
  }

  // ------------------------------------------------------------------ anchors, staleness, invalidation

  private othersFor(unitId: UnitId): UnitText[] {
    const out: UnitText[] = [];
    for (const [unit, text] of this.texts) if (unit !== unitId) out.push({ unit, text });
    return out;
  }

  private reanchorObject(object: IpeObject): AnchorChange[] {
    const changes: AnchorChange[] = [];
    object.anchors = object.anchors.map((a, index) => {
      const resolved = resolveAnchor(a, this.texts.get(a.unit) ?? "", this.othersFor(a.unit));
      if (a.state !== resolved.state) changes.push({ objectId: object.id, index, from: a.state, to: resolved.state });
      return resolved;
    });
    return changes;
  }

  /**
   * Re-resolves the anchors that rest on the given units, and every anchor that was not intact
   * (a passage can come back, or move in). Then recomputes staleness and the invalidated set.
   */
  private reanchor(units: Set<UnitId>): { touched: Set<ObjectId>; anchorChanges: AnchorChange[]; invalidated: ObjectId[] } {
    const touched = new Set<ObjectId>();
    const anchorChanges: AnchorChange[] = [];
    for (const object of this.objects.values()) {
      if (object.deleted) continue;
      let any = false;
      object.anchors = object.anchors.map((a, index) => {
        if (!units.has(a.unit) && a.state === "intact") return a;
        const resolved = resolveAnchor(a, this.texts.get(a.unit) ?? "", this.othersFor(a.unit));
        if (!sameAnchor(a, resolved)) any = true;
        if (a.state !== resolved.state) anchorChanges.push({ objectId: object.id, index, from: a.state, to: resolved.state });
        return resolved;
      });
      if (any) touched.add(object.id);
    }
    for (const id of this.recomputeStaleness()) touched.add(id);
    const seeds = new Set(anchorChanges.filter((c) => c.from === "intact" && c.to !== "intact").map((c) => c.objectId));
    const invalidated = this.withDependents(seeds);
    return { touched, anchorChanges, invalidated: [...invalidated].sort() };
  }

  /** Stale when an anchor is not intact or a dependency is stale. Returns the objects whose flag changed. */
  private recomputeStaleness(): ObjectId[] {
    const memo = new Map<ObjectId, boolean>();
    const visit = (id: ObjectId, trail: Set<ObjectId>): boolean => {
      const known = memo.get(id);
      if (known !== undefined) return known;
      const o = this.objects.get(id);
      if (o === undefined || trail.has(id)) return false;
      trail.add(id);
      let stale = o.anchors.some((a) => a.state !== "intact");
      for (const d of o.dependsOn) if (visit(d, trail)) stale = true;
      trail.delete(id);
      memo.set(id, stale);
      return stale;
    };
    const changed: ObjectId[] = [];
    for (const o of this.objects.values()) {
      const stale = visit(o.id, new Set());
      if (o.stale !== stale) {
        o.stale = stale;
        changed.push(o.id);
      }
    }
    return changed;
  }

  private withDependents(seeds: Set<ObjectId>): Set<ObjectId> {
    const out = new Set(seeds);
    let grew = true;
    while (grew) {
      grew = false;
      for (const o of this.objects.values()) {
        if (o.deleted || out.has(o.id)) continue;
        if (o.dependsOn.some((d) => out.has(d))) {
          out.add(o.id);
          grew = true;
        }
      }
    }
    return out;
  }

  // ------------------------------------------------------------------ queries

  /** The provenance chain of an object: anchors with their current passage, version, dependencies, dependents. */
  explain(id: ObjectId): ProvenanceChain {
    const object = this.getObject(id);
    const anchors: ChainAnchor[] = object.anchors.map((a) => ({
      ...a,
      passage: a.state === "intact" || a.state === "changed" ? (this.texts.get(a.unit) ?? "").slice(a.start, a.end) : null,
    }));
    const version = this.history.find((v) => v.id === object.version) ?? null;
    const dependencies: IpeObject[] = [];
    const queue = [...object.dependsOn];
    const seen = new Set<ObjectId>();
    while (queue.length > 0) {
      const d = queue.shift() as ObjectId;
      if (seen.has(d)) continue;
      seen.add(d);
      const o = this.objects.get(d);
      if (o === undefined) continue;
      dependencies.push(clone(o));
      queue.push(...o.dependsOn);
    }
    const dependents = [...this.objects.values()].filter((o) => !o.deleted && o.dependsOn.includes(id)).map((o) => o.id).sort();
    return { object, anchors, version: version === null ? null : clone(version), versionFound: version !== null, dependencies, dependents };
  }

  counts(): Counts {
    const c: Counts = {
      total: 0, byKind: {}, proposed: 0, accepted: 0, rejected: 0, current: 0, stale: 0, anchored: 0,
      intact: 0, changed: 0, ambiguous: 0, orphaned: 0, deleted: 0,
      anchorsByState: { intact: 0, changed: 0, ambiguous: 0, orphaned: 0 },
    };
    for (const o of this.objects.values()) {
      if (o.deleted) {
        c.deleted += 1;
        continue;
      }
      c.total += 1;
      c.byKind[o.kind] = (c.byKind[o.kind] ?? 0) + 1;
      c[o.provenance.approval] += 1;
      if (o.stale) c.stale += 1;
      else c.current += 1;
      if (o.anchors.length > 0) c.anchored += 1;
      for (const state of new Set(o.anchors.map((a) => a.state))) c[state] += 1;
      for (const a of o.anchors) c.anchorsByState[a.state] += 1;
    }
    return c;
  }

  /** Every occurrence of a string in every unit and in the title or body of every live object; a caller may cap the count. */
  search(term: string, limit = Number.POSITIVE_INFINITY): Hit[] {
    const hits: Hit[] = [];
    if (term.length === 0) return hits;
    const needle = term.toLowerCase();
    for (const [unit, text] of this.texts) {
      const lower = text.toLowerCase();
      let from = 0;
      for (;;) {
        const i = lower.indexOf(needle, from);
        if (i < 0 || hits.length >= limit) break;
        hits.push({ unit, objectId: null, start: i, end: i + term.length, excerpt: text.slice(Math.max(0, i - 30), Math.min(text.length, i + term.length + 30)) });
        from = i + 1;
      }
    }
    for (const o of this.objects.values()) {
      if (o.deleted || hits.length >= limit) continue;
      const haystack = `${o.title}\n${JSON.stringify(o.body)}`;
      const i = haystack.toLowerCase().indexOf(needle);
      if (i >= 0) hits.push({ unit: null, objectId: o.id, start: i, end: i + term.length, excerpt: haystack.slice(Math.max(0, i - 30), i + term.length + 30) });
    }
    return hits;
  }

  // ------------------------------------------------------------------ persistence

  private async persistObject(object: IpeObject): Promise<void> {
    const text = canonicalJson(object);
    if (this.written.get(object.id) === text) return;
    await this.storage.write(objectPath(object.id), text);
    this.written.set(object.id, text);
  }

  private async persistTouched(ids: Set<ObjectId>): Promise<void> {
    for (const id of [...ids].sort()) {
      const o = this.objects.get(id);
      if (o !== undefined) await this.persistObject(o);
    }
  }

  private async journal(kind: EventKind, actor: string, objectId: ObjectId, before: IpeObject | null, after: IpeObject | null, note: string | null): Promise<void> {
    const event: Event = { id: this.ids.next(), at: this.clock.now(), kind, actor, objectId, before: before === null ? null : clone(before), after: after === null ? null : clone(after), note };
    // The disk first: an event the history could not take is not an event.
    const line = JSON.stringify(event) + "\n";
    if (this.storage.append) await this.storage.append(JOURNAL, line);
    else await this.storage.write(JOURNAL, ((await this.storage.read(JOURNAL)) ?? "") + line);
    this.events.push(event);
  }
}

export { BLOBS_DIR, JOURNAL, MANIFEST, OBJECTS_DIR, STATE, VERSIONS_INDEX };
