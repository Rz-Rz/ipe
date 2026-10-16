// Temporary project folders for the adapter tests, one per test, under the system's temporary folder.
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";

export async function tmpFolder(name: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), `ipe-${name}-`));
}
