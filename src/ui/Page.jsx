import { cn } from './cn'

export function Page({ className, size = 'lg', children }) {
  const width = { sm: 'max-w-md', md: 'max-w-3xl', lg: 'max-w-6xl' }[size]
  return <div className={cn('mx-auto w-full animate-fade-in px-4 pb-28 pt-6 sm:px-6 sm:pt-10 md:pb-16', width, className)}>{children}</div>
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }) {
  return (
    <header className={cn('mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
