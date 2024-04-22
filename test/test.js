var keyString = {
    alt: 'Alt',
    ctrl: 'Ctrl',
    meta: 'Meta',
    shift: 'Shift'
};
var Keystroke = /** @class */ (function () {
    function Keystroke() {
        this.modifiers = {
            alt: false,
            ctrl: false,
            meta: false,
            shift: false,
        };
        this.key = '';
    }
    Keystroke.prototype.toString = function () {
        var modifiers = '';
        if (this.modifiers.alt)
            modifiers += keyString.alt + ' ';
        if (this.modifiers.ctrl)
            modifiers += keyString.ctrl + ' ';
        if (this.modifiers.meta)
            modifiers += keyString.meta + ' ';
        if (this.modifiers.shift)
            modifiers += keyString.shift + ' ';
        var strKeystroke = modifiers + this.key;
        return strKeystroke;
    };
    return Keystroke;
}());
function attachKeystrokeInput(element) {
    element.addEventListener('keydown', function (ev) {
        // Get the keystroke and construct the class
        var key = ev.key;
        var isAlt = ev.altKey;
        var isCtrl = ev.ctrlKey;
        var isMeta = ev.metaKey;
        var isShift = ev.shiftKey;
        var keystroke = new Keystroke();
        keystroke.modifiers = {
            alt: isAlt,
            ctrl: isCtrl,
            meta: isMeta,
            shift: isShift,
        };
        keystroke.key = key;
        // Set the element value
        element.value = keystroke.toString();
        // Prevent the default behavior
        ev.preventDefault();
    });
}
