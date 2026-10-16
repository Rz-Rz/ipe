// The service behind the channel: one open project, the kernel on the Node adapters. Shared by
// the Electron main process and the HTTP bridge, so that both surfaces run the same code.

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { AUTHOR, Kernel, KernelError, MANIFEST, type Counts, type CreateObjectInput, type Hit, type IpeObject, type ProvenanceChain, type UnitNode, type Version } from "@ipe/kernel";
import { nodeAdapters, nodeHash } from "@ipe/adapters-node";
import type { ConflictResult, IpeApi, MoveResult, ProjectView, SaveResult, UnitText } from "../api.js";

function flatten(nodes: UnitNode[], out: UnitNode[] = []): UnitNode[] {
  for (const n of nodes) {
    out.push(n);
    flatten(n.children, out);
  }
  return out;
}

export class IpeService implements IpeApi {
  private kernel: Kernel | null = null;
  private root: string | null = null;

  private open(): Kernel {
    if (this.kernel === null) throw new KernelError("no_project_open", "no project is open");
    return this.kernel;
  }

  private view(): ProjectView {
    const kernel = this.open();
    return { root: this.root ?? "", name: kernel.name(), units: kernel.units(), report: kernel.openReport };
  }

  async createProject(root: string, name: string): Promise<ProjectView> {
    const abs = path.resolve(root);
    await fs.mkdir(abs, { recursive: true });
    this.kernel = await Kernel.create(nodeAdapters(abs), name);
    this.root = abs;
    return this.view();
  }

  /** Opens a project. A folder of Markdown files without a manifest is adopted: the files are registered as units, none is rewritten. */
  async openProject(root: string): Promise<ProjectView> {
    const abs = path.resolve(root);
    const adapters = nodeAdapters(abs);
    if (!(await adapters.storage.exists(MANIFEST))) {
      const markdown = (await fs.readdir(abs, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith(".md")).map((e) => e.name).sort();
      if (markdown.length === 0) throw new KernelError("no_project", `${abs} holds neither a project nor Markdown files`);
      const kernel = await Kernel.create(adapters, path.basename(abs));
      for (const file of markdown) await kernel.adoptUnit(file.replace(/\.md$/, ""), file);
    }
    this.kernel = await Kernel.open(adapters);
    this.root = abs;
    return this.view();
  }

  async current(): Promise<ProjectView | null> {
    return this.kernel === null ? null : this.view();
  }

  async readUnit(unitId: string): Promise<UnitText> {
    const text = this.open().readUnit(unitId);
    return { unitId, text, hash: nodeHash.sha256(text) };
  }

  async writeUnit(unitId: string, text: string, options: { force?: boolean } = {}): Promise<SaveResult | ConflictResult> {
    const kernel = this.open();
    try {
      const result = await kernel.writeUnit(unitId, text, options);
      return { ...result, hash: nodeHash.sha256(text) };
    } catch (e) {
      if (e instanceof KernelError && e.code === "conflict") {
        return { conflict: true, unitId, disk: (await kernel.externalText(unitId)) ?? "", mine: text };
      }
      throw e;
    }
  }

  async addUnit(title: string, parentId: string | null): Promise<UnitNode> {
    return this.open().addUnit(title, { parentId });
  }

  async renameUnit(unitId: string, title: string): Promise<UnitNode[]> {
    const kernel = this.open();
    await kernel.renameUnit(unitId, title);
    return kernel.units();
  }

  async moveUnit(unitId: string, parentId: string | null, index: number): Promise<MoveResult> {
    const kernel = this.open();
    const subtree = new Set(flatten(flatten(kernel.units()).filter((u) => u.id === unitId)).map((u) => u.id));
    await kernel.moveUnit(unitId, parentId, index);
    const carried = kernel.listObjects().filter((o) => o.anchors.some((a) => subtree.has(a.unit))).length;
    return { units: kernel.units(), carried };
  }

  async search(term: string): Promise<Hit[]> {
    return this.open().search(term);
  }

  async objects(): Promise<IpeObject[]> {
    return this.open().listObjects();
  }

  async createObject(input: CreateObjectInput, actor: string): Promise<IpeObject> {
    return this.open().createObject(input, actor);
  }

  async acceptObject(objectId: string): Promise<IpeObject> {
    return this.open().accept(objectId, AUTHOR);
  }

  async rejectObject(objectId: string): Promise<IpeObject> {
    return this.open().reject(objectId, AUTHOR);
  }

  async explain(objectId: string): Promise<ProvenanceChain> {
    return this.open().explain(objectId);
  }

  async counts(): Promise<Counts> {
    return this.open().counts();
  }

  async versions(): Promise<Version[]> {
    return this.open().versions();
  }
}
