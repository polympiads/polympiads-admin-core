import { Link } from "@tanstack/react-router";
import UserMenu from "./UserMenu";
import LogoutIcon from "../icons/LogoutIcon";
import SettingsIcon from "../icons/SettingsIcon";
import { useAuth } from "../../lib/auth";

export default function Topbar () {
    const { user, logout } = useAuth();

    const username = user?.username ?? "";
    const name = user?.first_name?.length && user?.last_name?.length
            ? `${user.first_name} ${user.last_name}` : username;
    const title = "Administrator";

    return (
        <>
            <div className="text-[#f3f3f4] bg-[#f4f6f8] h-12 flex px-6 gap-3">
                <Link to="/dashboard" className="py-3 h-12 flex select-none">
                    <img src="/assets/polympiads.svg"/>
                    <div className="pl-2 text-gray-900">Console</div>
                </Link>
                <div className="flex-1"/>
                <div className="py-2">
                    <UserMenu
                        userInfo={{
                            "username": username,
                            "name": name,
                            "title": title
                        }}
                        buttons={[
                        {
                            "icon"     : <SettingsIcon size={13} className="text-[#7a8f9f]"/>,
                            "label"    : "Preferences",
                            "callback" : () => console.log("Preferences")
                        },
                        {
                            "icon"     : <LogoutIcon size={13} className="text-[#7a8f9f]"/>,
                            "label"    : "Sign out",
                            "callback" : () => logout()
                        }
                    ]}/>
                </div>
            </div>
        </>
    );
}
