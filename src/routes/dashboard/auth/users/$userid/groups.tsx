import { createFileRoute, useParams, type LinkProps } from "@tanstack/react-router";
import { AUTH_USERS_CHANGE, HasPermission } from "../../../../../lib/permissions";
import { authUsersGroupsPartialUpdate, type AuthGroupList, type AuthUserDetail } from "../../../../../client";
import { useCallback } from "react";
import { TitleField } from "../../../../../components/fields/TitleField";
import { LinkForm, useLinkFormProps } from "../../../../../components/form/LinkForm";
import { useUser } from "../../hooks/useUser";
import { GroupTable } from "../../tables/GroupsTable";
import useGroupsQuery from "../../hooks/useGroupsQuery";

function useUserId (): any {
  return useParams({ "from": "/dashboard/auth/users/$userid/groups" }).userid;
}

export const Route = createFileRoute("/dashboard/auth/users/$userid/groups")({
  component: UserChangeGroups,
  staticData: {
    breadcrumb: {
      getTitle: () => `Change Groups`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/$userid/groups",
        "params": useParams({ "from": "/dashboard/auth/users/$userid/groups" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_CHANGE) ]
  }
})

function UserChangeGroups () {
    const userId = useUserId();
    const { loading, user, setUser } = useUser(userId);

    const {initialSelection, send} = useLinkFormProps(
        user,
        setUser,
        (user: AuthUserDetail) => user.groups,
        authUsersGroupsPartialUpdate,
        useCallback(() => ({ id: userId }), [userId]),
        { add: "add_groups", remove: "remove_groups" }
    )

    if (user === null && !loading) {
        return <>Could not fetch user.</>
    }

    const title = `Change Groups - User #${user?.id} - ${user?.username}`;

    return <>
        <TitleField label={title} isSkeleton={loading} />

        <LinkForm<AuthGroupList, "id">
            table={(selectionPolicy) => {
                return <GroupTable<AuthGroupList>
                    pageQuery={'page'}
                    orderingQuery={'grp_ordering'}
                    kind={'list'}
                    query={useGroupsQuery()}
                    redirectAsSelection={true}
                    selectionPolicy={selectionPolicy}/>
            }} send={send}
            buttonText={"Save Groups"}
            field={"id"}
            initialSelection={initialSelection} />
    </>
}
