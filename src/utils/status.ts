import { allStatuses, statusTagPrefix } from "../lib/global";
import { log } from "./devtools";

// Get the status from item
export function getItemStatus(item: Zotero.Item): Status | undefined {
    // log("Fn: getItemStatus")
    // log(item)
    let returnStatus = allStatuses.find((obj) => obj.default == true);
    for (const status of allStatuses) {
        if (item.hasTag(status.tag)) returnStatus = status;
    }
    // log(returnStatus)
    return returnStatus;
}

// Get the status from a tag name
export function getStatusFromTag(tag: string) {
    log("Fn: getStatusFromTag");
    const status = allStatuses.find((obj) => obj.tag == tag);
    return status;
}

// Remove all statuses from item
export function removeItemStatus(item: Zotero.Item) {
    log("Fn: removeItemStatus");
    // Remove the exclusion criteria
    item.getTags().map((tag) => {
        if (tag.tag.includes(statusTagPrefix)) item.removeTag(tag.tag);
    });
}
