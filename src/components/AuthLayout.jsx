import { Card, Page } from '@/ui'
import { MiniBoard } from './game/Board'

/** Sign-in and sign-up: the form on a tray, with a board mid-game beside it on wide screens. */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Page className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 md:grid-cols-[minmax(0,26rem)_1fr]">
      <div>
        <h1 className="font-display text-display-md sm:text-display-lg">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>}
        <Card className="mt-6">{children}</Card>
        {footer && <p className="mt-5 text-muted-foreground">{footer}</p>}
      </div>
      <div className="hidden justify-center md:flex" aria-hidden>
        <MiniBoard p1Moves={['53', '52', '43', '33', '41']} p2Moves={['54', '44', '42', '51', '34']} className="w-full max-w-sm -rotate-3 rounded-[1.4rem] p-3 !shadow-plastic-lg" />
      </div>
    </Page>
  )
}
