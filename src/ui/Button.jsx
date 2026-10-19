import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Buttons are pieces of moulded plastic: an ink outline sitting on a hard ledge
// that disappears when pressed.
const plastic =
  'border-3 border-ink shadow-plastic active:translate-y-[4px] active:shadow-none disabled:translate-y-0 disabled:shadow-plastic'

const buttonVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-bold transition-[transform,box-shadow,background-color,color] duration-75 disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-[1.15em] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: `${plastic} bg-yellow text-[hsl(var(--on-yellow))] hover:brightness-105`,
        board: `${plastic} bg-board text-on-board hover:brightness-110`,
        secondary: `${plastic} bg-card text-foreground hover:bg-muted`,
        danger: `${plastic} bg-red text-white hover:brightness-105`,
        ghost: 'rounded-btn text-muted-foreground hover:bg-muted hover:text-foreground',
        'danger-ghost': 'rounded-btn text-red hover:bg-red/10',
      },
      size: {
        sm: 'h-9 rounded-btn px-3.5 text-sm',
        md: 'h-11 rounded-btn px-5 text-[0.95rem]',
        lg: 'h-14 rounded-[1.1rem] px-7 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

/** Pass `to` to render a router link that looks like a button. */
export const Button = forwardRef(function Button(
  { variant, size, loading = false, block = false, to, icon: Icon, className, children, disabled, type = 'button', ...props },
  ref
) {
  const classes = cn(buttonVariants({ variant, size }), block && 'w-full', className)
  const content = (
    <>
      {loading ? <Spinner className="size-[1.1em] border-[2.5px]" /> : Icon && <Icon aria-hidden />}
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

const ICON_SIZES = { sm: 'size-9', md: 'size-11', lg: 'size-14' }

/** Square icon-only button with a tooltip carrying its label. */
export const IconButton = forwardRef(function IconButton(
  { variant = 'ghost', size = 'md', icon: Icon, label, className, type = 'button', ...props },
  ref
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          type={type}
          aria-label={label}
          className={cn(buttonVariants({ variant, size }), ICON_SIZES[size], 'px-0', variant === 'ghost' && 'rounded-full', className)}
          {...props}
        >
          <Icon className="!size-5" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
})
