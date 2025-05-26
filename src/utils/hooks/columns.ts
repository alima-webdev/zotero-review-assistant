import { useEffect } from "react";
import { getPluginInfo } from "../pluginInfo";
import { log } from "../devtools";
// import { extraColumns } from "../columns.utils";

// Extra Columns
export async function useExtraColumn(options: _ZoteroTypes.ItemTreeManager.ItemTreeColumnOptions) {
    // log("useExtraColumn", options)
    // Ensure the column options includes dataKey
    // if (extraColumns.includes(options.dataKey)) return

    // Column Options
    const columnOptions = {
        pluginID: getPluginInfo().id,
        enabledTreeIDs: ['main'],
        ...options,
    }

    // Register the columm
    useEffect(() => {
        const registerColumn = async () => {
            const registerColumnFn =
                Zotero.ItemTreeManager.registerColumn ||
                Zotero.ItemTreeManager.registerColumns;
            const dataKey = await registerColumnFn.apply(Zotero.ItemTreeManager, [columnOptions])
            // const dataKey = await Zotero.ItemTreeManager.registerColumn(columnOptions)
            if (!dataKey) return;

            await Zotero.ItemTreeManager.refreshColumns()
            // extraColumns.push(dataKey)
        }
        registerColumn()
        return () => {
            const unregisterColumn = async () => {
                await Zotero.ItemTreeManager.unregisterColumn(columnOptions.dataKey)
                await Zotero.ItemTreeManager.refreshColumns()
            }
            unregisterColumn()
        }
    }, [])
}