import { forwardRef, useId, useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { cn } from './cn'

const field =
  'h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-fg placeholder:text-subtle transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-60'

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
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${inputId}-desc` : undefined}
          className={cn(field, Icon && 'pl-10', (isPassword || trailing) && 'pr-11', error && 'border-danger focus:border-danger focus:ring-danger/15', inputClassName)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-subtle hover:text-fg"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
          </button>
        )}
        {!isPassword && trailing && <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
      {(error || hint) && (
        <p id={`${inputId}-desc`} className={cn('text-xs', error ? 'text-danger' : 'text-subtle')}>
          {error || hint}
        </p>
      )}
    </div>
  )
})
