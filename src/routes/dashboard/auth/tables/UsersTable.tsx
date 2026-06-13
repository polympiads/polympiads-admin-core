
import { type AuthUserList } from "../../../../client";
import { type Column } from "../../../../components/table/TableComponent";
import { PermissionBadgesCell } from "../cells/PermissionListCell";
import type { ManagedTableProps } from "../../../../components/table/SimpleTable";
import SimpleTable from "../../../../components/table/SimpleTable";
import { BooleanDotCell } from "../../../../components/table/cells/BooleanCell";
import { GroupBadgesCell } from "../cells/GroupListCell";
import { DateCell } from "../../../../components/table/cells/DateCell";

const USER_LIST_COLUMNS: Column<AuthUserList, any>[] = [
    { header: "Username",     accessorKey: "username",     enableHiding: false },
    { header: "Email",        accessorKey: "email",        defaultVisible: false },
    { header: "First Name",   accessorKey: "first_name",   defaultVisible: false },
    { header: "Last Name",    accessorKey: "last_name",    defaultVisible: false },
    { header: "Is active",    accessorKey: "is_active",    cell: BooleanDotCell, defaultVisible: false },
    { header: "Is staff",     accessorKey: "is_staff",     cell: BooleanDotCell, defaultVisible: true },
    { header: "Is superuser", accessorKey: "is_superuser", cell: BooleanDotCell, defaultVisible: false },
    { header: "Groups",       accessorKey: "groups",       cell: GroupBadgesCell, defaultVisible: true },
    { header: "Permissions",  accessorKey: "permissions",  cell: PermissionBadgesCell,  defaultVisible: true },
    { header: "Last Login",   accessorKey: "last_login",   cell: DateCell, defaultVisible: true },
    { header: "Date Joined",  accessorKey: "date_joined",  cell: DateCell, defaultVisible: false }
]

type UserTypeKind = "list";
const USER_COLUMNS: Record<UserTypeKind, any> = {
    "list": USER_LIST_COLUMNS
};

export function UsersTable<T extends AuthUserList> (
    props: ManagedTableProps<T, UserTypeKind>
  ) {
    return <>
        <SimpleTable<T>
          {...props}
          
          noneText={"No users found"}
          tableKind={`users-${props.kind}-table`}
          
          columns={USER_COLUMNS[props.kind]}

          redirect={(user: T) => ({
            to: "/dashboard/auth/users/$userid",
            "params": { userid: user.id.toString() }
          })}
          />
      </>
}
