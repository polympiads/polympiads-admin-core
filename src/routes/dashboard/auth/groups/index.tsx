import { createFileRoute } from '@tanstack/react-router'
import { authGroupsList, type AuthGroupList } from '../../../../client'
import { GroupTable } from '../tables/GroupsTable'

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
            <p>Permissions List</p>
            <div className="flex-1"></div>
        </div>
        <GroupTable<AuthGroupList>
            kind="list"
            pageQuery="page"
            orderingQuery="ordering"
            query={query} />
    </>

}
