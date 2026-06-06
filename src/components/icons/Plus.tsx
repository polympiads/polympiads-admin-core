import Icon, { type SubIconProps } from "./Icon";

export default function Plus(props: SubIconProps) {
    return <Icon
        path="M12 2v20M2 12h20"
        size={props.size}
        strokeWidth={2}
        className={props.className}/>;
}