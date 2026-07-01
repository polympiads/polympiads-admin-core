import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_USERS_CHANGE, HasPermission } from '../../../../../lib/permissions';
import { UserForm } from '../../forms/UserForm';

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid/edit" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid/edit")({
  component: UserEdit,
  staticData: {
    breadcrumb: {
      getTitle: () => `Edit`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid/edit",
        "params": useParams({ "from": "/dashboard/auth/users/$userid/edit" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_CHANGE) ]
  }
})

function UserEdit () {
    const userId = useUserId();

    return <>
        <>Edit User</>
        <UserForm mode='edit' uuid={userId} />
    </>
}
