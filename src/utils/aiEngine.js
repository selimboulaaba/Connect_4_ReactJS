const ROWS = 6;
const COLS = 7;

function buildBoard(p1Moves, p2Moves) {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  p1Moves.forEach(pos => { board[parseInt(pos[0])][parseInt(pos[1])] = 'p1'; });
  p2Moves.forEach(pos => { board[parseInt(pos[0])][parseInt(pos[1])] = 'p2'; });
  return board;
}

function getAvailableRow(board, col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) return row;
  }
  return -1;
}

function getValidCols(board) {
  return Array.from({ length: COLS }, (_, c) => c).filter(c => getAvailableRow(board, c) !== -1);
}

function checkWin(board, piece) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every(i => board[r][c + i] === piece)) return true;
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      if ([0, 1, 2, 3].every(i => board[r + i][c] === piece)) return true;
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every(i => board[r + i][c + i] === piece)) return true;
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      if ([0, 1, 2, 3].every(i => board[r - i][c + i] === piece)) return true;
  return false;
}

function scoreWindow(window, piece) {
  const opp = piece === 'p1' ? 'p2' : 'p1';
  const count = window.filter(c => c === piece).length;
  const empty = window.filter(c => c === null).length;
  const oppCount = window.filter(c => c === opp).length;
  if (count === 4) return 100;
  if (count === 3 && empty === 1) return 5;
  if (count === 2 && empty === 2) return 2;
  if (oppCount === 3 && empty === 1) return -4;
  return 0;
}

function scoreBoard(board, piece) {
  let score = 0;
  const centerCol = board.map(row => row[3]);
  score += centerCol.filter(c => c === piece).length * 3;

  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += scoreWindow([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]], piece);

  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 3; r++)
      score += scoreWindow([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]], piece);

  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += scoreWindow([board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]], piece);

  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++)
      score += scoreWindow([board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]], piece);

  return score;
}

function isTerminal(board) {
  return checkWin(board, 'p1') || checkWin(board, 'p2') || getValidCols(board).length === 0;
}

function minimax(board, depth, alpha, beta, maximizing) {
  const validCols = getValidCols(board);
  if (depth === 0 || isTerminal(board)) {
    if (checkWin(board, 'p2')) return { score: 100000 + depth };
    if (checkWin(board, 'p1')) return { score: -100000 - depth };
    if (validCols.length === 0) return { score: 0 };
    return { score: scoreBoard(board, 'p2') };
  }

  if (maximizing) {
    let best = { score: -Infinity, col: validCols[0] };
    for (const col of validCols) {
      const row = getAvailableRow(board, col);
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 'p2';
      const result = minimax(newBoard, depth - 1, alpha, beta, false);
      if (result.score > best.score) best = { score: result.score, col };
      alpha = Math.max(alpha, best.score);
      if (alpha >= beta) break;
    }
    return best;
  } else {
    let best = { score: Infinity, col: validCols[0] };
    for (const col of validCols) {
      const row = getAvailableRow(board, col);
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = 'p1';
      const result = minimax(newBoard, depth - 1, alpha, beta, true);
      if (result.score < best.score) best = { score: result.score, col };
      beta = Math.min(beta, best.score);
      if (alpha >= beta) break;
    }
    return best;
  }
}

export function getBestMove(p1Moves, p2Moves, difficulty) {
  const board = buildBoard(p1Moves, p2Moves);
  const validCols = getValidCols(board);
  if (difficulty === 'easy') {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }
  const depth = difficulty === 'medium' ? 4 : 6;
  return minimax(board, depth, -Infinity, Infinity, true).col;
}
