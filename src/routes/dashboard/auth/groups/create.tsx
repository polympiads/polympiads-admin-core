import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate, useParams, type LinkProps } from '@tanstack/react-router'
import { z } from 'zod'
import { FormRenderer, type FormLayout } from '../../../../components/form/Layout';
import { authGroupsCreate, authUsersCreate } from '../../../../client';
import { AUTH_GROUPS_ADD, HasPermission } from '../../../../lib/permissions';

export const Route = createFileRoute("/dashboard/auth/groups/create")({
  component: UserCreate,
  staticData: {
    breadcrumb: {
      getTitle: () => `Create Group`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/groups/create",
        "params": useParams({ "from": "/dashboard/auth/groups/create" })
      })
    },
    auth: [ HasPermission(AUTH_GROUPS_ADD) ]
  }
})

const GroupCreateSchema = z.object({
    name: z.string().min(1, "Name shouldn't be empty")
})

function UserCreate () {
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            name: ""
        },
        onSubmit: async ({ value }) => {
            const { data } = await authGroupsCreate({
                body: {
                    name: value.name
                }
            })

            if (data) {
                const groupId = data.id;

                navigate({ to: "/dashboard/auth/groups/$groupid", params: { groupid: groupId.toString() } });
            }
        },
        validators: {
            onChange: GroupCreateSchema
        }
    })

    const formLayout: FormLayout<{
        name: string;
    }> = [
        { input: "text", field: "name", title: "Group Name", placeholder: "Name" },
        { input: "submit", text: "Create Group" }
    ];
    
    return <>
        <>Create Group</>
        <FormRenderer form={form} layout={formLayout} />
    </>
}
