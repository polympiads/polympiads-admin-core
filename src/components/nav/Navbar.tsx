
import { Link, type LinkProps } from '@tanstack/react-router'
import { useState, type JSX } from 'react';
import ChevronRight from '../icons/ChevronRight';
import ChevronDown from '../icons/ChevronDown';

export type NavMenu = {
    label      : string;
    childrens ?: NavMenu[];
    isActive   : boolean;
} & Partial<Pick<LinkProps, 'to' | 'params' | 'search'>>;

export type NavProps = {
    menus: NavMenu[];
};

function LinkIf (props: { children: React.ReactNode, menu: NavMenu }) {
    if (props.menu.to === undefined) {
        return <>{props.children}</>;
    }

    return <Link className="flex-1" to={props.menu.to} params={props.menu.params} search={props.menu.search}>
        <div className="flex">
            {props.children}
        </div>
    </Link>
}

function BuildNavMenu ({menu, depth}: {menu: NavMenu, depth: number}): JSX.Element {
    const hasChildrens = menu.childrens !== undefined && menu.childrens.length !== 0;

    const [subMenu, setSubMenu] = useState(false);

    function toggleMenu () {
        setSubMenu(!subMenu);
    }

    const activeClass = " bg-[#697280]";
    const inactiveClass = " hover:bg-[#596270]"

    return <>
        <div
            className={"h-8 w-full flex cursor-pointer transition-colors" + (menu.isActive ? activeClass : inactiveClass)}
            key={menu.label} onClick={menu.to === undefined ? toggleMenu : undefined}>
            <LinkIf menu={menu}>
                {
                    menu.isActive
                && <div className="w-1 h-8 bg-[#3F719F]"></div>
                }
                
                <div className="py-2 flex-1 text-[11px] select-none" style={{
                    paddingLeft: depth * 20 + 20 - (menu.isActive ? 4 : 0)
                }}>{menu.label}</div>
            </LinkIf>
            {
                hasChildrens
             && <button className="p-2 pr-4 cursor-pointer" onClick={toggleMenu}>
                    {subMenu ? <ChevronDown size={16} className=""></ChevronDown>
                     : <ChevronRight size={16} className=""></ChevronRight>}
                </button>}
        </div>
        {hasChildrens && subMenu && buildNavMenus(menu.childrens as NavMenu[], depth + 1)}
    </>
}
function buildNavMenus (menus: NavMenu[], depth: number): JSX.Element {
    return <>
        {...menus.map((menu) => <BuildNavMenu menu={menu} depth={depth} key={menu.label}/>)}
    </>
}

export default function Navbar (props: NavProps) {
    return (
        <div className="w-75 h-full overflow-y-auto bg-[#444b56] text-[#e2e2e3]">
            {buildNavMenus(props.menus, 0)}
        </div>
    );
}
