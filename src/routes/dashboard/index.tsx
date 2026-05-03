import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
  staticData: {
    breadcrumb: {
      getTitle: () => "Home",
      getLink:  () => ({ "to": "/dashboard" })
    }
  }
})

function DashboardIndex () {
    return <>Welcome to the Polympiads Dashboard !</>
}