import { createFileRoute, Link } from '@tanstack/react-router'
import { authGroupsList, type AuthGroupList } from '../../../../client'
import { GroupTable } from '../tables/GroupsTable'
import { AUTH_GROUPS_ADD, HasPermission, IfChecks } from '../../../../lib/permissions'
import Plus from '../../../../components/icons/Plus'

export const Route = createFileRoute("/dashboard/auth/groups/")({
  component: GroupsList,
  staticData: {}
})

function GroupsList () {
    const query = async (sortParam: string, page: number, page_size: number) => {
      const { data } = await authGroupsList({
        query: {
          page_size: page_size,
          page: page,
          ordering: sortParam
        }
      });
      return data;
    }
    
    return <>
        <div className="flex">
            <p>Groups List</p>
            <div className="flex-1"></div>
            <IfChecks checks={[ HasPermission(AUTH_GROUPS_ADD) ]}>
            <Link
                to="/dashboard/auth/groups/create"
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-500 hover:text-gray-600 text-[11.5px] font-medium tracking-[0.04em]"
            >
                <Plus size={14} className="-ml-0.5" />
                Add Group
            </Link>
            </IfChecks>
        </div>
        <GroupTable<AuthGroupList>
            kind="list"
            pageQuery="page"
            orderingQuery="ordering"
            query={query} />
    </>

}
