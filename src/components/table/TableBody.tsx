import { Link, type LinkProps } from "@tanstack/react-router";
import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { CheckboxCell } from "./cells/CheckboxCell";
import type { SelectionPolicy } from "./select/SelectionPolicy";
import { useCallback } from "react";

function TableRow<T> ({ selectionPolicy, row, redirect }: { selectionPolicy ?: SelectionPolicy<T>, redirect ?: (data: T) => LinkProps, row: Row<T> }) {
    const isSelected = row.getIsSelected();
    const linkProps = redirect?.(row.original);

    const getSelectionValue = useCallback(() => {
        return selectionPolicy?.selected(row.original) || "off";
    }, [selectionPolicy?.selected, row]);

    const onSelectionClick = useCallback(() => {
        selectionPolicy?.onClick(row.original);
    }, [selectionPolicy?.onClick, row]);

    return <tr
        key={row.id}
        className={`border-b border-gray-200 transition-colors relative 
            ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
        >
        {
            (selectionPolicy !== undefined)
            && <td className="relative z-2 text-center">
                <CheckboxCell value={getSelectionValue} onClick={onSelectionClick} />
            </td>
        }
        {row.getVisibleCells().map((cell, index) => (
            <td key={cell.id} className="px-3 py-2 max-w-[200px] truncate">
                {index === 0 && linkProps && (
                        <Link
                            {...linkProps}
                            className="absolute left-0 inset-0 z-1"
                            aria-label="Open row"
                        />
                    )}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        ))}
    </tr>
}

export function TableBody<T> (props: { selectionPolicy ?: SelectionPolicy<T>, noneText: string, table: Table<T>, redirect ?: (data: T) => LinkProps, }) {
    const table = props.table;

    return <tbody>
    {table.getRowModel().rows.length === 0 ? (
        <tr>
        <td
            colSpan={table.getVisibleLeafColumns().length + 1}
            className="text-center py-10 text-gray-400 text-xs"
        >
            {props.noneText}
        </td>
        </tr>
    ) : (
        table.getRowModel().rows.map((row) => {
            return <TableRow row={row} key={row.id} redirect={props.redirect} selectionPolicy={props.selectionPolicy} />
        })
    )}
    </tbody>
}
