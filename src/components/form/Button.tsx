
import Spinner from "../icons/Spinner.tsx";

export type ButtonVariant = "primary";

export interface ButtonProps {
    onClick: () => void;
    loading: boolean;

    text : string;
    loadingText ?: string;

    variant : ButtonVariant;
};

export function Button (props: ButtonProps) {
    return (
        <button
            onClick={props.onClick}
            disabled={props.loading}
            className="w-full h-10 text-[12.5px] font-medium tracking-[0.05em] uppercase text-white transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
            background: props.loading ? "#4a90b8" : "#1a5f9a",
            borderRadius: 1,
            }}
            onMouseEnter={(e) => !props.loading && (e.currentTarget.style.background = "#1a7fbb")}
            onMouseLeave={(e) => !props.loading && (e.currentTarget.style.background = "#1a5f9a")}
        >
            {props.loading ? (
            <span className="flex items-center justify-center gap-2">
                <Spinner />
                {props.loadingText || props.text}
            </span>
            ) : (
            props.text
            )}
        </button>
    );
}