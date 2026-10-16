// SPEC-PRV-002, 003, 004, 005, 006 and SPEC-AST-001 through the ask action on an in-memory project
// and the fake provider: what leaves, what is recorded, what the author gets, and what a failure
// leaves behind.
import { describe, expect, it } from "vitest";
import { Kernel, memoryAdapters, type IpeObject } from "@ipe/kernel";
import { FakeProvider, ProviderError, type FailureState, type Sleep } from "@ipe/providers";
import { ActionError, ask, previewAsk, type CallRecordBody, type Connection } from "../src/index.js";

const sleep: Sleep = (ms, signal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new ProviderError("cancelled", "cancelled"));
    }
    signal?.addEventListener("abort", onAbort);
  });

async function project() {
  const kernel = await Kernel.create(memoryAdapters(), "Asked");
  const one = await kernel.addUnit("Chapter 1");
  const two = await kernel.addUnit("Chapter 2");
  await kernel.writeUnit(one.id, "The harbour was quiet. Mara counted the boats twice.");
  await kernel.writeUnit(two.id, "Nobody answered the bell that night. ZEBRA-ONLY-IN-TWO.");
  const fake = new FakeProvider(sleep);
  const connection: Connection = { provider: fake, key: "good-key", model: "fake-priced" };
  return { kernel, one, two, fake, connection };
}

const body = (o: IpeObject) => o.body as CallRecordBody;

/** The failure an ask rejects with, carrying its record; anything else fails the test. */
async function failing(pending: Promise<unknown>): Promise<ProviderError & { record: IpeObject }> {
  try {
    await pending;
  } catch (e) {
    if (e instanceof ProviderError && "record" in e) return e as ProviderError & { record: IpeObject };
    throw e;
  }
  throw new Error("the ask was expected to fail");
}
const snapshot = (kernel: Kernel) => ({ texts: kernel.units().map((u) => kernel.readUnit(u.id)), objects: kernel.listObjects().map((o) => o.id) });

describe("SPEC-PRV-003 Explicit sending within the chosen scope", () => {
  it("TST-PRV-003a: the request a fake provider captures holds every item of the scope and nothing outside it, for a passage, a unit and the whole project", async () => {
    const { kernel, one, fake, connection } = await project();
    await ask(kernel, { kind: "passage", unit: one.id, start: 23, end: 52 }, "Who counted?", { connection, instructions: "Prefer short answers." });
    const passage = fake.captured[0]?.request;
    expect(passage?.input).toContain("Mara counted the boats twice.");
    expect(passage?.input).not.toContain("The harbour was quiet.");
    expect(passage?.input).not.toContain("ZEBRA-ONLY-IN-TWO");
    expect(passage?.input).toContain("Question: Who counted?");
    expect(passage?.system).toContain("Prefer short answers.");
    expect(passage?.model).toBe("fake-priced");
    await ask(kernel, { kind: "unit", unit: one.id }, "Summarise.", { connection });
    const unit = fake.captured[1]?.request;
    expect(unit?.input).toContain("The harbour was quiet. Mara counted the boats twice.");
    expect(unit?.input).not.toContain("ZEBRA-ONLY-IN-TWO");
    await ask(kernel, { kind: "project" }, "Summarise everything.", { connection });
    const whole = fake.captured[2]?.request;
    expect(whole?.input).toContain("The harbour was quiet.");
    expect(whole?.input).toContain("ZEBRA-ONLY-IN-TWO");
    // What the preview announced is what was sent, to the character.
    const preview = previewAsk(kernel, { kind: "project" }, "Summarise everything.");
    expect(preview.total).toBe((whole?.system.length ?? 0) + (whole?.input.length ?? 0));
    // Nothing of the project leaves outside an action: the fake saw three requests for three asks.
    expect(fake.captured.length).toBe(3);
  });
});

describe("SPEC-PRV-002 Capability and cost disclosure", () => {
  it("TST-PRV-002b: after a call, the usage recorded equals the usage the provider reported; the estimate is marked as an estimate; a provider reporting no usage yields not reported", async () => {
    const { kernel, one, fake, connection } = await project();
    fake.usage = () => ({ inputTokens: 123, outputTokens: 45 });
    const priced = await ask(kernel, { kind: "unit", unit: one.id }, "How many boats?", { connection });
    expect(body(priced.record).usage).toEqual({ inputTokens: 123, outputTokens: 45 });
    expect(body(priced.record).cost).toMatchObject({ kind: "estimate", usd: (123 * 1 + 45 * 2) / 1_000_000, catalogueDate: fake.catalogue.consultedOn });
    expect(priced.cost?.kind).toBe("estimate");
    const unpriced = await ask(kernel, { kind: "unit", unit: one.id }, "How many boats?", { connection: { ...connection, model: "fake-unpriced" } });
    expect(body(unpriced.record).cost).toEqual({ kind: "price_not_known", catalogueDate: fake.catalogue.consultedOn });
    fake.usage = null;
    const silent = await ask(kernel, { kind: "unit", unit: one.id }, "How many boats?", { connection });
    expect(body(silent.record).usage).toBeNull();
    expect(body(silent.record).cost).toEqual({ kind: "not_reported" });
  });
});

