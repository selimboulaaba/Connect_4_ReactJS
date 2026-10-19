import { useEffect, useRef, useState } from 'react'
import { LuSend } from 'react-icons/lu'
import { IconButton, cn } from '../../ui'

const QUICK = ['GG! 🤝', 'Nice move!', 'Lucky… 😅', '🤔', '😎', 'Rematch?']

export function GameChat({ messages, me, onSend, disabled }) {
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (value) => {
    const v = value.trim()
    if (!v || disabled) return
    onSend(v)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="scrollbar-thin flex h-56 flex-col gap-1.5 overflow-y-auto pr-1 lg:h-auto lg:min-h-56 lg:flex-1" aria-live="polite">
        {messages.length === 0 ? (
          <p className="m-auto text-center text-sm text-subtle">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((m, i) => {
            const mine = m.username === me
            return (
              <div key={i} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                <span
                  className={cn(
                    'max-w-[80%] break-words rounded-2xl px-3 py-1.5 text-sm',
                    mine ? 'rounded-br-md bg-primary text-primary-fg' : 'rounded-bl-md bg-raised text-fg'
                  )}
                >
                  {m.message}
                </span>
              </div>
            )
          })
        )}
      </div>
      <div className="scrollbar-thin -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => send(q)}
            className="shrink-0 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-muted transition hover:border-primary/50 hover:text-fg disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
          setText('')
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          disabled={disabled}
          placeholder={disabled ? 'Chat opens when your opponent joins' : 'Message…'}
          aria-label="Chat message"
          className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 text-sm placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
        />
        <IconButton type="submit" icon={LuSend} label="Send" variant="primary" disabled={disabled || !text.trim()} />
      </form>
    </div>
  )
}
