import { Link } from "@tanstack/react-router";
import UserMenu from "./UserMenu";
import LogoutIcon from "../icons/LogoutIcon";
import SettingsIcon from "../icons/SettingsIcon";

export default function Topbar () {
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
                            "username": "j.doe",
                            "name": "Jane Doe",
                            "title": "Administrator"
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
                            "callback" : () => console.log("Sign out")
                        }
                    ]}/>
                </div>
            </div>
        </>
    );
}
