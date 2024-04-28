import { config } from "../../../package.json";
import { getString } from "../../utils/locale";
import { createModal } from "../modal";
import { getPref, setPref } from "../../utils/prefs";
import { allStatuses } from "../../lib/global";
import { loadLocalFile } from "../../utils/helpers";
import { attachColorPicker } from "../form/colorpicker";
import { attachKeystrokeInput } from "../form/keystrokeInput";
import { parseXHTML } from "../../utils/parser";
import { registerEventListener } from "../../utils/events";
import { VirtualizedTableHelper } from "zotero-plugin-toolkit/dist/helpers/virtualizedTable";

export async function registerPrefsScripts(_window: Window) {
    // This function is called when the prefs window is opened
    // See addon/chrome/content/preferences.xul onpaneload
    await loadStatusTable(_window);
    await loadStatusModal(_window);

    bindPrefEvents(_window);

    await Zotero.Promise.delay(500);
    updateUI();
}

let statusTable: VirtualizedTableHelper;
let selectedRow: number;
async function loadStatusTable(_window: Window) {
    return new Promise((resolve, reject) => {
        const columns = [
            {
                dataKey: "label",
                label: getString("prefs-table-label"),
                fixedWidth: true,
                width: 100,
            },
            {
                dataKey: "name",
                label: getString("prefs-table-name"),
                fixedWidth: true,
                width: 100,
            },
            {
                dataKey: "tag",
                label: getString("prefs-table-tag"),
                fixedWidth: true,
                width: 100,
            },
            {
                dataKey: "color",
                label: getString("prefs-table-color"),
            },
            {
                dataKey: "askForReason",
                label: getString("prefs-table-askforreason"),
            },
            {
                dataKey: "default",
                label: getString("prefs-table-default"),
            },
            {
                dataKey: "keyboardShortcut",
                label: getString("prefs-table-keyboardshortcut"),
            },
        ];

        statusTable = new ztoolkit.VirtualizedTable(_window)
            .setContainerId(`${config.addonRef}-table-container`)
            .setProp({
                id: `${config.addonRef}-prefs-table`,
                columns: columns,
                showHeader: true,
                multiSelect: true,
                staticColumns: true,
                disableFontSizeScaling: true,
            })
            .setProp("getRowCount", () => allStatuses.length || 0)
            //@ts-ignore Return full status data
            .setProp("getRowData", (index) => allStatuses[index])
            .setProp("getRowString", (index) => allStatuses[index].label || "")
            // Show a progress window when selection changes
            .setProp("onSelectionChange", (selection) => {
                [selectedRow] = selection.selected;
            })
            .setProp("onKeyDown", (event: KeyboardEvent): boolean => {
                if (
                    event.key == "Delete" ||
                    (Zotero.isMac && event.key == "Backspace")
                ) {
                    removeStatus(selectedRow);
                }
                return true;
            })
            .setProp("onActivate", (ev: MouseEvent): boolean => {
                editStatus(selectedRow);
                return true;
            })
            // Render the table.
            .render(-1, () => {
                resolve(true);
            });
    });
}

let statusModal: Modal;
async function loadStatusModal(_window: Window) {
    // Roots
    const rootDocument = _window.document;
    const rootElement = rootDocument.documentElement;
    const prefsElement = rootElement.querySelector(
        `#${config.addonRef}-status-modal`,
    ) as HTMLElement;

    // Create the modal
    const modalContent = rootDocument.createElement("div");
    statusModal = createModal("prefs", "Edit", modalContent);
    statusModal.appendTo(prefsElement);

    // Load the form from the XHTML file
    const formTemplate = loadLocalFile(
        rootURI + "chrome/content/modal/preferences.xhtml",
    );
    const formNodes = parseXHTML(formTemplate);
    // Import and append
    const formNodesImported = rootDocument.importNode(formNodes, true);
    modalContent.appendChild(formNodesImported);

    // Bind the modal events
    statusModal.bindEvents();

    // Initialize the color picker
    const colorInput = modalContent.querySelector(
        "[type=color]",
    ) as HTMLInputElement;
    // ztoolkit.log("--------------------");
    // ztoolkit.log(_window);
    attachColorPicker(_window, _window.document, colorInput);

    attachKeystrokeInput(
        modalContent.querySelector(".input-keystroke") as HTMLInputElement,
    );
}

function removeStatus(rowId: number) {
    const pref: [] = JSON.parse(String(getPref("statuses")));
    pref.splice(rowId, 1);
    setPref("statuses", JSON.stringify(pref));
    updateUI();
}

function addStatus() {
    // ztoolkit.log("Add Status");

    // Change the modal title
    (
        statusModal.element.querySelector(".modal-title") as HTMLElement
    ).textContent = "Add Status";
    // Populate the fields
    (
        statusModal.element.querySelector("[name=name]") as HTMLInputElement
    ).value = "";
    (
        statusModal.element.querySelector("[name=label]") as HTMLInputElement
    ).value = "";
    (
        statusModal.element.querySelector("[name=tag]") as HTMLInputElement
    ).value = "";
    (
        statusModal.element.querySelector("[name=color]") as HTMLInputElement
    ).value = "";
    (
        statusModal.element.querySelector("[name=reason]") as HTMLInputElement
    ).checked = false;
    (
        statusModal.element.querySelector("[name=default]") as HTMLInputElement
    ).checked = false;
    (
        statusModal.element.querySelector(
            "[name=keyboardshortcut]",
        ) as HTMLInputElement
    ).value = "";
    const formElement = statusModal.element.querySelector(
        "#status-form",
    ) as HTMLFormElement;
    const pref: [] = JSON.parse(String(getPref("statuses")));
    formElement.onsubmit = (ev) => {
        addStatusCommit(formElement, pref);
        ev.preventDefault();
    };

    // Open the modal
    statusModal.open();
}

