import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid")({
  component: UserInfo,
  staticData: {
    breadcrumb: {
      getTitle: () => `User #${useUserId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid",
        "params": useParams({ "from": "/dashboard/auth/users/$userid" })
      })
    }
  }
})

function UserInfo () {
  return <>User #{useUserId()}</>
}
