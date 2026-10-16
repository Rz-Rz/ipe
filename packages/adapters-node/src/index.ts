// The kernel's adapters on Node (design note Section 6): a storage rooted at the project folder
// with atomic writes, the system clock, random identifiers, the platform digest. The only place
// of the product that touches the file system on the desktop.

import { createHash, randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Kernel, type Adapters, type Clock, type Hash, type Ids, type Storage } from "@ipe/kernel";

function isErrno(e: unknown, code: string): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === code;
}

/** A storage rooted at one folder. Paths are relative, POSIX-style, and never escape the root. */
export class NodeStorage implements Storage {
  readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  resolve(rel: string): string {
    const abs = path.resolve(this.root, rel);
    if (abs !== this.root && !abs.startsWith(this.root + path.sep)) throw new Error(`path escapes the project folder: ${rel}`);
    return abs;
  }

  async read(rel: string): Promise<string | null> {
    try {
      return await fs.readFile(this.resolve(rel), "utf8");
    } catch (e) {
      if (isErrno(e, "ENOENT")) return null;
      throw e;
    }
  }

  /** Atomic: the text goes to a temporary file in the same folder, then replaces the target by rename. */
  async write(rel: string, text: string): Promise<void> {
    const abs = this.resolve(rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    const tmp = `${abs}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
    try {
      await fs.writeFile(tmp, text, "utf8");
      await this.moveIntoPlace(tmp, abs);
    } catch (e) {
      await fs.rm(tmp, { force: true });
      throw e;
    }
  }

  /** The step that makes a write visible: one rename, atomic on the file system. Overridable for tests. */
  protected moveIntoPlace(tmp: string, abs: string): Promise<void> {
    return fs.rename(tmp, abs);
  }

  async append(rel: string, text: string): Promise<void> {
    const abs = this.resolve(rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.appendFile(abs, text, "utf8");
  }

  async list(rel: string): Promise<string[]> {
    try {
      return (await fs.readdir(this.resolve(rel))).sort();
    } catch (e) {
      if (isErrno(e, "ENOENT")) return [];
      throw e;
    }
  }

  async remove(rel: string): Promise<void> {
    await fs.rm(this.resolve(rel), { force: true });
  }

  async exists(rel: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(rel));
      return true;
    } catch {
      return false;
    }
  }
}

export class SystemClock implements Clock {
  now(): string {
    return new Date().toISOString();
  }
}

export class RandomIds implements Ids {
  next(): string {
    return randomUUID();
  }
}

export const nodeHash: Hash = {
  sha256: (text: string): string => createHash("sha256").update(text, "utf8").digest("hex"),
};

export function nodeAdapters(root: string): Adapters & { storage: NodeStorage } {
  return { storage: new NodeStorage(root), clock: new SystemClock(), ids: new RandomIds(), hash: nodeHash };
}

/** Creates a project in a folder (created when absent). */
export async function createProject(root: string, name: string): Promise<Kernel> {
  await fs.mkdir(root, { recursive: true });
  return Kernel.create(nodeAdapters(root), name);
}

/** Opens the project of a folder. */
export async function openProject(root: string): Promise<Kernel> {
  return Kernel.open(nodeAdapters(root));
}
