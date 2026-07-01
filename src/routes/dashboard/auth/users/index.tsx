import { createFileRoute, Link } from '@tanstack/react-router'
import { type AuthUserList } from '../../../../client'
import { AUTH_USERS_ADD, HasPermission, IfChecks } from '../../../../lib/permissions'
import Plus from '../../../../components/icons/Plus'
import { UsersTable } from '../tables/UsersTable'
import useUsersQuery from '../hooks/useUsersQuery'

export const Route = createFileRoute("/dashboard/auth/users/")({
  component: UsersList,
  staticData: {}
})

function UsersList () {
  return <>
    <div className="flex">
      <p>Users List</p>
      <div className="flex-1"></div>
      <IfChecks checks={[ HasPermission(AUTH_USERS_ADD) ]}>
        <Link
          to="/dashboard/auth/users/create"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-500 hover:text-gray-600 text-[11.5px] font-medium tracking-[0.04em]"
        >
          <Plus size={14} className="-ml-0.5" />
          Add User
        </Link>
      </IfChecks>
    </div>
    <UsersTable<AuthUserList>
      kind={"list"}
      pageQuery="page"
      orderingQuery="ordering"
      query={useUsersQuery()}
      />
  </>
}
