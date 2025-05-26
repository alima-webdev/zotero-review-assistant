// External Dependencies
import { createRoot } from 'react-dom/client';
// Internal Dependencies
import { getPluginInfo, setPluginInfo } from './utils/pluginInfo';

// Main React Component
import Addon from "./addon"

// Types
import { AddonInitProps } from "./types/types"
import { unregisterAllColumns } from './utils/columns.utils';
import { log } from './utils/devtools';

// This is the entry point for the Zotero add-on
export function init({ id, version, rootURI, referenceName }: AddonInitProps) {

    // Define the globals.info object
    setPluginInfo({ id, version, rootURI, referenceName })

    const styles = document.createElement("link")
    styles.href = `${rootURI}/styles/styles.css`
    styles.rel = "stylesheet"
    document.documentElement.appendChild(styles)

    // Create the react plugin element and render
    const appElement = document.createElement("div")
    appElement.id = referenceName + "-app"
    document.documentElement.appendChild(appElement)
    const root = createRoot(appElement);
    root.render(<Addon />)
}

export async function shutdown() {
    log("index.ts: shutdown")
    await unregisterAllColumns()
    const app = document.getElementById(getPluginInfo().referenceName + "-app")
    app?.remove()
}

export async function onMainWindowUnload({ window }) {
    await unregisterAllColumns()
    const app = document.getElementById(getPluginInfo().referenceName + "-app")
    app?.remove()
}