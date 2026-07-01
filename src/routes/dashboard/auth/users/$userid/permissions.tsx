import { createFileRoute, useParams, type LinkProps } from "@tanstack/react-router";
import { AUTH_USERS_CHANGE, HasPermission } from "../../../../../lib/permissions";
import { PermissionTable } from "../../tables/PermissionTable";
import { authUsersPermissionsPartialUpdate, type AuthPermissionSummary, type AuthUserDetail } from "../../../../../client";
import { useCallback } from "react";
import { TitleField } from "../../../../../components/fields/TitleField";
import usePermissionsQuery from "../../hooks/usePermissionsQuery";
import { LinkForm, useLinkFormProps } from "../../../../../components/form/LinkForm";
import { useUser } from "../../hooks/useUser";

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid/permissions" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid/permissions")({
  component: UserChangePermissions,
  staticData: {
    breadcrumb: {
      getTitle: () => `Change Permissions`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid/permissions",
        "params": useParams({ "from": "/dashboard/auth/users/$userid/permissions" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_CHANGE) ]
  }
})

function UserChangePermissions () {
    const userId = useUserId();
    const { loading, user, setUser } = useUser(userId);

    const {initialSelection, send} = useLinkFormProps(
        user,
        setUser,
        (user: AuthUserDetail) => user.permissions,
        authUsersPermissionsPartialUpdate,
        useCallback(() => ({ id: userId }), [userId]),
        { add: "add_permissions", remove: "remove_permissions" }
    )

    if (user === null && !loading) {
        return <>Could not fetch user.</>
    }

    const title = `Change Permissions - User #${user?.id} - ${user?.username}`;

    return <>
        <TitleField label={title} isSkeleton={loading} />

        <LinkForm<AuthPermissionSummary, "id">
            table={(selectionPolicy) => {
                return <PermissionTable<AuthPermissionSummary>
                    pageQuery={'page'}
                    orderingQuery={'perm_ordering'}
                    kind={'summary'}
                    query={usePermissionsQuery()}
                    redirectAsSelection={true}
                    selectionPolicy={selectionPolicy}/>
            }} send={send}
            buttonText={"Save Permissions"}
            field={"id"}
            initialSelection={initialSelection} />
    </>
}
