import { useEffect } from "react"
import { MenuItem } from "../../types/types"

/**
 * Creates and appends context menu items to a specified popup element.
 *
 * @param {string} [selector="zotero-itemmenu"] - The ID of the popup element to which the context menu items will be appended.
 * @param {ContextMenuItem[]} [items=[]] - An array of context menu items to be created and appended.
 *
 * @typedef {Object} ContextMenuItem
 * @property {string} type - The type of the menu item (e.g., "item").
 * @property {string} label - The label for the menu item.
 * @property {string} [image] - The URL of the image/icon for the menu item.
 * @property {Function} [action] - The function to be executed when the menu item is clicked.
 */
function generateMenuDOM(element: MenuItem) {

    let item = document.createXULElement(`${element.type}`)
    switch (element.type) {
        case "menuitem":
            item.classList.add("menuitem-iconic")
            item.setAttribute("label", element.label)
            if (element.image) item.setAttribute("image", element.image)
            if (element.action) item.addEventListener("command", element.action)
            break;
        case "menu":
            const popup = document.createXULElement("menupopup")
            element.children.map(child => {
                const childMarkup = generateMenuDOM(child)
                popup.appendChild(childMarkup)
            })
            item.appendChild(popup)
            item.setAttribute("label", element.label)
            if (element.image) item.setAttribute("image", element.image)
            break;
    }
    return item
}
/**
 * Custom hook to create and manage a context menu.
 *
 * @param {string} [selector="zotero-itemmenu"] - The ID of the DOM element where the context menu will be appended.
 * @param {MenuItem[]} [items=[]] - An array of menu items to be added to the context menu.
 * @param {any[]} [deps=[]] - An array of dependencies that will trigger the effect when changed.
 *
 * @returns {void}
 *
 * @example
 * useContextMenu("custom-menu", [{ label: "Item 1", action: () => console.log("Item 1 clicked") }], [dependency]);
 */
export function useContextMenu(selector: string = "zotero-itemmenu", items: MenuItem[] = [], deps: any[] = []) {
    useEffect(() => {
        const popup = document.getElementById(selector)
        if (!popup) return
        const elements = items.map(item => {
            const element = generateMenuDOM(item)

            if (!popup.lastElementChild) return
            popup.lastElementChild.after(element)
            return element
        })
        return () => {
            elements.map(element => element?.remove())
        }
    }, deps)
}