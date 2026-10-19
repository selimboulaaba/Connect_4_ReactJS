import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from './cn'
import { Spinner } from './Spinner'

const VARIANTS = {
  primary: 'bg-primary text-primary-fg shadow-sm hover:bg-primary-strong',
  secondary: 'bg-raised text-fg ring-1 ring-inset ring-line hover:bg-line/60',
  ghost: 'text-muted hover:bg-raised hover:text-fg',
  danger: 'bg-danger text-white hover:bg-danger/90',
  'danger-ghost': 'text-danger hover:bg-danger/10',
  success: 'bg-success text-white hover:bg-success/90',
}

const SIZES = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-sm',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  lg: 'h-12 gap-2.5 rounded-xl px-6 text-base',
}

const ICON_SIZES = {
  sm: 'size-8 rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-12 rounded-xl',
}

const base =
  'inline-flex shrink-0 select-none items-center justify-center font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50'

/**
 * Pass `to` to render a router link styled as a button.
 */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, block = false, to, icon: Icon, className, children, disabled, type = 'button', ...props },
  ref
) {
  const classes = cn(base, VARIANTS[variant], SIZES[size], block && 'w-full', className)
  const content = (
    <>
      {loading ? <Spinner className="size-4" /> : Icon && <Icon className="size-[1.15em]" aria-hidden />}
      {children}
    </>
  )
  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {content}
    </button>
  )
})

export const IconButton = forwardRef(function IconButton(
  { variant = 'ghost', size = 'md', icon: Icon, label, className, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(base, VARIANTS[variant], ICON_SIZES[size], className)}
      {...props}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  )
})
