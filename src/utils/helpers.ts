// Helper functions
import { allStatuses, prismaSections, reasonTagPrefix, statusTagPrefix } from "../lib/global";

export function getItemStatusTags(item: Zotero.Item) {
    const itemTags = item.getTags();
    const statusTags = itemTags.filter((obj) => {
        return obj.tag.includes(statusTagPrefix);
    });
    return statusTags;
}

// Get the status from item
export function getItemStatus(item: Zotero.Item) {
    let statusObj = allStatuses.find((obj) => obj.default == true);
    for (const status of allStatuses) {
        if (item.hasTag(status.tag)) statusObj = status;
    }
    return statusObj;
}

// Get the all status from item
export function getItemStatusAll(item: Zotero.Item) {
    let statusObj = allStatuses.find((obj) => obj.default == true);
    for (const status of allStatuses) {
        if (item.hasTag(status.tag)) statusObj = status;
    }
    return statusObj;
}

// Get the all status from item
export function getAllReasonsFromItems(tags: any[]) {
    return tags
        .filter((obj) => {
            return obj.tag.includes(reasonTagPrefix);
        })
        .map((obj) => {
            const label = obj.tag.replace(reasonTagPrefix, "");
            return { label: label, value: label };
        });
}

export function getReasonFromItem(item: Zotero.Item): string {
    const tags = item.getTags()
    return tags.filter((obj) => {
        return obj.tag.includes(reasonTagPrefix);
    }) .map((obj) => {
            return obj.tag.replace(reasonTagPrefix, "");
        })[0];
}

export function getReasonsFromItems(items: Zotero.Item[]) {
    const reasons = []
    for (const item of items) {
        const reason = getReasonFromItem(item)
        // If reason is found and is unique
        if (reason && !reasons.includes(reason)) {
            reasons.push(reason)
        }
    }
    return reasons
}

// Get the status from a tag name
export function getStatusFromTag(tag: string) {
    const status = allStatuses.find((obj) => obj.tag == tag);
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
    return (
        "data:image/svg+xml;base64," +
        window.btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="12" /></svg>`,
        )
    );
}

// Parse XHTML from File
export function parseXHTMLFromFile(src: string) {
    const markup = loadXHTMLFromFile(src);
    return parseXHTML(markup);
}

export function loadXHTMLFromFile(src: string) {
    return Zotero.File.getContentsFromURL(src);
}

export function loadLocalFile(src: string) {
    return Zotero.File.getContentsFromURL(src);
}

// Parse XHTML from String
export function parseXHTML(str: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    if (doc.documentElement.localName === "parsererror") {
        throw new Error("not well-formed XHTML");
    }

    // We use a range here so that we don't access the inner DOM elements from
    // JavaScript before they are imported and inserted into a document.
    const range = doc.createRange();
    range.selectNodeContents(doc.querySelector("div") as Node);
    return range.extractContents();
}

// PRISMA
export function getPRISMASectionFromItem(item: Zotero.Item) {
    const section = prismaSections.find((obj) => item.hasTag(obj.tag));
    return prismaSections.find((obj) => item.hasTag(obj.tag)) || [];
}
export function removePRISMASectionFromItem(item: Zotero.Item) {
    const section = getPRISMASectionFromItem(item)
    item.removeTag(section.tag)
}

// Count the number of items with a certain tag given an array of items
export function countItemsWithTag(tag: string, items: Zotero.Item[]) {
    let count = 0

    for (const item of items) {
        if (item.hasTag(tag)) {
            count++;
        }
    }

    return count
}