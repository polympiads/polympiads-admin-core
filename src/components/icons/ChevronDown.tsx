import Icon, { type SubIconProps } from "./Icon";

export default function ChevronDown (props: SubIconProps) {
    return <Icon
        path="M6 9l6 6 6-6"
        size={props.size}
        strokeWidth={2}
        className={props.className}/>;
}
