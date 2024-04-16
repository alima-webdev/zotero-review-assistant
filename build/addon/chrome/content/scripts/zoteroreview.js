"use strict";
(() => {
  var Jt = Object.create;
  var Ze = Object.defineProperty;
  var mt = Object.getOwnPropertyDescriptor;
  var Ut = Object.getOwnPropertyNames;
  var Qt = Object.getPrototypeOf,
    Xt = Object.prototype.hasOwnProperty;
  var v = (i, e) => () => (e || i((e = { exports: {} }).exports, e), e.exports);
  var Yt = (i, e, t, r) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let o of Ut(e))
        !Xt.call(i, o) &&
          o !== t &&
          Ze(i, o, {
            get: () => e[o],
            enumerable: !(r = mt(e, o)) || r.enumerable,
          });
    return i;
  };
  var U = (i, e, t) => (
    (t = i != null ? Jt(Qt(i)) : {}),
    Yt(
      e || !i || !i.__esModule
        ? Ze(t, "default", { value: i, enumerable: !0 })
        : t,
      i,
    )
  );
  var Se = (i, e, t, r) => {
    for (
      var o = r > 1 ? void 0 : r ? mt(e, t) : e, s = i.length - 1, a;
      s >= 0;
      s--
    )
      (a = i[s]) && (o = (r ? a(e, t, o) : a(o)) || o);
    return r && o && Ze(e, t, o), o;
  };
  var gt = v((K) => {
    "use strict";
    var ei =
      (K && K.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(K, "__esModule", { value: !0 });
    K.DebugBridge = void 0;
    var Ve = y(),
      ti = ei(L()),
      Q = class i {
        get version() {
          return i.version;
        }
        get disableDebugBridgePassword() {
          return this._disableDebugBridgePassword;
        }
        set disableDebugBridgePassword(e) {
          this._disableDebugBridgePassword = e;
        }
        get password() {
          return Ve.BasicTool.getZotero().Prefs.get(i.passwordPref, !0);
        }
        set password(e) {
          Ve.BasicTool.getZotero().Prefs.set(i.passwordPref, e, !0);
        }
        constructor() {
          (this._disableDebugBridgePassword = !1), this.initializeDebugBridge();
        }
        static setModule(e) {
          var t;
          (!(!((t = e.debugBridge) === null || t === void 0) && t.version) ||
            e.debugBridge.version < i.version) &&
            (e.debugBridge = new i());
        }
        initializeDebugBridge() {
          let e = {
            noContent: !0,
            doAction: async (t) => {
              var r;
              let o = Ve.BasicTool.getZotero(),
                s = o.getMainWindow(),
                a = t.spec.split("//").pop();
              if (!a) return;
              let n = {};
              (r = a.split("?").pop()) === null ||
                r === void 0 ||
                r.split("&").forEach((c) => {
                  n[c.split("=")[0]] = decodeURIComponent(c.split("=")[1]);
                });
              let l =
                  ti.default.getInstance().debugBridge
                    .disableDebugBridgePassword,
                d = !1;
              if (
                (l
                  ? (d = !0)
                  : typeof n.password > "u" && typeof this.password > "u"
                    ? (d =
                        s.confirm(`External App ${n.app} wants to execute command without password.
Command:
${(n.run || n.file || "").slice(0, 100)}
If you do not know what it is, please click Cancel to deny.`))
                    : (d = this.password === n.password),
                d)
              ) {
                if (n.run)
                  try {
                    let c = Object.getPrototypeOf(
                      async function () {},
                    ).constructor;
                    await new c("Zotero,window", n.run)(o, s);
                  } catch (c) {
                    o.debug(c), s.console.log(c);
                  }
                if (n.file)
                  try {
                    Services.scriptloader.loadSubScript(n.file, {
                      Zotero: o,
                      window: s,
                    });
                  } catch (c) {
                    o.debug(c), s.console.log(c);
                  }
              }
            },
            newChannel: function (t) {
              this.doAction(t);
            },
          };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions[
            "zotero://ztoolkit-debug"
          ] = e;
        }
      };
    K.DebugBridge = Q;
    Q.version = 2;
    Q.passwordPref = "extensions.zotero.debug-bridge.password";
  });
  var bt = v((ae) => {
    "use strict";
    Object.defineProperty(ae, "__esModule", { value: !0 });
    ae.PluginBridge = void 0;
    var ii = y(),
      ne = class i {
        get version() {
          return i.version;
        }
        constructor() {
          this.initializePluginBridge();
        }
        static setModule(e) {
          var t;
          (!(!((t = e.pluginBridge) === null || t === void 0) && t.version) ||
            e.pluginBridge.version < i.version) &&
            (e.pluginBridge = new i());
        }
        initializePluginBridge() {
          let { AddonManager: e } = ChromeUtils.import(
              "resource://gre/modules/AddonManager.jsm",
            ),
            t = ii.BasicTool.getZotero(),
            r = {
              noContent: !0,
              doAction: async (o) => {
                var s;
                try {
                  let a = o.spec.split("//").pop();
                  if (!a) return;
                  let n = {};
                  if (
                    ((s = a.split("?").pop()) === null ||
                      s === void 0 ||
                      s.split("&").forEach((l) => {
                        n[l.split("=")[0]] = decodeURIComponent(
                          l.split("=")[1],
                        );
                      }),
                    n.action === "install" && n.url)
                  ) {
                    if (
                      (n.minVersion &&
                        Services.vc.compare(t.version, n.minVersion) < 0) ||
                      (n.maxVersion &&
                        Services.vc.compare(t.version, n.maxVersion) > 0)
                    )
                      throw new Error(
                        `Plugin is not compatible with Zotero version ${t.version}.The plugin requires Zotero version between ${n.minVersion} and ${n.maxVersion}.`,
                      );
                    let l = await e.getInstallForURL(n.url);
                    if (l && l.state === e.STATE_AVAILABLE)
                      l.install(), pt("Plugin installed successfully.", !0);
                    else throw new Error(`Plugin ${n.url} is not available.`);
                  }
                } catch (a) {
                  t.logError(a), pt(a.message, !1);
                }
              },
              newChannel: function (o) {
                this.doAction(o);
              },
            };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions[
            "zotero://plugin"
          ] = r;
        }
      };
    ae.PluginBridge = ne;
    ne.version = 1;
    function pt(i, e) {
      let t = new Zotero.ProgressWindow({ closeOnClick: !0 });
      t.changeHeadline("Plugin Toolkit"),
        (t.progress = new t.ItemProgress(
          e
            ? "chrome://zotero/skin/tick.png"
            : "chrome://zotero/skin/cross.png",
          i,
        )),
        t.progress.setProgress(100),
        t.show(),
        t.startCloseTimer(5e3);
    }
  });
  var L = v((X) => {
    "use strict";
    Object.defineProperty(X, "__esModule", { value: !0 });
    X.ToolkitGlobal = void 0;
    var qe = y(),
      ri = gt(),
      oi = bt(),
      le = class i {
        constructor() {
          yt(this),
            (this.currentWindow = qe.BasicTool.getZotero().getMainWindow());
        }
        static getInstance() {
          let e = qe.BasicTool.getZotero(),
            t = !1;
          "_toolkitGlobal" in e || ((e._toolkitGlobal = new i()), (t = !0));
          let r = e._toolkitGlobal;
          return (
            r.currentWindow !== e.getMainWindow() && (si(r), (t = !0)),
            t && yt(r),
            r
          );
        }
      };
    X.ToolkitGlobal = le;
    function yt(i) {
      N(i, "fieldHooks", {
        _ready: !1,
        getFieldHooks: {},
        setFieldHooks: {},
        isFieldOfBaseHooks: {},
      }),
        N(i, "itemTree", { _ready: !1, columns: [], renderCellHooks: {} }),
        N(i, "itemBox", { _ready: !1, fieldOptions: {} }),
        N(i, "shortcut", { _ready: !1, eventKeys: [] }),
        N(i, "prompt", { _ready: !1, instance: void 0 }),
        N(i, "readerInstance", { _ready: !1, initializedHooks: {} }),
        ri.DebugBridge.setModule(i),
        oi.PluginBridge.setModule(i);
    }
    function N(i, e, t) {
      var r, o;
      if (t) {
        i[e] || (i[e] = t);
        for (let s in t)
          ((r = (o = i[e])[s]) !== null && r !== void 0) || (o[s] = t[s]);
      }
    }
    function si(i) {
      (i.currentWindow = qe.BasicTool.getZotero().getMainWindow()),
        (i.itemTree = void 0),
        (i.itemBox = void 0),
        (i.shortcut = void 0),
        (i.prompt = void 0),
        (i.readerInstance = void 0);
    }
    X.default = le;
  });
  var y = v((I) => {
    "use strict";
    var ni =
      (I && I.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(I, "__esModule", { value: !0 });
    I.makeHelperTool = I.unregister = I.ManagerTool = I.BasicTool = void 0;
    var ai = ni(L()),
      Y = class i {
        get basicOptions() {
          return this._basicOptions;
        }
        constructor(e) {
          (this.patchSign = "zotero-plugin-toolkit@2.0.0"),
            (this._basicOptions = {
              log: {
                _type: "toolkitlog",
                disableConsole: !1,
                disableZLog: !1,
                prefix: "",
              },
              debug: ai.default.getInstance().debugBridge,
              api: { pluginID: "zotero-plugin-toolkit@windingwind.com" },
              listeners: {
                callbacks: {
                  onMainWindowLoad: new Set(),
                  onMainWindowUnload: new Set(),
                  onPluginUnload: new Set(),
                },
                _mainWindow: void 0,
                _plugin: void 0,
              },
            }),
            this.updateOptions(e);
        }
        getGlobal(e) {
          let t =
            typeof Zotero < "u"
              ? Zotero
              : Components.classes["@zotero.org/Zotero;1"].getService(
                  Components.interfaces.nsISupports,
                ).wrappedJSObject;
          try {
            let r = t.getMainWindow();
            switch (e) {
              case "Zotero":
              case "zotero":
                return t;
              case "window":
                return r;
              case "windows":
                return t.getMainWindows();
              case "document":
                return r.document;
              case "ZoteroPane":
              case "ZoteroPane_Local":
                return t.getActiveZoteroPane();
              default:
                return r[e];
            }
          } catch (r) {
            Zotero.logError(r);
          }
        }
        isZotero7() {
          return Zotero.platformMajorVersion >= 102;
        }
        isFX115() {
          return Zotero.platformMajorVersion >= 115;
        }
        getDOMParser() {
          if (this.isZotero7()) return new (this.getGlobal("DOMParser"))();
          try {
            return new (this.getGlobal("DOMParser"))();
          } catch {
            return Components.classes[
              "@mozilla.org/xmlextras/domparser;1"
            ].createInstance(Components.interfaces.nsIDOMParser);
          }
        }
        isXULElement(e) {
          return (
            e.namespaceURI ===
            "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
          );
        }
        createXULElement(e, t) {
          return this.isZotero7()
            ? e.createXULElement(t)
            : e.createElementNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
                t,
              );
        }
        log(...e) {
          var t;
          if (e.length === 0) return;
          let r = this.getGlobal("Zotero"),
            o = this.getGlobal("console"),
            s;
          ((t = e[e.length - 1]) === null || t === void 0
            ? void 0
            : t._type) === "toolkitlog"
            ? (s = e.pop())
            : (s = this._basicOptions.log);
          try {
            s.prefix && e.splice(0, 0, s.prefix),
              s.disableConsole ||
                (o.groupCollapsed(...e), o.trace(), o.groupEnd()),
              s.disableZLog ||
                r.debug(
                  e.map((a) => {
                    try {
                      return typeof a == "object"
                        ? JSON.stringify(a)
                        : String(a);
                    } catch {
                      return r.debug(a), "";
                    }
                  }).join(`
`),
                );
          } catch (a) {
            o.error(a), r.logError(a);
          }
        }
        patch(e, t, r, o) {
          if (e[t][r]) throw new Error(`${String(t)} re-patched`);
          this.log("patching", t, `by ${r}`), (e[t] = o(e[t])), (e[t][r] = !0);
        }
        addListenerCallback(e, t) {
          ["onMainWindowLoad", "onMainWindowUnload"].includes(e) &&
            this._ensureMainWindowListener(),
            e === "onPluginUnload" && this._ensurePluginListener(),
            this._basicOptions.listeners.callbacks[e].add(t);
        }
        removeListenerCallback(e, t) {
          this._basicOptions.listeners.callbacks[e].delete(t),
            this._ensureRemoveListener();
        }
        _ensureRemoveListener() {
          let { listeners: e } = this._basicOptions;
          e._mainWindow &&
            e.callbacks.onMainWindowLoad.size === 0 &&
            e.callbacks.onMainWindowUnload.size === 0 &&
            (Services.wm.removeListener(e._mainWindow), delete e._mainWindow),
            e._plugin &&
              e.callbacks.onPluginUnload.size === 0 &&
              (Zotero.Plugins.removeObserver(e._plugin), delete e._plugin);
        }
        _ensureMainWindowListener() {
          if (this._basicOptions.listeners._mainWindow) return;
          let e = {
            onOpenWindow: (t) => {
              let r = t.docShell.domWindow,
                o = async () => {
                  if (
                    (r.removeEventListener("load", o, !1),
                    r.location.href ===
                      "chrome://zotero/content/zoteroPane.xhtml")
                  )
                    for (let s of this._basicOptions.listeners.callbacks
                      .onMainWindowLoad)
                      try {
                        s(r);
                      } catch (a) {
                        this.log(a);
                      }
                };
              r.addEventListener("load", () => o(), !1);
            },
            onCloseWindow: async (t) => {
              let r = t.docShell.domWindow;
              if (
                r.location.href === "chrome://zotero/content/zoteroPane.xhtml"
              )
                for (let o of this._basicOptions.listeners.callbacks
                  .onMainWindowUnload)
                  try {
                    o(r);
                  } catch (s) {
                    this.log(s);
                  }
            },
          };
          (this._basicOptions.listeners._mainWindow = e),
            Services.wm.addListener(e);
        }
        _ensurePluginListener() {
          if (this._basicOptions.listeners._plugin) return;
          let e = {
            shutdown: (...t) => {
              for (let r of this._basicOptions.listeners.callbacks
                .onPluginUnload)
                try {
                  r(...t);
                } catch (o) {
                  this.log(o);
                }
            },
          };
          (this._basicOptions.listeners._plugin = e),
            Zotero.Plugins.addObserver(e);
        }
        updateOptions(e) {
          return e
            ? (e instanceof i
                ? (this._basicOptions = e._basicOptions)
                : (this._basicOptions = e),
              this)
            : this;
        }
        static getZotero() {
          return typeof Zotero < "u"
            ? Zotero
            : Components.classes["@zotero.org/Zotero;1"].getService(
                Components.interfaces.nsISupports,
              ).wrappedJSObject;
        }
      };
    I.BasicTool = Y;
    var ce = class extends Y {
      _ensureAutoUnregisterAll() {
        this.addListenerCallback("onPluginUnload", (e, t) => {
          e.id === this.basicOptions.api.pluginID && this.unregisterAll();
        });
      }
    };
    I.ManagerTool = ce;
    function li(i) {
      Object.values(i).forEach((e) => {
        (e instanceof ce || typeof e?.unregisterAll == "function") &&
          e.unregisterAll();
      });
    }
    I.unregister = li;
    function ci(i, e) {
      return new Proxy(i, {
        construct(t, r) {
          let o = new i(...r);
          return o instanceof Y && o.updateOptions(e), o;
        },
      });
    }
    I.makeHelperTool = ci;
  });
  var P = v((ue) => {
    "use strict";
    Object.defineProperty(ue, "__esModule", { value: !0 });
    ue.UITool = void 0;
    var Ci = y(),
      Fe = class extends Ci.BasicTool {
        get basicOptions() {
          return this._basicOptions;
        }
        constructor(e) {
          super(e),
            (this.elementCache = []),
            this._basicOptions.ui ||
              (this._basicOptions.ui = {
                enableElementRecord: !0,
                enableElementJSONLog: !1,
                enableElementDOMLog: !0,
              });
        }
        unregisterAll() {
          this.elementCache.forEach((e) => {
            var t;
            try {
              (t = e?.deref()) === null || t === void 0 || t.remove();
            } catch (r) {
              this.log(r);
            }
          });
        }
        createElement(...e) {
          var t, r, o;
          let s = e[0],
            a = e[1].toLowerCase(),
            n = e[2] || {};
          if (!a) return;
          typeof e[2] == "string" &&
            (n = { namespace: e[2], enableElementRecord: e[3] }),
            ((typeof n.enableElementJSONLog < "u" && n.enableElementJSONLog) ||
              this.basicOptions.ui.enableElementJSONLog) &&
              this.log(n),
            (n.properties = n.properties || n.directAttributes),
            (n.children = n.children || n.subElementOptions);
          let l;
          if (a === "fragment") l = s.createDocumentFragment();
          else {
            let d =
              n.id &&
              (n.checkExistenceParent
                ? n.checkExistenceParent
                : s
              ).querySelector(`#${n.id}`);
            if (d && n.ignoreIfExists) return d;
            if (
              (d && n.removeIfExists && (d.remove(), (d = void 0)),
              n.customCheck && !n.customCheck(s, n))
            )
              return;
            if (!d || !n.skipIfExists) {
              let c = n.namespace;
              if (!c) {
                let f = Pi.includes(a),
                  u = zi.includes(a),
                  g = Li.includes(a);
                Number(f) + Number(u) + Number(g) > 1 &&
                  this.log(
                    `[Warning] Creating element ${a} with no namespace specified. Found multiply namespace matches.`,
                  ),
                  f
                    ? (c = "html")
                    : u
                      ? (c = "xul")
                      : g
                        ? (c = "svg")
                        : (c = "html");
              }
              c === "xul"
                ? (d = this.createXULElement(s, a))
                : (d = s.createElementNS(
                    {
                      html: "http://www.w3.org/1999/xhtml",
                      svg: "http://www.w3.org/2000/svg",
                    }[c],
                    a,
                  )),
                (typeof n.enableElementRecord < "u"
                  ? n.enableElementRecord
                  : this.basicOptions.ui.enableElementRecord) &&
                  this.elementCache.push(new WeakRef(d));
            }
            n.id && (d.id = n.id),
              n.styles &&
                Object.keys(n.styles).length &&
                Object.keys(n.styles).forEach((c) => {
                  let f = n.styles[c];
                  typeof f < "u" && (d.style[c] = f);
                }),
              n.properties &&
                Object.keys(n.properties).length &&
                Object.keys(n.properties).forEach((c) => {
                  let f = n.properties[c];
                  typeof f < "u" && (d[c] = f);
                }),
              n.attributes &&
                Object.keys(n.attributes).length &&
                Object.keys(n.attributes).forEach((c) => {
                  let f = n.attributes[c];
                  typeof f < "u" && d.setAttribute(c, String(f));
                }),
              !((t = n.classList) === null || t === void 0) &&
                t.length &&
                d.classList.add(...n.classList),
              !((r = n.listeners) === null || r === void 0) &&
                r.length &&
                n.listeners.forEach(({ type: c, listener: f, options: u }) => {
                  f && d.addEventListener(c, f, u);
                }),
              (l = d);
          }
          if (!((o = n.children) === null || o === void 0) && o.length) {
            let d = n.children
              .map(
                (c) => (
                  (c.namespace = c.namespace || n.namespace),
                  this.createElement(s, c.tag, c)
                ),
              )
              .filter((c) => c);
            l.append(...d);
          }
          return (
            (typeof n.enableElementDOMLog < "u"
              ? n.enableElementDOMLog
              : this.basicOptions.ui.enableElementDOMLog) && this.log(l),
            l
          );
        }
        appendElement(e, t) {
          return t.appendChild(this.createElement(t.ownerDocument, e.tag, e));
        }
        insertElementBefore(e, t) {
          if (t.parentNode)
            return t.parentNode.insertBefore(
              this.createElement(t.ownerDocument, e.tag, e),
              t,
            );
          this.log(t.tagName + " has no parent, cannot insert " + e.tag);
        }
        replaceElement(e, t) {
          if (t.parentNode)
            return t.parentNode.replaceChild(
              this.createElement(t.ownerDocument, e.tag, e),
              t,
            );
          this.log(
            t.tagName + " has no parent, cannot replace it with " + e.tag,
          );
        }
        parseXHTMLToFragment(e, t = [], r = !0) {
          let o = this.getDOMParser(),
            s = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            a = "http://www.w3.org/1999/xhtml",
            n = `${t.length ? `<!DOCTYPE bindings [ ${t.reduce((c, f, u) => c + `<!ENTITY % _dtd-${u} SYSTEM "${f}"> %_dtd-${u}; `, "")}]>` : ""}
      <html:div xmlns="${r ? s : a}"
          xmlns:xul="${s}" xmlns:html="${a}">
      ${e}
      </html:div>`;
          this.log(n, o);
          let l = o.parseFromString(n, "text/xml");
          if ((this.log(l), l.documentElement.localName === "parsererror"))
            throw new Error("not well-formed XHTML");
          let d = l.createRange();
          return (
            d.selectNodeContents(l.querySelector("div")), d.extractContents()
          );
        }
      };
    ue.UITool = Fe;
    var Pi = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "menu",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr",
      ],
      zi = [
        "action",
        "arrowscrollbox",
        "bbox",
        "binding",
        "bindings",
        "box",
        "broadcaster",
        "broadcasterset",
        "button",
        "browser",
        "checkbox",
        "caption",
        "colorpicker",
        "column",
        "columns",
        "commandset",
        "command",
        "conditions",
        "content",
        "deck",
        "description",
        "dialog",
        "dialogheader",
        "editor",
        "grid",
        "grippy",
        "groupbox",
        "hbox",
        "iframe",
        "image",
        "key",
        "keyset",
        "label",
        "listbox",
        "listcell",
        "listcol",
        "listcols",
        "listhead",
        "listheader",
        "listitem",
        "member",
        "menu",
        "menubar",
        "menuitem",
        "menulist",
        "menupopup",
        "menuseparator",
        "observes",
        "overlay",
        "page",
        "popup",
        "popupset",
        "preference",
        "preferences",
        "prefpane",
        "prefwindow",
        "progressmeter",
        "radio",
        "radiogroup",
        "resizer",
        "richlistbox",
        "richlistitem",
        "row",
        "rows",
        "rule",
        "script",
        "scrollbar",
        "scrollbox",
        "scrollcorner",
        "separator",
        "spacer",
        "splitter",
        "stack",
        "statusbar",
        "statusbarpanel",
        "stringbundle",
        "stringbundleset",
        "tab",
        "tabbrowser",
        "tabbox",
        "tabpanel",
        "tabpanels",
        "tabs",
        "template",
        "textnode",
        "textbox",
        "titlebar",
        "toolbar",
        "toolbarbutton",
        "toolbargrippy",
        "toolbaritem",
        "toolbarpalette",
        "toolbarseparator",
        "toolbarset",
        "toolbarspacer",
        "toolbarspring",
        "toolbox",
        "tooltip",
        "tree",
        "treecell",
        "treechildren",
        "treecol",
        "treecols",
        "treeitem",
        "treerow",
        "treeseparator",
        "triple",
        "vbox",
        "window",
        "wizard",
        "wizardpage",
      ],
      Li = [
        "a",
        "animate",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "defs",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "foreignObject",
        "g",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "metadata",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "script",
        "set",
        "stop",
        "style",
        "svg",
        "switch",
        "symbol",
        "text",
        "textPath",
        "title",
        "tspan",
        "use",
        "view",
      ];
  });
  var Ke = v((B) => {
    "use strict";
    Object.defineProperty(B, "__esModule", { value: !0 });
    B.waitUtilAsync = B.waitUntil = void 0;
    var Ri = y(),
      H = new Ri.BasicTool();
    function Zi(i, e, t = 100, r = 1e4) {
      let o = Date.now(),
        s = H.getGlobal("setInterval")(() => {
          i()
            ? (H.getGlobal("clearInterval")(s), e())
            : Date.now() - o > r && H.getGlobal("clearInterval")(s);
        }, t);
    }
    B.waitUntil = Zi;
    function Si(i, e = 100, t = 1e4) {
      return new Promise((r, o) => {
        let s = Date.now(),
          a = H.getGlobal("setInterval")(() => {
            i()
              ? (H.getGlobal("clearInterval")(a), r())
              : Date.now() - s > t && (H.getGlobal("clearInterval")(a), o());
          }, e);
      });
    }
    B.waitUtilAsync = Si;
  });
  var Ge = v((he) => {
    "use strict";
    Object.defineProperty(he, "__esModule", { value: !0 });
    he.ReaderTool = void 0;
    var Vi = y(),
      qi = Ke(),
      Ne = class extends Vi.BasicTool {
        async getReader(e = 5e3) {
          let t = this.getGlobal("Zotero_Tabs");
          if (t.selectedType !== "reader") return;
          let r = Zotero.Reader.getByTabID(t.selectedID),
            o = 0,
            s = 50;
          for (; !r && o * s < e; )
            await Zotero.Promise.delay(s),
              (r = Zotero.Reader.getByTabID(t.selectedID)),
              o++;
          return await r?._initPromise, r;
        }
        getWindowReader() {
          let e = this.getGlobal("Zotero_Tabs"),
            t = [],
            r = e._tabs.map((o) => o.id);
          for (let o = 0; o < Zotero.Reader._readers.length; o++) {
            let s = !1;
            for (let a = 0; a < r.length; a++)
              if (Zotero.Reader._readers[o].tabID == r[a]) {
                s = !0;
                break;
              }
            s || t.push(Zotero.Reader._readers[o]);
          }
          return t;
        }
        getReaderTabPanelDeck() {
          var e;
          return (e =
            this.getGlobal("window").document.querySelector(
              ".notes-pane-deck",
            )) === null || e === void 0
            ? void 0
            : e.previousElementSibling;
        }
        async addReaderTabPanelDeckObserver(e) {
          await (0, qi.waitUtilAsync)(() => !!this.getReaderTabPanelDeck());
          let t = this.getReaderTabPanelDeck(),
            r = new (this.getGlobal("MutationObserver"))(async (o) => {
              o.forEach(async (s) => {
                let a = s.target;
                (a.classList.contains("zotero-view-tabbox") ||
                  a.tagName === "deck") &&
                  e();
              });
            });
          return (
            r.observe(t, {
              attributes: !0,
              attributeFilter: ["selectedIndex"],
              subtree: !0,
            }),
            r
          );
        }
        getSelectedAnnotationData(e) {
          var t;
          return (t = e?._internalReader._lastView._selectionPopup) === null ||
            t === void 0
            ? void 0
            : t.annotation;
        }
        getSelectedText(e) {
          var t, r;
          return (r =
            (t = this.getSelectedAnnotationData(e)) === null || t === void 0
              ? void 0
              : t.text) !== null && r !== void 0
            ? r
            : "";
        }
      };
    he.ReaderTool = Ne;
  });
  var xt = v((fe) => {
    "use strict";
    Object.defineProperty(fe, "__esModule", { value: !0 });
    fe.ExtraFieldTool = void 0;
    var Ai = y(),
      He = class extends Ai.BasicTool {
        getExtraFields(e, t = "custom") {
          let r = e.getField("extra");
          if (t === "default")
            return this.getGlobal(
              "Zotero",
            ).Utilities.Internal.extractExtraFields(r).fields;
          {
            let o = new Map(),
              s = [];
            return (
              r
                .split(
                  `
`,
                )
                .forEach((a) => {
                  let n = a.split(": ");
                  n.length >= 2 && n[0]
                    ? o.set(n[0], n.slice(1).join(": "))
                    : s.push(a);
                }),
              o.set(
                "__nonStandard__",
                s.join(`
`),
              ),
              o
            );
          }
        }
        getExtraField(e, t) {
          return this.getExtraFields(e).get(t);
        }
        async replaceExtraFields(e, t) {
          let r = [];
          t.has("__nonStandard__") &&
            (r.push(t.get("__nonStandard__")), t.delete("__nonStandard__")),
            t.forEach((o, s) => {
              r.push(`${s}: ${o}`);
            }),
            e.setField(
              "extra",
              r.join(`
`),
            ),
            await e.saveTx();
        }
        async setExtraField(e, t, r) {
          let o = this.getExtraFields(e);
          r === "" || typeof r > "u" ? o.delete(t) : o.set(t, r),
            await this.replaceExtraFields(e, o);
        }
      };
    fe.ExtraFieldTool = He;
  });
  var Me = v((me) => {
    "use strict";
    Object.defineProperty(me, "__esModule", { value: !0 });
    me.PatchHelper = void 0;
    var Fi = y(),
      Be = class extends Fi.BasicTool {
        constructor() {
          super(), (this.options = void 0);
        }
        setData(e) {
          this.options = e;
          let t = this.getGlobal("Zotero"),
            { target: r, funcSign: o, patcher: s } = e,
            a = r[o];
          return (
            this.log("patching ", o),
            (r[o] = function (...n) {
              if (e.enabled)
                try {
                  return s(a).apply(this, n);
                } catch (l) {
                  t.logError(l);
                }
              return a.apply(this, n);
            }),
            this
          );
        }
        enable() {
          if (!this.options) throw new Error("No patch data set");
          return (this.options.enabled = !0), this;
        }
        disable() {
          if (!this.options) throw new Error("No patch data set");
          return (this.options.enabled = !1), this;
        }
      };
    me.PatchHelper = Be;
  });
  var pe = v((ge) => {
    "use strict";
    Object.defineProperty(ge, "__esModule", { value: !0 });
    ge.FieldHookManager = void 0;
    var We = Me(),
      Ki = y(),
      $e = class extends Ki.ManagerTool {
        constructor(e) {
          super(e),
            (this.data = { getField: {}, setField: {}, isFieldOfBase: {} }),
            (this.patchHelpers = {
              getField: new We.PatchHelper(),
              setField: new We.PatchHelper(),
              isFieldOfBase: new We.PatchHelper(),
            });
          let t = this;
          for (let r of Object.keys(this.patchHelpers))
            this.patchHelpers[r].setData({
              target: this.getGlobal("Zotero").Item.prototype,
              funcSign: r,
              patcher: (s) =>
                function (a, ...n) {
                  let l = this,
                    d = t.data[r][a];
                  if (typeof d == "function")
                    try {
                      return d(a, n[0], n[1], l, s);
                    } catch (c) {
                      return a + String(c);
                    }
                  return s.apply(l, [a, ...n]);
                },
              enabled: !0,
            });
        }
        register(e, t, r) {
          this.data[e][t] = r;
        }
        unregister(e, t) {
          delete this.data[e][t];
        }
        unregisterAll() {
          (this.data.getField = {}),
            (this.data.setField = {}),
            (this.data.isFieldOfBase = {}),
            this.patchHelpers.getField.disable(),
            this.patchHelpers.setField.disable(),
            this.patchHelpers.isFieldOfBase.disable();
        }
      };
    ge.FieldHookManager = $e;
  });
  var je = v((be) => {
    "use strict";
    Object.defineProperty(be, "__esModule", { value: !0 });
    be.PatcherManager = void 0;
    var Ni = y(),
      Ee = class extends Ni.ManagerTool {
        constructor(e) {
          super(e), (this.patcherIDMap = new Map());
        }
        register(e, t, r) {
          let o = this.getGlobal("Zotero"),
            s = this.patcherIDMap,
            a = o.randomString();
          for (; s.has(a); ) a = o.randomString();
          let n = e[t];
          return (
            s.set(a, !0),
            this.log("patching ", t),
            (e[t] = function (...l) {
              if (s.get(a))
                try {
                  return r(n).apply(this, l);
                } catch (d) {
                  o.logError(d);
                }
              return n.apply(this, l);
            }),
            a
          );
        }
        unregister(e) {
          this.patcherIDMap.delete(e);
        }
        unregisterAll() {
          this.patcherIDMap.clear();
        }
      };
    be.PatcherManager = Ee;
  });
  var Tt = v((M) => {
    "use strict";
    var Gi =
      (M && M.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(M, "__esModule", { value: !0 });
    M.ItemTreeManager = void 0;
    var Hi = y(),
      Bi = pe(),
      Mi = Gi(L()),
      Wi = je(),
      De = class extends Hi.ManagerTool {
        constructor(e) {
          super(e),
            (this.defaultPersist = [
              "width",
              "ordinal",
              "hidden",
              "sortActive",
              "sortDirection",
            ]),
            (this.backend = this.getGlobal("Zotero").ItemTreeManager),
            (this.localColumnCache = []),
            (this.localRenderCellCache = []),
            (this.fieldHooks = new Bi.FieldHookManager(e)),
            (this.patcherManager = new Wi.PatcherManager(e)),
            (this.initializationLock =
              this.getGlobal("Zotero").Promise.defer()),
            this.backend
              ? this.initializationLock.resolve()
              : this.initializeGlobal();
        }
        unregisterAll() {
          [...this.localColumnCache].forEach((e) =>
            this.unregister(e, { skipGetField: !0 }),
          ),
            [...this.localRenderCellCache].forEach(
              this.removeRenderCellHook.bind(this),
            ),
            this.fieldHooks.unregisterAll();
        }
        async register(e, t, r, o = { showInColumnPicker: !0 }) {
          var s;
          if (
            (await ((s = this.initializationLock) === null || s === void 0
              ? void 0
              : s.promise),
            !this.backend &&
              this.globalCache.columns.map((n) => n.dataKey).includes(e))
          ) {
            this.log(`ItemTreeTool: ${e} is already registered.`);
            return;
          }
          let a = {
            dataKey: e,
            label: t,
            pluginID: this._basicOptions.api.pluginID,
            iconLabel: o.iconPath
              ? this.createIconLabel({ iconPath: o.iconPath, name: t })
              : void 0,
            iconPath: o.iconPath,
            htmlLabel: o.htmlLabel,
            zoteroPersist:
              o.zoteroPersist ||
              (this.backend
                ? this.defaultPersist
                : new Set(this.defaultPersist)),
            defaultIn: o.defaultIn,
            disabledIn: o.disabledIn,
            enabledTreeIDs: o.enabledTreeIDs,
            defaultSort: o.defaultSort,
            sortReverse: o.sortReverse || o.defaultSort === -1,
            flex: typeof o.flex > "u" ? 1 : o.flex,
            width: o.width,
            fixedWidth: o.fixedWidth,
            staticWidth: o.staticWidth,
            minWidth: o.minWidth,
            ignoreInColumnPicker: o.ignoreInColumnPicker,
            showInColumnPicker:
              typeof o.ignoreInColumnPicker > "u" ? !0 : o.showInColumnPicker,
            submenu: o.submenu,
            columnPickerSubMenu: o.columnPickerSubMenu || o.submenu,
            dataProvider: o.dataProvider || ((n, l) => n.getField(e)),
            renderCell: o.renderCell || o.renderCellHook,
          };
          if ((r && this.fieldHooks.register("getField", e, r), this.backend))
            return await this.backend.registerColumns(a);
          this.globalCache.columns.push(a),
            this.localColumnCache.push(a.dataKey),
            o.renderCellHook &&
              (await this.addRenderCellHook(e, o.renderCellHook)),
            await this.refresh();
        }
        async unregister(e, t = {}) {
          if ((await this.initializationLock.promise, this.backend)) {
            await this.backend.unregisterColumns(e),
              t.skipGetField || this.fieldHooks.unregister("getField", e);
            return;
          }
          let r = this.getGlobal("Zotero"),
            o = r.Prefs.get("pane.persist"),
            s = JSON.parse(o);
          delete s[e], r.Prefs.set("pane.persist", JSON.stringify(s));
          let a = this.globalCache.columns.map((l) => l.dataKey).indexOf(e);
          a >= 0 && this.globalCache.columns.splice(a, 1),
            t.skipGetField || this.fieldHooks.unregister("getField", e),
            this.removeRenderCellHook(e),
            await this.refresh();
          let n = this.localColumnCache.indexOf(e);
          n >= 0 && this.localColumnCache.splice(n, 1);
        }
        async addRenderCellHook(e, t) {
          await this.initializationLock.promise,
            e in this.globalCache.renderCellHooks &&
              this.log(
                "[WARNING] ItemTreeTool.addRenderCellHook overwrites an existing hook:",
                e,
              ),
            (this.globalCache.renderCellHooks[e] = t),
            this.localRenderCellCache.push(e);
        }
        async removeRenderCellHook(e) {
          delete this.globalCache.renderCellHooks[e];
          let t = this.localRenderCellCache.indexOf(e);
          t >= 0 && this.localRenderCellCache.splice(t, 1),
            await this.refresh();
        }
        async initializeGlobal() {
          await this.getGlobal("Zotero").uiReadyPromise;
          let t = this.getGlobal("window");
          this.globalCache = Mi.default.getInstance().itemTree;
          let r = this.globalCache;
          if (!r._ready) {
            r._ready = !0;
            let o = t.require("zotero/itemTree");
            this.backend ||
              this.patcherManager.register(
                o.prototype,
                "getColumns",
                (s) =>
                  function () {
                    let a = s.apply(this, arguments),
                      n = a.findIndex((l) => l.dataKey === "title");
                    return a.splice(n + 1, 0, ...r.columns), a;
                  },
              ),
              this.patcherManager.register(
                o.prototype,
                "_renderCell",
                (s) =>
                  function (a, n, l) {
                    if (!(l.dataKey in r.renderCellHooks))
                      return s.apply(this, arguments);
                    let d = r.renderCellHooks[l.dataKey],
                      c = d(a, n, l, s.bind(this));
                    if (c.classList.contains("cell")) return c;
                    let f = t.document.createElementNS(
                      "http://www.w3.org/1999/xhtml",
                      "span",
                    );
                    return (
                      f.classList.add(
                        "cell",
                        l.dataKey,
                        `${l.dataKey}-item-tree-main-default`,
                      ),
                      l.fixedWidth && f.classList.add("fixed-width"),
                      f.appendChild(c),
                      f
                    );
                  },
              );
          }
          this.initializationLock.resolve();
        }
        createIconLabel(e) {
          let t = window.require("react");
          return t.createElement(
            "span",
            null,
            t.createElement("img", {
              src: e.iconPath,
              height: "10px",
              width: "9px",
              style: { "margin-left": "6px" },
            }),
            " ",
            e.name,
          );
        }
        async refresh() {
          var e, t;
          await this.initializationLock.promise;
          let o = this.getGlobal("ZoteroPane").itemsView;
          if (!o) return;
          o._columnsId = null;
          let s = (e = o.tree) === null || e === void 0 ? void 0 : e._columns;
          if (!s) {
            this.log("ItemTree is still loading. Refresh skipped.");
            return;
          }
          (t = document.querySelector(`.${s._styleKey}`)) === null ||
            t === void 0 ||
            t.remove(),
            await o.refreshAndMaintainSelection(),
            (o.tree._columns = new s.__proto__.constructor(o.tree)),
            await o.refreshAndMaintainSelection();
        }
      };
    M.ItemTreeManager = De;
  });
  var _t = v((R) => {
    "use strict";
    var $i =
      (R && R.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(R, "__esModule", { value: !0 });
    R.PromptManager = R.Prompt = void 0;
    var Ei = y(),
      ji = y(),
      Di = P(),
      Oi = $i(L()),
      ye = class {
        get document() {
          return this.base.getGlobal("document");
        }
        constructor() {
          (this.lastInputText = ""),
            (this.defaultText = {
              placeholder: "Select a command...",
              empty: "No commands found.",
            }),
            (this.maxLineNum = 12),
            (this.maxSuggestionNum = 100),
            (this.commands = []),
            (this.base = new Ei.BasicTool()),
            (this.ui = new Di.UITool()),
            this.initializeUI();
        }
        initializeUI() {
          this.addStyle(),
            this.createHTML(),
            this.initInputEvents(),
            this.registerShortcut();
        }
        createHTML() {
          (this.promptNode = this.ui.createElement(this.document, "div", {
            styles: { display: "none" },
            children: [
              {
                tag: "div",
                styles: {
                  position: "fixed",
                  left: "0",
                  top: "0",
                  backgroundColor: "transparent",
                  width: "100%",
                  height: "100%",
                },
                listeners: [
                  {
                    type: "click",
                    listener: () => {
                      this.promptNode.style.display = "none";
                    },
                  },
                ],
              },
            ],
          })),
            this.promptNode.appendChild(
              this.ui.createElement(this.document, "div", {
                id: "zotero-plugin-toolkit-prompt",
                classList: ["prompt-container"],
                children: [
                  {
                    tag: "div",
                    classList: ["input-container"],
                    children: [
                      {
                        tag: "input",
                        classList: ["prompt-input"],
                        attributes: {
                          type: "text",
                          placeholder: this.defaultText.placeholder,
                        },
                      },
                      { tag: "div", classList: ["cta"] },
                    ],
                  },
                  { tag: "div", classList: ["commands-containers"] },
                  {
                    tag: "div",
                    classList: ["instructions"],
                    children: [
                      {
                        tag: "div",
                        classList: ["instruction"],
                        children: [
                          {
                            tag: "span",
                            classList: ["key"],
                            properties: { innerText: "\u2191\u2193" },
                          },
                          {
                            tag: "span",
                            properties: { innerText: "to navigate" },
                          },
                        ],
                      },
                      {
                        tag: "div",
                        classList: ["instruction"],
                        children: [
                          {
                            tag: "span",
                            classList: ["key"],
                            properties: { innerText: "enter" },
                          },
                          {
                            tag: "span",
                            properties: { innerText: "to trigger" },
                          },
                        ],
                      },
                      {
                        tag: "div",
                        classList: ["instruction"],
                        children: [
                          {
                            tag: "span",
                            classList: ["key"],
                            properties: { innerText: "esc" },
                          },
                          { tag: "span", properties: { innerText: "to exit" } },
                        ],
                      },
                    ],
                  },
                ],
              }),
            ),
            (this.inputNode = this.promptNode.querySelector("input")),
            this.document.documentElement.appendChild(this.promptNode);
        }
        showCommands(e, t = !1) {
          t &&
            this.promptNode
              .querySelectorAll(".commands-container")
              .forEach((o) => o.remove()),
            (this.inputNode.placeholder = this.defaultText.placeholder);
          let r = this.createCommandsContainer();
          for (let o of e) {
            try {
              if (!o.name || (o.when && !o.when())) continue;
            } catch {
              continue;
            }
            r.appendChild(this.createCommandNode(o));
          }
        }
        createCommandsContainer() {
          let e = this.ui.createElement(this.document, "div", {
            classList: ["commands-container"],
          });
          return (
            this.promptNode
              .querySelectorAll(".commands-container")
              .forEach((t) => {
                t.style.display = "none";
              }),
            this.promptNode
              .querySelector(".commands-containers")
              .appendChild(e),
            e
          );
        }
        getCommandsContainer() {
          return [
            ...Array.from(
              this.promptNode.querySelectorAll(".commands-container"),
            ),
          ].find((e) => e.style.display != "none");
        }
        createCommandNode(e) {
          let t = this.ui.createElement(this.document, "div", {
            classList: ["command"],
            children: [
              {
                tag: "div",
                classList: ["content"],
                children: [
                  {
                    tag: "div",
                    classList: ["name"],
                    children: [
                      { tag: "span", properties: { innerText: e.name } },
                    ],
                  },
                  {
                    tag: "div",
                    classList: ["aux"],
                    children: e.label
                      ? [
                          {
                            tag: "span",
                            classList: ["label"],
                            properties: { innerText: e.label },
                          },
                        ]
                      : [],
                  },
                ],
              },
            ],
            listeners: [
              {
                type: "mousemove",
                listener: () => {
                  this.selectItem(t);
                },
              },
              {
                type: "click",
                listener: async () => {
                  await this.execCallback(e.callback);
                },
              },
            ],
          });
          return (t.command = e), t;
        }
        trigger() {
          [
            ...Array.from(
              this.promptNode.querySelectorAll(".commands-container"),
            ),
          ]
            .find((e) => e.style.display != "none")
            .querySelector(".selected")
            .click();
        }
        exit() {
          if (
            ((this.inputNode.placeholder = this.defaultText.placeholder),
            this.promptNode.querySelectorAll(
              ".commands-containers .commands-container",
            ).length >= 2)
          ) {
            this.promptNode
              .querySelector(".commands-container:last-child")
              .remove();
            let e = this.promptNode.querySelector(
              ".commands-container:last-child",
            );
            (e.style.display = ""),
              e
                .querySelectorAll(".commands")
                .forEach((t) => (t.style.display = "flex")),
              this.inputNode.focus();
          } else this.promptNode.style.display = "none";
        }
        async execCallback(e) {
          Array.isArray(e) ? this.showCommands(e) : await e(this);
        }
        async showSuggestions(e) {
          var t =
              /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/,
            r = /\s/,
            o =
              /[\u0F00-\u0FFF\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
          function s(u, g, h, p) {
            if (u.length === 0) return 0;
            var m = 0;
            (m -= Math.max(0, u.length - 1)), (m -= p / 10);
            var b = u[0][0];
            return (
              (m -= (u[u.length - 1][1] - b + 1 - g) / 100),
              (m -= b / 1e3),
              (m -= h / 1e4)
            );
          }
          function a(u, g, h, p) {
            if (u.length === 0) return null;
            for (
              var m = h.toLowerCase(), b = 0, k = 0, x = [], S = 0;
              S < u.length;
              S++
            ) {
              var A = u[S],
                _ = m.indexOf(A, k);
              if (_ === -1) return null;
              var F = h.charAt(_);
              if (_ > 0 && !t.test(F) && !o.test(F)) {
                var J = h.charAt(_ - 1);
                if (
                  (F.toLowerCase() !== F && J.toLowerCase() !== J) ||
                  (F.toUpperCase() !== F &&
                    !t.test(J) &&
                    !r.test(J) &&
                    !o.test(J))
                )
                  if (p) {
                    if (_ !== k) {
                      (k += A.length), S--;
                      continue;
                    }
                  } else b += 1;
              }
              if (x.length === 0) x.push([_, _ + A.length]);
              else {
                var ft = x[x.length - 1];
                ft[1] < _ ? x.push([_, _ + A.length]) : (ft[1] = _ + A.length);
              }
              k = _ + A.length;
            }
            return { matches: x, score: s(x, g.length, m.length, b) };
          }
          function n(u) {
            for (
              var g = u.toLowerCase(), h = [], p = 0, m = 0;
              m < g.length;
              m++
            ) {
              var b = g.charAt(m);
              r.test(b)
                ? (p !== m && h.push(g.substring(p, m)), (p = m + 1))
                : (t.test(b) || o.test(b)) &&
                  (p !== m && h.push(g.substring(p, m)),
                  h.push(b),
                  (p = m + 1));
            }
            return (
              p !== g.length && h.push(g.substring(p, g.length)),
              { query: u, tokens: h, fuzzy: g.split("") }
            );
          }
          function l(u, g) {
            if (u.query === "") return { score: 0, matches: [] };
            var h = a(u.tokens, u.query, g, !1);
            return h || a(u.fuzzy, u.query, g, !0);
          }
          var d = n(e);
          let c = this.getCommandsContainer();
          if (
            (c.classList.contains("suggestions") && this.exit(), e.trim() == "")
          )
            return !0;
          let f = [];
          if (
            (this.getCommandsContainer()
              .querySelectorAll(".command")
              .forEach((u) => {
                let h = u.querySelector(".name span").innerText,
                  p = l(d, h);
                if (p) {
                  u = this.createCommandNode(u.command);
                  let m = "",
                    b = 0;
                  for (let k = 0; k < p.matches.length; k++) {
                    let [x, S] = p.matches[k];
                    x > b && (m += h.slice(b, x)),
                      (m += `<span class="highlight">${h.slice(x, S)}</span>`),
                      (b = S);
                  }
                  b < h.length && (m += h.slice(b, h.length)),
                    (u.querySelector(".name span").innerHTML = m),
                    f.push({ score: p.score, commandNode: u });
                }
              }),
            f.length > 0)
          )
            return (
              f.sort((u, g) => g.score - u.score).slice(this.maxSuggestionNum),
              (c = this.createCommandsContainer()),
              c.classList.add("suggestions"),
              f.forEach((u) => {
                c.appendChild(u.commandNode);
              }),
              !0
            );
          {
            let u = this.commands.find((g) => !g.name && (!g.when || g.when()));
            return (
              u
                ? await this.execCallback(u.callback)
                : this.showTip(this.defaultText.empty),
              !1
            );
          }
        }
        initInputEvents() {
          this.promptNode.addEventListener("keydown", (e) => {
            if (["ArrowUp", "ArrowDown"].indexOf(e.key) != -1) {
              e.preventDefault();
              let t,
                r = [
                  ...Array.from(
                    this.getCommandsContainer().querySelectorAll(".command"),
                  ),
                ].filter((s) => s.style.display != "none");
              (t = r.findIndex((s) => s.classList.contains("selected"))),
                t != -1
                  ? (r[t].classList.remove("selected"),
                    (t += e.key == "ArrowUp" ? -1 : 1))
                  : e.key == "ArrowUp"
                    ? (t = r.length - 1)
                    : (t = 0),
                t == -1 ? (t = r.length - 1) : t == r.length && (t = 0),
                r[t].classList.add("selected");
              let o = this.getCommandsContainer();
              o.scrollTo(
                0,
                o.querySelector(".selected").offsetTop - o.offsetHeight + 7.5,
              ),
                r[t].classList.add("selected");
            }
          }),
            this.promptNode.addEventListener("keyup", async (e) => {
              if (e.key == "Enter") this.trigger();
              else if (e.key == "Escape")
                this.inputNode.value.length > 0
                  ? (this.inputNode.value = "")
                  : this.exit();
              else if (["ArrowUp", "ArrowDown"].indexOf(e.key) != -1) return;
              let t = this.inputNode.value;
              t != this.lastInputText &&
                ((this.lastInputText = t),
                window.setTimeout(async () => {
                  await this.showSuggestions(t);
                }));
            });
        }
        showTip(e) {
          let t = this.ui.createElement(this.document, "div", {
              classList: ["tip"],
              properties: { innerText: e },
            }),
            r = this.createCommandsContainer();
          return r.classList.add("suggestions"), r.appendChild(t), t;
        }
        selectItem(e) {
          this.getCommandsContainer()
            .querySelectorAll(".command")
            .forEach((t) => t.classList.remove("selected")),
            e.classList.add("selected");
        }
        addStyle() {
          let e = this.ui.createElement(this.document, "style", {
            namespace: "html",
            id: "prompt-style",
          });
          (e.innerText = `
      .prompt-container * {
        box-sizing: border-box;
      }
      .prompt-container {
        ---radius---: 10px;
        position: fixed;
        left: 25%;
        top: 10%;
        width: 50%;
        border-radius: var(---radius---);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        box-shadow: 0px 1.8px 7.3px rgba(0, 0, 0, 0.071),
                    0px 6.3px 24.7px rgba(0, 0, 0, 0.112),
                    0px 30px 90px rgba(0, 0, 0, 0.2);
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif;
        background-color: var(--material-background) !important;
        border: var(--material-border-quarternary) !important;
      }
      
      /* input */
      .prompt-container .input-container  {
        width: 100%;
      }

      .input-container input {
        width: -moz-available;
        height: 40px;
        padding: 24px;
        border: none;
        outline: none;
        font-size: 18px;
        margin: 0 !important;
        border-radius: var(---radius---);
        background-color: var(--material-background);
      }
      
      .input-container .cta {
        border-bottom: var(--material-border-quarternary);
        margin: 5px auto;
      }
      
      /* results */
      .commands-containers {
        width: 100%;
        height: 100%;
      }
      .commands-container {
        max-height: calc(${this.maxLineNum} * 35.5px);
        width: calc(100% - 12px);
        margin-left: 12px;
        margin-right: 0%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .commands-container .command {
        display: flex;
        align-content: baseline;
        justify-content: space-between;
        border-radius: 5px;
        padding: 6px 12px;
        margin-right: 12px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .commands-container .command .content {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        overflow: hidden;
      }
      .commands-container .command .content .name {
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .commands-container .command .content .aux {
        display: flex;
        align-items: center;
        align-self: center;
        flex-shrink: 0;
      }
      
      .commands-container .command .content .aux .label {
        font-size: 15px;
        color: var(--fill-primary);
        padding: 2px 6px;
        background-color: var(--color-background);
        border-radius: 5px;
      }
      
      .commands-container .selected {
          background-color: var(--material-mix-quinary);
      }

      .commands-container .highlight {
        font-weight: bold;
      }

      .tip {
        color: var(--fill-primary);
        text-align: center;
        padding: 12px 12px;
        font-size: 18px;
      }

      /* instructions */
      .instructions {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 15px;
        height: 2.5em;
        width: 100%;
        border-top: var(--material-border-quarternary);
        color: var(--fill-secondary);
        margin-top: 5px;
      }
      
      .instructions .instruction {
        margin: auto .5em;  
      }
      
      .instructions .key {
        margin-right: .2em;
        font-weight: 600;
      }
    `),
            this.document.documentElement.appendChild(e);
        }
        registerShortcut() {
          this.document.addEventListener(
            "keydown",
            (e) => {
              if (e.shiftKey && e.key.toLowerCase() == "p") {
                if (
                  e.originalTarget.isContentEditable ||
                  "value" in e.originalTarget ||
                  this.commands.length == 0
                )
                  return;
                e.preventDefault(),
                  e.stopPropagation(),
                  this.promptNode.style.display == "none"
                    ? ((this.promptNode.style.display = "flex"),
                      this.promptNode.querySelectorAll(".commands-container")
                        .length == 1 && this.showCommands(this.commands, !0),
                      this.promptNode.focus(),
                      this.inputNode.focus())
                    : (this.promptNode.style.display = "none");
              }
            },
            !0,
          );
        }
      };
    R.Prompt = ye;
    var Oe = class extends ji.ManagerTool {
      constructor(e) {
        super(e), (this.commands = []);
        let t = Oi.default.getInstance().prompt;
        t._ready || ((t._ready = !0), (t.instance = new ye())),
          (this.prompt = t.instance);
      }
      register(e) {
        e.forEach((t) => {
          var r;
          return (r = t.id) !== null && r !== void 0 ? r : (t.id = t.name);
        }),
          (this.prompt.commands = [...this.prompt.commands, ...e]),
          (this.commands = [...this.commands, ...e]),
          this.prompt.showCommands(this.commands, !0);
      }
      unregister(e) {
        (this.prompt.commands = this.prompt.commands.filter((t) => t.id != e)),
          (this.commands = this.commands.filter((t) => t.id != e));
      }
      unregisterAll() {
        (this.prompt.commands = this.prompt.commands.filter((e) =>
          this.commands.every((t) => t.id != e.id),
        )),
          (this.commands = []);
      }
    };
    R.PromptManager = Oe;
  });
  var It = v((ve) => {
    "use strict";
    Object.defineProperty(ve, "__esModule", { value: !0 });
    ve.LibraryTabPanelManager = void 0;
    var Ji = P(),
      Ui = y(),
      Je = class extends Ui.ManagerTool {
        constructor(e) {
          super(e),
            (this.ui = new Ji.UITool(this)),
            (this.libraryTabCache = { optionsList: [] });
        }
        register(e, t, r) {
          r = r || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: !1,
          };
          let o = this.getGlobal("window"),
            s = o.document.querySelector("#zotero-view-tabbox"),
            a = `${Zotero.Utilities.randomString()}-${new Date().getTime()}`,
            n = r.tabId || `toolkit-readertab-${a}`,
            l = r.panelId || `toolkit-readertabpanel-${a}`,
            d = this.ui.createElement(o.document, "tab", {
              id: n,
              classList: [`toolkit-ui-tabs-${n}`],
              attributes: { label: e },
              ignoreIfExists: !0,
            }),
            c = this.ui.createElement(o.document, "tabpanel", {
              id: l,
              classList: [`toolkit-ui-tabs-${n}`],
              ignoreIfExists: !0,
            }),
            f = s.querySelector("tabs"),
            u = s.querySelector("tabpanels"),
            g = typeof r.targetIndex == "number" ? r.targetIndex : -1;
          return (
            g >= 0
              ? (f.querySelectorAll("tab")[g].before(d),
                u.querySelectorAll("tabpanel")[g].before(c))
              : (f.appendChild(d), u.appendChild(c)),
            r.selectPanel && (s.selectedTab = d),
            this.libraryTabCache.optionsList.push({
              tabId: n,
              tabLabel: e,
              panelId: l,
              renderPanelHook: t,
              targetIndex: g,
              selectPanel: r.selectPanel,
            }),
            t(c, o),
            n
          );
        }
        unregister(e) {
          let t = this.libraryTabCache.optionsList.findIndex(
            (r) => r.tabId === e,
          );
          t >= 0 && this.libraryTabCache.optionsList.splice(t, 1),
            this.removeTabPanel(e);
        }
        unregisterAll() {
          this.libraryTabCache.optionsList
            .map((t) => t.tabId)
            .forEach(this.unregister.bind(this));
        }
        removeTabPanel(e) {
          let t = this.getGlobal("document");
          Array.prototype.forEach.call(
            t.querySelectorAll(`.toolkit-ui-tabs-${e}`),
            (r) => {
              r.remove();
            },
          );
        }
      };
    ve.LibraryTabPanelManager = Je;
  });
  var Ct = v((we) => {
    "use strict";
    Object.defineProperty(we, "__esModule", { value: !0 });
    we.ReaderTabPanelManager = void 0;
    var Qi = P(),
      Xi = Ge(),
      Yi = y(),
      Ue = class extends Yi.ManagerTool {
        constructor(e) {
          super(e),
            (this.ui = new Qi.UITool(this)),
            (this.readerTool = new Xi.ReaderTool(this)),
            (this.readerTabCache = {
              optionsList: [],
              observer: void 0,
              initializeLock: void 0,
            });
        }
        async register(e, t, r) {
          var o;
          (r = r || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: !1,
          }),
            typeof this.readerTabCache.initializeLock > "u" &&
              (await this.initializeReaderTabObserver()),
            await ((o = this.readerTabCache.initializeLock) === null ||
            o === void 0
              ? void 0
              : o.promise);
          let s = `${Zotero.Utilities.randomString()}-${new Date().getTime()}`,
            a = r.tabId || `toolkit-readertab-${s}`,
            n = r.panelId || `toolkit-readertabpanel-${s}`,
            l = typeof r.targetIndex == "number" ? r.targetIndex : -1;
          return (
            this.readerTabCache.optionsList.push({
              tabId: a,
              tabLabel: e,
              panelId: n,
              renderPanelHook: t,
              targetIndex: l,
              selectPanel: r.selectPanel,
            }),
            await this.addReaderTabPanel(),
            a
          );
        }
        unregister(e) {
          var t;
          let r = this.readerTabCache.optionsList.findIndex(
            (o) => o.tabId === e,
          );
          r >= 0 && this.readerTabCache.optionsList.splice(r, 1),
            this.readerTabCache.optionsList.length === 0 &&
              ((t = this.readerTabCache.observer) === null ||
                t === void 0 ||
                t.disconnect(),
              (this.readerTabCache = {
                optionsList: [],
                observer: void 0,
                initializeLock: void 0,
              })),
            this.removeTabPanel(e);
        }
        unregisterAll() {
          this.readerTabCache.optionsList
            .map((t) => t.tabId)
            .forEach(this.unregister.bind(this));
        }
        changeTabPanel(e, t) {
          let r = this.readerTabCache.optionsList.findIndex(
            (o) => o.tabId === e,
          );
          r >= 0 && Object.assign(this.readerTabCache.optionsList[r], t);
        }
        removeTabPanel(e) {
          let t = this.getGlobal("document");
          Array.prototype.forEach.call(
            t.querySelectorAll(`.toolkit-ui-tabs-${e}`),
            (r) => {
              r.remove();
            },
          );
        }
        async initializeReaderTabObserver() {
          (this.readerTabCache.initializeLock =
            this.getGlobal("Zotero").Promise.defer()),
            await Promise.all([
              Zotero.initializationPromise,
              Zotero.unlockPromise,
              Zotero.uiReadyPromise,
            ]);
          let e = Zotero.Promise.defer();
          e.resolve();
          let t = await this.readerTool.addReaderTabPanelDeckObserver(
            async () => {
              await e.promise, (e = Zotero.Promise.defer());
              try {
                this.addReaderTabPanel();
              } catch {}
              e.resolve();
            },
          );
          (this.readerTabCache.observer = t),
            this.readerTabCache.initializeLock.resolve();
        }
        async addReaderTabPanel() {
          var e, t;
          let r = this.getGlobal("window"),
            o = this.readerTool.getReaderTabPanelDeck(),
            s = await this.readerTool.getReader();
          if (!s) return;
          if (
            ((e = o.selectedPanel) === null || e === void 0
              ? void 0
              : e.children[0].tagName) === "vbox"
          ) {
            let d = o.selectedPanel;
            (d.innerHTML = ""),
              this.ui.appendElement(
                {
                  tag: "tabbox",
                  classList: ["zotero-view-tabbox"],
                  attributes: { flex: "1" },
                  enableElementRecord: !1,
                  children: [
                    {
                      tag: "tabs",
                      classList: ["zotero-editpane-tabs"],
                      attributes: { orient: "horizontal" },
                      enableElementRecord: !1,
                    },
                    {
                      tag: "tabpanels",
                      classList: ["zotero-view-item"],
                      attributes: { flex: "1" },
                      enableElementRecord: !1,
                    },
                  ],
                },
                d,
              );
          }
          let a =
            (t = o.selectedPanel) === null || t === void 0
              ? void 0
              : t.querySelector("tabbox");
          if (!a) return;
          let n = a.querySelector("tabs"),
            l = a.querySelector("tabpanels");
          this.readerTabCache.optionsList.forEach((d) => {
            let c = `${d.tabId}-${s._instanceID}`,
              f = `toolkit-ui-tabs-${d.tabId}`;
            if (n?.querySelector(`.${f}`)) return;
            let u = this.ui.createElement(r.document, "tab", {
                id: c,
                classList: [f],
                attributes: { label: d.tabLabel },
                ignoreIfExists: !0,
              }),
              g = this.ui.createElement(r.document, "tabpanel", {
                id: `${d.panelId}-${s._instanceID}`,
                classList: [f],
                ignoreIfExists: !0,
              });
            d.targetIndex >= 0
              ? (n?.querySelectorAll("tab")[d.targetIndex].before(u),
                l?.querySelectorAll("tabpanel")[d.targetIndex].before(g),
                a.getAttribute("toolkit-select-fixed") !== "true" &&
                  (a.tabpanels.addEventListener("select", () => {
                    this.getGlobal("setTimeout")(() => {
                      a.tabpanels.selectedPanel = a.tabs.getRelatedElement(
                        a?.tabs.selectedItem,
                      );
                    }, 0);
                  }),
                  a.setAttribute("toolkit-select-fixed", "true")))
              : (n?.appendChild(u), l?.appendChild(g)),
              d.selectPanel && (a.selectedTab = u),
              d.renderPanelHook(g, o, r, s);
          });
        }
      };
    we.ReaderTabPanelManager = Ue;
  });
  var Pt = v((ke) => {
    "use strict";
    Object.defineProperty(ke, "__esModule", { value: !0 });
    ke.MenuManager = void 0;
    var er = P(),
      tr = y(),
      Qe = class extends tr.ManagerTool {
        constructor(e) {
          super(e), (this.ui = new er.UITool(this));
        }
        register(e, t, r = "after", o) {
          let s;
          if (
            (typeof e == "string"
              ? (s = this.getGlobal("document").querySelector(Xe[e]))
              : (s = e),
            !s)
          )
            return !1;
          let a = s.ownerDocument,
            n = (c) => {
              var f;
              let u = {
                tag: c.tag,
                id: c.id,
                namespace: "xul",
                attributes: {
                  label: c.label || "",
                  hidden: !!c.hidden,
                  disaled: !!c.disabled,
                  class: c.class || "",
                  oncommand: c.oncommand || "",
                },
                classList: c.classList,
                styles: c.styles || {},
                listeners: [],
                children: [],
              };
              return (
                c.icon &&
                  (this.getGlobal("Zotero").isMac ||
                    (c.tag === "menu"
                      ? (u.attributes.class += " menu-iconic")
                      : (u.attributes.class += " menuitem-iconic")),
                  (u.styles["list-style-image"] = `url(${c.icon})`)),
                c.tag === "menu" &&
                  u.children.push({
                    tag: "menupopup",
                    id: c.popupId,
                    attributes: { onpopupshowing: c.onpopupshowing || "" },
                    children: (c.children || c.subElementOptions || []).map(n),
                  }),
                c.commandListener &&
                  ((f = u.listeners) === null ||
                    f === void 0 ||
                    f.push({ type: "command", listener: c.commandListener })),
                u
              );
            },
            l = n(t),
            d = this.ui.createElement(a, t.tag, l);
          o || (o = r === "after" ? s.lastElementChild : s.firstElementChild),
            o[r](d),
            t.getVisibility &&
              s.addEventListener("popupshowing", (c) => {
                t.getVisibility(d, c)
                  ? d.removeAttribute("hidden")
                  : d.setAttribute("hidden", "true");
              });
        }
        unregister(e) {
          var t;
          (t = this.getGlobal("document").querySelector(`#${e}`)) === null ||
            t === void 0 ||
            t.remove();
        }
        unregisterAll() {
          this.ui.unregisterAll();
        }
      };
    ke.MenuManager = Qe;
    var Xe;
    (function (i) {
      (i.menuFile = "#menu_FilePopup"),
        (i.menuEdit = "#menu_EditPopup"),
        (i.menuView = "#menu_viewPopup"),
        (i.menuGo = "#menu_goPopup"),
        (i.menuTools = "#menu_ToolsPopup"),
        (i.menuHelp = "#menu_HelpPopup"),
        (i.collection = "#zotero-collectionmenu"),
        (i.item = "#zotero-itemmenu");
    })(Xe || (Xe = {}));
  });
  var et = v((xe) => {
    "use strict";
    Object.defineProperty(xe, "__esModule", { value: !0 });
    xe.PreferencePaneManager = void 0;
    var ir = P(),
      rr = y(),
      Ye = class extends rr.ManagerTool {
        constructor(e) {
          super(e),
            (this.alive = !0),
            (this.ui = new ir.UITool(this)),
            (this.prefPaneCache = { win: void 0, listeners: {} });
        }
        register(e) {
          if (this.isZotero7()) {
            this.getGlobal("Zotero").PreferencePanes.register(e);
            return;
          }
          let t = (o) => {
              var s;
              let a = new Map(),
                n = this.getGlobal("Zotero"),
                l = o.ownerGlobal,
                d = (h) =>
                  (h instanceof l.HTMLInputElement && h.type == "checkbox") ||
                  h.tagName == "checkbox",
                c = (h, p) => {
                  let m = n.Prefs.get(p, !0);
                  d(h) ? (h.checked = m) : (h.value = m),
                    h.dispatchEvent(new l.Event("syncfrompreference"));
                },
                f = (h) => {
                  let p = h.currentTarget;
                  if (p?.getAttribute("preference")) {
                    let m = d(p) ? p.checked : p.value;
                    n.Prefs.set(p.getAttribute("preference") || "", m, !0),
                      p.dispatchEvent(new l.Event("synctopreference"));
                  }
                },
                u = (h, p) => {
                  n.debug(`Attaching <${h.tagName}> element to ${p}`);
                  let m = n.Prefs.registerObserver(p, () => c(h, p), !0);
                  a.set(h, m);
                },
                g = (h) => {
                  a.has(h) &&
                    (n.debug(
                      `Detaching <${h.tagName}> element from preference`,
                    ),
                    n.Prefs.unregisterObserver(this._observerSymbols.get(h)),
                    a.delete(h));
                };
              for (let h of Array.from(o.querySelectorAll("[preference]"))) {
                let p = h.getAttribute("preference");
                o.querySelector("preferences > preference#" + p) &&
                  (this.log(
                    "<preference> is deprecated -- `preference` attribute values should be full preference keys, not <preference> IDs",
                  ),
                  (p =
                    (s = o.querySelector("preferences > preference#" + p)) ===
                      null || s === void 0
                      ? void 0
                      : s.getAttribute("name"))),
                  u(h, p),
                  h.addEventListener(
                    this.isXULElement(h) ? "command" : "input",
                    f,
                  ),
                  l.setTimeout(() => {
                    c(h, p);
                  });
              }
              new l.MutationObserver((h) => {
                for (let p of h)
                  if (p.type == "attributes") {
                    let m = p.target;
                    g(m),
                      m.hasAttribute("preference") &&
                        (u(m, m.getAttribute("preference") || ""),
                        m.addEventListener(
                          this.isXULElement(m) ? "command" : "input",
                          f,
                        ));
                  } else if (p.type == "childList") {
                    for (let m of Array.from(p.removedNodes)) g(m);
                    for (let m of Array.from(p.addedNodes))
                      m.nodeType == l.Node.ELEMENT_NODE &&
                        m.hasAttribute("preference") &&
                        (u(m, m.getAttribute("preference") || ""),
                        m.addEventListener(
                          this.isXULElement(m) ? "command" : "input",
                          f,
                        ));
                  }
              }).observe(o, {
                childList: !0,
                subtree: !0,
                attributeFilter: ["preference"],
              });
              for (let h of Array.from(o.querySelectorAll("[oncommand]")))
                h.oncommand = h.getAttribute("oncommand");
              for (let h of Array.from(o.children))
                h.dispatchEvent(new l.Event("load"));
            },
            r = {
              onOpenWindow: (o) => {
                if (!this.alive) return;
                let s = o
                  .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIDOMWindow);
                s.addEventListener(
                  "load",
                  async () => {
                    var a;
                    if (
                      s.location.href ===
                      "chrome://zotero/content/preferences/preferences.xul"
                    ) {
                      this.log("registerPrefPane:detected", e);
                      let n = this.getGlobal("Zotero");
                      e.id ||
                        (e.id = `plugin-${n.Utilities.randomString()}-${new Date().getTime()}`);
                      let l = await n.File.getContentsAsync(e.src),
                        d = typeof l == "string" ? l : l.response,
                        c = `<prefpane xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="${e.id}" insertafter="zotero-prefpane-advanced" label="${e.label || e.pluginID}" image="${e.image || ""}">
                ${d}
                </prefpane>`,
                        f = this.ui.parseXHTMLToFragment(
                          c,
                          e.extraDTD,
                          e.defaultXUL,
                        );
                      this.log(f);
                      let u = s.document.querySelector("prefwindow");
                      u.appendChild(f);
                      let g = s.document.querySelector(`#${e.id}`);
                      u.addPane(g);
                      let h = s.document.getAnonymousNodes(
                        s.document.querySelector(`#${e.id}`),
                      )[0];
                      (h.style.overflowY = "scroll"),
                        (h.style.height = "440px"),
                        s.sizeToContent(),
                        h.scrollHeight === h.clientHeight &&
                          (h.style.overflowY = "hidden"),
                        (this.prefPaneCache.win = s),
                        (this.prefPaneCache.listeners[e.id] = r),
                        t(g),
                        !((a = e.scripts) === null || a === void 0) &&
                          a.length &&
                          e.scripts.forEach((p) =>
                            Services.scriptloader.loadSubScript(p, s),
                          ),
                        e.onload && e.onload(s);
                    }
                  },
                  !1,
                );
              },
            };
          Services.wm.addListener(r);
        }
        unregister(e) {
          var t;
          if (Object.keys(this.prefPaneCache.listeners).indexOf(e) < 0)
            return !1;
          let o = this.prefPaneCache.listeners[e];
          Services.wm.removeListener(o), (o.onOpenWindow = void 0);
          let s = this.prefPaneCache.win;
          return (
            s &&
              !s.closed &&
              ((t = s.document.querySelector(`#${e}`)) === null ||
                t === void 0 ||
                t.remove()),
            delete this.prefPaneCache.listeners[e],
            !0
          );
        }
        unregisterAll() {
          this.alive = !1;
          for (let e in this.prefPaneCache.listeners) this.unregister(e);
        }
      };
    xe.PreferencePaneManager = Ye;
  });
  var Lt = v(($) => {
    "use strict";
    var or =
      ($ && $.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty($, "__esModule", { value: !0 });
    $.ShortcutManager = void 0;
    var T = y(),
      sr = P(),
      nr = y(),
      ar = or(L()),
      tt = class extends nr.ManagerTool {
        constructor(e) {
          super(e),
            (this.ui = new sr.UITool(this)),
            (this.creatorId = `${Zotero.Utilities.randomString()}-${new Date().getTime()}`),
            this.initializeGlobal();
        }
        register(e, t) {
          let r = t;
          switch (((r.type = e), r.type)) {
            case "event":
              return this.registerEventKey(r), !0;
            case "element":
              return this.registerElementKey(r), !0;
            case "prefs":
              return this.getGlobal("Zotero").Prefs.set(r.id, r.key || ""), !0;
            default:
              try {
                return r.register ? r.register(r) : !1;
              } catch (o) {
                return this.log(o), !1;
              }
          }
        }
        getAll() {
          return Array.prototype.concat(
            this.getMainWindowElementKeys(),
            this.getEventKeys(),
            this.getPrefsKeys(),
            this.getBuiltinKeys(),
          );
        }
        checkKeyConflicting(e, t = { includeEmpty: !1, customKeys: [] }) {
          var r;
          e.modifiers = new q(e.modifiers || "").getRaw();
          let o = this.getAll();
          return (
            !((r = t.customKeys) === null || r === void 0) &&
              r.length &&
              (o = o.concat(t.customKeys)),
            t.includeEmpty || (o = o.filter((s) => s.key)),
            o.filter((s) => {
              var a, n;
              return (
                s.id !== e.id &&
                ((a = s.key) === null || a === void 0
                  ? void 0
                  : a.toLowerCase()) ===
                  ((n = e.key) === null || n === void 0
                    ? void 0
                    : n.toLowerCase()) &&
                s.modifiers === e.modifiers
              );
            })
          );
        }
        checkAllKeyConflicting(e = { includeEmpty: !1, customKeys: [] }) {
          var t;
          let r = this.getAll();
          !((t = e.customKeys) === null || t === void 0) &&
            t.length &&
            (r = r.concat(e.customKeys)),
            e.includeEmpty || (r = r.filter((s) => s.key));
          let o = [];
          for (; r.length > 0; ) {
            let s = r.pop(),
              a = r.filter((n) => {
                var l, d;
                return (
                  ((l = n.key) === null || l === void 0
                    ? void 0
                    : l.toLowerCase()) ===
                    ((d = s.key) === null || d === void 0
                      ? void 0
                      : d.toLowerCase()) && n.modifiers === s.modifiers
                );
              });
            if (a.length) {
              a.push(s), o.push(a);
              let n = a.map((d) => d.id),
                l = [];
              r.forEach((d, c) => n.includes(d.id) && l.push(c)),
                l.sort((d, c) => c - d).forEach((d) => r.splice(d, 1));
            }
          }
          return o;
        }
        async unregister(e) {
          var t;
          switch (e.type) {
            case "element":
              return (
                (t = (
                  e.xulData.document || this.getGlobal("document")
                ).querySelector(`#${e.id}`)) === null ||
                  t === void 0 ||
                  t.remove(),
                !0
              );
            case "prefs":
              return this.getGlobal("Zotero").Prefs.set(e.id, ""), !0;
            case "builtin":
              return !1;
            case "event":
              let r = this.globalCache.eventKeys.findIndex(
                (o) => o.id === e.id,
              );
              for (; r >= 0; )
                this.globalCache.eventKeys.splice(r, 1),
                  (r = this.globalCache.eventKeys.findIndex(
                    (o) => o.id === e.id,
                  ));
              return !0;
            default:
              try {
                return e.unregister ? await e.unregister(e) : !1;
              } catch (o) {
                return this.log(o), !1;
              }
          }
        }
        unregisterAll() {
          this.ui.unregisterAll(),
            this.globalCache.eventKeys
              .filter((e) => e.creatorId === this.creatorId)
              .forEach((e) => this.unregister(e));
        }
        initializeGlobal() {
          let e = this.getGlobal("Zotero"),
            t = this.getGlobal("window");
          (this.globalCache = ar.default.getInstance().shortcut),
            this.globalCache._ready ||
              ((this.globalCache._ready = !0),
              t.addEventListener("keypress", (r) => {
                let o = [],
                  s = [];
                r.altKey && (o.push("alt"), s.push("alt")),
                  r.shiftKey && (o.push("shift"), s.push("shift")),
                  r.metaKey && (o.push("meta"), e.isMac && s.push("accel")),
                  r.ctrlKey && (o.push("control"), !e.isMac && s.push("accel"));
                let a = new q(o.join(",")).getRaw(),
                  n = new q(o.join(",")).getRaw();
                this.globalCache.eventKeys.forEach((l) => {
                  var d;
                  if (l.disabled) return;
                  let c = new q(l.modifiers || "").getRaw();
                  (c === a || c === n) &&
                    ((d = l.key) === null || d === void 0
                      ? void 0
                      : d.toLowerCase()) === r.key.toLowerCase() &&
                    l.callback();
                });
              }));
        }
        registerEventKey(e) {
          (e.creatorId = this.creatorId), this.globalCache.eventKeys.push(e);
        }
        registerElementCommandset(e) {
          var t;
          (t = e.document.querySelector("window")) === null ||
            t === void 0 ||
            t.appendChild(
              this.ui.createElement(e.document, "commandset", {
                id: e.id,
                skipIfExists: !0,
                children: e.commands.map((r) => ({
                  tag: "command",
                  id: r.id,
                  attributes: {
                    oncommand: r.oncommand,
                    disabled: r.disabled,
                    label: r.label,
                  },
                })),
              }),
            );
        }
        registerElementCommand(e) {
          var t;
          e._parentId &&
            this.registerElementCommandset({
              id: e._parentId,
              document: e.document,
              commands: [],
            }),
            (t = e.document.querySelector(`commandset#${e._parentId}`)) ===
              null ||
              t === void 0 ||
              t.appendChild(
                this.ui.createElement(e.document, "command", {
                  id: e.id,
                  skipIfExists: !0,
                  attributes: {
                    oncommand: e.oncommand,
                    disabled: e.disabled,
                    label: e.label,
                  },
                }),
              );
        }
        registerElementKeyset(e) {
          var t;
          (t = e.document.querySelector("window")) === null ||
            t === void 0 ||
            t.appendChild(
              this.ui.createElement(e.document, "keyset", {
                id: e.id,
                skipIfExists: !0,
                children: e.keys.map((r) => ({
                  tag: "key",
                  id: r.id,
                  attributes: {
                    oncommand: r.xulData.oncommand || "//",
                    command: r.xulData.command,
                    modifiers: r.modifiers,
                    key: this.getXULKey(r.key),
                    keycode: this.getXULKeyCode(r.key),
                    disabled: r.disabled,
                  },
                })),
              }),
            );
        }
        registerElementKey(e) {
          var t;
          let r = e.xulData.document || this.getGlobal("document");
          e.xulData._parentId &&
            this.registerElementKeyset({
              id: e.xulData._parentId,
              document: r,
              keys: [],
            }),
            (t = r.querySelector(`keyset#${e.xulData._parentId}`)) === null ||
              t === void 0 ||
              t.appendChild(
                this.ui.createElement(r, "key", {
                  id: e.id,
                  skipIfExists: !0,
                  attributes: {
                    oncommand: e.xulData.oncommand || "//",
                    command: e.xulData.command,
                    modifiers: e.modifiers,
                    key: this.getXULKey(e.key),
                    keycode: this.getXULKeyCode(e.key),
                    disabled: e.disabled,
                  },
                }),
              ),
            e.xulData._commandOptions &&
              this.registerElementCommand(e.xulData._commandOptions);
        }
        getXULKey(e) {
          if (e.length === 1) return e;
        }
        getXULKeyCode(e) {
          let t = Object.values(W).findIndex((r) => r === e);
          if (t >= 0) return Object.values(W)[t];
        }
        getStandardKey(e, t) {
          return t && Object.keys(W).includes(t) ? W[t] : e;
        }
        getElementCommandSets(e) {
          return Array.from(
            (e || this.getGlobal("document")).querySelectorAll("commandset"),
          ).map((t) => ({
            id: t.id,
            commands: Array.from(t.querySelectorAll("command")).map((r) => ({
              id: r.id,
              oncommand: r.getAttribute("oncommand"),
              disabled: r.getAttribute("disabled") === "true",
              label: r.getAttribute("label"),
              _parentId: t.id,
            })),
          }));
        }
        getElementCommands(e) {
          return Array.prototype.concat(
            ...this.getElementCommandSets(e).map((t) => t.commands),
          );
        }
        getElementKeySets(e) {
          let t = this.getElementCommands(e);
          return Array.from(
            (e || this.getGlobal("document")).querySelectorAll("keyset"),
          ).map((r) => ({
            id: r.id,
            document: e,
            keys: Array.from(r.querySelectorAll("key")).map((o) => {
              let s = o.getAttribute("oncommand") || "",
                a = o.getAttribute("command") || "",
                n = t.find((d) => d.id === a);
              return {
                type: "element",
                id: o.id,
                key: this.getStandardKey(
                  o.getAttribute("key") || "",
                  o.getAttribute("keycode") || "",
                ),
                modifiers: new q(o.getAttribute("modifiers") || "").getRaw(),
                disabled: o.getAttribute("disabled") === "true",
                xulData: {
                  document: e,
                  oncommand: s,
                  command: a,
                  _parentId: r.id,
                  _commandOptions: n,
                },
                callback: () => {
                  let c = e.ownerGlobal.eval;
                  c(s), c(n?.oncommand || "");
                },
              };
            }),
          }));
        }
        getElementKeys(e) {
          return Array.prototype
            .concat(...this.getElementKeySets(e).map((t) => t.keys))
            .filter((t) => !lr.includes(t.id));
        }
        getMainWindowElementKeys() {
          return this.getElementKeys(this.getGlobal("document"));
        }
        getEventKeys() {
          return this.globalCache.eventKeys;
        }
        getPrefsKeys() {
          let e = this.getGlobal("Zotero");
          return cr.map((t) => ({
            id: t.id,
            modifiers: t.modifiers,
            key: e.Prefs.get(t.id),
            callback: t.callback,
            type: "prefs",
          }));
        }
        getBuiltinKeys() {
          return dr.map((e) => ({
            id: e.id,
            modifiers: e.modifiers,
            key: e.key,
            callback: e.callback,
            type: "builtin",
          }));
        }
      };
    $.ShortcutManager = tt;
    var q = class {
        constructor(e) {
          (e = e || ""),
            (this.accel = e.includes("accel")),
            (this.shift = e.includes("shift")),
            (this.control = e.includes("control")),
            (this.meta = e.includes("meta")),
            (this.alt = e.includes("alt"));
        }
        equals(e) {
          this.accel,
            e.accel,
            this.shift,
            e.shift,
            this.control,
            e.control,
            this.meta,
            e.meta,
            this.alt,
            e.alt;
        }
        getRaw() {
          let e = [];
          return (
            this.accel && e.push("accel"),
            this.shift && e.push("shift"),
            this.control && e.push("control"),
            this.meta && e.push("meta"),
            this.alt && e.push("alt"),
            e.join(",")
          );
        }
      },
      W;
    (function (i) {
      (i.VK_CANCEL = "Unidentified"),
        (i.VK_BACK = "Backspace"),
        (i.VK_TAB = "Tab"),
        (i.VK_CLEAR = "Clear"),
        (i.VK_RETURN = "Enter"),
        (i.VK_ENTER = "Enter"),
        (i.VK_SHIFT = "Shift"),
        (i.VK_CONTROL = "Control"),
        (i.VK_ALT = "Alt"),
        (i.VK_PAUSE = "Pause"),
        (i.VK_CAPS_LOCK = "CapsLock"),
        (i.VK_ESCAPE = "Escape"),
        (i.VK_SPACE = " "),
        (i.VK_PAGE_UP = "PageUp"),
        (i.VK_PAGE_DOWN = "PageDown"),
        (i.VK_END = "End"),
        (i.VK_HOME = "Home"),
        (i.VK_LEFT = "ArrowLeft"),
        (i.VK_UP = "ArrowUp"),
        (i.VK_RIGHT = "ArrowRight"),
        (i.VK_DOWN = "ArrowDown"),
        (i.VK_PRINTSCREEN = "PrintScreen"),
        (i.VK_INSERT = "Insert"),
        (i.VK_DELETE = "Backspace"),
        (i.VK_0 = "0"),
        (i.VK_1 = "1"),
        (i.VK_2 = "2"),
        (i.VK_3 = "3"),
        (i.VK_4 = "4"),
        (i.VK_5 = "5"),
        (i.VK_6 = "6"),
        (i.VK_7 = "7"),
        (i.VK_8 = "8"),
        (i.VK_9 = "9"),
        (i.VK_A = "A"),
        (i.VK_B = "B"),
        (i.VK_C = "C"),
        (i.VK_D = "D"),
        (i.VK_E = "E"),
        (i.VK_F = "F"),
        (i.VK_G = "G"),
        (i.VK_H = "H"),
        (i.VK_I = "I"),
        (i.VK_J = "J"),
        (i.VK_K = "K"),
        (i.VK_L = "L"),
        (i.VK_M = "M"),
        (i.VK_N = "N"),
        (i.VK_O = "O"),
        (i.VK_P = "P"),
        (i.VK_Q = "Q"),
        (i.VK_R = "R"),
        (i.VK_S = "S"),
        (i.VK_T = "T"),
        (i.VK_U = "U"),
        (i.VK_V = "V"),
        (i.VK_W = "W"),
        (i.VK_X = "X"),
        (i.VK_Y = "Y"),
        (i.VK_Z = "Z"),
        (i.VK_SEMICOLON = "Unidentified"),
        (i.VK_EQUALS = "Unidentified"),
        (i.VK_NUMPAD0 = "0"),
        (i.VK_NUMPAD1 = "1"),
        (i.VK_NUMPAD2 = "2"),
        (i.VK_NUMPAD3 = "3"),
        (i.VK_NUMPAD4 = "4"),
        (i.VK_NUMPAD5 = "5"),
        (i.VK_NUMPAD6 = "6"),
        (i.VK_NUMPAD7 = "7"),
        (i.VK_NUMPAD8 = "8"),
        (i.VK_NUMPAD9 = "9"),
        (i.VK_MULTIPLY = "Multiply"),
        (i.VK_ADD = "Add"),
        (i.VK_SEPARATOR = "Separator"),
        (i.VK_SUBTRACT = "Subtract"),
        (i.VK_DECIMAL = "Decimal"),
        (i.VK_DIVIDE = "Divide"),
        (i.VK_F1 = "F1"),
        (i.VK_F2 = "F2"),
        (i.VK_F3 = "F3"),
        (i.VK_F4 = "F4"),
        (i.VK_F5 = "F5"),
        (i.VK_F6 = "F6"),
        (i.VK_F7 = "F7"),
        (i.VK_F8 = "F8"),
        (i.VK_F9 = "F9"),
        (i.VK_F10 = "F10"),
        (i.VK_F11 = "F11"),
        (i.VK_F12 = "F12"),
        (i.VK_F13 = "F13"),
        (i.VK_F14 = "F14"),
        (i.VK_F15 = "F15"),
        (i.VK_F16 = "F16"),
        (i.VK_F17 = "F17"),
        (i.VK_F18 = "F18"),
        (i.VK_F19 = "F19"),
        (i.VK_F20 = "F20"),
        (i.VK_F21 = "Soft1"),
        (i.VK_F22 = "Soft2"),
        (i.VK_F23 = "Soft3"),
        (i.VK_F24 = "Soft4"),
        (i.VK_NUM_LOCK = "NumLock"),
        (i.VK_SCROLL_LOCK = "ScrollLock"),
        (i.VK_COMMA = ","),
        (i.VK_PERIOD = "."),
        (i.VK_SLASH = "Divide"),
        (i.VK_BACK_QUOTE = "`"),
        (i.VK_OPEN_BRACKET = "["),
        (i.VK_CLOSE_BRACKET = "]"),
        (i.VK_QUOTE = "\\"),
        (i.VK_HELP = "Help");
    })(W || (W = {}));
    function zt(i) {
      return function () {
        var e;
        let t = T.BasicTool.getZotero().getMainWindow(),
          r = t.document.querySelector(`#${i}`);
        if (!r) return function () {};
        let o = t.eval;
        o(r.getAttribute("oncommand") || "//");
        let s = r.getAttribute("command");
        s &&
          o(
            ((e = t.document.querySelector(`#${s}`)) === null || e === void 0
              ? void 0
              : e.getAttribute("oncommand")) || "//",
          );
      };
    }
    function Z(i) {
      return function () {
        let e = T.BasicTool.getZotero();
        e.getActiveZoteroPane().handleKeyPress({
          metaKey: !0,
          ctrlKey: !0,
          shiftKey: !0,
          originalTarget: { id: "" },
          preventDefault: () => {},
          key: e.Prefs.get(`extensions.zotero.keys.${i}`, !0),
        });
      };
    }
    var lr = ["key_copyCitation", "key_copyBibliography"],
      cr = [
        {
          id: "extensions.zotero.keys.copySelectedItemCitationsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyCitation",
          callback: zt("key_copyCitation"),
        },
        {
          id: "extensions.zotero.keys.copySelectedItemsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyBibliography",
          callback: zt("key_copyBibliography"),
        },
        {
          id: "extensions.zotero.keys.library",
          modifiers: "accel,shift",
          callback: Z("library"),
        },
        {
          id: "extensions.zotero.keys.newItem",
          modifiers: "accel,shift",
          callback: Z("newItem"),
        },
        {
          id: "extensions.zotero.keys.newNote",
          modifiers: "accel,shift",
          callback: Z("newNote"),
        },
        {
          id: "extensions.zotero.keys.quicksearch",
          modifiers: "accel,shift",
          callback: Z("quicksearch"),
        },
        {
          id: "extensions.zotero.keys.saveToZotero",
          modifiers: "accel,shift",
          callback: Z("saveToZotero"),
        },
        {
          id: "extensions.zotero.keys.sync",
          modifiers: "accel,shift",
          callback: Z("sync"),
        },
        {
          id: "extensions.zotero.keys.toggleAllRead",
          modifiers: "accel,shift",
          callback: Z("toggleAllRead"),
        },
        {
          id: "extensions.zotero.keys.toggleRead",
          modifiers: "accel,shift",
          callback: Z("toggleRead"),
        },
      ],
      dr = [
        {
          id: "showItemCollection",
          modifiers: "",
          key: "Ctrl",
          callback: () => {
            let i = T.BasicTool.getZotero(),
              e = i.getActiveZoteroPane();
            e.handleKeyUp({
              originalTarget: { id: e.itemsView ? e.itemsView.id : "" },
              keyCode: i.isWin ? 17 : 18,
            });
          },
        },
        {
          id: "closeSelectedTab",
          modifiers: "accel",
          key: "W",
          callback: () => {
            let i = T.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            i.selectedIndex > 0 && i.close("");
          },
        },
        {
          id: "undoCloseTab",
          modifiers: "accel,shift",
          key: "T",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.undoClose();
          },
        },
        {
          id: "selectNextTab",
          modifiers: "control",
          key: "Tab",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.selectPrev();
          },
        },
        {
          id: "selectPreviousTab",
          modifiers: "control,shift",
          key: "Tab",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.selectNext();
          },
        },
        {
          id: "selectTab1",
          modifiers: "accel",
          key: "1",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(0);
          },
        },
        {
          id: "selectTab2",
          modifiers: "accel",
          key: "2",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(1);
          },
        },
        {
          id: "selectTab3",
          modifiers: "accel",
          key: "3",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(2);
          },
        },
        {
          id: "selectTab4",
          modifiers: "accel",
          key: "4",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(3);
          },
        },
        {
          id: "selectTab5",
          modifiers: "accel",
          key: "5",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(4);
          },
        },
        {
          id: "selectTab6",
          modifiers: "accel",
          key: "6",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(5);
          },
        },
        {
          id: "selectTab7",
          modifiers: "accel",
          key: "7",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(6);
          },
        },
        {
          id: "selectTab8",
          modifiers: "accel",
          key: "8",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.jump(7);
          },
        },
        {
          id: "selectTabLast",
          modifiers: "accel",
          key: "9",
          callback: () => {
            T.BasicTool.getZotero().getMainWindow().Zotero_Tabs.selectLast();
          },
        },
      ];
  });
  var Rt = v((Te) => {
    "use strict";
    Object.defineProperty(Te, "__esModule", { value: !0 });
    Te.ClipboardHelper = void 0;
    var ur = y(),
      it = class extends ur.BasicTool {
        constructor() {
          super(),
            (this.filePath = ""),
            (this.transferable = Components.classes[
              "@mozilla.org/widget/transferable;1"
            ].createInstance(Components.interfaces.nsITransferable)),
            (this.clipboardService = Components.classes[
              "@mozilla.org/widget/clipboard;1"
            ].getService(Components.interfaces.nsIClipboard)),
            this.transferable.init(null);
        }
        addText(e, t = "text/plain") {
          let r = Components.classes[
            "@mozilla.org/supports-string;1"
          ].createInstance(Components.interfaces.nsISupportsString);
          return (
            (r.data = e),
            this.isFX115() && t === "text/unicode" && (t = "text/plain"),
            this.transferable.addDataFlavor(t),
            this.transferable.setTransferData(t, r, e.length * 2),
            this
          );
        }
        addImage(e) {
          let t = e.split(",");
          if (!t[0].includes("base64")) return this;
          let r = t[0].match(/:(.*?);/)[1],
            o = this.getGlobal("window").atob(t[1]),
            s = o.length,
            a = new Uint8Array(s);
          for (; s--; ) a[s] = o.charCodeAt(s);
          let n = Components.classes["@mozilla.org/image/tools;1"].getService(
              Components.interfaces.imgITools,
            ),
            l,
            d;
          return (
            this.getGlobal("Zotero").platformMajorVersion >= 102
              ? ((d = n.decodeImageFromArrayBuffer(a.buffer, r)),
                (l = "application/x-moz-nativeimage"))
              : ((l = "image/png"),
                (d = Components.classes[
                  "@mozilla.org/supports-interface-pointer;1"
                ].createInstance(
                  Components.interfaces.nsISupportsInterfacePointer,
                )),
                (d.data = n.decodeImageFromArrayBuffer(a.buffer, l))),
            this.transferable.addDataFlavor(l),
            this.transferable.setTransferData(l, d, 0),
            this
          );
        }
        addFile(e) {
          let t = Components.classes[
            "@mozilla.org/file/local;1"
          ].createInstance(Components.interfaces.nsIFile);
          return (
            t.initWithPath(e),
            this.transferable.addDataFlavor("application/x-moz-file"),
            this.transferable.setTransferData("application/x-moz-file", t),
            (this.filePath = e),
            this
          );
        }
        copy() {
          try {
            this.clipboardService.setData(
              this.transferable,
              null,
              Components.interfaces.nsIClipboard.kGlobalClipboard,
            );
          } catch (e) {
            if (this.filePath && Zotero.isMac)
              Zotero.Utilities.Internal.exec("/usr/bin/osascript", [
                "-e",
                `set the clipboard to POSIX file "${this.filePath}"`,
              ]);
            else throw e;
          }
          return this;
        }
      };
    Te.ClipboardHelper = it;
  });
  var Zt = v((_e) => {
    "use strict";
    Object.defineProperty(_e, "__esModule", { value: !0 });
    _e.FilePickerHelper = void 0;
    var hr = y(),
      rt = class extends hr.BasicTool {
        constructor(e, t, r, o, s, a) {
          super(),
            (this.title = e),
            (this.mode = t),
            (this.filters = r),
            (this.suggestion = o),
            (this.window = s),
            (this.filterMask = a);
        }
        async open() {
          let e;
          Zotero.platformMajorVersion >= 115
            ? (e = ChromeUtils.importESModule(
                "chrome://zotero/content/modules/filePicker.mjs",
              ).FilePicker)
            : (e = this.getGlobal("require")(
                "zotero/modules/filePicker",
              ).default);
          let t = new e();
          t.init(
            this.window || this.getGlobal("window"),
            this.title,
            this.getMode(t),
          );
          for (let [o, s] of this.filters || []) t.appendFilter(o, s);
          switch (
            (this.filterMask && t.appendFilters(this.getFilterMask(t)),
            this.suggestion && (t.defaultString = this.suggestion),
            await t.show())
          ) {
            case t.returnOK:
            case t.returnReplace:
              return this.mode === "multiple" ? t.files : t.file;
            default:
              return !1;
          }
        }
        getMode(e) {
          switch (this.mode) {
            case "open":
              return e.modeOpen;
            case "save":
              return e.modeSave;
            case "folder":
              return e.modeGetFolder;
            case "multiple":
              return e.modeOpenMultiple;
            default:
              return 0;
          }
        }
        getFilterMask(e) {
          switch (this.filterMask) {
            case "all":
              return e.filterAll;
            case "html":
              return e.filterHTML;
            case "text":
              return e.filterText;
            case "images":
              return e.filterImages;
            case "xml":
              return e.filterXML;
            case "apps":
              return e.filterApps;
            case "urls":
              return e.filterAllowURLs;
            case "audio":
              return e.filterAudio;
            case "video":
              return e.filterVideo;
            default:
              return 1;
          }
        }
      };
    _e.FilePickerHelper = rt;
  });
  var St = v((Ie) => {
    "use strict";
    Object.defineProperty(Ie, "__esModule", { value: !0 });
    Ie.ProgressWindowHelper = void 0;
    var fr = y(),
      st = class extends Zotero.ProgressWindow {
        constructor(e, t = { closeOnClick: !0, closeTime: 5e3 }) {
          super(t),
            (this.lines = []),
            (this.closeTime = t.closeTime || 5e3),
            this.changeHeadline(e),
            (this.originalShow = this.show),
            (this.show = this.showWithTimer),
            t.closeOtherProgressWindows &&
              fr.BasicTool.getZotero().ProgressWindowSet.closeAll();
        }
        createLine(e) {
          let t = this.getIcon(e.type, e.icon),
            r = new this.ItemProgress(t || "", e.text || "");
          return (
            typeof e.progress == "number" && r.setProgress(e.progress),
            this.lines.push(r),
            this
          );
        }
        changeLine(e) {
          var t;
          if (
            ((t = this.lines) === null || t === void 0 ? void 0 : t.length) ===
            0
          )
            return this;
          let r =
              typeof e.idx < "u" && e.idx >= 0 && e.idx < this.lines.length
                ? e.idx
                : 0,
            o = this.getIcon(e.type, e.icon);
          return (
            e.text && this.lines[r].setText(e.text),
            o && this.lines[r].setIcon(o),
            typeof e.progress == "number" &&
              this.lines[r].setProgress(e.progress),
            this
          );
        }
        showWithTimer(e = void 0) {
          return (
            this.originalShow(),
            typeof e < "u" && (this.closeTime = e),
            this.closeTime &&
              this.closeTime > 0 &&
              this.startCloseTimer(this.closeTime),
            this
          );
        }
        static setIconURI(e, t) {
          ot[e] = t;
        }
        getIcon(e, t) {
          return e && e in ot ? ot[e] : t;
        }
      };
    Ie.ProgressWindowHelper = st;
    var ot = {
      success: "chrome://zotero/skin/tick.png",
      fail: "chrome://zotero/skin/cross.png",
    };
  });
  var Vt = v((Ce) => {
    "use strict";
    Object.defineProperty(Ce, "__esModule", { value: !0 });
    Ce.VirtualizedTableHelper = void 0;
    var mr = y(),
      nt = class extends mr.BasicTool {
        constructor(e) {
          super(), (this.window = e);
          let t = this.getGlobal("Zotero"),
            r = e.require;
          (this.React = r("react")),
            (this.ReactDOM = r("react-dom")),
            (this.VirtualizedTable = r("components/virtualized-table")),
            (this.IntlProvider = r("react-intl").IntlProvider),
            (this.props = {
              id: `${t.Utilities.randomString()}-${new Date().getTime()}`,
              getRowCount: () => 0,
            }),
            (this.localeStrings = t.Intl.strings);
        }
        setProp(...e) {
          return (
            e.length === 1
              ? Object.assign(this.props, e[0])
              : e.length === 2 && (this.props[e[0]] = e[1]),
            this
          );
        }
        setLocale(e) {
          return Object.assign(this.localeStrings, e), this;
        }
        setContainerId(e) {
          return (this.containerId = e), this;
        }
        render(e, t, r) {
          let o = () => {
            this.treeInstance.invalidate(),
              typeof e < "u" && e >= 0
                ? this.treeInstance.selection.select(e)
                : this.treeInstance.selection.clearSelection();
          };
          if (this.treeInstance) o();
          else {
            let s = Object.assign({}, this.props, {
              ref: (l) => (this.treeInstance = l),
            });
            s.getRowData &&
              !s.renderItem &&
              Object.assign(s, {
                renderItem: this.VirtualizedTable.makeRowRenderer(s.getRowData),
              });
            let a = this.React.createElement(
                this.IntlProvider,
                { locale: Zotero.locale, messages: Zotero.Intl.strings },
                this.React.createElement(this.VirtualizedTable, s),
              ),
              n = this.window.document.getElementById(this.containerId);
            new Promise((l) => this.ReactDOM.render(a, n, l))
              .then(() => {
                this.getGlobal("setTimeout")(() => {
                  o();
                });
              })
              .then(t, r);
          }
          return this;
        }
      };
    Ce.VirtualizedTableHelper = nt;
  });
  var At = v((Pe) => {
    "use strict";
    Object.defineProperty(Pe, "__esModule", { value: !0 });
    Pe.DialogHelper = void 0;
    var gr = P(),
      at = class extends gr.UITool {
        constructor(e, t) {
          if ((super(), e <= 0 || t <= 0))
            throw Error("row and column must be positive integers.");
          this.elementProps = {
            tag: "vbox",
            attributes: { flex: 1 },
            styles: { width: "100%", height: "100%" },
            children: [],
          };
          for (let r = 0; r < Math.max(e, 1); r++) {
            this.elementProps.children.push({
              tag: "hbox",
              attributes: { flex: 1 },
              children: [],
            });
            for (let o = 0; o < Math.max(t, 1); o++)
              this.elementProps.children[r].children.push({
                tag: "vbox",
                attributes: { flex: 1 },
                children: [],
              });
          }
          this.elementProps.children.push({
            tag: "hbox",
            attributes: { flex: 0, pack: "end" },
            children: [],
          }),
            (this.dialogData = {});
        }
        addCell(e, t, r, o = !0) {
          if (
            e >= this.elementProps.children.length ||
            t >= this.elementProps.children[e].children.length
          )
            throw Error(
              `Cell index (${e}, ${t}) is invalid, maximum (${this.elementProps.children.length}, ${this.elementProps.children[0].children.length})`,
            );
          return (
            (this.elementProps.children[e].children[t].children = [r]),
            (this.elementProps.children[e].children[t].attributes.flex = o
              ? 1
              : 0),
            this
          );
        }
        addButton(e, t, r = {}) {
          return (
            (t =
              t ||
              `${Zotero.Utilities.randomString()}-${new Date().getTime()}`),
            this.elementProps.children[
              this.elementProps.children.length - 1
            ].children.push({
              tag: "vbox",
              styles: { margin: "10px" },
              children: [
                {
                  tag: "button",
                  namespace: "html",
                  id: t,
                  attributes: { type: "button", "data-l10n-id": e },
                  properties: { innerHTML: e },
                  listeners: [
                    {
                      type: "click",
                      listener: (o) => {
                        (this.dialogData._lastButtonId = t),
                          r.callback && r.callback(o),
                          r.noClose || this.window.close();
                      },
                    },
                  ],
                },
              ],
            }),
            this
          );
        }
        setDialogData(e) {
          return (this.dialogData = e), this;
        }
        open(e, t = { centerscreen: !0, resizable: !0, fitContent: !0 }) {
          return (
            (this.window = pr(
              this,
              `${Zotero.Utilities.randomString()}-${new Date().getTime()}`,
              e,
              this.elementProps,
              this.dialogData,
              t,
            )),
            this
          );
        }
      };
    Pe.DialogHelper = at;
    function pr(
      i,
      e,
      t,
      r,
      o,
      s = { centerscreen: !0, resizable: !0, fitContent: !0 },
    ) {
      var a, n, l;
      let d = i.getGlobal("Zotero");
      (o = o || {}),
        o.loadLock || (o.loadLock = d.Promise.defer()),
        o.unloadLock || (o.unloadLock = d.Promise.defer());
      let c = `resizable=${s.resizable ? "yes" : "no"},`;
      (s.width || s.height) &&
        (c += `width=${s.width || 100},height=${s.height || 100},`),
        s.left && (c += `left=${s.left},`),
        s.top && (c += `top=${s.top},`),
        s.centerscreen && (c += "centerscreen,"),
        s.noDialogMode && (c += "dialog=no,"),
        s.alwaysRaised && (c += "alwaysRaised=yes,");
      let f = i.getGlobal("openDialog")("about:blank", e || "_blank", c, o);
      return (
        (a = o.loadLock) === null ||
          a === void 0 ||
          a.promise
            .then(() => {
              f.document.head.appendChild(
                i.createElement(f.document, "title", {
                  properties: { innerText: t },
                  attributes: { "data-l10n-id": t },
                }),
              );
              let u = o.l10nFiles || [];
              typeof u == "string" && (u = [u]),
                u.forEach((g) => {
                  f.document.head.appendChild(
                    i.createElement(f.document, "link", {
                      properties: { rel: "localization", href: g },
                    }),
                  );
                }),
                f.document.head.appendChild(
                  i.createElement(f.document, "style", {
                    properties: { innerHTML: br },
                  }),
                ),
                qt(r, i),
                f.document.body.appendChild(
                  i.createElement(f.document, "fragment", { children: [r] }),
                ),
                Array.from(f.document.querySelectorAll("*[data-bind]")).forEach(
                  (g) => {
                    let h = g.getAttribute("data-bind"),
                      p = g.getAttribute("data-attr"),
                      m = g.getAttribute("data-prop");
                    h &&
                      o &&
                      o[h] &&
                      (m ? (g[m] = o[h]) : g.setAttribute(p || "value", o[h]));
                  },
                ),
                s.fitContent &&
                  setTimeout(() => {
                    f.sizeToContent();
                  }, 300),
                f.focus();
            })
            .then(() => {
              o?.loadCallback && o.loadCallback();
            }),
        o.unloadLock.promise.then(() => {
          o?.unloadCallback && o.unloadCallback();
        }),
        f.addEventListener(
          "DOMContentLoaded",
          function u(g) {
            var h, p;
            (p =
              (h = f.arguments[0]) === null || h === void 0
                ? void 0
                : h.loadLock) === null ||
              p === void 0 ||
              p.resolve(),
              f.removeEventListener("DOMContentLoaded", u, !1);
          },
          !1,
        ),
        f.addEventListener("beforeunload", function u(g) {
          Array.from(f.document.querySelectorAll("*[data-bind]")).forEach(
            (h) => {
              let p = this.window.arguments[0],
                m = h.getAttribute("data-bind"),
                b = h.getAttribute("data-attr"),
                k = h.getAttribute("data-prop");
              m &&
                p &&
                (k ? (p[m] = h[k]) : (p[m] = h.getAttribute(b || "value")));
            },
          ),
            this.window.removeEventListener("beforeunload", u, !1),
            o?.beforeUnloadCallback && o.beforeUnloadCallback();
        }),
        f.addEventListener("unload", function u(g) {
          var h, p, m;
          (!((h = this.window.arguments[0]) === null || h === void 0) &&
            h.loadLock.promise.isPending()) ||
            ((m =
              (p = this.window.arguments[0]) === null || p === void 0
                ? void 0
                : p.unloadLock) === null ||
              m === void 0 ||
              m.resolve(),
            this.window.removeEventListener("unload", u, !1));
        }),
        f.document.readyState === "complete" &&
          ((l =
            (n = f.arguments[0]) === null || n === void 0
              ? void 0
              : n.loadLock) === null ||
            l === void 0 ||
            l.resolve()),
        f
      );
    }
    function qt(i, e) {
      var t, r, o, s, a, n, l;
      let d = !0;
      if (i.tag === "select" && e.isZotero7()) {
        d = !1;
        let c = {
          tag: "div",
          classList: ["dropdown"],
          listeners: [
            {
              type: "mouseleave",
              listener: (f) => {
                let u = f.target.querySelector("select");
                u?.blur();
              },
            },
          ],
          children: [
            Object.assign({}, i, {
              tag: "select",
              listeners: [
                {
                  type: "focus",
                  listener: (f) => {
                    var u;
                    let g = f.target,
                      h =
                        (u = g.parentElement) === null || u === void 0
                          ? void 0
                          : u.querySelector(".dropdown-content");
                    h && (h.style.display = "block"),
                      g.setAttribute("focus", "true");
                  },
                },
                {
                  type: "blur",
                  listener: (f) => {
                    var u;
                    let g = f.target,
                      h =
                        (u = g.parentElement) === null || u === void 0
                          ? void 0
                          : u.querySelector(".dropdown-content");
                    h && (h.style.display = "none"), g.removeAttribute("focus");
                  },
                },
              ],
            }),
            {
              tag: "div",
              classList: ["dropdown-content"],
              children:
                (t = i.children) === null || t === void 0
                  ? void 0
                  : t.map((f) => {
                      var u, g, h;
                      return {
                        tag: "p",
                        attributes: {
                          value:
                            (u = f.properties) === null || u === void 0
                              ? void 0
                              : u.value,
                        },
                        properties: {
                          innerHTML:
                            ((g = f.properties) === null || g === void 0
                              ? void 0
                              : g.innerHTML) ||
                            ((h = f.properties) === null || h === void 0
                              ? void 0
                              : h.innerText),
                        },
                        classList: ["dropdown-item"],
                        listeners: [
                          {
                            type: "click",
                            listener: (p) => {
                              var m;
                              let b =
                                (m = p.target.parentElement) === null ||
                                m === void 0
                                  ? void 0
                                  : m.previousElementSibling;
                              b &&
                                (b.value =
                                  p.target.getAttribute("value") || ""),
                                b?.blur();
                            },
                          },
                        ],
                      };
                    }),
            },
          ],
        };
        for (let f in i) delete i[f];
        Object.assign(i, c);
      } else if (i.tag === "a") {
        let c =
          ((r = i?.properties) === null || r === void 0 ? void 0 : r.href) ||
          "";
        ((o = i.properties) !== null && o !== void 0) || (i.properties = {}),
          (i.properties.href = "javascript:void(0);"),
          ((s = i.attributes) !== null && s !== void 0) || (i.attributes = {}),
          (i.attributes["zotero-href"] = c),
          ((a = i.listeners) !== null && a !== void 0) || (i.listeners = []),
          i.listeners.push({
            type: "click",
            listener: (f) => {
              var u;
              let g =
                (u = f.target) === null || u === void 0
                  ? void 0
                  : u.getAttribute("zotero-href");
              g && e.getGlobal("Zotero").launchURL(g);
            },
          }),
          ((n = i.classList) !== null && n !== void 0) || (i.classList = []),
          i.classList.push("zotero-text-link");
      }
      d &&
        ((l = i.children) === null ||
          l === void 0 ||
          l.forEach((c) => qt(c, e)));
    }
    var br = `
html,
body {
  font-size: calc(12px * 1);
  font-family: initial;
}
@media (prefers-color-scheme: light) {
  html,
  body {
    background-color: #ffffff;
    color: #000000;
  }
}
@media (prefers-color-scheme: dark) {
  html,
  body {
    background-color: #1e1e1e;
    color: #ffffff;
  }
}
.zotero-text-link {
  -moz-user-focus: normal;
  color: -moz-nativehyperlinktext;
  text-decoration: underline;
  border: 1px solid transparent;
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9fb;
  min-width: 160px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px 0 5px 0;
  z-index: 999;
}
.dropdown-item {
  margin: 0px;
  padding: 5px 10px 5px 10px;
}
.dropdown-item:hover {
  background-color: #efeff3;
}
`;
  });
  var Ft = v((E) => {
    "use strict";
    var yr =
      (E && E.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(E, "__esModule", { value: !0 });
    E.ReaderInstanceManager = void 0;
    var vr = y(),
      wr = yr(L()),
      lt = class extends vr.ManagerTool {
        constructor(e) {
          super(e), (this.cachedHookIds = []), this.initializeGlobal();
        }
        register(e, t, r) {
          let o = this.getGlobal("Zotero");
          switch (e) {
            case "initialized":
              (this.globalCache.initializedHooks[t] = r),
                o.Reader._readers.forEach(r);
              break;
            default:
              break;
          }
          this.cachedHookIds.push(t);
        }
        unregister(e) {
          delete this.globalCache.initializedHooks[e];
        }
        unregisterAll() {
          this.cachedHookIds.forEach((e) => this.unregister(e));
        }
        initializeGlobal() {
          if (
            ((this.globalCache = wr.default.getInstance().readerInstance),
            !this.globalCache._ready)
          ) {
            this.globalCache._ready = !0;
            let e = this.getGlobal("Zotero"),
              t = this;
            e.Reader._readers = new (this.getGlobal("Proxy"))(
              e.Reader._readers,
              {
                set(r, o, s, a) {
                  return (
                    (r[o] = s),
                    isNaN(Number(o)) ||
                      Object.values(t.globalCache.initializedHooks).forEach(
                        (n) => {
                          try {
                            n(s);
                          } catch (l) {
                            t.log(l);
                          }
                        },
                      ),
                    !0
                  );
                },
              },
            );
          }
        }
      };
    E.ReaderInstanceManager = lt;
  });
  var Kt = v((j) => {
    "use strict";
    var kr =
      (j && j.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(j, "__esModule", { value: !0 });
    j.ItemBoxManager = void 0;
    var xr = y(),
      Tr = pe(),
      _r = je(),
      Ir = kr(L()),
      ct = class extends xr.ManagerTool {
        constructor(e) {
          super(e),
            (this.initializationLock =
              this.getGlobal("Zotero").Promise.defer()),
            (this.localCache = []),
            (this.fieldHooks = new Tr.FieldHookManager()),
            (this.patcherManager = new _r.PatcherManager()),
            this.initializeGlobal();
        }
        async register(e, t, r, o = {}) {
          this.fieldHooks.register("isFieldOfBase", e, () => !1),
            r && this.fieldHooks.register("getField", e, r),
            o.editable &&
              o.setFieldHook &&
              this.fieldHooks.register("setField", e, o.setFieldHook),
            (this.globalCache.fieldOptions[e] = {
              field: e,
              displayName: t,
              editable: o.editable || !1,
              index: o.index || -1,
              multiline: o.multiline || !1,
              collapsible: o.collapsible || !1,
            }),
            this.localCache.push(e),
            await this.initializationLock.promise,
            this.refresh();
        }
        unregister(e, t = {}) {
          delete this.globalCache.fieldOptions[e],
            t.skipIsFieldOfBase ||
              this.fieldHooks.unregister("isFieldOfBase", e),
            t.skipGetField || this.fieldHooks.unregister("getField", e),
            t.skipSetField || this.fieldHooks.unregister("setField", e);
          let r = this.localCache.indexOf(e);
          r > -1 && this.localCache.splice(r, 1),
            t.skipRefresh || this.refresh();
        }
        unregisterAll() {
          [...this.localCache].forEach((e) =>
            this.unregister(e, {
              skipGetField: !0,
              skipSetField: !0,
              skipIsFieldOfBase: !0,
              skipRefresh: !0,
            }),
          ),
            this.fieldHooks.unregisterAll(),
            this.refresh();
        }
        refresh() {
          try {
            Array.from(
              this.getGlobal("document").querySelectorAll(
                this.isZotero7() ? "item-box" : "zoteroitembox",
              ),
            ).forEach((e) => e.refresh());
          } catch (e) {
            this.log(e);
          }
        }
        async initializeGlobal() {
          let e = this.getGlobal("Zotero");
          await e.uiReadyPromise;
          let t = this.getGlobal("window");
          this.globalCache = Ir.default.getInstance().itemBox;
          let r = this.globalCache,
            o = this.isZotero7();
          if (!r._ready) {
            r._ready = !0;
            let s;
            if (o) s = new (this.getGlobal("customElements").get("item-box"))();
            else {
              s = t.document.querySelector("#zotero-editpane-item-box");
              let a = 5e3,
                n = 0;
              for (; !s && n < a; )
                (s = t.document.querySelector("#zotero-editpane-item-box")),
                  await e.Promise.delay(10),
                  (n += 10);
              if (!s) {
                (r._ready = !1), this.log("ItemBox initialization failed");
                return;
              }
            }
            this.patcherManager.register(
              s.__proto__,
              "refresh",
              (a) =>
                function () {
                  let n = this;
                  a.apply(n, arguments);
                  for (let l of Object.values(r.fieldOptions)) {
                    let d = document.createElement(o ? "th" : "label");
                    d.setAttribute("fieldname", l.field);
                    let c = `extensions.zotero.pluginToolkit.fieldCollapsed.${l.field}`,
                      f = l.multiline && l.collapsible && e.Prefs.get(c, !0),
                      u = l.displayName;
                    if ((f && (u = `(...)${u}`), o)) {
                      let b = document.createElement("label");
                      (b.className = "key"),
                        (b.textContent = u),
                        d.appendChild(b);
                    } else d.setAttribute("value", u);
                    let g = n.clickable;
                    n.clickable = l.editable;
                    let h = n.createValueElement(
                      n.item.getField(l.field),
                      l.field,
                      1099,
                    );
                    (n.clickable = g),
                      l.multiline && !e.Prefs.get(c, !0)
                        ? h.classList.add("multiline")
                        : o ||
                          (h.setAttribute("crop", "end"),
                          h.setAttribute("value", h.innerHTML),
                          (h.innerHTML = "")),
                      l.collapsible &&
                        d.addEventListener("click", function (b) {
                          e.Prefs.set(c, !e.Prefs.get(c, !0), !0), n.refresh();
                        }),
                      d.addEventListener(
                        "click",
                        o
                          ? function (b) {
                              var k;
                              let x =
                                (k = b.currentTarget.nextElementSibling) ===
                                  null || k === void 0
                                  ? void 0
                                  : k.querySelector("input, textarea");
                              x && x.blur();
                            }
                          : function (b) {
                              var k;
                              let x =
                                (k = b.currentTarget.nextElementSibling) ===
                                  null || k === void 0
                                  ? void 0
                                  : k.inputField;
                              x && x.blur();
                            },
                      );
                    let p = o ? n._infoTable : n._dynamicFields,
                      m = l.index;
                    m === 0 && (m = 1),
                      m && m >= 0 && m < p.children.length
                        ? ((n._beforeRow = p.children[m]),
                          n.addDynamicRow(d, h, !0))
                        : n.addDynamicRow(d, h);
                  }
                },
            );
          }
          this.initializationLock.resolve();
        }
      };
    j.ItemBoxManager = ct;
  });
  var Gt = v((ze) => {
    "use strict";
    Object.defineProperty(ze, "__esModule", { value: !0 });
    ze.LargePrefHelper = void 0;
    var Cr = y(),
      dt = class extends Cr.BasicTool {
        constructor(e, t, r = "default") {
          super(),
            (this.keyPref = e),
            (this.valuePrefPrefix = t),
            r === "default"
              ? (this.hooks = Nt)
              : r === "parser"
                ? (this.hooks = Pr)
                : (this.hooks = Object.assign(Object.assign({}, Nt), r)),
            (this.innerObj = {});
        }
        asObject() {
          return this.constructTempObj();
        }
        asMapLike() {
          let e = {
            get: (t) => this.getValue(t),
            set: (t, r) => (this.setValue(t, r), e),
            has: (t) => this.hasKey(t),
            delete: (t) => this.deleteKey(t),
            clear: () => {
              for (let t of this.getKeys()) this.deleteKey(t);
            },
            forEach: (t) => this.constructTempMap().forEach(t),
            get size() {
              return this._this.getKeys().length;
            },
            entries: () => this.constructTempMap().values(),
            keys: () => this.getKeys()[Symbol.iterator](),
            values: () => this.constructTempMap().values(),
            [Symbol.iterator]: () => this.constructTempMap()[Symbol.iterator](),
            [Symbol.toStringTag]: "MapLike",
            _this: this,
          };
          return e;
        }
        getKeys() {
          let e = Zotero.Prefs.get(this.keyPref, !0),
            t = e ? JSON.parse(e) : [];
          for (let r of t) {
            let o = "placeholder";
            this.innerObj[r] = o;
          }
          return t;
        }
        setKeys(e) {
          (e = [...new Set(e.filter((t) => t))]),
            Zotero.Prefs.set(this.keyPref, JSON.stringify(e), !0);
          for (let t of e) {
            let r = "placeholder";
            this.innerObj[t] = r;
          }
        }
        getValue(e) {
          let t = Zotero.Prefs.get(`${this.valuePrefPrefix}${e}`, !0);
          if (typeof t > "u") return;
          let { value: r } = this.hooks.afterGetValue({ value: t });
          return (this.innerObj[e] = r), r;
        }
        setValue(e, t) {
          let { key: r, value: o } = this.hooks.beforeSetValue({
            key: e,
            value: t,
          });
          this.setKey(r),
            Zotero.Prefs.set(`${this.valuePrefPrefix}${r}`, o, !0),
            (this.innerObj[r] = o);
        }
        hasKey(e) {
          return this.getKeys().includes(e);
        }
        setKey(e) {
          let t = this.getKeys();
          t.includes(e) || (t.push(e), this.setKeys(t));
        }
        deleteKey(e) {
          let t = this.getKeys(),
            r = t.indexOf(e);
          return (
            r > -1 &&
              (t.splice(r, 1), delete this.innerObj[e], this.setKeys(t)),
            Zotero.Prefs.clear(`${this.valuePrefPrefix}${e}`, !0),
            !0
          );
        }
        constructTempObj() {
          return new Proxy(this.innerObj, {
            get: (e, t, r) => (
              this.getKeys(),
              typeof t == "string" && t in e && this.getValue(t),
              Reflect.get(e, t, r)
            ),
            set: (e, t, r, o) =>
              typeof t == "string"
                ? r === void 0
                  ? (this.deleteKey(t), !0)
                  : (this.setValue(t, r), !0)
                : Reflect.set(e, t, r, o),
            has: (e, t) => (this.getKeys(), Reflect.has(e, t)),
            deleteProperty: (e, t) =>
              typeof t == "string"
                ? (this.deleteKey(t), !0)
                : Reflect.deleteProperty(e, t),
          });
        }
        constructTempMap() {
          let e = new Map();
          for (let t of this.getKeys()) e.set(t, this.getValue(t));
          return e;
        }
      };
    ze.LargePrefHelper = dt;
    var Nt = {
        afterGetValue: ({ value: i }) => ({ value: i }),
        beforeSetValue: ({ key: i, value: e }) => ({ key: i, value: e }),
      },
      Pr = {
        afterGetValue: ({ value: i }) => {
          try {
            i = JSON.parse(i);
          } catch {
            return { value: i };
          }
          return { value: i };
        },
        beforeSetValue: ({ key: i, value: e }) => (
          (e = JSON.stringify(e)), { key: i, value: e }
        ),
      };
  });
  var Ht = v((O) => {
    "use strict";
    Object.defineProperty(O, "__esModule", { value: !0 });
    O.KeyModifier = O.KeyboardManager = void 0;
    var zr = y(),
      Lr = Ke(),
      ut = class extends zr.ManagerTool {
        constructor(e) {
          super(e),
            (this._keyboardCallbacks = new Set()),
            (this.initKeyboardListener = this._initKeyboardListener.bind(this)),
            (this.unInitKeyboardListener =
              this._unInitKeyboardListener.bind(this)),
            (this.triggerKeydown = (t) => {
              this._cachedKey
                ? this._cachedKey.merge(new D(t), { allowOverwrite: !1 })
                : (this._cachedKey = new D(t)),
                this.dispatchCallback(t, { type: "keydown" });
            }),
            (this.triggerKeyup = async (t) => {
              if (!this._cachedKey) return;
              let r = new D(this._cachedKey);
              (this._cachedKey = void 0),
                this.dispatchCallback(t, { keyboard: r, type: "keyup" });
            }),
            (this.id = Zotero.Utilities.randomString()),
            this._ensureAutoUnregisterAll(),
            this.addListenerCallback(
              "onMainWindowLoad",
              this.initKeyboardListener,
            ),
            this.addListenerCallback(
              "onMainWindowUnload",
              this.unInitKeyboardListener,
            ),
            this.initReaderKeyboardListener();
          for (let t of Zotero.getMainWindows()) this.initKeyboardListener(t);
        }
        register(e) {
          this._keyboardCallbacks.add(e);
        }
        unregister(e) {
          this._keyboardCallbacks.delete(e);
        }
        unregisterAll() {
          this._keyboardCallbacks.clear(),
            this.removeListenerCallback(
              "onMainWindowLoad",
              this.initKeyboardListener,
            ),
            this.removeListenerCallback(
              "onMainWindowUnload",
              this.unInitKeyboardListener,
            );
          for (let e of Zotero.getMainWindows()) this.unInitKeyboardListener(e);
        }
        initReaderKeyboardListener() {
          Zotero.Reader.registerEventListener(
            "renderToolbar",
            (e) => this.addReaderKeyboardCallback(e),
            this._basicOptions.api.pluginID,
          ),
            Zotero.Reader._readers.forEach((e) =>
              this.addReaderKeyboardCallback({ reader: e }),
            );
        }
        addReaderKeyboardCallback(e) {
          let t = e.reader,
            r = `_ztoolkitKeyboard${this.id}Initialized`;
          t._iframeWindow[r] ||
            (this._initKeyboardListener(t._iframeWindow),
            (0, Lr.waitUntil)(
              () => {
                var o, s;
                return (
                  !Components.utils.isDeadWrapper(t._internalReader) &&
                  ((s =
                    (o = t._internalReader) === null || o === void 0
                      ? void 0
                      : o._primaryView) === null || s === void 0
                    ? void 0
                    : s._iframeWindow)
                );
              },
              () => {
                var o;
                return this._initKeyboardListener(
                  (o = t._internalReader._primaryView) === null || o === void 0
                    ? void 0
                    : o._iframeWindow,
                );
              },
            ),
            (t._iframeWindow[r] = !0));
        }
        _initKeyboardListener(e) {
          e &&
            (e.addEventListener("keydown", this.triggerKeydown),
            e.addEventListener("keyup", this.triggerKeyup));
        }
        _unInitKeyboardListener(e) {
          e &&
            (e.removeEventListener("keydown", this.triggerKeydown),
            e.removeEventListener("keyup", this.triggerKeyup));
        }
        dispatchCallback(...e) {
          this._keyboardCallbacks.forEach((t) => t(...e));
        }
      };
    O.KeyboardManager = ut;
    var D = class i {
      constructor(e, t) {
        (this.accel = !1),
          (this.shift = !1),
          (this.control = !1),
          (this.meta = !1),
          (this.alt = !1),
          (this.key = ""),
          (this.useAccel = !1),
          (this.useAccel = t?.useAccel || !1),
          !(typeof e > "u") &&
            (typeof e == "string"
              ? ((e = e || ""),
                (e = this.unLocalized(e)),
                (this.accel = e.includes("accel")),
                (this.shift = e.includes("shift")),
                (this.control = e.includes("control")),
                (this.meta = e.includes("meta")),
                (this.alt = e.includes("alt")),
                (this.key = e
                  .replace(/(accel|shift|control|meta|alt| |,|-)/g, "")
                  .toLocaleLowerCase()))
              : e instanceof i
                ? this.merge(e, { allowOverwrite: !0 })
                : (t?.useAccel &&
                    (Zotero.isMac
                      ? (this.accel = e.metaKey)
                      : (this.accel = e.ctrlKey)),
                  (this.shift = e.shiftKey),
                  (this.control = e.ctrlKey),
                  (this.meta = e.metaKey),
                  (this.alt = e.altKey),
                  ["Shift", "Meta", "Ctrl", "Alt", "Control"].includes(e.key) ||
                    (this.key = e.key)));
      }
      merge(e, t) {
        let r = t?.allowOverwrite || !1;
        return (
          this.mergeAttribute("accel", e.accel, r),
          this.mergeAttribute("shift", e.shift, r),
          this.mergeAttribute("control", e.control, r),
          this.mergeAttribute("meta", e.meta, r),
          this.mergeAttribute("alt", e.alt, r),
          this.mergeAttribute("key", e.key, r),
          this
        );
      }
      equals(e) {
        if (
          (typeof e == "string" && (e = new i(e)),
          this.shift !== e.shift ||
            this.alt !== e.alt ||
            this.key.toLowerCase() !== e.key.toLowerCase())
        )
          return !1;
        if (this.accel || e.accel) {
          if (Zotero.isMac) {
            if (
              (this.accel || this.meta) !== (e.accel || e.meta) ||
              this.control !== e.control
            )
              return !1;
          } else if (
            (this.accel || this.control) !== (e.accel || e.control) ||
            this.meta !== e.meta
          )
            return !1;
        } else if (this.control !== e.control || this.meta !== e.meta)
          return !1;
        return !0;
      }
      getRaw() {
        let e = [];
        return (
          this.accel && e.push("accel"),
          this.shift && e.push("shift"),
          this.control && e.push("control"),
          this.meta && e.push("meta"),
          this.alt && e.push("alt"),
          this.key && e.push(this.key),
          e.join(",")
        );
      }
      getLocalized() {
        let e = this.getRaw();
        return Zotero.isMac
          ? e
              .replaceAll("control", "\u2303")
              .replaceAll("alt", "\u2325")
              .replaceAll("shift", "\u21E7")
              .replaceAll("meta", "\u2318")
          : e
              .replaceAll("control", "Ctrl")
              .replaceAll("alt", "Alt")
              .replaceAll("shift", "Shift")
              .replaceAll("meta", "Win");
      }
      unLocalized(e) {
        return Zotero.isMac
          ? e
              .replaceAll("\u2303", "control")
              .replaceAll("\u2325", "alt")
              .replaceAll("\u21E7", "shift")
              .replaceAll("\u2318", "meta")
          : e
              .replaceAll("Ctrl", "control")
              .replaceAll("Alt", "alt")
              .replaceAll("Shift", "shift")
              .replaceAll("Win", "meta");
      }
      mergeAttribute(e, t, r) {
        (r || !this[e]) && (this[e] = t);
      }
    };
    O.KeyModifier = D;
  });
  var Bt = v((oe) => {
    "use strict";
    Object.defineProperty(oe, "__esModule", { value: !0 });
    oe.ZoteroToolkit = void 0;
    var z = y(),
      Rr = P(),
      Zr = Ge(),
      Sr = xt(),
      Vr = Tt(),
      qr = _t(),
      Ar = It(),
      Fr = Ct(),
      Kr = Pt(),
      Nr = et(),
      Gr = Lt(),
      Hr = Rt(),
      Br = Zt(),
      Mr = St(),
      Wr = Vt(),
      $r = At(),
      Er = Ft(),
      jr = pe(),
      Dr = Kt(),
      Or = Gt(),
      Jr = Ht(),
      Ur = Me(),
      Le = class extends z.BasicTool {
        constructor() {
          super(),
            (this.UI = new Rr.UITool(this)),
            (this.Reader = new Zr.ReaderTool(this)),
            (this.ExtraField = new Sr.ExtraFieldTool(this)),
            (this.FieldHooks = new jr.FieldHookManager(this)),
            (this.ItemTree = new Vr.ItemTreeManager(this)),
            (this.ItemBox = new Dr.ItemBoxManager(this)),
            (this.Keyboard = new Jr.KeyboardManager(this)),
            (this.Prompt = new qr.PromptManager(this)),
            (this.LibraryTabPanel = new Ar.LibraryTabPanelManager(this)),
            (this.ReaderTabPanel = new Fr.ReaderTabPanelManager(this)),
            (this.ReaderInstance = new Er.ReaderInstanceManager(this)),
            (this.Menu = new Kr.MenuManager(this)),
            (this.PreferencePane = new Nr.PreferencePaneManager(this)),
            (this.Shortcut = new Gr.ShortcutManager(this)),
            (this.Clipboard = (0, z.makeHelperTool)(Hr.ClipboardHelper, this)),
            (this.FilePicker = (0, z.makeHelperTool)(
              Br.FilePickerHelper,
              this,
            )),
            (this.Patch = (0, z.makeHelperTool)(Ur.PatchHelper, this)),
            (this.ProgressWindow = (0, z.makeHelperTool)(
              Mr.ProgressWindowHelper,
              this,
            )),
            (this.VirtualizedTable = (0, z.makeHelperTool)(
              Wr.VirtualizedTableHelper,
              this,
            )),
            (this.Dialog = (0, z.makeHelperTool)($r.DialogHelper, this)),
            (this.LargePrefObject = (0, z.makeHelperTool)(
              Or.LargePrefHelper,
              this,
            ));
        }
        unregisterAll() {
          (0, z.unregister)(this);
        }
      };
    oe.ZoteroToolkit = Le;
    oe.default = Le;
  });
  var Dt = U(y());
  var w = {
    addonName: "Zotero Review",
    addonID: "zoteroreview@alima-webdev.com",
    addonRef: "zoteroreview",
    addonInstance: "ZoteroReview",
    prefsPrefix: "extensions.zoteroreview",
    releasePage: "https://github.com/alima-webdev/zotero-review/releases",
    updateJSON:
      "https://raw.githubusercontent.com/alima-webdev/zotero-review/main/update.json",
  };
  function vt() {
    let i = new (
      typeof Localization > "u"
        ? ztoolkit.getGlobal("Localization")
        : Localization
    )([`${w.addonRef}-addon.ftl`], !0);
    addon.data.locale = { current: i };
  }
  function C(...i) {
    if (i.length === 1) return Ae(i[0]);
    if (i.length === 2)
      return typeof i[1] == "string"
        ? Ae(i[0], { branch: i[1] })
        : Ae(i[0], i[1]);
    throw new Error("Invalid arguments");
  }
  function Ae(i, e = {}) {
    let t = `${w.addonRef}-${i}`,
      { branch: r, args: o } = e,
      s = addon.data.locale?.current.formatMessagesSync([
        { id: t, args: o },
      ])[0];
    return s ? (r && s.attributes ? s.attributes[r] || t : s.value || t) : t;
  }
  var { Services: ui } = ChromeUtils.import(
    "resource://gre/modules/Services.jsm",
  );
  function wt(i, e, t) {
    let r = t.value;
    return (
      (t.value = function (...o) {
        try {
          return (
            ztoolkit.log(`Calling module ${i.name}.${String(e)}`),
            r.apply(this, o)
          );
        } catch (s) {
          throw (ztoolkit.log(`Error in module ${i.name}.${String(e)}`, s), s);
        }
      }),
      t
    );
  }
  var te = "!review:include",
    G = "!review:exclude",
    ie = "!review:pending",
    re = "!review:unsure",
    de = "!review:not-reviewed",
    ee = "!review:exclude:",
    hi = [te, G, ie, re, de];
  function fi(i) {
    let e = "";
    return (
      i.hasTag(te)
        ? (e = te)
        : i.hasTag(G)
          ? (e = G)
          : i.hasTag(ie)
            ? (e = ie)
            : i.hasTag(re)
              ? (e = re)
              : (e = de),
      e
    );
  }
  function mi(i) {
    let e = "";
    return (
      i == te
        ? (e = "Include")
        : i == G
          ? (e = "Exclude")
          : i == ie
            ? (e = "Pending")
            : i == re
              ? (e = "Unsure")
              : i == de && (e = "Not Reviewed"),
      e
    );
  }
  var gi = "123",
    pi = "Review Status",
    bi = (i, e, t, r) => {
      let o = fi(r);
      return String(o);
    };
  function yi(i, e, t) {
    let r = document.createElement("span");
    r.className = `cell ${t.className} review-container`;
    let o = document.createElement("div");
    return (
      o.classList.add("review"),
      o.classList.add(e.split(":")[1]),
      (o.textContent = mi(e)),
      r.appendChild(o),
      r
    );
  }
  var vi = { renderCell: yi },
    wi = "456",
    ki = "Reason for Exclusion",
    xi = (i, e, t, r) => {
      let o = r.getTags();
      ztoolkit.log("getColumnReasonFieldHook");
      for (let s of o)
        if ((ztoolkit.log(s), s.tag.includes(ee)))
          return ztoolkit.log("REASON FOR EXCLUSION"), s.tag.replace(ee, "");
      return ztoolkit.log("End: getColumnReasonFieldHook"), "";
    },
    Ti = {};
  var V = class {
    static registerStyleSheet() {
      let e = ztoolkit.UI.createElement(document, "link", {
        properties: {
          type: "text/css",
          rel: "stylesheet",
          href: `chrome://${w.addonRef}/content/zoteroPane.css`,
        },
      });
      document.documentElement.appendChild(e);
    }
    static registerExtraColumnWithBindings() {
      ztoolkit.ItemTree.register(gi, pi, bi, vi),
        ztoolkit.ItemTree.register(wi, ki, xi, Ti),
        ztoolkit.Menu.register("item", { tag: "menuseparator" }),
        ztoolkit.Menu.register("item", {
          tag: "menu",
          label: C("contextmenu-status"),
          children: [
            {
              tag: "menuitem",
              label: C("contextmenu-status-include"),
              icon: "chrome://zoteroreview/content/icons/include.svg",
              oncommand: `document.setReviewStatus('${te}')`,
            },
            {
              tag: "menuitem",
              label: C("contextmenu-status-exclude"),
              icon: "chrome://zoteroreview/content/icons/exclude.svg",
              oncommand: `document.setReviewStatus('${G}');`,
            },
            {
              tag: "menuitem",
              label: C("contextmenu-status-pending"),
              icon: "chrome://zoteroreview/content/icons/pending.svg",
              oncommand: `document.setReviewStatus('${ie}')`,
            },
            {
              tag: "menuitem",
              label: C("contextmenu-status-unsure"),
              icon: "chrome://zoteroreview/content/icons/unsure.svg",
              oncommand: `document.setReviewStatus('${re}')`,
            },
            {
              tag: "menuitem",
              label: C("contextmenu-status-notreviewed"),
              icon: "chrome://zoteroreview/content/icons/notreviewed.svg",
              oncommand: `document.setReviewStatus('${de}')`,
            },
          ],
        }),
        (ztoolkit.getGlobal("document").setReviewStatus = (e) => {
          ztoolkit.log("setReviewStatus");
          let t = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();
          for (let r of t) {
            for (let o of hi) r.removeTag(o);
            r.getTags().map((o) => {
              o.tag.includes(ee) && r.removeTag(o.tag);
            }),
              r.addTag(e),
              r.saveTx();
          }
          e == G && document.setExclusionReason(),
            ztoolkit.getGlobal("ZoteroPane").refreshFeed();
        }),
        (ztoolkit.getGlobal("document").setExclusionReason = () => {
          ztoolkit.log("setExclusionReason");
          let e = ztoolkit.getGlobal("ZoteroPane").getSelectedItems(),
            t = { value: "" },
            r = { value: null };
          if (
            ui.prompt.prompt(
              window,
              C("review-exclusiondialog-title"),
              C("review-exclusiondialog-text"),
              r,
              "",
              t,
            )
          )
            for (let s of e)
              s.getTags().map((a) => {
                a.tag.includes(ee) && s.removeTag(a.tag);
              }),
                s.addTag(ee + r.value),
                s.saveTx();
        });
    }
  };
  Se([wt], V, "registerStyleSheet", 1),
    Se([wt], V, "registerExtraColumnWithBindings", 1);
  async function kt(i) {
    addon.data.prefs
      ? (addon.data.prefs.window = i)
      : (addon.data.prefs = {
          window: i,
          columns: [
            {
              dataKey: "title",
              label: C("prefs-table-title"),
              fixedWidth: !0,
              width: 100,
            },
            { dataKey: "detail", label: C("prefs-table-detail") },
          ],
          rows: [
            { title: "Orange", detail: "It's juicy" },
            { title: "Banana", detail: "It's sweet" },
            { title: "Apple", detail: "I mean the fruit APPLE" },
          ],
        }),
      _i(),
      Ii();
  }
  async function _i() {
    let i = ztoolkit.getGlobal("Zotero").Promise.defer();
    if (addon.data.prefs?.window == null) return;
    let e = new ztoolkit.VirtualizedTable(addon.data.prefs?.window)
      .setContainerId(`${w.addonRef}-table-container`)
      .setProp({
        id: `${w.addonRef}-prefs-table`,
        columns: addon.data.prefs?.columns,
        showHeader: !0,
        multiSelect: !0,
        staticColumns: !0,
        disableFontSizeScaling: !0,
      })
      .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
      .setProp(
        "getRowData",
        (t) =>
          addon.data.prefs?.rows[t] || { title: "no data", detail: "no data" },
      )
      .setProp("onSelectionChange", (t) => {
        new ztoolkit.ProgressWindow(w.addonName)
          .createLine({
            text: `Selected line: ${addon.data.prefs?.rows
              .filter((r, o) => t.isSelected(o))
              .map((r) => r.title)
              .join(",")}`,
            progress: 100,
          })
          .show();
      })
      .setProp("onKeyDown", (t) =>
        t.key == "Delete" || (Zotero.isMac && t.key == "Backspace")
          ? ((addon.data.prefs.rows =
              addon.data.prefs?.rows.filter(
                (r, o) => !e.treeInstance.selection.isSelected(o),
              ) || []),
            e.render(),
            !1)
          : !0,
      )
      .setProp("getRowString", (t) => addon.data.prefs?.rows[t].title || "")
      .render(-1, () => {
        i.resolve();
      });
    await i.promise, ztoolkit.log("Preference table rendered!");
  }
  function Ii() {
    addon.data.prefs.window.document
      .querySelector(`#zotero-prefpane-${w.addonRef}-enable`)
      ?.addEventListener("command", (i) => {
        ztoolkit.log(i),
          addon.data.prefs.window.alert(
            `Successfully changed to ${i.target.checked}!`,
          );
      }),
      addon.data.prefs.window.document
        .querySelector(`#zotero-prefpane-${w.addonRef}-input`)
        ?.addEventListener("change", (i) => {
          ztoolkit.log(i),
            addon.data.prefs.window.alert(
              `Successfully changed to ${i.target.value}!`,
            );
        });
  }
  var Mt = U(Bt());
  var Wt = U(y()),
    Xr = U(P()),
    Yr = U(et());
  function Re() {
    let i = new Mt.default();
    return Qr(i), i;
  }
  function Qr(i) {
    let e = "production";
    (i.basicOptions.log.prefix = `[${w.addonName}]`),
      (i.basicOptions.log.disableConsole = e === "production"),
      (i.UI.basicOptions.ui.enableElementJSONLog = !1),
      (i.UI.basicOptions.ui.enableElementDOMLog = !1),
      (i.basicOptions.debug.disableDebugBridgePassword = !1),
      (i.basicOptions.api.pluginID = w.addonID),
      i.ProgressWindow.setIconURI(
        "default",
        `chrome://${w.addonRef}/content/icons/favicon.png`,
      );
  }
  async function eo() {
    await Promise.all([
      Zotero.initializationPromise,
      Zotero.unlockPromise,
      Zotero.uiReadyPromise,
    ]),
      vt(),
      V.registerExtraColumnWithBindings(),
      await $t(window);
  }
  async function $t(i) {
    (addon.data.ztoolkit = Re()),
      V.registerStyleSheet(),
      await Zotero.Promise.delay(1e3);
  }
  async function to(i) {
    ztoolkit.unregisterAll(), addon.data.dialog?.window?.close();
  }
  function io() {
    ztoolkit.unregisterAll(),
      addon.data.dialog?.window?.close(),
      (addon.data.alive = !1),
      delete Zotero[w.addonInstance];
  }
  async function ro(i, e, t, r) {
    ztoolkit.log("notify", i, e, t, r),
      i == "select" && e == "tab" && r[t[0]].type == "reader";
  }
  async function oo(i, e) {
    switch (i) {
      case "load":
        kt(e.window);
        break;
      default:
        return;
    }
  }
  function so(i) {
    switch (i) {
      case "larger":
        break;
      case "smaller":
        break;
      default:
        break;
    }
  }
  function no(i) {}
  var Et = {
    onStartup: eo,
    onShutdown: io,
    onMainWindowLoad: $t,
    onMainWindowUnload: to,
    onNotify: ro,
    onPrefsEvent: oo,
    onShortcuts: so,
    onDialogEvents: no,
  };
  var ht = class {
      constructor() {
        (this.data = { alive: !0, env: "production", ztoolkit: Re() }),
          (this.hooks = Et),
          (this.api = {});
      }
    },
    jt = ht;
  var Ot = new Dt.BasicTool();
  Ot.getGlobal("Zotero")[w.addonInstance] ||
    (se("window"),
    se("document"),
    se("ZoteroPane"),
    se("Zotero_Tabs"),
    (_globalThis.addon = new jt()),
    se("ztoolkit", () => _globalThis.addon.data.ztoolkit),
    (Zotero[w.addonInstance] = addon));
  function se(i, e) {
    Object.defineProperty(_globalThis, i, {
      get() {
        return e ? e() : Ot.getGlobal(i);
      },
    });
  }
})();
