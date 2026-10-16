// ADR-0003, definition of done of ENG-0003, criterion 1: the interface imports no Node module and
// no Electron module; it reaches the core through the channel alone. The kernel is a type import.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

const RENDERER = path.resolve(__dirname, "..", "src", "renderer");
const FORBIDDEN = [/^node:/, /^electron$/, /^fs$/, /^path$/, /^os$/, /^child_process$/, /^@ipe\/adapters-node$/];

async function sources(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await sources(p)));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out;
}

describe("the interface and the channel contract", () => {
  it("import no Node, Electron or adapter module, and the kernel as types only", async () => {
    const files = [...(await sources(RENDERER)), path.resolve(__dirname, "..", "src", "api.ts")];
    expect(files.length).toBeGreaterThan(2);
    for (const file of files) {
      const text = await fs.readFile(file, "utf8");
      for (const m of text.matchAll(/^\s*import\s+(type\s+)?[^'"]*?from\s+["']([^"']+)["']/gm)) {
        const [, typeOnly, specifier] = m;
        for (const forbidden of FORBIDDEN) expect(specifier, `${path.basename(file)} imports ${specifier}`).not.toMatch(forbidden);
        if (specifier === "@ipe/kernel") expect(typeOnly, `${path.basename(file)} imports the kernel as a value`).toBe("type ");
      }
      expect(text, `${path.basename(file)} requires a module`).not.toMatch(/\brequire\(/);
    }
  });
});
