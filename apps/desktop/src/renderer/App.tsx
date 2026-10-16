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
import { docPosition, lineBreakOf, type LineBreak } from "./text.js";

/** What the indicator shows (SPEC-PRJ-003): saved, unsaved, or in conflict with the disk. A failed save is unsaved, with its reason beside. */
type SaveState = "saved" | "unsaved" | "conflict";

/** A save runs this long after the last change. */
export const SAVE_DELAY_MS = 600;

declare global {
  interface Window {
    ipeShell?: { chooseFolder(): Promise<string | null>; initialProject(): Promise<string | null> };
  }
}

interface Row {
  node: UnitNode;
  depth: number;
  parent: UnitNode | null;
  index: number;
  siblings: UnitNode[];
}

function flatten(nodes: UnitNode[], depth = 0, out: Row[] = [], parent: UnitNode | null = null): Row[] {
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

interface PendingSave {
  unitId: string;
  text: string;
  timer: number;
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
  const [hitTotal, setHitTotal] = useState(0);
  const [objects, setObjects] = useState<IpeObject[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [chain, setChain] = useState<ProvenanceChain | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; title: string } | null>(null);
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
  const lineBreak = useRef<LineBreak>("\n");
  /** The text the editor last loaded or saved for the selected unit, as the editor gives it back. */
  const lastSaved = useRef<string>("");
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected;
  /** The save scheduled by the last change: bound to its unit and its text at the moment of the change. */
  const pending = useRef<PendingSave | null>(null);
  /** Saves run one after the other: a save never overtakes the one before it. */
  const saveChain = useRef<Promise<boolean>>(Promise.resolve(true));
  const saveRef = useRef<(unitId: string, text: string, force: boolean) => Promise<boolean>>(async () => true);

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

  const currentText = () => view.current?.state.sliceDoc() ?? "";

  /** Cancels the pending save and returns it, so that a caller can flush it. */
  const cancelPending = useCallback((): PendingSave | null => {
    const p = pending.current;
    if (p !== null) {
      window.clearTimeout(p.timer);
      pending.current = null;
    }
    return p;
  }, []);

  /** Saves what is pending now, if anything; false when the unit cannot be left (a refused save, a conflict). */
  const flushPending = useCallback(async (): Promise<boolean> => {
    const p = cancelPending();
    if (p === null) return true;
    return saveRef.current(p.unitId, p.text, false);
  }, [cancelPending]);

  /** A fresh editor state for a text: the document split on the text's own line break, the listener bound to the unit shown. */
  const makeState = useCallback(
    (text: string, separator: LineBreak) =>
      EditorState.create({
        doc: text,
        extensions: [
          EditorState.lineSeparator.of(separator),
          vimCompartment.current.of(vimMode ? vim() : []),
          basicSetup,
          markdown(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            const unitId = selectedRef.current;
            if (!update.docChanged || unitId === null) return;
            const changed = update.state.sliceDoc();
            // One pending save at a time, always for the text on screen now (an edit reverted leaves nothing pending).
            cancelPending();
            if (changed === lastSaved.current) {
              setSaveState("saved");
              return;
            }
            setSaveState("unsaved");
            pending.current = {
              unitId,
              text: changed,
              timer: window.setTimeout(() => {
                const p = cancelPending();
                if (p !== null) void saveRef.current(p.unitId, p.text, false);
              }, SAVE_DELAY_MS),
            };
          }),
        ],
      }),
    [cancelPending, vimMode],
  );

  // The editor is created once; a load replaces its state, which the listener never sees as a change.
  useEffect(() => {
    if (!editorHost.current || view.current) return;
    view.current = new EditorView({ state: makeState("", "\n"), parent: editorHost.current });
  }, [makeState]);

  useEffect(() => {
    view.current?.dispatch({ effects: vimCompartment.current.reconfigure(vimMode ? vim() : []) });
    try {
      window.localStorage.setItem("ipe.vim", vimMode ? "1" : "0");
    } catch {
      // storage unavailable: the choice holds for the session only
    }
  }, [vimMode]);

  /**
   * Shows a text as the saved state of the selected unit. No save follows a load. The editor splits
   * and joins on the unit's own line break, so what it gives back is what it was given, byte for byte:
   * a uniform CRLF unit on CRLF, any other on LF with stray carriage returns kept as characters.
   */
  const showText = useCallback(
    (text: string) => {
      const detected = lineBreakOf(text);
      lineBreak.current = detected.lineBreak;
      view.current?.setState(makeState(text, detected.lineBreak));
      lastSaved.current = currentText();
      if (detected.mixed) say("this unit mixes line endings: its bytes are kept, a new line you type ends with LF, and a stray carriage return shows as a marked character");
    },
    [makeState, say],
  );

  const unitTitle = useCallback((unitId: string) => flatten(project?.units ?? []).find((r) => r.node.id === unitId)?.node.title ?? unitId, [project]);

  const save = useCallback(
    async (unitId: string, text: string, force: boolean): Promise<boolean> => {
      const shown = () => selectedRef.current === unitId;
      try {
        const result = await api.writeUnit(unitId, text, { force });
        if ("conflict" in result) {
          if (shown()) {
            setConflict(result);
            setSaveState("conflict");
          } else say(`${unitTitle(unitId)} changed on disk: open it to choose which text to keep`);
          return false;
        }
        if (shown()) {
          lastSaved.current = text;
          setConflict(null);
          setSaveError(null);
          setSaveState(currentText() === text ? "saved" : "unsaved");
        }
        if (result.invalidated.length > 0) say(`${result.invalidated.length} object(s) need re-evaluation`);
        await refreshObjects();
        return true;
      } catch (e) {
        // The text stays on screen, unsaved, with the reason and a way to try again.
        const reason = String((e as Error).message ?? e);
        if (shown()) {
          setSaveState("unsaved");
          setSaveError(reason);
        } else say(`save of ${unitTitle(unitId)} failed: ${reason}`);
        return false;
      }
    },
    [api, refreshObjects, say, unitTitle],
  );

  saveRef.current = (unitId, text, force) => {
    saveChain.current = saveChain.current.then(() => save(unitId, text, force));
    return saveChain.current;
  };

  const retrySave = useCallback(() => {
    const unitId = selectedRef.current;
    if (unitId !== null) void saveRef.current(unitId, currentText(), false);
  }, []);

  /** Opens a unit in the editor once the unit left is saved; the author stays on a unit whose save is refused or in conflict. */
  const openUnit = useCallback(
    async (unitId: string): Promise<boolean> => {
      if (!(await flushPending())) return false;
      const unit = await api.readUnit(unitId);
      selectedRef.current = unitId;
      setSelected(unitId);
      setConflict(null);
      setSaveError(null);
      setSaveState("saved");
      showText(unit.text);
      return true;
    },
    [api, flushPending, showText],
  );

  /** The disk's text taken as the unit's text: the author's choice after a conflict. */
  const takeDisk = useCallback(
    async (unitId: string) => {
      cancelPending();
      const unit = await api.takeDisk(unitId);
      setConflict(null);
      setSaveError(null);
      setSaveState("saved");
      showText(unit.text);
      await refreshObjects();
    },
    [api, cancelPending, refreshObjects, showText],
  );

  const loadProject = useCallback(
    async (p: ProjectView) => {
      setProject(p);
      const first = flatten(p.units)[0]?.node;
      if (first) await openUnit(first.id);
      else {
        selectedRef.current = null;
        setSelected(null);
        showText("");
      }
      if (p.report.externalChanges.length > 0) say(`${p.report.externalChanges.length} unit(s) changed on disk since the last save; kept as found`);
    },
    [openUnit, say, showText],
  );

  const openFolder = useCallback(
    async (root: string) => {
      if (!(await flushPending())) return;
      try {
        await loadProject(await api.openProject(root));
      } catch (e) {
        say(`cannot open: ${String((e as Error).message ?? e)}`);
      }
    },
    [api, flushPending, loadProject, say],
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
    if (!(await flushPending())) return;
    try {
      await loadProject(await api.createProject(folder, projectName));
    } catch (e) {
      say(`cannot create: ${String((e as Error).message ?? e)}`);
    }
  }, [api, flushPending, folder, projectName, loadProject, say]);

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

  const commitRename = useCallback(async () => {
    const r = renaming;
    if (r === null) return;
    setRenaming(null);
    const title = r.title.trim();
    if (title === "") return;
    const units = await api.renameUnit(r.id, title);
    setProject((p) => (p ? { ...p, units } : p));
  }, [api, renaming]);

  const runSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      const result = term.trim() === "" ? { hits: [], total: 0 } : await api.search(term);
      setHits(result.hits);
      setHitTotal(result.total);
    },
    [api],
  );

  const goToHit = useCallback(
    async (hit: Hit) => {
      if (hit.unit) {
        if (hit.unit !== selectedRef.current && !(await openUnit(hit.unit))) return;
        const v = view.current;
        if (!v) return;
        const length = v.state.doc.length;
        const from = Math.min(docPosition(lastSaved.current, hit.start, lineBreak.current), length);
        const to = Math.min(docPosition(lastSaved.current, hit.end, lineBreak.current), length);
        v.dispatch({ selection: { anchor: from, head: to }, scrollIntoView: true });
        v.focus();
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
            {renaming?.id === node.id ? (
              <input
                className="rename"
                data-testid="rename-input"
                autoFocus
                value={renaming.title}
                onChange={(e) => setRenaming({ id: node.id, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void commitRename();
                  if (e.key === "Escape") setRenaming(null);
                }}
                onBlur={() => void commitRename()}
              />
            ) : (
              <button className="unit-title" data-testid="unit-title" onClick={() => void openUnit(node.id)}>{node.title}</button>
            )}
            <span className="unit-actions">
              <button title="rename" onClick={() => setRenaming({ id: node.id, title: node.title })}>✎</button>
              <button title="move up" disabled={index === 0} onClick={() => void move(node.id, parent?.id ?? null, index - 1)}>↑</button>
              <button title="move down" disabled={index >= siblings.length - 1} onClick={() => void move(node.id, parent?.id ?? null, index + 1)}>↓</button>
              <button title="move under the previous unit" disabled={index === 0} onClick={() => void move(node.id, siblings[index - 1]?.id ?? null, siblings[index - 1]?.children.length ?? 0)}>→</button>
              <button
                title="move out, after its parent"
                disabled={parent === null}
                onClick={() => {
                  if (!parent) return;
                  const g = grandparentIndex(project?.units ?? [], parent);
                  void move(node.id, g.grandparent?.id ?? null, g.index);
                }}
              >
                ←
              </button>
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
            <button data-testid="keep-mine" onClick={() => void saveRef.current(conflict.unitId, conflict.mine, true)}>Keep mine</button>
            <button data-testid="take-disk" onClick={() => void takeDisk(conflict.unitId)}>Take the disk version</button>
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
          {hitTotal > hits.length ? (
            <p className="hint" data-testid="search-truncated">showing {hits.length} of {hitTotal} hits; narrow the search to see the rest</p>
          ) : null}
          <ul className="hits">
            {hits.map((hit, i) => (
              <li key={i}>
                <button data-testid="search-hit" onClick={() => void goToHit(hit)}>
                  <span className="hit-where">{hit.unit ? unitTitle(hit.unit) : `object ${hit.objectId ?? ""}`}</span>
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
            <p>
              <strong>{chain.object.title}</strong> ({chain.object.kind}, {chain.object.provenance.origin}, {chain.object.provenance.action}, {chain.object.provenance.approval}, {chain.object.stale ? "stale" : "current"})
            </p>
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
