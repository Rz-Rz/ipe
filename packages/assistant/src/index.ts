// The ask action (SPEC-AST-001) on the provider layer (SPEC-PRV-003 to 006). One call, one
// record: the record is created before the request leaves and finished whatever happens; the
// answer, when there is one, is a proposed object anchored to the scope that depends on the record.

import type { AnchorInput, IpeObject, Kernel } from "@ipe/kernel";
import {
  ProviderError, assembleContext, estimateCost, previewOf,
  type AbortSignalLike, type AssembledContext, type CostEstimate, type FailureState, type Preview, type Provider, type Scope, type Usage,
} from "@ipe/providers";

export type { Preview, Scope } from "@ipe/providers";

/** A provider the author connected, with the key and the model chosen for the action. */
export interface Connection {
  provider: Provider;
  key: string;
  model: string;
}

export interface AskOptions {
  connection: Connection | null;
  instructions?: string | null;
  maxOutputTokens?: number;
  signal?: AbortSignalLike;
  /** The clock of the record; the platform's time by default. */
  now?: () => string;
}

export type Outcome = "running" | "completed" | "failed" | "cancelled";

/** The body of a call record (object kind `call`): identifiers and the version, never the text sent. */
export interface CallRecordBody {
  provider: string;
  model: string;
  scope: Scope;
  /** The manuscript version the material was read at, or null for a project without a version yet. */
  version: string | null;
  question: string;
  sent: Preview;
  instructionsCharacters: number;
  startedAt: string;
  finishedAt: string | null;
  outcome: Outcome;
  usage: Usage | null;
  cost: CostEstimate | null;
  failure: { state: FailureState; message: string; providerMessage: string | null; retryAfterSeconds: number | null } | null;
  requestId: string | null;
}

export interface AnswerBody {
  question: string;
  text: string;
  provider: string;
  model: string;
  usage: Usage | null;
  cost: CostEstimate;
  stopReason: string | null;
}

export interface AskResult {
  record: IpeObject;
  /** The proposed answer, or null when the call failed or was cancelled. */
  answer: IpeObject | null;
  failure: { state: FailureState; message: string; retryAfterSeconds: number | null } | null;
  cost: CostEstimate | null;
}

export class ActionError extends Error {
  constructor(
    readonly code: "no_provider" | "no_model" | "empty_question",
    message: string,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

export const CALL_KIND = "call";
export const ANSWER_KIND = "answer";
const AUTHOR = "author";
const ASSISTANT = "assistant";

/** What an ask will send, before any call: the preview of the assembled scope. */
export function previewAsk(kernel: Kernel, scope: Scope, question: string, instructions: string | null = null): Preview {
  return previewOf(assembleContext(kernel, scope, { instructions, question }));
}

/** The anchors of an answer: the scope's passages, whole units for a unit or project scope. */
export function anchorsForScope(kernel: Kernel, scope: Scope): AnchorInput[] {
  if (scope.kind === "passage") return [{ unit: scope.unit, start: scope.start, end: scope.end }];
  const ids = scope.kind === "unit" ? [scope.unit] : flattenIds(kernel);
  return ids.map((unit) => ({ unit, start: 0, end: kernel.readUnit(unit).length })).filter((a) => a.end > 0);
}

function flattenIds(kernel: Kernel): string[] {
  const out: string[] = [];
  const walk = (nodes: ReturnType<Kernel["units"]>) => {
    for (const n of nodes) {
      out.push(n.id);
      walk(n.children);
    }
  };
  walk(kernel.units());
  return out;
}

/**
 * Asks the connection a question about a scope. Refuses, before anything leaves, an action with
 * no connection (code no_provider) or an empty question. Rejects with the ProviderError of a failed
 * or cancelled call once the record carries it; the project then holds the record and nothing else.
 */
export async function ask(kernel: Kernel, scope: Scope, question: string, options: AskOptions): Promise<AskResult> {
  if (options.connection === null) throw new ActionError("no_provider", "no connection chosen for this action: connect a provider and choose it, then ask again");
  if (options.connection.model.trim() === "") throw new ActionError("no_model", "no model chosen for this action: choose one of the connection's models");
  if (question.trim() === "") throw new ActionError("empty_question", "the question is empty");
  const { provider, key, model } = options.connection;
  const now = options.now ?? (() => new Date().toISOString());
  const context: AssembledContext = assembleContext(kernel, scope, { instructions: options.instructions ?? null, question });
  const sent = previewOf(context);

  const body: CallRecordBody = {
    provider: provider.id,
    model,
    scope,
    version: kernel.currentVersion()?.id ?? null,
    question,
    sent,
    instructionsCharacters: (options.instructions ?? "").length,
    startedAt: now(),
    finishedAt: null,
    outcome: "running",
    usage: null,
    cost: null,
    failure: null,
    requestId: null,
  };
  // The record is the author's act: it enters accepted, as a record and not a proposal.
  const record = await kernel.createObject({ kind: CALL_KIND, title: `Call to ${provider.name} (${model}): ${shorten(question)}`, body, origin: AUTHOR, action: "call" }, AUTHOR);

  const finish = async (patch: Partial<CallRecordBody>): Promise<IpeObject> =>
    kernel.editObject(record.id, { body: { ...body, ...patch, finishedAt: now() } }, AUTHOR);

  let completion;
  try {
    completion = await provider.complete(key, { model, system: context.system, input: context.input, maxOutputTokens: options.maxOutputTokens ?? 2048 }, options.signal);
    if (options.signal?.aborted) throw new ProviderError("cancelled", "cancelled by the author after the provider answered");
  } catch (e) {
    const failure = e instanceof ProviderError ? e : new ProviderError("provider_error", e instanceof Error ? e.message : String(e));
    const finished = await finish({
      outcome: failure.state === "cancelled" ? "cancelled" : "failed",
      failure: { state: failure.state, message: failure.message, providerMessage: failure.providerMessage, retryAfterSeconds: failure.retryAfterSeconds },
    });
    throw Object.assign(failure, { record: finished });
  }

  const cost = estimateCost(provider.catalogue, model, completion.usage);
  const finished = await finish({ outcome: "completed", usage: completion.usage, cost, requestId: completion.requestId });
  const answerBody: AnswerBody = { question, text: completion.text, provider: provider.id, model, usage: completion.usage, cost, stopReason: completion.stopReason };
  const answer = await kernel.createObject(
    { kind: ANSWER_KIND, title: `Answer: ${shorten(question)}`, body: answerBody, anchors: anchorsForScope(kernel, scope), dependsOn: [record.id], origin: ASSISTANT, action: "ask" },
    ASSISTANT,
  );
  return { record: finished, answer, failure: null, cost };
}

function shorten(text: string, max = 60): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}
