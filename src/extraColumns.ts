import { ArticleStatus, PRISMACategory } from "./types/addon"
import { getPRISMALabel, registerColumn, unregisterAllColumns } from "./utils/columns.utils"
import { getPluginInfo } from "./utils/pluginInfo"
import { getZoteroPref } from "./utils/prefs"

import { JSONFromString } from "./utils/utils"

export async function registerExtraColumns(id: string) {

    await unregisterAllColumns()
    if (!Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns) {
        Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns = []
    }

    // Prefs
    const statusList = JSONFromString(getZoteroPref("statusList") as string) as ArticleStatus[]
    const prismaCategories = JSONFromString(getZoteroPref("prismaCategories") as string) as PRISMACategory[]
    const prismaTagPrefix = getZoteroPref("prismaTagPrefix") as string
    const commentsTagPrefix = getZoteroPref("commentsTagPrefix") as string

    // await log("Prefs")
    // await log("- statusList", statusList)
    // await log("- prismaCategories", prismaCategories)
    // await log("- prismaTagPrefix", prismaTagPrefix)
    // await log("- commentsTagPrefix", commentsTagPrefix)

    // Hooks
    // -- Status
    const statusDataKey = await registerColumn({
        pluginID: id,
        dataKey: 'status',
        label: 'Status',
        flex: 1,
        minWidth: 50,
        width: "100px",
        zoteroPersist: ["width", "hidden", "sortDirection"],
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
                data.map(item => {
                    const element = Zotero.getMainWindow().document.createElement("span")
                    element.className = `rt-badge ${item.invertTextColor ? "invert-text" : ""}`
                    element.style.backgroundColor = item.color
                    element.innerHTML = item.label
                    return element
                }).forEach(spanElement => {
                    element.append(spanElement)
                })

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
        flex: 1,
        minWidth: 100,
        width: "200px",
        zoteroPersist: ["width", "hidden", "sortDirection"],
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
        flex: 1,
        minWidth: 100,
        width: "200px",
        zoteroPersist: ["width", "hidden", "sortDirection"],
        dataProvider: (item: Zotero.Item, _: string) => {
            let res = item.getTags().filter(tag => tag.tag.startsWith(commentsTagPrefix))
            if (res.length < 1) {
                return ""
            }
            return res[0].tag.replace(commentsTagPrefix, "")
        }
    })

    return { statusDataKey, prismaDataKey, commentsDataKey }
}