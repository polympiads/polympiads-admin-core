
import { type AuthGroupDetail, type AuthGroupList, type AuthGroupSummary } from "../../../../client";
import type { CellContext } from "@tanstack/react-table";
import { Badges } from "../../../../components/table/cells/BadgesCell";

export function GroupBadgesCell<T>(ctx: CellContext<T, any>) {
    const groups = ctx.getValue() as (AuthGroupDetail | AuthGroupList | AuthGroupSummary)[];

    return <Badges 
        values={groups.map(group => group.name)}
    />
}