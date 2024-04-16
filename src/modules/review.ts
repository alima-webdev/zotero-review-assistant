import { config } from "../../package.json";
import { getString } from "../utils/locale";

var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

function module(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const original = descriptor.value;
    descriptor.value = function (...args: any) {
        try {
            ztoolkit.log(`Calling module ${target.name}.${String(propertyKey)}`);
            return original.apply(this, args);
        } catch (e) {
            ztoolkit.log(`Error in module ${target.name}.${String(propertyKey)}`, e);
            throw e;
        }
    };
    return descriptor;
}

// Tag fields
const TAG_INCLUDE = '!review:include'
const TAG_EXCLUDE = '!review:exclude'
const TAG_PENDING = '!review:pending'
const TAG_UNSURE = '!review:unsure'
const TAG_NOT_REVIEWED = '!review:not-reviewed'
const TAG_REASON_PREFIX = '!review:exclude:'
const TAG_STATUSES = [TAG_INCLUDE, TAG_EXCLUDE, TAG_PENDING, TAG_UNSURE, TAG_NOT_REVIEWED]

function getReviewStatusId(item: Zotero.Item) {
    let status = ""
    if (item.hasTag(TAG_INCLUDE)) status = TAG_INCLUDE
    else if (item.hasTag(TAG_EXCLUDE)) status = TAG_EXCLUDE
    else if (item.hasTag(TAG_PENDING)) status = TAG_PENDING
    else if (item.hasTag(TAG_UNSURE)) status = TAG_UNSURE
    else status = TAG_NOT_REVIEWED
    return status
}

function getReviewStatusLabel(statusId: string) {
    let status = ""
    if (statusId == TAG_INCLUDE) status = "Include"
    else if (statusId == TAG_EXCLUDE) status = "Exclude"
    else if (statusId == TAG_PENDING) status = "Pending"
    else if (statusId == TAG_UNSURE) status = "Unsure"
    else if (statusId == TAG_NOT_REVIEWED) status = "Not Reviewed"
    return status
}

// Review Status
const columnId = '123'
const columnName = 'Review Status'
const getColumnFieldHook = (
    field: string,
    unformatted: boolean,
    includeBaseMapped: boolean,
    item: Zotero.Item
) => {
    const reviewStatusId = getReviewStatusId(item)
    return String(reviewStatusId)
}

function renderReviewCell(index: number, data: string, column: any): HTMLElement {
    const element = document.createElement('span');
    element.className = `cell ${column.className} review-container`;
    const innerElement = document.createElement('div')
    innerElement.classList.add('review')
    innerElement.classList.add(data.split(':')[1])
    innerElement.textContent = getReviewStatusLabel(data)
    element.appendChild(innerElement)
    return element
}
const columnOptions = { renderCell: renderReviewCell }

// Reason for exclusion
const columnReasonId = '456'
const columnReasonName = 'Reason for Exclusion'
const getColumnReasonFieldHook = (
    field: string,
    unformatted: boolean,
    includeBaseMapped: boolean,
    item: Zotero.Item
) => {
    const tags = item.getTags()
    ztoolkit.log("getColumnReasonFieldHook")
    for (const tag of tags) {
        ztoolkit.log(tag)
        if (tag.tag.includes(TAG_REASON_PREFIX)) {
            ztoolkit.log("REASON FOR EXCLUSION")

            return tag.tag.replace(TAG_REASON_PREFIX, '')
        }
    }
    ztoolkit.log("End: getColumnReasonFieldHook")
    return ''
}
const columnReasonOptions = {}

let reviewStatusSelector;

export class ReviewModule {
    @module
    static registerStyleSheet() {
        const styles = ztoolkit.UI.createElement(document, "link", {
            properties: {
                type: "text/css",
                rel: "stylesheet",
                href: `chrome://${config.addonRef}/content/zoteroPane.css`,
            },
        });
        document.documentElement.appendChild(styles);
    }

