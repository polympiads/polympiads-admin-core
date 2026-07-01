import { createFileRoute, Outlet, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_GROUPS_VIEW, HasPermission } from '../../../../../lib/permissions'

function useGroupId (): any {
  return useParams({ "from": "/dashboard/auth/groups/$groupid" }).groupid;
}

export const Route = createFileRoute("/dashboard/auth/groups/$groupid")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => `Group #${useGroupId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/$groupid",
        "params": useParams({ "from": "/dashboard/auth/groups/$groupid" })
      })
    },
    auth: [ HasPermission(AUTH_GROUPS_VIEW) ]
  }
})
