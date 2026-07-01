import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCallback } from 'react';
import { type AuthGroupDetail, type AuthPermissionDetail } from '../../../../../client';
import { StringInfoField } from '../../../../../components/fields/StringInfoField';
import { TitleField } from '../../../../../components/fields/TitleField';
import { BooleanInfoField } from '../../../../../components/fields/BooleanInfoField';
import { GroupTable } from '../../tables/GroupsTable';
import { useInMemoryQuery } from '../../../../../components/table/TableComponent';
import { PermissionTable } from '../../tables/PermissionTable';
import { Label } from '../../../../../components/fields/Label';
import { useUser } from '../../hooks/useUser';
import { ActionPanel } from '../../../../../components/form/ActionPanel';
import { AUTH_GROUPS_VIEW, AUTH_PERMISSIONS_VIEW, AUTH_USERS_CHANGE, HasPermission } from '../../../../../lib/permissions';

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid/" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid/")({
  component: UserInfo
})

function UserInfo () {
  const userId = useUserId();
  const {loading, user} = useUser(userId);

  const groups = useInMemoryQuery<AuthGroupDetail>(
    useCallback(
      async () => user?.groups,
      [user]
    )
  );
  const perms = useInMemoryQuery<AuthPermissionDetail>(
    useCallback(
      async () => user?.permissions,
      [user]
    )
  );

  const params = useParams({ "from": "/dashboard/auth/users/$userid" });

  if (!loading && user === null) {
    return <>Could not fetch user.</>
  }

  const title = `User #${user?.id}`;

  return <>
    <div className="flex">
      <TitleField label={title} isSkeleton={loading} />
      <div className="flex-1"></div>
      <ActionPanel
        create={{
          label: "Edit User",
          link: { to: "/dashboard/auth/users/$userid/edit", params: params },
          checks: [ HasPermission(AUTH_USERS_CHANGE) ]
        }}
        extra={[
          {
            label: "Change Permissions",
            link: { to: "/dashboard/auth/users/$userid/permissions", params: params },
            checks: [ HasPermission(AUTH_USERS_CHANGE), HasPermission(AUTH_PERMISSIONS_VIEW) ]
          },{
            label: "Change Groups",
            link: { to: "/dashboard/auth/users/$userid/groups", params: params },
            checks: [ HasPermission(AUTH_USERS_CHANGE), HasPermission(AUTH_GROUPS_VIEW) ]
          }
        ]}
        />
    </div>
    <div className="flex">
      <StringInfoField className="flex-1" label={'Username'} isSkeleton={loading} value={user?.username} />
      <StringInfoField className="flex-1" label={'Email'} isSkeleton={loading} value={user?.email} />
    </div>
    <div className="flex">
      <StringInfoField className="flex-1" label={'First Name'} isSkeleton={loading} value={user?.first_name} />
      <StringInfoField className="flex-1" label={'Last Name'} isSkeleton={loading} value={user?.last_name} />
    </div>
    <BooleanInfoField label="Is Active" value={user?.is_active} isSkeleton={loading} />
    <BooleanInfoField label="Is Staff" value={user?.is_staff} isSkeleton={loading} />
    <BooleanInfoField label="Is Superuser" value={user?.is_superuser} isSkeleton={loading} />

    <Label label="User Groups" />
    <GroupTable<AuthGroupDetail>
      pageQuery={'grp_page'}
      orderingQuery={'grp_ordering'}
      kind={'detail'}
      query={groups}
      inMemory={true}/>

    <Label label="User Permissions" />
    <PermissionTable<AuthPermissionDetail>
      pageQuery={'perm_page'}
      orderingQuery={'perm_ordering'}
      kind={'detail'}
      query={perms}
      inMemory={true} />
  </>
}
