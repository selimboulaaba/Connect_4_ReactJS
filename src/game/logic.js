// Connect 4 rules shared by every mode. Positions are "<row><col>" strings, row 0 = top.
// Mirrors back/src/utils/board.js, which is authoritative for online games.
export const ROWS = 6
export const COLS = 7
const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]]

export const pos = (row, col) => `${row}${col}`

export function buildBoard(p1Moves = [], p2Moves = []) {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  for (const m of p1Moves) board[+m[0]][+m[1]] = 'p1'
  for (const m of p2Moves) board[+m[0]][+m[1]] = 'p2'
  return board
}

/** Lowest free row in a column, or -1 when full. */
export function dropRow(board, col) {
  for (let row = ROWS - 1; row >= 0; row--) if (!board[row][col]) return row
  return -1
}

export function findWinLine(board, piece) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== piece) continue
      for (const [dr, dc] of DIRECTIONS) {
        const line = [pos(r, c)]
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k
          const nc = c + dc * k
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== piece) break
          line.push(pos(nr, nc))
        }
        if (line.length === 4) return line
      }
    }
  }
  return null
}

/** { winner: 'p1' | 'p2' | 'draw' | null, line: string[] | null } */
export function evaluate(p1Moves = [], p2Moves = []) {
  const board = buildBoard(p1Moves, p2Moves)
  const l1 = findWinLine(board, 'p1')
  if (l1) return { winner: 'p1', line: l1 }
  const l2 = findWinLine(board, 'p2')
  if (l2) return { winner: 'p2', line: l2 }
  if (p1Moves.length + p2Moves.length >= ROWS * COLS) return { winner: 'draw', line: null }
  return { winner: null, line: null }
}

/** Position a disc would land on in `col`, or null if the column is full. */
export function landingPos(p1Moves, p2Moves, col) {
  const row = dropRow(buildBoard(p1Moves, p2Moves), col)
  return row === -1 ? null : pos(row, col)
}
