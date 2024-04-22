type KeystrokeModifiers = {
    alt: boolean,
    ctrl: boolean,
    meta: boolean,
    shift: boolean,
}

const keyString = {
    alt: 'Alt',
    ctrl: 'Ctrl',
    meta: 'Meta',
    shift: 'Shift'
}

class Keystroke {
    modifiers: KeystrokeModifiers = {
        alt: false,
        ctrl: false,
        meta: false,
        shift: false,
    }
    key: string = ''

    toString(): string {
        let modifiers = ''
        if (this.modifiers.alt) modifiers += keyString.alt + ' '
        if (this.modifiers.ctrl) modifiers += keyString.ctrl + ' '
        if (this.modifiers.meta) modifiers += keyString.meta + ' '
        if (this.modifiers.shift) modifiers += keyString.shift + ' '

        const strKeystroke = modifiers + this.key
        return strKeystroke
    }
}

function attachKeystrokeInput(element: HTMLInputElement) {
    element.addEventListener('keydown', (ev: KeyboardEvent) => {
        // Get the keystroke and construct the class
        const key = ev.key
        const isAlt = ev.altKey
        const isCtrl = ev.ctrlKey
        const isMeta = ev.metaKey
        const isShift = ev.shiftKey

        const keystroke = new Keystroke()
        keystroke.modifiers = {
            alt: isAlt,
            ctrl: isCtrl,
            meta: isMeta,
            shift: isShift,
        }
        keystroke.key = key

        // Set the element value
        element.value = keystroke.toString()

        // Prevent the default behavior
        ev.preventDefault()
    });
}