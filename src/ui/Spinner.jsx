import { cn } from './cn'

export function Spinner({ className, label = 'Loading' }) {
  return (
    <span role="status" aria-label={label} className={cn('inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent', className)} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-primary">
      <Spinner className="size-8" />
    </div>
  )
}
