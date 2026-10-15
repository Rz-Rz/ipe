// The adapters the kernel declares and never implements itself (design note Section 6).
// Paths are POSIX-style, relative to the project folder. `write` is atomic by contract:
// a reader sees the previous content or the new one, never a mixture.

export interface Storage {
  /** The text of a file, or null when it does not exist. */
  read(path: string): Promise<string | null>;
  /** Writes the whole file atomically, creating parent folders as needed. */
  write(path: string, text: string): Promise<void>;
  /** Appends to a file, creating it when absent. Optional: the kernel falls back to read and write. */
  append?(path: string, text: string): Promise<void>;
  /** The names (not paths) of the entries of a folder; an empty list when the folder is absent. */
  list(dir: string): Promise<string[]>;
  remove(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

export interface Clock {
  /** ISO-8601, UTC. */
  now(): string;
}

export interface Ids {
  /** A new identifier, unique within the project. */
  next(): string;
}

export interface Hash {
  /** Hexadecimal SHA-256 of the UTF-8 encoding of the text. */
  sha256(text: string): string;
}

export interface Adapters {
  storage: Storage;
  clock: Clock;
  ids: Ids;
  /** Defaults to the kernel's own pure implementation. */
  hash?: Hash;
}
