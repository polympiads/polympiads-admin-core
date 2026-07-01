import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { StringInfoField } from '../../../../components/fields/StringInfoField';
import { usePermission } from '../hooks/usePermission';

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
  const {perm, loading} = usePermission(permId);

  if (perm === null && !loading) {
    return <>Could not fetch permission.</>
  }

  const title = `Permission #${perm?.id}`;

  return <>
    <div>{title}</div>
    <div className="flex">
      <StringInfoField className="flex-1" label="Name" value={perm?.name} isSkeleton={loading}/>
      <StringInfoField className="flex-1" label="Codename" value={perm?.permission} isSkeleton={loading}/>
    </div>
  </>
}
