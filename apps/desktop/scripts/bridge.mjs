// Runs the service behind the HTTP bridge, without Electron: for the tests and for a browser.
// Usage: node scripts/bridge.mjs [port]. Prints the address it listens on.
import { build } from "esbuild";
import * as path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist", "bridge", "run.cjs");
await build({
  entryPoints: [path.join(root, "src", "bridge", "run.ts")],
  outfile: out,
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  logLevel: "warning",
});
const require = createRequire(import.meta.url);
const { main } = require(out);
await main(Number(process.argv[2] ?? 0));
