// Helper functions
import { allStatuses, reasonTagPrefix, statusTagPrefix } from "../lib/consts";

export function getItemStatusTags(item: Zotero.Item) {
    const itemTags = item.getTags()
    const statusTags = itemTags.filter(obj => {
        return obj.tag.includes(statusTagPrefix)
    })
    return statusTags
}

// Get the status from item
export function getItemStatus(item: Zotero.Item) {
    let statusObj = allStatuses.find(obj => obj.default == true)
    for (const status of allStatuses) {
        if (item.hasTag(status.tag)) statusObj = status
    }
    return statusObj;
}

// Get the all status from item
export function getItemStatusAll(item: Zotero.Item) {
    let statusObj = allStatuses.find(obj => obj.default == true)
    for (const status of allStatuses) {
        if (item.hasTag(status.tag)) statusObj = status
    }
    return statusObj;
}

// Get the all status from item
export function getAllReasonsFromItems(tags: any[]) {
    return tags.filter(obj => {
        return obj.tag.includes(reasonTagPrefix)
    }).map(obj => {
        const label = obj.tag.replace(reasonTagPrefix, "")
        return { label: label, value: label }
    })
}

// Get the status from a tag name
export function getStatusFromTag(tag: string) {
    const status = allStatuses.find(obj => obj.tag == tag)
    return status;
}

// Remove all statuses from item
export function removeAllStatuses(item: Zotero.Item) {
    // Remove the exclusion criteria
    item.getTags().map((tag) => {
        if (tag.tag.includes(statusTagPrefix)) item.removeTag(tag.tag);
    });
}

export function generateMenuIcon(color: string) {
    return "data:image/svg+xml;base64," + window.btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="12" /></svg>`)
}

// Parse XHTML from File
export function parseXHTMLFromFile(src: string) {
    const markup = loadXHTMLFromFile(src)
    return parseXHTML(markup)
}

export function loadXHTMLFromFile(src: string) {
    return Zotero.File.getContentsFromURL(src);
}

// Parse XHTML from String
export function parseXHTML(str: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    if (doc.documentElement.localName === 'parsererror') {
        throw new Error('not well-formed XHTML');
    }

    // We use a range here so that we don't access the inner DOM elements from
    // JavaScript before they are imported and inserted into a document.
    const range = doc.createRange();
    range.selectNodeContents(doc.querySelector('div') as Node);
    return range.extractContents();
}