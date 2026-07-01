import { useEffect, useState } from "react";
import { authUsersRetrieve, type AuthUserDetail } from "../../../../client";

export function useUser (userId: number) {
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

    return { loading, user, setUser, refresh: loadData };
}
