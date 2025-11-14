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
import { registerExtraColumns } from './extraColumns';
import { registerContextMenu, registerReviewContextMenu } from './contextMenu';
import { usePreferencesPanelReact } from './utils/hooks';

// This is the entry point for the Zotero add-on
export async function init({ id, version, rootURI, referenceName }: AddonInitProps) {

    // Define the globals.info object
    setPluginInfo({ id, version, rootURI, referenceName })

    // Register Extra Columns
    // await registerExtraColumns(id)
    // window.colFn = registerExtraColumns
    
    // log(registerExtraColumns)
    // log(id)

    // // Register Context Menu
    // await registerReviewContextMenu(id, version, rootURI, referenceName)

    // // Preferences
    // await usePreferencesPanelReact({
    //     id: "main", // Has to match the file name (e.g., .src/preferences/main.pn.tsx => id: "main")
    //     label: "Zotero Review Assistant",
    //     image: "assets/icons/favicon.svg",
    //     stylesheets: ["styles/styles.css"]
    // })

    // // Inject the CSS styles
    // const styles = document.createElement("link")
    // styles.href = `${rootURI}/styles/styles.css`
    // styles.rel = "stylesheet"
    // document.documentElement.appendChild(styles)

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

export async function onMainWindowUnload({ window }: { window: Window }) {
    await unregisterAllColumns()
    const app = document.getElementById(getPluginInfo().referenceName + "-app")
    app?.remove()
}