// Log to file
export async function log(...message: any[]) {
    // Log on the console
    if(Zotero.getMainWindow().console) Zotero.getMainWindow().console.log(...message)
        else Zotero.log(JSON.stringify(message))

    // Write it to file
    if (pluginLogPath && pluginLogPath != "") {
        const outputFile = Zotero.File.pathToFile(pluginLogPath || "");
        const now = new Date();
        const timestamp = `${(now.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${now.getDate().toString().padStart(2, '0')}/` +
            `${now.getFullYear()} ` +
            `${now.getHours().toString().padStart(2, '0')}:` +
            `${now.getMinutes().toString().padStart(2, '0')}:` +
            `${now.getSeconds().toString().padStart(2, '0')}`;
        const existing = await Zotero.File.getContentsAsync(outputFile).catch(() => "");
        const formattedMessage = message.map(m => {
            try {
                return typeof m === "object" ? JSON.stringify(m) : String(m);
            } catch {
                return String(m);
            }
        }).join(" ");
        const newContent = `${existing}${timestamp} - ${formattedMessage}\n`;
        await Zotero.File.putContentsAsync(outputFile, newContent);
    }
}

export function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}













// export function log(...args: any[]) {
//     window.console.log(processArgs(args).join(", "))
// }
// export function warn(...args: any[]) {
//     window.console.warn(processArgs(args).join(", "))
// }
// export function error(...args: any[]) {
//     window.console.error(processArgs(args).join(", "))
// }

// function processArgs(args: any[]) {
//     return args.map(arg => {
//         if (typeof arg === "object") {
//             return JSON.stringify(arg)
//         } else {
//             return arg
//         }
//     })
// }