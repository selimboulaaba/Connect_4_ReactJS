import { COLS, ROWS, buildBoard, dropRow, findWinLine } from './logic'

// Center columns first: better alpha-beta pruning and more natural play.
const ORDER = [3, 2, 4, 1, 5, 0, 6]

const validCols = (board) => ORDER.filter((c) => dropRow(board, c) !== -1)

function scoreWindow(cells, piece) {
  const opp = piece === 'p1' ? 'p2' : 'p1'
  let mine = 0, empty = 0, theirs = 0
  for (const c of cells) {
    if (c === piece) mine++
    else if (c === null) empty++
    else if (c === opp) theirs++
  }
  if (mine === 4) return 100
  if (mine === 3 && empty === 1) return 5
  if (mine === 2 && empty === 2) return 2
  if (theirs === 3 && empty === 1) return -4
  return 0
}

function scoreBoard(board, piece) {
  let score = 0
  for (let r = 0; r < ROWS; r++) if (board[r][3] === piece) score += 3
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c <= COLS - 4) score += scoreWindow([0, 1, 2, 3].map((i) => board[r][c + i]), piece)
      if (r <= ROWS - 4) score += scoreWindow([0, 1, 2, 3].map((i) => board[r + i][c]), piece)
      if (r <= ROWS - 4 && c <= COLS - 4) score += scoreWindow([0, 1, 2, 3].map((i) => board[r + i][c + i]), piece)
      if (r >= 3 && c <= COLS - 4) score += scoreWindow([0, 1, 2, 3].map((i) => board[r - i][c + i]), piece)
    }
  }
  return score
}

function minimax(board, depth, alpha, beta, maximizing) {
  const cols = validCols(board)
  const cpuWin = findWinLine(board, 'p2')
  const humanWin = findWinLine(board, 'p1')
  if (cpuWin) return { score: 100000 + depth }
  if (humanWin) return { score: -100000 - depth }
  if (!cols.length) return { score: 0 }
  if (depth === 0) return { score: scoreBoard(board, 'p2') }

  let best = { score: maximizing ? -Infinity : Infinity, col: cols[0] }
  for (const col of cols) {
    const row = dropRow(board, col)
    board[row][col] = maximizing ? 'p2' : 'p1'
    const { score } = minimax(board, depth - 1, alpha, beta, !maximizing)
    board[row][col] = null
    if (maximizing ? score > best.score : score < best.score) best = { score, col }
    if (maximizing) alpha = Math.max(alpha, score)
    else beta = Math.min(beta, score)
    if (alpha >= beta) break
  }
  return best
}

/** The CPU always plays p2. */
export function getBestMove(p1Moves, p2Moves, difficulty) {
  const board = buildBoard(p1Moves, p2Moves)
  const cols = validCols(board)
  if (difficulty === 'easy') {
    // Mostly random, but takes an obvious win when it sees one.
    for (const c of cols) {
      const r = dropRow(board, c)
      board[r][c] = 'p2'
      const wins = findWinLine(board, 'p2')
      board[r][c] = null
      if (wins && Math.random() < 0.7) return c
    }
    return cols[Math.floor(Math.random() * cols.length)]
  }
  const depth = difficulty === 'medium' ? 4 : 7
  return minimax(board, depth, -Infinity, Infinity, true).col
}
