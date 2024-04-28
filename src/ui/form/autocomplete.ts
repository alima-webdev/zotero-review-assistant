import autocomplete from "../../vendors/autocompleter/autocomplete";

export function initAutoComplete(
    input: HTMLInputElement,
    container?: HTMLDivElement,
) {
    autocomplete({
        document: ztoolkit.getGlobal("document"),
        input: input,
        fetch: function (text, update) {
            text = text.toLowerCase();
            const suggestions = document.allReasons.filter((n) =>
                n.label.toLowerCase().startsWith(text),
            );
            update(suggestions);
        },
        onSelect: function (item) {
            input.value = item.label ?? "";
        },
        render: function (
            item: any,
            currentValue: string,
        ): HTMLDivElement | undefined {
            const itemElement = document.createElement("div");
            itemElement.textContent = item?.label;
            return itemElement;
        },
        container: container,
        preventSubmit: 2,
    });
}
