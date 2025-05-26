// import { log } from "./devtools";
// import globals from "./globals";
// import { signal, effect } from "@preact/signals";


// // type Status = {
// //     tag: string,
// //     label: string,
// //     color: string,
// //     keystroke?: string,
// // }

// // [
// //     { tag: "Status: Test", label: "Test", color: "#ff0000", keystroke: "" }
// // ]


// // let preferences = new class {
// //     statuses = signal<Status[]>([])
// //     init() {
// //         // Check if the preferences exist
// //         if(Zotero.Prefs.get(`${globals.info.referenceName}.statuses`) === undefined) {
// //             Zotero.Prefs.set(`${globals.info.referenceName}.statuses`, JSON.stringify([]));
// //         }

// //         log(`${globals.info.referenceName}`)
// //         log(Zotero.Prefs.get(`${globals.info.referenceName}.statuses`))

// //         // Load the preferences
// //         this.statuses.value = JSON.parse(Zotero.Prefs.get(`${globals.info.referenceName}.statuses`) as string) as Status[]

// //         // Add effect signals
// //         effect(() => {
// //             Zotero.Prefs.set(`${globals.info.referenceName}.statuses`, JSON.stringify(this.statuses));
// //         })
// //     }
// // }

// // export default preferences