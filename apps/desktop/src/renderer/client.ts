// The interface's side of the channel. In the application, the preload exposed `window.ipe`,
// a function per call carried by Electron's message channel. In a browser, the calls go to the
// local HTTP bridge named by the page's query string or by the Vite environment. The interface
// never knows which one it talks to.

import { API_METHODS, type IpeApi } from "../api.js";

declare global {
  interface Window {
    ipe?: IpeApi;
  }
}

export class ChannelError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ChannelError";
  }
}

function httpClient(baseUrl: string): IpeApi {
  const client: Partial<Record<keyof IpeApi, (...args: unknown[]) => Promise<unknown>>> = {};
  for (const method of API_METHODS) {
    client[method] = async (...args: unknown[]) => {
      const response = await fetch(`${baseUrl}/api/${method}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ args }),
      });
      const payload = (await response.json()) as { ok: boolean; result?: unknown; error?: { code: string; message: string } };
      if (!payload.ok) throw new ChannelError(payload.error?.code ?? "error", payload.error?.message ?? "the bridge refused the call");
      return payload.result;
    };
  }
  return client as unknown as IpeApi;
}

/** The bridge address, when the page runs in a browser: `?bridge=http://127.0.0.1:4321`, else the Vite variable. */
function bridgeUrl(): string | null {
  const fromQuery = new URLSearchParams(window.location.search).get("bridge");
  if (fromQuery) return fromQuery;
  const fromEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.["VITE_BRIDGE"];
  return fromEnv ?? null;
}

export function connect(): IpeApi {
  if (window.ipe) return window.ipe;
  const url = bridgeUrl();
  if (url === null) throw new ChannelError("no_channel", "no message channel and no bridge address: open the application, or add ?bridge=<url>");
  return httpClient(url);
}
