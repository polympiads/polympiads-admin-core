import type { CellContext } from "@tanstack/react-table"

export function formatRelative(date: Date): string {
  const diff    = Date.now() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours   / 24)
  const months  = Math.floor(days    / 30)
  const years   = Math.floor(days    / 365)

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (years   > 0) return rtf.format(-years,   'year')
  if (months  > 0) return rtf.format(-months,  'month')
  if (days    > 0) return rtf.format(-days,    'day')
  if (hours   > 0) return rtf.format(-hours,   'hour')
  if (minutes > 0) return rtf.format(-minutes, 'minute')
  return 'just now'
}

export function DateView({ value }: { value: string | null }) {
  if (!value) return <span className="text-gray-400">—</span>

  const date     = new Date(value)
  const absolute = date.toLocaleString('en-GB', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })

  const relative = formatRelative(date)

  return (
    <span title={absolute} className="text-gray-700 cursor-default">
      {relative}
    </span>
  )
}

export function DateCell<T>(ctx: CellContext<T, any>) {
  return <DateView value={ctx.getValue() as string | null}/>
}