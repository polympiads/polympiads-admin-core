import type { NavMenu, NavProps } from "../../components/nav/Navbar";
import { useMatches, useRouter, type AnyRoute } from '@tanstack/react-router'
import type { RegisteredRouter } from '@tanstack/react-router'

type RegisteredRoute = RegisteredRouter['routesByPath'][keyof RegisteredRouter['routesByPath']]

function setupRouteToNavMenu (route: RegisteredRoute, menus: NavMenu[]) {
    if (route.options?.staticData?.navbar) {
        const newMenus: NavMenu[] = [];

        const menu: NavMenu = {
            "label"    : route.options?.staticData?.navbar?.getLabel?.(),
            "isActive" : false,

            ...(route.options?.staticData?.navbar?.getLink?.())
        };
        menus.push(menu);

        if (route.children) {
            setupChildrensToNavMenus(route.children as any, newMenus);
            newMenus.sort((a, b) => a.label.localeCompare(b.label));

            if (newMenus.length !== 0) {
                menu.childrens = newMenus;
            }
        }
    } else if (route.children) {
        setupChildrensToNavMenus(route.children as any, menus);
    }
}
function setupChildrensToNavMenus (childrens: { [key: string]: RegisteredRoute }, menus: NavMenu[]) {
    Object.values(childrens)
        .forEach(route => setupRouteToNavMenu(route, menus))
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

export default function useRouteNavigation (): NavProps {
    const router = useRouter();

    const menus: NavMenu[] = [];
    setupChildrensToNavMenus(router.routeTree.children as any, menus);
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
