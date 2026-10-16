// SPEC-PRJ-006: Markdown round trip, through the Node adapters: what is saved is what is read back,
// byte for byte, including every construct the editor does not render.
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { createProject, openProject } from "../src/index.js";
import { tmpFolder } from "./support/tmp.js";

class Random {
  private state: number;
  constructor(seed: number) {
    this.state = seed >>> 0;
  }
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)] as T;
  }
}

const PIECES = [
  "# Heading\n", "## Sub\n", "plain prose, with *emphasis* and **strength**.\n", "- a list item\n", "1. a numbered item\n",
  "> a quote\n", "```js\nconst x = 1;\n```\n", "| a | b |\n|---|---|\n| 1 | 2 |\n", "[link](https://example.org)\n", "![image](img.png)\n",
  "Footnote reference[^1].\n\n[^1]: The footnote.\n", "$$\nE = mc^2\n$$\n", "<div class=\"raw\">html block</div>\n", "---\n",
  "\ttabbed line\n", "trailing spaces   \n", "\n", "\n\n", "é漢😀 unicode\n", "\r\n",
];

const CONSTRUCTS = [
  "---\ntitle: Front matter\ntags: [a, b]\n---\n\n# Body\n",
  "<details>\n<summary>Raw HTML block</summary>\n\n<p>kept verbatim</p>\n</details>\n",
  "A sentence with a footnote[^note].\n\n[^note]: Its text, on two\n    lines.\n",
  "Inline math $a^2 + b^2 = c^2$ and a block:\n\n$$\n\\int_0^1 x\\,dx\n$$\n",
  "Line with trailing spaces for a break  \nnext line\n",
  "No trailing newline at the end",
];

describe("SPEC-PRJ-006 Markdown round trip", () => {
  it("TST-PRJ-006a: random Markdown documents round-trip byte-identical", async () => {
    const rnd = new Random(42);
    const root = await tmpFolder("roundtrip");
    const kernel = await createProject(root, "Round trip");
    const unit = await kernel.addUnit("Unit");
    for (let i = 0; i < 60; i++) {
      let text = "";
      const count = 1 + Math.floor(rnd.next() * 12);
      for (let j = 0; j < count; j++) text += rnd.pick(PIECES);
      await kernel.writeUnit(unit.id, text);
      expect(kernel.readUnit(unit.id)).toBe(text);
      expect(await fs.readFile(path.join(root, unit.path), "utf8")).toBe(text);
      const reopened = await openProject(root);
      expect(reopened.readUnit(unit.id)).toBe(text);
      expect(reopened.openReport.externalChanges).toEqual([]);
    }
  });

  it("TST-PRJ-006b: a corpus of constructs the editor does not render is preserved verbatim", async () => {
    const root = await tmpFolder("constructs");
    const kernel = await createProject(root, "Constructs");
    for (const [i, text] of CONSTRUCTS.entries()) {
      const unit = await kernel.addUnit(`Construct ${i}`);
      await kernel.writeUnit(unit.id, text);
      expect(await fs.readFile(path.join(root, unit.path), "utf8")).toBe(text);
    }
    const reopened = await openProject(root);
    for (const [i, text] of CONSTRUCTS.entries()) {
      const unit = reopened.units()[i];
      expect(reopened.readUnit(unit?.id ?? "")).toBe(text);
    }
  });
});
