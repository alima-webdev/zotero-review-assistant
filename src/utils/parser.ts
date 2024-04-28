import { loadLocalFile } from "./helpers";

// Parse XHTML from File
export function parseXHTMLFromFile(src: string) {
    const markup = loadLocalFile(src);
    return parseXHTML(markup);
}

// Parse XHTML from String
export function parseXHTML(str: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    if (doc.documentElement.localName === "parsererror") {
        throw new Error("not well-formed XHTML");
    }

    // We use a range here so that we don't access the inner DOM elements from
    // JavaScript before they are imported and inserted into a document.
    const range = doc.createRange();
    range.selectNodeContents(doc.querySelector("div") as Node);
    return range.extractContents();
}