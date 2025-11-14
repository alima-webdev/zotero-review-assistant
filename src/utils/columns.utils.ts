import { ArticleStatus, PRISMACategory } from "../types/addon"
import { log } from "./devtools"
import { getPluginInfo } from "./pluginInfo"


// const extraColumns: string[] = []
// export const extraColumns: string[] = []
export async function registerColumn(options: _ZoteroTypes.ItemTreeManager.ItemTreeColumnOptions) {
    log("columns.utils: registerColumn", options)
    // log(Object.keys(Zotero.getMainWindow()))
    // log(getPluginInfo().referenceName)
    if (!Zotero.getMainWindow()[getPluginInfo().referenceName]) { return; }
    if (!Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns) { return; }
    // const extraColumns: string[] = []
    // Ensure the column options includes dataKey
    if (Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns.includes(options.dataKey)) return

    // const pluginID = getPluginInfo().id + "-" + extraColumns.length

    // Column Options
    const columnOptions = { ...options } //, pluginID }

    const registerColumnFn =
        Zotero.ItemTreeManager.registerColumn ||
        Zotero.ItemTreeManager.registerColumns;
        // @ts-ignore
    const dataKey = await registerColumnFn.apply(Zotero.ItemTreeManager, [{ ...columnOptions }])
    // const dataKey = await Zotero.ItemTreeManager.registerColumn(columnOptions)
    if (!dataKey) return;

    Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns.push(dataKey)
    // await Zotero.ItemTreeManager.refreshColumns()
}

export async function unregisterAllColumns() {
    Zotero.getMainWindow().console.log(Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns)
    if (!Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns) return
    if (Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns.length === 0) return
    await Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns.map(async (dataKey: string) => {
        await Zotero.ItemTreeManager.unregisterColumn(dataKey)
    })
    Zotero.getMainWindow()[getPluginInfo().referenceName].extraColumns = []
}

export function setItemStatus(statusList: ArticleStatus[], status: ArticleStatus) {

    // Get the selected items
    const selectedArticles = ZoteroPane.getSelectedItems()
    replaceTags({
        articles: selectedArticles,
        removeTags: statusList.map(stat => stat.tag) as string[],
        newTags: status ? [status.tag] : []
    })

    // // Loop through the articles and set the status
    // selectedArticles.map(article => {

    //     // Remove the old status tag
    //     statusList.map(stat => {
    //         if (article.hasTag(stat.tag)) article.removeTag(stat.tag)
    //     })
    //     // statuses.filter(status => item.hasTag(status.tag))
    //     // Add the new status tag
    //     if (status.tag != "") article.addTag(status.tag)

    //     // Save the article
    //     article.saveTx()
    // })
}

export function setItemComments(commentsTagPrefix: string, comments: string) {

    // Selected articles
    const selectedArticles = ZoteroPane.getSelectedItems()

    // Get the reason tag
    const reasonTag = commentsTagPrefix + comments;

    // Update the exclusion criteria
    for (const item of selectedArticles) {
        // Remove the exclusion criteria
        item.getTags().map((tag) => {
            if (tag.tag.includes(commentsTagPrefix)) item.removeTag(tag.tag);
        });

        if (comments != "") {
            item.addTag(reasonTag);
        }
        item.saveTx();
    }
}

export function getPRISMALabel(value: string): string {
    return value.replace(":", " ›")
}

export function setItemPRISMACategory(categoryList: PRISMACategory[], newCategory: PRISMACategory) {

    // Selected articles
    const selectedArticles = ZoteroPane.getSelectedItems()

    replaceTags({
        articles: selectedArticles,
        removeTags: categoryList.map(stat => stat.tag) as string[],
        newTags: newCategory ? [newCategory.tag] : []
    })

}

type ReplaceTagsArgs = {
    articles: Zotero.Item[],
    removeTags: string[],
    newTags: string[]
}
function replaceTags({ articles, removeTags, newTags }: ReplaceTagsArgs) {

    // Loop through the articles and set the status
    articles.map(article => {

        // Remove the old status tag
        removeTags.map(tag => {
            if (article.hasTag(tag)) article.removeTag(tag)
        })

        // Add the new status tag

        // Remove the old status tag
        newTags.map(tag => {
            if (tag && tag != "") article.addTag(tag)
        })

        // Save the article
        article.saveTx()
    })
}