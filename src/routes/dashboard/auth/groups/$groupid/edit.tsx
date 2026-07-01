import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_GROUPS_CHANGE, HasPermission } from '../../../../../lib/permissions';
import { GroupForm } from '../../forms/GroupForm';

function useGroupId (): any {
  return useParams({ "from": "/dashboard/auth/groups/$groupid/edit" }).groupid;
}

export const Route = createFileRoute("/dashboard/auth/groups/$groupid/edit")({
  component: GroupEdit,
  staticData: {
    breadcrumb: {
      getTitle: () => `Edit`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/$groupid/edit",
        "params": useParams({ "from": "/dashboard/auth/groups/$groupid/edit" })
      })
    },
    auth: [ HasPermission(AUTH_GROUPS_CHANGE) ]
  }
})

function GroupEdit () {
    const groupId = useGroupId();

    return <>
        <>Edit Group</>
        <GroupForm mode='edit' uuid={groupId} />
    </>
}
