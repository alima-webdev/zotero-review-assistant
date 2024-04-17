type TableViewColumn = {
    name: string,
    label: string
}

export class TableView {
    cols: TableViewColumn[] = []
    rows: any[] = []
    root?: Document
    element: HTMLElement
    editable: boolean = false
    constructor() {
        this.element = document.createElement('table')
    }

    appendTo(root: Document, rootElement: HTMLElement) {
        ztoolkit.log(this.element)
        rootElement.appendChild(this.element)
        this.root = root
    }

    getElement() {
        return this.element
    }

    getCellContent(colName: string, value: any) {
        let cellHTML = value
        // if(this.editable) {
            // const cellElement = ztoolkit.UI.createElement(this.root, 'input')
            // cellElement.setAttribute('name', colName)
            // cellElement.setAttribute('value', value)
            // // cellHTML = `<input type="text" name="${colName}" value="${value}" />`
            // ztoolkit.log(cellElement.outerHTML)
            // cellHTML = cellElement.outerHTML
            // cellHTML = `<html:input xmlns="http://www.w3.org/1999/xhtml" name="color" type="text" value="transparent" />`
        // }
        return cellHTML
    }

    render() {

        let tableHTML = ``

        // Header
        let header = `<thead>`
        for (const col of this.cols) {
            header += `<th id="th-${col.name}">${col.label}</th>`
        }
        header += `</thead>`

        tableHTML += header

        // Rows
        let i = 0
        for (const row of this.rows) {
            let rowHTML = `<tr>`

            // For each column
            let j = 0;
            for (const col of this.cols) {
                // Get the corresponding column name
                const cell = row[col.name]

                rowHTML += `<td data-index="${i},${j}">${this.getCellContent(col.name, cell)}</td>`
                j++
            }
            rowHTML += `</tr>`

            tableHTML += rowHTML
            i++
        }

        this.element.innerHTML = tableHTML
    }
}