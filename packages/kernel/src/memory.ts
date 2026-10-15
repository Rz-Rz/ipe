// Adapters that live in memory: the test bench of the kernel, and the seed of the browser
// surface. The storage records every write in order, so that a test can read the order a save
// follows (blobs, objects, index, state).

import type { Clock, Ids, Storage } from "./adapters.js";

export class MemoryStorage implements Storage {
  readonly files = new Map<string, string>();
  /** Every write and append, in order: path and the whole text after the operation. */
  readonly writes: Array<{ path: string; text: string }> = [];

  async read(path: string): Promise<string | null> {
    return this.files.get(path) ?? null;
  }

  async write(path: string, text: string): Promise<void> {
    this.files.set(path, text);
    this.writes.push({ path, text });
  }

  async append(path: string, text: string): Promise<void> {
    const next = (this.files.get(path) ?? "") + text;
    this.files.set(path, next);
    this.writes.push({ path, text: next });
  }

  async list(dir: string): Promise<string[]> {
    const prefix = dir.endsWith("/") ? dir : `${dir}/`;
    const names = new Set<string>();
    for (const path of this.files.keys()) {
      if (!path.startsWith(prefix)) continue;
      const rest = path.slice(prefix.length);
      const first = rest.split("/")[0];
      if (first) names.add(first);
    }
    return [...names].sort();
  }

  async remove(path: string): Promise<void> {
    this.files.delete(path);
  }

  async exists(path: string): Promise<boolean> {
    return this.files.has(path);
  }

  /** A deep copy of the files, to compare a store before and after an operation. */
  snapshot(): Map<string, string> {
    return new Map(this.files);
  }
}

/** A clock that advances by one second per call, from a fixed origin, for reproducible records. */
export class SteppingClock implements Clock {
  private tick = 0;
  constructor(private readonly originMs: number = Date.UTC(2026, 0, 1)) {}
  now(): string {
    this.tick += 1;
    return new Date(this.originMs + this.tick * 1000).toISOString();
  }
}

/** Identifiers from a counter, with a prefix: readable in a test, unique in a project. */
export class SequenceIds implements Ids {
  private counter = 0;
  constructor(private readonly prefix: string = "id") {}
  next(): string {
    this.counter += 1;
    return `${this.prefix}-${String(this.counter).padStart(6, "0")}`;
  }
}

export function memoryAdapters(prefix = "id"): { storage: MemoryStorage; clock: SteppingClock; ids: SequenceIds } {
  return { storage: new MemoryStorage(), clock: new SteppingClock(), ids: new SequenceIds(prefix) };
}
