import { usePrefValue } from "../types/types"
import { getPluginInfo } from "./pluginInfo"

export function setZoteroPref(name: string, value: usePrefValue) {
    Zotero.Prefs.set(`${getPluginInfo().referenceName}.${name}`, value)
}

export function getZoteroPref(name: string): usePrefValue {
    return Zotero.Prefs.get(`${getPluginInfo().referenceName}.${name}`) as usePrefValue
}