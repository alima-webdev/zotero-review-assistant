// Types
import { Ref, RefObject } from "react"
import { KeyCombination } from "../types/types"
import { ArticleStatus } from "../types/addon"

/**
 * Converts a keyboard event into a string representation of the key combination.
 *
 * This function takes a `KeyboardEvent` object and returns a string that represents
 * the combination of keys pressed during the event. The string includes the names
 * of modifier keys (Ctrl, Meta, Alt, Shift) followed by the main key code.
 *
 * @param event - The keyboard event to convert.
 * @returns A string representing the key combination.
 */
export function getStringFromKeyboardEvent(event: KeyboardEvent): string {
    let combination = []
    let code = event.code.replace("Key", "").replace("Digit", "")
    if (event.ctrlKey) combination.push("Ctrl")
    if (event.metaKey) combination.push("Meta")
    if (event.altKey) combination.push("Alt")
    if (event.shiftKey) combination.push("Shift")
    combination.push(code)
    return combination.join(" ")
}

export const keyStringMac = {
    alt: "⌥",
    ctrl: "⌃",
    meta: "⌘",
    shift: "⇧",
};
export const keyStringWin = {
    alt: "Alt",
    ctrl: "Ctrl",
    meta: "Windows",
    shift: "Shift",
};
export const keyStringLinux = {
    alt: "Alt",
    ctrl: "Ctrl",
    meta: "Super",
    shift: "Shift",
};

export function getKeyStringByOS() {
    if (Zotero.isMac) return keyStringMac;
    if (Zotero.isWin) return keyStringWin;
    if (Zotero.isLinux) return keyStringLinux;
}

const keystring = getKeyStringByOS()

export function getStringFromKeyCombination(keys: KeyCombination): string {

    let combination = []
    let code = keys.code.replace("Key", "").replace("Digit", "")
    if (keys.ctrlKey) combination.push(keystring?.ctrl)
    if (keys.metaKey) combination.push(keystring?.meta)
    if (keys.altKey) combination.push(keystring?.alt)
    if (keys.shiftKey) combination.push(keystring?.shift)
    combination.push(code)
    return combination.join(" ")
}

/**
 * Parses a keystroke string and returns an object representing the key combination.
 *
 * @param keystroke - A string representing the keystroke combination (e.g., "Ctrl Alt A").
 * @returns An object representing the key combination with properties for control keys and the key code.
 *
 * @example
 * ```typescript
 * const combination = getKeyCombination("Ctrl Alt A");
 * // combination will be:
 * // {
 * //   ctrlKey: true,
 * //   altKey: true,
 * //   shiftKey: false,
 * //   metaKey: false,
 * //   code: "KeyA"
 * // }
 * ```
 */
export function getKeyCombination(keystroke: string): KeyCombination {
    const keys = keystroke.split(" ")
    let code = keys[keys.length - 1]
    // If letter, add the Key prefix
    if (/[a-zA-Z]/g.test(code) && code.length === 1) {
        code = "Key" + code.toUpperCase()
    } else if (/^\d$/.test(code)) {
        code = "Digit" + code
    }
    return {
        ctrlKey: keys.includes("Ctrl"),
        altKey: keys.includes("Alt"),
        shiftKey: keys.includes("Shift"),
        metaKey: keys.includes("Meta"),
        code: code
    }
}

/**
 * Parses a JSON string and returns the corresponding object.
 * If the string cannot be parsed, returns a default value.
 *
 * @param {string} jsonString - The JSON string to parse.
 * @param {any} defaultValue - The default value to return if parsing fails.
 * @returns {any} The parsed object or the default value.
 */
export function JSONFromString(jsonString: string, defaultValue: any = {}): any {
    let obj = defaultValue
    try {
        obj = JSON.parse(jsonString) || defaultValue
    } catch (e) {
        obj = defaultValue
    }
    return obj
}

export async function getTagsFromCurrentLibrary(): Promise<string[]> {
    const tags = await Zotero.Tags.getAll(Zotero.Libraries.userLibraryID)
    return Array.from(new Set(tags.map(tag => tag.tag)))
}

export function mergeRefs(...refs: Ref<HTMLElement>[]) {
    return (value) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                ref.current = value;
            }
        });
    };
}

export function getStatus(item: Zotero.Item, statusList: ArticleStatus[]) {
    const tags = item.getTags()
    return statusList.find(status =>
        tags.findIndex(tag => status.tag == tag.tag) != -1
    )
}
export function getMatchingTag(item: Zotero.Item, tagList: string[]): string | undefined {
    const tags = item.getTags()
    return tagList.find(listTag =>
        tags.findIndex(itemTag => itemTag.tag == listTag) != -1
    )
}

export function countArticlesWithTag(articles: Zotero.Item[], tag: string) {
    return articles.reduce((count, article) => count + (article.hasTag(tag) ? 1 : 0), 0)
}

export function getComments(commentsTagPrefix: string, article: Zotero.Item) {
    return article.getTags()
        .map(tag => tag.tag)
        .filter(tag => tag.startsWith(commentsTagPrefix))
}