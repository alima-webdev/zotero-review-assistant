interface Document {
    setStatusReason: () => void;
    setReviewStatus: (status: string) => void;
    generateReport: () => void;
    reasonModal: Modal;
    reportModal: Modal;
    allReasons: { label: any; value: any }[];
}

declare const _globalThis: {
    [key: string]: any;
    Zotero: _ZoteroTypes.Zotero;
    ZoteroPane: _ZoteroTypes.ZoteroPane;
    Zotero_Tabs: typeof Zotero_Tabs;
    window: Window;
    document: Document;
    ztoolkit: ZToolkit;
    addon: typeof addon;
};

declare type ZToolkit = ReturnType<
    typeof import("../src/utils/ztoolkit").createZToolkit
>;

declare const ztoolkit: ZToolkit;

declare const rootURI: string;

declare const addon: import("../src/addon").default;

declare const __env__: "production" | "development";

declare class Localization {}

// declare global {
//     interface Document {
//         setStatusReason: () => void;
//         setReviewStatus: (status: string) => void;
//     }
// }
type Status = {
    name: string;
    tag: string;
    label: string;
    color: string;
    askForReason: boolean;
    default: boolean;
    keyboardShortcut: string;
    keystroke: Keystroke;
};

// class Modal {
//   id: string;
//   root?: HTMLElement | Document;
//   element: HTMLElement;
//   constructor(id: string, element: HTMLElement);
//   appendTo(root: HTMLElement | Document);
//   open();
//   closeKeyStroke(ev: any);
//   close();
//   bindEvents();
// }

interface HTMLInputElement {
    updateLabelValue: () => void;
}

// PRISMA
type PRISMASection = {
    label: string,
    name: string,
    tag: string,
}

type PRISMAData = {
    title: string,
    identification: {
        title: string,
        collection: {
            databases: number,
            registers: number,
            other: number
        },
        excluded: {
            duplicates: number,
            automation: number,
            other: number
        }
    },
    screening: {
        title: string,
        screen: {
            total: number,
            excluded: number,
        },
        retrieval: {
            total: number,
            excluded: number,
        },
        eligibility: {
            total: number,
            reasons: {
                label: string,
                records: number,
            }[]
        }
    },
    included: {
        title: string,
        records: {
            new: number,
            reports: number,
        }
    }
}