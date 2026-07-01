import { authGroupsList } from "../../../../client";

export default function useGroupsQuery () {
    return async (sortParam: string, page: number, page_size: number) => {
        const { data } = await authGroupsList({
            query: {
                page_size: page_size,
                page: page,
                ordering: sortParam
            }
        });
        return data;
    }
}
