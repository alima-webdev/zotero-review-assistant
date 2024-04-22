type KeystrokeModifiers = {
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
};

const keyString = {
  alt: "⌥",
  ctrl: "⌃",
  meta: "⌘",
  shift: "⇧",
};

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
    keystroke.modifiers.alt = keystrokeString.includes(keyString.alt)
      ? true
      : false;
    keystroke.modifiers.ctrl = keystrokeString.includes(keyString.ctrl)
      ? true
      : false;
    keystroke.modifiers.meta = keystrokeString.includes(keyString.meta)
      ? true
      : false;
    keystroke.modifiers.shift = keystrokeString.includes(keyString.shift)
      ? true
      : false;
    keystroke.key = keystrokeString.split("").at(-1) || "";
    return keystroke;
  }

  toString(): string {
    let modifiers = "";
    if (this.modifiers.alt) modifiers += keyString.alt + " ";
    if (this.modifiers.ctrl) modifiers += keyString.ctrl + " ";
    if (this.modifiers.meta) modifiers += keyString.meta + " ";
    if (this.modifiers.shift) modifiers += keyString.shift + " ";
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

class KeystrokeInput {
  input: HTMLKeystrokeInputElement;

  constructor(input: HTMLInputElement) {
    this.input = input as HTMLKeystrokeInputElement;

    this.bindEvents();
  }
  bindEvents() {
    this.input.addEventListener("keydown", this.handleKeyEvent.bind(this));

    // Prevent keypress from adding an extra character to the input value
    this.input.addEventListener("keypress", (ev: KeyboardEvent) => {
      ev.preventDefault();
    });
  }
  handleKeyEvent(ev: KeyboardEvent) {
    // Get the keystroke and construct the class
    const key = ev.key;
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
    ztoolkit.log(keystroke.toString());
    this.input.value = keystroke.toString();
    // this.input.keystrokeValue = keystroke

    // Prevent the default behavior
    ev.preventDefault();
    return false;
  }
}
export function attachKeystrokeInput(element: HTMLInputElement) {
  const keystrokeInput = new KeystrokeInput(element);
  return keystrokeInput;
}
