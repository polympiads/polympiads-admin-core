import { useState, type JSX } from "react";
import ChevronDown from "../icons/ChevronDown";
import ChevronRight from "../icons/ChevronRight";

export interface UserMenuProps {
    userInfo: {
        username: string,
        name: string,
        title: string
    };
    buttons: {
        icon     : JSX.Element;
        label    : string;
        callback : () => void;
    }[];
};

export default function UserMenu (props: UserMenuProps) {
    const [userMenu, setUserMenu] = useState(false);

    return (
        <div className="relative mr-3">
            <button
                onClick={() => setUserMenu((o) => !o)}
                className="flex items-center select-none gap-2 h-8 px-2.5 rounded text-black/70 hover:bg-black/10 hover:text-black transition-colors cursor-pointer">
                <span className="text-[12px] hidden sm:block">{props.userInfo.username}</span>
                {userMenu ? <ChevronDown size={11} className="text-black/30" />
                    : <ChevronRight size={11} className="text-black/30" />}
            </button>

            {userMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#d8e0e8] rounded shadow-xl z-50 pt-1 overflow-hidden">
                <div className="px-3 py-2 border-b border-[#eef1f4]">
                    <div className="text-[12px] font-semibold text-[#1a2b3a]">{props.userInfo.name}</div>
                    <div className="text-[11px] text-[#7a8f9f]">{props.userInfo.title}</div>
                </div>
                {
                    props.buttons.map(({ icon, label, callback }) => (
                        <button key={label} onClick={
                                () => {
                                    setUserMenu(false);
                                    callback();
                                }
                            }
                            className="w-full select-none flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#3a4f60] hover:bg-[#f4f6f8] cursor-pointer transition-colors text-left">
                            {icon}
                            {label}
                        </button>
                    ))
                }
            </div>
            )}
        </div>
    );
}
