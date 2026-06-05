import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/dashboard/auth")({
  component: Outlet,
  staticData: {
    breadcrumb: {
      getTitle: () => "Users & Groups"
    },
    navbar: {
      getLabel: () => "Users & Groups"
    }
  }
})
