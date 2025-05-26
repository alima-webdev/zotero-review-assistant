import { useEffect } from "react";
import { KeyboardShortcutOptions, KeyCombination } from "../../types/types";

// Keyboard Shortcuts
const keyboardShortcutManager = new class {
    private shortcuts: KeyboardShortcutOptions[] = [];
    public initialized: boolean = false

    private handleKeyDown(event: KeyboardEvent) {
        for (const shortcut of this.shortcuts) {

            if (event.code === shortcut.keystroke.code &&
                event.ctrlKey === shortcut.keystroke.ctrlKey &&
                event.shiftKey === shortcut.keystroke.shiftKey &&
                event.altKey === shortcut.keystroke.altKey &&
                event.metaKey === shortcut.keystroke.metaKey
            ) {
                shortcut.callback()
                event.preventDefault()
                event.stopPropagation()
            }
        }
    }

    public init() {
        if (this.initialized) return;
        document.documentElement.addEventListener("keydown", this.handleKeyDown.bind(this))
        this.initialized = true
    }

    public addShortcut(options: KeyboardShortcutOptions) {
        this.shortcuts.push(options);
    }
}

export function useKeyboardShortcut(keystroke: KeyCombination, callback: () => void, deps: any[] = []) {
    useEffect(() => {
        if (!keyboardShortcutManager.initialized) keyboardShortcutManager.init()
        keyboardShortcutManager.addShortcut({ keystroke, callback: () => { callback(deps) } });
    });
}