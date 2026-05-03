import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/dashboard/auth/users/")({
  component: UsersList,
  staticData: {}
})

function UsersList () {
  return <>Users List</>
}
