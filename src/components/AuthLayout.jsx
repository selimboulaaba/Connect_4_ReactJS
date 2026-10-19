import { Card, Page } from '../ui'
import { Logo } from './layout/AppShell'

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Page size="sm" className="flex min-h-[calc(100dvh-4rem)] flex-col justify-center">
      <Card className="p-6 sm:p-8">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </Card>
      {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
    </Page>
  )
}
