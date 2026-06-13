import { Link, type LinkProps } from "@tanstack/react-router";
import { flexRender, type Table } from "@tanstack/react-table";

export function TableBody<T> (props: { noneText: string, table: Table<T>, redirect ?: (data: T) => LinkProps, }) {
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
            const isSelected = row.getIsSelected();
            const linkProps = props?.redirect?.(row.original);
            return (
                <tr
                key={row.id}
                className={`border-b border-gray-200 transition-colors relative 
                    ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                {/* TODO add back selection checkboxes */
                /*<td className="px-2 py-2 text-center">
                    Y
                </td>*/}
                {row.getVisibleCells().map((cell, index) => (
                    <td key={cell.id} className="px-3 py-2 max-w-[200px] truncate">
                        {index === 0 && linkProps && (
                                <Link
                                    {...linkProps}
                                    className="absolute inset-0 z-1"
                                    aria-label="Open row"
                                />
                            )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
                </tr>
            );
        })
    )}
    </tbody>
}
