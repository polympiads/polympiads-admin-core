import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate, useParams, type LinkProps } from '@tanstack/react-router'
import { z } from 'zod'
import { FormRenderer, type FormLayout } from '../../../../components/form/Layout';
import { authUsersCreate } from '../../../../client';
import { AUTH_USERS_ADD, HasPermission } from '../../../../lib/permissions';

export const Route = createFileRoute("/dashboard/auth/users/create")({
  component: UserCreate,
  staticData: {
    breadcrumb: {
      getTitle: () => `Create User`,
      getLink:  (): LinkProps => ({
        "to": "/dashboard/auth/users/create",
        "params": useParams({ "from": "/dashboard/auth/users/create" })
      })
    },
    auth: [ HasPermission(AUTH_USERS_ADD) ]
  }
})

const UserCreateSchema = z.object({
    username:         z.string().min(1, "Username shouldn't be empty"),
    email:            z.email().or(z.literal("")),
    first_name:       z.string(),
    last_name:        z.string(),
    is_active:        z.boolean(),
    is_staff:         z.boolean(),
    is_superuser:     z.boolean(),
    password:         z.string().min(8, "Password length should be at least 8 characters"),
    password_confirm: z.string()
}).refine(
    (data) => data.password === data.password_confirm,
    { message: "Passwords do not match", path: ["password_confirm"] }
)

function UserCreate () {
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            is_active: true,
            is_staff: false,
            is_superuser: false,
            password: "",
            password_confirm: ""
        },
        onSubmit: async ({ value }) => {
            const { data } = await authUsersCreate({
                body: {
                    username: value.username,
                    email: value.email,
                    first_name: value.first_name,
                    last_name: value.last_name,
                    is_active: value.is_active,
                    is_staff: value.is_staff,
                    is_superuser: value.is_superuser,
                    password: value.password
                }
            })

            if (data) {
                const userId = data.id;

                navigate({ to: "/dashboard/auth/users/$userid", params: { userid: userId.toString() } });
            }
        },
        validators: {
            onChange: UserCreateSchema
        }
    })

    const formLayout: FormLayout<{
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        is_active: boolean;
        is_staff: boolean;
        is_superuser: boolean;
        password: string;
        password_confirm: string;
    }> = [
        { input: "text", field: "username", title: "Username" },
        { input: "text", field: "email", title: "Email" },
        { input: "multi", childs: [
            { input: "text", field: "first_name", title: "First Name" },
            { input: "text", field: "last_name", title: "Last Name" },
        ] },
        { input: "check", field: "is_active", title: "Is Active" },
        { input: "check", field: "is_staff", title: "Is Staff" },
        { input: "check", field: "is_superuser", title: "Is Superuser" },
        { input: "text", field: "password", title: "Password", type: "password" },
        { input: "text", field: "password_confirm", title: "Password (Confirm)", placeholder: "Password", type: "password" },
        { input: "submit", text: "Create User" }
    ];
    
    return <>
        <>Create User</>
        <FormRenderer form={form} layout={formLayout} />
    </>
}
