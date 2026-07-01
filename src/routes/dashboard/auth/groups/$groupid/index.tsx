import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCallback } from 'react';
import { type AuthPermissionDetail } from '../../../../../client';
import { TitleField } from '../../../../../components/fields/TitleField';
import { useInMemoryQuery } from '../../../../../components/table/TableComponent';
import { PermissionTable } from '../../tables/PermissionTable';
import { Label } from '../../../../../components/fields/Label';
import { useGroup } from '../../hooks/useGroup';

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

  if (group === null && !loading) {
    return <>Could not fetch group.</>
  }

  const title = `Group #${group?.id} - ${group?.name}`;

  return <>
    <TitleField label={title} isSkeleton={loading} />

    <Label label="Group Permissions" />
    <PermissionTable<AuthPermissionDetail>
      pageQuery={'page'}
      orderingQuery={'perm_ordering'}
      kind={'detail'}
      query={perms}
      inMemory={true}/>
  </>
}
