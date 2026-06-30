import z from "zod";
import { authGroupsCreate, authGroupsPartialUpdate, authGroupsRetrieve, type AuthGroupDetail } from "../../../../client";
import type { FormLayout } from "../../../../components/form/Layout";
import { SimpleForm, useSimpleFormProps, type ManagedFormProps } from "../../../../components/form/SimpleForm";
import { useNavigate } from "@tanstack/react-router";

type PartialAuthGroup = { name: string };

const GroupSchema = z.object({
    name: z.string().min(1, "Name shouldn't be empty")
})

export function GroupForm (props: ManagedFormProps<number>) {
    const formLayout: FormLayout<{
        name: string;
    }> = [
        { input: "text", field: "name", title: "Group Name", placeholder: "Name" },
        { input: "submit", text: props.mode === "edit" ? "Edit Group" : "Create Group" }
    ];

    const navigate = useNavigate();
    const simpleProps = useSimpleFormProps<number, PartialAuthGroup, AuthGroupDetail>(
        props,
        { name: "" },
        formLayout,
        GroupSchema,
        GroupSchema,
        async (uuid: number) => {
            const data = await authGroupsRetrieve({ path: { id: uuid } });
            
            return {
                name: data.data?.name || ""
            };
        },
        async (data: PartialAuthGroup) => { return (await authGroupsCreate({ body: data })).data },
        async (data: PartialAuthGroup, uuid: number) => {
            return (await authGroupsPartialUpdate({
                path: { id: uuid },
                body: data
            })).data
        },
        (data: AuthGroupDetail) => {
            navigate({ to: "/dashboard/auth/groups/$groupid", params: { groupid: data.id.toString() } });
        }
    )

    return <SimpleForm<PartialAuthGroup> {...simpleProps}/>
}
