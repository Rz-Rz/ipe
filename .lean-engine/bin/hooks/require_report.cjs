"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// hooks/require_report.ts
var fs = __toESM(require("node:fs"), 1);
var path = __toESM(require("node:path"), 1);
function trouverLease(depart) {
  let p;
  try {
    p = path.resolve(depart);
  } catch {
    return null;
  }
  for (; ; ) {
    const f = path.join(p, ".eng", "LEASE.json");
    if (fs.existsSync(f)) {
      try {
        return { racine: p, lease: JSON.parse(fs.readFileSync(f, "utf-8")) };
      } catch {
        return { racine: p, lease: {} };
      }
    }
    const parent = path.dirname(p);
    if (parent === p) return null;
    p = parent;
  }
}
function verificationEngagee(runsRecord, eng) {
  const f = path.join(path.dirname(runsRecord), "mandats", `${eng}.json`);
  if (!fs.existsSync(f)) return false;
  try {
    const m = JSON.parse(fs.readFileSync(f, "utf-8"));
    return m.statut === "ouvert" || m.statut === "rendu" && m.verdict === "approve";
  } catch {
    return true;
  }
}
function principal() {
  let charge = {};
  try {
    charge = JSON.parse(fs.readFileSync(0, "utf-8"));
  } catch {
  }
  if (charge.stop_hook_active) process.exit(0);
  const trouve = trouverLease(String(charge.cwd ?? process.cwd()));
  if (!trouve) process.exit(0);
  const { racine, lease } = trouve;
  const eng = String(lease.eng ?? "?");
  if (lease.runs_record) {
    try {
      const rec = JSON.parse(fs.readFileSync(lease.runs_record, "utf-8"));
      if (rec.state === "revoked" || rec.state === "released" || rec.token !== lease.token) process.exit(0);
    } catch {
    }
  }
  for (const nom of ["REPORT.md", "BLOCKED.md"]) {
    const f = path.join(racine, nom);
    if (!fs.existsSync(f)) continue;
    const texte = fs.readFileSync(f, "utf-8");
    if (texte.includes(eng) && texte.trim().length >= 200) {
      if (nom === "REPORT.md" && lease.runs_record && !verificationEngagee(lease.runs_record, eng)) {
        process.stderr.write(
          `[require-report] ${eng} has a report and no verification under way. Do not end the session here. If the delivery is not pushed yet, push it: eng push --livraison. Then launch the \`verifier\` subagent (Agent tool, subagent_type \`verifier\`) on ${eng}: it starts from a clean context, so it did not implement, and it carries out /verify ${eng} itself (lean mandat ${eng}, the comparison, lean verdict ${eng}). An approving verdict merges, marks the commitment held, pushes master and removes this worktree. When the report declares FAIL and the cause is not yours to settle, declare the blocker instead: eng push --blocage "finding".
`
        );
        process.exit(2);
      }
      process.exit(0);
    }
    process.stderr.write(
      `[require-report] ${nom} existe mais est incomplet : il doit citer ${eng}, la definition_of_done, et faire au moins 200 caract\xE8res.
`
    );
    process.exit(2);
  }
  process.stderr.write(
    `[require-report] Session ${eng} sans REPORT.md ni BLOCKED.md. R\xE9dige REPORT.md (statut vis-\xE0-vis de la definition_of_done, tests ex\xE9cut\xE9s, raison de variance propos\xE9e si le travail est compromis) ou BLOCKED.md, puis pousse la livraison : eng push --livraison. A BLOCKED.md on a choice of substance is the text of the arbitration request that the delivery files: it holds \`## Context\`, \`## What is at stake\`, \`## Closed question\`, \`## Options and consequences\`, \`## Recommendation\` and \`## Fallback\`, and the delivery is refused without them. Then run \`eng attendre\` in the background: the decision wakes you. REPORT.md opens with \`## Result\`, whose first line is PASS or FAIL against the definition_of_done. Close alone every open point you can close inside your scope; draft the others in full under \`## Open points that need someone else\` (a DA with its options and your recommendation, an ENG, or an SCP); put what is only for information under \`## For information, no action required\`. Ensuite seulement, termine.
`
  );
  process.exit(2);
}
principal();
