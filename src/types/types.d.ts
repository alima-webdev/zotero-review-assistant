// Addon.ts
export type AddonInitProps = {
    id: string,
    version: string,
    rootURI: string,
    referenceName: string
}

// Hooks.ts
type usePreferencesProps = {
    id: string,
    label: string,
    type?: string,
    image?: string,
    src: string,
    scripts?: string[],
    stylesheets?: string[]
}

type usePreferencesPanelReactProps = {
    id: string,
    label: string,
    type?: string,
    image?: string,
    additionalScripts?: string[],
    stylesheets?: string[]
}

type KeyCombination = {
    ctrlKey: boolean,
    altKey: boolean,
    shiftKey: boolean,
    metaKey: boolean,
    code: string,
}
type KeyboardShortcutOptions = {
    keystroke: KeyCombination;
    callback: () => void;
}

type MenuItem = {
    type: "menuseparator" | "menuitem" | "menu",
    label?: string,
    image?: string,
    action?: (event: CommandEvent) => void
    children?: MenuItem[]
}

// Pref
type usePrefValue = string | number | boolean
type usePrefOptions = {
    parseJSON?: boolean,
    observe?: boolean,
}
type usePrefStateValue = usePrefValue | Object | any[]
type usePrefStateFunction = (value: any) => void
type usePrefState = [usePrefStateValue, usePrefStateFunction]

// Components
type TableColumn = {
    name: string,
    label: string,
    labelFn?: (cell: any) => string
}
type TableProps = {
    columns: TableColumn[]
    data: any[],
    onDoubleClick?: (item: any, index: number) => void
}