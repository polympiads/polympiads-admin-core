import { useEffect, useState } from "react";
import { type AuthPermissionDetail, authPermissionsRetrieve } from "../../../../client";

export function usePermission (permId: number) {
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

    return { loading, perm, setPerm, refresh: loadData };
}
