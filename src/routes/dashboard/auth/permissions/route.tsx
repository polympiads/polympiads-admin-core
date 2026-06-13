import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AUTH_PERMISSIONS_VIEW, HasPermission } from '../../../../lib/permissions'

export const Route = createFileRoute("/dashboard/auth/permissions")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => "Permissions",
      getLink:  () => ({ "to": "/dashboard/auth/permissions" })
    },
    navbar: {
      getLabel: () => "Permissions",
      getLink:  () => ({ "to": "/dashboard/auth/permissions" })
    },
    auth: [ HasPermission(AUTH_PERMISSIONS_VIEW) ]
  }
})
