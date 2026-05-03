import Icon, { type SubIconProps } from "./Icon";

export default function LogoutIcon (props: SubIconProps) {
    return <Icon
            path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
            size={props.size}
            strokeWidth={2}
            className={props.className}/>;
}
