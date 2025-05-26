// External Dependencies
import { useState } from "react"

// Internal Dependencies
import { getPluginInfo } from "../pluginInfo"
import { JSONFromString } from "../utils"

// Types
import { usePrefValue, usePrefOptions, usePrefState, usePrefStateValue } from "../../types/types"
import { log } from "../devtools"
import { getZoteroPref, setZoteroPref } from "../prefs"

// Hook
export function usePref(prefName: string, defaultValue: any = "", options: usePrefOptions = { parseJSON: false, observe: false }): usePrefState {

    // Get the initial value
    let initialPrefValue = getZoteroPref(prefName)

    // Use default value if pref is empty
    if (!initialPrefValue) {
        initialPrefValue = defaultValue
        setZoteroPref(prefName, options.parseJSON ? JSON.stringify(defaultValue) : defaultValue)
    } else if (options.parseJSON === true) {
        initialPrefValue = JSONFromString(initialPrefValue as string, undefined)
    }

    // State
    const [prefState, setPrefState] = useState<usePrefStateValue>(initialPrefValue)

    // Set Pref
    const setPref = (value: any) => {
        setZoteroPref(prefName, options.parseJSON == true ? JSON.stringify(value) : value)
        setPrefState(value)
    }

    // Observe the pref for changes
    if (options.observe === true) {
        Zotero.Prefs.registerObserver(`${getPluginInfo().referenceName}.${name}`, async (value: usePrefStateValue) => {
            let newValue = value
            if (options.parseJSON === true) {
                newValue = JSONFromString(newValue as string, undefined)
            }
            setPrefState(newValue)
        });
    }

    // Return
    return [prefState, setPref]

}