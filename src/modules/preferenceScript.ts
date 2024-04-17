import { config } from "../../package.json";
import { TableView } from "../ui/table";
import { getString } from "../utils/locale";
import { getPref } from "../utils/prefs";
import { allStatuses } from "./consts";

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

  const statusTable = new TableView()
  // statusTable.editable = true
  statusTable.cols = [
    { name: "name", label: "Name" },
    { name: "tag", label: "Tag" },
    { name: "label", label: "Label" },
    { name: "color", label: "Color" },
    { name: "askForReason", label: "Ask for a Reason" },
    { name: "default", label: "Default Status" },
  ]
  statusTable.rows = allStatuses
  ztoolkit.log(addon.data.prefs!.window.document.documentElement)
  ztoolkit.log(addon.data.prefs!.window.document.documentElement.querySelector(`#${config.addonRef}-table-container`))
  statusTable.appendTo(
    addon.data.prefs!.window.document,
    addon.data.prefs!.window.document.documentElement.querySelector(`#${config.addonRef}-table-container`)
  )
  statusTable.render()

  ztoolkit.log("Preference table rendered!");
}

function bindPrefEvents() {
  // addon.data
  //   .prefs!.window.document.querySelector(
  //     `#zotero-prefpane-${config.addonRef}-enable`,
  //   )
  //   ?.addEventListener("command", (e) => {
  //     ztoolkit.log(e);
  //     addon.data.prefs!.window.alert(
  //       `Successfully changed to ${(e.target as XUL.Checkbox).checked}!`,
  //     );
  //   });

  // addon.data
  //   .prefs!.window.document.querySelector(
  //     `#zotero-prefpane-${config.addonRef}-input`,
  //   )
  //   ?.addEventListener("change", (e) => {
  //     ztoolkit.log(e);
  //     addon.data.prefs!.window.alert(
  //       `Successfully changed to ${(e.target as HTMLInputElement).value}!`,
  //     );
  //   });
}
