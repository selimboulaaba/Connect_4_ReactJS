import { Link } from 'react-router-dom'
import { LuArrowLeft } from 'react-icons/lu'
import { Page, cn } from '../../ui'

/**
 * Shared frame for every game screen: back link + title, player bar, board with overlay,
 * status line, and an optional side panel (chat) that sits beside the board on desktop.
 */
export function GameLayout({ title, badge, back = '/', backLabel = 'Back', actions, players, board, overlay, status, controls, side }) {
  return (
    <Page className="pt-4 sm:pt-6">
      <div className="mb-4 flex items-center gap-3">
        <Link to={back} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted transition hover:bg-raised hover:text-fg">
          <LuArrowLeft className="size-4" aria-hidden />
          {backLabel}
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
          {badge}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>

      <div className={cn('grid gap-6', side && 'lg:grid-cols-[minmax(0,1fr)_20rem]')}>
        <div className="mx-auto w-full max-w-[34rem]">
          {players && <div className="mb-4 flex gap-2 sm:gap-3">{players}</div>}
          <div className="relative">
            {board}
            {overlay}
          </div>
          {status && <div className="mt-4 flex min-h-[2.5rem] items-center justify-center text-center" aria-live="polite">{status}</div>}
          {controls && <div className="mt-3 flex flex-wrap justify-center gap-2">{controls}</div>}
        </div>
        {side && <aside className="w-full">{side}</aside>}
      </div>
    </Page>
  )
}

export function TurnStatus({ player, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-raised px-4 py-2 text-sm font-semibold">
      {player && <span className={cn('size-3 rounded-full', player === 'p1' ? 'disc-p1' : 'disc-p2')} aria-hidden />}
      {children}
    </span>
  )
}
