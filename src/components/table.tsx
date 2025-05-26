// External Dependencies
import { useState } from "react"

// Internal Dependencies
import { useKeyboardShortcut } from "../utils/hooks"
import { getKeyCombination } from "../utils/utils"

// Types
import { TableProps } from "../types/types"

// Devtools
import { log } from "../utils/devtools"

function Table({ columns, data, onDoubleClick = (item: any, index: number) => { } }: TableProps) {

    // States
    const [selectedRow, setSelectedRow] = useState<number | null>(null)

    // Keyboard Shortcuts
    useKeyboardShortcut(getKeyCombination("ArrowUp"), () => {
        if (selectedRow == null || selectedRow <= 0) return
        setSelectedRow(selectedRow - 1)
    })
    useKeyboardShortcut(getKeyCombination("ArrowDown"), () => {
        if (selectedRow == null || selectedRow >= data.length - 1) return
        setSelectedRow(selectedRow + 1)
    })
    useKeyboardShortcut(getKeyCombination("Enter"), () => {
        if (selectedRow === null) return
        onDoubleClick(data[selectedRow], selectedRow)
    })

    return (
        <table className="overflow-hidden rounded-md bg-white dark:bg-[#1f1f1f]">
            {/* Header */}
            <thead>
                <tr>
                    {columns.map((header, index) => (
                        <td key={index} className="py-1 border-b border-[#e5e5e5] dark:border-[#2b2b2b] text-bold" >
                            <div className={`my-1 px-2 ${index <= columns.length - 2 ? "border-e border-[#e5e5e5] dark:border-[#2b2b2b]" : ""}`}>
                                {header.label}
                            </div>
                        </td>
                    ))}
                </tr>
            </thead>

            {/* Rows */}
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} onClick={() => { setSelectedRow(index) }} onDoubleClick={() => { onDoubleClick(item, index) }}>
                        {columns.map((col, cellIndex) => {
                            const name = col.name as keyof typeof item
                            const value = (col.labelFn ? col.labelFn(item) : item[name]) as string

                            const isSelected = (selectedRow === index)
                            return (
                                <td
                                    key={cellIndex}
                                    className={`
                                            ${cellIndex === 0 ? "rounded-s-md" : ""} ${cellIndex === columns.length - 1 ? "rounded-e-md" : ""}
                                            my-1 p-2
                                            ${isSelected ? "bg-[#2459ca] text-white" : ""}
                                        `}
                                >
                                    {value}
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table