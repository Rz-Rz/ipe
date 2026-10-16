// The interface of the first milestone: a project on disk, an outline, an editor with its save
// state, a search panel, an inspector of objects and their provenance. It calls the channel only.

import { markdown } from "@codemirror/lang-markdown";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { basicSetup } from "codemirror";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Counts, Hit, IpeObject, ProvenanceChain, UnitNode } from "@ipe/kernel";
import type { ConflictResult, IpeApi, ProjectView } from "../api.js";
import { connect } from "./client.js";

/** What the indicator shows (SPEC-PRJ-003): saved, unsaved, or in conflict with the disk. A failed save is unsaved, with its reason beside. */
type SaveState = "saved" | "unsaved" | "conflict";

declare global {
  interface Window {
    ipeShell?: { chooseFolder(): Promise<string | null>; initialProject(): Promise<string | null> };
  }
}

function flatten(nodes: UnitNode[], depth = 0, out: Array<{ node: UnitNode; depth: number; parent: UnitNode | null; index: number; siblings: UnitNode[] }> = [], parent: UnitNode | null = null): typeof out {
  nodes.forEach((node, index) => {
    out.push({ node, depth, parent, index, siblings: nodes });
    flatten(node.children, depth + 1, out, node);
  });
  return out;
}

function grandparentIndex(units: UnitNode[], parent: UnitNode): { grandparent: UnitNode | null; index: number } {
  const entry = flatten(units).find((e) => e.node.id === parent.id);
  return { grandparent: entry?.parent ?? null, index: (entry?.index ?? 0) + 1 };
}

