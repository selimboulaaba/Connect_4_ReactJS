import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Page } from '@/ui'
import { cn } from '@/lib/utils'
import { Disc } from './Board'

/**
 * Frame for every game screen: back link and title, score rail, the board on its feet with a
 * result overlay, a status line and controls. `side` (chat) sits beside the board on desktop.
 */
export function GameLayout({ title, badge, back = '/', backLabel = 'Back', actions, rail, board, overlay, status, controls, side }) {
  return (
    <Page className="pt-5 sm:pt-8">
      <div className="mb-5 flex items-center gap-2">
        <Link to={back} className="inline-flex h-10 items-center gap-1.5 rounded-full pl-2 pr-3.5 font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <ArrowLeft className="size-[18px]" aria-hidden />
          {backLabel}
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <h1 className="truncate font-display text-xl sm:text-2xl">{title}</h1>
          {badge}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>

      <div className={cn('grid gap-8', side && 'lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start')}>
        <div className="mx-auto w-full max-w-[clamp(19rem,calc((100dvh-23rem)*0.97),36rem)]">
          {rail}
          <div className="relative">
            {board}
            {overlay}
          </div>
          {status && <div className="mt-5 flex min-h-11 items-center justify-center text-center" aria-live="polite">{status}</div>}
          {controls && <div className="mt-3 flex flex-wrap items-center justify-center gap-3">{controls}</div>}
        </div>
        {side && <aside className="w-full">{side}</aside>}
      </div>
    </Page>
  )
}

/** "Your turn" line under the board, led by the disc of whoever is to play. */
export function TurnStatus({ player, children }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-lg font-extrabold">
      {player && <Disc player={player} className="size-6 border-2 border-ink" />}
      {children}
    </span>
  )
}