describe("SPEC-PRV-004 Provider change without loss and without silent switching", () => {
  it("TST-PRV-004b: an action with no provider chosen is refused with code no_provider and the gesture named; nothing is sent", async () => {
    const { kernel, one, fake } = await project();
    const before = snapshot(kernel);
    await expect(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection: null })).rejects.toMatchObject({ code: "no_provider" });
    try {
      await ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection: null });
    } catch (e) {
      expect(e).toBeInstanceOf(ActionError);
      expect((e as ActionError).message).toContain("connect a provider");
    }
    await expect(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection: { provider: fake, key: "k", model: "" } })).rejects.toMatchObject({ code: "no_model" });
    expect(fake.captured).toEqual([]);
    expect(snapshot(kernel)).toEqual(before);
  });
});

describe("SPEC-PRV-005 Call record with provenance", () => {
  it("TST-PRV-005a: a completed call leaves a record; the derived object depends on it; the provenance chain names the record, the model and the version sent", async () => {
    const { kernel, one, connection } = await project();
    const versionBefore = kernel.currentVersion()?.id ?? null;
    const result = await ask(kernel, { kind: "unit", unit: one.id }, "Who counted the boats?", { connection, now: () => "2026-10-16T10:00:00.000Z" });
    const record = kernel.getObject(result.record.id);
    expect(record.kind).toBe("call");
    expect(record.provenance.approval).toBe("accepted");
    const b = body(record);
    expect(b).toMatchObject({ provider: "fake", model: "fake-priced", outcome: "completed", version: versionBefore, question: "Who counted the boats?", startedAt: "2026-10-16T10:00:00.000Z", finishedAt: "2026-10-16T10:00:00.000Z", requestId: "fake-1" });
    expect(b.sent.items.map((i) => i.kind)).toEqual(["instructions", "unit", "question"]);
    expect(JSON.stringify(b)).not.toContain("The harbour was quiet.");
    expect(result.answer?.dependsOn).toEqual([record.id]);
    const chain = kernel.explain(result.answer?.id ?? "");
    expect(chain.dependencies.map((d) => d.id)).toEqual([record.id]);
    expect(chain.version?.id).toBe(result.answer?.version);
    expect(chain.versionFound).toBe(true);
    expect(kernel.explain(record.id).dependents).toEqual([result.answer?.id]);
  });

  it("TST-PRV-005b: a failed call leaves a record with outcome failed and the reason, and no derived object", async () => {
    const { kernel, one, fake, connection } = await project();
    fake.failWith = { state: "auth_refused", message: "invalid x-api-key" };
    await expect(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection })).rejects.toMatchObject({ state: "auth_refused" });
    const objects = kernel.listObjects();
    expect(objects.map((o) => o.kind)).toEqual(["call"]);
    const b = body(objects[0] as IpeObject);
    expect(b.outcome).toBe("failed");
    expect(b.failure).toMatchObject({ state: "auth_refused", providerMessage: "invalid x-api-key" });
    expect(b.failure?.message).toContain("authentication refused");
    expect(b.finishedAt).not.toBeNull();
  });
});

