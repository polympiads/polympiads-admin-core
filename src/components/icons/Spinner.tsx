
export default function Spinner () {
    return (
        <span
            style={{
                display: "inline-block",
                width: 14,
                height: 14,
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
            }}
        />
    );
}
