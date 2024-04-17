import { config } from "../../package.json";
import { TableView } from "../ui/table-original";
import { getString } from "../utils/locale";
import { createModal } from "../utils/modal";
import { getPref } from "../utils/prefs";
import { allStatuses } from "./consts";
import { loadXHTMLFromFile, parseXHTML, parseXHTMLFromFile } from "./helpers";

export async function registerPrefsScripts(_window: Window) {
  // This function is called when the prefs window is opened
  // See addon/chrome/content/preferences.xul onpaneload
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
      rows: allStatuses,
    };
  } else {
    addon.data.prefs.window = _window;
  }
  updatePrefsUI();
  bindPrefEvents();
}

async function updatePrefsUI() {
  // You can initialize some UI elements on prefs window
  // with addon.data.prefs.window.document
  // Or bind some events to the elements
  const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
  if (addon.data.prefs?.window == undefined) return;

  // Edit status modal
  const modalContent = document.createElement('div')
  // modalContent.innerHTML = `<html:textarea></html:textarea>`

  const modalForm = document.createElement('form')

  const documentRoot = addon.data.prefs!.window.document.documentElement
  // const styles = ztoolkit.UI.createElement(document, "link", {
  //   properties: {
  //     type: "text/css",
  //     rel: "stylesheet",
  //     href: `chrome://${config.addonRef}/content/zoteroPane.css`,
  //   },
  // });
  // documentRoot.appendChild(styles);

  // Load the form HTML template
  const formTemplate = loadXHTMLFromFile(rootURI + "chrome/content/modal/prefsStatus.xhtml")
  const formNodes = parseXHTML(formTemplate)

  // Load the form nodes
  // const formNodes = parseXHTMLFromFile(rootURI + "chrome/content/modal/prefsStatus.xhtml")
  // Import nodes
  const formNodesImported = addon.data.prefs!.window.document.importNode(formNodes, true)
  // Append nodes
  addon.data.prefs!.window.document.documentElement.querySelector(`#${config.addonRef}-status-modal`)?.appendChild(formNodesImported)

  // 
  const prefsModal = createModal("prefs", "Edit", modalContent)
  prefsModal.appendTo(documentRoot)

  const tableHelper = new ztoolkit.VirtualizedTable(addon.data.prefs?.window)
    .setContainerId(`${config.addonRef}-table-container`)
    .setProp({
      id: `${config.addonRef}-prefs-table`,
      // Do not use setLocale, as it modifies the Zotero.Intl.strings
      // Set locales directly to columns
      columns: addon.data.prefs?.columns,
      showHeader: true,
      multiSelect: true,
      staticColumns: true,
      disableFontSizeScaling: true,
    })
    .setProp("getRowCount", () => addon.data.prefs?.rows.length || 0)
    .setProp(
      "getRowData",
      (index) =>
        addon.data.prefs?.rows[index] || {},
    )
    // Show a progress window when selection changes
    .setProp("onSelectionChange", (selection) => {
      new ztoolkit.ProgressWindow(config.addonName)
        .createLine({
          text: `Selected line: ${addon.data.prefs?.rows
            .filter((v, i) => selection.isSelected(i))
            .map((row) => row.title)
            .join(",")}`,
          progress: 100,
        })
        .show();
    })
    .setProp("onActivate", (selection) => {
      ztoolkit.log("Open Dialog to Change the Status")
      prefsModal.open()
    })
    // When pressing delete, delete selected line and refresh table.
    // Returning false to prevent default event.
    .setProp("onKeyDown", (event: KeyboardEvent) => {
      if (event.key == "Delete" || (Zotero.isMac && event.key == "Backspace")) {
        addon.data.prefs!.rows =
          addon.data.prefs?.rows.filter(
            (v, i) => !tableHelper.treeInstance.selection.isSelected(i),
          ) || [];
        tableHelper.render();
        return false;
      }
      return true;
    })
    // For find-as-you-type
    .setProp(
      "getRowString",
      (index) => addon.data.prefs?.rows[index].title || "",
    )
    // Render the table.
    .render(-1, () => {
      renderLock.resolve();
    });
  await renderLock.promise;
  ztoolkit.log("Preference table rendered!");
}

function bindPrefEvents() {
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
