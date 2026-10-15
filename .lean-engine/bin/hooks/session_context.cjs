"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/identity.js"(exports2) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports2.ALIAS = ALIAS;
    exports2.DOC = DOC;
    exports2.MAP = MAP;
    exports2.NODE_TYPE = NODE_TYPE;
    exports2.PAIR = PAIR;
    exports2.SCALAR = SCALAR;
    exports2.SEQ = SEQ;
    exports2.hasAnchor = hasAnchor;
    exports2.isAlias = isAlias;
    exports2.isCollection = isCollection;
    exports2.isDocument = isDocument;
    exports2.isMap = isMap;
    exports2.isNode = isNode;
    exports2.isPair = isPair;
    exports2.isScalar = isScalar;
    exports2.isSeq = isSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/visit.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path21) {
      const ctrl = callVisitor(key, node, visitor, path21);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path21, ctrl);
        return visit_(key, ctrl, visitor, path21);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path21 = Object.freeze(path21.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path21);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path21 = Object.freeze(path21.concat(node));
          const ck = visit_("key", node.key, visitor, path21);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path21);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path21) {
      const ctrl = await callVisitor(key, node, visitor, path21);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path21, ctrl);
        return visitAsync_(key, ctrl, visitor, path21);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path21 = Object.freeze(path21.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path21);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path21 = Object.freeze(path21.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path21);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path21);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path21) {
      if (typeof visitor === "function")
        return visitor(key, node, path21);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path21);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path21);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path21);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path21);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path21);
      return void 0;
    }
    function replaceNode(key, path21, node) {
      const parent = path21[path21.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports2.visit = visit;
    exports2.visitAsync = visitAsync;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/directives.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports2.Directives = Directives;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/anchors.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports2.anchorIsValid = anchorIsValid;
    exports2.anchorNames = anchorNames;
    exports2.createNodeAnchors = createNodeAnchors;
    exports2.findNewAnchor = findNewAnchor;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/applyReviver.js"(exports2) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports2.applyReviver = applyReviver;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/toJS.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports2.toJS = toJS;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Node.js"(exports2) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports2.NodeBase = NodeBase;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Alias.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (data?.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports2.Alias = Alias;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports2.Scalar = Scalar;
    exports2.isScalarValue = isScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/createNode.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports2.createNode = createNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Collection.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path21, value) {
      let v = value;
      for (let i = path21.length - 1; i >= 0; --i) {
        const k = path21[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path21) => path21 == null || typeof path21 === "object" && !!path21[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path21, value) {
        if (isEmptyPath(path21))
          this.add(value);
        else {
          const [key, ...rest] = path21;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path21) {
        const [key, ...rest] = path21;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path21, keepScalar) {
        const [key, ...rest] = path21;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path21) {
        const [key, ...rest] = path21;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path21, value) {
        const [key, ...rest] = path21;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports2.Collection = Collection;
    exports2.collectionFromPath = collectionFromPath;
    exports2.isEmptyPath = isEmptyPath;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyComment.js"(exports2) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports2.indentComment = indentComment;
    exports2.lineComment = lineComment;
    exports2.stringifyComment = stringifyComment;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports2) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports2.FOLD_BLOCK = FOLD_BLOCK;
    exports2.FOLD_FLOW = FOLD_FLOW;
    exports2.FOLD_QUOTED = FOLD_QUOTED;
    exports2.foldFlowLines = foldFlowLines;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyString.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports2.stringifyString = stringifyString;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringify.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports2.createStringifyContext = createStringifyContext;
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyPair.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports2.stringifyPair = stringifyPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/log.js"(exports2) {
    "use strict";
    var node_process = require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports2.debug = debug;
    exports2.warn = warn;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports2.addMergeToJSMap = addMergeToJSMap;
    exports2.isMergeKey = isMergeKey;
    exports2.merge = merge;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports2) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports2.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/Pair.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports2.Pair = Pair;
    exports2.createPair = createPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports2.stringifyCollection = stringifyCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLMap.js"(exports2) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports2.YAMLMap = YAMLMap;
    exports2.findPair = findPair;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/map.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports2.map = map;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports2.YAMLSeq = YAMLSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/seq.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports2.seq = seq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/string.js"(exports2) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports2.string = string;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/common/null.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports2.nullTag = nullTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports2.boolTag = boolTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports2) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports2.stringifyNumber = stringifyNumber;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/core/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/json/schema.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports2) {
    "use strict";
    var node_buffer = require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports2.binary = binary;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports2.createPairs = createPairs;
    exports2.pairs = pairs;
    exports2.resolvePairs = resolvePairs;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports2.YAMLOMap = YAMLOMap;
    exports2.omap = omap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports2.falseTag = falseTag;
    exports2.trueTag = trueTag;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intBin = intBin;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports2.YAMLSet = YAMLSet;
    exports2.set = set;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports2.floatTime = floatTime;
    exports2.intTime = intTime;
    exports2.timestamp = timestamp;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/tags.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports2.coreKnownTags = coreKnownTags;
    exports2.getTags = getTags;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/schema/Schema.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports2.Schema = Schema;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports2.stringifyDocument = stringifyDocument;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/doc/Document.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path21, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path21, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path21) {
        if (Collection.isEmptyPath(path21)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path21) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path21, keepScalar) {
        if (Collection.isEmptyPath(path21))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path21, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path21) {
        if (Collection.isEmptyPath(path21))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path21) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path21, value) {
        if (Collection.isEmptyPath(path21)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path21), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path21, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports2.Document = Document;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/errors.js"(exports2) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports2.YAMLError = YAMLError;
    exports2.YAMLParseError = YAMLParseError;
    exports2.YAMLWarning = YAMLWarning;
    exports2.prettifyError = prettifyError;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-props.js"(exports2) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports2.resolveProps = resolveProps;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-contains-newline.js"(exports2) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports2.containsNewline = containsNewline;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports2) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports2.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-map-includes.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports2.mapIncludes = mapIncludes;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-map.js"(exports2) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep: sep5, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep5?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep5) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep5 ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep5, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports2.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports2) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports2.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-end.js"(exports2) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep5 = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep5 + cb;
              sep5 = "";
              break;
            }
            case "newline":
              if (comment)
                sep5 += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports2.resolveEnd = resolveEnd;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep: sep5, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep5?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep5 && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep5 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep5, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep5 ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep5)
                for (const st of sep5) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep5, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports2.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports2.composeCollection = composeCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep5 = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep5 + indent.slice(trimIndent) + content;
          sep5 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep5 === " ")
            sep5 = "\n";
          else if (!prevMoreIndented && sep5 === "\n")
            sep5 = "\n\n";
          value += sep5 + indent.slice(trimIndent) + content;
          sep5 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep5 === "\n")
            value += "\n";
          else
            sep5 = "\n";
        } else {
          value += sep5 + content;
          sep5 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports2.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep5 = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep5 === "\n")
            res += sep5;
          else
            sep5 = "\n";
        } else {
          res += sep5 + match[1];
          sep5 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep5 + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports2.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports2.composeScalar = composeScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports2) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports2.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-node.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports2.composeEmptyNode = composeEmptyNode;
    exports2.composeNode = composeNode;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/compose-doc.js"(exports2) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports2.composeDoc = composeDoc;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/compose/composer.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports2.Composer = Composer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-scalar.js"(exports2) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports2.createScalarToken = createScalarToken;
    exports2.resolveAsScalar = resolveAsScalar;
    exports2.setScalarValue = setScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-stringify.js"(exports2) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep: sep5, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep5)
        for (const st of sep5)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst-visit.js"(exports2) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path21) => {
      let item = cst;
      for (const [field, index] of path21) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path21) => {
      const parent = visit.itemAtPath(cst, path21.slice(0, -1));
      const field = path21[path21.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path21, item, visitor) {
      let ctrl = visitor(item, path21);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path21.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path21);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path21) : ctrl;
    }
    exports2.visit = visit;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/cst.js"(exports2) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports2.createScalarToken = cstScalar.createScalarToken;
    exports2.resolveAsScalar = cstScalar.resolveAsScalar;
    exports2.setScalarValue = cstScalar.setScalarValue;
    exports2.stringify = cstStringify.stringify;
    exports2.visit = cstVisit.visit;
    exports2.BOM = BOM;
    exports2.DOCUMENT = DOCUMENT;
    exports2.FLOW_END = FLOW_END;
    exports2.SCALAR = SCALAR;
    exports2.isCollection = isCollection;
    exports2.isScalar = isScalar;
    exports2.prettyToken = prettyToken;
    exports2.tokenType = tokenType;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/lexer.js"(exports2) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports2.Lexer = Lexer;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/line-counter.js"(exports2) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports2.LineCounter = LineCounter;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/parse/parser.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep5;
          if (scalar.end) {
            sep5 = scalar.end;
            sep5.push(this.sourceToken);
            delete scalar.end;
          } else
            sep5 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep5 }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep5 = it.sep;
                  sep5.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep5 }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs24 = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs24, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs24);
              } else {
                Object.assign(it, { key: fs24, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs24 = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs24, sep: [] });
              else if (it.sep)
                this.stack.push(fs24);
              else
                Object.assign(it, { key: fs24, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep5 = fc.end.splice(1, fc.end.length);
            sep5.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep5 }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports2.Parser = Parser;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/public-api.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports2.parse = parse2;
    exports2.parseAllDocuments = parseAllDocuments;
    exports2.parseDocument = parseDocument;
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/yaml@2.9.0/node_modules/yaml/dist/index.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports2.Composer = composer.Composer;
    exports2.Document = Document.Document;
    exports2.Schema = Schema.Schema;
    exports2.YAMLError = errors.YAMLError;
    exports2.YAMLParseError = errors.YAMLParseError;
    exports2.YAMLWarning = errors.YAMLWarning;
    exports2.Alias = Alias.Alias;
    exports2.isAlias = identity.isAlias;
    exports2.isCollection = identity.isCollection;
    exports2.isDocument = identity.isDocument;
    exports2.isMap = identity.isMap;
    exports2.isNode = identity.isNode;
    exports2.isPair = identity.isPair;
    exports2.isScalar = identity.isScalar;
    exports2.isSeq = identity.isSeq;
    exports2.Pair = Pair.Pair;
    exports2.Scalar = Scalar.Scalar;
    exports2.YAMLMap = YAMLMap.YAMLMap;
    exports2.YAMLSeq = YAMLSeq.YAMLSeq;
    exports2.CST = cst;
    exports2.Lexer = lexer.Lexer;
    exports2.LineCounter = lineCounter.LineCounter;
    exports2.Parser = parser.Parser;
    exports2.parse = publicApi.parse;
    exports2.parseAllDocuments = publicApi.parseAllDocuments;
    exports2.parseDocument = publicApi.parseDocument;
    exports2.stringify = publicApi.stringify;
    exports2.visit = visit.visit;
    exports2.visitAsync = visit.visitAsync;
  }
});

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
function fichierEngagementDepot(depot, eng) {
  const e = resoudreEtat(depot);
  if (!e) return null;
  const f = path.join(e.engagements, `${eng}.yaml`);
  return fs.existsSync(f) ? f : null;
}
function cheminEngagement(ctx, eng) {
  return path.join(ctx.engagements, `${eng}.yaml`);
}
function relEngagement(ctx, eng) {
  return path.relative(ctx.racine, cheminEngagement(ctx, eng)).split(path.sep).join("/");
}
function cheminWorktree(ctx, eng) {
  return path.join(ctx.wt, eng.toLowerCase());
}
function brancheEngagement(eng) {
  return `eng/${eng.toLowerCase()}`;
}

// hooks/session_context.ts
var fs23 = __toESM(require("node:fs"), 1);
var path20 = __toESM(require("node:path"), 1);
var import_yaml2 = __toESM(require_dist(), 1);

// noyau/src/conseils.ts
var fs22 = __toESM(require("node:fs"), 1);
var path19 = __toESM(require("node:path"), 1);

// noyau/src/fichiers.ts
var fs2 = __toESM(require("node:fs"), 1);
var path2 = __toESM(require("node:path"), 1);
var FIN_LIGNE = process.platform === "win32" ? "\r\n" : "\n";
function lireTexte(chemin) {
  return fs2.readFileSync(chemin, "utf-8").replace(/\r\n/g, "\n");
}
function versOs(contenu) {
  return FIN_LIGNE === "\n" ? contenu : contenu.replace(/\r?\n/g, FIN_LIGNE);
}
function ecrireTexte(chemin, contenu) {
  const tmp = chemin + ".tmp";
  fs2.mkdirSync(path2.dirname(chemin), { recursive: true });
  fs2.writeFileSync(tmp, versOs(contenu), "utf-8");
  try {
    fs2.renameSync(tmp, chemin);
  } catch (e) {
    const code = e.code;
    if (code === "EPERM" || code === "EACCES" || code === "EEXIST") {
      try {
        fs2.unlinkSync(chemin);
      } catch {
      }
      fs2.renameSync(tmp, chemin);
    } else {
      throw e;
    }
  }
}

// noyau/src/dag.ts
var fs9 = __toESM(require("node:fs"), 1);
var path7 = __toESM(require("node:path"), 1);

// noyau/src/yamlutil.ts
var import_yaml = __toESM(require_dist(), 1);
function lireYaml(chemin) {
  return (0, import_yaml.parse)(lireTexte(chemin));
}
function lireYamlSur(texte) {
  return (0, import_yaml.parse)(texte);
}
function ecrireAtomique(chemin, contenu) {
  ecrireTexte(chemin, contenu);
}

// noyau/src/claims.ts
var fs6 = __toESM(require("node:fs"), 1);

// noyau/src/remote.ts
var fs3 = __toESM(require("node:fs"), 1);
var path3 = __toESM(require("node:path"), 1);
var import_node_child_process2 = require("node:child_process");

// noyau/src/git.ts
var import_node_child_process = require("node:child_process");
function git(args, cwd) {
  const r = (0, import_node_child_process.spawnSync)("git", args, {
    cwd,
    encoding: "utf-8",
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024
  });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

// noyau/src/remote.ts
var FETCH_INTERVAL_MS = 6e4;
var FETCH_TIMEOUT_MS = 8e3;
var TRUNK = "master";
function estRacineGit(ctx) {
  const connu = racinesGit.get(ctx.racine);
  if (connu !== void 0) return connu;
  const reponse = lireRacineGit(ctx);
  racinesGit.set(ctx.racine, reponse);
  return reponse;
}
var racinesGit = /* @__PURE__ */ new Map();
function lireRacineGit(ctx) {
  const r = git(["rev-parse", "--show-toplevel"], ctx.racine);
  if (r.code !== 0) return false;
  const norme = (p) => {
    const abs = path3.resolve(p);
    return process.platform === "win32" ? abs.toLowerCase() : abs;
  };
  let reel = ctx.racine;
  try {
    reel = fs3.realpathSync.native(ctx.racine);
  } catch {
  }
  const haut = norme(r.stdout.trim());
  return haut === norme(ctx.racine) || haut === norme(reel);
}
function refsDistantes(ctx) {
  const r = git(["for-each-ref", "--format=%(refname)", "refs/remotes"], ctx.racine);
  if (r.code !== 0) return [];
  return r.stdout.split("\n").map((l) => l.trim()).filter((l) => l && !l.endsWith("/HEAD"));
}
function trunkRefs(ctx) {
  if (!estRacineGit(ctx)) return [];
  return refsDistantes(ctx).filter((r) => r.endsWith(`/${TRUNK}`));
}
function shortRef(ref) {
  return ref.replace(/^refs\/remotes\//, "");
}
function stampPath(ctx) {
  return path3.join(ctx.runs, "remote-fetch.json");
}
function lastRefresh(ctx) {
  try {
    const d = JSON.parse(lireTexte(stampPath(ctx)));
    if (typeof d.a === "number") return { ok: d.ok === true, at: d.a };
  } catch {
  }
  return { ok: null, at: null };
}
function refreshRemoteRefs(ctx, options = {}) {
  const last = lastRefresh(ctx);
  if (!options.force && last.at !== null && Date.now() - last.at < FETCH_INTERVAL_MS) return last;
  if (!estRacineGit(ctx)) return { ok: null, at: null };
  if (!git(["remote"], ctx.racine).stdout.trim()) return { ok: null, at: null };
  const r = (0, import_node_child_process2.spawnSync)("git", ["fetch", "--all", "--quiet", "--no-tags"], {
    cwd: ctx.racine,
    encoding: "utf-8",
    windowsHide: true,
    timeout: FETCH_TIMEOUT_MS,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_ASKPASS: "" }
  });
  const now = { ok: r.status === 0, at: Date.now() };
  try {
    fs3.mkdirSync(ctx.runs, { recursive: true });
    ecrireAtomique(stampPath(ctx), JSON.stringify({ a: now.at, ok: now.ok }) + "\n");
  } catch {
  }
  return now;
}
function fileAtRef(ctx, ref, rel) {
  const r = git(["show", `${ref}:${rel}`], ctx.racine);
  return r.code === 0 ? r.stdout : null;
}

// noyau/src/horloge.ts
function isoSecondes(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}
function parseIso(s) {
  if (!s) return null;
  const t = String(s);
  const m = t.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?(Z|[+-]\d{2}:?\d{2})?$/
  );
  if (!m) return null;
  const [, y, mo, d, h, mi, se, tz] = m;
  const ms = Date.UTC(+y, +mo - 1, +d, +(h ?? 0), +(mi ?? 0), +(se ?? 0));
  if (!tz || tz === "Z" || tz === "+00:00" || tz === "+0000") return new Date(ms);
  const sg = tz.startsWith("-") ? -1 : 1;
  const [th, tm] = tz.slice(1).replace(":", "").match(/(\d{2})(\d{2})/).slice(1);
  return new Date(ms - sg * (+th * 60 + +tm) * 6e4);
}

// noyau/src/leases.ts
var fs4 = __toESM(require("node:fs"), 1);
var path4 = __toESM(require("node:path"), 1);
var CAP_DEFAUT = 3;
var STALE_MIN = 30;
var NOMS_RAPPORT = ["REPORT.md", "BLOCKED.md"];
function cfg(ctx) {
  try {
    if (fs4.existsSync(ctx.agents)) return lireYaml(ctx.agents) ?? {};
  } catch {
  }
  return {};
}
function entierSain(valeur, defaut) {
  const n = Math.trunc(Number(valeur));
  return Number.isFinite(n) && n >= 0 ? n : defaut;
}
function plafond(ctx) {
  return entierSain(cfg(ctx).max_live, CAP_DEFAUT);
}
function enPause(ctx) {
  return Boolean(cfg(ctx).paused ?? false);
}
function cheminRecord(ctx, eng) {
  return path4.join(ctx.runs, `${eng}.json`);
}
function chargerRecord(ctx, eng) {
  const p = cheminRecord(ctx, eng);
  if (!fs4.existsSync(p)) return null;
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return null;
  }
}
function worktreeDe(ctx, rec) {
  return String(rec.worktree ?? path4.join(ctx.wt, rec.eng.toLowerCase()));
}
function derniereActivite(ctx, rec) {
  const marques = [];
  for (const s of [rec.last_seen, rec.issued_at]) {
    const d = parseIso(s);
    if (d) marques.push(d);
  }
  const wt = worktreeDe(ctx, rec);
  for (const f of [path4.join(wt, ".eng", "heartbeat"), path4.join(wt, "REPORT.md"), path4.join(wt, "BLOCKED.md")]) {
    try {
      if (fs4.existsSync(f)) marques.push(fs4.statSync(f).mtime);
    } catch {
    }
  }
  if (!marques.length) return null;
  return new Date(Math.max(...marques.map((d) => d.getTime())));
}
function deriverEtat(ctx, rec) {
  if (rec.state === "revoked" || rec.state === "released") return rec.state;
  if (!rec.token) return "legacy";
  const wt = worktreeDe(ctx, rec);
  if (fs4.existsSync(path4.join(wt, "BLOCKED.md"))) return "bloque";
  if (fs4.existsSync(path4.join(wt, "REPORT.md"))) return "livre";
  const exp = parseIso(rec.expires_at);
  if (exp && exp.getTime() < Date.now()) return "expire";
  const vu = derniereActivite(ctx, rec);
  if (vu && Date.now() - vu.getTime() > STALE_MIN * 6e4) return "stale";
  return "active";
}
function listerLeases(ctx) {
  const sortie = [];
  if (!fs4.existsSync(ctx.runs)) return sortie;
  const fichiers = fs4.readdirSync(ctx.runs).filter((f) => /^ENG-.*\.json$/.test(f)).sort();
  for (const f of fichiers) {
    const rec = chargerRecord(ctx, f.replace(/\.json$/, ""));
    if (!rec) continue;
    const etat = deriverEtat(ctx, rec);
    const dossierLivraison = path4.join(ctx.livraisons, rec.eng);
    const aRapport = fs4.existsSync(path4.join(dossierLivraison, "REPORT.md")) || fs4.existsSync(path4.join(dossierLivraison, "BLOCKED.md")) || rapportWorktree(ctx, rec)[1] !== null;
    const vu = derniereActivite(ctx, rec);
    const evenements = Array.isArray(rec.events) ? rec.events : [];
    sortie.push({
      eng: rec.eng,
      promettant: rec.promettant ?? null,
      reserve_par: rec.reserve_par ?? null,
      branch: rec.branch ?? null,
      worktree: rec.worktree ?? null,
      issued_at: rec.issued_at ?? null,
      expires_at: rec.expires_at ?? null,
      last_activity: vu ? isoSecondes(vu) : null,
      seen_min: vu ? Math.floor((Date.now() - vu.getTime()) / 6e4) : null,
      state: etat,
      revoke_motif: rec.revoke_motif ?? null,
      last_event: evenements.length ? evenements[evenements.length - 1].note ?? null : null,
      report: aRapport
    });
  }
  return sortie;
}
function nombreActifs(ctx) {
  return listerLeases(ctx).filter((r) => r.state === "active" || r.state === "stale").length;
}
function rapportWorktree(ctx, rec) {
  const wt = worktreeDe(ctx, rec);
  for (const nom of NOMS_RAPPORT) {
    const p = path4.join(wt, nom);
    if (fs4.existsSync(p)) return [nom, p];
  }
  return [null, null];
}

