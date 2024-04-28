import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { createModal, initModal } from "../modal";
import { getString } from "../../utils/locale";
import { getPrismaData, generatePrismaFromTemplate } from "../../utils/prisma";
import { parseXHTML } from "../../utils/parser";
import { loadLocalFile } from "../../utils/helpers";
import { registerEventListener } from "../../utils/events";
import { log } from "../../utils/devtools";

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

        // Get the PRISMA data
        const prismaData = getPrismaData(selectedItems);

        // Adjust the form accordingly
        (
            document.reportModal.element.querySelector(
                "#included-total",
            ) as HTMLElement
        ).textContent = String(prismaData.included.total);
        (
            document.reportModal.element.querySelector(
                "#prisma-data",
            ) as HTMLInputElement
        ).value = JSON.stringify(prismaData);

        // PRISMA Diagram
        document.reportModal.open();
    };
}
export async function reportRegisterDOM() {
    // Roots
    const rootElement = document.documentElement;

    const reportModalBody = document.createElement("div");
    // Load the form from the XHTML file
    const reportTemplate = loadLocalFile(
        rootURI + "chrome/content/modal/report.xhtml",
    );
    const reportNodes = parseXHTML(reportTemplate);
    // Import and append
    const reportNodesImported = document.importNode(reportNodes, true);
    reportModalBody.appendChild(reportNodesImported);

    // Modal
    const itemTreeElement = ztoolkit
        .getGlobal("document")
        .querySelector("#item-tree-main-default") as HTMLElement;
    const reportModal = createModal(
        "report-modal",
        getString("report-dialog-title"),
        reportModalBody,
        { onCloseFocus: itemTreeElement },
    );
    reportModal.appendTo(rootElement);
    document.reportModal = reportModal;

    initModal();

    const reportForm = document.reportModal.element.querySelector(
        "#report-form",
    ) as HTMLFormElement;
    registerEventListener(reportForm, "submit", async (ev: Event) => {
        log("Report Form Submit");
        const databases = (
            reportForm.querySelector("#databases") as HTMLInputElement
        ).value;
        const studies = (
            reportForm.querySelector("#included-studies") as HTMLInputElement
        ).value;
        const reports = (
            reportForm.querySelector("#included-reports") as HTMLInputElement
        ).value;
        const prismaData = JSON.parse(
            String(
                (reportForm.querySelector("#prisma-data") as HTMLInputElement)
                    .value,
            ),
        ) as PRISMAData;

        // Ensure the prisma data is set
        if (!prismaData) return;

        // Update the PRISMA data
        prismaData.identification.collection.databases = parseInt(databases);
        prismaData.included.records.studies = parseInt(studies);
        prismaData.included.records.reports = parseInt(reports);

        await generatePrismaFromTemplate(prismaData);

        document.reportModal.close();
    });
}

export function reportKeyboardEvents(ev: KeyboardEvent) {
    if (ev.key == "t") {
        ztoolkit.getGlobal("document").generateReport();
    }
}
