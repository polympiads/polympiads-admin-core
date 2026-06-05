import { createFileRoute } from '@tanstack/react-router'
import TableComponent from '../../../../components/table/TableComponent'
import { authUsersList, type AuthUserList } from '../../../../client'
import { BooleanDotCell } from '../../../../components/table/cells/BooleanCell'
import { DateCell } from '../../../../components/table/cells/DateCell'
import usePageQuery from '../../../../hooks/usePageQuery'
import { useCallback } from 'react'
import useOrderingQuery from '../../../../hooks/useOrderingQuery'
import type { SortingState } from '@tanstack/react-table'

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
    <div>Users List</div>
    <TableComponent<AuthUserList>
      tableKind="user-table"
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
