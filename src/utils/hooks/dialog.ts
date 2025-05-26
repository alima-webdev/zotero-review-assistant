import { log } from "../devtools";
import { getPluginInfo } from "../pluginInfo";

// TODO: Implement
export function useDialog(title: string, message: string, buttons: string[], onbutton: (button: number) => void) {
    // Open a dialog window
    let dialogWindow = window.openDialog("about:blank", "_blank", "chrome,width=400,height=300")

    // Check if the window was successfully created
    if (dialogWindow) {
        // Write the basic HTML structure into the dialog
        dialogWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
            </head>
            <body>
                <h1>Hello, Dialog!</h1>
                <p>This is a dialog with a script!</p>
            </body>
            </html>
        `)
    }

    //     // Create a script element
    //     let script = dialogWindow.document.createElement("script");
    //     script.type = "text/javascript";
    //     script.textContent = `
    //     console.log("Script is running in the dialog!");
    //     alert("This is a script inside the dialog!");
    // `;

    //     // Append the script to the dialog's document
    //     dialogWindow.document.body.appendChild(script);
    // } else {
    //     console.error("Failed to create dialog window.");
    // }

    return;


    //     log(`
    //         <?xml version="1.0"?>
    //         <?xml-stylesheet href="chrome://global/skin/" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero/skin/zotero.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero/skin/overlay.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero-platform/content/overlay.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero-platform/content/zotero.css"?>
    //         <!DOCTYPE window SYSTEM "chrome://zotero/locale/zotero.dtd">

    //         <window id="zotero-select-items-dialog" windowtype="zotero:item-selector"
    //             xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" xmlns:html="http://www.w3.org/1999/xhtml"
    //             onload="" onunload="" persist="screenX screenY width height"
    //             drawintitlebar-platforms="mac,win">

    //             <dialog id="select-items-dialog" orient="vertical" buttons="cancel,accept" data-l10n-id="select-items-dialog"
    //                 data-l10n-attrs="buttonlabelaccept">
    //                 <html:div>asdmisdnaodsa</html:div>
    //             </dialog>
    //         </window>
    //     `)
    //     const dialogURL = URL.createObjectURL(new Blob([`
    //         <?xml version="1.0"?>
    //         <?xml-stylesheet href="chrome://global/skin/" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero/skin/zotero.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero/skin/overlay.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero-platform/content/overlay.css" type="text/css"?>
    //         <?xml-stylesheet href="chrome://zotero-platform/content/zotero.css"?>
    //         <!DOCTYPE window SYSTEM "chrome://zotero/locale/zotero.dtd">

    //         <window id="zotero-select-items-dialog" windowtype="zotero:item-selector"
    //             xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" xmlns:html="http://www.w3.org/1999/xhtml"
    //             onload="" onunload="" persist="screenX screenY width height"
    //             drawintitlebar-platforms="mac,win">

    //             <dialog id="select-items-dialog" orient="vertical" buttons="cancel,accept" data-l10n-id="select-items-dialog"
    //                 data-l10n-attrs="buttonlabelaccept">
    //                 <html:div>asdmisdnaodsa</html:div>
    //             </dialog>
    //         </window>
    //     `], { type: "text/html" }));
    //     log(dialogURL)

    //     // const dialogURL = `data:application/xhtml+xml;charset=utf-8,${encodeURIComponent(dialogXHTML)}`;
    //     // return window.openDialog(dialogURL, '', 'chrome,modal,width=520,height=240');
    //     // return window.openDialog(`chrome://${globals.info.referenceName}/content/dialog.xhtml`, "_blank");
    //     // return window.openDialog(dialogURL, '', 'chrome,modal,width=520,height=240');
    //     return window.openDialog(`chrome://${globals.info.referenceName}/content/dialog.xhtml`, '', 'chrome,modal,width=520,height=240');
}