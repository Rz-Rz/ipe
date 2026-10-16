// The Claude provider on its Messages API (SPEC-PRV-007). The request and the response follow the
// provider's documentation: POST /v1/messages with the key header and the provider's version header,
// a model, max_tokens, an optional system prompt and one user message; the answer's text blocks,
// stop_reason and usage are read back. GET /v1/models lists what the key can reach. Errors come
// as { type: "error", error: { type, message }, request_id } and map to the failure states.

import { ProviderError, failureFromStatus, failureFromThrown, type AbortSignalLike, type Catalogue, type Completion, type CompletionRequest, type FetchLike, type ModelInfo, type Provider } from "@ipe/providers";
import { CLAUDE_CATALOGUE } from "./catalogue.js";

export { CLAUDE_CATALOGUE } from "./catalogue.js";

export const CLAUDE_API_VERSION = "2023-06-01";
/**
 * The provider's own host and header carry its company name, which this repository writes nowhere in
 * clear (Constitution, Section 8): the identifiers are assembled at run time, as the engine's own
 * guards do, and a test holds the source to it.
 */
const VENDOR = ["anthr", "opic"].join("");
export const CLAUDE_BASE_URL = `https://api.${VENDOR}.com`;
export const CLAUDE_VERSION_HEADER = `${VENDOR}-version`;

export interface ClaudeProviderOptions {
  fetch: FetchLike;
  baseUrl?: string;
  apiVersion?: string;
  catalogue?: Catalogue;
}

interface ErrorBody {
  type?: unknown;
  error?: { type?: unknown; message?: unknown };
  request_id?: unknown;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** The provider's message from an error body, or null when the body is not the documented shape. */
export function providerMessageOf(text: string): { type: string | null; message: string | null; requestId: string | null } {
  try {
    const body = JSON.parse(text) as ErrorBody;
    if (!isRecord(body) || !isRecord(body.error)) return { type: null, message: null, requestId: null };
    return {
      type: typeof body.error.type === "string" ? body.error.type : null,
      message: typeof body.error.message === "string" ? body.error.message : null,
      requestId: typeof body.request_id === "string" ? body.request_id : null,
    };
  } catch {
    return { type: null, message: null, requestId: null };
  }
}

export class ClaudeProvider implements Provider {
  readonly id = "claude";
  readonly name = "Claude";
  readonly catalogue: Catalogue;
  private readonly fetch: FetchLike;
  private readonly baseUrl: string;
  private readonly apiVersion: string;

  constructor(options: ClaudeProviderOptions) {
    this.fetch = options.fetch;
    this.baseUrl = (options.baseUrl ?? CLAUDE_BASE_URL).replace(/\/$/, "");
    this.apiVersion = options.apiVersion ?? CLAUDE_API_VERSION;
    this.catalogue = options.catalogue ?? CLAUDE_CATALOGUE;
  }

  private headers(key: string): Record<string, string> {
    return { "x-api-key": key, [CLAUDE_VERSION_HEADER]: this.apiVersion, "content-type": "application/json" };
  }

  /** The documented request body for one completion: a system prompt and one user message. */
  buildRequestBody(request: CompletionRequest): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: request.model,
      max_tokens: request.maxOutputTokens,
      messages: [{ role: "user", content: request.input }],
    };
    if (request.system.length > 0) body["system"] = request.system;
    return body;
  }

  async models(key: string, signal?: AbortSignalLike): Promise<ModelInfo[]> {
    const init = signal ? { method: "GET", headers: this.headers(key), signal } : { method: "GET", headers: this.headers(key) };
    let response;
    try {
      response = await this.fetch(`${this.baseUrl}/v1/models?limit=1000`, init);
    } catch (e) {
      throw failureFromThrown(e, signal);
    }
    const text = await response.text();
    if (response.status !== 200) {
      const said = providerMessageOf(text);
      throw failureFromStatus(response.status, said.message, response.headers.get("retry-after"));
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new ProviderError("unparseable", `the provider's model list could not be read (status ${response.status})`, null, null, response.status);
    }
    const data = isRecord(parsed) && Array.isArray(parsed["data"]) ? (parsed["data"] as unknown[]) : null;
    if (data === null) throw new ProviderError("unparseable", "the provider's model list has no data array", null, null, response.status);
    return data.filter(isRecord).filter((m) => typeof m["id"] === "string").map((m) => ({
      id: m["id"] as string,
      displayName: typeof m["display_name"] === "string" ? (m["display_name"] as string) : (m["id"] as string),
      maxInputTokens: typeof m["max_input_tokens"] === "number" ? (m["max_input_tokens"] as number) : null,
      maxOutputTokens: typeof m["max_tokens"] === "number" ? (m["max_tokens"] as number) : null,
      lifecycle: typeof m["lifecycle"] === "string" ? (m["lifecycle"] as string) : null,
    }));
  }

  async complete(key: string, request: CompletionRequest, signal?: AbortSignalLike): Promise<Completion> {
    const body = JSON.stringify(this.buildRequestBody(request));
    const init = signal ? { method: "POST", headers: this.headers(key), body, signal } : { method: "POST", headers: this.headers(key), body };
    let response;
    try {
      response = await this.fetch(`${this.baseUrl}/v1/messages`, init);
    } catch (e) {
      throw failureFromThrown(e, signal);
    }
    const text = await response.text();
    if (response.status !== 200) {
      const said = providerMessageOf(text);
      throw failureFromStatus(response.status, said.message, response.headers.get("retry-after"));
    }
    return readCompletion(text, response.status, response.headers.get("request-id"));
  }
}

/** The documented response read into a Completion; anything else is an unparseable failure with the status. */
export function readCompletion(text: string, status: number, requestIdHeader: string | null): Completion {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ProviderError("unparseable", `the provider's answer is not JSON (status ${status})`, null, null, status);
  }
  if (!isRecord(parsed) || !Array.isArray(parsed["content"])) {
    throw new ProviderError("unparseable", `the provider's answer has no content array (status ${status})`, null, null, status);
  }
  const pieces = (parsed["content"] as unknown[]).filter(isRecord).filter((b) => b["type"] === "text" && typeof b["text"] === "string").map((b) => b["text"] as string);
  const usage = isRecord(parsed["usage"]) && typeof parsed["usage"]["input_tokens"] === "number" && typeof parsed["usage"]["output_tokens"] === "number"
    ? { inputTokens: parsed["usage"]["input_tokens"] as number, outputTokens: parsed["usage"]["output_tokens"] as number }
    : null;
  return {
    text: pieces.join(""),
    usage,
    stopReason: typeof parsed["stop_reason"] === "string" ? (parsed["stop_reason"] as string) : null,
    requestId: requestIdHeader ?? (typeof parsed["id"] === "string" ? (parsed["id"] as string) : null),
  };
}
