import { ArticleStatus } from "./types/addon"
import { MenuItem, usePrefStateFunction } from "./types/types"
import { setItemStatus } from "./utils/columns.utils"
import { log } from "./utils/devtools"
import { generateMenuIcon } from "./utils/helpers"
import { generateMenuDOM } from "./utils/hooks/menu"
import { usePrefWithoutHook } from "./utils/hooks/prefs"
import { getPluginInfo } from "./utils/pluginInfo"
import defaultPreferences from "./utils/prefs.default"

export async function registerReviewContextMenu(id: string, version: string, rootURI: string, referenceName: string) {
    // Preferences
    const [statusList, setStatusList] = usePrefWithoutHook("statusList", defaultPreferences.statusList, { parseJSON: true, observe: true }) as [ArticleStatus[], usePrefStateFunction]

    log(statusList)

    // Context Menu
    registerContextMenu("#zotero-itemmenu", [
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
                    log("Edit Review Info clicked")
                    // if (typeof Zotero === "undefined" || !Zotero.getMainWindow()) return
                    // if (typeof (Zotero.getMainWindow() as any).editStatus !== "function") return
                    Zotero.getMainWindow()[referenceName].editStatus()
                }
            },
            { type: "menuseparator" },
            {
                type: "menuitem", label: "Generate PRISMA Diagram", action: () => {
                    // if (typeof Zotero === "undefined" || !Zotero.getMainWindow()) return
                    // if (typeof (Zotero.getMainWindow() as any).generatePRISMADiagram !== "function") return
                    Zotero.getMainWindow()[referenceName].generatePRISMADiagram()
                }
            }]
        },
    ])
}
/**
 * Custom hook to create and manage a context menu.
 *
 * @param {string} [selector="zotero-itemmenu"] - The ID of the DOM element where the context menu will be appended.
 * @param {MenuItem[]} [items=[]] - An array of menu items to be added to the context menu.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 *
 * @returns {void}
 *
 * @example
 * useContextMenu("custom-menu", [{ label: "Item 1", action: () => console.log("Item 1 clicked") }], [dependency]);
 */
export async function registerContextMenu(selector: string = "zotero-itemmenu", items: MenuItem[] = []) {

    await log("registerContextMenu called ", selector)
    const popup = document.querySelector(selector)
    await log("Popup: ", popup)
    if (!popup) return
    const elements = items.map(item => {
        const element = generateMenuDOM(item)
        log("Element created:", element)

        if (!popup.lastElementChild) return
        popup.lastElementChild.after(element)
        return element
    })
    return () => {
        elements.map(element => element?.remove())
    }
}