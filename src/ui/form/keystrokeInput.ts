import { log } from "../../utils/devtools";
import { registerEventListener } from "../../utils/events";

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

export const keyString = getKeyStringByOS();

export class Keystroke {
    modifiers: KeystrokeModifiers = {
        alt: false,
        ctrl: false,
        meta: false,
        shift: false,
    };
    key: string = "";

    constructor() { }

    static fromString(keystrokeString: string) {
        log("Fn: Keystroke.fromString")
        const keystroke = new Keystroke();
        keystroke.modifiers.alt = (keystrokeString.includes(keyString!.alt) || keystrokeString.includes("Alt")) ? true : false;
        keystroke.modifiers.ctrl = (keystrokeString.includes(keyString!.ctrl) || keystrokeString.includes("Ctrl")) ? true : false;
        keystroke.modifiers.meta = (keystrokeString.includes(keyString!.meta) || keystrokeString.includes("Meta"))
            ? true
            : false;
        keystroke.modifiers.shift = (keystrokeString.includes(keyString!.shift) || keystrokeString.includes("Shift"))
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
        return strKeystroke;
    }

    toJSON(): string {
        const data = {
            modifiers: this.modifiers,
            key: this.key,
        };
        return JSON.stringify(data);
    }

    validateAgainst(ev: KeyboardEvent) {

        return (
            ev.altKey == this.modifiers.alt &&
            ev.ctrlKey == this.modifiers.ctrl &&
            ev.metaKey == this.modifiers.meta &&
            ev.shiftKey == this.modifiers.shift &&
            ev.code == "Key" + this.key.toUpperCase()
        )
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
        this.input.setAttribute('readonly', 'true')

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
        // log("Press")
        ev.preventDefault();
        ev.stopImmediatePropagation();
        return false;
    }
    handleKeyUpEvent(ev: KeyboardEvent) {
        // log("KeyUp")
        this.input.blur();
        ev.preventDefault();
        ev.stopImmediatePropagation();
        return false;
    }
    handleKeyDownEvent(ev: KeyboardEvent) {
        if (ev.repeat) return;
        // log("KeyDown")

        // Get the keystroke and construct the class
        const key = isMainKeyValid(ev.code) ? ev.code.replace("Key", "") : "";
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
        ev.stopImmediatePropagation();
        return false;
    }
}
export function attachKeystrokeInput(element: HTMLInputElement) {
    const keystrokeInput = new KeystrokeInput(element);
    return keystrokeInput;
}
