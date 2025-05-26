// Devtools
import { log } from "./utils/devtools";
import { setPluginInfo } from "./utils/pluginInfo";

// import  from "../package.json"

// Log when Zotero initializes the plugin
// log("ZOTERO INIT")

// Plugin Options
// Use referenceName for the reference name to be used

// Consts
const mainWindow = Zotero.getMainWindow()

// Install
function install(props) {
    log("Install", props)
    // registerPrefs()
    // startup()
}

// Startup
type StartupProps = {
    id: string,
    version: string,
    rootURI: string,
}
async function startup({ id, version, rootURI }: StartupProps) {
    log("Startup", { id, version, rootURI, referenceName })

    // Set the plugin info for internal use
    setPluginInfo({ id, version, rootURI, referenceName })

    // Wait for Zotero to be ready
    await Promise.all([
        Zotero.initializationPromise,
        Zotero.unlockPromise,
        Zotero.uiReadyPromise,
    ]);

    // String 'rootURI' introduced in Zotero 7
    if (!rootURI) {
        // @ts-ignore legacy support for Zotero 6
        rootURI = resourceURI.spec;
    }
    
    // UI
    // JS
    await Services.scriptloader.loadSubScript(rootURI + "/index.js", Zotero.getMainWindow());

    // Init
    Zotero.getMainWindow()[referenceName].init({ id, version, rootURI, referenceName });
}

function onMainWindowLoad(props) {
    log("onMainWindowLoad", props)
    if (mainWindow[referenceName].onMainWindowLoad) {
        mainWindow[referenceName].onMainWindowLoad({ window });
    }
}

function onMainWindowUnload(props) {
    log("onMainWindowUnlad", props)
    if (mainWindow[referenceName].onMainWindowUnload) {
        mainWindow[referenceName].onMainWindowUnload({ window });
    }
}

function shutdown(props) {
    log("Shutdown", props)
    if (Zotero.getMainWindow()[referenceName].shutdown) {
        Zotero.getMainWindow()[referenceName].shutdown(props);
        // mainWindow[referenceName] = undefined
    }
}

function uninstall(props) {
    log("Uninstall", props)
    if (mainWindow[referenceName].uninstall) {
        mainWindow[referenceName].uninstall();
    }
}
