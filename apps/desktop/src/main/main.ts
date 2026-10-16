// The Electron main process: hosts the service (the kernel on the Node adapters), answers the
// channel, opens the window on the interface. In development the window loads the Vite server
// named by IPE_RENDERER_URL; packaged, it loads the built interface.

import * as path from "node:path";
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { KernelError } from "@ipe/kernel";
import { IpeService } from "./service.js";
import { startBridge } from "../bridge/server.js";
import type { IpeApi } from "../api.js";

const service = new IpeService();

ipcMain.handle("ipe", async (_event, method: keyof IpeApi, args: unknown[]) => {
  try {
    const fn = service[method] as (...a: unknown[]) => Promise<unknown>;
    if (typeof fn !== "function") return { ok: false, error: { code: "not_found", message: `no call ${String(method)}` } };
    const result = await fn.apply(service, args);
    return { ok: true, result: result ?? null };
  } catch (e) {
    const code = e instanceof KernelError ? e.code : ((e as { code?: string }).code ?? "error");
    return { ok: false, error: { code, message: String((e as Error).message ?? e) } };
  }
});

ipcMain.handle("ipe:chooseFolder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory", "createDirectory"] });
  return result.canceled ? null : (result.filePaths[0] ?? null);
});

// The project named on the environment is opened by the interface itself, through the channel,
// so that what the window shows and what the service holds never diverge.
ipcMain.handle("ipe:initialProject", () => process.env["IPE_OPEN_PROJECT"] ?? null);

async function createWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    title: "IPE",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  const rendererUrl = process.env["IPE_RENDERER_URL"];
  if (rendererUrl) await window.loadURL(rendererUrl);
  else await window.loadFile(path.join(__dirname, "..", "renderer", "index.html"));
}

app.whenReady().then(async () => {
  // An optional bridge on the loopback, for tools that drive the application from outside.
  const bridgePort = process.env["IPE_BRIDGE_PORT"];
  if (bridgePort) {
    const bridge = await startBridge(service, Number(bridgePort));
    console.log(`bridge on http://127.0.0.1:${bridge.port}`);
  }
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
