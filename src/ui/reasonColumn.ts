// ---------------------------------------------
// Reason Column
// ---------------------------------------------

import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { reasonTagPrefix, prismaSections } from "../lib/global";
import { getAllReasonsFromItems, getItemStatusTags, getPRISMASectionFromItem, getReasonFromItem, getReasonsFromItems, loadXHTMLFromFile, parseXHTML, removePRISMASectionFromItem } from "../utils/helpers";
import { getString } from "../utils/locale";
import { initAutoComplete } from "./autocomplete";
import { createModal, initModal } from "./modal";
import { log } from "../utils/development";
import { getPRISMAEligibilityOtherReason } from "../lib/prisma";

export function initReasonColumn() {
    const columnReasonId = "reason";
    const getReasonColumnHook = (
        field: string,
        unformatted: boolean,
        includeBaseMapped: boolean,
        item: Zotero.Item,
    ) => {
        const statusTags = getItemStatusTags(item);
        ztoolkit.log("Column")
        ztoolkit.log(statusTags, reasonTagPrefix)
        const reason =
            statusTags
                .find((obj) => obj.tag.includes(reasonTagPrefix))
                ?.tag.replace(reasonTagPrefix, "") ?? "";
        return reason;
    };
    const columnReasonOptions = {};

    const columnReasonName: string = getString("reason-column-header");
    ztoolkit.ItemTree.register(
        columnReasonId,
        columnReasonName,
        getReasonColumnHook,
        columnReasonOptions,
    );
}

export function getReasonContextMenu(): MenuitemOptions[] {
    return [
        { tag: "menuseparator" },
        {
            tag: "menuitem",
            label: "Change Reason",
            oncommand: `document.setStatusReason()`,
        },
    ];
}

export function reasonKeyboardEvents(ev: KeyboardEvent) {
    if (ev.key == "r") {
        ztoolkit.getGlobal("document").setStatusReason();
    }
}

export function reasonRegisterGlobalFunctions() {
    // Set Reason
    ztoolkit.getGlobal("document").setStatusReason = async () => {
        // Check if any items are selected
        const selectedItems: Zotero.Item[] = ztoolkit
            .getGlobal("ZoteroPane")
            .getSelectedItems();
        if (selectedItems.length == 0) return;

        // Get all reasons to be used for autocompletion
        document.allReasons = getAllReasonsFromItems(
            await ztoolkit.getGlobal("Zotero").Tags.getAll(),
        );

        // Set the default form values
        const reasonInput = document.reasonModal.element.querySelector("#input-reason") as HTMLInputElement;
        reasonInput.value = ""

        const prismaSelect = document.reasonModal.element.querySelector("#prisma-section") as HTMLInputElement;
        prismaSelect.value = ""

        // Pull the current reason to set the input value
        const reasons = getReasonsFromItems(selectedItems);
        if (reasons.length == 1) {
            reasonInput.value = reasons[0];

            // Set the current PRISMA section
            prismaSelect.value = getPRISMASectionFromItem(selectedItems[0])?.tag || ""
        }

        document.reasonModal.open();
        prismaSelect.focus();
    };
}

export async function reasonRegisterDOM() {

    // Roots
    const rootElement = document.documentElement;

    const reasonModalBody = document.createElement('div')
    // Load the form from the XHTML file
    const formTemplate = loadXHTMLFromFile(
        rootURI + "chrome/content/modal/reason.xhtml",
    );
    const formNodes = parseXHTML(formTemplate);
    // Import and append
    const formNodesImported = document.importNode(formNodes, true);
    reasonModalBody.appendChild(formNodesImported);

    // Modal
    const itemTreeElement = ztoolkit.getGlobal("document").querySelector("#item-tree-main-default") as HTMLElement
    const reasonModal = createModal(
        "reason-modal",
        getString("reason-dialog-title"),
        reasonModalBody,
        { onCloseFocus: itemTreeElement }
    );
    reasonModal.appendTo(rootElement);
    document.reasonModal = reasonModal;

    // Reason input
    const reasonInput = reasonModalBody.querySelector('#input-reason') as HTMLInputElement
    const autocompleteContainer = reasonModalBody.querySelector('#input-reason-autocomplete') as HTMLDivElement
    // Populate the reason autocomplete
    document.allReasons = getAllReasonsFromItems(
        // @ts-ignore Get all tags (no specific library)
        await ztoolkit.getGlobal("Zotero").Tags.getAll(),
    );

    // Form
    const reasonForm = reasonModalBody.querySelector('#reason-form') as HTMLFormElement
    reasonForm.onsubmit = () => {
        const selectedItems: Zotero.Item[] = ztoolkit
            .getGlobal("ZoteroPane")
            .getSelectedItems();

        // Get the reason tag
        const reasonTag = reasonTagPrefix + reasonInput.value

        // Update the exclusion criteria
        for (const item of selectedItems) {
            // Remove the exclusion criteria
            item.getTags().map((tag) => {
                if (tag.tag.includes(reasonTagPrefix)) item.removeTag(tag.tag);
            });

            if (reasonInput.value != "") {
                item.addTag(reasonTag);
            }
            item.saveTx();
        }

        document.reasonModal.close();
    };

    // PRISMA Section
    const prismaSelect = reasonModalBody.querySelector('#prisma-section') as HTMLSelectElement
    let prismaSelectHTML = ``
    for (const section of prismaSections) {
        const optionTag = document.createElement('option')
        optionTag.value = section.tag
        optionTag.textContent = section.label
        prismaSelect.appendChild(optionTag)
        prismaSelectHTML += `<option value="${section.tag}">${section.label}</option>`
    }

    prismaSelect.addEventListener('change', ev => {
        reasonInput.value = prismaSelect.value.replace(reasonTagPrefix, '')
    })

    initAutoComplete(reasonInput, autocompleteContainer);
    initModal()
}
