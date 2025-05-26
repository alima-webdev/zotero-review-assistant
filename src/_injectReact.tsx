// External Dependencies
import { createRoot } from 'react-dom/client';
import { ReactNode } from 'react';

// Internal Dependencies
import { setPluginInfo } from './utils/pluginInfo';
import PreferencePane from "./views/preferencesView"

// Types
import { AddonInitProps } from './types/types';

// Devtools
import { log } from './utils/devtools';

// Types
interface injectReactProps extends AddonInitProps {
    component: ReactNode
}

// Inject function
export function injectReact({ component, id, version, rootURI, referenceName }: injectReactProps) {

    // Define the globals.info object
    setPluginInfo({ id, version, rootURI, referenceName })

    const root = createRoot(document.getElementById("app") as HTMLElement)
    root.render(component)
}