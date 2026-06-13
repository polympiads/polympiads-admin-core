import type { CellContext } from "@tanstack/react-table"

export function BooleanBadge({ value }: { value: boolean }) {
  return value
    ? <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Yes</span>
    : <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">No</span>
}

export function BooleanDot({ value, isSkeleton }: { value: boolean, isSkeleton?: boolean }) {
  if (isSkeleton) {
    return <span className="block w-2 h-2 rounded-full animate-pulse bg-gray-300" />
  }
  
  return (
    <span className={`block w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
  )
}

export function BooleanBadgeCell<T>(ctx: CellContext<T, any>) {
  return <BooleanBadge value={ctx.getValue() as boolean}/>
}
export function BooleanDotCell<T>(ctx: CellContext<T, any>) {
  return <BooleanDot value={ctx.getValue() as boolean}/>
}
