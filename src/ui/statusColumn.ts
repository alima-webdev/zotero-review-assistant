// ---------------------------------------------
// Status Column
// ---------------------------------------------

import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import {
  generateMenuIcon,
  getItemStatus,
  getStatusFromTag,
  removeAllStatuses,
} from "../utils/helpers";
import { getString } from "../utils/locale";
import { allStatuses } from "../lib/global";

export function initStatusColumn() {
  const columnId = "status";
  const getStatusColumnHook = (
    field: string,
    unformatted: boolean,
    includeBaseMapped: boolean,
    item: Zotero.Item,
  ) => {
    const reviewStatus = getItemStatus(item);
    return String(reviewStatus?.tag);
  };

  function renderStatusCell(
    index: number,
    data: any,
    column: any,
  ): HTMLElement {
    const element = document.createElement("span");
    element.className = `cell ${column.className} review-container`;
    const innerElement = document.createElement("div");
    innerElement.classList.add("review");
    const status = getStatusFromTag(data);
    innerElement.style.backgroundColor = status?.color ?? "";
    innerElement.textContent = status?.label ?? "";
    element.appendChild(innerElement);
    return element;
  }

  const columnOptions = { renderCell: renderStatusCell };
  const columnName = getString("status-column-header");

  ztoolkit.ItemTree.register(
    columnId,
    columnName,
    getStatusColumnHook,
    columnOptions,
  );
}

export function getStatusContextMenu() {
  return allStatuses.map((status: Status): MenuitemOptions => {
    return {
      tag: "menuitem",
      label: status.label == "" ? "Clear" : status.label,
      icon: generateMenuIcon(status.color),
      oncommand: `document.setReviewStatus('${status.tag}')`,
    };
  });
}

export function statusKeyboardEvents(ev: KeyboardEvent) {
  // Add the shortcuts for statuses if they have one
  for (const status of allStatuses) {
    if (
      ev.altKey == status.keystroke.modifiers.alt &&
      ev.ctrlKey == status.keystroke.modifiers.ctrl &&
      ev.metaKey == status.keystroke.modifiers.meta &&
      ev.shiftKey == status.keystroke.modifiers.shift &&
      ev.key == status.keystroke.key
    ) {
      ztoolkit.getGlobal("document").setReviewStatus(status.tag);
    }
  }
}

export function statusRegisterGlobalFunctions() {
  // Register the global context menu functions
  // Set Status
  ztoolkit.getGlobal("document").setReviewStatus = (statusTag) => {
    const selectedItems: Zotero.Item[] = ztoolkit
      .getGlobal("ZoteroPane")
      .getSelectedItems();
    // Check if any items are selected
    if (selectedItems.length == 0) return;
    for (const item of selectedItems) {
      // Remove the old tag status
      removeAllStatuses(item);

      if (statusTag != "") {
        item.addTag(statusTag);
      }

      item.saveTx();
    }

    // Get status from the tag name provided
    const status = getStatusFromTag(statusTag);

    // If excluded, ask to provide a reason for exclusion
    if (status?.askForReason) document.setStatusReason();
  };
}
