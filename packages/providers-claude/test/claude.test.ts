// SPEC-PRV-007: the Claude provider on its Messages API, against the exchanges the API documents
// (fixtures under test/fixtures, recorded from the provider's pages consulted on 2026-10-16), and
// one live call when a key is in the environment.
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { ProviderError, type FetchInit, type FetchLike } from "@ipe/providers";
import { CLAUDE_API_VERSION, ClaudeProvider, readCompletion } from "../src/index.js";

const fixture = (name: string) => fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");

function fakeFetch(answer: (url: string, init: FetchInit) => { status: number; body: string; headers?: Record<string, string> }) {
  const calls: Array<{ url: string; init: FetchInit }> = [];
  const fetch: FetchLike = async (url, init) => {
    calls.push({ url, init });
    const r = answer(url, init);
    const headers = r.headers ?? {};
    return { status: r.status, headers: { get: (n: string) => headers[n.toLowerCase()] ?? null }, text: async () => r.body };
  };
  return { fetch, calls };
}

describe("SPEC-PRV-007 The Claude provider on its Messages API", () => {
  it("TST-PRV-007a: against the documented exchanges, the adapter builds the documented request and reads the answer, the usage and each error type", async () => {
    const { fetch, calls } = fakeFetch((url) => (url.endsWith("/v1/messages") ? { status: 200, body: fixture("messages-response.json"), headers: { "request-id": "req_011CSHoEeqs5C35K2UUqR7Fy" } } : { status: 200, body: fixture("models-response.json") }));
    const provider = new ClaudeProvider({ fetch, baseUrl: "https://api.example.test/" });
    const completion = await provider.complete("sk-test-key", { model: "claude-opus-5-5", system: "You are a helpful assistant.", input: "Hello, Claude", maxOutputTokens: 1024 });
    expect(completion).toEqual({ text: "Hello! I'm Claude, an AI assistant made by Anthropic.", usage: { inputTokens: 10, outputTokens: 50 }, stopReason: "end_turn", requestId: "req_011CSHoEeqs5C35K2UUqR7Fy" });
    const sent = calls[0];
    expect(sent?.url).toBe("https://api.example.test/v1/messages");
    expect(sent?.init.method).toBe("POST");
    expect(sent?.init.headers["x-api-key"]).toBe("sk-test-key");
    expect(sent?.init.headers["anthropic-version"]).toBe(CLAUDE_API_VERSION);
    expect(sent?.init.headers["content-type"]).toBe("application/json");
    expect(JSON.parse(sent?.init.body ?? "{}")).toEqual({ model: "claude-opus-5-5", max_tokens: 1024, system: "You are a helpful assistant.", messages: [{ role: "user", content: "Hello, Claude" }] });

    const models = await provider.models("sk-test-key");
    expect(calls[1]?.url).toBe("https://api.example.test/v1/models?limit=1000");
    expect(calls[1]?.init.headers["x-api-key"]).toBe("sk-test-key");
    expect(models).toEqual([
      { id: "claude-opus-5-5", displayName: "Claude Opus 5.5", maxInputTokens: 1_000_000, maxOutputTokens: 128_000, lifecycle: "active" },
      { id: "claude-haiku-5-5", displayName: "Claude Haiku 5.5", maxInputTokens: 1_000_000, maxOutputTokens: 128_000, lifecycle: "active" },
    ]);

    const errors = JSON.parse(fixture("errors.json")) as { documented: Array<{ status: number; type: string; message: string; state: string }> };
    for (const e of errors.documented) {
      const body = JSON.stringify({ type: "error", error: { type: e.type, message: e.message }, request_id: "req_x" });
      const failing = new ClaudeProvider({ fetch: fakeFetch(() => ({ status: e.status, body, headers: e.status === 429 ? { "retry-after": "30" } : {} })).fetch });
      try {
        await failing.complete("k", { model: "m", system: "", input: "x", maxOutputTokens: 10 });
        expect.unreachable(`status ${e.status} must fail`);
      } catch (err) {
        expect(err).toBeInstanceOf(ProviderError);
        const pe = err as ProviderError;
        expect(pe.state, `status ${e.status} ${e.type}`).toBe(e.state);
        expect(pe.providerMessage).toBe(e.message);
        expect(pe.status).toBe(e.status);
        if (e.status === 429) expect(pe.retryAfterSeconds).toBe(30);
      }
    }

    const noNetwork = new ClaudeProvider({ fetch: async () => { throw new TypeError("fetch failed"); } });
    await expect(noNetwork.complete("k", { model: "m", system: "", input: "x", maxOutputTokens: 10 })).rejects.toMatchObject({ state: "no_network" });
    await expect(noNetwork.models("k")).rejects.toMatchObject({ state: "no_network" });
    const garbage = new ClaudeProvider({ fetch: fakeFetch(() => ({ status: 200, body: "<html>not json</html>" })).fetch });
    await expect(garbage.complete("k", { model: "m", system: "", input: "x", maxOutputTokens: 10 })).rejects.toMatchObject({ state: "unparseable", status: 200 });
    expect(readCompletion(JSON.stringify({ id: "msg_1", content: [{ type: "text", text: "a" }, { type: "tool_use" }, { type: "text", text: "b" }], stop_reason: "max_tokens" }), 200, null)).toEqual({ text: "ab", usage: null, stopReason: "max_tokens", requestId: "msg_1" });
    const withoutSystem = new ClaudeProvider({ fetch });
    expect(withoutSystem.buildRequestBody({ model: "m", system: "", input: "x", maxOutputTokens: 5 })).toEqual({ model: "m", max_tokens: 5, messages: [{ role: "user", content: "x" }] });
  });

  const liveKey = process.env["IPE_CLAUDE_API_KEY"];
  it.skipIf(!liveKey)("TST-PRV-007b: with a key in the environment, one live call returns a text answer and a usage", async () => {
    const fetchLike: FetchLike = (url, init) => fetch(url, init.body === undefined ? { method: init.method, headers: init.headers } : { method: init.method, headers: init.headers, body: init.body });
    const provider = new ClaudeProvider({ fetch: fetchLike });
    const models = await provider.models(liveKey ?? "");
    expect(models.length).toBeGreaterThan(0);
    const model = models.find((m) => m.id === "claude-haiku-5-5")?.id ?? models[models.length - 1]?.id ?? "";
    const completion = await provider.complete(liveKey ?? "", { model, system: "Answer with one word.", input: "Say the word harbour.", maxOutputTokens: 20 });
    expect(completion.text.length).toBeGreaterThan(0);
    expect(completion.usage?.inputTokens).toBeGreaterThan(0);
    expect(completion.usage?.outputTokens).toBeGreaterThan(0);
  });
});
