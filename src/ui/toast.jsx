import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { LuCheckCircle, LuAlertCircle, LuInfo, LuAlertTriangle, LuX } from 'react-icons/lu'
import { cn } from './cn'
import { dismiss, listeners, toasts } from './toastStore'

const ICONS = { success: LuCheckCircle, error: LuAlertCircle, info: LuInfo, warn: LuAlertTriangle }
const TONE = { success: 'text-success', error: 'text-danger', info: 'text-primary', warn: 'text-warning' }

export function Toaster() {
  const items = useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l) },
    () => toasts
  )
  return createPortal(
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-3 sm:items-end sm:p-5">
      {items.map((t) => {
        const Icon = ICONS[t.tone]
        return (
          <div key={t.id} role="status" className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-pop">
            <Icon className={cn('mt-0.5 size-5 shrink-0', TONE[t.tone])} aria-hidden />
            <div className="min-w-0 flex-1">
              {t.title && <p className="font-semibold">{t.title}</p>}
              <p className={cn('text-sm', t.title ? 'text-muted' : 'text-fg')}>{t.message}</p>
              {t.action && (
                <div className="mt-3 flex gap-2">
                  {[].concat(t.action).map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={() => { a.onClick(); dismiss(t.id) }}
                      className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', a.primary === false ? 'bg-raised text-fg hover:bg-line/60' : 'bg-primary text-primary-fg hover:bg-primary-strong')}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="-m-1 rounded-lg p-1 text-subtle hover:text-fg" aria-label="Dismiss">
              <LuX className="size-4" />
            </button>
          </div>
        )
      })}
    </div>,
    document.body
  )
}
