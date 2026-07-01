import { createFileRoute, useParams, type LinkProps } from "@tanstack/react-router";
import { AUTH_GROUPS_CHANGE, HasPermission } from "../../../../../lib/permissions";
import { PermissionTable } from "../../tables/PermissionTable";
import { authGroupsPermissionsPartialUpdate, type AuthGroupDetail, type AuthPermissionSummary } from "../../../../../client";
import { useCallback } from "react";
import { TitleField } from "../../../../../components/fields/TitleField";
import { useGroup } from "../../hooks/useGroup";
import usePermissionsQuery from "../../hooks/usePermissionsQuery";
import { LinkForm, useLinkFormProps } from "../../../../../components/form/LinkForm";

function useGroupId (): any {
  return useParams({ "from": "/dashboard/auth/groups/$groupid/permissions" }).groupid;
}

export const Route = createFileRoute("/dashboard/auth/groups/$groupid/permissions")({
  component: GroupChangePermissions,
  staticData: {
    breadcrumb: {
      getTitle: () => `Change Permissions`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/$groupid/permissions",
        "params": useParams({ "from": "/dashboard/auth/groups/$groupid/permissions" })
      })
    },
    auth: [ HasPermission(AUTH_GROUPS_CHANGE) ]
  }
})

function GroupChangePermissions () {
    const groupId = useGroupId();
    const { loading, group, setGroup } = useGroup(groupId);

    const {initialSelection, send} = useLinkFormProps(
        group,
        setGroup,
        (group: AuthGroupDetail) => group.permissions,
        authGroupsPermissionsPartialUpdate,
        useCallback(() => ({ id: groupId }), [groupId]),
        { add: "add_permissions", remove: "remove_permissions" }
    )

    if (group === null && !loading) {
        return <>Could not fetch permission.</>
    }

    const title = `Change Permissions - Group #${group?.id} - ${group?.name}`;

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
