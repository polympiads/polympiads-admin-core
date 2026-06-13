
export function StringInfoField(props: { className?: string, label: string, value?: string | null, isSkeleton?: boolean }) {
  return (
    <div className={props.className}>
      <label className="block text-[11px] font-medium tracking-[0.07em] uppercase text-gray-500 mb-1.5">
        {props.label}
      </label>
      {props.isSkeleton ? (
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      ) : (
        <div className="h-6">{props.value}</div>
      )}
    </div>
  )
}
