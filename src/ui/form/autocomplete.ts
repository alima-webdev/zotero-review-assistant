import { prismaSections, reasonTagPrefix } from "../../lib/global";
import { log } from "../../utils/devtools";
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

            const prismaSuggestions = prismaSections
                .map((section) => {
                    const label = section.tag.replace(reasonTagPrefix, "");
                    if (label.toLowerCase().includes(text.toLowerCase())) {
                        return label;
                    }
                })
                .filter(Boolean);

            const statusSuggestions = document.allReasons
                .map((reason) => {
                    const label = reason.value.replace(reasonTagPrefix, "");
                    if (label.toLowerCase().includes(text.toLowerCase())) {
                        return label;
                    }
                })
                .filter(Boolean);

            const suggestions = [
                ...new Set(prismaSuggestions.concat(statusSuggestions)),
            ].map((suggestion) => {
                return { label: suggestion, value: suggestion };
            });

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
