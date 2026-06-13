import { createFileRoute, Link } from '@tanstack/react-router'
import TableComponent from '../../../../components/table/TableComponent'
import { authUsersList, type AuthUserList } from '../../../../client'
import { BooleanDotCell } from '../../../../components/table/cells/BooleanCell'
import { DateCell } from '../../../../components/table/cells/DateCell'
import usePageQuery from '../../../../hooks/usePageQuery'
import { useCallback } from 'react'
import useOrderingQuery from '../../../../hooks/useOrderingQuery'
import type { SortingState } from '@tanstack/react-table'
import { AUTH_USERS_ADD, HasPermission, IfChecks } from '../../../../lib/permissions'
import Plus from '../../../../components/icons/Plus'

export const Route = createFileRoute("/dashboard/auth/users/")({
  component: UsersList,
  staticData: {}
})

function UsersList () {
  const [page, setPage] = usePageQuery("page");
  const [sortParam, sort, setRawSort] = useOrderingQuery("ordering");

  function setSort (sorting: SortingState) {
    setPage(1);
    setRawSort(sorting);
  }

  const query = useCallback(async (page_size: number) => {
    const { data } = await authUsersList({
      query: {
        page_size: page_size,
        page: page,
        ordering: sortParam
      }
    });
    return data;
  }, [sort, page]);

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
    <TableComponent<AuthUserList>
      tableKind="user-table"
      redirect={(user: AuthUserList) => ({
        to: "/dashboard/auth/users/$userid",
        params: { userid: user.id.toString() }
      })}
      columns={[
        { header: "Username",     accessorKey: "username",     enableHiding: false },
        { header: "Email",        accessorKey: "email",        defaultVisible: false },
        { header: "First Name",   accessorKey: "first_name",   defaultVisible: false },
        { header: "Last Name",    accessorKey: "last_name",    defaultVisible: false },
        { header: "Is active",    accessorKey: "is_active",    cell: BooleanDotCell, defaultVisible: false },
        { header: "Is staff",     accessorKey: "is_staff",     cell: BooleanDotCell, defaultVisible: true },
        { header: "Is superuser", accessorKey: "is_superuser", cell: BooleanDotCell, defaultVisible: false },
        { header: "Groups",       accessorKey: "groups",       defaultVisible: true },
        { header: "Permissions",  accessorKey: "permissions",  defaultVisible: true },
        { header: "Last Login",   accessorKey: "last_login",   cell: DateCell, defaultVisible: true },
        { header: "Date Joined",  accessorKey: "date_joined",  cell: DateCell, defaultVisible: false }
      ]}
      page={{
        index: page,
        setIndex: setPage
      }}
      sorting={{
        sortingState: sort,
        setSortingState: setSort
      }}
      query={query}
      />
  </>
}
