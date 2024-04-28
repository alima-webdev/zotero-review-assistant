//@ts-nocheck Developer tools
export function log(...data: any) {
    if (data.length === 0) {
      return;
    }
    const Zotero = ztoolkit.getGlobal("Zotero");
    const console = ztoolkit.getGlobal("console");
    // If logOption is not provides, use the global one.
    let options: typeof ztoolkit._basicOptions.log;
    if (data[data.length - 1]?._type === "toolkitlog") {
      options = data.pop();
    } else {
      options = ztoolkit._basicOptions.log;
    }
    try {
      if (options.prefix) {
        data.splice(0, 0, options.prefix);
      }
    //   if (!options.disableConsole) {
        console.groupCollapsed(...data);
        console.trace();
        console.groupEnd();
    //   }
    //   if (!options.disableZLog) {
        Zotero.debug(
          data
            .map((d: any) => {
              try {
                return typeof d === "object" ? JSON.stringify(d) : String(d);
              } catch (e) {
                Zotero.debug(d);
                return "";
              }
            })
            .join("\n")
        );
    //   }
    } catch (e: unknown) {
      console.error(e);
      Zotero.logError(e as Error);
    }
  }