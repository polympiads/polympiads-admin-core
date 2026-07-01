import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCallback } from 'react';
import { type AuthPermissionDetail } from '../../../../../client';
import { TitleField } from '../../../../../components/fields/TitleField';
import { useInMemoryQuery } from '../../../../../components/table/TableComponent';
import { PermissionTable } from '../../tables/PermissionTable';
import { Label } from '../../../../../components/fields/Label';
import { useGroup } from '../../hooks/useGroup';
import { ActionPanel } from '../../../../../components/form/ActionPanel';
import { AUTH_GROUPS_CHANGE, AUTH_PERMISSIONS_VIEW, HasPermission } from '../../../../../lib/permissions';

function useGroupId (): any {
  return useParams({ "from": "/dashboard/auth/groups/$groupid/" }).groupid;
}

export const Route = createFileRoute("/dashboard/auth/groups/$groupid/")({
  component: GroupInfo
})

function GroupInfo () {
  const groupId = useGroupId();
  const { loading, group } = useGroup(groupId);

  const perms = useInMemoryQuery(
    useCallback(
      async () => group?.permissions,
      [group]
    )
  );

  const params = useParams({ "from": "/dashboard/auth/groups/$groupid" });

  if (group === null && !loading) {
    return <>Could not fetch group.</>
  }

  const title = `Group #${group?.id} - ${group?.name}`;

  return <>
    <div className='flex'>
      <TitleField label={title} isSkeleton={loading} />
      <div className="flex-1" />
      <ActionPanel
        create={{
          label: "Edit Group",
          link: { to: "/dashboard/auth/groups/$groupid/edit", params: params },
          checks: [ HasPermission(AUTH_GROUPS_CHANGE) ]
        }}
        extra={[
          {
            label: "Change Permissions",
            link: { to: "/dashboard/auth/groups/$groupid/permissions", params: params },
            checks: [ HasPermission(AUTH_GROUPS_CHANGE), HasPermission(AUTH_PERMISSIONS_VIEW) ]
          }
        ]}
        />
    </div>

    <Label label="Group Permissions" />
    <PermissionTable<AuthPermissionDetail>
      pageQuery={'page'}
      orderingQuery={'perm_ordering'}
      kind={'detail'}
      query={perms}
      inMemory={true}/>
  </>
}
