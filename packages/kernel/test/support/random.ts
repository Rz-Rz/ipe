// A seeded generator, so that a property test replays exactly from its seed.

export class Random {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** A float in [0, 1). mulberry32. */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** An integer in [min, max], both included. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(items: readonly T[]): T {
    const item = items[this.int(0, items.length - 1)];
    if (item === undefined) throw new Error("pick on an empty list");
    return item;
  }

  /** A lowercase word of 5 to 9 letters. */
  word(): string {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const length = this.int(5, 9);
    let out = "";
    for (let i = 0; i < length; i++) out += letters[this.int(0, letters.length - 1)];
    return out;
  }
}

/** Distinct words: none is a substring of another, so that each occurs exactly once in a text that joins them. */
export function distinctWords(rnd: Random, count: number): string[] {
  const words: string[] = [];
  while (words.length < count) {
    const w = rnd.word();
    if (words.some((x) => x.includes(w) || w.includes(x))) continue;
    words.push(w);
  }
  return words;
}
