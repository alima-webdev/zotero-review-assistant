// External Dependencies
import { createRoot } from 'react-dom/client';

// Internal Dependencies
import { setPluginInfo } from '../utils/pluginInfo';
import PreferencePane from "../views/preferencesView"

// Types
import { AddonInitProps } from '../types/types';

// Devtools
import { log } from '../utils/devtools';

// Init function
export function init({ id, version, rootURI, referenceName }: AddonInitProps) {

    // Define the globals.info object
    setPluginInfo({ id, version, rootURI, referenceName })

    const root = createRoot(document.getElementById("app") as HTMLElement)
    root.render(<PreferencePane />)
}