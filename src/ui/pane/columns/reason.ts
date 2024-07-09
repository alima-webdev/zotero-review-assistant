// ---------------------------------------------
// Reason Column
// ---------------------------------------------

import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { reasonTagPrefix, prismaSections } from "../../../lib/global";
import { loadLocalFile } from "../../../utils/helpers";
import {
    getReasonFromItem,
    getReasonsFromItems,
    updateGlobalReasons,
} from "../../../utils/reason";
import { getString } from "../../../utils/locale";
import { initAutoComplete } from "../../form/autocomplete";
import { createModal, initModal } from "../../modal";
import { parseXHTML } from "../../../utils/parser";
import { registerEventListener } from "../../../utils/events";
import { getPRISMASectionFromItem } from "../../../utils/prisma";
import { Keystroke } from "../../form/keystrokeInput";
import { log } from "../../../utils/devtools";

// Init Reason Column
export function initReasonColumn() {
    const columnReasonId = "reason";
    const getReasonColumnHook = (
        field: string,
        unformatted: boolean,
        includeBaseMapped: boolean,
        item: Zotero.Item,
    ) => {
        return getReasonFromItem(item);
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

// Context Menu
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

// Keyboard Events
export function reasonKeyboardEvents(ev: KeyboardEvent) {
    const reasonKeystroke = new Keystroke();
    reasonKeystroke.key = "R";
    reasonKeystroke.modifiers.alt = true;
    reasonKeystroke.modifiers.ctrl = false;
    reasonKeystroke.modifiers.shift = false;
    reasonKeystroke.modifiers.meta = false;

    if (reasonKeystroke.validateAgainst(ev)) {
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
        await updateGlobalReasons();

        // Set the default form values
        const reasonInput = document.reasonModal.element.querySelector(
            "#input-reason",
        ) as HTMLInputElement;
        reasonInput.value = "";

        // const prismaSelect = document.reasonModal.element.querySelector(
        //     "#prisma-section",
        // ) as HTMLInputElement;
        // prismaSelect.value = "";

        // Pull the current reason to set the input value
        const reasons = getReasonsFromItems(selectedItems);
        if (reasons.length == 1) {
            reasonInput.value = reasons[0];

            reasonInput.focus();

            // Set the current PRISMA section
            // prismaSelect.value =
            //     (getPRISMASectionFromItem(selectedItems[0]) as PRISMASection)
            //         .tag || "";
        }

        document.reasonModal.open();
    };
}

export async function reasonRegisterDOM() {
    log("Fn: reasonRegisterDOM");
    // Roots
    const rootElement = document.documentElement;

    const reasonModalBody = document.createElement("div");
    // Load the form from the XHTML file
    const formTemplate = loadLocalFile(
        rootURI + "chrome/content/modal/reason.xhtml",
    );
    const formNodes = parseXHTML(formTemplate);
    // Import and append
    const formNodesImported = document.importNode(formNodes, true);
    reasonModalBody.appendChild(formNodesImported);

    // Modal
    const itemTreeElement = ztoolkit
        .getGlobal("document")
        .querySelector("#item-tree-main-default") as HTMLElement;
    const reasonModal = createModal(
        "reason-modal",
        getString("reason-dialog-title"),
        reasonModalBody,
        { onCloseFocus: itemTreeElement },
    );
    reasonModal.appendTo(rootElement);
    document.reasonModal = reasonModal;

    // Reason input
    const reasonInput = reasonModalBody.querySelector(
        "#input-reason",
    ) as HTMLInputElement;
    const autocompleteContainer = reasonModalBody.querySelector(
        "#input-reason-autocomplete",
    ) as HTMLDivElement;
    // Populate the reason autocomplete
    await updateGlobalReasons();

    // Form
    const reasonForm = reasonModalBody.querySelector(
        "#reason-form",
    ) as HTMLFormElement;
    reasonForm.onsubmit = () => {
        const selectedItems: Zotero.Item[] = ztoolkit
            .getGlobal("ZoteroPane")
            .getSelectedItems();

        // Get the reason tag
        const reasonTag = reasonTagPrefix + reasonInput.value;

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
    // const prismaSelect = reasonModalBody.querySelector(
    //     "#prisma-section",
    // ) as HTMLSelectElement;
    // let prismaSelectHTML = ``;
    // log("Prisma Sections")
    // log(prismaSections)
    // for (const section of prismaSections) {
    //     const optionTag = document.createElement("option");
    //     optionTag.value = section.tag;
    //     optionTag.textContent = section.label;
    // prismaSelect.appendChild(optionTag);
    // prismaSelectHTML += `<option value="${section.tag}">${section.label}</option>`;
    // }
    // prismaSelect.innerHTML = prismaSelectHTML

    // registerEventListener(prismaSelect, "change", (ev) => {
    //     reasonInput.value = prismaSelect.value.replace(reasonTagPrefix, "");
    // });
    // prismaSelect.addEventListener('change', ev => {
    //     reasonInput.value = prismaSelect.value.replace(reasonTagPrefix, '')
    // })

    initAutoComplete(reasonInput, autocompleteContainer);
    initModal();
}