describe("SPEC-PRV-006 Failure states of a call", () => {
  it("TST-PRV-006a: authentication refused, rate limited, timed out, overloaded and no network each yield their state and reason; the project is unchanged", async () => {
    const { kernel, one, fake, connection } = await project();
    const textsBefore = kernel.units().map((u) => kernel.readUnit(u.id));
    const cases: Array<{ state: FailureState; message: string; retryAfterSeconds?: number }> = [
      { state: "auth_refused", message: "key revoked" },
      { state: "rate_limited", message: "slow down", retryAfterSeconds: 7 },
      { state: "timed_out", message: "no answer in time" },
      { state: "overloaded", message: "try later" },
      { state: "no_network", message: "ENOTFOUND" },
    ];
    for (const c of cases) {
      fake.failWith = { state: c.state, message: c.message, ...(c.retryAfterSeconds !== undefined ? { retryAfterSeconds: c.retryAfterSeconds } : {}) };
      const error = await failing(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection }));
      expect(error.state).toBe(c.state);
      expect(error.message).toContain(c.message);
      const b = body(kernel.getObject(error.record.id));
      expect(b.outcome).toBe("failed");
      expect(b.failure?.state).toBe(c.state);
      expect(b.failure?.retryAfterSeconds).toBe(c.retryAfterSeconds ?? null);
    }
    expect(kernel.units().map((u) => kernel.readUnit(u.id))).toEqual(textsBefore);
    expect(kernel.listObjects().every((o) => o.kind === "call")).toBe(true);
    expect(kernel.listObjects().length).toBe(cases.length);
    // Retry is a new call: once the provider answers, the same question lands.
    fake.failWith = null;
    const retried = await ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection });
    expect(retried.answer).not.toBeNull();
  });

  it("TST-PRV-006b: a call cancelled by the author leaves a record with outcome cancelled and no derived object, before and after the provider answered", async () => {
    const { kernel, one, fake, connection } = await project();
    fake.delayMs = 200;
    const before = new AbortController();
    const pending = ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection, signal: before.signal });
    setTimeout(() => before.abort(), 20);
    const cancelled = await failing(pending);
    expect(cancelled.state).toBe("cancelled");
    expect(body(kernel.getObject(cancelled.record.id)).outcome).toBe("cancelled");
    expect(kernel.listObjects().map((o) => o.kind)).toEqual(["call"]);
    // After the answer: the provider answered, the author had already cancelled, nothing of the answer is kept.
    fake.delayMs = 0;
    const after = new AbortController();
    fake.answer = () => {
      after.abort();
      return "an answer nobody wants any more";
    };
    const late = await failing(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection, signal: after.signal }));
    expect(late.state).toBe("cancelled");
    expect(body(kernel.getObject(late.record.id)).outcome).toBe("cancelled");
    expect(kernel.listObjects().filter((o) => o.kind === "answer")).toEqual([]);
    expect(JSON.stringify(kernel.listObjects())).not.toContain("nobody wants");
    // While the record is being completed: the clock is read when the record is finished, so a
    // cancellation that lands at the second reading lands during that write; nothing of the answer is kept.
    const during = new AbortController();
    fake.answer = () => "an answer that arrives as the record closes";
    let readings = 0;
    const now = () => {
      readings += 1;
      if (readings === 2) during.abort();
      return new Date().toISOString();
    };
    const mid = await failing(ask(kernel, { kind: "unit", unit: one.id }, "Who?", { connection, signal: during.signal, now }));
    expect(mid.state).toBe("cancelled");
    const midBody = body(kernel.getObject(mid.record.id));
    expect(midBody.outcome).toBe("cancelled");
    expect(midBody.failure?.state).toBe("cancelled");
    expect(midBody.usage).not.toBeNull();
    expect(kernel.listObjects().filter((o) => o.kind === "answer")).toEqual([]);
    expect(JSON.stringify(kernel.listObjects())).not.toContain("record closes");
  });
});

describe("SPEC-AST-001 Ask about a chosen scope", () => {
  it("TST-AST-001b: the answer object is proposed, of origin assistant, anchored to the scope's passages, depends on the call record, and the manuscript is unchanged", async () => {
    const { kernel, one, two, fake, connection } = await project();
    fake.answer = () => "Mara counted them, twice.";
    const textsBefore = kernel.units().map((u) => kernel.readUnit(u.id));
    const passage = await ask(kernel, { kind: "passage", unit: one.id, start: 23, end: 52 }, "Who counted?", { connection });
    const answer = kernel.getObject(passage.answer?.id ?? "");
    expect(answer.kind).toBe("answer");
    expect(answer.provenance.origin).toBe("assistant");
    expect(answer.provenance.approval).toBe("proposed");
    expect(answer.provenance.action).toBe("ask");
    expect(answer.anchors.map((a) => [a.unit, a.start, a.end, a.state])).toEqual([[one.id, 23, 52, "intact"]]);
    expect(answer.anchors[0]?.text).toBe("Mara counted the boats twice.");
    expect(answer.dependsOn).toEqual([passage.record.id]);
    expect((answer.body as { text: string }).text).toBe("Mara counted them, twice.");
    const unit = await ask(kernel, { kind: "unit", unit: one.id }, "Summarise.", { connection });
    expect(kernel.getObject(unit.answer?.id ?? "").anchors.map((a) => [a.unit, a.start, a.end])).toEqual([[one.id, 0, kernel.readUnit(one.id).length]]);
    const whole = await ask(kernel, { kind: "project" }, "Summarise everything.", { connection });
    expect(kernel.getObject(whole.answer?.id ?? "").anchors.map((a) => a.unit)).toEqual([one.id, two.id]);
    expect(kernel.units().map((u) => kernel.readUnit(u.id))).toEqual(textsBefore);
    // The author decides: accepted, the answer stays; the manuscript still untouched.
    await kernel.accept(answer.id, "author");
    expect(kernel.getObject(answer.id).provenance.approval).toBe("accepted");
    // An empty answer is an answer with an empty body, recorded.
    fake.answer = () => "";
    const empty = await ask(kernel, { kind: "unit", unit: one.id }, "Anything?", { connection });
    expect((kernel.getObject(empty.answer?.id ?? "").body as { text: string }).text).toBe("");
  });
});
