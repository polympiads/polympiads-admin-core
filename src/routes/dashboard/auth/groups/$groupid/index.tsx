import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react';
import { type AuthGroupDetail, authGroupsRetrieve, type AuthPermissionDetail } from '../../../../../client';
import { TitleField } from '../../../../../components/fields/TitleField';
import { useInMemoryQuery } from '../../../../../components/table/TableComponent';
import { PermissionTable } from '../../tables/PermissionTable';
import { Label } from '../../../../../components/fields/Label';

function useGroupId (): any {
  return useParams({ "from": "/dashboard/auth/groups/$groupid/" }).groupid;
}

export const Route = createFileRoute("/dashboard/auth/groups/$groupid/")({
  component: UserInfo,
  staticData: {
    breadcrumb: {
      getTitle: () => `Group #${useGroupId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/$groupid",
        "params": useParams({ "from": "/dashboard/auth/groups/$groupid/" })
      })
    }
  }
})

function UserInfo () {
  const groupId = useGroupId();
  const [group, setGroup] = useState<AuthGroupDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadData () {
    setLoading(true);
    const { data } = await authGroupsRetrieve({ path: { id: groupId } });
    if (!data) {
      setLoading(false);
      return ;
    }

    setLoading(false);
    setGroup(data);
  }

  useEffect(() => { loadData() }, [groupId]);

  const perms = useInMemoryQuery(
    useCallback(
      async () => group?.permissions,
      [group]
    )
  );

  if (group === null && !loading) {
    return <>Could not fetch permission.</>
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
