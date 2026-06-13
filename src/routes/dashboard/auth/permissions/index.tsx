import { createFileRoute } from "@tanstack/react-router";
import usePageQuery from "../../../../hooks/usePageQuery";
import useOrderingQuery from "../../../../hooks/useOrderingQuery";
import type { SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { authPermissionsList, type AuthPermissionSummary } from "../../../../client";
import TableComponent from "../../../../components/table/TableComponent";

export const Route = createFileRoute("/dashboard/auth/permissions/")({
  component: PermissionsList,
  staticData: {}
})

function PermissionsList () {
    const [page, setPage] = usePageQuery("page");
    const [sortParam, sort, setRawSort] = useOrderingQuery("ordering");

    function setSort (sorting: SortingState) {
        setPage(1);
        setRawSort(sorting);
    }
  
    const query = useCallback(async (page_size: number) => {
      const { data } = await authPermissionsList({
        query: {
          page_size: page_size,
          page: page,
          ordering: sortParam
        }
      });
      return data;
    }, [sort, page]);
    
      return <>
        <div className="flex">
          <p>Permissions List</p>
          <div className="flex-1"></div>
        </div>
        <TableComponent<AuthPermissionSummary>
          tableKind="permissions-table"
          columns={[
            { header: "Name", accessorKey: "name", enableHiding: false }
          ]}
          redirect={(perm: AuthPermissionSummary) => ({
            to: "/dashboard/auth/permissions/$permid",
            "params": { permid: perm.id.toString() }
          })}
          page={{
            index: page,
            setIndex: setPage
          }}
          sorting={{
            sortingState: sort,
            setSortingState: setSort
          }}
          query={query}
          />
      </>
}
