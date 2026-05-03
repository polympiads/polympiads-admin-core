
export interface IconProps {
    path: string;
    size: number;

    strokeWidth: number;
    className:   string;
};

export interface SubIconProps {
  size: number;

  className: string;
};

export default function Icon (props: IconProps) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        className={props.className}>
        <path d={props.path} />
    </svg>
  );
}
