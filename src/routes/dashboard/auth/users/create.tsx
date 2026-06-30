import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { AUTH_USERS_ADD, HasPermission } from '../../../../lib/permissions';
import { UserForm } from '../forms/UserForm';

export const Route = createFileRoute("/dashboard/auth/users/create")({
  component: UserCreate,
  staticData: {
    breadcrumb: {
      getTitle: () => `Create User`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/create",
        "params": useParams({ "from": "/dashboard/auth/users/create" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_ADD) ]
  }
})

function UserCreate () {
    return <>
        <>Create User</>
        <UserForm mode='create'/>
    </>
}
