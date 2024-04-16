import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { allStatuses, reasonTagPrefix } from "./consts";
import { getItemStatus, removeAllStatuses, getStatusFromTag, getItemStatusTags, generateMenuIcon, getAllReasonsFromItems } from "./helpers";
import { module } from "./module";
import { createModal, initModal } from "../utils/modal";
import autocomplete from "autocompleter";

// Load XUI services
const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

// ---------------------------------------------
// Review Status Column
// ---------------------------------------------
const columnId = "123";
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
  // innerElement.classList.add(data.split(":")[1]);
  const status = getStatusFromTag(data)
  innerElement.style.backgroundColor = status?.color ?? ""
  innerElement.textContent = status?.label ?? ""
  element.appendChild(innerElement)
  return element;
}

const columnOptions = { renderCell: renderStatusCell };

// ---------------------------------------------
// Reason Column
// ---------------------------------------------
const columnReasonId = "456";
const getReasonColumnHook = (
  field: string,
  unformatted: boolean,
  includeBaseMapped: boolean,
  item: Zotero.Item,
) => {

  const statusTags = getItemStatusTags(item)
  const reason = statusTags.find(obj => obj.tag.includes(reasonTagPrefix))?.tag.replace(reasonTagPrefix, "") ?? ""
  return reason;
};
const columnReasonOptions = {};

// Reason Modal
let reasonModal;

// ---------------------------------------------
// Review Module
// ---------------------------------------------
export class ReviewModule {
  @module
  static registerStyleSheet() {
    const styles = ztoolkit.UI.createElement(document, "link", {
      properties: {
        type: "text/css",
        rel: "stylesheet",
        href: `chrome://${config.addonRef}/content/zoteroPane.css`,
      },
    });
    document.documentElement.appendChild(styles);
  }

  @module
  static registerExtraColumnWithBindings() {
    // Register the extra fields
    const columnName = getString('status-column-header');
    ztoolkit.ItemTree.register(
      columnId,
      columnName,
      getStatusColumnHook,
      columnOptions,
    );
    const columnReasonName: string = getString('reason-column-header');
    ztoolkit.ItemTree.register(
      columnReasonId,
      columnReasonName,
      getReasonColumnHook,
      columnReasonOptions,
    );

    // Register the context menu items
    const statusMenuChildren = allStatuses.map((status): MenuitemOptions => {
      return { tag: "menuitem", label: status.label, icon: generateMenuIcon(status.color), oncommand: `document.setReviewStatus('${status.tag}')` }
    })

    ztoolkit.Menu.register("item", { tag: "menuseparator" });
    ztoolkit.Menu.register("item", {
      tag: "menu",
      label: getString("context-menu-status"),
      children: statusMenuChildren,
    });

    // -----------------------------------------------
    // TODO: Review Below
    // -----------------------------------------------

    // Register the global functions
    ztoolkit.getGlobal("document").setReviewStatus = (statusTag) => {

      const selectedItems: Zotero.Item[] = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();
      for (const item of selectedItems) {
        // Remove the old tag status
        removeAllStatuses(item)

        item.addTag(statusTag);
        item.saveTx();
      }

      // Get status from the tag name provided
      const status = getStatusFromTag(statusTag)

      // If excluded, ask to provide a reason for exclusion
      if (status?.askForReason) document.setStatusReason(selectedItems);
    };

    ztoolkit.getGlobal("document").setStatusReason = async (selectedItems) => {
      document.allReasons = getAllReasonsFromItems(await ztoolkit.getGlobal("Zotero").Tags.getAll())
      document.reasonModal.open()
    };
  }

  @module
  static async registerDOMEvents() {

    const reasonModalBody = document.createElement('div')

    const reasonModalDescription = document.createElement('div')
    reasonModalDescription.textContent = getString("reason-dialog-text")
    reasonModalBody.appendChild(reasonModalDescription)

    // Form
    const reasonForm = document.createElement('form')

    // Input + Autocomplete
    const reasonInput = ztoolkit.UI.createElement(document, 'input')
    reasonInput.id = 'input-reason'
    reasonInput.type = 'text'
    const autocompleteContainer = document.createElement('div')
    const inputContainer = document.createElement('div')
    inputContainer.appendChild(reasonInput)
    inputContainer.appendChild(autocompleteContainer)
    reasonForm.appendChild(inputContainer)

    // Buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('btn-container')

    const btnCancel = document.createElement('button')
    btnCancel.classList.add('btn')
    btnCancel.textContent = 'Cancel'

    const btnSubmit = document.createElement('button')
    btnSubmit.type = 'submit'
    btnSubmit.classList.add('btn')
    btnSubmit.classList.add('btn-primary')
    btnSubmit.textContent = 'Submit'

    buttonContainer.appendChild(btnCancel)
    buttonContainer.appendChild(btnSubmit)

    reasonForm.appendChild(buttonContainer)

    reasonModalBody.appendChild(reasonForm)

    // Form submission
    reasonForm.onsubmit = () => {
      ztoolkit.log("Submit")
      ztoolkit.log(reasonInput.value)

      const selectedItems: Zotero.Item[] = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();

      // Update the exclusion criteria
      for (const item of selectedItems) {
        // Remove the exclusion criteria
        item.getTags().map((tag) => {
          if (tag.tag.includes(reasonTagPrefix)) item.removeTag(tag.tag);
        });

        item.addTag(reasonTagPrefix + reasonInput.value);
        item.saveTx();
      }

      reasonModal.close()
    }

    // Modal
    const reasonModal = createModal('reason-modal', getString("reason-dialog-title"), reasonModalBody)
    reasonModal.appendTo(document.documentElement)
    document.reasonModal = reasonModal

    btnCancel.onclick = () => {
      reasonInput.value = ""
      reasonModal.close()
    }

    document.allReasons = getAllReasonsFromItems(await ztoolkit.getGlobal("Zotero").Tags.getAll())

    autocomplete({
      input: reasonInput,
      fetch: function (text, update) {
        text = text.toLowerCase();
        const suggestions = document.allReasons.filter(n => n.label.toLowerCase().startsWith(text))
        update(suggestions);
      },
      onSelect: function (item) {
        reasonInput.value = item.label;
      },
      render: function (item, currentValue: string): HTMLDivElement | undefined {
        const itemElement = document.createElement('div');
        itemElement.textContent = item.label
        return itemElement
      },
      container: autocompleteContainer,
    });
    initModal()
  }
}