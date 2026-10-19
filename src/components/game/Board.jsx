import { useMemo, useRef, useState } from 'react'
import { COLS, ROWS, buildBoard, dropRow, pos } from '../../game/logic'
import { cn } from '../../ui'

export function Disc({ player, className, style }) {
  return <span className={cn('disc block rounded-full', player === 'p1' ? 'disc-p1' : 'disc-p2', className)} style={style} />
}

/**
 * The game board. Renders discs, previews, drop animation and the winning line.
 * Columns are real buttons: arrow keys move between them, Enter/Space drops a disc.
 */
export function Board({
  p1Moves = [],
  p2Moves = [],
  winLine = null,
  lastMove = null,
  interactive = false,
  previewPlayer = null,
  onPlay,
  highlight = null,
  className,
  label = 'Connect 4 board',
}) {
  const board = useMemo(() => buildBoard(p1Moves, p2Moves), [p1Moves, p2Moves])
  const [hoverCol, setHoverCol] = useState(null)
  const colRefs = useRef([])
  const winSet = useMemo(() => new Set(winLine || []), [winLine])
  const previewRow = interactive && previewPlayer && hoverCol !== null ? dropRow(board, hoverCol) : -1
  const dimmed = winSet.size > 0

  const onKeyDown = (e, col) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (step) {
      e.preventDefault()
      colRefs.current[(col + step + COLS) % COLS]?.focus()
    } else if (/^[1-7]$/.test(e.key) && interactive) {
      onPlay?.(Number(e.key) - 1)
    }
  }

  return (
    <div className={cn('board-frame relative mx-auto w-full max-w-[34rem] select-none overflow-hidden rounded-[1.4rem] p-[2.2%] sm:rounded-[1.75rem]', className)} role="group" aria-label={label}>
      <div className="grid grid-cols-7 gap-[clamp(4px,1.5vw,10px)]">
        {Array.from({ length: COLS }, (_, col) => {
          const full = dropRow(board, col) === -1
          const canPlay = interactive && !full
          return (
            <button
              key={col}
              ref={(el) => { colRefs.current[col] = el }}
              type="button"
              disabled={!interactive}
              aria-disabled={!canPlay || undefined}
              aria-label={`Column ${col + 1}${full ? ', full' : ''}`}
              onClick={() => canPlay && onPlay?.(col)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHoverCol(col)}
              onPointerLeave={() => setHoverCol((c) => (c === col ? null : c))}
              onFocus={(e) => e.target.matches(':focus-visible') && setHoverCol(col)}
              onBlur={() => setHoverCol((c) => (c === col ? null : c))}
              onKeyDown={(e) => onKeyDown(e, col)}
              className={cn(
                'group relative flex flex-col gap-[clamp(4px,1.5vw,10px)] rounded-xl outline-none transition-colors focus-visible:ring-4 focus-visible:ring-white/50 disabled:cursor-default',
                canPlay ? 'cursor-pointer hover:bg-white/[0.07]' : 'cursor-default'
              )}
            >
              {Array.from({ length: ROWS }, (_, row) => {
                const p = pos(row, col)
                const piece = board[row][col]
                const isWin = winSet.has(p)
                const animate = p === lastMove
                return (
                  <span key={row} className="board-hole relative block aspect-square overflow-visible rounded-full">
                    {piece && (
                      <Disc
                        player={piece}
                        className={cn(
                          'absolute inset-0 transition-opacity duration-300',
                          animate && 'animate-drop',
                          dimmed && !isWin && 'opacity-35',
                          isWin && 'animate-win-pulse'
                        )}
                        style={animate ? { '--drop-from': `calc(-${row + 1} * 108%)`, '--drop-ms': `${260 + row * 55}ms` } : undefined}
                      />
                    )}
                    {!piece && row === previewRow && col === hoverCol && (
                      <Disc player={previewPlayer} className="absolute inset-0 opacity-40" />
                    )}
                    {highlight?.includes(p) && !piece && (
                      <span className="absolute inset-[18%] animate-pulse rounded-full border-2 border-dashed border-white/70" />
                    )}
                  </span>
                )
              })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Small read-only board for lists. */
export function MiniBoard({ p1Moves = [], p2Moves = [], className }) {
  const board = buildBoard(p1Moves, p2Moves)
  return (
    <div className={cn('board-frame grid grid-cols-7 gap-[3px] rounded-lg p-1.5', className)} aria-hidden>
      {board.flatMap((row, r) =>
        row.map((cell, c) => (
          <span key={`${r}${c}`} className={cn('aspect-square rounded-full', cell ? (cell === 'p1' ? 'disc-p1' : 'disc-p2') : 'board-hole')} />
        ))
      )}
    </div>
  )
}
