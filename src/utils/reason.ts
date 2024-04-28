import { reasonTagPrefix } from "../lib/global";

// Get the all status from item
export function getReasonsFromTags(tags: any[]) {
    return tags
        .filter((obj) => {
            return obj.tag.includes(reasonTagPrefix);
        })
        .map((obj) => {
            const label = obj.tag.replace(reasonTagPrefix, "");
            return { label: label, value: label };
        });
}

export async function updateGlobalReasons() {
    document.allReasons = getReasonsFromTags(await ztoolkit.getGlobal("Zotero").Tags.getAll());
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

