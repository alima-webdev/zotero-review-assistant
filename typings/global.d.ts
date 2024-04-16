interface Document {
  setStatusReason: (selectedItems: Zotero.Item[]) => void;
  setReviewStatus: (status: string) => void;
  reasonModal: ReviewModal
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
type ReviewStatus = {
    id: number,
    name: string,
    tag: string,
    label: string,
    color: string,
    askForReason: boolean,
    default: boolean
}