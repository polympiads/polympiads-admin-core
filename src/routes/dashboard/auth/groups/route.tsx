import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AUTH_GROUPS_VIEW, HasPermission } from '../../../../lib/permissions'

export const Route = createFileRoute("/dashboard/auth/groups")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => "Groups",
      getLink:  () => ({ "to": "/dashboard/auth/groups" })
    },
    navbar: {
      getLabel: () => "Groups",
      getLink:  () => ({ "to": "/dashboard/auth/groups" })
    },
    auth: [ HasPermission(AUTH_GROUPS_VIEW) ]
  }
})
