import { useEffect, useState } from "react";
import { type AuthGroupDetail, authGroupsRetrieve } from "../../../../client";

export function useGroup (groupId: number) {
    const [group, setGroup] = useState<AuthGroupDetail | null>();
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

    return { loading, group, setGroup, refresh: loadData };
}
