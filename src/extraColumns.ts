// import { ArticleStatus, PRISMACategory } from "./types/addon"
// import { getPRISMALabel } from "./utils/columns.utils"
import { ArticleStatus } from "./types/addon"
import { getPRISMALabel, registerColumn } from "./utils/columns.utils"
import { log, wait } from "./utils/devtools"
import { getZoteroPref } from "./utils/prefs"
// import { registerColumn } from "./utils/hooks/columns"

import { JSONFromString } from "./utils/utils"

export async function registerExtraColumns(id) {

    // Prefs
    const statusList = JSONFromString(getZoteroPref("statusList") as string) as ArticleStatus[]
    const prismaCategories = JSONFromString(getZoteroPref("prismaCategories") as string) as PRISMACategory[]
    const prismaTagPrefix = getZoteroPref("prismaTagPrefix") as string
    const commentsTagPrefix = getZoteroPref("commentsTagPrefix") as string

    log("Prefs")
    log("- statusList", statusList)
    log("- prismaCategories", prismaCategories)
    log("- prismaTagPrefix", prismaTagPrefix)
    log("- commentsTagPrefix", commentsTagPrefix)

    // Hooks
    // -- Status
    const statusDataKey = await registerColumn({
        pluginID: id,
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
                const element = Zotero.getMainWindow().document.createElement("span")
                element.className = `cell ${column.className}` // Do not remove this or the column will look weird

                // Set the innerHTML
                element.innerHTML = data.map(item => `<span class="rt-badge  ${item.invertTextColor ? "invert-text" : ""}" style="background-color: ${item.color};">${item.label}</span>`).join("")

                // Return the created cell element
                return element
            } catch {
                const fallbackElement = Zotero.getMainWindow().document.createElement("span")
                fallbackElement.className = `cell ${column.className}` // Do not remove this or the column will look weird
                return fallbackElement
            }
        }
    })
    // -- PRISMA
    const prismaDataKey = await registerColumn({
        pluginID: id,
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
    const commentsDataKey = await registerColumn({
        pluginID: id,
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

    // Sometimes other plugins may delay the this plugin's initialization,
    // this ensures the item tree refreshes properly and prevents glitches with column resizing
    log("RELOAD")
    // await new Promise<void>((resolve, reject) => {
    //     Zotero.getMainWindow().addEventListener("load", () => {
    //         resolve();
    //     });
    // });
    Zotero.getMainWindow().location.reload();
    await wait(100)
    log("DONE")

    return { statusDataKey, prismaDataKey, commentsDataKey }
}