// @ts-nocheck
import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { createModal } from "../ui/modal";
import { getPref, setPref } from "../utils/prefs";
import { allStatuses } from "../lib/global";
import { config } from "../../package.json";
import {
  loadXHTMLFromFile,
  parseXHTML,
  parseXHTMLFromFile,
} from "../utils/helpers";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload
  await loadStatusTable(_window);
  await loadStatusModal(_window);

  updatePrefsUI();
  bindPrefEvents();
}

const tableStatuses = JSON.parse(getPref("statuses"));
async function loadStatusTable(_window) {
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
      columns: [
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
      ],
      rows: tableStatuses,
    };
  } else {
    addon.data.prefs.window = _window;
  }
}

let statusModal: Modal;
async function loadStatusModal(_window) {
  // Roots
  const rootDocument = addon.data.prefs!.window.document;
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
}

let selectedRow: number;
let tableHelper;
async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  if (addon.data.prefs?.window == undefined) return;

  tableHelper = new ztoolkit.VirtualizedTable(addon.data.prefs?.window)
    .setContainerId(`${config.addonRef}-table-container`)
    .setProp({
      id: `${config.addonRef}-prefs-table`,
      columns: addon.data.prefs?.columns,
      showHeader: true,
      multiSelect: true,
      staticColumns: true,
      disableFontSizeScaling: true,
    })
    .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
    .setProp("getRowData", (index) => addon.data.prefs?.rows[index] || {})
    // Show a progress window when selection changes
    .setProp("onSelectionChange", (selection) => {
      [selectedRow] = selection.selected;
    })
    .setProp("onKeyDown", (event: KeyboardEvent) => {
      if (event.key == "Delete" || (Zotero.isMac && event.key == "Backspace")) {
        removeStatus(selectedRow);
      }
    })
    .setProp("onActivate", (selection) => {
      editStatus(selectedRow);
    })
    .setProp(
      "getRowString",
      (index) => addon.data.prefs?.rows[index].title || "",
    )
    // Render the table.
    .render(-1, () => {
      renderLock.resolve();
    });
  await renderLock.promise;
  ztoolkit.log("TABLE HELPER");
  ztoolkit.log("--------------------");
  ztoolkit.log(tableHelper);
  ztoolkit.log("--------------------");
  ztoolkit.log("Preference table rendered!");
}

function removeStatus(rowId: number) {
  const pref: [] = JSON.parse(getPref("statuses"));
  pref.splice(rowId, 1);
  setPref("statuses", JSON.stringify(pref));
  addon.setRows(pref);
  // tableHelper.treeInstance.invalidateRow(rowId)
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
  statusModal.element.querySelector("[name=reason]").checked =
    status.askForReason;
  statusModal.element.querySelector("[name=default]").checked = status.default;

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

function bindPrefEvents() {
  // Add and remove buttons
  addon.data
    .prefs!.window.document.querySelector("#btn-add-status")
    ?.addEventListener("click", (ev) => {
      addStatus();
    });
  addon.data
    .prefs!.window.document.querySelector("#btn-remove-status")
    ?.addEventListener("click", (ev) => {
      removeStatus(selectedRow);
    });
  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-enable`,
    )
    ?.addEventListener("command", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
      );
    });

  addon.data
    .prefs!.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-input`,
    )
    ?.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs!.window.alert(
        `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
      );
    });
}
function updateUI() {
  addon.data.prefs?.tableHelper?.rerender();
  setTimeout(() => addon.data.prefs?.tableHelper?.treeInstance.invalidate());
}
