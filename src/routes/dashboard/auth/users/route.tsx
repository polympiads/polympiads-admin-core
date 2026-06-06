import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AUTH_USERS_VIEW, HasPermission } from '../../../../lib/permissions'

export const Route = createFileRoute("/dashboard/auth/users")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => "Users",
      getLink:  () => ({ "to": "/dashboard/auth/users" })
    },
    navbar: {
      getLabel: () => "Users",
      getLink:  () => ({ "to": "/dashboard/auth/users" })
    },
    auth: [ HasPermission(AUTH_USERS_VIEW) ]
  }
})
