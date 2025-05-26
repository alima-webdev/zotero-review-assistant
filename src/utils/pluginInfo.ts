let pluginInfo = {
    id: "",
    version: "",
    rootURI: "",
    referenceName: ""
}

export function getPluginInfo() {
    return pluginInfo
}

export function setPluginInfo(info: {id: string, version: string, rootURI: string, referenceName: string}) {
    pluginInfo = info
}