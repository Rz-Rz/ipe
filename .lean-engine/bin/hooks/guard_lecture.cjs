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

// hooks/guard_lecture.ts
var fs2 = __toESM(require("node:fs"), 1);
var path3 = __toESM(require("node:path"), 1);

// noyau/src/chemins.ts
var fs = __toESM(require("node:fs"), 1);
var path = __toESM(require("node:path"), 1);
var DOSSIER_LEAN_ENGINE = ".lean-engine";
var DOSSIER_LEGACY_AGELAIOS = ".agelaios";
var FAMILLES_CIBLE = {
  engagements: "ENG",
  arbitrages: "DA",
  deltas: "SCP",
  decisions: "ADR"
};
var DOSSIER_ORCHESTRATION = "orchestration";
function resoudreEtat(racine) {
  const abs = path.resolve(racine);
  const familles = (base) => ({
    engagements: path.join(base, FAMILLES_CIBLE.engagements),
    arbitrages: path.join(base, FAMILLES_CIBLE.arbitrages),
    deltas: path.join(base, FAMILLES_CIBLE.deltas),
    decisions: path.join(base, FAMILLES_CIBLE.decisions)
  });
  const cible = path.join(abs, DOSSIER_LEAN_ENGINE, DOSSIER_ORCHESTRATION);
  if (fs.existsSync(path.join(cible, FAMILLES_CIBLE.engagements))) {
    return { disposition: "lean-engine", etat: cible, ...familles(cible) };
  }
  const plat = path.join(abs, DOSSIER_LEAN_ENGINE);
  if (fs.existsSync(path.join(plat, FAMILLES_CIBLE.engagements))) {
    return { disposition: "lean-engine-plat", etat: plat, ...familles(plat) };
  }
  const ancienneCible = path.join(abs, DOSSIER_LEGACY_AGELAIOS, DOSSIER_ORCHESTRATION);
  if (fs.existsSync(path.join(ancienneCible, FAMILLES_CIBLE.engagements))) {
    return { disposition: "agelaios", etat: ancienneCible, ...familles(ancienneCible) };
  }
  const ancienPlat = path.join(abs, DOSSIER_LEGACY_AGELAIOS);
  if (fs.existsSync(path.join(ancienPlat, FAMILLES_CIBLE.engagements))) {
    return { disposition: "agelaios-plat", etat: ancienPlat, ...familles(ancienPlat) };
  }
  const lean = path.join(abs, ".agenticLEAN");
  if (fs.existsSync(lean)) {
    return {
      disposition: "agenticlean",
      etat: lean,
      engagements: path.join(lean, "engagements"),
      arbitrages: path.join(lean, "arbitrages"),
      deltas: path.join(lean, "deltas"),
      decisions: path.join(lean, "decisions")
    };
  }
  const legacy = path.join(abs, "agentic_orchestrator", "management");
  if (fs.existsSync(legacy)) {
    return {
      disposition: "legacy",
      etat: legacy,
      engagements: path.join(legacy, "engagements"),
      arbitrages: path.join(legacy, "arbitrages"),
      deltas: path.join(legacy, "deltas"),
      decisions: path.join(abs, "agentic_orchestrator", "decisions")
    };
  }
  return null;
}
function resoudreContexte(racine) {
  const abs = path.resolve(racine);
  const e = resoudreEtat(abs);
  if (!e) {
    throw new Error(
      `aucune racine d'etat sous ${abs} : ni .lean-engine/orchestration/, ni .agelaios/orchestration/, ni .agenticLEAN/, ni agentic_orchestrator/management/`
    );
  }
  const { disposition, etat } = e;
  const gouvernance = path.join(abs, "agentic_orchestrator");
  const runs = path.join(etat, "runs");
  return {
    racine: abs,
    disposition,
    etat,
    engagements: e.engagements,
    arbitrages: e.arbitrages,
    deltas: e.deltas,
    decisions: e.decisions,
    captures: path.join(etat, "captures"),
    livraisons: path.join(etat, "livraisons"),
    runs,
    journal: path.join(etat, "journal"),
    claims: path.join(etat, "claims.yaml"),
    agents: path.join(etat, "agents.yaml"),
    milestones: path.join(etat, "MILESTONES.md"),
    dashboard: path.join(etat, "DASHBOARD.md"),
    config: path.join(etat, "config.yaml"),
    streams: path.join(etat, "streams.yaml"),
    portFile: path.join(runs, "obeya.port"),
    verrou: path.join(runs, "verrou-mutation.lock"),
    gouvernance,
    constitution: path.join(gouvernance, "CONSTITUTION.md"),
    ihm: path.join(gouvernance, "ihm", "index.html"),
    recette: path.join(abs, "dossier-recette"),
    codification: path.join(abs, "dossier-recette", "02_CODIFICATION.md"),
    wt: path.join(path.dirname(abs), "wt")
  };
}
function trouverRacine(depart) {
  let p = path.resolve(depart);
  for (; ; ) {
    if (resoudreEtat(p)) return p;
    const parent = path.dirname(p);
    if (parent === p) return null;
    p = parent;
  }
}

