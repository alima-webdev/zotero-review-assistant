import { usePreferencesPanelReactProps, usePreferencesProps } from "../../types/types";
import { log } from "../devtools";
import { getPluginInfo } from "../pluginInfo";

// Preference Panels
export const preferencesPanels: (usePreferencesPanelReactProps | usePreferencesProps)[] = []

// Preferences Panel in XHTML
export function usePreferencesPanel(props: usePreferencesProps) {

    // Check if the panel has been registered already and if an id has been provided
    if (preferencesPanels.filter(panel => panel.id === props.id).length > 0 || props.id === "") return
    preferencesPanels.push({ ...props, type: "xhtml" })

    if (getPluginInfo().id === "") return
    Zotero.PreferencePanes.register({
        pluginID: getPluginInfo().id,
        label: props.label ? props.label : undefined,
        image: props.image ? getPluginInfo().rootURI + props.image : undefined,
        src: getPluginInfo().rootURI + props.src,
        scripts: props.scripts?.map(url => getPluginInfo().rootURI + url) || [],
        stylesheets: props.stylesheets?.map(url => getPluginInfo().rootURI + url) || [],
    });
}

// Preferences Panel in React
export async function usePreferencesPanelReact(props: usePreferencesPanelReactProps) {

    // Check if the panel has been registered already and if an id has been provided
    if (preferencesPanels.filter(panel => panel.id === props.id).length > 0 || props.id === "") return
    preferencesPanels.push({ ...props, type: "react" })

    // Generate the pseudo URL for the boilerplate XHTML

    const { id, version, rootURI, referenceName } = getPluginInfo()

    const htmlURL = URL.createObjectURL(new Blob([`
        <html:div id="plugin-container" data-plugin-id="${id}" data-plugin-version="${version}" data-plugin-rooturi="${rootURI}" data-plugin-referencename="${referenceName}">
            <div id="app">
            </div>
        </html:div>
    `], { type: "text/html" }));

    // Generate the JS file url
    let scripts = [getPluginInfo().rootURI + `preferences.js`]
    if (props.additionalScripts) {
        scripts = [...scripts, ...props.additionalScripts?.map(url => getPluginInfo().rootURI + url) || []]
    }

    log(getPluginInfo().id)

    // Register the pane
    await Zotero.PreferencePanes.register({
        pluginID: getPluginInfo().id,
        label: props.label ? props.label : undefined,
        image: props.image ? getPluginInfo().rootURI + props.image : undefined,
        stylesheets: props.stylesheets?.map(url => getPluginInfo().rootURI + url) || [],
        src: htmlURL,
        scripts: scripts,
    });
}
