import { cn } from '@/lib/utils'

export function Page({ className, size = 'lg', children }) {
  const width = { sm: 'max-w-md', md: 'max-w-3xl', lg: 'max-w-6xl' }[size]
  return <div className={cn('mx-auto w-full px-4 pb-32 pt-8 sm:px-6 sm:pt-12 md:pb-20', width, className)}>{children}</div>
}

/** Page title in the display face. No eyebrow labels: the title says where you are. */
export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <header className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="font-display text-display-md sm:text-display-lg">{title}</h1>
        {subtitle && <p className="mt-2 max-w-[60ch] text-lg text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