// noyau/src/gardeLecture.ts
var path2 = __toESM(require("node:path"), 1);
var LECTEURS = /* @__PURE__ */ new Set([
  "cat",
  "head",
  "tail",
  "less",
  "more",
  "sed",
  "awk",
  "gawk",
  "grep",
  "egrep",
  "fgrep",
  "rg",
  "ag",
  "find",
  "ls",
  "dir",
  "tree",
  "type",
  "jq",
  "yq",
  "wc",
  "sort",
  "uniq",
  "cut",
  "strings",
  "od",
  "xxd",
  "nl",
  "get-content",
  "gc",
  "select-string",
  "sls",
  "get-childitem",
  "gci",
  "import-csv",
  "convertfrom-yaml"
]);
var PREFIXES = /* @__PURE__ */ new Set(["do", "then", "else", "time", "sudo", "xargs", "command", "exec", "!", "{", "("]);
var MARQUES_ETAT = [
  /(^|[\s"'=\/\\])\.agenticLEAN([\/\\\s"']|$)/,
  // Under .lean-engine the runtime is free to read; the families of the state are not.
  /\.lean-engine[\/\\]+(orchestration|ENG|DA|SCP|ADR|livraisons|captures|runs|journal)([\/\\\s"']|$)/,
  /agentic_orchestrator[\/\\]+management([\/\\\s"']|$)/,
  /\bENG-[^\s\/\\"']*\.ya?ml\b/,
  /\b(claims|agents)\.yaml\b/
];
var VERBES = {
  general: "Ask the authority instead: `node .lean-engine/bin/lean.cjs show ENG-NNNN` (the record and its computed state), `search <terms>` (commitments, requirements, DA, SCP, ADR), `frontiere`, `sessions`, `arbitrages`, `conseils`, and `numero <FAMILY>` to reserve a number."
};
function segments(commande) {
  return commande.split(/\|\||&&|[|;&\n]|\$\(|`/).map((s) => s.trim()).filter(Boolean);
}
function verbe(segment) {
  const mots = segment.split(/\s+/);
  for (const m of mots) {
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(m)) continue;
    if (PREFIXES.has(m)) continue;
    return path2.basename(m.replace(/^["']|["']$/g, "")).toLowerCase().replace(/\.exe$/, "");
  }
  return "";
}
function dansArbre(cible, ctx) {
  const rel = path2.relative(ctx.etat, cible);
  return rel === "" || !rel.startsWith("..") && !path2.isAbsolute(rel);
}
function marqueEtat(texte) {
  return MARQUES_ETAT.some((re) => re.test(texte));
}
function refusLecture(quoi) {
  return `[guard-lecture] refused: ${quoi} reads the state tree by hand.
Rule 9: never infer the state by reading files. The registry files do not carry the computed state (frozen, waiting, ready, lease), and a number guessed from the files present collides.
` + VERBES.general + "\nIf you must EDIT a file of the state tree (a draft you were told to complete), open it with the Read tool.";
}
function conseilShell(commande) {
  if (/lean(\.cjs)?["']?\s+etat\b/.test(commande) && /[|>]/.test(commande)) {
    return "[guard-lecture] The full projection is large and unfiltered. To answer a precise question, prefer `lean show <ID>` or `lean search <terms> [--genre engagement] [--statut propose] --json`.";
  }
  const spec = commande.match(/\bSPEC-[A-Z]{2,6}-\d{3}\b/);
  if (spec && /dossier-recette/.test(commande) && segments(commande).some((s) => LECTEURS.has(verbe(s)))) {
    return `[guard-lecture] To read one requirement, \`lean show ${spec[0]}\` returns its text, its status and the commitments that carry it.`;
  }
  if (/PIEGES_ENVIRONNEMENT|PITFALLS\.md/.test(commande) && segments(commande).some((s) => LECTEURS.has(verbe(s)))) {
    return "[guard-lecture] `lean pitfalls <terms>` returns only the sections that concern your problem, for example `lean pitfalls wsl path`.";
  }
  return void 0;
}
function jugerLecture(outil, entree, cwd, ctx) {
  if (!ctx) return {};
  if (outil === "Grep" || outil === "Glob") {
    const brut = entree.path ? String(entree.path) : cwd;
    const cible = path2.resolve(cwd, brut);
    const motif = String(entree.pattern ?? "");
    const viseEtat = dansArbre(cible, ctx) || outil === "Glob" && marqueEtat(motif);
    if (viseEtat) return { refus: refusLecture(`${outil} on ${path2.relative(ctx.racine, cible) || "."}`) };
    if (outil === "Grep") {
      const spec = motif.match(/^\^?(?:#+\s*)?(SPEC-[A-Z]{2,6}-\d{3})\b/);
      if (spec && dansDossier(cible, ctx.recette)) {
        return { conseil: `[guard-lecture] \`lean show ${spec[1]}\` returns this requirement, its status and the commitments that carry it.` };
      }
    }
    return {};
  }
  if (outil !== "Bash" && outil !== "PowerShell") return {};
  const commande = String(entree.command ?? "");
  if (!commande.trim()) return {};
  let dedans = dansArbre(path2.resolve(cwd), ctx);
  for (const s of segments(commande)) {
    const v = verbe(s);
    if (v === "cd" || v === "pushd" || v === "set-location" || v === "sl") {
      if (marqueEtat(s)) dedans = true;
      continue;
    }
    if (!LECTEURS.has(v)) continue;
    if (dedans || marqueEtat(s)) return { refus: refusLecture(`\`${s.slice(0, 120)}\``) };
  }
  const conseil = conseilShell(commande);
  return conseil ? { conseil } : {};
}
function dansDossier(cible, dossier) {
  const rel = path2.relative(dossier, cible);
  return rel === "" || !rel.startsWith("..") && !path2.isAbsolute(rel);
}

// hooks/guard_lecture.ts
function principal() {
  let charge = {};
  try {
    charge = JSON.parse(fs2.readFileSync(0, "utf-8"));
  } catch {
    process.exit(0);
  }
  const outil = String(charge.tool_name ?? "");
  const entree = charge.tool_input ?? {};
  const cwd = path3.resolve(String(charge.cwd ?? process.cwd()));
  let ctx = null;
  try {
    const racine = trouverRacine(cwd);
    ctx = racine ? resoudreContexte(racine) : null;
  } catch {
    process.exit(0);
  }
  let j;
  try {
    j = jugerLecture(outil, entree, cwd, ctx);
  } catch {
    process.exit(0);
  }
  if (j.refus) {
    process.stderr.write(j.refus + "\n");
    process.exit(2);
  }
  if (j.conseil) {
    process.stdout.write(
      JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: j.conseil } }) + "\n"
    );
  }
  process.exit(0);
}
principal();
