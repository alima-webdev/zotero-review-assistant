"use strict";
(() => {
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __commonJS = (cb, mod) =>
        function __require() {
            return (
                mod ||
                    (0, cb[__getOwnPropNames(cb)[0]])(
                        (mod = { exports: {} }).exports,
                        mod,
                    ),
                mod.exports
            );
        };
    var __copyProps = (to, from, except, desc) => {
        if ((from && typeof from === "object") || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, {
                        get: () => from[key],
                        enumerable:
                            !(desc = __getOwnPropDesc(from, key)) ||
                            desc.enumerable,
                    });
        }
        return to;
    };
    var __toESM = (mod, isNodeMode, target) => (
        (target = mod != null ? __create(__getProtoOf(mod)) : {}),
        __copyProps(
            // If the importer is in node compatibility mode or this is not an ESM
            // file that has been converted to a CommonJS file using a Babel-
            // compatible transform (i.e. "__esModule" has not been set), then set
            // "default" to the CommonJS "module.exports" for node compatibility.
            isNodeMode || !mod || !mod.__esModule
                ? __defProp(target, "default", { value: mod, enumerable: true })
                : target,
            mod,
        )
    );
    var __decorateClass = (decorators, target, key, kind) => {
        var result =
            kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
        for (var i = decorators.length - 1, decorator; i >= 0; i--)
            if ((decorator = decorators[i]))
                result =
                    (kind
                        ? decorator(target, key, result)
                        : decorator(result)) || result;
        if (kind && result) __defProp(target, key, result);
        return result;
    };

    // node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js
    var require_debugBridge = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js"(
            exports,
        ) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.DebugBridge = void 0;
            var basic_1 = require_basic();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var DebugBridge = class _DebugBridge {
                get version() {
                    return _DebugBridge.version;
                }
                get disableDebugBridgePassword() {
                    return this._disableDebugBridgePassword;
                }
                set disableDebugBridgePassword(value) {
                    this._disableDebugBridgePassword = value;
                }
                get password() {
                    return basic_1.BasicTool.getZotero().Prefs.get(
                        _DebugBridge.passwordPref,
                        true,
                    );
                }
                set password(v) {
                    basic_1.BasicTool.getZotero().Prefs.set(
                        _DebugBridge.passwordPref,
                        v,
                        true,
                    );
                }
                constructor() {
                    this._disableDebugBridgePassword = false;
                    this.initializeDebugBridge();
                }
                static setModule(instance) {
                    var _a;
                    if (
                        !((_a = instance.debugBridge) === null || _a === void 0
                            ? void 0
                            : _a.version) ||
                        instance.debugBridge.version < _DebugBridge.version
                    ) {
                        instance.debugBridge = new _DebugBridge();
                    }
                }
                initializeDebugBridge() {
                    const debugBridgeExtension = {
                        noContent: true,
                        doAction: async (uri) => {
                            var _a;
                            const Zotero2 = basic_1.BasicTool.getZotero();
                            const window2 = Zotero2.getMainWindow();
                            const uriString = uri.spec.split("//").pop();
                            if (!uriString) {
                                return;
                            }
                            const params = {};
                            (_a = uriString.split("?").pop()) === null ||
                            _a === void 0
                                ? void 0
                                : _a.split("&").forEach((p) => {
                                      params[p.split("=")[0]] =
                                          decodeURIComponent(p.split("=")[1]);
                                  });
                            const skipPasswordCheck =
                                toolkitGlobal_1.default.getInstance()
                                    .debugBridge.disableDebugBridgePassword;
                            let allowed = false;
                            if (skipPasswordCheck) {
                                allowed = true;
                            } else {
                                if (
                                    typeof params.password === "undefined" &&
                                    typeof this.password === "undefined"
                                ) {
                                    allowed =
                                        window2.confirm(`External App ${params.app} wants to execute command without password.
Command:
${(params.run || params.file || "").slice(0, 100)}
If you do not know what it is, please click Cancel to deny.`);
                                } else {
                                    allowed = this.password === params.password;
                                }
                            }
                            if (allowed) {
                                if (params.run) {
                                    try {
                                        const AsyncFunction =
                                            Object.getPrototypeOf(
                                                async function () {},
                                            ).constructor;
                                        const f = new AsyncFunction(
                                            "Zotero,window",
                                            params.run,
                                        );
                                        await f(Zotero2, window2);
                                    } catch (e) {
                                        Zotero2.debug(e);
                                        window2.console.log(e);
                                    }
                                }
                                if (params.file) {
                                    try {
                                        Services.scriptloader.loadSubScript(
                                            params.file,
                                            {
                                                Zotero: Zotero2,
                                                window: window2,
                                            },
                                        );
                                    } catch (e) {
                                        Zotero2.debug(e);
                                        window2.console.log(e);
                                    }
                                }
                            }
                        },
                        newChannel: function (uri) {
                            this.doAction(uri);
                        },
                    };
                    Services.io.getProtocolHandler(
                        "zotero",
                    ).wrappedJSObject._extensions["zotero://ztoolkit-debug"] =
                        debugBridgeExtension;
                }
            };
            exports.DebugBridge = DebugBridge;
            DebugBridge.version = 2;
            DebugBridge.passwordPref =
                "extensions.zotero.debug-bridge.password";
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/utils/pluginBridge.js
    var require_pluginBridge = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/utils/pluginBridge.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.PluginBridge = void 0;
            var basic_1 = require_basic();
            var PluginBridge = class _PluginBridge {
                get version() {
                    return _PluginBridge.version;
                }
                constructor() {
                    this.initializePluginBridge();
                }
                static setModule(instance) {
                    var _a;
                    if (
                        !((_a = instance.pluginBridge) === null || _a === void 0
                            ? void 0
                            : _a.version) ||
                        instance.pluginBridge.version < _PluginBridge.version
                    ) {
                        instance.pluginBridge = new _PluginBridge();
                    }
                }
                initializePluginBridge() {
                    const { AddonManager } = ChromeUtils.import(
                        "resource://gre/modules/AddonManager.jsm",
                    );
                    const Zotero2 = basic_1.BasicTool.getZotero();
                    const pluginBridgeExtension = {
                        noContent: true,
                        doAction: async (uri) => {
                            var _a;
                            try {
                                const uriString = uri.spec.split("//").pop();
                                if (!uriString) {
                                    return;
                                }
                                const params = {};
                                (_a = uriString.split("?").pop()) === null ||
                                _a === void 0
                                    ? void 0
                                    : _a.split("&").forEach((p) => {
                                          params[p.split("=")[0]] =
                                              decodeURIComponent(
                                                  p.split("=")[1],
                                              );
                                      });
                                if (params.action === "install" && params.url) {
                                    if (
                                        (params.minVersion &&
                                            Services.vc.compare(
                                                Zotero2.version,
                                                params.minVersion,
                                            ) < 0) ||
                                        (params.maxVersion &&
                                            Services.vc.compare(
                                                Zotero2.version,
                                                params.maxVersion,
                                            ) > 0)
                                    ) {
                                        throw new Error(
                                            `Plugin is not compatible with Zotero version ${Zotero2.version}.The plugin requires Zotero version between ${params.minVersion} and ${params.maxVersion}.`,
                                        );
                                    }
                                    const addon2 =
                                        await AddonManager.getInstallForURL(
                                            params.url,
                                        );
                                    if (
                                        addon2 &&
                                        addon2.state ===
                                            AddonManager.STATE_AVAILABLE
                                    ) {
                                        addon2.install();
                                        hint(
                                            "Plugin installed successfully.",
                                            true,
                                        );
                                    } else {
                                        throw new Error(
                                            `Plugin ${params.url} is not available.`,
                                        );
                                    }
                                }
                            } catch (e) {
                                Zotero2.logError(e);
                                hint(e.message, false);
                            }
                        },
                        newChannel: function (uri) {
                            this.doAction(uri);
                        },
                    };
                    Services.io.getProtocolHandler(
                        "zotero",
                    ).wrappedJSObject._extensions["zotero://plugin"] =
                        pluginBridgeExtension;
                }
            };
            exports.PluginBridge = PluginBridge;
            PluginBridge.version = 1;
            function hint(content, success) {
                const progressWindow = new Zotero.ProgressWindow({
                    closeOnClick: true,
                });
                progressWindow.changeHeadline("Plugin Toolkit");
                progressWindow.progress = new progressWindow.ItemProgress(
                    success
                        ? "chrome://zotero/skin/tick.png"
                        : "chrome://zotero/skin/cross.png",
                    content,
                );
                progressWindow.progress.setProgress(100);
                progressWindow.show();
                progressWindow.startCloseTimer(5e3);
            }
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js
    var require_toolkitGlobal = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ToolkitGlobal = void 0;
            var basic_1 = require_basic();
            var debugBridge_1 = require_debugBridge();
            var pluginBridge_1 = require_pluginBridge();
            var ToolkitGlobal = class _ToolkitGlobal {
                constructor() {
                    initializeModules(this);
                    this.currentWindow =
                        basic_1.BasicTool.getZotero().getMainWindow();
                }
                /**
                 * Get the global unique instance of `class ToolkitGlobal`.
                 * @returns An instance of `ToolkitGlobal`.
                 */
                static getInstance() {
                    const Zotero2 = basic_1.BasicTool.getZotero();
                    let requireInit = false;
                    if (!("_toolkitGlobal" in Zotero2)) {
                        Zotero2._toolkitGlobal = new _ToolkitGlobal();
                        requireInit = true;
                    }
                    const currentGlobal = Zotero2._toolkitGlobal;
                    if (
                        currentGlobal.currentWindow !== Zotero2.getMainWindow()
                    ) {
                        checkWindowDependentModules(currentGlobal);
                        requireInit = true;
                    }
                    if (requireInit) {
                        initializeModules(currentGlobal);
                    }
                    return currentGlobal;
                }
            };
            exports.ToolkitGlobal = ToolkitGlobal;
            function initializeModules(instance) {
                setModule(instance, "fieldHooks", {
                    _ready: false,
                    getFieldHooks: {},
                    setFieldHooks: {},
                    isFieldOfBaseHooks: {},
                });
                setModule(instance, "itemTree", {
                    _ready: false,
                    columns: [],
                    renderCellHooks: {},
                });
                setModule(instance, "itemBox", {
                    _ready: false,
                    fieldOptions: {},
                });
                setModule(instance, "shortcut", {
                    _ready: false,
                    eventKeys: [],
                });
                setModule(instance, "prompt", {
                    _ready: false,
                    instance: void 0,
                });
                setModule(instance, "readerInstance", {
                    _ready: false,
                    initializedHooks: {},
                });
                debugBridge_1.DebugBridge.setModule(instance);
                pluginBridge_1.PluginBridge.setModule(instance);
            }
            function setModule(instance, key, module3) {
                var _a;
                var _b;
                if (!module3) {
                    return;
                }
                if (!instance[key]) {
                    instance[key] = module3;
                }
                for (const moduleKey in module3) {
                    (_a = (_b = instance[key])[moduleKey]) !== null &&
                    _a !== void 0
                        ? _a
                        : (_b[moduleKey] = module3[moduleKey]);
                }
            }
            function checkWindowDependentModules(instance) {
                instance.currentWindow =
                    basic_1.BasicTool.getZotero().getMainWindow();
                instance.itemTree = void 0;
                instance.itemBox = void 0;
                instance.shortcut = void 0;
                instance.prompt = void 0;
                instance.readerInstance = void 0;
            }
            exports.default = ToolkitGlobal;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/basic.js
    var require_basic = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/basic.js"(exports) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.makeHelperTool =
                exports.unregister =
                exports.ManagerTool =
                exports.BasicTool =
                    void 0;
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var BasicTool3 = class _BasicTool {
                get basicOptions() {
                    return this._basicOptions;
                }
                /**
                 *
                 * @param basicTool Pass an BasicTool instance to copy its options.
                 */
                constructor(data) {
                    this.patchSign = "zotero-plugin-toolkit@2.0.0";
                    this._basicOptions = {
                        log: {
                            _type: "toolkitlog",
                            disableConsole: false,
                            disableZLog: false,
                            prefix: "",
                        },
                        debug: toolkitGlobal_1.default.getInstance()
                            .debugBridge,
                        api: {
                            pluginID: "zotero-plugin-toolkit@windingwind.com",
                        },
                        listeners: {
                            callbacks: {
                                onMainWindowLoad: /* @__PURE__ */ new Set(),
                                onMainWindowUnload: /* @__PURE__ */ new Set(),
                                onPluginUnload: /* @__PURE__ */ new Set(),
                            },
                            _mainWindow: void 0,
                            _plugin: void 0,
                        },
                    };
                    this.updateOptions(data);
                    return;
                }
                getGlobal(k) {
                    const _Zotero =
                        typeof Zotero !== "undefined"
                            ? Zotero
                            : Components.classes[
                                  "@zotero.org/Zotero;1"
                              ].getService(Components.interfaces.nsISupports)
                                  .wrappedJSObject;
                    try {
                        const window2 = _Zotero.getMainWindow();
                        switch (k) {
                            case "Zotero":
                            case "zotero":
                                return _Zotero;
                            case "window":
                                return window2;
                            case "windows":
                                return _Zotero.getMainWindows();
                            case "document":
                                return window2.document;
                            case "ZoteroPane":
                            case "ZoteroPane_Local":
                                return _Zotero.getActiveZoteroPane();
                            default:
                                return window2[k];
                        }
                    } catch (e) {
                        Zotero.logError(e);
                    }
                }
                /**
                 * Check if it's running on Zotero 7 (Firefox 102)
                 */
                isZotero7() {
                    return Zotero.platformMajorVersion >= 102;
                }
                isFX115() {
                    return Zotero.platformMajorVersion >= 115;
                }
                /**
                 * Get DOMParser.
                 *
                 * For Zotero 6: mainWindow.DOMParser or nsIDOMParser
                 *
                 * For Zotero 7: Firefox 102 support DOMParser natively
                 */
                getDOMParser() {
                    if (this.isZotero7()) {
                        return new (this.getGlobal("DOMParser"))();
                    }
                    try {
                        return new (this.getGlobal("DOMParser"))();
                    } catch (e) {
                        return Components.classes[
                            "@mozilla.org/xmlextras/domparser;1"
                        ].createInstance(Components.interfaces.nsIDOMParser);
                    }
                }
                /**
                 * If it's an XUL element
                 * @param elem
                 */
                isXULElement(elem) {
                    return (
                        elem.namespaceURI ===
                        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
                    );
                }
                /**
                 * Create an XUL element
                 *
                 * For Zotero 6, use `createElementNS`;
                 *
                 * For Zotero 7+, use `createXULElement`.
                 * @param doc
                 * @param type
                 * @example
                 * Create a `<menuitem>`:
                 * ```ts
                 * const compat = new ZoteroCompat();
                 * const doc = compat.getWindow().document;
                 * const elem = compat.createXULElement(doc, "menuitem");
                 * ```
                 */
                createXULElement(doc, type) {
                    if (this.isZotero7()) {
                        return doc.createXULElement(type);
                    } else {
                        return doc.createElementNS(
                            "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
                            type,
                        );
                    }
                }
                /**
                 * Output to both Zotero.debug and console.log
                 * @param data e.g. string, number, object, ...
                 */
                log(...data) {
                    var _a;
                    if (data.length === 0) {
                        return;
                    }
                    const Zotero2 = this.getGlobal("Zotero");
                    const console2 = this.getGlobal("console");
                    let options;
                    if (
                        ((_a = data[data.length - 1]) === null || _a === void 0
                            ? void 0
                            : _a._type) === "toolkitlog"
                    ) {
                        options = data.pop();
                    } else {
                        options = this._basicOptions.log;
                    }
                    try {
                        if (options.prefix) {
                            data.splice(0, 0, options.prefix);
                        }
                        if (!options.disableConsole) {
                            console2.groupCollapsed(...data);
                            console2.trace();
                            console2.groupEnd();
                        }
                        if (!options.disableZLog) {
                            Zotero2.debug(
                                data
                                    .map((d) => {
                                        try {
                                            return typeof d === "object"
                                                ? JSON.stringify(d)
                                                : String(d);
                                        } catch (e) {
                                            Zotero2.debug(d);
                                            return "";
                                        }
                                    })
                                    .join("\n"),
                            );
                        }
                    } catch (e) {
                        console2.error(e);
                        Zotero2.logError(e);
                    }
                }
                /**
                 * Patch a function
                 * @deprecated Use {@link PatchHelper} instead.
                 * @param object The owner of the function
                 * @param funcSign The signature of the function(function name)
                 * @param ownerSign The signature of patch owner to avoid patching again
                 * @param patcher The new wrapper of the patched function
                 */
                patch(object, funcSign, ownerSign, patcher) {
                    if (object[funcSign][ownerSign]) {
                        throw new Error(`${String(funcSign)} re-patched`);
                    }
                    this.log("patching", funcSign, `by ${ownerSign}`);
                    object[funcSign] = patcher(object[funcSign]);
                    object[funcSign][ownerSign] = true;
                }
                /**
                 * Add a Zotero event listener callback
                 * @param type Event type
                 * @param callback Event callback
                 */
                addListenerCallback(type, callback) {
                    if (
                        ["onMainWindowLoad", "onMainWindowUnload"].includes(
                            type,
                        )
                    ) {
                        this._ensureMainWindowListener();
                    }
                    if (type === "onPluginUnload") {
                        this._ensurePluginListener();
                    }
                    this._basicOptions.listeners.callbacks[type].add(callback);
                }
                /**
                 * Remove a Zotero event listener callback
                 * @param type Event type
                 * @param callback Event callback
                 */
                removeListenerCallback(type, callback) {
                    this._basicOptions.listeners.callbacks[type].delete(
                        callback,
                    );
                    this._ensureRemoveListener();
                }
                /**
                 * Remove all Zotero event listener callbacks when the last callback is removed.
                 */
                _ensureRemoveListener() {
                    const { listeners } = this._basicOptions;
                    if (
                        listeners._mainWindow &&
                        listeners.callbacks.onMainWindowLoad.size === 0 &&
                        listeners.callbacks.onMainWindowUnload.size === 0
                    ) {
                        Services.wm.removeListener(listeners._mainWindow);
                        delete listeners._mainWindow;
                    }
                    if (
                        listeners._plugin &&
                        listeners.callbacks.onPluginUnload.size === 0
                    ) {
                        Zotero.Plugins.removeObserver(listeners._plugin);
                        delete listeners._plugin;
                    }
                }
                /**
                 * Ensure the main window listener is registered.
                 */
                _ensureMainWindowListener() {
                    if (this._basicOptions.listeners._mainWindow) {
                        return;
                    }
                    const mainWindowListener = {
                        onOpenWindow: (xulWindow) => {
                            const domWindow = xulWindow.docShell.domWindow;
                            const onload = async () => {
                                domWindow.removeEventListener(
                                    "load",
                                    onload,
                                    false,
                                );
                                if (
                                    domWindow.location.href !==
                                    "chrome://zotero/content/zoteroPane.xhtml"
                                ) {
                                    return;
                                }
                                for (const cbk of this._basicOptions.listeners
                                    .callbacks.onMainWindowLoad) {
                                    try {
                                        cbk(domWindow);
                                    } catch (e) {
                                        this.log(e);
                                    }
                                }
                            };
                            domWindow.addEventListener(
                                "load",
                                () => onload(),
                                false,
                            );
                        },
                        onCloseWindow: async (xulWindow) => {
                            const domWindow = xulWindow.docShell.domWindow;
                            if (
                                domWindow.location.href !==
                                "chrome://zotero/content/zoteroPane.xhtml"
                            ) {
                                return;
                            }
                            for (const cbk of this._basicOptions.listeners
                                .callbacks.onMainWindowUnload) {
                                try {
                                    cbk(domWindow);
                                } catch (e) {
                                    this.log(e);
                                }
                            }
                        },
                    };
                    this._basicOptions.listeners._mainWindow =
                        mainWindowListener;
                    Services.wm.addListener(mainWindowListener);
                }
                /**
                 * Ensure the plugin listener is registered.
                 */
                _ensurePluginListener() {
                    if (this._basicOptions.listeners._plugin) {
                        return;
                    }
                    const pluginListener = {
                        shutdown: (...args) => {
                            for (const cbk of this._basicOptions.listeners
                                .callbacks.onPluginUnload) {
                                try {
                                    cbk(...args);
                                } catch (e) {
                                    this.log(e);
                                }
                            }
                        },
                    };
                    this._basicOptions.listeners._plugin = pluginListener;
                    Zotero.Plugins.addObserver(pluginListener);
                }
                updateOptions(source) {
                    if (!source) {
                        return this;
                    }
                    if (source instanceof _BasicTool) {
                        this._basicOptions = source._basicOptions;
                    } else {
                        this._basicOptions = source;
                    }
                    return this;
                }
                static getZotero() {
                    return typeof Zotero !== "undefined"
                        ? Zotero
                        : Components.classes["@zotero.org/Zotero;1"].getService(
                              Components.interfaces.nsISupports,
                          ).wrappedJSObject;
                }
            };
            exports.BasicTool = BasicTool3;
            var ManagerTool = class extends BasicTool3 {
                _ensureAutoUnregisterAll() {
                    this.addListenerCallback(
                        "onPluginUnload",
                        (params, reason) => {
                            if (params.id !== this.basicOptions.api.pluginID) {
                                return;
                            }
                            this.unregisterAll();
                        },
                    );
                }
            };
            exports.ManagerTool = ManagerTool;
            function unregister2(tools) {
                Object.values(tools).forEach((tool) => {
                    if (
                        tool instanceof ManagerTool ||
                        typeof (tool === null || tool === void 0
                            ? void 0
                            : tool.unregisterAll) === "function"
                    ) {
                        tool.unregisterAll();
                    }
                });
            }
            exports.unregister = unregister2;
            function makeHelperTool(cls, options) {
                return new Proxy(cls, {
                    construct(target, args) {
                        const _origin = new cls(...args);
                        if (_origin instanceof BasicTool3) {
                            _origin.updateOptions(options);
                        }
                        return _origin;
                    },
                });
            }
            exports.makeHelperTool = makeHelperTool;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/tools/ui.js
    var require_ui = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/tools/ui.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.UITool = void 0;
            var basic_1 = require_basic();
            var UITool2 = class extends basic_1.BasicTool {
                get basicOptions() {
                    return this._basicOptions;
                }
                constructor(base) {
                    super(base);
                    this.elementCache = [];
                    if (!this._basicOptions.ui) {
                        this._basicOptions.ui = {
                            enableElementRecord: true,
                            enableElementJSONLog: false,
                            enableElementDOMLog: true,
                        };
                    }
                }
                /**
                 * Remove all elements created by `createElement`.
                 *
                 * @remarks
                 * > What is this for?
                 *
                 * In bootstrap plugins, elements must be manually maintained and removed on exiting.
                 *
                 * This API does this for you.
                 */
                unregisterAll() {
                    this.elementCache.forEach((e) => {
                        var _a;
                        try {
                            (_a =
                                e === null || e === void 0
                                    ? void 0
                                    : e.deref()) === null || _a === void 0
                                ? void 0
                                : _a.remove();
                        } catch (e2) {
                            this.log(e2);
                        }
                    });
                }
                createElement(...args) {
                    var _a, _b, _c;
                    const doc = args[0];
                    const tagName = args[1].toLowerCase();
                    let props = args[2] || {};
                    if (!tagName) {
                        return;
                    }
                    if (typeof args[2] === "string") {
                        props = {
                            namespace: args[2],
                            enableElementRecord: args[3],
                        };
                    }
                    if (
                        (typeof props.enableElementJSONLog !== "undefined" &&
                            props.enableElementJSONLog) ||
                        this.basicOptions.ui.enableElementJSONLog
                    ) {
                        this.log(props);
                    }
                    props.properties =
                        props.properties || props.directAttributes;
                    props.children = props.children || props.subElementOptions;
                    let elem;
                    if (tagName === "fragment") {
                        const fragElem = doc.createDocumentFragment();
                        elem = fragElem;
                    } else {
                        let realElem =
                            props.id &&
                            (props.checkExistenceParent
                                ? props.checkExistenceParent
                                : doc
                            ).querySelector(`#${props.id}`);
                        if (realElem && props.ignoreIfExists) {
                            return realElem;
                        }
                        if (realElem && props.removeIfExists) {
                            realElem.remove();
                            realElem = void 0;
                        }
                        if (
                            props.customCheck &&
                            !props.customCheck(doc, props)
                        ) {
                            return void 0;
                        }
                        if (!realElem || !props.skipIfExists) {
                            let namespace = props.namespace;
                            if (!namespace) {
                                const mightHTML =
                                    HTMLElementTagNames.includes(tagName);
                                const mightXUL =
                                    XULElementTagNames.includes(tagName);
                                const mightSVG =
                                    SVGElementTagNames.includes(tagName);
                                if (
                                    Number(mightHTML) +
                                        Number(mightXUL) +
                                        Number(mightSVG) >
                                    1
                                ) {
                                    this.log(
                                        `[Warning] Creating element ${tagName} with no namespace specified. Found multiply namespace matches.`,
                                    );
                                }
                                if (mightHTML) {
                                    namespace = "html";
                                } else if (mightXUL) {
                                    namespace = "xul";
                                } else if (mightSVG) {
                                    namespace = "svg";
                                } else {
                                    namespace = "html";
                                }
                            }
                            if (namespace === "xul") {
                                realElem = this.createXULElement(doc, tagName);
                            } else {
                                realElem = doc.createElementNS(
                                    {
                                        html: "http://www.w3.org/1999/xhtml",
                                        svg: "http://www.w3.org/2000/svg",
                                    }[namespace],
                                    tagName,
                                );
                            }
                            if (
                                typeof props.enableElementRecord !== "undefined"
                                    ? props.enableElementRecord
                                    : this.basicOptions.ui.enableElementRecord
                            ) {
                                this.elementCache.push(new WeakRef(realElem));
                            }
                        }
                        if (props.id) {
                            realElem.id = props.id;
                        }
                        if (props.styles && Object.keys(props.styles).length) {
                            Object.keys(props.styles).forEach((k) => {
                                const v = props.styles[k];
                                typeof v !== "undefined" &&
                                    (realElem.style[k] = v);
                            });
                        }
                        if (
                            props.properties &&
                            Object.keys(props.properties).length
                        ) {
                            Object.keys(props.properties).forEach((k) => {
                                const v = props.properties[k];
                                typeof v !== "undefined" && (realElem[k] = v);
                            });
                        }
                        if (
                            props.attributes &&
                            Object.keys(props.attributes).length
                        ) {
                            Object.keys(props.attributes).forEach((k) => {
                                const v = props.attributes[k];
                                typeof v !== "undefined" &&
                                    realElem.setAttribute(k, String(v));
                            });
                        }
                        if (
                            (_a = props.classList) === null || _a === void 0
                                ? void 0
                                : _a.length
                        ) {
                            realElem.classList.add(...props.classList);
                        }
                        if (
                            (_b = props.listeners) === null || _b === void 0
                                ? void 0
                                : _b.length
                        ) {
                            props.listeners.forEach(
                                ({ type, listener, options }) => {
                                    listener &&
                                        realElem.addEventListener(
                                            type,
                                            listener,
                                            options,
                                        );
                                },
                            );
                        }
                        elem = realElem;
                    }
                    if (
                        (_c = props.children) === null || _c === void 0
                            ? void 0
                            : _c.length
                    ) {
                        const subElements = props.children
                            .map((childProps) => {
                                childProps.namespace =
                                    childProps.namespace || props.namespace;
                                return this.createElement(
                                    doc,
                                    childProps.tag,
                                    childProps,
                                );
                            })
                            .filter((e) => e);
                        elem.append(...subElements);
                    }
                    if (
                        typeof props.enableElementDOMLog !== "undefined"
                            ? props.enableElementDOMLog
                            : this.basicOptions.ui.enableElementDOMLog
                    ) {
                        this.log(elem);
                    }
                    return elem;
                }
                /**
                 * Append element(s) to a node.
                 * @param properties See {@link ElementProps}
                 * @param container The parent node to append to.
                 * @returns A Node that is the appended child (aChild),
                 *          except when aChild is a DocumentFragment,
                 *          in which case the empty DocumentFragment is returned.
                 */
                appendElement(properties, container) {
                    return container.appendChild(
                        this.createElement(
                            container.ownerDocument,
                            properties.tag,
                            properties,
                        ),
                    );
                }
                /**
                 * Inserts a node before a reference node as a child of its parent node.
                 * @param properties See {@link ElementProps}
                 * @param referenceNode The node before which newNode is inserted.
                 * @returns
                 */
                insertElementBefore(properties, referenceNode) {
                    if (referenceNode.parentNode)
                        return referenceNode.parentNode.insertBefore(
                            this.createElement(
                                referenceNode.ownerDocument,
                                properties.tag,
                                properties,
                            ),
                            referenceNode,
                        );
                    else
                        this.log(
                            referenceNode.tagName +
                                " has no parent, cannot insert " +
                                properties.tag,
                        );
                }
                /**
                 * Replace oldNode with a new one.
                 * @param properties See {@link ElementProps}
                 * @param oldNode The child to be replaced.
                 * @returns The replaced Node. This is the same node as oldChild.
                 */
                replaceElement(properties, oldNode) {
                    if (oldNode.parentNode)
                        return oldNode.parentNode.replaceChild(
                            this.createElement(
                                oldNode.ownerDocument,
                                properties.tag,
                                properties,
                            ),
                            oldNode,
                        );
                    else
                        this.log(
                            oldNode.tagName +
                                " has no parent, cannot replace it with " +
                                properties.tag,
                        );
                }
                /**
                 * Parse XHTML to XUL fragment. For Zotero 6.
                 *
                 * To load preferences from a Zotero 7's `.xhtml`, use this method to parse it.
                 * @param str xhtml raw text
                 * @param entities dtd file list ("chrome://xxx.dtd")
                 * @param defaultXUL true for default XUL namespace
                 */
                parseXHTMLToFragment(str, entities = [], defaultXUL = true) {
                    let parser = this.getDOMParser();
                    const xulns =
                        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                    const htmlns = "http://www.w3.org/1999/xhtml";
                    const wrappedStr = `${
                        entities.length
                            ? `<!DOCTYPE bindings [ ${entities.reduce(
                                  (preamble, url, index) => {
                                      return (
                                          preamble +
                                          `<!ENTITY % _dtd-${index} SYSTEM "${url}"> %_dtd-${index}; `
                                      );
                                  },
                                  "",
                              )}]>`
                            : ""
                    }
      <html:div xmlns="${defaultXUL ? xulns : htmlns}"
          xmlns:xul="${xulns}" xmlns:html="${htmlns}">
      ${str}
      </html:div>`;
                    this.log(wrappedStr, parser);
                    let doc = parser.parseFromString(wrappedStr, "text/xml");
                    this.log(doc);
                    if (doc.documentElement.localName === "parsererror") {
                        throw new Error("not well-formed XHTML");
                    }
                    let range = doc.createRange();
                    range.selectNodeContents(doc.querySelector("div"));
                    return range.extractContents();
                }
            };
            exports.UITool = UITool2;
            var HTMLElementTagNames = [
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
            ];
            var XULElementTagNames = [
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
            ];
            var SVGElementTagNames = [
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
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/utils/wait.js
    var require_wait = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/utils/wait.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.waitUtilAsync = exports.waitUntil = void 0;
            var basic_1 = require_basic();
            var basicTool2 = new basic_1.BasicTool();
            function waitUntil(
                condition,
                callback,
                interval = 100,
                timeout = 1e4,
            ) {
                const start = Date.now();
                const intervalId = basicTool2.getGlobal("setInterval")(() => {
                    if (condition()) {
                        basicTool2.getGlobal("clearInterval")(intervalId);
                        callback();
                    } else if (Date.now() - start > timeout) {
                        basicTool2.getGlobal("clearInterval")(intervalId);
                    }
                }, interval);
            }
            exports.waitUntil = waitUntil;
            function waitUtilAsync(condition, interval = 100, timeout = 1e4) {
                return new Promise((resolve, reject) => {
                    const start = Date.now();
                    const intervalId = basicTool2.getGlobal("setInterval")(
                        () => {
                            if (condition()) {
                                basicTool2.getGlobal("clearInterval")(
                                    intervalId,
                                );
                                resolve();
                            } else if (Date.now() - start > timeout) {
                                basicTool2.getGlobal("clearInterval")(
                                    intervalId,
                                );
                                reject();
                            }
                        },
                        interval,
                    );
                });
            }
            exports.waitUtilAsync = waitUtilAsync;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/tools/reader.js
    var require_reader = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/tools/reader.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ReaderTool = void 0;
            var basic_1 = require_basic();
            var wait_1 = require_wait();
            var ReaderTool = class extends basic_1.BasicTool {
                /**
                 * Get the selected tab reader.
                 * @param waitTime Wait for n MS until the reader is ready
                 */
                async getReader(waitTime = 5e3) {
                    const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
                    if (Zotero_Tabs.selectedType !== "reader") {
                        return void 0;
                    }
                    let reader = Zotero.Reader.getByTabID(
                        Zotero_Tabs.selectedID,
                    );
                    let delayCount = 0;
                    const checkPeriod = 50;
                    while (!reader && delayCount * checkPeriod < waitTime) {
                        await Zotero.Promise.delay(checkPeriod);
                        reader = Zotero.Reader.getByTabID(
                            Zotero_Tabs.selectedID,
                        );
                        delayCount++;
                    }
                    await (reader === null || reader === void 0
                        ? void 0
                        : reader._initPromise);
                    return reader;
                }
                /**
                 * Get all window readers.
                 */
                getWindowReader() {
                    const Zotero_Tabs = this.getGlobal("Zotero_Tabs");
                    let windowReaders = [];
                    let tabs = Zotero_Tabs._tabs.map((e) => e.id);
                    for (let i = 0; i < Zotero.Reader._readers.length; i++) {
                        let flag = false;
                        for (let j = 0; j < tabs.length; j++) {
                            if (Zotero.Reader._readers[i].tabID == tabs[j]) {
                                flag = true;
                                break;
                            }
                        }
                        if (!flag) {
                            windowReaders.push(Zotero.Reader._readers[i]);
                        }
                    }
                    return windowReaders;
                }
                /**
                 * Get Reader tabpanel deck element.
                 * @deprecated - use item pane api
                 * @alpha
                 */
                getReaderTabPanelDeck() {
                    var _a;
                    const deck =
                        (_a =
                            this.getGlobal("window").document.querySelector(
                                ".notes-pane-deck",
                            )) === null || _a === void 0
                            ? void 0
                            : _a.previousElementSibling;
                    return deck;
                }
                /**
                 * Add a reader tabpanel deck selection change observer.
                 * @deprecated - use item pane api
                 * @alpha
                 * @param callback
                 */
                async addReaderTabPanelDeckObserver(callback) {
                    await (0, wait_1.waitUtilAsync)(
                        () => !!this.getReaderTabPanelDeck(),
                    );
                    const deck = this.getReaderTabPanelDeck();
                    const observer = new (this.getGlobal("MutationObserver"))(
                        async (mutations) => {
                            mutations.forEach(async (mutation) => {
                                const target = mutation.target;
                                if (
                                    target.classList.contains(
                                        "zotero-view-tabbox",
                                    ) ||
                                    target.tagName === "deck"
                                ) {
                                    callback();
                                }
                            });
                        },
                    );
                    observer.observe(deck, {
                        attributes: true,
                        attributeFilter: ["selectedIndex"],
                        subtree: true,
                    });
                    return observer;
                }
                /**
                 * Get the selected annotation data.
                 * @param reader Target reader
                 * @returns The selected annotation data.
                 */
                getSelectedAnnotationData(reader) {
                    var _a;
                    const annotation =
                        // @ts-ignore
                        (_a =
                            reader === null || reader === void 0
                                ? void 0
                                : reader._internalReader._lastView
                                      ._selectionPopup) === null ||
                        _a === void 0
                            ? void 0
                            : _a.annotation;
                    return annotation;
                }
                /**
                 * Get the text selection of reader.
                 * @param reader Target reader
                 * @returns The text selection of reader.
                 */
                getSelectedText(reader) {
                    var _a, _b;
                    return (_b =
                        (_a = this.getSelectedAnnotationData(reader)) ===
                            null || _a === void 0
                            ? void 0
                            : _a.text) !== null && _b !== void 0
                        ? _b
                        : "";
                }
            };
            exports.ReaderTool = ReaderTool;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/tools/extraField.js
    var require_extraField = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/tools/extraField.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ExtraFieldTool = void 0;
            var basic_1 = require_basic();
            var ExtraFieldTool = class extends basic_1.BasicTool {
                /**
                 * Get all extra fields
                 * @param item
                 */
                getExtraFields(item, backend = "custom") {
                    const extraFiledRaw = item.getField("extra");
                    if (backend === "default") {
                        return this.getGlobal(
                            "Zotero",
                        ).Utilities.Internal.extractExtraFields(extraFiledRaw)
                            .fields;
                    } else {
                        const map = /* @__PURE__ */ new Map();
                        const nonStandardFields = [];
                        extraFiledRaw.split("\n").forEach((line) => {
                            const split = line.split(": ");
                            if (split.length >= 2 && split[0]) {
                                map.set(split[0], split.slice(1).join(": "));
                            } else {
                                nonStandardFields.push(line);
                            }
                        });
                        map.set(
                            "__nonStandard__",
                            nonStandardFields.join("\n"),
                        );
                        return map;
                    }
                }
                /**
                 * Get extra field value by key. If it does not exists, return undefined.
                 * @param item
                 * @param key
                 */
                getExtraField(item, key) {
                    const fields = this.getExtraFields(item);
                    return fields.get(key);
                }
                /**
                 * Replace extra field of an item.
                 * @param item
                 * @param fields
                 */
                async replaceExtraFields(item, fields) {
                    let kvs = [];
                    if (fields.has("__nonStandard__")) {
                        kvs.push(fields.get("__nonStandard__"));
                        fields.delete("__nonStandard__");
                    }
                    fields.forEach((v, k) => {
                        kvs.push(`${k}: ${v}`);
                    });
                    item.setField("extra", kvs.join("\n"));
                    await item.saveTx();
                }
                /**
                 * Set an key-value pair to the item's extra field
                 * @param item
                 * @param key
                 * @param value
                 */
                async setExtraField(item, key, value) {
                    const fields = this.getExtraFields(item);
                    if (value === "" || typeof value === "undefined") {
                        fields.delete(key);
                    } else {
                        fields.set(key, value);
                    }
                    await this.replaceExtraFields(item, fields);
                }
            };
            exports.ExtraFieldTool = ExtraFieldTool;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/patch.js
    var require_patch = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/patch.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.PatchHelper = void 0;
            var basic_1 = require_basic();
            var PatchHelper = class extends basic_1.BasicTool {
                constructor() {
                    super();
                    this.options = void 0;
                }
                setData(options) {
                    this.options = options;
                    const Zotero2 = this.getGlobal("Zotero");
                    const { target, funcSign, patcher } = options;
                    const origin = target[funcSign];
                    this.log("patching ", funcSign);
                    target[funcSign] = function (...args) {
                        if (options.enabled)
                            try {
                                return patcher(origin).apply(this, args);
                            } catch (e) {
                                Zotero2.logError(e);
                            }
                        return origin.apply(this, args);
                    };
                    return this;
                }
                enable() {
                    if (!this.options) throw new Error("No patch data set");
                    this.options.enabled = true;
                    return this;
                }
                disable() {
                    if (!this.options) throw new Error("No patch data set");
                    this.options.enabled = false;
                    return this;
                }
            };
            exports.PatchHelper = PatchHelper;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/fieldHook.js
    var require_fieldHook = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/fieldHook.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.FieldHookManager = void 0;
            var patch_1 = require_patch();
            var basic_1 = require_basic();
            var FieldHookManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.data = {
                        getField: {},
                        setField: {},
                        isFieldOfBase: {},
                    };
                    this.patchHelpers = {
                        getField: new patch_1.PatchHelper(),
                        setField: new patch_1.PatchHelper(),
                        isFieldOfBase: new patch_1.PatchHelper(),
                    };
                    const _thisHelper = this;
                    for (const type of Object.keys(this.patchHelpers)) {
                        const helper = this.patchHelpers[type];
                        helper.setData({
                            target: this.getGlobal("Zotero").Item.prototype,
                            funcSign: type,
                            patcher: (original) =>
                                function (field, ...args) {
                                    const originalThis = this;
                                    const handler =
                                        _thisHelper.data[type][field];
                                    if (typeof handler === "function") {
                                        try {
                                            return handler(
                                                field,
                                                args[0],
                                                args[1],
                                                originalThis,
                                                original,
                                            );
                                        } catch (e) {
                                            return field + String(e);
                                        }
                                    }
                                    return original.apply(originalThis, [
                                        field,
                                        ...args,
                                    ]);
                                },
                            enabled: true,
                        });
                    }
                }
                register(type, field, hook) {
                    this.data[type][field] = hook;
                }
                unregister(type, field) {
                    delete this.data[type][field];
                }
                unregisterAll() {
                    this.data.getField = {};
                    this.data.setField = {};
                    this.data.isFieldOfBase = {};
                    this.patchHelpers.getField.disable();
                    this.patchHelpers.setField.disable();
                    this.patchHelpers.isFieldOfBase.disable();
                }
            };
            exports.FieldHookManager = FieldHookManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/patch.js
    var require_patch2 = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/patch.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.PatcherManager = void 0;
            var basic_1 = require_basic();
            var PatcherManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.patcherIDMap = /* @__PURE__ */ new Map();
                }
                /**
                 * Patch a function
                 * @param object The owner of the function
                 * @param funcSign The signature of the function(function name)
                 * @param patcher A function that returns the new wrapper of the patched function
                 * @returns A unique ID of the patcher, which can be used to unregister the patcher
                 */
                register(object, funcSign, patcher) {
                    const Zotero2 = this.getGlobal("Zotero");
                    const patchIDMap = this.patcherIDMap;
                    let id = Zotero2.randomString();
                    while (patchIDMap.has(id)) {
                        id = Zotero2.randomString();
                    }
                    const origin = object[funcSign];
                    patchIDMap.set(id, true);
                    this.log("patching ", funcSign);
                    object[funcSign] = function (...args) {
                        if (patchIDMap.get(id))
                            try {
                                return patcher(origin).apply(this, args);
                            } catch (e) {
                                Zotero2.logError(e);
                            }
                        return origin.apply(this, args);
                    };
                    return id;
                }
                /**
                 * Unregister a patcher
                 * @param patcherID The ID of the patcher to be unregistered
                 */
                unregister(patcherID) {
                    this.patcherIDMap.delete(patcherID);
                }
                /**
                 * Unregister all patchers
                 */
                unregisterAll() {
                    this.patcherIDMap.clear();
                }
            };
            exports.PatcherManager = PatcherManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/itemTree.js
    var require_itemTree = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/itemTree.js"(
            exports,
        ) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ItemTreeManager = void 0;
            var basic_1 = require_basic();
            var fieldHook_1 = require_fieldHook();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var patch_1 = require_patch2();
            var ItemTreeManager = class extends basic_1.ManagerTool {
                /**
                 * Initialize Zotero._ItemTreeExtraColumnsGlobal if it doesn't exist.
                 *
                 * New columns and hooks are stored there.
                 *
                 * Then patch `require("zotero/itemTree").getColumns` and `Zotero.Item.getField`
                 */
                constructor(base) {
                    super(base);
                    this.defaultPersist = [
                        "width",
                        "ordinal",
                        "hidden",
                        "sortActive",
                        "sortDirection",
                    ];
                    this.backend = this.getGlobal("Zotero").ItemTreeManager;
                    this.localColumnCache = [];
                    this.localRenderCellCache = [];
                    this.fieldHooks = new fieldHook_1.FieldHookManager(base);
                    this.patcherManager = new patch_1.PatcherManager(base);
                    this.initializationLock =
                        this.getGlobal("Zotero").Promise.defer();
                    if (!this.backend) {
                        this.initializeGlobal();
                    } else {
                        this.initializationLock.resolve();
                    }
                }
                unregisterAll() {
                    [...this.localColumnCache].forEach((key) =>
                        this.unregister(key, { skipGetField: true }),
                    );
                    [...this.localRenderCellCache].forEach(
                        this.removeRenderCellHook.bind(this),
                    );
                    this.fieldHooks.unregisterAll();
                }
                /**
                 * Register a new column. Don't forget to call `unregister` on plugin exit.
                 * @param key Column dataKey
                 * @param label Column display label
                 * @param getFieldHook Called when loading cell content.
                 * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
                 * @param options See zotero source code:chrome/content/zotero/itemTreeColumns.jsx
                 * @param options.renderCellHook Called when rendering cell. This will override
                 *
                 * @example
                 * ```ts
                 * const itemTree = new ItemTreeTool();
                 * await itemTree.register(
                 *   "test",
                 *   "new column",
                 *   (
                 *     field: string,
                 *     unformatted: boolean,
                 *     includeBaseMapped: boolean,
                 *     item: Zotero.Item
                 *   ) => {
                 *     return field + String(item.id);
                 *   },
                 *   {
                 *     iconPath: "chrome://zotero/skin/cross.png",
                 *   }
                 * );
                 * ```
                 */
                async register(
                    key,
                    label,
                    getFieldHook,
                    options = {
                        showInColumnPicker: true,
                    },
                ) {
                    var _a;
                    await ((_a = this.initializationLock) === null ||
                    _a === void 0
                        ? void 0
                        : _a.promise);
                    if (!this.backend) {
                        if (
                            this.globalCache.columns
                                .map((_c) => _c.dataKey)
                                .includes(key)
                        ) {
                            this.log(
                                `ItemTreeTool: ${key} is already registered.`,
                            );
                            return;
                        }
                    }
                    const column = {
                        dataKey: key,
                        label,
                        pluginID: this._basicOptions.api.pluginID,
                        iconLabel: options.iconPath
                            ? this.createIconLabel({
                                  iconPath: options.iconPath,
                                  name: label,
                              })
                            : void 0,
                        iconPath: options.iconPath,
                        htmlLabel: options.htmlLabel,
                        zoteroPersist:
                            options.zoteroPersist ||
                            (this.backend
                                ? this.defaultPersist
                                : new Set(this.defaultPersist)),
                        defaultIn: options.defaultIn,
                        disabledIn: options.disabledIn,
                        enabledTreeIDs: options.enabledTreeIDs,
                        defaultSort: options.defaultSort,
                        sortReverse:
                            options.sortReverse || options.defaultSort === -1,
                        flex:
                            typeof options.flex === "undefined"
                                ? 1
                                : options.flex,
                        width: options.width,
                        fixedWidth: options.fixedWidth,
                        staticWidth: options.staticWidth,
                        minWidth: options.minWidth,
                        ignoreInColumnPicker: options.ignoreInColumnPicker,
                        showInColumnPicker:
                            typeof options.ignoreInColumnPicker === "undefined"
                                ? true
                                : options.showInColumnPicker,
                        submenu: options.submenu,
                        columnPickerSubMenu:
                            options.columnPickerSubMenu || options.submenu,
                        dataProvider:
                            options.dataProvider ||
                            ((item, _dataKey) => item.getField(key)),
                        renderCell:
                            options.renderCell || options.renderCellHook,
                    };
                    if (getFieldHook) {
                        this.fieldHooks.register("getField", key, getFieldHook);
                    }
                    if (this.backend) {
                        return await this.backend.registerColumns(column);
                    } else {
                        this.globalCache.columns.push(column);
                        this.localColumnCache.push(column.dataKey);
                        if (options.renderCellHook) {
                            await this.addRenderCellHook(
                                key,
                                options.renderCellHook,
                            );
                        }
                        await this.refresh();
                    }
                }
                /**
                 * Unregister an extra column. Call it on plugin exit.
                 * @param key Column dataKey, should be same as the one used in `register`
                 * @param options.skipGetField skip unregister of getField hook.
                 * This is useful when the hook is not initialized by this instance
                 */
                async unregister(key, options = {}) {
                    await this.initializationLock.promise;
                    if (this.backend) {
                        await this.backend.unregisterColumns(key);
                        if (!options.skipGetField) {
                            this.fieldHooks.unregister("getField", key);
                        }
                        return;
                    }
                    const Zotero2 = this.getGlobal("Zotero");
                    let persisted = Zotero2.Prefs.get("pane.persist");
                    const persistedJSON = JSON.parse(persisted);
                    delete persistedJSON[key];
                    Zotero2.Prefs.set(
                        "pane.persist",
                        JSON.stringify(persistedJSON),
                    );
                    const idx = this.globalCache.columns
                        .map((_c) => _c.dataKey)
                        .indexOf(key);
                    if (idx >= 0) {
                        this.globalCache.columns.splice(idx, 1);
                    }
                    if (!options.skipGetField) {
                        this.fieldHooks.unregister("getField", key);
                    }
                    this.removeRenderCellHook(key);
                    await this.refresh();
                    const localKeyIdx = this.localColumnCache.indexOf(key);
                    if (localKeyIdx >= 0) {
                        this.localColumnCache.splice(localKeyIdx, 1);
                    }
                }
                /**
                 * Add a patch hook for `_renderCell`, which is called when cell is rendered.
                 * @deprecated
                 *
                 * This also works for Zotero's built-in cells.
                 * @remarks
                 * Don't call it manually unless you understand what you are doing.
                 * @param dataKey Cell `dataKey`, e.g. 'title'
                 * @param renderCellHook patch hook
                 */
                async addRenderCellHook(dataKey, renderCellHook) {
                    await this.initializationLock.promise;
                    if (dataKey in this.globalCache.renderCellHooks) {
                        this.log(
                            "[WARNING] ItemTreeTool.addRenderCellHook overwrites an existing hook:",
                            dataKey,
                        );
                    }
                    this.globalCache.renderCellHooks[dataKey] = renderCellHook;
                    this.localRenderCellCache.push(dataKey);
                }
                /**
                 * Remove a patch hook by `dataKey`.
                 * @deprecated
                 */
                async removeRenderCellHook(dataKey) {
                    delete this.globalCache.renderCellHooks[dataKey];
                    const idx = this.localRenderCellCache.indexOf(dataKey);
                    if (idx >= 0) {
                        this.localRenderCellCache.splice(idx, 1);
                    }
                    await this.refresh();
                }
                /**
                 * Do initializations. Called in constructor to be async
                 */
                async initializeGlobal() {
                    const Zotero2 = this.getGlobal("Zotero");
                    await Zotero2.uiReadyPromise;
                    const window2 = this.getGlobal("window");
                    this.globalCache =
                        toolkitGlobal_1.default.getInstance().itemTree;
                    const globalCache = this.globalCache;
                    if (!globalCache._ready) {
                        globalCache._ready = true;
                        const itemTree = window2.require("zotero/itemTree");
                        if (!this.backend) {
                            this.patcherManager.register(
                                itemTree.prototype,
                                "getColumns",
                                (original) =>
                                    function () {
                                        const columns = original.apply(
                                            this,
                                            arguments,
                                        );
                                        const insertAfter = columns.findIndex(
                                            (column) =>
                                                column.dataKey === "title",
                                        );
                                        columns.splice(
                                            insertAfter + 1,
                                            0,
                                            ...globalCache.columns,
                                        );
                                        return columns;
                                    },
                            );
                        }
                        this.patcherManager.register(
                            itemTree.prototype,
                            "_renderCell",
                            (original) =>
                                function (index, data, column) {
                                    if (
                                        !(
                                            column.dataKey in
                                            globalCache.renderCellHooks
                                        )
                                    ) {
                                        return original.apply(this, arguments);
                                    }
                                    const hook =
                                        globalCache.renderCellHooks[
                                            column.dataKey
                                        ];
                                    const elem = hook(
                                        index,
                                        data,
                                        column,
                                        original.bind(this),
                                    );
                                    if (elem.classList.contains("cell")) {
                                        return elem;
                                    }
                                    const span =
                                        window2.document.createElementNS(
                                            "http://www.w3.org/1999/xhtml",
                                            "span",
                                        );
                                    span.classList.add(
                                        "cell",
                                        column.dataKey,
                                        `${column.dataKey}-item-tree-main-default`,
                                    );
                                    if (column.fixedWidth) {
                                        span.classList.add("fixed-width");
                                    }
                                    span.appendChild(elem);
                                    return span;
                                },
                        );
                    }
                    this.initializationLock.resolve();
                }
                /**
                 * Create a React Icon element
                 * @param props
                 */
                createIconLabel(props) {
                    const _React = window.require("react");
                    return _React.createElement(
                        "span",
                        null,
                        _React.createElement("img", {
                            src: props.iconPath,
                            height: "10px",
                            width: "9px",
                            style: {
                                "margin-left": "6px",
                            },
                        }),
                        " ",
                        props.name,
                    );
                }
                /**
                 * Refresh itemView. You don't need to call it manually.
                 */
                async refresh() {
                    var _a, _b;
                    await this.initializationLock.promise;
                    const ZoteroPane = this.getGlobal("ZoteroPane");
                    const itemsView = ZoteroPane.itemsView;
                    if (!itemsView) return;
                    itemsView._columnsId = null;
                    const virtualizedTable =
                        (_a = itemsView.tree) === null || _a === void 0
                            ? void 0
                            : _a._columns;
                    if (!virtualizedTable) {
                        this.log("ItemTree is still loading. Refresh skipped.");
                        return;
                    }
                    (_b = document.querySelector(
                        `.${virtualizedTable._styleKey}`,
                    )) === null || _b === void 0
                        ? void 0
                        : _b.remove();
                    await itemsView.refreshAndMaintainSelection();
                    itemsView.tree._columns =
                        new virtualizedTable.__proto__.constructor(
                            itemsView.tree,
                        );
                    await itemsView.refreshAndMaintainSelection();
                }
            };
            exports.ItemTreeManager = ItemTreeManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/prompt.js
    var require_prompt = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/prompt.js"(exports) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.PromptManager = exports.Prompt = void 0;
            var basic_1 = require_basic();
            var basic_2 = require_basic();
            var ui_1 = require_ui();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var Prompt = class {
                get document() {
                    return this.base.getGlobal("document");
                }
                /**
                 * Initialize `Prompt` but do not create UI.
                 */
                constructor() {
                    this.lastInputText = "";
                    this.defaultText = {
                        placeholder: "Select a command...",
                        empty: "No commands found.",
                    };
                    this.maxLineNum = 12;
                    this.maxSuggestionNum = 100;
                    this.commands = [];
                    this.base = new basic_1.BasicTool();
                    this.ui = new ui_1.UITool();
                    this.initializeUI();
                }
                /**
                 * Initialize `Prompt` UI and then bind events on it.
                 */
                initializeUI() {
                    this.addStyle();
                    this.createHTML();
                    this.initInputEvents();
                    this.registerShortcut();
                }
                createHTML() {
                    this.promptNode = this.ui.createElement(
                        this.document,
                        "div",
                        {
                            styles: {
                                display: "none",
                            },
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
                                                this.promptNode.style.display =
                                                    "none";
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    );
                    this.promptNode.appendChild(
                        this.ui.createElement(this.document, "div", {
                            id: `zotero-plugin-toolkit-prompt`,
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
                                                placeholder:
                                                    this.defaultText
                                                        .placeholder,
                                            },
                                        },
                                        {
                                            tag: "div",
                                            classList: ["cta"],
                                        },
                                    ],
                                },
                                {
                                    tag: "div",
                                    classList: ["commands-containers"],
                                },
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
                                                    properties: {
                                                        innerText:
                                                            "\u2191\u2193",
                                                    },
                                                },
                                                {
                                                    tag: "span",
                                                    properties: {
                                                        innerText:
                                                            "to navigate",
                                                    },
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
                                                    properties: {
                                                        innerText: "enter",
                                                    },
                                                },
                                                {
                                                    tag: "span",
                                                    properties: {
                                                        innerText: "to trigger",
                                                    },
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
                                                    properties: {
                                                        innerText: "esc",
                                                    },
                                                },
                                                {
                                                    tag: "span",
                                                    properties: {
                                                        innerText: "to exit",
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        }),
                    );
                    this.inputNode = this.promptNode.querySelector("input");
                    this.document.documentElement.appendChild(this.promptNode);
                }
                /**
                 * Show commands in a new `commandsContainer`
                 * All other `commandsContainer` is hidden
                 * @param commands Command[]
                 * @param clear remove all `commandsContainer` if true
                 */
                showCommands(commands, clear = false) {
                    if (clear) {
                        this.promptNode
                            .querySelectorAll(".commands-container")
                            .forEach((e) => e.remove());
                    }
                    this.inputNode.placeholder = this.defaultText.placeholder;
                    const commandsContainer = this.createCommandsContainer();
                    for (let command of commands) {
                        try {
                            if (
                                !command.name ||
                                (command.when && !command.when())
                            ) {
                                continue;
                            }
                        } catch (_a) {
                            continue;
                        }
                        commandsContainer.appendChild(
                            this.createCommandNode(command),
                        );
                    }
                }
                /**
                 * Create a `commandsContainer` div element, append to `commandsContainer` and hide others.
                 * @returns commandsNode
                 */
                createCommandsContainer() {
                    const commandsContainer = this.ui.createElement(
                        this.document,
                        "div",
                        {
                            classList: ["commands-container"],
                        },
                    );
                    this.promptNode
                        .querySelectorAll(".commands-container")
                        .forEach((e) => {
                            e.style.display = "none";
                        });
                    this.promptNode
                        .querySelector(".commands-containers")
                        .appendChild(commandsContainer);
                    return commandsContainer;
                }
                /**
                 * Return current displayed `commandsContainer`
                 * @returns
                 */
                getCommandsContainer() {
                    return [
                        ...Array.from(
                            this.promptNode.querySelectorAll(
                                ".commands-container",
                            ),
                        ),
                    ].find((e) => {
                        return e.style.display != "none";
                    });
                }
                /**
                 * Create a command item for `Prompt` UI.
                 * @param command
                 * @returns
                 */
                createCommandNode(command) {
                    const commandNode = this.ui.createElement(
                        this.document,
                        "div",
                        {
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
                                                {
                                                    tag: "span",
                                                    properties: {
                                                        innerText: command.name,
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            tag: "div",
                                            classList: ["aux"],
                                            children: command.label
                                                ? [
                                                      {
                                                          tag: "span",
                                                          classList: ["label"],
                                                          properties: {
                                                              innerText:
                                                                  command.label,
                                                          },
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
                                        this.selectItem(commandNode);
                                    },
                                },
                                {
                                    type: "click",
                                    listener: async () => {
                                        await this.execCallback(
                                            command.callback,
                                        );
                                    },
                                },
                            ],
                        },
                    );
                    commandNode.command = command;
                    return commandNode;
                }
                /**
                 * Called when `enter` key is pressed.
                 */
                trigger() {
                    [
                        ...Array.from(
                            this.promptNode.querySelectorAll(
                                ".commands-container",
                            ),
                        ),
                    ]
                        .find((e) => e.style.display != "none")
                        .querySelector(".selected")
                        .click();
                }
                /**
                 * Called when `escape` key is pressed.
                 */
                exit() {
                    this.inputNode.placeholder = this.defaultText.placeholder;
                    if (
                        this.promptNode.querySelectorAll(
                            ".commands-containers .commands-container",
                        ).length >= 2
                    ) {
                        this.promptNode
                            .querySelector(".commands-container:last-child")
                            .remove();
                        const commandsContainer = this.promptNode.querySelector(
                            ".commands-container:last-child",
                        );
                        commandsContainer.style.display = "";
                        commandsContainer
                            .querySelectorAll(".commands")
                            .forEach((e) => (e.style.display = "flex"));
                        this.inputNode.focus();
                    } else {
                        this.promptNode.style.display = "none";
                    }
                }
                async execCallback(callback) {
                    if (Array.isArray(callback)) {
                        this.showCommands(callback);
                    } else {
                        await callback(this);
                    }
                }
                /**
                 * Match suggestions for user's entered text.
                 */
                async showSuggestions(inputText) {
                    var _w =
                            /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/,
                        jw = /\s/,
                        Ww =
                            /[\u0F00-\u0FFF\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
                    function Yw(e2, t, n, i) {
                        if (0 === e2.length) return 0;
                        var r = 0;
                        (r -= Math.max(0, e2.length - 1)), (r -= i / 10);
                        var o = e2[0][0];
                        return (
                            (r -= (e2[e2.length - 1][1] - o + 1 - t) / 100),
                            (r -= o / 1e3),
                            (r -= n / 1e4)
                        );
                    }
                    function $w(e2, t, n, i) {
                        if (0 === e2.length) return null;
                        for (
                            var r = n.toLowerCase(),
                                o = 0,
                                a = 0,
                                s = [],
                                l = 0;
                            l < e2.length;
                            l++
                        ) {
                            var c = e2[l],
                                u = r.indexOf(c, a);
                            if (-1 === u) return null;
                            var h = n.charAt(u);
                            if (u > 0 && !_w.test(h) && !Ww.test(h)) {
                                var p = n.charAt(u - 1);
                                if (
                                    (h.toLowerCase() !== h &&
                                        p.toLowerCase() !== p) ||
                                    (h.toUpperCase() !== h &&
                                        !_w.test(p) &&
                                        !jw.test(p) &&
                                        !Ww.test(p))
                                )
                                    if (i) {
                                        if (u !== a) {
                                            (a += c.length), l--;
                                            continue;
                                        }
                                    } else o += 1;
                            }
                            if (0 === s.length) s.push([u, u + c.length]);
                            else {
                                var d = s[s.length - 1];
                                d[1] < u
                                    ? s.push([u, u + c.length])
                                    : (d[1] = u + c.length);
                            }
                            a = u + c.length;
                        }
                        return {
                            matches: s,
                            score: Yw(s, t.length, r.length, o),
                        };
                    }
                    function Gw(e2) {
                        for (
                            var t = e2.toLowerCase(), n = [], i = 0, r = 0;
                            r < t.length;
                            r++
                        ) {
                            var o = t.charAt(r);
                            jw.test(o)
                                ? (i !== r && n.push(t.substring(i, r)),
                                  (i = r + 1))
                                : (_w.test(o) || Ww.test(o)) &&
                                  (i !== r && n.push(t.substring(i, r)),
                                  n.push(o),
                                  (i = r + 1));
                        }
                        return (
                            i !== t.length && n.push(t.substring(i, t.length)),
                            {
                                query: e2,
                                tokens: n,
                                fuzzy: t.split(""),
                            }
                        );
                    }
                    function Xw(e2, t) {
                        if ("" === e2.query)
                            return {
                                score: 0,
                                matches: [],
                            };
                        var n = $w(e2.tokens, e2.query, t, false);
                        return n || $w(e2.fuzzy, e2.query, t, true);
                    }
                    var e = Gw(inputText);
                    let container = this.getCommandsContainer();
                    if (container.classList.contains("suggestions")) {
                        this.exit();
                    }
                    if (inputText.trim() == "") {
                        return true;
                    }
                    let suggestions = [];
                    this.getCommandsContainer()
                        .querySelectorAll(".command")
                        .forEach((commandNode) => {
                            let spanNode =
                                commandNode.querySelector(".name span");
                            let spanText = spanNode.innerText;
                            let res = Xw(e, spanText);
                            if (res) {
                                commandNode = this.createCommandNode(
                                    commandNode.command,
                                );
                                let spanHTML = "";
                                let i = 0;
                                for (let j = 0; j < res.matches.length; j++) {
                                    let [start, end] = res.matches[j];
                                    if (start > i) {
                                        spanHTML += spanText.slice(i, start);
                                    }
                                    spanHTML += `<span class="highlight">${spanText.slice(start, end)}</span>`;
                                    i = end;
                                }
                                if (i < spanText.length) {
                                    spanHTML += spanText.slice(
                                        i,
                                        spanText.length,
                                    );
                                }
                                commandNode.querySelector(
                                    ".name span",
                                ).innerHTML = spanHTML;
                                suggestions.push({
                                    score: res.score,
                                    commandNode,
                                });
                            }
                        });
                    if (suggestions.length > 0) {
                        suggestions
                            .sort((a, b) => b.score - a.score)
                            .slice(this.maxSuggestionNum);
                        container = this.createCommandsContainer();
                        container.classList.add("suggestions");
                        suggestions.forEach((suggestion) => {
                            container.appendChild(suggestion.commandNode);
                        });
                        return true;
                    } else {
                        const anonymousCommand = this.commands.find(
                            (c) => !c.name && (!c.when || c.when()),
                        );
                        if (anonymousCommand) {
                            await this.execCallback(anonymousCommand.callback);
                        } else {
                            this.showTip(this.defaultText.empty);
                        }
                        return false;
                    }
                }
                /**
                 * Bind events of pressing `keydown` and `keyup` key.
                 */
                initInputEvents() {
                    this.promptNode.addEventListener("keydown", (event) => {
                        if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
                            event.preventDefault();
                            let selectedIndex;
                            let allItems = [
                                ...Array.from(
                                    this.getCommandsContainer().querySelectorAll(
                                        ".command",
                                    ),
                                ),
                            ].filter((e) => e.style.display != "none");
                            selectedIndex = allItems.findIndex((e) =>
                                e.classList.contains("selected"),
                            );
                            if (selectedIndex != -1) {
                                allItems[selectedIndex].classList.remove(
                                    "selected",
                                );
                                selectedIndex +=
                                    event.key == "ArrowUp" ? -1 : 1;
                            } else {
                                if (event.key == "ArrowUp") {
                                    selectedIndex = allItems.length - 1;
                                } else {
                                    selectedIndex = 0;
                                }
                            }
                            if (selectedIndex == -1) {
                                selectedIndex = allItems.length - 1;
                            } else if (selectedIndex == allItems.length) {
                                selectedIndex = 0;
                            }
                            allItems[selectedIndex].classList.add("selected");
                            let commandsContainer = this.getCommandsContainer();
                            commandsContainer.scrollTo(
                                0,
                                commandsContainer.querySelector(".selected")
                                    .offsetTop -
                                    commandsContainer.offsetHeight +
                                    7.5,
                            );
                            allItems[selectedIndex].classList.add("selected");
                        }
                    });
                    this.promptNode.addEventListener("keyup", async (event) => {
                        if (event.key == "Enter") {
                            this.trigger();
                        } else if (event.key == "Escape") {
                            if (this.inputNode.value.length > 0) {
                                this.inputNode.value = "";
                            } else {
                                this.exit();
                            }
                        } else if (
                            ["ArrowUp", "ArrowDown"].indexOf(event.key) != -1
                        ) {
                            return;
                        }
                        const currentInputText = this.inputNode.value;
                        if (currentInputText == this.lastInputText) {
                            return;
                        }
                        this.lastInputText = currentInputText;
                        window.setTimeout(async () => {
                            await this.showSuggestions(currentInputText);
                        });
                    });
                }
                /**
                 * Create a commandsContainer and display a text
                 */
                showTip(text) {
                    const tipNode = this.ui.createElement(
                        this.document,
                        "div",
                        {
                            classList: ["tip"],
                            properties: {
                                innerText: text,
                            },
                        },
                    );
                    let container = this.createCommandsContainer();
                    container.classList.add("suggestions");
                    container.appendChild(tipNode);
                    return tipNode;
                }
                /**
                 * Mark the selected item with class `selected`.
                 * @param item HTMLDivElement
                 */
                selectItem(item) {
                    this.getCommandsContainer()
                        .querySelectorAll(".command")
                        .forEach((e) => e.classList.remove("selected"));
                    item.classList.add("selected");
                }
                addStyle() {
                    const style = this.ui.createElement(
                        this.document,
                        "style",
                        {
                            namespace: "html",
                            id: "prompt-style",
                        },
                    );
                    style.innerText = `
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
    `;
                    this.document.documentElement.appendChild(style);
                }
                registerShortcut() {
                    this.document.addEventListener(
                        "keydown",
                        (event) => {
                            if (
                                event.shiftKey &&
                                event.key.toLowerCase() == "p"
                            ) {
                                if (
                                    event.originalTarget.isContentEditable ||
                                    "value" in event.originalTarget ||
                                    this.commands.length == 0
                                ) {
                                    return;
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                if (this.promptNode.style.display == "none") {
                                    this.promptNode.style.display = "flex";
                                    if (
                                        this.promptNode.querySelectorAll(
                                            ".commands-container",
                                        ).length == 1
                                    ) {
                                        this.showCommands(this.commands, true);
                                    }
                                    this.promptNode.focus();
                                    this.inputNode.focus();
                                } else {
                                    this.promptNode.style.display = "none";
                                }
                            }
                        },
                        true,
                    );
                }
            };
            exports.Prompt = Prompt;
            var PromptManager = class extends basic_2.ManagerTool {
                constructor(base) {
                    super(base);
                    this.commands = [];
                    const globalCache =
                        toolkitGlobal_1.default.getInstance().prompt;
                    if (!globalCache._ready) {
                        globalCache._ready = true;
                        globalCache.instance = new Prompt();
                    }
                    this.prompt = globalCache.instance;
                }
                /**
                 * Register commands. Don't forget to call `unregister` on plugin exit.
                 * @param commands Command[]
                 * @example
                 * ```ts
                 * let getReader = () => {
                 *   return BasicTool.getZotero().Reader.getByTabID(
                 *     (Zotero.getMainWindow().Zotero_Tabs).selectedID
                 *   )
                 * }
                 *
                 * register([
                 *   {
                 *     name: "Split Horizontally",
                 *     label: "Zotero",
                 *     when: () => getReader() as boolean,
                 *     callback: (prompt: Prompt) => getReader().menuCmd("splitHorizontally")
                 *   },
                 *   {
                 *     name: "Split Vertically",
                 *     label: "Zotero",
                 *     when: () => getReader() as boolean,
                 *     callback: (prompt: Prompt) => getReader().menuCmd("splitVertically")
                 *   }
                 * ])
                 * ```
                 */
                register(commands) {
                    commands.forEach((c) => {
                        var _a;
                        return (_a = c.id) !== null && _a !== void 0
                            ? _a
                            : (c.id = c.name);
                    });
                    this.prompt.commands = [
                        ...this.prompt.commands,
                        ...commands,
                    ];
                    this.commands = [...this.commands, ...commands];
                    this.prompt.showCommands(this.commands, true);
                }
                /**
                 * You can delete a command registed before by its name.
                 * @remarks
                 * There is a premise here that the names of all commands registered by a single plugin are not duplicated.
                 * @param id Command.name
                 */
                unregister(id) {
                    this.prompt.commands = this.prompt.commands.filter(
                        (c) => c.id != id,
                    );
                    this.commands = this.commands.filter((c) => c.id != id);
                }
                /**
                 * Call `unregisterAll` on plugin exit.
                 */
                unregisterAll() {
                    this.prompt.commands = this.prompt.commands.filter((c) => {
                        return this.commands.every((_c) => _c.id != c.id);
                    });
                    this.commands = [];
                }
            };
            exports.PromptManager = PromptManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/libraryTabPanel.js
    var require_libraryTabPanel = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/libraryTabPanel.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.LibraryTabPanelManager = void 0;
            var ui_1 = require_ui();
            var basic_1 = require_basic();
            var LibraryTabPanelManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.ui = new ui_1.UITool(this);
                    this.libraryTabCache = {
                        optionsList: [],
                    };
                }
                /**
                 * Register a tabpanel in library.
                 * @remarks
                 * If you don't want to remove the tab & panel in runtime, `unregisterLibraryTabPanel` is not a must.
                 *
                 * The elements wiil be removed by `removeAddonElements`.
                 * @param tabLabel Label of panel tab.
                 * @param renderPanelHook Called when panel is ready. Add elements to the panel.
                 * @param options Other optional parameters.
                 * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
                 * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
                 * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
                 * @param options.selectPanel If the panel should be selected immediately.
                 * @returns tabId. Use it for unregister.
                 * @example
                 * Register an extra library tabpanel into index 1.
                 * ```ts
                 * const libPaneManager = new LibraryTabPanelManager();
                 * const libTabId = libPaneManager.registerLibraryTabPanel(
                 *   "test",
                 *   (panel: XUL.Element, win: Window) => {
                 *     const elem = ui.creatElementsFromJSON(
                 *       win.document,
                 *       {
                 *         tag: "vbox",
                 *         namespace: "xul",
                 *         subElementOptions: [
                 *           {
                 *             tag: "h2",
                 *             directAttributes: {
                 *               innerText: "Hello World!",
                 *             },
                 *           },
                 *           {
                 *             tag: "label",
                 *             namespace: "xul",
                 *             directAttributes: {
                 *               value: "This is a library tab.",
                 *             },
                 *           },
                 *           {
                 *             tag: "button",
                 *             directAttributes: {
                 *               innerText: "Unregister",
                 *             },
                 *             listeners: [
                 *               {
                 *                 type: "click",
                 *                 listener: () => {
                 *                   ui.unregisterLibraryTabPanel(
                 *                     libTabId
                 *                   );
                 *                 },
                 *               },
                 *             ],
                 *           },
                 *         ],
                 *       }
                 *     );
                 *     panel.append(elem);
                 *   },
                 *   {
                 *     targetIndex: 1,
                 *   }
                 * );
                 * ```
                 */
                register(tabLabel, renderPanelHook, options) {
                    options = options || {
                        tabId: void 0,
                        panelId: void 0,
                        targetIndex: -1,
                        selectPanel: false,
                    };
                    const window2 = this.getGlobal("window");
                    const tabbox = window2.document.querySelector(
                        "#zotero-view-tabbox",
                    );
                    const randomId = `${Zotero.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`;
                    const tabId =
                        options.tabId || `toolkit-readertab-${randomId}`;
                    const panelId =
                        options.panelId || `toolkit-readertabpanel-${randomId}`;
                    const tab = this.ui.createElement(window2.document, "tab", {
                        id: tabId,
                        classList: [`toolkit-ui-tabs-${tabId}`],
                        attributes: {
                            label: tabLabel,
                        },
                        ignoreIfExists: true,
                    });
                    const tabpanel = this.ui.createElement(
                        window2.document,
                        "tabpanel",
                        {
                            id: panelId,
                            classList: [`toolkit-ui-tabs-${tabId}`],
                            ignoreIfExists: true,
                        },
                    );
                    const tabs = tabbox.querySelector("tabs");
                    const tabpanels = tabbox.querySelector("tabpanels");
                    const targetIndex =
                        typeof options.targetIndex === "number"
                            ? options.targetIndex
                            : -1;
                    if (targetIndex >= 0) {
                        tabs.querySelectorAll("tab")[targetIndex].before(tab);
                        tabpanels
                            .querySelectorAll("tabpanel")
                            [targetIndex].before(tabpanel);
                    } else {
                        tabs.appendChild(tab);
                        tabpanels.appendChild(tabpanel);
                    }
                    if (options.selectPanel) {
                        tabbox.selectedTab = tab;
                    }
                    this.libraryTabCache.optionsList.push({
                        tabId,
                        tabLabel,
                        panelId,
                        renderPanelHook,
                        targetIndex,
                        selectPanel: options.selectPanel,
                    });
                    renderPanelHook(tabpanel, window2);
                    return tabId;
                }
                /**
                 * Unregister the library tabpanel.
                 * @param tabId tab id
                 */
                unregister(tabId) {
                    const idx = this.libraryTabCache.optionsList.findIndex(
                        (v) => v.tabId === tabId,
                    );
                    if (idx >= 0) {
                        this.libraryTabCache.optionsList.splice(idx, 1);
                    }
                    this.removeTabPanel(tabId);
                }
                /**
                 * Unregister all library tabpanel.
                 */
                unregisterAll() {
                    const tabIds = this.libraryTabCache.optionsList.map(
                        (options) => options.tabId,
                    );
                    tabIds.forEach(this.unregister.bind(this));
                }
                removeTabPanel(tabId) {
                    const doc = this.getGlobal("document");
                    Array.prototype.forEach.call(
                        doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`),
                        (e) => {
                            e.remove();
                        },
                    );
                }
            };
            exports.LibraryTabPanelManager = LibraryTabPanelManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/readerTabPanel.js
    var require_readerTabPanel = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/readerTabPanel.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ReaderTabPanelManager = void 0;
            var ui_1 = require_ui();
            var reader_1 = require_reader();
            var basic_1 = require_basic();
            var ReaderTabPanelManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.ui = new ui_1.UITool(this);
                    this.readerTool = new reader_1.ReaderTool(this);
                    this.readerTabCache = {
                        optionsList: [],
                        observer: void 0,
                        initializeLock: void 0,
                    };
                }
                /**
                 * Register a tabpanel for every reader.
                 * @remarks
                 * Don't forget to call `unregisterReaderTabPanel` on exit.
                 * @remarks
                 * Every time a tab reader is selected/opened, the hook will be called.
                 * @param tabLabel Label of panel tab.
                 * @param renderPanelHook Called when panel is ready. Add elements to the panel.
                 *
                 * The panel might be `undefined` when opening a PDF without parent item.
                 *
                 * The owner deck is the top container of right-side bar.
                 *
                 * The readerInstance is the reader of current tabpanel.
                 * @param options Other optional parameters.
                 * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
                 * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
                 * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
                 * @param options.selectPanel If the panel should be selected immediately.
                 * @returns tabId. Use it for unregister.
                 * @example
                 * Register an extra reader tabpanel into index 1.
                 * ```ts
                 * const readerTabId = `${config.addonRef}-extra-reader-tab`;
                 * this._Addon.toolkit.UI.registerReaderTabPanel(
                 *   "test",
                 *   (
                 *     panel: XUL.Element,
                 *     deck: XUL.Deck,
                 *     win: Window,
                 *     reader: _ZoteroReaderInstance
                 *   ) => {
                 *     if (!panel) {
                 *       this._Addon.toolkit.Tool.log(
                 *         "This reader do not have right-side bar. Adding reader tab skipped."
                 *       );
                 *       return;
                 *     }
                 *     this._Addon.toolkit.Tool.log(reader);
                 *     const elem = this._Addon.toolkit.UI.creatElementsFromJSON(
                 *       win.document,
                 *       {
                 *         tag: "vbox",
                 *         id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
                 *         namespace: "xul",
                 *         // This is important! Don't create content for multiple times
                 *         ignoreIfExists: true,
                 *         subElementOptions: [
                 *           {
                 *             tag: "h2",
                 *             directAttributes: {
                 *               innerText: "Hello World!",
                 *             },
                 *           },
                 *           {
                 *             tag: "label",
                 *             namespace: "xul",
                 *             directAttributes: {
                 *               value: "This is a reader tab.",
                 *             },
                 *           },
                 *           {
                 *             tag: "label",
                 *             namespace: "xul",
                 *             directAttributes: {
                 *               value: `Reader: ${reader._title.slice(0, 20)}`,
                 *             },
                 *           },
                 *           {
                 *             tag: "label",
                 *             namespace: "xul",
                 *             directAttributes: {
                 *               value: `itemID: ${reader.itemID}.`,
                 *             },
                 *           },
                 *           {
                 *             tag: "button",
                 *             directAttributes: {
                 *               innerText: "Unregister",
                 *             },
                 *             listeners: [
                 *               {
                 *                 type: "click",
                 *                 listener: () => {
                 *                   this._Addon.toolkit.UI.unregisterReaderTabPanel(
                 *                     readerTabId
                 *                   );
                 *                 },
                 *               },
                 *             ],
                 *           },
                 *         ],
                 *       }
                 *     );
                 *     panel.append(elem);
                 *   },
                 *   {
                 *     tabId: readerTabId,
                 *   }
                 * );
                 * ```
                 */
                async register(tabLabel, renderPanelHook, options) {
                    var _a;
                    options = options || {
                        tabId: void 0,
                        panelId: void 0,
                        targetIndex: -1,
                        selectPanel: false,
                    };
                    if (
                        typeof this.readerTabCache.initializeLock ===
                        "undefined"
                    ) {
                        await this.initializeReaderTabObserver();
                    }
                    await ((_a = this.readerTabCache.initializeLock) === null ||
                    _a === void 0
                        ? void 0
                        : _a.promise);
                    const randomId = `${Zotero.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`;
                    const tabId =
                        options.tabId || `toolkit-readertab-${randomId}`;
                    const panelId =
                        options.panelId || `toolkit-readertabpanel-${randomId}`;
                    const targetIndex =
                        typeof options.targetIndex === "number"
                            ? options.targetIndex
                            : -1;
                    this.readerTabCache.optionsList.push({
                        tabId,
                        tabLabel,
                        panelId,
                        renderPanelHook,
                        targetIndex,
                        selectPanel: options.selectPanel,
                    });
                    await this.addReaderTabPanel();
                    return tabId;
                }
                /**
                 * Unregister the reader tabpanel.
                 * @param tabId tab id
                 */
                unregister(tabId) {
                    var _a;
                    const idx = this.readerTabCache.optionsList.findIndex(
                        (v) => v.tabId === tabId,
                    );
                    if (idx >= 0) {
                        this.readerTabCache.optionsList.splice(idx, 1);
                    }
                    if (this.readerTabCache.optionsList.length === 0) {
                        (_a = this.readerTabCache.observer) === null ||
                        _a === void 0
                            ? void 0
                            : _a.disconnect();
                        this.readerTabCache = {
                            optionsList: [],
                            observer: void 0,
                            initializeLock: void 0,
                        };
                    }
                    this.removeTabPanel(tabId);
                }
                /**
                 * Unregister all library tabpanel.
                 */
                unregisterAll() {
                    const tabIds = this.readerTabCache.optionsList.map(
                        (options) => options.tabId,
                    );
                    tabIds.forEach(this.unregister.bind(this));
                }
                changeTabPanel(tabId, options) {
                    const idx = this.readerTabCache.optionsList.findIndex(
                        (v) => v.tabId === tabId,
                    );
                    if (idx >= 0) {
                        Object.assign(
                            this.readerTabCache.optionsList[idx],
                            options,
                        );
                    }
                }
                removeTabPanel(tabId) {
                    const doc = this.getGlobal("document");
                    Array.prototype.forEach.call(
                        doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`),
                        (e) => {
                            e.remove();
                        },
                    );
                }
                async initializeReaderTabObserver() {
                    this.readerTabCache.initializeLock =
                        this.getGlobal("Zotero").Promise.defer();
                    await Promise.all([
                        Zotero.initializationPromise,
                        Zotero.unlockPromise,
                        Zotero.uiReadyPromise,
                    ]);
                    let lock = Zotero.Promise.defer();
                    lock.resolve();
                    const observer =
                        await this.readerTool.addReaderTabPanelDeckObserver(
                            async () => {
                                await lock.promise;
                                lock = Zotero.Promise.defer();
                                try {
                                    this.addReaderTabPanel();
                                } catch (e) {}
                                lock.resolve();
                            },
                        );
                    this.readerTabCache.observer = observer;
                    this.readerTabCache.initializeLock.resolve();
                }
                async addReaderTabPanel() {
                    var _a, _b;
                    const window2 = this.getGlobal("window");
                    const deck = this.readerTool.getReaderTabPanelDeck();
                    const reader = await this.readerTool.getReader();
                    if (!reader) {
                        return;
                    }
                    if (
                        ((_a = deck.selectedPanel) === null || _a === void 0
                            ? void 0
                            : _a.children[0].tagName) === "vbox"
                    ) {
                        const container = deck.selectedPanel;
                        container.innerHTML = "";
                        this.ui.appendElement(
                            {
                                tag: "tabbox",
                                classList: ["zotero-view-tabbox"],
                                attributes: {
                                    flex: "1",
                                },
                                enableElementRecord: false,
                                children: [
                                    {
                                        tag: "tabs",
                                        classList: ["zotero-editpane-tabs"],
                                        attributes: {
                                            orient: "horizontal",
                                        },
                                        enableElementRecord: false,
                                    },
                                    {
                                        tag: "tabpanels",
                                        classList: ["zotero-view-item"],
                                        attributes: {
                                            flex: "1",
                                        },
                                        enableElementRecord: false,
                                    },
                                ],
                            },
                            container,
                        );
                    }
                    let tabbox =
                        (_b = deck.selectedPanel) === null || _b === void 0
                            ? void 0
                            : _b.querySelector("tabbox");
                    if (!tabbox) {
                        return;
                    }
                    const tabs = tabbox.querySelector("tabs");
                    const tabpanels = tabbox.querySelector("tabpanels");
                    this.readerTabCache.optionsList.forEach((options) => {
                        const tabId = `${options.tabId}-${reader._instanceID}`;
                        const tabClass = `toolkit-ui-tabs-${options.tabId}`;
                        if (
                            tabs === null || tabs === void 0
                                ? void 0
                                : tabs.querySelector(`.${tabClass}`)
                        ) {
                            return;
                        }
                        const tab = this.ui.createElement(
                            window2.document,
                            "tab",
                            {
                                id: tabId,
                                classList: [tabClass],
                                attributes: {
                                    label: options.tabLabel,
                                },
                                ignoreIfExists: true,
                            },
                        );
                        const tabpanel = this.ui.createElement(
                            window2.document,
                            "tabpanel",
                            {
                                id: `${options.panelId}-${reader._instanceID}`,
                                classList: [tabClass],
                                ignoreIfExists: true,
                            },
                        );
                        if (options.targetIndex >= 0) {
                            tabs === null || tabs === void 0
                                ? void 0
                                : tabs
                                      .querySelectorAll("tab")
                                      [options.targetIndex].before(tab);
                            tabpanels === null || tabpanels === void 0
                                ? void 0
                                : tabpanels
                                      .querySelectorAll("tabpanel")
                                      [options.targetIndex].before(tabpanel);
                            if (
                                tabbox.getAttribute("toolkit-select-fixed") !==
                                "true"
                            ) {
                                tabbox.tabpanels.addEventListener(
                                    "select",
                                    () => {
                                        this.getGlobal("setTimeout")(() => {
                                            tabbox.tabpanels.selectedPanel =
                                                tabbox.tabs.getRelatedElement(
                                                    tabbox === null ||
                                                        tabbox === void 0
                                                        ? void 0
                                                        : tabbox.tabs
                                                              .selectedItem,
                                                );
                                        }, 0);
                                    },
                                );
                                tabbox.setAttribute(
                                    "toolkit-select-fixed",
                                    "true",
                                );
                            }
                        } else {
                            tabs === null || tabs === void 0
                                ? void 0
                                : tabs.appendChild(tab);
                            tabpanels === null || tabpanels === void 0
                                ? void 0
                                : tabpanels.appendChild(tabpanel);
                        }
                        if (options.selectPanel) {
                            tabbox.selectedTab = tab;
                        }
                        options.renderPanelHook(
                            tabpanel,
                            deck,
                            window2,
                            reader,
                        );
                    });
                }
            };
            exports.ReaderTabPanelManager = ReaderTabPanelManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/menu.js
    var require_menu = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/menu.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.MenuManager = void 0;
            var ui_1 = require_ui();
            var basic_1 = require_basic();
            var MenuManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.ui = new ui_1.UITool(this);
                }
                /**
                 * Insert an menu item/menu(with popup)/menuseprator into a menupopup
                 * @remarks
                 * options:
                 * ```ts
                 * export interface MenuitemOptions {
                 *   tag: "menuitem" | "menu" | "menuseparator";
                 *   id?: string;
                 *   label?: string;
                 *   // data url (chrome://xxx.png) or base64 url (data:image/png;base64,xxx)
                 *   icon?: string;
                 *   class?: string;
                 *   styles?: { [key: string]: string };
                 *   hidden?: boolean;
                 *   disabled?: boolean;
                 *   oncommand?: string;
                 *   commandListener?: EventListenerOrEventListenerObject;
                 *   // Attributes below are used when type === "menu"
                 *   popupId?: string;
                 *   onpopupshowing?: string;
                 *   subElementOptions?: Array<MenuitemOptions>;
                 * }
                 * ```
                 * @param menuPopup
                 * @param options
                 * @param insertPosition
                 * @param anchorElement The menuitem will be put before/after `anchorElement`. If not set, put at start/end of the menupopup.
                 * @example
                 * Insert menuitem with icon into item menupopup
                 * ```ts
                 * // base64 or chrome:// url
                 * const menuIcon = "chrome://addontemplate/content/icons/favicon@0.5x.png";
                 * ztoolkit.Menu.register("item", {
                 *   tag: "menuitem",
                 *   id: "zotero-itemmenu-addontemplate-test",
                 *   label: "Addon Template: Menuitem",
                 *   oncommand: "alert('Hello World! Default Menuitem.')",
                 *   icon: menuIcon,
                 * });
                 * ```
                 * @example
                 * Insert menu into file menupopup
                 * ```ts
                 * ztoolkit.Menu.register(
                 *   "menuFile",
                 *   {
                 *     tag: "menu",
                 *     label: "Addon Template: Menupopup",
                 *     subElementOptions: [
                 *       {
                 *         tag: "menuitem",
                 *         label: "Addon Template",
                 *         oncommand: "alert('Hello World! Sub Menuitem.')",
                 *       },
                 *     ],
                 *   },
                 *   "before",
                 *   Zotero.getMainWindow().document.querySelector(
                 *     "#zotero-itemmenu-addontemplate-test"
                 *   )
                 * );
                 * ```
                 */
                register(
                    menuPopup,
                    options,
                    insertPosition = "after",
                    anchorElement,
                ) {
                    let popup;
                    if (typeof menuPopup === "string") {
                        popup = this.getGlobal("document").querySelector(
                            MenuSelector[menuPopup],
                        );
                    } else {
                        popup = menuPopup;
                    }
                    if (!popup) {
                        return false;
                    }
                    const doc = popup.ownerDocument;
                    const generateElementOptions = (menuitemOption) => {
                        var _a;
                        const elementOption = {
                            tag: menuitemOption.tag,
                            id: menuitemOption.id,
                            namespace: "xul",
                            attributes: {
                                label: menuitemOption.label || "",
                                hidden: Boolean(menuitemOption.hidden),
                                disaled: Boolean(menuitemOption.disabled),
                                class: menuitemOption.class || "",
                                oncommand: menuitemOption.oncommand || "",
                            },
                            classList: menuitemOption.classList,
                            styles: menuitemOption.styles || {},
                            listeners: [],
                            children: [],
                        };
                        if (menuitemOption.icon) {
                            if (!this.getGlobal("Zotero").isMac) {
                                if (menuitemOption.tag === "menu") {
                                    elementOption.attributes["class"] +=
                                        " menu-iconic";
                                } else {
                                    elementOption.attributes["class"] +=
                                        " menuitem-iconic";
                                }
                            }
                            elementOption.styles["list-style-image"] =
                                `url(${menuitemOption.icon})`;
                        }
                        if (menuitemOption.tag === "menu") {
                            elementOption.children.push({
                                tag: "menupopup",
                                id: menuitemOption.popupId,
                                attributes: {
                                    onpopupshowing:
                                        menuitemOption.onpopupshowing || "",
                                },
                                children: (
                                    menuitemOption.children ||
                                    menuitemOption.subElementOptions ||
                                    []
                                ).map(generateElementOptions),
                            });
                        }
                        if (menuitemOption.commandListener) {
                            (_a = elementOption.listeners) === null ||
                            _a === void 0
                                ? void 0
                                : _a.push({
                                      type: "command",
                                      listener: menuitemOption.commandListener,
                                  });
                        }
                        return elementOption;
                    };
                    const props = generateElementOptions(options);
                    const menuItem = this.ui.createElement(
                        doc,
                        options.tag,
                        props,
                    );
                    if (!anchorElement) {
                        anchorElement =
                            insertPosition === "after"
                                ? popup.lastElementChild
                                : popup.firstElementChild;
                    }
                    anchorElement[insertPosition](menuItem);
                    if (options.getVisibility) {
                        popup.addEventListener("popupshowing", (ev) => {
                            const showing = options.getVisibility(menuItem, ev);
                            if (showing) {
                                menuItem.removeAttribute("hidden");
                            } else {
                                menuItem.setAttribute("hidden", "true");
                            }
                        });
                    }
                }
                unregister(menuId) {
                    var _a;
                    (_a = this.getGlobal("document").querySelector(
                        `#${menuId}`,
                    )) === null || _a === void 0
                        ? void 0
                        : _a.remove();
                }
                unregisterAll() {
                    this.ui.unregisterAll();
                }
            };
            exports.MenuManager = MenuManager;
            var MenuSelector;
            (function (MenuSelector2) {
                MenuSelector2["menuFile"] = "#menu_FilePopup";
                MenuSelector2["menuEdit"] = "#menu_EditPopup";
                MenuSelector2["menuView"] = "#menu_viewPopup";
                MenuSelector2["menuGo"] = "#menu_goPopup";
                MenuSelector2["menuTools"] = "#menu_ToolsPopup";
                MenuSelector2["menuHelp"] = "#menu_HelpPopup";
                MenuSelector2["collection"] = "#zotero-collectionmenu";
                MenuSelector2["item"] = "#zotero-itemmenu";
            })(MenuSelector || (MenuSelector = {}));
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/preferencePane.js
    var require_preferencePane = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/preferencePane.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.PreferencePaneManager = void 0;
            var ui_1 = require_ui();
            var basic_1 = require_basic();
            var PreferencePaneManager2 = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.alive = true;
                    this.ui = new ui_1.UITool(this);
                    this.prefPaneCache = { win: void 0, listeners: {} };
                }
                /**
                 * Register a preference pane from an xhtml, for Zotero 6 & 7.
                 * @remarks
                 * Don't forget to call `unregisterPrefPane` on exit.
                 * @remarks
                 * options:
                 * ```ts
                 * export interface PrefPaneOptions {
                 *   pluginID: string;
                 *   src: string;
                 *   id?: string;
                 *   parent?: string;
                 *   label?: string;
                 *   image?: string;
                 *   extraDTD?: string[];
                 *   scripts?: string[];
                 *   defaultXUL?: boolean;
                 *   // Only for Zotero 6
                 *   onload?: (win: Window) => any;
                 * }
                 * ```
                 *
                 * @param options See {@link PrefPaneOptions}
                 * @example
                 * ```ts
                 * const prefsManager = new PreferencePaneManager();
                 * function initPrefs() {
                 *   const prefOptions = {
                 *     pluginID: addonID,
                 *     src: rootURI + "chrome/content/preferences.xhtml",
                 *     label: "Template",
                 *     image: `chrome://${addonRef}/content/icons/favicon.png`,
                 *     extraDTD: [`chrome://${addonRef}/locale/overlay.dtd`],
                 *     defaultXUL: true
                 *   };
                 *   prefsManager.register(prefOptions);
                 * };
                 *
                 * function unInitPrefs() {
                 *   prefsManager.unregisterAll();
                 * };
                 * ```
                 * // bootstrap.js:startup
                 * initPrefs();
                 *
                 * // bootstrap.js:shutdown
                 * unInitPrefs();
                 */
                register(options) {
                    if (this.isZotero7()) {
                        this.getGlobal("Zotero").PreferencePanes.register(
                            options,
                        );
                        return;
                    }
                    const _initImportedNodesPostInsert = (container) => {
                        var _a;
                        const _observerSymbols = /* @__PURE__ */ new Map();
                        const Zotero2 = this.getGlobal("Zotero");
                        const window2 = container.ownerGlobal;
                        let useChecked = (elem) =>
                            (elem instanceof window2.HTMLInputElement &&
                                elem.type == "checkbox") ||
                            elem.tagName == "checkbox";
                        let syncFromPref = (elem, preference) => {
                            let value = Zotero2.Prefs.get(preference, true);
                            if (useChecked(elem)) {
                                elem.checked = value;
                            } else {
                                elem.value = value;
                            }
                            elem.dispatchEvent(
                                new window2.Event("syncfrompreference"),
                            );
                        };
                        let syncToPrefOnModify = (event) => {
                            const targetNode = event.currentTarget;
                            if (
                                targetNode === null || targetNode === void 0
                                    ? void 0
                                    : targetNode.getAttribute("preference")
                            ) {
                                let value = useChecked(targetNode)
                                    ? targetNode.checked
                                    : targetNode.value;
                                Zotero2.Prefs.set(
                                    targetNode.getAttribute("preference") || "",
                                    value,
                                    true,
                                );
                                targetNode.dispatchEvent(
                                    new window2.Event("synctopreference"),
                                );
                            }
                        };
                        let attachToPreference = (elem, preference) => {
                            Zotero2.debug(
                                `Attaching <${elem.tagName}> element to ${preference}`,
                            );
                            let symbol = Zotero2.Prefs.registerObserver(
                                preference,
                                () => syncFromPref(elem, preference),
                                true,
                            );
                            _observerSymbols.set(elem, symbol);
                        };
                        let detachFromPreference = (elem) => {
                            if (_observerSymbols.has(elem)) {
                                Zotero2.debug(
                                    `Detaching <${elem.tagName}> element from preference`,
                                );
                                Zotero2.Prefs.unregisterObserver(
                                    this._observerSymbols.get(elem),
                                );
                                _observerSymbols.delete(elem);
                            }
                        };
                        for (let elem of Array.from(
                            container.querySelectorAll("[preference]"),
                        )) {
                            let preference = elem.getAttribute("preference");
                            if (
                                container.querySelector(
                                    "preferences > preference#" + preference,
                                )
                            ) {
                                this.log(
                                    "<preference> is deprecated -- `preference` attribute values should be full preference keys, not <preference> IDs",
                                );
                                preference =
                                    (_a = container.querySelector(
                                        "preferences > preference#" +
                                            preference,
                                    )) === null || _a === void 0
                                        ? void 0
                                        : _a.getAttribute("name");
                            }
                            attachToPreference(elem, preference);
                            elem.addEventListener(
                                this.isXULElement(elem) ? "command" : "input",
                                syncToPrefOnModify,
                            );
                            window2.setTimeout(() => {
                                syncFromPref(elem, preference);
                            });
                        }
                        new window2.MutationObserver((mutations) => {
                            for (let mutation of mutations) {
                                if (mutation.type == "attributes") {
                                    let target = mutation.target;
                                    detachFromPreference(target);
                                    if (target.hasAttribute("preference")) {
                                        attachToPreference(
                                            target,
                                            target.getAttribute("preference") ||
                                                "",
                                        );
                                        target.addEventListener(
                                            this.isXULElement(target)
                                                ? "command"
                                                : "input",
                                            syncToPrefOnModify,
                                        );
                                    }
                                } else if (mutation.type == "childList") {
                                    for (let node of Array.from(
                                        mutation.removedNodes,
                                    )) {
                                        detachFromPreference(node);
                                    }
                                    for (let node of Array.from(
                                        mutation.addedNodes,
                                    )) {
                                        if (
                                            node.nodeType ==
                                                window2.Node.ELEMENT_NODE &&
                                            node.hasAttribute("preference")
                                        ) {
                                            attachToPreference(
                                                node,
                                                node.getAttribute(
                                                    "preference",
                                                ) || "",
                                            );
                                            node.addEventListener(
                                                this.isXULElement(node)
                                                    ? "command"
                                                    : "input",
                                                syncToPrefOnModify,
                                            );
                                        }
                                    }
                                }
                            }
                        }).observe(container, {
                            childList: true,
                            subtree: true,
                            attributeFilter: ["preference"],
                        });
                        for (let elem of Array.from(
                            container.querySelectorAll("[oncommand]"),
                        )) {
                            elem.oncommand = elem.getAttribute("oncommand");
                        }
                        for (let child of Array.from(container.children)) {
                            child.dispatchEvent(new window2.Event("load"));
                        }
                    };
                    const windowListener = {
                        onOpenWindow: (xulWindow) => {
                            if (!this.alive) {
                                return;
                            }
                            const win = xulWindow
                                .QueryInterface(
                                    Components.interfaces.nsIInterfaceRequestor,
                                )
                                .getInterface(
                                    Components.interfaces.nsIDOMWindow,
                                );
                            win.addEventListener(
                                "load",
                                async () => {
                                    var _a;
                                    if (
                                        win.location.href ===
                                        "chrome://zotero/content/preferences/preferences.xul"
                                    ) {
                                        this.log(
                                            "registerPrefPane:detected",
                                            options,
                                        );
                                        const Zotero2 =
                                            this.getGlobal("Zotero");
                                        options.id ||
                                            (options.id = `plugin-${Zotero2.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`);
                                        const contentOrXHR =
                                            await Zotero2.File.getContentsAsync(
                                                options.src,
                                            );
                                        const content =
                                            typeof contentOrXHR === "string"
                                                ? contentOrXHR
                                                : contentOrXHR.response;
                                        const src = `<prefpane xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="${options.id}" insertafter="zotero-prefpane-advanced" label="${options.label || options.pluginID}" image="${options.image || ""}">
                ${content}
                </prefpane>`;
                                        const frag =
                                            this.ui.parseXHTMLToFragment(
                                                src,
                                                options.extraDTD,
                                                options.defaultXUL,
                                            );
                                        this.log(frag);
                                        const prefWindow =
                                            win.document.querySelector(
                                                "prefwindow",
                                            );
                                        prefWindow.appendChild(frag);
                                        const prefPane =
                                            win.document.querySelector(
                                                `#${options.id}`,
                                            );
                                        prefWindow.addPane(prefPane);
                                        const contentBox =
                                            win.document.getAnonymousNodes(
                                                win.document.querySelector(
                                                    `#${options.id}`,
                                                ),
                                            )[0];
                                        contentBox.style.overflowY = "scroll";
                                        contentBox.style.height = "440px";
                                        win.sizeToContent();
                                        if (
                                            contentBox.scrollHeight ===
                                            contentBox.clientHeight
                                        ) {
                                            contentBox.style.overflowY =
                                                "hidden";
                                        }
                                        this.prefPaneCache.win = win;
                                        this.prefPaneCache.listeners[
                                            options.id
                                        ] = windowListener;
                                        _initImportedNodesPostInsert(prefPane);
                                        if (
                                            (_a = options.scripts) === null ||
                                            _a === void 0
                                                ? void 0
                                                : _a.length
                                        ) {
                                            options.scripts.forEach((script) =>
                                                Services.scriptloader.loadSubScript(
                                                    script,
                                                    win,
                                                ),
                                            );
                                        }
                                        if (options.onload) {
                                            options.onload(win);
                                        }
                                    }
                                },
                                false,
                            );
                        },
                    };
                    Services.wm.addListener(windowListener);
                }
                unregister(id) {
                    var _a;
                    const idx = Object.keys(
                        this.prefPaneCache.listeners,
                    ).indexOf(id);
                    if (idx < 0) {
                        return false;
                    }
                    const listener = this.prefPaneCache.listeners[id];
                    Services.wm.removeListener(listener);
                    listener.onOpenWindow = void 0;
                    const win = this.prefPaneCache.win;
                    if (win && !win.closed) {
                        (_a = win.document.querySelector(`#${id}`)) === null ||
                        _a === void 0
                            ? void 0
                            : _a.remove();
                    }
                    delete this.prefPaneCache.listeners[id];
                    return true;
                }
                /**
                 * Unregister all preference panes added with this instance
                 *
                 * Called on exiting
                 */
                unregisterAll() {
                    this.alive = false;
                    for (const id in this.prefPaneCache.listeners) {
                        this.unregister(id);
                    }
                }
            };
            exports.PreferencePaneManager = PreferencePaneManager2;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/shortcut.js
    var require_shortcut = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/shortcut.js"(
            exports,
        ) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ShortcutManager = void 0;
            var basic_1 = require_basic();
            var ui_1 = require_ui();
            var basic_2 = require_basic();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var ShortcutManager = class extends basic_2.ManagerTool {
                constructor(base) {
                    super(base);
                    this.ui = new ui_1.UITool(this);
                    this.creatorId = `${Zotero.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`;
                    this.initializeGlobal();
                }
                register(type, keyOptions) {
                    const _keyOptions = keyOptions;
                    _keyOptions.type = type;
                    switch (_keyOptions.type) {
                        case "event":
                            this.registerEventKey(_keyOptions);
                            return true;
                        case "element":
                            this.registerElementKey(_keyOptions);
                            return true;
                        case "prefs":
                            this.getGlobal("Zotero").Prefs.set(
                                _keyOptions.id,
                                _keyOptions.key || "",
                            );
                            return true;
                        default:
                            try {
                                if (_keyOptions.register) {
                                    return _keyOptions.register(_keyOptions);
                                } else {
                                    return false;
                                }
                            } catch (e) {
                                this.log(e);
                                return false;
                            }
                    }
                }
                /**
                 * Get all shortcuts(element, event, prefs, builtin)
                 */
                getAll() {
                    return Array.prototype.concat(
                        this.getMainWindowElementKeys(),
                        this.getEventKeys(),
                        this.getPrefsKeys(),
                        this.getBuiltinKeys(),
                    );
                }
                /**
                 * Check key conflicting of `inputKeyOptions`.
                 * @param inputKeyOptions
                 * @param options
                 * @returns conflicting keys array
                 */
                checkKeyConflicting(
                    inputKeyOptions,
                    options = { includeEmpty: false, customKeys: [] },
                ) {
                    var _a;
                    inputKeyOptions.modifiers = new KeyModifier(
                        inputKeyOptions.modifiers || "",
                    ).getRaw();
                    let allKeys = this.getAll();
                    if (
                        (_a = options.customKeys) === null || _a === void 0
                            ? void 0
                            : _a.length
                    ) {
                        allKeys = allKeys.concat(options.customKeys);
                    }
                    if (!options.includeEmpty) {
                        allKeys = allKeys.filter(
                            (_keyOptions) => _keyOptions.key,
                        );
                    }
                    return allKeys.filter((_keyOptions) => {
                        var _a2, _b;
                        return (
                            _keyOptions.id !== inputKeyOptions.id &&
                            ((_a2 = _keyOptions.key) === null || _a2 === void 0
                                ? void 0
                                : _a2.toLowerCase()) ===
                                ((_b = inputKeyOptions.key) === null ||
                                _b === void 0
                                    ? void 0
                                    : _b.toLowerCase()) &&
                            _keyOptions.modifiers === inputKeyOptions.modifiers
                        );
                    });
                }
                /**
                 * Find all key conflicting.
                 * @param options
                 * @returns An array of conflicting keys arrays. Same conflicting keys are put together.
                 */
                checkAllKeyConflicting(
                    options = { includeEmpty: false, customKeys: [] },
                ) {
                    var _a;
                    let allKeys = this.getAll();
                    if (
                        (_a = options.customKeys) === null || _a === void 0
                            ? void 0
                            : _a.length
                    ) {
                        allKeys = allKeys.concat(options.customKeys);
                    }
                    if (!options.includeEmpty) {
                        allKeys = allKeys.filter(
                            (_keyOptions) => _keyOptions.key,
                        );
                    }
                    const conflicting = [];
                    while (allKeys.length > 0) {
                        const checkKey = allKeys.pop();
                        const conflictKeys = allKeys.filter((_keyOptions) => {
                            var _a2, _b;
                            return (
                                ((_a2 = _keyOptions.key) === null ||
                                _a2 === void 0
                                    ? void 0
                                    : _a2.toLowerCase()) ===
                                    ((_b = checkKey.key) === null ||
                                    _b === void 0
                                        ? void 0
                                        : _b.toLowerCase()) &&
                                _keyOptions.modifiers === checkKey.modifiers
                            );
                        });
                        if (conflictKeys.length) {
                            conflictKeys.push(checkKey);
                            conflicting.push(conflictKeys);
                            const conflictingKeyIds = conflictKeys.map(
                                (key) => key.id,
                            );
                            const toRemoveIds = [];
                            allKeys.forEach(
                                (key, i) =>
                                    conflictingKeyIds.includes(key.id) &&
                                    toRemoveIds.push(i),
                            );
                            toRemoveIds
                                .sort((a, b) => b - a)
                                .forEach((id) => allKeys.splice(id, 1));
                        }
                    }
                    return conflicting;
                }
                /**
                 * Unregister a key.
                 * @remarks
                 * `builtin` keys cannot be unregistered.
                 * @param keyOptions
                 * @returns `true` for success and `false` for failure.
                 */
                async unregister(keyOptions) {
                    var _a;
                    switch (keyOptions.type) {
                        case "element":
                            (_a = (
                                keyOptions.xulData.document ||
                                this.getGlobal("document")
                            ).querySelector(`#${keyOptions.id}`)) === null ||
                            _a === void 0
                                ? void 0
                                : _a.remove();
                            return true;
                        case "prefs":
                            this.getGlobal("Zotero").Prefs.set(
                                keyOptions.id,
                                "",
                            );
                            return true;
                        case "builtin":
                            return false;
                        case "event":
                            let idx = this.globalCache.eventKeys.findIndex(
                                (currentKey) => currentKey.id === keyOptions.id,
                            );
                            while (idx >= 0) {
                                this.globalCache.eventKeys.splice(idx, 1);
                                idx = this.globalCache.eventKeys.findIndex(
                                    (currentKey) =>
                                        currentKey.id === keyOptions.id,
                                );
                            }
                            return true;
                        default:
                            try {
                                if (keyOptions.unregister) {
                                    return await keyOptions.unregister(
                                        keyOptions,
                                    );
                                } else {
                                    return false;
                                }
                            } catch (e) {
                                this.log(e);
                                return false;
                            }
                    }
                }
                /**
                 * Unregister all keys created by this instance.
                 */
                unregisterAll() {
                    this.ui.unregisterAll();
                    this.globalCache.eventKeys
                        .filter(
                            (keyOptions) =>
                                keyOptions.creatorId === this.creatorId,
                        )
                        .forEach((keyOptions) => this.unregister(keyOptions));
                }
                initializeGlobal() {
                    const Zotero2 = this.getGlobal("Zotero");
                    const window2 = this.getGlobal("window");
                    this.globalCache =
                        toolkitGlobal_1.default.getInstance().shortcut;
                    if (!this.globalCache._ready) {
                        this.globalCache._ready = true;
                        window2.addEventListener("keypress", (event) => {
                            let eventMods = [];
                            let eventModsWithAccel = [];
                            if (event.altKey) {
                                eventMods.push("alt");
                                eventModsWithAccel.push("alt");
                            }
                            if (event.shiftKey) {
                                eventMods.push("shift");
                                eventModsWithAccel.push("shift");
                            }
                            if (event.metaKey) {
                                eventMods.push("meta");
                                Zotero2.isMac &&
                                    eventModsWithAccel.push("accel");
                            }
                            if (event.ctrlKey) {
                                eventMods.push("control");
                                !Zotero2.isMac &&
                                    eventModsWithAccel.push("accel");
                            }
                            const eventModStr = new KeyModifier(
                                eventMods.join(","),
                            ).getRaw();
                            const eventModStrWithAccel = new KeyModifier(
                                eventMods.join(","),
                            ).getRaw();
                            this.globalCache.eventKeys.forEach((keyOptions) => {
                                var _a;
                                if (keyOptions.disabled) {
                                    return;
                                }
                                const modStr = new KeyModifier(
                                    keyOptions.modifiers || "",
                                ).getRaw();
                                if (
                                    (modStr === eventModStr ||
                                        modStr === eventModStrWithAccel) &&
                                    ((_a = keyOptions.key) === null ||
                                    _a === void 0
                                        ? void 0
                                        : _a.toLowerCase()) ===
                                        event.key.toLowerCase()
                                ) {
                                    keyOptions.callback();
                                }
                            });
                        });
                    }
                }
                registerEventKey(keyOptions) {
                    keyOptions.creatorId = this.creatorId;
                    this.globalCache.eventKeys.push(keyOptions);
                }
                /**
                 * Register Element \<commandset\>. In general, use `registerElementKey` or `registerKey`.
                 * @param commandSetOptions
                 */
                registerElementCommandset(commandSetOptions) {
                    var _a;
                    (_a =
                        commandSetOptions.document.querySelector("window")) ===
                        null || _a === void 0
                        ? void 0
                        : _a.appendChild(
                              this.ui.createElement(
                                  commandSetOptions.document,
                                  "commandset",
                                  {
                                      id: commandSetOptions.id,
                                      skipIfExists: true,
                                      children: commandSetOptions.commands.map(
                                          (cmd) => ({
                                              tag: "command",
                                              id: cmd.id,
                                              attributes: {
                                                  oncommand: cmd.oncommand,
                                                  disabled: cmd.disabled,
                                                  label: cmd.label,
                                              },
                                          }),
                                      ),
                                  },
                              ),
                          );
                }
                /**
                 * Register Element \<command\>. In general, use `registerElementKey` or `registerKey`.
                 * @param commandOptions
                 */
                registerElementCommand(commandOptions) {
                    var _a;
                    if (commandOptions._parentId) {
                        this.registerElementCommandset({
                            id: commandOptions._parentId,
                            document: commandOptions.document,
                            commands: [],
                        });
                    }
                    (_a = commandOptions.document.querySelector(
                        `commandset#${commandOptions._parentId}`,
                    )) === null || _a === void 0
                        ? void 0
                        : _a.appendChild(
                              this.ui.createElement(
                                  commandOptions.document,
                                  "command",
                                  {
                                      id: commandOptions.id,
                                      skipIfExists: true,
                                      attributes: {
                                          oncommand: commandOptions.oncommand,
                                          disabled: commandOptions.disabled,
                                          label: commandOptions.label,
                                      },
                                  },
                              ),
                          );
                }
                /**
                 * Register Element \<keyset\>. In general, use `registerElementKey` or `registerKey`.
                 * @param keySetOptions
                 */
                registerElementKeyset(keySetOptions) {
                    var _a;
                    (_a = keySetOptions.document.querySelector("window")) ===
                        null || _a === void 0
                        ? void 0
                        : _a.appendChild(
                              this.ui.createElement(
                                  keySetOptions.document,
                                  "keyset",
                                  {
                                      id: keySetOptions.id,
                                      skipIfExists: true,
                                      children: keySetOptions.keys.map(
                                          (keyOptions) => ({
                                              tag: "key",
                                              id: keyOptions.id,
                                              attributes: {
                                                  oncommand:
                                                      keyOptions.xulData
                                                          .oncommand || "//",
                                                  command:
                                                      keyOptions.xulData
                                                          .command,
                                                  modifiers:
                                                      keyOptions.modifiers,
                                                  key: this.getXULKey(
                                                      keyOptions.key,
                                                  ),
                                                  keycode: this.getXULKeyCode(
                                                      keyOptions.key,
                                                  ),
                                                  disabled: keyOptions.disabled,
                                              },
                                          }),
                                      ),
                                  },
                              ),
                          );
                }
                /**
                 * Register a shortcut key element \<key\>.
                 * @remarks
                 * Provide `_parentId` to register a \<keyset\>;
                 *
                 * Provide `_commandOptions` to register a \<command\>;
                 *
                 * Provide `_parentId` in `_commandOptions` to register a \<commandset\>.
                 *
                 * See examples for more details.
                 * @param keyOptions
                 * @example
                 */
                registerElementKey(keyOptions) {
                    var _a;
                    const doc =
                        keyOptions.xulData.document ||
                        this.getGlobal("document");
                    if (keyOptions.xulData._parentId) {
                        this.registerElementKeyset({
                            id: keyOptions.xulData._parentId,
                            document: doc,
                            keys: [],
                        });
                    }
                    (_a = doc.querySelector(
                        `keyset#${keyOptions.xulData._parentId}`,
                    )) === null || _a === void 0
                        ? void 0
                        : _a.appendChild(
                              this.ui.createElement(doc, "key", {
                                  id: keyOptions.id,
                                  skipIfExists: true,
                                  attributes: {
                                      oncommand:
                                          keyOptions.xulData.oncommand || "//",
                                      command: keyOptions.xulData.command,
                                      modifiers: keyOptions.modifiers,
                                      key: this.getXULKey(keyOptions.key),
                                      keycode: this.getXULKeyCode(
                                          keyOptions.key,
                                      ),
                                      disabled: keyOptions.disabled,
                                  },
                              }),
                          );
                    if (keyOptions.xulData._commandOptions) {
                        this.registerElementCommand(
                            keyOptions.xulData._commandOptions,
                        );
                    }
                }
                getXULKey(standardKey) {
                    if (standardKey.length === 1) {
                        return standardKey;
                    }
                    return void 0;
                }
                getXULKeyCode(standardKey) {
                    const idx = Object.values(XUL_KEYCODE_MAPS).findIndex(
                        (value) => value === standardKey,
                    );
                    if (idx >= 0) {
                        return Object.values(XUL_KEYCODE_MAPS)[idx];
                    }
                    return void 0;
                }
                getStandardKey(XULKey, XULKeyCode) {
                    if (
                        XULKeyCode &&
                        Object.keys(XUL_KEYCODE_MAPS).includes(XULKeyCode)
                    ) {
                        return XUL_KEYCODE_MAPS[XULKeyCode];
                    } else {
                        return XULKey;
                    }
                }
                /**
                 * Get all \<commandset\> details.
                 * @param doc
                 */
                getElementCommandSets(doc) {
                    return Array.from(
                        (doc || this.getGlobal("document")).querySelectorAll(
                            "commandset",
                        ),
                    ).map((cmdSet) => ({
                        id: cmdSet.id,
                        commands: Array.from(
                            cmdSet.querySelectorAll("command"),
                        ).map((cmd) => ({
                            id: cmd.id,
                            oncommand: cmd.getAttribute("oncommand"),
                            disabled: cmd.getAttribute("disabled") === "true",
                            label: cmd.getAttribute("label"),
                            _parentId: cmdSet.id,
                        })),
                    }));
                }
                /**
                 * Get all \<command\> details.
                 * @param doc
                 */
                getElementCommands(doc) {
                    return Array.prototype.concat(
                        ...this.getElementCommandSets(doc).map(
                            (cmdSet) => cmdSet.commands,
                        ),
                    );
                }
                /**
                 * Get all \<keyset\> details.
                 * @param doc
                 * @param options
                 */
                getElementKeySets(doc) {
                    let allCommends = this.getElementCommands(doc);
                    return Array.from(
                        (doc || this.getGlobal("document")).querySelectorAll(
                            "keyset",
                        ),
                    ).map((keysetElem) => ({
                        id: keysetElem.id,
                        document: doc,
                        keys: Array.from(
                            keysetElem.querySelectorAll("key"),
                        ).map((keyElem) => {
                            const oncommand =
                                keyElem.getAttribute("oncommand") || "";
                            const commandId =
                                keyElem.getAttribute("command") || "";
                            const commandOptions = allCommends.find(
                                (cmd) => cmd.id === commandId,
                            );
                            const key = {
                                type: "element",
                                id: keyElem.id,
                                key: this.getStandardKey(
                                    keyElem.getAttribute("key") || "",
                                    keyElem.getAttribute("keycode") || "",
                                ),
                                modifiers: new KeyModifier(
                                    keyElem.getAttribute("modifiers") || "",
                                ).getRaw(),
                                disabled:
                                    keyElem.getAttribute("disabled") === "true",
                                xulData: {
                                    document: doc,
                                    oncommand,
                                    command: commandId,
                                    _parentId: keysetElem.id,
                                    _commandOptions: commandOptions,
                                },
                                callback: () => {
                                    const win = doc.ownerGlobal;
                                    const _eval = win.eval;
                                    _eval(oncommand);
                                    _eval(
                                        (commandOptions === null ||
                                        commandOptions === void 0
                                            ? void 0
                                            : commandOptions.oncommand) || "",
                                    );
                                },
                            };
                            return key;
                        }),
                    }));
                }
                /**
                 * Get all \<key\> details.
                 * @param doc
                 * @param options
                 */
                getElementKeys(doc) {
                    return Array.prototype
                        .concat(
                            ...this.getElementKeySets(doc).map(
                                (keyset) => keyset.keys,
                            ),
                        )
                        .filter(
                            (elemKey) => !ELEM_KEY_IGNORE.includes(elemKey.id),
                        );
                }
                /**
                 * Get \<key\> details in main window.
                 * @param options
                 */
                getMainWindowElementKeys() {
                    return this.getElementKeys(this.getGlobal("document"));
                }
                getEventKeys() {
                    return this.globalCache.eventKeys;
                }
                /**
                 * Get Zotero builtin keys defined in preferences.
                 */
                getPrefsKeys() {
                    const Zotero2 = this.getGlobal("Zotero");
                    return PREF_KEYS.map((pref) => ({
                        id: pref.id,
                        modifiers: pref.modifiers,
                        key: Zotero2.Prefs.get(pref.id),
                        callback: pref.callback,
                        type: "prefs",
                    }));
                }
                /**
                 * Get Zotero builtin keys not defined in preferences.
                 */
                getBuiltinKeys() {
                    return BUILTIN_KEYS.map((builtin) => ({
                        id: builtin.id,
                        modifiers: builtin.modifiers,
                        key: builtin.key,
                        callback: builtin.callback,
                        type: "builtin",
                    }));
                }
            };
            exports.ShortcutManager = ShortcutManager;
            var KeyModifier = class {
                constructor(raw) {
                    raw = raw || "";
                    this.accel = raw.includes("accel");
                    this.shift = raw.includes("shift");
                    this.control = raw.includes("control");
                    this.meta = raw.includes("meta");
                    this.alt = raw.includes("alt");
                }
                equals(newMod) {
                    this.accel === newMod.accel;
                    this.shift === newMod.shift;
                    this.control === newMod.control;
                    this.meta === newMod.meta;
                    this.alt === newMod.alt;
                }
                getRaw() {
                    const enabled = [];
                    this.accel && enabled.push("accel");
                    this.shift && enabled.push("shift");
                    this.control && enabled.push("control");
                    this.meta && enabled.push("meta");
                    this.alt && enabled.push("alt");
                    return enabled.join(",");
                }
            };
            var XUL_KEYCODE_MAPS;
            (function (XUL_KEYCODE_MAPS2) {
                XUL_KEYCODE_MAPS2["VK_CANCEL"] = "Unidentified";
                XUL_KEYCODE_MAPS2["VK_BACK"] = "Backspace";
                XUL_KEYCODE_MAPS2["VK_TAB"] = "Tab";
                XUL_KEYCODE_MAPS2["VK_CLEAR"] = "Clear";
                XUL_KEYCODE_MAPS2["VK_RETURN"] = "Enter";
                XUL_KEYCODE_MAPS2["VK_ENTER"] = "Enter";
                XUL_KEYCODE_MAPS2["VK_SHIFT"] = "Shift";
                XUL_KEYCODE_MAPS2["VK_CONTROL"] = "Control";
                XUL_KEYCODE_MAPS2["VK_ALT"] = "Alt";
                XUL_KEYCODE_MAPS2["VK_PAUSE"] = "Pause";
                XUL_KEYCODE_MAPS2["VK_CAPS_LOCK"] = "CapsLock";
                XUL_KEYCODE_MAPS2["VK_ESCAPE"] = "Escape";
                XUL_KEYCODE_MAPS2["VK_SPACE"] = " ";
                XUL_KEYCODE_MAPS2["VK_PAGE_UP"] = "PageUp";
                XUL_KEYCODE_MAPS2["VK_PAGE_DOWN"] = "PageDown";
                XUL_KEYCODE_MAPS2["VK_END"] = "End";
                XUL_KEYCODE_MAPS2["VK_HOME"] = "Home";
                XUL_KEYCODE_MAPS2["VK_LEFT"] = "ArrowLeft";
                XUL_KEYCODE_MAPS2["VK_UP"] = "ArrowUp";
                XUL_KEYCODE_MAPS2["VK_RIGHT"] = "ArrowRight";
                XUL_KEYCODE_MAPS2["VK_DOWN"] = "ArrowDown";
                XUL_KEYCODE_MAPS2["VK_PRINTSCREEN"] = "PrintScreen";
                XUL_KEYCODE_MAPS2["VK_INSERT"] = "Insert";
                XUL_KEYCODE_MAPS2["VK_DELETE"] = "Backspace";
                XUL_KEYCODE_MAPS2["VK_0"] = "0";
                XUL_KEYCODE_MAPS2["VK_1"] = "1";
                XUL_KEYCODE_MAPS2["VK_2"] = "2";
                XUL_KEYCODE_MAPS2["VK_3"] = "3";
                XUL_KEYCODE_MAPS2["VK_4"] = "4";
                XUL_KEYCODE_MAPS2["VK_5"] = "5";
                XUL_KEYCODE_MAPS2["VK_6"] = "6";
                XUL_KEYCODE_MAPS2["VK_7"] = "7";
                XUL_KEYCODE_MAPS2["VK_8"] = "8";
                XUL_KEYCODE_MAPS2["VK_9"] = "9";
                XUL_KEYCODE_MAPS2["VK_A"] = "A";
                XUL_KEYCODE_MAPS2["VK_B"] = "B";
                XUL_KEYCODE_MAPS2["VK_C"] = "C";
                XUL_KEYCODE_MAPS2["VK_D"] = "D";
                XUL_KEYCODE_MAPS2["VK_E"] = "E";
                XUL_KEYCODE_MAPS2["VK_F"] = "F";
                XUL_KEYCODE_MAPS2["VK_G"] = "G";
                XUL_KEYCODE_MAPS2["VK_H"] = "H";
                XUL_KEYCODE_MAPS2["VK_I"] = "I";
                XUL_KEYCODE_MAPS2["VK_J"] = "J";
                XUL_KEYCODE_MAPS2["VK_K"] = "K";
                XUL_KEYCODE_MAPS2["VK_L"] = "L";
                XUL_KEYCODE_MAPS2["VK_M"] = "M";
                XUL_KEYCODE_MAPS2["VK_N"] = "N";
                XUL_KEYCODE_MAPS2["VK_O"] = "O";
                XUL_KEYCODE_MAPS2["VK_P"] = "P";
                XUL_KEYCODE_MAPS2["VK_Q"] = "Q";
                XUL_KEYCODE_MAPS2["VK_R"] = "R";
                XUL_KEYCODE_MAPS2["VK_S"] = "S";
                XUL_KEYCODE_MAPS2["VK_T"] = "T";
                XUL_KEYCODE_MAPS2["VK_U"] = "U";
                XUL_KEYCODE_MAPS2["VK_V"] = "V";
                XUL_KEYCODE_MAPS2["VK_W"] = "W";
                XUL_KEYCODE_MAPS2["VK_X"] = "X";
                XUL_KEYCODE_MAPS2["VK_Y"] = "Y";
                XUL_KEYCODE_MAPS2["VK_Z"] = "Z";
                XUL_KEYCODE_MAPS2["VK_SEMICOLON"] = "Unidentified";
                XUL_KEYCODE_MAPS2["VK_EQUALS"] = "Unidentified";
                XUL_KEYCODE_MAPS2["VK_NUMPAD0"] = "0";
                XUL_KEYCODE_MAPS2["VK_NUMPAD1"] = "1";
                XUL_KEYCODE_MAPS2["VK_NUMPAD2"] = "2";
                XUL_KEYCODE_MAPS2["VK_NUMPAD3"] = "3";
                XUL_KEYCODE_MAPS2["VK_NUMPAD4"] = "4";
                XUL_KEYCODE_MAPS2["VK_NUMPAD5"] = "5";
                XUL_KEYCODE_MAPS2["VK_NUMPAD6"] = "6";
                XUL_KEYCODE_MAPS2["VK_NUMPAD7"] = "7";
                XUL_KEYCODE_MAPS2["VK_NUMPAD8"] = "8";
                XUL_KEYCODE_MAPS2["VK_NUMPAD9"] = "9";
                XUL_KEYCODE_MAPS2["VK_MULTIPLY"] = "Multiply";
                XUL_KEYCODE_MAPS2["VK_ADD"] = "Add";
                XUL_KEYCODE_MAPS2["VK_SEPARATOR"] = "Separator";
                XUL_KEYCODE_MAPS2["VK_SUBTRACT"] = "Subtract";
                XUL_KEYCODE_MAPS2["VK_DECIMAL"] = "Decimal";
                XUL_KEYCODE_MAPS2["VK_DIVIDE"] = "Divide";
                XUL_KEYCODE_MAPS2["VK_F1"] = "F1";
                XUL_KEYCODE_MAPS2["VK_F2"] = "F2";
                XUL_KEYCODE_MAPS2["VK_F3"] = "F3";
                XUL_KEYCODE_MAPS2["VK_F4"] = "F4";
                XUL_KEYCODE_MAPS2["VK_F5"] = "F5";
                XUL_KEYCODE_MAPS2["VK_F6"] = "F6";
                XUL_KEYCODE_MAPS2["VK_F7"] = "F7";
                XUL_KEYCODE_MAPS2["VK_F8"] = "F8";
                XUL_KEYCODE_MAPS2["VK_F9"] = "F9";
                XUL_KEYCODE_MAPS2["VK_F10"] = "F10";
                XUL_KEYCODE_MAPS2["VK_F11"] = "F11";
                XUL_KEYCODE_MAPS2["VK_F12"] = "F12";
                XUL_KEYCODE_MAPS2["VK_F13"] = "F13";
                XUL_KEYCODE_MAPS2["VK_F14"] = "F14";
                XUL_KEYCODE_MAPS2["VK_F15"] = "F15";
                XUL_KEYCODE_MAPS2["VK_F16"] = "F16";
                XUL_KEYCODE_MAPS2["VK_F17"] = "F17";
                XUL_KEYCODE_MAPS2["VK_F18"] = "F18";
                XUL_KEYCODE_MAPS2["VK_F19"] = "F19";
                XUL_KEYCODE_MAPS2["VK_F20"] = "F20";
                XUL_KEYCODE_MAPS2["VK_F21"] = "Soft1";
                XUL_KEYCODE_MAPS2["VK_F22"] = "Soft2";
                XUL_KEYCODE_MAPS2["VK_F23"] = "Soft3";
                XUL_KEYCODE_MAPS2["VK_F24"] = "Soft4";
                XUL_KEYCODE_MAPS2["VK_NUM_LOCK"] = "NumLock";
                XUL_KEYCODE_MAPS2["VK_SCROLL_LOCK"] = "ScrollLock";
                XUL_KEYCODE_MAPS2["VK_COMMA"] = ",";
                XUL_KEYCODE_MAPS2["VK_PERIOD"] = ".";
                XUL_KEYCODE_MAPS2["VK_SLASH"] = "Divide";
                XUL_KEYCODE_MAPS2["VK_BACK_QUOTE"] = "`";
                XUL_KEYCODE_MAPS2["VK_OPEN_BRACKET"] = "[";
                XUL_KEYCODE_MAPS2["VK_CLOSE_BRACKET"] = "]";
                XUL_KEYCODE_MAPS2["VK_QUOTE"] = "\\";
                XUL_KEYCODE_MAPS2["VK_HELP"] = "Help";
            })(XUL_KEYCODE_MAPS || (XUL_KEYCODE_MAPS = {}));
            function getElementKeyCallback(keyId) {
                return function () {
                    var _a;
                    const win = basic_1.BasicTool.getZotero().getMainWindow();
                    const keyElem = win.document.querySelector(`#${keyId}`);
                    if (!keyElem) {
                        return function () {};
                    }
                    const _eval = win.eval;
                    _eval(keyElem.getAttribute("oncommand") || "//");
                    const cmdId = keyElem.getAttribute("command");
                    if (!cmdId) {
                        return;
                    }
                    _eval(
                        ((_a = win.document.querySelector(`#${cmdId}`)) ===
                            null || _a === void 0
                            ? void 0
                            : _a.getAttribute("oncommand")) || "//",
                    );
                };
            }
            function getBuiltinEventKeyCallback(eventId) {
                return function () {
                    const Zotero2 = basic_1.BasicTool.getZotero();
                    const ZoteroPane = Zotero2.getActiveZoteroPane();
                    ZoteroPane.handleKeyPress({
                        metaKey: true,
                        ctrlKey: true,
                        shiftKey: true,
                        originalTarget: { id: "" },
                        preventDefault: () => {},
                        key: Zotero2.Prefs.get(
                            `extensions.zotero.keys.${eventId}`,
                            true,
                        ),
                    });
                };
            }
            var ELEM_KEY_IGNORE = ["key_copyCitation", "key_copyBibliography"];
            var PREF_KEYS = [
                {
                    id: "extensions.zotero.keys.copySelectedItemCitationsToClipboard",
                    modifiers: "accel,shift",
                    elemId: "key_copyCitation",
                    callback: getElementKeyCallback("key_copyCitation"),
                },
                {
                    id: "extensions.zotero.keys.copySelectedItemsToClipboard",
                    modifiers: "accel,shift",
                    elemId: "key_copyBibliography",
                    callback: getElementKeyCallback("key_copyBibliography"),
                },
                {
                    id: "extensions.zotero.keys.library",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("library"),
                },
                {
                    id: "extensions.zotero.keys.newItem",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("newItem"),
                },
                {
                    id: "extensions.zotero.keys.newNote",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("newNote"),
                },
                {
                    id: "extensions.zotero.keys.quicksearch",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("quicksearch"),
                },
                {
                    id: "extensions.zotero.keys.saveToZotero",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("saveToZotero"),
                },
                {
                    id: "extensions.zotero.keys.sync",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("sync"),
                },
                {
                    id: "extensions.zotero.keys.toggleAllRead",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("toggleAllRead"),
                },
                {
                    id: "extensions.zotero.keys.toggleRead",
                    modifiers: "accel,shift",
                    callback: getBuiltinEventKeyCallback("toggleRead"),
                },
            ];
            var BUILTIN_KEYS = [
                {
                    id: "showItemCollection",
                    modifiers: "",
                    key: "Ctrl",
                    callback: () => {
                        const Zotero2 = basic_1.BasicTool.getZotero();
                        const ZoteroPane = Zotero2.getActiveZoteroPane();
                        ZoteroPane.handleKeyUp({
                            originalTarget: {
                                id: ZoteroPane.itemsView
                                    ? ZoteroPane.itemsView.id
                                    : "",
                            },
                            keyCode: Zotero2.isWin ? 17 : 18,
                        });
                    },
                },
                {
                    id: "closeSelectedTab",
                    modifiers: "accel",
                    key: "W",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        if (ztabs.selectedIndex > 0) {
                            ztabs.close("");
                        }
                    },
                },
                {
                    id: "undoCloseTab",
                    modifiers: "accel,shift",
                    key: "T",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.undoClose();
                    },
                },
                {
                    id: "selectNextTab",
                    modifiers: "control",
                    key: "Tab",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.selectPrev();
                    },
                },
                {
                    id: "selectPreviousTab",
                    modifiers: "control,shift",
                    key: "Tab",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.selectNext();
                    },
                },
                {
                    id: "selectTab1",
                    modifiers: "accel",
                    key: "1",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(0);
                    },
                },
                {
                    id: "selectTab2",
                    modifiers: "accel",
                    key: "2",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(1);
                    },
                },
                {
                    id: "selectTab3",
                    modifiers: "accel",
                    key: "3",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(2);
                    },
                },
                {
                    id: "selectTab4",
                    modifiers: "accel",
                    key: "4",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(3);
                    },
                },
                {
                    id: "selectTab5",
                    modifiers: "accel",
                    key: "5",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(4);
                    },
                },
                {
                    id: "selectTab6",
                    modifiers: "accel",
                    key: "6",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(5);
                    },
                },
                {
                    id: "selectTab7",
                    modifiers: "accel",
                    key: "7",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(6);
                    },
                },
                {
                    id: "selectTab8",
                    modifiers: "accel",
                    key: "8",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.jump(7);
                    },
                },
                {
                    id: "selectTabLast",
                    modifiers: "accel",
                    key: "9",
                    callback: () => {
                        const ztabs =
                            basic_1.BasicTool.getZotero().getMainWindow()
                                .Zotero_Tabs;
                        ztabs.selectLast();
                    },
                },
            ];
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/clipboard.js
    var require_clipboard = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/clipboard.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ClipboardHelper = void 0;
            var basic_1 = require_basic();
            var ClipboardHelper = class extends basic_1.BasicTool {
                constructor() {
                    super();
                    this.filePath = "";
                    this.transferable = Components.classes[
                        "@mozilla.org/widget/transferable;1"
                    ].createInstance(Components.interfaces.nsITransferable);
                    this.clipboardService = Components.classes[
                        "@mozilla.org/widget/clipboard;1"
                    ].getService(Components.interfaces.nsIClipboard);
                    this.transferable.init(null);
                }
                addText(source, type = "text/plain") {
                    const str = Components.classes[
                        "@mozilla.org/supports-string;1"
                    ].createInstance(Components.interfaces.nsISupportsString);
                    str.data = source;
                    if (this.isFX115() && type === "text/unicode")
                        type = "text/plain";
                    this.transferable.addDataFlavor(type);
                    this.transferable.setTransferData(
                        type,
                        str,
                        source.length * 2,
                    );
                    return this;
                }
                addImage(source) {
                    let parts = source.split(",");
                    if (!parts[0].includes("base64")) {
                        return this;
                    }
                    let mime = parts[0].match(/:(.*?);/)[1];
                    let bstr = this.getGlobal("window").atob(parts[1]);
                    let n = bstr.length;
                    let u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    let imgTools = Components.classes[
                        "@mozilla.org/image/tools;1"
                    ].getService(Components.interfaces.imgITools);
                    let mimeType;
                    let img;
                    if (this.getGlobal("Zotero").platformMajorVersion >= 102) {
                        img = imgTools.decodeImageFromArrayBuffer(
                            u8arr.buffer,
                            mime,
                        );
                        mimeType = "application/x-moz-nativeimage";
                    } else {
                        mimeType = `image/png`;
                        img = Components.classes[
                            "@mozilla.org/supports-interface-pointer;1"
                        ].createInstance(
                            Components.interfaces.nsISupportsInterfacePointer,
                        );
                        img.data = imgTools.decodeImageFromArrayBuffer(
                            u8arr.buffer,
                            mimeType,
                        );
                    }
                    this.transferable.addDataFlavor(mimeType);
                    this.transferable.setTransferData(mimeType, img, 0);
                    return this;
                }
                addFile(path) {
                    const file = Components.classes[
                        "@mozilla.org/file/local;1"
                    ].createInstance(Components.interfaces.nsIFile);
                    file.initWithPath(path);
                    this.transferable.addDataFlavor("application/x-moz-file");
                    this.transferable.setTransferData(
                        "application/x-moz-file",
                        file,
                    );
                    this.filePath = path;
                    return this;
                }
                copy() {
                    try {
                        this.clipboardService.setData(
                            this.transferable,
                            null,
                            Components.interfaces.nsIClipboard.kGlobalClipboard,
                        );
                    } catch (e) {
                        if (this.filePath && Zotero.isMac) {
                            Zotero.Utilities.Internal.exec(
                                `/usr/bin/osascript`,
                                [
                                    `-e`,
                                    `set the clipboard to POSIX file "${this.filePath}"`,
                                ],
                            );
                        } else {
                            throw e;
                        }
                    }
                    return this;
                }
            };
            exports.ClipboardHelper = ClipboardHelper;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/filePicker.js
    var require_filePicker = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/filePicker.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.FilePickerHelper = void 0;
            var basic_1 = require_basic();
            var FilePickerHelper = class extends basic_1.BasicTool {
                constructor(
                    title,
                    mode,
                    filters,
                    suggestion,
                    window2,
                    filterMask,
                ) {
                    super();
                    this.title = title;
                    this.mode = mode;
                    this.filters = filters;
                    this.suggestion = suggestion;
                    this.window = window2;
                    this.filterMask = filterMask;
                }
                async open() {
                    let backend;
                    if (Zotero.platformMajorVersion >= 115) {
                        backend = ChromeUtils.importESModule(
                            "chrome://zotero/content/modules/filePicker.mjs",
                        ).FilePicker;
                    } else {
                        backend = this.getGlobal("require")(
                            "zotero/modules/filePicker",
                        ).default;
                    }
                    const fp = new backend();
                    fp.init(
                        this.window || this.getGlobal("window"),
                        this.title,
                        this.getMode(fp),
                    );
                    for (const [label, ext] of this.filters || []) {
                        fp.appendFilter(label, ext);
                    }
                    if (this.filterMask)
                        fp.appendFilters(this.getFilterMask(fp));
                    if (this.suggestion) fp.defaultString = this.suggestion;
                    const userChoice = await fp.show();
                    switch (userChoice) {
                        case fp.returnOK:
                        case fp.returnReplace:
                            return this.mode === "multiple"
                                ? fp.files
                                : fp.file;
                        default:
                            return false;
                    }
                }
                getMode(fp) {
                    switch (this.mode) {
                        case "open":
                            return fp.modeOpen;
                        case "save":
                            return fp.modeSave;
                        case "folder":
                            return fp.modeGetFolder;
                        case "multiple":
                            return fp.modeOpenMultiple;
                        default:
                            return 0;
                    }
                }
                getFilterMask(fp) {
                    switch (this.filterMask) {
                        case "all":
                            return fp.filterAll;
                        case "html":
                            return fp.filterHTML;
                        case "text":
                            return fp.filterText;
                        case "images":
                            return fp.filterImages;
                        case "xml":
                            return fp.filterXML;
                        case "apps":
                            return fp.filterApps;
                        case "urls":
                            return fp.filterAllowURLs;
                        case "audio":
                            return fp.filterAudio;
                        case "video":
                            return fp.filterVideo;
                        default:
                            return 1;
                    }
                }
            };
            exports.FilePickerHelper = FilePickerHelper;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/progressWindow.js
    var require_progressWindow = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/progressWindow.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ProgressWindowHelper = void 0;
            var basic_1 = require_basic();
            var ProgressWindowHelper = class extends Zotero.ProgressWindow {
                /**
                 *
                 * @param header window header
                 * @param options
                 */
                constructor(
                    header,
                    options = {
                        closeOnClick: true,
                        closeTime: 5e3,
                    },
                ) {
                    super(options);
                    this.lines = [];
                    this.closeTime = options.closeTime || 5e3;
                    this.changeHeadline(header);
                    this.originalShow = this.show;
                    this.show = this.showWithTimer;
                    if (options.closeOtherProgressWindows) {
                        basic_1.BasicTool.getZotero().ProgressWindowSet.closeAll();
                    }
                }
                /**
                 * Create a new line
                 * @param options
                 */
                createLine(options) {
                    const icon = this.getIcon(options.type, options.icon);
                    const line = new this.ItemProgress(
                        icon || "",
                        options.text || "",
                    );
                    if (typeof options.progress === "number") {
                        line.setProgress(options.progress);
                    }
                    this.lines.push(line);
                    return this;
                }
                /**
                 * Change the line content
                 * @param options
                 */
                changeLine(options) {
                    var _a;
                    if (
                        ((_a = this.lines) === null || _a === void 0
                            ? void 0
                            : _a.length) === 0
                    ) {
                        return this;
                    }
                    const idx =
                        typeof options.idx !== "undefined" &&
                        options.idx >= 0 &&
                        options.idx < this.lines.length
                            ? options.idx
                            : 0;
                    const icon = this.getIcon(options.type, options.icon);
                    options.text && this.lines[idx].setText(options.text);
                    icon && this.lines[idx].setIcon(icon);
                    typeof options.progress === "number" &&
                        this.lines[idx].setProgress(options.progress);
                    return this;
                }
                showWithTimer(closeTime = void 0) {
                    this.originalShow();
                    typeof closeTime !== "undefined" &&
                        (this.closeTime = closeTime);
                    if (this.closeTime && this.closeTime > 0) {
                        this.startCloseTimer(this.closeTime);
                    }
                    return this;
                }
                /**
                 * Set custom icon uri for progress window
                 * @param key
                 * @param uri
                 */
                static setIconURI(key, uri) {
                    icons[key] = uri;
                }
                getIcon(type, defaultIcon) {
                    return type && type in icons ? icons[type] : defaultIcon;
                }
            };
            exports.ProgressWindowHelper = ProgressWindowHelper;
            var icons = {
                success: "chrome://zotero/skin/tick.png",
                fail: "chrome://zotero/skin/cross.png",
            };
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/virtualizedTable.js
    var require_virtualizedTable = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/virtualizedTable.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.VirtualizedTableHelper = void 0;
            var basic_1 = require_basic();
            var VirtualizedTableHelper = class extends basic_1.BasicTool {
                constructor(win) {
                    super();
                    this.window = win;
                    const Zotero2 = this.getGlobal("Zotero");
                    const _require = win.require;
                    this.React = _require("react");
                    this.ReactDOM = _require("react-dom");
                    this.VirtualizedTable = _require(
                        "components/virtualized-table",
                    );
                    this.IntlProvider = _require("react-intl").IntlProvider;
                    this.props = {
                        id: `${Zotero2.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`,
                        getRowCount: () => 0,
                    };
                    this.localeStrings = Zotero2.Intl.strings;
                }
                setProp(...args) {
                    if (args.length === 1) {
                        Object.assign(this.props, args[0]);
                    } else if (args.length === 2) {
                        this.props[args[0]] = args[1];
                    }
                    return this;
                }
                /**
                 * Set locale strings, which replaces the table header's label if matches. Default it's `Zotero.Intl.strings`
                 * @param localeStrings
                 */
                setLocale(localeStrings) {
                    Object.assign(this.localeStrings, localeStrings);
                    return this;
                }
                /**
                 * Set container element id that the table will be rendered on.
                 * @param id element id
                 */
                setContainerId(id) {
                    this.containerId = id;
                    return this;
                }
                /**
                 * Render the table.
                 * @param selectId Which row to select after rendering
                 * @param onfulfilled callback after successfully rendered
                 * @param onrejected callback after rendering with error
                 */
                render(selectId, onfulfilled, onrejected) {
                    const refreshSelection = () => {
                        this.treeInstance.invalidate();
                        if (typeof selectId !== "undefined" && selectId >= 0) {
                            this.treeInstance.selection.select(selectId);
                        } else {
                            this.treeInstance.selection.clearSelection();
                        }
                    };
                    if (!this.treeInstance) {
                        const vtableProps = Object.assign({}, this.props, {
                            ref: (ref) => (this.treeInstance = ref),
                        });
                        if (vtableProps.getRowData && !vtableProps.renderItem) {
                            Object.assign(vtableProps, {
                                renderItem:
                                    this.VirtualizedTable.makeRowRenderer(
                                        vtableProps.getRowData,
                                    ),
                            });
                        }
                        const elem = this.React.createElement(
                            this.IntlProvider,
                            {
                                locale: Zotero.locale,
                                messages: Zotero.Intl.strings,
                            },
                            this.React.createElement(
                                this.VirtualizedTable,
                                vtableProps,
                            ),
                        );
                        const container = this.window.document.getElementById(
                            this.containerId,
                        );
                        new Promise((resolve) =>
                            this.ReactDOM.render(elem, container, resolve),
                        )
                            .then(() => {
                                this.getGlobal("setTimeout")(() => {
                                    refreshSelection();
                                });
                            })
                            .then(onfulfilled, onrejected);
                    } else {
                        refreshSelection();
                    }
                    return this;
                }
            };
            exports.VirtualizedTableHelper = VirtualizedTableHelper;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/dialog.js
    var require_dialog = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/dialog.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.DialogHelper = void 0;
            var ui_1 = require_ui();
            var DialogHelper = class extends ui_1.UITool {
                /**
                 * Create a dialog helper with row \* column grids.
                 * @param row
                 * @param column
                 */
                constructor(row, column) {
                    super();
                    if (row <= 0 || column <= 0) {
                        throw Error(
                            `row and column must be positive integers.`,
                        );
                    }
                    this.elementProps = {
                        tag: "vbox",
                        attributes: { flex: 1 },
                        styles: {
                            width: "100%",
                            height: "100%",
                        },
                        children: [],
                    };
                    for (let i = 0; i < Math.max(row, 1); i++) {
                        this.elementProps.children.push({
                            tag: "hbox",
                            attributes: { flex: 1 },
                            children: [],
                        });
                        for (let j = 0; j < Math.max(column, 1); j++) {
                            this.elementProps.children[i].children.push({
                                tag: "vbox",
                                attributes: { flex: 1 },
                                children: [],
                            });
                        }
                    }
                    this.elementProps.children.push({
                        tag: "hbox",
                        attributes: { flex: 0, pack: "end" },
                        children: [],
                    });
                    this.dialogData = {};
                }
                /**
                 * Add a cell at (row, column). Index starts from 0.
                 * @param row
                 * @param column
                 * @param elementProps Cell element props. See {@link ElementProps}
                 * @param cellFlex If the cell is flex. Default true.
                 */
                addCell(row, column, elementProps, cellFlex = true) {
                    if (
                        row >= this.elementProps.children.length ||
                        column >=
                            this.elementProps.children[row].children.length
                    ) {
                        throw Error(
                            `Cell index (${row}, ${column}) is invalid, maximum (${this.elementProps.children.length}, ${this.elementProps.children[0].children.length})`,
                        );
                    }
                    this.elementProps.children[row].children[column].children =
                        [elementProps];
                    this.elementProps.children[row].children[
                        column
                    ].attributes.flex = cellFlex ? 1 : 0;
                    return this;
                }
                /**
                 * Add a control button to the bottom of the dialog.
                 * @param label Button label
                 * @param id Button id.
                 * The corresponding id of the last button user clicks before window exit will be set to `dialogData._lastButtonId`.
                 * @param options.noClose Don't close window when clicking this button.
                 * @param options.callback Callback of button click event.
                 */
                addButton(label, id, options = {}) {
                    id =
                        id ||
                        `${Zotero.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`;
                    this.elementProps.children[
                        this.elementProps.children.length - 1
                    ].children.push({
                        tag: "vbox",
                        styles: {
                            margin: "10px",
                        },
                        children: [
                            {
                                tag: "button",
                                namespace: "html",
                                id,
                                attributes: {
                                    type: "button",
                                    "data-l10n-id": label,
                                },
                                properties: {
                                    innerHTML: label,
                                },
                                listeners: [
                                    {
                                        type: "click",
                                        listener: (e) => {
                                            this.dialogData._lastButtonId = id;
                                            if (options.callback) {
                                                options.callback(e);
                                            }
                                            if (!options.noClose) {
                                                this.window.close();
                                            }
                                        },
                                    },
                                ],
                            },
                        ],
                    });
                    return this;
                }
                /**
                 * Dialog data.
                 * @remarks
                 * This object is passed to the dialog window.
                 *
                 * The control button id is in `dialogData._lastButtonId`;
                 *
                 * The data-binding values are in `dialogData`.
                 * ```ts
                 * interface DialogData {
                 *   [key: string | number | symbol]: any;
                 *   loadLock?: _ZoteroTypes.PromiseObject; // resolve after window load (auto-generated)
                 *   loadCallback?: Function; // called after window load
                 *   unloadLock?: _ZoteroTypes.PromiseObject; // resolve after window unload (auto-generated)
                 *   unloadCallback?: Function; // called after window unload
                 *   beforeUnloadCallback?: Function; // called before window unload when elements are accessable.
                 * }
                 * ```
                 * @param dialogData
                 */
                setDialogData(dialogData) {
                    this.dialogData = dialogData;
                    return this;
                }
                /**
                 * Open the dialog
                 * @param title Window title
                 * @param windowFeatures.width Ignored if fitContent is `true`.
                 * @param windowFeatures.height Ignored if fitContent is `true`.
                 * @param windowFeatures.left
                 * @param windowFeatures.top
                 * @param windowFeatures.centerscreen Open window at the center of screen.
                 * @param windowFeatures.resizable If window is resizable.
                 * @param windowFeatures.fitContent Resize the window to content size after elements are loaded.
                 * @param windowFeatures.noDialogMode Dialog mode window only has a close button. Set `true` to make maximize and minimize button visible.
                 * @param windowFeatures.alwaysRaised Is the window always at the top.
                 */
                open(
                    title,
                    windowFeatures = {
                        centerscreen: true,
                        resizable: true,
                        fitContent: true,
                    },
                ) {
                    this.window = openDialog(
                        this,
                        `${Zotero.Utilities.randomString()}-${/* @__PURE__ */ new Date().getTime()}`,
                        title,
                        this.elementProps,
                        this.dialogData,
                        windowFeatures,
                    );
                    return this;
                }
            };
            exports.DialogHelper = DialogHelper;
            function openDialog(
                dialogHelper,
                targetId,
                title,
                elementProps,
                dialogData,
                windowFeatures = {
                    centerscreen: true,
                    resizable: true,
                    fitContent: true,
                },
            ) {
                var _a, _b, _c;
                const Zotero2 = dialogHelper.getGlobal("Zotero");
                dialogData = dialogData || {};
                if (!dialogData.loadLock) {
                    dialogData.loadLock = Zotero2.Promise.defer();
                }
                if (!dialogData.unloadLock) {
                    dialogData.unloadLock = Zotero2.Promise.defer();
                }
                let featureString = `resizable=${windowFeatures.resizable ? "yes" : "no"},`;
                if (windowFeatures.width || windowFeatures.height) {
                    featureString += `width=${windowFeatures.width || 100},height=${windowFeatures.height || 100},`;
                }
                if (windowFeatures.left) {
                    featureString += `left=${windowFeatures.left},`;
                }
                if (windowFeatures.top) {
                    featureString += `top=${windowFeatures.top},`;
                }
                if (windowFeatures.centerscreen) {
                    featureString += "centerscreen,";
                }
                if (windowFeatures.noDialogMode) {
                    featureString += "dialog=no,";
                }
                if (windowFeatures.alwaysRaised) {
                    featureString += "alwaysRaised=yes,";
                }
                const win = dialogHelper.getGlobal("openDialog")(
                    "about:blank",
                    targetId || "_blank",
                    featureString,
                    dialogData,
                );
                (_a = dialogData.loadLock) === null || _a === void 0
                    ? void 0
                    : _a.promise
                          .then(() => {
                              win.document.head.appendChild(
                                  dialogHelper.createElement(
                                      win.document,
                                      "title",
                                      {
                                          properties: { innerText: title },
                                          attributes: { "data-l10n-id": title },
                                      },
                                  ),
                              );
                              let l10nFiles = dialogData.l10nFiles || [];
                              if (typeof l10nFiles === "string") {
                                  l10nFiles = [l10nFiles];
                              }
                              l10nFiles.forEach((file) => {
                                  win.document.head.appendChild(
                                      dialogHelper.createElement(
                                          win.document,
                                          "link",
                                          {
                                              properties: {
                                                  rel: "localization",
                                                  href: file,
                                              },
                                          },
                                      ),
                                  );
                              });
                              win.document.head.appendChild(
                                  dialogHelper.createElement(
                                      win.document,
                                      "style",
                                      {
                                          properties: {
                                              innerHTML: style,
                                          },
                                      },
                                  ),
                              );
                              replaceElement(elementProps, dialogHelper);
                              win.document.body.appendChild(
                                  dialogHelper.createElement(
                                      win.document,
                                      "fragment",
                                      {
                                          children: [elementProps],
                                      },
                                  ),
                              );
                              Array.from(
                                  win.document.querySelectorAll("*[data-bind]"),
                              ).forEach((elem) => {
                                  const bindKey =
                                      elem.getAttribute("data-bind");
                                  const bindAttr =
                                      elem.getAttribute("data-attr");
                                  const bindProp =
                                      elem.getAttribute("data-prop");
                                  if (
                                      bindKey &&
                                      dialogData &&
                                      dialogData[bindKey]
                                  ) {
                                      if (bindProp) {
                                          elem[bindProp] = dialogData[bindKey];
                                      } else {
                                          elem.setAttribute(
                                              bindAttr || "value",
                                              dialogData[bindKey],
                                          );
                                      }
                                  }
                              });
                              if (windowFeatures.fitContent) {
                                  setTimeout(() => {
                                      win.sizeToContent();
                                  }, 300);
                              }
                              win.focus();
                          })
                          .then(() => {
                              (dialogData === null || dialogData === void 0
                                  ? void 0
                                  : dialogData.loadCallback) &&
                                  dialogData.loadCallback();
                          });
                dialogData.unloadLock.promise.then(() => {
                    (dialogData === null || dialogData === void 0
                        ? void 0
                        : dialogData.unloadCallback) &&
                        dialogData.unloadCallback();
                });
                win.addEventListener(
                    "DOMContentLoaded",
                    function onWindowLoad(ev) {
                        var _a2, _b2;
                        (_b2 =
                            (_a2 = win.arguments[0]) === null || _a2 === void 0
                                ? void 0
                                : _a2.loadLock) === null || _b2 === void 0
                            ? void 0
                            : _b2.resolve();
                        win.removeEventListener(
                            "DOMContentLoaded",
                            onWindowLoad,
                            false,
                        );
                    },
                    false,
                );
                win.addEventListener(
                    "beforeunload",
                    function onWindowBeforeUnload(ev) {
                        Array.from(
                            win.document.querySelectorAll("*[data-bind]"),
                        ).forEach((elem) => {
                            const dialogData2 = this.window.arguments[0];
                            const bindKey = elem.getAttribute("data-bind");
                            const bindAttr = elem.getAttribute("data-attr");
                            const bindProp = elem.getAttribute("data-prop");
                            if (bindKey && dialogData2) {
                                if (bindProp) {
                                    dialogData2[bindKey] = elem[bindProp];
                                } else {
                                    dialogData2[bindKey] = elem.getAttribute(
                                        bindAttr || "value",
                                    );
                                }
                            }
                        });
                        this.window.removeEventListener(
                            "beforeunload",
                            onWindowBeforeUnload,
                            false,
                        );
                        (dialogData === null || dialogData === void 0
                            ? void 0
                            : dialogData.beforeUnloadCallback) &&
                            dialogData.beforeUnloadCallback();
                    },
                );
                win.addEventListener("unload", function onWindowUnload(ev) {
                    var _a2, _b2, _c2;
                    if (
                        (_a2 = this.window.arguments[0]) === null ||
                        _a2 === void 0
                            ? void 0
                            : _a2.loadLock.promise.isPending()
                    ) {
                        return;
                    }
                    (_c2 =
                        (_b2 = this.window.arguments[0]) === null ||
                        _b2 === void 0
                            ? void 0
                            : _b2.unloadLock) === null || _c2 === void 0
                        ? void 0
                        : _c2.resolve();
                    this.window.removeEventListener(
                        "unload",
                        onWindowUnload,
                        false,
                    );
                });
                if (win.document.readyState === "complete") {
                    (_c =
                        (_b = win.arguments[0]) === null || _b === void 0
                            ? void 0
                            : _b.loadLock) === null || _c === void 0
                        ? void 0
                        : _c.resolve();
                }
                return win;
            }
            function replaceElement(elementProps, uiTool) {
                var _a, _b, _c, _d, _e, _f, _g;
                let checkChildren = true;
                if (elementProps.tag === "select" && uiTool.isZotero7()) {
                    checkChildren = false;
                    const customSelectProps = {
                        tag: "div",
                        classList: ["dropdown"],
                        listeners: [
                            {
                                type: "mouseleave",
                                listener: (ev) => {
                                    const select =
                                        ev.target.querySelector("select");
                                    select === null || select === void 0
                                        ? void 0
                                        : select.blur();
                                },
                            },
                        ],
                        children: [
                            Object.assign({}, elementProps, {
                                tag: "select",
                                listeners: [
                                    {
                                        type: "focus",
                                        listener: (ev) => {
                                            var _a2;
                                            const select = ev.target;
                                            const dropdown =
                                                (_a2 = select.parentElement) ===
                                                    null || _a2 === void 0
                                                    ? void 0
                                                    : _a2.querySelector(
                                                          ".dropdown-content",
                                                      );
                                            dropdown &&
                                                (dropdown.style.display =
                                                    "block");
                                            select.setAttribute(
                                                "focus",
                                                "true",
                                            );
                                        },
                                    },
                                    {
                                        type: "blur",
                                        listener: (ev) => {
                                            var _a2;
                                            const select = ev.target;
                                            const dropdown =
                                                (_a2 = select.parentElement) ===
                                                    null || _a2 === void 0
                                                    ? void 0
                                                    : _a2.querySelector(
                                                          ".dropdown-content",
                                                      );
                                            dropdown &&
                                                (dropdown.style.display =
                                                    "none");
                                            select.removeAttribute("focus");
                                        },
                                    },
                                ],
                            }),
                            {
                                tag: "div",
                                classList: ["dropdown-content"],
                                children:
                                    (_a = elementProps.children) === null ||
                                    _a === void 0
                                        ? void 0
                                        : _a.map((option) => {
                                              var _a2, _b2, _c2;
                                              return {
                                                  tag: "p",
                                                  attributes: {
                                                      value:
                                                          (_a2 =
                                                              option.properties) ===
                                                              null ||
                                                          _a2 === void 0
                                                              ? void 0
                                                              : _a2.value,
                                                  },
                                                  properties: {
                                                      innerHTML:
                                                          ((_b2 =
                                                              option.properties) ===
                                                              null ||
                                                          _b2 === void 0
                                                              ? void 0
                                                              : _b2.innerHTML) ||
                                                          ((_c2 =
                                                              option.properties) ===
                                                              null ||
                                                          _c2 === void 0
                                                              ? void 0
                                                              : _c2.innerText),
                                                  },
                                                  classList: ["dropdown-item"],
                                                  listeners: [
                                                      {
                                                          type: "click",
                                                          listener: (ev) => {
                                                              var _a3;
                                                              const select =
                                                                  (_a3 =
                                                                      ev.target
                                                                          .parentElement) ===
                                                                      null ||
                                                                  _a3 === void 0
                                                                      ? void 0
                                                                      : _a3.previousElementSibling;
                                                              select &&
                                                                  (select.value =
                                                                      ev.target.getAttribute(
                                                                          "value",
                                                                      ) || "");
                                                              select === null ||
                                                              select === void 0
                                                                  ? void 0
                                                                  : select.blur();
                                                          },
                                                      },
                                                  ],
                                              };
                                          }),
                            },
                        ],
                    };
                    for (const key in elementProps) {
                        delete elementProps[key];
                    }
                    Object.assign(elementProps, customSelectProps);
                } else if (elementProps.tag === "a") {
                    const href =
                        ((_b =
                            elementProps === null || elementProps === void 0
                                ? void 0
                                : elementProps.properties) === null ||
                        _b === void 0
                            ? void 0
                            : _b.href) || "";
                    (_c = elementProps.properties) !== null && _c !== void 0
                        ? _c
                        : (elementProps.properties = {});
                    elementProps.properties.href = "javascript:void(0);";
                    (_d = elementProps.attributes) !== null && _d !== void 0
                        ? _d
                        : (elementProps.attributes = {});
                    elementProps.attributes["zotero-href"] = href;
                    (_e = elementProps.listeners) !== null && _e !== void 0
                        ? _e
                        : (elementProps.listeners = []);
                    elementProps.listeners.push({
                        type: "click",
                        listener: (ev) => {
                            var _a2;
                            const href2 =
                                (_a2 = ev.target) === null || _a2 === void 0
                                    ? void 0
                                    : _a2.getAttribute("zotero-href");
                            href2 &&
                                uiTool.getGlobal("Zotero").launchURL(href2);
                        },
                    });
                    (_f = elementProps.classList) !== null && _f !== void 0
                        ? _f
                        : (elementProps.classList = []);
                    elementProps.classList.push("zotero-text-link");
                }
                if (checkChildren) {
                    (_g = elementProps.children) === null || _g === void 0
                        ? void 0
                        : _g.forEach((child) => replaceElement(child, uiTool));
                }
            }
            var style = `
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
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/readerInstance.js
    var require_readerInstance = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/readerInstance.js"(
            exports,
        ) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ReaderInstanceManager = void 0;
            var basic_1 = require_basic();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var ReaderInstanceManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.cachedHookIds = [];
                    this.initializeGlobal();
                }
                /**
                 * Register a reader instance hook
                 * @deprecated
                 * @remarks
                 * initialized: called when reader instance is ready
                 * @param type hook type
                 * @param id hook id
                 * @param hook
                 */
                register(type, id, hook) {
                    const Zotero2 = this.getGlobal("Zotero");
                    switch (type) {
                        case "initialized":
                            {
                                this.globalCache.initializedHooks[id] = hook;
                                Zotero2.Reader._readers.forEach(hook);
                            }
                            break;
                        default:
                            break;
                    }
                    this.cachedHookIds.push(id);
                }
                /**
                 * Unregister hook by id
                 * @param id
                 */
                unregister(id) {
                    delete this.globalCache.initializedHooks[id];
                }
                /**
                 * Unregister all hooks
                 */
                unregisterAll() {
                    this.cachedHookIds.forEach((id) => this.unregister(id));
                }
                initializeGlobal() {
                    this.globalCache =
                        toolkitGlobal_1.default.getInstance().readerInstance;
                    if (!this.globalCache._ready) {
                        this.globalCache._ready = true;
                        const Zotero2 = this.getGlobal("Zotero");
                        const _this = this;
                        Zotero2.Reader._readers = new (this.getGlobal("Proxy"))(
                            Zotero2.Reader._readers,
                            {
                                set(target, p, newValue, receiver) {
                                    target[p] = newValue;
                                    if (!isNaN(Number(p))) {
                                        Object.values(
                                            _this.globalCache.initializedHooks,
                                        ).forEach((hook) => {
                                            try {
                                                hook(newValue);
                                            } catch (e) {
                                                _this.log(e);
                                            }
                                        });
                                    }
                                    return true;
                                },
                            },
                        );
                    }
                }
            };
            exports.ReaderInstanceManager = ReaderInstanceManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/itemBox.js
    var require_itemBox = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/itemBox.js"(exports) {
            "use strict";
            var __importDefault =
                (exports && exports.__importDefault) ||
                function (mod) {
                    return mod && mod.__esModule ? mod : { default: mod };
                };
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ItemBoxManager = void 0;
            var basic_1 = require_basic();
            var fieldHook_1 = require_fieldHook();
            var patch_1 = require_patch2();
            var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
            var ItemBoxManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this.initializationLock =
                        this.getGlobal("Zotero").Promise.defer();
                    this.localCache = [];
                    this.fieldHooks = new fieldHook_1.FieldHookManager();
                    this.patcherManager = new patch_1.PatcherManager();
                    this.initializeGlobal();
                }
                /**
                 * Register a custom row
                 * @param field Field name. Used in `getField` and `setField`.
                 * @param displayName The row header display text.
                 * @param getFieldHook Called when loading row content.
                 * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
                 * @param options
                 * @param options.editable If the row is editable.
                 * To edit a row, either the `options.setFieldHook` or a custom hook for `setField` created by FieldHookManager is required.
                 * @param options.setFieldHook The `setField` hook.
                 * @param options.index Target index. By default it's placed at the end of rows.
                 * @param options.multiline If the row content is multiline.
                 * @param options.collapsible If the row content is collapsible (like abstract field).
                 */
                async register(field, displayName, getFieldHook, options = {}) {
                    this.fieldHooks.register(
                        "isFieldOfBase",
                        field,
                        () => false,
                    );
                    if (getFieldHook) {
                        this.fieldHooks.register(
                            "getField",
                            field,
                            getFieldHook,
                        );
                    }
                    if (options.editable && options.setFieldHook) {
                        this.fieldHooks.register(
                            "setField",
                            field,
                            options.setFieldHook,
                        );
                    }
                    this.globalCache.fieldOptions[field] = {
                        field,
                        displayName,
                        editable: options.editable || false,
                        index: options.index || -1,
                        multiline: options.multiline || false,
                        collapsible: options.collapsible || false,
                    };
                    this.localCache.push(field);
                    await this.initializationLock.promise;
                    this.refresh();
                }
                /**
                 * Unregister a row of specific field.
                 * @param field
                 * @param options Skip unregister of certain hooks.
                 * This is useful when the hook is not initialized by this instance
                 * @param options.skipRefresh Skip refresh after unregister.
                 */
                unregister(field, options = {}) {
                    delete this.globalCache.fieldOptions[field];
                    if (!options.skipIsFieldOfBase) {
                        this.fieldHooks.unregister("isFieldOfBase", field);
                    }
                    if (!options.skipGetField) {
                        this.fieldHooks.unregister("getField", field);
                    }
                    if (!options.skipSetField) {
                        this.fieldHooks.unregister("setField", field);
                    }
                    const idx = this.localCache.indexOf(field);
                    if (idx > -1) {
                        this.localCache.splice(idx, 1);
                    }
                    if (!options.skipRefresh) {
                        this.refresh();
                    }
                }
                unregisterAll() {
                    [...this.localCache].forEach((field) =>
                        this.unregister(field, {
                            skipGetField: true,
                            skipSetField: true,
                            skipIsFieldOfBase: true,
                            skipRefresh: true,
                        }),
                    );
                    this.fieldHooks.unregisterAll();
                    this.refresh();
                }
                /**
                 * Refresh all item boxes.
                 */
                refresh() {
                    try {
                        Array.from(
                            this.getGlobal("document").querySelectorAll(
                                this.isZotero7() ? "item-box" : "zoteroitembox",
                            ),
                        ).forEach((elem) => elem.refresh());
                    } catch (e) {
                        this.log(e);
                    }
                }
                async initializeGlobal() {
                    const Zotero2 = this.getGlobal("Zotero");
                    await Zotero2.uiReadyPromise;
                    const window2 = this.getGlobal("window");
                    this.globalCache =
                        toolkitGlobal_1.default.getInstance().itemBox;
                    const globalCache = this.globalCache;
                    const inZotero7 = this.isZotero7();
                    if (!globalCache._ready) {
                        globalCache._ready = true;
                        let itemBoxInstance;
                        if (inZotero7) {
                            itemBoxInstance = new (this.getGlobal(
                                "customElements",
                            ).get("item-box"))();
                        } else {
                            itemBoxInstance = window2.document.querySelector(
                                "#zotero-editpane-item-box",
                            );
                            const wait = 5e3;
                            let t = 0;
                            while (!itemBoxInstance && t < wait) {
                                itemBoxInstance =
                                    window2.document.querySelector(
                                        "#zotero-editpane-item-box",
                                    );
                                await Zotero2.Promise.delay(10);
                                t += 10;
                            }
                            if (!itemBoxInstance) {
                                globalCache._ready = false;
                                this.log("ItemBox initialization failed");
                                return;
                            }
                        }
                        this.patcherManager.register(
                            itemBoxInstance.__proto__,
                            "refresh",
                            (original) =>
                                function () {
                                    const originalThis = this;
                                    original.apply(originalThis, arguments);
                                    for (const extraField of Object.values(
                                        globalCache.fieldOptions,
                                    )) {
                                        const fieldHeader =
                                            document.createElement(
                                                inZotero7 ? "th" : "label",
                                            );
                                        fieldHeader.setAttribute(
                                            "fieldname",
                                            extraField.field,
                                        );
                                        const prefKey = `extensions.zotero.pluginToolkit.fieldCollapsed.${extraField.field}`;
                                        const collapsed =
                                            extraField.multiline &&
                                            extraField.collapsible &&
                                            Zotero2.Prefs.get(prefKey, true);
                                        let headerContent =
                                            extraField.displayName;
                                        if (collapsed) {
                                            headerContent = `(...)${headerContent}`;
                                        }
                                        if (inZotero7) {
                                            let label =
                                                document.createElement("label");
                                            label.className = "key";
                                            label.textContent = headerContent;
                                            fieldHeader.appendChild(label);
                                        } else {
                                            fieldHeader.setAttribute(
                                                "value",
                                                headerContent,
                                            );
                                        }
                                        const _clickable =
                                            originalThis.clickable;
                                        originalThis.clickable =
                                            extraField.editable;
                                        const fieldValue =
                                            originalThis.createValueElement(
                                                originalThis.item.getField(
                                                    extraField.field,
                                                ),
                                                extraField.field,
                                                1099,
                                            );
                                        originalThis.clickable = _clickable;
                                        if (
                                            extraField.multiline &&
                                            !Zotero2.Prefs.get(prefKey, true)
                                        ) {
                                            fieldValue.classList.add(
                                                "multiline",
                                            );
                                        } else if (!inZotero7) {
                                            fieldValue.setAttribute(
                                                "crop",
                                                "end",
                                            );
                                            fieldValue.setAttribute(
                                                "value",
                                                fieldValue.innerHTML,
                                            );
                                            fieldValue.innerHTML = "";
                                        }
                                        if (extraField.collapsible) {
                                            fieldHeader.addEventListener(
                                                "click",
                                                function (ev) {
                                                    Zotero2.Prefs.set(
                                                        prefKey,
                                                        !(
                                                            Zotero2.Prefs.get(
                                                                prefKey,
                                                                true,
                                                            ) || false
                                                        ),
                                                        true,
                                                    );
                                                    originalThis.refresh();
                                                },
                                            );
                                        }
                                        fieldHeader.addEventListener(
                                            "click",
                                            inZotero7
                                                ? function (ev) {
                                                      var _a;
                                                      const inputField =
                                                          (_a =
                                                              ev.currentTarget
                                                                  .nextElementSibling) ===
                                                              null ||
                                                          _a === void 0
                                                              ? void 0
                                                              : _a.querySelector(
                                                                    "input, textarea",
                                                                );
                                                      if (inputField) {
                                                          inputField.blur();
                                                      }
                                                  }
                                                : function (ev) {
                                                      var _a;
                                                      const inputField =
                                                          (_a =
                                                              ev.currentTarget
                                                                  .nextElementSibling) ===
                                                              null ||
                                                          _a === void 0
                                                              ? void 0
                                                              : _a.inputField;
                                                      if (inputField) {
                                                          inputField.blur();
                                                      }
                                                  },
                                        );
                                        const table = inZotero7
                                            ? originalThis._infoTable
                                            : originalThis._dynamicFields;
                                        let fieldIndex = extraField.index;
                                        if (fieldIndex === 0) {
                                            fieldIndex = 1;
                                        }
                                        if (
                                            fieldIndex &&
                                            fieldIndex >= 0 &&
                                            fieldIndex < table.children.length
                                        ) {
                                            originalThis._beforeRow =
                                                table.children[fieldIndex];
                                            originalThis.addDynamicRow(
                                                fieldHeader,
                                                fieldValue,
                                                true,
                                            );
                                        } else {
                                            originalThis.addDynamicRow(
                                                fieldHeader,
                                                fieldValue,
                                            );
                                        }
                                    }
                                },
                        );
                    }
                    this.initializationLock.resolve();
                }
            };
            exports.ItemBoxManager = ItemBoxManager;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/helpers/largePref.js
    var require_largePref = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/helpers/largePref.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.LargePrefHelper = void 0;
            var basic_1 = require_basic();
            var LargePrefHelper = class extends basic_1.BasicTool {
                /**
                 *
                 * @param keyPref The preference name for storing the keys of the data.
                 * @param valuePrefPrefix The preference name prefix for storing the values of the data.
                 * @param hooks Hooks for parsing the values of the data.
                 * - `afterGetValue`: A function that takes the value of the data as input and returns the parsed value.
                 * - `beforeSetValue`: A function that takes the key and value of the data as input and returns the parsed key and value.
                 * If `hooks` is `"default"`, no parsing will be done.
                 * If `hooks` is `"parser"`, the values will be parsed as JSON.
                 * If `hooks` is an object, the values will be parsed by the hooks.
                 */
                constructor(keyPref, valuePrefPrefix, hooks = "default") {
                    super();
                    this.keyPref = keyPref;
                    this.valuePrefPrefix = valuePrefPrefix;
                    if (hooks === "default") {
                        this.hooks = defaultHooks;
                    } else if (hooks === "parser") {
                        this.hooks = parserHooks;
                    } else {
                        this.hooks = Object.assign(
                            Object.assign({}, defaultHooks),
                            hooks,
                        );
                    }
                    this.innerObj = {};
                }
                /**
                 * Get the object that stores the data.
                 * @returns The object that stores the data.
                 */
                asObject() {
                    return this.constructTempObj();
                }
                /**
                 * Get the Map that stores the data.
                 * @returns The Map that stores the data.
                 */
                asMapLike() {
                    const mapLike = {
                        get: (key) => this.getValue(key),
                        set: (key, value) => {
                            this.setValue(key, value);
                            return mapLike;
                        },
                        has: (key) => this.hasKey(key),
                        delete: (key) => this.deleteKey(key),
                        clear: () => {
                            for (const key of this.getKeys()) {
                                this.deleteKey(key);
                            }
                        },
                        forEach: (callback) => {
                            return this.constructTempMap().forEach(callback);
                        },
                        get size() {
                            return this._this.getKeys().length;
                        },
                        entries: () => {
                            return this.constructTempMap().values();
                        },
                        keys: () => {
                            const keys = this.getKeys();
                            return keys[Symbol.iterator]();
                        },
                        values: () => {
                            return this.constructTempMap().values();
                        },
                        [Symbol.iterator]: () => {
                            return this.constructTempMap()[Symbol.iterator]();
                        },
                        [Symbol.toStringTag]: "MapLike",
                        _this: this,
                    };
                    return mapLike;
                }
                /**
                 * Get the keys of the data.
                 * @returns The keys of the data.
                 */
                getKeys() {
                    const rawKeys = Zotero.Prefs.get(this.keyPref, true);
                    const keys = rawKeys ? JSON.parse(rawKeys) : [];
                    for (const key of keys) {
                        const value = "placeholder";
                        this.innerObj[key] = value;
                    }
                    return keys;
                }
                /**
                 * Set the keys of the data.
                 * @param keys The keys of the data.
                 */
                setKeys(keys) {
                    keys = [...new Set(keys.filter((key) => key))];
                    Zotero.Prefs.set(this.keyPref, JSON.stringify(keys), true);
                    for (const key of keys) {
                        const value = "placeholder";
                        this.innerObj[key] = value;
                    }
                }
                /**
                 * Get the value of a key.
                 * @param key The key of the data.
                 * @returns The value of the key.
                 */
                getValue(key) {
                    const value = Zotero.Prefs.get(
                        `${this.valuePrefPrefix}${key}`,
                        true,
                    );
                    if (typeof value === "undefined") {
                        return;
                    }
                    let { value: newValue } = this.hooks.afterGetValue({
                        value,
                    });
                    this.innerObj[key] = newValue;
                    return newValue;
                }
                /**
                 * Set the value of a key.
                 * @param key The key of the data.
                 * @param value The value of the key.
                 */
                setValue(key, value) {
                    let { key: newKey, value: newValue } =
                        this.hooks.beforeSetValue({
                            key,
                            value,
                        });
                    this.setKey(newKey);
                    Zotero.Prefs.set(
                        `${this.valuePrefPrefix}${newKey}`,
                        newValue,
                        true,
                    );
                    this.innerObj[newKey] = newValue;
                }
                /**
                 * Check if a key exists.
                 * @param key The key of the data.
                 * @returns Whether the key exists.
                 */
                hasKey(key) {
                    return this.getKeys().includes(key);
                }
                /**
                 * Add a key.
                 * @param key The key of the data.
                 */
                setKey(key) {
                    const keys = this.getKeys();
                    if (!keys.includes(key)) {
                        keys.push(key);
                        this.setKeys(keys);
                    }
                }
                /**
                 * Delete a key.
                 * @param key The key of the data.
                 */
                deleteKey(key) {
                    const keys = this.getKeys();
                    const index = keys.indexOf(key);
                    if (index > -1) {
                        keys.splice(index, 1);
                        delete this.innerObj[key];
                        this.setKeys(keys);
                    }
                    Zotero.Prefs.clear(`${this.valuePrefPrefix}${key}`, true);
                    return true;
                }
                constructTempObj() {
                    return new Proxy(this.innerObj, {
                        get: (target, prop, receiver) => {
                            this.getKeys();
                            if (typeof prop === "string" && prop in target) {
                                this.getValue(prop);
                            }
                            return Reflect.get(target, prop, receiver);
                        },
                        set: (target, p, newValue, receiver) => {
                            if (typeof p === "string") {
                                if (newValue === void 0) {
                                    this.deleteKey(p);
                                    return true;
                                }
                                this.setValue(p, newValue);
                                return true;
                            }
                            return Reflect.set(target, p, newValue, receiver);
                        },
                        has: (target, p) => {
                            this.getKeys();
                            return Reflect.has(target, p);
                        },
                        deleteProperty: (target, p) => {
                            if (typeof p === "string") {
                                this.deleteKey(p);
                                return true;
                            }
                            return Reflect.deleteProperty(target, p);
                        },
                    });
                }
                constructTempMap() {
                    const map = /* @__PURE__ */ new Map();
                    for (const key of this.getKeys()) {
                        map.set(key, this.getValue(key));
                    }
                    return map;
                }
            };
            exports.LargePrefHelper = LargePrefHelper;
            var defaultHooks = {
                afterGetValue: ({ value }) => ({ value }),
                beforeSetValue: ({ key, value }) => ({ key, value }),
            };
            var parserHooks = {
                afterGetValue: ({ value }) => {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        return { value };
                    }
                    return { value };
                },
                beforeSetValue: ({ key, value }) => {
                    value = JSON.stringify(value);
                    return { key, value };
                },
            };
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/managers/keyboard.js
    var require_keyboard = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/managers/keyboard.js"(
            exports,
        ) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.KeyModifier = exports.KeyboardManager = void 0;
            var basic_1 = require_basic();
            var wait_1 = require_wait();
            var KeyboardManager = class extends basic_1.ManagerTool {
                constructor(base) {
                    super(base);
                    this._keyboardCallbacks = /* @__PURE__ */ new Set();
                    this.initKeyboardListener =
                        this._initKeyboardListener.bind(this);
                    this.unInitKeyboardListener =
                        this._unInitKeyboardListener.bind(this);
                    this.triggerKeydown = (e) => {
                        if (!this._cachedKey) {
                            this._cachedKey = new KeyModifier(e);
                        } else {
                            this._cachedKey.merge(new KeyModifier(e), {
                                allowOverwrite: false,
                            });
                        }
                        this.dispatchCallback(e, {
                            type: "keydown",
                        });
                    };
                    this.triggerKeyup = async (e) => {
                        if (!this._cachedKey) {
                            return;
                        }
                        const currentShortcut = new KeyModifier(
                            this._cachedKey,
                        );
                        this._cachedKey = void 0;
                        this.dispatchCallback(e, {
                            keyboard: currentShortcut,
                            type: "keyup",
                        });
                    };
                    this.id = Zotero.Utilities.randomString();
                    this._ensureAutoUnregisterAll();
                    this.addListenerCallback(
                        "onMainWindowLoad",
                        this.initKeyboardListener,
                    );
                    this.addListenerCallback(
                        "onMainWindowUnload",
                        this.unInitKeyboardListener,
                    );
                    this.initReaderKeyboardListener();
                    for (const win of Zotero.getMainWindows()) {
                        this.initKeyboardListener(win);
                    }
                }
                /**
                 * Register a keyboard event listener.
                 * @param callback The callback function.
                 */
                register(callback) {
                    this._keyboardCallbacks.add(callback);
                }
                /**
                 * Unregister a keyboard event listener.
                 * @param callback The callback function.
                 */
                unregister(callback) {
                    this._keyboardCallbacks.delete(callback);
                }
                /**
                 * Unregister all keyboard event listeners.
                 */
                unregisterAll() {
                    this._keyboardCallbacks.clear();
                    this.removeListenerCallback(
                        "onMainWindowLoad",
                        this.initKeyboardListener,
                    );
                    this.removeListenerCallback(
                        "onMainWindowUnload",
                        this.unInitKeyboardListener,
                    );
                    for (const win of Zotero.getMainWindows()) {
                        this.unInitKeyboardListener(win);
                    }
                }
                initReaderKeyboardListener() {
                    Zotero.Reader.registerEventListener(
                        "renderToolbar",
                        (event) => this.addReaderKeyboardCallback(event),
                        this._basicOptions.api.pluginID,
                    );
                    Zotero.Reader._readers.forEach((reader) =>
                        this.addReaderKeyboardCallback({ reader }),
                    );
                }
                addReaderKeyboardCallback(event) {
                    const reader = event.reader;
                    let initializedKey = `_ztoolkitKeyboard${this.id}Initialized`;
                    if (reader._iframeWindow[initializedKey]) {
                        return;
                    }
                    this._initKeyboardListener(reader._iframeWindow);
                    (0, wait_1.waitUntil)(
                        () => {
                            var _a, _b;
                            return (
                                !Components.utils.isDeadWrapper(
                                    reader._internalReader,
                                ) &&
                                ((_b =
                                    (_a = reader._internalReader) === null ||
                                    _a === void 0
                                        ? void 0
                                        : _a._primaryView) === null ||
                                _b === void 0
                                    ? void 0
                                    : _b._iframeWindow)
                            );
                        },
                        () => {
                            var _a;
                            return this._initKeyboardListener(
                                (_a = reader._internalReader._primaryView) ===
                                    null || _a === void 0
                                    ? void 0
                                    : _a._iframeWindow,
                            );
                        },
                    );
                    reader._iframeWindow[initializedKey] = true;
                }
                _initKeyboardListener(win) {
                    if (!win) {
                        return;
                    }
                    win.addEventListener("keydown", this.triggerKeydown);
                    win.addEventListener("keyup", this.triggerKeyup);
                }
                _unInitKeyboardListener(win) {
                    if (!win) {
                        return;
                    }
                    win.removeEventListener("keydown", this.triggerKeydown);
                    win.removeEventListener("keyup", this.triggerKeyup);
                }
                dispatchCallback(...args) {
                    this._keyboardCallbacks.forEach((cbk) => cbk(...args));
                }
            };
            exports.KeyboardManager = KeyboardManager;
            var KeyModifier = class _KeyModifier {
                constructor(raw, options) {
                    this.accel = false;
                    this.shift = false;
                    this.control = false;
                    this.meta = false;
                    this.alt = false;
                    this.key = "";
                    this.useAccel = false;
                    this.useAccel =
                        (options === null || options === void 0
                            ? void 0
                            : options.useAccel) || false;
                    if (typeof raw === "undefined") {
                        return;
                    } else if (typeof raw === "string") {
                        raw = raw || "";
                        raw = this.unLocalized(raw);
                        this.accel = raw.includes("accel");
                        this.shift = raw.includes("shift");
                        this.control = raw.includes("control");
                        this.meta = raw.includes("meta");
                        this.alt = raw.includes("alt");
                        this.key = raw
                            .replace(
                                /(accel|shift|control|meta|alt| |,|-)/g,
                                "",
                            )
                            .toLocaleLowerCase();
                    } else if (raw instanceof _KeyModifier) {
                        this.merge(raw, { allowOverwrite: true });
                    } else {
                        if (
                            options === null || options === void 0
                                ? void 0
                                : options.useAccel
                        ) {
                            if (Zotero.isMac) {
                                this.accel = raw.metaKey;
                            } else {
                                this.accel = raw.ctrlKey;
                            }
                        }
                        this.shift = raw.shiftKey;
                        this.control = raw.ctrlKey;
                        this.meta = raw.metaKey;
                        this.alt = raw.altKey;
                        if (
                            ![
                                "Shift",
                                "Meta",
                                "Ctrl",
                                "Alt",
                                "Control",
                            ].includes(raw.key)
                        ) {
                            this.key = raw.key;
                        }
                    }
                }
                /**
                 * Merge another KeyModifier into this one.
                 * @param newMod the new KeyModifier
                 * @param options
                 * @returns
                 */
                merge(newMod, options) {
                    const allowOverwrite =
                        (options === null || options === void 0
                            ? void 0
                            : options.allowOverwrite) || false;
                    this.mergeAttribute("accel", newMod.accel, allowOverwrite);
                    this.mergeAttribute("shift", newMod.shift, allowOverwrite);
                    this.mergeAttribute(
                        "control",
                        newMod.control,
                        allowOverwrite,
                    );
                    this.mergeAttribute("meta", newMod.meta, allowOverwrite);
                    this.mergeAttribute("alt", newMod.alt, allowOverwrite);
                    this.mergeAttribute("key", newMod.key, allowOverwrite);
                    return this;
                }
                /**
                 * Check if the current KeyModifier equals to another KeyModifier.
                 * @param newMod the new KeyModifier
                 * @returns true if equals
                 */
                equals(newMod) {
                    if (typeof newMod === "string") {
                        newMod = new _KeyModifier(newMod);
                    }
                    if (
                        this.shift !== newMod.shift ||
                        this.alt !== newMod.alt ||
                        this.key.toLowerCase() !== newMod.key.toLowerCase()
                    ) {
                        return false;
                    }
                    if (this.accel || newMod.accel) {
                        if (Zotero.isMac) {
                            if (
                                (this.accel || this.meta) !==
                                    (newMod.accel || newMod.meta) ||
                                this.control !== newMod.control
                            ) {
                                return false;
                            }
                        } else {
                            if (
                                (this.accel || this.control) !==
                                    (newMod.accel || newMod.control) ||
                                this.meta !== newMod.meta
                            ) {
                                return false;
                            }
                        }
                    } else {
                        if (
                            this.control !== newMod.control ||
                            this.meta !== newMod.meta
                        ) {
                            return false;
                        }
                    }
                    return true;
                }
                /**
                 * Get the raw string representation of the KeyModifier.
                 */
                getRaw() {
                    const enabled = [];
                    this.accel && enabled.push("accel");
                    this.shift && enabled.push("shift");
                    this.control && enabled.push("control");
                    this.meta && enabled.push("meta");
                    this.alt && enabled.push("alt");
                    this.key && enabled.push(this.key);
                    return enabled.join(",");
                }
                /**
                 * Get the localized string representation of the KeyModifier.
                 */
                getLocalized() {
                    const raw = this.getRaw();
                    if (Zotero.isMac) {
                        return raw
                            .replaceAll("control", "\u2303")
                            .replaceAll("alt", "\u2325")
                            .replaceAll("shift", "\u21E7")
                            .replaceAll("meta", "\u2318");
                    } else {
                        return raw
                            .replaceAll("control", "Ctrl")
                            .replaceAll("alt", "Alt")
                            .replaceAll("shift", "Shift")
                            .replaceAll("meta", "Win");
                    }
                }
                /**
                 * Get the un-localized string representation of the KeyModifier.
                 */
                unLocalized(raw) {
                    if (Zotero.isMac) {
                        return raw
                            .replaceAll("\u2303", "control")
                            .replaceAll("\u2325", "alt")
                            .replaceAll("\u21E7", "shift")
                            .replaceAll("\u2318", "meta");
                    } else {
                        return raw
                            .replaceAll("Ctrl", "control")
                            .replaceAll("Alt", "alt")
                            .replaceAll("Shift", "shift")
                            .replaceAll("Win", "meta");
                    }
                }
                mergeAttribute(attribute, value, allowOverwrite) {
                    if (allowOverwrite || !this[attribute]) {
                        this[attribute] = value;
                    }
                }
            };
            exports.KeyModifier = KeyModifier;
        },
    });

    // node_modules/zotero-plugin-toolkit/dist/index.js
    var require_dist = __commonJS({
        "node_modules/zotero-plugin-toolkit/dist/index.js"(exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.ZoteroToolkit = void 0;
            var basic_1 = require_basic();
            var ui_1 = require_ui();
            var reader_1 = require_reader();
            var extraField_1 = require_extraField();
            var itemTree_1 = require_itemTree();
            var prompt_1 = require_prompt();
            var libraryTabPanel_1 = require_libraryTabPanel();
            var readerTabPanel_1 = require_readerTabPanel();
            var menu_1 = require_menu();
            var preferencePane_1 = require_preferencePane();
            var shortcut_1 = require_shortcut();
            var clipboard_1 = require_clipboard();
            var filePicker_1 = require_filePicker();
            var progressWindow_1 = require_progressWindow();
            var virtualizedTable_1 = require_virtualizedTable();
            var dialog_1 = require_dialog();
            var readerInstance_1 = require_readerInstance();
            var fieldHook_1 = require_fieldHook();
            var itemBox_1 = require_itemBox();
            var largePref_1 = require_largePref();
            var keyboard_1 = require_keyboard();
            var patch_1 = require_patch();
            var ZoteroToolkit3 = class extends basic_1.BasicTool {
                constructor() {
                    super();
                    this.UI = new ui_1.UITool(this);
                    this.Reader = new reader_1.ReaderTool(this);
                    this.ExtraField = new extraField_1.ExtraFieldTool(this);
                    this.FieldHooks = new fieldHook_1.FieldHookManager(this);
                    this.ItemTree = new itemTree_1.ItemTreeManager(this);
                    this.ItemBox = new itemBox_1.ItemBoxManager(this);
                    this.Keyboard = new keyboard_1.KeyboardManager(this);
                    this.Prompt = new prompt_1.PromptManager(this);
                    this.LibraryTabPanel =
                        new libraryTabPanel_1.LibraryTabPanelManager(this);
                    this.ReaderTabPanel =
                        new readerTabPanel_1.ReaderTabPanelManager(this);
                    this.ReaderInstance =
                        new readerInstance_1.ReaderInstanceManager(this);
                    this.Menu = new menu_1.MenuManager(this);
                    this.PreferencePane =
                        new preferencePane_1.PreferencePaneManager(this);
                    this.Shortcut = new shortcut_1.ShortcutManager(this);
                    this.Clipboard = (0, basic_1.makeHelperTool)(
                        clipboard_1.ClipboardHelper,
                        this,
                    );
                    this.FilePicker = (0, basic_1.makeHelperTool)(
                        filePicker_1.FilePickerHelper,
                        this,
                    );
                    this.Patch = (0, basic_1.makeHelperTool)(
                        patch_1.PatchHelper,
                        this,
                    );
                    this.ProgressWindow = (0, basic_1.makeHelperTool)(
                        progressWindow_1.ProgressWindowHelper,
                        this,
                    );
                    this.VirtualizedTable = (0, basic_1.makeHelperTool)(
                        virtualizedTable_1.VirtualizedTableHelper,
                        this,
                    );
                    this.Dialog = (0, basic_1.makeHelperTool)(
                        dialog_1.DialogHelper,
                        this,
                    );
                    this.LargePrefObject = (0, basic_1.makeHelperTool)(
                        largePref_1.LargePrefHelper,
                        this,
                    );
                }
                /**
                 * Unregister everything created by managers.
                 */
                unregisterAll() {
                    (0, basic_1.unregister)(this);
                }
            };
            exports.ZoteroToolkit = ZoteroToolkit3;
            exports.default = ZoteroToolkit3;
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/utils.js
    var require_utils = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/utils.js"(exports) {
            "use strict";
            exports.__esModule = true;
            exports.extend = extend;
            exports.indexOf = indexOf;
            exports.escapeExpression = escapeExpression;
            exports.isEmpty = isEmpty;
            exports.createFrame = createFrame;
            exports.blockParams = blockParams;
            exports.appendContextPath = appendContextPath;
            var escape = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;",
                "=": "&#x3D;",
            };
            var badChars = /[&<>"'`=]/g;
            var possible = /[&<>"'`=]/;
            function escapeChar(chr) {
                return escape[chr];
            }
            function extend(obj) {
                for (var i = 1; i < arguments.length; i++) {
                    for (var key in arguments[i]) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                arguments[i],
                                key,
                            )
                        ) {
                            obj[key] = arguments[i][key];
                        }
                    }
                }
                return obj;
            }
            var toString = Object.prototype.toString;
            exports.toString = toString;
            var isFunction = function isFunction2(value) {
                return typeof value === "function";
            };
            if (isFunction(/x/)) {
                exports.isFunction = isFunction = function (value) {
                    return (
                        typeof value === "function" &&
                        toString.call(value) === "[object Function]"
                    );
                };
            }
            exports.isFunction = isFunction;
            var isArray =
                Array.isArray ||
                function (value) {
                    return value && typeof value === "object"
                        ? toString.call(value) === "[object Array]"
                        : false;
                };
            exports.isArray = isArray;
            function indexOf(array, value) {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i] === value) {
                        return i;
                    }
                }
                return -1;
            }
            function escapeExpression(string) {
                if (typeof string !== "string") {
                    if (string && string.toHTML) {
                        return string.toHTML();
                    } else if (string == null) {
                        return "";
                    } else if (!string) {
                        return string + "";
                    }
                    string = "" + string;
                }
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            }
            function isEmpty(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (isArray(value) && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
            function createFrame(object) {
                var frame = extend({}, object);
                frame._parent = object;
                return frame;
            }
            function blockParams(params, ids) {
                params.path = ids;
                return params;
            }
            function appendContextPath(contextPath, id) {
                return (contextPath ? contextPath + "." : "") + id;
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/exception.js
    var require_exception = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/exception.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var errorProps = [
                "description",
                "fileName",
                "lineNumber",
                "endLineNumber",
                "message",
                "name",
                "number",
                "stack",
            ];
            function Exception(message, node) {
                var loc = node && node.loc,
                    line = void 0,
                    endLineNumber = void 0,
                    column = void 0,
                    endColumn = void 0;
                if (loc) {
                    line = loc.start.line;
                    endLineNumber = loc.end.line;
                    column = loc.start.column;
                    endColumn = loc.end.column;
                    message += " - " + line + ":" + column;
                }
                var tmp = Error.prototype.constructor.call(this, message);
                for (var idx = 0; idx < errorProps.length; idx++) {
                    this[errorProps[idx]] = tmp[errorProps[idx]];
                }
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, Exception);
                }
                try {
                    if (loc) {
                        this.lineNumber = line;
                        this.endLineNumber = endLineNumber;
                        if (Object.defineProperty) {
                            Object.defineProperty(this, "column", {
                                value: column,
                                enumerable: true,
                            });
                            Object.defineProperty(this, "endColumn", {
                                value: endColumn,
                                enumerable: true,
                            });
                        } else {
                            this.column = column;
                            this.endColumn = endColumn;
                        }
                    }
                } catch (nop) {}
            }
            Exception.prototype = new Error();
            exports["default"] = Exception;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/block-helper-missing.js
    var require_block_helper_missing = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/block-helper-missing.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var _utils = require_utils();
            exports["default"] = function (instance) {
                instance.registerHelper(
                    "blockHelperMissing",
                    function (context, options) {
                        var inverse = options.inverse,
                            fn = options.fn;
                        if (context === true) {
                            return fn(this);
                        } else if (context === false || context == null) {
                            return inverse(this);
                        } else if (_utils.isArray(context)) {
                            if (context.length > 0) {
                                if (options.ids) {
                                    options.ids = [options.name];
                                }
                                return instance.helpers.each(context, options);
                            } else {
                                return inverse(this);
                            }
                        } else {
                            if (options.data && options.ids) {
                                var data = _utils.createFrame(options.data);
                                data.contextPath = _utils.appendContextPath(
                                    options.data.contextPath,
                                    options.name,
                                );
                                options = { data };
                            }
                            return fn(context, options);
                        }
                    },
                );
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/each.js
    var require_each = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/each.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _utils = require_utils();
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            exports["default"] = function (instance) {
                instance.registerHelper("each", function (context, options) {
                    if (!options) {
                        throw new _exception2["default"](
                            "Must pass iterator to #each",
                        );
                    }
                    var fn = options.fn,
                        inverse = options.inverse,
                        i = 0,
                        ret = "",
                        data = void 0,
                        contextPath = void 0;
                    if (options.data && options.ids) {
                        contextPath =
                            _utils.appendContextPath(
                                options.data.contextPath,
                                options.ids[0],
                            ) + ".";
                    }
                    if (_utils.isFunction(context)) {
                        context = context.call(this);
                    }
                    if (options.data) {
                        data = _utils.createFrame(options.data);
                    }
                    function execIteration(field, index, last) {
                        if (data) {
                            data.key = field;
                            data.index = index;
                            data.first = index === 0;
                            data.last = !!last;
                            if (contextPath) {
                                data.contextPath = contextPath + field;
                            }
                        }
                        ret =
                            ret +
                            fn(context[field], {
                                data,
                                blockParams: _utils.blockParams(
                                    [context[field], field],
                                    [contextPath + field, null],
                                ),
                            });
                    }
                    if (context && typeof context === "object") {
                        if (_utils.isArray(context)) {
                            for (var j = context.length; i < j; i++) {
                                if (i in context) {
                                    execIteration(
                                        i,
                                        i,
                                        i === context.length - 1,
                                    );
                                }
                            }
                        } else if (
                            typeof Symbol === "function" &&
                            context[Symbol.iterator]
                        ) {
                            var newContext = [];
                            var iterator = context[Symbol.iterator]();
                            for (
                                var it = iterator.next();
                                !it.done;
                                it = iterator.next()
                            ) {
                                newContext.push(it.value);
                            }
                            context = newContext;
                            for (var j = context.length; i < j; i++) {
                                execIteration(i, i, i === context.length - 1);
                            }
                        } else {
                            (function () {
                                var priorKey = void 0;
                                Object.keys(context).forEach(function (key) {
                                    if (priorKey !== void 0) {
                                        execIteration(priorKey, i - 1);
                                    }
                                    priorKey = key;
                                    i++;
                                });
                                if (priorKey !== void 0) {
                                    execIteration(priorKey, i - 1, true);
                                }
                            })();
                        }
                    }
                    if (i === 0) {
                        ret = inverse(this);
                    }
                    return ret;
                });
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/helper-missing.js
    var require_helper_missing = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/helper-missing.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            exports["default"] = function (instance) {
                instance.registerHelper("helperMissing", function () {
                    if (arguments.length === 1) {
                        return void 0;
                    } else {
                        throw new _exception2["default"](
                            'Missing helper: "' +
                                arguments[arguments.length - 1].name +
                                '"',
                        );
                    }
                });
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/if.js
    var require_if = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/if.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _utils = require_utils();
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            exports["default"] = function (instance) {
                instance.registerHelper("if", function (conditional, options) {
                    if (arguments.length != 2) {
                        throw new _exception2["default"](
                            "#if requires exactly one argument",
                        );
                    }
                    if (_utils.isFunction(conditional)) {
                        conditional = conditional.call(this);
                    }
                    if (
                        (!options.hash.includeZero && !conditional) ||
                        _utils.isEmpty(conditional)
                    ) {
                        return options.inverse(this);
                    } else {
                        return options.fn(this);
                    }
                });
                instance.registerHelper(
                    "unless",
                    function (conditional, options) {
                        if (arguments.length != 2) {
                            throw new _exception2["default"](
                                "#unless requires exactly one argument",
                            );
                        }
                        return instance.helpers["if"].call(this, conditional, {
                            fn: options.inverse,
                            inverse: options.fn,
                            hash: options.hash,
                        });
                    },
                );
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/log.js
    var require_log = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/log.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            exports["default"] = function (instance) {
                instance.registerHelper("log", function () {
                    var args = [void 0],
                        options = arguments[arguments.length - 1];
                    for (var i = 0; i < arguments.length - 1; i++) {
                        args.push(arguments[i]);
                    }
                    var level = 1;
                    if (options.hash.level != null) {
                        level = options.hash.level;
                    } else if (options.data && options.data.level != null) {
                        level = options.data.level;
                    }
                    args[0] = level;
                    instance.log.apply(instance, args);
                });
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/lookup.js
    var require_lookup = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/lookup.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            exports["default"] = function (instance) {
                instance.registerHelper(
                    "lookup",
                    function (obj, field, options) {
                        if (!obj) {
                            return obj;
                        }
                        return options.lookupProperty(obj, field);
                    },
                );
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers/with.js
    var require_with = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers/with.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _utils = require_utils();
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            exports["default"] = function (instance) {
                instance.registerHelper("with", function (context, options) {
                    if (arguments.length != 2) {
                        throw new _exception2["default"](
                            "#with requires exactly one argument",
                        );
                    }
                    if (_utils.isFunction(context)) {
                        context = context.call(this);
                    }
                    var fn = options.fn;
                    if (!_utils.isEmpty(context)) {
                        var data = options.data;
                        if (options.data && options.ids) {
                            data = _utils.createFrame(options.data);
                            data.contextPath = _utils.appendContextPath(
                                options.data.contextPath,
                                options.ids[0],
                            );
                        }
                        return fn(context, {
                            data,
                            blockParams: _utils.blockParams(
                                [context],
                                [data && data.contextPath],
                            ),
                        });
                    } else {
                        return options.inverse(this);
                    }
                });
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/helpers.js
    var require_helpers = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/helpers.js"(exports) {
            "use strict";
            exports.__esModule = true;
            exports.registerDefaultHelpers = registerDefaultHelpers;
            exports.moveHelperToHooks = moveHelperToHooks;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _helpersBlockHelperMissing = require_block_helper_missing();
            var _helpersBlockHelperMissing2 = _interopRequireDefault(
                _helpersBlockHelperMissing,
            );
            var _helpersEach = require_each();
            var _helpersEach2 = _interopRequireDefault(_helpersEach);
            var _helpersHelperMissing = require_helper_missing();
            var _helpersHelperMissing2 = _interopRequireDefault(
                _helpersHelperMissing,
            );
            var _helpersIf = require_if();
            var _helpersIf2 = _interopRequireDefault(_helpersIf);
            var _helpersLog = require_log();
            var _helpersLog2 = _interopRequireDefault(_helpersLog);
            var _helpersLookup = require_lookup();
            var _helpersLookup2 = _interopRequireDefault(_helpersLookup);
            var _helpersWith = require_with();
            var _helpersWith2 = _interopRequireDefault(_helpersWith);
            function registerDefaultHelpers(instance) {
                _helpersBlockHelperMissing2["default"](instance);
                _helpersEach2["default"](instance);
                _helpersHelperMissing2["default"](instance);
                _helpersIf2["default"](instance);
                _helpersLog2["default"](instance);
                _helpersLookup2["default"](instance);
                _helpersWith2["default"](instance);
            }
            function moveHelperToHooks(instance, helperName, keepHelper) {
                if (instance.helpers[helperName]) {
                    instance.hooks[helperName] = instance.helpers[helperName];
                    if (!keepHelper) {
                        delete instance.helpers[helperName];
                    }
                }
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/decorators/inline.js
    var require_inline = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/decorators/inline.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var _utils = require_utils();
            exports["default"] = function (instance) {
                instance.registerDecorator(
                    "inline",
                    function (fn, props, container, options) {
                        var ret = fn;
                        if (!props.partials) {
                            props.partials = {};
                            ret = function (context, options2) {
                                var original = container.partials;
                                container.partials = _utils.extend(
                                    {},
                                    original,
                                    props.partials,
                                );
                                var ret2 = fn(context, options2);
                                container.partials = original;
                                return ret2;
                            };
                        }
                        props.partials[options.args[0]] = options.fn;
                        return ret;
                    },
                );
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/decorators.js
    var require_decorators = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/decorators.js"(exports) {
            "use strict";
            exports.__esModule = true;
            exports.registerDefaultDecorators = registerDefaultDecorators;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _decoratorsInline = require_inline();
            var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);
            function registerDefaultDecorators(instance) {
                _decoratorsInline2["default"](instance);
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/logger.js
    var require_logger = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/logger.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var _utils = require_utils();
            var logger = {
                methodMap: ["debug", "info", "warn", "error"],
                level: "info",
                // Maps a given level value to the `methodMap` indexes above.
                lookupLevel: function lookupLevel(level) {
                    if (typeof level === "string") {
                        var levelMap = _utils.indexOf(
                            logger.methodMap,
                            level.toLowerCase(),
                        );
                        if (levelMap >= 0) {
                            level = levelMap;
                        } else {
                            level = parseInt(level, 10);
                        }
                    }
                    return level;
                },
                // Can be overridden in the host environment
                log: function log(level) {
                    level = logger.lookupLevel(level);
                    if (
                        typeof console !== "undefined" &&
                        logger.lookupLevel(logger.level) <= level
                    ) {
                        var method = logger.methodMap[level];
                        if (!console[method]) {
                            method = "log";
                        }
                        for (
                            var _len = arguments.length,
                                message = Array(_len > 1 ? _len - 1 : 0),
                                _key = 1;
                            _key < _len;
                            _key++
                        ) {
                            message[_key - 1] = arguments[_key];
                        }
                        console[method].apply(console, message);
                    }
                },
            };
            exports["default"] = logger;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/internal/create-new-lookup-object.js
    var require_create_new_lookup_object = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/internal/create-new-lookup-object.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.createNewLookupObject = createNewLookupObject;
            var _utils = require_utils();
            function createNewLookupObject() {
                for (
                    var _len = arguments.length,
                        sources = Array(_len),
                        _key = 0;
                    _key < _len;
                    _key++
                ) {
                    sources[_key] = arguments[_key];
                }
                return _utils.extend.apply(
                    void 0,
                    [/* @__PURE__ */ Object.create(null)].concat(sources),
                );
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/internal/proto-access.js
    var require_proto_access = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/internal/proto-access.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.createProtoAccessControl = createProtoAccessControl;
            exports.resultIsAllowed = resultIsAllowed;
            exports.resetLoggedProperties = resetLoggedProperties;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _createNewLookupObject = require_create_new_lookup_object();
            var _logger = require_logger();
            var _logger2 = _interopRequireDefault(_logger);
            var loggedProperties = /* @__PURE__ */ Object.create(null);
            function createProtoAccessControl(runtimeOptions) {
                var defaultMethodWhiteList =
                    /* @__PURE__ */ Object.create(null);
                defaultMethodWhiteList["constructor"] = false;
                defaultMethodWhiteList["__defineGetter__"] = false;
                defaultMethodWhiteList["__defineSetter__"] = false;
                defaultMethodWhiteList["__lookupGetter__"] = false;
                var defaultPropertyWhiteList =
                    /* @__PURE__ */ Object.create(null);
                defaultPropertyWhiteList["__proto__"] = false;
                return {
                    properties: {
                        whitelist: _createNewLookupObject.createNewLookupObject(
                            defaultPropertyWhiteList,
                            runtimeOptions.allowedProtoProperties,
                        ),
                        defaultValue:
                            runtimeOptions.allowProtoPropertiesByDefault,
                    },
                    methods: {
                        whitelist: _createNewLookupObject.createNewLookupObject(
                            defaultMethodWhiteList,
                            runtimeOptions.allowedProtoMethods,
                        ),
                        defaultValue: runtimeOptions.allowProtoMethodsByDefault,
                    },
                };
            }
            function resultIsAllowed(result, protoAccessControl, propertyName) {
                if (typeof result === "function") {
                    return checkWhiteList(
                        protoAccessControl.methods,
                        propertyName,
                    );
                } else {
                    return checkWhiteList(
                        protoAccessControl.properties,
                        propertyName,
                    );
                }
            }
            function checkWhiteList(protoAccessControlForType, propertyName) {
                if (
                    protoAccessControlForType.whitelist[propertyName] !== void 0
                ) {
                    return (
                        protoAccessControlForType.whitelist[propertyName] ===
                        true
                    );
                }
                if (protoAccessControlForType.defaultValue !== void 0) {
                    return protoAccessControlForType.defaultValue;
                }
                logUnexpecedPropertyAccessOnce(propertyName);
                return false;
            }
            function logUnexpecedPropertyAccessOnce(propertyName) {
                if (loggedProperties[propertyName] !== true) {
                    loggedProperties[propertyName] = true;
                    _logger2["default"].log(
                        "error",
                        'Handlebars: Access has been denied to resolve the property "' +
                            propertyName +
                            '" because it is not an "own property" of its parent.\nYou can add a runtime option to disable the check or this warning:\nSee https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details',
                    );
                }
            }
            function resetLoggedProperties() {
                Object.keys(loggedProperties).forEach(function (propertyName) {
                    delete loggedProperties[propertyName];
                });
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/base.js
    var require_base = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/base.js"(exports) {
            "use strict";
            exports.__esModule = true;
            exports.HandlebarsEnvironment = HandlebarsEnvironment;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _utils = require_utils();
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            var _helpers = require_helpers();
            var _decorators = require_decorators();
            var _logger = require_logger();
            var _logger2 = _interopRequireDefault(_logger);
            var _internalProtoAccess = require_proto_access();
            var VERSION = "4.7.8";
            exports.VERSION = VERSION;
            var COMPILER_REVISION = 8;
            exports.COMPILER_REVISION = COMPILER_REVISION;
            var LAST_COMPATIBLE_COMPILER_REVISION = 7;
            exports.LAST_COMPATIBLE_COMPILER_REVISION =
                LAST_COMPATIBLE_COMPILER_REVISION;
            var REVISION_CHANGES = {
                1: "<= 1.0.rc.2",
                // 1.0.rc.2 is actually rev2 but doesn't report it
                2: "== 1.0.0-rc.3",
                3: "== 1.0.0-rc.4",
                4: "== 1.x.x",
                5: "== 2.0.0-alpha.x",
                6: ">= 2.0.0-beta.1",
                7: ">= 4.0.0 <4.3.0",
                8: ">= 4.3.0",
            };
            exports.REVISION_CHANGES = REVISION_CHANGES;
            var objectType = "[object Object]";
            function HandlebarsEnvironment(helpers, partials, decorators) {
                this.helpers = helpers || {};
                this.partials = partials || {};
                this.decorators = decorators || {};
                _helpers.registerDefaultHelpers(this);
                _decorators.registerDefaultDecorators(this);
            }
            HandlebarsEnvironment.prototype = {
                constructor: HandlebarsEnvironment,
                logger: _logger2["default"],
                log: _logger2["default"].log,
                registerHelper: function registerHelper(name, fn) {
                    if (_utils.toString.call(name) === objectType) {
                        if (fn) {
                            throw new _exception2["default"](
                                "Arg not supported with multiple helpers",
                            );
                        }
                        _utils.extend(this.helpers, name);
                    } else {
                        this.helpers[name] = fn;
                    }
                },
                unregisterHelper: function unregisterHelper(name) {
                    delete this.helpers[name];
                },
                registerPartial: function registerPartial(name, partial) {
                    if (_utils.toString.call(name) === objectType) {
                        _utils.extend(this.partials, name);
                    } else {
                        if (typeof partial === "undefined") {
                            throw new _exception2["default"](
                                'Attempting to register a partial called "' +
                                    name +
                                    '" as undefined',
                            );
                        }
                        this.partials[name] = partial;
                    }
                },
                unregisterPartial: function unregisterPartial(name) {
                    delete this.partials[name];
                },
                registerDecorator: function registerDecorator(name, fn) {
                    if (_utils.toString.call(name) === objectType) {
                        if (fn) {
                            throw new _exception2["default"](
                                "Arg not supported with multiple decorators",
                            );
                        }
                        _utils.extend(this.decorators, name);
                    } else {
                        this.decorators[name] = fn;
                    }
                },
                unregisterDecorator: function unregisterDecorator(name) {
                    delete this.decorators[name];
                },
                /**
                 * Reset the memory of illegal property accesses that have already been logged.
                 * @deprecated should only be used in handlebars test-cases
                 */
                resetLoggedPropertyAccesses:
                    function resetLoggedPropertyAccesses() {
                        _internalProtoAccess.resetLoggedProperties();
                    },
            };
            var log = _logger2["default"].log;
            exports.log = log;
            exports.createFrame = _utils.createFrame;
            exports.logger = _logger2["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/safe-string.js
    var require_safe_string = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/safe-string.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function SafeString(string) {
                this.string = string;
            }
            SafeString.prototype.toString = SafeString.prototype.toHTML =
                function () {
                    return "" + this.string;
                };
            exports["default"] = SafeString;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/internal/wrapHelper.js
    var require_wrapHelper = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/internal/wrapHelper.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.wrapHelper = wrapHelper;
            function wrapHelper(helper, transformOptionsFn) {
                if (typeof helper !== "function") {
                    return helper;
                }
                var wrapper = function wrapper2() {
                    var options = arguments[arguments.length - 1];
                    arguments[arguments.length - 1] =
                        transformOptionsFn(options);
                    return helper.apply(this, arguments);
                };
                return wrapper;
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/runtime.js
    var require_runtime = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/runtime.js"(exports) {
            "use strict";
            exports.__esModule = true;
            exports.checkRevision = checkRevision;
            exports.template = template;
            exports.wrapProgram = wrapProgram;
            exports.resolvePartial = resolvePartial;
            exports.invokePartial = invokePartial;
            exports.noop = noop;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key))
                                newObj[key] = obj[key];
                        }
                    }
                    newObj["default"] = obj;
                    return newObj;
                }
            }
            var _utils = require_utils();
            var Utils = _interopRequireWildcard(_utils);
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            var _base = require_base();
            var _helpers = require_helpers();
            var _internalWrapHelper = require_wrapHelper();
            var _internalProtoAccess = require_proto_access();
            function checkRevision(compilerInfo) {
                var compilerRevision = (compilerInfo && compilerInfo[0]) || 1,
                    currentRevision = _base.COMPILER_REVISION;
                if (
                    compilerRevision >=
                        _base.LAST_COMPATIBLE_COMPILER_REVISION &&
                    compilerRevision <= _base.COMPILER_REVISION
                ) {
                    return;
                }
                if (
                    compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION
                ) {
                    var runtimeVersions =
                            _base.REVISION_CHANGES[currentRevision],
                        compilerVersions =
                            _base.REVISION_CHANGES[compilerRevision];
                    throw new _exception2["default"](
                        "Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" +
                            runtimeVersions +
                            ") or downgrade your runtime to an older version (" +
                            compilerVersions +
                            ").",
                    );
                } else {
                    throw new _exception2["default"](
                        "Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" +
                            compilerInfo[1] +
                            ").",
                    );
                }
            }
            function template(templateSpec, env) {
                if (!env) {
                    throw new _exception2["default"](
                        "No environment passed to template",
                    );
                }
                if (!templateSpec || !templateSpec.main) {
                    throw new _exception2["default"](
                        "Unknown template object: " + typeof templateSpec,
                    );
                }
                templateSpec.main.decorator = templateSpec.main_d;
                env.VM.checkRevision(templateSpec.compiler);
                var templateWasPrecompiledWithCompilerV7 =
                    templateSpec.compiler && templateSpec.compiler[0] === 7;
                function invokePartialWrapper(partial, context, options) {
                    if (options.hash) {
                        context = Utils.extend({}, context, options.hash);
                        if (options.ids) {
                            options.ids[0] = true;
                        }
                    }
                    partial = env.VM.resolvePartial.call(
                        this,
                        partial,
                        context,
                        options,
                    );
                    var extendedOptions = Utils.extend({}, options, {
                        hooks: this.hooks,
                        protoAccessControl: this.protoAccessControl,
                    });
                    var result = env.VM.invokePartial.call(
                        this,
                        partial,
                        context,
                        extendedOptions,
                    );
                    if (result == null && env.compile) {
                        options.partials[options.name] = env.compile(
                            partial,
                            templateSpec.compilerOptions,
                            env,
                        );
                        result = options.partials[options.name](
                            context,
                            extendedOptions,
                        );
                    }
                    if (result != null) {
                        if (options.indent) {
                            var lines = result.split("\n");
                            for (var i = 0, l = lines.length; i < l; i++) {
                                if (!lines[i] && i + 1 === l) {
                                    break;
                                }
                                lines[i] = options.indent + lines[i];
                            }
                            result = lines.join("\n");
                        }
                        return result;
                    } else {
                        throw new _exception2["default"](
                            "The partial " +
                                options.name +
                                " could not be compiled when running in runtime-only mode",
                        );
                    }
                }
                var container = {
                    strict: function strict(obj, name, loc) {
                        if (!obj || !(name in obj)) {
                            throw new _exception2["default"](
                                '"' + name + '" not defined in ' + obj,
                                {
                                    loc,
                                },
                            );
                        }
                        return container.lookupProperty(obj, name);
                    },
                    lookupProperty: function lookupProperty(
                        parent,
                        propertyName,
                    ) {
                        var result = parent[propertyName];
                        if (result == null) {
                            return result;
                        }
                        if (
                            Object.prototype.hasOwnProperty.call(
                                parent,
                                propertyName,
                            )
                        ) {
                            return result;
                        }
                        if (
                            _internalProtoAccess.resultIsAllowed(
                                result,
                                container.protoAccessControl,
                                propertyName,
                            )
                        ) {
                            return result;
                        }
                        return void 0;
                    },
                    lookup: function lookup(depths, name) {
                        var len = depths.length;
                        for (var i = 0; i < len; i++) {
                            var result =
                                depths[i] &&
                                container.lookupProperty(depths[i], name);
                            if (result != null) {
                                return depths[i][name];
                            }
                        }
                    },
                    lambda: function lambda(current, context) {
                        return typeof current === "function"
                            ? current.call(context)
                            : current;
                    },
                    escapeExpression: Utils.escapeExpression,
                    invokePartial: invokePartialWrapper,
                    fn: function fn(i) {
                        var ret2 = templateSpec[i];
                        ret2.decorator = templateSpec[i + "_d"];
                        return ret2;
                    },
                    programs: [],
                    program: function program(
                        i,
                        data,
                        declaredBlockParams,
                        blockParams,
                        depths,
                    ) {
                        var programWrapper = this.programs[i],
                            fn = this.fn(i);
                        if (
                            data ||
                            depths ||
                            blockParams ||
                            declaredBlockParams
                        ) {
                            programWrapper = wrapProgram(
                                this,
                                i,
                                fn,
                                data,
                                declaredBlockParams,
                                blockParams,
                                depths,
                            );
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = wrapProgram(
                                this,
                                i,
                                fn,
                            );
                        }
                        return programWrapper;
                    },
                    data: function data(value, depth) {
                        while (value && depth--) {
                            value = value._parent;
                        }
                        return value;
                    },
                    mergeIfNeeded: function mergeIfNeeded(param, common) {
                        var obj = param || common;
                        if (param && common && param !== common) {
                            obj = Utils.extend({}, common, param);
                        }
                        return obj;
                    },
                    // An empty object to use as replacement for null-contexts
                    nullContext: Object.seal({}),
                    noop: env.VM.noop,
                    compilerInfo: templateSpec.compiler,
                };
                function ret(context) {
                    var options =
                        arguments.length <= 1 || arguments[1] === void 0
                            ? {}
                            : arguments[1];
                    var data = options.data;
                    ret._setup(options);
                    if (!options.partial && templateSpec.useData) {
                        data = initData(context, data);
                    }
                    var depths = void 0,
                        blockParams = templateSpec.useBlockParams ? [] : void 0;
                    if (templateSpec.useDepths) {
                        if (options.depths) {
                            depths =
                                context != options.depths[0]
                                    ? [context].concat(options.depths)
                                    : options.depths;
                        } else {
                            depths = [context];
                        }
                    }
                    function main(context2) {
                        return (
                            "" +
                            templateSpec.main(
                                container,
                                context2,
                                container.helpers,
                                container.partials,
                                data,
                                blockParams,
                                depths,
                            )
                        );
                    }
                    main = executeDecorators(
                        templateSpec.main,
                        main,
                        container,
                        options.depths || [],
                        data,
                        blockParams,
                    );
                    return main(context, options);
                }
                ret.isTop = true;
                ret._setup = function (options) {
                    if (!options.partial) {
                        var mergedHelpers = Utils.extend(
                            {},
                            env.helpers,
                            options.helpers,
                        );
                        wrapHelpersToPassLookupProperty(
                            mergedHelpers,
                            container,
                        );
                        container.helpers = mergedHelpers;
                        if (templateSpec.usePartial) {
                            container.partials = container.mergeIfNeeded(
                                options.partials,
                                env.partials,
                            );
                        }
                        if (
                            templateSpec.usePartial ||
                            templateSpec.useDecorators
                        ) {
                            container.decorators = Utils.extend(
                                {},
                                env.decorators,
                                options.decorators,
                            );
                        }
                        container.hooks = {};
                        container.protoAccessControl =
                            _internalProtoAccess.createProtoAccessControl(
                                options,
                            );
                        var keepHelperInHelpers =
                            options.allowCallsToHelperMissing ||
                            templateWasPrecompiledWithCompilerV7;
                        _helpers.moveHelperToHooks(
                            container,
                            "helperMissing",
                            keepHelperInHelpers,
                        );
                        _helpers.moveHelperToHooks(
                            container,
                            "blockHelperMissing",
                            keepHelperInHelpers,
                        );
                    } else {
                        container.protoAccessControl =
                            options.protoAccessControl;
                        container.helpers = options.helpers;
                        container.partials = options.partials;
                        container.decorators = options.decorators;
                        container.hooks = options.hooks;
                    }
                };
                ret._child = function (i, data, blockParams, depths) {
                    if (templateSpec.useBlockParams && !blockParams) {
                        throw new _exception2["default"](
                            "must pass block params",
                        );
                    }
                    if (templateSpec.useDepths && !depths) {
                        throw new _exception2["default"](
                            "must pass parent depths",
                        );
                    }
                    return wrapProgram(
                        container,
                        i,
                        templateSpec[i],
                        data,
                        0,
                        blockParams,
                        depths,
                    );
                };
                return ret;
            }
            function wrapProgram(
                container,
                i,
                fn,
                data,
                declaredBlockParams,
                blockParams,
                depths,
            ) {
                function prog(context) {
                    var options =
                        arguments.length <= 1 || arguments[1] === void 0
                            ? {}
                            : arguments[1];
                    var currentDepths = depths;
                    if (
                        depths &&
                        context != depths[0] &&
                        !(
                            context === container.nullContext &&
                            depths[0] === null
                        )
                    ) {
                        currentDepths = [context].concat(depths);
                    }
                    return fn(
                        container,
                        context,
                        container.helpers,
                        container.partials,
                        options.data || data,
                        blockParams &&
                            [options.blockParams].concat(blockParams),
                        currentDepths,
                    );
                }
                prog = executeDecorators(
                    fn,
                    prog,
                    container,
                    depths,
                    data,
                    blockParams,
                );
                prog.program = i;
                prog.depth = depths ? depths.length : 0;
                prog.blockParams = declaredBlockParams || 0;
                return prog;
            }
            function resolvePartial(partial, context, options) {
                if (!partial) {
                    if (options.name === "@partial-block") {
                        partial = options.data["partial-block"];
                    } else {
                        partial = options.partials[options.name];
                    }
                } else if (!partial.call && !options.name) {
                    options.name = partial;
                    partial = options.partials[partial];
                }
                return partial;
            }
            function invokePartial(partial, context, options) {
                var currentPartialBlock =
                    options.data && options.data["partial-block"];
                options.partial = true;
                if (options.ids) {
                    options.data.contextPath =
                        options.ids[0] || options.data.contextPath;
                }
                var partialBlock = void 0;
                if (options.fn && options.fn !== noop) {
                    (function () {
                        options.data = _base.createFrame(options.data);
                        var fn = options.fn;
                        partialBlock = options.data["partial-block"] =
                            function partialBlockWrapper(context2) {
                                var options2 =
                                    arguments.length <= 1 ||
                                    arguments[1] === void 0
                                        ? {}
                                        : arguments[1];
                                options2.data = _base.createFrame(
                                    options2.data,
                                );
                                options2.data["partial-block"] =
                                    currentPartialBlock;
                                return fn(context2, options2);
                            };
                        if (fn.partials) {
                            options.partials = Utils.extend(
                                {},
                                options.partials,
                                fn.partials,
                            );
                        }
                    })();
                }
                if (partial === void 0 && partialBlock) {
                    partial = partialBlock;
                }
                if (partial === void 0) {
                    throw new _exception2["default"](
                        "The partial " + options.name + " could not be found",
                    );
                } else if (partial instanceof Function) {
                    return partial(context, options);
                }
            }
            function noop() {
                return "";
            }
            function initData(context, data) {
                if (!data || !("root" in data)) {
                    data = data ? _base.createFrame(data) : {};
                    data.root = context;
                }
                return data;
            }
            function executeDecorators(
                fn,
                prog,
                container,
                depths,
                data,
                blockParams,
            ) {
                if (fn.decorator) {
                    var props = {};
                    prog = fn.decorator(
                        prog,
                        props,
                        container,
                        depths && depths[0],
                        data,
                        blockParams,
                        depths,
                    );
                    Utils.extend(prog, props);
                }
                return prog;
            }
            function wrapHelpersToPassLookupProperty(mergedHelpers, container) {
                Object.keys(mergedHelpers).forEach(function (helperName) {
                    var helper = mergedHelpers[helperName];
                    mergedHelpers[helperName] = passLookupPropertyOption(
                        helper,
                        container,
                    );
                });
            }
            function passLookupPropertyOption(helper, container) {
                var lookupProperty = container.lookupProperty;
                return _internalWrapHelper.wrapHelper(
                    helper,
                    function (options) {
                        return Utils.extend({ lookupProperty }, options);
                    },
                );
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/no-conflict.js
    var require_no_conflict = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/no-conflict.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            exports["default"] = function (Handlebars2) {
                (function () {
                    if (typeof globalThis === "object") return;
                    Object.prototype.__defineGetter__("__magic__", function () {
                        return this;
                    });
                    __magic__.globalThis = __magic__;
                    delete Object.prototype.__magic__;
                })();
                var $Handlebars = globalThis.Handlebars;
                Handlebars2.noConflict = function () {
                    if (globalThis.Handlebars === Handlebars2) {
                        globalThis.Handlebars = $Handlebars;
                    }
                    return Handlebars2;
                };
            };
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars.runtime.js
    var require_handlebars_runtime = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars.runtime.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key))
                                newObj[key] = obj[key];
                        }
                    }
                    newObj["default"] = obj;
                    return newObj;
                }
            }
            var _handlebarsBase = require_base();
            var base = _interopRequireWildcard(_handlebarsBase);
            var _handlebarsSafeString = require_safe_string();
            var _handlebarsSafeString2 = _interopRequireDefault(
                _handlebarsSafeString,
            );
            var _handlebarsException = require_exception();
            var _handlebarsException2 =
                _interopRequireDefault(_handlebarsException);
            var _handlebarsUtils = require_utils();
            var Utils = _interopRequireWildcard(_handlebarsUtils);
            var _handlebarsRuntime = require_runtime();
            var runtime = _interopRequireWildcard(_handlebarsRuntime);
            var _handlebarsNoConflict = require_no_conflict();
            var _handlebarsNoConflict2 = _interopRequireDefault(
                _handlebarsNoConflict,
            );
            function create() {
                var hb = new base.HandlebarsEnvironment();
                Utils.extend(hb, base);
                hb.SafeString = _handlebarsSafeString2["default"];
                hb.Exception = _handlebarsException2["default"];
                hb.Utils = Utils;
                hb.escapeExpression = Utils.escapeExpression;
                hb.VM = runtime;
                hb.template = function (spec) {
                    return runtime.template(spec, hb);
                };
                return hb;
            }
            var inst = create();
            inst.create = create;
            _handlebarsNoConflict2["default"](inst);
            inst["default"] = inst;
            exports["default"] = inst;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/ast.js
    var require_ast = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/ast.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var AST = {
                // Public API used to evaluate derived attributes regarding AST nodes
                helpers: {
                    // a mustache is definitely a helper if:
                    // * it is an eligible helper, and
                    // * it has at least one parameter or hash segment
                    helperExpression: function helperExpression(node) {
                        return (
                            node.type === "SubExpression" ||
                            ((node.type === "MustacheStatement" ||
                                node.type === "BlockStatement") &&
                                !!(
                                    (node.params && node.params.length) ||
                                    node.hash
                                ))
                        );
                    },
                    scopedId: function scopedId(path) {
                        return /^\.|this\b/.test(path.original);
                    },
                    // an ID is simple if it only has one part, and that part is not
                    // `..` or `this`.
                    simpleId: function simpleId(path) {
                        return (
                            path.parts.length === 1 &&
                            !AST.helpers.scopedId(path) &&
                            !path.depth
                        );
                    },
                },
            };
            exports["default"] = AST;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/parser.js
    var require_parser = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/parser.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var handlebars = (function () {
                var parser = {
                    trace: function trace() {},
                    yy: {},
                    symbols_: {
                        error: 2,
                        root: 3,
                        program: 4,
                        EOF: 5,
                        program_repetition0: 6,
                        statement: 7,
                        mustache: 8,
                        block: 9,
                        rawBlock: 10,
                        partial: 11,
                        partialBlock: 12,
                        content: 13,
                        COMMENT: 14,
                        CONTENT: 15,
                        openRawBlock: 16,
                        rawBlock_repetition0: 17,
                        END_RAW_BLOCK: 18,
                        OPEN_RAW_BLOCK: 19,
                        helperName: 20,
                        openRawBlock_repetition0: 21,
                        openRawBlock_option0: 22,
                        CLOSE_RAW_BLOCK: 23,
                        openBlock: 24,
                        block_option0: 25,
                        closeBlock: 26,
                        openInverse: 27,
                        block_option1: 28,
                        OPEN_BLOCK: 29,
                        openBlock_repetition0: 30,
                        openBlock_option0: 31,
                        openBlock_option1: 32,
                        CLOSE: 33,
                        OPEN_INVERSE: 34,
                        openInverse_repetition0: 35,
                        openInverse_option0: 36,
                        openInverse_option1: 37,
                        openInverseChain: 38,
                        OPEN_INVERSE_CHAIN: 39,
                        openInverseChain_repetition0: 40,
                        openInverseChain_option0: 41,
                        openInverseChain_option1: 42,
                        inverseAndProgram: 43,
                        INVERSE: 44,
                        inverseChain: 45,
                        inverseChain_option0: 46,
                        OPEN_ENDBLOCK: 47,
                        OPEN: 48,
                        mustache_repetition0: 49,
                        mustache_option0: 50,
                        OPEN_UNESCAPED: 51,
                        mustache_repetition1: 52,
                        mustache_option1: 53,
                        CLOSE_UNESCAPED: 54,
                        OPEN_PARTIAL: 55,
                        partialName: 56,
                        partial_repetition0: 57,
                        partial_option0: 58,
                        openPartialBlock: 59,
                        OPEN_PARTIAL_BLOCK: 60,
                        openPartialBlock_repetition0: 61,
                        openPartialBlock_option0: 62,
                        param: 63,
                        sexpr: 64,
                        OPEN_SEXPR: 65,
                        sexpr_repetition0: 66,
                        sexpr_option0: 67,
                        CLOSE_SEXPR: 68,
                        hash: 69,
                        hash_repetition_plus0: 70,
                        hashSegment: 71,
                        ID: 72,
                        EQUALS: 73,
                        blockParams: 74,
                        OPEN_BLOCK_PARAMS: 75,
                        blockParams_repetition_plus0: 76,
                        CLOSE_BLOCK_PARAMS: 77,
                        path: 78,
                        dataName: 79,
                        STRING: 80,
                        NUMBER: 81,
                        BOOLEAN: 82,
                        UNDEFINED: 83,
                        NULL: 84,
                        DATA: 85,
                        pathSegments: 86,
                        SEP: 87,
                        $accept: 0,
                        $end: 1,
                    },
                    terminals_: {
                        2: "error",
                        5: "EOF",
                        14: "COMMENT",
                        15: "CONTENT",
                        18: "END_RAW_BLOCK",
                        19: "OPEN_RAW_BLOCK",
                        23: "CLOSE_RAW_BLOCK",
                        29: "OPEN_BLOCK",
                        33: "CLOSE",
                        34: "OPEN_INVERSE",
                        39: "OPEN_INVERSE_CHAIN",
                        44: "INVERSE",
                        47: "OPEN_ENDBLOCK",
                        48: "OPEN",
                        51: "OPEN_UNESCAPED",
                        54: "CLOSE_UNESCAPED",
                        55: "OPEN_PARTIAL",
                        60: "OPEN_PARTIAL_BLOCK",
                        65: "OPEN_SEXPR",
                        68: "CLOSE_SEXPR",
                        72: "ID",
                        73: "EQUALS",
                        75: "OPEN_BLOCK_PARAMS",
                        77: "CLOSE_BLOCK_PARAMS",
                        80: "STRING",
                        81: "NUMBER",
                        82: "BOOLEAN",
                        83: "UNDEFINED",
                        84: "NULL",
                        85: "DATA",
                        87: "SEP",
                    },
                    productions_: [
                        0,
                        [3, 2],
                        [4, 1],
                        [7, 1],
                        [7, 1],
                        [7, 1],
                        [7, 1],
                        [7, 1],
                        [7, 1],
                        [7, 1],
                        [13, 1],
                        [10, 3],
                        [16, 5],
                        [9, 4],
                        [9, 4],
                        [24, 6],
                        [27, 6],
                        [38, 6],
                        [43, 2],
                        [45, 3],
                        [45, 1],
                        [26, 3],
                        [8, 5],
                        [8, 5],
                        [11, 5],
                        [12, 3],
                        [59, 5],
                        [63, 1],
                        [63, 1],
                        [64, 5],
                        [69, 1],
                        [71, 3],
                        [74, 3],
                        [20, 1],
                        [20, 1],
                        [20, 1],
                        [20, 1],
                        [20, 1],
                        [20, 1],
                        [20, 1],
                        [56, 1],
                        [56, 1],
                        [79, 2],
                        [78, 1],
                        [86, 3],
                        [86, 1],
                        [6, 0],
                        [6, 2],
                        [17, 0],
                        [17, 2],
                        [21, 0],
                        [21, 2],
                        [22, 0],
                        [22, 1],
                        [25, 0],
                        [25, 1],
                        [28, 0],
                        [28, 1],
                        [30, 0],
                        [30, 2],
                        [31, 0],
                        [31, 1],
                        [32, 0],
                        [32, 1],
                        [35, 0],
                        [35, 2],
                        [36, 0],
                        [36, 1],
                        [37, 0],
                        [37, 1],
                        [40, 0],
                        [40, 2],
                        [41, 0],
                        [41, 1],
                        [42, 0],
                        [42, 1],
                        [46, 0],
                        [46, 1],
                        [49, 0],
                        [49, 2],
                        [50, 0],
                        [50, 1],
                        [52, 0],
                        [52, 2],
                        [53, 0],
                        [53, 1],
                        [57, 0],
                        [57, 2],
                        [58, 0],
                        [58, 1],
                        [61, 0],
                        [61, 2],
                        [62, 0],
                        [62, 1],
                        [66, 0],
                        [66, 2],
                        [67, 0],
                        [67, 1],
                        [70, 1],
                        [70, 2],
                        [76, 1],
                        [76, 2],
                    ],
                    performAction: function anonymous(
                        yytext,
                        yyleng,
                        yylineno,
                        yy,
                        yystate,
                        $$,
                        _$,
                    ) {
                        var $0 = $$.length - 1;
                        switch (yystate) {
                            case 1:
                                return $$[$0 - 1];
                                break;
                            case 2:
                                this.$ = yy.prepareProgram($$[$0]);
                                break;
                            case 3:
                                this.$ = $$[$0];
                                break;
                            case 4:
                                this.$ = $$[$0];
                                break;
                            case 5:
                                this.$ = $$[$0];
                                break;
                            case 6:
                                this.$ = $$[$0];
                                break;
                            case 7:
                                this.$ = $$[$0];
                                break;
                            case 8:
                                this.$ = $$[$0];
                                break;
                            case 9:
                                this.$ = {
                                    type: "CommentStatement",
                                    value: yy.stripComment($$[$0]),
                                    strip: yy.stripFlags($$[$0], $$[$0]),
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 10:
                                this.$ = {
                                    type: "ContentStatement",
                                    original: $$[$0],
                                    value: $$[$0],
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 11:
                                this.$ = yy.prepareRawBlock(
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0],
                                    this._$,
                                );
                                break;
                            case 12:
                                this.$ = {
                                    path: $$[$0 - 3],
                                    params: $$[$0 - 2],
                                    hash: $$[$0 - 1],
                                };
                                break;
                            case 13:
                                this.$ = yy.prepareBlock(
                                    $$[$0 - 3],
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0],
                                    false,
                                    this._$,
                                );
                                break;
                            case 14:
                                this.$ = yy.prepareBlock(
                                    $$[$0 - 3],
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0],
                                    true,
                                    this._$,
                                );
                                break;
                            case 15:
                                this.$ = {
                                    open: $$[$0 - 5],
                                    path: $$[$0 - 4],
                                    params: $$[$0 - 3],
                                    hash: $$[$0 - 2],
                                    blockParams: $$[$0 - 1],
                                    strip: yy.stripFlags($$[$0 - 5], $$[$0]),
                                };
                                break;
                            case 16:
                                this.$ = {
                                    path: $$[$0 - 4],
                                    params: $$[$0 - 3],
                                    hash: $$[$0 - 2],
                                    blockParams: $$[$0 - 1],
                                    strip: yy.stripFlags($$[$0 - 5], $$[$0]),
                                };
                                break;
                            case 17:
                                this.$ = {
                                    path: $$[$0 - 4],
                                    params: $$[$0 - 3],
                                    hash: $$[$0 - 2],
                                    blockParams: $$[$0 - 1],
                                    strip: yy.stripFlags($$[$0 - 5], $$[$0]),
                                };
                                break;
                            case 18:
                                this.$ = {
                                    strip: yy.stripFlags(
                                        $$[$0 - 1],
                                        $$[$0 - 1],
                                    ),
                                    program: $$[$0],
                                };
                                break;
                            case 19:
                                var inverse = yy.prepareBlock(
                                        $$[$0 - 2],
                                        $$[$0 - 1],
                                        $$[$0],
                                        $$[$0],
                                        false,
                                        this._$,
                                    ),
                                    program = yy.prepareProgram(
                                        [inverse],
                                        $$[$0 - 1].loc,
                                    );
                                program.chained = true;
                                this.$ = {
                                    strip: $$[$0 - 2].strip,
                                    program,
                                    chain: true,
                                };
                                break;
                            case 20:
                                this.$ = $$[$0];
                                break;
                            case 21:
                                this.$ = {
                                    path: $$[$0 - 1],
                                    strip: yy.stripFlags($$[$0 - 2], $$[$0]),
                                };
                                break;
                            case 22:
                                this.$ = yy.prepareMustache(
                                    $$[$0 - 3],
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0 - 4],
                                    yy.stripFlags($$[$0 - 4], $$[$0]),
                                    this._$,
                                );
                                break;
                            case 23:
                                this.$ = yy.prepareMustache(
                                    $$[$0 - 3],
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0 - 4],
                                    yy.stripFlags($$[$0 - 4], $$[$0]),
                                    this._$,
                                );
                                break;
                            case 24:
                                this.$ = {
                                    type: "PartialStatement",
                                    name: $$[$0 - 3],
                                    params: $$[$0 - 2],
                                    hash: $$[$0 - 1],
                                    indent: "",
                                    strip: yy.stripFlags($$[$0 - 4], $$[$0]),
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 25:
                                this.$ = yy.preparePartialBlock(
                                    $$[$0 - 2],
                                    $$[$0 - 1],
                                    $$[$0],
                                    this._$,
                                );
                                break;
                            case 26:
                                this.$ = {
                                    path: $$[$0 - 3],
                                    params: $$[$0 - 2],
                                    hash: $$[$0 - 1],
                                    strip: yy.stripFlags($$[$0 - 4], $$[$0]),
                                };
                                break;
                            case 27:
                                this.$ = $$[$0];
                                break;
                            case 28:
                                this.$ = $$[$0];
                                break;
                            case 29:
                                this.$ = {
                                    type: "SubExpression",
                                    path: $$[$0 - 3],
                                    params: $$[$0 - 2],
                                    hash: $$[$0 - 1],
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 30:
                                this.$ = {
                                    type: "Hash",
                                    pairs: $$[$0],
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 31:
                                this.$ = {
                                    type: "HashPair",
                                    key: yy.id($$[$0 - 2]),
                                    value: $$[$0],
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 32:
                                this.$ = yy.id($$[$0 - 1]);
                                break;
                            case 33:
                                this.$ = $$[$0];
                                break;
                            case 34:
                                this.$ = $$[$0];
                                break;
                            case 35:
                                this.$ = {
                                    type: "StringLiteral",
                                    value: $$[$0],
                                    original: $$[$0],
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 36:
                                this.$ = {
                                    type: "NumberLiteral",
                                    value: Number($$[$0]),
                                    original: Number($$[$0]),
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 37:
                                this.$ = {
                                    type: "BooleanLiteral",
                                    value: $$[$0] === "true",
                                    original: $$[$0] === "true",
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 38:
                                this.$ = {
                                    type: "UndefinedLiteral",
                                    original: void 0,
                                    value: void 0,
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 39:
                                this.$ = {
                                    type: "NullLiteral",
                                    original: null,
                                    value: null,
                                    loc: yy.locInfo(this._$),
                                };
                                break;
                            case 40:
                                this.$ = $$[$0];
                                break;
                            case 41:
                                this.$ = $$[$0];
                                break;
                            case 42:
                                this.$ = yy.preparePath(true, $$[$0], this._$);
                                break;
                            case 43:
                                this.$ = yy.preparePath(false, $$[$0], this._$);
                                break;
                            case 44:
                                $$[$0 - 2].push({
                                    part: yy.id($$[$0]),
                                    original: $$[$0],
                                    separator: $$[$0 - 1],
                                });
                                this.$ = $$[$0 - 2];
                                break;
                            case 45:
                                this.$ = [
                                    { part: yy.id($$[$0]), original: $$[$0] },
                                ];
                                break;
                            case 46:
                                this.$ = [];
                                break;
                            case 47:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 48:
                                this.$ = [];
                                break;
                            case 49:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 50:
                                this.$ = [];
                                break;
                            case 51:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 58:
                                this.$ = [];
                                break;
                            case 59:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 64:
                                this.$ = [];
                                break;
                            case 65:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 70:
                                this.$ = [];
                                break;
                            case 71:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 78:
                                this.$ = [];
                                break;
                            case 79:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 82:
                                this.$ = [];
                                break;
                            case 83:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 86:
                                this.$ = [];
                                break;
                            case 87:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 90:
                                this.$ = [];
                                break;
                            case 91:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 94:
                                this.$ = [];
                                break;
                            case 95:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 98:
                                this.$ = [$$[$0]];
                                break;
                            case 99:
                                $$[$0 - 1].push($$[$0]);
                                break;
                            case 100:
                                this.$ = [$$[$0]];
                                break;
                            case 101:
                                $$[$0 - 1].push($$[$0]);
                                break;
                        }
                    },
                    table: [
                        {
                            3: 1,
                            4: 2,
                            5: [2, 46],
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        { 1: [3] },
                        { 5: [1, 4] },
                        {
                            5: [2, 2],
                            7: 5,
                            8: 6,
                            9: 7,
                            10: 8,
                            11: 9,
                            12: 10,
                            13: 11,
                            14: [1, 12],
                            15: [1, 20],
                            16: 17,
                            19: [1, 23],
                            24: 15,
                            27: 16,
                            29: [1, 21],
                            34: [1, 22],
                            39: [2, 2],
                            44: [2, 2],
                            47: [2, 2],
                            48: [1, 13],
                            51: [1, 14],
                            55: [1, 18],
                            59: 19,
                            60: [1, 24],
                        },
                        { 1: [2, 1] },
                        {
                            5: [2, 47],
                            14: [2, 47],
                            15: [2, 47],
                            19: [2, 47],
                            29: [2, 47],
                            34: [2, 47],
                            39: [2, 47],
                            44: [2, 47],
                            47: [2, 47],
                            48: [2, 47],
                            51: [2, 47],
                            55: [2, 47],
                            60: [2, 47],
                        },
                        {
                            5: [2, 3],
                            14: [2, 3],
                            15: [2, 3],
                            19: [2, 3],
                            29: [2, 3],
                            34: [2, 3],
                            39: [2, 3],
                            44: [2, 3],
                            47: [2, 3],
                            48: [2, 3],
                            51: [2, 3],
                            55: [2, 3],
                            60: [2, 3],
                        },
                        {
                            5: [2, 4],
                            14: [2, 4],
                            15: [2, 4],
                            19: [2, 4],
                            29: [2, 4],
                            34: [2, 4],
                            39: [2, 4],
                            44: [2, 4],
                            47: [2, 4],
                            48: [2, 4],
                            51: [2, 4],
                            55: [2, 4],
                            60: [2, 4],
                        },
                        {
                            5: [2, 5],
                            14: [2, 5],
                            15: [2, 5],
                            19: [2, 5],
                            29: [2, 5],
                            34: [2, 5],
                            39: [2, 5],
                            44: [2, 5],
                            47: [2, 5],
                            48: [2, 5],
                            51: [2, 5],
                            55: [2, 5],
                            60: [2, 5],
                        },
                        {
                            5: [2, 6],
                            14: [2, 6],
                            15: [2, 6],
                            19: [2, 6],
                            29: [2, 6],
                            34: [2, 6],
                            39: [2, 6],
                            44: [2, 6],
                            47: [2, 6],
                            48: [2, 6],
                            51: [2, 6],
                            55: [2, 6],
                            60: [2, 6],
                        },
                        {
                            5: [2, 7],
                            14: [2, 7],
                            15: [2, 7],
                            19: [2, 7],
                            29: [2, 7],
                            34: [2, 7],
                            39: [2, 7],
                            44: [2, 7],
                            47: [2, 7],
                            48: [2, 7],
                            51: [2, 7],
                            55: [2, 7],
                            60: [2, 7],
                        },
                        {
                            5: [2, 8],
                            14: [2, 8],
                            15: [2, 8],
                            19: [2, 8],
                            29: [2, 8],
                            34: [2, 8],
                            39: [2, 8],
                            44: [2, 8],
                            47: [2, 8],
                            48: [2, 8],
                            51: [2, 8],
                            55: [2, 8],
                            60: [2, 8],
                        },
                        {
                            5: [2, 9],
                            14: [2, 9],
                            15: [2, 9],
                            19: [2, 9],
                            29: [2, 9],
                            34: [2, 9],
                            39: [2, 9],
                            44: [2, 9],
                            47: [2, 9],
                            48: [2, 9],
                            51: [2, 9],
                            55: [2, 9],
                            60: [2, 9],
                        },
                        {
                            20: 25,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 36,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            4: 37,
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            39: [2, 46],
                            44: [2, 46],
                            47: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        {
                            4: 38,
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            44: [2, 46],
                            47: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        { 15: [2, 48], 17: 39, 18: [2, 48] },
                        {
                            20: 41,
                            56: 40,
                            64: 42,
                            65: [1, 43],
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            4: 44,
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            47: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        {
                            5: [2, 10],
                            14: [2, 10],
                            15: [2, 10],
                            18: [2, 10],
                            19: [2, 10],
                            29: [2, 10],
                            34: [2, 10],
                            39: [2, 10],
                            44: [2, 10],
                            47: [2, 10],
                            48: [2, 10],
                            51: [2, 10],
                            55: [2, 10],
                            60: [2, 10],
                        },
                        {
                            20: 45,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 46,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 47,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 41,
                            56: 48,
                            64: 42,
                            65: [1, 43],
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            33: [2, 78],
                            49: 49,
                            65: [2, 78],
                            72: [2, 78],
                            80: [2, 78],
                            81: [2, 78],
                            82: [2, 78],
                            83: [2, 78],
                            84: [2, 78],
                            85: [2, 78],
                        },
                        {
                            23: [2, 33],
                            33: [2, 33],
                            54: [2, 33],
                            65: [2, 33],
                            68: [2, 33],
                            72: [2, 33],
                            75: [2, 33],
                            80: [2, 33],
                            81: [2, 33],
                            82: [2, 33],
                            83: [2, 33],
                            84: [2, 33],
                            85: [2, 33],
                        },
                        {
                            23: [2, 34],
                            33: [2, 34],
                            54: [2, 34],
                            65: [2, 34],
                            68: [2, 34],
                            72: [2, 34],
                            75: [2, 34],
                            80: [2, 34],
                            81: [2, 34],
                            82: [2, 34],
                            83: [2, 34],
                            84: [2, 34],
                            85: [2, 34],
                        },
                        {
                            23: [2, 35],
                            33: [2, 35],
                            54: [2, 35],
                            65: [2, 35],
                            68: [2, 35],
                            72: [2, 35],
                            75: [2, 35],
                            80: [2, 35],
                            81: [2, 35],
                            82: [2, 35],
                            83: [2, 35],
                            84: [2, 35],
                            85: [2, 35],
                        },
                        {
                            23: [2, 36],
                            33: [2, 36],
                            54: [2, 36],
                            65: [2, 36],
                            68: [2, 36],
                            72: [2, 36],
                            75: [2, 36],
                            80: [2, 36],
                            81: [2, 36],
                            82: [2, 36],
                            83: [2, 36],
                            84: [2, 36],
                            85: [2, 36],
                        },
                        {
                            23: [2, 37],
                            33: [2, 37],
                            54: [2, 37],
                            65: [2, 37],
                            68: [2, 37],
                            72: [2, 37],
                            75: [2, 37],
                            80: [2, 37],
                            81: [2, 37],
                            82: [2, 37],
                            83: [2, 37],
                            84: [2, 37],
                            85: [2, 37],
                        },
                        {
                            23: [2, 38],
                            33: [2, 38],
                            54: [2, 38],
                            65: [2, 38],
                            68: [2, 38],
                            72: [2, 38],
                            75: [2, 38],
                            80: [2, 38],
                            81: [2, 38],
                            82: [2, 38],
                            83: [2, 38],
                            84: [2, 38],
                            85: [2, 38],
                        },
                        {
                            23: [2, 39],
                            33: [2, 39],
                            54: [2, 39],
                            65: [2, 39],
                            68: [2, 39],
                            72: [2, 39],
                            75: [2, 39],
                            80: [2, 39],
                            81: [2, 39],
                            82: [2, 39],
                            83: [2, 39],
                            84: [2, 39],
                            85: [2, 39],
                        },
                        {
                            23: [2, 43],
                            33: [2, 43],
                            54: [2, 43],
                            65: [2, 43],
                            68: [2, 43],
                            72: [2, 43],
                            75: [2, 43],
                            80: [2, 43],
                            81: [2, 43],
                            82: [2, 43],
                            83: [2, 43],
                            84: [2, 43],
                            85: [2, 43],
                            87: [1, 50],
                        },
                        { 72: [1, 35], 86: 51 },
                        {
                            23: [2, 45],
                            33: [2, 45],
                            54: [2, 45],
                            65: [2, 45],
                            68: [2, 45],
                            72: [2, 45],
                            75: [2, 45],
                            80: [2, 45],
                            81: [2, 45],
                            82: [2, 45],
                            83: [2, 45],
                            84: [2, 45],
                            85: [2, 45],
                            87: [2, 45],
                        },
                        {
                            52: 52,
                            54: [2, 82],
                            65: [2, 82],
                            72: [2, 82],
                            80: [2, 82],
                            81: [2, 82],
                            82: [2, 82],
                            83: [2, 82],
                            84: [2, 82],
                            85: [2, 82],
                        },
                        {
                            25: 53,
                            38: 55,
                            39: [1, 57],
                            43: 56,
                            44: [1, 58],
                            45: 54,
                            47: [2, 54],
                        },
                        { 28: 59, 43: 60, 44: [1, 58], 47: [2, 56] },
                        { 13: 62, 15: [1, 20], 18: [1, 61] },
                        {
                            33: [2, 86],
                            57: 63,
                            65: [2, 86],
                            72: [2, 86],
                            80: [2, 86],
                            81: [2, 86],
                            82: [2, 86],
                            83: [2, 86],
                            84: [2, 86],
                            85: [2, 86],
                        },
                        {
                            33: [2, 40],
                            65: [2, 40],
                            72: [2, 40],
                            80: [2, 40],
                            81: [2, 40],
                            82: [2, 40],
                            83: [2, 40],
                            84: [2, 40],
                            85: [2, 40],
                        },
                        {
                            33: [2, 41],
                            65: [2, 41],
                            72: [2, 41],
                            80: [2, 41],
                            81: [2, 41],
                            82: [2, 41],
                            83: [2, 41],
                            84: [2, 41],
                            85: [2, 41],
                        },
                        {
                            20: 64,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        { 26: 65, 47: [1, 66] },
                        {
                            30: 67,
                            33: [2, 58],
                            65: [2, 58],
                            72: [2, 58],
                            75: [2, 58],
                            80: [2, 58],
                            81: [2, 58],
                            82: [2, 58],
                            83: [2, 58],
                            84: [2, 58],
                            85: [2, 58],
                        },
                        {
                            33: [2, 64],
                            35: 68,
                            65: [2, 64],
                            72: [2, 64],
                            75: [2, 64],
                            80: [2, 64],
                            81: [2, 64],
                            82: [2, 64],
                            83: [2, 64],
                            84: [2, 64],
                            85: [2, 64],
                        },
                        {
                            21: 69,
                            23: [2, 50],
                            65: [2, 50],
                            72: [2, 50],
                            80: [2, 50],
                            81: [2, 50],
                            82: [2, 50],
                            83: [2, 50],
                            84: [2, 50],
                            85: [2, 50],
                        },
                        {
                            33: [2, 90],
                            61: 70,
                            65: [2, 90],
                            72: [2, 90],
                            80: [2, 90],
                            81: [2, 90],
                            82: [2, 90],
                            83: [2, 90],
                            84: [2, 90],
                            85: [2, 90],
                        },
                        {
                            20: 74,
                            33: [2, 80],
                            50: 71,
                            63: 72,
                            64: 75,
                            65: [1, 43],
                            69: 73,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        { 72: [1, 79] },
                        {
                            23: [2, 42],
                            33: [2, 42],
                            54: [2, 42],
                            65: [2, 42],
                            68: [2, 42],
                            72: [2, 42],
                            75: [2, 42],
                            80: [2, 42],
                            81: [2, 42],
                            82: [2, 42],
                            83: [2, 42],
                            84: [2, 42],
                            85: [2, 42],
                            87: [1, 50],
                        },
                        {
                            20: 74,
                            53: 80,
                            54: [2, 84],
                            63: 81,
                            64: 75,
                            65: [1, 43],
                            69: 82,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        { 26: 83, 47: [1, 66] },
                        { 47: [2, 55] },
                        {
                            4: 84,
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            39: [2, 46],
                            44: [2, 46],
                            47: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        { 47: [2, 20] },
                        {
                            20: 85,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            4: 86,
                            6: 3,
                            14: [2, 46],
                            15: [2, 46],
                            19: [2, 46],
                            29: [2, 46],
                            34: [2, 46],
                            47: [2, 46],
                            48: [2, 46],
                            51: [2, 46],
                            55: [2, 46],
                            60: [2, 46],
                        },
                        { 26: 87, 47: [1, 66] },
                        { 47: [2, 57] },
                        {
                            5: [2, 11],
                            14: [2, 11],
                            15: [2, 11],
                            19: [2, 11],
                            29: [2, 11],
                            34: [2, 11],
                            39: [2, 11],
                            44: [2, 11],
                            47: [2, 11],
                            48: [2, 11],
                            51: [2, 11],
                            55: [2, 11],
                            60: [2, 11],
                        },
                        { 15: [2, 49], 18: [2, 49] },
                        {
                            20: 74,
                            33: [2, 88],
                            58: 88,
                            63: 89,
                            64: 75,
                            65: [1, 43],
                            69: 90,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            65: [2, 94],
                            66: 91,
                            68: [2, 94],
                            72: [2, 94],
                            80: [2, 94],
                            81: [2, 94],
                            82: [2, 94],
                            83: [2, 94],
                            84: [2, 94],
                            85: [2, 94],
                        },
                        {
                            5: [2, 25],
                            14: [2, 25],
                            15: [2, 25],
                            19: [2, 25],
                            29: [2, 25],
                            34: [2, 25],
                            39: [2, 25],
                            44: [2, 25],
                            47: [2, 25],
                            48: [2, 25],
                            51: [2, 25],
                            55: [2, 25],
                            60: [2, 25],
                        },
                        {
                            20: 92,
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 74,
                            31: 93,
                            33: [2, 60],
                            63: 94,
                            64: 75,
                            65: [1, 43],
                            69: 95,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            75: [2, 60],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 74,
                            33: [2, 66],
                            36: 96,
                            63: 97,
                            64: 75,
                            65: [1, 43],
                            69: 98,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            75: [2, 66],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 74,
                            22: 99,
                            23: [2, 52],
                            63: 100,
                            64: 75,
                            65: [1, 43],
                            69: 101,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            20: 74,
                            33: [2, 92],
                            62: 102,
                            63: 103,
                            64: 75,
                            65: [1, 43],
                            69: 104,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        { 33: [1, 105] },
                        {
                            33: [2, 79],
                            65: [2, 79],
                            72: [2, 79],
                            80: [2, 79],
                            81: [2, 79],
                            82: [2, 79],
                            83: [2, 79],
                            84: [2, 79],
                            85: [2, 79],
                        },
                        { 33: [2, 81] },
                        {
                            23: [2, 27],
                            33: [2, 27],
                            54: [2, 27],
                            65: [2, 27],
                            68: [2, 27],
                            72: [2, 27],
                            75: [2, 27],
                            80: [2, 27],
                            81: [2, 27],
                            82: [2, 27],
                            83: [2, 27],
                            84: [2, 27],
                            85: [2, 27],
                        },
                        {
                            23: [2, 28],
                            33: [2, 28],
                            54: [2, 28],
                            65: [2, 28],
                            68: [2, 28],
                            72: [2, 28],
                            75: [2, 28],
                            80: [2, 28],
                            81: [2, 28],
                            82: [2, 28],
                            83: [2, 28],
                            84: [2, 28],
                            85: [2, 28],
                        },
                        {
                            23: [2, 30],
                            33: [2, 30],
                            54: [2, 30],
                            68: [2, 30],
                            71: 106,
                            72: [1, 107],
                            75: [2, 30],
                        },
                        {
                            23: [2, 98],
                            33: [2, 98],
                            54: [2, 98],
                            68: [2, 98],
                            72: [2, 98],
                            75: [2, 98],
                        },
                        {
                            23: [2, 45],
                            33: [2, 45],
                            54: [2, 45],
                            65: [2, 45],
                            68: [2, 45],
                            72: [2, 45],
                            73: [1, 108],
                            75: [2, 45],
                            80: [2, 45],
                            81: [2, 45],
                            82: [2, 45],
                            83: [2, 45],
                            84: [2, 45],
                            85: [2, 45],
                            87: [2, 45],
                        },
                        {
                            23: [2, 44],
                            33: [2, 44],
                            54: [2, 44],
                            65: [2, 44],
                            68: [2, 44],
                            72: [2, 44],
                            75: [2, 44],
                            80: [2, 44],
                            81: [2, 44],
                            82: [2, 44],
                            83: [2, 44],
                            84: [2, 44],
                            85: [2, 44],
                            87: [2, 44],
                        },
                        { 54: [1, 109] },
                        {
                            54: [2, 83],
                            65: [2, 83],
                            72: [2, 83],
                            80: [2, 83],
                            81: [2, 83],
                            82: [2, 83],
                            83: [2, 83],
                            84: [2, 83],
                            85: [2, 83],
                        },
                        { 54: [2, 85] },
                        {
                            5: [2, 13],
                            14: [2, 13],
                            15: [2, 13],
                            19: [2, 13],
                            29: [2, 13],
                            34: [2, 13],
                            39: [2, 13],
                            44: [2, 13],
                            47: [2, 13],
                            48: [2, 13],
                            51: [2, 13],
                            55: [2, 13],
                            60: [2, 13],
                        },
                        {
                            38: 55,
                            39: [1, 57],
                            43: 56,
                            44: [1, 58],
                            45: 111,
                            46: 110,
                            47: [2, 76],
                        },
                        {
                            33: [2, 70],
                            40: 112,
                            65: [2, 70],
                            72: [2, 70],
                            75: [2, 70],
                            80: [2, 70],
                            81: [2, 70],
                            82: [2, 70],
                            83: [2, 70],
                            84: [2, 70],
                            85: [2, 70],
                        },
                        { 47: [2, 18] },
                        {
                            5: [2, 14],
                            14: [2, 14],
                            15: [2, 14],
                            19: [2, 14],
                            29: [2, 14],
                            34: [2, 14],
                            39: [2, 14],
                            44: [2, 14],
                            47: [2, 14],
                            48: [2, 14],
                            51: [2, 14],
                            55: [2, 14],
                            60: [2, 14],
                        },
                        { 33: [1, 113] },
                        {
                            33: [2, 87],
                            65: [2, 87],
                            72: [2, 87],
                            80: [2, 87],
                            81: [2, 87],
                            82: [2, 87],
                            83: [2, 87],
                            84: [2, 87],
                            85: [2, 87],
                        },
                        { 33: [2, 89] },
                        {
                            20: 74,
                            63: 115,
                            64: 75,
                            65: [1, 43],
                            67: 114,
                            68: [2, 96],
                            69: 116,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        { 33: [1, 117] },
                        { 32: 118, 33: [2, 62], 74: 119, 75: [1, 120] },
                        {
                            33: [2, 59],
                            65: [2, 59],
                            72: [2, 59],
                            75: [2, 59],
                            80: [2, 59],
                            81: [2, 59],
                            82: [2, 59],
                            83: [2, 59],
                            84: [2, 59],
                            85: [2, 59],
                        },
                        { 33: [2, 61], 75: [2, 61] },
                        { 33: [2, 68], 37: 121, 74: 122, 75: [1, 120] },
                        {
                            33: [2, 65],
                            65: [2, 65],
                            72: [2, 65],
                            75: [2, 65],
                            80: [2, 65],
                            81: [2, 65],
                            82: [2, 65],
                            83: [2, 65],
                            84: [2, 65],
                            85: [2, 65],
                        },
                        { 33: [2, 67], 75: [2, 67] },
                        { 23: [1, 123] },
                        {
                            23: [2, 51],
                            65: [2, 51],
                            72: [2, 51],
                            80: [2, 51],
                            81: [2, 51],
                            82: [2, 51],
                            83: [2, 51],
                            84: [2, 51],
                            85: [2, 51],
                        },
                        { 23: [2, 53] },
                        { 33: [1, 124] },
                        {
                            33: [2, 91],
                            65: [2, 91],
                            72: [2, 91],
                            80: [2, 91],
                            81: [2, 91],
                            82: [2, 91],
                            83: [2, 91],
                            84: [2, 91],
                            85: [2, 91],
                        },
                        { 33: [2, 93] },
                        {
                            5: [2, 22],
                            14: [2, 22],
                            15: [2, 22],
                            19: [2, 22],
                            29: [2, 22],
                            34: [2, 22],
                            39: [2, 22],
                            44: [2, 22],
                            47: [2, 22],
                            48: [2, 22],
                            51: [2, 22],
                            55: [2, 22],
                            60: [2, 22],
                        },
                        {
                            23: [2, 99],
                            33: [2, 99],
                            54: [2, 99],
                            68: [2, 99],
                            72: [2, 99],
                            75: [2, 99],
                        },
                        { 73: [1, 108] },
                        {
                            20: 74,
                            63: 125,
                            64: 75,
                            65: [1, 43],
                            72: [1, 35],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            5: [2, 23],
                            14: [2, 23],
                            15: [2, 23],
                            19: [2, 23],
                            29: [2, 23],
                            34: [2, 23],
                            39: [2, 23],
                            44: [2, 23],
                            47: [2, 23],
                            48: [2, 23],
                            51: [2, 23],
                            55: [2, 23],
                            60: [2, 23],
                        },
                        { 47: [2, 19] },
                        { 47: [2, 77] },
                        {
                            20: 74,
                            33: [2, 72],
                            41: 126,
                            63: 127,
                            64: 75,
                            65: [1, 43],
                            69: 128,
                            70: 76,
                            71: 77,
                            72: [1, 78],
                            75: [2, 72],
                            78: 26,
                            79: 27,
                            80: [1, 28],
                            81: [1, 29],
                            82: [1, 30],
                            83: [1, 31],
                            84: [1, 32],
                            85: [1, 34],
                            86: 33,
                        },
                        {
                            5: [2, 24],
                            14: [2, 24],
                            15: [2, 24],
                            19: [2, 24],
                            29: [2, 24],
                            34: [2, 24],
                            39: [2, 24],
                            44: [2, 24],
                            47: [2, 24],
                            48: [2, 24],
                            51: [2, 24],
                            55: [2, 24],
                            60: [2, 24],
                        },
                        { 68: [1, 129] },
                        {
                            65: [2, 95],
                            68: [2, 95],
                            72: [2, 95],
                            80: [2, 95],
                            81: [2, 95],
                            82: [2, 95],
                            83: [2, 95],
                            84: [2, 95],
                            85: [2, 95],
                        },
                        { 68: [2, 97] },
                        {
                            5: [2, 21],
                            14: [2, 21],
                            15: [2, 21],
                            19: [2, 21],
                            29: [2, 21],
                            34: [2, 21],
                            39: [2, 21],
                            44: [2, 21],
                            47: [2, 21],
                            48: [2, 21],
                            51: [2, 21],
                            55: [2, 21],
                            60: [2, 21],
                        },
                        { 33: [1, 130] },
                        { 33: [2, 63] },
                        { 72: [1, 132], 76: 131 },
                        { 33: [1, 133] },
                        { 33: [2, 69] },
                        { 15: [2, 12], 18: [2, 12] },
                        {
                            14: [2, 26],
                            15: [2, 26],
                            19: [2, 26],
                            29: [2, 26],
                            34: [2, 26],
                            47: [2, 26],
                            48: [2, 26],
                            51: [2, 26],
                            55: [2, 26],
                            60: [2, 26],
                        },
                        {
                            23: [2, 31],
                            33: [2, 31],
                            54: [2, 31],
                            68: [2, 31],
                            72: [2, 31],
                            75: [2, 31],
                        },
                        { 33: [2, 74], 42: 134, 74: 135, 75: [1, 120] },
                        {
                            33: [2, 71],
                            65: [2, 71],
                            72: [2, 71],
                            75: [2, 71],
                            80: [2, 71],
                            81: [2, 71],
                            82: [2, 71],
                            83: [2, 71],
                            84: [2, 71],
                            85: [2, 71],
                        },
                        { 33: [2, 73], 75: [2, 73] },
                        {
                            23: [2, 29],
                            33: [2, 29],
                            54: [2, 29],
                            65: [2, 29],
                            68: [2, 29],
                            72: [2, 29],
                            75: [2, 29],
                            80: [2, 29],
                            81: [2, 29],
                            82: [2, 29],
                            83: [2, 29],
                            84: [2, 29],
                            85: [2, 29],
                        },
                        {
                            14: [2, 15],
                            15: [2, 15],
                            19: [2, 15],
                            29: [2, 15],
                            34: [2, 15],
                            39: [2, 15],
                            44: [2, 15],
                            47: [2, 15],
                            48: [2, 15],
                            51: [2, 15],
                            55: [2, 15],
                            60: [2, 15],
                        },
                        { 72: [1, 137], 77: [1, 136] },
                        { 72: [2, 100], 77: [2, 100] },
                        {
                            14: [2, 16],
                            15: [2, 16],
                            19: [2, 16],
                            29: [2, 16],
                            34: [2, 16],
                            44: [2, 16],
                            47: [2, 16],
                            48: [2, 16],
                            51: [2, 16],
                            55: [2, 16],
                            60: [2, 16],
                        },
                        { 33: [1, 138] },
                        { 33: [2, 75] },
                        { 33: [2, 32] },
                        { 72: [2, 101], 77: [2, 101] },
                        {
                            14: [2, 17],
                            15: [2, 17],
                            19: [2, 17],
                            29: [2, 17],
                            34: [2, 17],
                            39: [2, 17],
                            44: [2, 17],
                            47: [2, 17],
                            48: [2, 17],
                            51: [2, 17],
                            55: [2, 17],
                            60: [2, 17],
                        },
                    ],
                    defaultActions: {
                        4: [2, 1],
                        54: [2, 55],
                        56: [2, 20],
                        60: [2, 57],
                        73: [2, 81],
                        82: [2, 85],
                        86: [2, 18],
                        90: [2, 89],
                        101: [2, 53],
                        104: [2, 93],
                        110: [2, 19],
                        111: [2, 77],
                        116: [2, 97],
                        119: [2, 63],
                        122: [2, 69],
                        135: [2, 75],
                        136: [2, 32],
                    },
                    parseError: function parseError(str, hash) {
                        throw new Error(str);
                    },
                    parse: function parse(input) {
                        var self = this,
                            stack = [0],
                            vstack = [null],
                            lstack = [],
                            table = this.table,
                            yytext = "",
                            yylineno = 0,
                            yyleng = 0,
                            recovering = 0,
                            TERROR = 2,
                            EOF = 1;
                        this.lexer.setInput(input);
                        this.lexer.yy = this.yy;
                        this.yy.lexer = this.lexer;
                        this.yy.parser = this;
                        if (typeof this.lexer.yylloc == "undefined")
                            this.lexer.yylloc = {};
                        var yyloc = this.lexer.yylloc;
                        lstack.push(yyloc);
                        var ranges =
                            this.lexer.options && this.lexer.options.ranges;
                        if (typeof this.yy.parseError === "function")
                            this.parseError = this.yy.parseError;
                        function popStack(n) {
                            stack.length = stack.length - 2 * n;
                            vstack.length = vstack.length - n;
                            lstack.length = lstack.length - n;
                        }
                        function lex() {
                            var token;
                            token = self.lexer.lex() || 1;
                            if (typeof token !== "number") {
                                token = self.symbols_[token] || token;
                            }
                            return token;
                        }
                        var symbol,
                            preErrorSymbol,
                            state,
                            action,
                            a,
                            r,
                            yyval = {},
                            p,
                            len,
                            newState,
                            expected;
                        while (true) {
                            state = stack[stack.length - 1];
                            if (this.defaultActions[state]) {
                                action = this.defaultActions[state];
                            } else {
                                if (
                                    symbol === null ||
                                    typeof symbol == "undefined"
                                ) {
                                    symbol = lex();
                                }
                                action = table[state] && table[state][symbol];
                            }
                            if (
                                typeof action === "undefined" ||
                                !action.length ||
                                !action[0]
                            ) {
                                var errStr = "";
                                if (!recovering) {
                                    expected = [];
                                    for (p in table[state])
                                        if (this.terminals_[p] && p > 2) {
                                            expected.push(
                                                "'" + this.terminals_[p] + "'",
                                            );
                                        }
                                    if (this.lexer.showPosition) {
                                        errStr =
                                            "Parse error on line " +
                                            (yylineno + 1) +
                                            ":\n" +
                                            this.lexer.showPosition() +
                                            "\nExpecting " +
                                            expected.join(", ") +
                                            ", got '" +
                                            (this.terminals_[symbol] ||
                                                symbol) +
                                            "'";
                                    } else {
                                        errStr =
                                            "Parse error on line " +
                                            (yylineno + 1) +
                                            ": Unexpected " +
                                            (symbol == 1
                                                ? "end of input"
                                                : "'" +
                                                  (this.terminals_[symbol] ||
                                                      symbol) +
                                                  "'");
                                    }
                                    this.parseError(errStr, {
                                        text: this.lexer.match,
                                        token:
                                            this.terminals_[symbol] || symbol,
                                        line: this.lexer.yylineno,
                                        loc: yyloc,
                                        expected,
                                    });
                                }
                            }
                            if (
                                action[0] instanceof Array &&
                                action.length > 1
                            ) {
                                throw new Error(
                                    "Parse Error: multiple actions possible at state: " +
                                        state +
                                        ", token: " +
                                        symbol,
                                );
                            }
                            switch (action[0]) {
                                case 1:
                                    stack.push(symbol);
                                    vstack.push(this.lexer.yytext);
                                    lstack.push(this.lexer.yylloc);
                                    stack.push(action[1]);
                                    symbol = null;
                                    if (!preErrorSymbol) {
                                        yyleng = this.lexer.yyleng;
                                        yytext = this.lexer.yytext;
                                        yylineno = this.lexer.yylineno;
                                        yyloc = this.lexer.yylloc;
                                        if (recovering > 0) recovering--;
                                    } else {
                                        symbol = preErrorSymbol;
                                        preErrorSymbol = null;
                                    }
                                    break;
                                case 2:
                                    len = this.productions_[action[1]][1];
                                    yyval.$ = vstack[vstack.length - len];
                                    yyval._$ = {
                                        first_line:
                                            lstack[lstack.length - (len || 1)]
                                                .first_line,
                                        last_line:
                                            lstack[lstack.length - 1].last_line,
                                        first_column:
                                            lstack[lstack.length - (len || 1)]
                                                .first_column,
                                        last_column:
                                            lstack[lstack.length - 1]
                                                .last_column,
                                    };
                                    if (ranges) {
                                        yyval._$.range = [
                                            lstack[lstack.length - (len || 1)]
                                                .range[0],
                                            lstack[lstack.length - 1].range[1],
                                        ];
                                    }
                                    r = this.performAction.call(
                                        yyval,
                                        yytext,
                                        yyleng,
                                        yylineno,
                                        this.yy,
                                        action[1],
                                        vstack,
                                        lstack,
                                    );
                                    if (typeof r !== "undefined") {
                                        return r;
                                    }
                                    if (len) {
                                        stack = stack.slice(0, -1 * len * 2);
                                        vstack = vstack.slice(0, -1 * len);
                                        lstack = lstack.slice(0, -1 * len);
                                    }
                                    stack.push(this.productions_[action[1]][0]);
                                    vstack.push(yyval.$);
                                    lstack.push(yyval._$);
                                    newState =
                                        table[stack[stack.length - 2]][
                                            stack[stack.length - 1]
                                        ];
                                    stack.push(newState);
                                    break;
                                case 3:
                                    return true;
                            }
                        }
                        return true;
                    },
                };
                var lexer = (function () {
                    var lexer2 = {
                        EOF: 1,
                        parseError: function parseError(str, hash) {
                            if (this.yy.parser) {
                                this.yy.parser.parseError(str, hash);
                            } else {
                                throw new Error(str);
                            }
                        },
                        setInput: function setInput(input) {
                            this._input = input;
                            this._more = this._less = this.done = false;
                            this.yylineno = this.yyleng = 0;
                            this.yytext = this.matched = this.match = "";
                            this.conditionStack = ["INITIAL"];
                            this.yylloc = {
                                first_line: 1,
                                first_column: 0,
                                last_line: 1,
                                last_column: 0,
                            };
                            if (this.options.ranges) this.yylloc.range = [0, 0];
                            this.offset = 0;
                            return this;
                        },
                        input: function input() {
                            var ch = this._input[0];
                            this.yytext += ch;
                            this.yyleng++;
                            this.offset++;
                            this.match += ch;
                            this.matched += ch;
                            var lines = ch.match(/(?:\r\n?|\n).*/g);
                            if (lines) {
                                this.yylineno++;
                                this.yylloc.last_line++;
                            } else {
                                this.yylloc.last_column++;
                            }
                            if (this.options.ranges) this.yylloc.range[1]++;
                            this._input = this._input.slice(1);
                            return ch;
                        },
                        unput: function unput(ch) {
                            var len = ch.length;
                            var lines = ch.split(/(?:\r\n?|\n)/g);
                            this._input = ch + this._input;
                            this.yytext = this.yytext.substr(
                                0,
                                this.yytext.length - len - 1,
                            );
                            this.offset -= len;
                            var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                            this.match = this.match.substr(
                                0,
                                this.match.length - 1,
                            );
                            this.matched = this.matched.substr(
                                0,
                                this.matched.length - 1,
                            );
                            if (lines.length - 1)
                                this.yylineno -= lines.length - 1;
                            var r = this.yylloc.range;
                            this.yylloc = {
                                first_line: this.yylloc.first_line,
                                last_line: this.yylineno + 1,
                                first_column: this.yylloc.first_column,
                                last_column: lines
                                    ? (lines.length === oldLines.length
                                          ? this.yylloc.first_column
                                          : 0) +
                                      oldLines[oldLines.length - lines.length]
                                          .length -
                                      lines[0].length
                                    : this.yylloc.first_column - len,
                            };
                            if (this.options.ranges) {
                                this.yylloc.range = [
                                    r[0],
                                    r[0] + this.yyleng - len,
                                ];
                            }
                            return this;
                        },
                        more: function more() {
                            this._more = true;
                            return this;
                        },
                        less: function less(n) {
                            this.unput(this.match.slice(n));
                        },
                        pastInput: function pastInput() {
                            var past = this.matched.substr(
                                0,
                                this.matched.length - this.match.length,
                            );
                            return (
                                (past.length > 20 ? "..." : "") +
                                past.substr(-20).replace(/\n/g, "")
                            );
                        },
                        upcomingInput: function upcomingInput() {
                            var next = this.match;
                            if (next.length < 20) {
                                next += this._input.substr(0, 20 - next.length);
                            }
                            return (
                                next.substr(0, 20) +
                                (next.length > 20 ? "..." : "")
                            ).replace(/\n/g, "");
                        },
                        showPosition: function showPosition() {
                            var pre = this.pastInput();
                            var c = new Array(pre.length + 1).join("-");
                            return pre + this.upcomingInput() + "\n" + c + "^";
                        },
                        next: function next() {
                            if (this.done) {
                                return this.EOF;
                            }
                            if (!this._input) this.done = true;
                            var token, match, tempMatch, index, col, lines;
                            if (!this._more) {
                                this.yytext = "";
                                this.match = "";
                            }
                            var rules = this._currentRules();
                            for (var i = 0; i < rules.length; i++) {
                                tempMatch = this._input.match(
                                    this.rules[rules[i]],
                                );
                                if (
                                    tempMatch &&
                                    (!match ||
                                        tempMatch[0].length > match[0].length)
                                ) {
                                    match = tempMatch;
                                    index = i;
                                    if (!this.options.flex) break;
                                }
                            }
                            if (match) {
                                lines = match[0].match(/(?:\r\n?|\n).*/g);
                                if (lines) this.yylineno += lines.length;
                                this.yylloc = {
                                    first_line: this.yylloc.last_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.last_column,
                                    last_column: lines
                                        ? lines[lines.length - 1].length -
                                          lines[lines.length - 1].match(
                                              /\r?\n?/,
                                          )[0].length
                                        : this.yylloc.last_column +
                                          match[0].length,
                                };
                                this.yytext += match[0];
                                this.match += match[0];
                                this.matches = match;
                                this.yyleng = this.yytext.length;
                                if (this.options.ranges) {
                                    this.yylloc.range = [
                                        this.offset,
                                        (this.offset += this.yyleng),
                                    ];
                                }
                                this._more = false;
                                this._input = this._input.slice(
                                    match[0].length,
                                );
                                this.matched += match[0];
                                token = this.performAction.call(
                                    this,
                                    this.yy,
                                    this,
                                    rules[index],
                                    this.conditionStack[
                                        this.conditionStack.length - 1
                                    ],
                                );
                                if (this.done && this._input) this.done = false;
                                if (token) return token;
                                else return;
                            }
                            if (this._input === "") {
                                return this.EOF;
                            } else {
                                return this.parseError(
                                    "Lexical error on line " +
                                        (this.yylineno + 1) +
                                        ". Unrecognized text.\n" +
                                        this.showPosition(),
                                    {
                                        text: "",
                                        token: null,
                                        line: this.yylineno,
                                    },
                                );
                            }
                        },
                        lex: function lex() {
                            var r = this.next();
                            if (typeof r !== "undefined") {
                                return r;
                            } else {
                                return this.lex();
                            }
                        },
                        begin: function begin(condition) {
                            this.conditionStack.push(condition);
                        },
                        popState: function popState() {
                            return this.conditionStack.pop();
                        },
                        _currentRules: function _currentRules() {
                            return this.conditions[
                                this.conditionStack[
                                    this.conditionStack.length - 1
                                ]
                            ].rules;
                        },
                        topState: function topState() {
                            return this.conditionStack[
                                this.conditionStack.length - 2
                            ];
                        },
                        pushState: function begin(condition) {
                            this.begin(condition);
                        },
                    };
                    lexer2.options = {};
                    lexer2.performAction = function anonymous(
                        yy,
                        yy_,
                        $avoiding_name_collisions,
                        YY_START,
                    ) {
                        function strip(start, end) {
                            return (yy_.yytext = yy_.yytext.substring(
                                start,
                                yy_.yyleng - end + start,
                            ));
                        }
                        var YYSTATE = YY_START;
                        switch ($avoiding_name_collisions) {
                            case 0:
                                if (yy_.yytext.slice(-2) === "\\\\") {
                                    strip(0, 1);
                                    this.begin("mu");
                                } else if (yy_.yytext.slice(-1) === "\\") {
                                    strip(0, 1);
                                    this.begin("emu");
                                } else {
                                    this.begin("mu");
                                }
                                if (yy_.yytext) return 15;
                                break;
                            case 1:
                                return 15;
                                break;
                            case 2:
                                this.popState();
                                return 15;
                                break;
                            case 3:
                                this.begin("raw");
                                return 15;
                                break;
                            case 4:
                                this.popState();
                                if (
                                    this.conditionStack[
                                        this.conditionStack.length - 1
                                    ] === "raw"
                                ) {
                                    return 15;
                                } else {
                                    strip(5, 9);
                                    return "END_RAW_BLOCK";
                                }
                                break;
                            case 5:
                                return 15;
                                break;
                            case 6:
                                this.popState();
                                return 14;
                                break;
                            case 7:
                                return 65;
                                break;
                            case 8:
                                return 68;
                                break;
                            case 9:
                                return 19;
                                break;
                            case 10:
                                this.popState();
                                this.begin("raw");
                                return 23;
                                break;
                            case 11:
                                return 55;
                                break;
                            case 12:
                                return 60;
                                break;
                            case 13:
                                return 29;
                                break;
                            case 14:
                                return 47;
                                break;
                            case 15:
                                this.popState();
                                return 44;
                                break;
                            case 16:
                                this.popState();
                                return 44;
                                break;
                            case 17:
                                return 34;
                                break;
                            case 18:
                                return 39;
                                break;
                            case 19:
                                return 51;
                                break;
                            case 20:
                                return 48;
                                break;
                            case 21:
                                this.unput(yy_.yytext);
                                this.popState();
                                this.begin("com");
                                break;
                            case 22:
                                this.popState();
                                return 14;
                                break;
                            case 23:
                                return 48;
                                break;
                            case 24:
                                return 73;
                                break;
                            case 25:
                                return 72;
                                break;
                            case 26:
                                return 72;
                                break;
                            case 27:
                                return 87;
                                break;
                            case 28:
                                break;
                            case 29:
                                this.popState();
                                return 54;
                                break;
                            case 30:
                                this.popState();
                                return 33;
                                break;
                            case 31:
                                yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
                                return 80;
                                break;
                            case 32:
                                yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
                                return 80;
                                break;
                            case 33:
                                return 85;
                                break;
                            case 34:
                                return 82;
                                break;
                            case 35:
                                return 82;
                                break;
                            case 36:
                                return 83;
                                break;
                            case 37:
                                return 84;
                                break;
                            case 38:
                                return 81;
                                break;
                            case 39:
                                return 75;
                                break;
                            case 40:
                                return 77;
                                break;
                            case 41:
                                return 72;
                                break;
                            case 42:
                                yy_.yytext = yy_.yytext.replace(
                                    /\\([\\\]])/g,
                                    "$1",
                                );
                                return 72;
                                break;
                            case 43:
                                return "INVALID";
                                break;
                            case 44:
                                return 5;
                                break;
                        }
                    };
                    lexer2.rules = [
                        /^(?:[^\x00]*?(?=(\{\{)))/,
                        /^(?:[^\x00]+)/,
                        /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
                        /^(?:\{\{\{\{(?=[^/]))/,
                        /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
                        /^(?:[^\x00]+?(?=(\{\{\{\{)))/,
                        /^(?:[\s\S]*?--(~)?\}\})/,
                        /^(?:\()/,
                        /^(?:\))/,
                        /^(?:\{\{\{\{)/,
                        /^(?:\}\}\}\})/,
                        /^(?:\{\{(~)?>)/,
                        /^(?:\{\{(~)?#>)/,
                        /^(?:\{\{(~)?#\*?)/,
                        /^(?:\{\{(~)?\/)/,
                        /^(?:\{\{(~)?\^\s*(~)?\}\})/,
                        /^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
                        /^(?:\{\{(~)?\^)/,
                        /^(?:\{\{(~)?\s*else\b)/,
                        /^(?:\{\{(~)?\{)/,
                        /^(?:\{\{(~)?&)/,
                        /^(?:\{\{(~)?!--)/,
                        /^(?:\{\{(~)?![\s\S]*?\}\})/,
                        /^(?:\{\{(~)?\*?)/,
                        /^(?:=)/,
                        /^(?:\.\.)/,
                        /^(?:\.(?=([=~}\s\/.)|])))/,
                        /^(?:[\/.])/,
                        /^(?:\s+)/,
                        /^(?:\}(~)?\}\})/,
                        /^(?:(~)?\}\})/,
                        /^(?:"(\\["]|[^"])*")/,
                        /^(?:'(\\[']|[^'])*')/,
                        /^(?:@)/,
                        /^(?:true(?=([~}\s)])))/,
                        /^(?:false(?=([~}\s)])))/,
                        /^(?:undefined(?=([~}\s)])))/,
                        /^(?:null(?=([~}\s)])))/,
                        /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,
                        /^(?:as\s+\|)/,
                        /^(?:\|)/,
                        /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,
                        /^(?:\[(\\\]|[^\]])*\])/,
                        /^(?:.)/,
                        /^(?:$)/,
                    ];
                    lexer2.conditions = {
                        mu: {
                            rules: [
                                7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                                20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                                32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
                                44,
                            ],
                            inclusive: false,
                        },
                        emu: { rules: [2], inclusive: false },
                        com: { rules: [6], inclusive: false },
                        raw: { rules: [3, 4, 5], inclusive: false },
                        INITIAL: { rules: [0, 1, 44], inclusive: true },
                    };
                    return lexer2;
                })();
                parser.lexer = lexer;
                function Parser() {
                    this.yy = {};
                }
                Parser.prototype = parser;
                parser.Parser = Parser;
                return new Parser();
            })();
            exports["default"] = handlebars;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/visitor.js
    var require_visitor = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/visitor.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            function Visitor() {
                this.parents = [];
            }
            Visitor.prototype = {
                constructor: Visitor,
                mutating: false,
                // Visits a given value. If mutating, will replace the value if necessary.
                acceptKey: function acceptKey(node, name) {
                    var value = this.accept(node[name]);
                    if (this.mutating) {
                        if (value && !Visitor.prototype[value.type]) {
                            throw new _exception2["default"](
                                'Unexpected node type "' +
                                    value.type +
                                    '" found when accepting ' +
                                    name +
                                    " on " +
                                    node.type,
                            );
                        }
                        node[name] = value;
                    }
                },
                // Performs an accept operation with added sanity check to ensure
                // required keys are not removed.
                acceptRequired: function acceptRequired(node, name) {
                    this.acceptKey(node, name);
                    if (!node[name]) {
                        throw new _exception2["default"](
                            node.type + " requires " + name,
                        );
                    }
                },
                // Traverses a given array. If mutating, empty respnses will be removed
                // for child elements.
                acceptArray: function acceptArray(array) {
                    for (var i = 0, l = array.length; i < l; i++) {
                        this.acceptKey(array, i);
                        if (!array[i]) {
                            array.splice(i, 1);
                            i--;
                            l--;
                        }
                    }
                },
                accept: function accept(object) {
                    if (!object) {
                        return;
                    }
                    if (!this[object.type]) {
                        throw new _exception2["default"](
                            "Unknown type: " + object.type,
                            object,
                        );
                    }
                    if (this.current) {
                        this.parents.unshift(this.current);
                    }
                    this.current = object;
                    var ret = this[object.type](object);
                    this.current = this.parents.shift();
                    if (!this.mutating || ret) {
                        return ret;
                    } else if (ret !== false) {
                        return object;
                    }
                },
                Program: function Program(program) {
                    this.acceptArray(program.body);
                },
                MustacheStatement: visitSubExpression,
                Decorator: visitSubExpression,
                BlockStatement: visitBlock,
                DecoratorBlock: visitBlock,
                PartialStatement: visitPartial,
                PartialBlockStatement: function PartialBlockStatement(partial) {
                    visitPartial.call(this, partial);
                    this.acceptKey(partial, "program");
                },
                ContentStatement: function ContentStatement() {},
                CommentStatement: function CommentStatement() {},
                SubExpression: visitSubExpression,
                PathExpression: function PathExpression() {},
                StringLiteral: function StringLiteral() {},
                NumberLiteral: function NumberLiteral() {},
                BooleanLiteral: function BooleanLiteral() {},
                UndefinedLiteral: function UndefinedLiteral() {},
                NullLiteral: function NullLiteral() {},
                Hash: function Hash(hash) {
                    this.acceptArray(hash.pairs);
                },
                HashPair: function HashPair(pair) {
                    this.acceptRequired(pair, "value");
                },
            };
            function visitSubExpression(mustache) {
                this.acceptRequired(mustache, "path");
                this.acceptArray(mustache.params);
                this.acceptKey(mustache, "hash");
            }
            function visitBlock(block) {
                visitSubExpression.call(this, block);
                this.acceptKey(block, "program");
                this.acceptKey(block, "inverse");
            }
            function visitPartial(partial) {
                this.acceptRequired(partial, "name");
                this.acceptArray(partial.params);
                this.acceptKey(partial, "hash");
            }
            exports["default"] = Visitor;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/whitespace-control.js
    var require_whitespace_control = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/whitespace-control.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _visitor = require_visitor();
            var _visitor2 = _interopRequireDefault(_visitor);
            function WhitespaceControl() {
                var options =
                    arguments.length <= 0 || arguments[0] === void 0
                        ? {}
                        : arguments[0];
                this.options = options;
            }
            WhitespaceControl.prototype = new _visitor2["default"]();
            WhitespaceControl.prototype.Program = function (program) {
                var doStandalone = !this.options.ignoreStandalone;
                var isRoot = !this.isRootSeen;
                this.isRootSeen = true;
                var body = program.body;
                for (var i = 0, l = body.length; i < l; i++) {
                    var current = body[i],
                        strip = this.accept(current);
                    if (!strip) {
                        continue;
                    }
                    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
                        _isNextWhitespace = isNextWhitespace(body, i, isRoot),
                        openStandalone =
                            strip.openStandalone && _isPrevWhitespace,
                        closeStandalone =
                            strip.closeStandalone && _isNextWhitespace,
                        inlineStandalone =
                            strip.inlineStandalone &&
                            _isPrevWhitespace &&
                            _isNextWhitespace;
                    if (strip.close) {
                        omitRight(body, i, true);
                    }
                    if (strip.open) {
                        omitLeft(body, i, true);
                    }
                    if (doStandalone && inlineStandalone) {
                        omitRight(body, i);
                        if (omitLeft(body, i)) {
                            if (current.type === "PartialStatement") {
                                current.indent = /([ \t]+$)/.exec(
                                    body[i - 1].original,
                                )[1];
                            }
                        }
                    }
                    if (doStandalone && openStandalone) {
                        omitRight((current.program || current.inverse).body);
                        omitLeft(body, i);
                    }
                    if (doStandalone && closeStandalone) {
                        omitRight(body, i);
                        omitLeft((current.inverse || current.program).body);
                    }
                }
                return program;
            };
            WhitespaceControl.prototype.BlockStatement =
                WhitespaceControl.prototype.DecoratorBlock =
                WhitespaceControl.prototype.PartialBlockStatement =
                    function (block) {
                        this.accept(block.program);
                        this.accept(block.inverse);
                        var program = block.program || block.inverse,
                            inverse = block.program && block.inverse,
                            firstInverse = inverse,
                            lastInverse = inverse;
                        if (inverse && inverse.chained) {
                            firstInverse = inverse.body[0].program;
                            while (lastInverse.chained) {
                                lastInverse =
                                    lastInverse.body[
                                        lastInverse.body.length - 1
                                    ].program;
                            }
                        }
                        var strip = {
                            open: block.openStrip.open,
                            close: block.closeStrip.close,
                            // Determine the standalone candiacy. Basically flag our content as being possibly standalone
                            // so our parent can determine if we actually are standalone
                            openStandalone: isNextWhitespace(program.body),
                            closeStandalone: isPrevWhitespace(
                                (firstInverse || program).body,
                            ),
                        };
                        if (block.openStrip.close) {
                            omitRight(program.body, null, true);
                        }
                        if (inverse) {
                            var inverseStrip = block.inverseStrip;
                            if (inverseStrip.open) {
                                omitLeft(program.body, null, true);
                            }
                            if (inverseStrip.close) {
                                omitRight(firstInverse.body, null, true);
                            }
                            if (block.closeStrip.open) {
                                omitLeft(lastInverse.body, null, true);
                            }
                            if (
                                !this.options.ignoreStandalone &&
                                isPrevWhitespace(program.body) &&
                                isNextWhitespace(firstInverse.body)
                            ) {
                                omitLeft(program.body);
                                omitRight(firstInverse.body);
                            }
                        } else if (block.closeStrip.open) {
                            omitLeft(program.body, null, true);
                        }
                        return strip;
                    };
            WhitespaceControl.prototype.Decorator =
                WhitespaceControl.prototype.MustacheStatement = function (
                    mustache,
                ) {
                    return mustache.strip;
                };
            WhitespaceControl.prototype.PartialStatement =
                WhitespaceControl.prototype.CommentStatement = function (node) {
                    var strip = node.strip || {};
                    return {
                        inlineStandalone: true,
                        open: strip.open,
                        close: strip.close,
                    };
                };
            function isPrevWhitespace(body, i, isRoot) {
                if (i === void 0) {
                    i = body.length;
                }
                var prev = body[i - 1],
                    sibling = body[i - 2];
                if (!prev) {
                    return isRoot;
                }
                if (prev.type === "ContentStatement") {
                    return (
                        sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/
                    ).test(prev.original);
                }
            }
            function isNextWhitespace(body, i, isRoot) {
                if (i === void 0) {
                    i = -1;
                }
                var next = body[i + 1],
                    sibling = body[i + 2];
                if (!next) {
                    return isRoot;
                }
                if (next.type === "ContentStatement") {
                    return (
                        sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/
                    ).test(next.original);
                }
            }
            function omitRight(body, i, multiple) {
                var current = body[i == null ? 0 : i + 1];
                if (
                    !current ||
                    current.type !== "ContentStatement" ||
                    (!multiple && current.rightStripped)
                ) {
                    return;
                }
                var original = current.value;
                current.value = current.value.replace(
                    multiple ? /^\s+/ : /^[ \t]*\r?\n?/,
                    "",
                );
                current.rightStripped = current.value !== original;
            }
            function omitLeft(body, i, multiple) {
                var current = body[i == null ? body.length - 1 : i - 1];
                if (
                    !current ||
                    current.type !== "ContentStatement" ||
                    (!multiple && current.leftStripped)
                ) {
                    return;
                }
                var original = current.value;
                current.value = current.value.replace(
                    multiple ? /\s+$/ : /[ \t]+$/,
                    "",
                );
                current.leftStripped = current.value !== original;
                return current.leftStripped;
            }
            exports["default"] = WhitespaceControl;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/helpers.js
    var require_helpers2 = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/helpers.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.SourceLocation = SourceLocation;
            exports.id = id;
            exports.stripFlags = stripFlags;
            exports.stripComment = stripComment;
            exports.preparePath = preparePath;
            exports.prepareMustache = prepareMustache;
            exports.prepareRawBlock = prepareRawBlock;
            exports.prepareBlock = prepareBlock;
            exports.prepareProgram = prepareProgram;
            exports.preparePartialBlock = preparePartialBlock;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            function validateClose(open, close) {
                close = close.path ? close.path.original : close;
                if (open.path.original !== close) {
                    var errorNode = { loc: open.path.loc };
                    throw new _exception2["default"](
                        open.path.original + " doesn't match " + close,
                        errorNode,
                    );
                }
            }
            function SourceLocation(source, locInfo) {
                this.source = source;
                this.start = {
                    line: locInfo.first_line,
                    column: locInfo.first_column,
                };
                this.end = {
                    line: locInfo.last_line,
                    column: locInfo.last_column,
                };
            }
            function id(token) {
                if (/^\[.*\]$/.test(token)) {
                    return token.substring(1, token.length - 1);
                } else {
                    return token;
                }
            }
            function stripFlags(open, close) {
                return {
                    open: open.charAt(2) === "~",
                    close: close.charAt(close.length - 3) === "~",
                };
            }
            function stripComment(comment) {
                return comment
                    .replace(/^\{\{~?!-?-?/, "")
                    .replace(/-?-?~?\}\}$/, "");
            }
            function preparePath(data, parts, loc) {
                loc = this.locInfo(loc);
                var original = data ? "@" : "",
                    dig = [],
                    depth = 0;
                for (var i = 0, l = parts.length; i < l; i++) {
                    var part = parts[i].part,
                        isLiteral = parts[i].original !== part;
                    original += (parts[i].separator || "") + part;
                    if (
                        !isLiteral &&
                        (part === ".." || part === "." || part === "this")
                    ) {
                        if (dig.length > 0) {
                            throw new _exception2["default"](
                                "Invalid path: " + original,
                                { loc },
                            );
                        } else if (part === "..") {
                            depth++;
                        }
                    } else {
                        dig.push(part);
                    }
                }
                return {
                    type: "PathExpression",
                    data,
                    depth,
                    parts: dig,
                    original,
                    loc,
                };
            }
            function prepareMustache(path, params, hash, open, strip, locInfo) {
                var escapeFlag = open.charAt(3) || open.charAt(2),
                    escaped = escapeFlag !== "{" && escapeFlag !== "&";
                var decorator = /\*/.test(open);
                return {
                    type: decorator ? "Decorator" : "MustacheStatement",
                    path,
                    params,
                    hash,
                    escaped,
                    strip,
                    loc: this.locInfo(locInfo),
                };
            }
            function prepareRawBlock(openRawBlock, contents, close, locInfo) {
                validateClose(openRawBlock, close);
                locInfo = this.locInfo(locInfo);
                var program = {
                    type: "Program",
                    body: contents,
                    strip: {},
                    loc: locInfo,
                };
                return {
                    type: "BlockStatement",
                    path: openRawBlock.path,
                    params: openRawBlock.params,
                    hash: openRawBlock.hash,
                    program,
                    openStrip: {},
                    inverseStrip: {},
                    closeStrip: {},
                    loc: locInfo,
                };
            }
            function prepareBlock(
                openBlock,
                program,
                inverseAndProgram,
                close,
                inverted,
                locInfo,
            ) {
                if (close && close.path) {
                    validateClose(openBlock, close);
                }
                var decorator = /\*/.test(openBlock.open);
                program.blockParams = openBlock.blockParams;
                var inverse = void 0,
                    inverseStrip = void 0;
                if (inverseAndProgram) {
                    if (decorator) {
                        throw new _exception2["default"](
                            "Unexpected inverse block on decorator",
                            inverseAndProgram,
                        );
                    }
                    if (inverseAndProgram.chain) {
                        inverseAndProgram.program.body[0].closeStrip =
                            close.strip;
                    }
                    inverseStrip = inverseAndProgram.strip;
                    inverse = inverseAndProgram.program;
                }
                if (inverted) {
                    inverted = inverse;
                    inverse = program;
                    program = inverted;
                }
                return {
                    type: decorator ? "DecoratorBlock" : "BlockStatement",
                    path: openBlock.path,
                    params: openBlock.params,
                    hash: openBlock.hash,
                    program,
                    inverse,
                    openStrip: openBlock.strip,
                    inverseStrip,
                    closeStrip: close && close.strip,
                    loc: this.locInfo(locInfo),
                };
            }
            function prepareProgram(statements, loc) {
                if (!loc && statements.length) {
                    var firstLoc = statements[0].loc,
                        lastLoc = statements[statements.length - 1].loc;
                    if (firstLoc && lastLoc) {
                        loc = {
                            source: firstLoc.source,
                            start: {
                                line: firstLoc.start.line,
                                column: firstLoc.start.column,
                            },
                            end: {
                                line: lastLoc.end.line,
                                column: lastLoc.end.column,
                            },
                        };
                    }
                }
                return {
                    type: "Program",
                    body: statements,
                    strip: {},
                    loc,
                };
            }
            function preparePartialBlock(open, program, close, locInfo) {
                validateClose(open, close);
                return {
                    type: "PartialBlockStatement",
                    name: open.path,
                    params: open.params,
                    hash: open.hash,
                    program,
                    openStrip: open.strip,
                    closeStrip: close && close.strip,
                    loc: this.locInfo(locInfo),
                };
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/base.js
    var require_base2 = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/base.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.parseWithoutProcessing = parseWithoutProcessing;
            exports.parse = parse;
            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};
                    if (obj != null) {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key))
                                newObj[key] = obj[key];
                        }
                    }
                    newObj["default"] = obj;
                    return newObj;
                }
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _parser = require_parser();
            var _parser2 = _interopRequireDefault(_parser);
            var _whitespaceControl = require_whitespace_control();
            var _whitespaceControl2 =
                _interopRequireDefault(_whitespaceControl);
            var _helpers = require_helpers2();
            var Helpers = _interopRequireWildcard(_helpers);
            var _utils = require_utils();
            exports.parser = _parser2["default"];
            var yy = {};
            _utils.extend(yy, Helpers);
            function parseWithoutProcessing(input, options) {
                if (input.type === "Program") {
                    return input;
                }
                _parser2["default"].yy = yy;
                yy.locInfo = function (locInfo) {
                    return new yy.SourceLocation(
                        options && options.srcName,
                        locInfo,
                    );
                };
                var ast = _parser2["default"].parse(input);
                return ast;
            }
            function parse(input, options) {
                var ast = parseWithoutProcessing(input, options);
                var strip = new _whitespaceControl2["default"](options);
                return strip.accept(ast);
            }
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js
    var require_compiler = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js"(
            exports,
        ) {
            "use strict";
            exports.__esModule = true;
            exports.Compiler = Compiler;
            exports.precompile = precompile;
            exports.compile = compile;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            var _utils = require_utils();
            var _ast = require_ast();
            var _ast2 = _interopRequireDefault(_ast);
            var slice = [].slice;
            function Compiler() {}
            Compiler.prototype = {
                compiler: Compiler,
                equals: function equals(other) {
                    var len = this.opcodes.length;
                    if (other.opcodes.length !== len) {
                        return false;
                    }
                    for (var i = 0; i < len; i++) {
                        var opcode = this.opcodes[i],
                            otherOpcode = other.opcodes[i];
                        if (
                            opcode.opcode !== otherOpcode.opcode ||
                            !argEquals(opcode.args, otherOpcode.args)
                        ) {
                            return false;
                        }
                    }
                    len = this.children.length;
                    for (var i = 0; i < len; i++) {
                        if (!this.children[i].equals(other.children[i])) {
                            return false;
                        }
                    }
                    return true;
                },
                guid: 0,
                compile: function compile2(program, options) {
                    this.sourceNode = [];
                    this.opcodes = [];
                    this.children = [];
                    this.options = options;
                    this.stringParams = options.stringParams;
                    this.trackIds = options.trackIds;
                    options.blockParams = options.blockParams || [];
                    options.knownHelpers = _utils.extend(
                        /* @__PURE__ */ Object.create(null),
                        {
                            helperMissing: true,
                            blockHelperMissing: true,
                            each: true,
                            if: true,
                            unless: true,
                            with: true,
                            log: true,
                            lookup: true,
                        },
                        options.knownHelpers,
                    );
                    return this.accept(program);
                },
                compileProgram: function compileProgram(program) {
                    var childCompiler = new this.compiler(),
                        result = childCompiler.compile(program, this.options),
                        guid = this.guid++;
                    this.usePartial = this.usePartial || result.usePartial;
                    this.children[guid] = result;
                    this.useDepths = this.useDepths || result.useDepths;
                    return guid;
                },
                accept: function accept(node) {
                    if (!this[node.type]) {
                        throw new _exception2["default"](
                            "Unknown type: " + node.type,
                            node,
                        );
                    }
                    this.sourceNode.unshift(node);
                    var ret = this[node.type](node);
                    this.sourceNode.shift();
                    return ret;
                },
                Program: function Program(program) {
                    this.options.blockParams.unshift(program.blockParams);
                    var body = program.body,
                        bodyLength = body.length;
                    for (var i = 0; i < bodyLength; i++) {
                        this.accept(body[i]);
                    }
                    this.options.blockParams.shift();
                    this.isSimple = bodyLength === 1;
                    this.blockParams = program.blockParams
                        ? program.blockParams.length
                        : 0;
                    return this;
                },
                BlockStatement: function BlockStatement(block) {
                    transformLiteralToPath(block);
                    var program = block.program,
                        inverse = block.inverse;
                    program = program && this.compileProgram(program);
                    inverse = inverse && this.compileProgram(inverse);
                    var type = this.classifySexpr(block);
                    if (type === "helper") {
                        this.helperSexpr(block, program, inverse);
                    } else if (type === "simple") {
                        this.simpleSexpr(block);
                        this.opcode("pushProgram", program);
                        this.opcode("pushProgram", inverse);
                        this.opcode("emptyHash");
                        this.opcode("blockValue", block.path.original);
                    } else {
                        this.ambiguousSexpr(block, program, inverse);
                        this.opcode("pushProgram", program);
                        this.opcode("pushProgram", inverse);
                        this.opcode("emptyHash");
                        this.opcode("ambiguousBlockValue");
                    }
                    this.opcode("append");
                },
                DecoratorBlock: function DecoratorBlock(decorator) {
                    var program =
                        decorator.program &&
                        this.compileProgram(decorator.program);
                    var params = this.setupFullMustacheParams(
                            decorator,
                            program,
                            void 0,
                        ),
                        path = decorator.path;
                    this.useDecorators = true;
                    this.opcode(
                        "registerDecorator",
                        params.length,
                        path.original,
                    );
                },
                PartialStatement: function PartialStatement(partial) {
                    this.usePartial = true;
                    var program = partial.program;
                    if (program) {
                        program = this.compileProgram(partial.program);
                    }
                    var params = partial.params;
                    if (params.length > 1) {
                        throw new _exception2["default"](
                            "Unsupported number of partial arguments: " +
                                params.length,
                            partial,
                        );
                    } else if (!params.length) {
                        if (this.options.explicitPartialContext) {
                            this.opcode("pushLiteral", "undefined");
                        } else {
                            params.push({
                                type: "PathExpression",
                                parts: [],
                                depth: 0,
                            });
                        }
                    }
                    var partialName = partial.name.original,
                        isDynamic = partial.name.type === "SubExpression";
                    if (isDynamic) {
                        this.accept(partial.name);
                    }
                    this.setupFullMustacheParams(
                        partial,
                        program,
                        void 0,
                        true,
                    );
                    var indent = partial.indent || "";
                    if (this.options.preventIndent && indent) {
                        this.opcode("appendContent", indent);
                        indent = "";
                    }
                    this.opcode(
                        "invokePartial",
                        isDynamic,
                        partialName,
                        indent,
                    );
                    this.opcode("append");
                },
                PartialBlockStatement: function PartialBlockStatement(
                    partialBlock,
                ) {
                    this.PartialStatement(partialBlock);
                },
                MustacheStatement: function MustacheStatement(mustache) {
                    this.SubExpression(mustache);
                    if (mustache.escaped && !this.options.noEscape) {
                        this.opcode("appendEscaped");
                    } else {
                        this.opcode("append");
                    }
                },
                Decorator: function Decorator(decorator) {
                    this.DecoratorBlock(decorator);
                },
                ContentStatement: function ContentStatement(content) {
                    if (content.value) {
                        this.opcode("appendContent", content.value);
                    }
                },
                CommentStatement: function CommentStatement() {},
                SubExpression: function SubExpression(sexpr) {
                    transformLiteralToPath(sexpr);
                    var type = this.classifySexpr(sexpr);
                    if (type === "simple") {
                        this.simpleSexpr(sexpr);
                    } else if (type === "helper") {
                        this.helperSexpr(sexpr);
                    } else {
                        this.ambiguousSexpr(sexpr);
                    }
                },
                ambiguousSexpr: function ambiguousSexpr(
                    sexpr,
                    program,
                    inverse,
                ) {
                    var path = sexpr.path,
                        name = path.parts[0],
                        isBlock = program != null || inverse != null;
                    this.opcode("getContext", path.depth);
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    path.strict = true;
                    this.accept(path);
                    this.opcode("invokeAmbiguous", name, isBlock);
                },
                simpleSexpr: function simpleSexpr(sexpr) {
                    var path = sexpr.path;
                    path.strict = true;
                    this.accept(path);
                    this.opcode("resolvePossibleLambda");
                },
                helperSexpr: function helperSexpr(sexpr, program, inverse) {
                    var params = this.setupFullMustacheParams(
                            sexpr,
                            program,
                            inverse,
                        ),
                        path = sexpr.path,
                        name = path.parts[0];
                    if (this.options.knownHelpers[name]) {
                        this.opcode("invokeKnownHelper", params.length, name);
                    } else if (this.options.knownHelpersOnly) {
                        throw new _exception2["default"](
                            "You specified knownHelpersOnly, but used the unknown helper " +
                                name,
                            sexpr,
                        );
                    } else {
                        path.strict = true;
                        path.falsy = true;
                        this.accept(path);
                        this.opcode(
                            "invokeHelper",
                            params.length,
                            path.original,
                            _ast2["default"].helpers.simpleId(path),
                        );
                    }
                },
                PathExpression: function PathExpression(path) {
                    this.addDepth(path.depth);
                    this.opcode("getContext", path.depth);
                    var name = path.parts[0],
                        scoped = _ast2["default"].helpers.scopedId(path),
                        blockParamId =
                            !path.depth &&
                            !scoped &&
                            this.blockParamIndex(name);
                    if (blockParamId) {
                        this.opcode(
                            "lookupBlockParam",
                            blockParamId,
                            path.parts,
                        );
                    } else if (!name) {
                        this.opcode("pushContext");
                    } else if (path.data) {
                        this.options.data = true;
                        this.opcode(
                            "lookupData",
                            path.depth,
                            path.parts,
                            path.strict,
                        );
                    } else {
                        this.opcode(
                            "lookupOnContext",
                            path.parts,
                            path.falsy,
                            path.strict,
                            scoped,
                        );
                    }
                },
                StringLiteral: function StringLiteral(string) {
                    this.opcode("pushString", string.value);
                },
                NumberLiteral: function NumberLiteral(number) {
                    this.opcode("pushLiteral", number.value);
                },
                BooleanLiteral: function BooleanLiteral(bool) {
                    this.opcode("pushLiteral", bool.value);
                },
                UndefinedLiteral: function UndefinedLiteral() {
                    this.opcode("pushLiteral", "undefined");
                },
                NullLiteral: function NullLiteral() {
                    this.opcode("pushLiteral", "null");
                },
                Hash: function Hash(hash) {
                    var pairs = hash.pairs,
                        i = 0,
                        l = pairs.length;
                    this.opcode("pushHash");
                    for (; i < l; i++) {
                        this.pushParam(pairs[i].value);
                    }
                    while (i--) {
                        this.opcode("assignToHash", pairs[i].key);
                    }
                    this.opcode("popHash");
                },
                // HELPERS
                opcode: function opcode(name) {
                    this.opcodes.push({
                        opcode: name,
                        args: slice.call(arguments, 1),
                        loc: this.sourceNode[0].loc,
                    });
                },
                addDepth: function addDepth(depth) {
                    if (!depth) {
                        return;
                    }
                    this.useDepths = true;
                },
                classifySexpr: function classifySexpr(sexpr) {
                    var isSimple = _ast2["default"].helpers.simpleId(
                        sexpr.path,
                    );
                    var isBlockParam =
                        isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);
                    var isHelper =
                        !isBlockParam &&
                        _ast2["default"].helpers.helperExpression(sexpr);
                    var isEligible = !isBlockParam && (isHelper || isSimple);
                    if (isEligible && !isHelper) {
                        var _name = sexpr.path.parts[0],
                            options = this.options;
                        if (options.knownHelpers[_name]) {
                            isHelper = true;
                        } else if (options.knownHelpersOnly) {
                            isEligible = false;
                        }
                    }
                    if (isHelper) {
                        return "helper";
                    } else if (isEligible) {
                        return "ambiguous";
                    } else {
                        return "simple";
                    }
                },
                pushParams: function pushParams(params) {
                    for (var i = 0, l = params.length; i < l; i++) {
                        this.pushParam(params[i]);
                    }
                },
                pushParam: function pushParam(val) {
                    var value =
                        val.value != null ? val.value : val.original || "";
                    if (this.stringParams) {
                        if (value.replace) {
                            value = value
                                .replace(/^(\.?\.\/)*/g, "")
                                .replace(/\//g, ".");
                        }
                        if (val.depth) {
                            this.addDepth(val.depth);
                        }
                        this.opcode("getContext", val.depth || 0);
                        this.opcode("pushStringParam", value, val.type);
                        if (val.type === "SubExpression") {
                            this.accept(val);
                        }
                    } else {
                        if (this.trackIds) {
                            var blockParamIndex = void 0;
                            if (
                                val.parts &&
                                !_ast2["default"].helpers.scopedId(val) &&
                                !val.depth
                            ) {
                                blockParamIndex = this.blockParamIndex(
                                    val.parts[0],
                                );
                            }
                            if (blockParamIndex) {
                                var blockParamChild = val.parts
                                    .slice(1)
                                    .join(".");
                                this.opcode(
                                    "pushId",
                                    "BlockParam",
                                    blockParamIndex,
                                    blockParamChild,
                                );
                            } else {
                                value = val.original || value;
                                if (value.replace) {
                                    value = value
                                        .replace(/^this(?:\.|$)/, "")
                                        .replace(/^\.\//, "")
                                        .replace(/^\.$/, "");
                                }
                                this.opcode("pushId", val.type, value);
                            }
                        }
                        this.accept(val);
                    }
                },
                setupFullMustacheParams: function setupFullMustacheParams(
                    sexpr,
                    program,
                    inverse,
                    omitEmpty,
                ) {
                    var params = sexpr.params;
                    this.pushParams(params);
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    if (sexpr.hash) {
                        this.accept(sexpr.hash);
                    } else {
                        this.opcode("emptyHash", omitEmpty);
                    }
                    return params;
                },
                blockParamIndex: function blockParamIndex(name) {
                    for (
                        var depth = 0, len = this.options.blockParams.length;
                        depth < len;
                        depth++
                    ) {
                        var blockParams = this.options.blockParams[depth],
                            param =
                                blockParams &&
                                _utils.indexOf(blockParams, name);
                        if (blockParams && param >= 0) {
                            return [depth, param];
                        }
                    }
                },
            };
            function precompile(input, options, env) {
                if (
                    input == null ||
                    (typeof input !== "string" && input.type !== "Program")
                ) {
                    throw new _exception2["default"](
                        "You must pass a string or Handlebars AST to Handlebars.precompile. You passed " +
                            input,
                    );
                }
                options = options || {};
                if (!("data" in options)) {
                    options.data = true;
                }
                if (options.compat) {
                    options.useDepths = true;
                }
                var ast = env.parse(input, options),
                    environment = new env.Compiler().compile(ast, options);
                return new env.JavaScriptCompiler().compile(
                    environment,
                    options,
                );
            }
            function compile(input, options, env) {
                if (options === void 0) options = {};
                if (
                    input == null ||
                    (typeof input !== "string" && input.type !== "Program")
                ) {
                    throw new _exception2["default"](
                        "You must pass a string or Handlebars AST to Handlebars.compile. You passed " +
                            input,
                    );
                }
                options = _utils.extend({}, options);
                if (!("data" in options)) {
                    options.data = true;
                }
                if (options.compat) {
                    options.useDepths = true;
                }
                var compiled = void 0;
                function compileInput() {
                    var ast = env.parse(input, options),
                        environment = new env.Compiler().compile(ast, options),
                        templateSpec = new env.JavaScriptCompiler().compile(
                            environment,
                            options,
                            void 0,
                            true,
                        );
                    return env.template(templateSpec);
                }
                function ret(context, execOptions) {
                    if (!compiled) {
                        compiled = compileInput();
                    }
                    return compiled.call(this, context, execOptions);
                }
                ret._setup = function (setupOptions) {
                    if (!compiled) {
                        compiled = compileInput();
                    }
                    return compiled._setup(setupOptions);
                };
                ret._child = function (i, data, blockParams, depths) {
                    if (!compiled) {
                        compiled = compileInput();
                    }
                    return compiled._child(i, data, blockParams, depths);
                };
                return ret;
            }
            function argEquals(a, b) {
                if (a === b) {
                    return true;
                }
                if (
                    _utils.isArray(a) &&
                    _utils.isArray(b) &&
                    a.length === b.length
                ) {
                    for (var i = 0; i < a.length; i++) {
                        if (!argEquals(a[i], b[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            function transformLiteralToPath(sexpr) {
                if (!sexpr.path.parts) {
                    var literal = sexpr.path;
                    sexpr.path = {
                        type: "PathExpression",
                        data: false,
                        depth: 0,
                        parts: [literal.original + ""],
                        original: literal.original + "",
                        loc: literal.loc,
                    };
                }
            }
        },
    });

    // node_modules/source-map/lib/base64.js
    var require_base64 = __commonJS({
        "node_modules/source-map/lib/base64.js"(exports) {
            var intToCharMap =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
                    "",
                );
            exports.encode = function (number) {
                if (0 <= number && number < intToCharMap.length) {
                    return intToCharMap[number];
                }
                throw new TypeError("Must be between 0 and 63: " + number);
            };
            exports.decode = function (charCode) {
                var bigA = 65;
                var bigZ = 90;
                var littleA = 97;
                var littleZ = 122;
                var zero = 48;
                var nine = 57;
                var plus = 43;
                var slash = 47;
                var littleOffset = 26;
                var numberOffset = 52;
                if (bigA <= charCode && charCode <= bigZ) {
                    return charCode - bigA;
                }
                if (littleA <= charCode && charCode <= littleZ) {
                    return charCode - littleA + littleOffset;
                }
                if (zero <= charCode && charCode <= nine) {
                    return charCode - zero + numberOffset;
                }
                if (charCode == plus) {
                    return 62;
                }
                if (charCode == slash) {
                    return 63;
                }
                return -1;
            };
        },
    });

    // node_modules/source-map/lib/base64-vlq.js
    var require_base64_vlq = __commonJS({
        "node_modules/source-map/lib/base64-vlq.js"(exports) {
            var base64 = require_base64();
            var VLQ_BASE_SHIFT = 5;
            var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
            var VLQ_BASE_MASK = VLQ_BASE - 1;
            var VLQ_CONTINUATION_BIT = VLQ_BASE;
            function toVLQSigned(aValue) {
                return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
            }
            function fromVLQSigned(aValue) {
                var isNegative = (aValue & 1) === 1;
                var shifted = aValue >> 1;
                return isNegative ? -shifted : shifted;
            }
            exports.encode = function base64VLQ_encode(aValue) {
                var encoded = "";
                var digit;
                var vlq = toVLQSigned(aValue);
                do {
                    digit = vlq & VLQ_BASE_MASK;
                    vlq >>>= VLQ_BASE_SHIFT;
                    if (vlq > 0) {
                        digit |= VLQ_CONTINUATION_BIT;
                    }
                    encoded += base64.encode(digit);
                } while (vlq > 0);
                return encoded;
            };
            exports.decode = function base64VLQ_decode(
                aStr,
                aIndex,
                aOutParam,
            ) {
                var strLen = aStr.length;
                var result = 0;
                var shift = 0;
                var continuation, digit;
                do {
                    if (aIndex >= strLen) {
                        throw new Error(
                            "Expected more digits in base 64 VLQ value.",
                        );
                    }
                    digit = base64.decode(aStr.charCodeAt(aIndex++));
                    if (digit === -1) {
                        throw new Error(
                            "Invalid base64 digit: " + aStr.charAt(aIndex - 1),
                        );
                    }
                    continuation = !!(digit & VLQ_CONTINUATION_BIT);
                    digit &= VLQ_BASE_MASK;
                    result = result + (digit << shift);
                    shift += VLQ_BASE_SHIFT;
                } while (continuation);
                aOutParam.value = fromVLQSigned(result);
                aOutParam.rest = aIndex;
            };
        },
    });

    // node_modules/source-map/lib/util.js
    var require_util = __commonJS({
        "node_modules/source-map/lib/util.js"(exports) {
            function getArg(aArgs, aName, aDefaultValue) {
                if (aName in aArgs) {
                    return aArgs[aName];
                } else if (arguments.length === 3) {
                    return aDefaultValue;
                } else {
                    throw new Error('"' + aName + '" is a required argument.');
                }
            }
            exports.getArg = getArg;
            var urlRegexp =
                /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
            var dataUrlRegexp = /^data:.+\,.+$/;
            function urlParse(aUrl) {
                var match = aUrl.match(urlRegexp);
                if (!match) {
                    return null;
                }
                return {
                    scheme: match[1],
                    auth: match[2],
                    host: match[3],
                    port: match[4],
                    path: match[5],
                };
            }
            exports.urlParse = urlParse;
            function urlGenerate(aParsedUrl) {
                var url = "";
                if (aParsedUrl.scheme) {
                    url += aParsedUrl.scheme + ":";
                }
                url += "//";
                if (aParsedUrl.auth) {
                    url += aParsedUrl.auth + "@";
                }
                if (aParsedUrl.host) {
                    url += aParsedUrl.host;
                }
                if (aParsedUrl.port) {
                    url += ":" + aParsedUrl.port;
                }
                if (aParsedUrl.path) {
                    url += aParsedUrl.path;
                }
                return url;
            }
            exports.urlGenerate = urlGenerate;
            function normalize(aPath) {
                var path = aPath;
                var url = urlParse(aPath);
                if (url) {
                    if (!url.path) {
                        return aPath;
                    }
                    path = url.path;
                }
                var isAbsolute = exports.isAbsolute(path);
                var parts = path.split(/\/+/);
                for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
                    part = parts[i];
                    if (part === ".") {
                        parts.splice(i, 1);
                    } else if (part === "..") {
                        up++;
                    } else if (up > 0) {
                        if (part === "") {
                            parts.splice(i + 1, up);
                            up = 0;
                        } else {
                            parts.splice(i, 2);
                            up--;
                        }
                    }
                }
                path = parts.join("/");
                if (path === "") {
                    path = isAbsolute ? "/" : ".";
                }
                if (url) {
                    url.path = path;
                    return urlGenerate(url);
                }
                return path;
            }
            exports.normalize = normalize;
            function join(aRoot, aPath) {
                if (aRoot === "") {
                    aRoot = ".";
                }
                if (aPath === "") {
                    aPath = ".";
                }
                var aPathUrl = urlParse(aPath);
                var aRootUrl = urlParse(aRoot);
                if (aRootUrl) {
                    aRoot = aRootUrl.path || "/";
                }
                if (aPathUrl && !aPathUrl.scheme) {
                    if (aRootUrl) {
                        aPathUrl.scheme = aRootUrl.scheme;
                    }
                    return urlGenerate(aPathUrl);
                }
                if (aPathUrl || aPath.match(dataUrlRegexp)) {
                    return aPath;
                }
                if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
                    aRootUrl.host = aPath;
                    return urlGenerate(aRootUrl);
                }
                var joined =
                    aPath.charAt(0) === "/"
                        ? aPath
                        : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
                if (aRootUrl) {
                    aRootUrl.path = joined;
                    return urlGenerate(aRootUrl);
                }
                return joined;
            }
            exports.join = join;
            exports.isAbsolute = function (aPath) {
                return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
            };
            function relative(aRoot, aPath) {
                if (aRoot === "") {
                    aRoot = ".";
                }
                aRoot = aRoot.replace(/\/$/, "");
                var level = 0;
                while (aPath.indexOf(aRoot + "/") !== 0) {
                    var index = aRoot.lastIndexOf("/");
                    if (index < 0) {
                        return aPath;
                    }
                    aRoot = aRoot.slice(0, index);
                    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
                        return aPath;
                    }
                    ++level;
                }
                return (
                    Array(level + 1).join("../") +
                    aPath.substr(aRoot.length + 1)
                );
            }
            exports.relative = relative;
            var supportsNullProto = (function () {
                var obj = /* @__PURE__ */ Object.create(null);
                return !("__proto__" in obj);
            })();
            function identity(s) {
                return s;
            }
            function toSetString(aStr) {
                if (isProtoString(aStr)) {
                    return "$" + aStr;
                }
                return aStr;
            }
            exports.toSetString = supportsNullProto ? identity : toSetString;
            function fromSetString(aStr) {
                if (isProtoString(aStr)) {
                    return aStr.slice(1);
                }
                return aStr;
            }
            exports.fromSetString = supportsNullProto
                ? identity
                : fromSetString;
            function isProtoString(s) {
                if (!s) {
                    return false;
                }
                var length = s.length;
                if (length < 9) {
                    return false;
                }
                if (
                    s.charCodeAt(length - 1) !== 95 ||
                    s.charCodeAt(length - 2) !== 95 ||
                    s.charCodeAt(length - 3) !== 111 ||
                    s.charCodeAt(length - 4) !== 116 ||
                    s.charCodeAt(length - 5) !== 111 ||
                    s.charCodeAt(length - 6) !== 114 ||
                    s.charCodeAt(length - 7) !== 112 ||
                    s.charCodeAt(length - 8) !== 95 ||
                    s.charCodeAt(length - 9) !== 95
                ) {
                    return false;
                }
                for (var i = length - 10; i >= 0; i--) {
                    if (s.charCodeAt(i) !== 36) {
                        return false;
                    }
                }
                return true;
            }
            function compareByOriginalPositions(
                mappingA,
                mappingB,
                onlyCompareOriginal,
            ) {
                var cmp = strcmp(mappingA.source, mappingB.source);
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalLine - mappingB.originalLine;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalColumn - mappingB.originalColumn;
                if (cmp !== 0 || onlyCompareOriginal) {
                    return cmp;
                }
                cmp = mappingA.generatedColumn - mappingB.generatedColumn;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.generatedLine - mappingB.generatedLine;
                if (cmp !== 0) {
                    return cmp;
                }
                return strcmp(mappingA.name, mappingB.name);
            }
            exports.compareByOriginalPositions = compareByOriginalPositions;
            function compareByGeneratedPositionsDeflated(
                mappingA,
                mappingB,
                onlyCompareGenerated,
            ) {
                var cmp = mappingA.generatedLine - mappingB.generatedLine;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.generatedColumn - mappingB.generatedColumn;
                if (cmp !== 0 || onlyCompareGenerated) {
                    return cmp;
                }
                cmp = strcmp(mappingA.source, mappingB.source);
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalLine - mappingB.originalLine;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalColumn - mappingB.originalColumn;
                if (cmp !== 0) {
                    return cmp;
                }
                return strcmp(mappingA.name, mappingB.name);
            }
            exports.compareByGeneratedPositionsDeflated =
                compareByGeneratedPositionsDeflated;
            function strcmp(aStr1, aStr2) {
                if (aStr1 === aStr2) {
                    return 0;
                }
                if (aStr1 === null) {
                    return 1;
                }
                if (aStr2 === null) {
                    return -1;
                }
                if (aStr1 > aStr2) {
                    return 1;
                }
                return -1;
            }
            function compareByGeneratedPositionsInflated(mappingA, mappingB) {
                var cmp = mappingA.generatedLine - mappingB.generatedLine;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.generatedColumn - mappingB.generatedColumn;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = strcmp(mappingA.source, mappingB.source);
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalLine - mappingB.originalLine;
                if (cmp !== 0) {
                    return cmp;
                }
                cmp = mappingA.originalColumn - mappingB.originalColumn;
                if (cmp !== 0) {
                    return cmp;
                }
                return strcmp(mappingA.name, mappingB.name);
            }
            exports.compareByGeneratedPositionsInflated =
                compareByGeneratedPositionsInflated;
            function parseSourceMapInput(str) {
                return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
            }
            exports.parseSourceMapInput = parseSourceMapInput;
            function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
                sourceURL = sourceURL || "";
                if (sourceRoot) {
                    if (
                        sourceRoot[sourceRoot.length - 1] !== "/" &&
                        sourceURL[0] !== "/"
                    ) {
                        sourceRoot += "/";
                    }
                    sourceURL = sourceRoot + sourceURL;
                }
                if (sourceMapURL) {
                    var parsed = urlParse(sourceMapURL);
                    if (!parsed) {
                        throw new Error("sourceMapURL could not be parsed");
                    }
                    if (parsed.path) {
                        var index = parsed.path.lastIndexOf("/");
                        if (index >= 0) {
                            parsed.path = parsed.path.substring(0, index + 1);
                        }
                    }
                    sourceURL = join(urlGenerate(parsed), sourceURL);
                }
                return normalize(sourceURL);
            }
            exports.computeSourceURL = computeSourceURL;
        },
    });

    // node_modules/source-map/lib/array-set.js
    var require_array_set = __commonJS({
        "node_modules/source-map/lib/array-set.js"(exports) {
            var util = require_util();
            var has = Object.prototype.hasOwnProperty;
            var hasNativeMap = typeof Map !== "undefined";
            function ArraySet() {
                this._array = [];
                this._set = hasNativeMap
                    ? /* @__PURE__ */ new Map()
                    : /* @__PURE__ */ Object.create(null);
            }
            ArraySet.fromArray = function ArraySet_fromArray(
                aArray,
                aAllowDuplicates,
            ) {
                var set = new ArraySet();
                for (var i = 0, len = aArray.length; i < len; i++) {
                    set.add(aArray[i], aAllowDuplicates);
                }
                return set;
            };
            ArraySet.prototype.size = function ArraySet_size() {
                return hasNativeMap
                    ? this._set.size
                    : Object.getOwnPropertyNames(this._set).length;
            };
            ArraySet.prototype.add = function ArraySet_add(
                aStr,
                aAllowDuplicates,
            ) {
                var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
                var isDuplicate = hasNativeMap
                    ? this.has(aStr)
                    : has.call(this._set, sStr);
                var idx = this._array.length;
                if (!isDuplicate || aAllowDuplicates) {
                    this._array.push(aStr);
                }
                if (!isDuplicate) {
                    if (hasNativeMap) {
                        this._set.set(aStr, idx);
                    } else {
                        this._set[sStr] = idx;
                    }
                }
            };
            ArraySet.prototype.has = function ArraySet_has(aStr) {
                if (hasNativeMap) {
                    return this._set.has(aStr);
                } else {
                    var sStr = util.toSetString(aStr);
                    return has.call(this._set, sStr);
                }
            };
            ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
                if (hasNativeMap) {
                    var idx = this._set.get(aStr);
                    if (idx >= 0) {
                        return idx;
                    }
                } else {
                    var sStr = util.toSetString(aStr);
                    if (has.call(this._set, sStr)) {
                        return this._set[sStr];
                    }
                }
                throw new Error('"' + aStr + '" is not in the set.');
            };
            ArraySet.prototype.at = function ArraySet_at(aIdx) {
                if (aIdx >= 0 && aIdx < this._array.length) {
                    return this._array[aIdx];
                }
                throw new Error("No element indexed by " + aIdx);
            };
            ArraySet.prototype.toArray = function ArraySet_toArray() {
                return this._array.slice();
            };
            exports.ArraySet = ArraySet;
        },
    });

    // node_modules/source-map/lib/mapping-list.js
    var require_mapping_list = __commonJS({
        "node_modules/source-map/lib/mapping-list.js"(exports) {
            var util = require_util();
            function generatedPositionAfter(mappingA, mappingB) {
                var lineA = mappingA.generatedLine;
                var lineB = mappingB.generatedLine;
                var columnA = mappingA.generatedColumn;
                var columnB = mappingB.generatedColumn;
                return (
                    lineB > lineA ||
                    (lineB == lineA && columnB >= columnA) ||
                    util.compareByGeneratedPositionsInflated(
                        mappingA,
                        mappingB,
                    ) <= 0
                );
            }
            function MappingList() {
                this._array = [];
                this._sorted = true;
                this._last = { generatedLine: -1, generatedColumn: 0 };
            }
            MappingList.prototype.unsortedForEach =
                function MappingList_forEach(aCallback, aThisArg) {
                    this._array.forEach(aCallback, aThisArg);
                };
            MappingList.prototype.add = function MappingList_add(aMapping) {
                if (generatedPositionAfter(this._last, aMapping)) {
                    this._last = aMapping;
                    this._array.push(aMapping);
                } else {
                    this._sorted = false;
                    this._array.push(aMapping);
                }
            };
            MappingList.prototype.toArray = function MappingList_toArray() {
                if (!this._sorted) {
                    this._array.sort(util.compareByGeneratedPositionsInflated);
                    this._sorted = true;
                }
                return this._array;
            };
            exports.MappingList = MappingList;
        },
    });

    // node_modules/source-map/lib/source-map-generator.js
    var require_source_map_generator = __commonJS({
        "node_modules/source-map/lib/source-map-generator.js"(exports) {
            var base64VLQ = require_base64_vlq();
            var util = require_util();
            var ArraySet = require_array_set().ArraySet;
            var MappingList = require_mapping_list().MappingList;
            function SourceMapGenerator(aArgs) {
                if (!aArgs) {
                    aArgs = {};
                }
                this._file = util.getArg(aArgs, "file", null);
                this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
                this._skipValidation = util.getArg(
                    aArgs,
                    "skipValidation",
                    false,
                );
                this._sources = new ArraySet();
                this._names = new ArraySet();
                this._mappings = new MappingList();
                this._sourcesContents = null;
            }
            SourceMapGenerator.prototype._version = 3;
            SourceMapGenerator.fromSourceMap =
                function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
                    var sourceRoot = aSourceMapConsumer.sourceRoot;
                    var generator = new SourceMapGenerator({
                        file: aSourceMapConsumer.file,
                        sourceRoot,
                    });
                    aSourceMapConsumer.eachMapping(function (mapping) {
                        var newMapping = {
                            generated: {
                                line: mapping.generatedLine,
                                column: mapping.generatedColumn,
                            },
                        };
                        if (mapping.source != null) {
                            newMapping.source = mapping.source;
                            if (sourceRoot != null) {
                                newMapping.source = util.relative(
                                    sourceRoot,
                                    newMapping.source,
                                );
                            }
                            newMapping.original = {
                                line: mapping.originalLine,
                                column: mapping.originalColumn,
                            };
                            if (mapping.name != null) {
                                newMapping.name = mapping.name;
                            }
                        }
                        generator.addMapping(newMapping);
                    });
                    aSourceMapConsumer.sources.forEach(function (sourceFile) {
                        var sourceRelative = sourceFile;
                        if (sourceRoot !== null) {
                            sourceRelative = util.relative(
                                sourceRoot,
                                sourceFile,
                            );
                        }
                        if (!generator._sources.has(sourceRelative)) {
                            generator._sources.add(sourceRelative);
                        }
                        var content =
                            aSourceMapConsumer.sourceContentFor(sourceFile);
                        if (content != null) {
                            generator.setSourceContent(sourceFile, content);
                        }
                    });
                    return generator;
                };
            SourceMapGenerator.prototype.addMapping =
                function SourceMapGenerator_addMapping(aArgs) {
                    var generated = util.getArg(aArgs, "generated");
                    var original = util.getArg(aArgs, "original", null);
                    var source = util.getArg(aArgs, "source", null);
                    var name = util.getArg(aArgs, "name", null);
                    if (!this._skipValidation) {
                        this._validateMapping(
                            generated,
                            original,
                            source,
                            name,
                        );
                    }
                    if (source != null) {
                        source = String(source);
                        if (!this._sources.has(source)) {
                            this._sources.add(source);
                        }
                    }
                    if (name != null) {
                        name = String(name);
                        if (!this._names.has(name)) {
                            this._names.add(name);
                        }
                    }
                    this._mappings.add({
                        generatedLine: generated.line,
                        generatedColumn: generated.column,
                        originalLine: original != null && original.line,
                        originalColumn: original != null && original.column,
                        source,
                        name,
                    });
                };
            SourceMapGenerator.prototype.setSourceContent =
                function SourceMapGenerator_setSourceContent(
                    aSourceFile,
                    aSourceContent,
                ) {
                    var source = aSourceFile;
                    if (this._sourceRoot != null) {
                        source = util.relative(this._sourceRoot, source);
                    }
                    if (aSourceContent != null) {
                        if (!this._sourcesContents) {
                            this._sourcesContents =
                                /* @__PURE__ */ Object.create(null);
                        }
                        this._sourcesContents[util.toSetString(source)] =
                            aSourceContent;
                    } else if (this._sourcesContents) {
                        delete this._sourcesContents[util.toSetString(source)];
                        if (Object.keys(this._sourcesContents).length === 0) {
                            this._sourcesContents = null;
                        }
                    }
                };
            SourceMapGenerator.prototype.applySourceMap =
                function SourceMapGenerator_applySourceMap(
                    aSourceMapConsumer,
                    aSourceFile,
                    aSourceMapPath,
                ) {
                    var sourceFile = aSourceFile;
                    if (aSourceFile == null) {
                        if (aSourceMapConsumer.file == null) {
                            throw new Error(
                                `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`,
                            );
                        }
                        sourceFile = aSourceMapConsumer.file;
                    }
                    var sourceRoot = this._sourceRoot;
                    if (sourceRoot != null) {
                        sourceFile = util.relative(sourceRoot, sourceFile);
                    }
                    var newSources = new ArraySet();
                    var newNames = new ArraySet();
                    this._mappings.unsortedForEach(function (mapping) {
                        if (
                            mapping.source === sourceFile &&
                            mapping.originalLine != null
                        ) {
                            var original =
                                aSourceMapConsumer.originalPositionFor({
                                    line: mapping.originalLine,
                                    column: mapping.originalColumn,
                                });
                            if (original.source != null) {
                                mapping.source = original.source;
                                if (aSourceMapPath != null) {
                                    mapping.source = util.join(
                                        aSourceMapPath,
                                        mapping.source,
                                    );
                                }
                                if (sourceRoot != null) {
                                    mapping.source = util.relative(
                                        sourceRoot,
                                        mapping.source,
                                    );
                                }
                                mapping.originalLine = original.line;
                                mapping.originalColumn = original.column;
                                if (original.name != null) {
                                    mapping.name = original.name;
                                }
                            }
                        }
                        var source = mapping.source;
                        if (source != null && !newSources.has(source)) {
                            newSources.add(source);
                        }
                        var name = mapping.name;
                        if (name != null && !newNames.has(name)) {
                            newNames.add(name);
                        }
                    }, this);
                    this._sources = newSources;
                    this._names = newNames;
                    aSourceMapConsumer.sources.forEach(function (sourceFile2) {
                        var content =
                            aSourceMapConsumer.sourceContentFor(sourceFile2);
                        if (content != null) {
                            if (aSourceMapPath != null) {
                                sourceFile2 = util.join(
                                    aSourceMapPath,
                                    sourceFile2,
                                );
                            }
                            if (sourceRoot != null) {
                                sourceFile2 = util.relative(
                                    sourceRoot,
                                    sourceFile2,
                                );
                            }
                            this.setSourceContent(sourceFile2, content);
                        }
                    }, this);
                };
            SourceMapGenerator.prototype._validateMapping =
                function SourceMapGenerator_validateMapping(
                    aGenerated,
                    aOriginal,
                    aSource,
                    aName,
                ) {
                    if (
                        aOriginal &&
                        typeof aOriginal.line !== "number" &&
                        typeof aOriginal.column !== "number"
                    ) {
                        throw new Error(
                            "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.",
                        );
                    }
                    if (
                        aGenerated &&
                        "line" in aGenerated &&
                        "column" in aGenerated &&
                        aGenerated.line > 0 &&
                        aGenerated.column >= 0 &&
                        !aOriginal &&
                        !aSource &&
                        !aName
                    ) {
                        return;
                    } else if (
                        aGenerated &&
                        "line" in aGenerated &&
                        "column" in aGenerated &&
                        aOriginal &&
                        "line" in aOriginal &&
                        "column" in aOriginal &&
                        aGenerated.line > 0 &&
                        aGenerated.column >= 0 &&
                        aOriginal.line > 0 &&
                        aOriginal.column >= 0 &&
                        aSource
                    ) {
                        return;
                    } else {
                        throw new Error(
                            "Invalid mapping: " +
                                JSON.stringify({
                                    generated: aGenerated,
                                    source: aSource,
                                    original: aOriginal,
                                    name: aName,
                                }),
                        );
                    }
                };
            SourceMapGenerator.prototype._serializeMappings =
                function SourceMapGenerator_serializeMappings() {
                    var previousGeneratedColumn = 0;
                    var previousGeneratedLine = 1;
                    var previousOriginalColumn = 0;
                    var previousOriginalLine = 0;
                    var previousName = 0;
                    var previousSource = 0;
                    var result = "";
                    var next;
                    var mapping;
                    var nameIdx;
                    var sourceIdx;
                    var mappings = this._mappings.toArray();
                    for (var i = 0, len = mappings.length; i < len; i++) {
                        mapping = mappings[i];
                        next = "";
                        if (mapping.generatedLine !== previousGeneratedLine) {
                            previousGeneratedColumn = 0;
                            while (
                                mapping.generatedLine !== previousGeneratedLine
                            ) {
                                next += ";";
                                previousGeneratedLine++;
                            }
                        } else {
                            if (i > 0) {
                                if (
                                    !util.compareByGeneratedPositionsInflated(
                                        mapping,
                                        mappings[i - 1],
                                    )
                                ) {
                                    continue;
                                }
                                next += ",";
                            }
                        }
                        next += base64VLQ.encode(
                            mapping.generatedColumn - previousGeneratedColumn,
                        );
                        previousGeneratedColumn = mapping.generatedColumn;
                        if (mapping.source != null) {
                            sourceIdx = this._sources.indexOf(mapping.source);
                            next += base64VLQ.encode(
                                sourceIdx - previousSource,
                            );
                            previousSource = sourceIdx;
                            next += base64VLQ.encode(
                                mapping.originalLine - 1 - previousOriginalLine,
                            );
                            previousOriginalLine = mapping.originalLine - 1;
                            next += base64VLQ.encode(
                                mapping.originalColumn - previousOriginalColumn,
                            );
                            previousOriginalColumn = mapping.originalColumn;
                            if (mapping.name != null) {
                                nameIdx = this._names.indexOf(mapping.name);
                                next += base64VLQ.encode(
                                    nameIdx - previousName,
                                );
                                previousName = nameIdx;
                            }
                        }
                        result += next;
                    }
                    return result;
                };
            SourceMapGenerator.prototype._generateSourcesContent =
                function SourceMapGenerator_generateSourcesContent(
                    aSources,
                    aSourceRoot,
                ) {
                    return aSources.map(function (source) {
                        if (!this._sourcesContents) {
                            return null;
                        }
                        if (aSourceRoot != null) {
                            source = util.relative(aSourceRoot, source);
                        }
                        var key = util.toSetString(source);
                        return Object.prototype.hasOwnProperty.call(
                            this._sourcesContents,
                            key,
                        )
                            ? this._sourcesContents[key]
                            : null;
                    }, this);
                };
            SourceMapGenerator.prototype.toJSON =
                function SourceMapGenerator_toJSON() {
                    var map = {
                        version: this._version,
                        sources: this._sources.toArray(),
                        names: this._names.toArray(),
                        mappings: this._serializeMappings(),
                    };
                    if (this._file != null) {
                        map.file = this._file;
                    }
                    if (this._sourceRoot != null) {
                        map.sourceRoot = this._sourceRoot;
                    }
                    if (this._sourcesContents) {
                        map.sourcesContent = this._generateSourcesContent(
                            map.sources,
                            map.sourceRoot,
                        );
                    }
                    return map;
                };
            SourceMapGenerator.prototype.toString =
                function SourceMapGenerator_toString() {
                    return JSON.stringify(this.toJSON());
                };
            exports.SourceMapGenerator = SourceMapGenerator;
        },
    });

    // node_modules/source-map/lib/binary-search.js
    var require_binary_search = __commonJS({
        "node_modules/source-map/lib/binary-search.js"(exports) {
            exports.GREATEST_LOWER_BOUND = 1;
            exports.LEAST_UPPER_BOUND = 2;
            function recursiveSearch(
                aLow,
                aHigh,
                aNeedle,
                aHaystack,
                aCompare,
                aBias,
            ) {
                var mid = Math.floor((aHigh - aLow) / 2) + aLow;
                var cmp = aCompare(aNeedle, aHaystack[mid], true);
                if (cmp === 0) {
                    return mid;
                } else if (cmp > 0) {
                    if (aHigh - mid > 1) {
                        return recursiveSearch(
                            mid,
                            aHigh,
                            aNeedle,
                            aHaystack,
                            aCompare,
                            aBias,
                        );
                    }
                    if (aBias == exports.LEAST_UPPER_BOUND) {
                        return aHigh < aHaystack.length ? aHigh : -1;
                    } else {
                        return mid;
                    }
                } else {
                    if (mid - aLow > 1) {
                        return recursiveSearch(
                            aLow,
                            mid,
                            aNeedle,
                            aHaystack,
                            aCompare,
                            aBias,
                        );
                    }
                    if (aBias == exports.LEAST_UPPER_BOUND) {
                        return mid;
                    } else {
                        return aLow < 0 ? -1 : aLow;
                    }
                }
            }
            exports.search = function search(
                aNeedle,
                aHaystack,
                aCompare,
                aBias,
            ) {
                if (aHaystack.length === 0) {
                    return -1;
                }
                var index = recursiveSearch(
                    -1,
                    aHaystack.length,
                    aNeedle,
                    aHaystack,
                    aCompare,
                    aBias || exports.GREATEST_LOWER_BOUND,
                );
                if (index < 0) {
                    return -1;
                }
                while (index - 1 >= 0) {
                    if (
                        aCompare(
                            aHaystack[index],
                            aHaystack[index - 1],
                            true,
                        ) !== 0
                    ) {
                        break;
                    }
                    --index;
                }
                return index;
            };
        },
    });

    // node_modules/source-map/lib/quick-sort.js
    var require_quick_sort = __commonJS({
        "node_modules/source-map/lib/quick-sort.js"(exports) {
            function swap(ary, x, y) {
                var temp = ary[x];
                ary[x] = ary[y];
                ary[y] = temp;
            }
            function randomIntInRange(low, high) {
                return Math.round(low + Math.random() * (high - low));
            }
            function doQuickSort(ary, comparator, p, r) {
                if (p < r) {
                    var pivotIndex = randomIntInRange(p, r);
                    var i = p - 1;
                    swap(ary, pivotIndex, r);
                    var pivot = ary[r];
                    for (var j = p; j < r; j++) {
                        if (comparator(ary[j], pivot) <= 0) {
                            i += 1;
                            swap(ary, i, j);
                        }
                    }
                    swap(ary, i + 1, j);
                    var q = i + 1;
                    doQuickSort(ary, comparator, p, q - 1);
                    doQuickSort(ary, comparator, q + 1, r);
                }
            }
            exports.quickSort = function (ary, comparator) {
                doQuickSort(ary, comparator, 0, ary.length - 1);
            };
        },
    });

    // node_modules/source-map/lib/source-map-consumer.js
    var require_source_map_consumer = __commonJS({
        "node_modules/source-map/lib/source-map-consumer.js"(exports) {
            var util = require_util();
            var binarySearch = require_binary_search();
            var ArraySet = require_array_set().ArraySet;
            var base64VLQ = require_base64_vlq();
            var quickSort = require_quick_sort().quickSort;
            function SourceMapConsumer(aSourceMap, aSourceMapURL) {
                var sourceMap = aSourceMap;
                if (typeof aSourceMap === "string") {
                    sourceMap = util.parseSourceMapInput(aSourceMap);
                }
                return sourceMap.sections != null
                    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
                    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
            }
            SourceMapConsumer.fromSourceMap = function (
                aSourceMap,
                aSourceMapURL,
            ) {
                return BasicSourceMapConsumer.fromSourceMap(
                    aSourceMap,
                    aSourceMapURL,
                );
            };
            SourceMapConsumer.prototype._version = 3;
            SourceMapConsumer.prototype.__generatedMappings = null;
            Object.defineProperty(
                SourceMapConsumer.prototype,
                "_generatedMappings",
                {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        if (!this.__generatedMappings) {
                            this._parseMappings(
                                this._mappings,
                                this.sourceRoot,
                            );
                        }
                        return this.__generatedMappings;
                    },
                },
            );
            SourceMapConsumer.prototype.__originalMappings = null;
            Object.defineProperty(
                SourceMapConsumer.prototype,
                "_originalMappings",
                {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        if (!this.__originalMappings) {
                            this._parseMappings(
                                this._mappings,
                                this.sourceRoot,
                            );
                        }
                        return this.__originalMappings;
                    },
                },
            );
            SourceMapConsumer.prototype._charIsMappingSeparator =
                function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
                    var c = aStr.charAt(index);
                    return c === ";" || c === ",";
                };
            SourceMapConsumer.prototype._parseMappings =
                function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                    throw new Error("Subclasses must implement _parseMappings");
                };
            SourceMapConsumer.GENERATED_ORDER = 1;
            SourceMapConsumer.ORIGINAL_ORDER = 2;
            SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
            SourceMapConsumer.LEAST_UPPER_BOUND = 2;
            SourceMapConsumer.prototype.eachMapping =
                function SourceMapConsumer_eachMapping(
                    aCallback,
                    aContext,
                    aOrder,
                ) {
                    var context = aContext || null;
                    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
                    var mappings;
                    switch (order) {
                        case SourceMapConsumer.GENERATED_ORDER:
                            mappings = this._generatedMappings;
                            break;
                        case SourceMapConsumer.ORIGINAL_ORDER:
                            mappings = this._originalMappings;
                            break;
                        default:
                            throw new Error("Unknown order of iteration.");
                    }
                    var sourceRoot = this.sourceRoot;
                    mappings
                        .map(function (mapping) {
                            var source =
                                mapping.source === null
                                    ? null
                                    : this._sources.at(mapping.source);
                            source = util.computeSourceURL(
                                sourceRoot,
                                source,
                                this._sourceMapURL,
                            );
                            return {
                                source,
                                generatedLine: mapping.generatedLine,
                                generatedColumn: mapping.generatedColumn,
                                originalLine: mapping.originalLine,
                                originalColumn: mapping.originalColumn,
                                name:
                                    mapping.name === null
                                        ? null
                                        : this._names.at(mapping.name),
                            };
                        }, this)
                        .forEach(aCallback, context);
                };
            SourceMapConsumer.prototype.allGeneratedPositionsFor =
                function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
                    var line = util.getArg(aArgs, "line");
                    var needle = {
                        source: util.getArg(aArgs, "source"),
                        originalLine: line,
                        originalColumn: util.getArg(aArgs, "column", 0),
                    };
                    needle.source = this._findSourceIndex(needle.source);
                    if (needle.source < 0) {
                        return [];
                    }
                    var mappings = [];
                    var index = this._findMapping(
                        needle,
                        this._originalMappings,
                        "originalLine",
                        "originalColumn",
                        util.compareByOriginalPositions,
                        binarySearch.LEAST_UPPER_BOUND,
                    );
                    if (index >= 0) {
                        var mapping = this._originalMappings[index];
                        if (aArgs.column === void 0) {
                            var originalLine = mapping.originalLine;
                            while (
                                mapping &&
                                mapping.originalLine === originalLine
                            ) {
                                mappings.push({
                                    line: util.getArg(
                                        mapping,
                                        "generatedLine",
                                        null,
                                    ),
                                    column: util.getArg(
                                        mapping,
                                        "generatedColumn",
                                        null,
                                    ),
                                    lastColumn: util.getArg(
                                        mapping,
                                        "lastGeneratedColumn",
                                        null,
                                    ),
                                });
                                mapping = this._originalMappings[++index];
                            }
                        } else {
                            var originalColumn = mapping.originalColumn;
                            while (
                                mapping &&
                                mapping.originalLine === line &&
                                mapping.originalColumn == originalColumn
                            ) {
                                mappings.push({
                                    line: util.getArg(
                                        mapping,
                                        "generatedLine",
                                        null,
                                    ),
                                    column: util.getArg(
                                        mapping,
                                        "generatedColumn",
                                        null,
                                    ),
                                    lastColumn: util.getArg(
                                        mapping,
                                        "lastGeneratedColumn",
                                        null,
                                    ),
                                });
                                mapping = this._originalMappings[++index];
                            }
                        }
                    }
                    return mappings;
                };
            exports.SourceMapConsumer = SourceMapConsumer;
            function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
                var sourceMap = aSourceMap;
                if (typeof aSourceMap === "string") {
                    sourceMap = util.parseSourceMapInput(aSourceMap);
                }
                var version = util.getArg(sourceMap, "version");
                var sources = util.getArg(sourceMap, "sources");
                var names = util.getArg(sourceMap, "names", []);
                var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
                var sourcesContent = util.getArg(
                    sourceMap,
                    "sourcesContent",
                    null,
                );
                var mappings = util.getArg(sourceMap, "mappings");
                var file = util.getArg(sourceMap, "file", null);
                if (version != this._version) {
                    throw new Error("Unsupported version: " + version);
                }
                if (sourceRoot) {
                    sourceRoot = util.normalize(sourceRoot);
                }
                sources = sources
                    .map(String)
                    .map(util.normalize)
                    .map(function (source) {
                        return sourceRoot &&
                            util.isAbsolute(sourceRoot) &&
                            util.isAbsolute(source)
                            ? util.relative(sourceRoot, source)
                            : source;
                    });
                this._names = ArraySet.fromArray(names.map(String), true);
                this._sources = ArraySet.fromArray(sources, true);
                this._absoluteSources = this._sources
                    .toArray()
                    .map(function (s) {
                        return util.computeSourceURL(
                            sourceRoot,
                            s,
                            aSourceMapURL,
                        );
                    });
                this.sourceRoot = sourceRoot;
                this.sourcesContent = sourcesContent;
                this._mappings = mappings;
                this._sourceMapURL = aSourceMapURL;
                this.file = file;
            }
            BasicSourceMapConsumer.prototype = Object.create(
                SourceMapConsumer.prototype,
            );
            BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
            BasicSourceMapConsumer.prototype._findSourceIndex = function (
                aSource,
            ) {
                var relativeSource = aSource;
                if (this.sourceRoot != null) {
                    relativeSource = util.relative(
                        this.sourceRoot,
                        relativeSource,
                    );
                }
                if (this._sources.has(relativeSource)) {
                    return this._sources.indexOf(relativeSource);
                }
                var i;
                for (i = 0; i < this._absoluteSources.length; ++i) {
                    if (this._absoluteSources[i] == aSource) {
                        return i;
                    }
                }
                return -1;
            };
            BasicSourceMapConsumer.fromSourceMap =
                function SourceMapConsumer_fromSourceMap(
                    aSourceMap,
                    aSourceMapURL,
                ) {
                    var smc = Object.create(BasicSourceMapConsumer.prototype);
                    var names = (smc._names = ArraySet.fromArray(
                        aSourceMap._names.toArray(),
                        true,
                    ));
                    var sources = (smc._sources = ArraySet.fromArray(
                        aSourceMap._sources.toArray(),
                        true,
                    ));
                    smc.sourceRoot = aSourceMap._sourceRoot;
                    smc.sourcesContent = aSourceMap._generateSourcesContent(
                        smc._sources.toArray(),
                        smc.sourceRoot,
                    );
                    smc.file = aSourceMap._file;
                    smc._sourceMapURL = aSourceMapURL;
                    smc._absoluteSources = smc._sources
                        .toArray()
                        .map(function (s) {
                            return util.computeSourceURL(
                                smc.sourceRoot,
                                s,
                                aSourceMapURL,
                            );
                        });
                    var generatedMappings = aSourceMap._mappings
                        .toArray()
                        .slice();
                    var destGeneratedMappings = (smc.__generatedMappings = []);
                    var destOriginalMappings = (smc.__originalMappings = []);
                    for (
                        var i = 0, length = generatedMappings.length;
                        i < length;
                        i++
                    ) {
                        var srcMapping = generatedMappings[i];
                        var destMapping = new Mapping();
                        destMapping.generatedLine = srcMapping.generatedLine;
                        destMapping.generatedColumn =
                            srcMapping.generatedColumn;
                        if (srcMapping.source) {
                            destMapping.source = sources.indexOf(
                                srcMapping.source,
                            );
                            destMapping.originalLine = srcMapping.originalLine;
                            destMapping.originalColumn =
                                srcMapping.originalColumn;
                            if (srcMapping.name) {
                                destMapping.name = names.indexOf(
                                    srcMapping.name,
                                );
                            }
                            destOriginalMappings.push(destMapping);
                        }
                        destGeneratedMappings.push(destMapping);
                    }
                    quickSort(
                        smc.__originalMappings,
                        util.compareByOriginalPositions,
                    );
                    return smc;
                };
            BasicSourceMapConsumer.prototype._version = 3;
            Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
                get: function () {
                    return this._absoluteSources.slice();
                },
            });
            function Mapping() {
                this.generatedLine = 0;
                this.generatedColumn = 0;
                this.source = null;
                this.originalLine = null;
                this.originalColumn = null;
                this.name = null;
            }
            BasicSourceMapConsumer.prototype._parseMappings =
                function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                    var generatedLine = 1;
                    var previousGeneratedColumn = 0;
                    var previousOriginalLine = 0;
                    var previousOriginalColumn = 0;
                    var previousSource = 0;
                    var previousName = 0;
                    var length = aStr.length;
                    var index = 0;
                    var cachedSegments = {};
                    var temp = {};
                    var originalMappings = [];
                    var generatedMappings = [];
                    var mapping, str, segment, end, value;
                    while (index < length) {
                        if (aStr.charAt(index) === ";") {
                            generatedLine++;
                            index++;
                            previousGeneratedColumn = 0;
                        } else if (aStr.charAt(index) === ",") {
                            index++;
                        } else {
                            mapping = new Mapping();
                            mapping.generatedLine = generatedLine;
                            for (end = index; end < length; end++) {
                                if (this._charIsMappingSeparator(aStr, end)) {
                                    break;
                                }
                            }
                            str = aStr.slice(index, end);
                            segment = cachedSegments[str];
                            if (segment) {
                                index += str.length;
                            } else {
                                segment = [];
                                while (index < end) {
                                    base64VLQ.decode(aStr, index, temp);
                                    value = temp.value;
                                    index = temp.rest;
                                    segment.push(value);
                                }
                                if (segment.length === 2) {
                                    throw new Error(
                                        "Found a source, but no line and column",
                                    );
                                }
                                if (segment.length === 3) {
                                    throw new Error(
                                        "Found a source and line, but no column",
                                    );
                                }
                                cachedSegments[str] = segment;
                            }
                            mapping.generatedColumn =
                                previousGeneratedColumn + segment[0];
                            previousGeneratedColumn = mapping.generatedColumn;
                            if (segment.length > 1) {
                                mapping.source = previousSource + segment[1];
                                previousSource += segment[1];
                                mapping.originalLine =
                                    previousOriginalLine + segment[2];
                                previousOriginalLine = mapping.originalLine;
                                mapping.originalLine += 1;
                                mapping.originalColumn =
                                    previousOriginalColumn + segment[3];
                                previousOriginalColumn = mapping.originalColumn;
                                if (segment.length > 4) {
                                    mapping.name = previousName + segment[4];
                                    previousName += segment[4];
                                }
                            }
                            generatedMappings.push(mapping);
                            if (typeof mapping.originalLine === "number") {
                                originalMappings.push(mapping);
                            }
                        }
                    }
                    quickSort(
                        generatedMappings,
                        util.compareByGeneratedPositionsDeflated,
                    );
                    this.__generatedMappings = generatedMappings;
                    quickSort(
                        originalMappings,
                        util.compareByOriginalPositions,
                    );
                    this.__originalMappings = originalMappings;
                };
            BasicSourceMapConsumer.prototype._findMapping =
                function SourceMapConsumer_findMapping(
                    aNeedle,
                    aMappings,
                    aLineName,
                    aColumnName,
                    aComparator,
                    aBias,
                ) {
                    if (aNeedle[aLineName] <= 0) {
                        throw new TypeError(
                            "Line must be greater than or equal to 1, got " +
                                aNeedle[aLineName],
                        );
                    }
                    if (aNeedle[aColumnName] < 0) {
                        throw new TypeError(
                            "Column must be greater than or equal to 0, got " +
                                aNeedle[aColumnName],
                        );
                    }
                    return binarySearch.search(
                        aNeedle,
                        aMappings,
                        aComparator,
                        aBias,
                    );
                };
            BasicSourceMapConsumer.prototype.computeColumnSpans =
                function SourceMapConsumer_computeColumnSpans() {
                    for (
                        var index = 0;
                        index < this._generatedMappings.length;
                        ++index
                    ) {
                        var mapping = this._generatedMappings[index];
                        if (index + 1 < this._generatedMappings.length) {
                            var nextMapping =
                                this._generatedMappings[index + 1];
                            if (
                                mapping.generatedLine ===
                                nextMapping.generatedLine
                            ) {
                                mapping.lastGeneratedColumn =
                                    nextMapping.generatedColumn - 1;
                                continue;
                            }
                        }
                        mapping.lastGeneratedColumn = Infinity;
                    }
                };
            BasicSourceMapConsumer.prototype.originalPositionFor =
                function SourceMapConsumer_originalPositionFor(aArgs) {
                    var needle = {
                        generatedLine: util.getArg(aArgs, "line"),
                        generatedColumn: util.getArg(aArgs, "column"),
                    };
                    var index = this._findMapping(
                        needle,
                        this._generatedMappings,
                        "generatedLine",
                        "generatedColumn",
                        util.compareByGeneratedPositionsDeflated,
                        util.getArg(
                            aArgs,
                            "bias",
                            SourceMapConsumer.GREATEST_LOWER_BOUND,
                        ),
                    );
                    if (index >= 0) {
                        var mapping = this._generatedMappings[index];
                        if (mapping.generatedLine === needle.generatedLine) {
                            var source = util.getArg(mapping, "source", null);
                            if (source !== null) {
                                source = this._sources.at(source);
                                source = util.computeSourceURL(
                                    this.sourceRoot,
                                    source,
                                    this._sourceMapURL,
                                );
                            }
                            var name = util.getArg(mapping, "name", null);
                            if (name !== null) {
                                name = this._names.at(name);
                            }
                            return {
                                source,
                                line: util.getArg(
                                    mapping,
                                    "originalLine",
                                    null,
                                ),
                                column: util.getArg(
                                    mapping,
                                    "originalColumn",
                                    null,
                                ),
                                name,
                            };
                        }
                    }
                    return {
                        source: null,
                        line: null,
                        column: null,
                        name: null,
                    };
                };
            BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
                function BasicSourceMapConsumer_hasContentsOfAllSources() {
                    if (!this.sourcesContent) {
                        return false;
                    }
                    return (
                        this.sourcesContent.length >= this._sources.size() &&
                        !this.sourcesContent.some(function (sc) {
                            return sc == null;
                        })
                    );
                };
            BasicSourceMapConsumer.prototype.sourceContentFor =
                function SourceMapConsumer_sourceContentFor(
                    aSource,
                    nullOnMissing,
                ) {
                    if (!this.sourcesContent) {
                        return null;
                    }
                    var index = this._findSourceIndex(aSource);
                    if (index >= 0) {
                        return this.sourcesContent[index];
                    }
                    var relativeSource = aSource;
                    if (this.sourceRoot != null) {
                        relativeSource = util.relative(
                            this.sourceRoot,
                            relativeSource,
                        );
                    }
                    var url;
                    if (
                        this.sourceRoot != null &&
                        (url = util.urlParse(this.sourceRoot))
                    ) {
                        var fileUriAbsPath = relativeSource.replace(
                            /^file:\/\//,
                            "",
                        );
                        if (
                            url.scheme == "file" &&
                            this._sources.has(fileUriAbsPath)
                        ) {
                            return this.sourcesContent[
                                this._sources.indexOf(fileUriAbsPath)
                            ];
                        }
                        if (
                            (!url.path || url.path == "/") &&
                            this._sources.has("/" + relativeSource)
                        ) {
                            return this.sourcesContent[
                                this._sources.indexOf("/" + relativeSource)
                            ];
                        }
                    }
                    if (nullOnMissing) {
                        return null;
                    } else {
                        throw new Error(
                            '"' + relativeSource + '" is not in the SourceMap.',
                        );
                    }
                };
            BasicSourceMapConsumer.prototype.generatedPositionFor =
                function SourceMapConsumer_generatedPositionFor(aArgs) {
                    var source = util.getArg(aArgs, "source");
                    source = this._findSourceIndex(source);
                    if (source < 0) {
                        return {
                            line: null,
                            column: null,
                            lastColumn: null,
                        };
                    }
                    var needle = {
                        source,
                        originalLine: util.getArg(aArgs, "line"),
                        originalColumn: util.getArg(aArgs, "column"),
                    };
                    var index = this._findMapping(
                        needle,
                        this._originalMappings,
                        "originalLine",
                        "originalColumn",
                        util.compareByOriginalPositions,
                        util.getArg(
                            aArgs,
                            "bias",
                            SourceMapConsumer.GREATEST_LOWER_BOUND,
                        ),
                    );
                    if (index >= 0) {
                        var mapping = this._originalMappings[index];
                        if (mapping.source === needle.source) {
                            return {
                                line: util.getArg(
                                    mapping,
                                    "generatedLine",
                                    null,
                                ),
                                column: util.getArg(
                                    mapping,
                                    "generatedColumn",
                                    null,
                                ),
                                lastColumn: util.getArg(
                                    mapping,
                                    "lastGeneratedColumn",
                                    null,
                                ),
                            };
                        }
                    }
                    return {
                        line: null,
                        column: null,
                        lastColumn: null,
                    };
                };
            exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
            function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
                var sourceMap = aSourceMap;
                if (typeof aSourceMap === "string") {
                    sourceMap = util.parseSourceMapInput(aSourceMap);
                }
                var version = util.getArg(sourceMap, "version");
                var sections = util.getArg(sourceMap, "sections");
                if (version != this._version) {
                    throw new Error("Unsupported version: " + version);
                }
                this._sources = new ArraySet();
                this._names = new ArraySet();
                var lastOffset = {
                    line: -1,
                    column: 0,
                };
                this._sections = sections.map(function (s) {
                    if (s.url) {
                        throw new Error(
                            "Support for url field in sections not implemented.",
                        );
                    }
                    var offset = util.getArg(s, "offset");
                    var offsetLine = util.getArg(offset, "line");
                    var offsetColumn = util.getArg(offset, "column");
                    if (
                        offsetLine < lastOffset.line ||
                        (offsetLine === lastOffset.line &&
                            offsetColumn < lastOffset.column)
                    ) {
                        throw new Error(
                            "Section offsets must be ordered and non-overlapping.",
                        );
                    }
                    lastOffset = offset;
                    return {
                        generatedOffset: {
                            // The offset fields are 0-based, but we use 1-based indices when
                            // encoding/decoding from VLQ.
                            generatedLine: offsetLine + 1,
                            generatedColumn: offsetColumn + 1,
                        },
                        consumer: new SourceMapConsumer(
                            util.getArg(s, "map"),
                            aSourceMapURL,
                        ),
                    };
                });
            }
            IndexedSourceMapConsumer.prototype = Object.create(
                SourceMapConsumer.prototype,
            );
            IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
            IndexedSourceMapConsumer.prototype._version = 3;
            Object.defineProperty(
                IndexedSourceMapConsumer.prototype,
                "sources",
                {
                    get: function () {
                        var sources = [];
                        for (var i = 0; i < this._sections.length; i++) {
                            for (
                                var j = 0;
                                j < this._sections[i].consumer.sources.length;
                                j++
                            ) {
                                sources.push(
                                    this._sections[i].consumer.sources[j],
                                );
                            }
                        }
                        return sources;
                    },
                },
            );
            IndexedSourceMapConsumer.prototype.originalPositionFor =
                function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
                    var needle = {
                        generatedLine: util.getArg(aArgs, "line"),
                        generatedColumn: util.getArg(aArgs, "column"),
                    };
                    var sectionIndex = binarySearch.search(
                        needle,
                        this._sections,
                        function (needle2, section2) {
                            var cmp =
                                needle2.generatedLine -
                                section2.generatedOffset.generatedLine;
                            if (cmp) {
                                return cmp;
                            }
                            return (
                                needle2.generatedColumn -
                                section2.generatedOffset.generatedColumn
                            );
                        },
                    );
                    var section = this._sections[sectionIndex];
                    if (!section) {
                        return {
                            source: null,
                            line: null,
                            column: null,
                            name: null,
                        };
                    }
                    return section.consumer.originalPositionFor({
                        line:
                            needle.generatedLine -
                            (section.generatedOffset.generatedLine - 1),
                        column:
                            needle.generatedColumn -
                            (section.generatedOffset.generatedLine ===
                            needle.generatedLine
                                ? section.generatedOffset.generatedColumn - 1
                                : 0),
                        bias: aArgs.bias,
                    });
                };
            IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
                function IndexedSourceMapConsumer_hasContentsOfAllSources() {
                    return this._sections.every(function (s) {
                        return s.consumer.hasContentsOfAllSources();
                    });
                };
            IndexedSourceMapConsumer.prototype.sourceContentFor =
                function IndexedSourceMapConsumer_sourceContentFor(
                    aSource,
                    nullOnMissing,
                ) {
                    for (var i = 0; i < this._sections.length; i++) {
                        var section = this._sections[i];
                        var content = section.consumer.sourceContentFor(
                            aSource,
                            true,
                        );
                        if (content) {
                            return content;
                        }
                    }
                    if (nullOnMissing) {
                        return null;
                    } else {
                        throw new Error(
                            '"' + aSource + '" is not in the SourceMap.',
                        );
                    }
                };
            IndexedSourceMapConsumer.prototype.generatedPositionFor =
                function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
                    for (var i = 0; i < this._sections.length; i++) {
                        var section = this._sections[i];
                        if (
                            section.consumer._findSourceIndex(
                                util.getArg(aArgs, "source"),
                            ) === -1
                        ) {
                            continue;
                        }
                        var generatedPosition =
                            section.consumer.generatedPositionFor(aArgs);
                        if (generatedPosition) {
                            var ret = {
                                line:
                                    generatedPosition.line +
                                    (section.generatedOffset.generatedLine - 1),
                                column:
                                    generatedPosition.column +
                                    (section.generatedOffset.generatedLine ===
                                    generatedPosition.line
                                        ? section.generatedOffset
                                              .generatedColumn - 1
                                        : 0),
                            };
                            return ret;
                        }
                    }
                    return {
                        line: null,
                        column: null,
                    };
                };
            IndexedSourceMapConsumer.prototype._parseMappings =
                function IndexedSourceMapConsumer_parseMappings(
                    aStr,
                    aSourceRoot,
                ) {
                    this.__generatedMappings = [];
                    this.__originalMappings = [];
                    for (var i = 0; i < this._sections.length; i++) {
                        var section = this._sections[i];
                        var sectionMappings =
                            section.consumer._generatedMappings;
                        for (var j = 0; j < sectionMappings.length; j++) {
                            var mapping = sectionMappings[j];
                            var source = section.consumer._sources.at(
                                mapping.source,
                            );
                            source = util.computeSourceURL(
                                section.consumer.sourceRoot,
                                source,
                                this._sourceMapURL,
                            );
                            this._sources.add(source);
                            source = this._sources.indexOf(source);
                            var name = null;
                            if (mapping.name) {
                                name = section.consumer._names.at(mapping.name);
                                this._names.add(name);
                                name = this._names.indexOf(name);
                            }
                            var adjustedMapping = {
                                source,
                                generatedLine:
                                    mapping.generatedLine +
                                    (section.generatedOffset.generatedLine - 1),
                                generatedColumn:
                                    mapping.generatedColumn +
                                    (section.generatedOffset.generatedLine ===
                                    mapping.generatedLine
                                        ? section.generatedOffset
                                              .generatedColumn - 1
                                        : 0),
                                originalLine: mapping.originalLine,
                                originalColumn: mapping.originalColumn,
                                name,
                            };
                            this.__generatedMappings.push(adjustedMapping);
                            if (
                                typeof adjustedMapping.originalLine === "number"
                            ) {
                                this.__originalMappings.push(adjustedMapping);
                            }
                        }
                    }
                    quickSort(
                        this.__generatedMappings,
                        util.compareByGeneratedPositionsDeflated,
                    );
                    quickSort(
                        this.__originalMappings,
                        util.compareByOriginalPositions,
                    );
                };
            exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
        },
    });

    // node_modules/source-map/lib/source-node.js
    var require_source_node = __commonJS({
        "node_modules/source-map/lib/source-node.js"(exports) {
            var SourceMapGenerator =
                require_source_map_generator().SourceMapGenerator;
            var util = require_util();
            var REGEX_NEWLINE = /(\r?\n)/;
            var NEWLINE_CODE = 10;
            var isSourceNode = "$$$isSourceNode$$$";
            function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
                this.children = [];
                this.sourceContents = {};
                this.line = aLine == null ? null : aLine;
                this.column = aColumn == null ? null : aColumn;
                this.source = aSource == null ? null : aSource;
                this.name = aName == null ? null : aName;
                this[isSourceNode] = true;
                if (aChunks != null) this.add(aChunks);
            }
            SourceNode.fromStringWithSourceMap =
                function SourceNode_fromStringWithSourceMap(
                    aGeneratedCode,
                    aSourceMapConsumer,
                    aRelativePath,
                ) {
                    var node = new SourceNode();
                    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
                    var remainingLinesIndex = 0;
                    var shiftNextLine = function () {
                        var lineContents = getNextLine();
                        var newLine = getNextLine() || "";
                        return lineContents + newLine;
                        function getNextLine() {
                            return remainingLinesIndex < remainingLines.length
                                ? remainingLines[remainingLinesIndex++]
                                : void 0;
                        }
                    };
                    var lastGeneratedLine = 1,
                        lastGeneratedColumn = 0;
                    var lastMapping = null;
                    aSourceMapConsumer.eachMapping(function (mapping) {
                        if (lastMapping !== null) {
                            if (lastGeneratedLine < mapping.generatedLine) {
                                addMappingWithCode(
                                    lastMapping,
                                    shiftNextLine(),
                                );
                                lastGeneratedLine++;
                                lastGeneratedColumn = 0;
                            } else {
                                var nextLine =
                                    remainingLines[remainingLinesIndex] || "";
                                var code = nextLine.substr(
                                    0,
                                    mapping.generatedColumn -
                                        lastGeneratedColumn,
                                );
                                remainingLines[remainingLinesIndex] =
                                    nextLine.substr(
                                        mapping.generatedColumn -
                                            lastGeneratedColumn,
                                    );
                                lastGeneratedColumn = mapping.generatedColumn;
                                addMappingWithCode(lastMapping, code);
                                lastMapping = mapping;
                                return;
                            }
                        }
                        while (lastGeneratedLine < mapping.generatedLine) {
                            node.add(shiftNextLine());
                            lastGeneratedLine++;
                        }
                        if (lastGeneratedColumn < mapping.generatedColumn) {
                            var nextLine =
                                remainingLines[remainingLinesIndex] || "";
                            node.add(
                                nextLine.substr(0, mapping.generatedColumn),
                            );
                            remainingLines[remainingLinesIndex] =
                                nextLine.substr(mapping.generatedColumn);
                            lastGeneratedColumn = mapping.generatedColumn;
                        }
                        lastMapping = mapping;
                    }, this);
                    if (remainingLinesIndex < remainingLines.length) {
                        if (lastMapping) {
                            addMappingWithCode(lastMapping, shiftNextLine());
                        }
                        node.add(
                            remainingLines.splice(remainingLinesIndex).join(""),
                        );
                    }
                    aSourceMapConsumer.sources.forEach(function (sourceFile) {
                        var content =
                            aSourceMapConsumer.sourceContentFor(sourceFile);
                        if (content != null) {
                            if (aRelativePath != null) {
                                sourceFile = util.join(
                                    aRelativePath,
                                    sourceFile,
                                );
                            }
                            node.setSourceContent(sourceFile, content);
                        }
                    });
                    return node;
                    function addMappingWithCode(mapping, code) {
                        if (mapping === null || mapping.source === void 0) {
                            node.add(code);
                        } else {
                            var source = aRelativePath
                                ? util.join(aRelativePath, mapping.source)
                                : mapping.source;
                            node.add(
                                new SourceNode(
                                    mapping.originalLine,
                                    mapping.originalColumn,
                                    source,
                                    code,
                                    mapping.name,
                                ),
                            );
                        }
                    }
                };
            SourceNode.prototype.add = function SourceNode_add(aChunk) {
                if (Array.isArray(aChunk)) {
                    aChunk.forEach(function (chunk) {
                        this.add(chunk);
                    }, this);
                } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
                    if (aChunk) {
                        this.children.push(aChunk);
                    }
                } else {
                    throw new TypeError(
                        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
                            aChunk,
                    );
                }
                return this;
            };
            SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
                if (Array.isArray(aChunk)) {
                    for (var i = aChunk.length - 1; i >= 0; i--) {
                        this.prepend(aChunk[i]);
                    }
                } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
                    this.children.unshift(aChunk);
                } else {
                    throw new TypeError(
                        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
                            aChunk,
                    );
                }
                return this;
            };
            SourceNode.prototype.walk = function SourceNode_walk(aFn) {
                var chunk;
                for (var i = 0, len = this.children.length; i < len; i++) {
                    chunk = this.children[i];
                    if (chunk[isSourceNode]) {
                        chunk.walk(aFn);
                    } else {
                        if (chunk !== "") {
                            aFn(chunk, {
                                source: this.source,
                                line: this.line,
                                column: this.column,
                                name: this.name,
                            });
                        }
                    }
                }
            };
            SourceNode.prototype.join = function SourceNode_join(aSep) {
                var newChildren;
                var i;
                var len = this.children.length;
                if (len > 0) {
                    newChildren = [];
                    for (i = 0; i < len - 1; i++) {
                        newChildren.push(this.children[i]);
                        newChildren.push(aSep);
                    }
                    newChildren.push(this.children[i]);
                    this.children = newChildren;
                }
                return this;
            };
            SourceNode.prototype.replaceRight =
                function SourceNode_replaceRight(aPattern, aReplacement) {
                    var lastChild = this.children[this.children.length - 1];
                    if (lastChild[isSourceNode]) {
                        lastChild.replaceRight(aPattern, aReplacement);
                    } else if (typeof lastChild === "string") {
                        this.children[this.children.length - 1] =
                            lastChild.replace(aPattern, aReplacement);
                    } else {
                        this.children.push("".replace(aPattern, aReplacement));
                    }
                    return this;
                };
            SourceNode.prototype.setSourceContent =
                function SourceNode_setSourceContent(
                    aSourceFile,
                    aSourceContent,
                ) {
                    this.sourceContents[util.toSetString(aSourceFile)] =
                        aSourceContent;
                };
            SourceNode.prototype.walkSourceContents =
                function SourceNode_walkSourceContents(aFn) {
                    for (var i = 0, len = this.children.length; i < len; i++) {
                        if (this.children[i][isSourceNode]) {
                            this.children[i].walkSourceContents(aFn);
                        }
                    }
                    var sources = Object.keys(this.sourceContents);
                    for (var i = 0, len = sources.length; i < len; i++) {
                        aFn(
                            util.fromSetString(sources[i]),
                            this.sourceContents[sources[i]],
                        );
                    }
                };
            SourceNode.prototype.toString = function SourceNode_toString() {
                var str = "";
                this.walk(function (chunk) {
                    str += chunk;
                });
                return str;
            };
            SourceNode.prototype.toStringWithSourceMap =
                function SourceNode_toStringWithSourceMap(aArgs) {
                    var generated = {
                        code: "",
                        line: 1,
                        column: 0,
                    };
                    var map = new SourceMapGenerator(aArgs);
                    var sourceMappingActive = false;
                    var lastOriginalSource = null;
                    var lastOriginalLine = null;
                    var lastOriginalColumn = null;
                    var lastOriginalName = null;
                    this.walk(function (chunk, original) {
                        generated.code += chunk;
                        if (
                            original.source !== null &&
                            original.line !== null &&
                            original.column !== null
                        ) {
                            if (
                                lastOriginalSource !== original.source ||
                                lastOriginalLine !== original.line ||
                                lastOriginalColumn !== original.column ||
                                lastOriginalName !== original.name
                            ) {
                                map.addMapping({
                                    source: original.source,
                                    original: {
                                        line: original.line,
                                        column: original.column,
                                    },
                                    generated: {
                                        line: generated.line,
                                        column: generated.column,
                                    },
                                    name: original.name,
                                });
                            }
                            lastOriginalSource = original.source;
                            lastOriginalLine = original.line;
                            lastOriginalColumn = original.column;
                            lastOriginalName = original.name;
                            sourceMappingActive = true;
                        } else if (sourceMappingActive) {
                            map.addMapping({
                                generated: {
                                    line: generated.line,
                                    column: generated.column,
                                },
                            });
                            lastOriginalSource = null;
                            sourceMappingActive = false;
                        }
                        for (
                            var idx = 0, length = chunk.length;
                            idx < length;
                            idx++
                        ) {
                            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
                                generated.line++;
                                generated.column = 0;
                                if (idx + 1 === length) {
                                    lastOriginalSource = null;
                                    sourceMappingActive = false;
                                } else if (sourceMappingActive) {
                                    map.addMapping({
                                        source: original.source,
                                        original: {
                                            line: original.line,
                                            column: original.column,
                                        },
                                        generated: {
                                            line: generated.line,
                                            column: generated.column,
                                        },
                                        name: original.name,
                                    });
                                }
                            } else {
                                generated.column++;
                            }
                        }
                    });
                    this.walkSourceContents(
                        function (sourceFile, sourceContent) {
                            map.setSourceContent(sourceFile, sourceContent);
                        },
                    );
                    return { code: generated.code, map };
                };
            exports.SourceNode = SourceNode;
        },
    });

    // node_modules/source-map/source-map.js
    var require_source_map = __commonJS({
        "node_modules/source-map/source-map.js"(exports) {
            exports.SourceMapGenerator =
                require_source_map_generator().SourceMapGenerator;
            exports.SourceMapConsumer =
                require_source_map_consumer().SourceMapConsumer;
            exports.SourceNode = require_source_node().SourceNode;
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/code-gen.js
    var require_code_gen = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/code-gen.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            var _utils = require_utils();
            var SourceNode = void 0;
            try {
                if (typeof define !== "function" || !define.amd) {
                    SourceMap = require_source_map();
                    SourceNode = SourceMap.SourceNode;
                }
            } catch (err) {}
            var SourceMap;
            if (!SourceNode) {
                SourceNode = function (line, column, srcFile, chunks) {
                    this.src = "";
                    if (chunks) {
                        this.add(chunks);
                    }
                };
                SourceNode.prototype = {
                    add: function add(chunks) {
                        if (_utils.isArray(chunks)) {
                            chunks = chunks.join("");
                        }
                        this.src += chunks;
                    },
                    prepend: function prepend(chunks) {
                        if (_utils.isArray(chunks)) {
                            chunks = chunks.join("");
                        }
                        this.src = chunks + this.src;
                    },
                    toStringWithSourceMap: function toStringWithSourceMap() {
                        return { code: this.toString() };
                    },
                    toString: function toString() {
                        return this.src;
                    },
                };
            }
            function castChunk(chunk, codeGen, loc) {
                if (_utils.isArray(chunk)) {
                    var ret = [];
                    for (var i = 0, len = chunk.length; i < len; i++) {
                        ret.push(codeGen.wrap(chunk[i], loc));
                    }
                    return ret;
                } else if (
                    typeof chunk === "boolean" ||
                    typeof chunk === "number"
                ) {
                    return chunk + "";
                }
                return chunk;
            }
            function CodeGen(srcFile) {
                this.srcFile = srcFile;
                this.source = [];
            }
            CodeGen.prototype = {
                isEmpty: function isEmpty() {
                    return !this.source.length;
                },
                prepend: function prepend(source, loc) {
                    this.source.unshift(this.wrap(source, loc));
                },
                push: function push(source, loc) {
                    this.source.push(this.wrap(source, loc));
                },
                merge: function merge() {
                    var source = this.empty();
                    this.each(function (line) {
                        source.add(["  ", line, "\n"]);
                    });
                    return source;
                },
                each: function each(iter) {
                    for (var i = 0, len = this.source.length; i < len; i++) {
                        iter(this.source[i]);
                    }
                },
                empty: function empty() {
                    var loc = this.currentLocation || { start: {} };
                    return new SourceNode(
                        loc.start.line,
                        loc.start.column,
                        this.srcFile,
                    );
                },
                wrap: function wrap(chunk) {
                    var loc =
                        arguments.length <= 1 || arguments[1] === void 0
                            ? this.currentLocation || { start: {} }
                            : arguments[1];
                    if (chunk instanceof SourceNode) {
                        return chunk;
                    }
                    chunk = castChunk(chunk, this, loc);
                    return new SourceNode(
                        loc.start.line,
                        loc.start.column,
                        this.srcFile,
                        chunk,
                    );
                },
                functionCall: function functionCall(fn, type, params) {
                    params = this.generateList(params);
                    return this.wrap([
                        fn,
                        type ? "." + type + "(" : "(",
                        params,
                        ")",
                    ]);
                },
                quotedString: function quotedString(str) {
                    return (
                        '"' +
                        (str + "")
                            .replace(/\\/g, "\\\\")
                            .replace(/"/g, '\\"')
                            .replace(/\n/g, "\\n")
                            .replace(/\r/g, "\\r")
                            .replace(/\u2028/g, "\\u2028")
                            .replace(/\u2029/g, "\\u2029") +
                        '"'
                    );
                },
                objectLiteral: function objectLiteral(obj) {
                    var _this = this;
                    var pairs = [];
                    Object.keys(obj).forEach(function (key) {
                        var value = castChunk(obj[key], _this);
                        if (value !== "undefined") {
                            pairs.push([_this.quotedString(key), ":", value]);
                        }
                    });
                    var ret = this.generateList(pairs);
                    ret.prepend("{");
                    ret.add("}");
                    return ret;
                },
                generateList: function generateList(entries) {
                    var ret = this.empty();
                    for (var i = 0, len = entries.length; i < len; i++) {
                        if (i) {
                            ret.add(",");
                        }
                        ret.add(castChunk(entries[i], this));
                    }
                    return ret;
                },
                generateArray: function generateArray(entries) {
                    var ret = this.generateList(entries);
                    ret.prepend("[");
                    ret.add("]");
                    return ret;
                },
            };
            exports["default"] = CodeGen;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js
    var require_javascript_compiler = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js"(
            exports,
            module2,
        ) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _base = require_base();
            var _exception = require_exception();
            var _exception2 = _interopRequireDefault(_exception);
            var _utils = require_utils();
            var _codeGen = require_code_gen();
            var _codeGen2 = _interopRequireDefault(_codeGen);
            function Literal(value) {
                this.value = value;
            }
            function JavaScriptCompiler() {}
            JavaScriptCompiler.prototype = {
                // PUBLIC API: You can override these methods in a subclass to provide
                // alternative compiled forms for name lookup and buffering semantics
                nameLookup: function nameLookup(parent, name) {
                    return this.internalNameLookup(parent, name);
                },
                depthedLookup: function depthedLookup(name) {
                    return [
                        this.aliasable("container.lookup"),
                        "(depths, ",
                        JSON.stringify(name),
                        ")",
                    ];
                },
                compilerInfo: function compilerInfo() {
                    var revision = _base.COMPILER_REVISION,
                        versions = _base.REVISION_CHANGES[revision];
                    return [revision, versions];
                },
                appendToBuffer: function appendToBuffer(
                    source,
                    location,
                    explicit,
                ) {
                    if (!_utils.isArray(source)) {
                        source = [source];
                    }
                    source = this.source.wrap(source, location);
                    if (this.environment.isSimple) {
                        return ["return ", source, ";"];
                    } else if (explicit) {
                        return ["buffer += ", source, ";"];
                    } else {
                        source.appendToBuffer = true;
                        return source;
                    }
                },
                initializeBuffer: function initializeBuffer() {
                    return this.quotedString("");
                },
                // END PUBLIC API
                internalNameLookup: function internalNameLookup(parent, name) {
                    this.lookupPropertyFunctionIsUsed = true;
                    return [
                        "lookupProperty(",
                        parent,
                        ",",
                        JSON.stringify(name),
                        ")",
                    ];
                },
                lookupPropertyFunctionIsUsed: false,
                compile: function compile(
                    environment,
                    options,
                    context,
                    asObject,
                ) {
                    this.environment = environment;
                    this.options = options;
                    this.stringParams = this.options.stringParams;
                    this.trackIds = this.options.trackIds;
                    this.precompile = !asObject;
                    this.name = this.environment.name;
                    this.isChild = !!context;
                    this.context = context || {
                        decorators: [],
                        programs: [],
                        environments: [],
                    };
                    this.preamble();
                    this.stackSlot = 0;
                    this.stackVars = [];
                    this.aliases = {};
                    this.registers = { list: [] };
                    this.hashes = [];
                    this.compileStack = [];
                    this.inlineStack = [];
                    this.blockParams = [];
                    this.compileChildren(environment, options);
                    this.useDepths =
                        this.useDepths ||
                        environment.useDepths ||
                        environment.useDecorators ||
                        this.options.compat;
                    this.useBlockParams =
                        this.useBlockParams || environment.useBlockParams;
                    var opcodes = environment.opcodes,
                        opcode = void 0,
                        firstLoc = void 0,
                        i = void 0,
                        l = void 0;
                    for (i = 0, l = opcodes.length; i < l; i++) {
                        opcode = opcodes[i];
                        this.source.currentLocation = opcode.loc;
                        firstLoc = firstLoc || opcode.loc;
                        this[opcode.opcode].apply(this, opcode.args);
                    }
                    this.source.currentLocation = firstLoc;
                    this.pushSource("");
                    if (
                        this.stackSlot ||
                        this.inlineStack.length ||
                        this.compileStack.length
                    ) {
                        throw new _exception2["default"](
                            "Compile completed with content left on stack",
                        );
                    }
                    if (!this.decorators.isEmpty()) {
                        this.useDecorators = true;
                        this.decorators.prepend([
                            "var decorators = container.decorators, ",
                            this.lookupPropertyFunctionVarDeclaration(),
                            ";\n",
                        ]);
                        this.decorators.push("return fn;");
                        if (asObject) {
                            this.decorators = Function.apply(this, [
                                "fn",
                                "props",
                                "container",
                                "depth0",
                                "data",
                                "blockParams",
                                "depths",
                                this.decorators.merge(),
                            ]);
                        } else {
                            this.decorators.prepend(
                                "function(fn, props, container, depth0, data, blockParams, depths) {\n",
                            );
                            this.decorators.push("}\n");
                            this.decorators = this.decorators.merge();
                        }
                    } else {
                        this.decorators = void 0;
                    }
                    var fn = this.createFunctionContext(asObject);
                    if (!this.isChild) {
                        var ret = {
                            compiler: this.compilerInfo(),
                            main: fn,
                        };
                        if (this.decorators) {
                            ret.main_d = this.decorators;
                            ret.useDecorators = true;
                        }
                        var _context = this.context;
                        var programs = _context.programs;
                        var decorators = _context.decorators;
                        for (i = 0, l = programs.length; i < l; i++) {
                            if (programs[i]) {
                                ret[i] = programs[i];
                                if (decorators[i]) {
                                    ret[i + "_d"] = decorators[i];
                                    ret.useDecorators = true;
                                }
                            }
                        }
                        if (this.environment.usePartial) {
                            ret.usePartial = true;
                        }
                        if (this.options.data) {
                            ret.useData = true;
                        }
                        if (this.useDepths) {
                            ret.useDepths = true;
                        }
                        if (this.useBlockParams) {
                            ret.useBlockParams = true;
                        }
                        if (this.options.compat) {
                            ret.compat = true;
                        }
                        if (!asObject) {
                            ret.compiler = JSON.stringify(ret.compiler);
                            this.source.currentLocation = {
                                start: { line: 1, column: 0 },
                            };
                            ret = this.objectLiteral(ret);
                            if (options.srcName) {
                                ret = ret.toStringWithSourceMap({
                                    file: options.destName,
                                });
                                ret.map = ret.map && ret.map.toString();
                            } else {
                                ret = ret.toString();
                            }
                        } else {
                            ret.compilerOptions = this.options;
                        }
                        return ret;
                    } else {
                        return fn;
                    }
                },
                preamble: function preamble() {
                    this.lastContext = 0;
                    this.source = new _codeGen2["default"](
                        this.options.srcName,
                    );
                    this.decorators = new _codeGen2["default"](
                        this.options.srcName,
                    );
                },
                createFunctionContext: function createFunctionContext(
                    asObject,
                ) {
                    var _this = this;
                    var varDeclarations = "";
                    var locals = this.stackVars.concat(this.registers.list);
                    if (locals.length > 0) {
                        varDeclarations += ", " + locals.join(", ");
                    }
                    var aliasCount = 0;
                    Object.keys(this.aliases).forEach(function (alias) {
                        var node = _this.aliases[alias];
                        if (node.children && node.referenceCount > 1) {
                            varDeclarations +=
                                ", alias" + ++aliasCount + "=" + alias;
                            node.children[0] = "alias" + aliasCount;
                        }
                    });
                    if (this.lookupPropertyFunctionIsUsed) {
                        varDeclarations +=
                            ", " + this.lookupPropertyFunctionVarDeclaration();
                    }
                    var params = [
                        "container",
                        "depth0",
                        "helpers",
                        "partials",
                        "data",
                    ];
                    if (this.useBlockParams || this.useDepths) {
                        params.push("blockParams");
                    }
                    if (this.useDepths) {
                        params.push("depths");
                    }
                    var source = this.mergeSource(varDeclarations);
                    if (asObject) {
                        params.push(source);
                        return Function.apply(this, params);
                    } else {
                        return this.source.wrap([
                            "function(",
                            params.join(","),
                            ") {\n  ",
                            source,
                            "}",
                        ]);
                    }
                },
                mergeSource: function mergeSource(varDeclarations) {
                    var isSimple = this.environment.isSimple,
                        appendOnly = !this.forceBuffer,
                        appendFirst = void 0,
                        sourceSeen = void 0,
                        bufferStart = void 0,
                        bufferEnd = void 0;
                    this.source.each(function (line) {
                        if (line.appendToBuffer) {
                            if (bufferStart) {
                                line.prepend("  + ");
                            } else {
                                bufferStart = line;
                            }
                            bufferEnd = line;
                        } else {
                            if (bufferStart) {
                                if (!sourceSeen) {
                                    appendFirst = true;
                                } else {
                                    bufferStart.prepend("buffer += ");
                                }
                                bufferEnd.add(";");
                                bufferStart = bufferEnd = void 0;
                            }
                            sourceSeen = true;
                            if (!isSimple) {
                                appendOnly = false;
                            }
                        }
                    });
                    if (appendOnly) {
                        if (bufferStart) {
                            bufferStart.prepend("return ");
                            bufferEnd.add(";");
                        } else if (!sourceSeen) {
                            this.source.push('return "";');
                        }
                    } else {
                        varDeclarations +=
                            ", buffer = " +
                            (appendFirst ? "" : this.initializeBuffer());
                        if (bufferStart) {
                            bufferStart.prepend("return buffer + ");
                            bufferEnd.add(";");
                        } else {
                            this.source.push("return buffer;");
                        }
                    }
                    if (varDeclarations) {
                        this.source.prepend(
                            "var " +
                                varDeclarations.substring(2) +
                                (appendFirst ? "" : ";\n"),
                        );
                    }
                    return this.source.merge();
                },
                lookupPropertyFunctionVarDeclaration:
                    function lookupPropertyFunctionVarDeclaration() {
                        return "\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    ".trim();
                    },
                // [blockValue]
                //
                // On stack, before: hash, inverse, program, value
                // On stack, after: return value of blockHelperMissing
                //
                // The purpose of this opcode is to take a block of the form
                // `{{#this.foo}}...{{/this.foo}}`, resolve the value of `foo`, and
                // replace it on the stack with the result of properly
                // invoking blockHelperMissing.
                blockValue: function blockValue(name) {
                    var blockHelperMissing = this.aliasable(
                            "container.hooks.blockHelperMissing",
                        ),
                        params = [this.contextName(0)];
                    this.setupHelperArgs(name, 0, params);
                    var blockName = this.popStack();
                    params.splice(1, 0, blockName);
                    this.push(
                        this.source.functionCall(
                            blockHelperMissing,
                            "call",
                            params,
                        ),
                    );
                },
                // [ambiguousBlockValue]
                //
                // On stack, before: hash, inverse, program, value
                // Compiler value, before: lastHelper=value of last found helper, if any
                // On stack, after, if no lastHelper: same as [blockValue]
                // On stack, after, if lastHelper: value
                ambiguousBlockValue: function ambiguousBlockValue() {
                    var blockHelperMissing = this.aliasable(
                            "container.hooks.blockHelperMissing",
                        ),
                        params = [this.contextName(0)];
                    this.setupHelperArgs("", 0, params, true);
                    this.flushInline();
                    var current = this.topStack();
                    params.splice(1, 0, current);
                    this.pushSource([
                        "if (!",
                        this.lastHelper,
                        ") { ",
                        current,
                        " = ",
                        this.source.functionCall(
                            blockHelperMissing,
                            "call",
                            params,
                        ),
                        "}",
                    ]);
                },
                // [appendContent]
                //
                // On stack, before: ...
                // On stack, after: ...
                //
                // Appends the string value of `content` to the current buffer
                appendContent: function appendContent(content) {
                    if (this.pendingContent) {
                        content = this.pendingContent + content;
                    } else {
                        this.pendingLocation = this.source.currentLocation;
                    }
                    this.pendingContent = content;
                },
                // [append]
                //
                // On stack, before: value, ...
                // On stack, after: ...
                //
                // Coerces `value` to a String and appends it to the current buffer.
                //
                // If `value` is truthy, or 0, it is coerced into a string and appended
                // Otherwise, the empty string is appended
                append: function append() {
                    if (this.isInline()) {
                        this.replaceStack(function (current) {
                            return [" != null ? ", current, ' : ""'];
                        });
                        this.pushSource(this.appendToBuffer(this.popStack()));
                    } else {
                        var local = this.popStack();
                        this.pushSource([
                            "if (",
                            local,
                            " != null) { ",
                            this.appendToBuffer(local, void 0, true),
                            " }",
                        ]);
                        if (this.environment.isSimple) {
                            this.pushSource([
                                "else { ",
                                this.appendToBuffer("''", void 0, true),
                                " }",
                            ]);
                        }
                    }
                },
                // [appendEscaped]
                //
                // On stack, before: value, ...
                // On stack, after: ...
                //
                // Escape `value` and append it to the buffer
                appendEscaped: function appendEscaped() {
                    this.pushSource(
                        this.appendToBuffer([
                            this.aliasable("container.escapeExpression"),
                            "(",
                            this.popStack(),
                            ")",
                        ]),
                    );
                },
                // [getContext]
                //
                // On stack, before: ...
                // On stack, after: ...
                // Compiler value, after: lastContext=depth
                //
                // Set the value of the `lastContext` compiler value to the depth
                getContext: function getContext(depth) {
                    this.lastContext = depth;
                },
                // [pushContext]
                //
                // On stack, before: ...
                // On stack, after: currentContext, ...
                //
                // Pushes the value of the current context onto the stack.
                pushContext: function pushContext() {
                    this.pushStackLiteral(this.contextName(this.lastContext));
                },
                // [lookupOnContext]
                //
                // On stack, before: ...
                // On stack, after: currentContext[name], ...
                //
                // Looks up the value of `name` on the current context and pushes
                // it onto the stack.
                lookupOnContext: function lookupOnContext(
                    parts,
                    falsy,
                    strict,
                    scoped,
                ) {
                    var i = 0;
                    if (!scoped && this.options.compat && !this.lastContext) {
                        this.push(this.depthedLookup(parts[i++]));
                    } else {
                        this.pushContext();
                    }
                    this.resolvePath("context", parts, i, falsy, strict);
                },
                // [lookupBlockParam]
                //
                // On stack, before: ...
                // On stack, after: blockParam[name], ...
                //
                // Looks up the value of `parts` on the given block param and pushes
                // it onto the stack.
                lookupBlockParam: function lookupBlockParam(
                    blockParamId,
                    parts,
                ) {
                    this.useBlockParams = true;
                    this.push([
                        "blockParams[",
                        blockParamId[0],
                        "][",
                        blockParamId[1],
                        "]",
                    ]);
                    this.resolvePath("context", parts, 1);
                },
                // [lookupData]
                //
                // On stack, before: ...
                // On stack, after: data, ...
                //
                // Push the data lookup operator
                lookupData: function lookupData(depth, parts, strict) {
                    if (!depth) {
                        this.pushStackLiteral("data");
                    } else {
                        this.pushStackLiteral(
                            "container.data(data, " + depth + ")",
                        );
                    }
                    this.resolvePath("data", parts, 0, true, strict);
                },
                resolvePath: function resolvePath(
                    type,
                    parts,
                    i,
                    falsy,
                    strict,
                ) {
                    var _this2 = this;
                    if (this.options.strict || this.options.assumeObjects) {
                        this.push(
                            strictLookup(
                                this.options.strict && strict,
                                this,
                                parts,
                                i,
                                type,
                            ),
                        );
                        return;
                    }
                    var len = parts.length;
                    for (; i < len; i++) {
                        this.replaceStack(function (current) {
                            var lookup = _this2.nameLookup(
                                current,
                                parts[i],
                                type,
                            );
                            if (!falsy) {
                                return [" != null ? ", lookup, " : ", current];
                            } else {
                                return [" && ", lookup];
                            }
                        });
                    }
                },
                // [resolvePossibleLambda]
                //
                // On stack, before: value, ...
                // On stack, after: resolved value, ...
                //
                // If the `value` is a lambda, replace it on the stack by
                // the return value of the lambda
                resolvePossibleLambda: function resolvePossibleLambda() {
                    this.push([
                        this.aliasable("container.lambda"),
                        "(",
                        this.popStack(),
                        ", ",
                        this.contextName(0),
                        ")",
                    ]);
                },
                // [pushStringParam]
                //
                // On stack, before: ...
                // On stack, after: string, currentContext, ...
                //
                // This opcode is designed for use in string mode, which
                // provides the string value of a parameter along with its
                // depth rather than resolving it immediately.
                pushStringParam: function pushStringParam(string, type) {
                    this.pushContext();
                    this.pushString(type);
                    if (type !== "SubExpression") {
                        if (typeof string === "string") {
                            this.pushString(string);
                        } else {
                            this.pushStackLiteral(string);
                        }
                    }
                },
                emptyHash: function emptyHash(omitEmpty) {
                    if (this.trackIds) {
                        this.push("{}");
                    }
                    if (this.stringParams) {
                        this.push("{}");
                        this.push("{}");
                    }
                    this.pushStackLiteral(omitEmpty ? "undefined" : "{}");
                },
                pushHash: function pushHash() {
                    if (this.hash) {
                        this.hashes.push(this.hash);
                    }
                    this.hash = {
                        values: {},
                        types: [],
                        contexts: [],
                        ids: [],
                    };
                },
                popHash: function popHash() {
                    var hash = this.hash;
                    this.hash = this.hashes.pop();
                    if (this.trackIds) {
                        this.push(this.objectLiteral(hash.ids));
                    }
                    if (this.stringParams) {
                        this.push(this.objectLiteral(hash.contexts));
                        this.push(this.objectLiteral(hash.types));
                    }
                    this.push(this.objectLiteral(hash.values));
                },
                // [pushString]
                //
                // On stack, before: ...
                // On stack, after: quotedString(string), ...
                //
                // Push a quoted version of `string` onto the stack
                pushString: function pushString(string) {
                    this.pushStackLiteral(this.quotedString(string));
                },
                // [pushLiteral]
                //
                // On stack, before: ...
                // On stack, after: value, ...
                //
                // Pushes a value onto the stack. This operation prevents
                // the compiler from creating a temporary variable to hold
                // it.
                pushLiteral: function pushLiteral(value) {
                    this.pushStackLiteral(value);
                },
                // [pushProgram]
                //
                // On stack, before: ...
                // On stack, after: program(guid), ...
                //
                // Push a program expression onto the stack. This takes
                // a compile-time guid and converts it into a runtime-accessible
                // expression.
                pushProgram: function pushProgram(guid) {
                    if (guid != null) {
                        this.pushStackLiteral(this.programExpression(guid));
                    } else {
                        this.pushStackLiteral(null);
                    }
                },
                // [registerDecorator]
                //
                // On stack, before: hash, program, params..., ...
                // On stack, after: ...
                //
                // Pops off the decorator's parameters, invokes the decorator,
                // and inserts the decorator into the decorators list.
                registerDecorator: function registerDecorator(paramSize, name) {
                    var foundDecorator = this.nameLookup(
                            "decorators",
                            name,
                            "decorator",
                        ),
                        options = this.setupHelperArgs(name, paramSize);
                    this.decorators.push([
                        "fn = ",
                        this.decorators.functionCall(foundDecorator, "", [
                            "fn",
                            "props",
                            "container",
                            options,
                        ]),
                        " || fn;",
                    ]);
                },
                // [invokeHelper]
                //
                // On stack, before: hash, inverse, program, params..., ...
                // On stack, after: result of helper invocation
                //
                // Pops off the helper's parameters, invokes the helper,
                // and pushes the helper's return value onto the stack.
                //
                // If the helper is not found, `helperMissing` is called.
                invokeHelper: function invokeHelper(paramSize, name, isSimple) {
                    var nonHelper = this.popStack(),
                        helper = this.setupHelper(paramSize, name);
                    var possibleFunctionCalls = [];
                    if (isSimple) {
                        possibleFunctionCalls.push(helper.name);
                    }
                    possibleFunctionCalls.push(nonHelper);
                    if (!this.options.strict) {
                        possibleFunctionCalls.push(
                            this.aliasable("container.hooks.helperMissing"),
                        );
                    }
                    var functionLookupCode = [
                        "(",
                        this.itemsSeparatedBy(possibleFunctionCalls, "||"),
                        ")",
                    ];
                    var functionCall = this.source.functionCall(
                        functionLookupCode,
                        "call",
                        helper.callParams,
                    );
                    this.push(functionCall);
                },
                itemsSeparatedBy: function itemsSeparatedBy(items, separator) {
                    var result = [];
                    result.push(items[0]);
                    for (var i = 1; i < items.length; i++) {
                        result.push(separator, items[i]);
                    }
                    return result;
                },
                // [invokeKnownHelper]
                //
                // On stack, before: hash, inverse, program, params..., ...
                // On stack, after: result of helper invocation
                //
                // This operation is used when the helper is known to exist,
                // so a `helperMissing` fallback is not required.
                invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
                    var helper = this.setupHelper(paramSize, name);
                    this.push(
                        this.source.functionCall(
                            helper.name,
                            "call",
                            helper.callParams,
                        ),
                    );
                },
                // [invokeAmbiguous]
                //
                // On stack, before: hash, inverse, program, params..., ...
                // On stack, after: result of disambiguation
                //
                // This operation is used when an expression like `{{foo}}`
                // is provided, but we don't know at compile-time whether it
                // is a helper or a path.
                //
                // This operation emits more code than the other options,
                // and can be avoided by passing the `knownHelpers` and
                // `knownHelpersOnly` flags at compile-time.
                invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
                    this.useRegister("helper");
                    var nonHelper = this.popStack();
                    this.emptyHash();
                    var helper = this.setupHelper(0, name, helperCall);
                    var helperName = (this.lastHelper = this.nameLookup(
                        "helpers",
                        name,
                        "helper",
                    ));
                    var lookup = [
                        "(",
                        "(helper = ",
                        helperName,
                        " || ",
                        nonHelper,
                        ")",
                    ];
                    if (!this.options.strict) {
                        lookup[0] = "(helper = ";
                        lookup.push(
                            " != null ? helper : ",
                            this.aliasable("container.hooks.helperMissing"),
                        );
                    }
                    this.push([
                        "(",
                        lookup,
                        helper.paramsInit ? ["),(", helper.paramsInit] : [],
                        "),",
                        "(typeof helper === ",
                        this.aliasable('"function"'),
                        " ? ",
                        this.source.functionCall(
                            "helper",
                            "call",
                            helper.callParams,
                        ),
                        " : helper))",
                    ]);
                },
                // [invokePartial]
                //
                // On stack, before: context, ...
                // On stack after: result of partial invocation
                //
                // This operation pops off a context, invokes a partial with that context,
                // and pushes the result of the invocation back.
                invokePartial: function invokePartial(isDynamic, name, indent) {
                    var params = [],
                        options = this.setupParams(name, 1, params);
                    if (isDynamic) {
                        name = this.popStack();
                        delete options.name;
                    }
                    if (indent) {
                        options.indent = JSON.stringify(indent);
                    }
                    options.helpers = "helpers";
                    options.partials = "partials";
                    options.decorators = "container.decorators";
                    if (!isDynamic) {
                        params.unshift(
                            this.nameLookup("partials", name, "partial"),
                        );
                    } else {
                        params.unshift(name);
                    }
                    if (this.options.compat) {
                        options.depths = "depths";
                    }
                    options = this.objectLiteral(options);
                    params.push(options);
                    this.push(
                        this.source.functionCall(
                            "container.invokePartial",
                            "",
                            params,
                        ),
                    );
                },
                // [assignToHash]
                //
                // On stack, before: value, ..., hash, ...
                // On stack, after: ..., hash, ...
                //
                // Pops a value off the stack and assigns it to the current hash
                assignToHash: function assignToHash(key) {
                    var value = this.popStack(),
                        context = void 0,
                        type = void 0,
                        id = void 0;
                    if (this.trackIds) {
                        id = this.popStack();
                    }
                    if (this.stringParams) {
                        type = this.popStack();
                        context = this.popStack();
                    }
                    var hash = this.hash;
                    if (context) {
                        hash.contexts[key] = context;
                    }
                    if (type) {
                        hash.types[key] = type;
                    }
                    if (id) {
                        hash.ids[key] = id;
                    }
                    hash.values[key] = value;
                },
                pushId: function pushId(type, name, child) {
                    if (type === "BlockParam") {
                        this.pushStackLiteral(
                            "blockParams[" +
                                name[0] +
                                "].path[" +
                                name[1] +
                                "]" +
                                (child
                                    ? " + " + JSON.stringify("." + child)
                                    : ""),
                        );
                    } else if (type === "PathExpression") {
                        this.pushString(name);
                    } else if (type === "SubExpression") {
                        this.pushStackLiteral("true");
                    } else {
                        this.pushStackLiteral("null");
                    }
                },
                // HELPERS
                compiler: JavaScriptCompiler,
                compileChildren: function compileChildren(
                    environment,
                    options,
                ) {
                    var children = environment.children,
                        child = void 0,
                        compiler = void 0;
                    for (var i = 0, l = children.length; i < l; i++) {
                        child = children[i];
                        compiler = new this.compiler();
                        var existing = this.matchExistingProgram(child);
                        if (existing == null) {
                            this.context.programs.push("");
                            var index = this.context.programs.length;
                            child.index = index;
                            child.name = "program" + index;
                            this.context.programs[index] = compiler.compile(
                                child,
                                options,
                                this.context,
                                !this.precompile,
                            );
                            this.context.decorators[index] =
                                compiler.decorators;
                            this.context.environments[index] = child;
                            this.useDepths =
                                this.useDepths || compiler.useDepths;
                            this.useBlockParams =
                                this.useBlockParams || compiler.useBlockParams;
                            child.useDepths = this.useDepths;
                            child.useBlockParams = this.useBlockParams;
                        } else {
                            child.index = existing.index;
                            child.name = "program" + existing.index;
                            this.useDepths =
                                this.useDepths || existing.useDepths;
                            this.useBlockParams =
                                this.useBlockParams || existing.useBlockParams;
                        }
                    }
                },
                matchExistingProgram: function matchExistingProgram(child) {
                    for (
                        var i = 0, len = this.context.environments.length;
                        i < len;
                        i++
                    ) {
                        var environment = this.context.environments[i];
                        if (environment && environment.equals(child)) {
                            return environment;
                        }
                    }
                },
                programExpression: function programExpression(guid) {
                    var child = this.environment.children[guid],
                        programParams = [
                            child.index,
                            "data",
                            child.blockParams,
                        ];
                    if (this.useBlockParams || this.useDepths) {
                        programParams.push("blockParams");
                    }
                    if (this.useDepths) {
                        programParams.push("depths");
                    }
                    return (
                        "container.program(" + programParams.join(", ") + ")"
                    );
                },
                useRegister: function useRegister(name) {
                    if (!this.registers[name]) {
                        this.registers[name] = true;
                        this.registers.list.push(name);
                    }
                },
                push: function push(expr) {
                    if (!(expr instanceof Literal)) {
                        expr = this.source.wrap(expr);
                    }
                    this.inlineStack.push(expr);
                    return expr;
                },
                pushStackLiteral: function pushStackLiteral(item) {
                    this.push(new Literal(item));
                },
                pushSource: function pushSource(source) {
                    if (this.pendingContent) {
                        this.source.push(
                            this.appendToBuffer(
                                this.source.quotedString(this.pendingContent),
                                this.pendingLocation,
                            ),
                        );
                        this.pendingContent = void 0;
                    }
                    if (source) {
                        this.source.push(source);
                    }
                },
                replaceStack: function replaceStack(callback) {
                    var prefix = ["("],
                        stack = void 0,
                        createdStack = void 0,
                        usedLiteral = void 0;
                    if (!this.isInline()) {
                        throw new _exception2["default"](
                            "replaceStack on non-inline",
                        );
                    }
                    var top = this.popStack(true);
                    if (top instanceof Literal) {
                        stack = [top.value];
                        prefix = ["(", stack];
                        usedLiteral = true;
                    } else {
                        createdStack = true;
                        var _name = this.incrStack();
                        prefix = ["((", this.push(_name), " = ", top, ")"];
                        stack = this.topStack();
                    }
                    var item = callback.call(this, stack);
                    if (!usedLiteral) {
                        this.popStack();
                    }
                    if (createdStack) {
                        this.stackSlot--;
                    }
                    this.push(prefix.concat(item, ")"));
                },
                incrStack: function incrStack() {
                    this.stackSlot++;
                    if (this.stackSlot > this.stackVars.length) {
                        this.stackVars.push("stack" + this.stackSlot);
                    }
                    return this.topStackName();
                },
                topStackName: function topStackName() {
                    return "stack" + this.stackSlot;
                },
                flushInline: function flushInline() {
                    var inlineStack = this.inlineStack;
                    this.inlineStack = [];
                    for (var i = 0, len = inlineStack.length; i < len; i++) {
                        var entry = inlineStack[i];
                        if (entry instanceof Literal) {
                            this.compileStack.push(entry);
                        } else {
                            var stack = this.incrStack();
                            this.pushSource([stack, " = ", entry, ";"]);
                            this.compileStack.push(stack);
                        }
                    }
                },
                isInline: function isInline() {
                    return this.inlineStack.length;
                },
                popStack: function popStack(wrapped) {
                    var inline = this.isInline(),
                        item = (
                            inline ? this.inlineStack : this.compileStack
                        ).pop();
                    if (!wrapped && item instanceof Literal) {
                        return item.value;
                    } else {
                        if (!inline) {
                            if (!this.stackSlot) {
                                throw new _exception2["default"](
                                    "Invalid stack pop",
                                );
                            }
                            this.stackSlot--;
                        }
                        return item;
                    }
                },
                topStack: function topStack() {
                    var stack = this.isInline()
                            ? this.inlineStack
                            : this.compileStack,
                        item = stack[stack.length - 1];
                    if (item instanceof Literal) {
                        return item.value;
                    } else {
                        return item;
                    }
                },
                contextName: function contextName(context) {
                    if (this.useDepths && context) {
                        return "depths[" + context + "]";
                    } else {
                        return "depth" + context;
                    }
                },
                quotedString: function quotedString(str) {
                    return this.source.quotedString(str);
                },
                objectLiteral: function objectLiteral(obj) {
                    return this.source.objectLiteral(obj);
                },
                aliasable: function aliasable(name) {
                    var ret = this.aliases[name];
                    if (ret) {
                        ret.referenceCount++;
                        return ret;
                    }
                    ret = this.aliases[name] = this.source.wrap(name);
                    ret.aliasable = true;
                    ret.referenceCount = 1;
                    return ret;
                },
                setupHelper: function setupHelper(
                    paramSize,
                    name,
                    blockHelper,
                ) {
                    var params = [],
                        paramsInit = this.setupHelperArgs(
                            name,
                            paramSize,
                            params,
                            blockHelper,
                        );
                    var foundHelper = this.nameLookup(
                            "helpers",
                            name,
                            "helper",
                        ),
                        callContext = this.aliasable(
                            this.contextName(0) +
                                " != null ? " +
                                this.contextName(0) +
                                " : (container.nullContext || {})",
                        );
                    return {
                        params,
                        paramsInit,
                        name: foundHelper,
                        callParams: [callContext].concat(params),
                    };
                },
                setupParams: function setupParams(helper, paramSize, params) {
                    var options = {},
                        contexts = [],
                        types = [],
                        ids = [],
                        objectArgs = !params,
                        param = void 0;
                    if (objectArgs) {
                        params = [];
                    }
                    options.name = this.quotedString(helper);
                    options.hash = this.popStack();
                    if (this.trackIds) {
                        options.hashIds = this.popStack();
                    }
                    if (this.stringParams) {
                        options.hashTypes = this.popStack();
                        options.hashContexts = this.popStack();
                    }
                    var inverse = this.popStack(),
                        program = this.popStack();
                    if (program || inverse) {
                        options.fn = program || "container.noop";
                        options.inverse = inverse || "container.noop";
                    }
                    var i = paramSize;
                    while (i--) {
                        param = this.popStack();
                        params[i] = param;
                        if (this.trackIds) {
                            ids[i] = this.popStack();
                        }
                        if (this.stringParams) {
                            types[i] = this.popStack();
                            contexts[i] = this.popStack();
                        }
                    }
                    if (objectArgs) {
                        options.args = this.source.generateArray(params);
                    }
                    if (this.trackIds) {
                        options.ids = this.source.generateArray(ids);
                    }
                    if (this.stringParams) {
                        options.types = this.source.generateArray(types);
                        options.contexts = this.source.generateArray(contexts);
                    }
                    if (this.options.data) {
                        options.data = "data";
                    }
                    if (this.useBlockParams) {
                        options.blockParams = "blockParams";
                    }
                    return options;
                },
                setupHelperArgs: function setupHelperArgs(
                    helper,
                    paramSize,
                    params,
                    useRegister,
                ) {
                    var options = this.setupParams(helper, paramSize, params);
                    options.loc = JSON.stringify(this.source.currentLocation);
                    options = this.objectLiteral(options);
                    if (useRegister) {
                        this.useRegister("options");
                        params.push("options");
                        return ["options=", options];
                    } else if (params) {
                        params.push(options);
                        return "";
                    } else {
                        return options;
                    }
                },
            };
            (function () {
                var reservedWords =
                    "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(
                        " ",
                    );
                var compilerWords = (JavaScriptCompiler.RESERVED_WORDS = {});
                for (var i = 0, l = reservedWords.length; i < l; i++) {
                    compilerWords[reservedWords[i]] = true;
                }
            })();
            JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
                return (
                    !JavaScriptCompiler.RESERVED_WORDS[name] &&
                    /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name)
                );
            };
            function strictLookup(requireTerminal, compiler, parts, i, type) {
                var stack = compiler.popStack(),
                    len = parts.length;
                if (requireTerminal) {
                    len--;
                }
                for (; i < len; i++) {
                    stack = compiler.nameLookup(stack, parts[i], type);
                }
                if (requireTerminal) {
                    return [
                        compiler.aliasable("container.strict"),
                        "(",
                        stack,
                        ", ",
                        compiler.quotedString(parts[i]),
                        ", ",
                        JSON.stringify(compiler.source.currentLocation),
                        " )",
                    ];
                } else {
                    return stack;
                }
            }
            exports["default"] = JavaScriptCompiler;
            module2.exports = exports["default"];
        },
    });

    // node_modules/handlebars/dist/cjs/handlebars.js
    var require_handlebars = __commonJS({
        "node_modules/handlebars/dist/cjs/handlebars.js"(exports, module2) {
            "use strict";
            exports.__esModule = true;
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }
            var _handlebarsRuntime = require_handlebars_runtime();
            var _handlebarsRuntime2 =
                _interopRequireDefault(_handlebarsRuntime);
            var _handlebarsCompilerAst = require_ast();
            var _handlebarsCompilerAst2 = _interopRequireDefault(
                _handlebarsCompilerAst,
            );
            var _handlebarsCompilerBase = require_base2();
            var _handlebarsCompilerCompiler = require_compiler();
            var _handlebarsCompilerJavascriptCompiler =
                require_javascript_compiler();
            var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(
                _handlebarsCompilerJavascriptCompiler,
            );
            var _handlebarsCompilerVisitor = require_visitor();
            var _handlebarsCompilerVisitor2 = _interopRequireDefault(
                _handlebarsCompilerVisitor,
            );
            var _handlebarsNoConflict = require_no_conflict();
            var _handlebarsNoConflict2 = _interopRequireDefault(
                _handlebarsNoConflict,
            );
            var _create = _handlebarsRuntime2["default"].create;
            function create() {
                var hb = _create();
                hb.compile = function (input, options) {
                    return _handlebarsCompilerCompiler.compile(
                        input,
                        options,
                        hb,
                    );
                };
                hb.precompile = function (input, options) {
                    return _handlebarsCompilerCompiler.precompile(
                        input,
                        options,
                        hb,
                    );
                };
                hb.AST = _handlebarsCompilerAst2["default"];
                hb.Compiler = _handlebarsCompilerCompiler.Compiler;
                hb.JavaScriptCompiler =
                    _handlebarsCompilerJavascriptCompiler2["default"];
                hb.Parser = _handlebarsCompilerBase.parser;
                hb.parse = _handlebarsCompilerBase.parse;
                hb.parseWithoutProcessing =
                    _handlebarsCompilerBase.parseWithoutProcessing;
                return hb;
            }
            var inst = create();
            inst.create = create;
            _handlebarsNoConflict2["default"](inst);
            inst.Visitor = _handlebarsCompilerVisitor2["default"];
            inst["default"] = inst;
            exports["default"] = inst;
            module2.exports = exports["default"];
        },
    });

    // src/index.ts
    var import_basic2 = __toESM(require_basic());

    // package.json
    var config = {
        addonName: "Zotero Article Status",
        addonID: "zoteroarticlestatus@alima-webdev.com",
        addonRef: "zoteroarticlestatus",
        addonInstance: "ZoteroArticleStatus",
        prefsPrefix: "extensions.zoteroarticlestatus",
        releasePage:
            "https://github.com/alima-webdev/zotero-article-status/releases",
        updateJSON:
            "https://raw.githubusercontent.com/alima-webdev/zotero-article-status/main/update.json",
    };

    // src/utils/locale.ts
    function initLocale() {
        ztoolkit.log("Fn: initLocale");
        const l10n = new (
            typeof Localization === "undefined"
                ? ztoolkit.getGlobal("Localization")
                : Localization
        )([`${config.addonRef}-addon.ftl`], true);
        ztoolkit.log(l10n);
        addon.data.locale = {
            current: l10n,
        };
    }
    function getString(...inputs) {
        if (inputs.length === 1) {
            return _getString(inputs[0]);
        } else if (inputs.length === 2) {
            if (typeof inputs[1] === "string") {
                return _getString(inputs[0], { branch: inputs[1] });
            } else {
                return _getString(inputs[0], inputs[1]);
            }
        } else {
            throw new Error("Invalid arguments");
        }
    }
    function _getString(localeString, options = {}) {
        const localStringWithPrefix = `${config.addonRef}-${localeString}`;
        const { branch, args } = options;
        const pattern = addon.data.locale?.current.formatMessagesSync([
            { id: localStringWithPrefix, args },
        ])[0];
        if (!pattern) {
            return localStringWithPrefix;
        }
        if (branch && pattern.attributes) {
            return pattern.attributes[branch] || localStringWithPrefix;
        } else {
            return pattern.value || localStringWithPrefix;
        }
    }

    // src/utils/module.ts
    function module(target, propertyKey, descriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            try {
                ztoolkit.log(
                    `Calling module ${target.name}.${String(propertyKey)}`,
                );
                return original.apply(this, args);
            } catch (e) {
                ztoolkit.log(
                    `Error in module ${target.name}.${String(propertyKey)}`,
                    e,
                );
                throw e;
            }
        };
        return descriptor;
    }

    // src/ui/keystrokeInput.ts
    var keyStringMac = {
        alt: "\u2325",
        ctrl: "\u2303",
        meta: "\u2318",
        shift: "\u21E7",
    };
    var keyStringWin = {
        alt: "Alt",
        ctrl: "Ctrl",
        meta: "Windows",
        shift: "Shift",
    };
    var keyStringLinux = {
        alt: "Alt",
        ctrl: "Ctrl",
        meta: "Super",
        shift: "Shift",
    };
    function getKeyStringByOS() {
        if (Zotero.isMac) return keyStringMac;
        if (Zotero.isWin) return keyStringWin;
        if (Zotero.isLinux) return keyStringLinux;
    }
    var keyString = getKeyStringByOS();
    var Keystroke = class _Keystroke {
        constructor() {
            this.modifiers = {
                alt: false,
                ctrl: false,
                meta: false,
                shift: false,
            };
            this.key = "";
        }
        static fromString(keystrokeString) {
            const keystroke = new _Keystroke();
            keystroke.modifiers.alt = keystrokeString.includes(
                keyString?.alt || "Alt",
            )
                ? true
                : false;
            keystroke.modifiers.ctrl = keystrokeString.includes(
                keyString?.ctrl || "Control",
            )
                ? true
                : false;
            keystroke.modifiers.meta = keystrokeString.includes(
                keyString?.meta || "Meta",
            )
                ? true
                : false;
            keystroke.modifiers.shift = keystrokeString.includes(
                keyString?.shift || "Shift",
            )
                ? true
                : false;
            keystroke.key = keystrokeString.split("").at(-1) || "";
            return keystroke;
        }
        toString() {
            let modifiers = "";
            if (this.modifiers.alt) modifiers += keyString?.alt + " ";
            if (this.modifiers.ctrl) modifiers += keyString?.ctrl + " ";
            if (this.modifiers.meta) modifiers += keyString?.meta + " ";
            if (this.modifiers.shift) modifiers += keyString?.shift + " ";
            const strKeystroke = modifiers + this.key;
            ztoolkit.log(this.key);
            return strKeystroke;
        }
        toJSON() {
            const data = {
                modifiers: this.modifiers,
                key: this.key,
            };
            return JSON.stringify(data);
        }
    };
    var invalidMainKeys = [
        "Shift",
        "Alt",
        "Control",
        "Meta",
        "ContextMenu",
        "NumLock",
        "ScrollLock",
        "VolumeMute",
        "VolumeDown",
        "VolumeUp",
        "MediaSelect",
        "LaunchApp1",
        "LaunchApp2",
    ];
    function isMainKeyValid(key) {
        let valid = true;
        if (invalidMainKeys.includes(key)) {
            valid = false;
        }
        return valid;
    }
    var KeystrokeInput = class {
        constructor(input) {
            this.input = input;
            this.bindEvents();
        }
        bindEvents() {
            this.input.addEventListener(
                "keydown",
                this.handleKeyDownEvent.bind(this),
            );
            this.input.addEventListener(
                "keyup",
                this.handleKeyUpEvent.bind(this),
            );
            this.input.addEventListener(
                "keypress",
                this.bypassEvent.bind(this),
            );
        }
        bypassEvent(ev) {
            ev.preventDefault();
        }
        handleKeyUpEvent(ev) {
            this.input.blur();
            ev.preventDefault();
        }
        handleKeyDownEvent(ev) {
            if (ev.repeat) return;
            const key = isMainKeyValid(ev.key) ? ev.key : "";
            const isAlt = ev.altKey;
            const isCtrl = ev.ctrlKey;
            const isMeta = ev.metaKey;
            const isShift = ev.shiftKey;
            const keystroke = new Keystroke();
            keystroke.modifiers = {
                alt: isAlt,
                ctrl: isCtrl,
                meta: isMeta,
                shift: isShift,
            };
            keystroke.key = key;
            this.input.value = keystroke.toString();
            this.input.keystrokeValue = keystroke;
            ev.preventDefault();
            return false;
        }
    };
    function attachKeystrokeInput(element) {
        const keystrokeInput = new KeystrokeInput(element);
        return keystrokeInput;
    }

    // src/utils/prefs.ts
    function getPref(key) {
        return Zotero.Prefs.get(`${config.prefsPrefix}.${key}`, true);
    }
    function setPref(key, value) {
        const prefsReturn = Zotero.Prefs.set(
            `${config.prefsPrefix}.${key}`,
            value,
            true,
        );
        hooks_default.onPrefsEvent("change", {});
        return prefsReturn;
    }

    // src/lib/global.ts
    var allStatuses = JSON.parse(String(getPref("statuses")));
    var statusTagPrefix = String(getPref("status-tag-prefix"));
    var reasonTagPrefix =
        statusTagPrefix + String(getPref("reason-tag-prefix"));
    function reloadPrefs() {
        ztoolkit.log("Fn: reloadPrefs");
        loadPrefs();
    }
    function loadPrefs() {
        ztoolkit.log("Fn: loadPrefs");
        allStatuses = JSON.parse(String(getPref("statuses")));
        allStatuses.map((status) => {
            status.keystroke = Keystroke.fromString(status.keyboardShortcut);
            return status;
        });
        statusTagPrefix = String(getPref("status-tag-prefix"));
        reasonTagPrefix =
            statusTagPrefix + String(getPref("reason-tag-prefix"));
    }

    // src/utils/helpers.ts
    function getItemStatusTags(item) {
        const itemTags = item.getTags();
        const statusTags = itemTags.filter((obj) => {
            return obj.tag.includes(statusTagPrefix);
        });
        return statusTags;
    }
    function getItemStatus(item) {
        let statusObj = allStatuses.find((obj) => obj.default == true);
        for (const status of allStatuses) {
            if (item.hasTag(status.tag)) statusObj = status;
        }
        return statusObj;
    }
    function getAllReasonsFromItems(tags) {
        return tags
            .filter((obj) => {
                return obj.tag.includes(reasonTagPrefix);
            })
            .map((obj) => {
                const label = obj.tag.replace(reasonTagPrefix, "");
                return { label, value: label };
            });
    }
    function getStatusFromTag(tag) {
        const status = allStatuses.find((obj) => obj.tag == tag);
        return status;
    }
    function removeAllStatuses(item) {
        item.getTags().map((tag) => {
            if (tag.tag.includes(statusTagPrefix)) item.removeTag(tag.tag);
        });
    }
    function generateMenuIcon(color) {
        return (
            "data:image/svg+xml;base64," +
            window.btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="12" /></svg>`,
            )
        );
    }
    function loadXHTMLFromFile(src) {
        return Zotero.File.getContentsFromURL(src);
    }
    function parseXHTML(str) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(str, "text/html");
        if (doc.documentElement.localName === "parsererror") {
            throw new Error("not well-formed XHTML");
        }
        const range = doc.createRange();
        range.selectNodeContents(doc.querySelector("div"));
        return range.extractContents();
    }

    // src/ui/statusColumn.ts
    function initStatusColumn() {
        const columnId = "status";
        const getStatusColumnHook = (
            field,
            unformatted,
            includeBaseMapped,
            item,
        ) => {
            const reviewStatus = getItemStatus(item);
            return String(reviewStatus?.tag);
        };
        function renderStatusCell(index, data, column) {
            const element = document.createElement("span");
            element.className = `cell ${column.className} review-container`;
            const innerElement = document.createElement("div");
            innerElement.classList.add("review");
            const status = getStatusFromTag(data);
            innerElement.style.backgroundColor = status?.color ?? "";
            innerElement.textContent = status?.label ?? "";
            element.appendChild(innerElement);
            return element;
        }
        const columnOptions = { renderCell: renderStatusCell };
        const columnName = getString("status-column-header");
        ztoolkit.ItemTree.register(
            columnId,
            columnName,
            getStatusColumnHook,
            columnOptions,
        );
    }
    function getStatusContextMenu() {
        return allStatuses.map((status) => {
            return {
                tag: "menuitem",
                label: status.label == "" ? "Clear" : status.label,
                icon: generateMenuIcon(status.color),
                oncommand: `document.setReviewStatus('${status.tag}')`,
            };
        });
    }
    function statusKeyboardEvents(ev) {
        for (const status of allStatuses) {
            if (
                ev.altKey == status.keystroke.modifiers.alt &&
                ev.ctrlKey == status.keystroke.modifiers.ctrl &&
                ev.metaKey == status.keystroke.modifiers.meta &&
                ev.shiftKey == status.keystroke.modifiers.shift &&
                ev.key == status.keystroke.key
            ) {
                ztoolkit.getGlobal("document").setReviewStatus(status.tag);
            }
        }
    }
    function statusRegisterGlobalFunctions() {
        ztoolkit.getGlobal("document").setReviewStatus = (statusTag) => {
            const selectedItems = ztoolkit
                .getGlobal("ZoteroPane")
                .getSelectedItems();
            if (selectedItems.length == 0) return;
            for (const item of selectedItems) {
                removeAllStatuses(item);
                if (statusTag != "") {
                    item.addTag(statusTag);
                }
                item.saveTx();
            }
            const status = getStatusFromTag(statusTag);
            if (status?.askForReason) document.setStatusReason();
        };
    }

    // src/vendors/autocompleter/autocomplete.ts
    var import_zotero_plugin_toolkit = __toESM(require_dist());
    function autocomplete(settings) {
        const doc = settings.document || document;
        const container = settings.container || doc.createElement("div");
        const preventSubmit = settings.preventSubmit || 0; /* Never */
        container.id = container.id || "autocomplete-" + uid();
        const containerStyle = container.style;
        const debounceWaitMs = settings.debounceWaitMs || 0;
        const disableAutoSelect = settings.disableAutoSelect || false;
        const customContainerParent = container.parentElement;
        let items = [];
        let inputValue = "";
        let minLen = 2;
        const showOnFocus = settings.showOnFocus;
        let selected;
        let fetchCounter = 0;
        let debounceTimer;
        let destroyed = false;
        let suppressAutocomplete = false;
        if (settings.minLength !== void 0) {
            minLen = settings.minLength;
        }
        if (!settings.input) {
            throw new Error("input undefined");
        }
        const input = settings.input;
        container.className = "autocomplete " + (settings.className || "");
        container.setAttribute("role", "listbox");
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-expanded", "false");
        input.setAttribute("aria-autocomplete", "list");
        input.setAttribute("aria-controls", container.id);
        input.setAttribute("aria-owns", container.id);
        input.setAttribute("aria-activedescendant", "");
        input.setAttribute("aria-haspopup", "listbox");
        containerStyle.position = "absolute";
        function uid() {
            return (
                Date.now().toString(36) +
                Math.random().toString(36).substring(2)
            );
        }
        function detach() {
            const parent = container.parentNode;
            if (parent) {
                parent.removeChild(container);
            }
        }
        function clearDebounceTimer() {
            if (debounceTimer) {
                window.clearTimeout(debounceTimer);
            }
        }
        function attach() {
            if (!container.parentNode) {
                (customContainerParent || doc.body).appendChild(container);
            }
        }
        function containerDisplayed() {
            return !!container.parentNode;
        }
        function clear() {
            fetchCounter++;
            items = [];
            inputValue = "";
            selected = void 0;
            input.setAttribute("aria-activedescendant", "");
            input.setAttribute("aria-expanded", "false");
            detach();
        }
        function updatePosition() {
            if (!containerDisplayed()) {
                return;
            }
            input.setAttribute("aria-expanded", "true");
            containerStyle.height = "auto";
            containerStyle.width = input.offsetWidth + "px";
            let maxHeight = 0;
            let inputRect;
            function calc() {
                const docEl = doc.documentElement;
                const clientTop = docEl.clientTop || doc.body.clientTop || 0;
                const clientLeft = docEl.clientLeft || doc.body.clientLeft || 0;
                const scrollTop = window.pageYOffset || docEl.scrollTop;
                const scrollLeft = window.pageXOffset || docEl.scrollLeft;
                inputRect = input.getBoundingClientRect();
                const top =
                    inputRect.top + input.offsetHeight + scrollTop - clientTop;
                const left = inputRect.left + scrollLeft - clientLeft;
                containerStyle.top = top + "px";
                containerStyle.left = left + "px";
                maxHeight =
                    window.innerHeight - (inputRect.top + input.offsetHeight);
                if (maxHeight < 0) {
                    maxHeight = 0;
                }
                containerStyle.top = top + "px";
                containerStyle.bottom = "";
                containerStyle.left = left + "px";
                containerStyle.maxHeight = maxHeight + "px";
            }
            calc();
            calc();
            if (settings.customize && inputRect) {
                settings.customize(input, inputRect, container, maxHeight);
            }
        }
        function update() {
            container.textContent = "";
            input.setAttribute("aria-activedescendant", "");
            let render = function (item, _2, __) {
                const itemElement = doc.createElement("div");
                itemElement.textContent = item.label || "";
                return itemElement;
            };
            if (settings.render) {
                render = settings.render;
            }
            let renderGroup = function (groupName, _2) {
                const groupDiv = doc.createElement("div");
                groupDiv.textContent = groupName;
                return groupDiv;
            };
            if (settings.renderGroup) {
                renderGroup = settings.renderGroup;
            }
            const fragment = doc.createDocumentFragment();
            let prevGroup = uid();
            items.forEach(function (item, index) {
                if (item.group && item.group !== prevGroup) {
                    prevGroup = item.group;
                    const groupDiv = renderGroup(item.group, inputValue);
                    if (groupDiv) {
                        groupDiv.className += " group";
                        fragment.appendChild(groupDiv);
                    }
                }
                const div = render(item, inputValue, index);
                if (div) {
                    div.id = `${container.id}_${index}`;
                    div.setAttribute("role", "option");
                    div.addEventListener("click", function (ev) {
                        suppressAutocomplete = true;
                        try {
                            settings.onSelect(item, input);
                        } finally {
                            suppressAutocomplete = false;
                        }
                        clear();
                        ev.preventDefault();
                        ev.stopPropagation();
                    });
                    if (item === selected) {
                        div.className += " selected";
                        div.setAttribute("aria-selected", "true");
                        input.setAttribute("aria-activedescendant", div.id);
                    }
                    fragment.appendChild(div);
                }
            });
            container.appendChild(fragment);
            if (items.length < 1) {
                if (settings.emptyMsg) {
                    const empty = doc.createElement("div");
                    empty.id = `${container.id}_${uid()}`;
                    empty.className = "empty";
                    empty.textContent = settings.emptyMsg;
                    container.appendChild(empty);
                    input.setAttribute("aria-activedescendant", empty.id);
                } else {
                    clear();
                    return;
                }
            }
            attach();
            updateWidth();
            updateScroll();
        }
        function updateWidth() {
            if (!containerDisplayed()) {
                return;
            }
            input.setAttribute("aria-expanded", "true");
            containerStyle.height = "auto";
            containerStyle.width = input.offsetWidth + "px";
        }
        function updateIfDisplayed() {
            if (containerDisplayed()) {
                update();
            }
        }
        function resizeEventHandler() {
            updateIfDisplayed();
        }
        function scrollEventHandler(e) {
            if (e.target !== container) {
                updateIfDisplayed();
            } else {
                e.preventDefault();
            }
        }
        function inputEventHandler() {
            if (!suppressAutocomplete) {
                fetch(0 /* Keyboard */);
            }
        }
        function updateScroll() {
            const elements = container.getElementsByClassName("selected");
            if (elements.length > 0) {
                let element = elements[0];
                const previous = element.previousElementSibling;
                if (
                    previous &&
                    previous.className.indexOf("group") !== -1 &&
                    !previous.previousElementSibling
                ) {
                    element = previous;
                }
                if (element.offsetTop < container.scrollTop) {
                    container.scrollTop = element.offsetTop;
                } else {
                    const selectBottom =
                        element.offsetTop + element.offsetHeight;
                    const containerBottom =
                        container.scrollTop + container.offsetHeight;
                    if (selectBottom > containerBottom) {
                        container.scrollTop += selectBottom - containerBottom;
                    }
                }
            }
        }
        function selectPreviousSuggestion() {
            const index = items.indexOf(selected);
            selected =
                index === -1
                    ? void 0
                    : items[(index + items.length - 1) % items.length];
            updateSelectedSuggestion(index);
        }
        function selectNextSuggestion() {
            const index = items.indexOf(selected);
            selected =
                items.length < 1
                    ? void 0
                    : index === -1
                      ? items[0]
                      : items[(index + 1) % items.length];
            updateSelectedSuggestion(index);
        }
        function updateSelectedSuggestion(index) {
            if (items.length > 0) {
                unselectSuggestion(index);
                const ztoolkit2 = new import_zotero_plugin_toolkit.default();
                selectSuggestion(items.indexOf(selected));
                updateScroll();
            }
        }
        function selectSuggestion(index) {
            const element = doc.getElementById(container.id + "_" + index);
            if (element) {
                element.classList.add("selected");
                element.setAttribute("aria-selected", "true");
                input.setAttribute("aria-activedescendant", element.id);
            }
        }
        function unselectSuggestion(index) {
            const element = doc.getElementById(container.id + "_" + index);
            if (element) {
                element.classList.remove("selected");
                element.removeAttribute("aria-selected");
                input.removeAttribute("aria-activedescendant");
            }
        }
        function handleArrowAndEscapeKeys(ev, key) {
            const containerIsDisplayed = containerDisplayed();
            if (key === "Escape") {
                clear();
            } else {
                if (!containerIsDisplayed || items.length < 1) {
                    return;
                }
                key === "ArrowUp"
                    ? selectPreviousSuggestion()
                    : selectNextSuggestion();
            }
            ev.preventDefault();
            if (containerIsDisplayed) {
                ev.stopPropagation();
            }
        }
        function handleEnterKey(ev) {
            if (selected) {
                if (preventSubmit === 2 /* OnSelect */) {
                    ev.preventDefault();
                }
                suppressAutocomplete = true;
                try {
                    settings.onSelect(selected, input);
                } finally {
                    suppressAutocomplete = false;
                }
                clear();
            }
            if (preventSubmit === 1 /* Always */) {
                ev.preventDefault();
            }
        }
        function keydownEventHandler(ev) {
            const key = ev.key;
            switch (key) {
                case "ArrowUp":
                case "ArrowDown":
                case "Escape":
                    handleArrowAndEscapeKeys(ev, key);
                    break;
                case "Enter":
                    handleEnterKey(ev);
                    break;
                default:
                    break;
            }
        }
        function focusEventHandler() {
            if (showOnFocus) {
                fetch(1 /* Focus */);
            }
        }
        function fetch(trigger) {
            if (input.value.length >= minLen || trigger === 1 /* Focus */) {
                clearDebounceTimer();
                debounceTimer = window.setTimeout(
                    () =>
                        startFetch(
                            input.value,
                            trigger,
                            input.selectionStart || 0,
                        ),
                    trigger === 0 /* Keyboard */ || trigger === 2 /* Mouse */
                        ? debounceWaitMs
                        : 0,
                );
            } else {
                clear();
            }
        }
        function startFetch(inputText, trigger, cursorPos) {
            if (destroyed) return;
            const savedFetchCounter = ++fetchCounter;
            settings.fetch(
                inputText,
                function (elements) {
                    if (fetchCounter === savedFetchCounter && elements) {
                        items = elements;
                        inputValue = inputText;
                        selected =
                            items.length < 1 || disableAutoSelect
                                ? void 0
                                : items[0];
                        update();
                    }
                },
                trigger,
                cursorPos,
            );
        }
        function keyupEventHandler(e) {
            if (settings.keyup) {
                settings.keyup({
                    event: e,
                    fetch: () => fetch(0 /* Keyboard */),
                });
                return;
            }
            if (!containerDisplayed() && e.key === "ArrowDown") {
                fetch(0 /* Keyboard */);
            }
        }
        function clickEventHandler(e) {
            settings.click &&
                settings.click({
                    event: e,
                    fetch: () => fetch(2 /* Mouse */),
                });
        }
        function blurEventHandler() {
            setTimeout(() => {
                if (doc.activeElement !== input) {
                    clear();
                }
            }, 200);
        }
        function manualFetch() {
            startFetch(input.value, 3 /* Manual */, input.selectionStart || 0);
        }
        container.addEventListener("mousedown", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
        });
        container.addEventListener("focus", () => input.focus());
        detach();
        function destroy() {
            input.removeEventListener("focus", focusEventHandler);
            input.removeEventListener("keyup", keyupEventHandler);
            input.removeEventListener("click", clickEventHandler);
            input.removeEventListener("keydown", keydownEventHandler);
            input.removeEventListener("input", inputEventHandler);
            input.removeEventListener("blur", blurEventHandler);
            window.removeEventListener("resize", resizeEventHandler);
            doc.removeEventListener("scroll", scrollEventHandler, true);
            input.removeAttribute("role");
            input.removeAttribute("aria-expanded");
            input.removeAttribute("aria-autocomplete");
            input.removeAttribute("aria-controls");
            input.removeAttribute("aria-activedescendant");
            input.removeAttribute("aria-owns");
            input.removeAttribute("aria-haspopup");
            clearDebounceTimer();
            clear();
            destroyed = true;
        }
        input.addEventListener("keyup", keyupEventHandler);
        input.addEventListener("click", clickEventHandler);
        input.addEventListener("keydown", keydownEventHandler);
        input.addEventListener("input", inputEventHandler);
        input.addEventListener("blur", blurEventHandler);
        input.addEventListener("focus", focusEventHandler);
        window.addEventListener("resize", resizeEventHandler);
        doc.addEventListener("scroll", scrollEventHandler, true);
        return {
            destroy,
            fetch: manualFetch,
        };
    }

    // src/ui/autocomplete.ts
    function initAutoComplete(input, container) {
        autocomplete({
            document: ztoolkit.getGlobal("document"),
            input,
            fetch: function (text, update) {
                text = text.toLowerCase();
                const suggestions = document.allReasons.filter((n) =>
                    n.label.toLowerCase().startsWith(text),
                );
                update(suggestions);
            },
            onSelect: function (item) {
                input.value = item.label ?? "";
            },
            render: function (item, currentValue) {
                const itemElement = document.createElement("div");
                itemElement.textContent = item?.label;
                return itemElement;
            },
            container,
            preventSubmit: 2,
        });
    }

    // src/ui/modal.ts
    var Handlebars = require_handlebars();
    var modalTemplate = Handlebars.compile(`
        <div class="inner-modal" tabindex="-1">
            <div role="dialog" aria-modal="true" aria-labelledby="{{id}}-title">
                <header>
                    <h2 id="{{id}}-title" class="modal-title">
                        {{title}}
                    </h2>
                    <button aria-label="Close modal"></button>
                </header>
                <div id="{{id}}-content" class="modal-content">
                </div>
            </div>
        </div>
`);
    function createModal(id, title, content) {
        const modalElement = document.createElement("div");
        modalElement.setAttribute("aria-hidden", "true");
        modalElement.id = id;
        modalElement.className = "modal";
        modalElement.innerHTML = modalTemplate({ id, title });
        modalElement.querySelector(".modal-content")?.appendChild(content);
        const modal = new Modal(id, modalElement);
        return modal;
    }
    function initModal() {}
    var Modal = class {
        constructor(id, element) {
            this.id = id;
            this.element = element;
        }
        appendTo(root) {
            root.appendChild(this.element);
            this.bindEvents();
            this.root = root;
            return this;
        }
        open() {
            this.element.classList.add("open");
            this.root?.parentNode?.addEventListener(
                "keydown",
                this.closeKeyStroke.bind(this),
            );
        }
        closeKeyStroke(ev) {
            if (ev.key === "Escape") {
                this.close();
                ev.preventDefault();
            }
        }
        close() {
            this.element.classList.remove("open");
            this.root?.parentNode?.removeEventListener(
                "keydown",
                this.closeKeyStroke,
            );
        }
        bindEvents() {
            ztoolkit.log(this.element);
            const closeActionElements =
                this.element.querySelectorAll("[action=close]");
            for (const el of closeActionElements) {
                el.addEventListener("click", (ev) => {
                    this.close();
                });
            }
            this.element.onclick = (ev) => {
                if (ev.target == this.element) this.close();
            };
        }
    };

    // src/ui/reasonColumn.ts
    function initReasonColumn() {
        const columnReasonId = "reason";
        const getReasonColumnHook = (
            field,
            unformatted,
            includeBaseMapped,
            item,
        ) => {
            const statusTags = getItemStatusTags(item);
            const reason =
                statusTags
                    .find((obj) => obj.tag.includes(reasonTagPrefix))
                    ?.tag.replace(reasonTagPrefix, "") ?? "";
            return reason;
        };
        const columnReasonOptions = {};
        const columnReasonName = getString("reason-column-header");
        ztoolkit.ItemTree.register(
            columnReasonId,
            columnReasonName,
            getReasonColumnHook,
            columnReasonOptions,
        );
    }
    function getReasonContextMenu() {
        return [
            { tag: "menuseparator" },
            {
                tag: "menuitem",
                label: "Change Reason",
                oncommand: `document.setStatusReason()`,
            },
        ];
    }
    function reasonKeyboardEvents(ev) {
        if (ev.key == "r") {
            ztoolkit.getGlobal("document").setStatusReason();
        }
    }
    function reasonRegisterGlobalFunctions() {
        ztoolkit.getGlobal("document").setStatusReason = async () => {
            const selectedItems = ztoolkit
                .getGlobal("ZoteroPane")
                .getSelectedItems();
            if (selectedItems.length == 0) return;
            document.allReasons = getAllReasonsFromItems(
                await ztoolkit.getGlobal("Zotero").Tags.getAll(),
            );
            const inputReason =
                document.reasonModal.element.querySelector("#input-reason");
            inputReason.value = "";
            document.reasonModal.open();
            inputReason.focus();
        };
    }
    async function reasonRegisterDOM() {
        const reasonModalBody = document.createElement("div");
        const reasonModalDescription = document.createElement("div");
        reasonModalDescription.textContent = getString("reason-dialog-text");
        reasonModalBody.appendChild(reasonModalDescription);
        const reasonForm = document.createElement("form");
        const reasonInput = ztoolkit.UI.createElement(document, "input");
        reasonInput.id = "input-reason";
        reasonInput.type = "text";
        reasonInput.classList.add("input");
        const autocompleteContainer = document.createElement("div");
        const inputContainer = document.createElement("div");
        inputContainer.appendChild(reasonInput);
        inputContainer.appendChild(autocompleteContainer);
        reasonForm.appendChild(inputContainer);
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("btn-container");
        const btnCancel = document.createElement("button");
        btnCancel.type = "button";
        btnCancel.setAttribute("action", "close");
        btnCancel.classList.add("btn");
        btnCancel.textContent = "Cancel";
        const btnSubmit = document.createElement("button");
        btnSubmit.type = "submit";
        btnSubmit.classList.add("btn");
        btnSubmit.classList.add("btn-primary");
        btnSubmit.textContent = "Submit";
        buttonContainer.appendChild(btnCancel);
        buttonContainer.appendChild(btnSubmit);
        reasonForm.appendChild(buttonContainer);
        reasonModalBody.appendChild(reasonForm);
        reasonForm.onsubmit = () => {
            const selectedItems = ztoolkit
                .getGlobal("ZoteroPane")
                .getSelectedItems();
            for (const item of selectedItems) {
                item.getTags().map((tag) => {
                    if (tag.tag.includes(reasonTagPrefix))
                        item.removeTag(tag.tag);
                });
                if (reasonInput.value != "") {
                    item.addTag(reasonTagPrefix + reasonInput.value);
                }
                item.saveTx();
            }
            document.reasonModal.close();
        };
        const reasonModal = createModal(
            "reason-modal",
            getString("reason-dialog-title"),
            reasonModalBody,
        );
        reasonModal.appendTo(document.documentElement);
        document.reasonModal = reasonModal;
        btnCancel.onclick = () => {
            reasonInput.value = "";
            document.reasonModal.close();
        };
        document.allReasons = getAllReasonsFromItems(
            await ztoolkit.getGlobal("Zotero").Tags.getAll(),
        );
        initAutoComplete(reasonInput, autocompleteContainer);
        initModal();
    }

    // src/ui/report.ts
    function getReportContextMenu() {
        return [
            { tag: "menuseparator" },
            {
                tag: "menuitem",
                label: "Generate Report",
                oncommand: `document.generateReport()`,
            },
        ];
    }
    function reportRegisterGlobalFunctions() {
        ztoolkit.getGlobal("document").generateReport = async () => {
            const selectedItems = ztoolkit
                .getGlobal("ZoteroPane")
                .getSelectedItems();
            if (selectedItems.length == 0) return;
            if (!reportModalTBody) return;
            let totalCount = 0;
            reportModalTBody.innerHTML = ``;
            for (const status of allStatuses.filter(
                (stat) => stat.default === false,
            )) {
                const statusLabel =
                    status.label != ""
                        ? status.label
                        : getString("status-default-label");
                const statusItems = selectedItems.filter((item) => {
                    return item.hasTag(status.tag);
                });
                const statusCount = statusItems.length;
                reportModalTBody.innerHTML += `
            <tr>
                <td>${statusLabel}</td>
                <td align="center">${statusCount}</td>
            </tr>
            `;
                totalCount += statusCount;
            }
            let defaultStatusLabel = allStatuses.filter(
                (stat) => stat.default === true,
            )[0].label;
            if (defaultStatusLabel == "")
                defaultStatusLabel = getString("status-blank-label");
            const defaultStatusCount = selectedItems.length - totalCount;
            reportModalTBody.innerHTML += `
      <tr>
        <td>${defaultStatusLabel}</td>
        <td align="center">${defaultStatusCount}</td>
      </tr>
    `;
            totalCount = selectedItems.length;
            reportModalTBody.innerHTML += `
        <tr class="border-top">
        <td>${getString("status-total-label")}</td>
        <td align="center">${totalCount}</td>
        </tr>
        `;
            document.reportModal.open();
            return;
        };
    }
    var reportModalTBody;
    async function reportRegisterDOM() {
        const reportModalBody = document.createElement("div");
        const bodyContent = document.importNode(
            parseXHTML(`
        <div>
            <table class="table">
                <thead>
                    <tr class="border-bottom">
                        <th>${getString("report-dialog-table-status")}</th>
                        <th>${getString("report-dialog-table-count")}</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <br />
            <div class="text-center">
                <button class="btn" action="close">Close</button>
            </div>
        </div>
    `),
            true,
        );
        reportModalBody.append(bodyContent);
        reportModalTBody = reportModalBody.querySelector("tbody");
        const reportModal = createModal(
            "report-modal",
            getString("report-dialog-title"),
            reportModalBody,
        );
        reportModal.appendTo(document.documentElement);
        document.reportModal = reportModal;
        initModal();
    }

    // src/ui/itemTree.ts
    var ReviewModule = class {
        static registerStyleSheet() {
            const styles = ztoolkit.UI.createElement(document, "link", {
                properties: {
                    type: "text/css",
                    rel: "stylesheet",
                    href: `chrome://${config.addonRef}/content/styles/styles.css`,
                    id: `${config.addonRef}-stylesheet`,
                },
            });
            ztoolkit.getGlobal("document").documentElement.appendChild(styles);
        }
        static registerExtraColumnWithBindings() {
            initStatusColumn();
            initReasonColumn();
            const statusContextMenu = getStatusContextMenu();
            const reasonContextMenu = getReasonContextMenu();
            const reportContextMenu = getReportContextMenu();
            const contextMenu = statusContextMenu
                .concat(reasonContextMenu)
                .concat(reportContextMenu);
            ztoolkit.Menu.register("item", { tag: "menuseparator" });
            ztoolkit.Menu.register("item", {
                tag: "menu",
                label: getString("context-menu-status"),
                children: contextMenu,
            });
            ztoolkit.getGlobal("document").addEventListener("keydown", (ev) => {
                const activeElement =
                    ztoolkit.getGlobal("document").activeElement;
                const itemTreeElement = ztoolkit
                    .getGlobal("document")
                    .querySelector("#item-tree-main-default");
                if (itemTreeElement?.contains(activeElement)) {
                    statusKeyboardEvents(ev);
                    reasonKeyboardEvents(ev);
                }
            });
            statusRegisterGlobalFunctions();
            reasonRegisterGlobalFunctions();
            reportRegisterGlobalFunctions();
        }
        static async registerDOMElements() {
            await reasonRegisterDOM();
            await reportRegisterDOM();
        }
    };
    __decorateClass([module], ReviewModule, "registerStyleSheet", 1);
    __decorateClass(
        [module],
        ReviewModule,
        "registerExtraColumnWithBindings",
        1,
    );
    __decorateClass([module], ReviewModule, "registerDOMElements", 1);

    // src/ui/colorpicker.ts
    function attachColorPicker(_window, _document, element) {
        ztoolkit.log("Fn: attachColorPicker");
        if (!element) return false;
        element.type = "color";
        const label = element.parentNode?.querySelector("label");
        if (!label) return false;
        label.textContent = element.value;
        element.updateLabelValue = () => {
            label.textContent = element.value;
        };
        element.addEventListener(
            "input",
            (ev) => {
                label.textContent = element.value;
            },
            false,
        );
        return true;
    }

    // src/ui/preferenceScript.ts
    async function registerPrefsScripts(_window) {
        await loadStatusTable(_window);
        await loadStatusModal(_window);
        bindPrefEvents(_window);
        await Zotero.Promise.delay(500);
        updateUI();
    }
    var statusTable;
    var selectedRow;
    async function loadStatusTable(_window) {
        return new Promise((resolve, reject) => {
            const columns = [
                {
                    dataKey: "label",
                    label: getString("prefs-table-label"),
                    fixedWidth: true,
                    width: 100,
                },
                {
                    dataKey: "name",
                    label: getString("prefs-table-name"),
                    fixedWidth: true,
                    width: 100,
                },
                {
                    dataKey: "tag",
                    label: getString("prefs-table-tag"),
                    fixedWidth: true,
                    width: 100,
                },
                {
                    dataKey: "color",
                    label: getString("prefs-table-color"),
                },
                {
                    dataKey: "askForReason",
                    label: getString("prefs-table-askforreason"),
                },
                {
                    dataKey: "default",
                    label: getString("prefs-table-default"),
                },
                {
                    dataKey: "keyboardShortcut",
                    label: getString("prefs-table-keyboardshortcut"),
                },
            ];
            statusTable = new ztoolkit.VirtualizedTable(_window)
                .setContainerId(`${config.addonRef}-table-container`)
                .setProp({
                    id: `${config.addonRef}-prefs-table`,
                    columns,
                    showHeader: true,
                    multiSelect: true,
                    staticColumns: true,
                    disableFontSizeScaling: true,
                })
                .setProp("getRowCount", () => allStatuses.length || 0)
                .setProp("getRowData", (index) => allStatuses[index] || {})
                .setProp(
                    "getRowString",
                    (index) => allStatuses[index].title || "",
                )
                .setProp("onSelectionChange", (selection) => {
                    [selectedRow] = selection.selected;
                })
                .setProp("onKeyDown", (event) => {
                    if (
                        event.key == "Delete" ||
                        (Zotero.isMac && event.key == "Backspace")
                    ) {
                        removeStatus(selectedRow);
                    }
                })
                .setProp("onActivate", (selection) => {
                    editStatus(selectedRow);
                })
                .render(-1, () => {
                    resolve();
                });
        });
    }
    var statusModal;
    async function loadStatusModal(_window) {
        const rootDocument = _window.document;
        const rootElement = rootDocument.documentElement;
        const prefsElement = rootElement.querySelector(
            `#${config.addonRef}-status-modal`,
        );
        const modalContent = rootDocument.createElement("div");
        statusModal = createModal("prefs", "Edit", modalContent);
        statusModal.appendTo(prefsElement);
        const formTemplate = loadXHTMLFromFile(
            rootURI + "chrome/content/modal/prefsStatus.xhtml",
        );
        const formNodes = parseXHTML(formTemplate);
        const formNodesImported = rootDocument.importNode(formNodes, true);
        modalContent.appendChild(formNodesImported);
        statusModal.bindEvents();
        const colorInput = modalContent.querySelector("[type=color]");
        ztoolkit.log("--------------------");
        ztoolkit.log(_window);
        attachColorPicker(_window, _window.document, colorInput);
        attachKeystrokeInput(modalContent.querySelector(".input-keystroke"));
    }
    function removeStatus(rowId) {
        const pref = JSON.parse(getPref("statuses"));
        pref.splice(rowId, 1);
        setPref("statuses", JSON.stringify(pref));
        updateUI();
    }
    function addStatus() {
        ztoolkit.log("Add Status");
        statusModal.element.querySelector(".modal-title").textContent =
            "Add Status";
        statusModal.element.querySelector("[name=name]").value = "";
        statusModal.element.querySelector("[name=label]").value = "";
        statusModal.element.querySelector("[name=tag]").value = "";
        statusModal.element.querySelector("[name=color]").value = "";
        statusModal.element.querySelector("[name=reason]").checked = false;
        statusModal.element.querySelector("[name=default]").checked = false;
        statusModal.element.querySelector("[name=keyboardshortcut]").value = "";
        const formElement = statusModal.element.querySelector("#status-form");
        const pref = JSON.parse(getPref("statuses"));
        formElement.onsubmit = (ev) => {
            addStatusCommit(formElement, pref);
            ev.preventDefault();
        };
        statusModal.open();
    }
    function editStatus(rowId) {
        ztoolkit.log("Edit status (Id: " + rowId + ")");
        const status = allStatuses[rowId];
        statusModal.element.querySelector(".modal-title").textContent =
            `Edit Status: ${status.label}`;
        statusModal.element.querySelector("[name=name]").value = status.name;
        statusModal.element.querySelector("[name=label]").value = status.label;
        statusModal.element.querySelector("[name=tag]").value = status.tag;
        statusModal.element.querySelector("[name=color]").value = status.color;
        statusModal.element.querySelector("[name=color]").updateLabelValue();
        statusModal.element.querySelector("[name=reason]").checked =
            status.askForReason;
        statusModal.element.querySelector("[name=default]").checked =
            status.default;
        statusModal.element.querySelector("[name=keyboardshortcut]").value =
            status.keyboardShortcut;
        const formElement = statusModal.element.querySelector("#status-form");
        formElement.onsubmit = (ev) => {
            const pref = JSON.parse(getPref("statuses"));
            editStatusCommit(formElement, pref);
            ev.preventDefault();
        };
        statusModal.open();
    }
    function addStatusCommit(formElement, pref) {
        const data = {
            name: formElement?.querySelector("[name=name]")?.value,
            tag: formElement?.querySelector("[name=tag]")?.value,
            label: formElement?.querySelector("[name=label]")?.value,
            color: formElement?.querySelector("[name=color]")?.value,
            askForReason: formElement?.querySelector("[name=reason]")?.checked,
            default: formElement?.querySelector("[name=default]")?.checked,
            keyboardShortcut: formElement?.querySelector(
                "[name=keyboardshortcut]",
            )?.value,
        };
        pref.push(data);
        setPref("statuses", JSON.stringify(pref));
        updateUI();
        statusModal.close();
    }
    function editStatusCommit(formElement, pref) {
        const data = {
            name: formElement?.querySelector("[name=name]")?.value,
            tag: formElement?.querySelector("[name=tag]")?.value,
            label: formElement?.querySelector("[name=label]")?.value,
            color: formElement?.querySelector("[name=color]")?.value,
            askForReason: formElement?.querySelector("[name=reason]")?.checked,
            default: formElement?.querySelector("[name=default]")?.checked,
            keyboardShortcut: formElement?.querySelector(
                "[name=keyboardshortcut]",
            )?.value,
        };
        ztoolkit.log("--------------------------");
        ztoolkit.log(pref);
        const prefIndex = pref.findIndex((obj) => obj.name == data.name);
        if (prefIndex >= 0) {
            ztoolkit.log(prefIndex);
            pref[prefIndex] = data;
            ztoolkit.log(pref);
            setPref("statuses", JSON.stringify(pref));
        }
        ztoolkit.log("--------------------------");
        updateUI();
        statusModal.close();
    }
    function bindPrefEvents(_window) {
        _window.document
            .querySelector("#btn-add-status")
            ?.addEventListener("click", (ev) => {
                addStatus();
            });
        _window.document
            .querySelector("#btn-remove-status")
            ?.addEventListener("click", (ev) => {
                removeStatus(selectedRow);
            });
        _window.document
            .querySelector(`#zotero-prefpane-${config.addonRef}-enable`)
            ?.addEventListener("command", (e) => {
                ztoolkit.log(e);
                _.window.alert(`Successfully changed to ${e.target.checked}!`);
            });
        _window.document
            .querySelector(`#zotero-prefpane-${config.addonRef}-input`)
            ?.addEventListener("change", (e) => {
                ztoolkit.log(e);
                addon.data.prefs.window.alert(
                    `Successfully changed to ${e.target.value}!`,
                );
            });
    }
    function updateUI() {
        ztoolkit.log("Fn: updateUI");
        statusTable.render(-1);
    }
    function updatePrefsTable() {
        updateUI();
    }

    // src/utils/ztoolkit.ts
    var import_zotero_plugin_toolkit2 = __toESM(require_dist());
    var import_basic = __toESM(require_basic());
    var import_ui = __toESM(require_ui());
    var import_preferencePane = __toESM(require_preferencePane());
    function createZToolkit() {
        const _ztoolkit = new import_zotero_plugin_toolkit2.default();
        initZToolkit(_ztoolkit);
        return _ztoolkit;
    }
    function initZToolkit(_ztoolkit) {
        const env = "development";
        _ztoolkit.basicOptions.log.prefix = `[${config.addonName}]`;
        _ztoolkit.basicOptions.log.disableConsole = env === "production";
        _ztoolkit.UI.basicOptions.ui.enableElementJSONLog = true;
        _ztoolkit.UI.basicOptions.ui.enableElementDOMLog = true;
        _ztoolkit.basicOptions.debug.disableDebugBridgePassword = true;
        _ztoolkit.basicOptions.api.pluginID = config.addonID;
        _ztoolkit.ProgressWindow.setIconURI(
            "default",
            `chrome://${config.addonRef}/content/icons/favicon.png`,
        );
    }

    // src/hooks.ts
    async function onStartup() {
        await Promise.all([
            Zotero.initializationPromise,
            Zotero.unlockPromise,
            Zotero.uiReadyPromise,
        ]);
        if (true) {
            const loadDevToolWhen = `Plugin ${config.addonID} startup`;
            ztoolkit.log(loadDevToolWhen);
        }
        initLocale();
        loadPrefs();
        Zotero.PreferencePanes.register({
            pluginID: config.addonID,
            src: rootURI + "chrome/content/preferences.xhtml",
            label: getString("prefs-title"),
            // helpURL: homepage,
            image: rootURI + "chrome/content/icons/favicon.svg",
            scripts: [],
            stylesheets: [rootURI + "chrome/content/styles/styles.css"],
        });
        ReviewModule.registerExtraColumnWithBindings();
        await onMainWindowLoad(window);
    }
    async function onMainWindowLoad(win) {
        addon.data.ztoolkit = createZToolkit();
        ReviewModule.registerDOMElements();
        ReviewModule.registerStyleSheet();
    }
    async function onMainWindowUnload(win) {
        ztoolkit
            .getGlobal("document")
            .querySelector(`#${config.addonRef}-stylesheet`)
            ?.remove();
        ztoolkit.unregisterAll();
        addon.data.dialog?.window?.close();
    }
    function onShutdown() {
        ztoolkit
            .getGlobal("document")
            .querySelector(`#${config.addonRef}-stylesheet`)
            ?.remove();
        ztoolkit.unregisterAll();
        addon.data.dialog?.window?.close();
        addon.data.alive = false;
        delete Zotero[config.addonInstance];
    }
    async function onNotify(event, type, ids, extraData) {}
    async function onPrefsEvent(type, data) {
        switch (type) {
            case "change":
                reloadPrefs();
                updatePrefsTable();
                break;
            case "load":
                registerPrefsScripts(data.window);
                break;
            default:
                return;
        }
    }
    function onShortcuts(type) {}
    function onDialogEvents(type) {}
    var hooks_default = {
        onStartup,
        onShutdown,
        onMainWindowLoad,
        onMainWindowUnload,
        onNotify,
        onPrefsEvent,
        onShortcuts,
        onDialogEvents,
    };

    // src/addon.ts
    var Addon = class {
        constructor() {
            this.data = {
                alive: true,
                env: "development",
                ztoolkit: createZToolkit(),
            };
            this.hooks = hooks_default;
            this.api = {};
        }
    };
    var addon_default = Addon;

    // src/index.ts
    var basicTool = new import_basic2.BasicTool();
    if (!basicTool.getGlobal("Zotero")[config.addonInstance]) {
        defineGlobal("window");
        defineGlobal("document");
        defineGlobal("ZoteroPane");
        defineGlobal("Zotero_Tabs");
        _globalThis.addon = new addon_default();
        defineGlobal("ztoolkit", () => {
            return _globalThis.addon.data.ztoolkit;
        });
        Zotero[config.addonInstance] = addon;
    }
    function defineGlobal(name, getter) {
        Object.defineProperty(_globalThis, name, {
            get() {
                return getter ? getter() : basicTool.getGlobal(name);
            },
        });
    }
})();
