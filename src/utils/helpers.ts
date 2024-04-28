// Helper functions
import { allStatuses, prismaSections, reasonTagPrefix, statusTagPrefix } from "../lib/global";
import { log } from "./devtools";
// import { jsPDF } from "jspdf";
// import * as htmlToImage from 'html-to-image';
// import * as htmlToImageUtils from 'html-to-image/src/util';
// import * as htmlToImage from 'html-to-image';
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { toPng, toCanvas, toJpeg, toBlob, toPixelData, toSvg } from '../vendors/html-to-image/src/index';
// import { htmlToPng, testDocx } from "./test";
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import htmlToSvg from "htmlsvg";

const { FilePicker } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs');

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


// PRISMA
export function getPRISMASectionFromItem(item: Zotero.Item) {
    const section = prismaSections.find((obj) => item.hasTag(obj.tag));
    return prismaSections.find((obj) => item.hasTag(obj.tag)) || [];
}
export function removePRISMASectionFromItem(item: Zotero.Item) {
    const section = getPRISMASectionFromItem(item)
    item.removeTag(section.tag)
}

// Count the number of items with a certain tag given an array of items
export function countItemsWithTag(tag: string, items: Zotero.Item[]) {
    let count = 0

    for (const item of items) {
        if (item.hasTag(tag)) {
            count++;
        }
    }

    return count
}

export async function showFilePicker(mime = "*", filter: number = FilePicker.filterAll, name: string = ''): Promise<string | undefined> {

    let ext = Zotero.MIME.getPrimaryExtension(mime, '');
    let fp = new FilePicker();
    fp.init(ztoolkit.getGlobal('window'), name, fp.modeSave);
    fp.appendFilters(filter);
    fp.defaultString = name + '.' + ext;
    let rv = await fp.show();

    let outputPath;
    if (rv === fp.returnOK || rv === fp.returnReplace) {
        outputPath = fp.file;
    }
    return outputPath
}

export async function exportFileWithContents(content: any, mimeType: string = '*', filter: any) {

    // Show file picker and save the file
    // const outputPath = await showFilePicker(mimeType, filter)
    const outputPath = "~/Downloads/image.svg"
    if (outputPath) {
        const outputFile = Zotero.File.pathToFile(outputPath)
        Zotero.File.putContents(outputFile, content)
    }
}

export async function downloadContent(element: HTMLIFrameElement) {

    // await testDocx()
    return;
    /*
    // const data = await htmlToPng(element) as ImageData
    const data = await htmlToSvg(element.contentWindow?.document.body)

    let s = new XMLSerializer();
    let str = s.serializeToString(data);

    exportFileWithContents(str, 'image/svg', FilePicker.filterImage)
    log(data)

    return;

    // Show file picker and save the file
    const outputPath = await showFilePicker('text/html', FilePicker.filterHTML)
    if (outputPath) {
        const outputFile = Zotero.File.pathToFile(outputPath)
        Zotero.File.putContents(outputFile, content)
        // Zotero.launchFile(outputFile.path)

    }

    // Generate temporary file (optional)
    // const path = Zotero.getTempDirectory()
    // const fileName = "prisma-" + new Date().toISOString() + ".html"
    // const file = Zotero.File.putContents(path, content)
    // const uri = await Zotero.File.generateDataURI(path.path, 'text/html')
    */
}