function editStatus(rowId: number) {
    // ztoolkit.log("Edit status (Id: " + rowId + ")");

    const status = allStatuses[rowId];
    // Change the modal title
    (
        statusModal.element.querySelector(".modal-title") as HTMLElement
    ).textContent = `Edit Status: ${status.label}`;
    // Populate the fields
    (
        statusModal.element.querySelector("[name=name]") as HTMLInputElement
    ).value = status.name;
    (
        statusModal.element.querySelector("[name=label]") as HTMLInputElement
    ).value = status.label;
    (
        statusModal.element.querySelector("[name=tag]") as HTMLInputElement
    ).value = status.tag;
    (
        statusModal.element.querySelector("[name=color]") as HTMLInputElement
    ).value = status.color;
    (
        statusModal.element.querySelector("[name=color]") as HTMLInputElement
    ).updateLabelValue();
    (
        statusModal.element.querySelector("[name=reason]") as HTMLInputElement
    ).checked = status.askForReason;
    (
        statusModal.element.querySelector("[name=default]") as HTMLInputElement
    ).checked = status.default;
    (
        statusModal.element.querySelector(
            "[name=keyboardshortcut]",
        ) as HTMLInputElement
    ).value = status.keyboardShortcut;

    // Form events: submit
    const formElement = statusModal.element.querySelector(
        "#status-form",
    ) as HTMLFormElement;
    formElement.onsubmit = (ev) => {
        const pref: [] = JSON.parse(String(getPref("statuses")));
        editStatusCommit(formElement, pref);
        ev.preventDefault();
    };

    // Open the modal
    statusModal.open();
}

function addStatusCommit(formElement: HTMLElement, pref: []) {
    // Construct the data
    const data: Status = {
        name: (formElement?.querySelector("[name=name]") as HTMLInputElement)
            .value,
        tag: (formElement?.querySelector("[name=tag]") as HTMLInputElement)
            .value,
        label: (formElement?.querySelector("[name=label]") as HTMLInputElement)
            .value,
        color: (formElement?.querySelector("[name=color]") as HTMLInputElement)
            .value,
        askForReason: (
            formElement?.querySelector("[name=reason]") as HTMLInputElement
        ).checked,
        default: (
            formElement?.querySelector("[name=default]") as HTMLInputElement
        ).checked,
        keyboardShortcut: (
            formElement?.querySelector(
                "[name=keyboardshortcut]",
            ) as HTMLInputElement
        ).value,
    };

    // Merge and save the data
    pref.push(data as never);
    setPref("statuses", JSON.stringify(pref));

    updateUI();
    statusModal.close();
}

function editStatusCommit(formElement: HTMLElement, pref: Status[]) {
    // Construct the data
    const data: Status = {
        name: (formElement?.querySelector("[name=name]") as HTMLInputElement)
            .value,
        tag: (formElement?.querySelector("[name=tag]") as HTMLInputElement)
            .value,
        label: (formElement?.querySelector("[name=label]") as HTMLInputElement)
            .value,
        color: (formElement?.querySelector("[name=color]") as HTMLInputElement)
            .value,
        askForReason: (
            formElement?.querySelector("[name=reason]") as HTMLInputElement
        ).checked,
        default: (
            formElement?.querySelector("[name=default]") as HTMLInputElement
        ).checked,
        keyboardShortcut:
            (
                formElement?.querySelector(
                    "[name=keyboardshortcut]",
                ) as HTMLInputElement
            ).value || "",
    };

    // Merge and save the data
    const prefIndex = pref.findIndex((obj) => obj.name == data.name);
    if (prefIndex >= 0) {
        pref[prefIndex] = data;
        setPref("statuses", JSON.stringify(pref));
    }
    updateUI();
    statusModal.close();
}

function bindPrefEvents(_window: Window) {
    // Add and remove buttons
    registerEventListener(
        _window.document.querySelector("#btn-add-status") as HTMLButtonElement,
        "click",
        (ev) => {
            addStatus();
        },
    );
    registerEventListener(
        _window.document.querySelector(
            "#btn-remove-status",
        ) as HTMLButtonElement,
        "click",
        (ev) => {
            removeStatus(selectedRow);
        },
    );
    registerEventListener(
        _window.document.querySelector(
            `#zotero-prefpane-${config.addonRef}-enable`,
        ) as HTMLElement,
        "command",
        (e) => {
            _window.alert(
                `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
            );
        },
    );
    registerEventListener(
        _window.document.querySelector(
            `#zotero-prefpane-${config.addonRef}-input`,
        ) as HTMLElement,
        "change",
        (e) => {
            addon.data.prefs!.window.alert(
                `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
            );
        },
    );
    // _window.document
    //     .querySelector("#btn-add-status")
    //     ?.addEventListener("click", (ev) => {
    //         addStatus();
    //     });
    // _window.document
    //     .querySelector("#btn-remove-status")
    //     ?.addEventListener("click", (ev) => {
    //         removeStatus(selectedRow);
    //     });
    // _window.document
    //     .querySelector(`#zotero-prefpane-${config.addonRef}-enable`)
    //     ?.addEventListener("command", (e) => {
    //         ztoolkit.log(e);
    //         _.window.alert(
    //             `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
    //         );
    //     });

    // _window.document
    //     .querySelector(`#zotero-prefpane-${config.addonRef}-input`)
    //     ?.addEventListener("change", (e) => {
    //         ztoolkit.log(e);
    //         addon.data.prefs!.window.alert(
    //             `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
    //         );
    //     });
}
function updateUI() {
    // ztoolkit.log("Fn: updateUI");
    statusTable.render(-1);
}
export function updatePrefsTable() {
    updateUI();
}
