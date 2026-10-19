import { useMemo, useRef, useState } from 'react'
import { COLS, ROWS, buildBoard, dropRow, pos } from '../../game/logic'
import { cn } from '@/lib/utils'

const DISC = { p1: 'disc-red', p2: 'disc-yellow' }
const GAP = 'gap-[clamp(5px,1.6vw,11px)]'

export function Disc({ player, className, style }) {
  return <span className={cn('disc block', DISC[player], className)} style={style} />
}

/**
 * The board, as the toy: a cobalt frame on two feet. Hovering a column holds your disc above
 * it; dropping animates it down. Columns are buttons: arrow keys move, Enter/Space or 1–7 drop.
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
  feet = true,
}) {
  const board = useMemo(() => buildBoard(p1Moves, p2Moves), [p1Moves, p2Moves])
  const [hoverCol, setHoverCol] = useState(null)
  const colRefs = useRef([])
  const winSet = useMemo(() => new Set(winLine || []), [winLine])
  const showPreview = interactive && previewPlayer && hoverCol !== null && dropRow(board, hoverCol) !== -1
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
    <div className={cn('relative mx-auto w-full max-w-[36rem] select-none', className)}>
      {/* Drop zone: your disc waits above the column you're pointing at. */}
      <div className={cn('mb-2 grid grid-cols-7 px-[3.2%] [@media(pointer:coarse)]:hidden', GAP)} aria-hidden>
        {Array.from({ length: COLS }, (_, col) => (
          <span key={col} className="block aspect-square">
            {showPreview && hoverCol === col && <Disc player={previewPlayer} className="size-full border-2 border-ink/30" />}
          </span>
        ))}
      </div>

      <div className="board-frame relative overflow-hidden rounded-board p-[3%]" role="group" aria-label={label}>
        <div className={cn('grid grid-cols-7', GAP)}>
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
                  'relative flex flex-col rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-board disabled:cursor-default',
                  GAP,
                  canPlay ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                {Array.from({ length: ROWS }, (_, row) => {
                  const p = pos(row, col)
                  const piece = board[row][col]
                  const isWin = winSet.has(p)
                  const animate = p === lastMove
                  return (
                    <span key={row} className="board-hole relative block aspect-square rounded-full">
                      {piece && (
                        <Disc
                          player={piece}
                          className={cn(
                            'absolute inset-0 transition-opacity duration-300',
                            animate && 'animate-drop',
                            dimmed && !isWin && 'opacity-45 dark:opacity-70 dark:saturate-50',
                            isWin && 'animate-win-glow'
                          )}
                          style={animate ? { '--drop-from': `calc(-${row + 2} * 112%)`, '--drop-ms': `${280 + row * 55}ms` } : undefined}
                        />
                      )}
                      {highlight?.includes(p) && !piece && (
                        <span className="absolute inset-[16%] animate-pulse rounded-full border-[3px] border-dashed border-yellow" />
                      )}
                    </span>
                  )
                })}
              </button>
            )
          })}
        </div>
      </div>

      {feet && (
        <div className="flex justify-between px-[7%]" aria-hidden>
          <span className="board-foot block h-[clamp(14px,3vw,22px)] w-[18%]" />
          <span className="board-foot block h-[clamp(14px,3vw,22px)] w-[18%]" />
        </div>
      )}
    </div>
  )
}

/** Small read-only board for lists and thumbnails. */
export function MiniBoard({ p1Moves = [], p2Moves = [], className }) {
  const board = buildBoard(p1Moves, p2Moves)
  return (
    <div className={cn('board-frame grid grid-cols-7 gap-[3px] rounded-[0.8rem] p-1.5 !shadow-plastic-sm', className)} aria-hidden>
      {board.flatMap((row, r) =>
        row.map((cell, c) => (
          <span key={`${r}${c}`} className={cn('aspect-square rounded-full', cell ? `disc ${DISC[cell]}` : 'board-hole')} />
        ))
      )}
    </div>
  )
}
