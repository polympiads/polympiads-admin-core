import { useState, useEffect, useCallback } from "react";
import { TableHeader } from "./TableHeader";
import { getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { TableBody } from "./TableBody";
import { useTablePreferences } from "./TablePreferences";
import TableFooter from "./TableFooter";
import type { LinkProps } from "@tanstack/react-router";
import type { SelectionPolicy } from "./select/SelectionPolicy";

export interface PaginatedResults<T> {
  count   : number
  results : T[]
};

export function useInMemoryQuery<T> (data: () => Promise<T[] | undefined>): (sortParam: string, page: number, page_size: number) => Promise<PaginatedResults<T> | undefined> {
  return useCallback(async (_sortParam: string, _page: number, _page_size: number) => {
    const res = await data();

    if (res === undefined) {
      return undefined;
    }

    return {
      count: res.length,
      results: res
    };
  }, [data]);
}

export type Column<T, V> = ColumnDef<T, V> & ({
  enableHiding ?: true,
  defaultVisible : boolean 
} | { enableHiding: false });

export interface TableProps<T> {
  tableKind: string,

  footerDisabled?: boolean,
  inMemory ?: boolean,

  noneText: string,

  redirect ?: (data: T) => LinkProps,

  page: {
    index: number,
    setIndex: (newIndex: number) => void
  },
  sorting: {
    sortingState: SortingState,
    setSortingState: (newState: SortingState) => void
  },

  query: (pageSize: number) => Promise<PaginatedResults<T> | undefined>,
  columns: Column<T, any>[],

  selectionPolicy ?: SelectionPolicy<T>
};

function computeDefaultVisibility<T> (columns: Column<T, any>[]): { [key: string]: boolean } {
  const results: { [key: string]: boolean } = {};

  for (const column of columns) {
    if (column.enableHiding === false) continue ;

    const key = column.id ?? (column as ColumnDef<T, any> & { accessorKey?: string }).accessorKey;
    if (key) {
      results[key] = column.defaultVisible;
    }
  }

  return results;
} 

export default function TableComponent<T> (props: TableProps<T>) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  const { preferences, setPreferences } = useTablePreferences(props.tableKind, {
    page_size: 20,
    visibility: computeDefaultVisibility(props.columns)
  })

  const [total, setTotal] = useState<number>(0);
  const [rows, setRows] = useState<T[]>([]);
  const table = useReactTable<T>({
    columns: props.columns,
    data: rows,
    state: {
      columnVisibility: preferences.visibility,
      sorting: props.sorting.sortingState
    },

    manualPagination: true,
    manualSorting:    props.inMemory === true ? false : true,
    
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function"
        ? updater(props.sorting.sortingState)
        : updater;
      
      props.sorting.setSortingState(newSorting);
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === "function"
          ? updater(preferences.visibility)
          : updater;
      
      setPreferences({
        page_size: preferences.page_size,
        visibility: newVisibility
      })
    }
  });

  function loadData () {
    return (async () => {
      const data = await props.query(preferences.page_size);
      if (data === undefined) {
        props.page.setIndex(1);
        return ;
      }
      setLastRefreshed(new Date());
      setRows(data.results);
      setTotal(data.count);
    })()
  }
  useEffect(() => { loadData() }, [props.query, preferences.page_size]);

  return (
    <div className="font-sans text-sm">
      <div className="border border-gray-300 rounded overflow-hidden shadow-sm bg-white">

        {/* ── Toolbar ──
        
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-300 flex-wrap">
          <span className="text-xs font-semibold text-gray-700 mr-1">Users</span>

          <button className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium">
            + Add
          </button>
          <button
            disabled={selected.size === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
          <button
            disabled={selected.size !== 1}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Edit
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users…"
            className="w-48 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />

          <div className="flex-1" />

          <span className="text-xs text-gray-500">
            {sorted.length} user{sorted.length !== 1 ? "s" : ""}
          </span>
        </div> */}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <TableHeader selectionPolicy={props.selectionPolicy} table={table} />
            <TableBody   selectionPolicy={props.selectionPolicy} noneText={props.noneText} table={table} redirect={props.redirect} />
          </table>
        </div>

        {/* ── Footer ── */}
        {
          props.footerDisabled ? <></> : <TableFooter
            table={table}
            pageInfo={{
              index: props.page.index,
              setPageIndex: props.page.setIndex,
              size: preferences.page_size,
              totalRows: total,
              count: Math.floor((total + preferences.page_size - 1) / preferences.page_size)
            }}
            preferences={preferences}
            setPreferences={setPreferences}
            lastRefreshed={lastRefreshed}
            refresh={loadData}
          />
        }
      </div>
    </div>
  );
}