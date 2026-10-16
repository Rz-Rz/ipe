# IPE desktop application

The Electron shell of IPE. The main process hosts the kernel on the Node adapters; the interface is a React page that reaches the core through one channel (`src/api.ts`), carried by Electron's message channel in the application and by a local HTTP bridge for the tests and for a browser.

## Run

From the repository root, once (`pnpm install`):

```sh
pnpm --filter @ipe/desktop build      # the interface (Vite) and the main process (esbuild)
pnpm --filter @ipe/desktop start      # electron .
```

To start on a project folder: `IPE_OPEN_PROJECT=/path/to/folder pnpm --filter @ipe/desktop start`. A folder of Markdown files without a manifest is adopted as a project; none of its files is rewritten.

Under WSL, Electron needs the display of the machine (`DISPLAY=:0` with WSLg) and the `--no-sandbox` flag: `pnpm --filter @ipe/desktop exec electron . --no-sandbox`.

## Develop

```sh
pnpm --filter @ipe/desktop dev                      # the interface on http://127.0.0.1:5173
pnpm --filter @ipe/desktop bridge 4321              # the service behind the bridge on http://127.0.0.1:4321
```

Then open `http://127.0.0.1:5173/?bridge=http://127.0.0.1:4321` in a browser, or run the window on the Vite server: `IPE_RENDERER_URL=http://127.0.0.1:5173 pnpm --filter @ipe/desktop start`.

Environment variables of the main process: `IPE_OPEN_PROJECT` (the project to open at start), `IPE_RENDERER_URL` (load the interface from this address instead of the built files), `IPE_BRIDGE_PORT` (also expose the bridge from the application, loopback only).

## Test

```sh
pnpm test                 # unit tests of every package, the service included
pnpm e2e                  # Playwright: the interface in a browser against the bridge, then the Electron smoke test
pnpm e2e:browser          # the browser tests only
pnpm e2e:electron         # the Electron smoke test only (needs a display)
```

The end-to-end tests write one screenshot per gesture under `test-results/screenshots/`; the copies of one run are kept under `e2e/screenshots/`.
