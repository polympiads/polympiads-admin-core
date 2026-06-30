
import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_GROUPS_ADD, HasPermission } from '../../../../lib/permissions';
import { GroupForm } from '../forms/GroupForm';

export const Route = createFileRoute("/dashboard/auth/groups/create")({
  component: UserCreate,
  staticData: {
    breadcrumb: {
      getTitle: () => `Create Group`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/create",
        "params": useParams({ "from": "/dashboard/auth/groups/create" })
      })
    },
    auth: [ HasPermission(AUTH_GROUPS_ADD) ]
  }
})

function UserCreate () {
    return <>
        <>Create Group</>
        <GroupForm mode='create' />
    </>
}
