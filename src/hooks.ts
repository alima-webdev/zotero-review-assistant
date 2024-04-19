import { ReviewModule } from "./ui/itemTree";
import { config } from "../package.json";
import { getString, initLocale } from "./utils/locale";
// import { registerPrefsScripts } from "./modules/preferenceScript";
import { createZToolkit } from "./utils/ztoolkit";
import { loadPrefs, reloadPrefs } from "./lib/global";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  // TODO: Remove this after zotero#3387 is merged
  if (__env__ === "development") {
    // Keep in sync with the scripts/startup.mjs
    const loadDevToolWhen = `Plugin ${config.addonID} startup`;
    ztoolkit.log(loadDevToolWhen);
  }

  initLocale();
  loadPrefs();

  // Zotero.PreferencePanes.register({
  //   pluginID: config.addonID,
  //   src: rootURI + "chrome/content/preferences.xhtml",
  //   label: getString("prefs-title"),
  //   // helpURL: homepage,
  //   image: rootURI + "chrome/content/icons/favicon.png",
  //   scripts: [],
  //   stylesheets: [rootURI + "chrome/content/zoteroPane.css"]
  // });

  ReviewModule.registerExtraColumnWithBindings();

  await onMainWindowLoad(window);
}

async function onMainWindowLoad(win: Window): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit();

  ReviewModule.registerDOMElements();
  ReviewModule.registerStyleSheet();

  // await Zotero.Promise.delay(1000);
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  addon.data.dialog?.window?.close();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log("notify", event, type, ids, extraData);
  if (
    event == "select" &&
    type == "tab" &&
    extraData[ids[0]].type == "reader"
  ) {
    // BasicExampleFactory.exampleNotifierCallback();
  } else {
    return;
  }
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  ztoolkit.log("PREFSSS")
  switch (type) {
    case "change":
      reloadPrefs()
      break;
    case "load":
      // registerPrefsScripts(data.window);
      ztoolkit.log("Prefs Script Loaded");
      break;
    default:
      return;
  }
}

function onShortcuts(type: string) {}

function onDialogEvents(type: string) {}

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onShortcuts,
  onDialogEvents,
};
