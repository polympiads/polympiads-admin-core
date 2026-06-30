import z from "zod";
import type { FormLayout } from "../../../../components/form/Layout";
import { SimpleForm, useSimpleFormProps, type ManagedFormProps } from "../../../../components/form/SimpleForm";
import { useNavigate } from "@tanstack/react-router";
import { authUsersCreate, authUsersPartialUpdate, authUsersRetrieve, type AuthPatchedUserDetailWritable, type AuthUserDetail } from "../../../../client";

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

const UserEditSchema = z.object({
    username:         z.string().min(1, "Username shouldn't be empty"),
    email:            z.email().or(z.literal("")),
    first_name:       z.string(),
    last_name:        z.string(),
    is_active:        z.boolean(),
    is_staff:         z.boolean(),
    is_superuser:     z.boolean(),
    password:         z.string().min(8, "Password length should be at least 8 characters").or(z.literal("")),
    password_confirm: z.string()
}).refine(
    (data) => data.password === data.password_confirm,
    { message: "Passwords do not match", path: ["password_confirm"] }
)

type PartialUserDetail = {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    password: string;
    password_confirm: string;
};

export function UserForm (props: ManagedFormProps<number>) {
    const formLayout: FormLayout<PartialUserDetail> = [
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
        { input: "submit", text: props.mode === "edit" ? "Edit User" : "Create User" }
    ];

    const navigate = useNavigate();
    const simpleProps = useSimpleFormProps<number, PartialUserDetail, AuthUserDetail>(
        props,
        {
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
        formLayout,
        UserCreateSchema,
        UserEditSchema,
        async (uuid: number) => {
            const data = await authUsersRetrieve({ path: { id: uuid } });
            
            return {
                first_name : data.data?.first_name || "",
                last_name  : data.data?.last_name  || "",
                email : data.data?.email || "",
                is_active : data.data?.is_active || false,
                is_staff  : data.data?.is_staff  || false,
                is_superuser : data.data?.is_superuser || false,
                password : "",
                password_confirm : "",
                username : data.data?.username || ""
            };
        },
        async (value: PartialUserDetail) => { return (await authUsersCreate({
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
        })).data },
        async (value: PartialUserDetail, uuid: number) => {
            const patch: AuthPatchedUserDetailWritable = {
                username: value.username,
                email: value.email,
                first_name: value.first_name,
                last_name: value.last_name,
                is_active: value.is_active,
                is_staff: value.is_staff,
                is_superuser: value.is_superuser,
            };

            if (value.password) {
                patch .password = value.password
            }

            return (await authUsersPartialUpdate({
                path: { id: uuid },
                body: patch
            })).data
        },
        (data: AuthUserDetail) => {
            navigate({ to: "/dashboard/auth/users/$userid", params: { userid: data.id.toString() } });
        }
    )

    return <SimpleForm<PartialUserDetail> {...simpleProps}/>
}
