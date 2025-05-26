// URL Binding
import { log } from "../devtools";

// TODO: Implement
export function useURLBinding() {

    // Zotero.URIHandler.register({
    //     uri: "zotero://blah",
    //     action: async (uri: { spec: string }) => {
    //         log("URI", uri)
    //     }
    // })
    let ioExtension = {
        // loadAsChrome: false,
        // noContent: true,
        doAction: async (uri: { spec: string }) => {
            log("URI", uri)

            // Check if userPass is supported before using it
            try {
                if ("userPass" in uri) {
                    log("userPass:", uri.userPass); // Avoid accessing if unsupported
                }
            } catch (e) {
                log("userPass not supported for this URI:", e);
            }
        },
        newChannel: (uri: any, loadInfo: any) => {
            log("URI 2", uri)
            ioExtension.doAction(uri)
            // log("URI 2", uri)

            // return new AsyncChannel(uri, loadInfo, function* () {
            // })
            // return ioExtension.doAction(uri)
            return null; // Ensure the method returns a value
        },
    }
    const { Services } = ChromeUtils.importESModule("resource://gre/modules/Services.jsm");
    // @ts-ignore
    Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions["zotero://blah"] = ioExtension;
}
