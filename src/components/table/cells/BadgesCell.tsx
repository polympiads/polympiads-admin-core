import { useState, useRef, useLayoutEffect } from "react";

const GAP = 4; 

export function Badges({ values }: { values: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(values.length);

  useLayoutEffect(() => {
    if (values.length === 0) {
      setVisibleCount(0);
      return;
    }

    const recompute = () => {
      if (!containerRef.current || !measureRef.current || !overflowRef.current) return;

      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const badgeEls = Array.from(measureRef.current.children) as HTMLElement[];
      const overflowWidth = Math.ceil(overflowRef.current.getBoundingClientRect().width);

      let total = 0;
      let count = 0;

      for (let i = 0; i < badgeEls.length; i++) {
        const w = Math.ceil(badgeEls[i].getBoundingClientRect().width);
        const widthWithGap = w + (count > 0 ? GAP : 0);

        const isLast = i === badgeEls.length - 1;
        const reserve = isLast ? 0 : overflowWidth + GAP;

        if (total + widthWithGap + reserve <= containerWidth) {
          total += widthWithGap;
          count++;
        } else {
          break;
        }
      }

      // Always show at least one badge, even if it technically overflows slightly
      setVisibleCount(Math.max(count, 1));
    };

    recompute();

    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [values]);

  if (values.length === 0) {
    return <span className="text-gray-400 text-xs">—</span>;
  }

  const visible = values.slice(0, visibleCount);
  const remaining = values.length - visible.length;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Hidden measurement elements */}
      <div
        ref={measureRef}
        className="flex gap-1"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }}
        aria-hidden="true"
      >
        {values.map((value, index) => (
          <Badge key={index} value={value} />
        ))}
      </div>
      <span
        ref={overflowRef}
        className="text-xs font-medium text-gray-500"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }}
        aria-hidden="true"
      >
        +{values.length}
      </span>

      {/* Visible row */}
      <div className="flex items-center gap-1 whitespace-nowrap">
        {visible.map((value, index) => (
          <Badge key={index} value={value} />
        ))}
        {remaining > 0 && (
          <span
            className="text-xs font-medium text-gray-500 shrink-0"
          >
            +{remaining}
          </span>
        )}
      </div>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 shrink-0"
    >
      {value}
    </span>
  );
}
