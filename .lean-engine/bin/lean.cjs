#!/usr/bin/env node
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
    function visit_(key, node, visitor, path40) {
      const ctrl = callVisitor(key, node, visitor, path40);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path40, ctrl);
        return visit_(key, ctrl, visitor, path40);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path40 = Object.freeze(path40.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path40);
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
          path40 = Object.freeze(path40.concat(node));
          const ck = visit_("key", node.key, visitor, path40);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path40);
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
    async function visitAsync_(key, node, visitor, path40) {
      const ctrl = await callVisitor(key, node, visitor, path40);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path40, ctrl);
        return visitAsync_(key, ctrl, visitor, path40);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path40 = Object.freeze(path40.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path40);
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
          path40 = Object.freeze(path40.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path40);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path40);
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
    function callVisitor(key, node, visitor, path40) {
      if (typeof visitor === "function")
        return visitor(key, node, path40);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path40);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path40);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path40);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path40);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path40);
      return void 0;
    }
    function replaceNode(key, path40, node) {
      const parent = path40[path40.length - 1];
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
    function collectionFromPath(schema, path40, value) {
      let v = value;
      for (let i = path40.length - 1; i >= 0; --i) {
        const k = path40[i];
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
    var isEmptyPath = (path40) => path40 == null || typeof path40 === "object" && !!path40[Symbol.iterator]().next().done;
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
      addIn(path40, value) {
        if (isEmptyPath(path40))
          this.add(value);
        else {
          const [key, ...rest] = path40;
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
      deleteIn(path40) {
        const [key, ...rest] = path40;
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
      getIn(path40, keepScalar) {
        const [key, ...rest] = path40;
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
      hasIn(path40) {
        const [key, ...rest] = path40;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path40, value) {
        const [key, ...rest] = path40;
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
      let header2 = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header2 += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
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
          return `>${header2}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header2}
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
      addIn(path40, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path40, value);
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
      deleteIn(path40) {
        if (Collection.isEmptyPath(path40)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path40) : false;
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
      getIn(path40, keepScalar) {
        if (Collection.isEmptyPath(path40))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path40, keepScalar) : void 0;
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
      hasIn(path40) {
        if (Collection.isEmptyPath(path40))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path40) : false;
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
      setIn(path40, value) {
        if (Collection.isEmptyPath(path40)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path40), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path40, value);
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
        const { start, key, sep: sep10, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep10?.[0],
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
          if (!keyProps.anchor && !keyProps.tag && !sep10) {
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
        const valueProps = resolveProps.resolveProps(sep10 ?? [], {
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
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep10, null, valueProps, onError);
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
        let sep10 = "";
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
                comment += sep10 + cb;
              sep10 = "";
              break;
            }
            case "newline":
              if (comment)
                sep10 += source;
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
        const { start, key, sep: sep10, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep10?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep10 && !value) {
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
        if (!isMap && !sep10 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep10, null, props, onError);
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
          const valueProps = resolveProps.resolveProps(sep10 ?? [], {
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
              if (sep10)
                for (const st of sep10) {
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
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep10, null, valueProps, onError) : null;
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
      const header2 = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header2)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header2.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
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
        const value2 = header2.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header2.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header2.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header2.indent;
      let offset = scalar.offset + header2.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header2.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header2.indent === 0)
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
      let sep10 = "";
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
          const src = header2.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep10 + indent.slice(trimIndent) + content;
          sep10 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep10 === " ")
            sep10 = "\n";
          else if (!prevMoreIndented && sep10 === "\n")
            sep10 = "\n\n";
          value += sep10 + indent.slice(trimIndent) + content;
          sep10 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep10 === "\n")
            value += "\n";
          else
            sep10 = "\n";
        } else {
          value += sep10 + content;
          sep10 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header2.chomp) {
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
      const end = start + header2.length + scalar.source.length;
      return { value, type, comment: header2.comment, range: [start, end, end] };
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
      const _onError = (rel3, code, msg) => onError(offset + rel3, code, msg);
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
      let sep10 = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep10 === "\n")
            res += sep10;
          else
            sep10 = "\n";
        } else {
          res += sep10 + match[1];
          sep10 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep10 + (match?.[1] ?? "");
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
            const header2 = token.props[0];
            if (header2.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header2.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
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
        const header2 = token.props[0];
        if (header2.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header2.source = head;
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
    function stringifyItem({ start, key, sep: sep10, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep10)
        for (const st of sep10)
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
    visit.itemAtPath = (cst, path40) => {
      let item = cst;
      for (const [field, index] of path40) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path40) => {
      const parent = visit.itemAtPath(cst, path40.slice(0, -1));
      const field = path40[path40.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path40, item, visitor) {
      let ctrl = visitor(item, path40);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path40.concat([[field, i]])), token.items[i], visitor);
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
            ctrl = ctrl(item, path40);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path40) : ctrl;
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
          let sep10;
          if (scalar.end) {
            sep10 = scalar.end;
            sep10.push(this.sourceToken);
            delete scalar.end;
          } else
            sep10 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep10 }]
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
                  const sep10 = it.sep;
                  sep10.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep10 }]
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
              const fs43 = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs43, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs43);
              } else {
                Object.assign(it, { key: fs43, sep: [] });
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
              const fs43 = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs43, sep: [] });
              else if (it.sep)
                this.stack.push(fs43);
              else
                Object.assign(it, { key: fs43, sep: [] });
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
            const sep10 = fc.end.splice(1, fc.end.length);
            sep10.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep10 }]
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

// cli/lean.ts
var fs42 = __toESM(require("node:fs"), 1);
var path39 = __toESM(require("node:path"), 1);

// cli/commun.ts
var fs24 = __toESM(require("node:fs"), 1);
var path21 = __toESM(require("node:path"), 1);

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
var HORS_ETAT = ["bin", "githooks", "installation.json"];
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
  const gouvernance2 = path.join(abs, "agentic_orchestrator");
  const constitution = [path.join(abs, "CONSTITUTION.md"), path.join(gouvernance2, "CONSTITUTION.md")].find((p) => fs.existsSync(p)) ?? path.join(abs, "CONSTITUTION.md");
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
    gouvernance: gouvernance2,
    constitution,
    ihm: path.join(gouvernance2, "ihm", "index.html"),
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

// noyau/src/verrou.ts
var fs2 = __toESM(require("node:fs"), 1);
var path2 = __toESM(require("node:path"), 1);
var nombreEnv = (nom, defaut) => {
  const v = Number(process.env[nom]);
  return Number.isFinite(v) && v > 0 ? v : defaut;
};
var perimeMs = () => nombreEnv("LEAN_ENGINE_VERROU_PERIME_MS", 3e4);
var abandonMs = () => nombreEnv("LEAN_ENGINE_VERROU_ABANDON_MS", 6e5);
function pidVivant(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === "EPERM";
  }
}
async function sousVerrou(chemin, fn) {
  await acquerir(chemin);
  try {
    return await fn();
  } finally {
    liberer(chemin);
  }
}
var TRANSITOIRES = /* @__PURE__ */ new Set(["EEXIST", "EPERM", "EACCES", "EBUSY"]);
async function acquerir(chemin, timeoutMs = 12e4) {
  fs2.mkdirSync(path2.dirname(chemin), { recursive: true });
  const debut = Date.now();
  for (; ; ) {
    try {
      const fd = fs2.openSync(chemin, "wx");
      fs2.writeSync(fd, JSON.stringify({ pid: process.pid, at: (/* @__PURE__ */ new Date()).toISOString() }));
      fs2.closeSync(fd);
      return;
    } catch (e) {
      if (!TRANSITOIRES.has(String(e.code))) throw e;
      try {
        let detenteur = null;
        try {
          const contenu = JSON.parse(fs2.readFileSync(chemin, "utf-8"));
          if (typeof contenu.pid === "number") detenteur = contenu.pid;
        } catch {
        }
        const age = Date.now() - fs2.statSync(chemin).mtimeMs;
        const rompre = detenteur === null ? age > perimeMs() : !pidVivant(detenteur) || age > abandonMs();
        if (rompre) {
          fs2.unlinkSync(chemin);
          continue;
        }
      } catch {
        if (!fs2.existsSync(chemin)) continue;
      }
      if (Date.now() - debut > timeoutMs) {
        throw new Error(`verrou de mutation occupe depuis plus de ${timeoutMs} ms : ${chemin}`);
      }
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}
function liberer(chemin) {
  try {
    fs2.unlinkSync(chemin);
  } catch {
  }
}

// noyau/src/sync.ts
var fs22 = __toESM(require("node:fs"), 1);
var path19 = __toESM(require("node:path"), 1);
var import_node_child_process6 = require("node:child_process");

// noyau/src/git.ts
var import_node_child_process = require("node:child_process");
var crypto = __toESM(require("node:crypto"), 1);
function git(args, cwd) {
  const r = (0, import_node_child_process.spawnSync)("git", args, {
    cwd,
    encoding: "utf-8",
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024
  });
  return { code: r.status ?? -1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}
function estAncetreDeMaster(racine, sha) {
  const r = git(["merge-base", "--is-ancestor", sha, "master"], racine);
  if (r.code === 0) return true;
  if (r.code === 1) return false;
  return null;
}
function empreinteDiff(worktree) {
  const base = git(["merge-base", "master", "HEAD"], worktree);
  if (base.code !== 0) return null;
  const diff = git(["diff", base.stdout.trim()], worktree);
  if (diff.code !== 0) return null;
  return {
    empreinte: "sha256:" + crypto.createHash("sha256").update(diff.stdout, "utf-8").digest("hex"),
    octets: Buffer.byteLength(diff.stdout, "utf-8")
  };
}

// noyau/src/config.ts
var fs4 = __toESM(require("node:fs"), 1);

// noyau/src/yamlutil.ts
var import_yaml = __toESM(require_dist(), 1);

// noyau/src/fichiers.ts
var fs3 = __toESM(require("node:fs"), 1);
var path3 = __toESM(require("node:path"), 1);
var FIN_LIGNE = process.platform === "win32" ? "\r\n" : "\n";
function lireTexte(chemin) {
  return fs3.readFileSync(chemin, "utf-8").replace(/\r\n/g, "\n");
}
function versOs(contenu) {
  return FIN_LIGNE === "\n" ? contenu : contenu.replace(/\r?\n/g, FIN_LIGNE);
}
function ecrireTexte(chemin, contenu) {
  const tmp = chemin + ".tmp";
  fs3.mkdirSync(path3.dirname(chemin), { recursive: true });
  fs3.writeFileSync(tmp, versOs(contenu), "utf-8");
  try {
    fs3.renameSync(tmp, chemin);
  } catch (e) {
    const code = e.code;
    if (code === "EPERM" || code === "EACCES" || code === "EEXIST") {
      try {
        fs3.unlinkSync(chemin);
      } catch {
      }
      fs3.renameSync(tmp, chemin);
    } else {
      throw e;
    }
  }
}

// noyau/src/yamlutil.ts
function lireYaml(chemin) {
  return (0, import_yaml.parse)(lireTexte(chemin));
}
function lireYamlSur(texte) {
  return (0, import_yaml.parse)(texte);
}
function scalairePy(v) {
  if (v === null || v === void 0) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  const s = String(v);
  if (s === "") return "''";
  const ressembleAutre = /^(true|false|null|yes|no|on|off|~)$/i.test(s) || /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s) || /^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{4}-\d{1,2}-\d{1,2}([Tt]|[ \t]+)\d{1,2}:\d{2}:\d{2}/.test(s);
  const aBesoin = ressembleAutre || s.includes(": ") || s.endsWith(":") || / #/.test(s) || /^[\s!&*?|>%@`"'{}[\],#-]/.test(s) || /[\n\t]/.test(s) || /\s$/.test(s);
  return aBesoin ? "'" + s.replace(/'/g, "''") + "'" : s;
}
function corpsClaims(claims) {
  if (!claims.length) return "claims: []\n";
  const lignes = ["claims:"];
  for (const c of claims) {
    Object.keys(c).forEach((k, i) => {
      const v = c[k];
      if (Array.isArray(v)) {
        if (!v.length) {
          lignes.push(`${i === 0 ? "- " : "  "}${k}: []`);
          return;
        }
        lignes.push(`${i === 0 ? "- " : "  "}${k}:`);
        for (const x of v) lignes.push(`  - ${scalairePy(x)}`);
        return;
      }
      lignes.push(`${i === 0 ? "- " : "  "}${k}: ${scalairePy(v)}`);
    });
  }
  return lignes.join("\n") + "\n";
}
function corpsAgents(maxLive, paused) {
  return `# Pilotage de la flotte de sessions implementors (obeya). Fichier versionn\xE9.
max_live: ${Math.max(0, Math.trunc(maxLive))}
paused: ${paused ? "true" : "false"}
`;
}
function ecrireAtomique(chemin, contenu) {
  ecrireTexte(chemin, contenu);
}

// noyau/src/config.ts
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
  if (!fs4.existsSync(ctx.config)) return out;
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

// noyau/src/dashboard.ts
var fs21 = __toESM(require("node:fs"), 1);

// noyau/src/horloge.ts
function isoSecondes(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}
function isoMinutes(d = /* @__PURE__ */ new Date()) {
  return d.toISOString().replace(/:\d{2}\.\d{3}Z$/, "+00:00");
}
function dateLocale(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const j = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${j}`;
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
function ajouterJours(d, jours) {
  return new Date(d.getTime() + jours * 864e5);
}

// noyau/src/dag.ts
var fs10 = __toESM(require("node:fs"), 1);
var path8 = __toESM(require("node:path"), 1);

// noyau/src/claims.ts
var fs7 = __toESM(require("node:fs"), 1);

// noyau/src/remote.ts
var fs5 = __toESM(require("node:fs"), 1);
var path4 = __toESM(require("node:path"), 1);
var import_node_child_process2 = require("node:child_process");
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
    const abs = path4.resolve(p);
    return process.platform === "win32" ? abs.toLowerCase() : abs;
  };
  let reel = ctx.racine;
  try {
    reel = fs5.realpathSync.native(ctx.racine);
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
  return path4.join(ctx.runs, "remote-fetch.json");
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
    fs5.mkdirSync(ctx.runs, { recursive: true });
    ecrireAtomique(stampPath(ctx), JSON.stringify({ a: now.at, ok: now.ok }) + "\n");
  } catch {
  }
  return now;
}
function fileAtRef(ctx, ref, rel3) {
  const r = git(["show", `${ref}:${rel3}`], ctx.racine);
  return r.code === 0 ? r.stdout : null;
}
var RESERVATION_REFS = "refs/lean-engine";
var RESERVATION_REFS_ANCIEN = "refs/agelaios";
function fusionnerReservations(courantes, anciennes) {
  const vues = new Set(courantes);
  const prefixe = `${RESERVATION_REFS_ANCIEN}/`;
  for (const ref of anciennes) vues.add(ref.startsWith(prefixe) ? `${RESERVATION_REFS}/${ref.slice(prefixe.length)}` : ref);
  return [...vues];
}
var NET_TIMEOUT_MS = 8e3;
var SANS_INVITE = { GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_ASKPASS: "" };
function reservationRemote(ctx) {
  if (!estRacineGit(ctx)) return null;
  const noms = git(["remote"], ctx.racine).stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!noms.length) return null;
  return noms.includes("origin") ? "origin" : noms[0];
}
function listRemoteReservations(ctx, remote, pattern) {
  const r = (0, import_node_child_process2.spawnSync)("git", ["ls-remote", "--refs", remote, `${RESERVATION_REFS}/${pattern}`, `${RESERVATION_REFS_ANCIEN}/${pattern}`], {
    cwd: ctx.racine,
    encoding: "utf-8",
    windowsHide: true,
    timeout: NET_TIMEOUT_MS,
    env: { ...process.env, ...SANS_INVITE }
  });
  if (r.status !== 0) return null;
  const refs = String(r.stdout).split("\n").map((l) => l.split("	")[1]?.trim() ?? "").filter(Boolean);
  return fusionnerReservations(
    refs.filter((ref) => ref.startsWith(`${RESERVATION_REFS}/`)),
    refs.filter((ref) => ref.startsWith(`${RESERVATION_REFS_ANCIEN}/`))
  );
}
var differe = false;
var enAttente = [];
function differerReservations(actif) {
  differe = actif;
  if (!actif) enAttente.length = 0;
}
function reservationsDifferees() {
  return enAttente.splice(0, enAttente.length);
}
function reservationsEnAttente() {
  return enAttente.length > 0;
}
function reserveRemoteRef(ctx, remote, ref, message) {
  const opts = { cwd: ctx.racine, encoding: "utf-8", windowsHide: true };
  const arbre = (0, import_node_child_process2.spawnSync)("git", ["mktree"], { ...opts, input: "" });
  const tree = String(arbre.stdout ?? "").trim();
  if (arbre.status !== 0 || !tree) return { created: false, reachable: false, detail: `git mktree: ${String(arbre.stderr).trim()}` };
  const commit = (0, import_node_child_process2.spawnSync)("git", ["commit-tree", tree, "-m", message], opts);
  const sha = String(commit.stdout ?? "").trim();
  if (commit.status !== 0 || !sha) {
    return { created: false, reachable: false, detail: `git commit-tree: ${String(commit.stderr).trim()}` };
  }
  if (differe) {
    (0, import_node_child_process2.spawnSync)("git", ["update-ref", ref, sha], opts);
    enAttente.push({ ref, sha });
    return { created: true, reachable: true, detail: "reserved locally, pushed with the trunk by the publication of the transaction" };
  }
  const push = (0, import_node_child_process2.spawnSync)(
    "git",
    ["push", "--porcelain", `--force-with-lease=${ref}:`, remote, `${sha}:${ref}`],
    { ...opts, timeout: NET_TIMEOUT_MS, env: { ...process.env, ...SANS_INVITE } }
  );
  const sortie = `${String(push.stdout ?? "")}
${String(push.stderr ?? "")}`.trim();
  if (push.status === 0) return { created: true, reachable: true, detail: sortie };
  const prise = /stale info|already exists|fetch first/i.test(sortie);
  return { created: false, reachable: prise, detail: sortie };
}

// noyau/src/leases.ts
var fs6 = __toESM(require("node:fs"), 1);
var path5 = __toESM(require("node:path"), 1);
var import_node_child_process3 = require("node:child_process");
var CAP_DEFAUT = 3;
var STALE_MIN = 30;
var MAX_EVENEMENTS = 50;
var NOMS_RAPPORT = ["REPORT.md", "BLOCKED.md"];
function cfg(ctx) {
  try {
    if (fs6.existsSync(ctx.agents)) return lireYaml(ctx.agents) ?? {};
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
  return path5.join(ctx.runs, `${eng}.json`);
}
function chargerRecord(ctx, eng) {
  const p = cheminRecord(ctx, eng);
  if (!fs6.existsSync(p)) return null;
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return null;
  }
}
function worktreeDe(ctx, rec) {
  return String(rec.worktree ?? path5.join(ctx.wt, rec.eng.toLowerCase()));
}
function derniereActivite(ctx, rec) {
  const marques = [];
  for (const s of [rec.last_seen, rec.issued_at]) {
    const d = parseIso(s);
    if (d) marques.push(d);
  }
  const wt = worktreeDe(ctx, rec);
  for (const f of [path5.join(wt, ".eng", "heartbeat"), path5.join(wt, "REPORT.md"), path5.join(wt, "BLOCKED.md")]) {
    try {
      if (fs6.existsSync(f)) marques.push(fs6.statSync(f).mtime);
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
  if (fs6.existsSync(path5.join(wt, "BLOCKED.md"))) return "bloque";
  if (fs6.existsSync(path5.join(wt, "REPORT.md"))) return "livre";
  const exp = parseIso(rec.expires_at);
  if (exp && exp.getTime() < Date.now()) return "expire";
  const vu = derniereActivite(ctx, rec);
  if (vu && Date.now() - vu.getTime() > STALE_MIN * 6e4) return "stale";
  return "active";
}
function listerLeases(ctx) {
  const sortie = [];
  if (!fs6.existsSync(ctx.runs)) return sortie;
  const fichiers = fs6.readdirSync(ctx.runs).filter((f) => /^ENG-.*\.json$/.test(f)).sort();
  for (const f of fichiers) {
    const rec = chargerRecord(ctx, f.replace(/\.json$/, ""));
    if (!rec) continue;
    const etat = deriverEtat(ctx, rec);
    const dossierLivraison = path5.join(ctx.livraisons, rec.eng);
    const aRapport = fs6.existsSync(path5.join(dossierLivraison, "REPORT.md")) || fs6.existsSync(path5.join(dossierLivraison, "BLOCKED.md")) || rapportWorktree(ctx, rec)[1] !== null;
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
    const p = path5.join(wt, nom);
    if (fs6.existsSync(p)) return [nom, p];
  }
  return [null, null];
}
function lireRapport(ctx, eng) {
  const rec = chargerRecord(ctx, eng);
  const [nomWt, srcWt] = rec ? rapportWorktree(ctx, rec) : [null, null];
  for (const nom of NOMS_RAPPORT) {
    const p = path5.join(ctx.livraisons, eng, nom);
    if (!fs6.existsSync(p)) continue;
    if (srcWt && nomWt === nom) {
      try {
        if (fs6.statSync(srcWt).mtimeMs > fs6.statSync(p).mtimeMs) {
          return { ok: true, eng, name: nom, archived: false, content: lireTexte(srcWt) };
        }
      } catch {
      }
    }
    return { ok: true, eng, name: nom, archived: true, content: lireTexte(p) };
  }
  if (nomWt && srcWt) {
    return { ok: true, eng, name: nomWt, archived: false, content: lireTexte(srcWt) };
  }
  return { ok: false, erreur: `aucun rapport pour ${eng}` };
}
function rapportDeBranche(ctx, rec, nom) {
  const branche = String(rec.branch ?? "");
  if (!branche) return null;
  const r = (0, import_node_child_process3.spawnSync)("git", ["show", `${branche}:${nom}`], {
    cwd: ctx.racine,
    encoding: "utf-8",
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024
  });
  return r.status === 0 && r.stdout ? r.stdout : null;
}
function archiverRapport(ctx, eng) {
  const rec = chargerRecord(ctx, eng);
  if (!rec) return null;
  const wt = String(rec.worktree ?? path5.join(ctx.wt, eng.toLowerCase()));
  for (const nom of NOMS_RAPPORT) {
    const src = path5.join(wt, nom);
    const dossier = path5.join(ctx.livraisons, eng);
    const dst = path5.join(dossier, nom);
    if (fs6.existsSync(src)) {
      fs6.mkdirSync(dossier, { recursive: true });
      try {
        if (!fs6.existsSync(dst) || fs6.statSync(src).mtimeMs > fs6.statSync(dst).mtimeMs) {
          fs6.copyFileSync(src, dst);
        }
      } catch {
        return fs6.existsSync(dst) ? dst : null;
      }
      return dst;
    }
    if (fs6.existsSync(dst)) return dst;
    const depuisBranche = rapportDeBranche(ctx, rec, nom);
    if (depuisBranche !== null) {
      fs6.mkdirSync(dossier, { recursive: true });
      ecrireTexte(dst, depuisBranche);
      return dst;
    }
  }
  return null;
}
function rapportsARamasser(ctx) {
  if (!fs6.existsSync(ctx.runs)) return [];
  const dus = [];
  for (const f of fs6.readdirSync(ctx.runs).filter((x) => /^ENG-.*\.json$/.test(x)).sort()) {
    const rec = chargerRecord(ctx, f.replace(/\.json$/, ""));
    if (!rec) continue;
    if (!["livre", "bloque"].includes(deriverEtat(ctx, rec))) continue;
    const eng = String(rec.eng);
    if (NOMS_RAPPORT.some((n) => fs6.existsSync(path5.join(ctx.livraisons, eng, n)))) continue;
    dus.push(eng);
  }
  return dus;
}
function collecterRapports(ctx) {
  return rapportsARamasser(ctx).filter((eng) => archiverRapport(ctx, eng) !== null);
}
function sauverRecord(ctx, rec) {
  rec.updated_at = isoSecondes();
  ecrireAtomique(cheminRecord(ctx, rec.eng), JSON.stringify(rec, null, 2));
}
function verifierToken(ctx, eng, token) {
  const rec = chargerRecord(ctx, eng);
  return Boolean(rec && token && rec.token === token);
}
function toucher(ctx, eng, note) {
  const rec = chargerRecord(ctx, eng);
  if (!rec) return null;
  rec.last_seen = isoSecondes();
  if (note) {
    const evenements = Array.isArray(rec.events) ? rec.events : [];
    evenements.push({ at: rec.last_seen, note: String(note).slice(0, 500) });
    rec.events = evenements.slice(-MAX_EVENEMENTS);
  }
  sauverRecord(ctx, rec);
  return rec;
}
function revoquer(ctx, eng, motif, par = "cockpit") {
  const rec = chargerRecord(ctx, eng);
  if (!rec) return { ok: false, erreur: `aucun lease pour ${eng}` };
  if (rec.state === "revoked") return { ok: true, eng, deja: true };
  rec.state = "revoked";
  rec.revoked_at = isoSecondes();
  rec.revoke_motif = String(motif ?? "").slice(0, 500);
  rec.revoked_by = par;
  sauverRecord(ctx, rec);
  return { ok: true, eng, effet: "toute \xE9criture de la session est d\xE9sormais refus\xE9e par les hooks" };
}
function solderRecord(ctx, eng, mode = "abandon") {
  const rec = chargerRecord(ctx, eng);
  if (!rec) return { ok: false, erreur: `aucun lease pour ${eng}` };
  archiverRapport(ctx, eng);
  if (mode === "fin") {
    try {
      fs6.unlinkSync(cheminRecord(ctx, eng));
    } catch {
    }
    return { ok: true, eng, mode: "fin" };
  }
  rec.state = "released";
  rec.released_at = isoSecondes();
  sauverRecord(ctx, rec);
  return { ok: true, eng, mode: "abandon" };
}
function oublier(ctx, eng) {
  const rec = chargerRecord(ctx, eng);
  if (!rec) return { ok: false, erreur: `aucun lease pour ${eng}` };
  const etat = deriverEtat(ctx, rec);
  if (etat === "active" || etat === "stale") {
    return { ok: false, erreur: `${eng} a un lease actif ; r\xE9voque-le ou rel\xE2che-le avant de l'oublier` };
  }
  try {
    fs6.unlinkSync(cheminRecord(ctx, eng));
  } catch {
  }
  return { ok: true, eng };
}
function reglerPlafond(ctx, n) {
  if (!Number.isFinite(Number(n))) {
    throw Object.assign(new Error("le plafond est un entier"), { code: "plafond_invalide" });
  }
  const d = cfg(ctx);
  d.max_live = Math.max(0, Math.trunc(Number(n)));
  ecrireAtomique(ctx.agents, corpsAgents(d.max_live, Boolean(d.paused ?? false)));
  return d.max_live;
}
function toutMettreEnPause(ctx) {
  const d = cfg(ctx);
  ecrireAtomique(ctx.agents, corpsAgents(entierSain(d.max_live, CAP_DEFAUT), true));
  const geles = listerLeases(ctx).filter((r) => r.state === "active" || r.state === "stale").map((r) => r.eng);
  return { ok: true, paused: true, geles, count: geles.length };
}
function reprendreTout(ctx) {
  const d = cfg(ctx);
  ecrireAtomique(ctx.agents, corpsAgents(entierSain(d.max_live, CAP_DEFAUT), false));
  return { ok: true, paused: false };
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
function estManifesteDeDependances(chemin) {
  const nom = nomExact(chemin);
  return nom !== null && MANIFESTES_DE_DEPENDANCES.includes(nom);
}
function estFichierGenere(chemin, cheminsGeneres2 = []) {
  const nom = nomExact(chemin);
  return nom !== null && (FICHIERS_GENERES.includes(nom) || cheminsGeneres2.includes(chemin));
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

// noyau/src/claims.ts
var ENTETE = "# Scope reservations, one per commitment. Written by the cockpit under the\n# mutation lock: never edit this file by hand.\n# Granularity: the domain code of the requirements folder (GEO, COP, MESH). A\n# reservation holds for as long as the lease of its commitment holds.\n";
var LIGNE_MODE_CHEMINS = "mode: chemins\n";
function chargerClaims(ctx) {
  if (!fs7.existsSync(ctx.claims)) return [];
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
function sauverClaims(ctx, claims) {
  const mode = reservationsDesactivees(ctx) ? "mode: aucune\n" : reservationsParChemins(ctx) ? LIGNE_MODE_CHEMINS : "";
  ecrireAtomique(ctx.claims, ENTETE + mode + corpsClaims(claims));
}
function libererClaims(ctx, eng) {
  const detenues = chargerClaims(ctx).filter((c) => detenue(ctx, c));
  const gardees = detenues.filter((c) => c.eng !== eng);
  sauverClaims(ctx, gardees);
  return detenues.length - gardees.length;
}
function prendreClaim(ctx, domaine, eng, owner = "coordinator", jours = 4, paths, cheminsDe) {
  const dom = domaine.toUpperCase();
  if (reservationsDesactivees(ctx)) {
    sauverClaims(ctx, chargerClaims(ctx).filter((c) => detenue(ctx, c)));
    return { ok: true, detenteur: null };
  }
  const parChemins = reservationsParChemins(ctx);
  let claims = chargerClaims(ctx).filter((c) => detenue(ctx, c));
  for (const autre of claims.filter((c) => c.domaine === dom && c.eng !== eng)) {
    const conflit = titulaireBloque(parChemins, autre, paths ?? [], cheminsDe);
    if (conflit === null) continue;
    return { ok: false, detenteur: autre, ...conflit.length ? { chemins: conflit } : {} };
  }
  claims = claims.filter((c) => !(c.domaine === dom && c.eng === eng));
  const claim = { domaine: dom, eng, owner, expires: isoMinutes(ajouterJours(/* @__PURE__ */ new Date(), jours)) };
  if (parChemins && paths) claim.paths = [...paths];
  claims.push(claim);
  sauverClaims(ctx, claims);
  return { ok: true, detenteur: null };
}

// noyau/src/streams.ts
var fs8 = __toESM(require("node:fs"), 1);
var path6 = __toESM(require("node:path"), 1);
var crypto2 = __toESM(require("node:crypto"), 1);
var IMPLICIT_STREAM = "product";
var STATUSES = ["propose", "pris", "tenu", "rompu", "abandonne", "remplace"];
var OPEN_STATUSES = ["propose", "pris"];
var NO_STREAM = "(no stream)";
var RE_NAME = /^[a-z0-9][a-z0-9._-]*$/;
var RE_DOMAIN = /^[A-Z]{2,6}$/;
function relativePath(ctx, p) {
  return path6.relative(ctx.racine, p).split(path6.sep).join("/");
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
    else if (path6.isAbsolute(requirements) || requirements.split("/").includes("..")) {
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
    stats = fs8.statSync(ctx.streams);
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
function streamLabel(d, e) {
  const s = streamOfCommitment(d, e);
  if (s.stream) return s.stream.name;
  if (s.across.length) return s.across.map((x) => x.name).join("+");
  return NO_STREAM;
}
function indicatorsOf(records) {
  const counts = { propose: 0, pris: 0, tenu: 0, rompu: 0, abandonne: 0, remplace: 0 };
  for (const e of records) {
    const st = String(e.statut ?? "");
    if (STATUSES.includes(st)) counts[st] += 1;
  }
  const closed = counts.tenu + counts.rompu;
  return { counts, ppc: closed ? Math.floor(100 * counts.tenu / closed) : null, held: counts.tenu, broken: counts.rompu };
}
function indicatorsByStream(d, engs) {
  const groups = /* @__PURE__ */ new Map();
  for (const s of d.streams) groups.set(s.name, []);
  for (const e of engs.values()) {
    const label = streamLabel(d, e);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(e);
  }
  return {
    whole: indicatorsOf(engs.values()),
    streams: [...groups.entries()].map(([stream, records]) => ({ stream, ...indicatorsOf(records) }))
  };
}
var overlapCache = /* @__PURE__ */ new Map();
function overlaps(ctx, d) {
  const r = git(["ls-files", "-z"], ctx.racine);
  if (r.code !== 0) return null;
  const key = crypto2.createHash("sha1").update(JSON.stringify(d.streams.map((s) => [s.name, s.paths]))).update(r.stdout).digest("hex");
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
    if (!s.requirements || path6.isAbsolute(s.requirements) || s.requirements.split("/").includes("..")) continue;
    const folder = path6.join(ctx.racine, s.requirements);
    if (!fs8.existsSync(folder) || !fs8.statSync(folder).isDirectory()) {
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
function streamsOverview(ctx, engs) {
  const d = readStreams(ctx);
  const rows = d.streams.map((s) => ({
    ...s,
    counts: { propose: 0, pris: 0, tenu: 0, rompu: 0, abandonne: 0, remplace: 0 },
    ppc: null,
    commitments: []
  }));
  const unassigned = [];
  const across = [];
  for (const eid of [...engs.keys()].sort()) {
    const e = engs.get(eid);
    const s = streamOfCommitment(d, e);
    if (s.across.length) {
      across.push(eid);
      continue;
    }
    const row = s.stream ? rows.find((l) => l.name === s.stream.name) : void 0;
    if (!row) {
      unassigned.push(eid);
      continue;
    }
    row.commitments.push(eid);
    const status = String(e.statut ?? "");
    if (STATUSES.includes(status)) row.counts[status] += 1;
  }
  for (const row of rows) {
    const closed = row.counts.tenu + row.counts.rompu;
    row.ppc = closed ? Math.floor(100 * row.counts.tenu / closed) : null;
  }
  return {
    file: relativePath(ctx, ctx.streams),
    declared: d.declared,
    streams: rows,
    unassigned,
    across,
    whole: indicatorsOf(engs.values()),
    problems: d.problems
  };
}
function declarationRefusals(ctx, engs) {
  return anchorRefusals(ctx, checkStreams(ctx, engs).declaration);
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
var fs9 = __toESM(require("node:fs"), 1);
var path7 = __toESM(require("node:path"), 1);
var CODIFICATION_FILE = "02_CODIFICATION.md";
function tableCodification(codification, folder) {
  const table = /* @__PURE__ */ new Map();
  const texte = lireTexte(codification);
  for (const ligne of texte.split("\n")) {
    const m = ligne.match(/^\|\s*([A-Z]{2,4})\s*\|[^|]*\|\s*`([^`]+)`\s*\|/);
    if (m) table.set(m[1], path7.join(folder, m[2]));
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
    noms = fs9.readdirSync(folder).filter((n) => n.endsWith(".md")).sort();
  } catch {
    return [];
  }
  return noms.map((n) => path7.join(folder, n)).filter((f) => RE_TETE_EXIGENCE.test(texteDomaine(f) ?? ""));
}
function requirementSources(ctx, declaration, options = {}) {
  const d = declaration ?? readStreams(ctx);
  const parDossier = /* @__PURE__ */ new Map();
  if (!d.declared) parDossier.set(path7.relative(ctx.racine, ctx.recette).split(path7.sep).join("/"), [d.streams[0]?.name ?? "product"]);
  else {
    for (const s of d.streams) {
      if (!s.requirements || path7.isAbsolute(s.requirements) || s.requirements.split("/").includes("..")) continue;
      if (!parDossier.has(s.requirements)) parDossier.set(s.requirements, []);
      parDossier.get(s.requirements).push(s.name);
    }
  }
  const sources = [];
  for (const [rel3, streams] of parDossier) {
    const folder = path7.join(ctx.racine, rel3);
    if (!fs9.existsSync(folder)) continue;
    const codification = path7.join(folder, CODIFICATION_FILE);
    if (fs9.existsSync(codification)) {
      const files2 = options.chapterFiles === false ? [] : fichiersAvecExigences(folder);
      sources.push({ streams, folder, rel: rel3, form: "chapters", domains: tableCodification(codification, folder), files: files2 });
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
    sources.push({ streams, folder, rel: rel3, form: "file", domains, files });
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
  if (!fs9.existsSync(chemin)) return null;
  const st = fs9.statSync(chemin);
  const connu = cacheTextes.get(chemin);
  if (connu && connu.mtimeMs === st.mtimeMs) return connu.texte;
  const texte = lireTexte(chemin);
  cacheTextes.set(chemin, { mtimeMs: st.mtimeMs, texte });
  return texte;
}
function extraireSpec(specId, fichiers) {
  const dom = specId.split("-")[1];
  const chemin = fichiers.get(dom);
  if (!chemin || !fs9.existsSync(chemin)) {
    return `### ${specId}

(Introuvable : domaine \`${dom}\` sans fichier connu.)
`;
  }
  const texte = texteDomaine(chemin) ?? "";
  const echappe = specId.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  const m = texte.match(new RegExp(`^### ${echappe}\\b[\\s\\S]*?(?=^###? |$(?![\\s\\S]))`, "m"));
  if (!m) return `### ${specId}

(Introuvable dans ${path7.basename(chemin)}.)
`;
  return m[0].replace(/\s+$/, "") + "\n";
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
  const st = fs10.statSync(chemin);
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
  if (!fs10.existsSync(ctx.engagements)) {
    erreurs.push(`r\xE9pertoire absent : ${ctx.engagements}`);
    structurees?.push({ fichier: null, id: null, champ: null, message: `r\xE9pertoire absent : ${ctx.engagements}` });
    return engs;
  }
  const fichiers = fs10.readdirSync(ctx.engagements).filter((f) => /^ENG-.*\.yaml$/.test(f)).sort();
  for (const f of fichiers) {
    const chemin = path8.join(ctx.engagements, f);
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
  if (!fs10.existsSync(ctx.milestones)) return jalons;
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
function rapportRegistre(ctx, engs) {
  const engagements2 = {};
  const occupes = domainesOccupes(ctx);
  for (const [eid, e] of engs) {
    engagements2[eid] = {
      titre: e.titre ?? null,
      type: e.type ?? null,
      statut: e.statut ?? null,
      etat: etatCalcule(engs, eid, occupes),
      promettant: e.promettant ?? null,
      reserve_par: e.reserve_par ?? null,
      beneficiaire: e.beneficiaire ?? null,
      echeance: e.echeance ? String(e.echeance) : null,
      exigences: exigences(e),
      domaines: domaines(e),
      variance: e.variance ?? null,
      readiness: Array.isArray(e.readiness) ? e.readiness : [],
      readiness_ok: e.readiness_ok ?? true,
      depends_on: dependsOn(e),
      dependants: dependantsTransitifs(engs, eid).size,
      // The domain claims that hold back a commitment otherwise ready: the views name the holder.
      retenu_par: claimsBloquantes(engs, eid, occupes)
    };
  }
  return {
    engagements: engagements2,
    frontiere: frontiere(engs, occupes),
    chemins_critiques: cheminsCritiques(ctx, engs),
    jalons: Object.fromEntries(chargerJalons(ctx))
  };
}
function impact(ctx, engs, eid) {
  if (!engs.has(eid)) return { ok: false, erreur: `engagement inconnu : ${eid}` };
  const succ = successeurs(engs);
  const deps = [...dependantsTransitifs(engs, eid)].sort();
  const directs = {};
  for (const [nxt, t] of succ.get(eid) ?? []) directs[nxt] = t;
  const chemins = {};
  for (const [jid, chaine2] of Object.entries(cheminsCritiques(ctx, engs))) {
    if (chaine2.includes(eid)) chemins[jid] = chaine2;
  }
  return { ok: true, directs, transitifs: deps, chemins_critiques: chemins };
}
function lignee(engs, eid) {
  const chaine2 = [eid];
  let courant = engs.get(eid);
  const vus = /* @__PURE__ */ new Set([eid]);
  while (courant && courant.reprend) {
    const prev = String(courant.reprend);
    if (vus.has(prev) || !engs.has(prev)) break;
    chaine2.unshift(prev);
    vus.add(prev);
    courant = engs.get(prev);
  }
  return chaine2;
}

// noyau/src/das.ts
var fs19 = __toESM(require("node:fs"), 1);
var path17 = __toESM(require("node:path"), 1);

// noyau/src/numerotation.ts
var fs12 = __toESM(require("node:fs"), 1);
var path10 = __toESM(require("node:path"), 1);

// noyau/src/memo.ts
var crypto3 = __toESM(require("node:crypto"), 1);
var fs11 = __toESM(require("node:fs"), 1);
var path9 = __toESM(require("node:path"), 1);
var condense = (s) => crypto3.createHash("sha1").update(s).digest("hex").slice(0, 16);
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
  return path9.join(ctx.runs, "cache", `${nom.replace(/[^A-Za-z0-9_.-]/g, "_")}.json`);
}
function memoriser(ctx, nom, cle, calcul) {
  const f = cheminMemo(ctx, nom);
  try {
    const d = JSON.parse(fs11.readFileSync(f, "utf-8"));
    if (d.cle === cle && d.valeur !== void 0) return d.valeur;
  } catch {
  }
  const valeur = calcul();
  try {
    fs11.mkdirSync(path9.dirname(f), { recursive: true });
    const tmp = `${f}.${process.pid}.tmp`;
    fs11.writeFileSync(tmp, JSON.stringify({ cle, valeur, le: (/* @__PURE__ */ new Date()).toISOString() }), "utf-8");
    fs11.renameSync(tmp, f);
  } catch {
  }
  return valeur;
}

// noyau/src/numerotation.ts
var FAMILLES = ["ENG", "SCP", "DA", "ADR"];
function cheminRegistre(ctx) {
  return path10.join(ctx.runs, "numeros.json");
}
function chargerRegistre2(ctx) {
  const p = cheminRegistre(ctx);
  if (!fs12.existsSync(p)) return {};
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return {};
  }
}
function sauverRegistre(ctx, registre) {
  fs12.mkdirSync(ctx.runs, { recursive: true });
  ecrireAtomique(cheminRegistre(ctx), JSON.stringify(registre, null, 2) + "\n");
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
  if (!fs12.existsSync(dossier)) return 0;
  let max = 0;
  let noms;
  try {
    noms = fs12.readdirSync(dossier);
  } catch {
    return 0;
  }
  for (const nom of noms) max = Math.max(max, numeroDe(nom, prefixe) ?? 0);
  return max;
}
function relatifDe(ctx, famille) {
  return path10.relative(ctx.racine, dossierDe(ctx, famille)).split(path10.sep).join("/");
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
function plusHautDansRefs(ctx, famille) {
  const publies = nomsPublies(ctx);
  if (!publies) return 0;
  let max = 0;
  for (const nom of publies[famille]) max = Math.max(max, numeroDe(nom, famille) ?? 0);
  return max;
}
function existeSurDisque(dossier, id) {
  if (!fs12.existsSync(dossier)) return false;
  try {
    return fs12.readdirSync(dossier).some((n) => n.startsWith(`${id}.`) || n.startsWith(`${id}-`));
  } catch {
    return false;
  }
}
var refReservation = (id) => `${RESERVATION_REFS}/numeros/${id}`;
var ESSAIS_DISTANTS = 20;
function plusHautReserveDistant(ctx, remote, famille) {
  const refs = listRemoteReservations(ctx, remote, `numeros/${famille}-*`);
  if (refs === null) return null;
  let max = 0;
  for (const ref of refs) {
    const n = numeroDe(ref.slice(ref.lastIndexOf("/") + 1), famille);
    if (n !== null && n > max) max = n;
  }
  return max;
}
function reserverNumero(ctx, famille, par = "cockpit") {
  return allouerNumero(ctx, famille, par).id;
}
function allouerNumero(ctx, famille, par = "cockpit") {
  const registre = chargerRegistre2(ctx);
  const etat = registre[famille] ?? { dernier: 0, reservations: [] };
  const surDisque = plusHautSurDisque(dossierDe(ctx, famille), famille);
  refreshRemoteRefs(ctx);
  let suivant = Math.max(etat.dernier, surDisque, plusHautDansRefs(ctx, famille)) + 1;
  let provisoire = false;
  let motif;
  const remote = reservationRemote(ctx);
  if (remote) {
    let reserve = false;
    let distantLu = false;
    for (let essai = 0; essai < ESSAIS_DISTANTS && !reserve; essai++) {
      const candidat = idDe(famille, suivant);
      const r = reserveRemoteRef(ctx, remote, refReservation(candidat), `${candidat} reserved by ${par} on ${isoSecondes()}`);
      if (r.created) {
        reserve = true;
        break;
      }
      if (!r.reachable) {
        provisoire = true;
        motif = plusHautReserveDistant(ctx, remote, famille) === null ? `the remote ${remote} did not answer` : `the remote ${remote} refused the reservation without naming it taken: ${r.detail.split("\n")[0]}`;
        break;
      }
      if (!distantLu) {
        distantLu = true;
        const distant = plusHautReserveDistant(ctx, remote, famille);
        suivant = Math.max(suivant + 1, (distant ?? 0) + 1);
      } else suivant += 1;
    }
    if (!reserve && !provisoire) {
      provisoire = true;
      motif = `${ESSAIS_DISTANTS} numbers in a row were taken on the remote ${remote}`;
    }
  }
  const id = idDe(famille, suivant);
  etat.dernier = suivant;
  etat.reservations.push({ id, le: isoSecondes(), par, honoree: false, ...provisoire ? { provisoire: true } : {} });
  etat.reservations = etat.reservations.slice(-100);
  registre[famille] = etat;
  sauverRegistre(ctx, registre);
  return { id, provisoire, ...motif ? { motif } : {} };
}
function doublonsDe(ctx, famille) {
  const dossier = dossierDe(ctx, famille);
  if (!fs12.existsSync(dossier)) return [];
  const comptes = /* @__PURE__ */ new Map();
  let noms;
  try {
    noms = fs12.readdirSync(dossier);
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
    return fs12.readdirSync(dossierDe(ctx, famille)).filter((n) => numeroDe(n, famille) !== null);
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
function commiterRecords(ctx, chemins, message) {
  if (!estRacineGit(ctx)) return { sha: null, raison: "the root is not a git repository" };
  const rels = chemins.filter((c) => fs12.existsSync(c)).map((c) => path10.relative(ctx.racine, c).split(path10.sep).join("/"));
  if (!rels.length) return { sha: null, raison: "no record to commit" };
  const ajout = git(["add", "--", ...rels], ctx.racine);
  if (ajout.code !== 0) return { sha: null, raison: ajout.stderr.trim() || "git add failed" };
  const commit = git(["commit", "--only", "--quiet", "-m", message, "--", ...rels], ctx.racine);
  if (commit.code !== 0) return { sha: null, raison: (commit.stderr.trim() || commit.stdout.trim() || "git commit failed").split("\n")[0] };
  return { sha: git(["rev-parse", "--short", "HEAD"], ctx.racine).stdout.trim() || null, raison: null };
}
function renumeroter(ctx, nom, par = "cli") {
  const famille = FAMILLES.find((f) => numeroDe(nom, f) !== null);
  if (!famille) return { ok: false, code: "record_inconnu", erreur: `${nom} names no numbered record (ENG, SCP, DA or ADR)` };
  const numero = numeroDe(nom, famille);
  const ancien = idDe(famille, numero);
  const porteurs = nomsSurDisque(ctx, famille).filter((n) => numeroDe(n, famille) === numero);
  const fichier = porteurs.find((n) => n === nom || n.replace(/\.[^.]+$/, "") === nom);
  if (!fichier) return { ok: false, code: "record_inconnu", erreur: `${nom} not found among the ${famille} records` };
  if (porteurs.length < 2) {
    return { ok: false, code: "numero_unique", erreur: `${ancien} is carried by one record only: there is nothing to renumber` };
  }
  const publies = nomsPublies(ctx);
  if (publies && publies[famille].has(fichier)) {
    const locaux = porteurs.filter((n) => n !== fichier && !publies[famille].has(n));
    if (locaux.length) {
      return {
        ok: false,
        code: "record_publie",
        erreur: `${fichier} is published and keeps ${ancien}: renumber ${locaux.map((n) => n.replace(/\.[^.]+$/, "")).join(" or ")}, which exists in this clone only`
      };
    }
  }
  const nouveau = reserverNumero(ctx, famille, par);
  const dossier = dossierDe(ctx, famille);
  const cible = nouveau + fichier.slice(ancien.length);
  const texte = lireTexte(path10.join(dossier, fichier));
  ecrireTexte(path10.join(dossier, cible), texte.replace(new RegExp(`\\b${ancien}\\b`, "g"), nouveau));
  fs12.rmSync(path10.join(dossier, fichier));
  let citations = [];
  if (estRacineGit(ctx)) {
    const r = git(["grep", "-l", "-w", "--untracked", ancien], ctx.racine);
    const gardes = new Set(porteurs.filter((n) => n !== fichier).map((n) => `${relatifDe(ctx, famille)}/${n}`));
    citations = r.stdout.split("\n").map((l) => l.trim()).filter((l) => l && !gardes.has(l)).sort();
  }
  return { ok: true, ancien, nouveau, fichier: `${relatifDe(ctx, famille)}/${cible}`, citations };
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

// noyau/src/blocker.ts
var fs18 = __toESM(require("node:fs"), 1);
var path16 = __toESM(require("node:path"), 1);

// noyau/src/identities.ts
var fs15 = __toESM(require("node:fs"), 1);
var path13 = __toESM(require("node:path"), 1);
var import_node_child_process5 = require("node:child_process");

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
    const rel3 = base ? base + "/" + e.name : e.name;
    if (e.isDirectory()) {
      if (IGNORES.includes(e.name)) continue;
      yield* fichiersDe(racine, rel3);
    } else if (e.isFile() && estTexte(rel3)) {
      yield rel3;
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
  for (const rel3 of fichiersDe(racine)) {
    if (exempteDeTout(rel3)) continue;
    const absolu = path11.join(racine, rel3);
    let taille;
    let date;
    try {
      const st = fs13.statSync(absolu);
      taille = st.size;
      date = st.mtimeMs;
    } catch {
      continue;
    }
    vus.add(rel3);
    bilan.fichiersExamines++;
    let entree = connus.get(rel3);
    if (!entree || entree.taille !== taille || entree.date !== date) {
      let texte;
      try {
        texte = fs13.readFileSync(absolu, "utf-8");
      } catch {
        continue;
      }
      entree = { taille, date, fautes: fautesDeStyle(texte, rel3, options) };
      connus.set(rel3, entree);
    }
    if (!entree.fautes.length) continue;
    const regles = new Set(entree.fautes.map((f) => f.regle));
    for (const r of regles) bilan.parRegle[r] = (bilan.parRegle[r] ?? 0) + 1;
    for (const f of entree.fautes) bilan.fautes.push({ ...f, fichier: rel3 });
  }
  for (const rel3 of [...connus.keys()]) if (!vus.has(rel3)) connus.delete(rel3);
  BILANS.set(cle, { a: Date.now(), bilan });
  return bilan;
}

// noyau/src/crochets.ts
var fs14 = __toESM(require("node:fs"), 1);
var path12 = __toESM(require("node:path"), 1);
var import_node_child_process4 = require("node:child_process");
var AUTEUR_NOM = "Pierre-Thibault Fabre";
var AUTEUR_MAIL = "pierre-thibault@penrosetactical.com";
var IDENTITIES_FILE = ".lean-engine/identities";
var DOSSIER_CROCHETS = ".lean-engine/githooks";
var MODES_CROCHETS = ["pre-commit", "commit-msg", "pre-merge-commit", "pre-push", "post-merge"];
var DOSSIERS_NUMEROTES = [".lean-engine/orchestration/ENG", ".lean-engine/orchestration/SCP", ".lean-engine/orchestration/DA", ".lean-engine/orchestration/ADR"];
function controleNumerotation(fatal) {
  return [
    `for d in ${DOSSIERS_NUMEROTES.join(" ")}; do`,
    '  [ -d "$d" ] || continue',
    `  doubles=$(ls "$d" | sed -n -E 's/^((ENG|SCP|DA|ADR)-[0-9]{4}).*$/\\1/p' | sort | uniq -d | tr '\\n' ' ')`,
    '  if [ -n "$doubles" ]; then',
    '    echo "[numbering-guard] $d: more than one record carries ${doubles}" >&2',
    '    echo "Two records under one number make every citation ambiguous. Renumber the one that exists in this clone only:" >&2',
    '    echo "  lean numero" >&2',
    '    echo "  lean renumeroter <record>" >&2',
    ...fatal ? ["    exit 1"] : [],
    "  fi",
    "done"
  ];
}
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
var FICHIERS_CLAIMS = [
  ".lean-engine/orchestration/claims.yaml",
  ".agenticLEAN/claims.yaml",
  "agentic_orchestrator/management/claims.yaml"
];
function controleDivergence() {
  return [
    'remote="$1"',
    "zero=0000000000000000000000000000000000000000",
    `dossiers='${DOSSIERS_NUMEROTES_TOUS.join(" ")}'`,
    `fichiers_claims='${FICHIERS_CLAIMS.join(" ")}'`,
    // The title of a record: `titre:` of a commitment, the heading of a document.
    `titre() { git show "$1" 2>/dev/null | sed -n -E -e 's/^titre: *"?([^"]*)"? *$/\\1/p' -e 's/^# *(ENG|SCP|DA|ADR)-[0-9]{4}[^:]*: *(.*)$/\\2/p' | head -n 1; }`,
    // The claims of a version of the claims file, one `DOMAIN ENG` per line.
    `paires() { git show "$1" 2>/dev/null | awk '/^- domaine:/ { d = $3; gsub(/["\\047]/, "", d) } /^ +eng:/ { e = $2; gsub(/["\\047]/, "", e); print d " " e }'; }`,
    "fautes=''",
    "while read -r lref lsha rref rsha; do",
    '  [ "$lsha" = "$zero" ] && continue',
    '  case "$rref" in refs/heads/*) ;; *) continue ;; esac',
    '  suivi="refs/remotes/$remote/${rref#refs/heads/}"',
    '  git rev-parse -q --verify "$suivi" >/dev/null || continue',
    '  for c in $(git rev-list --no-merges "$lsha" --not --remotes="$remote"); do',
    "    for d in $dossiers; do",
    '      for f in $(git diff-tree --no-commit-id --name-only -r --diff-filter=A "$c" -- "$d/"); do',
    `        id=$(basename "$f" | sed -n -E 's/^((ENG|SCP|DA|ADR)-[0-9]{4}).*$/\\1/p')`,
    '        [ -n "$id" ] || continue',
    '        for g in $(git ls-tree --name-only "$suivi" -- "$d/" | grep -E "/$id([.-]|$)"); do',
    '          ici=$(titre "$c:$f"); la=$(titre "$suivi:$g")',
    '          [ "$ici" = "$la" ] && continue',
    '          fautes="$fautes$id is carried by two records: here \\"$ici\\" ($f, commit $(git rev-parse --short "$c")), on $remote \\"$la\\" ($g)\n"',
    "        done",
    "      done",
    "    done",
    "    for cf in $fichiers_claims; do",
    // Reservations held by paths admit two commitments on one domain: the guard of the domain
    // does not apply to them, and the pull of each clone checks the paths against the remote.
    `      git show "$c:$cf" 2>/dev/null | grep -qE '^mode: (chemins|aucune)' && continue`,
    '      avant=$(paires "$c^:$cf")',
    '      la=$(paires "$suivi:$cf")',
    '      [ -n "$la" ] || continue',
    '      conflits=$(paires "$c:$cf" | while read -r dom eng; do',
    `        printf '%s\\n' "$avant" | grep -qxF -- "$dom $eng" && continue`,
    `        autre=$(printf '%s\\n' "$la" | awk -v d="$dom" -v e="$eng" '$1 == d && $2 != e { print $2; exit }')`,
    `        [ -n "$autre" ] && printf 'domain %s is claimed by two commitments: %s here, %s on %s\\n' "$dom" "$eng" "$autre" "$remote"`,
    "      done)",
    '      [ -n "$conflits" ] && fautes="$fautes$conflits\n"',
    "    done",
    "  done",
    "done",
    'if [ -n "$fautes" ]; then',
    `  printf '[divergence-guard] %s' "$fautes" >&2`,
    '  echo "Another clone holds the same number or the same domain. Renumber the record of this clone" >&2',
    '  echo "(lean renumeroter <record>) or release the commitment that took the domain here, before you push." >&2',
    "  exit 1",
    "fi"
  ];
}
function scriptNumerotation(mode) {
  return [
    "#!/bin/sh",
    `# Numbering guard (${mode}): one number, one record.`,
    "# Placed by Lean Engine. PURE SH: no interpreter is required,",
    "# so the rule holds under Git for Windows and under WSL alike.",
    ...controleNumerotation(mode !== "post-merge"),
    ...mode === "pre-push" ? controleDivergence() : [],
    "exit 0"
  ].join("\n") + "\n";
}
function preambule() {
  return [
    "#!/bin/sh",
    "# Garde d'identite d'auteur et de lexique interdit (Constitution section 8).",
    "# Pose par Lean Engine. SH PUR : aucun interpreteur n'est requis,",
    "# pour que la regle vaille sous Git for Windows comme sous WSL.",
    `nom='${AUTEUR_NOM}'`,
    `mail='${AUTEUR_MAIL}'`,
    // Assemblés à l'exécution : le fichier versionné ne porte aucune forme.
    'f=anthr; f="${f}opic"',
    'o=cla; o="${o}ude"',
    "r=$(printf '\\360\\237\\244\\226')",
    'motif="($f)|(co-authored-by:[[:space:]]*$o)|(generated with \\[?$o)|(assisted[- ]by:[[:space:]]*$o)|([[:alnum:]_.+-]*$o[[:alnum:]_.+-]*@[[:alnum:]_.-]*noreply)|(${r}[[:space:]]*generated)"'
  ];
}
function controleIdentite() {
  return [
    `liste='${IDENTITIES_FILE}'`,
    "for qui in GIT_AUTHOR_IDENT GIT_COMMITTER_IDENT; do",
    '  ident=$(git var "$qui" 2>/dev/null) || continue',
    // `Name <mail> 1700000000 +0000` without its date and its zone.
    "  signe=${ident% * *}",
    `  if [ -s "$liste" ] && grep -v '^#' "$liste" | grep -q '<'; then`,
    `    grep -v '^#' "$liste" | tr -d '\\r' | grep -qxF -- "$signe" && continue`,
    "  else",
    '    [ "$signe" = "$nom <$mail>" ] && continue',
    "  fi",
    '  echo "[identity-guard] identity refused ($qui): $signe" >&2',
    '  echo "This repository admits the identities listed in $liste, and no other." >&2',
    '  echo "To sign under your own name, ask for it to be admitted and set, in one gesture:" >&2',
    // The command is named without its interpreter: this script depends on none.
    '  echo "  lean identite use \\"Your Name\\" you@example.org" >&2',
    "  exit 1",
    "done"
  ];
}
function scriptCrochetSh(mode) {
  if (mode !== "pre-commit" && mode !== "commit-msg") return scriptNumerotation(mode);
  const corps = [...preambule()];
  if (mode === "pre-commit") {
    corps.push(...controleIdentite());
    corps.push(...controleNumerotation(true));
    corps.push(
      // Une ligne ajoutée, fichier par fichier, pour nommer le fautif.
      "git diff --cached --name-only --diff-filter=ACMR | while IFS= read -r fichier; do",
      `  ligne=$(git diff --cached -U0 --no-color --no-textconv -- "$fichier" | grep '^+' | grep -v '^+++' | grep -iE -- "$motif" | head -n 1)`,
      '  if [ -n "$ligne" ]; then',
      '    echo "[garde-identite] $fichier : une ligne ajoutee porte le lexique interdit (Constitution section 8)." >&2',
      '    echo "  $ligne" >&2',
      "    exit 1",
      "  fi",
      "done || exit 1",
      "exit 0"
    );
  } else {
    corps.push(
      'msg="$1"',
      '[ -f "$msg" ] || exit 0',
      // Les lignes de commentaire de git ne font pas partie du message.
      `ligne=$(grep -v '^#' "$msg" | grep -iE -- "$motif" | head -n 1)`,
      'if [ -n "$ligne" ]; then',
      '  echo "[garde-identite] le message de commit porte le lexique interdit (Constitution section 8)." >&2',
      '  echo "  $ligne" >&2',
      "  exit 1",
      "fi",
      "exit 0"
    );
  }
  return corps.join("\n") + "\n";
}
function git2(racine, args) {
  const r = (0, import_node_child_process4.spawnSync)("git", ["-C", racine, ...args], { encoding: "utf-8", windowsHide: true });
  return { code: r.status ?? 1, sortie: (r.stdout ?? "").trim() };
}
function hooksPathLocal(racine) {
  const r = git2(racine, ["config", "--local", "--get", "core.hooksPath"]);
  return r.code === 0 && r.sortie ? r.sortie : null;
}
function estDepotGit(racine) {
  return git2(racine, ["rev-parse", "--git-dir"]).code === 0;
}
function poserCrochetsGit(racine) {
  const dossier = path12.join(racine, DOSSIER_CROCHETS);
  const dossiers = [];
  let p = dossier;
  const manquants = [];
  while (!fs14.existsSync(p) && p.startsWith(path12.resolve(racine)) && p !== path12.resolve(racine)) {
    manquants.push(p);
    p = path12.dirname(p);
  }
  fs14.mkdirSync(dossier, { recursive: true });
  for (const d of manquants) dossiers.push(path12.relative(racine, d).split("\\").join("/"));
  const fichiers = [];
  for (const mode of MODES_CROCHETS) {
    const chemin = path12.join(dossier, mode);
    if (fs14.existsSync(chemin)) continue;
    fs14.writeFileSync(chemin, scriptCrochetSh(mode), "utf-8");
    try {
      fs14.chmodSync(chemin, 493);
    } catch {
    }
    fichiers.push(`${DOSSIER_CROCHETS}/${mode}`);
  }
  if (!estDepotGit(racine)) return { fichiers, dossiers, hooksPathAvant: null, branche: false };
  let hooksPathAvant = hooksPathLocal(racine);
  if (hooksPathAvant === DOSSIER_CROCHETS) {
    hooksPathAvant = fs14.existsSync(path12.join(racine, "agentic_orchestrator", "githooks")) ? "agentic_orchestrator/githooks" : null;
  }
  git2(racine, ["config", "--local", "core.hooksPath", DOSSIER_CROCHETS]);
  return { fichiers, dossiers, hooksPathAvant, branche: true };
}
function rebrancherCrochetsGit(racine, avant) {
  if (!estDepotGit(racine)) return;
  if (hooksPathLocal(racine) !== DOSSIER_CROCHETS) return;
  if (avant) git2(racine, ["config", "--local", "core.hooksPath", avant]);
  else git2(racine, ["config", "--local", "--unset", "core.hooksPath"]);
}

// noyau/src/identities.ts
var DEFAULT_IDENTITY = { nom: AUTEUR_NOM, mail: AUTEUR_MAIL };
var HOOK_MARK = "Lean Engine";
var ENTETE2 = "# Identities admitted to sign in this repository, one per line: Name <mail>.\n# The first one is the principal identity. Managed by `lean identite use`:\n# a person is added at their own request, and a tool is never an identity.\n";
function formatIdentity(i) {
  return `${i.nom} <${i.mail}>`;
}
function parseIdentity(texte) {
  const m = texte.trim().match(/^([^<>]+?)\s*<([^<>\s]+)>$/);
  return m ? { nom: m[1].trim(), mail: m[2].trim() } : null;
}
function git3(racine, args) {
  const r = (0, import_node_child_process5.spawnSync)("git", ["-C", racine, ...args], { encoding: "utf-8", windowsHide: true });
  return { code: r.status ?? 1, sortie: (r.stdout ?? "").trim() };
}
function sommet(racine) {
  const r = git3(racine, ["rev-parse", "--show-toplevel"]);
  return r.code === 0 && r.sortie ? r.sortie : racine;
}
function cheminListe(racine) {
  return path13.join(sommet(racine), IDENTITIES_FILE);
}
function listedIdentities(racine) {
  const f = cheminListe(racine);
  if (!fs15.existsSync(f)) return [];
  const sortie = [];
  for (const ligne of lireTexte(f).split(/\r?\n/)) {
    if (!ligne.trim() || ligne.trim().startsWith("#")) continue;
    const i = parseIdentity(ligne);
    if (i && !sortie.some((x) => x.nom === i.nom && x.mail === i.mail)) sortie.push(i);
  }
  return sortie;
}
function admittedIdentities(racine) {
  const listees = listedIdentities(racine);
  return listees.length ? listees : [DEFAULT_IDENTITY];
}
function principalIdentity(racine) {
  return admittedIdentities(racine)[0];
}
function isAdmitted(racine, nom, mail) {
  return admittedIdentities(racine).some((i) => i.nom === nom && i.mail === mail);
}
function effectiveIdentity(racine) {
  const r = git3(racine, ["var", "GIT_AUTHOR_IDENT"]);
  if (r.code !== 0 || !r.sortie) return null;
  const m = r.sortie.match(/^(.*?)\s*<([^>]*)>/);
  return m ? { nom: m[1], mail: m[2] } : null;
}
function identityRefusal(nom, mail) {
  if (!nom.trim() || /[<>\r\n]/.test(nom)) return "the name is empty or holds a character that a git identity cannot carry";
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(mail)) return `${mail || "(empty)"} is not a mail address`;
  if (/no-?reply/i.test(mail)) return "a no-reply address signs for nobody: an identity is the address of a person";
  for (const [motif, libelle] of lexiqueOutil()) {
    if (motif.test(nom) || motif.test(mail)) return `the identity carries ${libelle}: a tool is never an identity`;
  }
  return null;
}
function admitIdentity(racine, nom, mail) {
  const refus2 = identityRefusal(nom, mail);
  if (refus2) return { ok: false, code: "identity_refused", erreur: refus2, faits: [] };
  const identity = { nom: nom.trim(), mail: mail.trim() };
  const listees = listedIdentities(racine);
  if (listees.some((i) => i.nom === identity.nom && i.mail === identity.mail)) {
    return { ok: true, identity, faits: [`${formatIdentity(identity)} is already admitted`] };
  }
  const toutes = [...listees.length ? listees : [DEFAULT_IDENTITY], identity].filter(
    (i, k, t) => t.findIndex((x) => x.nom === i.nom && x.mail === i.mail) === k
  );
  const f = cheminListe(racine);
  fs15.mkdirSync(path13.dirname(f), { recursive: true });
  ecrireAtomique(f, ENTETE2 + toutes.map(formatIdentity).join("\n") + "\n");
  return { ok: true, identity, faits: [`${formatIdentity(identity)} admitted in ${IDENTITIES_FILE}`] };
}
function refreshPlacedHooks(racine) {
  const dossier = path13.join(sommet(racine), DOSSIER_CROCHETS);
  const refaits = [];
  for (const mode of MODES_CROCHETS) {
    const chemin = path13.join(dossier, mode);
    if (!fs15.existsSync(chemin)) continue;
    const actuel = fs15.readFileSync(chemin, "utf-8");
    const voulu = scriptCrochetSh(mode);
    if (!actuel.includes(HOOK_MARK) || actuel === voulu) continue;
    fs15.writeFileSync(chemin, voulu, "utf-8");
    refaits.push(mode);
  }
  return refaits;
}
function useIdentity(racine, nom, mail) {
  const admis = admitIdentity(racine, nom, mail);
  if (!admis.ok || !admis.identity) return admis;
  const faits = [...admis.faits];
  const identity = admis.identity;
  if (git3(racine, ["rev-parse", "--git-dir"]).code !== 0) {
    return { ok: false, code: "not_a_repository", erreur: `${racine} is not a git repository: the identity is admitted, and git was not configured`, faits };
  }
  for (const [cle, valeur] of [
    ["user.name", identity.nom],
    ["user.email", identity.mail]
  ]) {
    const r = git3(racine, ["config", "--local", cle, valeur]);
    if (r.code !== 0) return { ok: false, code: "git_config", erreur: `git config --local ${cle} failed`, faits };
  }
  faits.push(`git signs here as ${formatIdentity(identity)} (local configuration, shared by the worktrees)`);
  const refaits = refreshPlacedHooks(racine);
  if (refaits.length) faits.push(`git hooks rewritten to read the list: ${refaits.join(", ")}`);
  const effective = effectiveIdentity(racine);
  if (effective && (effective.nom !== identity.nom || effective.mail !== identity.mail)) {
    return {
      ok: false,
      code: "identity_overridden",
      erreur: `git still signs as ${formatIdentity(effective)}: an environment variable (GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL) overrides the local configuration on this workstation`,
      identity,
      faits
    };
  }
  return { ok: true, identity, faits };
}

// noyau/src/closing.ts
var fs17 = __toESM(require("node:fs"), 1);
var path15 = __toESM(require("node:path"), 1);

// noyau/src/documents.ts
var fs16 = __toESM(require("node:fs"), 1);
var path14 = __toESM(require("node:path"), 1);

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
var RE_SPEC2 = /\bSPEC-[A-Z]{2,6}-\d{3}\b/g;
var RE_ENG2 = /\bENG-\d{4}\b/g;
var RE_DA = /\bDA-\d{4}\b/g;
var RE_SCP = /\bSCP-\d{4}\b/g;
var RE_ADR = /\bADR-\d{4}\b/g;
var GENRES = ["engagement", "scp", "adr", "da", "rapport", "jalon", "exigence", "gouvernance"];
function referencesDe(texte) {
  const trouves = /* @__PURE__ */ new Set();
  for (const re of [RE_SPEC2, RE_ENG2, RE_DA, RE_SCP, RE_ADR]) {
    for (const m of texte.matchAll(re)) trouves.add(m[0]);
  }
  return [...trouves].sort();
}
function enTeteYaml(texte) {
  const m = texte.match(/```yaml\n([\s\S]*?)```/);
  if (!m) return {};
  try {
    return lireYamlSur(m[1]) ?? {};
  } catch {
    return {};
  }
}
function titreMarkdown(texte, repli) {
  for (const ligne of texte.split("\n")) {
    const m = ligne.match(/^#\s+(.*\S)\s*$/);
    if (m) return m[1].trim();
  }
  return repli;
}
function champsEnPuces(texte) {
  const champs = {};
  for (const ligne of texte.split("\n")) {
    const m = ligne.match(/^-\s+([^:]{2,40}?)\s*:\s*(.*)$/);
    if (m) champs[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return champs;
}
function fichiersDe2(dossier, motif) {
  if (!fs16.existsSync(dossier)) return [];
  try {
    return fs16.readdirSync(dossier).filter((f) => motif.test(f)).sort();
  } catch {
    return [];
  }
}
function fichiersFamille(dossier, famille) {
  if (!fs16.existsSync(dossier)) return [];
  try {
    return fs16.readdirSync(dossier).filter((f) => estDeLaFamille(famille, f)).sort();
  } catch {
    return [];
  }
}
function documentMarkdown(genre, fichier, statutDe, famille) {
  let texte;
  try {
    texte = lireTexte(fichier);
  } catch {
    return null;
  }
  const nom = path14.basename(fichier);
  const base = (famille ? identifiantDe(famille, nom) : null) ?? nom.replace(/\.md$/, "");
  const meta = enTeteYaml(texte);
  const titreBrut = titreMarkdown(texte, base);
  const titre = titreBrut.replace(/^[A-Z]{2,6}-[\w-]+\s*[:\-–]\s*/, "").trim() || titreBrut;
  return {
    genre,
    id: base,
    titre,
    fichier,
    statut: statutDe(meta, texte),
    meta,
    references: referencesDe(texte).filter((r) => r !== base)
  };
}
function engagements(ctx) {
  const sortie = [];
  for (const f of fichiersFamille(ctx.engagements, "engagement")) {
    const fichier = path14.join(ctx.engagements, f);
    const id = identifiantDe("engagement", f);
    let doc = {};
    let texte = "";
    try {
      texte = lireTexte(fichier);
      doc = lireYamlSur(texte) ?? {};
    } catch {
    }
    sortie.push({
      genre: "engagement",
      id,
      titre: String(doc.titre ?? id),
      fichier,
      statut: doc.statut ? String(doc.statut) : null,
      meta: doc,
      references: referencesDe(texte).filter((r) => r !== id)
    });
  }
  return sortie;
}
function rapports(ctx) {
  const sortie = [];
  if (!fs16.existsSync(ctx.livraisons)) return sortie;
  let dossiers;
  try {
    dossiers = fs16.readdirSync(ctx.livraisons).filter((d) => /^ENG-\d{4}$/.test(d)).sort();
  } catch {
    return sortie;
  }
  for (const eng of dossiers) {
    for (const nom of ["REPORT.md", "BLOCKED.md", "REPORT.report.md", "BLOCKED.report.md"]) {
      const fichier = path14.join(ctx.livraisons, eng, nom);
      if (!fs16.existsSync(fichier)) continue;
      let texte = "";
      try {
        texte = lireTexte(fichier);
      } catch {
        continue;
      }
      sortie.push({
        genre: "rapport",
        id: `${eng}/${nom}`,
        titre: titreMarkdown(texte, `${eng} \xB7 ${nom}`),
        fichier,
        statut: nom.startsWith("BLOCKED") ? "bloque" : "livre",
        meta: { eng },
        references: referencesDe(texte)
      });
    }
  }
  return sortie;
}
function exigences2(ctx) {
  const sortie = [];
  for (const f of fichiersDe2(ctx.recette, /\.md$/)) {
    const fichier = path14.join(ctx.recette, f);
    let texte = "";
    try {
      texte = lireTexte(fichier);
    } catch {
      continue;
    }
    const specs = [...new Set([...texte.matchAll(RE_SPEC2)].map((m) => m[0]))];
    sortie.push({
      genre: "exigence",
      id: identifiantDe("exigence", f) ?? f.replace(/\.md$/, ""),
      titre: titreMarkdown(texte, f),
      fichier,
      statut: null,
      meta: { specs: specs.length },
      references: specs.sort()
    });
  }
  return sortie;
}
function gouvernance(ctx) {
  const candidats = [
    [ctx.constitution, "Constitution"],
    [ctx.milestones, "Jalons ma\xEEtres"],
    [ctx.dashboard, "Tableau de bord"]
  ];
  const sortie = [];
  for (const [fichier, libelle] of candidats) {
    if (!fs16.existsSync(fichier)) continue;
    let texte = "";
    try {
      texte = lireTexte(fichier);
    } catch {
      continue;
    }
    sortie.push({
      genre: fichier === ctx.milestones ? "jalon" : "gouvernance",
      id: path14.basename(fichier),
      titre: titreMarkdown(texte, libelle),
      fichier,
      statut: null,
      meta: {},
      references: referencesDe(texte)
    });
  }
  return sortie;
}
function listerDocuments(ctx, genre) {
  const familles = {
    engagement: () => engagements(ctx),
    scp: () => fichiersFamille(ctx.deltas, "scp").map((f) => documentMarkdown("scp", path14.join(ctx.deltas, f), (m) => m.statut ? String(m.statut) : null, "scp")).filter((d) => d !== null),
    adr: () => fichiersFamille(ctx.decisions, "adr").map(
      (f) => documentMarkdown(
        "adr",
        path14.join(ctx.decisions, f),
        (_m, texte) => champsEnPuces(texte)["d\xE9cision"] ? "actee" : null,
        "adr"
      )
    ).filter((d) => d !== null),
    da: () => fichiersFamille(ctx.arbitrages, "da").map((f) => documentMarkdown("da", path14.join(ctx.arbitrages, f), (m) => m.statut ? String(m.statut) : null, "da")).filter((d) => d !== null),
    rapport: () => rapports(ctx),
    exigence: () => exigences2(ctx),
    jalon: () => gouvernance(ctx).filter((d) => d.genre === "jalon"),
    gouvernance: () => gouvernance(ctx).filter((d) => d.genre === "gouvernance")
  };
  if (genre) return familles[genre]();
  return GENRES.flatMap((g) => familles[g]());
}
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
function lireDocument(ctx, id, genre) {
  const catalogue = listerDocuments(ctx, genre);
  const doc = catalogue.find((d) => d.id === id) ?? (genre ? null : listerDocuments(ctx).find((d) => d.id === id));
  if (!doc) return null;
  let corps = "";
  try {
    corps = lireTexte(doc.fichier);
  } catch {
    corps = "";
  }
  const tous = genre ? listerDocuments(ctx) : catalogue;
  const liens = [];
  const vus = /* @__PURE__ */ new Set();
  for (const ref of doc.references) {
    const cible = tous.find((d) => d.id === ref);
    if (cible && !vus.has(`cite:${cible.id}`)) {
      liens.push({ genre: cible.genre, id: cible.id, sens: "cite" });
      vus.add(`cite:${cible.id}`);
    }
  }
  for (const autre of tous) {
    if (autre.id === doc.id) continue;
    if (autre.references.includes(doc.id) && !vus.has(`cite_par:${autre.id}`)) {
      liens.push({ genre: autre.genre, id: autre.id, sens: "cite_par" });
      vus.add(`cite_par:${autre.id}`);
    }
  }
  return { ...doc, corps, sections: sectionsDe(corps), liens };
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
  const contexte2 = sections.find((s) => estContexte(s.titre))?.contenu.trim() ?? "";
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
  return { contexte: contexte2, faits, enjeu, questions, recommandation, annexes, prise };
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
function ruleBlock() {
  return [
    "",
    "OPEN POINTS, each one sorted before you end:",
    ...CLOSING_LINES.map((r) => `  - ${r}`),
    "",
    "DOCUMENTATION, updated as the work goes and reported last:",
    `  - ${DOCUMENTATION_RULE}`
  ];
}
var REPORT_RULES = `REPORT.md opens with a section \`## ${SECTION_RESULT}\` whose first line is \`PASS\` or \`FAIL\` against the definition of done, followed by one line per criterion: met or not met, and the test that proves it. ` + CLOSING_RULES + " Your closing message to the operator follows the same order: the result first, then what needs a human, then what is for information only. " + DOCUMENTATION_RULE;
var PLACEHOLDER = /\((?:à|a|to)\s+(?:compl[ée]ter|complete|be completed)[^)]*\)|\bTBD\b/gi;
function written(texte) {
  return texte.replace(PLACEHOLDER, "").trim();
}
function section(texte, titre) {
  const s = sectionsDe(texte).find((x) => titre.test(x.titre));
  return s ? s.contenu : null;
}
function points(contenu) {
  if (!contenu) return [];
  return contenu.split("\n").map((l) => l.match(/^\s*(?:[-*]|\d+[.)])\s+(.*\S)\s*$/)?.[1] ?? "").filter((l) => l && !/^(none|nothing|aucun)\b/i.test(l));
}
function closingOf(rapport) {
  const corps = section(rapport, /^(result|r[ée]sultat)\b/i);
  const lignes = (corps ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const tete = (lignes[0] ?? "").replace(/[*_`]/g, "").trim();
  const m = tete.match(/^(PASS|FAIL)\b/);
  return {
    result: m ? m[1] : null,
    summary: lignes.slice(m ? 1 : 0, 9).map((l) => l.length > 200 ? l.slice(0, 197).trim() + " (cut)" : l),
    filed: points(section(rapport, /need(s)? someone else|needs? a (decision|human)/i)),
    information: points(section(rapport, /^for information\b/i))
  };
}
function commitmentSummary(ctx, eng) {
  try {
    const d = lireYamlSur(lireTexte(cheminEngagement(ctx, eng))) ?? {};
    const done = String(d.definition_of_done ?? "").replace(/\s+/g, " ").trim();
    return {
      titre: String(d.titre ?? ""),
      exigences: Array.isArray(d.exigences) ? d.exigences.map(String) : [],
      done: done.length > 320 ? done.slice(0, 317).trim() + " (cut, see lean show " + eng + ")" : done
    };
  } catch {
    return { titre: "", exigences: [], done: "" };
  }
}
function header(mot, eng, verdict, resume) {
  const l = [`==== ${mot} ${eng}: ${verdict} ====`];
  if (resume.titre) l.push(`  Commitment   : ${resume.titre}`);
  if (resume.exigences.length) l.push(`  Requirements : ${resume.exigences.join(", ")}`);
  if (resume.done) l.push(`  Done when    : ${resume.done}`);
  return l;
}
function verdictMessage(ctx, eng, entree) {
  const resume = commitmentSummary(ctx, eng);
  const rapport = path15.join(ctx.livraisons, eng, "REPORT.md");
  const closing = closingOf(fs17.existsSync(rapport) ? lireTexte(rapport) : "");
  const refusee = entree.integration && !entree.integration.ok;
  const mot = entree.verdict === "approve" ? refusee ? "PASS, NOT INTEGRATED" : "PASS" : entree.verdict === "reject" ? "FAIL" : "HELD FOR ARBITRATION";
  const l = header("VERDICT", eng, `${mot} (${entree.verdict})`, resume);
  if (entree.faits) l.push(`  Integration  : ${entree.faits}`);
  if (closing.summary.length) {
    l.push("  As reported  :");
    for (const s of closing.summary) l.push(`    ${s}`);
  }
  const gestes = [];
  if (refusee) {
    gestes.push(
      `INTEGRATION REFUSED [${String(entree.integration.code)}] : ${String(entree.integration.erreur)}. The verdict stands. Once the cause is removed: lean integrer ${eng}`
    );
  }
  const pushRefuse = entree.integration && entree.integration.ok && entree.integration.push_erreur;
  if (pushRefuse) {
    gestes.push(
      `PUSH REFUSED : ${String(pushRefuse)}. The integration stands. Once the cause is removed: lean integrer ${eng}, which repeats the push and nothing else.`
    );
  }
  if (entree.verdict === "reject" && entree.mineur) {
    gestes.push(
      "Minor rework: the points are written in the worktree, in .eng/REWORK.md, each with a mark. The implementing session answers each mark in REPORT.md under `## Rework` and delivers again in the same worktree; this counts as no rejection of substance, and no commitment is opened for these points."
    );
  } else if (entree.verdict === "reject") {
    gestes.push(
      entree.rejets >= 2 ? `Second consecutive rejection of ${eng}. The next delivery is refused until an arbitration request on the continuation is decided: tell the implementing session to write BLOCKED.md as that request (the options, with what each costs: a third delivery under this commitment, the commitment broken and a successor opened from its branch, the delivery integrated as it is with the points carried; the option you recommend), to deliver it (eng push --livraison files it) and to wait on it (eng attendre). No status is changed automatically.` : "The violations are written in the worktree, in .eng/REWORK.md, each with a mark (V1, V2 and so on). The implementing session answers each mark in REPORT.md under `## Rework`, reworks in the same worktree, and delivers again; the lease survives."
    );
  }
  if (entree.verdict === "arbitrage") {
    gestes.push(
      "File the arbitration request now: lean numero DA, then the closed question, at least two enumerated options with their consequences, the option you recommend and why, and the fallback. A request with no option or no recommendation is refused when it is written. The branch stays frozen on the decision."
    );
  }
  if (entree.verdict === "approve") {
    gestes.push(
      closing.filed.length ? `The report hands ${closing.filed.length} open point(s) to someone else. File each one now under a reserved number (lean numero DA|ENG|SCP), a DA with its options and your recommendation: ` + closing.filed.map((p) => p.length > 90 ? p.slice(0, 87).trim() + " (cut)" : p).join(" | ") : `Read the report (lean rapport ${eng}) for open points left as prose, and sort each one as stated below.`
    );
    gestes.push(
      "A point that lies inside the scope just verified is never a new commitment: it is a rework, asked by `lean verdict --sens reject --mineur --constats` before the approval, in the same worktree and under a warm build. A new commitment is opened only for work outside this scope, or on another requirement."
    );
  }
  l.push("", "ACTION REQUIRED FROM YOU:");
  gestes.forEach((g, i) => l.push(`  ${i + 1}. ${g}`));
  l.push(...ruleBlock());
  l.push("", "FOR INFORMATION, NO ACTION REQUIRED:");
  if (entree.verdict === "approve" && !refusee) {
    l.push(
      pushRefuse ? "  The merge, the held status and the removal of the worktree are done. The push is still due." : "  The operator has nothing to trigger: the merge, the held status, the push and the removal of the worktree are done."
    );
    const etrangers = Number(entree.integration?.etrangers ?? 0);
    if (etrangers) {
      l.push(
        `  ${etrangers} file(s) that no commit held were in the worktree: listed in the delivery record (ETRANGERS.md) and copied under the runs, build outputs aside.`
      );
    }
  }
  if (entree.verdict === "reject") l.push(`  Consecutive rejections of ${eng}: ${entree.rejets}.`);
  if (entree.testsLongs?.length) {
    l.push(
      `  LONG TESTS ${entree.testsLongs.join("; ")}: a verification runs the tests of the crates touched, in parallel, within its budget; a load, a soak or a chaos sequence belongs to a dedicated trial commitment at the end of the milestone.`
    );
  }
  for (const p of closing.information) l.push(`  REPORTED   ${p}`);
  if (l[l.length - 1].endsWith(":")) l.push("  Nothing.");
  return l.join("\n");
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
  const contexte2 = written(structure.contexte);
  if (contexte2.length < CONTEXT_MINIMUM) {
    manques.push(
      `the context holds ${contexte2.length} character(s) where at least ${CONTEXT_MINIMUM} are needed: a section \`## Context\` states, for a reader who has none of the history, what the product does today, what happened, and why that is a problem`
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
  if (!fs17.existsSync(ctx.arbitrages)) return [];
  const sortie = [];
  for (const nom of fs17.readdirSync(ctx.arbitrages).sort()) {
    const brouillon = /^BROUILLON-DA-.*\.md$/.test(nom);
    if (!brouillon && !/^DA-\d{4}.*\.md$/.test(nom)) continue;
    const fichier = path15.join(ctx.arbitrages, nom);
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
var BLOCKER_SECTIONS = "## Context\n\n(to complete: what the product does today, what happened and why it is a problem, for a reader with none of the history; 300 characters at least)\n\n## What is at stake\n\n(to complete: what waits for the decision, and what happens if it is not taken)\n\n## Closed question\n\n(to complete: one question, with its question mark, that is answered by naming an option)\n\n## Options and consequences\n\n**A. (title).** (to complete: what it changes and what it costs)\n\n**B. (title).** (to complete: what it changes and what it costs)\n\n## Recommendation\n\n(to complete: open with the option advised, as `**A.**`, then the reason: what you checked, what each option costs, what remains unknown)\n\n## Fallback\n\n(to complete: the option that applies if nobody answers, as `A`, or the person the request escalates to)\n";
var BLOCKER_RULE = "Before you deliver, investigate the question and complete BLOCKED.md: it is the text of the arbitration request that the delivery files under a reserved number, and its decider reads nothing else. It holds `## Context`, `## What is at stake`, `## Closed question`, `## Options and consequences` (paragraphs opened by `**A. Title.**`, or a table with one column per option), `## Recommendation` (opened by the option you advise, in bold) and `## Fallback` (the option that applies if nobody answers, or who it escalates to). You recommend, the decider decides. After the delivery, run `eng attendre` in the background: it ends when the request is decided, and you resume from what it prints.";
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
  if (!fs18.existsSync(ctx.arbitrages)) return [];
  const sortie = [];
  for (const nom of fs18.readdirSync(ctx.arbitrages).sort().reverse()) {
    if (!/^DA-\d{4}.*\.md$/.test(nom)) continue;
    const fichier = path16.join(ctx.arbitrages, nom);
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
function pendingRequestOf(ctx, eng) {
  return requestsOf(ctx, eng).find((r) => r.statut === "ouverte" || r.statut === "renvoyee") ?? null;
}
function bodyOf(rapport) {
  const i = rapport.search(/^## /m);
  return i < 0 ? "" : rapport.slice(i).trim();
}
function sectionOf(rapport, titre) {
  const lignes = rapport.split("\n");
  let dedans = false;
  const corps = [];
  for (const l of lignes) {
    const t = l.match(/^##\s+(.*)$/);
    if (t) {
      if (dedans) break;
      dedans = titre.test(t[1].trim());
      continue;
    }
    if (dedans) corps.push(l);
  }
  return corps.join("\n").trim();
}
var written2 = (t) => t.replace(/\(to complete[^)]*\)/gi, "").trim();
function requestFromReport(ctx, eng, da, rapport, decideur) {
  const question = written2(sectionOf(rapport, /^closed\s+question/i)).replace(/\s+/g, " ");
  const premiere = question.match(/^[^?]*\?/)?.[0] ?? question;
  const titre = (premiere || `a decision that ${eng} waits on`).slice(0, 220);
  const repli = written2(sectionOf(rapport, /^fallback/i)).replace(/\s+/g, " ");
  const cle = repli.match(/^\**\s*(?:Option\s+)?([A-H])\b(?![a-z])/);
  const tete = [
    "```yaml",
    "statut: ouverte",
    `decideur: ${JSON.stringify(decideur || principalIdentity(ctx.racine).nom)}`,
    `demandeur: ${JSON.stringify(`session of ${eng}`)}`,
    cle ? `defaut_si_silence: ${JSON.stringify(cle[1])}` : `escalade: ${JSON.stringify(repli)}`,
    `engagement: ${eng}`,
    `ouverte_le: '${isoSecondes()}'`,
    "```"
  ].join("\n");
  return `# ${da}: ${titre}

${tete}

${bodyOf(rapport)}
`;
}
function blockerGaps(ctx, eng, rapport) {
  return requestGaps(requestFromReport(ctx, eng, "DA-0000", rapport));
}
function fileBlockerRequest(ctx, engBrut, rapport, par = "session") {
  const eng = engBrut.trim().toUpperCase();
  const manques = blockerGaps(ctx, eng, rapport);
  if (manques.length) {
    return {
      ok: false,
      code: "question_non_instruite",
      erreur: `BLOCKED.md cannot be filed as an arbitration request: ${manques.join("; ")}`,
      manques
    };
  }
  const enCours = pendingRequestOf(ctx, eng);
  if (enCours?.statut === "renvoyee") {
    return {
      ok: true,
      da: enCours.da,
      fichier: enCours.fichier,
      rewritten: false,
      suite: `${enCours.da} was returned for study by its decider: rewrite it from your report (lean show ${enCours.da}), then lean republier ${enCours.da}`
    };
  }
  let da;
  let fichier;
  if (enCours) {
    ({ da, fichier } = enCours);
  } else {
    da = reserverNumero(ctx, "DA", par);
    fichier = path16.join(ctx.arbitrages, `${da}.md`);
  }
  fs18.mkdirSync(ctx.arbitrages, { recursive: true });
  ecrireTexte(fichier, requestFromReport(ctx, eng, da, rapport, enCours?.decideur));
  fs18.rmSync(path16.join(ctx.arbitrages, `BROUILLON-DA-${eng.toLowerCase()}.md`), { force: true });
  const rec = chargerRecord(ctx, eng);
  if (rec) {
    rec.da = da;
    sauverRecord(ctx, rec);
  }
  return { ok: true, da, fichier, rewritten: Boolean(enCours) };
}
function requestState(ctx, daBrut) {
  const da = daBrut.trim().toUpperCase();
  if (!fs18.existsSync(ctx.arbitrages)) return null;
  const nom = fs18.readdirSync(ctx.arbitrages).find((n) => n.startsWith(da) && /^DA-\d{4}(\.|-)/.test(n) && n.endsWith(".md"));
  if (!nom) return null;
  const texte = lireTexte(path16.join(ctx.arbitrages, nom));
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
    const trouve = fs18.readdirSync(ctx.decisions).find((n) => /^ADR-\d{4}/.test(n) && n.toLowerCase().includes(bas));
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
function decisionText(s) {
  const lignes = [
    `# Decision of ${s.da}`,
    "",
    s.titre,
    "",
    `- Choice: ${s.choix ?? "(none recorded)"}`,
    `- Reason: ${s.motif || "(none given)"}`,
    `- Decided by: ${s.decideur ?? "the decider"}${s.date ? `, on ${s.date}` : ""}`,
    ...s.adr ? [`- Decision record: ${s.adr}`] : [],
    "",
    "## What follows",
    "",
    `Read the request and its decision in full: lean show ${s.da}. Then carry the decision out inside your scope: remove BLOCKED.md from the root of the worktree, resume the work, and deliver with REPORT.md. A decision that changes a requirement goes through a specification change (/delta), and one that changes your scope through the coordinator: neither is carried out by editing the record yourself. A doubt that remains comes back as a new blocker, never as a guess.`,
    ""
  ];
  return lignes.join("\n");
}
function carryDecision(ctx, da) {
  const s = requestState(ctx, da);
  if (!s || !s.engagement || !s.choix) return null;
  const rec = chargerRecord(ctx, s.engagement);
  const wt = rec?.worktree ? String(rec.worktree) : "";
  if (!wt || !fs18.existsSync(path16.join(wt, ".eng"))) return null;
  const cible = path16.join(wt, ".eng", "DECISION.md");
  ecrireTexte(cible, decisionText(s));
  toucher(ctx, s.engagement, `${s.da} decided on ${dateLocale()}: ${s.choix.slice(0, 80)}`);
  return cible;
}
function blocksOnPrecedence(text) {
  return /^## Nature\s*\n+\s*precedence\b/m.test(text);
}

// noyau/src/das.ts
var crypto4 = __toESM(require("node:crypto"), 1);
function chargerDas(ctx) {
  const das = [];
  if (!fs19.existsSync(ctx.arbitrages)) return das;
  const fichiers = fs19.readdirSync(ctx.arbitrages).filter((f) => /^DA-.*\.md$/.test(f)).sort();
  for (const f of fichiers) {
    const texte = lireTexte(path17.join(ctx.arbitrages, f));
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
function detailsDa(ctx, daId) {
  const f = path17.join(ctx.arbitrages, `${daId}.md`);
  if (!fs19.existsSync(f)) return {};
  const texte = lireTexte(f);
  const section2 = (titre) => {
    const echappe = titre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = texte.match(new RegExp(`^## ${echappe}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    return m ? m[1].trim() : "";
  };
  return { question: section2("Question ferm\xE9e"), recommandation: section2("Recommandation du demandeur") };
}
function prochainAdr(ctx) {
  return reserverNumero(ctx, "ADR", "das");
}
function deciderDa(ctx, daId, choix, motif, parDefaut = false) {
  const f = path17.join(ctx.arbitrages, `${daId}.md`);
  if (!fs19.existsSync(f)) return { ok: false, erreur: `${daId} introuvable` };
  if (!choix.trim()) return { ok: false, erreur: "choix obligatoire" };
  motif = motif.trim();
  let texte = lireTexte(f);
  if (!texte.includes("statut: ouverte")) return { ok: false, erreur: `${daId} n'est pas au statut ouverte` };
  const aujourdHui = dateLocale();
  const blocs = [...texte.matchAll(/```yaml\n([\s\S]*?)```/g)];
  const rempli = `\`\`\`yaml
choix: ${JSON.stringify(choix)}
motif: ${JSON.stringify(motif)}
date: ${aujourdHui}
\`\`\``;
  const dernier = blocs[blocs.length - 1];
  const estEnTete = (bloc) => /^(?:statut|decideur|demandeur):/m.test(bloc[1]);
  if (dernier && !estEnTete(dernier)) {
    texte = texte.slice(0, dernier.index) + rempli + texte.slice(dernier.index + dernier[0].length);
  } else {
    const titre2 = texte.match(/^## D[ée]cision\b[^\n]*\n/m);
    if (titre2) {
      const apres = titre2.index + titre2[0].length;
      texte = texte.slice(0, apres) + "\n" + rempli + "\n" + texte.slice(apres).replace(/^\n+/, "\n");
    } else {
      texte = texte.trimEnd() + "\n\n## Decision (filled by the decider only)\n\n" + rempli + "\n";
    }
  }
  texte = texte.replace("statut: ouverte", "statut: decidee");
  ecrireTexte(f, texte);
  differerReservations(true);
  const adrId = prochainAdr(ctx);
  const titre = (texte.split("\n")[0] ?? "").replace(/^[#\s]+/, "").trim();
  const suffixe = parDefaut ? " (appliqu\xE9 par d\xE9faut, \xE9ch\xE9ance de r\xE9ponse atteinte)" : "";
  const adrF = path17.join(ctx.decisions, `${adrId}-${daId.toLowerCase()}.md`);
  ecrireTexte(
    adrF,
    `# ${adrId} : d\xE9cision de ${daId}

- Contexte : ${titre}
- D\xE9cision : ${choix}${suffixe}
` + (motif ? `- Motif : ${motif}
` : "") + `- Date : ${aujourdHui}
- R\xE9versibilit\xE9 : par SCP r\xE9f\xE9ren\xE7ant le pr\xE9sent ADR (garde-fou anti-oscillation).
`
  );
  let solde = null;
  const ecrits = [f, adrF];
  const mRep = texte.match(/^engagement_reponse:\s*(ENG-\d{4})/m);
  if (mRep) {
    const engF = path17.join(ctx.engagements, `${mRep[1]}.yaml`);
    if (fs19.existsSync(engF)) {
      const engTexte = lireTexte(engF);
      const remplace = engTexte.replace(/^statut: (pris|propose)\s*$/m, "statut: tenu");
      if (remplace !== engTexte) {
        ecrireTexte(engF, remplace);
        solde = mRep[1];
        ecrits.push(engF);
      }
    }
  }
  const commit = commiterRecords(ctx, ecrits, `chore(steering): ${daId} is decided, option ${choix}, recorded as ${adrId}`);
  let publication;
  try {
    publication = publishTransaction(ctx, ecrits, `chore(steering): ${daId} is decided, option ${choix}, recorded as ${adrId}`, daId);
  } finally {
    differerReservations(false);
  }
  let portee = null;
  try {
    portee = carryDecision(ctx, daId);
  } catch {
  }
  return {
    ok: true,
    adr: adrId,
    engagement_solde: solde,
    commit: commit.sha,
    commit_raison: commit.raison,
    publication,
    decision_portee: portee
  };
}
var TITRE_RENVOI = /^## (?:Returned for study|Renvoi) \((\d{4}-\d{2}-\d{2})\)\s*$/gm;
function corpsAvantRenvoi(texte) {
  const renvois = [...texte.matchAll(TITRE_RENVOI)];
  const fin = renvois.length ? renvois[renvois.length - 1].index : texte.length;
  return texte.slice(0, fin).replace(/^statut:.*$/m, "").trim();
}
var empreinte = (texte) => crypto4.createHash("sha256").update(texte, "utf-8").digest("hex").slice(0, 16);
function renvoiDe(texte) {
  const renvois = [...texte.matchAll(TITRE_RENVOI)];
  if (!renvois.length) return null;
  const dernier = renvois[renvois.length - 1];
  const suite = texte.slice(dernier.index + dernier[0].length);
  const m = suite.match(/^(?:The decider cannot decide on this request as written|Préparation jugée insuffisante par le décideur)\s*:\s*([\s\S]*?)(?:\n\n|\nLe demandeur|$)/m);
  return { date: dernier[1], motif: (m ? m[1] : suite.split("\n\n")[0] ?? "").trim() };
}
function renvoiDeDa(ctx, daId) {
  const f = path17.join(ctx.arbitrages, `${daId}.md`);
  return fs19.existsSync(f) ? renvoiDe(lireTexte(f)) : null;
}
function renvoyerDa(ctx, daId, motif) {
  const f = path17.join(ctx.arbitrages, `${daId}.md`);
  if (!fs19.existsSync(f)) return { ok: false, erreur: `${daId} introuvable` };
  if (!motif.trim()) return { ok: false, erreur: "motif obligatoire" };
  let texte = lireTexte(f);
  if (!texte.includes("statut: ouverte")) return { ok: false, erreur: `${daId} n'est pas au statut ouverte` };
  const fige = empreinte(corpsAvantRenvoi(texte));
  texte = texte.replace("statut: ouverte", "statut: renvoyee");
  texte = texte.trimEnd() + `

## Returned for study (${dateLocale()})

The decider cannot decide on this request as written: ${motif.trim()}

The requester investigates the problem again and rewrites the request above for a reader who has none of the context: what happens today and why it is a problem, what is at stake, and at least two options with what each one changes and costs, then the option recommended. \`lean republier ${daId}\` puts the request back to its decider once it passes the gate. The return counts as a variance of preparation on the side of the requester.

Fingerprint of the request as returned: \`${fige}\`
`;
  ecrireTexte(f, texte);
  const publication = publishTransaction(ctx, [f], `chore(steering): ${daId} returned for study`, daId);
  return { ok: true, da: daId, statut: "renvoyee", publication };
}
function republierDa(ctx, daId) {
  const f = path17.join(ctx.arbitrages, `${daId}.md`);
  if (!fs19.existsSync(f)) return { ok: false, code: "da_inconnue", erreur: `${daId} not found` };
  const texte = lireTexte(f);
  if (!/^statut:\s*renvoyee\s*$/m.test(texte)) {
    return { ok: false, code: "da_non_renvoyee", erreur: `${daId} is not returned for study: only a returned request is republished` };
  }
  const fige = texte.match(/^Fingerprint of the request as returned: `([0-9a-f]{16})`\s*$/m);
  if (fige && fige[1] === empreinte(corpsAvantRenvoi(texte))) {
    return {
      ok: false,
      code: "da_inchangee",
      erreur: `${daId} reads as it did when it was returned: investigate again and rewrite the request before republishing it`
    };
  }
  const ouverte = texte.replace(/^statut:\s*renvoyee\s*$/m, "statut: ouverte");
  const manques = requestGaps(ouverte);
  if (manques.length) {
    return {
      ok: false,
      code: "da_incomplete",
      erreur: `${daId} does not pass the gate of an open request: ${manques.join(" | ")}`,
      manques
    };
  }
  ecrireTexte(f, ouverte.trimEnd() + `

Republished on ${dateLocale()} after study.
`);
  const publication = publishTransaction(ctx, [f], `chore(steering): ${daId} republished after study`, daId);
  return { ok: true, da: daId, statut: "ouverte", publication };
}

// noyau/src/coherence.ts
var fs20 = __toESM(require("node:fs"), 1);
var path18 = __toESM(require("node:path"), 1);
var MATRICES = ["90_TRACEABILITY_MATRIX.md", "90_MATRICE_TRACABILITE.md"];
function streamDe(index, id) {
  if (!index) return void 0;
  const e = index.get(id);
  return e ? e.streams.join("+") || "(no stream)" : "(no stream)";
}
function matricesPerimees(ctx) {
  const out = [];
  for (const source of requirementSources(ctx)) {
    const matrice = MATRICES.map((m) => path18.join(source.folder, m)).find((m) => fs20.existsSync(m));
    if (!matrice) continue;
    const fichiers = [.../* @__PURE__ */ new Set([...source.domains.values(), ...source.files])].filter((f) => f !== matrice && fs20.existsSync(f));
    const max = Math.max(0, ...fichiers.map((f) => fs20.statSync(f).mtimeMs));
    if (max > 0 && fs20.statSync(matrice).mtimeMs < max) out.push(...source.streams);
  }
  return out;
}
function dossiersLivraisons(ctx) {
  if (!fs20.existsSync(ctx.livraisons)) return [];
  return fs20.readdirSync(ctx.livraisons).filter((d) => /^ENG-/.test(d)).sort();
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
    const impact2 = corps.match(/^impact\s*:\s*([\s\S]*?)$/m);
    if (impact2 && !/^sans_impact\s*:/m.test(corps)) {
      sortie.push({ exigence: m[1], impact: impact2[1].trim() });
    }
  }
  return sortie;
}
function chargerSuiviDoc(ctx) {
  const chemin = path18.join(ctx.etat, "doc_suivi.yaml");
  if (!fs20.existsSync(chemin)) return [];
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
      if (fs20.existsSync(chemin)) max = Math.max(max, fs20.statSync(chemin).mtimeMs);
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
    const specU = path18.join(ctx.livraisons, dossier, "SPEC_UPDATE.md");
    if (!fs20.existsSync(specU)) continue;
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
    const docU = path18.join(ctx.livraisons, dossier, "DOC_UPDATE.md");
    if (!fs20.existsSync(docU)) continue;
    for (const { exigence, impact: impact2 } of impactsDeclares(lireTexte(docU))) {
      if (couvertesParDoc.has(exigence)) continue;
      if (sansSuite.has(`${exigence}|${dossier}`)) continue;
      dette.push(index ? { exigence, eng: dossier, impact: impact2, stream: streamDe(index, exigence) } : { exigence, eng: dossier, impact: impact2 });
    }
  }
  dette.sort((a, b) => a.exigence + a.eng < b.exigence + b.eng ? -1 : 1);
  const maxRecette = mtimeMaxRecette(ctx);
  const matrice = path18.join(ctx.recette, "90_MATRICE_TRACABILITE.md");
  const matricePerimee = maxRecette > 0 && fs20.existsSync(matrice) && fs20.statSync(matrice).mtimeMs < maxRecette;
  let dashboardPerime = false;
  try {
    if (fs20.existsSync(ctx.dashboard) && fs20.existsSync(ctx.engagements)) {
      let maxEng = 0;
      for (const f of fs20.readdirSync(ctx.engagements)) {
        const st = fs20.statSync(path18.join(ctx.engagements, f));
        maxEng = Math.max(maxEng, st.mtimeMs);
      }
      dashboardPerime = fs20.statSync(ctx.dashboard).mtimeMs < maxEng;
    }
  } catch {
  }
  if (index) {
    const parStream = matricesPerimees(ctx);
    return { derives_spec: derives, dette_doc: dette, matrice_perimee: parStream.length > 0, dashboard_perime: dashboardPerime, matrices_perimees: parStream };
  }
  return { derives_spec: derives, dette_doc: dette, matrice_perimee: matricePerimee, dashboard_perime: dashboardPerime };
}
function anomaliesCoherence(c) {
  const lignes = [];
  const duStream = (s) => s === void 0 ? "" : ` [stream ${s}]`;
  for (const d of c.derives_spec) {
    lignes.push(
      `d\xE9rive spec : ${d.exigence} d\xE9clar\xE9 ${d.statut_declare} par ${d.eng} (livraison v\xE9rifi\xE9e) mais ${d.statut_reel} au dossier de recette${duStream(d.stream)}`
    );
  }
  for (const d of c.dette_doc) {
    lignes.push(`dette documentaire : ${d.exigence} (impact d\xE9clar\xE9 par ${d.eng}, non r\xE9sorb\xE9)${duStream(d.stream)}`);
  }
  if (c.matrices_perimees) {
    for (const s of c.matrices_perimees) {
      lignes.push(`stale traceability matrix of stream ${s}: generated before the last change of its requirements folder`);
    }
  } else if (c.matrice_perimee) {
    lignes.push("matrice de tra\xE7abilit\xE9 p\xE9rim\xE9e : r\xE9g\xE9n\xE9r\xE9e avant la derni\xE8re modification du dossier de recette");
  }
  return lignes;
}

// noyau/src/dashboard.ts
function genererDashboard(ctx) {
  ecrireAtomique(ctx.dashboard, rendreDashboard(ctx));
}
function rendreDashboard(ctx, options = {}) {
  const erreurs = [];
  const engs = chargerRegistre(ctx, erreurs);
  const v = valider(ctx, engs);
  erreurs.push(...v.erreurs);
  const avertissements = v.avertissements;
  const aujourdHui = dateLocale();
  const fichiers = (() => {
    try {
      return fichiersDomaines(ctx);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  })();
  const das = chargerDas(ctx);
  const claims = fs21.existsSync(ctx.claims) ? chargerClaims(ctx) : [];
  const declaration = readStreams(ctx);
  const parStream = declaration.declared;
  const labelDe = (eid) => engs.has(eid) ? streamLabel(declaration, engs.get(eid)) : NO_STREAM;
  const voulu = (eid) => !options.stream || labelDe(eid) === options.stream;
  const suffixe = (eid) => parStream ? `  [stream ${labelDe(eid)}]` : "";
  const parGroupe = (items, eid) => {
    if (!parStream) return items;
    const rang = new Map(declaration.streams.map((x, i) => [x.name, i]));
    const r = (x) => rang.get(labelDe(eid(x))) ?? declaration.streams.length;
    return items.map((x, i) => [x, i]).sort((a, b) => r(a[0]) - r(b[0]) || a[1] - b[1]).map(([x]) => x);
  };
  const L = [];
  L.push("# Tableau de pilotage (g\xE9n\xE9r\xE9)\n");
  if (options.stream) L.push(`Stream shown: ${options.stream}. The other streams are left out of the network and of the inbox.
`);
  L.push(
    `G\xE9n\xE9r\xE9 le ${aujourdHui} par le coordinateur agentique. Ne pas \xE9diter : toute correction se fait \xE0 la source.
`
  );
  L.push("\n## 1. Jalons et fiabilit\xE9\n");
  const jalons = chargerJalons(ctx);
  const chaines = cheminsCritiques(ctx, engs);
  L.push("| Jalon | Exigences vertes | Engagements li\xE9s (tenus/total) | Chemin critique restant |");
  L.push("|---|---|---|---|");
  for (const [jid, specs] of jalons) {
    if (options.stream) {
      const siens = [...engs.entries()].filter(
        ([, e]) => String(e.beneficiaire) === `jalon:${jid}` || exigences(e).some((s) => specs.includes(s))
      );
      if (!siens.some(([eid]) => voulu(eid))) continue;
    }
    const vertes = specs.filter((s) => estImplemente(statutSpec(s, fichiers))).length;
    const lies = [...engs.entries()].filter(([, e]) => e.statut !== "abandonne" && e.statut !== "remplace").filter(([, e]) => String(e.beneficiaire) === `jalon:${jid}` || exigences(e).some((s) => specs.includes(s))).map(([eid]) => eid);
    const tenus = lies.filter((eid) => engs.get(eid).statut === "tenu").length;
    const chaine2 = (chaines[jid] ?? []).join(" -> ") || "(aucun)";
    L.push(`| ${jid} | ${vertes}/${specs.length} | ${tenus}/${lies.length} | ${chaine2} |`);
  }
  const retenusPpc = [...engs.entries()].filter(([eid]) => voulu(eid)).map(([, e]) => e);
  const clos = retenusPpc.filter((e) => e.statut === "tenu" || e.statut === "rompu");
  const tenusTotaux = clos.filter((e) => e.statut === "tenu").length;
  const abandonnes = retenusPpc.filter((e) => e.statut === "abandonne").length;
  const remplaces = retenusPpc.filter((e) => e.statut === "remplace").length;
  const ppc = clos.length ? `${Math.floor(100 * tenusTotaux / clos.length)} % (${tenusTotaux}/${clos.length})` : "sans objet (aucun engagement sold\xE9)";
  L.push(`
PPC (promesses tenues) : ${ppc}`);
  L.push(`Hors PPC : ${abandonnes} abandonn\xE9(s), ${remplaces} remplac\xE9(s)`);
  if (parStream) {
    const ind = indicatorsByStream(declaration, engs);
    L.push("\n### Per stream\n");
    L.push(`| Stream | ${STATUSES.join(" | ")} | PPC |`);
    L.push(`|---|${STATUSES.map(() => "---").join("|")}|---|`);
    const ligne = (nom, x) => `| ${nom} | ${STATUSES.map((st) => x.counts[st]).join(" | ")} | ${x.ppc === null ? "n/a" : `${x.ppc} % (${x.held}/${x.held + x.broken})`} |`;
    for (const x of ind.streams) if (!options.stream || x.stream === options.stream) L.push(ligne(x.stream, x));
    L.push(ligne("(whole)", ind.whole));
  }
  const variances = /* @__PURE__ */ new Map();
  for (const e of clos) {
    if (e.statut === "rompu") {
      const raison = String((e.variance ?? {}).raison ?? "non renseign\xE9e");
      variances.set(raison, (variances.get(raison) ?? 0) + 1);
    }
  }
  if (variances.size) {
    L.push(
      "Pareto des variances : " + [...variances.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} (${n})`).join(", ")
    );
  }
  L.push("\n## 2. R\xE9seau d'engagements\n");
  const occupes = domainesOccupes(ctx);
  const front = parGroupe(frontiere(engs, occupes).filter(([eid]) => voulu(eid)), ([eid]) => eid);
  L.push("### Fronti\xE8re (pr\xEAt \xE0 tirer, tri\xE9 par poids de d\xE9blocage)\n");
  if (front.length) {
    for (const [eid, w] of front) L.push(`- ${eid} (d\xE9bloque ${w}) : ${engs.get(eid).titre}${suffixe(eid)}`);
  } else {
    L.push("- (vide)");
  }
  const retenus = parGroupe(retenusParClaims(engs, occupes).filter((r) => voulu(r.eng)), (r) => r.eng);
  if (retenus.length) {
    L.push("\n### Held back by a domain claim (not offered until the holder delivers or is released)\n");
    for (const r of retenus) {
      const qui = r.claims.map((c) => `domain ${c.domaine} claimed by ${c.eng} (lease of ${c.owner})`).join("; ");
      L.push(`- ${r.eng} : ${engs.get(r.eng).titre} (${qui})${suffixe(r.eng)}`);
    }
  }
  const pris = parGroupe([...engs.entries()].filter(([eid, e]) => e.statut === "pris" && voulu(eid)).sort(), ([eid]) => eid);
  L.push("\n### En vol\n");
  if (pris.length) {
    for (const [eid, e] of pris) {
      L.push(`- ${eid} : ${e.titre} ; promettant ${e.promettant}${e.reserve_par ? `, r\xE9serv\xE9 par ${e.reserve_par}` : ""}, pris le ${e.pris_le ?? "?"}${suffixe(eid)}`);
    }
  } else {
    L.push("- (aucun)");
  }
  const enAttente2 = parGroupe(
    [...engs.keys()].filter(voulu).map((eid) => [eid, etatCalcule(engs, eid, occupes)]).filter(([, st]) => st === "en_attente" || st === "gele").sort(),
    ([eid]) => eid
  );
  L.push("\n### En attente ou gel\xE9s\n");
  if (enAttente2.length) {
    for (const [eid, st] of enAttente2) {
      const deps = dependsOn(engs.get(eid)).map((d) => String(d.eng ?? "?")).join(", ");
      L.push(`- ${eid} [${st}] : ${engs.get(eid).titre} (attend : ${deps || "readiness"})${suffixe(eid)}`);
    }
  } else {
    L.push("- (aucun)");
  }
  L.push("\n## 3. Arbitrages et d\xE9cisions (votre inbox)\n");
  const engDe = (d) => {
    const e = String(d.engagement ?? d.engagement_reponse ?? "").toUpperCase();
    return /^ENG-\d{4}$/.test(e) ? e : null;
  };
  const ouvertes = das.filter((d) => d.statut === "ouverte").filter((d) => !options.stream || engDe(d) !== null && voulu(engDe(d)));
  if (ouvertes.length) {
    for (const d of ouvertes) {
      L.push(
        `- ${d.id} : ${d.titre} ; d\xE9cideur ${d.decideur}, r\xE9ponse avant ${d.echeance_reponse}, d\xE9faut si silence : ${d.defaut_si_silence ?? d.escalade}`
      );
    }
  } else {
    L.push("- (aucune demande ouverte)");
  }
  L.push("\n## 4. Anomalies\n");
  const anomalies = [];
  anomalies.push(...erreurs.map((e) => `registre : ${e}`));
  anomalies.push(...avertissements.map((w) => `registre : ${w}`));
  for (const c of claims) {
    if (!c || typeof c !== "object" || !c.domaine) {
      anomalies.push(`claim illisible : ${JSON.stringify(c)}`);
      continue;
    }
    if (etatLease(ctx, String(c.eng ?? "")) === null && expiree(c)) {
      anomalies.push(`claim orpheline expir\xE9e : ${c.domaine} (${c.eng})`);
    }
  }
  const jourNum = (s) => {
    const m = String(s ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  };
  const aujourdHuiNum = jourNum(aujourdHui);
  for (const d of ouvertes) {
    const ech = jourNum(d.echeance_reponse);
    if (ech !== null && ech < aujourdHuiNum) {
      anomalies.push(`${d.id} : \xE9ch\xE9ance de r\xE9ponse d\xE9pass\xE9e, appliquer le d\xE9faut ou escalader`);
    }
    if (!d.defaut_si_silence && !d.escalade) {
      anomalies.push(`${d.id} : aucune issue de secours d\xE9clar\xE9e (non publiable)`);
    }
  }
  for (const [eid, e] of engs) {
    const ben = String(e.beneficiaire ?? "");
    if (e.type === "realisation" && !/^(jalon:|eng:|humain:)/.test(ben)) {
      anomalies.push(`${eid} : b\xE9n\xE9ficiaire non typ\xE9 (candidat \xE0 \xE9limination)`);
    }
  }
  anomalies.push(...anomaliesCoherence(etatCoherence(ctx, engs)));
  if (anomalies.length) {
    for (const a of anomalies) L.push(`- ${a}`);
  } else {
    L.push("- (aucune)");
  }
  return L.join("\n") + "\n";
}

// noyau/src/sync.ts
var PUSH_TIMEOUT_MS = 2e4;
var rel = (ctx, p) => path19.relative(ctx.racine, p).split(path19.sep).join("/");
function onTrunk(ctx) {
  return git(["symbolic-ref", "--short", "-q", "HEAD"], ctx.racine).stdout.trim() === TRUNK;
}
function trunkRemote(ctx) {
  const suivi = git(["config", "--get", `branch.${TRUNK}.remote`], ctx.racine).stdout.trim();
  if (suivi && suivi !== ".") return suivi;
  const remotes = git(["remote"], ctx.racine).stdout.split("\n").map((l) => l.trim());
  return remotes.includes("origin") ? "origin" : null;
}
function pushTrunk(ctx, remote) {
  const reservations = reservationsDifferees();
  const refspecs = reservations.map((r2) => `${r2.sha}:${r2.ref}`);
  const baux = reservations.map((r2) => `--force-with-lease=${r2.ref}:`);
  const r = (0, import_node_child_process6.spawnSync)("git", ["push", "--porcelain", ...baux, remote, TRUNK, ...refspecs], {
    cwd: ctx.racine,
    encoding: "utf-8",
    windowsHide: true,
    timeout: PUSH_TIMEOUT_MS,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_ASKPASS: "" }
  });
  const sortie = `${r.stdout ?? ""}
${r.stderr ?? ""}`;
  const refusees = reservations.filter((x) => new RegExp(`^!.*${x.ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "m").test(sortie));
  if (r.status === 0 && !refusees.length) return null;
  if (r.status === 0 || /^[ *+]\S*\s+\S+:refs\/heads\/master/m.test(sortie) || sortie.includes(`refs/heads/${TRUNK}	[`)) {
    if (refusees.length) return `the remote refused the reservation of ${refusees.map((x) => x.ref.split("/").pop()).join(", ")}: another clone holds that number, renumber the record (lean renumeroter)`;
  }
  const cause = r.error ? r.error.message : sortie.trim().split("\n").filter(Boolean).slice(-2).join(" ");
  return `git push ${remote} ${TRUNK}: ${cause || "no output"}`;
}
function refAhead(ctx) {
  for (const ref of trunkRefs(ctx)) {
    if (git(["merge-base", "--is-ancestor", ref, "HEAD"], ctx.racine).code === 1) return ref;
  }
  return null;
}
function joinRemote(ctx, ref, cause) {
  const m = git(["merge", "--no-edit", "-m", `merge(steering): remote ${TRUNK} joined before the push of ${cause}`, ref], ctx.racine);
  if (m.code === 0) return null;
  const conflits = git(["diff", "--name-only", "--diff-filter=U"], ctx.racine).stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  const tableau = rel(ctx, ctx.dashboard);
  if (conflits.length === 1 && conflits[0] === tableau) {
    try {
      git(["checkout", "--theirs", "--", tableau], ctx.racine);
      genererDashboard(ctx);
      git(["add", "--", tableau], ctx.racine);
      if (git(["commit", "--no-edit", "-q"], ctx.racine).code === 0) return null;
    } catch {
    }
  }
  git(["merge", "--abort"], ctx.racine);
  return conflits.length ? `the remote ${TRUNK} conflicts with this clone on ${conflits.slice(0, 4).join(", ")}: merge ${shortRef(ref)} by hand, then push` : `the remote ${TRUNK} could not be merged (${(m.stderr || m.stdout).trim().split("\n")[0] || "no output"}): merge ${shortRef(ref)} by hand, then push`;
}
function publishTransaction(ctx, chemins, message, cause, options = {}) {
  try {
    const config = lireConfig(ctx);
    if (!config.push_after_transaction && !options.explicit) return { commit: null, pushed: null, note: null };
    if (!estRacineGit(ctx)) return { commit: null, pushed: null, note: null };
    if (!onTrunk(ctx)) {
      return { commit: null, pushed: null, note: `the main checkout is not on ${TRUNK}: the records were left uncommitted` };
    }
    try {
      refreshRemoteRefs(ctx);
      fastForwardTrunk(ctx);
    } catch {
    }
    const rels = [...new Set(chemins.filter(Boolean).map((c) => rel(ctx, c)))].filter((r) => r && !r.startsWith("..")).filter((r) => fs22.existsSync(path19.join(ctx.racine, r)) || git(["ls-files", "--", r], ctx.racine).stdout.trim() !== "");
    let sha = null;
    const changes = rels.length ? git(["status", "--porcelain", "--", ...rels], ctx.racine).stdout.trim() : "";
    if (changes) {
      const ajout = git(["add", "-A", "--", ...rels], ctx.racine);
      const commit = ajout.code === 0 ? git(["commit", "--only", "--quiet", "-m", message, "--", ...rels], ctx.racine) : ajout;
      if (commit.code !== 0) {
        const raison = (commit.stderr.trim() || commit.stdout.trim() || "git commit failed").split("\n").slice(0, 2).join(" ");
        return { commit: null, pushed: null, note: `the records were not committed: ${raison}` };
      }
      sha = git(["rev-parse", "--short", "HEAD"], ctx.racine).stdout.trim() || null;
    }
    const remote = trunkRemote(ctx);
    if (!remote) return { commit: sha, pushed: null, note: null };
    if (!sha && !reservationsEnAttente() && git(["rev-list", "--count", `${remote}/${TRUNK}..${TRUNK}`], ctx.racine).stdout.trim() === "0") {
      return { commit: null, pushed: null, note: null };
    }
    let erreur = pushTrunk(ctx, remote);
    if (erreur) {
      refreshRemoteRefs(ctx, { force: true });
      const ref = refAhead(ctx);
      if (ref) {
        const refus2 = joinRemote(ctx, ref, cause);
        if (refus2) return { commit: sha, pushed: false, note: refus2 };
        erreur = pushTrunk(ctx, remote);
      }
    }
    return { commit: sha, pushed: !erreur, note: erreur };
  } catch (e) {
    return { commit: null, pushed: false, note: `publication failed: ${String(e.message ?? e)}` };
  }
}
function publishState(ctx, message) {
  const chemins = [ctx.engagements, ctx.arbitrages, ctx.deltas, ctx.decisions, ctx.milestones, ctx.claims, ctx.agents, ctx.config, ctx.streams, ctx.dashboard, ctx.livraisons].filter(
    (p) => fs22.existsSync(p)
  );
  const rels = chemins.map((c) => rel(ctx, c));
  const files = estRacineGit(ctx) ? git(["status", "--porcelain", "--", ...rels], ctx.racine).stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim()) : [];
  return { ...publishTransaction(ctx, chemins, message, "the steering state", { explicit: true }), files };
}
var BRANCH_PUSH_TIMEOUT_MS = 6e4;
function sujetDePhase(eng, phase, detail = "") {
  switch (phase) {
    case "delivered":
      return `chore(steering): ${eng} delivered, the branch is published for its verification [${eng}]`;
    case "mandated":
      return `chore(steering): ${eng} verification mandated${detail ? ` ${detail}` : ""}, the branch says so [${eng}]`;
    case "rejected":
      return `chore(steering): ${eng} verdict rejected${detail ? `, ${detail}` : ""}, the branch says so [${eng}]`;
    default:
      return `chore(steering): ${eng} verified${detail ? `, ${detail}` : ""}, the branch is published for its merge [${eng}]`;
  }
}
function phaseDuSujet(subject) {
  const mandated = subject.match(/\bverification mandated(?: until (\S+))?, the branch says so\b/);
  if (mandated) return { phase: "mandated", until: mandated[1] ?? null };
  if (/\bverdict rejected(?:, .*)?, the branch says so\b/.test(subject)) return { phase: "rejected", until: null };
  if (/\bverified(?:, .*)?, the branch is published for its merge\b/.test(subject)) return { phase: "verified", until: null };
  if (/\bdelivered(?:, .*)?, the branch is published for its verification\b/.test(subject)) return { phase: "delivered", until: null };
  return null;
}
function fermeIci(local, commit, until) {
  if (!local || local.statut === "ouvert") return false;
  if (local.branch_commit) return commit.startsWith(local.branch_commit);
  const echeance = new Date(local.echeance).getTime();
  return Number.isFinite(echeance) && echeance === new Date(until).getTime();
}
function mandatDistant(ctx, branch, local) {
  if (!estRacineGit(ctx)) return null;
  const refs = git(["for-each-ref", "--format=%(refname)", `refs/remotes/*/${branch}`], ctx.racine).stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const ref of refs) {
    const lignes = git(["log", "--format=%H %s", "-n", "30", ref], ctx.racine).stdout.split("\n");
    for (const ligne of lignes) {
      const espace = ligne.indexOf(" ");
      if (espace < 0) continue;
      const commit = ligne.slice(0, espace);
      const p = phaseDuSujet(ligne.slice(espace + 1));
      if (!p || p.phase === "mandated" && !p.until) continue;
      if (p.phase === "mandated" && p.until) {
        const until = new Date(p.until).getTime();
        if (Number.isFinite(until) && until > Date.now() && !fermeIci(local, commit, p.until)) return { ref: shortRef(ref), until: p.until };
      }
      break;
    }
  }
  return null;
}
var SANS_INVITE2 = { GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_ASKPASS: "" };
function pushBranch(ctx, remote, branch) {
  const r = (0, import_node_child_process6.spawnSync)("git", ["push", remote, `refs/heads/${branch}:refs/heads/${branch}`], {
    cwd: ctx.racine,
    encoding: "utf-8",
    windowsHide: true,
    timeout: BRANCH_PUSH_TIMEOUT_MS,
    env: { ...process.env, ...SANS_INVITE2 }
  });
  if (r.status === 0) return null;
  const cause = r.error ? r.error.message : (r.stderr || r.stdout || "").trim().split("\n").filter(Boolean).slice(-2).join(" ");
  return `git push ${remote} ${branch}: ${cause || "no output"}`;
}
function recordPhase(ctx, eng, branch, phase, detail = "") {
  if (!estRacineGit(ctx)) return { commit: null, note: null };
  const tete = git(["rev-parse", "--verify", "-q", `refs/heads/${branch}`], ctx.racine).stdout.trim();
  if (!tete) return { commit: null, note: `the branch ${branch} does not exist: the phase ${phase} was not recorded` };
  const sujet = sujetDePhase(eng, phase, detail);
  const commit = git(["commit-tree", `${tete}^{tree}`, "-p", tete, "-m", sujet], ctx.racine);
  const sha = commit.stdout.trim();
  if (commit.code !== 0 || !sha) {
    return { commit: null, note: `the phase ${phase} was not recorded on ${branch}: ${commit.stderr.trim().split("\n")[0] || "git commit-tree failed"}` };
  }
  const maj = git(["update-ref", "-m", `lean: ${eng} ${phase}`, `refs/heads/${branch}`, sha, tete], ctx.racine);
  if (maj.code !== 0) {
    return { commit: null, note: `the phase ${phase} was not recorded on ${branch}: ${maj.stderr.trim().split("\n")[0] || "git update-ref failed"}` };
  }
  return { commit: git(["rev-parse", "--short", sha], ctx.racine).stdout.trim() || sha, note: null };
}
function publishPhase(ctx, eng, branch, worktree, phase, options = {}) {
  const vide = { phase, branch, commit: null, pushed: null, note: null };
  try {
    if (!estRacineGit(ctx)) return vide;
    let manque = null;
    if (worktree && fs22.existsSync(worktree)) {
      const sales = git(["status", "--porcelain", "--untracked-files=no"], worktree).stdout.split("\n").filter((l) => l.trim());
      if (sales.length) {
        manque = `${sales.length} tracked file(s) are modified and not committed in ${worktree}: the published branch does not hold them. Commit them and deliver again`;
      }
    }
    const marque = recordPhase(ctx, eng, branch, phase, options.detail ?? "");
    if (!marque.commit) return { ...vide, note: marque.note };
    if (options.push === false || !lireConfig(ctx).push_after_transaction) return { ...vide, commit: marque.commit, note: manque };
    const remote = trunkRemote(ctx);
    if (!remote) return { ...vide, commit: marque.commit, note: manque };
    const erreur = pushBranch(ctx, remote, branch);
    return { phase, branch, commit: marque.commit, pushed: !erreur, note: [erreur, manque].filter(Boolean).join(". ") || null };
  } catch (e) {
    return { ...vide, pushed: false, note: `the phase ${phase} was not published: ${String(e.message ?? e)}` };
  }
}
function pushCommitmentBranch(ctx, branch) {
  try {
    if (!estRacineGit(ctx) || !lireConfig(ctx).push_after_transaction) return { pushed: null, note: null };
    const remote = trunkRemote(ctx);
    if (!remote) return { pushed: null, note: null };
    const erreur = pushBranch(ctx, remote, branch);
    return { pushed: !erreur, note: erreur };
  } catch (e) {
    return { pushed: false, note: String(e.message ?? e) };
  }
}
function retireRemoteBranch(ctx, branch) {
  try {
    if (!estRacineGit(ctx)) return null;
    const remote = trunkRemote(ctx);
    if (!remote) return null;
    if (git(["rev-parse", "--verify", "-q", `refs/remotes/${remote}/${branch}`], ctx.racine).code !== 0) return null;
    const r = (0, import_node_child_process6.spawnSync)("git", ["push", remote, `:refs/heads/${branch}`], {
      cwd: ctx.racine,
      encoding: "utf-8",
      windowsHide: true,
      timeout: PUSH_TIMEOUT_MS,
      env: { ...process.env, ...SANS_INVITE2 }
    });
    return r.status === 0;
  } catch {
    return false;
  }
}
function phaseLine(p) {
  if (!p) return null;
  if (p.pushed === true) {
    return `branch ${p.branch} published at its phase "${p.phase}" (commit ${p.commit}): another workstation can take it from there${p.note ? `. ${p.note}` : ""}`;
  }
  if (p.pushed === false) return `BRANCH NOT PUBLISHED: ${p.note}. Another workstation cannot take ${p.branch} up yet`;
  return p.note;
}
function publicationLine(p) {
  if (!p) return null;
  if (p.pushed === true) return `published: ${p.commit ? `commit ${p.commit}, ` : ""}${TRUNK} pushed, the other workstations see it at their next refresh`;
  if (p.note) return `NOT PUBLISHED: ${p.note}. The other workstations do not see this yet`;
  return null;
}
function fastForwardTrunk(ctx) {
  if (!lireConfig(ctx).auto_fast_forward) return { moved: false };
  if (!estRacineGit(ctx) || !onTrunk(ctx)) return { moved: false };
  const gitDir = git(["rev-parse", "--git-dir"], ctx.racine).stdout.trim();
  const dossier = path19.isAbsolute(gitDir) ? gitDir : path19.join(ctx.racine, gitDir);
  if (["MERGE_HEAD", "CHERRY_PICK_HEAD", "rebase-merge", "rebase-apply"].some((n) => fs22.existsSync(path19.join(dossier, n)))) {
    return { moved: false };
  }
  const ref = refAhead(ctx);
  if (!ref) return { moved: false };
  if (git(["merge-base", "--is-ancestor", "HEAD", ref], ctx.racine).code !== 0) {
    return { moved: false, ref: shortRef(ref), note: `${TRUNK} and ${shortRef(ref)} have diverged: merge by hand` };
  }
  const from = git(["rev-parse", "--short", "HEAD"], ctx.racine).stdout.trim();
  const m = git(["merge", "--ff-only", "--quiet", ref], ctx.racine);
  if (m.code !== 0) {
    const cause = (m.stderr || m.stdout).trim().split("\n").filter(Boolean).slice(0, 2).join(" ");
    return { moved: false, ref: shortRef(ref), note: `${TRUNK} is behind ${shortRef(ref)} and was not moved: ${cause || "git refused"}` };
  }
  return { moved: true, from, to: git(["rev-parse", "--short", "HEAD"], ctx.racine).stdout.trim(), ref: shortRef(ref) };
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

// noyau/src/runtime.ts
var fs23 = __toESM(require("node:fs"), 1);
var path20 = __toESM(require("node:path"), 1);
var DOSSIER_RUNTIME = ".lean-engine/bin";
var ENV_RUNTIME_ACCEPTE = "LEAN_ENGINE_RUNTIME_NON_COMMITE";
function runtimeNonCommite(ctx) {
  const dossier = path20.join(ctx.racine, DOSSIER_RUNTIME);
  if (!fs23.existsSync(dossier)) return null;
  if (git(["rev-parse", "--git-dir"], ctx.racine).code !== 0) return null;
  const r = git(["status", "--porcelain", "--", DOSSIER_RUNTIME], ctx.racine);
  if (r.code !== 0) return null;
  const fichiers = r.stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim().replace(/^"|"$/g, ""));
  if (!fichiers.length) return null;
  return `${fichiers.length} file(s) under ${DOSSIER_RUNTIME} differ from HEAD (${fichiers.slice(0, 4).join(", ")}${fichiers.length > 4 ? ", and others" : ""})`;
}
function refusRuntime(ctx) {
  if (!lireConfig(ctx).runtime_commite_requis) return null;
  if (process.env[ENV_RUNTIME_ACCEPTE] === "accepte") return null;
  const ecart = runtimeNonCommite(ctx);
  if (!ecart) return null;
  return {
    code: "runtime_non_commite",
    erreur: `${ecart}. A transaction runs under the committed runtime only, so that every workstation follows the same rules: commit ${DOSSIER_RUNTIME} with the source that built it and push master, or restore it (git checkout -- ${DOSSIER_RUNTIME}). To run anyway while you develop the runtime: ${ENV_RUNTIME_ACCEPTE}=accepte.`
  };
}

// cli/commun.ts
function trouverLease(depart) {
  let p = path21.resolve(depart ?? process.cwd());
  for (; ; ) {
    const f = path21.join(p, ".eng", "LEASE.json");
    if (fs24.existsSync(f)) {
      try {
        const lease = JSON.parse(fs24.readFileSync(f, "utf-8"));
        lease._worktree = p;
        return lease;
      } catch {
        return null;
      }
    }
    const parent = path21.dirname(p);
    if (parent === p) return null;
    p = parent;
  }
}
function contexte() {
  const lease = trouverLease();
  if (lease?.repo && fs24.existsSync(lease.repo)) return resoudreContexte(lease.repo);
  const racine = trouverRacine(process.cwd());
  if (!racine) {
    echec("depot_introuvable", "aucune racine d'\xE9tat (.agenticLEAN/ ou agentic_orchestrator/management/) depuis ce r\xE9pertoire");
  }
  return resoudreContexte(racine);
}
function echec(code, message) {
  process.stderr.write(`ERREUR [${code}] : ${message}
`);
  process.exit(1);
}
async function muter(ctx, fn) {
  const refus2 = refusRuntime(ctx);
  if (refus2) echec(refus2.code, refus2.erreur);
  return sousVerrou(ctx.verrou, fn);
}
function rendre(corps, surSucces) {
  if (!corps.ok) echec(String(corps.code ?? "erreur"), String(corps.erreur ?? JSON.stringify(corps)));
  surSucces(corps);
  const ligne = publicationLine(corps.publication);
  if (ligne) process.stdout.write(ligne + "\n");
  process.exit(0);
}
function analyser(argv) {
  const positionnels = [];
  const drapeaux = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const nom = a.slice(2);
      const suivant = argv[i + 1];
      if (suivant !== void 0 && !suivant.startsWith("--")) {
        drapeaux[nom] = suivant;
        i++;
      } else {
        drapeaux[nom] = true;
      }
    } else {
      positionnels.push(a);
    }
  }
  return { positionnels, drapeaux };
}

// noyau/src/installation.ts
var fs25 = __toESM(require("node:fs"), 1);
var path22 = __toESM(require("node:path"), 1);
var import_node_crypto = require("node:crypto");
var MARQUE_DEBUT = "<!-- lean-engine:debut -->";
var MARQUE_FIN = "<!-- lean-engine:fin -->";
var MARQUE_DEBUT_ANCIENNE = "<!-- agelaios:debut -->";
var MARQUE_FIN_ANCIENNE = "<!-- agelaios:fin -->";
function bornesBloc(texte) {
  for (const [d, f] of [
    [MARQUE_DEBUT, MARQUE_FIN],
    [MARQUE_DEBUT_ANCIENNE, MARQUE_FIN_ANCIENNE]
  ]) {
    const debut = texte.indexOf(d);
    const fin = texte.indexOf(f);
    if (debut >= 0 && fin >= 0) return { debut, fin, longueurFin: f.length };
  }
  return null;
}
var MANIFESTE = path22.join(".lean-engine", "installation.json");
function finDeLigne(brut) {
  return brut.includes("\r\n") ? "\r\n" : "\n";
}
function ecrireCommeAvant(chemin, contenuLf) {
  const eol = fs25.existsSync(chemin) ? finDeLigne(fs25.readFileSync(chemin, "utf-8")) : "\n";
  const texte = eol === "\n" ? contenuLf : contenuLf.replace(/\r?\n/g, eol);
  fs25.mkdirSync(path22.dirname(chemin), { recursive: true });
  const tmp = chemin + ".tmp";
  fs25.writeFileSync(tmp, texte, "utf-8");
  try {
    fs25.renameSync(tmp, chemin);
  } catch {
    fs25.writeFileSync(chemin, texte, "utf-8");
    fs25.rmSync(tmp, { force: true });
  }
}
function noterAvant(m, racine, chemin) {
  const brut = brutAvant(chemin);
  if (brut === void 0) return;
  m.contenusAvant = m.contenusAvant ?? {};
  m.contenusAvant[rel2(racine, chemin)] = brut;
}
function brutAvant(chemin) {
  return fs25.existsSync(chemin) ? fs25.readFileSync(chemin, "utf-8") : void 0;
}
var RUNTIME = ".lean-engine/bin";
var LIVRABLES_RUNTIME = [
  "lean.cjs",
  "eng.cjs",
  "hooks/guard_scope.cjs",
  "hooks/guard_style.cjs",
  "hooks/guard_identite.cjs",
  "hooks/guard_lecture.cjs",
  "hooks/require_report.cjs",
  "hooks/session_context.cjs"
];
function empreinteRuntime(dossierDist) {
  const h = (0, import_node_crypto.createHash)("sha256");
  for (const rel3 of LIVRABLES_RUNTIME) {
    const p = path22.join(dossierDist, rel3);
    if (!fs25.existsSync(p)) return null;
    h.update(rel3).update(fs25.readFileSync(p));
  }
  return "sha256:" + h.digest("hex").slice(0, 16);
}
function versionPaquet(paquet) {
  try {
    const v = JSON.parse(lireTexte(path22.join(paquet, "package.json"))).version;
    return typeof v === "string" && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}
function vendreRuntime(racine, paquet) {
  const source = path22.join(paquet, "dist");
  const manquants = LIVRABLES_RUNTIME.filter((rel3) => !fs25.existsSync(path22.join(source, rel3)));
  if (manquants.length) return { fichiers: [], dossiers: [], manquants };
  const fichiers = [];
  const dossiers = [];
  const base = path22.resolve(racine);
  const assurer = (d) => {
    const aCreer = [];
    let p = path22.resolve(d);
    while (p !== base && p.startsWith(base) && !fs25.existsSync(p)) {
      aCreer.push(p);
      p = path22.dirname(p);
    }
    fs25.mkdirSync(d, { recursive: true });
    for (const x of aCreer) dossiers.push(rel2(racine, x));
  };
  for (const r of LIVRABLES_RUNTIME) {
    const cible = path22.join(racine, RUNTIME, r);
    assurer(path22.dirname(cible));
    const existait2 = fs25.existsSync(cible);
    fs25.copyFileSync(path22.join(source, r), cible);
    if (!existait2) fichiers.push(`${RUNTIME}/${r}`);
  }
  const version = path22.join(racine, RUNTIME, "VERSION");
  const existait = fs25.existsSync(version);
  ecrireCommeAvant(
    version,
    JSON.stringify(
      { empreinte: empreinteRuntime(source), version: versionPaquet(paquet), pose_le: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19) },
      null,
      2
    ) + "\n"
  );
  if (!existait) fichiers.push(`${RUNTIME}/VERSION`);
  return { fichiers, dossiers, manquants: [] };
}
function reglesQuiCitentPython(racine) {
  const f = path22.join(racine, "CLAUDE.md");
  if (!fs25.existsSync(f)) return [];
  const texte = lireTexte(f);
  const bornes = bornesBloc(texte);
  const debut = bornes ? bornes.debut : -1;
  const fin = bornes ? bornes.fin : -1;
  const sortie = [];
  let offset = 0;
  texte.split("\n").forEach((l, i) => {
    const dansNotreBloc = debut >= 0 && offset >= debut && offset <= fin;
    offset += l.length + 1;
    if (dansNotreBloc) return;
    if (/agentic_orchestrator[\/\\](scripts|hooks)|\.py\b|obeya/.test(l)) sortie.push(i + 1);
  });
  return sortie;
}
var rel2 = (racine, p) => path22.relative(racine, p).split("\\").join("/");
function blocRegles(_binaire) {
  return [
    MARQUE_DEBUT,
    "",
    "## Lean Engine: rules for agents",
    "",
    "1. **The mutation lock is the authority on taking work.** Every transaction (pull, push,",
    "   release, revoke, decide, reserve a number) runs in process under the lock of the state",
    "   tree, executed by whoever asks for it: an agent session, or the VS Code cockpit. There is",
    "   no server, no port and no daemon to start.",
    "2. No commitment, no lease. A session works on the product only after it has pulled its",
    "   commitment. Work is taken from the frontier of the graph, never by pushing work that is not",
    "   ready. Commit messages follow the convention of the repository, with the suffix",
    "   `[ENG-NNNN]`.",
    "3. A number (ENG, SCP, ADR, DA) is **reserved** from the authority. It is never guessed by",
    "   looking at the files that happen to be present.",
    "4. Sources of truth: requirements live in `dossier-recette/` (identifiers `SPEC-DOM-NNN`), and",
    "   steering lives in the state tree. Never duplicate a source of truth.",
    "5. A substantive blocker becomes an arbitration request, addressed to a named decider, with",
    "   enumerated options and a fallback. An agent never settles a substantive choice.",
    "   When a delivery report or a verdict concludes that a structuring decision is needed, or that",
    "   new commitments must be opened, the session that integrates files them at once, without",
    "   waiting for the operator: the decision as an arbitration request with its options and the",
    "   option recommended, the work as commitments with their scope and their definition of done,",
    "   each under a reserved number. The operator acts on commitments and on arbitration requests,",
    "   and is never asked to carry out a gesture of orchestration.",
    "6. Commitments carry no deadline, because an agent does not work at the pace of a human. The",
    "   temporal record is kept: creation, pull, delivery and release are all timestamped.",
    "",
    "### 7. Writing style, and it applies to everything you write",
    "",
    "   The working language of this repository is **standard business English**, without",
    "   exception. That covers code, comments, identifiers, rendered strings, file names,",
    "   documentation and specifications. The only exceptions are proper nouns, delivered locale",
    "   catalogues, frozen corpora and oracles, and literal quotations of an output inside a dated",
    "   record. **Write no French.**",
    "",
    "   Write complete sentences. State the actor of every requirement, and give figures with",
    "   their units rather than adjectives that cannot be measured.",
    "",
    "   **The em dash is forbidden**, with no nuance. Use a colon, a comma, a brief parenthesis, or",
    "   split the sentence in two. Punctuation stays sober: no exclamation marks, no ellipses, no",
    "   emoji, and no chains of dashes or slashes standing in for a clause.",
    "",
    "   Give no delay estimate in planning. State what is not known as an open point rather than",
    "   presenting an estimate as a fact.",
    "",
    "   These rules are not advisory. The `guard_style` hook refuses a write that breaks them, at",
    "   the moment you write it, and `lean style` reports where the repository stands.",
    "",
    "### 8. Signature and attribution",
    "",
    "   Only the people the repository admits sign, each under their own name: they are listed in",
    "   `.lean-engine/identities`, and `lean identite list` shows them with the identity of this",
    "   workstation. When a user asks to work under their identity, run",
    '   `lean identite use "Name" mail@example.org`: it admits the identity, sets git on it and',
    "   aligns the guards, in one gesture. Run it at the request of that person only, never on your",
    "   own initiative, and never set a git identity by another command. A pull records the person",
    "   whose workstation took the commitment (`reserve_par`), besides the session that implements:",
    "   that person is the one to warn when something goes wrong. The name of the tooling",
    "   vendor appears nowhere: not in versioned content, not in a commit message, not in an author",
    "   address, and not in an attribution trailer. Never add a `Co-authored-by`, `Generated with`",
    "   or equivalent trailer, and never use a tool no-reply address. Produce no attribution",
    "   artefact of any kind. `guard_identite` and `guard_style` refuse these forms, both when you",
    "   write and when you commit.",
    "",
    "### 9. Never infer the state by reading files. Ask for it",
    "",
    "   `lean conseils` states what calls for action and why. `frontiere` lists what can be",
    "   pulled, `sessions` what is under way, `lots` what can run in parallel, `arbitrages` what",
    "   is open, and `streams` the streams the repository declares, with their domains, folders and",
    "   paths. When a resequencing is needed, `conseils` says so: it is never guessed.",
    "   One commitment, requirement or document: `lean show ID`. Anything by subject:",
    "   `lean search <terms>`. Environment trouble: `lean pitfalls <terms>`. Standard and",
    "   Program followed on the manifests (classification, tag, direction of a dependency,",
    "   versions): `lean editions`, to run before you deliver a change of a manifest. Reading the",
    "   state tree with `cat`, `ls` or `grep` is refused by `guard_lecture`. See `/etat` for the",
    "   full surface.",
    "",
    "### 10. Documentation follows the work, and the report says so",
    "",
    "   When the completion of a commitment, of an arbitration request (DA) or of a specification",
    "   change (SCP) makes a document false or incomplete, update that document at once, with the",
    "   work that causes the change. It is never left for a later pass, because the session that",
    "   knows why the document changed has ended by then. A session under lease updates what lies",
    "   inside its scope and drafts in full what lies outside it, and the session that integrates",
    "   applies that draft at once.",
    "",
    "   When a document changed, or one is left to change, the report and the closing message end with",
    "   a section `## Documentation updated`: one line per document changed and what changed in it,",
    "   then what is still to be applied and by whom. When no document changed and none is left to",
    "   change, the section is left out: nothing is written in its place.",
    "",
    "### 11. Prior work is read before any work starts",
    "",
    "   The files of a clone say what that clone knows, and nothing more. ENG-0272 was realised twice",
    "   on 2026-10-11, because a session resumed on its local state while the commitment had been",
    "   taken, realised and integrated on another clone.",
    "",
    "   Before a commitment is opened, run `lean search <terms>` on its subject, then",
    "   `lean prior ENG-NNNN` once its record is written. Before work starts, `eng pull` reads the",
    "   remote: it refuses a commitment that the remote shows taken, closed or worked on elsewhere,",
    "   and it lists the similar commitments, which the session reads first (`lean show`,",
    "   `lean rapport`). When a session opens or resumes, and at each `eng push --progress`, the",
    "   remote is read again. A session told that work on its commitment exists elsewhere stops",
    "   writing and declares it (`eng push --blocage`): it never goes on from its local state.",
    "",
    "   A take protects the work only once the remote holds it. Every steering transaction (pull,",
    "   delivery, blocker, release, decision) therefore commits its records and pushes master by",
    "   itself, and the cockpit fetches the remote on a period and fast-forwards master when that",
    "   needs no merge. When a transaction answers `NOT PUBLISHED`, or `lean conseils` names",
    "   commits that the remote lacks, remove the cause and push master: nobody else sees the work",
    "   until then.",
    "",
    "   The phases of a commitment are published too. A delivery records a commit on the branch of",
    "   the commitment and pushes the branch, so that a verifier on another workstation reads it. An",
    "   approval records a second one, and the branch is pushed again when the merge is left to",
    "   another workstation. Commit your work before you deliver: what is not committed is not on",
    "   the published branch. The main checkout stays on master: never check a branch out there,",
    "   and work each commitment in its own worktree.",
    "",
    "   A change made by hand is no transaction, and nothing publishes it for you. Every",
    "   resequencing, milestone planning, opening, amendment, narrowing or withdrawal of a",
    "   commitment, and every arbitration request or specification change written, is committed",
    "   and pushed at once, before anything else is done:",
    '   `lean publier "chore(steering): what changed and why [ENG-NNNN]"`. Until it is pushed,',
    "   another workstation reads the former state and can take the commitment as it stood.",
    '   `--acknowledged "reason"` pulls past a refusal, once what exists has been read.',
    "",
    "Tools, run from the root of the repository or of a worktree:",
    "",
    "```bash",
    `node ${RUNTIME}/lean.cjs conseils  # what to do now, and why`,
    `node ${RUNTIME}/lean.cjs --help    # steering: state, frontier, batches, arbitrations`,
    `node ${RUNTIME}/eng.cjs --help         # agent session: pull, push, contexte, release`,
    "```",
    "",
    MARQUE_FIN,
    ""
  ].join("\n");
}
function agents() {
  const lean = `node ${RUNTIME}/lean.cjs`;
  const eng = `node ${RUNTIME}/eng.cjs`;
  return {
    "implementor.md": [
      "---",
      "name: implementor",
      'description: "Carries out one scoped commitment, test first, in the worktree pulled under the mutation lock. The work is done in the session that pulled, never in an agent invoked apart."',
      "tools: Read, Edit, Write, Bash, Grep, Glob",
      "---",
      "",
      "You are an implementor. You become one by PULLING a commitment, or by resuming a worktree that is",
      "already pulled (`.eng/LEASE.json` present).",
      "",
      "1. If no worktree was given to you, run",
      `   \`${eng} pull ENG-NNNN --promettant session:implementor\`. The output names the worktree, the`,
      "   branch and the context pack. Work ONLY in that worktree. Read `.eng/CONTEXT.md` first: it holds",
      "   the Constitution, the commitment record, the requirements cited and the contracts of the",
      "   predecessors.",
      "2. Check that acceptance tests exist for the requirements of the commitment and that they fail. If",
      "   they do not exist, write them first.",
      "3. Implement until the tests pass, inside the `scope.paths` of the commitment and nowhere else. At",
      "   each significant step (tests written and failing, first pass, refactoring done), commit on the",
      "   branch of the commitment with the suffix `[ENG-NNNN]`, then push the progress:",
      `   \`${eng} push --progress "..."\`. Never keep hours of work uncommitted: a commit can be rewritten,`,
      "   a lost working tree cannot be recovered.",
      "4. Never write outside the scope, in the requirements folder, in the state tree, in the runtime or",
      "   in `.claude/`. Three refusals of the hook on one path mean that the approach is wrong: go to",
      "   point 5. When a hook reports a lease that is REVOKED or EXPIRED, or a global PAUSE, stop writing",
      "   at once and do what it says.",
      "5. When a requirement is wrong or ambiguous, when a substantive choice appears (architecture, one",
      "   requirement against another, a milestone), or when the scope is too narrow: STOP. You never",
      "   settle what touches the requirements or the milestones. Declare it:",
      `   \`${eng} push --blocage "finding" [--nature fond|redactionnelle]\`. A blocker of substance is decided`,
      "   through an arbitration request, and through nothing else: `BLOCKED.md` is the text of that",
      "   request. Investigate, then complete its sections: `## Context` (for a reader with none of the",
      "   history), `## What is at stake`, `## Closed question`, `## Options and consequences` (each",
      "   option with what it changes and costs), `## Recommendation` (the option you advise, in bold,",
      `   with the reason) and \`## Fallback\`. \`${eng} push --livraison\` files it as DA-NNNN, open, under a`,
      "   reserved number, and refuses a report that does not pass the gate of a request. Then run",
      `   \`${eng} attendre\` in the background and end your turn: the command ends when the request is`,
      "   decided, which wakes you. Read what it prints and `.eng/DECISION.md`, remove `BLOCKED.md`, carry",
      "   the decision out inside your scope and deliver with `REPORT.md`. If it ends on a return for",
      `   study, rewrite the request and run \`${lean} republier DA-NNNN\`, then wait again.`,
      "6. Before the report, replay every blocking gate of the project on a clean tree, and cite the",
      "   output and the head of the branch. A criterion with no passing test is not met, and a failing",
      "   test is never reported as a success. The tests you run hold the integration: a short suite",
      "   answers in 2 to 3 minutes, a long one in 10 at most, run in parallel, on the crates touched and",
      "   their dependents, with every replay kept to the strict minimum (one mutant per property). Prove",
      "   the performance by tests at the limits and on the exceptions, never by raw load at every run; a",
      "   load, a soak or a chaos sequence belongs to a dedicated trial commitment at the end of the",
      "   milestone. A file you need outside your scope is widened by the delivery itself when it lies in",
      "   no forbidden zone and in the scope of no commitment in flight; otherwise the delivery refuses,",
      `   and the widening is a decision (\`${eng} etendre\`, or BLOCKED.md as an arbitration request).`,
      "7. End with `REPORT.md` at the root of the worktree. It opens with `## Result`, whose first line is",
      "   `PASS` or `FAIL` against the `definition_of_done`, followed by one line per criterion: met or not",
      "   met, and the test that proves it. Then the tests run with their real result, and the files",
      "   changed.",
      "8. Sort every open point before you deliver, and leave none as loose prose:",
      "   - A point you can close alone, inside your scope, without changing a requirement, a milestone,",
      "     an interface or the scope, is closed now and committed. It is never handed to the operator.",
      "   - A point you cannot close alone is drafted in full under `## Open points that need someone",
      "     else`, with its vehicle: a DA with its enumerated options and the option you recommend, an ENG",
      "     with its scope and its definition of done, or an SCP. The session that integrates files each",
      "     one at once, without waiting for the operator, so a draft that is incomplete is a point lost.",
      "   - What needs no action goes under `## For information, no action required`, and nowhere else.",
      "   - Documentation is updated as the work goes, never afterwards. Every document inside your scope",
      "     that the work makes false or incomplete is corrected in the same commits. A document outside",
      "     your scope is drafted in full, never mentioned in passing, and the session that integrates",
      "     applies the draft at once. When a document changed, or one is left to change, `REPORT.md`",
      "     and your closing message end with `## Documentation updated`: one line per document changed",
      "     and what changed in it, then what is still to be applied and by whom. When no document",
      "     changed and none is left to change, leave the section out: write nothing in its place.",
      `9. Push the delivery: \`${eng} push --livraison\`. The answer comes in three blocks: the result, what is`,
      "   still required from you, and what is for information only. Your closing message keeps that",
      "   order. Never merge and never push with git: the integration follows the verdict. `REPORT.md`",
      "   stays out of the index, the delivery collects it.",
      "10. Do not end the session on the delivery. Launch the `verifier` subagent on your commitment at once",
      "   (Agent tool, subagent_type `verifier`). It starts from a clean context, so it did not implement,",
      "   and it claims the mandate and files the verdict itself. An approving verdict merges, marks the",
      "   commitment held, pushes master and removes the worktree. On a rejection, the violations are",
      "   written in `.eng/REWORK.md` of the worktree, each with a mark (`V1`, `V2` and so on): correct each one,",
      "   answer each mark in `REPORT.md` under `## Rework` (what changed, the test that proves it), deliver",
      "   again, and launch a new verifier subagent. After two consecutive rejections the next delivery is",
      "   refused until an arbitration request on the continuation is decided: write `BLOCKED.md` as that",
      "   request, deliver it, and wait on it.",
      "11. When the work needs a path or a domain outside the scope, extend it as a transaction and never by",
      `   hand: \`${eng} etendre --paths "a,b" [--domaines "X"] --motif "why"\`. The new paths are checked`,
      "   against the commitments in flight, the domains are reserved, the record is rewritten and published.",
      ""
    ].join("\n"),
    "verifier.md": [
      "---",
      "name: verifier",
      'description: "Compares the diff of a commitment branch with the requirements, the Constitution and the tests. Read only, plus the execution of tests. Returns a verdict."',
      "tools: Read, Grep, Glob, Bash",
      "---",
      "",
      "You are the verifier. You are given a commitment (ENG-NNNN) and its branch. You change no file: you",
      "read, you run tests, and you return a verdict. Whoever implemented never judges.",
      "",
      `1. Read the record with \`${lean} show <ENG>\` (definition of done, requirements, scope), and the`,
      "   requirements it cites.",
      "2. Examine the whole diff of the branch against the main branch. No file outside `scope.paths` or",
      "   in a zone the Constitution forbids, and no test removed or weakened without a reason given in",
      "   `REPORT.md`.",
      "3. Run the tests attached to the requirements and the suite of the module touched, each one",
      `   through \`${lean} essai "command" --sorties <raw outputs file>\` (or \`${lean} essai --sorties F -- program arg...\`),`,
      "   which runs it and records the command, its output and its exit code in the raw outputs. The",
      "   verdict reads those records: a test cited and not run this way is refused, and a red test is",
      "   never approved. A test you cannot run is declared not verified, never assumed to pass.",
      "4. Compare the delivered behaviour with the text of each requirement: statement, coverage, error",
      "   cases. When the report lists mutants, replay at least one per property that enters the",
      "   specification. When the report follows a rejection, check that `## Rework` answers every mark",
      "   of `.eng/REWORK.md` in substance, not in words.",
      "",
      "Your answer opens with one line that states the result: PASS (`approve`), FAIL (`reject`) or HELD",
      "FOR ARBITRATION (`arbitrage`), followed by the commitment restated in one sentence. It ends with the",
      "verdict, strictly in JSON:",
      "",
      "```json",
      "{",
      '  "verdict": "approve | reject | arbitrage",',
      '  "violations": ["precise description, file:line, requirement concerned"],',
      '  "par_exigence": {"SPEC-DOM-NNN": "couverte | partielle | non couverte | contredite"},',
      '  "tests": {"executes": 0, "verts": 0, "non_verifiables": []},',
      '  "motif_arbitrage": "only for arbitrage: the closed question, the options and the one recommended"',
      "}",
      "```",
      "",
      "`reject`: a substantive violation that the implementor can correct, that is a failing gate, a test",
      "missing or failing on the critical path of the definition of done, or a proof that cannot be",
      "replayed. `reject --mineur`: points inside the scope that the delivery must still correct (a",
      "sentence, a figure, a missing test, an edge case) and that call for no new commitment: the session",
      "reworks them in the same worktree, under a warm build, and it counts as no rejection of substance.",
      "A point inside the scope verified is never handed over as a new commitment. `arbitrage`: a conflict",
      "between requirements, or between a requirement and the Constitution. Never return `approve` with",
      "tests that fail or were not run on the critical path. Run the tests of the crates the diff touches",
      "and of their dependents, in parallel, within a budget of 2 to 3 minutes for a short suite and 10",
      "at most for a long one; the whole workspace is run at the integration of the batch, not at every",
      "verification, and a load, a soak or a chaos sequence is replayed in the dedicated trial of the end",
      "of the milestone only. Replay one mutant per property that enters the specification, never more.",
      "A file changed outside the scope is no violation when the delivery widened the scope to it (the",
      "record says so); a scope widened to a forbidden zone or to a commitment in flight is one.",
      "",
      "You file the verdict yourself, and the session that launched you never does. Before you examine",
      `the diff, claim the mandate with \`${lean} mandat <ENG>\`: it returns the mandate token and freezes the`,
      "fingerprint of the diff. The raw outputs file is the one that `essai` wrote, in the temporary folder",
      "of the system. Write your JSON verdict to a second file of that folder, then file with",
      `\`${lean} verdict <ENG> --jeton J --sens approve|reject|arbitrage --empreinte E --tests "command;command"`,
      '--sorties file --constats verdict.json`, with `--motif-arbitrage "..."` for an arbitrage. The',
      "`violations`, `par_exigence` and `tests` of the JSON are filed with the verdict, one record per mandate; a",
      "rejection with no violation is refused, and the violations are written in the worktree for the rework",
      "(`.eng/REWORK.md`). An approving verdict integrates in the same transaction: merge, held status, push",
      "of master, removal of the worktree. Report what the command answered, word for word.",
      "",
      "The operator is always advised. An `arbitrage` verdict never hands over a bare question:",
      "`motif_arbitrage` states the closed question, at least two options with what each one costs, and",
      "the option you recommend with the reason, so that the DA is filed with its advice. Sort every other",
      "remark in the same way: what the implementor or the coordinator can correct alone is listed as",
      "such and is not addressed to the operator, what needs a decision or a new commitment is named with",
      "its vehicle (DA, ENG or SCP), and what needs no action is listed under `For information, no action",
      "required`. When the delivery changed a document, or left one to change, end with",
      "`Documentation updated`: the documents the delivery changed, and every document that the delivery",
      "makes false or incomplete and did not change, each one named with what is to be written in it, so",
      "that the session that integrates applies it at once. When no document changed and none is left to",
      "change, leave the section out.",
      ""
    ].join("\n")
  };
}
function commandes(_binaire) {
  const lean = "lean";
  const eng = "eng";
  const preambule2 = [
    "",
    `> In this file, \`lean\` and \`eng\` mean \`node ${RUNTIME}/lean.cjs\` and`,
    `> \`node ${RUNTIME}/eng.cjs\`, run from the root of the repository or of the worktree.`
  ];
  const avecPreambule = (texte) => {
    const lignes = texte.split("\n");
    return [lignes[0], ...preambule2, ...lignes.slice(1)].join("\n");
  };
  const brut = construireCommandes(lean, eng);
  const sortie = {};
  for (const [nom, texte] of Object.entries(brut)) {
    const description = DESCRIPTIONS[nom];
    const tete = description ? `---
description: ${JSON.stringify(description)}
---
` : "";
    sortie[nom] = tete + avecPreambule(texte);
  }
  return sortie;
}
var DESCRIPTIONS = {
  "etat.md": "Query the steering state through the lean CLI instead of reading files. Load it BEFORE answering any question about a commitment (ENG-NNNN), a requirement (SPEC-DOM-NNN), an arbitration (DA), a specification change (SCP), a decision (ADR), the frontier, sessions, batches, milestones or environment pitfalls, and before opening, listing or grepping any file of the state tree or of the requirements folder.",
  "eng.md": "Steer commitments: pull the next one from the frontier, report status, draft from the backlog, close a commitment as held or broken. Load it when starting work on the product, when asked what to work on next, or when a commitment must change status.",
  "verify.md": "Verify a delivered commitment under a mandate token and file the verdict. Load it when asked to review, approve or reject the delivery of a commitment.",
  "delta.md": "Change a requirement through a specification change request (SCP). Load it whenever a requirement of the requirements folder must change: a requirement is never edited by hand.",
  "arbitrage.md": "Open or read an arbitration request (DA). Load it when a substantive choice blocks the work, or before settling any question of substance: an agent informs, a named decider settles.",
  "bootstrap.md": "Start steering a product: vision, domains, milestones, first requirements and first commitments. Load it when the project has no domain declared in dossier-recette/02_CODIFICATION.md, no milestone, or no commitment yet, which is the state right after the system is installed, and when `lean conseils` names /bootstrap. Run it with the operator."
};
function construireCommandes(lean, eng) {
  return {
    "bootstrap.md": [
      "# /bootstrap: start steering a product",
      "",
      "Run this ONCE, on a repository that has neither a requirements folder nor milestones. Every step",
      "is taken WITH the operator: an agent informs, it does not decide the product.",
      "",
      `**Step 0, the survey.** \`${lean} conformite\` reports what the repository already carries: rules,`,
      "requirements folder, state tree, commitments and commands. Nothing existing is overwritten.",
      "",
      "**Step 1, the vision.** Ask the operator three questions. Which problem does the product solve,",
      "for whom, and how will we know that it is solved. One sentence per answer, not one page.",
      "",
      "**Step 2, the domains.** List the subsystems with the operator. Each takes a short code, which",
      "becomes the requirement identifier (`SPEC-<CODE>-NNN`). Fill in the table of",
      "`dossier-recette/02_CODIFICATION.md`.",
      "",
      "**Step 3, the milestones.** Turn the objectives into milestones in `<state>/MILESTONES.md`. A",
      "milestone groups requirements and serves as the beneficiary of commitments. Give no delay estimate.",
      "",
      "**Step 4, the first requirements.** For the FIRST milestone only, because the rest of the work is",
      "not specified in advance. Each requirement is written so that it can be verified, with a named",
      "actor and figures. See the writing rules in the repository rules.",
      "",
      `**Step 5, the first commitments.** \`${lean} backlog\` shows what no commitment covers, and`,
      `\`${lean} draft SPEC-...\` files a draft. Complete scope.paths, depends_on and the beneficiary, then run`,
      `\`${lean} verifier\`.`,
      "",
      `**Step 6, the check.** \`${lean} verifier\` must be green, and \`${lean} frontiere\` must offer at least one`,
      "commitment ready to pull. Without that, no session can start.",
      ""
    ].join("\n"),
    "etat.md": [
      "# /etat: query the state, and know what to do",
      "",
      "Nothing here mutates anything. These commands read without the lock and without risk.",
      "**Always start with `conseils`.** The others answer a precise question, and this one tells you",
      "which question is being asked.",
      "",
      "## Reading one thing: never by hand",
      "",
      "A file of the state tree carries the record, never the computed state (frozen, waiting, ready,",
      "under lease). Reading it with `cat`, `ls` or `grep` is refused by the `guard_lecture` hook. Ask:",
      "",
      `- \`${lean} show ENG-NNNN [--json]\` gives the record of a commitment AND its computed state, its`,
      "  dependencies with their state, what it unblocks, the status of its requirements and its report.",
      `- \`${lean} show SPEC-DOM-NNN\` gives the text of a requirement, its status, and the commitments`,
      `  that carry it. \`${lean} show DA-NNNN\`, \`SCP-NNNN\` and \`ADR-NNNN\` give those documents and their links.`,
      `- \`${lean} search <terms> [--genre engagement|spec|da|scp|adr] [--statut S] [--json]\` finds what`,
      "  matches every term, ignoring case and accents. Use it instead of filtering `etat` with a script.",
      `- \`${lean} pitfalls <terms>\` returns only the sections of the environment pitfalls that`,
      "  concern your problem (for example `wsl path`). Read them before fighting the environment.",
      "",
      "## Steering questions",
      "",
      `- \`${lean} conseils [--json]\` lists what calls for action NOW. Each entry carries the observation,`,
      "  its reason, and the exact command. Three severities, in this order: `bloquant` (nothing moves",
      "  until it is handled), `attente` (someone is waiting for an answer), and `hygiene`. An empty list",
      "  means that nothing is due.",
      `- \`${lean} etat\` gives the full projection. \`${lean} dashboard\` renders the board.`,
      `- \`${lean} frontiere\` lists the commitments **ready to pull now**, dependencies satisfied. That is`,
      "  where work is taken, and nowhere else.",
      `- \`${lean} sessions\` shows what is **under way**, by whom, and the state of the leases.`,
      `- \`${lean} lots [--json]\` gives the **parallel batches** and their mutual exclusions. Two commitments`,
      "  whose `scope.paths` overlap are not pulled together, because they would rebase on each other.",
      "  Ask before starting several sessions.",
      `- \`${lean} arbitrages [--toutes] [--json]\` lists arbitration requests, **open ones by default**.`,
      "  `--toutes` adds those already settled, with their ADR.",
      `- \`${lean} streams [--json]\` lists the **streams** the repository declares: the domains each one`,
      "  owns, the folder of its requirements, the paths it owns, and its commitments by state. A",
      "  commitment belongs to the stream of its domains, and `show` names it. A repository that declares",
      "  no stream has one implicit stream that owns everything. `frontiere`, `lots`, `sessions`,",
      "  `conseils` and `dashboard` group by stream and take `--stream NAME`. A file that another stream",
      `  owns is asked of that stream: \`${eng} request-change --paths "a,b" --reason "why"\`.`,
      `- \`${lean} impact ENG-NNNN\` states what this commitment unblocks, and what it freezes.`,
      `- \`${lean} lignees\` shows breakage that propagates. \`${lean} backlog\` shows the work left to do.`,
      `- \`${eng} contexte [--json]\` reports, from a worktree, what concerns THIS session.`,
      "",
      "## When a resequencing is needed",
      "",
      "You do not guess it. `conseils` says so, and gives the command. There are three cases.",
      "",
      "1. **Frozen by upstream breakage.** A commitment depends on one marked `rompu`, or replaced by one",
      "   that is (a predecessor marked `abandonne` holds nothing back, and one marked `remplace` is read",
      "   through its `remplace_par`). It will NEVER",
      `   become ready on its own. The gesture is \`${lean} resequencer ENG-NNNN --deps "..."\`, to attach it`,
      "   to what actually carries it, or a variance if the work is no longer due.",
      "2. **Path collision between ready commitments.** Reported at pull time and by `lots`. This is not",
      "   a blocker, it is a serialisation. Pull one, deliver it, then pull the other.",
      "3. **Bottleneck.** The frontier empties while the work left does not shrink. `conseils` names the",
      "   commitment that unblocks the most, and that is the one to push through.",
      "",
      "A resequencing changes the graph, so it is an operator gesture and not an agent initiative. If you",
      "believe that one is needed and `conseils` does not offer it, open an arbitration request",
      "(`/arbitrage`) rather than rewiring the dependencies yourself.",
      ""
    ].join("\n"),
    "eng.md": [
      "# /eng: steering commitments",
      "",
      "The mutation lock is the authority. Every gesture below is a transaction.",
      "",
      `Before deciding anything, run \`${lean} conseils\` (see \`/etat\`). It states what is due, and whether a`,
      "resequencing is required.",
      "",
      `- \`next\` runs \`${lean} verifier\` then \`${lean} frontiere\`. Offer the first commitment to the operator with`,
      `  its record. On agreement, run \`${eng} pull <ENG> --promettant <name>\`. The transaction places the`,
      "  claims, the `pris` status, the worktree and the lease, atomically, then commits its records and",
      "  pushes master by itself: a take protects the work only once the remote holds it. Its output says",
      "  `published`, or `NOT PUBLISHED` with the cause, and that cause is then removed and master pushed",
      "  by hand. The same holds for a delivery, a blocker, a release and a decision. The work is done in",
      "  a live session pointed at the worktree that was returned.",
      "- Every change made by hand to the steering state is published at once, before anything else: a",
      "  draft completed, a commitment amended, narrowed or withdrawn, a precedence rewired, a milestone",
      `  planned, a DA or an SCP written. Run \`${lean} verifier\`, then`,
      `  \`${lean} publier "chore(steering): what changed and why [ENG-NNNN]"\`, which commits the state tree and`,
      "  pushes master. Until then another workstation reads the former state and can take the commitment",
      "  as it stood.",
      "- Prior work is read before any work starts. The pull reads the remote and refuses with `prior_work`",
      "  a commitment that the remote shows taken, closed or worked on elsewhere: merge the remote master,",
      `  read \`${lean} show <ENG>\` and \`${lean} rapport <ENG>\`, and pull again only if the work is still`,
      '  due, with `--acknowledged "what exists, and why the work is still due"`. The pull also lists the',
      "  similar commitments of the registry, and the context pack repeats them: the session reads their",
      `  records and reports before it writes. \`${lean} prior <ENG>\` gives the same answer at any time, and`,
      "  is run on every commitment that is opened by hand, before it is committed.",
      `- \`status\` runs \`${lean} dashboard\`, then summarises the arbitrations awaiting an answer, the`,
      `  anomalies, the commitments in flight, and the state of the leases (\`${lean} sessions\`).`,
      `- \`backlog [DOM]\` runs \`${lean} backlog [--domaine DOM]\`, the objective work left in the requirements`,
      "  folder. Formalise only what approaches the frontier.",
      `- \`draft SPEC-ID...\` runs \`${lean} draft <IDs>\`. Complete the draft (scope.paths, depends_on,`,
      `  beneficiary), then finish with \`${lean} verifier\`.`,
      "- `tenu ENG-NNNN` needs no gesture after an approving verdict: `/verify` merges, marks the commitment",
      `  \`tenu\`, pushes master and removes the worktree in one transaction. \`${lean} integrer ENG-NNNN\` repeats that`,
      "  transaction when it was refused, once the cause named by the refusal is removed.",
      "- The chain runs without the operator: pull, implementation in the worktree, `eng push --livraison`,",
      "  then `/verify` at once by the `verifier` subagent that the delivering session launches (a subagent",
      "  starts from a clean context, so it did not implement), then the automatic integration and push.",
      "- A delivery report opens with `## Result`, whose first line is `PASS` or `FAIL` against the definition",
      "  of done. The session closes alone every open point it can close inside its scope, drafts the",
      "  others in full under `## Open points that need someone else` (a DA with its options and the option",
      "  recommended, an ENG, or an SCP), and puts the rest under `## For information, no action required`.",
      "  The delivery command answers in the same three blocks.",
      "- When a delivery report or a verdict concludes that a structuring decision is needed or that new",
      "  commitments must be opened, file them at once, without waiting for the operator: reserve the",
      `  numbers (\`${lean} numero DA|ENG|SCP\`; \`${lean} modele DA|ENG|SCP\` prints the template and the latest`,
      "  record of the family as an example), open the DA with its options and the option recommended",
      "  (`/arbitrage`), write the commitments with their scope, their definition of done and their",
      `  dependencies, then run \`${lean} verifier\`. Filing is orchestration and is never handed to the`,
      "  operator. Settling is not: the operator decides the DA, and acts on the commitments.",
      "- Documentation follows the work. When a commitment, a DA or an SCP that completes makes a document",
      "  false or incomplete, update it at once, and apply at once what a report drafted for a document",
      "  outside the scope of its session. When a document changed, or one is left to change, the report",
      "  and the closing message end with `## Documentation updated`: one line per document changed and",
      "  what changed in it, then what is still to be applied and by whom. When no document changed and",
      "  none is left to change, the section is left out: nothing is written in its place.",
      `- \`${lean} abandonner ENG-NNNN --motif "..."\` and \`${lean} remplacer ENG-NNNN --par ENG-XXXX\` close a`,
      "  record without a broken promise: withdrawn (its work void, done elsewhere or no longer wanted), or",
      "  carried by another record; neither counts in the PPC, and the obeya hides both.",
      "- `rompu ENG-NNNN <reason>` sets the status to `rompu` with its variance, runs",
      `  \`${lean} relacher ENG-NNNN\`, then shows the impact (\`${lean} impact\`) and proposes a new commitment if`,
      "  the work is still due.",
      "",
      `From a worktree under lease, a session asks what concerns it with \`${eng} contexte\`: its state, and`,
      `the next step. Before pulling a SECOND commitment in parallel, check \`${lean} lots\`, because two`,
      "overlapping scopes have to be serialised.",
      ""
    ].join("\n"),
    "verify.md": [
      "# /verify: verifying a delivery",
      "",
      "Whoever implements never judges. The verdict requires a MANDATE token, distinct from the lease,",
      "on a diff whose fingerprint is frozen.",
      "",
      `1. \`${lean} mandat ENG-NNNN\` issues the mandate and freezes the fingerprint of the diff.`,
      "2. Compare the diff against the definition of done, the requirements cited, and the Constitution.",
      `   Run every test through \`${lean} essai "command" --sorties file\`: it records the command, its`,
      "   output and its exit code in the raw outputs file.",
      `3. \`${lean} verdict ENG-NNNN --jeton J --sens approve|reject|arbitrage --empreinte E`,
      '   --tests "command;command" --sorties file --constats verdict.json`. Every test cited must have',
      "   been run through `essai`, a red test is never approved, and a rejection names at least one",
      "   violation in the JSON of `--constats`; otherwise the verdict is refused. One verdict record is",
      "   kept per mandate, and a rejection writes `.eng/REWORK.md` in the worktree.",
      "4. On `approve`, the verdict integrates in the same transaction: the branch is merged into master,",
      "   the commitment is marked `tenu`, the lease and the claims are settled, the steering record is",
      "   committed, master is pushed to its remote, and the worktree and its branch are removed. Merge",
      "   nothing and push nothing by hand.",
      "5. If the integration is refused (conflict, uncommitted work, main checkout off master), the verdict",
      `   stands and the refusal names the gesture. Once the cause is removed, run \`${lean} integrer ENG-NNNN\`.`,
      "",
      "**A mandate that is already open.** A second claim is refused (`mandat_deja_reclame`) while a mandate",
      "is open, because a verifier holds it. If that verifier is dead, the mandate is stale, and there is",
      "one path and no other:",
      "",
      `- Read it, never touch it: \`${lean} mandat ENG-NNNN --etat\` gives its number, its issue time and`,
      "  its expiry. You never edit, move or delete the mandate record, you never wait for the expiry in",
      "  silence, and you never file a verdict under a token you did not claim.",
      "- Tell the operator what you read, and why you hold the verifier to be dead. Voiding a mandate is",
      "  the gesture of the operator alone, because it throws away the work of a verifier that may still",
      "  be alive. It is offered by the cockpit only (`Lean: void a verification mandate`, also in the",
      "  menu of a commitment under verification), behind a confirmation that names the mandate and its",
      "  age. No command line voids a mandate, and no flag stands for the confirmation of the operator.",
      `- Once the operator has voided it, \`${lean} mandat ENG-NNNN\` issues its successor, and the`,
      "  verification starts again from the diff as it stands. A verdict filed under the voided mandate",
      "  is refused (`mandat_revoque`): the verifier that receives that refusal stops and says so.",
      "",
      "A delivery is verified as soon as it is pushed, by a verifier that did not implement it. The",
      "session that delivered launches the `verifier` subagent itself: a subagent starts from a clean",
      "context, and that is the independence the rule asks for. The operator is asked neither to trigger",
      "the verification nor to carry out the merge or the push.",
      "",
      "The verdict command answers with three blocks: the result (PASS, FAIL or HELD FOR ARBITRATION) with",
      "the commitment restated, what is required from you, and what is for information only. Your closing",
      "message to the operator keeps that order, and before you write it you settle the open points:",
      "",
      "- A point you can close alone, with no effect on a requirement, a milestone, an interface or a",
      "  scope, is closed now. It is never handed to the operator.",
      "- A point you cannot close alone is filed at once, without waiting for the operator, under a",
      "  reserved number. That holds for the conclusion of the report as well, when it calls for a",
      "  structuring decision or for new commitments: a substantive choice as a DA with",
      "  its options and your recommendation (`/arbitrage`), work that remains as a commitment",
      `  (\`${lean} numero ENG\`), a change of requirement as an SCP (\`/delta\`).`,
      "- What needs no action is stated under a heading that says so: for information, no action required.",
      '- An `arbitrage` verdict takes `--motif-arbitrage "..."`, and the DA is filed at once.',
      "- A document that the delivery makes false or incomplete, and that lies outside the scope of the",
      "  session that delivered, is updated now from the draft of the report. When a document changed, or",
      "  one is left to change, your closing message ends with `## Documentation updated`: one line per",
      "  document changed and what changed in it, then what is still to be applied and by whom. When no",
      "  document changed and none is left to change, leave the section out.",
      ""
    ].join("\n"),
    "delta.md": [
      "# /delta: changing a specification",
      "",
      "A requirement is modified ONLY by an accepted SCP. Never by hand, and never from a form.",
      "",
      `1. \`${lean} numero SCP\` reserves the identifier from the authority, and \`${lean} modele SCP\` prints the`,
      "   template with the latest SCP as an example: read nothing else to learn the form.",
      "2. Write the SCP to the template: intent (from the product point of view, with no solution), scope",
      "   and non-goals, the proposed modification, **a concrete example**, and validation.",
      "3. Acceptance is an operator gesture. It authorises the change to the requirements folder, it does",
      "   not write it.",
      "4. Once the SCP is accepted, the change is written at once, by the session that holds the role for",
      "   it: the requirement, then every document that the change makes false or incomplete. It is never",
      "   left for a later pass. When a document changed, the closing message ends with",
      "   `## Documentation updated`: one line per document changed and what changed in it, then what is",
      "   still to be applied and by whom. When no document changed, leave the section out.",
      ""
    ].join("\n"),
    "arbitrage.md": [
      "# /arbitrage: arbitration request",
      "",
      "A DA asks a CLOSED question of a named decider. An agent informs, it does not settle.",
      "",
      `What is already filed: \`${lean} arbitrages\` for the open ones, or \`--toutes\` to add those settled, with`,
      "the ADR that settled them. Read them before opening a new one, because the question may already",
      "have its answer.",
      "",
      `1. \`${lean} numero DA\` reserves the identifier, and \`${lean} modele DA\` prints the template with the`,
      "   latest request as an example: read nothing else to learn the form.",
      "2. Investigate before you ask. Then write the request for a reader who has none of your context:",
      "   the decider reads the page of the request and nothing else. Explain every identifier at its",
      "   first use, in plain words, and state what the product does today before what went wrong.",
      "3. An open DA passes a gate where it is written, and it is refused until it holds all of this:",
      "   - `## Context`, at least 300 characters: what the product does today, what happened, and why",
      "     that is a problem.",
      "   - `## What is at stake`: what waits for the decision, and what happens if it is not taken.",
      "   - `## Closed question`: one question, with its question mark, answered by naming an option.",
      "   - `## Options and consequences`: **at least two options**, each with what it changes and what it",
      "     costs. They are read from paragraphs opened by `**A. Title.**` followed by the consequences,",
      "     from a table with one column per option (`A: title`) whose rows are the criteria, or from a",
      "     list `- A: Title. Consequences`.",
      "   - `## Recommendation`, which opens with **the option you recommend**, then why.",
      "   - The fallback in the header (`defaut_si_silence` or `escalade`).",
      "   A concrete example is asked for as well, under `## Concrete example`; the gate does not check it.",
      `   The gate reads what the page of the decider shows, and \`${lean} conseils\` names any open request`,
      "   that does not pass it. The gate measures that each part is written, never that it is understood.",
      "4. **A request returned for study.** The decider who cannot decide on a request sends it back, with",
      `   the reason. \`${lean} conseils\` then names it, and \`${lean} show DA-NNNN\` gives the reason under`,
      "   `## Returned for study`. You do not settle the question and you do not patch a sentence: you",
      "   investigate the problem again, from the code and the records, and you rewrite the context, the",
      `   stake and the options. Then \`${lean} republier DA-NNNN\` puts the request back to its decider. It`,
      "   refuses a request that reads as it did when it was returned, and one that does not pass the gate.",
      "5. A commitment blocked on a choice of substance has no question of its own: its `BLOCKED.md` is",
      "   written with the sections of a request, and its delivery files it as DA-NNNN, open, under a",
      `   reserved number. Nothing is answered from the page of the commitment. \`${lean} arbitrer ENG-NNNN\``,
      "   files the request from a report delivered before this rule. The session that waits runs",
      `   \`${eng} attendre DA-NNNN\` in the background: the decision wakes it, and it resumes by itself.`,
      `6. The decision is a human gesture: \`${lean} decider DA-NNNN --choix X --motif "..."\`, which produces`,
      "   the ADR and settles the commitment to answer.",
      "7. Once the DA is decided, what the decision implies is carried out at once, without waiting for the",
      "   operator: the commitments it calls for are filed under reserved numbers, the change of",
      "   requirement it calls for is filed as an SCP (`/delta`), and every document that the decision",
      "   makes false or incomplete is updated. When a document changed, the closing message ends with",
      "   `## Documentation updated`: one line per document changed and what changed in it, then what is",
      "   still to be applied and by whom. When no document changed, leave the section out.",
      ""
    ].join("\n")
  };
}
function squelette() {
  return {
    "agents.yaml": "# Flotte : plafond de sessions simultan\xE9es et pause globale.\nmax_live: 3\npaused: false\n",
    "claims.yaml": "# R\xE9servations de scope par engagement. G\xE9r\xE9 par l'outil, ne pas \xE9diter \xE0 la main.\nclaims: []\n",
    "config.yaml": [
      "# R\xE9gimes de contr\xF4le. Ils avertissent par d\xE9faut et ne bloquent que sur d\xE9cision.",
      "fraicheur_bloquante: false",
      "collision_chemins_bloquante: false",
      "doc_bloquante: false",
      "mandat_ttl_minutes: 120",
      "ruptures_lignee_avant_da: 3",
      "langue_bloquante: false          # refuser une ecriture qui parait ne pas etre en anglais",
      "question_bloquante: true         # refuse a blocker report delivered with no option or no recommendation",
      ""
    ].join("\n"),
    "MILESTONES.md": [
      "# Jalons ma\xEEtres",
      "",
      "| Jalon | Intitul\xE9 | Exigences |",
      "|---|---|---|",
      "",
      "> Un jalon groupe des exigences et sert de b\xE9n\xE9ficiaire aux engagements.",
      ""
    ].join("\n")
  };
}
var DOSSIERS_ETAT = ["ENG", "DA", "SCP", "ADR", "livraisons", "runs", "journal", "captures"];
function cheminManifeste(racine) {
  return path22.join(racine, MANIFESTE);
}
function lireManifeste(racine) {
  const p = cheminManifeste(racine);
  if (!fs25.existsSync(p)) return null;
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return null;
  }
}
function etatAncienNom(racine) {
  return fs25.existsSync(path22.join(racine, ".agelaios", "orchestration", "ENG")) || fs25.existsSync(path22.join(racine, ".agelaios", "ENG"));
}
function estInstalle(racine) {
  return estPoseLean(racine) || estPosePython(racine);
}
function estPoseLean(racine) {
  return fs25.existsSync(path22.join(racine, ".agenticLEAN")) || fs25.existsSync(path22.join(racine, RUNTIME, "lean.cjs")) || lireManifeste(racine) !== null;
}
function estPosePython(racine) {
  return fs25.existsSync(path22.join(racine, "agentic_orchestrator", "management"));
}
function hooksPython(racine) {
  const settings = path22.join(racine, ".claude", "settings.json");
  if (!fs25.existsSync(settings)) return [];
  let doc;
  try {
    doc = JSON.parse(lireTexte(settings));
  } catch {
    return [];
  }
  const sortie = [];
  const hooks = doc.hooks ?? {};
  for (const [evenement, groupes] of Object.entries(hooks)) {
    for (const g of groupes ?? []) {
      for (const h of g.hooks ?? []) {
        const c = String(h.command ?? "");
        if (/agentic_orchestrator[\/\\]hooks/.test(c)) sortie.push({ evenement, commande: c });
      }
    }
  }
  return sortie;
}
var SUCCESSEURS = {
  "agelaios-bootstrap.md": "bootstrap.md"
};
function commandesPython(racine) {
  const dossier = path22.join(racine, ".claude", "commands");
  if (!fs25.existsSync(dossier)) return [];
  const sortie = [];
  for (const nom of fs25.readdirSync(dossier)) {
    if (!nom.endsWith(".md")) continue;
    try {
      const texte = lireTexte(path22.join(dossier, nom));
      if (/agentic_orchestrator[\/\\]scripts|eng_client\.py|obeya\.py/.test(texte)) sortie.push(nom);
    } catch {
    }
  }
  return sortie;
}
function planReprise(racine, binaire) {
  const etapes = [];
  const existe = (p) => fs25.existsSync(p);
  const pythons = hooksPython(racine);
  if (pythons.length) {
    etapes.push({
      action: "json",
      cible: ".claude/settings.json",
      raison: `${pythons.length} hook(s) Python d\xE9branch\xE9(s) et remplac\xE9(s) par les hooks du cockpit ; les autres restent`
    });
  } else {
    etapes.push({
      action: existe(path22.join(racine, ".claude", "settings.json")) ? "json" : "creer",
      cible: ".claude/settings.json",
      raison: "les six hooks du cockpit : scope, style, identit\xE9, lecture, rapport, contexte de session"
    });
  }
  const aRemplacer = new Set(commandesPython(racine));
  for (const nom of Object.keys(commandes(binaire))) {
    const present = existe(path22.join(racine, ".claude", "commands", nom));
    etapes.push({
      action: !present || aRemplacer.has(nom) ? "creer" : "rien",
      cible: `.claude/commands/${nom}`,
      raison: aRemplacer.has(nom) ? "pilote encore le bloc Python : remplac\xE9e (l'ancienne est gard\xE9e en .python.bak)" : present ? "d\xE9j\xE0 pr\xE9sente : laiss\xE9e intacte" : "commande de session"
    });
  }
  for (const nom of aRemplacer) {
    if (Object.keys(commandes(binaire)).includes(nom)) continue;
    const successeur = SUCCESSEURS[nom];
    etapes.push({
      action: successeur ? "creer" : "rien",
      cible: `.claude/commands/${nom}`,
      raison: successeur ? `pilote le bloc Python : reprise par ${successeur} (l'ancienne est gard\xE9e en .python.bak)` : "pilote le bloc Python mais n'a pas d'\xE9quivalent ici : \xE0 traiter \xE0 la main"
    });
  }
  etapes.push({
    action: existe(path22.join(racine, "CLAUDE.md")) ? "bloc" : "creer",
    cible: "CLAUDE.md",
    raison: "r\xE8gles agents du cockpit, encadr\xE9es par des marques et retirables"
  });
  const citent = reglesQuiCitentPython(racine);
  if (citent.length) {
    etapes.push({
      action: "rien",
      cible: "CLAUDE.md (r\xE8gles du d\xE9p\xF4t)",
      raison: `${citent.length} ligne(s) citent encore le bloc Python (lignes ${citent.slice(0, 8).join(", ")}) : \xE0 amender \xE0 la main, les r\xE8gles d'un op\xE9rateur ne sont jamais r\xE9\xE9crites`
    });
  }
  etapes.push(...etapesRuntimeEtCrochets(racine));
  etapes.push({ action: "creer", cible: MANIFESTE.split("\\").join("/"), raison: "ce que la reprise a fait, pour pouvoir le d\xE9faire" });
  etapes.push({
    action: "rien",
    cible: "agentic_orchestrator/",
    raison: "d\xE9branch\xE9, jamais supprim\xE9 : la suppression reste un geste d'op\xE9rateur"
  });
  return { racine, deja: false, reprise: true, etapes };
}
function planInstallation(racine, binaire) {
  const etapes = [];
  const etat = path22.join(racine, ".lean-engine", "orchestration");
  const existe = (p) => fs25.existsSync(p);
  if (!estPoseLean(racine) && etatAncienNom(racine)) {
    return {
      racine,
      deja: true,
      etapes: [
        {
          action: "rien",
          cible: ".agelaios/orchestration/",
          raison: "the state tree lives under the previous name of the runtime: run `lean migrer` first, commit, then install"
        }
      ]
    };
  }
  if (estPoseLean(racine)) {
    return { racine, deja: true, etapes: [{ action: "rien", cible: rel2(racine, etat), raison: "le syst\xE8me est d\xE9j\xE0 pos\xE9 ici" }] };
  }
  if (estPosePython(racine)) return planReprise(racine, binaire);
  etapes.push({
    action: existe(etat) ? "rien" : "creer",
    cible: ".lean-engine/orchestration/",
    raison: existe(etat) ? "state tree already present: kept as it is" : "state tree: ENG, DA, SCP, ADR, deliveries"
  });
  for (const f of Object.keys(squelette())) {
    const present = existe(path22.join(etat, f));
    etapes.push({ action: present ? "rien" : "creer", cible: `.lean-engine/orchestration/${f}`, raison: present ? "d\xE9j\xE0 pr\xE9sent : laiss\xE9 intact" : "squelette de pilotage" });
  }
  for (const [nom] of Object.entries(commandes(binaire))) {
    const cible = `.claude/commands/${nom}`;
    etapes.push({
      action: existe(path22.join(racine, ".claude", "commands", nom)) ? "rien" : "creer",
      cible,
      raison: existe(path22.join(racine, ".claude", "commands", nom)) ? "d\xE9j\xE0 pr\xE9sente : laiss\xE9e intacte" : "commande de session"
    });
  }
  for (const nom of Object.keys(agents())) {
    const present = existe(path22.join(racine, ".claude", "agents", nom));
    etapes.push({
      action: present ? "rien" : "creer",
      cible: `.claude/agents/${nom}`,
      raison: present ? "already present: left as it is" : "agent definition"
    });
  }
  etapes.push({
    action: existe(path22.join(racine, ".claude", "settings.json")) ? "json" : "creer",
    cible: ".claude/settings.json",
    raison: "six hooks : scope, style, identit\xE9, lecture, rapport, contexte de session, cit\xE9s en relatif"
  });
  etapes.push(...etapesRuntimeEtCrochets(racine));
  etapes.push({
    action: existe(path22.join(racine, "CLAUDE.md")) ? "bloc" : "creer",
    cible: "CLAUDE.md",
    raison: existe(path22.join(racine, "CLAUDE.md")) ? "un bloc encadr\xE9 est ajout\xE9 ; les r\xE8gles existantes ne sont pas touch\xE9es" : "r\xE8gles agents"
  });
  if (!existe(path22.join(racine, "dossier-recette"))) {
    etapes.push({ action: "creer", cible: "dossier-recette/02_CODIFICATION.md", raison: "table des domaines, \xE0 compl\xE9ter" });
  }
  etapes.push({ action: "creer", cible: MANIFESTE.split("\\").join("/"), raison: "trace exacte de ce qui a \xE9t\xE9 pos\xE9, pour un retrait propre" });
  return { racine, deja: false, etapes };
}
function entreesHooks(_binaire) {
  const cmd = (nom, args = "") => ({
    type: "command",
    command: `node "$CLAUDE_PROJECT_DIR/${RUNTIME}/hooks/${nom}.cjs"${args}`
  });
  return {
    SessionStart: [{ hooks: [cmd("session_context")] }],
    PreToolUse: [
      { matcher: "Edit|Write", hooks: [cmd("guard_scope"), cmd("guard_style")] },
      { matcher: "Bash", hooks: [cmd("guard_identite", " pretooluse")] },
      { matcher: "Bash|PowerShell|Grep|Glob", hooks: [cmd("guard_lecture")] }
    ],
    Stop: [{ hooks: [cmd("require_report")] }]
  };
}
function reprendre(racine, binaire) {
  if (estPoseLean(racine)) return { ok: false, erreur: "ce cockpit tient d\xE9j\xE0 les commandes ici", faits: [] };
  if (!estPosePython(racine)) return { ok: false, erreur: "aucun bloc Python \xE0 reprendre ici", faits: [] };
  const absents = runtimeAbsent(binaire);
  if (absents.length) return { ok: false, erreur: `le paquet ne porte pas : ${absents.join(", ")}`, faits: [] };
  const faits = [];
  const manifeste = {
    version: 1,
    pose_le: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19) + "+00:00",
    fichiersCrees: [],
    dossiersCrees: [],
    blocsAjoutes: [],
    clesJson: [],
    hooksPythonRetires: [],
    commandesRemplacees: []
  };
  const aRemplacer = new Set(commandesPython(racine));
  const dossierCmd = path22.join(racine, ".claude", "commands");
  fs25.mkdirSync(dossierCmd, { recursive: true });
  let posees = 0;
  let remplacees = 0;
  for (const [nom, contenu] of Object.entries(commandes(binaire))) {
    const cible = path22.join(dossierCmd, nom);
    if (fs25.existsSync(cible)) {
      if (!aRemplacer.has(nom)) continue;
      const sauvegarde = cible + ".python.bak";
      if (!fs25.existsSync(sauvegarde)) fs25.copyFileSync(cible, sauvegarde);
      ecrireCommeAvant(cible, contenu);
      manifeste.commandesRemplacees.push({ fichier: rel2(racine, cible), sauvegarde: rel2(racine, sauvegarde) });
      remplacees += 1;
      continue;
    }
    ecrireCommeAvant(cible, contenu);
    manifeste.fichiersCrees.push(rel2(racine, cible));
    posees += 1;
  }
  for (const [nom, contenu] of Object.entries(agents())) {
    const cible = path22.join(racine, ".claude", "agents", nom);
    if (fs25.existsSync(cible)) continue;
    if (!fs25.existsSync(path22.dirname(cible))) {
      fs25.mkdirSync(path22.dirname(cible), { recursive: true });
      manifeste.dossiersCrees.push(rel2(racine, path22.dirname(cible)));
    }
    ecrireCommeAvant(cible, contenu);
    manifeste.fichiersCrees.push(rel2(racine, cible));
  }
  for (const [ancienne, successeur] of Object.entries(SUCCESSEURS)) {
    if (!aRemplacer.has(ancienne)) continue;
    const contenu = commandes(binaire)[successeur];
    if (!contenu) continue;
    const cible = path22.join(dossierCmd, ancienne);
    const sauvegarde = cible + ".python.bak";
    if (!fs25.existsSync(sauvegarde)) fs25.copyFileSync(cible, sauvegarde);
    ecrireCommeAvant(cible, contenu);
    manifeste.commandesRemplacees.push({ fichier: rel2(racine, cible), sauvegarde: rel2(racine, sauvegarde) });
    remplacees += 1;
  }
  faits.push(`${remplacees} commande(s) reprise(s), ${posees} pos\xE9e(s)`);
  const orphelines = [...aRemplacer].filter(
    (n) => !Object.keys(commandes(binaire)).includes(n) && !SUCCESSEURS[n]
  );
  if (orphelines.length) {
    faits.push(`${orphelines.length} commande(s) Python sans \xE9quivalent, laiss\xE9e(s) telle(s) quelle(s) : ${orphelines.join(", ")}`);
  }
  const settings = path22.join(racine, ".claude", "settings.json");
  let doc = {};
  if (fs25.existsSync(settings)) {
    try {
      doc = JSON.parse(lireTexte(settings));
    } catch {
      return { ok: false, erreur: ".claude/settings.json est illisible : corrige-le avant de reprendre", faits };
    }
  }
  noterAvant(manifeste, racine, settings);
  manifeste.hooksPreexistants = Object.prototype.hasOwnProperty.call(doc, "hooks");
  manifeste.hooksAvant = JSON.parse(JSON.stringify(doc.hooks ?? {}));
  const existants = doc.hooks ?? {};
  const estPython = (g) => {
    const groupe = g;
    return (groupe.hooks ?? []).some((h) => /agentic_orchestrator[\/\\]hooks/.test(String(h.command ?? "")));
  };
  let debranches = 0;
  for (const evenement of Object.keys(existants)) {
    const avant = existants[evenement] ?? [];
    for (const g of avant) {
      if (!estPython(g)) continue;
      for (const h of g.hooks ?? []) {
        manifeste.hooksPythonRetires.push({ evenement, commande: String(h.command ?? "") });
      }
    }
    existants[evenement] = avant.filter((g) => !estPython(g));
    debranches += avant.length - existants[evenement].length;
    if (!existants[evenement].length) delete existants[evenement];
  }
  for (const [evenement, groupes] of Object.entries(entreesHooks(binaire))) {
    const liste = Array.isArray(existants[evenement]) ? existants[evenement] : [];
    for (const groupe of groupes) {
      liste.push(groupe);
      manifeste.clesJson.push({ fichier: rel2(racine, settings), chemin: `hooks.${evenement}` });
    }
    existants[evenement] = liste;
  }
  doc.hooks = existants;
  if (!fs25.existsSync(settings)) manifeste.fichiersCrees.push(rel2(racine, settings));
  ecrireCommeAvant(settings, JSON.stringify(doc, null, 2) + "\n");
  faits.push(
    `${manifeste.hooksPythonRetires.length} hook(s) Python d\xE9branch\xE9(s) en ${debranches} groupe(s), les hooks du cockpit pos\xE9s`
  );
  const claude = path22.join(racine, "CLAUDE.md");
  const bloc = blocRegles(binaire);
  if (fs25.existsSync(claude)) {
    const texte = lireTexte(claude);
    if (bornesBloc(texte) === null) {
      noterAvant(manifeste, racine, claude);
      ecrireCommeAvant(claude, texte.replace(/\s*$/, "\n\n") + bloc);
      manifeste.blocsAjoutes.push("CLAUDE.md");
      faits.push("bloc de r\xE8gles ajout\xE9 au CLAUDE.md, le reste intact");
    }
  } else {
    ecrireCommeAvant(claude, bloc);
    manifeste.fichiersCrees.push("CLAUDE.md");
    faits.push("CLAUDE.md cr\xE9\xE9");
  }
  poserRuntimeEtCrochets(racine, binaire, manifeste, faits);
  const citent = reglesQuiCitentPython(racine);
  if (citent.length) {
    faits.push(
      `${citent.length} ligne(s) des r\xE8gles du CLAUDE.md citent encore le bloc Python (lignes ${citent.slice(0, 8).join(", ")}) : \xE0 amender \xE0 la main, elles ne sont pas r\xE9\xE9crites`
    );
  }
  const cheminM = cheminManifeste(racine);
  const dossierM = path22.dirname(cheminM);
  if (!fs25.existsSync(dossierM)) {
    fs25.mkdirSync(dossierM, { recursive: true });
    manifeste.dossiersCrees.push(rel2(racine, dossierM));
  }
  ecrireCommeAvant(cheminM, JSON.stringify(manifeste, null, 2) + "\n");
  faits.push("manifeste \xE9crit : la reprise est r\xE9versible");
  faits.push("agentic_orchestrator/ est d\xE9branch\xE9, pas supprim\xE9 : v\xE9rifie avant de le retirer");
  return { ok: true, faits, manifeste: rel2(racine, cheminM) };
}
function installer(racine, binaire) {
  if (!estPoseLean(racine) && etatAncienNom(racine)) {
    return {
      ok: false,
      erreur: "the state tree lives under .agelaios/, the previous name of the runtime: run `lean migrer` first, commit, then install",
      faits: []
    };
  }
  if (estPosePython(racine) && !estPoseLean(racine)) return reprendre(racine, binaire);
  if (estInstalle(racine)) return { ok: false, erreur: "le syst\xE8me est d\xE9j\xE0 pos\xE9 dans ce d\xE9p\xF4t", faits: [] };
  const absents = runtimeAbsent(binaire);
  if (absents.length) return { ok: false, erreur: `le paquet ne porte pas : ${absents.join(", ")}`, faits: [] };
  const manifeste = {
    version: 1,
    pose_le: (/* @__PURE__ */ new Date()).toISOString().slice(0, 19) + "+00:00",
    fichiersCrees: [],
    dossiersCrees: [],
    blocsAjoutes: [],
    clesJson: []
  };
  const faits = [];
  const creerDossier = (p) => {
    const base = path22.resolve(racine);
    const manquants = [];
    let courant = path22.resolve(p);
    while (courant !== base && courant.startsWith(base) && !fs25.existsSync(courant)) {
      manquants.push(courant);
      const parent = path22.dirname(courant);
      if (parent === courant) break;
      courant = parent;
    }
    if (!manquants.length) return;
    fs25.mkdirSync(p, { recursive: true });
    for (const d of manquants) manifeste.dossiersCrees.push(rel2(racine, d));
  };
  const creerFichier = (p, contenu) => {
    if (fs25.existsSync(p)) return false;
    creerDossier(path22.dirname(p));
    ecrireCommeAvant(p, contenu);
    manifeste.fichiersCrees.push(rel2(racine, p));
    return true;
  };
  const etat = path22.join(racine, ".lean-engine", "orchestration");
  creerDossier(path22.dirname(etat));
  creerDossier(etat);
  for (const d of DOSSIERS_ETAT) creerDossier(path22.join(etat, d));
  for (const [nom, contenu] of Object.entries(squelette())) creerFichier(path22.join(etat, nom), contenu);
  faits.push("arbre d'\xE9tat pos\xE9 sous .lean-engine/orchestration/");
  creerDossier(path22.join(racine, ".claude", "commands"));
  let posees = 0;
  for (const [nom, contenu] of Object.entries(commandes(binaire))) {
    if (creerFichier(path22.join(racine, ".claude", "commands", nom), contenu)) posees += 1;
  }
  faits.push(`${posees} commande(s) de session pos\xE9e(s)`);
  let definitions = 0;
  for (const [nom, contenu] of Object.entries(agents())) {
    if (creerFichier(path22.join(racine, ".claude", "agents", nom), contenu)) definitions += 1;
  }
  faits.push(`${definitions} agent definition(s) placed`);
  const settings = path22.join(racine, ".claude", "settings.json");
  const hooks = entreesHooks(binaire);
  if (!fs25.existsSync(settings)) {
    creerFichier(settings, JSON.stringify({ hooks }, null, 2) + "\n");
    faits.push("hooks pos\xE9s dans un settings.json neuf");
  } else {
    let doc = {};
    try {
      doc = JSON.parse(lireTexte(settings));
    } catch {
      return { ok: false, erreur: ".claude/settings.json est illisible : corrige-le avant d'installer", faits };
    }
    noterAvant(manifeste, racine, settings);
    manifeste.hooksPreexistants = Object.prototype.hasOwnProperty.call(doc, "hooks");
    const existants = doc.hooks ?? {};
    for (const [evenement, groupes] of Object.entries(hooks)) {
      const liste = Array.isArray(existants[evenement]) ? existants[evenement] : [];
      for (const groupe of groupes) {
        liste.push(groupe);
        manifeste.clesJson.push({ fichier: rel2(racine, settings), chemin: `hooks.${evenement}` });
      }
      existants[evenement] = liste;
    }
    doc.hooks = existants;
    ecrireCommeAvant(settings, JSON.stringify(doc, null, 2) + "\n");
    faits.push("hooks fusionn\xE9s dans le settings.json existant");
  }
  const claude = path22.join(racine, "CLAUDE.md");
  const bloc = blocRegles(binaire);
  if (!fs25.existsSync(claude)) {
    creerFichier(claude, `# R\xE8gles du d\xE9p\xF4t

${bloc}`);
    faits.push("CLAUDE.md cr\xE9\xE9 avec les r\xE8gles Lean Engine");
  } else {
    const texte = lireTexte(claude);
    if (bornesBloc(texte) === null) {
      noterAvant(manifeste, racine, claude);
      ecrireCommeAvant(claude, texte.replace(/\n*$/, "\n\n") + bloc);
      manifeste.blocsAjoutes.push(rel2(racine, claude));
      faits.push("bloc de r\xE8gles ajout\xE9 au CLAUDE.md existant, sans toucher au reste");
    }
  }
  if (!fs25.existsSync(path22.join(racine, "dossier-recette"))) {
    creerFichier(
      path22.join(racine, "dossier-recette", "02_CODIFICATION.md"),
      [
        "# Codification",
        "",
        "## 4. Domaines",
        "",
        "| Code | Domaine | Fichier |",
        "|---|---|---|",
        "",
        "> Un domaine par ligne. Le fichier cit\xE9 porte ses exigences `SPEC-<CODE>-NNN`.",
        ""
      ].join("\n")
    );
    faits.push("dossier-recette amorc\xE9");
  }
  poserRuntimeEtCrochets(racine, binaire, manifeste, faits);
  const cheminM = cheminManifeste(racine);
  fs25.mkdirSync(path22.dirname(cheminM), { recursive: true });
  ecrireCommeAvant(cheminM, JSON.stringify(manifeste, null, 2) + "\n");
  return { ok: true, faits, manifeste: rel2(racine, cheminM) };
}
function groupePython(g) {
  const groupe = g;
  return (groupe.hooks ?? []).some((h) => /agentic_orchestrator[\/\\]hooks/.test(String(h.command ?? "")));
}
function canonique(x) {
  if (Array.isArray(x)) return x.map(canonique);
  if (x && typeof x === "object") {
    const o = x;
    return Object.fromEntries(Object.keys(o).sort().map((k) => [k, canonique(o[k])]));
  }
  return x;
}
function rebrancherPython(courants, avant) {
  const sansPython = {};
  let groupes = 0;
  for (const [ev, gs] of Object.entries(avant)) {
    const restants = (gs ?? []).filter((g) => !groupePython(g));
    groupes += (gs ?? []).length - restants.length;
    if (restants.length) sansPython[ev] = restants;
  }
  if (JSON.stringify(canonique(sansPython)) === JSON.stringify(canonique(courants))) {
    return { hooks: JSON.parse(JSON.stringify(avant)), exact: true, groupes };
  }
  const sortie = JSON.parse(JSON.stringify(courants));
  for (const [ev, gs] of Object.entries(avant)) {
    (gs ?? []).forEach((g, rang) => {
      if (!groupePython(g)) return;
      const liste = Array.isArray(sortie[ev]) ? sortie[ev] : [];
      liste.splice(Math.min(rang, liste.length), 0, JSON.parse(JSON.stringify(g)));
      sortie[ev] = liste;
    });
  }
  return { hooks: sortie, exact: false, groupes };
}
function etapesRuntimeEtCrochets(racine) {
  const avant = hooksPathLocal(racine);
  return [
    {
      action: "creer",
      cible: `${RUNTIME}/`,
      raison: "runtime vendu dans le projet (hooks et CLI) : cit\xE9 en relatif, il vaut sur toute machine et dans chaque worktree"
    },
    {
      action: "creer",
      cible: `${DOSSIER_CROCHETS}/ et core.hooksPath`,
      raison: "crochets git en sh pur : identit\xE9 et lexique contr\xF4l\xE9s au commit, sous Windows comme sous WSL" + (avant ? ` ; core.hooksPath passe de ${avant} \xE0 ${DOSSIER_CROCHETS}, rendu au retrait` : "")
    }
  ];
}
function runtimeAbsent(paquet) {
  return LIVRABLES_RUNTIME.filter((r) => !fs25.existsSync(path22.join(paquet, "dist", r)));
}
function poserRuntimeEtCrochets(racine, paquet, manifeste, faits) {
  const vendu = vendreRuntime(racine, paquet);
  manifeste.fichiersCrees.push(...vendu.fichiers);
  manifeste.dossiersCrees.push(...vendu.dossiers);
  faits.push(`runtime vendu sous ${RUNTIME}/ (${vendu.fichiers.length} fichier(s)), cit\xE9 en relatif`);
  const crochets = poserCrochetsGit(racine);
  manifeste.fichiersCrees.push(...crochets.fichiers);
  manifeste.dossiersCrees.push(...crochets.dossiers);
  manifeste.crochetsGit = { hooksPathAvant: crochets.hooksPathAvant, branche: crochets.branche };
  if (crochets.branche) {
    faits.push(
      `crochets git en sh pur branch\xE9s sur ${DOSSIER_CROCHETS}` + (crochets.hooksPathAvant ? ` (au lieu de ${crochets.hooksPathAvant}, rendu au retrait)` : "")
    );
  }
}
function planDesinstallation(racine) {
  const m = lireManifeste(racine);
  if (!m) {
    return {
      racine,
      deja: false,
      etapes: [
        {
          action: "rien",
          cible: MANIFESTE.split("\\").join("/"),
          raison: "aucun manifeste : rien n'a \xE9t\xE9 pos\xE9 par l'outil ici, on ne retire rien \xE0 l'aveugle"
        }
      ]
    };
  }
  const etapes = m.fichiersCrees.map((f) => ({ action: "creer", cible: f, raison: "cr\xE9\xE9 par l'installation : sera supprim\xE9" }));
  for (const f of m.blocsAjoutes) {
    etapes.push({ action: "bloc", cible: f, raison: "seul le bloc encadr\xE9 sera retir\xE9 ; le reste du fichier ne bouge pas" });
  }
  const surJson = new Set(m.clesJson.map((c) => c.fichier));
  for (const f of surJson) {
    etapes.push({ action: "json", cible: f, raison: "seules les entr\xE9es de hooks de l'outil seront retir\xE9es" });
  }
  return { racine, deja: true, etapes };
}
function desinstaller(racine, binaire) {
  const m = lireManifeste(racine);
  if (!m) {
    return {
      ok: false,
      erreur: "aucun manifeste d'installation dans ce d\xE9p\xF4t : l'outil ne retire pas ce qu'il n'a pas pos\xE9",
      faits: []
    };
  }
  const faits = [];
  const b = binaire.split("\\").join("/");
  const settings = path22.join(racine, ".claude", "settings.json");
  if (fs25.existsSync(settings)) {
    try {
      const doc = JSON.parse(lireTexte(settings));
      const hooks = doc.hooks ?? {};
      let retires = 0;
      const n\u00F4tre = (groupe) => {
        const g = groupe;
        return (g.hooks ?? []).some((h) => {
          const c = String(h.command ?? "");
          return c.includes(`${RUNTIME}/hooks/`) || c.includes(b + "/dist/hooks/");
        });
      };
      for (const evenement of Object.keys(hooks)) {
        const avant = hooks[evenement].length;
        hooks[evenement] = hooks[evenement].filter((g) => !n\u00F4tre(g));
        retires += avant - hooks[evenement].length;
        if (!hooks[evenement].length) delete hooks[evenement];
      }
      let exact = false;
      if (m.hooksAvant) {
        const rendu2 = rebrancherPython(hooks, m.hooksAvant);
        exact = rendu2.exact;
        for (const k of Object.keys(hooks)) delete hooks[k];
        Object.assign(hooks, rendu2.hooks);
        if (rendu2.groupes) {
          faits.push(
            `${rendu2.groupes} groupe(s) de hooks du bloc Python rebranch\xE9(s)` + (exact ? ", \xE0 l'identique" : ", \xE0 leur place d'origine (les hooks ont boug\xE9 depuis la reprise)")
          );
        }
      } else {
        let rebranches = 0;
        for (const { evenement, commande } of m.hooksPythonRetires ?? []) {
          const liste = Array.isArray(hooks[evenement]) ? hooks[evenement] : [];
          liste.push({ hooks: [{ type: "command", command: commande }] });
          hooks[evenement] = liste;
          rebranches += 1;
        }
        if (rebranches) faits.push(`${rebranches} hook(s) du bloc Python rebranch\xE9(s)`);
      }
      if (Object.keys(hooks).length) doc.hooks = hooks;
      else if (m.hooksPreexistants) doc.hooks = {};
      else delete doc.hooks;
      const brut = m.contenusAvant?.[rel2(racine, settings)];
      let rendu = false;
      if (brut !== void 0) {
        try {
          if (JSON.stringify(canonique(JSON.parse(brut))) === JSON.stringify(canonique(doc))) {
            fs25.writeFileSync(settings, brut, "utf-8");
            rendu = true;
          }
        } catch {
        }
      }
      if (!rendu) ecrireCommeAvant(settings, JSON.stringify(doc, null, 2) + "\n");
      if (retires) faits.push(`${retires} entr\xE9e(s) de hooks retir\xE9e(s), les autres laiss\xE9es`);
    } catch {
      faits.push("settings.json illisible : laiss\xE9 tel quel");
    }
  }
  let rendues = 0;
  for (const { fichier, sauvegarde } of m.commandesRemplacees ?? []) {
    const cible = path22.join(racine, fichier);
    const copie = path22.join(racine, sauvegarde);
    if (!fs25.existsSync(copie)) continue;
    try {
      fs25.copyFileSync(copie, cible);
      fs25.rmSync(copie, { force: true });
      rendues += 1;
    } catch {
    }
  }
  if (rendues) faits.push(`${rendues} commande(s) du bloc Python rendue(s) \xE0 leur \xE9tat d'avant`);
  if (m.crochetsGit?.branche) {
    rebrancherCrochetsGit(racine, m.crochetsGit.hooksPathAvant);
    faits.push(
      m.crochetsGit.hooksPathAvant ? `core.hooksPath rendu \xE0 ${m.crochetsGit.hooksPathAvant}` : "core.hooksPath retir\xE9, comme avant l'installation"
    );
  }
  for (const f of m.blocsAjoutes) {
    const p = path22.join(racine, f);
    if (!fs25.existsSync(p)) continue;
    const texte = lireTexte(p);
    const bornes = bornesBloc(texte);
    if (!bornes) continue;
    const { debut, fin, longueurFin } = bornes;
    const nouveau = (texte.slice(0, debut) + texte.slice(fin + longueurFin)).replace(/\n{3,}$/, "\n");
    const brut = m.contenusAvant?.[f];
    const sansBlanc = (t) => t.replace(/\r\n/g, "\n").replace(/\s*$/, "");
    if (brut !== void 0 && sansBlanc(brut) === sansBlanc(nouveau)) fs25.writeFileSync(p, brut, "utf-8");
    else ecrireCommeAvant(p, nouveau);
    faits.push(`bloc retir\xE9 de ${f}, le reste intact`);
  }
  const gardes = [];
  for (const f of m.fichiersCrees) {
    const p = path22.join(racine, f);
    if (!fs25.existsSync(p)) continue;
    fs25.rmSync(p, { force: true });
  }
  faits.push(`${m.fichiersCrees.length} fichier(s) pos\xE9(s) par l'installation supprim\xE9(s)`);
  fs25.rmSync(cheminManifeste(racine), { force: true });
  for (const d of [...m.dossiersCrees].sort((a, z) => z.length - a.length)) {
    const p = path22.join(racine, d);
    if (!fs25.existsSync(p)) continue;
    try {
      if (fs25.readdirSync(p).length === 0) fs25.rmdirSync(p);
      else gardes.push(d);
    } catch {
      gardes.push(d);
    }
  }
  if (gardes.length) {
    faits.push(`${gardes.length} dossier(s) gard\xE9(s) car non vides : ${gardes.slice(0, 6).join(", ")}`);
  }
  fs25.rmSync(cheminManifeste(racine), { force: true });
  try {
    const dossierManifeste = path22.dirname(cheminManifeste(racine));
    if (fs25.readdirSync(dossierManifeste).length === 0) fs25.rmdirSync(dossierManifeste);
  } catch {
  }
  return { ok: true, faits };
}

// noyau/src/courtier.ts
var fs27 = __toESM(require("node:fs"), 1);
var path24 = __toESM(require("node:path"), 1);

// noyau/src/priorWork.ts
var SIMILARITY_REPORTED = 0.5;
var SIMILAR_MAX = 5;
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
var STOP = /* @__PURE__ */ new Set([
  "with",
  "from",
  "that",
  "this",
  "into",
  "each",
  "their",
  "then",
  "than",
  "when",
  "which",
  "while",
  "without",
  "pour",
  "avec",
  "dans",
  "sans",
  "sous",
  "leur",
  "leurs",
  "cette",
  "entre",
  "plus",
  "tout",
  "toute"
]);
function titleWords(titre) {
  const mots = String(titre ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter((m) => m.length >= 4 && !STOP.has(m));
  return new Set(mots);
}
function declaredLinks(engs, eng) {
  const amont = /* @__PURE__ */ new Map();
  const aval = /* @__PURE__ */ new Map();
  const lier = (de, vers) => {
    if (!de || !vers || de === vers) return;
    if (!amont.has(de)) amont.set(de, /* @__PURE__ */ new Set());
    if (!aval.has(vers)) aval.set(vers, /* @__PURE__ */ new Set());
    amont.get(de).add(vers);
    aval.get(vers).add(de);
  };
  for (const [id, e] of engs) {
    for (const d of dependsOn(e)) lier(id, String(d.eng ?? ""));
    if (e.reprend) lier(id, String(e.reprend));
  }
  const lies = /* @__PURE__ */ new Set();
  for (const sens of [amont, aval]) {
    const vus = /* @__PURE__ */ new Set([eng]);
    const file = [eng];
    while (file.length) {
      for (const v of sens.get(file.pop()) ?? []) {
        if (vus.has(v)) continue;
        vus.add(v);
        lies.add(v);
        file.push(v);
      }
    }
  }
  return lies;
}
function similarCommitments(engs, eng) {
  const moi = engs.get(eng);
  if (!moi) return [];
  const mesExigences = new Set(exigences(moi));
  const mesChemins = cheminsScope(moi);
  const mesMots = titleWords(moi.titre);
  const poids = {
    exigences: mesExigences.size ? 0.6 : 0,
    chemins: mesChemins.length ? 0.25 : 0,
    titre: mesMots.size ? 0.15 : 0
  };
  const total = poids.exigences + poids.chemins + poids.titre;
  if (!total) return [];
  const lies = declaredLinks(engs, eng);
  const sortie = [];
  for (const [id, autre] of engs) {
    if (id === eng) continue;
    const communes = exigences(autre).filter((x) => mesExigences.has(x));
    const paires = chevauchement(mesChemins, cheminsScope(autre));
    const cheminsTouches = new Set(paires.map(([a]) => a));
    const mots = titleWords(autre.titre);
    let motsCommuns = 0;
    for (const m of mesMots) if (mots.has(m)) motsCommuns += 1;
    const union = mesMots.size + mots.size - motsCommuns;
    const score = (poids.exigences * (mesExigences.size ? communes.length / mesExigences.size : 0) + poids.chemins * (mesChemins.length ? cheminsTouches.size / mesChemins.length : 0) + poids.titre * (union ? motsCommuns / union : 0)) / total;
    if (score < SIMILARITY_REPORTED) continue;
    sortie.push({
      eng: id,
      titre: String(autre.titre ?? ""),
      statut: String(autre.statut ?? ""),
      score: Math.round(score * 100) / 100,
      shared_requirements: communes.sort(),
      shared_paths: paires.slice(0, 8).map(([a, b]) => `${a} ~ ${b}`),
      declared: lies.has(id)
    });
  }
  return sortie.sort((a, b) => b.score - a.score || a.eng.localeCompare(b.eng)).slice(0, SIMILAR_MAX);
}
function priorWork(ctx, engs, eng) {
  const moi = engs.get(eng);
  if (!moi) return { eng, remote_reachable: null, findings: [], commits: [], similar: [] };
  const refs = trunkRefs(ctx);
  const { findings, commits } = remoteFindings(ctx, moi, refs);
  const dernier = lastRefresh(ctx);
  return {
    eng,
    remote_reachable: refs.length ? dernier.ok : null,
    findings,
    commits,
    similar: similarCommitments(engs, eng)
  };
}
function gestureFor(eng, moment = "pull") {
  if (moment === "session") {
    return `stop writing now. The session that holds the lease declares it from its worktree: eng push --blocage "what the remote shows for this commitment, and what this worktree already holds". The coordinator merges the remote ${TRUNK}, reads lean show ${eng} and lean rapport ${eng}, and what remains of the commitment is then decided, never assumed`;
  }
  return `git pull --ff-only (or merge the remote ${TRUNK}), then lean show ${eng} and lean rapport ${eng}. Write nothing before that. If the work is still due once what exists has been read, eng pull ${eng} --acknowledged "what exists, and why the work is still due"`;
}
function similarLines(similar) {
  return similar.map(
    (s) => `${s.eng} [${s.statut}] similarity ${s.score.toFixed(2)}, ${s.shared_requirements.length} shared requirement(s)${s.declared ? ", linked by a precedence or a lineage" : ", NO DECLARED LINK"}: ${s.titre}`
  );
}
function stateTreeBehind(ctx, refs = trunkRefs(ctx)) {
  let pire = null;
  const rel3 = ctx.etat.slice(ctx.racine.length).replace(/\\/g, "/").replace(/^\/+/, "");
  for (const ref of refs) {
    const r = git(["rev-list", "--count", `${TRUNK}..${ref}`, "--", rel3], ctx.racine);
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

// noyau/src/mandats.ts
var crypto5 = __toESM(require("node:crypto"), 1);
var fs26 = __toESM(require("node:fs"), 1);
var path23 = __toESM(require("node:path"), 1);
function cheminMandat(ctx, eng) {
  return path23.join(ctx.runs, "mandats", `${eng}.json`);
}
function chargerMandat(ctx, eng) {
  const p = cheminMandat(ctx, eng);
  if (!fs26.existsSync(p)) return null;
  try {
    return JSON.parse(lireTexte(p));
  } catch {
    return null;
  }
}
function sauverMandat(ctx, m) {
  ecrireAtomique(cheminMandat(ctx, m.eng), JSON.stringify(m, null, 2));
}
function reclamerMandat(ctx, eng, ttlMinutes) {
  const rec = chargerRecord(ctx, eng);
  if (!rec) {
    return { code: 404, corps: { ok: false, code: "lease_inconnu", erreur: `aucun lease pour ${eng} : rien \xE0 v\xE9rifier` } };
  }
  const wt = String(rec.worktree ?? "");
  if (!fs26.existsSync(path23.join(wt, "REPORT.md")) && !fs26.existsSync(path23.join(ctx.livraisons, eng, "REPORT.md"))) {
    return {
      code: 409,
      corps: {
        ok: false,
        code: "pas_livre",
        erreur: `${eng} n'a pas de REPORT.md dans son worktree : la v\xE9rification suit la livraison`
      }
    };
  }
  const existant = chargerMandat(ctx, eng);
  if (existant && existant.statut === "ouvert") {
    const echeance = parseIso(existant.echeance);
    if (echeance && echeance.getTime() > Date.now()) {
      return {
        code: 409,
        corps: {
          ok: false,
          code: "mandat_deja_reclame",
          mandat: existant.mandat,
          emis_le: existant.emis_le,
          echeance: existant.echeance,
          erreur: `a mandate is already open for ${eng} until ${existant.echeance} (${existant.mandat}, issued ${existant.emis_le}). A verifier holds it. If that verifier is dead, do not wait and do not touch the mandate record: tell the operator, who alone voids a mandate, from the cockpit (command "Lean: void a verification mandate"). Once it is voided, lean mandat ${eng} issues a new one.`
        }
      };
    }
    existant.statut = "echu";
    sauverMandat(ctx, existant);
  }
  const branche = String(rec.branch ?? brancheEngagement(eng));
  if (lireConfig(ctx).mandat_distant_bloquant) {
    try {
      refreshRemoteRefs(ctx);
      const ailleurs = mandatDistant(ctx, branche, existant);
      if (ailleurs) {
        return {
          code: 409,
          corps: {
            ok: false,
            code: "mandat_ouvert_ailleurs",
            erreur: `the branch ${branche} on ${ailleurs.ref} shows a verification mandated on another workstation until ${ailleurs.until}: a verifier holds it there. Wait for its verdict, or ask the operator of that workstation to void it.`
          }
        };
      }
    } catch {
    }
  }
  const diff = empreinteDiff(wt);
  if (!diff) {
    return {
      code: 500,
      corps: { ok: false, code: "diff_incalculable", erreur: `diff de ${wt} incalculable (worktree git absent ou base introuvable)` }
    };
  }
  const numero = Number(String(existant?.mandat ?? "").match(/-(\d+)$/)?.[1] ?? 0) + 1;
  const m = {
    mandat: `MAN-${eng}-${numero}`,
    eng,
    jeton: crypto5.randomBytes(24).toString("base64url"),
    diff_empreinte: diff.empreinte,
    emis_le: isoSecondes(),
    echeance: isoSecondes(new Date(Date.now() + ttlMinutes * 6e4)),
    statut: "ouvert",
    master_sha: git(["rev-parse", TRUNK], ctx.racine).stdout.trim() || void 0
  };
  sauverMandat(ctx, m);
  const phase = publishPhase(ctx, eng, branche, wt, "mandated", { detail: `until ${m.echeance}` });
  if (phase.commit) {
    m.branch_commit = phase.commit;
    sauverMandat(ctx, m);
  }
  return {
    code: 200,
    corps: {
      ok: true,
      mandat: m.mandat,
      jeton_mandat: m.jeton,
      diff_empreinte: m.diff_empreinte,
      diff_octets: diff.octets,
      echeance: m.echeance,
      publication_branche: phase,
      consignes: 'Lance /verify sur ce diff pr\xE9cis dans une session Claude Code. D\xE9pose le verdict avec ce jeton de mandat ; le jeton de lease est refus\xE9. Run every test through `lean essai "command" --sorties file`: the raw outputs then carry each command with its exit code, and the verdict refuses a test that was not run so, or that is red under an approval. A rejection names its violations: --constats file.json.'
    }
  };
}
var MARQUE_ESSAI = "[lean essai]";
function enveloppesEssai(sorties) {
  const sortie = /* @__PURE__ */ new Map();
  let courante = null;
  for (const ligne of sorties.split("\n")) {
    if (ligne.startsWith("$ ")) {
      courante = ligne.slice(2).trim();
      continue;
    }
    const m = ligne.match(/^\[lean essai\] exit (-?\d+), (\d+) ms/);
    if (m && courante !== null) {
      sortie.set(courante, { commande: courante, exit: Number(m[1]), ms: Number(m[2]) });
      courante = null;
    }
  }
  return sortie;
}
function blocEssai(commande, texte, exit, ms) {
  const corps = texte.endsWith("\n") || !texte ? texte : texte + "\n";
  return `$ ${commande}
${corps}${MARQUE_ESSAI} exit ${exit}, ${ms} ms, ${isoSecondes()}
`;
}
function controleEssais(cites, sorties, verdict, essaisRequis) {
  const enveloppes = enveloppesEssai(sorties);
  const absents = [];
  const nonJoues = [];
  const rouges = [];
  for (const t of cites) {
    const e = enveloppes.get(t);
    if (e) {
      if (e.exit !== 0 && verdict === "approve") rouges.push(`${t} (exit ${e.exit})`);
      continue;
    }
    if (essaisRequis) nonJoues.push(t);
    else if (!sorties.includes(t)) absents.push(t);
  }
  if (absents.length) {
    return { code: "verdict_incoherent", erreur: `tests cit\xE9s absents des sorties brutes : ${absents.join(", ")}` };
  }
  if (nonJoues.length) {
    return {
      code: "essai_absent",
      erreur: `test(s) cited that the raw outputs do not show run through lean essai: ${nonJoues.join(", ")}. Run each one with \`lean essai "command" --sorties file\`, which records the command and its exit code, then file again`
    };
  }
  if (rouges.length) {
    return {
      code: "test_rouge",
      erreur: `an approving verdict cites test(s) that exited with a non-zero code: ${rouges.join(", ")}. A red test is never approved`
    };
  }
  return null;
}
function cheminRework(worktree) {
  return path23.join(worktree, ".eng", "REWORK.md");
}
function ecrireRework(worktree, eng, mandat, violations, rejets, mineur = false) {
  if (!worktree || !fs26.existsSync(worktree)) return;
  const lignes = [
    `# Rework of ${eng} after the verdict of ${mandat} (${mineur ? "minor reject: points inside the scope, no rejection of substance" : "reject"}), filed on ${isoSecondes()}`,
    "",
    "Each violation below is answered in REPORT.md, under a section `## Rework`, by its mark (`V1`, `V2` and so on):",
    "what was changed, and the test that proves it. The delivery check `reprise` reads the marks.",
    "",
    ...violations.map((v, i) => `- V${i + 1}: ${v.replace(/\s+/g, " ").trim()}`),
    "",
    `Consecutive rejections of substance: ${rejets}.`,
    ...rejets >= 2 && !mineur ? [
      "",
      "Two consecutive rejections: the next delivery is refused until an arbitration request on the continuation",
      "of this commitment is decided. Write BLOCKED.md as that request (options such as: a third delivery under",
      "this commitment, the commitment broken and a successor opened from its branch, the delivery integrated as it",
      "is with the points carried), deliver it (eng push --livraison files it), and run eng attendre in the background."
    ] : [],
    ""
  ];
  ecrireTexte(cheminRework(worktree), lignes.join("\n"));
}
function verdictsDe(ctx, eng) {
  const dossier = path23.join(ctx.livraisons, eng);
  if (!fs26.existsSync(dossier)) return [];
  const noms = fs26.readdirSync(dossier).filter((n) => /^VERDICT-MAN-ENG-\d{4}-\d+\.yaml$/.test(n));
  const fichiers = noms.length ? noms : fs26.existsSync(path23.join(dossier, "VERDICT.yaml")) ? ["VERDICT.yaml"] : [];
  const sortie = [];
  for (const nom of fichiers) {
    try {
      const d = lireYamlSur(lireTexte(path23.join(dossier, nom))) ?? {};
      sortie.push({
        mandat: String(d.mandat ?? ""),
        verdict: String(d.verdict ?? ""),
        depose_le: d.depose_le ? String(d.depose_le) : null,
        violations: Array.isArray(d.violations) ? d.violations.map(String) : [],
        tests_cites: Array.isArray(d.tests_cites) ? d.tests_cites.map(String) : [],
        fichier: nom
      });
    } catch {
    }
  }
  return sortie.sort((a, b) => numeroDe2(a.mandat) - numeroDe2(b.mandat));
}
var numeroDe2 = (mandat) => Number(mandat.match(/-(\d+)$/)?.[1] ?? 0);
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
function deposerVerdict(ctx, eng, entree) {
  const m = chargerMandat(ctx, eng);
  if (!m || entree.mandat && m.mandat !== entree.mandat) {
    return { code: 404, corps: { ok: false, code: "mandat_inconnu", erreur: `mandat inconnu pour ${eng}` } };
  }
  const rec = chargerRecord(ctx, eng);
  if (rec && entree.jeton_mandat && rec.token === entree.jeton_mandat) {
    return {
      code: 403,
      corps: { ok: false, code: "token_invalide", erreur: "jeton de LEASE refus\xE9 ici : le verdict exige le jeton de MANDAT" }
    };
  }
  if (m.jeton !== entree.jeton_mandat) {
    return { code: 403, corps: { ok: false, code: "token_invalide", erreur: "jeton de mandat invalide" } };
  }
  if (m.statut === "revoque") {
    return {
      code: 410,
      corps: {
        ok: false,
        code: "mandat_revoque",
        erreur: `mandate ${m.mandat} was voided by the operator on ${String(m.revoque_le ?? "?")}: its verdict is no longer accepted. Another verifier takes the verification up again from a new mandate. Stop here and say so.`
      }
    };
  }
  if (m.statut !== "ouvert") {
    return { code: 410, corps: { ok: false, code: "mandat_echu", erreur: `mandat ${m.mandat} \xE0 l'\xE9tat ${m.statut}` } };
  }
  const echeance = parseIso(m.echeance);
  if (echeance && echeance.getTime() < Date.now()) {
    m.statut = "echu";
    sauverMandat(ctx, m);
    return { code: 410, corps: { ok: false, code: "mandat_echu", erreur: `mandat ${m.mandat} \xE9chu : re-r\xE9clame un mandat` } };
  }
  if (!["approve", "reject", "arbitrage"].includes(entree.verdict)) {
    return { code: 400, corps: { ok: false, code: "verdict_invalide", erreur: `verdict '${entree.verdict}' (approve|reject|arbitrage)` } };
  }
  if (entree.verdict === "arbitrage" && String(entree.motif_arbitrage ?? "").trim().length < 20) {
    return {
      code: 400,
      corps: {
        ok: false,
        code: "motif_arbitrage_manquant",
        erreur: 'an arbitrage verdict states the conflict to decide: --motif-arbitrage "..." (at least 20 characters), from which the arbitration request is written with its options and your recommendation'
      }
    };
  }
  const violations = (entree.violations ?? []).map((v) => String(v).trim()).filter(Boolean);
  if (entree.verdict === "reject" && !violations.length) {
    return {
      code: 400,
      corps: {
        ok: false,
        code: "violations_manquantes",
        erreur: "a rejection states what the implementing session must correct: --constats file.json, a JSON object whose `violations` is a list of at least one string (file, line, requirement concerned), with `par_exigence` and `tests`"
      }
    };
  }
  if (entree.diff_empreinte_examinee !== m.diff_empreinte) {
    return {
      code: 409,
      corps: {
        ok: false,
        code: "empreinte_divergente",
        erreur: `le verdict porte sur ${entree.diff_empreinte_examinee || "(vide)"} mais le mandat a fig\xE9 ${m.diff_empreinte}`
      }
    };
  }
  const wt = String(rec?.worktree ?? "");
  const courant = wt && fs26.existsSync(wt) ? empreinteDiff(wt) : null;
  if (courant && courant.empreinte !== m.diff_empreinte) {
    return {
      code: 409,
      corps: {
        ok: false,
        code: "empreinte_divergente",
        erreur: "le diff livr\xE9 a chang\xE9 depuis l'\xE9mission du mandat : re-livraison puis nouveau mandat"
      }
    };
  }
  const cites = entree.tests_cites ?? [];
  const sorties = entree.sorties_tests ?? "";
  const config = lireConfig(ctx);
  const refusEssais = controleEssais(cites, sorties, entree.verdict, config.essais_requis);
  if (refusEssais) {
    return { code: 422, corps: { ok: false, code: refusEssais.code, anomalie: true, erreur: refusEssais.erreur } };
  }
  const testsLongs = [...enveloppesEssai(sorties).values()].filter((e) => e.ms > config.essai_budget_minutes * 6e4).map((e) => `${e.commande} (${Math.round(e.ms / 6e4)} min)`);
  const dossier = path23.join(ctx.livraisons, eng);
  fs26.mkdirSync(dossier, { recursive: true });
  if (sorties) ecrireTexte(path23.join(dossier, "SORTIES_TESTS.txt"), sorties);
  const mineur = entree.verdict === "reject" && entree.mineur === true;
  let rejetsConsecutifs = Number(rec?.rejets_consecutifs ?? 0);
  if (entree.verdict === "reject") {
    if (!mineur) rejetsConsecutifs += 1;
  } else {
    rejetsConsecutifs = 0;
  }
  const maintenant = isoSecondes();
  if (rec) {
    rec.rejets_consecutifs = rejetsConsecutifs;
    rec.dernier_verdict = { mandat: m.mandat, sens: entree.verdict, le: maintenant, mineur };
    if (entree.verdict === "reject" && !mineur) rec.dernier_rejet_le = maintenant;
    sauverRecord(ctx, rec);
  }
  const record = `verdict: ${entree.verdict}
mandat: ${m.mandat}
diff_empreinte: ${scalairePy(m.diff_empreinte)}
violations: ${JSON.stringify(violations)}
par_exigence: ${JSON.stringify(entree.par_exigence ?? {})}
tests: ${JSON.stringify(entree.tests ?? {})}
tests_cites: ${JSON.stringify(cites)}
motif_arbitrage: ${entree.motif_arbitrage ? JSON.stringify(entree.motif_arbitrage) : "null"}
mineur: ${mineur ? "true" : "false"}
depose_le: ${scalairePy(maintenant)}
`;
  ecrireTexte(path23.join(dossier, "VERDICT.yaml"), record);
  ecrireTexte(path23.join(dossier, `VERDICT-${m.mandat}.yaml`), record);
  m.statut = "rendu";
  m.rendu_le = maintenant;
  m.verdict = entree.verdict;
  sauverMandat(ctx, m);
  let publicationBranche = null;
  if (entree.verdict === "reject") {
    ecrireRework(wt, eng, m.mandat, violations, rejetsConsecutifs, mineur);
  }
  if (entree.verdict !== "approve") {
    const branche = String(rec?.branch ?? brancheEngagement(eng));
    publicationBranche = publishPhase(ctx, eng, branche, wt, "rejected", { detail: `${m.mandat} ${entree.verdict}` });
  }
  let suite = entree.verdict === "approve" ? `integration follows in the same transaction; if it was refused, lean integrer ${eng} repeats it.` : entree.verdict === "arbitrage" ? "file the arbitration request now (lean numero DA) with its enumerated options and the option you recommend; the branch stays frozen on the decision." : mineur ? `minor rework in the same worktree, which now holds .eng/REWORK.md with the ${violations.length} point(s) to answer; it counts as no rejection of substance, and the lease survives.` : `rework in the same worktree, which now holds .eng/REWORK.md with the ${violations.length} violation(s) to answer; the lease survives.`;
  if (entree.verdict === "reject" && !mineur && rejetsConsecutifs >= 2) {
    suite = "second consecutive rejection: the next delivery is refused until an arbitration request on the continuation of the commitment is decided. The session writes BLOCKED.md as that request and delivers it; the operator decides whether the work goes on here, under a successor, or is integrated as it is. No status is changed automatically.";
  }
  return {
    code: 200,
    corps: {
      ok: true,
      eng,
      mandat: m.mandat,
      verdict: entree.verdict,
      rejets_consecutifs: rejetsConsecutifs,
      mineur,
      violations: violations.length,
      tests_longs: testsLongs,
      suite,
      ...publicationBranche ? { publication_branche: publicationBranche } : {}
    }
  };
}
function etatMandat(ctx, eng) {
  const m = chargerMandat(ctx, eng);
  if (!m) return null;
  const { jeton: _jeton, ...sans } = m;
  return sans;
}

// noyau/src/livraison.ts
var EXTRAS_AUTORISES = ["REPORT.md", "BLOCKED.md", "SPEC_UPDATE.md", "DOC_UPDATE.md"];

// noyau/src/courtier.ts
function publier(ctx, eng, verbe, autres = []) {
  const bas = eng.toLowerCase();
  return publishTransaction(
    ctx,
    [
      ...autres,
      cheminEngagement(ctx, eng),
      ctx.claims,
      ctx.dashboard,
      path24.join(ctx.livraisons, eng),
      path24.join(ctx.arbitrages, `BROUILLON-DA-${bas}.md`),
      path24.join(ctx.deltas, `BROUILLON-SCP-${bas}.md`)
      // A draft is named whether it exists or not: one that a filing removed is committed as removed.
    ].filter((p) => p === ctx.dashboard || p.includes("BROUILLON-") || fs27.existsSync(p)),
    `chore(steering): ${eng} ${verbe} [${eng}]`,
    eng
  );
}
function regenererDashboard(ctx) {
  try {
    genererDashboard(ctx);
  } catch {
  }
}
function poserLigne(texte, cle, valeur, apres) {
  const re = new RegExp(`^${cle}:.*$`, "m");
  if (re.test(texte)) return texte.replace(re, `${cle}: ${valeur}`);
  for (const ancre of apres) {
    const reAncre = new RegExp(`^(${ancre}:.*)$`, "m");
    if (reAncre.test(texte)) return texte.replace(reAncre, `$1
${cle}: ${valeur}`);
  }
  return texte.replace(/\s*$/, "\n") + `${cle}: ${valeur}
`;
}
function poserPropose(ctx, eng) {
  const f = cheminEngagement(ctx, eng);
  if (!fs27.existsSync(f)) return false;
  let t = lireTexte(f);
  const t2 = t.replace(/^statut: pris\s*$/m, "statut: propose");
  if (t2 === t) return false;
  t = t2.replace(/^promettant:.*$/m, "promettant: null");
  t = t.replace(/^pris_le:.*$/m, "pris_le: null");
  t = t.replace(/^reserve_par:.*$/m, "reserve_par: null");
  ecrireTexte(f, t);
  return true;
}
function revoquerSession(ctx, body) {
  const eng = String(body.eng ?? body.id ?? "").trim().toUpperCase();
  if (!eng) return { ok: false, erreur: "engagement manquant" };
  return revoquer(ctx, eng, String(body.motif ?? ""));
}
function relacher(ctx, engBrut, token, mode, forcer = false) {
  const eng = engBrut.trim().toUpperCase();
  if (!eng) return { ok: false, erreur: "engagement manquant" };
  const rec = chargerRecord(ctx, eng);
  if (mode === "fin") {
    const sha = rec?.livraison_sha ? String(rec.livraison_sha) : null;
    if (sha && !forcer && estAncetreDeMaster(ctx.racine, sha) === false) {
      return {
        ok: false,
        code: "integration_absente",
        erreur: `${eng} : la livraison (${sha.slice(0, 12)}) n'est pas int\xE9gr\xE9e \xE0 master ; lean integrer ${eng} merges an approved delivery, or --forcer overrides (operator gesture)`
      };
    }
    const liberees2 = libererClaims(ctx, eng);
    if (rec) solderRecord(ctx, eng, "fin");
    regenererDashboard(ctx);
    return { ok: true, eng, mode: "fin", claims_liberes: liberees2, publication: publier(ctx, eng, "lease settled") };
  }
  if (rec) {
    const st = deriverEtat(ctx, rec);
    const sessionAutorisee = Boolean(token) && verifierToken(ctx, eng, token);
    if (st === "active" && !sessionAutorisee) {
      return { ok: false, erreur: `${eng} a une session encore active ; r\xE9voque le lease d'abord, ou laisse la session le rendre` };
    }
  }
  const liberees = libererClaims(ctx, eng);
  const repasse = poserPropose(ctx, eng);
  if (!liberees && !repasse && !rec) return { ok: false, erreur: `${eng} : aucun lease ni statut pris \xE0 lib\xE9rer` };
  if (rec) solderRecord(ctx, eng, "abandon");
  regenererDashboard(ctx);
  return {
    ok: true,
    eng,
    mode: "abandon",
    claims_liberes: liberees,
    repasse_propose: repasse,
    publication: publier(ctx, eng, "released")
  };
}
function balayerLignees(ctx, seuil) {
  const erreurs = [];
  const engs = chargerRegistre(ctx, erreurs);
  const parRacine = /* @__PURE__ */ new Map();
  for (const eid of engs.keys()) {
    const chaine2 = lignee(engs, eid);
    parRacine.set(chaine2[0], chaine2);
  }
  const deposes = [];
  for (const [racine, chaine2] of parRacine) {
    const ruptures = chaine2.filter((e) => engs.get(e)?.statut === "rompu").length;
    if (ruptures < seuil) continue;
    const chemin = path24.join(ctx.arbitrages, `BROUILLON-DA-lignee-${racine.toLowerCase()}.md`);
    if (fs27.existsSync(chemin)) continue;
    fs27.mkdirSync(ctx.arbitrages, { recursive: true });
    ecrireTexte(
      chemin,
      `# BROUILLON de DA (d\xE9pos\xE9 le ${dateLocale()}) : le d\xE9coupage de la lign\xE9e ${racine} est-il le bon ?

La lign\xE9e ${chaine2.join(" -> ")} compte ${ruptures} ruptures.
Ce fichier n'est PAS une DA publi\xE9e : l'op\xE9rateur la publie ou le supprime.

## Closed question

Is the work of the lineage ${racine} cut again, abandoned, or continued as it is?

## Options and consequences

- A: cut the work again. (to complete: the new commitments, and what each one costs)
- B: abandon the objective. (to complete: what is lost downstream, lean impact)
- C: continue as it is. (to complete: what makes the next attempt differ from the broken ones)

## Recommendation

(to complete: the option advised, and the reason, written by the coordinator from the variance of each rupture)
`
    );
    deposes.push(chemin);
  }
  return deposes;
}
function resequencer(ctx, body) {
  const eng = String(body.eng ?? "").trim().toUpperCase();
  const deps = Array.isArray(body.depends_on) ? body.depends_on : null;
  if (!eng || deps === null) {
    return { code: 400, corps: { ok: false, code: "corps_invalide", erreur: "eng et depends_on (liste) obligatoires" } };
  }
  const f = cheminEngagement(ctx, eng);
  if (!fs27.existsSync(f)) return { code: 404, corps: { ok: false, code: "introuvable", erreur: `${eng} inconnu` } };
  for (const d of deps) {
    if (!d || typeof d !== "object" || !d.eng || !["finish-start", "interface", "info"].includes(String(d.type))) {
      return { code: 400, corps: { ok: false, code: "corps_invalide", erreur: `d\xE9pendance mal form\xE9e : ${JSON.stringify(d)}` } };
    }
  }
  const texte = lireTexte(f);
  const serialise = deps.length ? "depends_on:\n" + deps.map((d) => `  - { eng: ${d.eng}, type: ${d.type} }`).join("\n") : "depends_on: []";
  const re = /^depends_on:[^\n]*(\n(?:[ \t]+[^\n]*|[ \t]*-[^\n]*))*/m;
  if (!re.test(texte)) {
    return { code: 500, corps: { ok: false, code: "statut_inchangeable", erreur: `${eng}.yaml : ligne 'depends_on:' introuvable` } };
  }
  const engsAvant = chargerRegistre(ctx, []);
  const impactAvant = engsAvant.has(eng) ? [...dependantsTransitifs(engsAvant, eng)].sort() : [];
  ecrireTexte(f, texte.replace(re, serialise));
  const erreursApres = [];
  const engsApres = chargerRegistre(ctx, erreursApres);
  const vApres = valider(ctx, engsApres);
  if (erreursApres.length || vApres.erreurs.length) {
    ecrireTexte(f, texte);
    return {
      code: 409,
      corps: {
        ok: false,
        code: "registre_invalide",
        erreur: "le res\xE9quencement rend le registre invalide (annul\xE9) : " + [...erreursApres, ...vApres.erreurs].join(" ; ").slice(0, 600)
      }
    };
  }
  regenererDashboard(ctx);
  return {
    code: 200,
    corps: {
      ok: true,
      eng,
      impact_avant: impactAvant,
      impact_apres: [...dependantsTransitifs(engsApres, eng)].sort(),
      publication: publier(ctx, eng, "resequenced")
    }
  };
}
function ajouterNote(texte, note) {
  const lignes = texte.split("\n");
  const i = lignes.findIndex((l) => /^notes:/.test(l));
  const corps = (ind) => note.split("\n").map((l) => ind + l);
  if (i < 0) return texte.replace(/\s*$/, "\n") + "notes: >\n" + corps("  ").join("\n") + "\n";
  const entete = lignes[i].slice("notes:".length).trim();
  let j = i + 1;
  while (j < lignes.length && !/^[A-Za-z_][\w-]*:/.test(lignes[j]) && !/^#/.test(lignes[j])) j++;
  let fin = j;
  while (fin > i + 1 && lignes[fin - 1].trim() === "") fin--;
  if (/^[>|]/.test(entete)) {
    const premiere = lignes.slice(i + 1, fin).find((l) => l.trim() !== "");
    const ind = premiere ? (premiere.match(/^\s*/) ?? [""])[0] || "  " : "  ";
    const insert = entete.startsWith("|") ? corps(ind) : ["", ...corps(ind)];
    lignes.splice(fin, 0, ...insert);
    return lignes.join("\n");
  }
  let ancien = [entete, ...lignes.slice(i + 1, fin).map((l) => l.trim())].join(" ").trim();
  if (ancien === "null" || ancien === "~") ancien = "";
  if (ancien.startsWith('"') && ancien.endsWith('"') || ancien.startsWith("'") && ancien.endsWith("'")) {
    ancien = ancien.slice(1, -1);
  }
  const bloc = ["notes: >", ...ancien ? [...ancien.split("\n").map((l) => "  " + l), ""] : [], ...corps("  ")];
  lignes.splice(i, fin - i, ...bloc);
  return lignes.join("\n");
}
function leaseVivant(ctx, eng) {
  const rec = chargerRecord(ctx, eng);
  return Boolean(rec) && deriverEtat(ctx, rec) === "active";
}
function abandonner(ctx, body) {
  const eng = String(body.eng ?? "").trim().toUpperCase();
  const motif = String(body.motif ?? "").trim();
  if (!eng) return { ok: false, code: "engagement_manquant", erreur: "engagement manquant" };
  if (!motif) return { ok: false, code: "motif_manquant", erreur: `${eng} : abandonner exige --motif` };
  const f = cheminEngagement(ctx, eng);
  if (!fs27.existsSync(f)) return { ok: false, code: "introuvable", erreur: `${eng} : aucun engagement de ce nom` };
  const texte = lireTexte(f);
  const statut = String(lireYamlSur(texte)?.statut ?? "");
  if (statut === "tenu") return { ok: false, code: "statut_inattendu", erreur: `${eng} est tenu : une promesse tenue ne se retire pas` };
  if (statut === "abandonne") return { ok: false, code: "statut_inattendu", erreur: `${eng} est d\xE9j\xE0 abandonne` };
  if (statut === "remplace") {
    return { ok: false, code: "statut_inattendu", erreur: `${eng} est remplace : son travail est port\xE9 par un autre engagement` };
  }
  if (leaseVivant(ctx, eng)) {
    return { ok: false, code: "lease_actif", erreur: `${eng} a une session encore active ; r\xE9voque ou rel\xE2che le lease d'abord` };
  }
  const liberees = libererClaims(ctx, eng);
  if (chargerRecord(ctx, eng)) solderRecord(ctx, eng, "abandon");
  let t = texte.replace(/^statut:.*$/m, "statut: abandonne");
  t = poserLigne(t, "variance", `{raison: abandon, note: ${JSON.stringify(motif)}}`, ["statut"]);
  t = ajouterNote(t, `Note of ${dateLocale()}, by the operator (lean abandonner): withdrawn, ${motif}`);
  ecrireTexte(f, t);
  regenererDashboard(ctx);
  return { ok: true, eng, statut_precedent: statut, claims_liberes: liberees, publication: publier(ctx, eng, "abandoned") };
}
function remplacer(ctx, body) {
  const eng = String(body.eng ?? "").trim().toUpperCase();
  const par = String(body.par ?? "").trim().toUpperCase();
  const motif = String(body.motif ?? "").trim();
  if (!eng) return { ok: false, code: "engagement_manquant", erreur: "engagement manquant" };
  if (!/^ENG-\d{4}$/.test(par)) return { ok: false, code: "par_manquant", erreur: `${eng} : remplacer exige --par ENG-NNNN` };
  if (par === eng) return { ok: false, code: "par_invalide", erreur: `${eng} ne peut pas \xEAtre remplac\xE9 par lui-m\xEAme` };
  const f = cheminEngagement(ctx, eng);
  if (!fs27.existsSync(f)) return { ok: false, code: "introuvable", erreur: `${eng} : aucun engagement de ce nom` };
  if (!fs27.existsSync(cheminEngagement(ctx, par))) return { ok: false, code: "par_introuvable", erreur: `${par} : aucun engagement de ce nom` };
  const texte = lireTexte(f);
  const statut = String(lireYamlSur(texte)?.statut ?? "");
  if (statut === "tenu") return { ok: false, code: "statut_inattendu", erreur: `${eng} est tenu : une promesse tenue ne se remplace pas` };
  const engs = chargerRegistre(ctx, []);
  if (engs.has(par) && cibleRemplacement(engs, par) === eng) {
    return { ok: false, code: "cycle", erreur: `${par} est lui-m\xEAme remplac\xE9 par ${eng} : cycle de remplacement` };
  }
  if (leaseVivant(ctx, eng)) {
    return { ok: false, code: "lease_actif", erreur: `${eng} a une session encore active ; r\xE9voque ou rel\xE2che le lease d'abord` };
  }
  const liberees = libererClaims(ctx, eng);
  if (chargerRecord(ctx, eng)) solderRecord(ctx, eng, "abandon");
  let t = texte.replace(/^statut:.*$/m, "statut: remplace");
  t = poserLigne(t, "remplace_par", par, ["statut"]);
  t = ajouterNote(t, `Note of ${dateLocale()}, by the operator (lean remplacer): the work of this record is carried by ${par}${motif ? `, ${motif}` : ""}`);
  ecrireTexte(f, t);
  regenererDashboard(ctx);
  return { ok: true, eng, par, statut_precedent: statut, claims_liberes: liberees, publication: publier(ctx, eng, `replaced by ${par}`) };
}
function requalifier(ctx) {
  const remplaces = [];
  const abandonnes = [];
  const ignores = [];
  const fichiers = [];
  const noms = fs27.existsSync(ctx.engagements) ? fs27.readdirSync(ctx.engagements).filter((n) => /^ENG-\d{4}\.yaml$/.test(n)).sort() : [];
  const existe = new Set(noms.map((n) => n.replace(/\.yaml$/, "")));
  for (const nom of noms) {
    const f = path24.join(ctx.engagements, nom);
    const texte = lireTexte(f);
    let doc;
    try {
      doc = lireYamlSur(texte) ?? {};
    } catch {
      continue;
    }
    if (String(doc.statut) !== "rompu") continue;
    const v = doc.variance ?? {};
    if (String(v.raison) !== "abandon") continue;
    const note = String(v.note ?? "");
    const id = nom.replace(/\.yaml$/, "");
    const m = note.match(/absorbed by (ENG-\d{4})/i);
    if (m && existe.has(m[1]) && m[1] !== id) {
      let t = texte.replace(/^statut:.*$/m, "statut: remplace");
      t = poserLigne(t, "remplace_par", m[1], ["statut"]);
      ecrireTexte(f, t);
      remplaces.push([id, m[1]]);
      fichiers.push(f);
    } else if (/^void\b/i.test(note)) {
      ecrireTexte(f, texte.replace(/^statut:.*$/m, "statut: abandonne"));
      abandonnes.push(id);
      fichiers.push(f);
    } else {
      ignores.push(id);
    }
  }
  if (fichiers.length) regenererDashboard(ctx);
  const publication = fichiers.length ? publishTransaction(
    ctx,
    [...fichiers, ctx.dashboard],
    `chore(steering): the closed records requalified: ${remplaces.length} remplace, ${abandonnes.length} abandonne`,
    "requalifier"
  ) : void 0;
  return { ok: true, remplaces, abandonnes, ignores, publication };
}

// noyau/src/etat.ts
var fs29 = __toESM(require("node:fs"), 1);
var path25 = __toESM(require("node:path"), 1);

// noyau/src/integrite.ts
var fs28 = __toESM(require("node:fs"), 1);
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
    const worktree = fs28.existsSync(String(rec?.worktree ?? cheminWorktree(ctx, eid)));
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
function lignesIncoherences(liste) {
  return liste.map((i) => `${i.code} : ${i.constat}`);
}

// noyau/src/etat.ts
function projectionStreams(ctx, engs, d, das) {
  const ind = indicatorsByStream(d, engs);
  for (const da of das) {
    const e = String(da.engagement ?? da.engagement_reponse ?? "").toUpperCase();
    da.stream = engs.has(e) ? streamLabel(d, engs.get(e)) : null;
  }
  return {
    file: path25.relative(ctx.racine, ctx.streams).split(path25.sep).join("/"),
    declared: true,
    names: d.streams.map((x) => x.name),
    no_stream: NO_STREAM,
    list: d.streams.map((x) => ({ name: x.name, domains: x.domains, requirements: x.requirements, paths: x.paths })),
    indicators: ind,
    problems: d.problems,
    refusals: declarationRefusals(ctx, engs)
  };
}
function jalonsAvecTitres(ctx) {
  const sortie = {};
  if (!fs29.existsSync(ctx.milestones)) return sortie;
  for (const ligne of lireTexte(ctx.milestones).split("\n")) {
    const m = ligne.match(/^\|\s*(J-[A-Z0-9]+)\s*\|([^|]*)\|([^|]*)\|/);
    if (m) {
      sortie[m[1]] = {
        titre: m[2].trim(),
        specs: m[3].match(/SPEC-[A-Z]{2,4}-\d{3}/g) ?? []
      };
    }
  }
  return sortie;
}
function livraisonDe(ctx, engId) {
  const endroits = [path25.join(ctx.livraisons, engId), path25.join(ctx.wt, engId.toLowerCase())];
  for (const endroit of endroits) {
    if (!fs29.existsSync(endroit) || !fs29.statSync(endroit).isDirectory()) continue;
    const sortie = { source: endroit };
    if (fs29.existsSync(path25.join(endroit, "BLOCKED.md"))) sortie.statut = "bloque";
    else if (fs29.existsSync(path25.join(endroit, "REPORT.md"))) sortie.statut = "livre";
    else continue;
    sortie.spec_update = fs29.existsSync(path25.join(endroit, "SPEC_UPDATE.md"));
    const checksIci = path25.join(endroit, "CHECKS.yaml");
    const checksF = fs29.existsSync(checksIci) ? checksIci : path25.join(ctx.livraisons, engId, "CHECKS.yaml");
    if (fs29.existsSync(checksF)) {
      try {
        sortie.checks = lireYamlSur(lireTexte(checksF));
      } catch {
        sortie.checks = { erreur: "CHECKS.yaml illisible" };
      }
    }
    return sortie;
  }
  return null;
}
function construireEtat(ctx, options = {}) {
  const reconcilier = options.reconcilier !== false;
  const erreurs = [];
  const engs = chargerRegistre(ctx, erreurs);
  const v = valider(ctx, engs);
  erreurs.push(...v.erreurs);
  const avertissements = v.avertissements;
  const aujourdHui = dateLocale();
  const maintenant = Date.now();
  const fichiers = (() => {
    try {
      return fichiersDomaines(ctx);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  })();
  const jalons = jalonsAvecTitres(ctx);
  for (const [jid, j] of Object.entries(jalons)) {
    j.vertes = j.specs.filter((s) => estImplemente(statutSpec(s, fichiers))).length;
    j.statuts = Object.fromEntries(j.specs.map((s) => [s, statutSpec(s, fichiers)]));
    const siens = [...engs.values()].filter(
      (e) => String(e.beneficiaire ?? "") === `jalon:${jid}` && e.statut !== "abandonne" && e.statut !== "remplace"
    );
    j.engagements = siens.length;
    j.tenus = siens.filter((e) => String(e.statut) === "tenu").length;
    j.plie = j.specs.length > 0 && j.vertes === j.specs.length;
  }
  const rapport = rapportRegistre(ctx, engs);
  const declaration = readStreams(ctx);
  for (const [eid, e] of engs) {
    const ligne = rapport.engagements[eid];
    if (declaration.declared) ligne.stream = streamLabel(declaration, e);
    ligne.definition_of_done = e.definition_of_done ?? null;
    ligne.notes = e.notes ?? null;
    ligne.attend_da = [];
    ligne.cree_le = e.cree_le ? String(e.cree_le) : null;
    ligne.pris_le = e.pris_le ? String(e.pris_le) : null;
    ligne.tenu_le = e.tenu_le ? String(e.tenu_le) : null;
    ligne.restitue_le = e.restitue_le ? String(e.restitue_le) : null;
    ligne.reprend = e.reprend ? String(e.reprend) : null;
    if (e.statut === "pris") ligne.livraison = livraisonDe(ctx, eid);
    if (e.statut === "pris") {
      const refus2 = chargerRecord(ctx, eid)?.refus_stream;
      if (refus2) ligne.refus_stream = refus2;
    }
  }
  const das = chargerDas(ctx);
  for (const d of das) {
    Object.assign(d, detailsDa(ctx, String(d.id)));
    const rep = d.engagement_reponse ? String(d.engagement_reponse) : null;
    const bloques = rep && engs.has(rep) ? [...dependantsTransitifs(engs, rep)].sort() : [];
    d.bloque = bloques.map((b) => ({ id: b, titre: engs.get(b).titre ?? null }));
    if (d.statut === "ouverte") {
      for (const b of bloques) rapport.engagements[b].attend_da.push(String(d.id));
    }
    const demandeur = d.engagement ? String(d.engagement).toUpperCase() : null;
    if (demandeur && rapport.engagements[demandeur] && (d.statut === "ouverte" || d.statut === "renvoyee")) {
      const attend = rapport.engagements[demandeur].attend_da;
      if (!attend.includes(String(d.id))) attend.push(String(d.id));
    }
  }
  const sessions = listerLeases(ctx);
  const claims = fs29.existsSync(ctx.claims) ? chargerClaims(ctx) : [];
  const clos = [...engs.values()].filter((e) => e.statut === "tenu" || e.statut === "rompu");
  const tenus = clos.filter((e) => e.statut === "tenu").length;
  const abandonnes = [...engs.values()].filter((e) => e.statut === "abandonne").length;
  const remplaces = [...engs.values()].filter((e) => e.statut === "remplace").length;
  const anomalies = [
    ...erreurs.map((e) => `registre : ${e}`),
    ...avertissements.map((w) => `registre : ${w}`)
  ];
  for (const [eid] of engs) {
    const liv = rapport.engagements[eid].livraison;
    if (liv && liv.statut === "livre" && !liv.spec_update) {
      anomalies.push(`${eid} : livraison sans SPEC_UPDATE.md (remont\xE9e en spec manquante)`);
    }
  }
  for (const c of claims) {
    if (!c || typeof c !== "object" || !c.domaine) {
      anomalies.push(`claim illisible : ${JSON.stringify(c)}`);
      continue;
    }
    if (etatLease(ctx, String(c.eng ?? "")) === null && expiree(c)) {
      anomalies.push(`claim orpheline expir\xE9e : ${c.domaine} (${c.eng})`);
    }
  }
  for (const d of das) {
    if (d.statut === "ouverte") {
      const ech = String(d.echeance_reponse ?? "");
      const m = ech.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m && ech < aujourdHui) anomalies.push(`${d.id} : \xE9ch\xE9ance de r\xE9ponse d\xE9pass\xE9e`);
    }
  }
  for (const r of sessions) {
    if (r.state === "expire") {
      anomalies.push(
        `${r.eng} : lease expir\xE9 sans livraison ; \xE0 re-tirer ou \xE0 solder (son domaine est d\xE9j\xE0 libre)`
      );
    } else if (r.state === "stale") {
      anomalies.push(`${r.eng} : session sans signe de vie depuis ${r.seen_min ?? "?"} min`);
    }
  }
  const coherence = etatCoherence(ctx, engs);
  anomalies.push(...anomaliesCoherence(coherence));
  try {
    anomalies.push(...lignesIncoherences(incoherences(ctx, engs)));
  } catch {
  }
  return {
    genere: isoSecondes(),
    aujourdhui: aujourdHui,
    ppc: {
      tenus,
      rompus: clos.length - tenus,
      abandonnes,
      remplaces,
      pct: clos.length ? Math.floor(100 * tenus / clos.length) : null
    },
    engagements: rapport.engagements,
    frontiere: rapport.frontiere,
    chemins_critiques: rapport.chemins_critiques,
    jalons,
    das,
    claims,
    anomalies,
    sessions,
    sessions_cap: plafond(ctx),
    sessions_actives: sessions.filter((r) => r.state === "active" || r.state === "stale").length,
    paused: enPause(ctx),
    // v2 additive key: the coherence projection (spec 7.10).
    coherence,
    ...declaration.declared ? { streams: projectionStreams(ctx, engs, declaration, das) } : {}
  };
}

// noyau/src/conseils.ts
var fs33 = __toESM(require("node:fs"), 1);
var path29 = __toESM(require("node:path"), 1);

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
var fs30 = __toESM(require("node:fs"), 1);
var path26 = __toESM(require("node:path"), 1);
function fichiersDomaines2(ctx) {
  if (readStreams(ctx).declared) return fichiersDomaines(ctx);
  const table = /* @__PURE__ */ new Map();
  if (!fs30.existsSync(ctx.codification)) return table;
  for (const ligne of lireTexte(ctx.codification).split("\n")) {
    const m = ligne.match(/^\|\s*([A-Z]{2,4})\s*\|[^|]*\|\s*`([^`]+)`\s*\|/);
    if (m) table.set(m[1], path26.join(ctx.recette, m[2]));
  }
  return table;
}
function toutesExigences(ctx) {
  const specs = /* @__PURE__ */ new Map();
  for (const [domaine, fichier] of fichiersDomaines2(ctx)) {
    if (!fs30.existsSync(fichier)) continue;
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
  if (!fs30.existsSync(ctx.engagements)) return cover;
  for (const f of fs30.readdirSync(ctx.engagements).sort()) {
    if (!estDeLaFamille("engagement", f)) continue;
    let doc = {};
    try {
      doc = lireYamlSur(lireTexte(path26.join(ctx.engagements, f))) ?? {};
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
function jalonDe(ctx, specs) {
  if (!fs30.existsSync(ctx.milestones)) return null;
  const vises = new Set(specs);
  for (const ligne of lireTexte(ctx.milestones).split("\n")) {
    const m = ligne.match(/^\|\s*(J-[A-Z0-9]+)\s*\|[^|]*\|([^|]*)\|/);
    if (!m) continue;
    const portees = [...m[2].matchAll(/SPEC-[A-Z]{2,4}-\d{3}/g)].map((x) => x[0]);
    if (portees.some((p) => vises.has(p))) return m[1];
  }
  return null;
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
    parDomaine: [...parDomaine.entries()].sort().map(([domaine, exigences3]) => ({ domaine, exigences: exigences3 })),
    total: retenues.length,
    dejaCouvertes: retenues.filter((e) => e.couvertePar).length
  };
}
function brouillonEngagement(ctx, specIds, options = {}) {
  const ids = specIds.map((s) => s.trim().toUpperCase()).filter(Boolean);
  if (!ids.length) return { ok: false, code: "sans_exigence", erreur: "aucune exigence donn\xE9e" };
  const specs = toutesExigences(ctx);
  const cover = couverture(ctx);
  for (const sid of ids) {
    if (!specs.has(sid)) {
      return { ok: false, code: "exigence_inconnue", erreur: `${sid} introuvable dans le dossier de recette` };
    }
    const deja = cover.get(sid);
    if (deja) {
      return {
        ok: false,
        code: "deja_couverte",
        erreur: `${sid} est d\xE9j\xE0 couverte par ${deja} : pas de doublon de promesse, romps ou solde l'existant d'abord`
      };
    }
  }
  const domaines2 = [...new Set(ids.map((s) => specs.get(s).domaine))].sort();
  const jalon = jalonDe(ctx, ids);
  const eng = reserverNumero(ctx, "ENG", options.par ?? "backlog");
  const titre = options.titre?.trim() || specs.get(ids[0]).titre;
  const implementations = ids.map(
    (s) => `${s} : ${specs.get(s).implementation || "(sans impl\xE9mentation d\xE9clar\xE9e)"}`
  );
  const lignes = [
    `id: ${eng}`,
    "type: realisation",
    `titre: ${JSON.stringify(titre)}`,
    "promettant: null",
    `beneficiaire: ${JSON.stringify(jalon ? `jalon:${jalon}` : "jalon:A-DEFINIR")}`,
    `exigences: [${ids.join(", ")}]`,
    "scope:",
    `  domaines: [${domaines2.join(", ")}]`,
    "  paths: []             # \xC0 COMPL\xC9TER avant tirage (indices dans notes)",
    "definition_of_done: >",
    `  Les exigences ${ids.join(", ")} passent au statut IMPL\xC9MENT\xC9 (tests rattach\xE9s verts,`,
    "  statuts mis \xE0 jour dans le dossier de recette par le coordinator, matrice r\xE9g\xE9n\xE9r\xE9e).",
    "echeance: null",
    "readiness: []",
    "readiness_ok: true",
    "depends_on: []",
    "contrat: null",
    "statut: propose",
    "variance: null",
    "notes: >",
    "  Brouillon d\xE9pos\xE9 depuis le reste \xE0 faire du dossier de recette.",
    `  Impl\xE9mentations d\xE9clar\xE9es (indices pour scope.paths) : ${implementations.join(" ; ")}`,
    ""
  ];
  const fichier = path26.join(ctx.engagements, `${eng}.yaml`);
  fs30.mkdirSync(ctx.engagements, { recursive: true });
  ecrireTexte(fichier, lignes.join("\n"));
  const avertissements = [];
  if (!jalon) {
    avertissements.push(
      "aucune exigence rattach\xE9e \xE0 un jalon de MILESTONES.md : renseigne le b\xE9n\xE9ficiaire, sinon la validation \xE9mettra un avertissement"
    );
  }
  avertissements.push("compl\xE8te scope.paths et depends_on avant tout tirage, puis revalide le registre");
  return { ok: true, eng, fichier, jalon, avertissements };
}

// noyau/src/editions.ts
var fs31 = __toESM(require("node:fs"), 1);
var path27 = __toESM(require("node:path"), 1);
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
  let section2 = "";
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
      section2 = tete[1].replace(/\s+/g, "");
      sousTable = null;
      const d = section2.match(SECTION_DEPS);
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
    if (section2 === "package") {
      if (cle === "name") {
        m.nom = chaine(valeur);
        m.ligneNom = i + 1;
      } else if (cle === "version") m.version = chaine(valeur) ?? (dansTable(valeur, "workspace") !== null || /workspace\s*=\s*true/.test(valeur) ? "workspace" : null);
      else if (cle === "version.workspace") m.version = "workspace";
    } else if (section2 === "workspace.package") {
      if (cle === "version") m.versionEspace = chaine(valeur);
    } else if (section2 === "package.metadata.lean-engine" || section2 === "package.metadata.agelaios") {
      if (cle === "edition") {
        m.tag = chaine(valeur);
        m.ligneTag = i + 1;
      }
    } else if (sousTable) {
      if (cle === "package") sousTable.nom = chaine(valeur) ?? sousTable.nom;
      else if (cle === "version") sousTable.exigence = chaine(valeur);
    } else {
      const d = section2.match(SECTION_DEPS);
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
  const cheminRegistre2 = path27.join(racine, ...EDITION_REGISTRY.split("/"));
  if (!fs31.existsSync(cheminRegistre2)) return vide;
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
  for (const rel3 of fichiers ?? fichiersSuivis(racine)) {
    let texte;
    try {
      texte = lireTexte(path27.join(racine, ...rel3.split("/")));
    } catch {
      continue;
    }
    const npm = rel3.endsWith("package.json");
    const manifeste = npm ? lireManifesteNpm(texte) : lireManifesteCargo(texte);
    if (!npm && manifeste.versionEspace) versionsEspace.set(path27.posix.dirname(rel3), manifeste.versionEspace);
    lus.push({ rel: rel3, manifeste, npm });
  }
  const versionHeritee = (rel3) => {
    let dossier = path27.posix.dirname(rel3);
    for (; ; ) {
      const v = versionsEspace.get(dossier);
      if (v) return v;
      const parent = path27.posix.dirname(dossier);
      if (parent === dossier || parent === ".") return versionsEspace.get(parent) ?? null;
      dossier = parent;
    }
  };
  const alias = /* @__PURE__ */ new Map();
  for (const { rel: rel3, manifeste, npm } of lus) {
    if (!manifeste.nom) continue;
    const segments = rel3.split("/");
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
      fichier: rel3,
      manifeste,
      edition: classe ? classe.edition : null,
      version: manifeste.version === "workspace" ? versionHeritee(rel3) : manifeste.version,
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

// noyau/src/structure.ts
var fs32 = __toESM(require("node:fs"), 1);
var path28 = __toESM(require("node:path"), 1);
var SEUIL_ENTONNOIR = 6;
var SEUIL_CONCENTRATION = 3;
var SEUIL_CHAINE = 3;
var jalonDe2 = (e) => {
  const b = String(e.beneficiaire ?? "");
  return b.startsWith("jalon:") ? b.slice(6) : null;
};
function entonnoirs(engs, seuil = SEUIL_ENTONNOIR) {
  const sortie = [];
  for (const [id, e] of engs) {
    if (estClos(e.statut)) continue;
    const preds = dependsOn(e).filter((d) => d.type === "finish-start" && engs.has(String(d.eng))).map((d) => String(d.eng));
    if (preds.length <= seuil) continue;
    sortie.push({ eng: id, jalon: jalonDe2(e), predecesseurs: preds, en_attente: preds.filter((p) => !predecesseurSatisfait(engs, p)) });
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
        sortie.push({ eng: id, parent: String(d.eng), jalon: jalonDe2(e) });
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
    const siens = [...engs.values()].filter((e) => jalonDe2(e) === jalon);
    const uneInterface = siens.some((e) => dependsOn(e).some((d) => d.type === "interface"));
    if (uneInterface) continue;
    sortie.push({ jalon, chaine: restante });
  }
  return sortie;
}
function coutDe(ctx, id, e) {
  const pris = parseIso(e.pris_le);
  const livre = parseIso(e.restitue_le);
  const tenu = parseIso(e.tenu_le);
  const heures = (a, b) => a && b && b.getTime() >= a.getTime() ? Math.round((b.getTime() - a.getTime()) / 36e5 * 10) / 10 : null;
  const verdicts = verdictsDe(ctx, id);
  const sorties = path28.join(ctx.livraisons, id, "SORTIES_TESTS.txt");
  let builds = 0;
  let secondes = 0;
  let tests = 0;
  if (fs32.existsSync(sorties)) {
    const texte = lireTexte(sorties);
    for (const m of texte.matchAll(/Finished `?\w+`? profile .*? in (?:([\d.]+)m )?([\d.]+)s/g)) {
      builds += 1;
      secondes += Number(m[1] || 0) * 60 + Number(m[2]);
    }
    for (const m of texte.matchAll(/test result: \w+\. (\d+) passed/g)) tests += Number(m[1]);
  }
  return {
    eng: id,
    travail_h: heures(pris, livre),
    verification_h: heures(livre, tenu),
    mandats: verdicts.length,
    rejets: verdicts.filter((v) => v.verdict === "reject").length,
    builds,
    builds_min: Math.round(secondes / 60 * 10) / 10,
    tests
  };
}
var mediane = (a) => {
  const t = a.filter((x) => Number.isFinite(x)).sort((x, y) => x - y);
  return t.length ? t[Math.floor(t.length / 2)] : null;
};
function bilanJalon(ctx, engs, jalon, occupes) {
  const siens = [...engs.entries()].filter(([, e]) => jalonDe2(e) === jalon);
  if (!siens.length) return null;
  const ids = new Set(siens.map(([id]) => id));
  const prets = frontiere(engs, occupes).map(([id]) => id).filter((id) => ids.has(id));
  const chevauchements = [];
  const independants = [];
  for (let i = 0; i < prets.length; i++) {
    for (let j = i + 1; j < prets.length; j++) {
      const paires = chevauchement(cheminsScope(engs.get(prets[i])), cheminsScope(engs.get(prets[j])));
      const domCommun = domaines(engs.get(prets[i])).some((d) => domaines(engs.get(prets[j])).includes(d));
      if (paires.length) chevauchements.push({ a: prets[i], b: prets[j], chemins: paires.slice(0, 3).map(([x, y]) => `${x} ~ ${y}`) });
      else if (!domCommun || occupes?.parChemins) independants.push([prets[i], prets[j]]);
    }
  }
  const couts = siens.filter(([, e]) => e.statut === "tenu").map(([id, e]) => coutDe(ctx, id, e));
  const sousRegistre = new Map(siens);
  return {
    jalon,
    engagements: siens.length,
    tenus: couts.length,
    chemin_critique: (cheminsCritiques(ctx, engs)[jalon] ?? []).filter((id) => engs.get(id)?.statut !== "tenu"),
    entonnoirs: entonnoirs(engs).filter((x) => x.jalon === jalon),
    suites_dans_le_scope: suitesDansLeScope(engs).filter((x) => x.jalon === jalon),
    prets,
    chevauchements,
    independants,
    concentration: concentrationChemins(sousRegistre, occupes),
    sans_contrat: chainesSansContrat(ctx, engs).some((c) => c.jalon === jalon),
    couts,
    mediane_travail_h: mediane(couts.map((c) => c.travail_h ?? NaN)),
    mediane_verification_h: mediane(couts.map((c) => c.verification_h ?? NaN))
  };
}
function etatDans(engs, id, occupes) {
  return engs.has(id) ? etatCalcule(engs, id, occupes) : "?";
}

// noyau/src/conseils.ts
function blocageSurPrecedence(ctx, l) {
  for (const f of [path29.join(String(l.worktree ?? ""), "BLOCKED.md"), path29.join(ctx.livraisons, l.eng, "BLOCKED.md")]) {
    try {
      if (fs33.existsSync(f)) return blocksOnPrecedence(fs33.readFileSync(f, "utf-8"));
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
    const refus2 = editions(ctx).findings.filter((f) => f.gravite === "refus");
    if (refus2.length) {
      const parRegle = /* @__PURE__ */ new Map();
      for (const f of refus2) parRegle.set(f.regle, (parRegle.get(f.regle) ?? 0) + 1);
      sortie.push({
        gravite: "attente",
        constat: `${refus2.length} edition finding(s) between Standard and Program (` + [...parRegle].map(([r, n]) => `${n} ${r}`).join(", ") + `), the first in ${refus2[0].fichier}:${refus2[0].ligne}`,
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
    if (l.state === "bloque" && fs33.existsSync(path29.join(ctx.livraisons, l.eng, "ANSWER.md"))) {
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
  const enAttente2 = [...engs.keys()].filter((e) => etatCalcule(engs, e) === "en_attente");
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
  if (!prets.length && enAttente2.length) {
    const bloquants = goulots(engs).slice(0, 3);
    sortie.push({
      gravite: "bloquant",
      constat: `la fronti\xE8re est vide alors que ${enAttente2.length} engagement(s) attendent`,
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

// noyau/src/essai.ts
var import_node_child_process7 = require("node:child_process");
var fs34 = __toESM(require("node:fs"), 1);
var path30 = __toESM(require("node:path"), 1);
function interpreteur(voulu) {
  const choix = (voulu ?? "").toLowerCase();
  if (choix === "cmd") return { fichier: "cmd.exe", args: ["/d", "/s", "/c"] };
  if (choix === "powershell") return { fichier: "powershell.exe", args: ["-NoProfile", "-NonInteractive", "-Command"] };
  if (choix === "sh") return { fichier: "sh", args: ["-c"] };
  if (choix === "bash" || process.platform !== "win32") return { fichier: "bash", args: ["-lc"] };
  const r = (0, import_node_child_process7.spawnSync)("bash", ["-c", "true"], { encoding: "utf-8", windowsHide: true, timeout: 5e3 });
  return r.status === 0 ? { fichier: "bash", args: ["-lc"] } : { fichier: "cmd.exe", args: ["/d", "/s", "/c"] };
}
function jouerEssai(entree) {
  const debut = Date.now();
  const options = {
    cwd: entree.cwd,
    encoding: "utf-8",
    windowsHide: true,
    maxBuffer: 256 * 1024 * 1024,
    timeout: entree.timeoutMs,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }
  };
  let commande;
  let r;
  if (entree.argv && entree.argv.length) {
    commande = entree.argv.map((a) => /\s/.test(a) ? JSON.stringify(a) : a).join(" ");
    r = (0, import_node_child_process7.spawnSync)(entree.argv[0], entree.argv.slice(1), options);
  } else {
    commande = String(entree.commande ?? "").trim();
    const sh = interpreteur(entree.shell);
    r = (0, import_node_child_process7.spawnSync)(sh.fichier, [...sh.args, commande], options);
  }
  const ms = Date.now() - debut;
  const texte = [r.stdout ?? "", r.stderr ?? ""].filter(Boolean).join(r.stdout && r.stderr && !String(r.stdout).endsWith("\n") ? "\n" : "");
  let exit = typeof r.status === "number" ? r.status : -1;
  let note = "";
  if (r.error) {
    note = `${r.error.code === "ETIMEDOUT" ? "timed out" : r.error.message}
`;
    exit = exit === 0 ? -1 : exit;
  }
  return { commande, exit, ms, sortie: `${texte}${note}` };
}
function consignerEssai(fichier, essai) {
  fs34.mkdirSync(path30.dirname(path30.resolve(fichier)), { recursive: true });
  fs34.appendFileSync(fichier, blocEssai(essai.commande, essai.sortie, essai.exit, essai.ms), "utf-8");
}

// noyau/src/integration.ts
var import_node_child_process8 = require("node:child_process");
var crypto6 = __toESM(require("node:crypto"), 1);
var fs35 = __toESM(require("node:fs"), 1);
var path32 = __toESM(require("node:path"), 1);

// noyau/src/manifestes.ts
var path31 = __toESM(require("node:path"), 1);
function dossierDe2(chemin) {
  const i = chemin.lastIndexOf("/");
  return i < 0 ? "" : chemin.slice(0, i);
}
function contient(dossier, chemin) {
  return dossier === "" || chemin.startsWith(dossier + "/");
}
function sansCommentaires(texte) {
  return texte.split("\n").map((ligne) => {
    let guillemet = null;
    for (let i = 0; i < ligne.length; i++) {
      const c = ligne[i];
      if (guillemet) {
        if (c === guillemet) guillemet = null;
      } else if (c === '"' || c === "'") guillemet = c;
      else if (c === "#") return ligne.slice(0, i);
    }
    return ligne;
  }).join("\n");
}
function tableauDe(table, cle) {
  const m = table.match(new RegExp(`^\\s*${cle}\\s*=\\s*\\[([\\s\\S]*?)\\]`, "m"));
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]*)"|'([^']*)'/g)].map((x) => x[1] ?? x[2] ?? "");
}
function espaceCargo(texte) {
  const propre = sansCommentaires(texte.replace(/\r\n/g, "\n"));
  const lignes = propre.split("\n");
  const debut = lignes.findIndex((l) => /^\s*\[\s*workspace\s*\]\s*$/.test(l));
  if (debut < 0) return null;
  let fin = lignes.length;
  for (let i = debut + 1; i < lignes.length; i++) {
    if (/^\s*\[/.test(lignes[i])) {
      fin = i;
      break;
    }
  }
  const table = lignes.slice(debut + 1, fin).join("\n");
  return { membres: tableauDe(table, "members"), exclus: tableauDe(table, "exclude") };
}
function globCargo(motif) {
  let re = "^";
  for (let i = 0; i < motif.length; i++) {
    const c = motif[i];
    if (c === "*" && motif[i + 1] === "*") {
      re += "[\\s\\S]*";
      i++;
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(re + "$");
}
function nommePar(dossier, racine, motifs) {
  return motifs.some((m) => {
    const absolu = path31.posix.normalize(path31.posix.join(racine, m.trim())).replace(/\/+$/, "");
    if (absolu.startsWith("..")) return false;
    return globCargo(absolu === "." ? "" : absolu).test(dossier);
  });
}
function dossiersGouvernes(manifeste, lire) {
  const dossier = dossierDe2(manifeste);
  const dossiers = [dossier];
  if ((manifeste.split("/").pop() ?? "") !== "Cargo.toml") return dossiers;
  let parent = dossier;
  while (parent !== "") {
    parent = dossierDe2(parent);
    const texte = lire(parent ? `${parent}/Cargo.toml` : "Cargo.toml");
    if (texte === null) continue;
    const espace = espaceCargo(texte);
    if (!espace) continue;
    if (nommePar(dossier, parent, espace.membres) && !nommePar(dossier, parent, espace.exclus)) dossiers.push(parent);
    break;
  }
  return dossiers;
}
function cheminGouverne(manifeste, livres, lecteurs) {
  const dossiers = /* @__PURE__ */ new Set();
  for (const lire of lecteurs) for (const d of dossiersGouvernes(manifeste, lire)) dossiers.add(d);
  for (const p of livres) {
    for (const d of dossiers) if (contient(d, p)) return p;
  }
  return null;
}
function cheminsGeneres(ctx) {
  const rel3 = path31.relative(ctx.racine, ctx.dashboard).replace(/\\/g, "/");
  return rel3 && !rel3.startsWith("..") ? [rel3] : [];
}
function avanceRetenue(chemin, a) {
  if (a.livres.has(chemin)) return true;
  if (estFichierGenere(chemin, a.generes)) return false;
  if (estManifesteDeDependances(chemin)) return cheminGouverne(chemin, a.livres, a.lecteurs) !== null;
  return dansMotifs(chemin, a.scope);
}

// noyau/src/integration.ts
function refus(code, motif, erreur, extra = {}) {
  return { code, corps: { ok: false, code: motif, erreur, ...extra } };
}
function brancheExiste(racine, branche) {
  return git(["rev-parse", "--verify", "-q", `refs/heads/${branche}`], racine).code === 0;
}
function empreinteBranche(racine, branche) {
  const base = git(["merge-base", "master", branche], racine);
  if (base.code !== 0) return null;
  const diff = git(["diff", base.stdout.trim(), branche], racine);
  if (diff.code !== 0) return null;
  return "sha256:" + crypto6.createHash("sha256").update(diff.stdout, "utf-8").digest("hex");
}
function suivisNonCommites(worktree) {
  const r = git(["status", "--porcelain", "--untracked-files=no"], worktree);
  return r.stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim());
}
function fichiersEtrangers(worktree) {
  const r = git(["status", "--porcelain"], worktree);
  if (r.code !== 0) return ["(git status failed)"];
  const admis = new Set(EXTRAS_AUTORISES);
  return r.stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim().replace(/^"|"$/g, "")).filter((p) => !admis.has(p) && !p.startsWith(".eng/") && p !== ".eng");
}
function lireEngagement(ctx, eng) {
  const f = cheminEngagement(ctx, eng);
  if (!fs35.existsSync(f)) return null;
  try {
    return lireYamlSur(lireTexte(f)) ?? null;
  } catch {
    return null;
  }
}
function zoneDe(engagement) {
  const scope = engagement.scope ?? {};
  const domaines2 = Array.isArray(scope.domaines) ? scope.domaines.map(String) : [];
  return domaines2.length ? domaines2[0].toLowerCase() : "eng";
}
function poserTenu(ctx, eng) {
  const f = cheminEngagement(ctx, eng);
  const t = lireTexte(f);
  const t2 = t.replace(/^statut: pris\s*$/m, "statut: tenu");
  if (t2 === t) return false;
  const horodate = /^tenu_le:.*$/m.test(t2) ? t2.replace(/^tenu_le:.*$/m, `tenu_le: '${isoSecondes()}'`) : t2.replace(/^(statut: tenu)$/m, `$1
tenu_le: '${isoSecondes()}'`);
  ecrireTexte(f, horodate);
  return true;
}
function pousserMaster(racine) {
  const suivi = git(["config", "--get", "branch.master.remote"], racine).stdout.trim();
  const remotes = git(["remote"], racine).stdout.split("\n").map((l) => l.trim()).filter(Boolean);
  const remote = suivi && suivi !== "." ? suivi : remotes.includes("origin") ? "origin" : null;
  if (!remote) return { pousse: null, erreur: null };
  const r = (0, import_node_child_process8.spawnSync)("git", ["push", remote, "master"], {
    cwd: racine,
    encoding: "utf-8",
    windowsHide: true,
    timeout: 12e4,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" }
  });
  if (r.status === 0) return { pousse: true, erreur: null };
  const cause = r.error ? r.error.message : (r.stderr || r.stdout || "").trim().split("\n").filter(Boolean).slice(-3).join(" ");
  return { pousse: false, erreur: `git push ${remote} master: ${cause || "no output"}` };
}
var DOSSIERS_DE_BUILD = /* @__PURE__ */ new Set(["node_modules", "target", "dist", "build", "out", ".cache", ".pnpm-store", "__pycache__", ".venv", ".turbo"]);
var ETRANGERS_MAX_FICHIERS = 500;
var ETRANGERS_MAX_OCTETS = 50 * 1024 * 1024;
function archiverEtrangers(ctx, eng, worktree) {
  if (!fs35.existsSync(worktree)) return { listes: 0, copies: 0, manifeste: null };
  const r = git(["status", "--porcelain", "--ignored", "--untracked-files=all"], worktree);
  if (r.code !== 0) return { listes: 0, copies: 0, manifeste: null };
  const admis = new Set(EXTRAS_AUTORISES);
  const entrees = r.stdout.split("\n").filter((l) => /^(\?\?|!!) /.test(l)).map((l) => l.slice(3).trim().replace(/^"|"$/g, "").replace(/\\/g, "/")).filter((p) => p && !admis.has(p) && !p.startsWith(".eng/") && p !== ".eng" && p !== ".eng/");
  if (!entrees.length) return { listes: 0, copies: 0, manifeste: null };
  const dossierCopies = path32.join(ctx.runs, "etrangers", eng);
  const lignes = [
    `# Files of the worktree of ${eng} that no commit held when it was removed`,
    "",
    `Removed on ${isoSecondes()}. Copies, build outputs aside, under ${dossierCopies}.`,
    "A file listed here was never part of the delivery: if the work needs it, commit it in the successor.",
    ""
  ];
  let copies = 0;
  let octets = 0;
  for (const p of entrees) {
    const premier = p.split("/")[0];
    const estBuild = DOSSIERS_DE_BUILD.has(premier) || p.split("/").some((seg) => DOSSIERS_DE_BUILD.has(seg));
    if (estBuild) {
      lignes.push(`- ${p} (build output, not copied)`);
      continue;
    }
    const source = path32.join(worktree, p);
    let fichiers = [];
    try {
      fichiers = fs35.statSync(source).isDirectory() ? listerFichiers(source) : [source];
    } catch {
      lignes.push(`- ${p} (unreadable, not copied)`);
      continue;
    }
    let copiesIci = 0;
    for (const f of fichiers) {
      if (copies >= ETRANGERS_MAX_FICHIERS || octets >= ETRANGERS_MAX_OCTETS) break;
      try {
        const taille = fs35.statSync(f).size;
        const rel3 = path32.relative(worktree, f);
        const cible = path32.join(dossierCopies, rel3);
        fs35.mkdirSync(path32.dirname(cible), { recursive: true });
        fs35.copyFileSync(f, cible);
        copies += 1;
        copiesIci += 1;
        octets += taille;
      } catch {
      }
    }
    lignes.push(`- ${p} (${copiesIci} of ${fichiers.length} file(s) copied)`);
  }
  const manifeste = path32.join(ctx.livraisons, eng, "ETRANGERS.md");
  fs35.mkdirSync(path32.dirname(manifeste), { recursive: true });
  ecrireTexte(manifeste, lignes.join("\n") + "\n");
  return { listes: entrees.length, copies, manifeste };
}
function listerFichiers(dossier) {
  const sortie = [];
  const pile = [dossier];
  while (pile.length && sortie.length < ETRANGERS_MAX_FICHIERS * 2) {
    const d = pile.pop();
    for (const nom of fs35.readdirSync(d)) {
      if (DOSSIERS_DE_BUILD.has(nom)) continue;
      const p = path32.join(d, nom);
      try {
        if (fs35.statSync(p).isDirectory()) pile.push(p);
        else sortie.push(p);
      } catch {
      }
    }
  }
  return sortie;
}
function troncAvanceSur(ctx, engagement, branche, masterSha) {
  if (!masterSha) return [];
  const tete = git(["rev-parse", "master"], ctx.racine).stdout.trim();
  if (!tete || tete === masterSha) return [];
  const bouge = git(["diff", "--name-only", masterSha, "master"], ctx.racine).stdout.split("\n").map((l) => l.trim().replace(/\\/g, "/")).filter(Boolean);
  if (!bouge.length) return [];
  const base = git(["merge-base", "master", branche], ctx.racine).stdout.trim();
  const livres = new Set(
    (base ? git(["diff", "--name-only", base, branche], ctx.racine).stdout : "").split("\n").map((l) => l.trim().replace(/\\/g, "/")).filter(Boolean)
  );
  const lecteur = (revision) => (chemin) => {
    const r = git(["show", `${revision}:${chemin}`], ctx.racine);
    return r.code === 0 ? r.stdout : null;
  };
  const avance = { livres, scope: cheminsScope(engagement), generes: cheminsGeneres(ctx), lecteurs: [lecteur("master"), lecteur(branche)] };
  return bouge.filter((p) => avanceRetenue(p, avance));
}
function retirerWorktree(ctx, eng, worktree, branche) {
  let reste = null;
  let etrangers = 0;
  if (fs35.existsSync(worktree)) {
    try {
      etrangers = archiverEtrangers(ctx, eng, worktree).listes;
    } catch {
    }
    const r = git(["worktree", "remove", "--force", worktree], ctx.racine);
    if (r.code !== 0 && fs35.existsSync(worktree)) {
      try {
        fs35.rmSync(worktree, { recursive: true, force: true, maxRetries: 2, retryDelay: 150 });
      } catch {
      }
    }
    if (fs35.existsSync(worktree)) {
      reste = `the worktree ${worktree} of ${eng} could not be removed (${(r.stderr || r.stdout).trim() || "directory in use"}): close the session or the window that holds it, then run lean menage`;
    }
  }
  git(["worktree", "prune"], ctx.racine);
  let brancheSupprimee = !brancheExiste(ctx.racine, branche);
  if (!brancheSupprimee && !fs35.existsSync(worktree)) {
    brancheSupprimee = git(["branch", "-d", branche], ctx.racine).code === 0;
  }
  return { worktree_supprime: !fs35.existsSync(worktree), branche_supprimee: brancheSupprimee, reste, etrangers };
}
function integrer(ctx, engBrut) {
  const eng = String(engBrut ?? "").trim().toUpperCase();
  if (!/^ENG-\d{4}$/.test(eng)) return refus(400, "engagement_invalide", `'${engBrut}' is not a commitment identifier`);
  const engagement = lireEngagement(ctx, eng);
  if (!engagement) return refus(404, "engagement_inconnu", `${eng} is not in the registry`);
  const mandat = chargerMandat(ctx, eng);
  if (!mandat || mandat.statut !== "rendu" || mandat.verdict !== "approve") {
    return refus(
      409,
      "verdict_absent",
      `${eng} has no approving verdict: integration follows verification (/verify ${eng}), it never replaces it`
    );
  }
  const rec = chargerRecord(ctx, eng);
  const worktree = String(rec?.worktree ?? cheminWorktree(ctx, eng));
  const branche = String(rec?.branch ?? brancheEngagement(eng));
  const statut = String(engagement.statut ?? "");
  const dejaTenu = statut === "tenu";
  if (!dejaTenu && statut !== "pris") {
    return refus(409, "statut_inattendu", `${eng} has the status '${statut}': only a commitment in flight is integrated`);
  }
  let mergeSha = null;
  const brancheLa = brancheExiste(ctx.racine, branche);
  if (!brancheLa && !dejaTenu) {
    return refus(409, "branche_absente", `the branch ${branche} of ${eng} does not exist: nothing can be merged`);
  }
  if (brancheLa) {
    const tete = git(["rev-parse", branche], ctx.racine).stdout.trim();
    const integree = estAncetreDeMaster(ctx.racine, tete) === true;
    if (!integree) {
      if (fs35.existsSync(worktree)) {
        const sales = suivisNonCommites(worktree);
        if (sales.length) {
          return refus(
            409,
            "travail_non_commite",
            `${eng}: ${sales.length} tracked file(s) are modified and not committed in ${worktree} (${sales.slice(0, 5).join(", ")}). A merge would leave them behind: commit them, deliver again, verify again`
          );
        }
      }
      const courante = fs35.existsSync(worktree) ? empreinteDiff(worktree)?.empreinte ?? null : empreinteBranche(ctx.racine, branche);
      if (courante !== mandat.diff_empreinte) {
        return refus(
          409,
          "empreinte_divergente",
          `${eng}: the delivery changed after the verdict (the mandate froze ${mandat.diff_empreinte}). Deliver again, then verify again: /verify ${eng}`
        );
      }
      const tronc = git(["symbolic-ref", "--short", "-q", "HEAD"], ctx.racine).stdout.trim();
      if (tronc !== "master") {
        return refus(
          409,
          "tronc_indisponible",
          `the main checkout is on '${tronc || "a detached head"}', not on master: check master out, then run lean integrer ${eng}`
        );
      }
      if (lireConfig(ctx).integration_master_avance_bloquante) {
        const avance = troncAvanceSur(ctx, engagement, branche, mandat.master_sha);
        if (avance.length) {
          return refus(
            409,
            "master_avance",
            `${eng}: master moved since the mandate ${String(mandat.mandat)} was issued, on ${avance.length} path(s) the delivery shares with it (${avance.slice(0, 6).join(", ")}${avance.length > 6 ? ", and others" : ""}): the merge result was never tested. In the worktree ${worktree}: merge master into ${branche}, run the tests, commit, then eng push --livraison and /verify ${eng}`,
            { chemins: avance }
          );
        }
      }
      const message = `merge(${zoneDe(engagement)}): ${eng} verdict approve, ${String(engagement.titre ?? "").trim()} [${eng}]`;
      const fusion = git(["merge", "--no-ff", "--no-edit", "-m", message, branche], ctx.racine);
      if (fusion.code !== 0) {
        const conflits = git(["diff", "--name-only", "--diff-filter=U"], ctx.racine).stdout.split("\n").filter((l) => l.trim());
        git(["merge", "--abort"], ctx.racine);
        return refus(
          409,
          "conflit_integration",
          `${eng}: the merge into master did not apply and was aborted, master is untouched. ` + (conflits.length ? `Conflicting file(s): ${conflits.slice(0, 8).join(", ")}. ` : `${(fusion.stderr || fusion.stdout).trim().split("\n").slice(0, 3).join(" ")} `) + `In the worktree ${worktree}: merge master into ${branche}, resolve, commit, then eng push --livraison and /verify ${eng} (the diff changes, so a new mandate is required)`,
          { conflits }
        );
      }
    }
    mergeSha = git(["rev-parse", "HEAD"], ctx.racine).stdout.trim() || null;
  }
  archiverRapport(ctx, eng);
  const portes = EXTRAS_AUTORISES.filter(
    (nom) => git(["ls-files", "--error-unmatch", "--", nom], ctx.racine).code === 0
  );
  if (portes.length && git(["rm", "-q", "--", ...portes], ctx.racine).code === 0) {
    git(["commit", "-q", "-m", `chore(steering): ${eng} delivery artefacts leave the trunk [${eng}]`, "--", ...portes], ctx.racine);
  }
  if (!dejaTenu) poserTenu(ctx, eng);
  const liberees = libererClaims(ctx, eng);
  if (rec) solderRecord(ctx, eng, "fin");
  try {
    genererDashboard(ctx);
  } catch {
  }
  let registreCommit = null;
  const chemins = [cheminEngagement(ctx, eng), ctx.claims, ctx.dashboard, path32.join(ctx.livraisons, eng)].filter(
    (p) => fs35.existsSync(p)
  );
  git(["add", "--", ...chemins], ctx.racine);
  const aCommiter = git(["status", "--porcelain", "--", ...chemins], ctx.racine).stdout.trim();
  if (aCommiter) {
    const c = git(
      ["commit", "-q", "-m", `chore(steering): ${eng} tenu, verdict approve and delivery record [${eng}]`, "--", ...chemins],
      ctx.racine
    );
    if (c.code === 0) registreCommit = git(["rev-parse", "HEAD"], ctx.racine).stdout.trim() || null;
  }
  const push = lireConfig(ctx).push_apres_integration ? pousserMaster(ctx.racine) : { pousse: null, erreur: null };
  const retrait = retirerWorktree(ctx, eng, worktree, branche);
  const brancheDistanteRetiree = push.pousse === true && retrait.branche_supprimee ? retireRemoteBranch(ctx, branche) : null;
  const suite = [
    retrait.reste,
    retrait.etrangers ? `${retrait.etrangers} file(s) that no commit held were in the worktree: listed in the delivery record (ETRANGERS.md), copied under the runs` : null,
    push.erreur ? `the push of master was refused (${push.erreur}): remove the cause, then run lean integrer ${eng}` : null
  ].filter(Boolean).join(". ") || `${eng} is merged, held and closed: nothing is left to do`;
  return {
    code: 200,
    corps: {
      ok: true,
      eng,
      statut: "tenu",
      merge: mergeSha,
      registre_commit: registreCommit,
      registre_non_commite: Boolean(aCommiter) && !registreCommit,
      claims_liberes: liberees,
      pousse: push.pousse,
      push_erreur: push.erreur,
      worktree_supprime: retrait.worktree_supprime,
      branche_supprimee: retrait.branche_supprimee,
      branche_distante_retiree: brancheDistanteRetiree,
      etrangers: retrait.etrangers,
      suite
    }
  };
}
function integrationsDues(ctx) {
  const dues = [];
  for (const l of listerLeases(ctx)) {
    const m = chargerMandat(ctx, l.eng);
    if (m && m.statut === "rendu" && m.verdict === "approve") dues.push(l.eng);
  }
  return dues;
}
function worktreesARetirer(ctx) {
  if (!fs35.existsSync(ctx.wt)) return [];
  const sortie = [];
  for (const nom of fs35.readdirSync(ctx.wt)) {
    const m = nom.match(/^eng-(\d{4})$/);
    if (!m) continue;
    const eng = `ENG-${m[1]}`;
    if (chargerRecord(ctx, eng)) continue;
    const engagement = lireEngagement(ctx, eng);
    if (engagement && String(engagement.statut) === "tenu") sortie.push(eng);
  }
  return sortie.sort();
}
function retirerWorktreesIntegres(ctx) {
  const retires = [];
  const restes = [];
  for (const eng of worktreesARetirer(ctx)) {
    const worktree = cheminWorktree(ctx, eng);
    const branche = brancheEngagement(eng);
    if (brancheExiste(ctx.racine, branche)) {
      const tete = git(["rev-parse", branche], ctx.racine).stdout.trim();
      if (estAncetreDeMaster(ctx.racine, tete) !== true) {
        restes.push(`${eng}: the branch ${branche} is not merged into master`);
        continue;
      }
    }
    const etrangers = fichiersEtrangers(worktree);
    if (etrangers.length) {
      restes.push(
        `${eng}: ${worktree} holds ${etrangers.length} file(s) that are neither committed nor delivery artefacts (${etrangers.slice(0, 4).join(", ")})`
      );
      continue;
    }
    const r = retirerWorktree(ctx, eng, worktree, branche);
    if (r.worktree_supprime) retires.push(eng);
    else restes.push(r.reste ?? `${eng}: the worktree could not be removed`);
  }
  return { retires, restes };
}

// noyau/src/migration.ts
var fs36 = __toESM(require("node:fs"), 1);
var path33 = __toESM(require("node:path"), 1);
var NON_VERSIONNES = ["runs/", "journal/"];
var CIBLE_REL = `${DOSSIER_LEAN_ENGINE}/${DOSSIER_ORCHESTRATION}`;
var posix3 = (p) => p.split(path33.sep).join("/");
var relatif = (ctx, p) => posix3(path33.relative(ctx.racine, p));
var cibleDe = (racine) => path33.join(racine, DOSSIER_LEAN_ENGINE, DOSSIER_ORCHESTRATION);
function preconditions(ctx, emmener = false) {
  const problemes = [];
  const leases = listerLeases(ctx);
  const auTravail = leases.filter((r) => r.state === "active").map((r) => r.eng);
  if (auTravail.length) {
    problemes.push(`session(s) au travail en ce moment (${auTravail.join(", ")}) : attendre leur livraison, ou r\xE9voquer`);
  }
  const vivants = leases.filter((r) => ["stale", "livre", "bloque"].includes(r.state)).map((r) => r.eng);
  if (vivants.length && !emmener) {
    problemes.push(
      `leases vivants (${vivants.join(", ")}) : les solder d'abord, ou --emmener-sessions pour les d\xE9placer avec l'\xE9tat`
    );
  }
  const actives = emmener ? [] : chargerClaims(ctx).filter((c) => detenue(ctx, c));
  if (actives.length) {
    problemes.push(`claims d\xE9tenues (${actives.map((c) => c.domaine).join(", ")}) : lib\xE9rer avant migration`);
  }
  const suivis = planMigration(ctx).map((e) => relatif(ctx, e.de));
  const statut = suivis.length ? git(["status", "--porcelain", "--", ...suivis], ctx.racine) : { stdout: "" };
  const horsVersion = NON_VERSIONNES.map((n) => `${relatif(ctx, ctx.etat)}/${n}`);
  const sales = statut.stdout.split("\n").filter((l) => l.trim()).map((l) => l.slice(3).trim().replace(/^"|"$/g, "")).filter((p) => !horsVersion.some((h) => p.startsWith(h) || `${p}/` === h));
  if (sales.length) {
    problemes.push(`arbre git non propre sous l'\xE9tat \xE0 d\xE9placer (${sales.slice(0, 4).join(", ")}) : committer d'abord`);
  }
  const erreurs = [];
  const engs = chargerRegistre(ctx, erreurs);
  const v = valider(ctx, engs);
  if (erreurs.length || v.erreurs.length) problemes.push("registre invalide : corriger avant migration");
  return problemes;
}
function deplacer(racine, source, cible) {
  if (!fs36.existsSync(source)) return null;
  if (fs36.existsSync(cible)) return `${posix3(path33.relative(racine, cible))} existe d\xE9j\xE0 : rien n'est \xE9cras\xE9`;
  fs36.mkdirSync(path33.dirname(cible), { recursive: true });
  const rel3 = posix3(path33.relative(racine, source));
  const suivi = git(["ls-files", "--", rel3], racine).stdout.trim() !== "";
  if (suivi) {
    let r = git(["mv", rel3, posix3(path33.relative(racine, cible))], racine);
    for (let essai = 0; essai < 4 && r.code !== 0 && /index/i.test(r.stderr) && fs36.existsSync(source); essai++) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400);
      r = git(["mv", rel3, posix3(path33.relative(racine, cible))], racine);
    }
    if (r.code !== 0) return `git mv ${rel3} : ${r.stderr.trim()}`;
    if (fs36.existsSync(source) && fs36.statSync(source).isDirectory()) {
      for (const reste of fs36.readdirSync(source)) {
        fs36.renameSync(path33.join(source, reste), path33.join(cible, reste));
      }
      fs36.rmSync(source, { recursive: true, force: true });
    }
    return null;
  }
  try {
    fs36.renameSync(source, cible);
    return null;
  } catch (e) {
    return `d\xE9placement de ${rel3} : ${String(e.message)}`;
  }
}
function deplacerRuns(ctx, cible) {
  fs36.mkdirSync(cible, { recursive: true });
  for (const nom of fs36.readdirSync(ctx.runs)) {
    if (path33.resolve(ctx.runs, nom) === path33.resolve(ctx.verrou)) continue;
    try {
      fs36.renameSync(path33.join(ctx.runs, nom), path33.join(cible, nom));
    } catch (e) {
      return `d\xE9placement de runs/${nom} : ${String(e.message)}`;
    }
  }
  return null;
}
var dossierVide = (d) => fs36.readdirSync(d).every((n) => {
  const p = path33.join(d, n);
  return fs36.statSync(p).isDirectory() && dossierVide(p);
});
function nettoyerAncienEtat(racine) {
  const retires = [];
  for (const rel3 of [
    "agentic_orchestrator/management",
    ".agenticLEAN",
    `${DOSSIER_LEAN_ENGINE}/runs`,
    `${DOSSIER_LEAN_ENGINE}/journal`,
    `${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}/runs`,
    `${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}/journal`,
    `${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}`,
    `${DOSSIER_LEGACY_AGELAIOS}/runs`,
    `${DOSSIER_LEGACY_AGELAIOS}/journal`,
    DOSSIER_LEGACY_AGELAIOS
  ]) {
    const d = path33.join(racine, ...rel3.split("/"));
    if (fs36.existsSync(d) && dossierVide(d)) {
      fs36.rmSync(d, { recursive: true, force: true });
      retires.push(rel3);
    }
  }
  return retires;
}
function nettoyerCibleVide(racine) {
  const cible = cibleDe(racine);
  if (fs36.existsSync(cible) && dossierVide(cible)) fs36.rmSync(cible, { recursive: true, force: true });
}
function planMigration(ctx) {
  const cible = cibleDe(ctx.racine);
  const plan = [];
  if (path33.resolve(ctx.etat) === path33.resolve(cible)) return plan;
  const familles = [
    [ctx.engagements, FAMILLES_CIBLE.engagements],
    [ctx.arbitrages, FAMILLES_CIBLE.arbitrages],
    [ctx.deltas, FAMILLES_CIBLE.deltas],
    [ctx.decisions, FAMILLES_CIBLE.decisions]
  ];
  const prises = /* @__PURE__ */ new Set();
  for (const [source, nom] of familles) {
    if (!fs36.existsSync(source)) continue;
    plan.push({ de: source, vers: path33.join(cible, nom) });
    prises.add(path33.resolve(source));
  }
  const aPlat = path33.resolve(ctx.etat) === path33.resolve(ctx.racine, DOSSIER_LEAN_ENGINE) || path33.resolve(ctx.etat) === path33.resolve(ctx.racine, DOSSIER_LEGACY_AGELAIOS);
  if (fs36.existsSync(ctx.etat)) {
    for (const nom of fs36.readdirSync(ctx.etat).sort()) {
      const source = path33.join(ctx.etat, nom);
      if (prises.has(path33.resolve(source)) || nom === ".gitignore") continue;
      if (aPlat && (HORS_ETAT.includes(nom) || nom === DOSSIER_ORCHESTRATION)) continue;
      plan.push({ de: source, vers: path33.join(cible, nom) });
    }
  }
  return plan;
}
function poserIgnores(racine) {
  const f = path33.join(cibleDe(racine), ".gitignore");
  const present = fs36.existsSync(f) ? fs36.readFileSync(f, "utf-8") : "";
  const lignes = present.split(/\r?\n/);
  const manquantes = NON_VERSIONNES.filter((l) => !lignes.includes(l));
  if (manquantes.length) {
    fs36.writeFileSync(f, present.replace(/\s*$/, present ? "\n" : "") + manquantes.join("\n") + "\n", "utf-8");
  }
  git(["add", "--", `${CIBLE_REL}/.gitignore`], racine);
}
function reorienterLeases(racine) {
  const ctx = resoudreContexte(racine);
  const reorientes = [];
  if (!fs36.existsSync(ctx.runs)) return reorientes;
  for (const f of fs36.readdirSync(ctx.runs).filter((x) => /^ENG-\d{4}\.json$/.test(x))) {
    try {
      const record = path33.join(ctx.runs, f);
      const rec = JSON.parse(fs36.readFileSync(record, "utf-8"));
      const lease = path33.join(String(rec.worktree ?? ""), ".eng", "LEASE.json");
      if (!rec.worktree || !fs36.existsSync(lease)) continue;
      const contenu = JSON.parse(fs36.readFileSync(lease, "utf-8"));
      if (contenu.runs_record === record) continue;
      contenu.runs_record = record;
      fs36.writeFileSync(lease, JSON.stringify(contenu, null, 2) + "\n", "utf-8");
      reorientes.push(String(rec.eng ?? f.replace(/\.json$/, "")));
    } catch {
    }
  }
  return reorientes;
}
function migrer(ctx, annuler = false, verifierSeulement = false, emmener = false) {
  if (annuler) return annulerMigration(ctx);
  if (ctx.disposition === "lean-engine") {
    return { ok: true, message: `d\xE9j\xE0 migr\xE9 : l'\xE9tat vit sous ${CIBLE_REL}/, rien \xE0 faire (idempotent)` };
  }
  const problemes = preconditions(ctx, emmener);
  const plan = planMigration(ctx);
  if (verifierSeulement) {
    return {
      ok: problemes.length === 0,
      message: problemes.length ? problemes.map((p) => `PR\xC9CONDITION : ${p}`).join("\n") : "pr\xEAt \xE0 migrer :\n" + plan.map((e) => `  ${relatif(ctx, e.de)} -> ${relatif(ctx, e.vers)}`).join("\n"),
      erreur: problemes.length ? problemes.join(" ; ") : void 0
    };
  }
  if (problemes.length) {
    return { ok: false, code: "preconditions", erreur: problemes.join(" ; ") };
  }
  const faits = [];
  for (const e of plan) {
    const echec2 = path33.resolve(e.de) === path33.resolve(ctx.runs) ? deplacerRuns(ctx, e.vers) : deplacer(ctx.racine, e.de, e.vers);
    if (echec2) {
      return {
        ok: false,
        code: "deplacement",
        erreur: `${echec2}. D\xE9j\xE0 d\xE9plac\xE9 : ${faits.join(", ") || "rien"}. Retour arri\xE8re : lean migrer --annuler`
      };
    }
    faits.push(`${relatif(ctx, e.de)} -> ${relatif(ctx, e.vers)}`);
  }
  const ignoresAncien = path33.join(ctx.etat, ".gitignore");
  if (fs36.existsSync(ignoresAncien)) {
    if (git(["rm", "-q", "-f", "--", relatif(ctx, ignoresAncien)], ctx.racine).code !== 0) fs36.rmSync(ignoresAncien, { force: true });
  }
  if (fs36.existsSync(ctx.etat) && fs36.readdirSync(ctx.etat).length === 0) fs36.rmdirSync(ctx.etat);
  poserIgnores(ctx.racine);
  const emmenees = reorienterLeases(ctx.racine);
  return {
    ok: true,
    deplaces: faits,
    sessions_emmenees: emmenees,
    message: `OK : \xE9tat migr\xE9 vers ${CIBLE_REL}/ (${faits.length} entr\xE9e(s), git mv, non committ\xE9).
` + faits.map((f) => `  ${f}`).join("\n") + (emmenees.length ? `
Sessions emmen\xE9es : ${emmenees.join(", ")}. Leur branche doit recevoir master (git merge master dans le worktree) avant de reprendre.` : "") + "\nV\xE9rifie puis committe ; retour arri\xE8re : --annuler avant commit, revert apr\xE8s."
  };
}
function annulerMigration(ctx) {
  if (ctx.disposition !== "lean-engine") return { ok: true, message: `rien \xE0 annuler : l'\xE9tat n'est pas sous ${CIBLE_REL}/` };
  const racine = ctx.racine;
  const aHead = (rel3) => git(["ls-tree", "--name-only", "HEAD", "--", rel3], racine).stdout.trim() !== "";
  if (aHead(`${CIBLE_REL}/${FAMILLES_CIBLE.engagements}`)) {
    return {
      ok: false,
      code: "migration_commitee",
      erreur: "la migration est d\xE9j\xE0 committ\xE9e : elle se d\xE9fait par un revert du commit, pas par --annuler"
    };
  }
  const avant = [
    `${DOSSIER_LEAN_ENGINE}/${FAMILLES_CIBLE.engagements}`,
    `${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}/${FAMILLES_CIBLE.engagements}`,
    `${DOSSIER_LEGACY_AGELAIOS}/${FAMILLES_CIBLE.engagements}`,
    "agentic_orchestrator/management",
    ".agenticLEAN"
  ].find(aHead);
  if (!avant) return { ok: false, code: "origine_inconnue", erreur: "HEAD ne porte aucun \xE9tat connu : rien n'est d\xE9fait" };
  const ancienRel = avant.startsWith(`${DOSSIER_LEAN_ENGINE}/`) ? DOSSIER_LEAN_ENGINE : avant.startsWith(`${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}/`) ? `${DOSSIER_LEGACY_AGELAIOS}/${DOSSIER_ORCHESTRATION}` : avant.startsWith(`${DOSSIER_LEGACY_AGELAIOS}/`) ? DOSSIER_LEGACY_AGELAIOS : avant;
  const ancien = path33.join(racine, ...ancienRel.split("/"));
  for (const nom of NON_VERSIONNES.map((n) => n.replace(/\/$/, ""))) {
    const source = path33.join(ctx.etat, nom);
    if (!fs36.existsSync(source)) continue;
    const retour = path33.join(ancien, nom);
    fs36.mkdirSync(retour, { recursive: true });
    for (const f of fs36.readdirSync(source)) {
      if (path33.resolve(source, f) === path33.resolve(ctx.verrou)) continue;
      fs36.renameSync(path33.join(source, f), path33.join(retour, f));
    }
  }
  for (const chemin of [ancienRel, "agentic_orchestrator/decisions", CIBLE_REL]) {
    const connu = aHead(chemin) || git(["ls-files", "--", chemin], racine).stdout.trim() !== "";
    if (!connu) continue;
    const r = git(["restore", "--source=HEAD", "--staged", "--worktree", "--", chemin], racine);
    if (r.code !== 0 && !/did not match/.test(r.stderr)) {
      return { ok: false, code: "restauration", erreur: `git restore ${chemin} : ${r.stderr.trim()}` };
    }
  }
  for (const nom of fs36.existsSync(ctx.etat) ? fs36.readdirSync(ctx.etat) : []) {
    if (nom === "runs") continue;
    fs36.rmSync(path33.join(ctx.etat, nom), { recursive: true, force: true });
  }
  reorienterLeases(racine);
  return { ok: true, message: `OK : migration annul\xE9e, l'\xE9tat est de retour sous ${ancienRel}/.` };
}

// noyau/src/conformite.ts
var fs37 = __toESM(require("node:fs"), 1);
var path34 = __toESM(require("node:path"), 1);
function resumeMemoire(chemin) {
  const nom = path34.basename(chemin).replace(/\.md$/, "");
  let texte = "";
  try {
    texte = lireTexte(chemin);
  } catch {
    return { fichier: chemin, nom, description: "", type: "" };
  }
  const champ2 = (cle) => {
    const m = texte.match(new RegExp("^" + cle + ":s*(.+)$", "m"));
    return m ? m[1].trim() : "";
  };
  return { fichier: chemin, nom: champ2("name") || nom, description: champ2("description"), type: champ2("  type") || champ2("type") };
}
function compter(dossier, filtre) {
  if (!fs37.existsSync(dossier)) return 0;
  try {
    return fs37.readdirSync(dossier).filter(filtre).length;
  } catch {
    return 0;
  }
}
function domainesDeclares(racine) {
  const f = path34.join(racine, "dossier-recette", "02_CODIFICATION.md");
  if (!fs37.existsSync(f)) return 0;
  return fs37.readFileSync(f, "utf-8").split("\n").filter((ligne) => /^\|\s*([A-Z]{2,4})\s*\|[^|]*\|\s*`([^`]+)`\s*\|/.test(ligne)).length;
}
function inventaire(racine, dossierMemoire) {
  const existe = (...bouts) => fs37.existsSync(path34.join(racine, ...bouts));
  const commandes2 = fs37.existsSync(path34.join(racine, ".claude", "commands")) ? fs37.readdirSync(path34.join(racine, ".claude", "commands")).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort() : [];
  const memoires = [];
  if (dossierMemoire && fs37.existsSync(dossierMemoire)) {
    for (const f of fs37.readdirSync(dossierMemoire).filter((x) => x.endsWith(".md")).sort()) {
      if (f.toUpperCase() === "MEMORY.MD") continue;
      memoires.push(resumeMemoire(path34.join(dossierMemoire, f)));
    }
  }
  return {
    racine,
    claudeMd: existe("CLAUDE.md"),
    dossierRecette: existe("dossier-recette"),
    orchestrateur: existe("agentic_orchestrator", "management"),
    agenticLean: existe(".agenticLEAN"),
    lean: existe(".lean-engine", "orchestration", "ENG"),
    agelaios: existe(".agelaios", "orchestration", "ENG") || existe(".agelaios", "ENG"),
    commandes: commandes2,
    domaines: domainesDeclares(racine),
    engagements: compter(path34.join(racine, "agentic_orchestrator", "management", "engagements"), (f) => f.startsWith("ENG-")) || compter(path34.join(racine, ".agenticLEAN", "engagements"), (f) => f.startsWith("ENG-")) || compter(path34.join(racine, ".lean-engine", "orchestration", "ENG"), (f) => f.startsWith("ENG-")) || compter(path34.join(racine, ".lean-engine", "ENG"), (f) => f.startsWith("ENG-")) || compter(path34.join(racine, ".agelaios", "orchestration", "ENG"), (f) => f.startsWith("ENG-")) || compter(path34.join(racine, ".agelaios", "ENG"), (f) => f.startsWith("ENG-")),
    memoires
  };
}

// noyau/src/historique.ts
var fs38 = __toESM(require("node:fs"), 1);
var os = __toESM(require("node:os"), 1);
var path35 = __toESM(require("node:path"), 1);
var import_node_child_process9 = require("node:child_process");
var FOURNISSEUR2 = ["anthr", "opic"].join("");
function git4(racine, args) {
  const r = (0, import_node_child_process9.spawnSync)("git", ["-C", racine, ...args], {
    encoding: "utf-8",
    windowsHide: true,
    maxBuffer: 256 * 1024 * 1024
  });
  return { code: r.status ?? 1, sortie: r.stdout ?? "", erreur: r.stderr ?? "" };
}
function identitesHistorique(racine) {
  const r = git4(racine, ["log", "--all", "--format=%an|%ae%n%cn|%ce"]);
  const compte = /* @__PURE__ */ new Map();
  for (const l of r.sortie.split("\n")) {
    if (!l.trim()) continue;
    compte.set(l, (compte.get(l) ?? 0) + 1);
  }
  return [...compte.entries()].map(([cle, n]) => {
    const [nom, mail] = cle.split("|");
    return { nom, mail, n, conforme: isAdmitted(racine, nom, mail) };
  }).sort((a, b) => b.n - a.n);
}
function lexiqueHistorique(racine) {
  const refs = git4(racine, ["for-each-ref", "--format=%(refname)"]).sortie.split("\n").filter((l) => l.trim());
  const trouves = /* @__PURE__ */ new Set();
  for (const ref of refs) {
    const r = git4(racine, ["grep", "-I", "-l", "-i", FOURNISSEUR2, ref]);
    for (const l of r.sortie.split("\n")) if (l.trim()) trouves.add(l.trim());
  }
  return [...trouves].sort();
}
function freinsReecriture(ctx) {
  const freins = [];
  const racine = ctx.racine;
  if (git4(racine, ["status", "--porcelain"]).sortie.trim()) {
    freins.push("l'arbre de travail porte des modifications non commit\xE9es");
  }
  const worktrees = git4(racine, ["worktree", "list"]).sortie.split("\n").filter((l) => l.trim());
  if (worktrees.length > 1) {
    freins.push(`${worktrees.length - 1} worktree(s) secondaire(s) encore en place : chaque SHA va changer sous leurs pieds`);
  }
  const vivants = listerLeases(ctx).filter((l) => !["released", "expire", "revoked"].includes(String(l.state))).map((l) => l.eng);
  if (vivants.length) freins.push(`lease(s) vivant(s) : ${vivants.join(", ")} (des sessions travaillent)`);
  return freins;
}
function auditHistorique(ctx) {
  const identites = identitesHistorique(ctx.racine);
  return {
    identites,
    aSolder: identites.filter((i) => !i.conforme).reduce((s, i) => s + i.n, 0),
    lexique: lexiqueHistorique(ctx.racine),
    freins: freinsReecriture(ctx)
  };
}
function lanceurFilterRepo() {
  if ((0, import_node_child_process9.spawnSync)("git", ["filter-repo", "--version"], { encoding: "utf-8", windowsHide: true }).status === 0) {
    return ["git", "filter-repo"];
  }
  for (const py of ["python", "python3"]) {
    const r = (0, import_node_child_process9.spawnSync)(py, ["-c", "import git_filter_repo"], { encoding: "utf-8", windowsHide: true });
    if (r.status === 0) return [py, "-c", "import git_filter_repo as g; g.main()"];
  }
  return null;
}
function reecrireHistorique(ctx, options) {
  const racine = ctx.racine;
  if (!options.jeConfirme) {
    return { ok: false, erreur: "la r\xE9\xE9criture change TOUS les SHA du d\xE9p\xF4t : elle exige --je-confirme", faits: [] };
  }
  const freins = freinsReecriture(ctx);
  if (freins.length) return { ok: false, erreur: "le d\xE9p\xF4t n'est pas au repos : " + freins.join(" ; "), faits: [] };
  const lanceur = lanceurFilterRepo();
  if (!lanceur) {
    return {
      ok: false,
      erreur: "git-filter-repo est introuvable (ni `git filter-repo`, ni le module Python) : installe-le, puis relance",
      faits: []
    };
  }
  const faits = [];
  const remote = git4(racine, ["remote", "get-url", "origin"]).sortie.trim();
  const hooksAvant = hooksPathLocal(racine);
  const sauvegarde = path35.join(ctx.etat, "runs", "avant-reecriture.bundle");
  fs38.mkdirSync(path35.dirname(sauvegarde), { recursive: true });
  const b = git4(racine, ["bundle", "create", sauvegarde, "--all"]);
  if (b.code !== 0) return { ok: false, erreur: "la sauvegarde a \xE9chou\xE9 : " + b.erreur.trim(), faits };
  faits.push(`toutes les refs sauvegard\xE9es dans ${path35.relative(racine, sauvegarde).split("\\").join("/")}`);
  const principale = principalIdentity(racine);
  const ici = effectiveIdentity(racine);
  const locale = ici && isAdmitted(racine, ici.nom, ici.mail) ? ici : principale;
  const etrangers = new Set(identitesHistorique(racine).filter((i) => !i.conforme).map((i) => i.mail));
  const tmp = fs38.mkdtempSync(path35.join(os.tmpdir(), "reecriture-"));
  try {
    const table = path35.join(tmp, "mailmap");
    fs38.writeFileSync(
      table,
      [...etrangers].map((m) => `${principale.nom} <${principale.mail}> <${m}>
`).join(""),
      "utf-8"
    );
    const textes = path35.join(tmp, "remplacements");
    fs38.writeFileSync(
      textes,
      `regex:(?i)@${FOURNISSEUR2}-ai==>@outil-ia
regex:(?i)${FOURNISSEUR2}==>outil-ia
`,
      "utf-8"
    );
    const [exe, ...pre] = lanceur;
    const r = (0, import_node_child_process9.spawnSync)(exe, [...pre, "--mailmap", table, "--replace-text", textes, "--force"], {
      cwd: racine,
      encoding: "utf-8",
      windowsHide: true,
      maxBuffer: 256 * 1024 * 1024
    });
    if (r.status !== 0) {
      return {
        ok: false,
        erreur: `git-filter-repo a \xE9chou\xE9 : ${(r.stderr ?? "").trim().slice(-600)}. L'historique d'origine reste dans la sauvegarde.`,
        faits,
        sauvegarde
      };
    }
    faits.push(`${etrangers.size} identit\xE9(s) rapport\xE9e(s) \xE0 l'auteur unique, lexique remplac\xE9 dans le contenu`);
  } finally {
    fs38.rmSync(tmp, { recursive: true, force: true });
  }
  if (remote) {
    git4(racine, ["remote", "add", "origin", remote]);
    faits.push(`remote origin r\xE9tabli : ${remote}`);
  }
  git4(racine, ["config", "--local", "user.name", locale.nom]);
  git4(racine, ["config", "--local", "user.email", locale.mail]);
  if (hooksAvant && hooksPathLocal(racine) !== hooksAvant) {
    git4(racine, ["config", "--local", "core.hooksPath", hooksAvant]);
  }
  faits.push(`identit\xE9 locale repos\xE9e${hooksAvant ? `, core.hooksPath rendu \xE0 ${hooksAvant}` : ""}`);
  return { ok: true, faits, sauvegarde };
}

// noyau/src/lecture.ts
var fs39 = __toESM(require("node:fs"), 1);
var path36 = __toESM(require("node:path"), 1);
var RE_ENG3 = /^ENG-\d{4}$/;
var RE_SPEC3 = /^SPEC-[A-Z]{2,6}-\d{3}$/;
function normaliserId(brut) {
  const id = brut.trim();
  const eng = id.match(/^eng-?(\d{1,4})$/i);
  if (eng) return `ENG-${eng[1].padStart(4, "0")}`;
  const famille = id.match(/^(da|scp|adr)-?(\d{1,4})$/i);
  if (famille) return `${famille[1].toUpperCase()}-${famille[2].padStart(4, "0")}`;
  if (/^spec-/i.test(id)) return id.toUpperCase();
  return id;
}
function texteRelatif(ctx, p) {
  return path36.relative(ctx.racine, p).split(path36.sep).join("/");
}
function vueEngagement(ctx, engs, id) {
  const e = engs.get(id);
  if (!e) return null;
  const fichiers = fichiersDomaines(ctx);
  const occupes = domainesOccupes(ctx);
  const imp = impact(ctx, engs, id);
  const rapport = lireRapport(ctx, id);
  const streamInfo = streamOfCommitment(readStreams(ctx), e);
  return {
    genre: "engagement",
    id,
    record: e,
    etat: etatCalcule(engs, id, occupes),
    claims_bloquantes: claimsBloquantes(engs, id, occupes),
    dependances: dependsOn(e).map((d) => {
      const cible = String(d.eng ?? "");
      const pred = engs.get(cible);
      return {
        eng: cible,
        type: String(d.type ?? "?"),
        statut: pred ? String(pred.statut ?? "?") : "unknown",
        etat: pred ? etatCalcule(engs, cible) : "unknown"
      };
    }),
    dependants_directs: imp.directs ?? {},
    dependants_transitifs: (imp.transitifs ?? []).length,
    exigences: exigences(e).map((s) => ({ id: s, statut: statutSpec(s, fichiers) })),
    rapport: rapport.ok ? `${id}/${String(rapport.name)}` : null,
    verdicts: verdictsDe(ctx, id),
    stream: streamInfo.stream ? { name: streamInfo.stream.name, implicit: streamInfo.stream.implicit, domains: streamInfo.stream.domains, requirements: streamInfo.stream.requirements } : null,
    streams_across: streamInfo.across.map((s) => ({
      name: s.name,
      domains: streamInfo.domains.filter((x) => x.stream === s.name).map((x) => x.domain)
    })),
    domains_unowned: streamInfo.unowned
  };
}
function trouverSpec(ctx, id) {
  const fichiers = fichiersDomaines(ctx);
  const dom = id.split("-")[1];
  const parDomaine = fichiers.get(dom);
  if (parDomaine && fs39.existsSync(parDomaine)) {
    const texte = extraireSpec(id, fichiers);
    if (texte.startsWith(`### ${id}`) && !texte.includes("(Introuvable")) return { fichier: parDomaine, texte };
  }
  const echappe = id.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  const re = new RegExp(`^### ${echappe}\\b[\\s\\S]*?(?=^###? |$(?![\\s\\S]))`, "m");
  for (const dossier of dossiersExigences(ctx)) {
    for (const f of fs39.readdirSync(dossier).filter((n) => n.endsWith(".md")).sort()) {
      const chemin = path36.join(dossier, f);
      const texte = texteDomaine(chemin) ?? "";
      const m = texte.match(re);
      if (m) return { fichier: chemin, texte: m[0].replace(/\s+$/, "") + "\n" };
    }
  }
  return null;
}
function dossiersExigences(ctx) {
  const d = readStreams(ctx);
  if (!d.declared) return fs39.existsSync(ctx.recette) ? [ctx.recette] : [];
  return requirementSources(ctx, d).map((s) => s.folder);
}
function streamsOfRequirement(ctx, id) {
  const d = readStreams(ctx);
  if (!d.declared) return [d.streams[0]?.name ?? "product"];
  return requirementIndex(ctx, d).get(id)?.streams ?? [];
}
function statutDuTexte(texte) {
  const m = texte.match(/^-\s*(?:Status|Statut)\s*: ?([A-ZÉ_]+)/m);
  return m ? m[1] : "UNKNOWN";
}
function vueSpec(ctx, engs, id) {
  const trouvee = trouverSpec(ctx, id);
  if (!trouvee) return null;
  const engagements2 = [];
  for (const [eid, e] of engs) {
    if (exigences(e).includes(id)) engagements2.push({ eng: eid, statut: String(e.statut ?? "?"), titre: String(e.titre ?? "") });
  }
  const citee_par = [];
  for (const g of ["scp", "da", "adr", "rapport"]) {
    for (const d of listerDocuments(ctx, g)) if (d.references.includes(id)) citee_par.push({ genre: g, id: d.id });
  }
  return {
    genre: "spec",
    id,
    statut: statutDuTexte(trouvee.texte),
    fichier: texteRelatif(ctx, trouvee.fichier),
    texte: trouvee.texte,
    engagements: engagements2.sort((a, b) => a.eng < b.eng ? -1 : 1),
    citee_par,
    streams: streamsOfRequirement(ctx, id)
  };
}
function montrer(ctx, brut) {
  const id = normaliserId(brut);
  const engs = chargerRegistre(ctx, []);
  if (RE_ENG3.test(id)) return vueEngagement(ctx, engs, id);
  if (RE_SPEC3.test(id)) return vueSpec(ctx, engs, id);
  const doc = lireDocument(ctx, id) ?? (/^(DA|SCP|ADR)-\d{4}$/.test(id) ? (() => {
    const long = listerDocuments(ctx).find((d) => d.id.startsWith(`${id}-`));
    return long ? lireDocument(ctx, long.id) : null;
  })() : null);
  if (!doc) return null;
  return {
    genre: doc.genre,
    id: doc.id,
    titre: doc.titre,
    statut: doc.statut,
    fichier: texteRelatif(ctx, doc.fichier),
    corps: doc.corps,
    liens: doc.liens
  };
}
function plier(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function extraitAutour(texte, termes) {
  const plie = plier(texte);
  const i = plie.indexOf(termes[0]);
  if (i < 0) return null;
  const debut = Math.max(0, i - 50);
  return (debut > 0 ? "..." : "") + texte.slice(debut, i + 90).replace(/\s+/g, " ").trim() + "...";
}
function chercher(ctx, requete, options = {}) {
  const termes = plier(requete).split(/\s+/).filter(Boolean);
  if (!termes.length) return [];
  const correspond = (t) => termes.every((x) => t.includes(x));
  const voulu = (g) => !options.genre || options.genre === g;
  const statutVoulu = (s) => !options.statut || plier(s ?? "") === plier(options.statut);
  const sortie = [];
  if (voulu("engagement")) {
    const engs = chargerRegistre(ctx, []);
    for (const [eid, e] of engs) {
      const titre = String(e.titre ?? "");
      const corps = [titre, String(e.definition_of_done ?? ""), String(e.notes ?? ""), exigences(e).join(" "), String(e.beneficiaire ?? "")].join("\n");
      if (!correspond(plier(`${eid}
${corps}`))) continue;
      const etat = etatCalcule(engs, eid);
      if (!statutVoulu(String(e.statut ?? "")) && !statutVoulu(etat)) continue;
      sortie.push({
        genre: "engagement",
        id: eid,
        titre,
        statut: `${String(e.statut ?? "?")}${etat !== e.statut ? ` (${etat})` : ""}`,
        extrait: correspond(plier(`${eid} ${titre}`)) ? null : extraitAutour(corps, termes)
      });
    }
  }
  if (voulu("spec")) {
    const re = /^### (SPEC-[A-Z]{2,6}-\d{3})\s*:\s*(.+?)\s*$([\s\S]*?)(?=^###? |$(?![\s\S]))/gm;
    const fichiers = dossiersExigences(ctx).flatMap(
      (dossier) => fs39.readdirSync(dossier).filter((n) => n.endsWith(".md")).sort().map((n) => path36.join(dossier, n))
    );
    for (const chemin of fichiers) {
      const texte = texteDomaine(chemin) ?? "";
      for (const m of texte.matchAll(re)) {
        if (!correspond(plier(`${m[1]} ${m[2]}`))) continue;
        const statut = statutDuTexte(m[3]);
        if (!statutVoulu(statut)) continue;
        sortie.push({ genre: "spec", id: m[1], titre: m[2], statut, extrait: null });
      }
    }
  }
  for (const g of ["da", "scp", "adr", "rapport"]) {
    if (!voulu(g)) continue;
    for (const d of listerDocuments(ctx, g)) {
      if (!correspond(plier(`${d.id} ${d.titre} ${d.references.join(" ")}`))) continue;
      if (!statutVoulu(d.statut)) continue;
      sortie.push({ genre: g, id: d.id, titre: d.titre, statut: d.statut, extrait: null });
    }
  }
  return options.limite ? sortie.slice(0, options.limite) : sortie;
}
function cheminsPieges(ctx) {
  return [
    path36.join(ctx.gouvernance, "docs", "PIEGES_ENVIRONNEMENT.md"),
    path36.join(ctx.etat, "PITFALLS.md"),
    path36.join(ctx.racine, "docs", "PITFALLS.md")
  ];
}
function pieges(ctx, motif) {
  const fichier = cheminsPieges(ctx).find((p) => fs39.existsSync(p)) ?? null;
  if (!fichier) return { fichier: null, sections: [], titres: [] };
  const toutes = sectionsDe(lireTexte(fichier)).filter((s) => s.niveau === 2);
  const termes = plier(motif ?? "").split(/\s+/).filter(Boolean);
  const sections = termes.length ? toutes.filter((s) => termes.every((t) => plier(`${s.titre}
${s.contenu}`).includes(t))) : [];
  return {
    fichier: texteRelatif(ctx, fichier),
    sections: sections.map((s) => ({ titre: s.titre, contenu: s.contenu })),
    titres: toutes.map((s) => s.titre)
  };
}

// noyau/src/modeles.ts
var fs40 = __toESM(require("node:fs"), 1);
var path37 = __toESM(require("node:path"), 1);
var FAMILLES2 = ["DA", "SCP", "ENG", "ADR"];
var GABARIT_DA = '# DA-NNNN: (one closed question, ending with a question mark)\n\n```yaml\nstatut: ouverte\ndecideur: "(one person, never a group)"\ndemandeur: "coordinator, or the session of ENG-NNNN"\ndefaut_si_silence: "A"\nengagement: ENG-NNNN\nouverte_le: \'YYYY-MM-DDTHH:MM:SS+00:00\'\n```\n\n' + BLOCKER_SECTIONS + "\n## Decision (filled by the decider only)\n\n```yaml\nchoix: null\nmotif: null\ndate: null\n```\n";
var GABARIT_SCP = '# SCP-NNNN: (title of the specification change)\n\n```yaml\nstatut: proposee            # proposee | ouverte | acceptee | rejetee | retiree\ndemandeur: coordinator      # or the session of ENG-NNNN\nexigences_touchees:\n  - "modified: SPEC-DOM-NNN (what changes; requirement text, coverage, tests and status unchanged or changed)"\n  - "added: SPEC-DOM-NNN (new requirement, its domain)"\ndecide_by: null             # the operator who decides\n```\n\n## Intent\n\n(what the change must obtain, from the product point of view; no solution here)\n\n## Scope and non-goals\n\n(the files of dossier-recette touched; what the SCP does not change)\n\n## Proposed modification\n\n(the text of the requirements added or modified, item by item: current text, new text)\n\n## Example\n\n(one concrete example of the behaviour the change describes)\n\n## Recommendation\n\n(accept or not, and why)\n\n## Validation\n\n(what the acceptance authorises, and the tests or records that prove the change)\n';
var GABARIT_ENG = 'id: ENG-NNNN\ntype: realisation          # realisation | reponse | revue\ntitre: "(one sentence, verifiable)"\npromettant: null\nreserve_par: null\npris_le: null\nrestitue_le: null\nbeneficiaire: "jalon:J-XXX"   # jalon:<ID> | eng:<ENG-ID> | humain:<name>\nexigences: []              # SPEC-DOM-NNN of dossier-recette\nscope:\n  domaines: []             # domain codes of the requirements folder\n  paths: []                # globs the session may write\ndefinition_of_done: >\n  (objective criteria, numbered, each with the test that proves it)\necheance: null\nreadiness: []\nreadiness_ok: true\ndepends_on: []             # - {eng: ENG-XXXX, type: finish-start | interface | info}\ncontrat: null\nstatut: propose            # propose | pris | tenu | rompu | abandonne | remplace (pret and gele are computed)\nvariance: null             # rompu or abandonne: {raison: spec_ambigue|dependance|estimation|abandon|technique|non_reponse, note: "..."}\nremplace_par: null         # remplace: the ENG that carries the work\nnotes: >\n  (dated notes: who opened it, what was read, what changed since)\n';
var GABARIT_ADR = "# ADR-NNNN : d\xE9cision de DA-NNNN\n\n- Contexte : (the title of the request)\n- D\xE9cision : (the option chosen)\n- Motif : (the reason given by the decider)\n- Date : YYYY-MM-DD\n- R\xE9versibilit\xE9 : par SCP r\xE9f\xE9ren\xE7ant le pr\xE9sent ADR (garde-fou anti-oscillation).\n";
function dossierDe3(ctx, famille) {
  return { DA: ctx.arbitrages, SCP: ctx.deltas, ENG: ctx.engagements, ADR: ctx.decisions }[famille];
}
function dernierDe(ctx, famille) {
  const dossier = dossierDe3(ctx, famille);
  if (!fs40.existsSync(dossier)) return null;
  const re = new RegExp(`^${famille}-(\\d{4})`);
  let meilleur = null;
  for (const nom of fs40.readdirSync(dossier)) {
    const m = nom.match(re);
    if (!m) continue;
    const n = Number(m[1]);
    if (!meilleur || n > meilleur.n) meilleur = { n, nom };
  }
  if (!meilleur) return null;
  const chemin = path37.join(dossier, meilleur.nom);
  const lignes = lireTexte(chemin).split("\n");
  const fin = famille === "ENG" ? 14 : Math.max(12, lignes.findIndex((l, i) => i > 2 && l.trim() === "```") + 1);
  return { id: `${famille}-${String(meilleur.n).padStart(4, "0")}`, chemin: path37.relative(ctx.racine, chemin), entete: lignes.slice(0, fin).join("\n") };
}
function modele(ctx, familleBrute) {
  const famille = familleBrute.trim().toUpperCase();
  if (!FAMILLES2.includes(famille)) return null;
  const dossier = dossierDe3(ctx, famille);
  const ext = famille === "ENG" ? "yaml" : "md";
  const fichierGabarit = path37.join(dossier, famille === "ENG" ? "TEMPLATE.yaml" : "TEMPLATE.md");
  let source = "the tool";
  let gabarit = { DA: GABARIT_DA, SCP: GABARIT_SCP, ENG: GABARIT_ENG, ADR: GABARIT_ADR }[famille];
  if ((famille === "SCP" || famille === "ENG") && fs40.existsSync(fichierGabarit)) {
    source = path37.relative(ctx.racine, fichierGabarit);
    gabarit = lireTexte(fichierGabarit);
  }
  const geste = {
    DA: "written by hand under a number from `lean numero DA`, or filed from BLOCKED.md by the delivery; decided by `lean decider DA-NNNN --choix X`",
    SCP: "written by hand under a number from `lean numero SCP`; accepted by the operator, then applied to dossier-recette",
    ENG: "written by hand under a number from `lean numero ENG`, then published; pulled with `eng pull ENG-NNNN`",
    ADR: "never written by hand: `lean decider DA-NNNN --choix X` produces it with the next ADR number"
  }[famille];
  return {
    famille,
    dossier: path37.relative(ctx.racine, dossier),
    fichier: famille === "ADR" ? `ADR-NNNN-da-nnnn.${ext}` : `${famille}-NNNN.${ext}`,
    source,
    gabarit,
    dernier: dernierDe(ctx, famille),
    geste
  };
}
function rendreModele(m) {
  const L = [];
  L.push(`${m.famille}: a new record is ${m.dossier}/${m.fichier}; ${m.geste}.`);
  L.push(`Template (from ${m.source}):`);
  L.push("");
  L.push(m.gabarit.trimEnd());
  L.push("");
  if (m.dernier) {
    L.push(`Latest record of the family, to read in full as an example: ${m.dernier.chemin} (lean show ${m.dernier.id}). Its head:`);
    L.push("");
    L.push(m.dernier.entete.trimEnd());
  } else {
    L.push("No record of this family exists yet.");
  }
  return L.join("\n") + "\n";
}

// noyau/src/inventaire.ts
var fs41 = __toESM(require("node:fs"), 1);
var path38 = __toESM(require("node:path"), 1);
var EDITION_STREAMS = { standard: "lean-standard", program: "lean-program" };
var RE_BLOC = /^### (SPEC-[A-Z]{2,6}-\d{3})\b[^\n]*\n([\s\S]*?)(?=^### |^## |(?![\s\S]))/gm;
var RE_EDITION = /^-\s*(?:Edition|Édition)\s*:\s*(.+)$/m;
function editionInventory(ctx, options = {}) {
  const folderAbs = options.folder ? path38.join(ctx.racine, options.folder) : ctx.recette;
  const folder = path38.relative(ctx.racine, folderAbs).split(path38.sep).join("/");
  const streams = { ...EDITION_STREAMS, ...options.streams ?? {} };
  const requirements = [];
  const withoutEdition = [];
  const qualified = [];
  const files = fs41.existsSync(folderAbs) ? fs41.readdirSync(folderAbs).filter((n) => n.endsWith(".md")).sort() : [];
  const seen = /* @__PURE__ */ new Set();
  for (const name of files) {
    const rel3 = `${folder}/${name}`;
    const text = lireTexte(path38.join(folderAbs, name));
    for (const m of text.matchAll(RE_BLOC)) {
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      const written3 = m[2].match(RE_EDITION)?.[1]?.trim() ?? null;
      const first = written3 ? written3.split(/[\s;,.(]+/)[0].toLowerCase() : null;
      const edition = first === "standard" || first === "program" ? first : null;
      if (!edition) withoutEdition.push({ id, file: rel3, written: written3 });
      else if (written3.toLowerCase() !== edition) qualified.push({ id, file: rel3, written: written3 });
      requirements.push({ id, domain: id.split("-")[1], file: rel3, edition, stream: edition ? streams[edition] : null });
    }
  }
  const byDomain = /* @__PURE__ */ new Map();
  const byFile = /* @__PURE__ */ new Map();
  for (const r of requirements) {
    if (!byDomain.has(r.domain)) byDomain.set(r.domain, { standard: [], program: [], none: [] });
    byDomain.get(r.domain)[r.edition ?? "none"].push(r.id);
    if (!byFile.has(r.file)) byFile.set(r.file, { standard: 0, program: 0 });
    if (r.edition) byFile.get(r.file)[r.edition] += 1;
  }
  const programChapters = files.filter((n) => /_PROGRAM\.md$/.test(n)).map((n) => {
    const standardForm = n.replace(/_PROGRAM\.md$/, ".md");
    return { file: `${folder}/${n}`, standardForm: files.includes(standardForm) ? `${folder}/${standardForm}` : null };
  });
  return {
    folder,
    streams,
    requirements,
    counts: {
      total: requirements.length,
      standard: requirements.filter((r) => r.edition === "standard").length,
      program: requirements.filter((r) => r.edition === "program").length,
      none: withoutEdition.length
    },
    withoutEdition,
    qualified,
    domains: [...byDomain.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([domain, x]) => ({ domain, ...x, mixed: x.standard.length > 0 && x.program.length > 0 })),
    chaptersCut: [...byFile.entries()].filter(([, x]) => x.standard > 0 && x.program > 0).map(([file, x]) => ({ file, ...x })),
    programChapters
  };
}
function ranges(ids) {
  const parts = [];
  const sorted = [...ids].sort();
  let i = 0;
  while (i < sorted.length) {
    const [, dom, n] = sorted[i].match(/^SPEC-([A-Z]+)-(\d{3})$/) ?? [];
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].startsWith(`SPEC-${dom}-`) && Number(sorted[j + 1].slice(-3)) === Number(sorted[j].slice(-3)) + 1) {
      j += 1;
    }
    parts.push(dom && n && j > i ? `${sorted[i]}..${sorted[j].slice(-3)}` : sorted[i]);
    i = j + 1;
  }
  return parts.join(", ");
}
function renderInventory(inv) {
  const l = [];
  l.push(`Inventory of ${inv.folder} by edition: ${inv.counts.total} requirements, ${inv.counts.standard} standard (${inv.streams.standard}), ${inv.counts.program} program (${inv.streams.program}), ${inv.counts.none} with no edition.`);
  l.push("");
  l.push("Assignment by domain (standard | program | no edition):");
  for (const d of inv.domains) {
    l.push(
      `  ${d.domain.padEnd(5)} ${String(d.standard.length).padStart(3)} | ${String(d.program.length).padStart(3)} | ${String(d.none.length).padStart(3)}${d.mixed ? "  MIXED" : ""}`
    );
    if (d.standard.length) l.push(`        standard: ${ranges(d.standard)}`);
    if (d.program.length) l.push(`        program:  ${ranges(d.program)}`);
    if (d.none.length) l.push(`        none:     ${ranges(d.none)}`);
  }
  l.push("");
  l.push(`Requirements that state no edition: ${inv.withoutEdition.length ? "" : "none"}`);
  for (const r of inv.withoutEdition) l.push(`  ${r.id} in ${r.file}${r.written ? ` (written: ${r.written})` : ""}`);
  l.push(`Requirements whose edition names a part of the other one: ${inv.qualified.length ? "" : "none"}`);
  for (const r of inv.qualified) l.push(`  ${r.id} in ${r.file}: ${r.written}`);
  const mixed = inv.domains.filter((d) => d.mixed);
  l.push(`Domains that hold both editions: ${mixed.length ? "" : "none"}`);
  for (const d of mixed) l.push(`  ${d.domain}: ${d.standard.length} standard, ${d.program.length} program (${ranges(d.program)})`);
  l.push(`Chapters that a split by edition cuts in two: ${inv.chaptersCut.length ? "" : "none"}`);
  for (const c of inv.chaptersCut) l.push(`  ${c.file}: ${c.standard} standard, ${c.program} program`);
  l.push(`Chapters already in a Program form: ${inv.programChapters.length ? "" : "none"}`);
  for (const c of inv.programChapters) l.push(`  ${c.file}${c.standardForm ? ` beside ${c.standardForm}` : ""}`);
  return l.join("\n") + "\n";
}

// cli/lean.ts
var import_yaml2 = __toESM(require_dist(), 1);
function rendreVue(ctx, v) {
  const lignes = [];
  if (v.genre === "engagement") {
    lignes.push(`${v.id}  [${String(v.record.statut ?? "?")}, computed state: ${v.etat}]`, "");
    lignes.push((0, import_yaml2.stringify)(v.record).trimEnd(), "");
    lignes.push("Computed by the core:");
    for (const d of v.dependances) lignes.push(`  depends on ${d.eng} (${d.type}) : ${d.statut}, ${d.etat}`);
    if (!v.dependances.length) lignes.push("  depends on nothing");
    const directs = Object.entries(v.dependants_directs);
    lignes.push(
      `  unblocks ${directs.length} directly${directs.length ? ` (${directs.map(([e, t]) => `${e} ${t}`).join(", ")})` : ""}, ${v.dependants_transitifs} transitively`
    );
    for (const c of v.claims_bloquantes) {
      lignes.push(`  held back: domain ${c.domaine} is claimed by ${c.eng} (lease of ${c.owner})`);
    }
    for (const s of v.exigences) lignes.push(`  requirement ${s.id} : ${s.statut}`);
    lignes.push(`  ${streamLine(v)}`);
    lignes.push(`  delivery report: ${v.rapport ?? "none"}`);
    for (const d of v.verdicts) {
      lignes.push(`  verdict ${d.mandat}: ${d.verdict}${d.depose_le ? ` on ${d.depose_le.slice(0, 16)}` : ""}${d.violations.length ? `, ${d.violations.length} violation(s)` : ""}`);
      for (const x of d.violations) lignes.push(`    - ${x}`);
    }
    return lignes.join("\n") + "\n";
  }
  if (v.genre === "spec") {
    lignes.push(`${v.id}  [${v.statut}]  in ${v.fichier}`, "", v.texte.trimEnd(), "");
    const d = readStreams(ctx);
    lignes.push(
      d.declared ? `Stream: ${v.streams.length ? v.streams.join(", ") : "none, its folder is declared by no stream"}` : `Stream: ${v.streams.join(", ")} (implicit: the repository declares no stream)`
    );
    lignes.push("Commitments that carry it:");
    for (const e of v.engagements) lignes.push(`  ${e.eng}  [${e.statut}]  ${e.titre}`);
    if (!v.engagements.length) lignes.push("  none");
    if (v.citee_par.length) lignes.push(`Also cited by: ${v.citee_par.map((c) => c.id).join(", ")}`);
    return lignes.join("\n") + "\n";
  }
  lignes.push(`${v.id}  [${v.genre}${v.statut ? `, ${v.statut}` : ""}]  in ${v.fichier}`, "", v.corps.trimEnd(), "");
  const cite = v.liens.filter((l) => l.sens === "cite").map((l) => l.id);
  const citePar = v.liens.filter((l) => l.sens === "cite_par").map((l) => l.id);
  if (cite.length) lignes.push(`Cites: ${cite.join(", ")}`);
  if (citePar.length) lignes.push(`Cited by: ${citePar.join(", ")}`);
  return lignes.join("\n") + "\n";
}
function streamLine(v) {
  const noStream = v.domains_unowned.length ? `domain${v.domains_unowned.length > 1 ? "s" : ""} ${v.domains_unowned.join(", ")} belong${v.domains_unowned.length > 1 ? "" : "s"} to no declared stream` : "";
  if (v.streams_across.length) {
    const which = v.streams_across.map((s) => `${s.name} (${s.domains.join(", ")})`).join(", ");
    return `stream: none, its domains belong to ${v.streams_across.length} streams: ${which}; refused by lean verifier`;
  }
  if (!v.stream) {
    return `stream: none, ${noStream || "the commitment carries no domain"}`;
  }
  if (v.stream.implicit) return `stream: ${v.stream.name} (implicit: the repository declares no stream)`;
  const recorded = (v.record.scope ?? {}).domaines;
  const own = (Array.isArray(recorded) ? recorded.map((d) => String(d).toUpperCase()) : []).filter((d) => v.stream.domains.includes(d));
  return `stream: ${v.stream.name} (from domain${own.length > 1 ? "s" : ""} ${own.join(", ")})${noStream ? `; ${noStream}` : ""}`;
}
function ligneIntegration(eng, c) {
  const faits = [
    c.merge ? `merged into master (${String(c.merge).slice(0, 12)})` : "already merged",
    "marked tenu",
    c.registre_commit ? "steering record committed" : c.registre_non_commite ? "steering record NOT committed" : "",
    c.pousse === true ? "master pushed" : c.pousse === false ? "master NOT pushed" : "",
    c.worktree_supprime ? "worktree removed" : "worktree left in place",
    c.branche_supprimee ? "branch deleted" : "branch kept"
  ].filter(Boolean);
  return `OK : ${eng} ${faits.join(", ")}.
${c.suite}`;
}
function faitsIntegration(c) {
  if (!c) return "";
  if (!c.ok) return "refused";
  return ligneIntegration("", c).split("\n")[0].replace(/^OK :\s+/, "").replace(/\.$/, "");
}
function avertirRegistreInvalide(ctx, engs, consequence) {
  const erreurs = [];
  chargerRegistre(ctx, erreurs);
  const fautes = [...erreurs, ...valider(ctx, engs).erreurs];
  if (!fautes.length) return;
  process.stderr.write(
    `ATTENTION : le registre porte ${fautes.length} erreur(s), donc ${consequence} : ${fautes[0]}
La porte du tirage refuse tant qu'elles tiennent. D\xE9tail : lean verifier
`
  );
}
function vueStreams(ctx, engs, drapeaux) {
  const d = readStreams(ctx);
  const demande = typeof drapeaux.stream === "string" ? drapeaux.stream.trim() : drapeaux.stream === true ? "" : null;
  const noms = d.streams.map((x) => x.name);
  if (demande !== null) {
    const admis = d.declared ? [...noms, NO_STREAM] : noms;
    if (!admis.includes(demande)) {
      echec("stream_inconnu", `no stream is named "${demande}". The streams are: ${admis.join(", ")} (lean streams)`);
    }
  }
  const label = (eid) => d.declared && engs.has(eid) ? streamLabel(d, engs.get(eid)) : d.declared ? NO_STREAM : noms[0];
  const voulu = demande && d.declared ? demande : null;
  const presents = new Set([...engs.keys()].map(label));
  const groupes = [...noms.filter((n) => !voulu || n === voulu), ...[...presents].filter((n) => !noms.includes(n) && (!voulu || n === voulu)).sort()];
  return { parStream: d.declared, voulu, label, garde: (eid) => !voulu || label(eid) === voulu, groupes };
}
var DRAPEAUX_DES_TRANSACTIONS = {
  revoquer: ["motif"],
  relacher: ["fin", "forcer"],
  abandonner: ["motif"],
  remplacer: ["par", "motif"],
  requalifier: [],
  decider: ["choix", "motif"],
  numero: []
};
function refuserDrapeauxInconnus(nom, drapeaux, connus) {
  if (!connus) return;
  const inconnus = Object.keys(drapeaux).filter((d) => !connus.includes(d));
  if (!inconnus.length) return;
  const lus = connus.length ? connus.map((d) => `--${d}`).join(", ") : "no flag";
  echec(
    "drapeau_inconnu",
    `${nom} does not know ${inconnus.map((d) => `--${d}`).join(", ")}: nothing was done. It reads ${lus}.`
  );
}
function sansCockpit(commande, drapeaux) {
  const racine = path39.resolve(typeof drapeaux["racine"] === "string" ? drapeaux["racine"] : process.cwd());
  const paquet = path39.resolve(typeof drapeaux["paquet"] === "string" ? drapeaux["paquet"] : path39.join(__dirname, "..", "extension"));
  const appliquer = drapeaux["appliquer"] === true;
  const plan = commande === "install" ? planInstallation(racine, paquet) : planDesinstallation(racine);
  process.stdout.write(`${commande === "install" ? "Installation" : "Removal"} in ${racine}
  package: ${paquet}
`);
  for (const e of plan.etapes) process.stdout.write(`  ${e.action.padEnd(6)} ${e.cible}  (${e.raison})
`);
  if (commande === "install" && plan.deja) {
    process.stdout.write("Nothing to install.\n");
    return plan.etapes.some((e) => e.raison.includes("migrer")) ? 1 : 0;
  }
  if (!appliquer) {
    process.stdout.write("Plan only. Add --appliquer to write it.\n");
    return 0;
  }
  const bilan = commande === "install" ? installer(racine, paquet) : desinstaller(racine, paquet);
  for (const f of bilan.faits) process.stdout.write(`  ${f}
`);
  if (!bilan.ok) {
    process.stderr.write(`ERREUR : ${bilan.erreur}
`);
    return 1;
  }
  process.stdout.write(`${commande === "install" ? "Installed" : "Removed"}.${bilan.manifeste ? ` Manifest: ${bilan.manifeste}` : ""}
`);
  return 0;
}
async function principal() {
  const argv = process.argv.slice(2);
  const commande = argv[0];
  if (!commande || argv.some((a) => a === "--help" || a === "-h")) {
    process.stdout.write((fs42.existsSync(__filename) ? "" : "") + AIDE + "\n");
    process.exit(commande ? 0 : 1);
  }
  const { positionnels, drapeaux } = analyser(argv.slice(1));
  refuserDrapeauxInconnus(`lean ${commande}`, drapeaux, DRAPEAUX_DES_TRANSACTIONS[commande]);
  if (commande === "install" || commande === "uninstall") process.exit(sansCockpit(commande, drapeaux));
  const ctx = contexte();
  const premier = () => {
    const v = positionnels[0];
    if (!v) echec("argument_manquant", `${commande} exige un identifiant`);
    return v.toUpperCase();
  };
  switch (commande) {
    case "etat": {
      process.stdout.write(JSON.stringify(construireEtat(ctx, { reconcilier: false }), null, 2) + "\n");
      break;
    }
    case "show": {
      const brut = positionnels[0];
      if (!brut) echec("argument_manquant", "show expects an identifier: ENG-NNNN, SPEC-DOM-NNN, DA-NNNN, SCP-NNNN, ADR-NNNN");
      const v = montrer(ctx, brut);
      if (!v) echec("introuvable", `no commitment, requirement or steering document is named ${brut}. Try: lean search ${brut}`);
      process.stdout.write(drapeaux.json ? JSON.stringify(v, null, 2) + "\n" : rendreVue(ctx, v));
      break;
    }
    case "search": {
      const requete = positionnels.join(" ");
      if (!requete.trim()) echec("argument_manquant", "search expects terms: lean search onboarding wsl [--genre engagement] [--statut propose]");
      const r = chercher(ctx, requete, {
        genre: drapeaux.genre ? String(drapeaux.genre) : void 0,
        statut: drapeaux.statut ? String(drapeaux.statut) : void 0,
        limite: drapeaux.limite ? Number(drapeaux.limite) : void 0
      });
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(r, null, 2) + "\n");
        break;
      }
      if (!r.length) {
        process.stdout.write(`Nothing matches "${requete}".
`);
        break;
      }
      for (const x of r) {
        process.stdout.write(`${x.id.padEnd(16)} ${x.genre.padEnd(10)} ${(x.statut ?? "").padEnd(22)} ${x.titre}
`);
        if (x.extrait) process.stdout.write(`${" ".repeat(17)}${x.extrait}
`);
      }
      process.stdout.write(`
${r.length} result(s). Details: lean show <ID>
`);
      break;
    }
    case "pitfalls": {
      const motif = positionnels.join(" ");
      const p = pieges(ctx, motif);
      if (!p.fichier) echec("introuvable", "this repository records no environment pitfalls");
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(p, null, 2) + "\n");
        break;
      }
      if (!motif) {
        process.stdout.write(`${p.fichier} : ${p.titres.length} section(s)
`);
        for (const t of p.titres) process.stdout.write(`  ${t}
`);
        process.stdout.write('\nOnly the sections that concern you: lean pitfalls <terms>, for example "wsl path".\n');
        break;
      }
      if (!p.sections.length) {
        process.stdout.write(`No section of ${p.fichier} mentions "${motif}". Sections: ${p.titres.join(" | ")}
`);
        break;
      }
      for (const s of p.sections) process.stdout.write(`## ${s.titre}

${s.contenu}

`);
      break;
    }
    case "verifier": {
      const erreurs = [];
      const engs = chargerRegistre(ctx, erreurs);
      const v = valider(ctx, engs);
      for (const w of v.avertissements) process.stdout.write(`AVERTISSEMENT  ${w}
`);
      for (const u of unadvisedRequests(ctx)) process.stdout.write(`AVERTISSEMENT  ${u.id} : ${u.manques.join(" ; ")}
`);
      const incoherentes = incoherences(ctx, engs);
      for (const i of incoherentes) process.stdout.write(`INCOHERENCE    ${i.constat} -> ${i.geste}
`);
      for (const e of [...erreurs, ...v.erreurs]) process.stdout.write(`ERREUR         ${e}
`);
      const total = erreurs.length + v.erreurs.length;
      process.stdout.write(
        `${engs.size} engagements, ${total} erreur(s), ${v.avertissements.length} avertissement(s), ${incoherentes.length} incoh\xE9rence(s)
`
      );
      process.exit(total ? 1 : 0);
      break;
    }
    case "streams": {
      if (positionnels[0] === "inventory") {
        const inv = editionInventory(ctx, { folder: typeof drapeaux.folder === "string" ? drapeaux.folder : void 0 });
        process.stdout.write(drapeaux.json ? JSON.stringify(inv, null, 2) + "\n" : renderInventory(inv));
        break;
      }
      const engs = chargerRegistre(ctx, []);
      const overview = streamsOverview(ctx, engs);
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(overview, null, 2) + "\n");
        break;
      }
      for (const p of overview.problems) process.stderr.write(`ERREUR ${p}. Detail: lean verifier
`);
      if (!overview.declared) {
        process.stdout.write(`No stream is declared in ${overview.file}: one implicit stream owns every domain, every path and the acceptance dossier.

`);
      }
      for (const s of overview.streams) {
        const owned = s.implicit ? "every domain" : s.domains.length ? `domains ${s.domains.join(", ")}` : "no domain";
        const counts = STATUSES.map((st) => `${st} ${s.counts[st]}`).join(", ");
        const ppc = s.ppc === null ? "n/a" : `${s.ppc} %`;
        process.stdout.write(`${s.name}  ${owned}  requirements ${s.requirements}  commitments: ${counts}  PPC ${ppc}
`);
        if (!s.implicit) process.stdout.write(`  paths: ${s.paths.length ? s.paths.join(", ") : "none"}
`);
      }
      if (overview.unassigned.length) {
        process.stdout.write(
          `
In no stream, for want of a domain that a stream owns: ${overview.unassigned.length} commitment(s): ${overview.unassigned.join(", ")}
`
        );
      }
      if (overview.across.length) {
        process.stdout.write(
          `
Across two streams or more, refused by lean verifier while open, reported once closed: ${overview.across.join(", ")}
`
        );
      }
      if (overview.declared) {
        const w = overview.whole;
        process.stdout.write(
          `
Whole registry: ${STATUSES.map((st) => `${st} ${w.counts[st]}`).join(", ")}  PPC ${w.ppc === null ? "n/a" : `${w.ppc} %`}
`
        );
      }
      break;
    }
    case "frontiere": {
      const engs = chargerRegistre(ctx, []);
      avertirRegistreInvalide(ctx, engs, "aucun de ces engagements n'est tirable");
      const occupes = domainesOccupes(ctx);
      const vs = vueStreams(ctx, engs, drapeaux);
      const front = frontiere(engs, occupes).filter(([eid]) => vs.garde(eid));
      const retenus = retenusParClaims(engs, occupes).filter((r) => vs.garde(r.eng));
      const tag = (eid) => vs.parStream ? `  [stream ${vs.label(eid)}]` : "";
      if (drapeaux.json) {
        const donnees = front.map(([eid, poids]) => {
          const e = engs.get(eid);
          return { eng: eid, debloque: poids, titre: e.titre, beneficiaire: e.beneficiaire, ...vs.parStream ? { stream: vs.label(eid) } : {} };
        });
        process.stdout.write(JSON.stringify(donnees, null, 2) + "\n");
        break;
      }
      if (!front.length) {
        process.stdout.write(vs.voulu ? `No commitment of stream ${vs.voulu} is ready to pull.
` : "Fronti\xE8re vide : aucun engagement pr\xEAt \xE0 tirer.\n");
      }
      if (vs.parStream && front.length) {
        for (const g of vs.groupes) {
          const siens = front.filter(([eid]) => vs.label(eid) === g);
          if (!siens.length) continue;
          process.stdout.write(`== stream ${g} (${siens.length} ready) ==
`);
          for (const [eid, poids] of siens) {
            const e = engs.get(eid);
            process.stdout.write(`${eid}  (d\xE9bloque ${poids})  ${e.titre}  -> ${e.beneficiaire}${tag(eid)}
`);
          }
        }
      } else {
        for (const [eid, poids] of front) {
          const e = engs.get(eid);
          process.stdout.write(`${eid}  (d\xE9bloque ${poids})  ${e.titre}  -> ${e.beneficiaire}
`);
        }
      }
      if (retenus.length) {
        process.stdout.write("\nHeld back by a domain claim (not offered until the holder delivers or is released):\n");
        for (const r of retenus) {
          const qui = r.claims.map((c) => `domain ${c.domaine} claimed by ${c.eng} (lease of ${c.owner})`).join("; ");
          process.stdout.write(`${r.eng}  ${qui}  ${engs.get(r.eng).titre}${tag(r.eng)}
`);
        }
      }
      const aVerifier = listerLeases(ctx).filter((l) => l.state === "livre").filter((l) => {
        const m = etatMandat(ctx, l.eng);
        return !m || m.statut === "echu" || m.statut === "revoque" || m.statut === "rendu" && m.verdict === "reject";
      }).map((l) => l.eng).filter((id) => vs.garde(id));
      const aIntegrer = integrationsDues(ctx).filter((id) => vs.garde(id));
      if (aVerifier.length) {
        process.stdout.write("\nTo verify (delivered, no mandate open: a verifier session takes it, lean mandat ENG):\n");
        for (const id of aVerifier) process.stdout.write(`${id}  ${engs.get(id)?.titre ?? ""}${tag(id)}
`);
      }
      if (aIntegrer.length) {
        process.stdout.write("\nTo integrate (approved, not merged: lean integrer ENG):\n");
        for (const id of aIntegrer) process.stdout.write(`${id}  ${engs.get(id)?.titre ?? ""}${tag(id)}
`);
      }
      break;
    }
    case "editions": {
      const lint = editions(ctx);
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(lint, null, 2) + "\n");
      } else if (!lint.actif) {
        process.stdout.write(`No edition registry (${EDITION_REGISTRY}): this repository classifies no component, and nothing was read.
`);
      } else {
        const refus2 = lint.findings.filter((f) => f.gravite === "refus");
        process.stdout.write(
          `${lint.standard} Standard and ${lint.program} Program component(s) read against ${lint.registre}: ${refus2.length} finding(s) refused, ${lint.findings.length - refus2.length} recorded.
`
        );
        for (const f of lint.findings) {
          process.stdout.write(`[${f.gravite === "refus" ? "REFUS " : "INFO  "}] ${f.fichier}:${f.ligne} (${f.regle}) ${f.message}
`);
        }
      }
      if (lint.findings.some((f) => f.gravite === "refus")) process.exitCode = 1;
      break;
    }
    case "publier": {
      const message = positionnels.join(" ").trim();
      if (message.length < 15 || !/^[a-z]+(\([^)]+\))?: /.test(message)) {
        echec(
          "usage",
          'lean publier "chore(steering): what changed and why [ENG-NNNN]": a commit message in the convention of the repository'
        );
      }
      const p = await muter(ctx, () => publishState(ctx, message));
      if (!p.commit && p.pushed === null && !p.note) {
        process.stdout.write("Nothing to publish: the steering state holds no change, and the remote holds every commit.\n");
        break;
      }
      for (const f of p.files) process.stdout.write(`  ${f}
`);
      process.stdout.write(`${publicationLine(p) ?? `committed as ${p.commit}; no remote is tracked, so nothing was pushed`}
`);
      process.exit(p.note ? 1 : 0);
      break;
    }
    case "prior": {
      const id = premier();
      const engs = chargerRegistre(ctx, []);
      if (!engs.has(id)) echec("introuvable", `no commitment is named ${id}. Try: lean search ${id}`);
      refreshRemoteRefs(ctx);
      const p = priorWork(ctx, engs, id);
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(p, null, 2) + "\n");
        process.exit(p.findings.length ? 1 : 0);
      }
      const distant = p.remote_reachable === null ? "no remote is tracked: only this clone was read" : p.remote_reachable ? "the remote answered" : "the remote did not answer: read against the refs of the last fetch";
      process.stdout.write(`${id}: ${distant}.
`);
      if (!p.findings.length) process.stdout.write("Elsewhere: nothing. The remote shows no take, no closure and no commit that this clone lacks.\n");
      for (const f of p.findings) process.stdout.write(`ELSEWHERE: ${f.constat}
`);
      for (const c of p.commits) process.stdout.write(`  ${c.sha} ${c.date.slice(0, 10)} ${c.subject}
`);
      if (p.findings.length) process.stdout.write(`Next: ${gestureFor(id)}
`);
      if (!p.similar.length) {
        process.stdout.write("Similar commitments: none at or above the reporting score.\n");
      } else {
        process.stdout.write("Similar commitments, to read first (lean show ENG, lean rapport ENG):\n");
        for (const l of similarLines(p.similar)) process.stdout.write(`  ${l}
`);
      }
      process.exit(p.findings.length ? 1 : 0);
      break;
    }
    case "conseils": {
      try {
        refreshRemoteRefs(ctx);
      } catch {
      }
      const vs = vueStreams(ctx, chargerRegistre(ctx, []), drapeaux);
      const streamsDe = (c) => [...new Set(c.cibles.filter((x) => /^ENG-\d{4}$/.test(x)).map(vs.label))];
      const toutes = conseils(ctx, { limite: vs.voulu ? void 0 : drapeaux.limite ? Number(drapeaux.limite) : void 0 }).map((c) => vs.parStream ? { ...c, streams: streamsDe(c) } : c).filter((c) => !vs.voulu || !("streams" in c) || !c.streams.length || c.streams.includes(vs.voulu));
      const liste = vs.voulu && drapeaux.limite ? toutes.slice(0, Number(drapeaux.limite)) : toutes;
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(liste, null, 2) + "\n");
        break;
      }
      if (!liste.length) {
        process.stdout.write("Rien \xE0 signaler : le pilotage est sain et la flotte peut avancer.\n");
        break;
      }
      const marque = { bloquant: "BLOQUANT", attente: "ATTENTE ", hygiene: "HYGI\xC8NE " };
      const ecrireConseil = (c) => {
        process.stdout.write(`[${marque[c.gravite]}] ${c.constat}
`);
        process.stdout.write(`             pourquoi : ${c.pourquoi}
`);
        process.stdout.write(`             geste    : ${c.geste}

`);
      };
      if (!vs.parStream) {
        for (const c of liste) ecrireConseil(c);
        break;
      }
      const groupe = (c) => {
        const st = "streams" in c ? c.streams : [];
        return st.length ? st.join(", ") : "every stream (the workstation)";
      };
      const ordre = [...new Set(liste.map(groupe))].sort((a, b) => {
        const rang = (g) => g.startsWith("every stream") ? -1 : vs.groupes.indexOf(g.split(", ")[0]);
        return rang(a) - rang(b);
      });
      for (const g of ordre) {
        process.stdout.write(`== stream ${g} ==
`);
        for (const c of liste.filter((x) => groupe(x) === g)) ecrireConseil(c);
      }
      break;
    }
    case "jalon": {
      const jalon = premier();
      const engs = chargerRegistre(ctx, []);
      const occupes = domainesOccupes(ctx);
      const b = bilanJalon(ctx, engs, jalon, occupes);
      if (!b) echec("introuvable", `no commitment names the milestone ${jalon} (beneficiaire: jalon:${jalon})`);
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(b, null, 2) + "\n");
        break;
      }
      const l = [`${b.jalon}: ${b.engagements} commitment(s), ${b.tenus} held`];
      l.push(`critical chain left: ${b.chemin_critique.length ? b.chemin_critique.map((id) => `${id} [${etatDans(engs, id, occupes)}]`).join(" -> ") : "none"}`);
      for (const f of b.entonnoirs) l.push(`funnel: ${f.eng} waits on ${f.predecesseurs.length} predecessors, ${f.en_attente.length} not held (${f.en_attente.join(", ")})`);
      for (const s of b.suites_dans_le_scope) l.push(`follow-up inside a delivered scope: ${s.eng} after ${s.parent} (a rework, next time)`);
      if (b.sans_contrat) l.push("every precedence is finish-start: no contract is frozen for an interface precedence");
      l.push(`ready: ${b.prets.length ? b.prets.join(", ") : "none"}`);
      for (const c of b.concentration) l.push(`  ${c.engagements.length} of them reserve ${c.prefixe}: ${c.engagements.join(", ")}`);
      l.push(`  can run together: ${b.independants.length ? b.independants.map(([a, c]) => `${a}+${c}`).join(", ") : "no pair"}`);
      for (const p of b.chevauchements) l.push(`  one after the other: ${p.a} and ${p.b} (${p.chemins[0]})`);
      l.push(`cost of a cycle, held commitments: work ${b.mediane_travail_h ?? "?"} h median, delivery to held ${b.mediane_verification_h ?? "?"} h median`);
      for (const c of b.couts) {
        l.push(`  ${c.eng}: work ${c.travail_h ?? "?"} h, verification ${c.verification_h ?? "?"} h, ${c.mandats} mandate(s), ${c.rejets} rejection(s), ${c.builds} build(s) ${c.builds_min} min, ${c.tests} tests`);
      }
      process.stdout.write(l.join("\n") + "\n");
      break;
    }
    case "lots": {
      const engs = chargerRegistre(ctx, []);
      avertirRegistreInvalide(ctx, engs, "aucun de ces lots n'est tirable");
      const vs = vueStreams(ctx, engs, drapeaux);
      const occupes = domainesOccupes(ctx);
      if (!vs.parStream) {
        const lots = lotsParallelisables(engs, occupes);
        if (drapeaux.json) {
          process.stdout.write(JSON.stringify(lots, null, 2) + "\n");
          break;
        }
        if (!lots.length) {
          process.stdout.write("Aucun lot : la fronti\xE8re est vide.\n");
          break;
        }
        lots.forEach((lot, i) => {
          process.stdout.write(`Lot ${i + 1} (${lot.engagements.length} tirable(s) ensemble) : ${lot.engagements.join(", ")}
`);
          for (const x of lot.exclusions) process.stdout.write(`    exclu : ${x.eng} : ${x.motif}
`);
        });
        process.stdout.write("\nUn engagement par lot maximise le travail simultan\xE9 sans conflit de chemins.\n");
        break;
      }
      const parGroupe = vs.groupes.map((g) => ({ stream: g, lots: lotsParallelisables(engs, occupes, (eid) => vs.label(eid) === g) }));
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(parGroupe.flatMap((x) => x.lots.map((l) => ({ stream: x.stream, ...l }))), null, 2) + "\n");
        break;
      }
      if (!parGroupe.some((x) => x.lots.length)) {
        process.stdout.write(vs.voulu ? `No lot: no commitment of stream ${vs.voulu} is ready to pull.
` : "Aucun lot : la fronti\xE8re est vide.\n");
        break;
      }
      for (const x of parGroupe) {
        if (!x.lots.length) continue;
        process.stdout.write(`== stream ${x.stream} ==
`);
        x.lots.forEach((lot, i) => {
          process.stdout.write(`Lot ${i + 1} (${lot.engagements.length} can be pulled together): ${lot.engagements.join(", ")}  [stream ${x.stream}]
`);
          for (const e of lot.exclusions) process.stdout.write(`    excluded: ${e.eng}: ${e.motif}
`);
        });
      }
      process.stdout.write("\nOne commitment per lot gives the most simultaneous work with no conflict of paths.\n");
      break;
    }
    case "arbitrages": {
      const das = chargerDas(ctx);
      const voulues = drapeaux.toutes ? das : das.filter((d) => d.statut === "ouverte" || d.statut === "renvoyee");
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(voulues, null, 2) + "\n");
        break;
      }
      if (!voulues.length) {
        process.stdout.write(drapeaux.toutes ? "Aucun arbitrage.\n" : "Aucun arbitrage ouvert.\n");
        break;
      }
      for (const d of voulues) {
        process.stdout.write(
          `${d.id}  [${String(d.statut ?? "?")}]  d\xE9cideur ${String(d.decideur ?? "non d\xE9sign\xE9")}${d.echeance_reponse ? `  r\xE9ponse avant ${String(d.echeance_reponse)}` : ""}
    ${d.titre}
`
        );
      }
      break;
    }
    case "impact": {
      const r = impact(ctx, chargerRegistre(ctx, []), premier());
      if (!r.ok) echec("introuvable", String(r.erreur));
      process.stdout.write(JSON.stringify(r, null, 2) + "\n");
      break;
    }
    case "dashboard": {
      if (drapeaux.stream !== void 0) {
        const vs = vueStreams(ctx, chargerRegistre(ctx, []), drapeaux);
        process.stdout.write(rendreDashboard(ctx, { stream: vs.voulu ?? void 0 }));
        break;
      }
      await muter(ctx, () => genererDashboard(ctx));
      process.stdout.write(`OK : ${ctx.dashboard} r\xE9g\xE9n\xE9r\xE9.
`);
      break;
    }
    case "revoquer": {
      const eng = premier();
      const motif = String(drapeaux.motif ?? "");
      if (!motif) echec("motif_manquant", "r\xE9voquer exige --motif (il est montr\xE9 \xE0 la session)");
      const corps = await muter(ctx, () => revoquerSession(ctx, { eng, motif }));
      rendre(corps, (c) => process.stdout.write(`OK : ${eng} r\xE9voqu\xE9. ${c.effet ?? ""}
`));
      break;
    }
    case "relacher": {
      const eng = premier();
      const mode = drapeaux.fin ? "fin" : "abandon";
      const corps = await muter(ctx, () => relacher(ctx, eng, null, mode, Boolean(drapeaux.forcer)));
      rendre(corps, (c) => process.stdout.write(`OK : ${eng} ${mode} (${c.claims_liberes ?? 0} claim(s) lib\xE9r\xE9e(s)).
`));
      break;
    }
    case "oublier": {
      const corps = await muter(ctx, () => oublier(ctx, premier()));
      rendre(corps, () => process.stdout.write(`OK : record retir\xE9.
`));
      break;
    }
    case "abandonner": {
      const eng = premier();
      const motif = String(drapeaux.motif ?? "");
      if (!motif) echec("motif_manquant", "abandonner exige --motif (il est \xE9crit dans la variance et la note du record)");
      const corps = await muter(ctx, () => abandonner(ctx, { eng, motif }));
      rendre(
        corps,
        (c) => process.stdout.write(`OK : ${eng} abandonne (was ${c.statut_precedent}, ${c.claims_liberes ?? 0} claim(s) released). It counts in no PPC.
`)
      );
      break;
    }
    case "remplacer": {
      const eng = premier();
      const par = String(drapeaux.par ?? "");
      if (!par) echec("par_manquant", "remplacer exige --par ENG-NNNN (the record that carries the work)");
      const corps = await muter(ctx, () => remplacer(ctx, { eng, par, motif: String(drapeaux.motif ?? "") }));
      rendre(
        corps,
        (c) => process.stdout.write(`OK : ${eng} remplace by ${c.par} (was ${c.statut_precedent}, ${c.claims_liberes ?? 0} claim(s) released). Its dependants read ${c.par}.
`)
      );
      break;
    }
    case "requalifier": {
      const corps = await muter(ctx, () => requalifier(ctx));
      rendre(corps, (c) => {
        const r = c.remplaces;
        const a = c.abandonnes;
        const i = c.ignores;
        for (const [id, par] of r) process.stdout.write(`  ${id} remplace by ${par}
`);
        for (const id of a) process.stdout.write(`  ${id} abandonne
`);
        process.stdout.write(
          `OK : ${r.length} record(s) remplace, ${a.length} abandonne, ${i.length} rompu with the variance abandon left as they are` + (i.length ? ` (${i.join(", ")})` : "") + ".\n"
        );
      });
      break;
    }
    case "pause": {
      const corps = await muter(ctx, () => toutMettreEnPause(ctx));
      process.stdout.write(
        `OK : pause globale. ${corps.geles.length} session(s) gel\xE9e(s) au prochain outil : ${corps.geles.join(", ") || "aucune"}
`
      );
      break;
    }
    case "reprise": {
      await muter(ctx, () => reprendreTout(ctx));
      process.stdout.write("OK : reprise ; les sessions repartent d'elles-m\xEAmes.\n");
      break;
    }
    case "plafond": {
      if (!positionnels.length) {
        process.stdout.write(String(plafond(ctx)) + "\n");
        break;
      }
      const n = Number(positionnels[0]);
      if (!Number.isFinite(n)) echec("plafond_invalide", "le plafond est un entier");
      await muter(ctx, () => reglerPlafond(ctx, n));
      process.stdout.write(`OK : plafond \xE0 ${Math.max(0, Math.trunc(n))}.
`);
      break;
    }
    case "sessions": {
      const lignes = listerLeases(ctx);
      const engs = chargerRegistre(ctx, []);
      const vs = vueStreams(ctx, engs, drapeaux);
      if (!vs.parStream) {
        process.stdout.write(JSON.stringify(lignes, null, 2) + "\n");
        break;
      }
      const rang = (l) => vs.groupes.indexOf(vs.label(l.eng));
      const parStream = lignes.filter((l) => vs.garde(l.eng)).map((l) => ({ ...l, stream: vs.label(l.eng) })).sort((a, b) => rang(a) - rang(b) || (a.eng < b.eng ? -1 : 1));
      process.stdout.write(JSON.stringify(parStream, null, 2) + "\n");
      break;
    }
    case "arbitrer": {
      const id = premier();
      const rec = chargerRecord(ctx, id);
      const sources = [path39.join(ctx.livraisons, id, "BLOCKED.md"), rec?.worktree ? path39.join(String(rec.worktree), "BLOCKED.md") : ""];
      const source = sources.find((f) => f && fs42.existsSync(f));
      if (!source) echec("rapport_absent", `${id} holds no blocker report (BLOCKED.md), delivered or in its worktree`);
      const rapport = fs42.readFileSync(source, "utf-8");
      const depot = await muter(ctx, () => {
        const d = fileBlockerRequest(ctx, id, rapport, "cli");
        return d.ok && d.fichier ? { ...d, publication: publishTransaction(ctx, [d.fichier, path39.join(ctx.arbitrages, `BROUILLON-DA-${id.toLowerCase()}.md`)], `chore(steering): ${id} blocked, ${d.da} ${d.rewritten ? "rewritten" : "filed"} [${id}]`, id) } : d;
      });
      if (!depot.ok) {
        for (const m of depot.manques ?? []) process.stderr.write(`  missing: ${m}
`);
        echec(String(depot.code ?? "arbitrer"), `${depot.erreur}. ${BLOCKER_RULE}`);
      }
      rendre(depot, () => {
        process.stdout.write(
          `OK: ${depot.da} is ${depot.rewritten ? "rewritten" : "filed"} and open, from ${source}.
` + (depot.suite ? `${depot.suite}.
` : "") + `It is decided as any other: lean decider ${depot.da} --choix X. The session of ${id} resumes on eng attendre ${depot.da}.
`
        );
      });
      break;
    }
    case "rapport": {
      const corps = lireRapport(ctx, premier());
      if (!corps.ok) echec("rapport_absent", String(corps.erreur));
      process.stdout.write(String(corps.content));
      const reponse = path39.join(ctx.livraisons, String(corps.eng ?? ""), "ANSWER.md");
      if (fs42.existsSync(reponse)) process.stdout.write(`

${"=".repeat(60)}
${fs42.readFileSync(reponse, "utf-8")}`);
      break;
    }
    case "decider": {
      const da = premier();
      const choix = String(drapeaux.choix ?? "");
      const motif = String(drapeaux.motif ?? "");
      const corps = await muter(ctx, () => deciderDa(ctx, da, choix, motif));
      rendre(
        corps,
        (c) => process.stdout.write(`OK : ${da} d\xE9cid\xE9e. ${c.adr} produit, engagement de r\xE9ponse ${c.engagement_solde ?? "(aucun)"} sold\xE9.
`)
      );
      break;
    }
    case "renvoyer": {
      const da = premier();
      const corps = await muter(ctx, () => renvoyerDa(ctx, da, String(drapeaux.motif ?? "")));
      rendre(
        corps,
        () => process.stdout.write(
          `OK: ${da} is returned for study. An agent investigates again, rewrites the request, then runs lean republier ${da}.
`
        )
      );
      break;
    }
    case "republier": {
      const da = premier();
      const corps = await muter(ctx, () => republierDa(ctx, da));
      rendre(corps, () => process.stdout.write(`OK: ${da} is open again and waits for its decider.
`));
      break;
    }
    case "mandat": {
      const eng = premier();
      if (drapeaux.etat) {
        const m = etatMandat(ctx, eng);
        if (!m) echec("mandat_inconnu", `aucun mandat pour ${eng}`);
        process.stdout.write(JSON.stringify(m, null, 2) + "\n");
        break;
      }
      const r = await muter(ctx, () => reclamerMandat(ctx, eng, lireConfig(ctx).mandat_ttl_minutes));
      rendre(r.corps, (c) => process.stdout.write(JSON.stringify(c, null, 2) + "\n"));
      break;
    }
    case "essai": {
      const separateur = argv.indexOf("--");
      const argvEssai = separateur >= 0 ? argv.slice(separateur + 1) : [];
      const sortiesEssai = String(drapeaux.sorties ?? "");
      if (!sortiesEssai) echec("usage", 'lean essai "command" --sorties file  |  lean essai --sorties file -- program arg...');
      const commande2 = separateur >= 0 ? "" : positionnels.join(" ").trim();
      if (!argvEssai.length && !commande2) echec("usage", "essai takes a command: one string, or a program and its arguments after --");
      const essai = jouerEssai({
        commande: commande2,
        argv: argvEssai,
        cwd: process.cwd(),
        shell: drapeaux.shell ? String(drapeaux.shell) : void 0,
        timeoutMs: drapeaux.minutes ? Number(drapeaux.minutes) * 6e4 : void 0
      });
      consignerEssai(sortiesEssai, essai);
      process.stdout.write(essai.sortie);
      process.stdout.write(`${MARQUE_ESSAI} exit ${essai.exit}, ${essai.ms} ms, recorded in ${sortiesEssai}
`);
      const budget = lireConfig(ctx).essai_budget_minutes;
      if (essai.ms > budget * 6e4) {
        process.stderr.write(
          `LONG TEST: ${Math.round(essai.ms / 6e4)} min, beyond the budget of ${budget} min. A verification runs the tests of the crates touched, in parallel, within its budget; a load, a soak or a chaos sequence belongs to a dedicated trial at the end of the milestone.
`
        );
      }
      process.exit(essai.exit === 0 ? 0 : 1);
      break;
    }
    case "verdict": {
      const eng = premier();
      const sorties = drapeaux.sorties ? fs42.readFileSync(String(drapeaux.sorties), "utf-8") : "";
      const cites = String(drapeaux.tests ?? "").split(";").map((t) => t.trim()).filter(Boolean);
      let constats = {};
      if (drapeaux.constats) {
        try {
          constats = JSON.parse(fs42.readFileSync(String(drapeaux.constats), "utf-8"));
        } catch (e) {
          echec("constats_illisibles", `--constats ${String(drapeaux.constats)}: ${String(e.message)}`);
        }
      }
      const r = await muter(ctx, () => {
        const verdict = deposerVerdict(ctx, eng, {
          jeton_mandat: String(drapeaux.jeton ?? ""),
          verdict: String(drapeaux.sens ?? ""),
          diff_empreinte_examinee: String(drapeaux.empreinte ?? ""),
          tests_cites: cites,
          sorties_tests: sorties,
          violations: Array.isArray(constats.violations) ? constats.violations : [],
          par_exigence: constats.par_exigence ?? {},
          tests: constats.tests ?? {},
          motif_arbitrage: drapeaux["motif-arbitrage"] ? String(drapeaux["motif-arbitrage"]) : null,
          mineur: drapeaux.mineur === true
        });
        if (verdict.corps.ok && verdict.corps.verdict === "approve") {
          const branche = String(chargerRecord(ctx, eng)?.branch ?? brancheEngagement(eng));
          const marque = recordPhase(ctx, eng, branche, "verified", "verdict approve");
          if (!drapeaux["sans-integration"]) verdict.corps.integration = integrer(ctx, eng).corps;
          const i = verdict.corps.integration ?? null;
          if (marque.commit && !(i && i.ok === true)) {
            const envoi = pushCommitmentBranch(ctx, branche);
            verdict.corps.publication_branche = { phase: "verified", branch: branche, commit: marque.commit, ...envoi };
          } else if (marque.note) {
            verdict.corps.publication_branche = { phase: "verified", branch: branche, commit: null, pushed: null, note: marque.note };
          }
        }
        return verdict;
      });
      rendre(r.corps, (c) => {
        const i = c.integration ?? null;
        process.stdout.write(
          verdictMessage(ctx, eng, {
            verdict: String(c.verdict),
            rejets: Number(c.rejets_consecutifs ?? 0),
            mineur: c.mineur === true,
            testsLongs: Array.isArray(c.tests_longs) ? c.tests_longs : [],
            integration: i,
            faits: faitsIntegration(i)
          }) + "\n"
        );
        const ligne = phaseLine(c.publication_branche);
        if (ligne) process.stdout.write(ligne + "\n");
      });
      break;
    }
    case "integrer": {
      const eng = premier();
      const r = await muter(ctx, () => integrer(ctx, eng));
      rendre(r.corps, (c) => process.stdout.write(`${ligneIntegration(eng, c)}
`));
      break;
    }
    case "resequencer": {
      const eng = premier();
      const deps = String(drapeaux.deps ?? "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
        const [e, type] = s.split(":").map((x) => x.trim());
        return { eng: e.toUpperCase(), type: type || "finish-start" };
      });
      const r = await muter(ctx, () => resequencer(ctx, { eng, depends_on: deps }));
      rendre(
        r.corps,
        (c) => process.stdout.write(
          `OK : ${eng} res\xE9quenc\xE9. Aval : ${c.impact_avant.length} -> ${c.impact_apres.length} engagement(s).
`
        )
      );
      break;
    }
    case "menage": {
      const bilan = await muter(ctx, () => {
        const avant = chargerClaims(ctx);
        const gardees = avant.filter((c) => detenue(ctx, c));
        if (gardees.length !== avant.length) sauverClaims(ctx, gardees);
        const ramasses = collecterRapports(ctx);
        const worktrees = retirerWorktreesIntegres(ctx);
        return { retirees: avant.length - gardees.length, detenues: gardees.length, ramasses, worktrees };
      });
      process.stdout.write(`OK : ${bilan.retirees} entr\xE9e(s) retir\xE9e(s), ${bilan.detenues} d\xE9tenue(s).
`);
      if (bilan.ramasses.length) {
        process.stdout.write(`Rapports centralis\xE9s : ${bilan.ramasses.join(", ")}.
`);
      }
      if (bilan.worktrees.retires.length) {
        process.stdout.write(`Worktrees removed: ${bilan.worktrees.retires.join(", ")}.
`);
      }
      for (const reste of bilan.worktrees.restes) process.stdout.write(`Left in place: ${reste}.
`);
      break;
    }
    case "lignees": {
      const deposes = await muter(ctx, () => balayerLignees(ctx, lireConfig(ctx).ruptures_lignee_avant_da));
      process.stdout.write(
        deposes.length ? `OK : ${deposes.length} brouillon(s) de lign\xE9e d\xE9pos\xE9(s).
` : "OK : aucune lign\xE9e au-del\xE0 du seuil.\n"
      );
      break;
    }
    case "backlog": {
      const b = resteAFaire(ctx, { domaine: drapeaux.domaine, statut: drapeaux.statut });
      if (!b.total) {
        process.stdout.write("Aucune exigence dans ce p\xE9rim\xE8tre.\n");
        break;
      }
      for (const groupe of b.parDomaine) {
        process.stdout.write(`
== ${groupe.domaine} : ${groupe.exigences.length} exigence(s) restante(s) ==
`);
        for (const e of groupe.exigences) {
          const marque = e.couvertePar ? `  [d\xE9j\xE0 couverte par ${e.couvertePar}]` : "";
          process.stdout.write(
            `  ${e.id}  ${e.statut.padEnd(9)} ${e.priorite.padEnd(9)} ${e.titre}${marque}
`
          );
        }
      }
      process.stdout.write(
        `
Total : ${b.total} exigence(s), dont ${b.dejaCouvertes} d\xE9j\xE0 couverte(s) par un engagement actif.
Brouillon : lean draft SPEC-DOM-NNN [SPEC-DOM-NNN...]
`
      );
      break;
    }
    case "draft": {
      if (!positionnels.length) echec("sans_exigence", "donne au moins une exigence : lean draft SPEC-GEO-001");
      const corps = await muter(
        ctx,
        () => brouillonEngagement(ctx, positionnels, { titre: drapeaux.titre, par: "cli" })
      );
      rendre(corps, (c) => {
        process.stdout.write(`OK : ${c.fichier} cr\xE9\xE9 (statut propose).
`);
        for (const a of c.avertissements ?? []) process.stdout.write(`ATTENTION : ${a}
`);
        const proches = similarCommitments(chargerRegistre(ctx, []), String(c.eng));
        if (proches.length) {
          process.stdout.write("SIMILAR COMMITMENTS, to read before this draft is completed (lean show ENG):\n");
          for (const l of similarLines(proches)) process.stdout.write(`  ${l}
`);
        }
      });
      break;
    }
    case "numero": {
      const famille = String(positionnels[0] ?? "").toUpperCase();
      if (!["SCP", "ADR", "DA", "ENG"].includes(famille)) {
        for (const e of etatNumerotation(ctx)) {
          const attente = e.enAttente.length ? `, ${e.enAttente.length} r\xE9servation(s) non honor\xE9e(s)` : "";
          const doublons = e.doublons.length ? `  DOUBLONS : ${e.doublons.join(", ")}` : "";
          process.stdout.write(
            `  ${e.famille.padEnd(4)} disque ${String(e.surDisque).padStart(4)} | remis ${String(e.dernierRemis).padStart(4)}${attente}${doublons}
`
          );
        }
        for (const l of recordsNonPublies(ctx)) {
          process.stdout.write(
            `  ${l.famille.padEnd(4)} in this clone only, unseen by any other: ${l.fichiers.map((n) => n.replace(/\.[^.]+$/, "")).join(", ")}
`
          );
        }
        break;
      }
      if (positionnels.length > 1) {
        echec("usage", "lean numero shows the state; lean numero SCP|ADR|DA|ENG reserves a number, for good");
      }
      const alloue = await muter(ctx, () => allouerNumero(ctx, famille, "cli"));
      process.stdout.write(alloue.id + "\n");
      {
        const m = modele(ctx, famille);
        if (m) {
          process.stderr.write(
            `Write it at ${m.dossier}/${m.fichier.replace("NNNN", alloue.id.slice(-4))}. Template and the latest record as an example: lean modele ${famille}
`
          );
        }
      }
      if (alloue.provisoire) {
        process.stderr.write(
          `PROVISIONAL: ${alloue.id} is not recorded on the remote (${alloue.motif}). Another clone may be handed the same number: reserve again once the remote answers, or check before you push.
`
        );
      }
      break;
    }
    case "modele": {
      const m = modele(ctx, String(positionnels[0] ?? ""));
      if (!m) echec("usage", "lean modele DA|SCP|ENG|ADR: the template of a record family, and the latest record as an example");
      if (drapeaux.json) process.stdout.write(JSON.stringify(m, null, 2) + "\n");
      else process.stdout.write(rendreModele(m));
      break;
    }
    case "renumeroter": {
      const nom = positionnels[0] ?? "";
      if (!nom) echec("usage", "lean renumeroter <record>, the record as lean show names it, for example ADR-0081-da-0056");
      const corps = await muter(ctx, () => renumeroter(ctx, nom, "cli"));
      rendre(corps, (c) => {
        process.stdout.write(`OK: ${c.ancien} becomes ${c.nouveau}, in ${c.fichier}
`);
        const citations = c.citations ?? [];
        if (citations.length) {
          process.stdout.write(
            `${citations.length} file(s) cite ${c.ancien}, which now names the record that kept it. Review each one:
`
          );
          for (const f of citations) process.stdout.write(`  ${f}
`);
        }
      });
      break;
    }
    case "claims": {
      const sous = positionnels[0] ?? "list";
      if (sous === "list") {
        const liste = chargerClaims(ctx).map((c) => ({ ...c, detenue: detenue(ctx, c) }));
        if (drapeaux.json) {
          process.stdout.write(JSON.stringify(liste, null, 2) + "\n");
          break;
        }
        const vivantes = liste.filter((c) => c.detenue);
        if (!vivantes.length) process.stdout.write("Aucune r\xE9servation d\xE9tenue.\n");
        for (const c of vivantes) process.stdout.write(`${c.domaine}  ${c.eng}  ${c.owner}  expire ${c.expires}
`);
        const mortes = liste.length - vivantes.length;
        if (mortes) process.stdout.write(`(${mortes} entr\xE9e(s) non d\xE9tenue(s) : lean claims purge)
`);
        break;
      }
      if (sous === "check") {
        const dom = String(positionnels[1] ?? "").toUpperCase();
        if (!dom) echec("argument_manquant", "claims check exige un domaine");
        const tenue = chargerClaims(ctx).find((c) => c.domaine === dom && detenue(ctx, c));
        process.stdout.write(tenue ? `${dom} r\xE9serv\xE9 par ${tenue.eng} (${tenue.owner}) jusqu'au ${tenue.expires}
` : `${dom} libre
`);
        break;
      }
      if (sous === "take") {
        const dom = String(positionnels[1] ?? "");
        const eng = String(positionnels[2] ?? "").toUpperCase();
        if (!dom || !eng) echec("argument_manquant", "claims take exige un domaine et un engagement");
        const r = await muter(
          ctx,
          () => prendreClaim(ctx, dom, eng, String(drapeaux.owner ?? "coordinator"), drapeaux.jours ? Number(drapeaux.jours) : 4)
        );
        if (!r.ok) {
          echec("domaine_reserve", `${dom.toUpperCase()} d\xE9j\xE0 r\xE9serv\xE9 par ${r.detenteur.eng} (${r.detenteur.owner})`);
        }
        process.stdout.write(`OK : ${dom.toUpperCase()} r\xE9serv\xE9 par ${eng}.
`);
        break;
      }
      if (sous === "release") {
        const eng = String(positionnels[1] ?? "").toUpperCase();
        if (!eng) echec("argument_manquant", "claims release exige un engagement");
        const n = await muter(ctx, () => libererClaims(ctx, eng));
        process.stdout.write(`OK : ${n} r\xE9servation(s) lib\xE9r\xE9e(s) pour ${eng}.
`);
        break;
      }
      if (sous === "purge") {
        const n = await muter(ctx, () => {
          const avant = chargerClaims(ctx);
          const gardees = avant.filter((c) => detenue(ctx, c));
          if (gardees.length !== avant.length) sauverClaims(ctx, gardees);
          return avant.length - gardees.length;
        });
        process.stdout.write(`OK : ${n} entr\xE9e(s) non d\xE9tenue(s) retir\xE9e(s).
`);
        break;
      }
      echec("commande_inconnue", `claims ${sous} : attendu list, check, take, release ou purge`);
      break;
    }
    case "identite": {
      const sous = String(positionnels[0] ?? "");
      if (sous === "list") {
        const admises = admittedIdentities(ctx.racine);
        const ici = effectiveIdentity(ctx.racine);
        if (drapeaux.json) {
          process.stdout.write(JSON.stringify({ admitted: admises, here: ici }, null, 2) + "\n");
          break;
        }
        process.stdout.write("Identities admitted to sign in this repository:\n");
        for (const i of admises) {
          const marque = ici && ici.nom === i.nom && ici.mail === i.mail ? "  <- this workstation" : "";
          process.stdout.write(`  ${formatIdentity(i)}${marque}
`);
        }
        if (!ici) process.stdout.write("git states no identity on this workstation.\n");
        else if (!admises.some((i) => i.nom === ici.nom && i.mail === ici.mail)) {
          process.stdout.write(
            `This workstation signs as ${formatIdentity(ici)}, which is not admitted: every commit is refused.
Next: lean identite use "Name" mail@example.org
`
          );
          process.exit(1);
        }
        break;
      }
      if (sous === "use") {
        let nom = String(positionnels[1] ?? "");
        let mail = String(positionnels[2] ?? "");
        const entier = parseIdentity(positionnels.slice(1).join(" "));
        if (entier) ({ nom, mail } = entier);
        if (!nom || !mail) echec("usage", 'lean identite use "Name" mail@example.org');
        const r = await muter(ctx, () => useIdentity(ctx.racine, nom, mail));
        for (const f of r.faits) process.stdout.write(`  ${f}
`);
        if (!r.ok) echec(String(r.code ?? "identity"), String(r.erreur));
        process.stdout.write(
          `OK: this workstation signs as ${formatIdentity(r.identity)}.
Commit ${IDENTITIES_FILE} and the git hooks if they changed, so that the other clones admit this identity too.
`
        );
        break;
      }
      if (drapeaux.executer) {
        const r = reecrireHistorique(ctx, { jeConfirme: Boolean(drapeaux["je-confirme"]) });
        if (!r.ok) echec("reecriture_refusee", String(r.erreur));
        for (const f of r.faits) process.stdout.write(`  ${f}
`);
        process.stdout.write(
          "\nIl reste \xE0 publier, et seulement quand c'est voulu :\n  git push --force-with-lease --all origin\n  git push --force-with-lease --tags origin\n"
        );
        break;
      }
      const a = auditHistorique(ctx);
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(a, null, 2) + "\n");
        process.exit(a.aSolder || a.lexique.length ? 1 : 0);
      }
      process.stdout.write("Identit\xE9s de l'historique (auteur et committer, toutes refs) :\n");
      for (const i of a.identites) {
        process.stdout.write(`  [${i.conforme ? "  ok  " : " FAUX "}] ${String(i.n).padStart(5)}  ${i.nom} <${i.mail}>
`);
      }
      process.stdout.write(`
Contenu portant encore le lexique interdit : ${a.lexique.length} objet(s)
`);
      for (const o of a.lexique.slice(0, 20)) process.stdout.write(`  ${o}
`);
      process.stdout.write(`
D\xE9p\xF4t au repos pour une r\xE9\xE9criture : ${a.freins.length ? "NON" : "oui"}
`);
      for (const f of a.freins) process.stdout.write(`  frein : ${f}
`);
      if (!a.aSolder && !a.lexique.length) {
        process.stdout.write("\nHistorique conforme, rien \xE0 r\xE9\xE9crire.\n");
        break;
      }
      process.stdout.write(
        `
\xC0 solder : ${a.aSolder} entr\xE9e(s) d'identit\xE9, ${a.lexique.length} objet(s) de contenu.
Quand le d\xE9p\xF4t sera au repos : lean identite --executer --je-confirme
`
      );
      process.exit(1);
      break;
    }
    case "style": {
      const bilan = auditStyle(ctx.racine, { langueBloquante: lireConfig(ctx).langue_bloquante });
      if (drapeaux.json) {
        process.stdout.write(JSON.stringify(bilan, null, 2) + "\n");
        break;
      }
      const refus2 = bilan.fautes.filter((f) => f.gravite === "refus");
      const avert = bilan.fautes.filter((f) => f.gravite === "avertissement");
      process.stdout.write(
        `${bilan.fichiersExamines} fichier(s) examine(s) : ${refus2.length} faute(s) refusee(s) a l'ecriture, ${avert.length} avertissement(s).
`
      );
      if (!bilan.fautes.length) {
        process.stdout.write("Le depot est conforme a la charte.\n");
        break;
      }
      const limite = drapeaux.limite ? Number(drapeaux.limite) : 20;
      for (const [regle, n] of Object.entries(bilan.parRegle)) {
        process.stdout.write(`  ${regle.padEnd(16)} ${n} fichier(s)
`);
      }
      process.stdout.write("\n");
      for (const f of [...refus2, ...avert].slice(0, limite)) {
        const marque = f.gravite === "refus" ? "REFUS " : "AVERT ";
        process.stdout.write(`[${marque}] ${f.fichier}:${f.ligne} : ${f.quoi}
`);
        if (f.extrait) process.stdout.write(`          ${f.extrait}
`);
        process.stdout.write(`          geste : ${f.remede}
`);
      }
      if (bilan.fautes.length > limite) {
        process.stdout.write(`
... et ${bilan.fautes.length - limite} autre(s). --limite N pour en voir plus.
`);
      }
      process.exit(refus2.length ? 1 : 0);
      break;
    }
    case "conformite": {
      const inv = inventaire(ctx.racine, drapeaux["memoire"]);
      process.stdout.write(
        `Racine : ${inv.racine}
  CLAUDE.md           : ${inv.claudeMd ? "pr\xE9sent" : "absent"}
  dossier-recette/    : ${inv.dossierRecette ? `pr\xE9sent (${inv.domaines} domaine(s))` : "absent"}
  arbre d'\xE9tat        : ${inv.lean ? ".lean-engine/orchestration/" : inv.agelaios ? ".agelaios/orchestration/ (previous name of the runtime: run lean migrer)" : inv.agenticLean ? ".agenticLEAN/" : inv.orchestrateur ? "agentic_orchestrator/management/" : "absent"}
  engagements         : ${inv.engagements}
  commandes           : ${inv.commandes.join(", ") || "aucune"}
  m\xE9moires            : ${inv.memoires.length}
`
      );
      for (const m of inv.memoires) process.stdout.write(`    - ${m.nom} : ${m.description}
`);
      break;
    }
    case "migrer": {
      const corps = await muter(
        ctx,
        () => migrer(ctx, Boolean(drapeaux.annuler), Boolean(drapeaux["verifier-seulement"]), Boolean(drapeaux["emmener-sessions"]))
      );
      if (corps.ok && !drapeaux["verifier-seulement"] && !drapeaux.annuler) nettoyerAncienEtat(ctx.racine);
      if (corps.ok && drapeaux.annuler) nettoyerCibleVide(ctx.racine);
      rendre(corps, (c) => {
        if (c.message) process.stdout.write(`OK : ${String(c.message)}
`);
        const problemes = Array.isArray(c.problemes) ? c.problemes : [];
        if (problemes.length) {
          process.stdout.write(`Pr\xE9conditions non tenues :
${problemes.map((p) => `  - ${p}`).join("\n")}
`);
        }
        const deplaces = Array.isArray(c.deplaces) ? c.deplaces : [];
        if (deplaces.length) process.stdout.write(`OK : ${deplaces.length} chemin(s) d\xE9plac\xE9(s), non committ\xE9s.
`);
      });
      break;
    }
    default:
      echec("commande_inconnue", `commande '${commande}' inconnue.

${AIDE}`);
  }
}
var AIDE = `lean : pilotage du coordinateur agentique

  Read (use these instead of reading the state tree or the requirements by hand):
  show ID [--json]                            A commitment, requirement, DA, SCP or ADR, with its computed state
  search TERMS [--genre G] [--statut S] [--json]   Commitments, requirements and documents matching every term
  pitfalls [TERMS] [--json]                   Environment pitfalls: the sections that concern your problem
  editions [--json]                           Standard and Program followed on the manifests: classification, tag, direction of a dependency, versions
  publier "MESSAGE"                           Commits and pushes at once what was changed by hand in the steering state
  prior ENG [--json]                        Work that already exists for a commitment: on the remote, and in similar commitments
  streams [--json]                            The streams declared: domains, requirements folder, paths, commitments by state, PPC
  streams inventory [--json] [--folder F]     The acceptance dossier by edition: each requirement to its stream, and what a split meets

  Every stream is shown, grouped, unless --stream NAME keeps one (frontiere, lots, sessions, conseils, dashboard).

  etat | verifier | frontiere [--json] [--stream S] | impact ENG | dashboard [--stream S] | sessions [--stream S] | rapport ENG
  revoquer ENG --motif "..." | relacher ENG [--fin] [--forcer] | oublier ENG
  abandonner ENG --motif "..."                A record withdrawn: its work done elsewhere, without object or no longer wanted; no promise broken
  remplacer ENG --par ENG-XXXX [--motif "..."]  A record whose work another record carries; its dependants read the carrier
  requalifier                                 The rompu records absorbed into a block, or with no work left, take the statuses remplace and abandonne
  modele DA|SCP|ENG|ADR [--json]              The template of a record family and the latest record as an example, so that no form is guessed
  pause | reprise | plafond [N] | menage | lignees
  decider DA --choix X [--motif "..."] | renvoyer DA --motif "..." | republier DA
  mandat ENG [--etat] | verdict ENG --jeton J --sens S --empreinte E [--tests "a;b"] [--sorties F] [--constats F.json] [--mineur]
  jalon J-NNN [--json]                        One milestone: its chain, its funnels, what can run together, what each cycle cost
  essai "command" --sorties F [--shell bash|cmd|powershell|sh] [--minutes N]   Runs a test and records it, with its exit code, in the raw outputs
  essai --sorties F -- program arg...        The same, a program and its arguments, no shell
  integrer ENG                                Merges an approved commitment, marks it held, removes its worktree
  resequencer ENG --deps "ENG-XXXX:finish-start,ENG-YYYY:interface"
  migrer [--verifier-seulement] [--annuler] [--emmener-sessions]   Moves the state to .lean-engine/orchestration/, one folder per family
  install [--racine DIR] [--paquet DIR] [--appliquer]   Installs the system without the cockpit: the plan first, --appliquer writes it
  uninstall [--racine DIR] [--paquet DIR] [--appliquer]   Removes what the installation manifest lists
  backlog [--domaine DOM] [--statut S]        Reste \xE0 faire objectif du dossier de recette
  draft SPEC-... [--titre "..."]              D\xE9pose un brouillon d'engagement
  numero [SCP|ADR|DA|ENG]                     R\xE9serve un num\xE9ro, ou montre l'\xE9tat de la num\xE9rotation
  renumeroter RECORD                          Gives a new number to one of two records that share a number
  claims [list|check DOM|take DOM ENG|release ENG|purge] [--json]   R\xE9servations de domaine
  identite [--json] | --executer --je-confirme    Dette d'identit\xE9 de l'historique
  identite list [--json]                      Who is admitted to sign, and who signs on this workstation
  identite use "Name" MAIL                    Admits an identity, sets git on it and aligns the guards, at the request of that person
  style [--json] [--limite N]                 Charte de r\xE9daction : ce qui l'enfreint, et o\xF9
  conformite [--memoire DIR]                  \xC9tat des lieux du d\xE9p\xF4t
  conseils [--json] [--limite N] [--stream S] Ce qu'il faut faire maintenant, et pourquoi
  lots [--json] [--stream S]                  Lots parall\xE9lisables et leurs exclusions
  arbitrages [--toutes] [--json]              Demandes d'arbitrage, ouvertes par d\xE9faut
  arbitrer ENG                                Files the arbitration request of a blocked commitment from its report`;
principal().catch((e) => echec("erreur_interne", String(e.stack ?? e)));
