
// ---------------------------------------------
// Reason Column
// ---------------------------------------------

import { reasonTagPrefix } from "../lib/global";
import { getAllReasonsFromItems, getItemStatusTags } from "../utils/helpers";
import { getString } from "../utils/locale";
import { initAutoComplete } from "./autocomplete";
import { createModal, initModal } from "./modal";

export function initReasonColumn() {
    const columnReasonId = "reason";
    const getReasonColumnHook = (
        field: string,
        unformatted: boolean,
        includeBaseMapped: boolean,
        item: Zotero.Item,
    ) => {
        const statusTags = getItemStatusTags(item);
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

export function getReasonContextMenu() {
    return [
        { tag: "menuseparator" },
        {
            tag: "menuitem",
            label: "Change Reason",
            oncommand: `document.setStatusReason()`,
        }
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

        document.allReasons = getAllReasonsFromItems(
            await ztoolkit.getGlobal("Zotero").Tags.getAll(),
        );
        const inputReason = document.reasonModal.element.querySelector(
            "#input-reason",
        ) as HTMLInputElement;
        inputReason.value = "";
        document.reasonModal.open();
        inputReason.focus();
    };
}

export async function reasonRegisterDOM() {
    const reasonModalBody = document.createElement("div");
    const reasonModalDescription = document.createElement("div");
    reasonModalDescription.textContent = getString("reason-dialog-text");
    reasonModalBody.appendChild(reasonModalDescription);

    // Form
    const reasonForm = document.createElement("form");

    // Input + Autocomplete
    const reasonInput = ztoolkit.UI.createElement(document, "input");
    reasonInput.id = "input-reason";
    reasonInput.type = "text";
    reasonInput.classList.add("input");
    const autocompleteContainer = document.createElement("div");
    const inputContainer = document.createElement("div");
    inputContainer.appendChild(reasonInput);
    inputContainer.appendChild(autocompleteContainer);
    reasonForm.appendChild(inputContainer);

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("btn-container");

    const btnCancel = document.createElement("button");
    btnCancel.type = "button";
    btnCancel.setAttribute("action", "close");
    btnCancel.classList.add("btn");
    btnCancel.textContent = "Cancel";

    const btnSubmit = document.createElement("button");
    btnSubmit.type = "submit";
    btnSubmit.classList.add("btn");
    btnSubmit.classList.add("btn-primary");
    btnSubmit.textContent = "Submit";

    buttonContainer.appendChild(btnCancel);
    buttonContainer.appendChild(btnSubmit);

    reasonForm.appendChild(buttonContainer);

    reasonModalBody.appendChild(reasonForm);

    // Form submission
    reasonForm.onsubmit = () => {
        ztoolkit.log("Submit");
        ztoolkit.log(reasonInput.value);

        const selectedItems: Zotero.Item[] = ztoolkit
            .getGlobal("ZoteroPane")
            .getSelectedItems();

        // Update the exclusion criteria
        for (const item of selectedItems) {
            // Remove the exclusion criteria
            item.getTags().map((tag) => {
                if (tag.tag.includes(reasonTagPrefix)) item.removeTag(tag.tag);
            });

            if (reasonInput.value != "") {
                item.addTag(reasonTagPrefix + reasonInput.value);
            }
            item.saveTx();
        }

        document.reasonModal.close();
    };

    // Modal
    const reasonModal = createModal(
        "reason-modal",
        getString("reason-dialog-title"),
        reasonModalBody,
    );
    reasonModal.appendTo(document.documentElement);
    document.reasonModal = reasonModal;

    btnCancel.onclick = () => {
        reasonInput.value = "";
        document.reasonModal.close();
    };

    // eslint-disable-next-line
    document.allReasons = getAllReasonsFromItems(
        await ztoolkit.getGlobal("Zotero").Tags.getAll(),
    );

    initAutoComplete(reasonInput, autocompleteContainer);
    initModal();
}