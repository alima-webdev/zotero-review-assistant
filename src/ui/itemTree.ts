import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { module } from "../utils/module";
import { getStatusContextMenu, initStatusColumn, statusKeyboardEvents, statusRegisterGlobalFunctions } from "./statusColumn";
import { getReasonContextMenu, initReasonColumn, reasonKeyboardEvents, reasonRegisterDOM, reasonRegisterGlobalFunctions } from "./reasonColumn";

// ---------------------------------------------
// Review Module
// ---------------------------------------------
export class ReviewModule {
    // Stylesheet
    @module
    static registerStyleSheet() {
        const styles = ztoolkit.UI.createElement(document, "link", {
            properties: {
                type: "text/css",
                rel: "stylesheet",
                href: `chrome://${config.addonRef}/content/zoteroPane.css`,
            },
        });
        document.documentElement.appendChild(styles);
    }

    // Extra Columns
    @module
    static registerExtraColumnWithBindings() {
        initStatusColumn()
        initReasonColumn()

        const statusContextMenu = getStatusContextMenu()
        const reasonContextMenu = getReasonContextMenu()
        const contextMenu = statusContextMenu.concat(reasonContextMenu)

        ztoolkit.Menu.register("item", { tag: "menuseparator" });
        ztoolkit.Menu.register("item", {
            tag: "menu",
            label: getString("context-menu-status"),
            children: contextMenu,
        });

        // Keyboard Shortcuts
        ztoolkit
            .getGlobal("document")
            .addEventListener("keyup", (ev: KeyboardEvent) => {
                // Check if the ItemTree is focused to use keyboard shortcuts
                const activeElement = ztoolkit.getGlobal("document").activeElement
                const itemTreeElement = ztoolkit.getGlobal("document").querySelector("#item-tree-main-default")
                if (itemTreeElement?.contains(activeElement)) {
                    statusKeyboardEvents(ev)
                    reasonKeyboardEvents(ev)
                }
            });

        // Register the global context menu functions
        statusRegisterGlobalFunctions()
        reasonRegisterGlobalFunctions()
    }

    // DOM Events
    @module
    static async registerDOMElements() {
        await reasonRegisterDOM()
    }
}
