// The preload: exposes the channel to the interface as `window.ipe`, one function per call,
// each carried by Electron's message channel. The interface never imports a Node module.

import { contextBridge, ipcRenderer } from "electron";
import { API_METHODS } from "../api.js";

const ipe: Record<string, (...args: unknown[]) => Promise<unknown>> = {};
for (const method of API_METHODS) {
  ipe[method] = async (...args: unknown[]) => {
    const payload = (await ipcRenderer.invoke("ipe", method, args)) as { ok: boolean; result?: unknown; error?: { code: string; message: string } };
    if (!payload.ok) {
      const error = new Error(payload.error?.message ?? "the call failed") as Error & { code: string };
      error.code = payload.error?.code ?? "error";
      throw error;
    }
    return payload.result;
  };
}
contextBridge.exposeInMainWorld("ipe", ipe);
contextBridge.exposeInMainWorld("ipeShell", {
  chooseFolder: () => ipcRenderer.invoke("ipe:chooseFolder") as Promise<string | null>,
  /** The project folder the application was started on (IPE_OPEN_PROJECT), or null. */
  initialProject: () => ipcRenderer.invoke("ipe:initialProject") as Promise<string | null>,
});
