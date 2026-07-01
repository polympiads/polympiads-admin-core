import { createFileRoute } from '@tanstack/react-router'
import { type AuthUserList } from '../../../../client'
import { AUTH_USERS_ADD, HasPermission } from '../../../../lib/permissions'
import { UsersTable } from '../tables/UsersTable'
import useUsersQuery from '../hooks/useUsersQuery'
import { ActionPanel } from '../../../../components/form/ActionPanel'

export const Route = createFileRoute("/dashboard/auth/users/")({
  component: UsersList,
  staticData: {}
})

function UsersList () {
  return <>
    <div className="flex">
      <p>Users List</p>
      <div className="flex-1"></div>
      <ActionPanel
        create={{
          label: "Create User",
          link: { to: "/dashboard/auth/users/create" },
          checks: [ HasPermission(AUTH_USERS_ADD) ]
        }}
        />
    </div>
    <UsersTable<AuthUserList>
      kind={"list"}
      pageQuery="page"
      orderingQuery="ordering"
      query={useUsersQuery()}
      />
  </>
}
