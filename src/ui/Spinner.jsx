import { cn } from '@/lib/utils'

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block size-5 animate-spin rounded-full border-[3px] border-current border-r-transparent', className)}
    />
  )
}

/** Full-page loading state: a single disc dropping into a hole. */
export function PageSpinner() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-label="Loading">
      <span className="board-hole relative block size-12 overflow-hidden rounded-full border-3 border-ink">
        <span className="disc disc-red absolute inset-[3px] animate-[drop_900ms_cubic-bezier(0.33,0,0.67,1)_infinite]" style={{ '--drop-from': '-140%' }} />
      </span>
    </div>
  )
}