// noyau/src/fnmatch.ts
function fnmatch(nom, motif) {
  let n = nom;
  if (process.platform === "win32") n = n.toLowerCase().replace(/\\/g, "/");
  return globExpression(motif).test(n);
}
function globExpression(motif) {
  let p = motif;
  if (process.platform === "win32") {
    p = p.toLowerCase().replace(/\//g, "\\");
    p = p.replace(/\\/g, "/");
  }
  let re = "^";
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === "*") re += "[\\s\\S]*";
    else if (c === "?") re += "[\\s\\S]";
    else if (c === "[") {
      let j = i + 1;
      if (p[j] === "!") j++;
      if (p[j] === "]") j++;
      while (j < p.length && p[j] !== "]") j++;
      if (j >= p.length) {
        re += "\\[";
      } else {
        let classe = p.slice(i + 1, j);
        if (classe.startsWith("!")) classe = "^" + classe.slice(1);
        re += "[" + classe.replace(/\\/g, "\\\\") + "]";
        i = j;
      }
    } else re += c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  re += "$";
  return new RegExp(re);
}
function dansMotifs(chemin, motifs) {
  for (const motif of motifs) {
    const p = motif.replace(/\/+$/, "");
    if (fnmatch(chemin, p) || fnmatch(chemin, p + "/*") || chemin === p) return true;
  }
  return false;
}
function compileGlobs(globs) {
  const fold = (s) => process.platform === "win32" ? s.toLowerCase().replace(/\\/g, "/") : s;
  const compiled = globs.map((glob) => {
    const p = glob.replace(/\/+$/, "");
    const m = p.match(/^[^*?[]*/);
    return { glob, p, prefix: fold(m ? m[0] : ""), whole: globExpression(p), below: globExpression(p + "/*") };
  });
  const byTop = /* @__PURE__ */ new Map();
  const noTop = [];
  compiled.forEach((c, i) => {
    const k = c.prefix.indexOf("/");
    if (k < 0) noTop.push(i);
    else {
      const top = c.prefix.slice(0, k);
      if (!byTop.has(top)) byTop.set(top, []);
      byTop.get(top).push(i);
    }
  });
  for (const [top, own] of byTop) byTop.set(top, [...own, ...noTop].sort((a, b) => a - b));
  return (target) => {
    const n = fold(target);
    const k = n.indexOf("/");
    const candidates = byTop.get(k < 0 ? n : n.slice(0, k)) ?? noTop;
    for (const i of candidates) {
      const c = compiled[i];
      if (target === c.p) return c.glob;
      if (!n.startsWith(c.prefix)) continue;
      if (c.whole.test(n) || c.below.test(n)) return c.glob;
    }
    return null;
  };
}
function prefixeLitteral(motif) {
  const m = motif.match(/^[^*?[]*/);
  return (m ? m[0] : "").replace(/\/+$/, "");
}
var MANIFESTES_DE_DEPENDANCES = ["Cargo.toml", "Cargo.lock", "pnpm-lock.yaml", "package-lock.json", "yarn.lock"];
var FICHIERS_GENERES = ["90_TRACEABILITY_MATRIX.md", "90_MATRICE_TRACABILITE.md"];
var MANIFESTES_PARTAGES = [...MANIFESTES_DE_DEPENDANCES, ...FICHIERS_GENERES];
function nomExact(motif) {
  const p = prefixeLitteral(motif);
  if (!p || p !== motif.replace(/\/+$/, "")) return null;
  return p.split("/").pop() ?? null;
}
function estManifestePartage(motif) {
  const nom = nomExact(motif);
  return nom !== null && MANIFESTES_PARTAGES.includes(nom);
}
function chevauchement(a, b, options = {}) {
  const paires = [];
  const retenu = (m) => options.toutChemin === true || !estManifestePartage(m);
  for (const ma of a.filter(retenu)) {
    const pa = prefixeLitteral(ma);
    for (const mb of b.filter(retenu)) {
      const pb = prefixeLitteral(mb);
      if (!pa || !pb) continue;
      const na = pa.toLowerCase();
      const nb = pb.toLowerCase();
      if (na.startsWith(nb) || nb.startsWith(na)) paires.push([ma, mb]);
    }
  }
  return paires;
}

// noyau/src/config.ts
var fs5 = __toESM(require("node:fs"), 1);
var CONFIG_DEFAUT = {
  fraicheur_bloquante: false,
  collision_chemins_bloquante: false,
  doc_bloquante: false,
  mandat_ttl_minutes: 120,
  ruptures_lignee_avant_da: 3,
  journal_rotation_mo: 10,
  langue_bloquante: false,
  charte_bloquante: true,
  question_bloquante: true,
  push_apres_integration: true,
  prior_work_blocking: true,
  push_after_transaction: true,
  remote_fetch_seconds: 60,
  auto_fast_forward: true,
  claims_par_chemins: false,
  essais_requis: true,
  integration_master_avance_bloquante: true,
  rejets_consecutifs_bloquants: true,
  runtime_commite_requis: true,
  verification_attendue_heures: 2,
  mandat_distant_bloquant: true,
  claims_desactivees: false,
  essai_budget_minutes: 10,
  scope_auto_elargi: true
};
function lireConfig(ctx) {
  const out = { ...CONFIG_DEFAUT };
  if (!fs5.existsSync(ctx.config)) return out;
  try {
    const d = lireYaml(ctx.config) ?? {};
    for (const k of Object.keys(out)) {
      if (d[k] !== void 0 && d[k] !== null) {
        if (typeof out[k] === "boolean") out[k] = Boolean(d[k]);
        else out[k] = Number(d[k]);
      }
    }
  } catch {
  }
  return out;
}

// noyau/src/claims.ts
function chargerClaims(ctx) {
  if (!fs6.existsSync(ctx.claims)) return [];
  try {
    const data = lireYaml(ctx.claims) ?? {};
    const liste = data.claims;
    return Array.isArray(liste) ? liste.map(normaliser) : [];
  } catch {
    return [];
  }
}
function normaliser(c) {
  const sortie = { domaine: String(c.domaine ?? "").toUpperCase(), eng: String(c.eng ?? ""), owner: String(c.owner ?? ""), expires: String(c.expires ?? "") };
  if (Array.isArray(c.paths)) sortie.paths = c.paths.map(String);
  return sortie;
}
function expiree(claim, maintenant = /* @__PURE__ */ new Date()) {
  const exp = parseIso(claim.expires);
  if (!exp) return true;
  return exp.getTime() < maintenant.getTime();
}
var ETATS_RENDUS = /* @__PURE__ */ new Set(["expire", "released"]);
function etatLease(ctx, eng) {
  const rec = chargerRecord(ctx, eng);
  return rec ? deriverEtat(ctx, rec) : null;
}
function detenue(ctx, claim) {
  const etat = etatLease(ctx, String(claim.eng ?? ""));
  if (etat === null) return !expiree(claim);
  return !ETATS_RENDUS.has(etat);
}
function reservationsParChemins(ctx) {
  return lireConfig(ctx).claims_par_chemins;
}
function reservationsDesactivees(ctx) {
  return lireConfig(ctx).claims_desactivees;
}
function titulaireBloque(parChemins, titulaire, chemins, cheminsDe) {
  if (!parChemins) return [];
  const siens = titulaire.paths ?? cheminsDe?.(titulaire.eng);
  if (!siens) return [];
  const paires = chevauchement(chemins, siens);
  return paires.length ? paires : null;
}
function domainesOccupes(ctx) {
  const occupes = /* @__PURE__ */ new Map();
  occupes.parChemins = reservationsParChemins(ctx);
  occupes.sansReservation = reservationsDesactivees(ctx);
  if (occupes.sansReservation) return occupes;
  for (const c of chargerClaims(ctx)) {
    if (!detenue(ctx, c)) continue;
    const dom = String(c.domaine).toUpperCase();
    const liste = occupes.get(dom) ?? [];
    const titulaire = { eng: String(c.eng), owner: String(c.owner ?? "") };
    if (c.paths) titulaire.paths = c.paths;
    liste.push(titulaire);
    occupes.set(dom, liste);
  }
  return occupes;
}

// noyau/src/streams.ts
var fs7 = __toESM(require("node:fs"), 1);
var path5 = __toESM(require("node:path"), 1);
var crypto = __toESM(require("node:crypto"), 1);
var IMPLICIT_STREAM = "product";
var OPEN_STATUSES = ["propose", "pris"];
var RE_NAME = /^[a-z0-9][a-z0-9._-]*$/;
var RE_DOMAIN = /^[A-Z]{2,6}$/;
function relativePath(ctx, p) {
  return path5.relative(ctx.racine, p).split(path5.sep).join("/");
}
function implicitStream(ctx) {
  return { name: IMPLICIT_STREAM, domains: [], requirements: relativePath(ctx, ctx.recette), paths: ["**"], implicit: true };
}
function asList(v) {
  if (v === void 0 || v === null) return [];
  return Array.isArray(v) ? v : null;
}
function parseStreams(ctx, text) {
  const fileName = relativePath(ctx, ctx.streams);
  const result = { file: ctx.streams, declared: true, streams: [], problems: [] };
  let data;
  try {
    data = lireYamlSur(text);
  } catch (e) {
    result.problems.push(`${fileName}: unreadable YAML (${e.message.split("\n")[0]})`);
    return result;
  }
  if (data === null || data === void 0) return { ...result, declared: false, streams: [implicitStream(ctx)] };
  if (typeof data !== "object" || Array.isArray(data)) {
    result.problems.push(`${fileName}: the file must hold a mapping with the key \`streams\``);
    return result;
  }
  const entries = asList(data.streams);
  if (entries === null) {
    result.problems.push(`${fileName}: \`streams\` must be a list`);
    return result;
  }
  if (!entries.length) return { ...result, declared: false, streams: [implicitStream(ctx)] };
  entries.forEach((raw, i) => {
    const rank = `stream ${i + 1}`;
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      result.problems.push(`${fileName}: ${rank} is not a mapping with name, domains, requirements and paths`);
      return;
    }
    const s = raw;
    const name = typeof s.name === "string" ? s.name.trim() : "";
    if (!RE_NAME.test(name)) {
      result.problems.push(`${fileName}: ${rank} has no valid name (lower case letters, digits, dots and hyphens): \`${String(s.name ?? "")}\``);
    }
    const who = name ? `stream \`${name}\`` : rank;
    const rawDomains = asList(s.domains);
    if (rawDomains === null) result.problems.push(`${fileName}: the domains of ${who} must be a list`);
    const domains = [];
    for (const d of rawDomains ?? []) {
      const code = String(d).trim().toUpperCase();
      if (!RE_DOMAIN.test(code)) result.problems.push(`${fileName}: ${who} declares the domain \`${String(d)}\`, which is not a domain code`);
      else if (!domains.includes(code)) domains.push(code);
    }
    const requirements = typeof s.requirements === "string" ? s.requirements.trim().replace(/\\/g, "/").replace(/\/+$/, "") : "";
    if (!requirements) result.problems.push(`${fileName}: ${who} states no requirements folder`);
    else if (path5.isAbsolute(requirements) || requirements.split("/").includes("..")) {
      result.problems.push(`${fileName}: the requirements folder of ${who} must lie inside the repository: \`${requirements}\``);
    }
    const rawPaths = asList(s.paths);
    if (rawPaths === null) result.problems.push(`${fileName}: the paths of ${who} must be a list of globs`);
    const paths = (rawPaths ?? []).map((p) => String(p).trim()).filter(Boolean);
    result.streams.push({ name, domains, requirements, paths, implicit: false });
  });
  return result;
}
var declarationCache = /* @__PURE__ */ new Map();
function readStreams(ctx) {
  let stats;
  try {
    stats = fs7.statSync(ctx.streams);
  } catch {
    return { file: ctx.streams, declared: false, streams: [implicitStream(ctx)], problems: [] };
  }
  const key = `${stats.mtimeMs}:${stats.size}:${ctx.racine}`;
  const known = declarationCache.get(ctx.streams);
  if (known && known.key === key) return known.declaration;
  let declaration;
  try {
    declaration = parseStreams(ctx, lireTexte(ctx.streams));
  } catch (e) {
    declaration = { file: ctx.streams, declared: true, streams: [], problems: [`${relativePath(ctx, ctx.streams)}: unreadable (${String(e.message)})`] };
  }
  declarationCache.set(ctx.streams, { key, declaration });
  return declaration;
}
function streamOfDomain(d, domain) {
  if (!d.declared) return d.streams[0] ?? null;
  const code = domain.toUpperCase();
  return d.streams.find((s) => s.domains.includes(code)) ?? null;
}
function domainsOf(e) {
  const scope = e.scope ?? {};
  return Array.isArray(scope.domaines) ? scope.domaines.map((x) => String(x).toUpperCase()) : [];
}
function streamOfCommitment(d, e) {
  const codes = domainsOf(e);
  if (!d.declared) {
    const implicit = d.streams[0] ?? null;
    return { stream: implicit, across: [], domains: codes.map((x) => ({ domain: x, stream: implicit?.name ?? null })), unowned: [] };
  }
  const domains = codes.map((x) => ({ domain: x, stream: streamOfDomain(d, x)?.name ?? null }));
  const names = [...new Set(domains.map((x) => x.stream).filter((x) => x !== null))];
  const streams = names.map((n) => d.streams.find((s) => s.name === n));
  return {
    stream: streams.length === 1 ? streams[0] : null,
    across: streams.length > 1 ? streams : [],
    domains,
    unowned: domains.filter((x) => x.stream === null).map((x) => x.domain)
  };
}
var overlapCache = /* @__PURE__ */ new Map();
function overlaps(ctx, d) {
  const r = git(["ls-files", "-z"], ctx.racine);
  if (r.code !== 0) return null;
  const key = crypto.createHash("sha1").update(JSON.stringify(d.streams.map((s) => [s.name, s.paths]))).update(r.stdout).digest("hex");
  const known = overlapCache.get(ctx.racine);
  if (known && known.key === key) return known.found;
  const matchers = d.streams.map((s) => ({ name: s.name, match: compileGlobs(s.paths) }));
  const pairs = /* @__PURE__ */ new Map();
  for (const file of r.stdout.split("\0")) {
    if (!file) continue;
    const owners = [];
    for (const c of matchers) {
      const glob = c.match(file);
      if (glob !== null) owners.push({ name: c.name, glob });
    }
    for (let i = 0; i < owners.length; i++) {
      for (let j = i + 1; j < owners.length; j++) {
        const [x, y] = [owners[i], owners[j]];
        const k = JSON.stringify([x.name, x.glob, y.name, y.glob]);
        const p = pairs.get(k);
        if (p) p.files += 1;
        else pairs.set(k, { a: x.name, globA: x.glob, b: y.name, globB: y.glob, files: 1, example: file });
      }
    }
  }
  const found = [...pairs.values()];
  overlapCache.set(ctx.racine, { key, found });
  return found;
}
function checkStreams(ctx, engs) {
  const result = { declaration: [], commitments: [], warnings: [] };
  const d = readStreams(ctx);
  result.declaration.push(...d.problems);
  if (!d.declared) return result;
  const fileName = relativePath(ctx, ctx.streams);
  const seen = /* @__PURE__ */ new Set();
  for (const s of d.streams) {
    if (!s.name) continue;
    if (seen.has(s.name)) result.declaration.push(`${fileName}: the stream name \`${s.name}\` is declared twice`);
    seen.add(s.name);
  }
  const ownerOf = /* @__PURE__ */ new Map();
  for (const s of d.streams) {
    for (const dom of s.domains) {
      const other = ownerOf.get(dom);
      if (other !== void 0 && other !== s.name) {
        result.declaration.push(`${fileName}: domain ${dom} is declared in two streams, \`${other}\` and \`${s.name}\``);
      } else ownerOf.set(dom, s.name);
    }
    if (!s.domains.length && s.name) result.warnings.push(`${fileName}: stream \`${s.name}\` owns no domain, so no commitment can belong to it`);
  }
  for (const s of d.streams) {
    if (!s.requirements || path5.isAbsolute(s.requirements) || s.requirements.split("/").includes("..")) continue;
    const folder = path5.join(ctx.racine, s.requirements);
    if (!fs7.existsSync(folder) || !fs7.statSync(folder).isDirectory()) {
      result.declaration.push(`${fileName}: the requirements folder \`${s.requirements}\` of stream \`${s.name}\` does not exist`);
    }
  }
  if (d.streams.length > 1) {
    const c = overlaps(ctx, d);
    if (c === null) {
      result.warnings.push(`${fileName}: the tracked files could not be listed by git, so the overlap of the path globs is not checked`);
    }
    for (const x of c ?? []) {
      result.declaration.push(
        `${fileName}: ${x.files} tracked file(s) are owned by two streams, \`${x.a}\` through \`${x.globA}\` and \`${x.b}\` through \`${x.globB}\`, for example ${x.example}`
      );
    }
  }
  for (const [eid, e] of engs) {
    const s = streamOfCommitment(d, e);
    if (s.across.length) {
      const detail = s.domains.filter((x) => x.stream !== null).map((x) => `${x.domain} to \`${x.stream}\``).join(", ");
      if (OPEN_STATUSES.includes(String(e.statut ?? ""))) {
        result.commitments.push({ eng: eid, message: `${eid}: its domains belong to ${s.across.length} streams (${detail}); a commitment belongs to one stream` });
      } else {
        result.warnings.push(
          `${eid}: closed (${String(e.statut ?? "?")}) with domains in ${s.across.length} streams (${detail}); kept as written, since a closed commitment holds no claim`
        );
      }
    }
    for (const dom of s.unowned) result.warnings.push(`${eid}: domain ${dom} belongs to no declared stream`);
  }
  return result;
}
function anchorRefusals(ctx, messages) {
  if (!messages.length) return [];
  let lines = [];
  try {
    lines = lireTexte(ctx.streams).split("\n");
  } catch {
    lines = [];
  }
  const lineOf = (name) => {
    const re = new RegExp(`^\\s*(?:-\\s+)?name:\\s*["']?${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']?\\s*$`);
    return lines.findIndex((l) => re.test(l)) + 1;
  };
  return messages.map((message) => {
    const named = [...message.matchAll(/`([a-z0-9][a-z0-9._-]*)`/g)].map((m) => m[1]).find((n) => lineOf(n) > 0);
    return { message, stream: named ?? null, line: named ? lineOf(named) : 1 };
  });
}

// noyau/src/specs.ts
var fs8 = __toESM(require("node:fs"), 1);
var path6 = __toESM(require("node:path"), 1);
var CODIFICATION_FILE = "02_CODIFICATION.md";
function tableCodification(codification, folder) {
  const table = /* @__PURE__ */ new Map();
  const texte = lireTexte(codification);
  for (const ligne of texte.split("\n")) {
    const m = ligne.match(/^\|\s*([A-Z]{2,4})\s*\|[^|]*\|\s*`([^`]+)`\s*\|/);
    if (m) table.set(m[1], path6.join(folder, m[2]));
  }
  return table;
}
function fichiersDomaines(ctx) {
  const d = readStreams(ctx);
  if (!d.declared) return tableCodification(ctx.codification, ctx.recette);
  const table = /* @__PURE__ */ new Map();
  for (const source of requirementSources(ctx, d, { chapterFiles: false })) {
    for (const [dom, f] of source.domains) if (!table.has(dom)) table.set(dom, f);
  }
  return table;
}
var RE_TETE_EXIGENCE = /^### SPEC-[A-Z]{2,6}-\d{3}\b/m;
function fichiersAvecExigences(folder) {
  let noms;
  try {
    noms = fs8.readdirSync(folder).filter((n) => n.endsWith(".md")).sort();
  } catch {
    return [];
  }
  return noms.map((n) => path6.join(folder, n)).filter((f) => RE_TETE_EXIGENCE.test(texteDomaine(f) ?? ""));
}
function requirementSources(ctx, declaration, options = {}) {
  const d = declaration ?? readStreams(ctx);
  const parDossier = /* @__PURE__ */ new Map();
  if (!d.declared) parDossier.set(path6.relative(ctx.racine, ctx.recette).split(path6.sep).join("/"), [d.streams[0]?.name ?? "product"]);
  else {
    for (const s of d.streams) {
      if (!s.requirements || path6.isAbsolute(s.requirements) || s.requirements.split("/").includes("..")) continue;
      if (!parDossier.has(s.requirements)) parDossier.set(s.requirements, []);
      parDossier.get(s.requirements).push(s.name);
    }
  }
  const sources = [];
  for (const [rel, streams] of parDossier) {
    const folder = path6.join(ctx.racine, rel);
    if (!fs8.existsSync(folder)) continue;
    const codification = path6.join(folder, CODIFICATION_FILE);
    if (fs8.existsSync(codification)) {
      const files2 = options.chapterFiles === false ? [] : fichiersAvecExigences(folder);
      sources.push({ streams, folder, rel, form: "chapters", domains: tableCodification(codification, folder), files: files2 });
      continue;
    }
    const files = fichiersAvecExigences(folder);
    const domains = /* @__PURE__ */ new Map();
    for (const f of files) {
      for (const b of blocsExigences(texteDomaine(f) ?? "")) {
        const dom = b.id.split("-")[1];
        if (!domains.has(dom)) domains.set(dom, f);
      }
    }
    sources.push({ streams, folder, rel, form: "file", domains, files });
  }
  return sources;
}
function requirementIndex(ctx, declaration) {
  const d = declaration ?? readStreams(ctx);
  const index = /* @__PURE__ */ new Map();
  for (const source of requirementSources(ctx, d)) {
    for (const f of source.files) {
      for (const b of blocsExigences(texteDomaine(f) ?? "")) {
        if (index.has(b.id)) continue;
        let streams = source.streams;
        if (d.declared && streams.length > 1) {
          const owner = streamOfDomain(d, b.id.split("-")[1])?.name;
          if (owner && streams.includes(owner)) streams = [owner];
        }
        index.set(b.id, { id: b.id, file: f, streams });
      }
    }
  }
  return index;
}
var cacheTextes = /* @__PURE__ */ new Map();
function texteDomaine(chemin) {
  if (!fs8.existsSync(chemin)) return null;
  const st = fs8.statSync(chemin);
  const connu = cacheTextes.get(chemin);
  if (connu && connu.mtimeMs === st.mtimeMs) return connu.texte;
  const texte = lireTexte(chemin);
  cacheTextes.set(chemin, { mtimeMs: st.mtimeMs, texte });
  return texte;
}
var IMPLEMENTE = ["IMPLEMENTED", "IMPL\xC9MENT\xC9"];
function estImplemente(statut) {
  return IMPLEMENTE.includes(statut);
}
function statutSpec(specId, fichiers) {
  const dom = specId.split("-")[1];
  const chemin = fichiers.get(dom);
  if (!chemin) return "INCONNU";
  const texte = texteDomaine(chemin);
  if (texte === null) return "INCONNU";
  const echappe = specId.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  const m = texte.match(new RegExp(`^### ${echappe}\\b[\\s\\S]*?^-\\s*(?:Status|Statut)\\s*: ([A-Z\xC9]+)`, "m"));
  return m ? m[1] : "INCONNU";
}
var CHAMPS = {
  statut: ["Status", "Statut"],
  priorite: ["Acceptance priority", "Priorit\xE9 recette"],
  implementation: ["Implementation", "Impl\xE9mentation"]
};
function champ(bloc, libelles) {
  const alternatives = libelles.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const m = bloc.match(new RegExp(`^-\\s*(?:${alternatives})\\s*:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : null;
}
function blocsExigences(texte) {
  const blocs = [];
  const re = /^### (SPEC-[A-Z]{2,4}-\d{3})[ \t]?:[ \t]*(.+?)[ \t]*$([\s\S]*?)(?=^### |$(?![\s\S]))/gm;
  for (const m of texte.replace(/\r\n/g, "\n").matchAll(re)) {
    const bloc = m[3];
    const statut = champ(bloc, CHAMPS.statut);
    const priorite = champ(bloc, CHAMPS.priorite);
    blocs.push({
      id: m[1],
      titre: m[2].trim(),
      statut: statut ? statut.split(/\s/)[0] : "?",
      priorite: priorite ? priorite.split(/\s/)[0] : "?",
      implementation: champ(bloc, CHAMPS.implementation) ?? ""
    });
  }
  return blocs;
}
var RESTE_A_FAIRE = ["PARTIAL", "PLANNED", "PARTIEL", "PLANIFI\xC9", "PLANIFIE"];
var FORMES = [
  ["IMPLEMENTED", "IMPL\xC9MENT\xC9", "IMPLEMENTE"],
  ["PARTIAL", "PARTIEL"],
  ["PLANNED", "PLANIFI\xC9", "PLANIFIE"]
];
function formesDuStatut(statut) {
  const s = statut.toUpperCase();
  return [...FORMES.find((f) => f.includes(s)) ?? [s]];
}
function checkRequirementCitations(ctx, engs) {
  const d = readStreams(ctx);
  if (!d.declared || d.problems.length) return [];
  const index = requirementIndex(ctx, d);
  const warnings = [];
  for (const [eid, e] of engs) {
    const cited = Array.isArray(e.exigences) ? e.exigences.map(String) : [];
    if (!cited.length) continue;
    const own = streamOfCommitment(d, e).stream?.name ?? null;
    for (const spec of cited) {
      const entry = index.get(spec);
      if (!entry) {
        warnings.push(`${eid}: cites ${spec}, which the requirements folder of no declared stream holds`);
        continue;
      }
      if (own && entry.streams.length && !entry.streams.includes(own)) {
        warnings.push(
          `${eid}: cites ${spec}, a requirement of stream \`${entry.streams.join("`, `")}\`, while its domains belong to stream \`${own}\``
        );
      }
    }
  }
  return warnings;
}

