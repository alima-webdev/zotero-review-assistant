// External Dependencies
import { createRoot } from 'react-dom/client';

// Internal Dependencies
import { getPluginInfo, setPluginInfo } from './utils/pluginInfo';
import PreferencePane from "./views/preferencesView"

// Types
import { AddonInitProps } from './types/types';

// Devtools
import { log, wait } from './utils/devtools';



import pkg from "../package.json" assert { type: "json" };
// Init function
// export function init({ id, version, rootURI, referenceName }: AddonInitProps) {

// Define the globals.info object
// setPluginInfo({ id, version, rootURI, referenceName })

function getPreferencePane(id: string) {
    return Zotero.PreferencePanes.pluginPanes.find(p => p.pluginID === id)
}
const pluginId = pkg["zotero-react"].plugin.id
const prefPane = getPreferencePane(pluginId)

setPluginInfo({
    id: pluginId,
    version: pkg.version,
    rootURI: `chrome://${pluginId}/content/`,
    referenceName: pkg["zotero-react"].plugin.namespace,
})

async function initPreferencesPane() {
    await wait(1000)
    if (document.querySelector(`[data-plugin-id="${pluginId}"]`) === null) {
        initPreferencesPane()
        return;
    }

    document.querySelector("window").addEventListener("beforeunload", () => {
        log("Unloading Preferences Pane")
    })

    const container = document.querySelector(`[data-plugin-id="${pluginId}"] #app`) as HTMLElement
    log("###############################################################")

    log("index.tsx: Initializing Preferences Pane")
    log(container)

    const root = createRoot(container)
    root.render(<PreferencePane />)
}
initPreferencesPane()