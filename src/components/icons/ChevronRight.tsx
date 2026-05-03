import Icon, { type SubIconProps } from "./Icon";

export default function ChevronRight (props: SubIconProps) {
    return <Icon
        path="M9 18l6-6-6-6"
        size={props.size}
        strokeWidth={2}
        className={props.className}/>;
}
