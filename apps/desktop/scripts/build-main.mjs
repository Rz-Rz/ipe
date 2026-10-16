// Bundles the main process, the preload and the bridge runner into CommonJS files Electron loads.
import { build } from "esbuild";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  { entry: "src/main/main.ts", out: "dist/main/main.cjs" },
  { entry: "src/main/preload.ts", out: "dist/main/preload.cjs" },
];
for (const t of targets) {
  await build({
    entryPoints: [path.join(root, t.entry)],
    outfile: path.join(root, t.out),
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node20",
    external: ["electron"],
    sourcemap: true,
    logLevel: "warning",
  });
  console.log(`built ${t.out}`);
}
