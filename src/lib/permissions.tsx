import type { AuthUserDetail } from "../client"
import { hasPermission, useAuth } from "./auth"

export const DASHBOARD_ACCESS = "polympiads_auth.access_dashboard"

export const AUTH_USERS_VIEW   = "polympiads_auth.view_user"
export const AUTH_USERS_ADD    = "polympiads_auth.add_user"
export const AUTH_USERS_CHANGE = "polympiads_auth.change_user"
export const AUTH_USERS_DELETE = "polympiads_auth.delete_user"

export const AUTH_PERMISSIONS_VIEW = "auth.view_permission"
// Permissions do not have Add / Change / Delete permissions 

export type AuthCheck = (user: AuthUserDetail | null) => boolean;

export function IsSuperuser (user: AuthUserDetail | null) {
    return user?.is_superuser === true;
}
export function IsStaff (user: AuthUserDetail | null) {
    return user?.is_staff === true;
}
export function HasPermission (permission: string) {
    return (user: AuthUserDetail | null) => {
        return hasPermission(user, permission);
    }
}

export function checksPass (checks: AuthCheck[], user: AuthUserDetail | null) {
    for (const check of checks) {
        if (!check(user)) {
            return false;
        }
    }

    return true;
}

export interface IfChecksProps {
    checks   : AuthCheck[];
    children : React.ReactNode;
    fallback ?: React.ReactNode;
};

export function IfChecks(props: IfChecksProps) {
    const { user } = useAuth();
    const passed = props.checks.every(check => check(user));

    if (!passed) {
        return props.fallback ?? null;
    }

    return <>{props.children}</>;
}
