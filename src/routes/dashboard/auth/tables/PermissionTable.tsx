
import { type AuthPermissionDetail, type AuthPermissionSummary } from "../../../../client";
import type { ManagedTableProps } from "../../../../components/table/SimpleTable";
import SimpleTable from "../../../../components/table/SimpleTable";
import type { Column } from "../../../../components/table/TableComponent";

const PERMISSION_DETAIL_COLUMNS: Column<AuthPermissionDetail, any>[] = [
  { header: "Name",     accessorKey: "name", enableHiding: false },
  { header: "Codename", accessorKey: "permission", enableHiding: false }
]
const PERMISSION_SUMMARY_COLUMNS: Column<AuthPermissionSummary, any>[] = [
  { header: "Name", accessorKey: "name", enableHiding: false }
]

type PermissionTypeKind = "summary" | "detail";
const PERMISSION_COLUMNS: Record<PermissionTypeKind, any> = {
    "summary": PERMISSION_SUMMARY_COLUMNS,
    "detail":  PERMISSION_DETAIL_COLUMNS
};

export function PermissionTable<T extends AuthPermissionDetail | AuthPermissionSummary> (
    props: ManagedTableProps<T, PermissionTypeKind>
  ) {
    return <>
        <SimpleTable<T>
          {...props}
          
          noneText={"No permissions found"}
          tableKind={`permissions-${props.kind}-table`}
          
          columns={PERMISSION_COLUMNS[props.kind]}

          redirect={(perm: T) => ({
            to: "/dashboard/auth/permissions/$permid",
            "params": { permid: perm.id.toString() }
          })}
          />
      </>
}
