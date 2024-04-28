// Helper functions
import { prismaSections } from "../lib/global";
import { log } from "./devtools";

// File picker
const { FilePicker } = ChromeUtils.importESModule(
    "chrome://zotero/content/modules/filePicker.mjs",
);

export function generateMenuIcon(color: string) {
    return (
        "data:image/svg+xml;base64," +
        window.btoa(
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="12" r="12" /></svg>`,
        )
    );
}

export function loadLocalFile(src: string) {
    return Zotero.File.getContentsFromURL(src);
}

// Count the number of items with a certain tag given an array of items
export function countItemsWithTag(tag: string, items: Zotero.Item[]) {
    let count = 0;

    for (const item of items) {
        if (item.hasTag(tag)) {
            count++;
        }
    }

    return count;
}

export async function showFilePicker(
    mime = "*",
    filter: number = FilePicker.filterAll,
    name: string = "",
): Promise<string | undefined> {
    const ext = Zotero.MIME.getPrimaryExtension(mime, "");
    const fp = new FilePicker();
    fp.init(ztoolkit.getGlobal("window"), name, fp.modeSave);
    fp.appendFilters(filter);
    fp.defaultString = name + "." + ext;
    const rv = await fp.show();

    let outputPath;
    if (rv === fp.returnOK || rv === fp.returnReplace) {
        outputPath = fp.file;
    }
    return outputPath;
}