export function App(): JSX.Element {
  const api = useMemo<IpeApi>(() => connect(), []);
  const [project, setProject] = useState<ProjectView | null>(null);
  const [folder, setFolder] = useState("");
  const [projectName, setProjectName] = useState("My project");
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ConflictResult | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [objects, setObjects] = useState<IpeObject[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [chain, setChain] = useState<ProvenanceChain | null>(null);
  const [vimMode, setVimMode] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem("ipe.vim") === "1";
    } catch {
      return false;
    }
  });
  const [newTitle, setNewTitle] = useState("");

  const editorHost = useRef<HTMLDivElement | null>(null);
  const view = useRef<EditorView | null>(null);
  const vimCompartment = useRef(new Compartment());
  const saveTimer = useRef<number | null>(null);
  const lastSaved = useRef<string>("");
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected;
  // The editor's listener is created once; it reaches the latest save through a ref. Saves run
  // one after the other: a save never overtakes the one before it.
  const saveRef = useRef<(text: string, force: boolean) => Promise<void>>(async () => undefined);
  const saveChain = useRef<Promise<void>>(Promise.resolve());

  const say = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage((m) => (m === text ? null : m)), 4000);
  }, []);

  const refreshObjects = useCallback(async () => {
    if (!project) return;
    setObjects(await api.objects());
    setCounts(await api.counts());
  }, [api, project]);

  useEffect(() => {
    void refreshObjects();
  }, [refreshObjects]);

  // The editor is created once; its document follows the selected unit.
  useEffect(() => {
    if (!editorHost.current || view.current) return;
    const state = EditorState.create({
      doc: "",
      extensions: [
        vimCompartment.current.of(vimMode ? vim() : []),
        basicSetup,
        markdown(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || selectedRef.current === null) return;
          const text = update.state.doc.toString();
          if (text === lastSaved.current) {
            setSaveState("saved");
            return;
          }
          setSaveState("unsaved");
          if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
          saveTimer.current = window.setTimeout(() => void saveRef.current(text, false), 600);
        }),
      ],
    });
    view.current = new EditorView({ state, parent: editorHost.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    view.current?.dispatch({ effects: vimCompartment.current.reconfigure(vimMode ? vim() : []) });
    try {
      window.localStorage.setItem("ipe.vim", vimMode ? "1" : "0");
    } catch {
      // storage unavailable: the choice holds for the session only
    }
  }, [vimMode]);

  const save = useCallback(
    async (text: string, force: boolean) => {
      const unitId = selectedRef.current;
      if (unitId === null) return;
      setSaveState("unsaved");
      try {
        const result = await api.writeUnit(unitId, text, { force });
        if ("conflict" in result) {
          setConflict(result);
          setSaveState("conflict");
          return;
        }
        lastSaved.current = text;
        setConflict(null);
        setSaveError(null);
        setSaveState(view.current?.state.doc.toString() === text ? "saved" : "unsaved");
        if (result.invalidated.length > 0) say(`${result.invalidated.length} object(s) need re-evaluation`);
        await refreshObjects();
      } catch (e) {
        // The text stays on screen, unsaved, with the reason and a way to try again.
        setSaveState("unsaved");
        setSaveError(String((e as Error).message ?? e));
      }
    },
    [api, refreshObjects, say],
  );

  saveRef.current = (text, force) => {
    saveChain.current = saveChain.current.then(() => save(text, force));
    return saveChain.current;
  };

  const retrySave = useCallback(() => saveRef.current(view.current?.state.doc.toString() ?? "", false), []);

  const openUnit = useCallback(
    async (unitId: string) => {
      const unit = await api.readUnit(unitId);
      lastSaved.current = unit.text;
      setSelected(unitId);
      setConflict(null);
      setSaveError(null);
      setSaveState("saved");
      view.current?.dispatch({ changes: { from: 0, to: view.current.state.doc.length, insert: unit.text } });
    },
    [api],
  );

  const loadProject = useCallback(
    async (p: ProjectView) => {
      setProject(p);
      const first = flatten(p.units)[0]?.node;
      if (first) await openUnit(first.id);
      else {
        setSelected(null);
        view.current?.dispatch({ changes: { from: 0, to: view.current.state.doc.length, insert: "" } });
      }
      if (p.report.externalChanges.length > 0) say(`${p.report.externalChanges.length} unit(s) changed on disk since the last save; kept as found`);
    },
    [openUnit, say],
  );

  const openFolder = useCallback(
    async (root: string) => {
      try {
        await loadProject(await api.openProject(root));
      } catch (e) {
        say(`cannot open: ${String((e as Error).message ?? e)}`);
      }
    },
    [api, loadProject, say],
  );

  const doOpen = useCallback(() => openFolder(folder), [folder, openFolder]);

  // Started on a project folder (the shell says which), the interface opens it at once.
  const openedInitial = useRef(false);
  useEffect(() => {
    if (openedInitial.current || !window.ipeShell) return;
    openedInitial.current = true;
    void window.ipeShell.initialProject().then((root) => {
      if (root) {
        setFolder(root);
        return openFolder(root);
      }
      return undefined;
    });
  }, [openFolder]);

  const doCreate = useCallback(async () => {
    try {
      await loadProject(await api.createProject(folder, projectName));
    } catch (e) {
      say(`cannot create: ${String((e as Error).message ?? e)}`);
    }
  }, [api, folder, projectName, loadProject, say]);

  const doBrowse = useCallback(async () => {
    const chosen = await window.ipeShell?.chooseFolder();
    if (chosen) setFolder(chosen);
  }, []);

  const refreshUnits = useCallback(async () => {
    const p = await api.current();
    if (p) setProject(p);
  }, [api]);

  const addUnit = useCallback(
    async (parentId: string | null) => {
      const title = newTitle.trim() || "Untitled";
      const node = await api.addUnit(title, parentId);
      setNewTitle("");
      await refreshUnits();
      await openUnit(node.id);
    },
    [api, newTitle, openUnit, refreshUnits],
  );

  const move = useCallback(
    async (unitId: string, parentId: string | null, index: number) => {
      const result = await api.moveUnit(unitId, parentId, index);
      setProject((p) => (p ? { ...p, units: result.units } : p));
      say(`moved, ${result.carried} object(s) carried`);
    },
    [api, say],
  );

  const rename = useCallback(
    async (unit: UnitNode) => {
      const title = window.prompt("New title", unit.title);
      if (title === null || title.trim() === "") return;
      const units = await api.renameUnit(unit.id, title.trim());
      setProject((p) => (p ? { ...p, units } : p));
    },
    [api],
  );

  const runSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      setHits(term.trim() === "" ? [] : await api.search(term));
    },
    [api],
  );

  const goToHit = useCallback(
    async (hit: Hit) => {
      if (hit.unit) {
        if (hit.unit !== selectedRef.current) await openUnit(hit.unit);
        view.current?.dispatch({ selection: { anchor: hit.start, head: hit.end }, scrollIntoView: true });
        view.current?.focus();
      } else if (hit.objectId) {
        setChain(await api.explain(hit.objectId));
      }
    },
    [api, openUnit],
  );

  const units = project ? flatten(project.units) : [];

  return (
    <div className="app">
      <header className="topbar">
        <strong className="brand">IPE</strong>
        <input data-testid="folder" placeholder="project folder" value={folder} onChange={(e) => setFolder(e.target.value)} />
        {window.ipeShell ? <button onClick={() => void doBrowse()}>Browse</button> : null}
        <button data-testid="open" onClick={() => void doOpen()}>Open</button>
        <input data-testid="project-name" placeholder="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        <button data-testid="create" onClick={() => void doCreate()}>Create</button>
        <span className="grow" />
        {project ? <span data-testid="project-title" className="title">{project.name}</span> : null}
        <label className="vim">
          <input type="checkbox" checked={vimMode} onChange={(e) => setVimMode(e.target.checked)} /> Vim
        </label>
        <span data-testid="save-state" className={`save-state ${saveState}`}>{saveState}</span>
      </header>

      <aside className="outline" data-testid="outline">
        <div className="panel-title">Outline</div>
        {units.map(({ node, depth, parent, index, siblings }) => (
          <div key={node.id} className={`unit ${selected === node.id ? "selected" : ""}`} style={{ paddingLeft: `${8 + depth * 16}px` }} data-testid={`unit-${node.id}`}>
            <button className="unit-title" data-testid="unit-title" onClick={() => void openUnit(node.id)}>{node.title}</button>
            <span className="unit-actions">
              <button title="rename" onClick={() => void rename(node)}>✎</button>
              <button title="move up" disabled={index === 0} onClick={() => void move(node.id, parent?.id ?? null, index - 1)}>↑</button>
              <button title="move down" disabled={index >= siblings.length - 1} onClick={() => void move(node.id, parent?.id ?? null, index + 1)}>↓</button>
              <button title="move under the previous unit" disabled={index === 0} onClick={() => void move(node.id, siblings[index - 1]?.id ?? null, siblings[index - 1]?.children.length ?? 0)}>→</button>
              <button title="move out, after its parent" disabled={parent === null} onClick={() => parent && (() => { const g = grandparentIndex(project?.units ?? [], parent); return move(node.id, g.grandparent?.id ?? null, g.index); })()}>←</button>
              <button title="add a child unit" onClick={() => void addUnit(node.id)}>+</button>
            </span>
          </div>
        ))}
        {project ? (
          <div className="add-unit">
            <input data-testid="new-unit-title" placeholder="new unit title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <button data-testid="add-unit" onClick={() => void addUnit(null)}>Add unit</button>
          </div>
        ) : (
          <p className="hint">Open a folder, or create a project.</p>
        )}
      </aside>

      <main className="editor-pane">
        {conflict ? (
          <div className="conflict" data-testid="conflict">
            <p>This unit changed on disk since you read it. Nothing was overwritten.</p>
            <div className="conflict-texts">
              <div><div className="panel-title">On disk</div><pre data-testid="conflict-disk">{conflict.disk}</pre></div>
              <div><div className="panel-title">Yours</div><pre data-testid="conflict-mine">{conflict.mine}</pre></div>
            </div>
            <button data-testid="keep-mine" onClick={() => void saveRef.current(conflict.mine, true)}>Keep mine</button>
            <button data-testid="take-disk" onClick={() => void openUnit(conflict.unitId)}>Take the disk version</button>
          </div>
        ) : null}
        {saveError ? (
          <div className="save-error" data-testid="save-error">
            <span>Save failed: {saveError}. Your text is kept on screen and is not on disk yet.</span>
            <button data-testid="retry-save" onClick={() => void retrySave()}>Retry</button>
          </div>
        ) : null}
        <div ref={editorHost} className="editor" data-testid="editor" />
      </main>

      <aside className="side">
        <div className="panel">
          <div className="panel-title">Search</div>
          <input data-testid="search" placeholder="find in project" value={searchTerm} onChange={(e) => void runSearch(e.target.value)} />
          <ul className="hits">
            {hits.map((hit, i) => (
              <li key={i}>
                <button data-testid="search-hit" onClick={() => void goToHit(hit)}>
                  <span className="hit-where">{hit.unit ? units.find((u) => u.node.id === hit.unit)?.node.title ?? hit.unit : `object ${hit.objectId ?? ""}`}</span>
                  <span className="hit-excerpt">{hit.excerpt}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <div className="panel-title">Objects {counts ? `(${counts.total}, ${counts.stale} stale)` : ""}</div>
          <ul className="objects" data-testid="objects">
            {objects.map((o) => (
              <li key={o.id}>
                <button data-testid="object" onClick={() => void api.explain(o.id).then(setChain)}>
                  <span className={`kind ${o.stale ? "stale" : ""}`}>{o.kind}</span> {o.title} <span className="approval">{o.provenance.approval}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {chain ? (
          <div className="panel" data-testid="inspector">
            <div className="panel-title">Why does the project hold this?</div>
            <p><strong>{chain.object.title}</strong> ({chain.object.kind}, {chain.object.provenance.origin}, {chain.object.provenance.action}, {chain.object.provenance.approval}, {chain.object.stale ? "stale" : "current"})</p>
            <p>Version: {chain.versionFound ? chain.version?.id : "not found: unverifiable"}</p>
            <ul>
              {chain.anchors.map((a, i) => (
                <li key={i}>
                  <span className={`anchor ${a.state}`}>{a.state}</span> {a.passage === null ? <em>passage gone</em> : <q>{a.passage}</q>}
                </li>
              ))}
            </ul>
            {chain.dependencies.length > 0 ? <p>Rests on: {chain.dependencies.map((d) => d.title).join(", ")}</p> : null}
            {chain.dependents.length > 0 ? <p>Used by: {chain.dependents.length} object(s)</p> : null}
          </div>
        ) : null}
      </aside>

      {message ? <div className="toast" data-testid="toast">{message}</div> : null}
    </div>
  );
}
