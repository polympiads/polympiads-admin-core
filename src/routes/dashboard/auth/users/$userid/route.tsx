import { createFileRoute, Outlet, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_USERS_VIEW, HasPermission } from '../../../../../lib/permissions'

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => `User #${useUserId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid",
        "params": useParams({ "from": "/dashboard/auth/users/$userid" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_VIEW) ]
  }
})
