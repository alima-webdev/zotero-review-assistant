
let customColumn = [{
    dataKey: 'zotero-items-column-supporting',
    label: 'Supporting',
    iconLabel: '',
    flex: '1',
    zoteroPersist: new Set(['width', 'ordinal', 'hidden', 'sortActive', 'sortDirection']),
}]

const marker = 'SciteMonkeyPatched'

function repatch(object, method, patcher) {
  object[method] = patcher(object[method])
  object[method][marker] = true
}

function patch(object, method, patcher) {
  if (object[method][marker]) throw new Error(`${method} re-patched`)
  repatch(object, method, patcher)
}

const itemTree = require('zotero/itemTree')
patch(itemTree.prototype, 'getColumns', original => function Zotero_ItemTree_prototype_getColumns() {
    const columns = original.apply(this, arguments)
    const insertAfter = columns.findIndex(column => column.dataKey === 'title')
    columns.splice(insertAfter + 1, 0, ...customColumn)
    return columns
})