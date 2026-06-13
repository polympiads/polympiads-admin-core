
export function Label(props: { label: string }) {
  return (
    <label className="block text-[11px] font-medium tracking-[0.07em] uppercase text-gray-500 mt-3">
      {props.label}
    </label>
  )
}
