
export interface CheckIconProps {
    size: number;
};

export default function CheckIcon (props: CheckIconProps) {
    return (
        <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">
            <polyline
            points="5,12 10,17 19,8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: "drawCheck 0.4s ease 0.1s both",
            }}
            />
        </svg>
    );
}