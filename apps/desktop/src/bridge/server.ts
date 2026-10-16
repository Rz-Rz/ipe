// A local HTTP bridge that carries the channel for a browser: the Playwright tests drive the
// interface served by Vite against it, and the later browser surface starts from it. One
// endpoint per call: POST /api/<method> with a JSON body { "args": [...] }.

import * as http from "node:http";
import { KernelError } from "@ipe/kernel";
import { API_METHODS, type IpeApi } from "../api.js";

export interface Bridge {
  port: number;
  close(): Promise<void>;
}

function readBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on("data", (c: Buffer) => chunks.push(c));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

export function startBridge(api: IpeApi, port = 0, host = "127.0.0.1"): Promise<Bridge> {
  const server = http.createServer(async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "content-type");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true }));
      return;
    }
    const match = /^\/api\/([a-zA-Z]+)$/.exec(request.url ?? "");
    const method = match?.[1] as keyof IpeApi | undefined;
    if (request.method !== "POST" || method === undefined || !API_METHODS.includes(method)) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: false, error: { code: "not_found", message: `no call ${request.url ?? ""}` } }));
      return;
    }
    try {
      const body = await readBody(request);
      const args = body.trim() === "" ? [] : ((JSON.parse(body) as { args?: unknown[] }).args ?? []);
      const fn = api[method] as (...a: unknown[]) => Promise<unknown>;
      const result = await fn.apply(api, args);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true, result: result ?? null }));
    } catch (e) {
      const code = e instanceof KernelError ? e.code : ((e as { code?: string }).code ?? "error");
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: false, error: { code, message: String((e as Error).message ?? e) } }));
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      const address = server.address();
      const bound = typeof address === "object" && address !== null ? address.port : port;
      resolve({
        port: bound,
        close: () => new Promise<void>((done) => server.close(() => done())),
      });
    });
  });
}
