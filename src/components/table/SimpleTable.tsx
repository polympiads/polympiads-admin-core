import type { SortingState } from "@tanstack/react-table";
import useOrderingQuery from "../../hooks/useOrderingQuery";
import usePageQuery from "../../hooks/usePageQuery";
import type { Column, PaginatedResults } from "./TableComponent";
import { useCallback } from "react";
import TableComponent from "./TableComponent";
import type { LinkProps } from "@tanstack/react-router";
import type { SelectionPolicy } from "./select/SelectionPolicy";

export interface ManagedTableProps<T, TKind> {
    pageQuery: string,
    orderingQuery: string,
    inMemory ?: boolean,
    selectionPolicy: SelectionPolicy<T>,
    kind  : TKind,
    query : (sortParam: string, page: number, page_size: number) => Promise<PaginatedResults<T> | undefined>
};

interface SimpleTableProps<T> {
    noneText:  string,
    tableKind: string,

    pageQuery:     string,
    orderingQuery: string,
    
    inMemory ?: boolean,
    
    columns   : Column<T, any>[],
    query     : (sortParam: string, page: number, page_size: number) => Promise<PaginatedResults<T> | undefined>;
    redirect ?: ((data: T) => LinkProps) | undefined,

    selectionPolicy ?: SelectionPolicy<T>
}

export default function SimpleTable<T> (props: SimpleTableProps<T>) {
    const [page, setPage] = usePageQuery(props.pageQuery);
    const [sortParam, sort, setRawSort] = useOrderingQuery(props.orderingQuery);

    function setSort (sorting: SortingState) {
        setPage(1);
        setRawSort(sorting);
    }

    const query = useCallback(
        (page_size: number) => props.query(sortParam, page, page_size),
        [sortParam, page, props.query]
    );
    
    return <>
        <TableComponent<T>
              noneText={props.noneText}
              tableKind={props.tableKind}
              columns={props.columns}
              redirect={props.redirect}
              page={{
                index: page,
                setIndex: setPage
              }}
              sorting={{
                sortingState: sort,
                setSortingState: setSort
              }}
              query={query}
    
              inMemory={props.inMemory}
              footerDisabled={props.inMemory}

              selectionPolicy={props.selectionPolicy}
              />
          </>
}
