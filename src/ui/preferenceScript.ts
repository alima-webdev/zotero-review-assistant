// @ts-nocheck Temporarily Inactivated
import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { createModal } from "./modal";
import { getPref, setPref } from "../utils/prefs";
import { allStatuses } from "../lib/global";
import { config } from "../../package.json";
import { loadXHTMLFromFile, parseXHTML } from "../utils/helpers";
import { attachColorPicker } from "./colorpicker";
import { attachKeystrokeInput } from "./keystrokeInput";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload
  await loadStatusTable(_window);
  await loadStatusModal(_window);

  bindPrefEvents(_window);

  await Zotero.Promise.delay(250);
  updateUI();
}

let statusTable;
let selectedRow: number;
async function loadStatusTable(_window) {
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
      .setProp("getRowData", (index) => allStatuses[index] || {})
      .setProp("getRowString", (index) => allStatuses[index].title || "")
      // Show a progress window when selection changes
      .setProp("onSelectionChange", (selection) => {
        [selectedRow] = selection.selected;
      })
      .setProp("onKeyDown", (event: KeyboardEvent) => {
        if (
          event.key == "Delete" ||
          (Zotero.isMac && event.key == "Backspace")
        ) {
          removeStatus(selectedRow);
        }
      })
      .setProp("onActivate", (selection) => {
        editStatus(selectedRow);
      })
      // Render the table.
      .render(-1, () => {
        resolve();
      });
  });
}

let statusModal: Modal;
async function loadStatusModal(_window) {
  // Roots
  const rootDocument = _window.document;
  const rootElement = rootDocument.documentElement;
  const prefsElement = rootElement.querySelector(
    `#${config.addonRef}-status-modal`,
  );

  // Create the modal
  const modalContent = rootDocument.createElement("div");
  statusModal = createModal("prefs", "Edit", modalContent);
  statusModal.appendTo(prefsElement);

  // Load the form from the XHTML file
  const formTemplate = loadXHTMLFromFile(
    rootURI + "chrome/content/modal/prefsStatus.xhtml",
  );
  const formNodes = parseXHTML(formTemplate);
  // Import and append
  const formNodesImported = rootDocument.importNode(formNodes, true);
  modalContent.appendChild(formNodesImported);

  // Bind the modal events
  statusModal.bindEvents();

  // Initialize the color picker
  const colorInput = modalContent.querySelector("[type=color]");
  ztoolkit.log("--------------------");
  ztoolkit.log(_window);
  attachColorPicker(_window, _window.document, colorInput);

  attachKeystrokeInput(modalContent.querySelector(".input-keystroke"));
}

function removeStatus(rowId: number) {
  const pref: [] = JSON.parse(getPref("statuses"));
  pref.splice(rowId, 1);
  setPref("statuses", JSON.stringify(pref));
  updateUI();
}

function addStatus() {
  ztoolkit.log("Add Status");

  // Change the modal title
  statusModal.element.querySelector(".modal-title").textContent = "Add Status";
  // Populate the fields
  statusModal.element.querySelector("[name=name]").value = "";
  statusModal.element.querySelector("[name=label]").value = "";
  statusModal.element.querySelector("[name=tag]").value = "";
  statusModal.element.querySelector("[name=color]").value = "";
  statusModal.element.querySelector("[name=reason]").checked = false;
  statusModal.element.querySelector("[name=default]").checked = false;
  statusModal.element.querySelector("[name=keyboardshortcut]").value = "";
  const formElement = statusModal.element.querySelector("#status-form");
  const pref: [] = JSON.parse(getPref("statuses"));
  formElement.onsubmit = (ev) => {
    addStatusCommit(formElement, pref);
    ev.preventDefault();
  };

  // Open the modal
  statusModal.open();
}

function editStatus(rowId: number) {
  ztoolkit.log("Edit status (Id: " + rowId + ")");

  const status = allStatuses[rowId];
  // Change the modal title
  statusModal.element.querySelector(".modal-title").textContent =
    `Edit Status: ${status.label}`;
  // Populate the fields
  statusModal.element.querySelector("[name=name]").value = status.name;
  statusModal.element.querySelector("[name=label]").value = status.label;
  statusModal.element.querySelector("[name=tag]").value = status.tag;
  statusModal.element.querySelector("[name=color]").value = status.color;
  statusModal.element.querySelector("[name=color]").updateLabelValue();
  statusModal.element.querySelector("[name=reason]").checked =
    status.askForReason;
  statusModal.element.querySelector("[name=default]").checked = status.default;
  statusModal.element.querySelector("[name=keyboardshortcut]").value =
    status.keyboardShortcut;

  // Form events: submit
  const formElement = statusModal.element.querySelector("#status-form");
  formElement.onsubmit = (ev) => {
    const pref: [] = JSON.parse(getPref("statuses"));
    editStatusCommit(formElement, pref);
    ev.preventDefault();
  };

  // Open the modal
  statusModal.open();
}

function addStatusCommit(formElement: HTMLElement, pref: []) {
  // Construct the data
  const data = {
    name: formElement?.querySelector("[name=name]")?.value,
    tag: formElement?.querySelector("[name=tag]")?.value,
    label: formElement?.querySelector("[name=label]")?.value,
    color: formElement?.querySelector("[name=color]")?.value,
    askForReason: formElement?.querySelector("[name=reason]")?.checked,
    default: formElement?.querySelector("[name=default]")?.checked,
    keyboardShortcut: formElement?.querySelector("[name=keyboardshortcut]")
      ?.value,
  };

  // Merge and save the data
  pref.push(data);
  setPref("statuses", JSON.stringify(pref));

  updateUI();
  statusModal.close();
}

function editStatusCommit(formElement: HTMLElement, pref: []) {
  // Construct the data
  const data = {
    name: formElement?.querySelector("[name=name]")?.value,
    tag: formElement?.querySelector("[name=tag]")?.value,
    label: formElement?.querySelector("[name=label]")?.value,
    color: formElement?.querySelector("[name=color]")?.value,
    askForReason: formElement?.querySelector("[name=reason]")?.checked,
    default: formElement?.querySelector("[name=default]")?.checked,
    keyboardShortcut: formElement?.querySelector("[name=keyboardshortcut]")
      ?.value,
  };

  // Merge and save the data
  ztoolkit.log("--------------------------");
  ztoolkit.log(pref);
  const prefIndex = pref.findIndex((obj) => obj.name == data.name);
  if (prefIndex >= 0) {
    ztoolkit.log(prefIndex);
    // pref.push(data)
    pref[prefIndex] = data;
    ztoolkit.log(pref);
    setPref("statuses", JSON.stringify(pref));
  }
  ztoolkit.log("--------------------------");
  updateUI();
  statusModal.close();
}

function bindPrefEvents(_window) {
  // Add and remove buttons
  _window.document
    .querySelector("#btn-add-status")
    ?.addEventListener("click", (ev) => {
      addStatus();
    });
  _window.document
    .querySelector("#btn-remove-status")
    ?.addEventListener("click", (ev) => {
      removeStatus(selectedRow);
    });
  _window.document
    .querySelector(`#zotero-prefpane-${config.addonRef}-enable`)
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      _.window.alert(
        `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
      );
    });

  _window.document
    .querySelector(`#zotero-prefpane-${config.addonRef}-input`)
    ?.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
      );
    });
}
function updateUI() {
  ztoolkit.log("Fn: updateUI");
  statusTable.render(-1);
}
export function updatePrefsTable() {
  updateUI();
}
