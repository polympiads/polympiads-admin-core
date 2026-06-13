import { createFileRoute, useParams, type LinkProps } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { type AuthUserDetail, authUsersRetrieve } from '../../../../client';
import { StringInfoField } from '../../../../components/fields/StringInfoField';
import { TitleField } from '../../../../components/fields/TitleField';
import { BooleanInfoField } from '../../../../components/fields/BooleanInfoField';

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid")({
  component: UserInfo,
  staticData: {
    breadcrumb: {
      getTitle: () => `User #${useUserId()}`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid",
        "params": useParams({ "from": "/dashboard/auth/users/$userid" })
      })
    }
  }
})

function UserInfo () {
  const userId = useUserId();
  const [user, setUser] = useState<AuthUserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadData () {
    setLoading(true);
    const { data } = await authUsersRetrieve({ path: { id: userId } });
    if (!data) {
      setLoading(false);
      return ;
    }

    setLoading(false);
    setUser(data);
  }

  useEffect(() => { loadData() }, [userId]);

  if (!loading && user === null) {
    return <>Could not fetch user.</>
  }

  const title = `User #${user?.id}`;

  return <>
    <TitleField label={title} isSkeleton={loading} />
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
  </>
}
