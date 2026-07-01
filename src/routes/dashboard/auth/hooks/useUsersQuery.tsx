import { authUsersList } from "../../../../client";

export default function useUsersQuery () {
    return async (sortParam: string, page: number, page_size: number) => {
        const { data } = await authUsersList({
            query: {
                page_size: page_size,
                page: page,
                ordering: sortParam
            }
        });
        return data;
    };
}
