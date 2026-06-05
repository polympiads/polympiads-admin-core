type PaginationButtonProps = {
  kind: "dots";
} | {
  kind: "left" | "right" | "direct";
  targetPage: number;
};

function TablePaginationButton(props: {
  button: PaginationButtonProps;
  pageCount: number;
  pageIndex: number;
  setPageIndex: (page: number) => void;
}) {
  const { button, pageCount, pageIndex, setPageIndex } = props;

  if (button.kind === "dots") {
    return (
      <span className="w-6 h-6 flex items-center justify-center text-[11px] text-gray-400">
        …
      </span>
    );
  }

  const targetPage = button.targetPage;

  const disabled =
    (button.kind === "left" && pageIndex <= 1) ||
    (button.kind === "right" && pageIndex >= pageCount);

  const active = button.kind === "direct" && targetPage === pageIndex;

  const label =
    button.kind === "left"  ? "‹" :
    button.kind === "right" ? "›" :
    String(targetPage);

  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && setPageIndex(targetPage)}
      className={`w-6 h-6 flex items-center justify-center text-[11px] rounded border transition-colors
        ${active
          ? "bg-blue-600 text-white border-blue-600"
          : disabled
          ? "text-gray-300 border-gray-200 cursor-not-allowed"
          : "text-gray-600 border-gray-200 hover:bg-gray-50 bg-white"}`}
    >
      {label}
    </button>
  );
}

function buttonKey(button: PaginationButtonProps, i: number): string {
  if (button.kind === "dots") return `dots-${i}`;
  if (button.kind === "left") return "left";
  if (button.kind === "right") return "right";
  return `page-${button.targetPage}`;
}

export default function TablePagination(props: {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  setPageIndex: (page: number) => void;
}) {
  const { pageCount, pageIndex, setPageIndex } = props;

  if (pageCount <= 1) return <></>;

  const allIndices = new Set<number>();
  function pushIndex(index: number) {
    if (index < 1 || index > pageCount) return;
    allIndices.add(index);
  }

  pushIndex(1);
  pushIndex(2);
  pushIndex(pageIndex - 1);
  pushIndex(pageIndex);
  pushIndex(pageIndex + 1);
  pushIndex(pageCount - 1);
  pushIndex(pageCount);

  const indices = Array.from(allIndices).sort((a, b) => a - b);

  const buttons: PaginationButtonProps[] = [];

  buttons.push({ kind: "left", targetPage: pageIndex - 1 });

  for (let i = 0; i < indices.length; i++) {
    const curr = indices[i];
    const prev = indices[i - 1];

    if (i > 0 && curr - prev === 2) {
      // single gap — fill it in rather than showing dots
      buttons.push({ kind: "direct", targetPage: prev + 1 });
    } else if (i > 0 && curr - prev > 2) {
      buttons.push({ kind: "dots" });
    }

    buttons.push({ kind: "direct", targetPage: curr });
  }

  buttons.push({ kind: "right", targetPage: pageIndex + 1 });

  const startOfPage = (props.pageIndex - 1) * props.pageSize + 1;
  const endOfPage   = Math.min( props.pageIndex * props.pageSize, props.totalRows );

  const rangeText = startOfPage === endOfPage
    ? `${startOfPage} of ${props.totalRows}`
    : `${startOfPage} - ${endOfPage} of ${props.totalRows}`

  return (
    <>
        <span className="text-[11px] text-gray-400 whitespace-nowrap">
            {rangeText}
        </span>
        <div className="flex items-center gap-1">
            {buttons.map((button, i) => (
                <TablePaginationButton
                key={buttonKey(button, i)}
                button={button}
                pageCount={pageCount}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                />
            ))}
        </div>
    </>
  );
}