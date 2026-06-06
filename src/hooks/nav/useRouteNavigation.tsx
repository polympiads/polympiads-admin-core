import type { NavMenu, NavProps } from "../../components/nav/Navbar";
import { useMatches, useRouter } from '@tanstack/react-router'
import type { RegisteredRouter } from '@tanstack/react-router'
import type { AuthUserDetail } from "../../client";
import { checksPass } from "../../lib/permissions";

type RegisteredRoute = RegisteredRouter['routesByPath'][keyof RegisteredRouter['routesByPath']]

function setupRouteToNavMenu (user: AuthUserDetail | null, route: RegisteredRoute, menus: NavMenu[]) {
    const auth = route.options?.staticData?.auth;
    if (auth !== undefined && !checksPass(auth, user)) {
        return ;
    }

    if (route.options?.staticData?.navbar) {
        const newMenus: NavMenu[] = [];

        const link = route.options?.staticData?.navbar?.getLink?.();

        const menu: NavMenu = {
            "label"    : route.options?.staticData?.navbar?.getLabel?.(),
            "isActive" : false,

            ...(link)
        };

        let menuUseful = link !== undefined;

        if (route.children) {
            setupChildrensToNavMenus(user, route.children as any, newMenus);
            newMenus.sort((a, b) => a.label.localeCompare(b.label));

            if (newMenus.length !== 0) {
                menu.childrens = newMenus;
                menuUseful = true;
            }
        }

        if (menuUseful) {
            menus.push(menu);
        }
    } else if (route.children) {
        setupChildrensToNavMenus(user, route.children as any, menus);
    }
}
function setupChildrensToNavMenus (user: AuthUserDetail | null, childrens: { [key: string]: RegisteredRoute }, menus: NavMenu[]) {
    Object.values(childrens)
        .forEach(route => setupRouteToNavMenu(user, route, menus))
}

function findCurrentNavigationMenu (current: NavMenu | undefined, menus: NavMenu[] | undefined, labels: string[], offset: number): NavMenu | undefined {
    if (labels.length === offset) {
        return current;
    }

    const submenu = menus?.find((value) => value.label == labels[offset]);
    if (submenu === undefined) {
        return submenu;
    }

    return findCurrentNavigationMenu(submenu, submenu.childrens, labels, offset + 1);
}

export default function useRouteNavigation (user: AuthUserDetail | null): NavProps {
    const router = useRouter();

    const menus: NavMenu[] = [];
    setupChildrensToNavMenus(user, router.routeTree.children as any, menus);
    menus.sort((a, b) => a.label.localeCompare(b.label));

    const matches = useMatches();
    const labelsUsed = matches.map(match => match.staticData?.navbar?.getLabel())
        .filter(value => value !== undefined)

    const activeMenu = findCurrentNavigationMenu(undefined, menus, labelsUsed, 0);
    if (activeMenu) {
        activeMenu.isActive = true;
    }

    return {
        "menus": menus
    };
}
