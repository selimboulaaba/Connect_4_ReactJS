import { cn } from './cn'

/** options: [{ value, label, icon? }] */
export function SegmentedControl({ options, value, onChange, label, className, size = 'md' }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-xl bg-raised p-1 ring-1 ring-inset ring-line', className)}>
      {options.map((o) => {
        const active = o.value === value
        const Icon = o.icon
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition',
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3.5 text-sm',
              active ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'
            )}
          >
            {Icon && <Icon className="size-4" aria-hidden />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
