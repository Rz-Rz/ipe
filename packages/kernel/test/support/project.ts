// Fixtures on the in-memory adapters: a project, a unit, an object anchored on a passage.

import { Kernel, OBJECTS_DIR, memoryAdapters, type IpeObject, type MemoryStorage, type Origin, type SequenceIds, type SteppingClock, type UnitNode } from "../../src/index.js";

export interface Bench {
  kernel: Kernel;
  storage: MemoryStorage;
  adapters: { storage: MemoryStorage; clock: SteppingClock; ids: SequenceIds };
}

export async function freshProject(name = "Test project"): Promise<Bench> {
  const adapters = memoryAdapters();
  const kernel = await Kernel.create(adapters, name);
  return { kernel, storage: adapters.storage, adapters };
}

export async function withUnit(text: string, title = "Chapter 1"): Promise<Bench & { unit: UnitNode }> {
  const bench = await freshProject();
  const unit = await bench.kernel.addUnit(title);
  await bench.kernel.writeUnit(unit.id, text);
  return { ...bench, unit };
}

/** The range of a passage that occurs exactly once in a text. */
export function range(text: string, passage: string): { start: number; end: number } {
  const first = text.indexOf(passage);
  if (first < 0) throw new Error(`passage not found: ${passage}`);
  if (text.indexOf(passage, first + 1) >= 0) throw new Error(`passage occurs more than once: ${passage}`);
  return { start: first, end: first + passage.length };
}

export async function noteOn(
  kernel: Kernel,
  unit: string,
  passage: string,
  options: { origin?: Origin; title?: string; dependsOn?: string[]; kind?: string; body?: unknown } = {},
): Promise<IpeObject> {
  const text = kernel.readUnit(unit);
  const r = range(text, passage);
  return kernel.createObject(
    {
      kind: options.kind ?? "note",
      title: options.title ?? `note on ${passage}`,
      body: options.body ?? { about: passage },
      anchors: [{ unit, start: r.start, end: r.end }],
      dependsOn: options.dependsOn ?? [],
      origin: options.origin ?? "author",
      action: "test",
    },
    options.origin === "assistant" ? "assistant" : "author",
  );
}

/** The object files as the store holds them, by file name. */
export function objectFiles(storage: MemoryStorage): Map<string, string> {
  const out = new Map<string, string>();
  for (const [path, text] of storage.files) if (path.startsWith(`${OBJECTS_DIR}/`)) out.set(path, text);
  return out;
}
