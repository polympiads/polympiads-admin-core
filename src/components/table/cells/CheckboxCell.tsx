import { useCallback } from "react";

export type CheckboxVariant = "on" | "off" | "added" | "removed";

export interface CheckboxProps {
  value:     () => CheckboxVariant;
  onClick ?: () => void;
  
  className?: string;
}

const VARIANT_CONFIG: Record<
  CheckboxVariant,
  {
    className: string;
    tick: React.ReactNode;
  }
> = {
  on: {
    className: "bg-[#1a6fad] border border-[#1560a0] shadow-[inset_0_1px_0_#2b8fd444,_0_1px_2px_#00000018] group-hover:bg-[#2b8fd4] group-hover:border-#[1a6fad]",
    tick: (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <polyline points="1,3.5 3.5,6 8,1" stroke="white" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"/>
      </svg>
    )
  },
  off: {
    className: "bg-[#ffffff] border border-[#a0adb8] shadow-[inset_0_1px_0_#00000014,_0_1px_2px_#00000018] group-hover:bg-[#edf2f7] group-hover:border-[#6a8090]",
    tick: (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
      </svg>
    )
  },
  added: {
    className: "bg-[#2a9448] border border-[#1e7a38] shadow-[inset_0_1px_0_#4ab86844,_0_1px_2px_#00000018] group-hover:bg-[#34b458] group-hover:border-[#2a9448]",
    tick: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <line x1="4.5" y1="1" x2="4.5" y2="8" stroke="white" strokeWidth="2" strokeLinecap="square"/>
        <line x1="1" y1="4.5" x2="8" y2="4.5" stroke="white" strokeWidth="2" strokeLinecap="square"/>
      </svg>
    )
  },
  removed: {
    className: "bg-[#c03030] border border-[#a02020] shadow-[inset_0_1px_0_#e0505044,_0_1px_2px_#00000018] group-hover:bg-[#d94040] group-hover:border-[#c03030]",
    tick: (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <line x1="1" y1="4.5" x2="8" y2="4.5" stroke="white" strokeWidth="2" strokeLinecap="square"/>
      </svg>
    )
  },
};

export function CheckboxCell({
  value,
  onClick,
  className = "",
}: CheckboxProps) {
  const variant = value();
  const checked = variant == "on" || variant == "added";
  const cfg = VARIANT_CONFIG[variant];

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  }, [onClick]);
 
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick]
  );
 
  return (
    <div className="px-2 pb-[8px] pt-[7px] h-8 max-h-8"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
            cursor: "pointer",
        }}>
        <span
        role="checkbox"
        aria-checked={checked}
        data-variant={variant}
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            userSelect: "none",
            outline: "none",
            lineHeight: 0
        }}
        className={className}
        >
        {/* Sharp square box */}
        <span
            aria-hidden
            style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            borderRadius: 0,
            flexShrink: 0,
            transition: "background 120ms, border-color 120ms",
            lineHeight: 0
            }}
            className={cfg.className}
        >
            {cfg.tick}
        </span>
        </span>
    </div>
  );
}
