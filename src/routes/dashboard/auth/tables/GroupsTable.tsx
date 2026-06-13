
import { type AuthGroupDetail, type AuthGroupList, type AuthGroupSummary } from "../../../../client";
import { type Column } from "../../../../components/table/TableComponent";
import { PermissionBadgesCell } from "../cells/PermissionListCell";
import type { ManagedTableProps } from "../../../../components/table/SimpleTable";
import SimpleTable from "../../../../components/table/SimpleTable";

const GROUP_DETAIL_COLUMNS: Column<AuthGroupDetail, any>[] = [
    { header: "Name",         accessorKey: "name",         enableHiding: false },
    { header: "Permissions",  accessorKey: "permissions",  enableHiding: false, cell: PermissionBadgesCell }
]
const GROUP_SUMMARY_COLUMNS: Column<AuthGroupSummary, any>[] = [
    { header: "Name",   accessorKey: "name", enableHiding: false }
]

type GroupTypeKind = "summary" | "list" | "detail";
const GROUP_COLUMNS: Record<GroupTypeKind, any> = {
    "summary": GROUP_SUMMARY_COLUMNS,
    "list":    GROUP_DETAIL_COLUMNS,
    "detail":  GROUP_DETAIL_COLUMNS
};

export function GroupTable<T extends AuthGroupDetail | AuthGroupSummary | AuthGroupList> (
    props: ManagedTableProps<T, GroupTypeKind>
  ) {
    return <>
        <SimpleTable<T>
          {...props}
          
          noneText={"No groups found"}
          tableKind={`groups-${props.kind}-table`}
          
          columns={GROUP_COLUMNS[props.kind]}

          redirect={(group: T) => ({
            to: "/dashboard/auth/groups/$groupid",
            "params": { groupid: group.id.toString() }
          })}
          />
      </>
}
