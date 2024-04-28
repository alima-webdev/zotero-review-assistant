import { registerEventListener } from "../../utils/events";

export function attachColorPicker(
    _window: Window,
    _document: Document,
    element?: HTMLInputElement,
) {
    ztoolkit.log("Fn: attachColorPicker");

    if (!element) return false;

    element.type = "color";

    const label = element.parentNode?.querySelector(
        "label",
    ) as HTMLLabelElement;
    if (!label) return false;

    label.textContent = element.value;

    element.updateLabelValue = () => {
        label.textContent = element.value;
    };

    registerEventListener(
        element,
        "input",
        (ev) => {
            label.textContent = element.value;
        },
        false,
    );

    return true;
}
