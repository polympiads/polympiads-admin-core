import { createFileRoute } from "@tanstack/react-router";
import { type AuthPermissionSummary } from "../../../../client";
import { PermissionTable } from "../tables/PermissionTable";
import usePermissionsQuery from "../hooks/usePermissionsQuery";

export const Route = createFileRoute("/dashboard/auth/permissions/")({
  component: PermissionsList,
  staticData: {}
})

function PermissionsList () {
    return <>
      <div className="flex">
        <p>Permissions List</p>
        <div className="flex-1"></div>
      </div>
      <PermissionTable<AuthPermissionSummary>
        kind="summary"
        pageQuery="page"
        orderingQuery="ordering"
        query={usePermissionsQuery()} />
    </>
}
