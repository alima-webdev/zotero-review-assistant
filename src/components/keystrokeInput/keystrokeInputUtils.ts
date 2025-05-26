// import { log } from "../../utils/devtools";

type KeystrokeModifiers = {
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
};

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

export const keyString = getKeyStringByOS();

export class Keystroke {
    modifiers: KeystrokeModifiers = {
        alt: false,
        ctrl: false,
        meta: false,
        shift: false,
    };
    key: string = "";
    code: string = "";

    constructor() {}

    static fromString(keystrokeString: string) {
        console.log("Fn: Keystroke.fromString");
        const keystroke = new Keystroke();
        keystroke.modifiers.alt =
            keystrokeString.includes(keyString!.alt) ||
            keystrokeString.includes("Alt")
                ? true
                : false;
        keystroke.modifiers.ctrl =
            keystrokeString.includes(keyString!.ctrl) ||
            keystrokeString.includes("Ctrl")
                ? true
                : false;
        keystroke.modifiers.meta =
            keystrokeString.includes(keyString!.meta) ||
            keystrokeString.includes("Meta")
                ? true
                : false;
        keystroke.modifiers.shift =
            keystrokeString.includes(keyString!.shift) ||
            keystrokeString.includes("Shift")
                ? true
                : false;
        keystroke.key = keystrokeString.split("").at(-1) || "";
        keystroke.code = (isNaN(parseInt(keystroke.key)) ? "Key" + keystroke.key : "Digit" + keystroke.key)
        return keystroke;
    }

    toString(): string {
        let modifiers = "";
        if (this.modifiers.alt) modifiers += keyString?.alt + " ";
        if (this.modifiers.ctrl) modifiers += keyString?.ctrl + " ";
        if (this.modifiers.meta) modifiers += keyString?.meta + " ";
        if (this.modifiers.shift) modifiers += keyString?.shift + " ";
        const strKeystroke = modifiers + this.code;
        return strKeystroke;
    }

    toJSON(): string {
        const data = {
            modifiers: this.modifiers,
            code: this.code,
        };
        return JSON.stringify(data);
    }
}

interface HTMLKeystrokeInputElement extends HTMLInputElement {
    keystrokeValue: Keystroke;
}

const invalidMainKeys = [
    "Shift",
    "Alt",
    "Control",
    "Meta",
    "ContextMenu",
    "NumLock",
    "ScrollLock",
    "VolumeMute",
    "VolumeDown",
    "VolumeUp",
    "MediaSelect",
    "LaunchApp1",
    "LaunchApp2",
];

export function isMainKeyValid(key: string) {
    let valid = true;
    if (invalidMainKeys.includes(key)) {
        valid = false;
    }
    return valid;
}