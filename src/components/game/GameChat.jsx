import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { IconButton } from '@/ui'
import { cn } from '@/lib/utils'

const QUICK = ['Good game!', 'Nice move', 'Lucky one…', 'Rematch?', '😅', '🔥']

export function GameChat({ messages, me, onSend, disabled }) {
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (value) => {
    const v = value.trim()
    if (v && !disabled) onSend(v)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={listRef} className="scrollbar-thin flex h-56 flex-col gap-1.5 overflow-y-auto pr-1 lg:h-auto lg:min-h-64 lg:flex-1" aria-live="polite">
        {messages.length === 0 ? (
          <p className="m-auto text-center text-sm text-muted-foreground">Messages you send appear here.</p>
        ) : (
          messages.map((m, i) => {
            const mine = m.username === me
            return (
              <div key={i} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <span
                  className={cn(
                    'max-w-[80%] break-words rounded-[1.1rem] border-2 border-ink px-3 py-1.5 text-sm font-medium',
                    mine ? 'rounded-br-md bg-board text-on-board' : 'rounded-bl-md bg-muted text-foreground'
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
            className="shrink-0 rounded-full border-2 border-ink/25 px-3 py-1 text-sm font-bold text-muted-foreground transition-colors hover:border-ink hover:text-foreground disabled:opacity-50"
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
          placeholder={disabled ? 'Chat opens when your opponent joins' : 'Write a message'}
          aria-label="Chat message"
          className="h-11 min-w-0 flex-1 rounded-btn border-3 border-ink bg-card px-3.5 placeholder:text-muted-foreground/80 focus:outline-none focus:ring-4 focus:ring-ring/35"
        />
        <IconButton type="submit" icon={Send} label="Send message" variant="board" disabled={disabled || !text.trim()} />
      </form>
    </div>
  )
}
