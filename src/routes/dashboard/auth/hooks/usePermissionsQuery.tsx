import { authPermissionsList } from "../../../../client";

export default function usePermissionsQuery () {
    return async (sortParam: string, page: number, page_size: number) => {
        const { data } = await authPermissionsList({
            query: {
                page_size: page_size,
                page: page,
                ordering: sortParam
            }
        });
        return data;
    };
}
