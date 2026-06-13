
import { type AuthPermissionDetail, type AuthPermissionSummary } from "../../../../client";
import type { CellContext } from "@tanstack/react-table";
import { Badges } from "../../../../components/table/cells/BadgesCell";

export function PermissionBadgesCell<T>(ctx: CellContext<T, any>) {
    const perms = ctx.getValue() as (AuthPermissionSummary | AuthPermissionDetail)[];

    return <Badges 
        values={perms.map(perm => perm.name)}
    />
}