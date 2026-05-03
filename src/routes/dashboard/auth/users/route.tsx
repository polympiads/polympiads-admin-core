import { createFileRoute, Outlet } from '@tanstack/react-router'

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
    }
  }
})
