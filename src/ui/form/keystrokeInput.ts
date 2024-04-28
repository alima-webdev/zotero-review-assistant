import { registerEventListener } from "../../utils/events";

type KeystrokeModifiers = {
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
};

const keyStringMac = {
    alt: "⌥",
    ctrl: "⌃",
    meta: "⌘",
    shift: "⇧",
};
const keyStringWin = {
    alt: "Alt",
    ctrl: "Ctrl",
    meta: "Windows",
    shift: "Shift",
};
const keyStringLinux = {
    alt: "Alt",
    ctrl: "Ctrl",
    meta: "Super",
    shift: "Shift",
};

function getKeyStringByOS() {
    if (Zotero.isMac) return keyStringMac;
    if (Zotero.isWin) return keyStringWin;
    if (Zotero.isLinux) return keyStringLinux;
    // switch (os) {
    //   case "Darwin":
    //     return keyStringMac
    //     break;
    //   case "WINNT":
    //     return keyStringWindows
    //     break;
    //   case "Linux":
    //     return keyStringLinux
    //     break;
    // }
}

const keyString = getKeyStringByOS();

export class Keystroke {
    modifiers: KeystrokeModifiers = {
        alt: false,
        ctrl: false,
        meta: false,
        shift: false,
    };
    key: string = "";

    static fromString(keystrokeString: string) {
        const keystroke = new Keystroke();
        keystroke.modifiers.alt = keystrokeString.includes(
            keyString?.alt || "Alt",
        )
            ? true
            : false;
        keystroke.modifiers.ctrl = keystrokeString.includes(
            keyString?.ctrl || "Control",
        )
            ? true
            : false;
        keystroke.modifiers.meta = keystrokeString.includes(
            keyString?.meta || "Meta",
        )
            ? true
            : false;
        keystroke.modifiers.shift = keystrokeString.includes(
            keyString?.shift || "Shift",
        )
            ? true
            : false;
        keystroke.key = keystrokeString.split("").at(-1) || "";
        return keystroke;
    }

    toString(): string {
        let modifiers = "";
        if (this.modifiers.alt) modifiers += keyString?.alt + " ";
        if (this.modifiers.ctrl) modifiers += keyString?.ctrl + " ";
        if (this.modifiers.meta) modifiers += keyString?.meta + " ";
        if (this.modifiers.shift) modifiers += keyString?.shift + " ";
        const strKeystroke = modifiers + this.key;

        ztoolkit.log(this.key);
        return strKeystroke;
    }

    toJSON(): string {
        const data = {
            modifiers: this.modifiers,
            key: this.key,
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

function isMainKeyValid(key: string) {
    let valid = true;
    if (invalidMainKeys.includes(key)) {
        valid = false;
    }
    return valid;
}

class KeystrokeInput {
    input: HTMLKeystrokeInputElement;

    constructor(input: HTMLInputElement) {
        this.input = input as HTMLKeystrokeInputElement;

        this.bindEvents();
    }
    bindEvents() {
        registerEventListener(
            this.input,
            "keydown",
            this.handleKeyDownEvent.bind(this),
        );

        // Prevent keypress from adding an extra character to the input value
        registerEventListener(
            this.input,
            "keyup",
            this.handleKeyUpEvent.bind(this),
        );
        registerEventListener(
            this.input,
            "keypress",
            this.bypassEvent.bind(this),
        );

        // this.input.addEventListener(
        //     "keydown",
        //     this.handleKeyDownEvent.bind(this),
        // );
        // this.input.addEventListener("keyup", this.handleKeyUpEvent.bind(this));
        // this.input.addEventListener("keypress", this.bypassEvent.bind(this));
    }
    bypassEvent(ev: KeyboardEvent) {
        ev.preventDefault();
    }
    handleKeyUpEvent(ev: KeyboardEvent) {
        this.input.blur();
        ev.preventDefault();
    }
    handleKeyDownEvent(ev: KeyboardEvent) {
        if (ev.repeat) return;
        // Get the keystroke and construct the class
        const key = isMainKeyValid(ev.key) ? ev.key : "";
        const isAlt = ev.altKey;
        const isCtrl = ev.ctrlKey;
        const isMeta = ev.metaKey;
        const isShift = ev.shiftKey;

        const keystroke = new Keystroke();
        keystroke.modifiers = {
            alt: isAlt,
            ctrl: isCtrl,
            meta: isMeta,
            shift: isShift,
        };
        keystroke.key = key;

        // Set the element value
        this.input.value = keystroke.toString();
        this.input.keystrokeValue = keystroke;

        // Prevent the default behavior
        ev.preventDefault();
        return false;
    }
}
export function attachKeystrokeInput(element: HTMLInputElement) {
    const keystrokeInput = new KeystrokeInput(element);
    return keystrokeInput;
}
