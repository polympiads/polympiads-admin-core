import { flexRender, type Table } from "@tanstack/react-table";

export function TableBody<T> (props: { table: Table<T> }) {
    const table = props.table;

    return <tbody>
    {table.getRowModel().rows.length === 0 ? (
        <tr>
        <td
            colSpan={table.getVisibleLeafColumns().length + 1}
            className="text-center py-10 text-gray-400 text-xs"
        >
            No users found
        </td>
        </tr>
    ) : (
        table.getRowModel().rows.map((row) => {
        const isSelected = row.getIsSelected();
        return (
            <tr
            key={row.id}
            className={`border-b border-gray-200 transition-colors
                ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
            >
            {/* TODO add back selection checkboxes */
            /*<td className="px-2 py-2 text-center">
                Y
            </td>*/}
            {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 max-w-[200px] truncate">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
            </tr>
        );
        })
    )}
    </tbody>
}