    @module
    static registerExtraColumnWithBindings() {
        // Register the extra fields
        ztoolkit.ItemTree.register(columnId, columnName, getColumnFieldHook, columnOptions)
        ztoolkit.ItemTree.register(columnReasonId, columnReasonName, getColumnReasonFieldHook, columnReasonOptions)

        // Register the context menu items
        ztoolkit.Menu.register(
            "item", { tag: "menuseparator" }
        )
        ztoolkit.Menu.register(
            "item",
            {
                tag: "menu",
                label: getString("contextmenu-status"),
                children: [
                    {
                        tag: "menuitem",
                        label: getString("contextmenu-status-include"),
                        icon: "chrome://addontemplate/content/icons/include.svg",
                        oncommand: `document.setReviewStatus('${TAG_INCLUDE}')`,
                    },
                    {
                        tag: "menuitem",
                        label: getString("contextmenu-status-exclude"),
                        icon: "chrome://addontemplate/content/icons/exclude.svg",
                        oncommand: `document.setReviewStatus('${TAG_EXCLUDE}');`,
                    },
                    {
                        tag: "menuitem",
                        label: getString("contextmenu-status-pending"),
                        icon: "chrome://addontemplate/content/icons/pending.svg",
                        oncommand: `document.setReviewStatus('${TAG_PENDING}')`,
                    },
                    {
                        tag: "menuitem",
                        label: getString("contextmenu-status-unsure"),
                        icon: "chrome://addontemplate/content/icons/unsure.svg",
                        oncommand: `document.setReviewStatus('${TAG_UNSURE}')`,
                    },
                    {
                        tag: "menuitem",
                        label: getString("contextmenu-status-notreviewed"),
                        icon: "chrome://addontemplate/content/icons/notreviewed.svg",
                        oncommand: `document.setReviewStatus('${TAG_NOT_REVIEWED}')`,
                    },
                ],
            }
        );

        // Register the global functions
        ztoolkit.getGlobal('document').setReviewStatus = (status: string) => {
            ztoolkit.log("setReviewStatus")
            const selectedItems = ztoolkit.getGlobal("ZoteroPane").getSelectedItems()
            for (const item of selectedItems) {
                // Remove the old tag status
                for (const tag of TAG_STATUSES) {
                    item.removeTag(tag)
                }

                // Remove the exclusion criteria
                item.getTags().map(tag => {
                    if (tag.tag.includes(TAG_REASON_PREFIX)) item.removeTag(tag.tag)
                })
                item.addTag(status)
                item.saveTx()
            }

            // If excluded, ask to provide a reason for exclusion
            if (status == TAG_EXCLUDE) document.setExclusionReason()

            ztoolkit.getGlobal("ZoteroPane").refreshFeed()
        }

        ztoolkit.getGlobal('document').setExclusionReason = () => {
            ztoolkit.log("setExclusionReason")

            // Get the selected items
            const selectedItems = ztoolkit.getGlobal("ZoteroPane").getSelectedItems()

            // Prompt the user to provide the reason for exclusion
            const defaultValue = { value: '' }
            let res = { value: null }
            const reasonProvided: boolean = Services.prompt.prompt(window, getString("review-exclusiondialog-title"), getString("review-exclusiondialog-text"), res, "", defaultValue)

            // If prompt canceled, return
            if (!reasonProvided) return

            // Update the exclusion criteria
            for (const item of selectedItems) {

                // Remove the exclusion criteria
                item.getTags().map(tag => {
                    if (tag.tag.includes(TAG_REASON_PREFIX)) item.removeTag(tag.tag)
                })

                item.addTag(TAG_REASON_PREFIX + res.value)
                item.saveTx()
            }
        }
    }
}

// new ztoolkit.ProgressWindow(config.addonName)
//     .createLine({
//         text: "Plugin Loaded!",
//         type: "success",
//     })
//     .show();
// ztoolkit.getGlobal('document').showStatusSelector = (item: Zotero.Item, target: HTMLElement) => {
//     const x = target.getBoundingClientRect().left
//     const y = target.getBoundingClientRect().top
//     reviewStatusSelector.show(x, y)
// }

// reviewStatusSelector = new ReviewStatusSelector()
// ztoolkit.getGlobal('document').showStatusSelector = (item: Zotero.Item, target: HTMLElement) => {
//     alert('123')
//     const x = target.getBoundingClientRect().left
//     const y = target.getBoundingClientRect().top
//     reviewStatusSelector.show(x, y)
// }

// class ReviewStatusSelector {
//     element: HTMLElement;
//     constructor() {
//         let el = document.createElement('div')
//         el.id = 'review-status-selector'

//         // Add each status
//         const statusTags = [
//             TAG_INCLUDE,
//             TAG_EXCLUDE,
//             TAG_PENDING,
//             TAG_UNSURE,
//             TAG_NOT_REVIEWED,
//         ]
//         for (const status of statusTags) {
//             let statusEl = document.createElement('div')
//             statusEl.classList.add('status-option')

//             let statusElSpan = document.createElement('span')
//             statusElSpan.classList.add('review')
//             statusElSpan.classList.add(status.split(':')[1])
//             statusElSpan.textContent = getReviewStatusLabel(status)
//             statusEl.appendChild(statusElSpan)
//             el.appendChild(statusEl)
//         }

//         document.querySelector('#zotero-items-tree')?.appendChild(el)
//         this.element = el
//     }

//     show(x: number, y: number) {
//         this.element.style.left = x + 'px'
//         this.element.style.top = y + 'px'
//     }
// }