// noyau/src/dag.ts
var STATUTS = /* @__PURE__ */ new Set(["propose", "pris", "tenu", "rompu", "abandonne", "remplace"]);
var STATUTS_CLOS = /* @__PURE__ */ new Set(["tenu", "rompu", "abandonne", "remplace"]);
function estClos(statut) {
  return STATUTS_CLOS.has(String(statut));
}
var RE_REMPLACE_PAR = /^ENG-\d{4}$/;
function cibleRemplacement(engs, eid) {
  let courant = eid;
  const vus = /* @__PURE__ */ new Set([eid]);
  for (; ; ) {
    const e = engs.get(courant);
    if (!e || String(e.statut) !== "remplace") return courant;
    const suivant = String(e.remplace_par ?? "");
    if (!engs.has(suivant) || vus.has(suivant)) return courant;
    vus.add(suivant);
    courant = suivant;
  }
}
function statutEffectif(engs, eid) {
  const cible = cibleRemplacement(engs, eid);
  return String(engs.get(cible)?.statut ?? "?");
}
function predecesseurSatisfait(engs, eid) {
  const st = statutEffectif(engs, eid);
  return st === "tenu" || st === "abandonne";
}
var TYPES_ENG = /* @__PURE__ */ new Set(["realisation", "reponse", "revue"]);
var TYPES_DEP = /* @__PURE__ */ new Set(["finish-start", "interface", "info"]);
var VARIANCES = /* @__PURE__ */ new Set([
  "spec_ambigue",
  "dependance",
  "estimation",
  "abandon",
  "technique",
  "non_reponse"
]);
var RE_SPEC = /^SPEC-[A-Z]{2,4}-\d{3}$/;
var RE_ENG = /^ENG-\d{4}$/;
var cacheFichiers = /* @__PURE__ */ new Map();
function chargerFichier(chemin) {
  const st = fs9.statSync(chemin);
  const connu = cacheFichiers.get(chemin);
  if (connu && connu.mtimeMs === st.mtimeMs && connu.taille === st.size) return connu;
  let entree;
  try {
    const data = lireYamlSur(lireTexte(chemin));
    if (typeof data !== "object" || data === null || Array.isArray(data) || !("id" in data)) {
      entree = { mtimeMs: st.mtimeMs, taille: st.size, data: null, erreur: "pas un engagement (champ id absent)" };
    } else {
      entree = { mtimeMs: st.mtimeMs, taille: st.size, data, erreur: null };
    }
  } catch (e) {
    entree = {
      mtimeMs: st.mtimeMs,
      taille: st.size,
      data: null,
      erreur: `YAML invalide (${e.message.split("\n")[0]})`
    };
  }
  cacheFichiers.set(chemin, entree);
  return entree;
}
function chargerRegistre(ctx, erreurs, structurees) {
  const engs = /* @__PURE__ */ new Map();
  if (!fs9.existsSync(ctx.engagements)) {
    erreurs.push(`r\xE9pertoire absent : ${ctx.engagements}`);
    structurees?.push({ fichier: null, id: null, champ: null, message: `r\xE9pertoire absent : ${ctx.engagements}` });
    return engs;
  }
  const fichiers = fs9.readdirSync(ctx.engagements).filter((f) => /^ENG-.*\.yaml$/.test(f)).sort();
  for (const f of fichiers) {
    const chemin = path7.join(ctx.engagements, f);
    const entree = chargerFichier(chemin);
    const stem = f.replace(/\.yaml$/, "");
    if (entree.erreur || !entree.data) {
      const msg = `${f} : ${entree.erreur ?? "illisible"}`;
      erreurs.push(msg);
      structurees?.push({ fichier: f, id: null, champ: null, message: msg });
      continue;
    }
    const data = entree.data;
    if (String(data.id) !== stem) {
      const msg = `${f} : id \`${data.id}\` ne correspond pas au nom de fichier`;
      erreurs.push(msg);
      structurees?.push({ fichier: f, id: String(data.id), champ: "id", message: msg });
    }
    if (engs.has(String(data.id))) {
      const msg = `${f} : id dupliqu\xE9`;
      erreurs.push(msg);
      structurees?.push({ fichier: f, id: String(data.id), champ: "id", message: msg });
      continue;
    }
    engs.set(String(data.id), data);
  }
  return engs;
}
function dependsOn(e) {
  const d = e.depends_on;
  return Array.isArray(d) ? d : [];
}
function exigences(e) {
  const x = e.exigences;
  return Array.isArray(x) ? x.map(String) : [];
}
function domaines(e) {
  const scope = e.scope ?? {};
  const d = scope.domaines;
  return Array.isArray(d) ? d.map(String) : [];
}
function cheminsScope(e) {
  const scope = e.scope ?? {};
  const p = scope.paths;
  return Array.isArray(p) ? p.map(String) : [];
}
function chargerJalons(ctx) {
  const jalons = /* @__PURE__ */ new Map();
  if (!fs9.existsSync(ctx.milestones)) return jalons;
  for (const ligne of lireTexte(ctx.milestones).split("\n")) {
    const m = ligne.match(/^\|\s*(J-[A-Z0-9]+)\s*\|[^|]*\|([^|]*)\|/);
    if (m) jalons.set(m[1], m[2].match(/SPEC-[A-Z]{2,4}-\d{3}/g) ?? []);
  }
  return jalons;
}
function valider(ctx, engs, structurees) {
  const erreurs = [];
  const avertissements = [];
  const jalons = chargerJalons(ctx);
  const pousser = (eid, champ2, message) => {
    erreurs.push(message);
    structurees?.push({ fichier: `${eid}.yaml`, id: eid, champ: champ2, message });
  };
  for (const [eid, e] of engs) {
    if (!RE_ENG.test(eid)) pousser(eid, "id", `${eid} : identifiant hors format ENG-NNNN`);
    if (!TYPES_ENG.has(String(e.type))) pousser(eid, "type", `${eid} : type \`${e.type}\` invalide`);
    const statut = e.statut;
    if (!statut || !STATUTS.has(statut)) pousser(eid, "statut", `${eid} : statut \`${statut}\` invalide`);
    if (statut === "pris" && !e.promettant) pousser(eid, "promettant", `${eid} : pris sans promettant`);
    if (statut === "rompu" || statut === "abandonne") {
      const v = e.variance ?? {};
      if (typeof v !== "object" || v === null || !VARIANCES.has(String(v.raison))) {
        pousser(eid, "variance", `${eid} : ${statut} sans raison de variance valide`);
      }
    }
    if (statut === "remplace") {
      const par = String(e.remplace_par ?? "");
      if (!RE_REMPLACE_PAR.test(par)) {
        pousser(eid, "remplace_par", `${eid} : remplace sans remplace_par au format ENG-NNNN`);
      } else if (par === eid) {
        pousser(eid, "remplace_par", `${eid} : remplace par lui-m\xEAme`);
      } else if (!engs.has(par)) {
        pousser(eid, "remplace_par", `${eid} : remplace par un engagement inexistant \`${par}\``);
      } else {
        const vus = /* @__PURE__ */ new Set([eid]);
        let courant = par;
        while (engs.has(courant) && String(engs.get(courant).statut) === "remplace") {
          if (vus.has(courant)) {
            pousser(eid, "remplace_par", `${eid} : cycle de remplacement par ${[...vus, courant].join(" -> ")}`);
            break;
          }
          vus.add(courant);
          courant = String(engs.get(courant).remplace_par ?? "");
        }
      }
    } else if (e.remplace_par !== void 0 && e.remplace_par !== null) {
      avertissements.push(`${eid} : remplace_par port\xE9 par un engagement qui n'est pas remplace (${statut})`);
    }
    for (const spec of exigences(e)) {
      if (!RE_SPEC.test(spec)) avertissements.push(`${eid} : exigence \`${spec}\` hors format SPEC-DOM-NNN`);
    }
    const ben = String(e.beneficiaire ?? "");
    if (ben.startsWith("jalon:") && jalons.size && !jalons.has(ben.split(":", 2)[1])) {
      avertissements.push(`${eid} : b\xE9n\xE9ficiaire \`${ben}\` absent de MILESTONES.md`);
    }
    for (const dep of dependsOn(e)) {
      if (typeof dep !== "object" || dep === null || !("eng" in dep)) {
        pousser(eid, "depends_on", `${eid} : d\xE9pendance mal form\xE9e : ${JSON.stringify(dep)}`);
        continue;
      }
      if (!engs.has(String(dep.eng))) {
        pousser(eid, "depends_on", `${eid} : d\xE9pendance vers engagement inexistant \`${dep.eng}\``);
      }
      if (!TYPES_DEP.has(String(dep.type))) {
        pousser(eid, "depends_on", `${eid} : type de d\xE9pendance \`${dep.type}\` invalide`);
      }
    }
    if (e.reprend !== void 0 && e.reprend !== null) {
      const cible = String(e.reprend);
      if (!engs.has(cible)) {
        pousser(eid, "reprend", `${eid} : reprend un engagement inexistant \`${cible}\``);
      } else {
        const st = String(engs.get(cible).statut);
        if (!estClos(st)) {
          avertissements.push(`${eid} : reprend \`${cible}\` qui n'est pas clos (${st})`);
        }
      }
    }
  }
  const couleur = /* @__PURE__ */ new Map();
  const visiter = (noeud, pile) => {
    couleur.set(noeud, 1);
    for (const dep of dependsOn(engs.get(noeud) ?? { id: noeud })) {
      const nxt = String(dep.eng ?? "");
      if (!engs.has(nxt)) continue;
      if (couleur.get(nxt) === 1) {
        const idx = pile.indexOf(nxt);
        const cycle = idx >= 0 ? [...pile.slice(idx), nxt] : [noeud, nxt];
        pousser(noeud, "depends_on", "cycle de pr\xE9c\xE9dence : " + cycle.join(" -> "));
      } else if (!couleur.get(nxt)) {
        visiter(nxt, [...pile, nxt]);
      }
    }
    couleur.set(noeud, 2);
  };
  for (const eid of engs.keys()) if (!couleur.get(eid)) visiter(eid, [eid]);
  const streams = checkStreams(ctx, engs);
  erreurs.push(...streams.declaration);
  if (structurees) {
    for (const r of anchorRefusals(ctx, streams.declaration)) {
      structurees.push({ fichier: null, id: null, champ: null, message: r.message, chemin: ctx.streams, ligne: r.line });
    }
  }
  for (const c of streams.commitments) pousser(c.eng, "scope", c.message);
  avertissements.push(...streams.warnings);
  avertissements.push(...checkRequirementCitations(ctx, engs));
  return { erreurs, avertissements };
}
function claimsBloquantes(engs, eid, occupes) {
  const e = engs.get(eid);
  if (!e || !occupes) return [];
  const sortie = [];
  const chemins = cheminsScope(e);
  const cheminsDe = (id) => engs.has(id) ? cheminsScope(engs.get(id)) : void 0;
  for (const d of domaines(e).map((x) => x.toUpperCase())) {
    for (const t of occupes.get(d) ?? []) {
      if (t.eng === eid) continue;
      const conflit = titulaireBloque(occupes.parChemins === true, t, chemins, cheminsDe);
      if (conflit === null) continue;
      const bloquante = { domaine: d, eng: t.eng, owner: t.owner };
      if (conflit.length) bloquante.chemins = conflit.map(([a, b]) => `${a} ~ ${b}`);
      sortie.push(bloquante);
    }
  }
  return sortie;
}
function etatCalcule(engs, eid, occupes) {
  const e = engs.get(eid);
  const statut = e.statut;
  if (statut !== "propose") return statut ?? "?";
  const fsPreds = dependsOn(e).filter((d) => d.type === "finish-start" && engs.has(String(d.eng))).map((d) => String(d.eng));
  if (fsPreds.some((p) => statutEffectif(engs, p) === "rompu")) return "gele";
  if (fsPreds.some((p) => !predecesseurSatisfait(engs, p))) return "en_attente";
  for (const d of dependsOn(e)) {
    if (d.type === "interface" && engs.has(String(d.eng))) {
      const pred = engs.get(cibleRemplacement(engs, String(d.eng)));
      if (!predecesseurSatisfait(engs, String(d.eng)) && !pred.contrat) return "en_attente";
    }
  }
  const readiness = e.readiness;
  if (Array.isArray(readiness) && readiness.length && e.readiness_ok !== true) return "en_attente";
  if (claimsBloquantes(engs, eid, occupes).length) return "domaine_occupe";
  return "pret";
}
function retenusParClaims(engs, occupes) {
  const sortie = [];
  for (const eid of [...engs.keys()].sort()) {
    if (etatCalcule(engs, eid, occupes) === "domaine_occupe") sortie.push({ eng: eid, claims: claimsBloquantes(engs, eid, occupes) });
  }
  return sortie;
}
function successeurs(engs) {
  const succ = /* @__PURE__ */ new Map();
  for (const eid of engs.keys()) succ.set(eid, []);
  for (const [eid, e] of engs) {
    for (const dep of dependsOn(e)) {
      const cible = String(dep.eng ?? "");
      if (engs.has(cible)) succ.get(cible).push([eid, String(dep.type ?? "?")]);
    }
  }
  return succ;
}
function dependantsTransitifs(engs, eid) {
  const succ = successeurs(engs);
  const vus = /* @__PURE__ */ new Set();
  const pile = [eid];
  while (pile.length) {
    for (const [nxt] of succ.get(pile.pop()) ?? []) {
      if (!vus.has(nxt)) {
        vus.add(nxt);
        pile.push(nxt);
      }
    }
  }
  return vus;
}
function frontiere(engs, occupes) {
  const out = [];
  for (const eid of engs.keys()) {
    if (etatCalcule(engs, eid, occupes) === "pret") out.push([eid, dependantsTransitifs(engs, eid).size]);
  }
  return out.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}
function cheminsCritiques(ctx, engs) {
  const jalons = chargerJalons(ctx);
  const memo2 = /* @__PURE__ */ new Map();
  const chaine2 = (eid) => {
    const connu = memo2.get(eid);
    if (connu) return connu;
    const e = engs.get(eid);
    if (e.statut === "tenu" || e.statut === "abandonne") {
      memo2.set(eid, []);
      return [];
    }
    if (e.statut === "remplace") {
      const cible = cibleRemplacement(engs, eid);
      const res2 = cible === eid ? [] : chaine2(cible);
      memo2.set(eid, res2);
      return res2;
    }
    let best = [];
    for (const dep of dependsOn(e)) {
      if (dep.type === "finish-start" && engs.has(String(dep.eng))) {
        const c = chaine2(String(dep.eng));
        if (c.length > best.length) best = c;
      }
    }
    const res = [...best, eid];
    memo2.set(eid, res);
    return res;
  };
  const resultat = {};
  for (const [jid, specs] of jalons) {
    let best = [];
    for (const [eid, e] of engs) {
      const lie = String(e.beneficiaire ?? "") === `jalon:${jid}` || exigences(e).some((s) => specs.includes(s));
      if (lie) {
        const c = chaine2(eid);
        if (c.length > best.length) best = c;
      }
    }
    resultat[jid] = best;
  }
  return resultat;
}

// noyau/src/das.ts
var fs16 = __toESM(require("node:fs"), 1);
var path14 = __toESM(require("node:path"), 1);

// noyau/src/numerotation.ts
var fs11 = __toESM(require("node:fs"), 1);
var path9 = __toESM(require("node:path"), 1);

// noyau/src/memo.ts
var crypto2 = __toESM(require("node:crypto"), 1);
var fs10 = __toESM(require("node:fs"), 1);
var path8 = __toESM(require("node:path"), 1);
var condense = (s) => crypto2.createHash("sha1").update(s).digest("hex").slice(0, 16);
function cleDepot(ctx) {
  const refs = git(["for-each-ref", "--format=%(refname)%(objectname)"], ctx.racine).stdout;
  const tete = git(["rev-parse", "HEAD"], ctx.racine).stdout.trim();
  return condense(refs + tete);
}
function cleArbre(ctx) {
  const statut = git(["status", "--porcelain", "--untracked-files=normal"], ctx.racine).stdout;
  return condense(cleDepot(ctx) + "|" + statut);
}
function cheminMemo(ctx, nom) {
  return path8.join(ctx.runs, "cache", `${nom.replace(/[^A-Za-z0-9_.-]/g, "_")}.json`);
}
function memoriser(ctx, nom, cle, calcul) {
  const f = cheminMemo(ctx, nom);
  try {
    const d = JSON.parse(fs10.readFileSync(f, "utf-8"));
    if (d.cle === cle && d.valeur !== void 0) return d.valeur;
  } catch {
  }
  const valeur = calcul();
  try {
    fs10.mkdirSync(path8.dirname(f), { recursive: true });
    const tmp = `${f}.${process.pid}.tmp`;
    fs10.writeFileSync(tmp, JSON.stringify({ cle, valeur, le: (/* @__PURE__ */ new Date()).toISOString() }), "utf-8");
    fs10.renameSync(tmp, f);
  } catch {
  }
  return valeur;
}

// noyau/src/numerotation.ts
var FAMILLES = ["ENG", "SCP", "DA", "ADR"];
function cheminRegistre(ctx) {
  return path9.join(ctx.runs, "numeros.json");
}
function chargerRegistre2(ctx) {
  const p = cheminRegistre(ctx);
  if (!fs11.existsSync(p)) return {};
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return {};
  }
}
function dossierDe(ctx, famille) {
  return { SCP: ctx.deltas, ADR: ctx.decisions, DA: ctx.arbitrages, ENG: ctx.engagements }[famille];
}
function numeroDe(nom, prefixe) {
  const tete = `${prefixe}-`;
  if (!nom.startsWith(tete)) return null;
  const chiffres = nom.slice(tete.length, tete.length + 4);
  return /^[0-9]{4}$/.test(chiffres) ? Number(chiffres) : null;
}
function plusHautSurDisque(dossier, prefixe) {
  if (!fs11.existsSync(dossier)) return 0;
  let max = 0;
  let noms;
  try {
    noms = fs11.readdirSync(dossier);
  } catch {
    return 0;
  }
  for (const nom of noms) max = Math.max(max, numeroDe(nom, prefixe) ?? 0);
  return max;
}
function relatifDe(ctx, famille) {
  return path9.relative(ctx.racine, dossierDe(ctx, famille)).split(path9.sep).join("/");
}
function nomsPublies(ctx) {
  if (!estRacineGit(ctx)) return null;
  const refs = refsDistantes(ctx);
  if (!refs.length) return null;
  const brut = memoriser(ctx, "noms-publies", cleDepot(ctx), () => {
    const listes = { ENG: [], SCP: [], DA: [], ADR: [] };
    const ensembles = lireNomsPublies(ctx, refs);
    for (const f of FAMILLES) listes[f] = [...ensembles[f]];
    return listes;
  });
  return { ENG: new Set(brut.ENG), SCP: new Set(brut.SCP), DA: new Set(brut.DA), ADR: new Set(brut.ADR) };
}
function lireNomsPublies(ctx, refs) {
  const sortie = { ENG: /* @__PURE__ */ new Set(), SCP: /* @__PURE__ */ new Set(), DA: /* @__PURE__ */ new Set(), ADR: /* @__PURE__ */ new Set() };
  const dossiers = FAMILLES.map((f) => [f, relatifDe(ctx, f)]);
  for (const ref of refs) {
    const r = git(["ls-tree", "--name-only", ref, ...dossiers.map(([, d]) => `${d}/`)], ctx.racine);
    if (r.code !== 0) continue;
    for (const ligne of r.stdout.split("\n")) {
      const chemin = ligne.trim().replace(/^"|"$/g, "");
      if (!chemin) continue;
      for (const [famille, d] of dossiers) {
        if (!chemin.startsWith(`${d}/`)) continue;
        const nom = chemin.slice(d.length + 1);
        if (numeroDe(nom, famille) !== null) sortie[famille].add(nom);
      }
    }
  }
  return sortie;
}
function existeSurDisque(dossier, id) {
  if (!fs11.existsSync(dossier)) return false;
  try {
    return fs11.readdirSync(dossier).some((n) => n.startsWith(`${id}.`) || n.startsWith(`${id}-`));
  } catch {
    return false;
  }
}
function doublonsDe(ctx, famille) {
  const dossier = dossierDe(ctx, famille);
  if (!fs11.existsSync(dossier)) return [];
  const comptes = /* @__PURE__ */ new Map();
  let noms;
  try {
    noms = fs11.readdirSync(dossier);
  } catch {
    return [];
  }
  for (const nom of noms) {
    const numero = numeroDe(nom, famille);
    if (numero === null) continue;
    const id = idDe(famille, numero);
    comptes.set(id, (comptes.get(id) ?? 0) + 1);
  }
  return [...comptes.entries()].filter(([, n]) => n > 1).map(([id]) => id).sort();
}
var idDe = (famille, numero) => `${famille}-${String(numero).padStart(4, "0")}`;
function nomsSurDisque(ctx, famille) {
  try {
    return fs11.readdirSync(dossierDe(ctx, famille)).filter((n) => numeroDe(n, famille) !== null);
  } catch {
    return [];
  }
}
function recordsNonPublies(ctx) {
  const publies = nomsPublies(ctx);
  if (!publies) return [];
  const sortie = [];
  for (const famille of FAMILLES) {
    const fichiers = nomsSurDisque(ctx, famille).filter((n) => !publies[famille].has(n)).sort();
    if (fichiers.length) sortie.push({ famille, fichiers });
  }
  return sortie;
}
function etatNumerotation(ctx) {
  const registre = chargerRegistre2(ctx);
  const familles = FAMILLES;
  return familles.map((famille) => {
    const etat = registre[famille] ?? { dernier: 0, reservations: [] };
    const dossier = dossierDe(ctx, famille);
    return {
      famille,
      surDisque: plusHautSurDisque(dossier, famille),
      dernierRemis: Math.max(etat.dernier, plusHautSurDisque(dossier, famille)),
      enAttente: etat.reservations.filter((r) => !r.honoree && !existeSurDisque(dossier, r.id)),
      doublons: doublonsDe(ctx, famille)
    };
  });
}

