// External Dependencies
// Internal Dependencies
import defaultPreferences from "./utils/prefs.default"
import { useContextMenu, useExtraColumn, useKeyboardShortcut, usePref, usePreferencesPanelReact } from "./utils/hooks"

// Types
import { MenuItem, usePrefStateFunction } from "./types/types"
import { ArticleStatus, PRISMACategory } from "./types/addon"

// Devtools
import { generateMenuIcon } from "./utils/helpers"
import { setItemStatus, getPRISMALabel } from "./utils/columns.utils"
import { useEffect, useRef } from "react"
import StatusView, { StatusViewComponent } from "./views/statusView"
import PRISMAView, { PRISMAViewComponent } from "./views/prismaView"
import { log } from "./utils/devtools"
import { getPluginInfo } from "./utils/pluginInfo"

export default function Addon() {

    // log("ADDON")

    // Preferences
    usePreferencesPanelReact({
        id: "main", // Has to match the file name (e.g., .src/preferences/main.pn.tsx => id: "main")
        label: "Zotero Review Assistant",
        image: "assets/icons/favicon.svg",
        stylesheets: ["styles/styles.css"]
    })
    
    // Prefs
    const [statusList, setStatusList] = usePref("statusList", defaultPreferences.statusList, { parseJSON: true, observe: true }) as [ArticleStatus[], usePrefStateFunction]

    // Extra Columns
    // -- Status

    // -- PRISMA Category
    const [prismaCategories,] = usePref("prismaCategories", defaultPreferences.prismaCategories, { parseJSON: true, observe: true }) as [PRISMACategory[], usePrefStateFunction]
    const [prismaTagPrefix,] = usePref("prismaTagPrefix", defaultPreferences.prismaTagPrefix, { observe: true }) as [string, usePrefStateFunction]

    // -- Comments
    const [commentsTagPrefix,] = usePref("commentsTagPrefix", defaultPreferences.commentsTagPrefix, { observe: true }) as [string, usePrefStateFunction]

    // Hooks
    // -- Status
    useExtraColumn({
        dataKey: 'status',
        label: 'Status',
        dataProvider: (item: Zotero.Item, _) => {
            return JSON.stringify(statusList.filter(status => item.hasTag(status.tag)))
        },
        renderCell: (index: number, rawData: string, column: any): HTMLElement => {
            // Get the data
            try {
                const data = JSON.parse(rawData) as ArticleStatus[]

                // Create the cell element
                const element = document.createElement("span")
                element.className = `cell ${column.className}` // Do not remove this or the column will look weird

                // Set the innerHTML
                element.innerHTML = data.map(item => `<span class="rt-badge  ${item.invertTextColor ? "invert-text" : ""}" style="background-color: ${item.color};">${item.label}</span>`).join("")

                // Return the created cell element
                return element
            } catch {
                const fallbackElement = document.createElement("span")
                fallbackElement.className = `cell ${column.className}` // Do not remove this or the column will look weird
                return fallbackElement
            }
        }
    })
    // -- PRISMA
    useExtraColumn({
        dataKey: 'prisma',
        label: 'PRISMA Category',
        dataProvider: (item: Zotero.Item, _: string) => {
            try {
                let res = item.getTags().filter(tag => prismaCategories.find(cat => cat.tag == tag.tag))
                if (res.length < 1) {
                    return ""
                }
                return getPRISMALabel(res[0].tag.replace(prismaTagPrefix, ""))
            } catch {
                return ""
            }
        }
    })
    // -- Comments
    useExtraColumn({
        dataKey: 'comments',
        label: 'Status Comments',
        dataProvider: (item: Zotero.Item, _: string) => {
            let res = item.getTags().filter(tag => tag.tag.startsWith(commentsTagPrefix))
            if (res.length < 1) {
                return ""
            }
            return res[0].tag.replace(commentsTagPrefix, "")
        }
    })

    // Context Menu
    useContextMenu("zotero-itemmenu", [
        { type: "menuseparator" },
        {
            type: "menu", label: "Review",
            // image: getPluginInfo().rootURI + "assets/icon.png",
            children: [...statusList.map((status: ArticleStatus) => {
                return {
                    type: "menuitem", label: status.label, image: generateMenuIcon(status.color), action: (_) => {
                        setItemStatus(statusList, status)
                    }
                }
            }) as MenuItem[],
            { type: "menuseparator" },
            {
                type: "menuitem", label: "Edit Review Info", action: () => {
                    editStatus()
                }
            },
            { type: "menuseparator" },
            {
                type: "menuitem", label: "Generate PRISMA Diagram", action: () => {
                    generatePRISMADiagram()
                }
            }]
        },
    ], [statusList])

    // Keyboard Shortcuts
    // -- Status
    for (let status of statusList) {
        if (status.keystroke == null) continue
        useKeyboardShortcut(status.keystroke, () => {
            setItemStatus(statusList, status)
        })
    }

    // Refs
    const statusViewRef = useRef<StatusViewComponent>(null)
    const prismaViewRef = useRef<PRISMAViewComponent>(null)

    // Open modal functions
    const editStatus = () => {
        statusViewRef.current?.edit()
    }
    const generatePRISMADiagram = () => {
        prismaViewRef.current?.open()
    }


    // setTimeout(async () => {
    //     await deregisterColumns()
    // }, 10000)

    // console.log("REFRESH")
    return <>
        <StatusView ref={statusViewRef} />
        <PRISMAView ref={prismaViewRef} />
    </>
}