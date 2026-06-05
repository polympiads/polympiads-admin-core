import type { Table } from "@tanstack/react-table";
import type { TablesPreferences } from "./TablePreferences";
import { VisibleColumnsMenu } from "./VisibleColumnsMenu";
import { formatRelative } from "./cells/DateCell";
import { useEffect, useState } from "react";
import TablePagination from "./TablePagination";

const ROWS_PER_PAGE_OPTIONS = [ 1, 5, 10, 20, 50 ];

function TableRowsOption (props: {
        preferences:    TablesPreferences,
        setPreferences: (prefs: TablesPreferences) => void
    }) {
    const rowsPerPage = props.preferences.page_size;
    const setRowsPerPage = (value: number) => {
        props.setPreferences({ ...props.preferences, page_size: value });
    };

    return (
        <label className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
            Rows per page:
            <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); /* setPage(1); */ }}
                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:border-blue-400"
            >
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
        </label>
    )
}

export default function TableFooter<T>(props: {
        table: Table<T>,

        pageInfo: {
            count: number,
            index: number,
            size: number,
            totalRows: number,
            setPageIndex: (page: number) => void
        },

        lastRefreshed: Date,
        refresh: () => Promise<void>,

        preferences:    TablesPreferences,
        setPreferences: (prefs: TablesPreferences) => void
    }) {

    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [refreshLabel, setRefreshLabel] = useState("just now");
    
    useEffect(() => {
        setRefreshLabel(formatRelative(props.lastRefreshed));
        const id = setInterval(() => setRefreshLabel(formatRelative(props.lastRefreshed)), 5000);
        return () => clearInterval(id);
    }, [props.lastRefreshed]);

    async function handleRefresh () {
        setRefreshing(true);

        try {
            const minTimePromise = new Promise<void>((resolve, _reject) => {
                setTimeout(() => {
                    resolve()
                }, 700);
            })

            await props.refresh();
            await minTimePromise;
        } finally {
            setRefreshing(false);
        }
    }

    return (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 border-t border-gray-300 flex-wrap">
          {/* Rows per page */}
          <TableRowsOption preferences={props.preferences} setPreferences={props.setPreferences}/>

          {/* Column toggle */}
          <VisibleColumnsMenu table={props.table}/>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin inline-block" : ""}>↻</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <span className="text-[11px] text-gray-400 whitespace-nowrap">
            Updated {refreshLabel}
          </span>

          <div className="flex-1" />

          {/* Page info */}
          {/*sorted.length > 0 && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              {start + 1}–{end} of {sorted.length}
            </span>
          )*/}

          {/* Pagination */}
          <TablePagination
            pageCount={props.pageInfo.count}
            pageIndex={props.pageInfo.index}
            pageSize={props.pageInfo.size}
            totalRows={props.pageInfo.totalRows}
            setPageIndex={props.pageInfo.setPageIndex} />
          {/* <Pagination current={safePage} total={totalPages} onChange={setPage} /> */}
        </div>
    );
};
