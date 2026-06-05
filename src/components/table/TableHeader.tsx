import { flexRender, type Table } from "@tanstack/react-table";
import { type JSX, type ReactNode } from "react";

type HeaderColumnOrdering = "none" | "inactive" | "ascending" | "descending";

const textFromOrdering: { [key in HeaderColumnOrdering]: string } = {
    "none": "", "inactive": String.fromCharCode(9650), "ascending": String.fromCharCode(9650), "descending": String.fromCharCode(9660)
};
const colorFromOrdering: { [key in HeaderColumnOrdering]: string } = {
    "none": "", "inactive": "text-gray-300", "ascending": "text-blue-600", "descending": "text-blue-600"
};

function orderingFromColumn(col: { getCanSort: () => boolean, getIsSorted: () => false | 'asc' | 'desc' }): HeaderColumnOrdering {
    if (!col.getCanSort()) return "none";
    const sorted = col.getIsSorted();
    if (!sorted)          return "inactive";
    if (sorted === 'asc') return "ascending";
    return "descending";
}

function HeaderColumn (props : { content: ReactNode | JSX.Element, ordering: HeaderColumnOrdering, onClick: (x: any) => void }) {
    return <th
        onClick={props.onClick}
        className="px-3 py-2 text-left font-medium text-gray-500 cursor-pointer select-none hover:text-gray-700 whitespace-nowrap">
        { props.content }
        <span className={"ml-1 text-[10px] select-none " + colorFromOrdering[props.ordering]}>
            {textFromOrdering[props.ordering]}
        </span>
    </th>
}

export function TableHeader<T> (props: { table: Table<T> }) {
    const table   = props.table;
    const headers = table.getHeaderGroups()[0].headers;

    return <thead>
        <tr className="bg-gray-100 border-b border-gray-300">
            {/*<th className="w-9 px-2 py-2 text-center">
                <input className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" type="checkbox"></input>
            </th>*/}

            {
                ...headers.map((header) => 
                    <HeaderColumn 
                        key={header.id}
                        content={flexRender(header.column.columnDef.header, header.getContext())}
                        ordering={orderingFromColumn(header.column)}
                        onClick={header.column.getToggleSortingHandler() as any}
                        />)
            }
        </tr>
    </thead>
}
