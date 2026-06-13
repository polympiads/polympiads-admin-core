import { createFileRoute } from "@tanstack/react-router";
import usePageQuery from "../../../../hooks/usePageQuery";
import useOrderingQuery from "../../../../hooks/useOrderingQuery";
import type { SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { authPermissionsList, type AuthPermissionSummary } from "../../../../client";
import TableComponent from "../../../../components/table/TableComponent";
import { PermissionTable } from "../tables/PermissionTable";

export const Route = createFileRoute("/dashboard/auth/permissions/")({
  component: PermissionsList,
  staticData: {}
})

function PermissionsList () {
    const query = async (sortParam: string, page: number, page_size: number) => {
      const { data } = await authPermissionsList({
        query: {
          page_size: page_size,
          page: page,
          ordering: sortParam
        }
      });
      return data;
    }
    
      return <>
        <div className="flex">
          <p>Permissions List</p>
          <div className="flex-1"></div>
        </div>
        <PermissionTable<AuthPermissionSummary>
          kind="summary"
          pageQuery="page"
          orderingQuery="ordering"
          query={query} />
      </>
}
