import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { type AuthPermissionDetail, authPermissionsRetrieve } from '../../../../client';
import { StringInfoField } from '../../../../components/fields/StringInfoField';

function usePermId (): any {
  return useParams({ "from": "/dashboard/auth/permissions/$permid" }).permid;
}

export const Route = createFileRoute("/dashboard/auth/permissions/$permid")({
  component: UserInfo,
  staticData: {
    breadcrumb: {
      getTitle: () => `Permission #${usePermId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/permissions/$permid",
        "params": useParams({ "from": "/dashboard/auth/permissions/$permid" })
      })
    }
  }
})

function UserInfo () {
  const permId = usePermId();
  const [perm, setPerm] = useState<AuthPermissionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadData () {
    setLoading(true);
    const { data } = await authPermissionsRetrieve({ path: { id: permId } });
    if (!data) {
      setLoading(false);
      return ;
    }

    setLoading(false);
    setPerm(data);
  }

  useEffect(() => { loadData() }, [permId]);

  if (perm === null) {
    return <>Could not fetch permission.</>
  }

  const title = `Permission #${perm.id}`;

  return <>
    <div>{title}</div>
    <div className="flex">
      <StringInfoField className="flex-1" label="Name" value={perm?.name} isSkeleton={loading}/>
      <StringInfoField className="flex-1" label="Codename" value={perm?.permission} isSkeleton={loading}/>
    </div>
  </>
}