// noyau/src/coherence.ts
var fs12 = __toESM(require("node:fs"), 1);
var path10 = __toESM(require("node:path"), 1);
var MATRICES = ["90_TRACEABILITY_MATRIX.md", "90_MATRICE_TRACABILITE.md"];
function streamDe(index, id) {
  if (!index) return void 0;
  const e = index.get(id);
  return e ? e.streams.join("+") || "(no stream)" : "(no stream)";
}
function matricesPerimees(ctx) {
  const out = [];
  for (const source of requirementSources(ctx)) {
    const matrice = MATRICES.map((m) => path10.join(source.folder, m)).find((m) => fs12.existsSync(m));
    if (!matrice) continue;
    const fichiers = [.../* @__PURE__ */ new Set([...source.domains.values(), ...source.files])].filter((f) => f !== matrice && fs12.existsSync(f));
    const max = Math.max(0, ...fichiers.map((f) => fs12.statSync(f).mtimeMs));
    if (max > 0 && fs12.statSync(matrice).mtimeMs < max) out.push(...source.streams);
  }
  return out;
}
function dossiersLivraisons(ctx) {
  if (!fs12.existsSync(ctx.livraisons)) return [];
  return fs12.readdirSync(ctx.livraisons).filter((d) => /^ENG-/.test(d)).sort();
}
function declarationsImplementees(texte) {
  const ids = /* @__PURE__ */ new Set();
  for (const ligne of texte.split("\n")) {
    if (!IMPLEMENTE.some((mot) => ligne.includes(mot))) continue;
    for (const m of ligne.matchAll(/SPEC-[A-Z]{2,4}-\d{3}/g)) ids.add(m[0]);
  }
  return [...ids].sort();
}
function impactsDeclares(texte) {
  const sortie = [];
  const re = /^## (SPEC-[A-Z]{2,4}-\d{3})\s*$([\s\S]*?)(?=^## |$(?![\s\S]))/gm;
  for (const m of texte.matchAll(re)) {
    const corps = m[2].trim();
    const impact = corps.match(/^impact\s*:\s*([\s\S]*?)$/m);
    if (impact && !/^sans_impact\s*:/m.test(corps)) {
      sortie.push({ exigence: m[1], impact: impact[1].trim() });
    }
  }
  return sortie;
}
function chargerSuiviDoc(ctx) {
  const chemin = path10.join(ctx.etat, "doc_suivi.yaml");
  if (!fs12.existsSync(chemin)) return [];
  try {
    const d = lireYaml(chemin) ?? {};
    return Array.isArray(d.sans_suite) ? d.sans_suite : [];
  } catch {
    return [];
  }
}
function mtimeMaxRecette(ctx) {
  let max = 0;
  try {
    for (const [, chemin] of fichiersDomaines(ctx)) {
      if (fs12.existsSync(chemin)) max = Math.max(max, fs12.statSync(chemin).mtimeMs);
    }
  } catch {
  }
  return max;
}
function etatCoherence(ctx, engs) {
  const fichiers = (() => {
    try {
      return fichiersDomaines(ctx);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  })();
  const declaration = readStreams(ctx);
  const index = declaration.declared ? requirementIndex(ctx, declaration) : null;
  const derives = [];
  for (const dossier of dossiersLivraisons(ctx)) {
    const eng = engs.get(dossier);
    if (!eng || eng.statut !== "tenu") continue;
    const specU = path10.join(ctx.livraisons, dossier, "SPEC_UPDATE.md");
    if (!fs12.existsSync(specU)) continue;
    for (const specId of declarationsImplementees(lireTexte(specU))) {
      const reel = statutSpec(specId, fichiers);
      if (!estImplemente(reel)) {
        const derive = { exigence: specId, eng: dossier, statut_declare: "IMPLEMENTED", statut_reel: reel };
        if (index) derive.stream = streamDe(index, specId);
        derives.push(derive);
      }
    }
  }
  derives.sort((a, b) => a.exigence + a.eng < b.exigence + b.eng ? -1 : 1);
  const sansSuite = new Set(chargerSuiviDoc(ctx).map((s) => `${s.exigence}|${s.eng}`));
  const couvertesParDoc = /* @__PURE__ */ new Set();
  for (const [, e] of engs) {
    if (e.doc === true && e.statut === "tenu") for (const s of exigences(e)) couvertesParDoc.add(s);
  }
  const dette = [];
  for (const dossier of dossiersLivraisons(ctx)) {
    const docU = path10.join(ctx.livraisons, dossier, "DOC_UPDATE.md");
    if (!fs12.existsSync(docU)) continue;
    for (const { exigence, impact } of impactsDeclares(lireTexte(docU))) {
      if (couvertesParDoc.has(exigence)) continue;
      if (sansSuite.has(`${exigence}|${dossier}`)) continue;
      dette.push(index ? { exigence, eng: dossier, impact, stream: streamDe(index, exigence) } : { exigence, eng: dossier, impact });
    }
  }
  dette.sort((a, b) => a.exigence + a.eng < b.exigence + b.eng ? -1 : 1);
  const maxRecette = mtimeMaxRecette(ctx);
  const matrice = path10.join(ctx.recette, "90_MATRICE_TRACABILITE.md");
  const matricePerimee = maxRecette > 0 && fs12.existsSync(matrice) && fs12.statSync(matrice).mtimeMs < maxRecette;
  let dashboardPerime = false;
  try {
    if (fs12.existsSync(ctx.dashboard) && fs12.existsSync(ctx.engagements)) {
      let maxEng = 0;
      for (const f of fs12.readdirSync(ctx.engagements)) {
        const st = fs12.statSync(path10.join(ctx.engagements, f));
        maxEng = Math.max(maxEng, st.mtimeMs);
      }
      dashboardPerime = fs12.statSync(ctx.dashboard).mtimeMs < maxEng;
    }
  } catch {
  }
  if (index) {
    const parStream = matricesPerimees(ctx);
    return { derives_spec: derives, dette_doc: dette, matrice_perimee: parStream.length > 0, dashboard_perime: dashboardPerime, matrices_perimees: parStream };
  }
  return { derives_spec: derives, dette_doc: dette, matrice_perimee: matricePerimee, dashboard_perime: dashboardPerime };
}

// noyau/src/sync.ts
function trunkRemote(ctx) {
  const suivi = git(["config", "--get", `branch.${TRUNK}.remote`], ctx.racine).stdout.trim();
  if (suivi && suivi !== ".") return suivi;
  const remotes = git(["remote"], ctx.racine).stdout.split("\n").map((l) => l.trim());
  return remotes.includes("origin") ? "origin" : null;
}
function trunkAhead(ctx) {
  if (!estRacineGit(ctx)) return null;
  const remote = trunkRemote(ctx);
  if (!remote) return null;
  const ref = `${remote}/${TRUNK}`;
  const r = git(["rev-list", "--count", `${ref}..${TRUNK}`], ctx.racine);
  const n = r.code === 0 ? Number(r.stdout.trim()) : 0;
  return n > 0 ? { ref, commits: n } : null;
}

// noyau/src/blocker.ts
var fs15 = __toESM(require("node:fs"), 1);
var path13 = __toESM(require("node:path"), 1);

// noyau/src/style.ts
var fs13 = __toESM(require("node:fs"), 1);
var path11 = __toESM(require("node:path"), 1);
var CADRATIN = "\u2014";
var EXTENSIONS_TEXTE = [
  ".ts",
  ".js",
  ".tsx",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".rs",
  ".go",
  ".java",
  ".c",
  ".h",
  ".cpp",
  ".md",
  ".txt",
  ".yaml",
  ".yml",
  ".json",
  ".toml",
  ".html",
  ".css",
  ".sh",
  ".ps1",
  ".sql"
];
var LOCALES = ["/locales/", "/locale/", "/i18n/", "/lang/", "/translations/"];
var GELES = ["/corpus/", "/oracles/", "/fixtures/", "/artefacts/", "/.artefacts/", "/snapshots/"];
var DATES = ["/journal/", "/livraisons/", "/captures/", "/releves/", "/readings/", "/runs/"];
var HORS_CHANTIER = ["agentic_orchestrator/"];
var normalise = (chemin) => "/" + chemin.split("\\").join("/").replace(/^\/+/, "");
function estTexte(chemin) {
  const ext = path11.extname(chemin).toLowerCase();
  return EXTENSIONS_TEXTE.includes(ext);
}
function exempteDeTout(chemin) {
  const p = normalise(chemin);
  return [...GELES, ...DATES].some((m) => p.includes(m));
}
function exempteDeLangue(chemin) {
  const p = normalise(chemin);
  return LOCALES.some((m) => p.includes(m)) || HORS_CHANTIER.some((m) => p.includes("/" + m));
}
var FOURNISSEUR = ["anthr", "opic"].join("");
var OUTIL = "claude";
function lexiqueOutil() {
  return [
    [new RegExp(FOURNISSEUR, "i"), `le nom du fournisseur de l'outillage`],
    [new RegExp("co-authored-by:\\s*" + OUTIL, "i"), "une remorque d'attribution d'outil"],
    [new RegExp("generated with \\[?" + OUTIL, "i"), "une remorque d'attribution d'outil"],
    [new RegExp("\\bassisted[- ]by:\\s*" + OUTIL, "i"), "une remorque d'attribution d'outil"],
    // Les adresses de non-réponse qui attribuent le travail à l'outil. La
    // signature d'un commit ne doit jamais en porter.
    [new RegExp("[\\w.+-]*" + OUTIL + "[\\w.+-]*@[\\w.-]*noreply[\\w.-]*", "i"), "une adresse de non-r\xE9ponse d'outil"],
    [new RegExp("noreply@[\\w.-]*" + FOURNISSEUR, "i"), "une adresse de non-r\xE9ponse d'outil"],
    [new RegExp("[\\w.+-]*" + OUTIL + "[\\w.+-]*@[\\w.-]*" + FOURNISSEUR, "i"), "une adresse d'outil"],
    // L'artefact d'attribution que certains outils ajoutent en pied.
    [new RegExp("\\ud83e\\udd16\\s*generated", "i"), "une remorque d'attribution d'outil"]
  ];
}
var AMORCE_LEXIQUE = new RegExp([OUTIL, FOURNISSEUR, "\\ud83e\\udd16"].join("|"), "i");
var MARQUEURS_FR = [
  "qui",
  "que",
  "pas",
  "pour",
  "dans",
  "avec",
  "sans",
  "cette",
  "leur",
  "donc",
  "ainsi",
  "chaque",
  "jamais",
  "toujours",
  "sont",
  "plus",
  "tout",
  "tous",
  "elle",
  "nous",
  "vous",
  "mais",
  "aussi",
  "alors",
  "depuis",
  "entre",
  "sous",
  "vers",
  "chez",
  "dont",
  "lorsque",
  "puisque",
  "afin",
  "selon",
  "malgre",
  "deja",
  "encore",
  "faut",
  "peut",
  "doit",
  "etre"
];
var SEUIL_FR = 3;
var RE_MARQUEURS_FR = new RegExp("\\b(?:" + MARQUEURS_FR.join("|") + ")\\b", "g");
function marqueursFrancais(texte) {
  const bas = texte.toLowerCase();
  const vus = /* @__PURE__ */ new Set();
  for (const m of bas.matchAll(RE_MARQUEURS_FR)) {
    vus.add(m[0]);
    if (vus.size === MARQUEURS_FR.length) break;
  }
  const trouves = MARQUEURS_FR.filter((m) => vus.has(m));
  if (/[\u00e9\u00e8\u00ea\u00e0\u00e7\u00f9\u00fb\u00ee\u00f4\u00e2]/.test(texte)) trouves.push("accents");
  return trouves;
}
function fautesDeStyle(texte, chemin, options = {}) {
  if (!estTexte(chemin) || exempteDeTout(chemin)) return [];
  const fautes = [];
  const lignes = texte.split("\n");
  const porteCadratin = texte.includes(CADRATIN);
  lignes.forEach((l, i) => {
    if (!porteCadratin || !l.includes(CADRATIN)) return;
    fautes.push({
      regle: "tiret-cadratin",
      ligne: i + 1,
      extrait: l.trim().slice(0, 100),
      quoi: "la charte de style interdit le tiret cadratin, sans exception",
      remede: "remplace-le par deux points, une virgule, une parenth\xE8se br\xE8ve, ou coupe la phrase en deux",
      gravite: "refus"
    });
  });
  const lexique = AMORCE_LEXIQUE.test(texte) ? lexiqueOutil() : [];
  lignes.forEach((l, i) => {
    if (!lexique.length || !AMORCE_LEXIQUE.test(l)) return;
    for (const [motif, libelle] of lexique) {
      if (!motif.test(l)) continue;
      fautes.push({
        regle: "lexique-outil",
        ligne: i + 1,
        extrait: l.trim().slice(0, 100),
        quoi: `${libelle} ne para\xEEt nulle part : ni contenu versionn\xE9, ni message de commit, ni adresse d'auteur`,
        remede: "retire la mention ; l'auteur unique du d\xE9p\xF4t est le seul signataire",
        gravite: "refus"
      });
      break;
    }
  });
  if (!exempteDeLangue(chemin)) {
    const marqueurs = marqueursFrancais(texte);
    if (marqueurs.length >= SEUIL_FR) {
      const premiere = lignes.findIndex((l) => marqueursFrancais(l).length >= 2);
      fautes.push({
        regle: "langue",
        ligne: premiere >= 0 ? premiere + 1 : 1,
        extrait: (premiere >= 0 ? lignes[premiere] : lignes[0] ?? "").trim().slice(0, 100),
        quoi: `ce texte para\xEEt \xE9crit en fran\xE7ais (${marqueurs.length} marqueurs) ; la langue de travail du d\xE9p\xF4t est l'anglais des affaires standard, code, commentaires et identifiants compris`,
        remede: "r\xE9dige en anglais, ou d\xE9clare l'exception (catalogue de locale, corpus gel\xE9, citation dat\xE9e)",
        gravite: options.langueBloquante ? "refus" : "avertissement"
      });
    }
  }
  return fautes;
}
var IGNORES = [
  "node_modules",
  ".git",
  "dist",
  "build",
  "out",
  "__pycache__",
  ".venv",
  "worktrees",
  ".artefacts",
  "target",
  "vendor"
];
function* fichiersDe(racine, base = "") {
  let entrees;
  try {
    entrees = fs13.readdirSync(path11.join(racine, base), { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entrees) {
    const rel = base ? base + "/" + e.name : e.name;
    if (e.isDirectory()) {
      if (IGNORES.includes(e.name)) continue;
      yield* fichiersDe(racine, rel);
    } else if (e.isFile() && estTexte(rel)) {
      yield rel;
    }
  }
}
var CACHE = /* @__PURE__ */ new Map();
var BILANS = /* @__PURE__ */ new Map();
var TTL_MS = 3e4;
function auditStyle(racine, options = {}) {
  const cle = path11.resolve(racine) + "|" + String(Boolean(options.langueBloquante));
  if (!options.frais) {
    const garde = BILANS.get(cle);
    if (garde && Date.now() - garde.a < TTL_MS) return garde.bilan;
  }
  const bilan = { fichiersExamines: 0, fautes: [], parRegle: {} };
  let connus = CACHE.get(cle);
  if (!connus) {
    connus = /* @__PURE__ */ new Map();
    CACHE.set(cle, connus);
  }
  const vus = /* @__PURE__ */ new Set();
  for (const rel of fichiersDe(racine)) {
    if (exempteDeTout(rel)) continue;
    const absolu = path11.join(racine, rel);
    let taille;
    let date;
    try {
      const st = fs13.statSync(absolu);
      taille = st.size;
      date = st.mtimeMs;
    } catch {
      continue;
    }
    vus.add(rel);
    bilan.fichiersExamines++;
    let entree = connus.get(rel);
    if (!entree || entree.taille !== taille || entree.date !== date) {
      let texte;
      try {
        texte = fs13.readFileSync(absolu, "utf-8");
      } catch {
        continue;
      }
      entree = { taille, date, fautes: fautesDeStyle(texte, rel, options) };
      connus.set(rel, entree);
    }
    if (!entree.fautes.length) continue;
    const regles = new Set(entree.fautes.map((f) => f.regle));
    for (const r of regles) bilan.parRegle[r] = (bilan.parRegle[r] ?? 0) + 1;
    for (const f of entree.fautes) bilan.fautes.push({ ...f, fichier: rel });
  }
  for (const rel of [...connus.keys()]) if (!vus.has(rel)) connus.delete(rel);
  BILANS.set(cle, { a: Date.now(), bilan });
  return bilan;
}

// noyau/src/crochets.ts
var DOSSIERS_NUMEROTES = [".lean-engine/orchestration/ENG", ".lean-engine/orchestration/SCP", ".lean-engine/orchestration/DA", ".lean-engine/orchestration/ADR"];
var DOSSIERS_NUMEROTES_TOUS = [
  ...DOSSIERS_NUMEROTES,
  ".agenticLEAN/engagements",
  ".agenticLEAN/deltas",
  ".agenticLEAN/arbitrages",
  ".agenticLEAN/decisions",
  "agentic_orchestrator/management/engagements",
  "agentic_orchestrator/management/deltas",
  "agentic_orchestrator/management/arbitrages",
  "agentic_orchestrator/decisions"
];

// noyau/src/closing.ts
var fs14 = __toESM(require("node:fs"), 1);
var path12 = __toESM(require("node:path"), 1);

// noyau/src/formats.ts
var FORMATS = {
  scp: {
    suffixe: ".scp.md",
    ancien: /^(SCP-\d{4})\.md$/,
    dedie: /^(SCP-\d{4})\.scp\.md$/,
    langage: "lean-scp",
    libelle: "Changement de sp\xE9cification"
  },
  adr: {
    suffixe: ".adr.md",
    ancien: /^(ADR-[\w-]+)\.md$/,
    dedie: /^(ADR-[\w-]+)\.adr\.md$/,
    langage: "lean-adr",
    libelle: "D\xE9cision act\xE9e"
  },
  da: {
    suffixe: ".da.md",
    ancien: /^(DA-\d{4})\.md$/,
    dedie: /^(DA-\d{4})\.da\.md$/,
    langage: "lean-da",
    libelle: "Demande d'arbitrage"
  },
  engagement: {
    suffixe: ".eng.yaml",
    ancien: /^(ENG-\d{4})\.yaml$/,
    dedie: /^(ENG-\d{4})\.eng\.yaml$/,
    langage: "lean-engagement",
    libelle: "Engagement"
  },
  exigence: {
    suffixe: ".spec.md",
    ancien: /^(\d{2}_[A-Z_]+)\.md$/,
    dedie: /^(\d{2}_[A-Z_]+)\.spec\.md$/,
    langage: "lean-exigence",
    libelle: "Exigences d'un domaine"
  },
  rapport: {
    suffixe: ".report.md",
    ancien: /^(REPORT|BLOCKED)\.md$/,
    dedie: /^(REPORT|BLOCKED)\.report\.md$/,
    langage: "lean-rapport",
    libelle: "Rapport de livraison"
  }
};
function identifiantDe(famille, nomFichier) {
  const f = FORMATS[famille];
  const dedie = f.dedie.exec(nomFichier);
  if (dedie) return dedie[1];
  const ancien = f.ancien.exec(nomFichier);
  return ancien ? ancien[1] : null;
}
function estDeLaFamille(famille, nomFichier) {
  return identifiantDe(famille, nomFichier) !== null;
}

// noyau/src/documents.ts
function sectionsDe(texte) {
  const lignes = texte.split("\n");
  const sections = [];
  let courante = null;
  const solder = () => {
    if (courante) sections.push({ titre: courante.titre, niveau: courante.niveau, contenu: courante.lignes.join("\n").trim() });
  };
  for (const ligne of lignes) {
    const m = ligne.match(/^(#{2,4})\s+(.*\S)\s*$/);
    if (m) {
      solder();
      courante = { titre: m[2].trim(), niveau: m[1].length, lignes: [] };
    } else if (courante) {
      courante.lignes.push(ligne);
    }
  }
  solder();
  return sections;
}

// noyau/src/question.ts
var LETTRE = "[A-H]";
function cellules(ligne) {
  const t = ligne.trim();
  if (!t.startsWith("|") || !t.endsWith("|") || t.length < 2) return null;
  return t.slice(1, -1).split("|").map((c) => c.trim());
}
var estSeparateur = (c) => c.every((x) => /^:?-{2,}:?$/.test(x) || x === "");
function enTeteOption(cellule) {
  const m = cellule.replace(/\*\*/g, "").match(new RegExp(`^(?:Option\\s+)?(${LETTRE})\\s*[:.)\\-\\u2013]\\s*(.+)$`, "i"));
  return m ? { cle: m[1].toUpperCase(), intitule: m[2].trim() } : null;
}
function optionsTableau(markdown) {
  const lignes = markdown.split("\n");
  for (let i = 0; i < lignes.length; i++) {
    const tete = cellules(lignes[i]);
    if (!tete || tete.length < 3) continue;
    const colonnes = tete.slice(1).map(enTeteOption);
    if (colonnes.some((c) => c === null)) continue;
    const options = colonnes.map((c) => ({
      cle: c.cle,
      intitule: c.intitule,
      detail: "",
      criteres: [],
      consequences: []
    }));
    for (let j = i + 1; j < lignes.length; j++) {
      const c = cellules(lignes[j]);
      if (!c) break;
      if (estSeparateur(c)) continue;
      const critere = c[0].replace(/\*\*/g, "").trim();
      options.forEach((o, k) => {
        const valeur = (c[k + 1] ?? "").trim();
        if (critere && valeur) o.criteres.push({ critere, valeur });
      });
    }
    return options;
  }
  return null;
}
function sansTableaux(markdown) {
  return markdown.split("\n").filter((l) => cellules(l) === null).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
var OUVERTURE_OPTION = new RegExp(`^\\*\\*(?:Option\\s+)?(${LETTRE})\\s*[.:)]?\\s*([^*\\n]*?)\\*\\*\\s*[.:]?\\s*(.*)$`);
function titreEtSuite(texte) {
  const plat = texte.replace(/\s+/g, " ").trim();
  const fin = plat.search(/(?<=[.:;])\s/);
  if (fin > 0 && fin <= 140) return { titre: plat.slice(0, fin).replace(/[.:;]$/, ""), suite: plat.slice(fin).trim() };
  if (plat.length <= 110) return { titre: plat.replace(/[.:;]$/, ""), suite: "" };
  return { titre: plat.slice(0, 100).trim() + " ...", suite: plat };
}
function separerTitre(o) {
  if (o.detail || o.consequences.length || o.criteres.length) return o;
  const coupe = titreEtSuite(o.intitule);
  return coupe.suite ? { ...o, intitule: coupe.titre, detail: coupe.suite } : o;
}
function optionsParagraphes(sections) {
  const sortie = [];
  for (const s of sections) {
    if (!/option|alternative/i.test(s.titre) || /recomm/i.test(s.titre)) continue;
    for (const brut of s.contenu.split(/\n\s*\n/)) {
      const lignes = brut.trim().split("\n");
      const m = lignes[0].match(OUVERTURE_OPTION);
      if (!m || sortie.some((o) => o.cle === m[1])) continue;
      const suite = [m[3], ...lignes.slice(1)].join("\n").trim();
      const titre = m[2].trim().replace(/[.:;]$/, "");
      if (titre) {
        sortie.push({ cle: m[1], intitule: titre, detail: suite, criteres: [], consequences: [] });
      } else if (suite) {
        const coupe = titreEtSuite(suite);
        sortie.push({ cle: m[1], intitule: coupe.titre, detail: coupe.suite, criteres: [], consequences: [] });
      }
    }
  }
  return sortie;
}
function prosesParOption(sections) {
  const sortie = /* @__PURE__ */ new Map();
  for (const s of sections) {
    if (!/option/i.test(s.titre) || /recomm/i.test(s.titre)) continue;
    for (const brut of s.contenu.split(/\n\s*\n/)) {
      const lignes = brut.trim().split("\n");
      const m = lignes[0].match(OUVERTURE_OPTION);
      if (!m || sortie.has(m[1])) continue;
      const texte = [[m[2].trim(), m[3].trim()].filter(Boolean).join(" "), ...lignes.slice(1)].join("\n").trim();
      if (texte) sortie.set(m[1], texte);
    }
  }
  return sortie;
}
var estContexte = (t) => /^(contexte|context|background)\b/i.test(t);
var estQuestion = (t) => /^(?:closed\s+)?questions?\b/i.test(t);
var estNumerotee = (t) => t.match(/^question\s+(\d+)\s*[:.]\s*(.*)$/i);
var estOptions = (t) => /option|alternative/i.test(t) && !/recomm/i.test(t);
var estRecommandation = (t) => /recomm/i.test(t);
var estEnjeu = (t) => /bloqu|d[ée]bloque|blocked|unblock|\bstakes?\b|enjeu|en attendant/i.test(t);
var estDecision = (t) => /^d[ée]cision\b/i.test(t);
function decisionPrise(corps) {
  const blocs = [...corps.matchAll(/```yaml\n([\s\S]*?)```/g)];
  for (const bloc of blocs.reverse()) {
    if (!/^choix:/m.test(bloc[1])) continue;
    try {
      const d = lireYamlSur(bloc[1]) ?? {};
      if (d.choix === null || d.choix === void 0 || String(d.choix).trim() === "") return null;
      const date = d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date ?? "");
      return { choix: String(d.choix).trim(), motif: String(d.motif ?? "").trim(), date };
    } catch {
      return null;
    }
  }
  return null;
}
function adviceKey(avis, cles = []) {
  const texte = avis.trim();
  const echappe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cle = cles.length ? `(?:${cles.map(echappe).join("|")})` : LETTRE;
  const r = texte.match(new RegExp(`^\\*\\*(?:Options?\\s+)?(${cle})\\b`)) ?? texte.match(new RegExp(`^(${cle})(?=\\s*[:.,;)]|\\s+(?:for|because|is|as)\\b|\\s*$)`)) ?? texte.match(new RegExp(`\\bOptions?\\s+(${cle})\\b`, "i")) ?? texte.match(new RegExp(`\\*\\*(?:Options?\\s+)?(${cle})\\b`));
  if (!r) return null;
  const trouvee = r[1];
  return cles.find((c) => c.toLowerCase() === trouvee.toLowerCase()) ?? trouvee.toUpperCase();
}
function structureDa(corps, sections, repli = []) {
  const proses = prosesParOption(sections);
  const enrichir = (options) => options.map((o) => ({ ...o, detail: o.detail || proses.get(o.cle) || "" }));
  const recommandation = sections.find((s) => estRecommandation(s.titre))?.contenu.trim() ?? "";
  const enjeu = sections.find((s) => estEnjeu(s.titre))?.contenu.trim() ?? "";
  const contexte = sections.find((s) => estContexte(s.titre))?.contenu.trim() ?? "";
  const premiereQuestion = sections.findIndex((s) => estQuestion(s.titre));
  const faits = sections.slice(0, premiereQuestion < 0 ? 0 : premiereQuestion).filter((s) => !estContexte(s.titre) && s.contenu.trim());
  const questions = [];
  const numerotees = sections.filter((s) => estNumerotee(s.titre));
  if (numerotees.length) {
    for (const s of numerotees) {
      const m = estNumerotee(s.titre);
      const numero = Number(m[1]);
      const motif = new RegExp(`Question\\s+${numero}\\s*:\\s*\\*\\*(?:Option\\s+)?(${LETTRE})\\*\\*`, "i");
      const r = recommandation.match(motif);
      let raison = "";
      if (r && r.index !== void 0) {
        const suite = recommandation.slice(r.index + r[0].length);
        const fin = suite.search(/\n\s*Question\s+\d+\s*:/i);
        raison = (fin < 0 ? suite : suite.slice(0, fin)).replace(/^[\s.:,]+/, "").trim();
      }
      questions.push({
        titre: m[2].trim() || `Question ${numero}`,
        enonce: sansTableaux(s.contenu),
        mode: "exclusive",
        options: enrichir(optionsTableau(s.contenu) ?? []),
        recommandee: r ? r[1].toUpperCase() : null,
        raison
      });
    }
  } else {
    const q = sections.find((s) => estQuestion(s.titre));
    const portee = sections.find((s) => estOptions(s.titre) && optionsTableau(s.contenu));
    const paragraphes = optionsParagraphes(sections);
    const options = (q && optionsTableau(q.contenu)) ?? (portee ? optionsTableau(portee.contenu) : null) ?? optionsTableau(corps) ?? (paragraphes.length >= 2 || !repli.length ? paragraphes : repli.map(separerTitre));
    const conseillee = adviceKey(recommandation, options.map((o) => o.cle));
    const r = conseillee ? [conseillee, conseillee] : null;
    const raison = recommandation;
    if (q || options.length) {
      questions.push({
        titre: "",
        enonce: q ? sansTableaux(q.contenu) : "",
        mode: "exclusive",
        options: enrichir(options),
        recommandee: r ? r[1].toUpperCase() : null,
        raison
      });
    }
  }
  const classee = (s) => estContexte(s.titre) || estQuestion(s.titre) || estRecommandation(s.titre) || estEnjeu(s.titre) || estDecision(s.titre) || faits.includes(s) || estOptions(s.titre) && questions.some((q) => q.options.length > 0);
  const annexes = sections.filter((s) => !classee(s) && s.contenu.trim());
  const brute = decisionPrise(corps);
  let prise = null;
  if (brute) {
    const parQuestion = questions.map(() => null);
    const nommees = [...brute.choix.matchAll(new RegExp(`Q?(\\d+)\\s*[=:]\\s*(?:Option\\s+)?(${LETTRE})\\b`, "gi"))];
    if (nommees.length) {
      for (const n of nommees) {
        const i = Number(n[1]) - 1;
        if (i >= 0 && i < parQuestion.length) parQuestion[i] = n[2].toUpperCase();
      }
    } else if (questions.length === 1) {
      const seule = brute.choix.match(new RegExp(`^(?:Option\\s+)?(${LETTRE})\\b`, "i"));
      if (seule && questions[0].options.some((o) => o.cle === seule[1].toUpperCase())) parQuestion[0] = seule[1].toUpperCase();
    }
    prise = { ...brute, parQuestion };
  }
  return { contexte, faits, enjeu, questions, recommandation, annexes, prise };
}

// noyau/src/briefing.ts
function optionsDe(corps) {
  const options = [];
  const sections = sectionsDe(corps);
  const candidate = sections.find((s) => /option|alternative|choix/i.test(s.titre));
  const source = candidate ? candidate.contenu : corps;
  for (const ligne of source.split("\n")) {
    const puce = ligne.match(/^\s*[-*]\s*(?:\*\*)?([A-D])(?:\*\*)?\s*[:.\-–)]\s*(.+?)\s*$/);
    if (puce) {
      options.push({ cle: puce[1], intitule: puce[2].replace(/\*\*/g, "").trim() });
      continue;
    }
    const titre = ligne.match(/^#{2,4}\s*(?:Option\s*)?([A-D])\s*[:.\-–)]\s*(.+?)\s*$/i);
    if (titre) options.push({ cle: titre[1].toUpperCase(), intitule: titre[2].trim() });
  }
  if (options.length < 2) {
    const question = sections.find((s) => /question/i.test(s.titre))?.contenu ?? source;
    for (const m of question.matchAll(/\b([A-D])\s*\(([^()]{3,160})\)/g)) {
      options.push({ cle: m[1], intitule: m[2].trim() });
    }
  }
  const vus = /* @__PURE__ */ new Set();
  return options.filter((o) => vus.has(o.cle) ? false : (vus.add(o.cle), true));
}

// noyau/src/closing.ts
var SECTION_RESULT = "Result";
var SECTION_FILED = "Open points that need someone else";
var SECTION_INFORMATION = "For information, no action required";
var SECTION_DOCUMENTATION = "Documentation updated";
var CLOSING_LINES = [
  "You can close it alone, inside your scope, without changing a requirement, a milestone, an interface or the scope: close it now, commit, and deliver again. It is never handed to the operator.",
  `You cannot close it alone: file it, never leave it as a remark. A substantive choice is an arbitration request (DA) with its enumerated options and the option you recommend, work outside your scope is a commitment (ENG) with its scope and its definition of done, and a change of requirement is a specification change (SCP). A session under lease drafts each one in full under \`## ${SECTION_FILED}\`, and the session that integrates files it at once, without waiting for the operator, under a number reserved from the authority (\`lean numero DA|ENG|SCP\`; \`lean modele DA|ENG|SCP\` prints the template of the record and the latest record of the family as an example). The operator acts on the commitments and on the arbitration requests that result, and is never asked to carry out a gesture of orchestration.`,
  `It needs no action: state it under \`## ${SECTION_INFORMATION}\`, and nowhere else.`
];
var CLOSING_RULES = "Sort every open point before you end, and leave none as loose prose. " + CLOSING_LINES.join(" ");
var DOCUMENTATION_RULE = `When the completion of a commitment, of an arbitration request or of a specification change makes a document false or incomplete, that document is updated at once, with the work that causes the change, and never left for a later pass. A session under lease updates what lies inside its scope and drafts in full what lies outside it, and the session that integrates applies that draft at once. When a document changed, or one is left to change, the report and the closing message end with a section \`## ${SECTION_DOCUMENTATION}\`: one line per document changed and what changed in it, then what is still to be applied and by whom. When no document changed and none is left to change, the section is left out: nothing is written in its place.`;
var REPORT_RULES = `REPORT.md opens with a section \`## ${SECTION_RESULT}\` whose first line is \`PASS\` or \`FAIL\` against the definition of done, followed by one line per criterion: met or not met, and the test that proves it. ` + CLOSING_RULES + " Your closing message to the operator follows the same order: the result first, then what needs a human, then what is for information only. " + DOCUMENTATION_RULE;
var PLACEHOLDER = /\((?:à|a|to)\s+(?:compl[ée]ter|complete|be completed)[^)]*\)|\bTBD\b/gi;
function written(texte) {
  return texte.replace(PLACEHOLDER, "").trim();
}
var escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function adviceGaps(markdown) {
  const sections = sectionsDe(markdown).map((s) => ({ titre: s.titre, contenu: s.contenu }));
  const repli = optionsDe(markdown).map((o) => ({ ...o, detail: "", criteres: [], consequences: [] }));
  const structure = structureDa(markdown, sections, repli);
  const options = /* @__PURE__ */ new Map();
  for (const q of structure.questions) for (const o of q.options) options.set(o.cle, `${o.intitule} ${o.detail}`);
  const ecrites = [...options].filter(([, t]) => written(t.replace(/\*\*/g, "")).length > 0).map(([k]) => k);
  const manques = [];
  if (ecrites.length < 2) {
    manques.push(
      `${ecrites.length} enumerated option(s) where at least two are needed: the question is not closed. Options are read from a table with one column per option (\`A: title\`), from paragraphs opened by \`**A.**\`, or from a list \`- A: title\``
    );
  }
  const avis = written(structure.recommandation);
  if (avis.length < 20) {
    manques.push("no recommendation of the requester: a section `## Recommendation` names the option advised and gives the reason");
  } else if (ecrites.length) {
    const cle = `(?:${ecrites.map(escape).join("|")})`;
    const plusieurs = structure.questions.length > 1;
    const nomme = plusieurs ? new RegExp(`\\*\\*(?:Options?\\s+)?${cle}\\b|\\bOptions?\\s+${cle}\\b|^\\s*${cle}\\b`).test(avis) : adviceKey(structure.recommandation, ecrites) !== null;
    if (!nomme) manques.push("the recommendation names none of the options: open it with the option advised, as `**A.**` or `Option A`");
  }
  return manques;
}
var CONTEXT_MINIMUM = 300;
var STATEMENT_MINIMUM = 40;
function requestGaps(markdown) {
  const sections = sectionsDe(markdown).map((s) => ({ titre: s.titre, contenu: s.contenu }));
  const repli = optionsDe(markdown).map((o) => ({ ...o, detail: "", criteres: [], consequences: [] }));
  const structure = structureDa(markdown, sections, repli);
  const manques = [];
  const contexte = written(structure.contexte);
  if (contexte.length < CONTEXT_MINIMUM) {
    manques.push(
      `the context holds ${contexte.length} character(s) where at least ${CONTEXT_MINIMUM} are needed: a section \`## Context\` states, for a reader who has none of the history, what the product does today, what happened, and why that is a problem`
    );
  }
  if (written(structure.enjeu).length < STATEMENT_MINIMUM) {
    manques.push(
      "no stake: a section `## What is at stake` states what waits for the decision, and what happens if it is not taken"
    );
  }
  const enonces = structure.questions.map((q) => written(q.enonce));
  if (!enonces.length || enonces.some((e) => !e.includes("?"))) {
    manques.push(
      "no closed question: a section `## Closed question` asks one question, with its question mark, that is answered by naming an option"
    );
  }
  for (const q of structure.questions) {
    for (const o of q.options) {
      const dit = written([o.detail, ...o.consequences, ...o.criteres.map((c) => `${c.critere} ${c.valeur}`)].join(" "));
      if (dit.length < STATEMENT_MINIMUM) {
        manques.push(
          `option ${o.cle} states no consequence: each option says what it changes and what it costs, in the paragraph it opens (\`**A. Title.** what it changes, what it costs\`) or in the rows of the table`
        );
      }
    }
  }
  const tete = markdown.match(/```yaml\n([\s\S]*?)```/);
  let meta = {};
  try {
    meta = (tete ? lireYamlSur(tete[1]) : null) ?? {};
  } catch {
  }
  if (!written(String(meta.defaut_si_silence ?? "")) && !written(String(meta.escalade ?? ""))) {
    manques.push("no fallback: the header states `defaut_si_silence` or `escalade`, what applies if nobody answers");
  }
  return [...manques, ...adviceGaps(markdown)];
}
function unadvisedRequests(ctx) {
  if (!fs14.existsSync(ctx.arbitrages)) return [];
  const sortie = [];
  for (const nom of fs14.readdirSync(ctx.arbitrages).sort()) {
    const brouillon = /^BROUILLON-DA-.*\.md$/.test(nom);
    if (!brouillon && !/^DA-\d{4}.*\.md$/.test(nom)) continue;
    const fichier = path12.join(ctx.arbitrages, nom);
    let texte;
    try {
      texte = lireTexte(fichier);
    } catch {
      continue;
    }
    if (!brouillon && !/^statut:\s*ouverte\s*$/m.test(texte)) continue;
    const manques = brouillon ? adviceGaps(texte) : requestGaps(texte);
    if (!manques.length) continue;
    const eng = nom.match(/eng-(\d{4})/i);
    sortie.push({ id: nom.replace(/\.md$/, ""), fichier, eng: eng && !/lignee/.test(nom) ? `ENG-${eng[1]}` : null, manques });
  }
  return sortie;
}

// noyau/src/blocker.ts
function headOf(texte) {
  const m = texte.match(/```yaml\n([\s\S]*?)```/);
  if (!m) return null;
  try {
    const d = lireYamlSur(m[1]) ?? {};
    return {
      statut: String(d.statut ?? ""),
      engagement: d.engagement ? String(d.engagement).toUpperCase() : null,
      decideur: d.decideur ? String(d.decideur) : null
    };
  } catch {
    return null;
  }
}
function requestsOf(ctx, engBrut) {
  const eng = engBrut.trim().toUpperCase();
  if (!fs15.existsSync(ctx.arbitrages)) return [];
  const sortie = [];
  for (const nom of fs15.readdirSync(ctx.arbitrages).sort().reverse()) {
    if (!/^DA-\d{4}.*\.md$/.test(nom)) continue;
    const fichier = path13.join(ctx.arbitrages, nom);
    let tete = null;
    try {
      tete = headOf(lireTexte(fichier));
    } catch {
      continue;
    }
    if (!tete || tete.engagement !== eng) continue;
    sortie.push({ da: nom.slice(0, 7), fichier, statut: tete.statut, decideur: tete.decideur });
  }
  return sortie;
}
function requestState(ctx, daBrut) {
  const da = daBrut.trim().toUpperCase();
  if (!fs15.existsSync(ctx.arbitrages)) return null;
  const nom = fs15.readdirSync(ctx.arbitrages).find((n) => n.startsWith(da) && /^DA-\d{4}(\.|-)/.test(n) && n.endsWith(".md"));
  if (!nom) return null;
  const texte = lireTexte(path13.join(ctx.arbitrages, nom));
  const tete = headOf(texte);
  let choix = null;
  let motif = null;
  let date = null;
  for (const bloc of [...texte.matchAll(/```yaml\n([\s\S]*?)```/g)].reverse()) {
    if (!/^choix:/m.test(bloc[1])) continue;
    try {
      const d = lireYamlSur(bloc[1]) ?? {};
      if (d.choix !== null && d.choix !== void 0 && String(d.choix).trim()) {
        choix = String(d.choix).trim();
        motif = d.motif ? String(d.motif).trim() : null;
        date = d.date instanceof Date ? d.date.toISOString().slice(0, 10) : d.date ? String(d.date) : null;
      }
    } catch {
    }
    break;
  }
  let adr = null;
  try {
    const bas = da.toLowerCase();
    const trouve = fs15.readdirSync(ctx.decisions).find((n) => /^ADR-\d{4}/.test(n) && n.toLowerCase().includes(bas));
    if (trouve) adr = trouve.slice(0, 8);
  } catch {
  }
  const renvoi = texte.match(/^## (?:Returned for study|Renvoi) \([^)]*\)\s*\n+([\s\S]*?)(?=\n## |\nThe requester investigates|$)/m);
  return {
    da,
    statut: tete?.statut ?? "",
    titre: (texte.split("\n")[0] ?? "").replace(/^[#\s]+/, "").trim(),
    decideur: tete?.decideur ?? null,
    engagement: tete?.engagement ?? null,
    choix,
    motif,
    date,
    adr,
    renvoi: tete?.statut === "renvoyee" && renvoi ? renvoi[1].trim().slice(0, 600) : null
  };
}
function blocksOnPrecedence(text) {
  return /^## Nature\s*\n+\s*precedence\b/m.test(text);
}

// noyau/src/das.ts
function chargerDas(ctx) {
  const das = [];
  if (!fs16.existsSync(ctx.arbitrages)) return das;
  const fichiers = fs16.readdirSync(ctx.arbitrages).filter((f) => /^DA-.*\.md$/.test(f)).sort();
  for (const f of fichiers) {
    const texte = lireTexte(path14.join(ctx.arbitrages, f));
    let tete = {};
    const m = texte.match(/```yaml\n([\s\S]*?)```/);
    if (m) {
      try {
        tete = lireYamlSur(m[1]) ?? {};
      } catch {
      }
    }
    const premiereLigne = texte.split("\n")[0] ?? "";
    const titre = premiereLigne ? premiereLigne.replace(/^[#\s]+/, "").trim() : f.replace(/\.md$/, "");
    das.push({
      id: f.replace(/\.md$/, ""),
      titre,
      decideur: tete.decideur ?? null,
      echeance_reponse: tete.echeance_reponse ?? null,
      defaut_si_silence: tete.defaut_si_silence ?? null,
      escalade: tete.escalade ?? null,
      // A request decided before the status field existed opens with its decision block: a
      // choice recorded is a request decided, and the views count it so.
      statut: tete.statut ?? (tete.choix !== void 0 && tete.choix !== null ? "decidee" : null),
      engagement_reponse: tete.engagement_reponse ?? null,
      engagement: tete.engagement ?? null
    });
  }
  return das;
}
var TITRE_RENVOI = /^## (?:Returned for study|Renvoi) \((\d{4}-\d{2}-\d{2})\)\s*$/gm;
function renvoiDe(texte) {
  const renvois = [...texte.matchAll(TITRE_RENVOI)];
  if (!renvois.length) return null;
  const dernier = renvois[renvois.length - 1];
  const suite = texte.slice(dernier.index + dernier[0].length);
  const m = suite.match(/^(?:The decider cannot decide on this request as written|Préparation jugée insuffisante par le décideur)\s*:\s*([\s\S]*?)(?:\n\n|\nLe demandeur|$)/m);
  return { date: dernier[1], motif: (m ? m[1] : suite.split("\n\n")[0] ?? "").trim() };
}
function renvoiDeDa(ctx, daId) {
  const f = path14.join(ctx.arbitrages, `${daId}.md`);
  return fs16.existsSync(f) ? renvoiDe(lireTexte(f)) : null;
}

// noyau/src/mandats.ts
var fs17 = __toESM(require("node:fs"), 1);
var path15 = __toESM(require("node:path"), 1);
function cheminMandat(ctx, eng) {
  return path15.join(ctx.runs, "mandats", `${eng}.json`);
}
function chargerMandat(ctx, eng) {
  const p = cheminMandat(ctx, eng);
  if (!fs17.existsSync(p)) return null;
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return null;
  }
}
function cheminRework(worktree) {
  return path15.join(worktree, ".eng", "REWORK.md");
}
function reworkDe(worktree) {
  const f = cheminRework(worktree);
  if (!fs17.existsSync(f)) return null;
  const texte = lireTexte(f);
  const mandat = texte.match(/MAN-ENG-\d{4}-\d+/)?.[0] ?? null;
  const violations = [...texte.matchAll(/^- V(\d+): (.*)$/gm)].map((m) => m[2].trim());
  return { mandat, violations };
}
function continuationDecidee(ctx, eng, depuis) {
  const jour = String(depuis ?? "").slice(0, 10);
  for (const r of requestsOf(ctx, eng)) {
    const s = requestState(ctx, r.da);
    if (!s || !s.choix || s.statut === "ouverte" || s.statut === "renvoyee") continue;
    const date = String(s.date ?? "").slice(0, 10);
    if (!jour || date && date >= jour) return { da: r.da, date: date || "?" };
  }
  return null;
}

// noyau/src/independance.ts
function independance(engs, a, b, options = {}) {
  if (!engs.has(a)) return { ok: false, erreur: `engagement inconnu : ${a}` };
  if (!engs.has(b)) return { ok: false, erreur: `engagement inconnu : ${b}` };
  const criteres = [];
  const aval = dependantsTransitifs(engs, a);
  const amont = dependantsTransitifs(engs, b);
  const lie = aval.has(b) || amont.has(a) || dependsOn(engs.get(a)).some((d) => d.eng === b) || dependsOn(engs.get(b)).some((d) => d.eng === a);
  criteres.push({
    critere: "ordre",
    independants: !lie,
    detail: lie ? `${a} et ${b} sont li\xE9s par le graphe de pr\xE9c\xE9dence` : "aucun lien de pr\xE9c\xE9dence entre les deux"
  });
  const domA = new Set(domaines(engs.get(a)));
  const domCommun = domaines(engs.get(b)).filter((d) => domA.has(d));
  const admis = options.parChemins === true || options.sansReservation === true;
  criteres.push({
    critere: "exclusivite",
    independants: domCommun.length === 0 || admis,
    detail: domCommun.length ? options.sansReservation ? `domaines partag\xE9s : ${domCommun.join(", ")} (admis, r\xE9servations d\xE9sactiv\xE9es)` : options.parChemins ? `domaines partag\xE9s : ${domCommun.join(", ")} (admis, r\xE9servations par chemins)` : `domaines partag\xE9s : ${domCommun.join(", ")} (claims exclusives)` : "domaines disjoints"
  });
  const paires = chevauchement(cheminsScope(engs.get(a)), cheminsScope(engs.get(b)));
  criteres.push({
    critere: "collision",
    independants: paires.length === 0,
    detail: paires.length ? "chevauchement de chemins : " + paires.map(([x, y]) => `${x} ~ ${y}`).join(" ; ") : "scope.paths sans chevauchement de pr\xE9fixes"
  });
  return { ok: true, criteres };
}
function lotsParallelisables(engs, occupes, retenu) {
  const front = frontiere(engs, occupes).map(([eid]) => eid).filter((eid) => !retenu || retenu(eid));
  const lots = [];
  const restants = [...front];
  while (restants.length) {
    const graine = restants.shift();
    const lot = { engagements: [graine], exclusions: [] };
    for (const candidat of [...restants]) {
      let motifExclusion = null;
      for (const membre of lot.engagements) {
        const r = independance(engs, membre, candidat, { parChemins: occupes?.parChemins === true, sansReservation: occupes?.sansReservation === true });
        const bloquant = r.criteres?.find((c) => !c.independants);
        if (bloquant) {
          motifExclusion = `avec ${membre} : ${bloquant.detail}`;
          break;
        }
      }
      if (motifExclusion) {
        lot.exclusions.push({ eng: candidat, motif: motifExclusion });
      } else {
        lot.engagements.push(candidat);
        restants.splice(restants.indexOf(candidat), 1);
      }
    }
    lots.push(lot);
  }
  return lots;
}

// noyau/src/backlog.ts
var fs18 = __toESM(require("node:fs"), 1);
var path16 = __toESM(require("node:path"), 1);
function fichiersDomaines2(ctx) {
  if (readStreams(ctx).declared) return fichiersDomaines(ctx);
  const table = /* @__PURE__ */ new Map();
  if (!fs18.existsSync(ctx.codification)) return table;
  for (const ligne of lireTexte(ctx.codification).split("\n")) {
    const m = ligne.match(/^\|\s*([A-Z]{2,4})\s*\|[^|]*\|\s*`([^`]+)`\s*\|/);
    if (m) table.set(m[1], path16.join(ctx.recette, m[2]));
  }
  return table;
}
function toutesExigences(ctx) {
  const specs = /* @__PURE__ */ new Map();
  for (const [domaine, fichier] of fichiersDomaines2(ctx)) {
    if (!fs18.existsSync(fichier)) continue;
    let texte;
    try {
      texte = lireTexte(fichier);
    } catch {
      continue;
    }
    for (const b of blocsExigences(texte)) {
      specs.set(b.id, { ...b, domaine, couvertePar: null });
    }
  }
  return specs;
}
function couverture(ctx) {
  const cover = /* @__PURE__ */ new Map();
  if (!fs18.existsSync(ctx.engagements)) return cover;
  for (const f of fs18.readdirSync(ctx.engagements).sort()) {
    if (!estDeLaFamille("engagement", f)) continue;
    let doc = {};
    try {
      doc = lireYamlSur(lireTexte(path16.join(ctx.engagements, f))) ?? {};
    } catch {
      continue;
    }
    if (doc.statut === "rompu" || doc.statut === "abandonne" || doc.statut === "remplace") continue;
    const id = String(doc.id ?? identifiantDe("engagement", f) ?? f);
    for (const spec of (Array.isArray(doc.exigences) ? doc.exigences : []).map(String)) {
      if (!cover.has(spec)) cover.set(spec, id);
    }
  }
  return cover;
}
function resteAFaire(ctx, options = {}) {
  const specs = toutesExigences(ctx);
  const cover = couverture(ctx);
  const vises = new Set(options.statut ? formesDuStatut(options.statut) : RESTE_A_FAIRE);
  const retenues = [];
  for (const s of specs.values()) {
    if (!vises.has(s.statut.toUpperCase())) continue;
    if (options.domaine && s.domaine !== options.domaine.toUpperCase()) continue;
    retenues.push({ ...s, couvertePar: cover.get(s.id) ?? null });
  }
  retenues.sort((a, b) => a.id.localeCompare(b.id));
  const parDomaine = /* @__PURE__ */ new Map();
  for (const e of retenues) {
    if (!parDomaine.has(e.domaine)) parDomaine.set(e.domaine, []);
    parDomaine.get(e.domaine).push(e);
  }
  return {
    parDomaine: [...parDomaine.entries()].sort().map(([domaine, exigences2]) => ({ domaine, exigences: exigences2 })),
    total: retenues.length,
    dejaCouvertes: retenues.filter((e) => e.couvertePar).length
  };
}

// noyau/src/editions.ts
var fs19 = __toESM(require("node:fs"), 1);
var path17 = __toESM(require("node:path"), 1);
var EDITION_REGISTRY = "tools/edition/registry.yaml";
var sansCommentaire = (ligne) => {
  let dansChaine = null;
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (dansChaine) {
      if (c === dansChaine) dansChaine = null;
    } else if (c === '"' || c === "'") dansChaine = c;
    else if (c === "#") return ligne.slice(0, i);
  }
  return ligne;
};
var chaine = (valeur) => {
  const m = valeur.trim().match(/^"([^"]*)"|^'([^']*)'/);
  return m ? m[1] ?? m[2] ?? "" : null;
};
function dansTable(table, cle) {
  const m = table.match(new RegExp(`(?:^|[{,\\s])${cle}\\s*=\\s*("([^"]*)"|'([^']*)')`));
  return m ? m[2] ?? m[3] ?? "" : null;
}
var SECTION_DEPS = /^(?:target\.(?:"[^"]*"|'[^']*'|[^.\]]+)(?:\.[^.\]]+)*?\.)?(dependencies|build-dependencies|dev-dependencies)(?:\.(.+))?$/;
function lireManifesteCargo(texte) {
  const m = { nom: null, ligneNom: 1, version: null, versionEspace: null, tag: null, ligneTag: 1, deps: [] };
  let section = "";
  let sousTable = null;
  let profondeur = 0;
  const lignes = texte.split(/\r?\n/);
  for (let i = 0; i < lignes.length; i++) {
    const brute = sansCommentaire(lignes[i]);
    if (profondeur > 0) {
      profondeur += (brute.match(/\[/g) ?? []).length - (brute.match(/\]/g) ?? []).length;
      continue;
    }
    const ligne = brute.trim();
    if (!ligne) continue;
    const tete = ligne.match(/^\[\[?\s*([^\]]+?)\s*\]\]?$/);
    if (tete) {
      section = tete[1].replace(/\s+/g, "");
      sousTable = null;
      const d = section.match(SECTION_DEPS);
      if (d && d[2]) {
        sousTable = { nom: d[2].replace(/^["']|["']$/g, ""), ligne: i + 1, exigence: null, dev: d[1] === "dev-dependencies" };
        m.deps.push(sousTable);
      }
      continue;
    }
    const kv = ligne.match(/^("[^"]+"|'[^']+'|[A-Za-z0-9_.-]+)\s*=\s*(.*)$/);
    if (!kv) continue;
    const cle = kv[1].replace(/^["']|["']$/g, "");
    const valeur = kv[2];
    profondeur = Math.max(0, (valeur.match(/\[/g) ?? []).length - (valeur.match(/\]/g) ?? []).length);
    if (section === "package") {
      if (cle === "name") {
        m.nom = chaine(valeur);
        m.ligneNom = i + 1;
      } else if (cle === "version") m.version = chaine(valeur) ?? (dansTable(valeur, "workspace") !== null || /workspace\s*=\s*true/.test(valeur) ? "workspace" : null);
      else if (cle === "version.workspace") m.version = "workspace";
    } else if (section === "workspace.package") {
      if (cle === "version") m.versionEspace = chaine(valeur);
    } else if (section === "package.metadata.lean-engine" || section === "package.metadata.agelaios") {
      if (cle === "edition") {
        m.tag = chaine(valeur);
        m.ligneTag = i + 1;
      }
    } else if (sousTable) {
      if (cle === "package") sousTable.nom = chaine(valeur) ?? sousTable.nom;
      else if (cle === "version") sousTable.exigence = chaine(valeur);
    } else {
      const d = section.match(SECTION_DEPS);
      if (!d) continue;
      const nomCle = cle.replace(/\.(workspace|path|version|optional|features|package|default-features)$/, "");
      const simple = chaine(valeur);
      m.deps.push({
        nom: dansTable(valeur, "package") ?? nomCle,
        ligne: i + 1,
        exigence: simple !== null && nomCle === cle ? simple : dansTable(valeur, "version"),
        dev: d[1] === "dev-dependencies"
      });
    }
  }
  return m;
}
function lireManifesteNpm(texte) {
  const m = { nom: null, ligneNom: 1, version: null, versionEspace: null, tag: null, ligneTag: 1, deps: [] };
  let d;
  try {
    d = JSON.parse(texte);
  } catch {
    return m;
  }
  const lignes = texte.split(/\r?\n/);
  const ligneDe = (motif, depuis = 0) => {
    const i = lignes.findIndex((l, n) => n >= depuis && l.includes(motif));
    return i < 0 ? 1 : i + 1;
  };
  m.nom = typeof d.name === "string" ? d.name : null;
  m.ligneNom = ligneDe('"name"');
  m.version = typeof d.version === "string" ? d.version : null;
  const tag = (d["lean-engine"] ?? d["agelaios"])?.edition;
  m.tag = typeof tag === "string" ? tag : null;
  m.ligneTag = m.tag ? ligneDe('"lean-engine"') : m.ligneNom;
  for (const [table, dev] of [["dependencies", false], ["peerDependencies", false], ["optionalDependencies", false], ["devDependencies", true]]) {
    const deps = d[table];
    if (!deps || typeof deps !== "object") continue;
    const debut = ligneDe(`"${table}"`) - 1;
    for (const [nom, exigence] of Object.entries(deps)) {
      const e = String(exigence ?? "");
      m.deps.push({ nom, ligne: ligneDe(`"${nom}"`, debut), exigence: /^(workspace:|file:|link:|\*)/.test(e) || !e ? null : e, dev });
    }
  }
  return m;
}
function triplet(v) {
  const m = v.trim().match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  return m ? [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)] : null;
}
function comparer(a, b) {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}
function satisfait(version, exigence) {
  const v = triplet(version);
  const m = exigence.trim().match(/^(\^|~|>=|=)?\s*(.+)$/);
  const e = m ? triplet(m[2]) : null;
  if (!v || !e || /[,|<* ]/.test(exigence.trim().replace(/^(\^|~|>=|=)\s*/, ""))) return true;
  const op = m[1] ?? "^";
  if (op === "=") return comparer(v, e) === 0;
  if (op === ">=") return comparer(v, e) >= 0;
  if (comparer(v, e) < 0) return false;
  if (op === "~") return v[0] === e[0] && v[1] === e[1];
  if (e[0] > 0) return v[0] === e[0];
  if (e[1] > 0) return v[0] === 0 && v[1] === e[1];
  return v[0] === 0 && v[1] === 0 && v[2] === e[2];
}
var editionDe = (valeur) => {
  const v = typeof valeur === "string" ? valeur : valeur && typeof valeur === "object" ? valeur.edition : null;
  return v === "standard" || v === "program" ? v : null;
};
function fichiersSuivis(racine) {
  const r = git(["ls-files", "--", "*Cargo.toml", "*package.json"], racine);
  if (r.code !== 0) return [];
  return r.stdout.split("\n").map((l) => l.trim().replace(/^"|"$/g, "")).filter((l) => l && !l.includes("node_modules/"));
}
function lintEditions(racine, fichiers) {
  const vide = { actif: false, registre: null, standard: 0, program: 0, findings: [] };
  const cheminRegistre2 = path17.join(racine, ...EDITION_REGISTRY.split("/"));
  if (!fs19.existsSync(cheminRegistre2)) return vide;
  let registre;
  try {
    registre = lireYamlSur(lireTexte(cheminRegistre2)) ?? {};
  } catch {
    return {
      ...vide,
      actif: true,
      registre: EDITION_REGISTRY,
      findings: [{ regle: "orphan", gravite: "refus", fichier: EDITION_REGISTRY, ligne: 1, composant: "registry", message: "the edition registry cannot be read as YAML: nothing is classified until it is" }]
    };
  }
  const lignesRegistre = lireTexte(cheminRegistre2).split(/\r?\n/);
  const ligneRegistre = (nom) => {
    const i = lignesRegistre.findIndex((l) => new RegExp(`^\\s+${nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`).test(l));
    return i < 0 ? 1 : i + 1;
  };
  const classes = /* @__PURE__ */ new Map();
  const arbres = /* @__PURE__ */ new Set();
  for (const [espace, crates] of Object.entries(registre.crates ?? {})) {
    arbres.add(espace);
    for (const [nom, v] of Object.entries(crates ?? {})) {
      const e = editionDe(v);
      if (e) classes.set(nom, { edition: e, arbre: espace });
    }
  }
  const ui = registre.ui ?? {};
  for (const genre of ["packages", "apps"]) {
    for (const [nom, v] of Object.entries(ui[genre] ?? {})) {
      const e = editionDe(v);
      if (e) classes.set(`ui:${nom}`, { edition: e, arbre: `lean-ui/${genre}` });
    }
  }
  const composants = /* @__PURE__ */ new Map();
  const versionsEspace = /* @__PURE__ */ new Map();
  const lus = [];
  for (const rel of fichiers ?? fichiersSuivis(racine)) {
    let texte;
    try {
      texte = lireTexte(path17.join(racine, ...rel.split("/")));
    } catch {
      continue;
    }
    const npm = rel.endsWith("package.json");
    const manifeste = npm ? lireManifesteNpm(texte) : lireManifesteCargo(texte);
    if (!npm && manifeste.versionEspace) versionsEspace.set(path17.posix.dirname(rel), manifeste.versionEspace);
    lus.push({ rel, manifeste, npm });
  }
  const versionHeritee = (rel) => {
    let dossier = path17.posix.dirname(rel);
    for (; ; ) {
      const v = versionsEspace.get(dossier);
      if (v) return v;
      const parent = path17.posix.dirname(dossier);
      if (parent === dossier || parent === ".") return versionsEspace.get(parent) ?? null;
      dossier = parent;
    }
  };
  const alias = /* @__PURE__ */ new Map();
  for (const { rel, manifeste, npm } of lus) {
    if (!manifeste.nom) continue;
    const segments = rel.split("/");
    let cle;
    let arbre = null;
    if (npm) {
      if (segments[0] !== "lean-ui" || segments.length !== 4 || !["packages", "apps"].includes(segments[1])) continue;
      cle = `ui:${segments[2]}`;
      alias.set(manifeste.nom, cle);
      arbre = `lean-ui/${segments[1]}`;
    } else {
      cle = manifeste.nom;
      arbre = arbres.has(segments[0]) ? segments[0] : null;
    }
    const classe = classes.get(cle);
    composants.set(cle, {
      nom: manifeste.nom,
      fichier: rel,
      manifeste,
      edition: classe ? classe.edition : null,
      version: manifeste.version === "workspace" ? versionHeritee(rel) : manifeste.version,
      arbre
    });
  }
  const findings = [];
  const cleDe = (c, nomDep) => c.fichier.endsWith("package.json") ? alias.get(nomDep) ?? `ui:${nomDep}` : nomDep;
  for (const [cle, c] of composants) {
    if (!c.edition) {
      if (c.arbre) {
        findings.push({
          regle: "unclassified",
          gravite: "refus",
          fichier: c.fichier,
          ligne: c.manifeste.ligneNom,
          composant: c.nom,
          message: `${c.nom} is not classified: add it to ${EDITION_REGISTRY} as standard or program, then lay its tag (python tools/edition/apply_tags.py)`
        });
      }
      continue;
    }
    if (c.manifeste.tag !== c.edition) {
      findings.push({
        regle: "tag",
        gravite: "refus",
        fichier: c.fichier,
        ligne: c.manifeste.tag ? c.manifeste.ligneTag : c.manifeste.ligneNom,
        composant: c.nom,
        message: c.manifeste.tag ? `${c.nom} is tagged ${c.manifeste.tag} and the registry classifies it ${c.edition}: the registry is the source, lay the tag again (python tools/edition/apply_tags.py)` : `${c.nom} carries no edition tag and the registry classifies it ${c.edition}: lay the tag (python tools/edition/apply_tags.py)`
      });
    }
    for (const dep of c.manifeste.deps) {
      const cible = composants.get(cleDe(c, dep.nom));
      if (!cible || cible === c) continue;
      if (c.edition === "standard" && cible.edition === "program") {
        findings.push({
          regle: "standard_depends_on_program",
          gravite: dep.dev ? "information" : "refus",
          fichier: c.fichier,
          ligne: dep.ligne,
          composant: c.nom,
          message: dep.dev ? `${c.nom} is Standard and its tests depend on ${cible.nom}, which is Program: a development dependency is not delivered, and it is recorded` : `${c.nom} is Standard and depends on ${cible.nom}, which is Program: a Standard component never depends on a Program one, not even optionally (ADR-0026). The Program behaviour plugs into a seam and ships as its own crate`
        });
      }
      if (dep.exigence && cible.version && !satisfait(cible.version, dep.exigence)) {
        findings.push({
          regle: "version_unmet",
          gravite: "refus",
          fichier: c.fichier,
          ligne: dep.ligne,
          composant: c.nom,
          message: `${c.nom} requires ${cible.nom} ${dep.exigence}, and ${cible.nom} is at ${cible.version} in this repository: the requirement and the version have parted`
        });
      }
      if (!dep.dev && c.edition === "program" && cible.edition === "standard" && c.version && cible.version) {
        const p = triplet(c.version);
        const s = triplet(cible.version);
        if (p && s && comparer(p, s) < 0) {
          findings.push({
            regle: "version_behind",
            gravite: "refus",
            fichier: c.fichier,
            ligne: dep.ligne,
            composant: c.nom,
            message: `${c.nom} is Program at ${c.version} and depends on ${cible.nom}, which is Standard at ${cible.version}: the Program edition follows the Standard one, raise its version with it`
          });
        }
      }
    }
  }
  if (!fichiers) {
    for (const [cle, classe] of classes) {
      if (composants.has(cle)) continue;
      const nom = cle.replace(/^ui:/, "");
      findings.push({
        regle: "orphan",
        gravite: "refus",
        fichier: EDITION_REGISTRY,
        ligne: ligneRegistre(nom),
        composant: nom,
        message: `${nom} is classified ${classe.edition} under ${classe.arbre} and no tracked manifest declares it: remove the entry, or restore the component`
      });
    }
  }
  findings.sort((a, b) => a.fichier === b.fichier ? a.ligne - b.ligne : a.fichier < b.fichier ? -1 : 1);
  const classifies = [...composants.values()].filter((c) => c.edition);
  return {
    actif: true,
    registre: EDITION_REGISTRY,
    standard: classifies.filter((c) => c.edition === "standard").length,
    program: classifies.filter((c) => c.edition === "program").length,
    findings
  };
}
var memo = /* @__PURE__ */ new Map();
var EDITIONS_MEMO_MS = 5e3;
function editions(ctx) {
  const connu = memo.get(ctx.racine);
  if (connu && Date.now() - connu.a < EDITIONS_MEMO_MS) return connu.resultat;
  const resultat = lintEditions(ctx.racine);
  memo.set(ctx.racine, { a: Date.now(), resultat });
  return resultat;
}

// noyau/src/priorWork.ts
var FOREIGN_COMMITS_MAX = 20;
function instant(v) {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.getTime();
  if (v === null || v === void 0 || v === "") return null;
  return parseIso(String(v))?.getTime() ?? null;
}
function recordAt(ctx, ref, eng, cle = cleDepot(ctx)) {
  const texte = memoriser(ctx, `distant-${shortRef(ref).replace(/\//g, "_")}-${eng}`, cle, () => fileAtRef(ctx, ref, relEngagement(ctx, eng)) ?? "");
  if (texte === "") return null;
  try {
    const d = lireYamlSur(texte);
    return d && typeof d === "object" && !Array.isArray(d) ? d : null;
  } catch {
    return null;
  }
}
function foreignCommits(ctx, eng, cle = cleDepot(ctx)) {
  if (!estRacineGit(ctx)) return [];
  return memoriser(ctx, `foreign-${eng}`, cle, () => lireForeignCommits(ctx, eng));
}
function lireForeignCommits(ctx, eng) {
  const r = git(
    [
      "log",
      `--max-count=${FOREIGN_COMMITS_MAX}`,
      "--format=%h%x09%cI%x09%s",
      "--fixed-strings",
      `--grep=[${eng}]`,
      "--remotes",
      "--not",
      "--branches",
      "HEAD"
    ],
    ctx.racine
  );
  if (r.code !== 0) return [];
  return r.stdout.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [sha, date, ...reste] = l.split("	");
    return { sha, date, subject: reste.join("	") };
  });
}
function remoteFindings(ctx, local, refs = trunkRefs(ctx), cle) {
  const eng = String(local.id);
  const findings = [];
  if (!refs.length) return { findings, commits: [] };
  const statutLocal = String(local.statut ?? "");
  const prisLocal = instant(local.pris_le);
  const cleMemo = cle ?? cleDepot(ctx);
  for (const ref of refs) {
    const distant = recordAt(ctx, ref, eng, cleMemo);
    if (!distant) continue;
    const statut = String(distant.statut ?? "");
    const nom = shortRef(ref);
    if (estClos(statut) && statut !== statutLocal) {
      const quand = distant.restitue_le ? `, delivered on ${isoOf(distant.restitue_le)}` : "";
      const lu = statut === "tenu" ? "held" : statut === "rompu" ? "broken" : statut === "abandonne" ? "abandoned" : `replaced by ${String(distant.remplace_par ?? "?")}`;
      findings.push({
        kind: "closed_elsewhere",
        constat: `${eng} is ${lu} on ${nom}${quand}, and this clone still records it as '${statutLocal}'`
      });
      continue;
    }
    if (statut !== "pris") continue;
    const prisDistant = instant(distant.pris_le);
    const autrePrise = statutLocal === "propose" || statutLocal === "pris" && prisDistant !== null && (prisLocal === null || prisDistant > prisLocal);
    if (!autrePrise) continue;
    findings.push({
      kind: "taken_elsewhere",
      constat: `${eng} is taken on ${nom}${distant.promettant ? ` by ${String(distant.promettant)}` : ""}${distant.reserve_par ? `, from the workstation of ${String(distant.reserve_par)}` : ""}${distant.pris_le ? `, since ${isoOf(distant.pris_le)}` : ""}` + (statutLocal === "pris" ? `, after the take that this clone records (${isoOf(local.pris_le)})` : `, and this clone still records it as '${statutLocal}'`)
    });
  }
  const commits = foreignCommits(ctx, eng, cleMemo);
  if (commits.length) {
    findings.push({
      kind: "work_elsewhere",
      constat: `${commits.length}${commits.length === FOREIGN_COMMITS_MAX ? " or more" : ""} commit(s) that cite [${eng}] are on a remote and in no local branch, the latest being ${commits[0].sha} of ${commits[0].date.slice(0, 10)}: ${commits[0].subject.slice(0, 120)}`
    });
  }
  return { findings, commits };
}
function isoOf(v) {
  return v instanceof Date ? v.toISOString().slice(0, 19) + "+00:00" : String(v);
}
function gestureFor(eng, moment = "pull") {
  if (moment === "session") {
    return `stop writing now. The session that holds the lease declares it from its worktree: eng push --blocage "what the remote shows for this commitment, and what this worktree already holds". The coordinator merges the remote ${TRUNK}, reads lean show ${eng} and lean rapport ${eng}, and what remains of the commitment is then decided, never assumed`;
  }
  return `git pull --ff-only (or merge the remote ${TRUNK}), then lean show ${eng} and lean rapport ${eng}. Write nothing before that. If the work is still due once what exists has been read, eng pull ${eng} --acknowledged "what exists, and why the work is still due"`;
}
function stateTreeBehind(ctx, refs = trunkRefs(ctx)) {
  let pire = null;
  const rel = ctx.etat.slice(ctx.racine.length).replace(/\\/g, "/").replace(/^\/+/, "");
  for (const ref of refs) {
    const r = git(["rev-list", "--count", `${TRUNK}..${ref}`, "--", rel], ctx.racine);
    const n = r.code === 0 ? Number(r.stdout.trim()) : 0;
    if (n > 0 && (!pire || n > pire.commits)) pire = { ref: shortRef(ref), commits: n };
  }
  return pire;
}
function unpublishedTakes(ctx, engs, refs = trunkRefs(ctx), cle) {
  if (!refs.length) return [];
  const sortie = [];
  const cleMemo = cle ?? cleDepot(ctx);
  for (const [id, e] of engs) {
    if (String(e.statut) !== "pris") continue;
    const local = instant(e.pris_le);
    const publie = refs.some((ref) => {
      const d = recordAt(ctx, ref, id, cleMemo);
      if (!d) return false;
      if (String(d.statut) !== "pris") return estClos(d.statut);
      const distant = instant(d.pris_le);
      return local === null || distant === null || distant >= local;
    });
    if (!publie) sortie.push(id);
  }
  return sortie.sort();
}

// noyau/src/integrite.ts
var fs21 = __toESM(require("node:fs"), 1);

// noyau/src/runtime.ts
var fs20 = __toESM(require("node:fs"), 1);
var path18 = __toESM(require("node:path"), 1);
var DOSSIER_RUNTIME = ".lean-engine/bin";
function runtimeNonCommite(ctx) {
  const dossier = path18.join(ctx.racine, DOSSIER_RUNTIME);
  if (!fs20.existsSync(dossier)) return null;
  if (git(["rev-parse", "--git-dir"], ctx.racine).code !== 0) return null;
  const r = git(["status", "--porcelain", "--", DOSSIER_RUNTIME], ctx.racine);
  if (r.code !== 0) return null;
  const fichiers = r.stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim().replace(/^"|"$/g, ""));
  if (!fichiers.length) return null;
  return `${fichiers.length} file(s) under ${DOSSIER_RUNTIME} differ from HEAD (${fichiers.slice(0, 4).join(", ")}${fichiers.length > 4 ? ", and others" : ""})`;
}

// noyau/src/integrite.ts
function brancheOu(ctx, eng, cle) {
  return memoriser(ctx, `branche-${eng}`, cle, () => lireBrancheOu(ctx, eng));
}
function lireBrancheOu(ctx, eng) {
  const branche = brancheEngagement(eng);
  const lieux = [];
  if (git(["rev-parse", "--verify", "-q", `refs/heads/${branche}`], ctx.racine).code === 0) lieux.push("this clone");
  const distantes = git(["for-each-ref", "--format=%(refname:short)", `refs/remotes/*/${branche}`], ctx.racine).stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  lieux.push(...distantes);
  return lieux;
}
function incoherences(ctx, engs) {
  const sortie = [];
  const config = lireConfig(ctx);
  let cle = null;
  const cleUneFois = () => cle ??= cleDepot(ctx);
  for (const [eid, e] of engs) {
    if (String(e.statut) !== "pris") continue;
    const rec = chargerRecord(ctx, eid);
    const etat = rec ? deriverEtat(ctx, rec) : null;
    if (rec && !["released", "expire"].includes(etat ?? "")) continue;
    const lieux = brancheOu(ctx, eid, cleUneFois());
    const worktree = fs21.existsSync(String(rec?.worktree ?? cheminWorktree(ctx, eid)));
    const restitue = e.restitue_le ? ` It delivered on ${String(e.restitue_le).slice(0, 16)}.` : "";
    sortie.push({
      code: "pris_sans_lease",
      gravite: "attente",
      cibles: [eid],
      constat: `${eid} is taken${e.reserve_par ? ` (workstation of ${String(e.reserve_par)})` : ""} and no live lease holds it here` + (rec ? ` (lease ${etat})` : "") + `.${restitue} Its branch exists ${lieux.length ? `on ${lieux.join(", ")}` : "nowhere that this clone can see"}${worktree ? ", and its worktree is still there" : ""}.`,
      pourquoi: "the registry says that a session works on it, so the frontier withholds it and its domain stays reserved, while nobody writes it: ENG-0161 stood so for two days after two rejections, its work in no reference",
      geste: lieux.length ? `lean prior ${eid}, then eng pull ${eid} to resume from the branch, or lean relacher ${eid} to give it back` : `lean relacher ${eid}: the work is not in this clone; if it exists on another workstation, publish it there first`
    });
  }
  for (const c of chargerClaims(ctx)) {
    if (!detenue(ctx, c)) continue;
    const e = engs.get(String(c.eng));
    if (e && String(e.statut) === "pris") continue;
    sortie.push({
      code: "claim_sans_pris",
      gravite: "hygiene",
      cibles: [String(c.eng)],
      constat: `domain ${c.domaine} is reserved by ${c.eng}, whose status is ${e ? String(e.statut) : "unknown"}`,
      pourquoi: "a reservation protects a commitment in flight; held by any other, it refuses pulls for nothing",
      geste: `lean claims release ${c.eng}`
    });
  }
  const seuilMs = config.verification_attendue_heures * 36e5;
  for (const l of listerLeases(ctx)) {
    if (l.state !== "livre") continue;
    if (chargerMandat(ctx, l.eng)) continue;
    const rec = chargerRecord(ctx, l.eng);
    const depuis = parseIso(rec?.livraison_le);
    if (!depuis || Date.now() - depuis.getTime() < seuilMs) continue;
    const heures = Math.floor((Date.now() - depuis.getTime()) / 36e5);
    sortie.push({
      code: "livraison_non_verifiee",
      gravite: "attente",
      cibles: [l.eng],
      constat: `${l.eng} delivered ${heures} hour(s) ago and no mandate verifies it`,
      pourquoi: "the session that delivered launches the verifier at once; a delivery that waits holds its domain and its worktree, and the frontier behind it",
      geste: `lean mandat ${l.eng}, from a verifier session`
    });
  }
  for (const l of listerLeases(ctx)) {
    const rec = chargerRecord(ctx, l.eng);
    if (!rec || Number(rec.rejets_consecutifs ?? 0) < 2) continue;
    if (continuationDecidee(ctx, l.eng, rec.dernier_rejet_le ? String(rec.dernier_rejet_le) : null)) continue;
    sortie.push({
      code: "rejets_sans_decision",
      gravite: "attente",
      cibles: [l.eng],
      constat: `${l.eng} was rejected ${Number(rec.rejets_consecutifs)} times in a row, and no arbitration request decided how it goes on`,
      pourquoi: "the rule of the two rejections hands the continuation to the operator; until a request is decided the next delivery is refused, and the worktree, the lease and the domain stay held",
      geste: `in the worktree of ${l.eng}: BLOCKED.md written as the request, eng push --livraison, then eng attendre`
    });
  }
  const cap = plafond(ctx);
  if (cap >= 1e3) {
    sortie.push({
      code: "plafond_desactive",
      gravite: "hygiene",
      cibles: [],
      constat: `the concurrency cap is ${cap}: it no longer bounds anything`,
      pourquoi: "a cap that nothing reaches is a setting that nobody reads; the host memory bounds the sessions instead, and says nothing",
      geste: "lean plafond N, with the number of sessions the host runs at once"
    });
  }
  const runtime = runtimeNonCommite(ctx);
  if (runtime) {
    sortie.push({
      code: "runtime_non_commite",
      gravite: config.runtime_commite_requis ? "bloquant" : "attente",
      cibles: [],
      constat: `the placed runtime differs from the committed one: ${runtime}`,
      pourquoi: "every transaction of this workstation runs under a runtime that the other workstations do not have; " + (config.runtime_commite_requis ? "the transactions are refused until it is committed" : "its rules may differ from theirs"),
      geste: "commit .lean-engine/bin with the source that built it, then push master (or revert the runtime to the committed one)"
    });
  }
  const ordre = { bloquant: 0, attente: 1, hygiene: 2 };
  return sortie.sort((a, b) => ordre[a.gravite] - ordre[b.gravite]);
}

// noyau/src/structure.ts
var SEUIL_ENTONNOIR = 6;
var SEUIL_CONCENTRATION = 3;
var SEUIL_CHAINE = 3;
var jalonDe = (e) => {
  const b = String(e.beneficiaire ?? "");
  return b.startsWith("jalon:") ? b.slice(6) : null;
};
function entonnoirs(engs, seuil = SEUIL_ENTONNOIR) {
  const sortie = [];
  for (const [id, e] of engs) {
    if (estClos(e.statut)) continue;
    const preds = dependsOn(e).filter((d) => d.type === "finish-start" && engs.has(String(d.eng))).map((d) => String(d.eng));
    if (preds.length <= seuil) continue;
    sortie.push({ eng: id, jalon: jalonDe(e), predecesseurs: preds, en_attente: preds.filter((p) => !predecesseurSatisfait(engs, p)) });
  }
  return sortie.sort((a, b) => b.predecesseurs.length - a.predecesseurs.length);
}
function suitesDansLeScope(engs) {
  const sortie = [];
  for (const [id, e] of engs) {
    if (e.statut !== "propose") continue;
    const chemins = cheminsScope(e);
    if (!chemins.length) continue;
    for (const d of dependsOn(e)) {
      if (d.type !== "finish-start") continue;
      const parent = engs.get(String(d.eng));
      if (!parent || parent.statut !== "tenu") continue;
      const motifs = cheminsScope(parent);
      if (!motifs.length) continue;
      if (chemins.every((c) => dansMotifs(prefixeLitteral(c) || c, motifs) || motifs.includes(c))) {
        sortie.push({ eng: id, parent: String(d.eng), jalon: jalonDe(e) });
        break;
      }
    }
  }
  return sortie;
}
function concentrationChemins(engs, occupes, seuil = SEUIL_CONCENTRATION) {
  const prets = frontiere(engs, occupes).map(([id]) => id);
  const parPrefixe = /* @__PURE__ */ new Map();
  for (const id of prets) {
    for (const motif of cheminsScope(engs.get(id))) {
      const p = prefixeLitteral(motif);
      if (!p || motif === p) continue;
      if (!parPrefixe.has(p)) parPrefixe.set(p, /* @__PURE__ */ new Set());
      parPrefixe.get(p).add(id);
    }
  }
  return [...parPrefixe.entries()].filter(([, ids]) => ids.size >= seuil).map(([prefixe, ids]) => ({ prefixe, engagements: [...ids].sort() })).sort((a, b) => b.engagements.length - a.engagements.length);
}
function chainesSansContrat(ctx, engs, seuil = SEUIL_CHAINE) {
  const sortie = [];
  for (const [jalon, chaine2] of Object.entries(cheminsCritiques(ctx, engs))) {
    const restante = chaine2.filter((id) => engs.get(id)?.statut !== "tenu");
    if (restante.length < seuil) continue;
    const siens = [...engs.values()].filter((e) => jalonDe(e) === jalon);
    const uneInterface = siens.some((e) => dependsOn(e).some((d) => d.type === "interface"));
    if (uneInterface) continue;
    sortie.push({ jalon, chaine: restante });
  }
  return sortie;
}

// noyau/src/conseils.ts
function blocageSurPrecedence(ctx, l) {
  for (const f of [path19.join(String(l.worktree ?? ""), "BLOCKED.md"), path19.join(ctx.livraisons, l.eng, "BLOCKED.md")]) {
    try {
      if (fs22.existsSync(f)) return blocksOnPrecedence(fs22.readFileSync(f, "utf-8"));
    } catch {
    }
  }
  return false;
}
var ORDRE = { bloquant: 0, attente: 1, hygiene: 2 };
function gelesParRupture(engs) {
  const sortie = [];
  for (const [eid, e] of engs) {
    if (etatCalcule(engs, eid) !== "gele") continue;
    const deps = Array.isArray(e.depends_on) ? e.depends_on : [];
    const rompus = deps.map((d) => String(d.eng ?? "")).filter((x) => engs.has(x) && statutEffectif(engs, x) === "rompu");
    if (rompus.length) sortie.push({ eng: eid, rompus });
  }
  return sortie;
}
function dependantsDAbandon(engs) {
  const sortie = [];
  for (const [eid, e] of engs) {
    if (String(e.statut) !== "propose") continue;
    const deps = Array.isArray(e.depends_on) ? e.depends_on : [];
    const abandonnes = deps.filter((d) => String(d.type ?? "") === "finish-start").map((d) => String(d.eng ?? "")).filter((x) => engs.has(x) && String(engs.get(x).statut) === "abandonne");
    if (abandonnes.length) sortie.push({ eng: eid, abandonnes });
  }
  return sortie;
}
function remplacesSansPorteur(engs) {
  const sortie = [];
  for (const [eid, e] of engs) {
    if (String(e.statut) !== "remplace") continue;
    const st = statutEffectif(engs, eid);
    if (st === "propose" || st === "pris" || st === "tenu") continue;
    sortie.push({ eng: eid, porteur: String(e.remplace_par ?? "?"), statut: st });
  }
  return sortie;
}
function collisionsTirables(ctx, engs) {
  const prets = frontiere(engs, domainesOccupes(ctx)).map(([eid]) => eid);
  const sortie = [];
  for (let i = 0; i < prets.length; i++) {
    for (let j = i + 1; j < prets.length; j++) {
      const paires = chevauchement(cheminsScope(engs.get(prets[i])), cheminsScope(engs.get(prets[j])));
      if (paires.length) sortie.push([prets[i], prets[j], `${paires[0][0]} \u2194 ${paires[0][1]}`]);
    }
  }
  return sortie;
}
function goulots(engs) {
  const sortie = [];
  for (const [eid] of engs) {
    const etat = etatCalcule(engs, eid);
    if (etat === "tenu") continue;
    const aval = dependantsTransitifs(engs, eid).size;
    if (aval > 0) sortie.push({ eng: eid, debloque: aval, etat });
  }
  return sortie.sort((a, b) => b.debloque - a.debloque);
}
function amorcage(ctx, engs) {
  if (engs.size) return null;
  const domaines2 = fichiersDomaines(ctx).size;
  const jalons = chargerJalons(ctx).size;
  if (!domaines2 || !jalons) {
    const manque = [!domaines2 ? "no domain in dossier-recette/02_CODIFICATION.md" : "", !jalons ? "no milestone" : ""].filter(Boolean).join(", ");
    return {
      gravite: "bloquant",
      constat: `this project is not steered yet: ${manque}, and no commitment`,
      pourquoi: "without domains and milestones no requirement can be written and no commitment can be drafted, so no session can ever pull work",
      geste: "/bootstrap, run WITH the operator: vision, domains, milestones, first requirements, first commitments",
      cibles: []
    };
  }
  return {
    gravite: "attente",
    constat: `${domaines2} domain(s) and ${jalons} milestone(s) are declared, but no commitment exists`,
    pourquoi: "the frontier stays empty until a commitment is drafted from the requirements",
    geste: "lean backlog, then lean draft SPEC-DOM-NNN",
    cibles: []
  };
}
function conseils(ctx, options = {}) {
  const sortie = [];
  const erreurs = [];
  let topDepart = Date.now();
  const tic = (nom) => {
    if (!process.env.LEAN_ENGINE_PROFIL) return;
    process.stderr.write(`[profil] ${nom.padEnd(22)} ${String(Date.now() - topDepart).padStart(6)} ms
`);
    topDepart = Date.now();
  };
  const engs = chargerRegistre(ctx, erreurs);
  const v = valider(ctx, engs);
  tic("registre");
  for (const u of unadvisedRequests(ctx)) {
    sortie.push({
      gravite: "attente",
      constat: `${u.id} asks the operator to decide without advising them: ${u.manques.map((m) => m.split(":")[0]).join("; ")}`,
      pourquoi: "the operator is always advised: a request states at least two enumerated options with their consequences, and the option its requester recommends after investigating. Without them the decider does the work of the requester",
      geste: `lean show ${u.id}, then complete its options and its recommendation` + (u.eng ? ` from the blocker report (lean rapport ${u.eng})` : ""),
      cibles: u.eng ? [u.id, u.eng] : [u.id]
    });
  }
  tic("requetes sans avis");
  if (erreurs.length || v.erreurs.length) {
    sortie.push({
      gravite: "bloquant",
      constat: `le registre porte ${erreurs.length + v.erreurs.length} erreur(s) : ${[...erreurs, ...v.erreurs][0]}`,
      pourquoi: "la porte du tirage refuse sur registre invalide : AUCUNE session ne peut plus tirer, quelle que soit son urgence",
      geste: "lean verifier",
      cibles: [...erreurs, ...v.erreurs].map((e) => String(e).split(" ")[0]).slice(0, 5)
    });
  }
  const amorce = amorcage(ctx, engs);
  if (amorce) sortie.push(amorce);
  for (const f of etatNumerotation(ctx)) {
    if (!f.doublons.length) continue;
    sortie.push({
      gravite: "bloquant",
      constat: `${f.famille} : ${f.doublons.length} identifiant(s) port\xE9s par plusieurs fichiers (${f.doublons.join(", ")})`,
      pourquoi: "deux documents sous le m\xEAme num\xE9ro : toute citation devient ambigu\xEB, et une fusion en perdra un",
      geste: "lean numero, then lean renumeroter <record> on the one that exists in this clone only",
      cibles: f.doublons
    });
  }
  tic("registre, numerotation");
  try {
    const refus = editions(ctx).findings.filter((f) => f.gravite === "refus");
    if (refus.length) {
      const parRegle = /* @__PURE__ */ new Map();
      for (const f of refus) parRegle.set(f.regle, (parRegle.get(f.regle) ?? 0) + 1);
      sortie.push({
        gravite: "attente",
        constat: `${refus.length} edition finding(s) between Standard and Program (` + [...parRegle].map(([r, n]) => `${n} ${r}`).join(", ") + `), the first in ${refus[0].fichier}:${refus[0].ligne}`,
        pourquoi: "a component left unclassified, a tag that contradicts the registry or a Standard component that depends on a Program one is refused by the edition guards of the pipeline, once pushed and far from its author; a Program component behind the Standard one it extends ships against a version that no longer exists",
        geste: "lean editions",
        cibles: []
      });
    }
  } catch {
  }
  tic("editions");
  const locaux = recordsNonPublies(ctx);
  if (locaux.length) {
    const noms = locaux.flatMap((l) => l.fichiers.map((n) => n.replace(/\.[^.]+$/, "")));
    sortie.push({
      gravite: "attente",
      constat: `${noms.length} numbered record(s) exist in this clone only (${noms.slice(0, 6).join(", ")}${noms.length > 6 ? ", and others" : ""})`,
      pourquoi: "a number is seen by another clone only once its record is on the remote: until then that clone hands out the same number, which is how ADR-0081 was issued twice on 2026-10-09",
      geste: "commit the records of the state tree and push master",
      cibles: noms.slice(0, 20)
    });
  }
  tic("records non publies");
  try {
    const refs = trunkRefs(ctx);
    const cleRefs = refs.length ? cleDepot(ctx) : "";
    const sessionsVivantes = new Set(
      (refs.length ? listerLeases(ctx) : []).filter((l) => !["released", "revoked", "expire"].includes(l.state)).map((l) => l.eng)
    );
    for (const [eid, e] of refs.length ? engs : []) {
      if (String(e.statut) !== "pris") continue;
      const { findings } = remoteFindings(ctx, e, refs, cleRefs);
      if (!findings.length) continue;
      const enVol = sessionsVivantes.has(eid);
      sortie.push({
        gravite: enVol ? "bloquant" : "attente",
        constat: `work on ${eid} exists elsewhere: ${findings.map((f) => f.constat).join("; ")}`,
        pourquoi: "a session that goes on from its local state realises the commitment a second time: ENG-0272 was realised twice this way on 2026-10-11, and a whole commitment was spent comparing the two",
        geste: enVol ? gestureFor(eid, "session") : `lean prior ${eid}, then merge or read what the remote holds before anyone resumes ${eid} in this clone`,
        cibles: [eid]
      });
    }
    const retard = stateTreeBehind(ctx, refs);
    if (retard) {
      sortie.push({
        gravite: "attente",
        constat: `the state tree of this clone is ${retard.commits} commit(s) behind ${retard.ref}`,
        pourquoi: "a commitment opened, taken or held elsewhere is invisible here until it is merged: the frontier, the advice and every pull of this clone answer from a state that is no longer current",
        geste: `git pull --ff-only (or merge ${retard.ref}), then lean conseils`,
        cibles: []
      });
    }
    const avance = refs.length ? trunkAhead(ctx) : null;
    if (avance) {
      sortie.push({
        gravite: "attente",
        constat: `master holds ${avance.commits} commit(s) that ${avance.ref} does not`,
        pourquoi: "a take, a delivery or a decision committed here is invisible to the other workstations until it is pushed: the push that follows a transaction did not go through, or the commits were made by hand",
        geste: "git push origin master (after git pull --ff-only, or a merge, when the remote moved)",
        cibles: []
      });
    }
    const nonPubliees = unpublishedTakes(ctx, engs, refs, cleRefs);
    if (nonPubliees.length) {
      sortie.push({
        gravite: "attente",
        constat: `${nonPubliees.length} commitment(s) taken in this clone are not shown as taken on the remote (${nonPubliees.slice(0, 6).join(", ")}${nonPubliees.length > 6 ? ", and others" : ""})`,
        pourquoi: "another clone reads them as free and can take them too: a take protects the work only once the remote holds it",
        geste: "commit the records of these commitments and push master (a pull does both by itself, unless its push was refused)",
        cibles: nonPubliees.slice(0, 20)
      });
    }
  } catch {
  }
  tic("travail anterieur");
  try {
    for (const i of incoherences(ctx, engs)) {
      sortie.push({ gravite: i.gravite, constat: i.constat, pourquoi: i.pourquoi, geste: i.geste, cibles: i.cibles });
    }
  } catch {
  }
  if (enPause(ctx)) {
    sortie.push({
      gravite: "bloquant",
      constat: "la pause globale est active",
      pourquoi: "aucun tirage ne passe et toute \xE9criture de session est refus\xE9e au prochain outil",
      geste: "lean reprise",
      cibles: []
    });
  }
  tic("incoherences");
  const das = chargerDas(ctx).filter((d) => d.statut === "ouverte");
  for (const d of das) {
    const echeance = parseIso(d.echeance_reponse);
    const depassee = echeance !== null && echeance.getTime() < Date.now();
    sortie.push({
      gravite: "attente",
      constat: `${d.id} est ouverte${depassee ? ", et son \xE9ch\xE9ance de r\xE9ponse est d\xE9pass\xE9e" : ""} : ${d.titre}`,
      pourquoi: depassee ? `le d\xE9cideur (${d.decideur ?? "non d\xE9sign\xE9"}) n'a pas r\xE9pondu ; l'issue de secours est \xAB ${d.defaut_si_silence ?? "aucune"} \xBB` : `seul ${d.decideur ?? "le d\xE9cideur d\xE9sign\xE9"} peut trancher le fond ; un agent instruit, il ne d\xE9cide pas`,
      geste: `lean decider ${d.id} --choix X --motif "..."`,
      cibles: [String(d.id)]
    });
  }
  for (const d of chargerDas(ctx).filter((x) => x.statut === "renvoyee")) {
    const renvoi = renvoiDeDa(ctx, String(d.id));
    sortie.push({
      gravite: "attente",
      constat: `${d.id} was returned for study by its decider${renvoi?.motif ? `: ${renvoi.motif}` : ""}`,
      pourquoi: "the decider could not decide on the request as written, and the decision it asks for stays blocked until an agent investigates the problem again and rewrites the context, the stake and the options for a reader who has none of the history",
      geste: `lean show ${d.id}, investigate and rewrite the request, then lean republier ${d.id}`,
      cibles: [String(d.id)]
    });
  }
  const leases = listerLeases(ctx);
  const expires = [];
  for (const l of leases) {
    const pose = chargerMandat(ctx, l.eng);
    if (l.state === "livre" && pose && pose.statut === "revoque") {
      sortie.push({
        gravite: "attente",
        constat: `the verification mandate of ${l.eng} was voided by the operator, and the delivery waits for a new verifier`,
        pourquoi: "a voided mandate accepts no verdict: the verification is taken up again from a new mandate, on the diff as it stands",
        geste: `lean mandat ${l.eng}`,
        cibles: [l.eng]
      });
    }
    if (l.state === "livre" && !pose) {
      sortie.push({
        gravite: "attente",
        constat: `${l.eng} a livr\xE9 son rapport, sans mandat de v\xE9rification`,
        pourquoi: "celui qui impl\xE9mente ne juge jamais : le verdict exige un mandat, sur un diff fig\xE9",
        geste: `lean mandat ${l.eng}`,
        cibles: [l.eng]
      });
    }
    const rendu = chargerMandat(ctx, l.eng);
    if (rendu && rendu.statut === "rendu" && rendu.verdict === "approve") {
      sortie.push({
        gravite: "attente",
        constat: `${l.eng} is approved by its verifier and is not integrated yet`,
        pourquoi: "the merge, the held status and the removal of the worktree are one transaction; it was refused or interrupted, and nothing downstream moves until it goes through",
        geste: `lean integrer ${l.eng}`,
        cibles: [l.eng]
      });
    }
    if (l.state === "bloque" && fs22.existsSync(path19.join(ctx.livraisons, l.eng, "ANSWER.md"))) {
      sortie.push({
        gravite: "attente",
        constat: `${l.eng}: the operator answered the question of the session, and the answer waits to be carried out`,
        pourquoi: "the session stays blocked until an agent applies the answer: a scope or a requirement does not change by itself",
        geste: `lean rapport ${l.eng} (the answer follows the report), then carry it out`,
        cibles: [l.eng]
      });
    } else if (l.state === "bloque" && !blocageSurPrecedence(ctx, l)) {
      const demandes = requestsOf(ctx, l.eng);
      const enCours = demandes.find((r) => r.statut === "ouverte" || r.statut === "renvoyee");
      const tranchee = demandes.find((r) => r.statut !== "ouverte" && r.statut !== "renvoyee");
      if (enCours) {
        sortie.push({
          gravite: "attente",
          constat: `${l.eng} is blocked on ${enCours.da}, which is ${enCours.statut === "renvoyee" ? "returned for study" : "open"}`,
          pourquoi: enCours.statut === "renvoyee" ? "the decider could not decide on the request as written: the session rewrites it, and stays blocked until then" : `only ${enCours.decideur ?? "the decider named"} settles it, and the session resumes by itself once it is decided`,
          geste: enCours.statut === "renvoyee" ? `lean show ${enCours.da}, rewrite it, then lean republier ${enCours.da}` : `lean decider ${enCours.da} --choix X --motif "..."`,
          cibles: [l.eng, enCours.da]
        });
      } else if (tranchee) {
        sortie.push({
          gravite: "attente",
          constat: `${tranchee.da} is decided, and ${l.eng} has not resumed yet`,
          pourquoi: "the decision is in the worktree (.eng/DECISION.md) and `eng attendre` ended on it: the session carries it out, or a session is started again in the worktree if the one that waited is gone",
          geste: `in the worktree of ${l.eng}: eng attendre ${tranchee.da} prints the decision, then remove BLOCKED.md and resume`,
          cibles: [l.eng, tranchee.da]
        });
      } else {
        sortie.push({
          gravite: "attente",
          constat: `${l.eng} se d\xE9clare bloqu\xE9, and no arbitration request is filed for it`,
          pourquoi: "a blocker of substance is decided through an arbitration request and nothing else: either the session has not delivered its report yet, or the report predates this rule, or it asks for a change of requirement (SCP)",
          geste: `lean rapport ${l.eng}, then lean arbitrer ${l.eng} to file the request from the report`,
          cibles: [l.eng]
        });
      }
    }
    if (l.state === "expire") expires.push(l.eng);
    if (l.state === "stale") {
      sortie.push({
        gravite: "attente",
        constat: `${l.eng} n'a plus donn\xE9 signe depuis plus de ${STALE_MIN} minutes`,
        pourquoi: "la session est peut-\xEAtre morte : son domaine reste r\xE9serv\xE9 et personne d'autre ne peut le prendre",
        geste: `lean sessions`,
        cibles: [l.eng]
      });
    }
    const mandat = chargerMandat(ctx, l.eng);
    if (mandat && mandat.statut === "ouvert") {
      const echeance = parseIso(mandat.echeance);
      if (echeance && echeance.getTime() < Date.now()) {
        sortie.push({
          gravite: "attente",
          constat: `le mandat de v\xE9rification de ${l.eng} est \xE9chu`,
          pourquoi: "un mandat \xE9chu n'accepte plus de verdict : le diff a pu bouger depuis qu'il a \xE9t\xE9 fig\xE9",
          geste: `lean mandat ${l.eng}`,
          cibles: [l.eng]
        });
      }
    }
  }
  if (expires.length) {
    sortie.push({
      gravite: "hygiene",
      constat: `${expires.length} lease(s) expir\xE9(s) : ${expires.slice(0, 6).join(", ")}${expires.length > 6 ? "\u2026" : ""}`,
      pourquoi: "leur r\xE9servation de domaine est lib\xE9r\xE9e, mais leur statut reste `pris` : le registre ment sur l'\xE9tat r\xE9el, et la fronti\xE8re s'en trouve fauss\xE9e",
      geste: `lean relacher ${expires[0]}`,
      cibles: expires
    });
  }
  tic("arbitrages et leases");
  const occupes = domainesOccupes(ctx);
  const prets = frontiere(engs, occupes);
  for (const r of retenusParClaims(engs, occupes)) {
    const titulaires = [...new Set(r.claims.map((c) => c.eng))];
    sortie.push({
      gravite: "attente",
      constat: `${r.eng} is ready but held back: ` + r.claims.map((c) => `domain ${c.domaine} is claimed by ${c.eng} (lease of ${c.owner})${c.chemins ? `, on the paths ${c.chemins.join("; ")}` : ""}`).join("; "),
      pourquoi: "a pull refuses a commitment one of whose domains is held: it frees itself when the holder is delivered and held, or released. Until then it is not on the frontier",
      geste: `lean show ${titulaires[0]}  (then, if it no longer moves: lean relacher ${titulaires[0]})`,
      cibles: [r.eng, ...titulaires]
    });
  }
  const enAttente = [...engs.keys()].filter((e) => etatCalcule(engs, e) === "en_attente");
  const geles = gelesParRupture(engs);
  for (const g of geles) {
    sortie.push({
      gravite: "bloquant",
      constat: `${g.eng} est gel\xE9 par une rupture amont (${g.rompus.join(", ")})`,
      pourquoi: "un engagement rompu ne sera jamais tenu : ce gel ne l\xE8vera donc JAMAIS de lui-m\xEAme. Il faut res\xE9quencer, ou proposer un nouvel engagement qui reprenne le travail d\xFB",
      geste: `lean resequencer ${g.eng} --deps "..."`,
      cibles: [g.eng, ...g.rompus]
    });
  }
  for (const a of dependantsDAbandon(engs)) {
    sortie.push({
      gravite: "hygiene",
      constat: `${a.eng} depends on a withdrawn record (${a.abandonnes.join(", ")})`,
      pourquoi: "an abandoned record holds nothing back, so the dependant goes on; but what it was waiting for may have been a premise of its own definition of done, which then reads false",
      geste: `lean show ${a.eng}, then amend its record or resequence it: lean resequencer ${a.eng} --deps "..."`,
      cibles: [a.eng, ...a.abandonnes]
    });
  }
  for (const r of remplacesSansPorteur(engs)) {
    sortie.push({
      gravite: "bloquant",
      constat: `${r.eng} is replaced by ${r.porteur}, which is ${r.statut}: nothing carries its work`,
      pourquoi: "a replaced record keeps its promise through its replacement; when the replacement is broken, withdrawn or missing, the work of the record is carried by nobody and its dependants read it wrongly",
      geste: `lean remplacer ${r.eng} --par ENG-XXXX --motif "...", or open the commitment that carries it`,
      cibles: [r.eng, r.porteur]
    });
  }
  if (!prets.length && enAttente.length) {
    const bloquants = goulots(engs).slice(0, 3);
    sortie.push({
      gravite: "bloquant",
      constat: `la fronti\xE8re est vide alors que ${enAttente.length} engagement(s) attendent`,
      pourquoi: `rien n'est tirable : la flotte est \xE0 l'arr\xEAt. Les pr\xE9c\xE9dences sont soit trop strictes, soit en attente d'un goulot${bloquants.length ? ` (${bloquants.map((b) => `${b.eng} d\xE9bloque ${b.debloque}`).join(", ")})` : ""}`,
      geste: bloquants.length ? `lean impact ${bloquants[0].eng}` : "lean frontiere",
      cibles: bloquants.map((b) => b.eng)
    });
  }
  const collisions = collisionsTirables(ctx, engs);
  if (collisions.length) {
    const parEngagement = /* @__PURE__ */ new Map();
    for (const [a2, b2] of collisions) {
      parEngagement.set(a2, (parEngagement.get(a2) ?? 0) + 1);
      parEngagement.set(b2, (parEngagement.get(b2) ?? 0) + 1);
    }
    const pires = [...parEngagement.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3);
    const [a, b, motif] = collisions[0];
    sortie.push({
      gravite: "attente",
      constat: `${collisions.length} paire(s) d'engagements tirables partagent des chemins${pires.length ? `, ${pires[0][0]} \xE9tant en cause dans ${pires[0][1]}` : ""} (par exemple ${a} et ${b} sur ${motif})`,
      pourquoi: "deux sessions sur les m\xEAmes fichiers se disputeront les rebases. Soit on les s\xE9rialise par une pr\xE9c\xE9dence, soit on tire un engagement par lot, soit on accepte le chevauchement en connaissance de cause",
      geste: "lean lots",
      cibles: pires.map(([eid]) => eid)
    });
  }
  tic("resequencement");
  try {
    for (const f of entonnoirs(engs)) {
      sortie.push({
        gravite: "attente",
        constat: `${f.eng} waits on ${f.predecesseurs.length} finish-start predecessors (${f.en_attente.length} not held): a funnel`,
        pourquoi: `a commitment with more than ${SEUIL_ENTONNOIR} predecessors starts when the last of them is held, whatever the others did: on the mesh milestone the final scenario waited on ten. Cut it by what each predecessor brings`,
        geste: `lean show ${f.eng}, then one commitment per predecessor group, and this one kept for the final soak`,
        cibles: [f.eng, ...f.en_attente.slice(0, 6)]
      });
    }
    for (const s of suitesDansLeScope(engs)) {
      sortie.push({
        gravite: "hygiene",
        constat: `${s.eng} follows ${s.parent}, and its scope lies inside the scope ${s.parent} delivered`,
        pourquoi: "a point found by a verdict inside the scope it verified is a rework: the same worktree, a warm build and no new cycle. A commitment opened for it pays a pull, two cold builds, a mandate and a decision for minutes of work",
        geste: `next time: lean verdict --sens reject --mineur --constats, which asks for the rework; this one: lean show ${s.eng}`,
        cibles: [s.eng, s.parent]
      });
    }
    for (const c of concentrationChemins(engs, occupes)) {
      sortie.push({
        gravite: "attente",
        constat: `${c.engagements.length} ready commitments reserve ${c.prefixe}: ${c.engagements.join(", ")}`,
        pourquoi: "they cannot run beside one another, by domain or by paths alike: the frontier is wide and one session at a time works it. A scope that names a whole crate every other scope names too serialises the milestone",
        geste: `narrow the scopes to the files each one changes, or merge those that change the same crate (lean show ${c.engagements[0]})`,
        cibles: c.engagements.slice(0, 8)
      });
    }
    for (const ch of chainesSansContrat(ctx, engs)) {
      sortie.push({
        gravite: "attente",
        constat: `${ch.jalon}: a chain of ${ch.chaine.length} finish-start commitments (${ch.chaine.join(" -> ")}) and no interface precedence`,
        pourquoi: "a finish-start chain runs one commitment at a time; an `interface` precedence lets a successor start once the contract of its predecessor is frozen (depends_on.type: interface, field contrat), which no commitment of this milestone uses",
        geste: `freeze the contract first (a proto file, a trait), then lean resequencer ${ch.chaine[1] ?? ch.chaine[0]} --deps "${ch.chaine[0]}:interface"`,
        cibles: ch.chaine.slice(0, 6)
      });
    }
  } catch {
  }
  tic("structure");
  const claims = chargerClaims(ctx);
  const orphelines = claims.filter((c) => !detenue(ctx, c));
  if (orphelines.length) {
    sortie.push({
      gravite: "hygiene",
      constat: `${orphelines.length} r\xE9servation(s) ne sont plus d\xE9tenues par un lease vivant`,
      pourquoi: "elles bloquent leur domaine pour rien : un tirage sur ce domaine sera refus\xE9 sans raison",
      geste: "lean menage",
      cibles: orphelines.map((c) => String(c.eng ?? "")).filter(Boolean)
    });
  }
  const actifs = nombreActifs(ctx);
  const cap = plafond(ctx);
  if (actifs >= cap && prets.length) {
    sortie.push({
      gravite: "attente",
      constat: `le plafond est atteint (${actifs}/${cap}) alors que ${prets.length} engagement(s) sont pr\xEAts`,
      pourquoi: "aucun tirage ne passera tant qu'une session n'est pas sold\xE9e, ou le plafond relev\xE9",
      geste: `lean plafond ${cap + 1}`,
      cibles: []
    });
  }
  try {
    const coherence = etatCoherence(ctx, engs);
    const dette = Array.isArray(coherence?.dette_doc) ? coherence.dette_doc : [];
    if (dette.length) {
      sortie.push({
        gravite: "hygiene",
        constat: `${dette.length} exigence(s) livr\xE9e(s) sans impact documentaire d\xE9clar\xE9`,
        pourquoi: "la documentation d\xE9rive de la spec en silence, et le retard se paie au moment de livrer au client",
        geste: "lean etat",
        cibles: []
      });
    }
  } catch {
  }
  try {
    const lots = lotsParallelisables(engs, occupes);
    if (lots.length > 1 && prets.length > 1) {
      sortie.push({
        gravite: "hygiene",
        constat: `les ${prets.length} engagements pr\xEAts se r\xE9partissent en ${lots.length} lot(s) non parall\xE9lisables`,
        pourquoi: "tirer deux engagements d'un m\xEAme lot les met en concurrence ; tirer un engagement par lot maximise le travail simultan\xE9 sans conflit",
        geste: "lean lots",
        cibles: lots.flatMap((l) => l.engagements).slice(0, 8)
      });
    }
  } catch {
  }
  const cleTravail = cleArbre(ctx);
  const backlog = memoriser(ctx, "backlog", cleTravail, () => {
    const b = resteAFaire(ctx);
    return { total: b.total, dejaCouvertes: b.dejaCouvertes };
  });
  const nonCouvertes = backlog.total - backlog.dejaCouvertes;
  if (!prets.length && nonCouvertes > 0) {
    sortie.push({
      gravite: "attente",
      constat: `${nonCouvertes} exigence(s) du reste \xE0 faire ne sont couvertes par aucun engagement`,
      pourquoi: "la fronti\xE8re est vide parce que rien n'a \xE9t\xE9 formalis\xE9 : le travail d\xFB existe, la promesse manque",
      geste: "lean backlog",
      cibles: []
    });
  }
  try {
    const refuses = memoriser(
      ctx,
      "style",
      cleTravail,
      () => auditStyle(ctx.racine, { langueBloquante: false }).fautes.filter((f) => f.gravite === "refus").map((f) => ({ fichier: f.fichier }))
    );
    if (refuses.length) {
      const fichiers = [...new Set(refuses.map((f) => f.fichier))];
      sortie.push({
        gravite: "hygiene",
        constat: `${refuses.length} infraction(s) \xE0 la charte de r\xE9daction dans ${fichiers.length} fichier(s)`,
        pourquoi: "le tiret cadratin et le lexique d'outil sont refus\xE9s \xE0 l'\xE9criture ; ceux qui restent sont entr\xE9s avant la garde, et un texte non conforme se recopie plus vite qu'il ne se corrige",
        geste: "lean style",
        cibles: fichiers.slice(0, 5)
      });
    }
  } catch {
  }
  tic("hygiene, coherence, lots, backlog, style");
  sortie.sort((a, b) => ORDRE[a.gravite] - ORDRE[b.gravite]);
  return typeof options.limite === "number" ? sortie.slice(0, options.limite) : sortie;
}
function conseilsDeSession(ctx, eng) {
  try {
    refreshRemoteRefs(ctx);
  } catch {
  }
  const tous = conseils(ctx);
  const siens = tous.filter((c) => c.cibles.includes(eng));
  const leases = listerLeases(ctx);
  const l = leases.find((x) => x.eng === eng);
  if (!l) return siens;
  const rework = l.worktree && ["active", "stale", "livre"].includes(l.state) ? reworkDe(String(l.worktree)) : null;
  if (rework && rework.violations.length) {
    siens.push({
      gravite: "attente",
      constat: `${eng} was rejected (${rework.mandat ?? "last verdict"}): ${rework.violations.length} violation(s) wait in .eng/REWORK.md`,
      pourquoi: "the verifier named what to correct; a delivery that answers none of them is checked red (`reprise`)",
      geste: "read .eng/REWORK.md, correct each mark, answer each one in REPORT.md under `## Rework`, commit, then eng push --livraison",
      cibles: [eng]
    });
  }
  const fiche = chargerRegistre(ctx, []).get(eng);
  if (fiche && fiche.statut === "pris" && ["active", "stale", "bloque"].includes(l.state)) {
    const engs = chargerRegistre(ctx, []);
    const wt = String(l.worktree ?? "");
    const bloque = wt && fs22.existsSync(path19.join(wt, "BLOCKED.md")) ? fs22.readFileSync(path19.join(wt, "BLOCKED.md"), "utf-8") : "";
    for (const dep of Array.isArray(fiche.depends_on) ? fiche.depends_on : []) {
      if (dep.type !== "finish-start" || !engs.has(String(dep.eng))) continue;
      const pred = String(dep.eng);
      const st = statutEffectif(engs, pred);
      if (st !== "tenu" && st !== "abandonne") {
        siens.push({
          gravite: "attente",
          constat: `${eng} waits on ${pred} (finish-start), which is ${st}`,
          pourquoi: "the change it needs is filed as a commitment of its own, in the stream that owns the files; it is not made here",
          geste: `run \`eng attendre ${pred}\` in the background: it ends once ${pred} is held. The work inside the scope can go on meanwhile`,
          cibles: [eng, pred]
        });
      } else if (bloque.includes(pred)) {
        siens.push({
          gravite: "attente",
          constat: `${pred}, which ${eng} waits on, is ${st}`,
          pourquoi: "the precedence that blocked the commitment is satisfied",
          geste: "git merge master in the worktree, remove BLOCKED.md, finish the work and deliver REPORT.md",
          cibles: [eng, pred]
        });
      }
    }
  }
  if (l.state === "active") {
    const wt = String(l.worktree ?? "");
    const rapport = wt && fs22.existsSync(path19.join(wt, "REPORT.md"));
    if (!rapport) {
      siens.push({
        gravite: "attente",
        constat: `${eng} est en cours, sans rapport d\xE9pos\xE9`,
        pourquoi: "une session ne se termine pas sans REPORT.md ou BLOCKED.md : le hook Stop le refusera",
        geste: "\xE9cris REPORT.md \xE0 la racine du worktree, puis `eng push --livraison`. " + REPORT_RULES,
        cibles: [eng]
      });
    }
  }
  if (l.state === "revoked") {
    siens.push({
      gravite: "bloquant",
      constat: `le lease de ${eng} a \xE9t\xE9 r\xE9voqu\xE9`,
      pourquoi: `motif : ${String(l.revoke_motif ?? "non pr\xE9cis\xE9")}. Toute \xE9criture est refus\xE9e au prochain outil`,
      geste: "cesse tout travail et termine la session",
      cibles: [eng]
    });
  }
  return siens;
}

// hooks/session_context.ts
function trouverLease(depart) {
  let p = path20.resolve(depart);
  for (; ; ) {
    const f = path20.join(p, ".eng", "LEASE.json");
    if (fs23.existsSync(f)) {
      try {
        return { racine: p, lease: JSON.parse(fs23.readFileSync(f, "utf-8")) };
      } catch {
        return null;
      }
    }
    const parent = path20.dirname(p);
    if (parent === p) return null;
    p = parent;
  }
}
function orienterProjetNeuf(cwd) {
  try {
    const racine = trouverRacine(cwd);
    if (!racine) return;
    const ctx = resoudreContexte(racine);
    const c = amorcage(ctx, chargerRegistre(ctx, []));
    if (!c) return;
    process.stdout.write(`[lean-engine] ${c.constat}.
Why: ${c.pourquoi}.
Next step: ${c.geste}.
`);
  } catch {
  }
}
function principal() {
  let charge = {};
  try {
    charge = JSON.parse(fs23.readFileSync(0, "utf-8"));
  } catch {
  }
  const trouve = trouverLease(String(charge.cwd ?? process.cwd()));
  if (!trouve) {
    orienterProjetNeuf(String(charge.cwd ?? process.cwd()));
    process.exit(0);
  }
  const { racine, lease } = trouve;
  const eng = String(lease.eng ?? "?");
  let etat = null;
  if (lease.runs_record) {
    try {
      const rec = JSON.parse(fs23.readFileSync(lease.runs_record, "utf-8"));
      etat = String(rec.state);
      if (rec.token !== lease.token) etat = "perime";
    } catch {
      etat = "introuvable";
    }
  }
  if (etat && ["revoked", "released", "perime", "introuvable"].includes(etat)) {
    process.stdout.write(
      `[lean-eng] STOP : le lease de ${eng} dans ce worktree est ${etat}. N'\xE9cris rien ici ; si le travail reste d\xFB, re-tire l'engagement (eng pull ${eng}).
`
    );
    process.exit(0);
  }
  let titre = "";
  let dod = "";
  const fiches = [lease.repo ? fichierEngagementDepot(lease.repo, eng) : null, fichierEngagementDepot(racine, eng)];
  for (const f of fiches) {
    if (!f) continue;
    try {
      const data = (0, import_yaml2.parse)(fs23.readFileSync(f, "utf-8")) ?? {};
      titre = String(data.titre ?? "");
      dod = String(data.definition_of_done ?? "");
    } catch {
    }
    break;
  }
  process.stdout.write(`[lean-eng] Tu es l'implementor de ${eng}${titre ? ` : ${titre}` : ""}.
`);
  process.stdout.write(`Contexte complet : ${path20.join(racine, ".eng", "CONTEXT.md")} (lis-le en premier).
`);
  if (dod) process.stdout.write(`Definition of done : ${dod}
`);
  process.stdout.write(
    'Pousse ta progression aux jalons (eng push --progress "...") ; termine par REPORT.md ou BLOCKED.md \xE0 la racine du worktree puis eng push --livraison.\nREPORT.md opens with `## Result`, whose first line is PASS or FAIL against the definition of done. An open point you can close alone inside your scope is closed, not reported; the others are drafted in full under `## Open points that need someone else` (a DA with its options and your recommendation, an ENG, or an SCP); what is only for information goes under `## For information, no action required`.\n'
  );
  try {
    const liste = conseilsDeSession(resoudreContexte(String(lease.repo ?? racine)), eng);
    if (liste.length) {
      process.stdout.write("\nCe qui appelle un geste de ta part :\n");
      for (const c of liste) {
        process.stdout.write(`  [${c.gravite.toUpperCase()}] ${c.constat}
`);
        process.stdout.write(`      pourquoi : ${c.pourquoi}
`);
        process.stdout.write(`      geste    : ${c.geste}
`);
      }
    }
    process.stdout.write(
      "\nPour interroger l'\xE9tat \xE0 tout moment : `eng contexte` (ce qui te concerne), `lean conseils` (ce qui appelle un geste, et pourquoi).\n"
    );
  } catch {
  }
}
principal();
