import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { allStatuses } from "../lib/global";
import { createModal, initModal } from "./modal";
import { getString } from "../utils/locale";
import { parseXHTML } from "../utils/helpers";

export function getReportContextMenu(): MenuitemOptions[] {
    return [
        { tag: "menuseparator" },
        {
            tag: "menuitem",
            label: "Generate Report",
            oncommand: `document.generateReport()`,
        },
    ];
}

export function reportRegisterGlobalFunctions() {
    // Set Reason
    ztoolkit.getGlobal("document").generateReport = async () => {
        // Check if any items are selected
        const selectedItems: Zotero.Item[] = ztoolkit
            .getGlobal("ZoteroPane")
            .getSelectedItems();
        if (selectedItems.length == 0) return;

        // Check if the modal table has been generated properly
        if (!reportModalTBody) return;

        // Link status and items/articles
        let totalCount = 0;
        reportModalTBody.innerHTML = ``;
        for (const status of allStatuses.filter(
            (stat) => stat.default === false,
        )) {
            const statusLabel =
                status.label != ""
                    ? status.label
                    : getString("status-default-label");
            const statusItems = selectedItems.filter((item) => {
                return item.hasTag(status.tag);
            });
            const statusCount = statusItems.length;
            reportModalTBody.innerHTML += `
            <tr>
                <td>${statusLabel}</td>
                <td align="center">${statusCount}</td>
            </tr>
            `;

            totalCount += statusCount;
        }

        // Default status
        let defaultStatusLabel = allStatuses.filter(
            (stat) => stat.default === true,
        )[0].label;
        if (defaultStatusLabel == "")
            defaultStatusLabel = getString("status-blank-label");
        const defaultStatusCount = selectedItems.length - totalCount;

        reportModalTBody.innerHTML += `
      <tr>
        <td>${defaultStatusLabel}</td>
        <td align="center">${defaultStatusCount}</td>
      </tr>
    `;

        // Total count
        totalCount = selectedItems.length;

        reportModalTBody.innerHTML += `
        <tr class="border-top">
        <td>${getString("status-total-label")}</td>
        <td align="center">${totalCount}</td>
        </tr>
        `;

        document.reportModal.open();
        return;
    };
}

let reportModalTBody: HTMLTableSectionElement | null;
export async function reportRegisterDOM() {
    const reportModalBody = document.createElement("div");
    const bodyContent = document.importNode(
        parseXHTML(`
        <div>
            <table class="table">
                <thead>
                    <tr class="border-bottom">
                        <th>${getString("report-dialog-table-status")}</th>
                        <th>${getString("report-dialog-table-count")}</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <br />
            <div class="text-center">
                <button class="btn" action="close">Close</button>
            </div>
        </div>
    `),
        true,
    );
    reportModalBody.append(bodyContent);
    reportModalTBody = reportModalBody.querySelector("tbody");

    // Modal
    const reportModal = createModal(
        "report-modal",
        getString("report-dialog-title"),
        reportModalBody,
    );
    reportModal.appendTo(document.documentElement);
    document.reportModal = reportModal;
    initModal();
}
