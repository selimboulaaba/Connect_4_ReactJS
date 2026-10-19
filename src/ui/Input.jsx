import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const field =
  'h-12 w-full rounded-btn border-3 border-ink bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/80 transition-shadow focus:outline-none focus:ring-4 focus:ring-ring/35 disabled:opacity-60'

export const Input = forwardRef(function Input(
  { label, hint, error, icon: Icon, trailing, className, inputClassName, id, type = 'text', ...props },
  ref
) {
  const autoId = useId()
  const inputId = id || autoId
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <Label htmlFor={inputId} className="block text-sm font-bold">{label}</Label>}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden />}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${inputId}-desc` : undefined}
          className={cn(field, Icon && 'pl-11', (isPassword || trailing) && 'pr-12', error && 'border-red focus:ring-red/30', inputClassName)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
        {!isPassword && trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {(error || hint) && (
        <p id={`${inputId}-desc`} className={cn('text-sm', error ? 'font-bold text-red' : 'text-muted-foreground')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})
