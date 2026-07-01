import { createFileRoute } from '@tanstack/react-router'
import { type AuthGroupList } from '../../../../client'
import { GroupTable } from '../tables/GroupsTable'
import { AUTH_GROUPS_ADD, HasPermission } from '../../../../lib/permissions'
import useGroupsQuery from '../hooks/useGroupsQuery'
import { ActionPanel } from '../../../../components/form/ActionPanel'

export const Route = createFileRoute("/dashboard/auth/groups/")({
  component: GroupsList,
  staticData: {}
})

function GroupsList () {
    return <>
        <div className="flex">
            <p>Groups List</p>
            <div className="flex-1"></div>
            <ActionPanel
                create={{
                    label: "Create Group",
                    link: { to: "/dashboard/auth/groups/create" },
                    checks: [ HasPermission(AUTH_GROUPS_ADD) ]
                }}
            />
        </div>
        <GroupTable<AuthGroupList>
            kind="list"
            pageQuery="page"
            orderingQuery="ordering"
            query={useGroupsQuery()} />
    </>

}
