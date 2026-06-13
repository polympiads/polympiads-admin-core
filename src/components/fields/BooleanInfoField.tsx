import { BooleanDot } from "../table/cells/BooleanCell";

export function BooleanInfoField(props: { className?: string, label: string, value?: boolean | null, isSkeleton?: boolean }) {
  return (
    <div className={props.className}>
        <div className="flex gap-4">
          <div className='pt-1 h-4'>
            <BooleanDot value={props.value ?? false} isSkeleton={props.isSkeleton} />
          </div>
          <label className="block text-[11px] font-medium tracking-[0.07em] uppercase text-gray-500">
            {props.label}
          </label>
        </div>
    </div>
  )
}
