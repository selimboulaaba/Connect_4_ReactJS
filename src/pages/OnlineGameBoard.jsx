import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Winner from '../components/Winner'
import { getGame, updateMove, requestRematch } from '../services/game.service';
import { dismissPendingGameInvite } from '../services/user.service';
import { FaRegCopy } from "react-icons/fa";
import Loading from '../components/Loading'
import { setGame, nextGame, updateMoves, updateWinner, setWinner, clearRematchPending } from '../store/actions/gameActions';
import { FaCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import GameChat from '../components/GameChat';
import { useGameSound } from '../hooks/useGameSound';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import UserAvatar from '../components/UserAvatar';
import { setUser } from '../store/actions/userActions';
import { boardOuter, boardRow, boardCol, pieceClass } from '../game/boardLayout';

function OnlineGameBoard() {

  const username = useSelector(state => state.user.user.username);
  const game = useSelector(state => state.game.game);
  const winner = useSelector(state => state.game.winner);
  const rematchPending = useSelector(state => state.game.rematchPending);
  const rematchRequester = useSelector(state => state.game.rematchRequester);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [loading, setLoading] = useState(true)
  const [winnerSet, setWinnerSet] = useState([])
  const [movePending, setMovePending] = useState(false)
  const [lastDroppedPos, setLastDroppedPos] = useState(null)
  const [hoveredCol, setHoveredCol] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const inviteClearedForGame = useRef(null)

  useEffect(() => {
    if (loading || !id || !game?._id || !game.p2?.username) return
    if (game.p2.username !== username) return
    if (inviteClearedForGame.current === id) return
    inviteClearedForGame.current = id
    dismissPendingGameInvite(id)
      .then((res) => dispatch(setUser(res.data.user)))
      .catch(() => {})
  }, [loading, id, game._id, game.p2?.username, username, dispatch])

  const updateTurn = async (body) => {
    setMovePending(true)
    await updateMove(id, body).finally(() => setMovePending(false))
  }

  useEffect(() => {
    if (winner === null) {
      setWinnerSet([])
    }
  }, [winner])

  // Animate the opponent's piece when their move arrives via socket
  useEffect(() => {
    const opponentMoves = username === game.p1.username ? game.p2_Moves : game.p1_Moves;
    if (opponentMoves.length > 0) {
      setLastDroppedPos(opponentMoves[opponentMoves.length - 1]);
    }
  }, [game.p1_Moves.length, game.p2_Moves.length])

  useEffect(() => {
    if (id) {
      getGame(id)
        .then(response => {
          dispatch(setGame(response.data.game))
          setLoading(false)
        })
    }
  }, [id])

  useEffect(() => {
    if (game.p1_Moves.length + game.p2_Moves.length === 42) {
      dispatch(setWinner("It's a Draw!"))
    } else {
      setWinnerSet([])
      dispatch(setWinner(null))
      check(game.p1_Moves, false, null, true)
      check(game.p2_Moves, false, null, true)
    }
  }, [game.p1LastMove])

  const TURN_DURATION = 30
  const isMyTurn = !!game.p2 && (
    (username === game.p1?.username && !game.p1LastMove) ||
    (username === game.p2?.username && game.p1LastMove)
  )

  useEffect(() => {
    if (!game.p2 || winner || loading) return
    setTimeLeft(TURN_DURATION)
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (isMyTurn && !movePending) {
            toast.warn("Time's up! You forfeited the round.")
            updateTurn({
              forfeit: true,
              username: username === game.p1.username ? game.p2.username : game.p1.username
            })
          }
          return TURN_DURATION
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [game.p1LastMove, winner, loading, !!game.p2])

  const rows = 6
  const columns = 7
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
  ]

  const next = () => {
    updateTurn({
      next: true,
      username: username === game.p1.username ? game.p2.username : game.p1.username
    })
    dispatch(nextGame())
    dispatch(setWinner(null))
    setWinnerSet([])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id)
    toast.success('Game ID copied!')
  }

  const getDownPos = (colIndex) => {
    let pos = "5" + colIndex;
    game.p1_Moves.map(pos1 => {
      if (pos1[1] === pos[1] && pos1[0] <= pos[0]) {
        pos = (+pos1[0] - 1).toString() + pos[1];
      }
    })
    game.p2_Moves.map(pos2 => {
      if (pos2[1] === pos[1] && pos2[0] <= pos[0]) {
        pos = (+pos2[0] - 1).toString() + pos[1];
      }
    })
    return (pos)
  }

  const handleClick = (colIndex) => {
    if (movePending) return;
    const pos = getDownPos(colIndex);
    if ((game.p1_Moves.indexOf(pos) === -1) && (game.p2_Moves.indexOf(pos) === -1)) {
      if (+pos[0] >= 0) {
        if (game.p1.username === username && !game.p1LastMove) {
          const list = game.p1_Moves
          list.push(pos)
          if (!check(list, true, pos, false)) {
            setLastDroppedPos(pos)
            dispatch(updateMoves("p1_Moves", [...game.p1_Moves, pos]))
            updateTurn({
              next: false,
              score: false,
              p1: true,
              value: pos,
              username: game.p2.username
            })
          }
        } else if (game.p2.username === username && game.p1LastMove) {
          const list = game.p2_Moves
          list.push(pos)
          if (!check(list, true, pos, false)) {
            setLastDroppedPos(pos)
            dispatch(updateMoves("p2_Moves", [...game.p2_Moves, pos]))
            updateTurn({
              next: false,
              score: false,
              p1: false,
              value: pos,
              username: game.p1.username
            })
          }
        }
      }
    }
  }

  const previewPos = (() => {
    if (hoveredCol === null || winner || !isMyTurn || movePending || !game.p2) return null;
    const pos = getDownPos(hoveredCol);
    return parseInt(pos[0]) >= 0 ? pos : null;
  })()

  const color = (pos) => {
    if (game.p1_Moves.indexOf(pos) != -1) {
      if (winnerSet.indexOf(pos) != -1)
        return "border-blue-500 bg-green-500"
      return "border-opacity-50 border-blue-700 bg-blue-500"
    } else if (game.p2_Moves.indexOf(pos) != -1) {
      if (winnerSet.indexOf(pos) != -1)
        return "border-red-500 bg-green-500"
      return "border-opacity-50 border-red-700 bg-red-500"
    } else if (pos === previewPos) {
      return username === game.p1.username
        ? "border-blue-500 bg-blue-400 opacity-40"
        : "border-red-500 bg-red-400 opacity-40"
    } else {
      return "border-opacity-20 border-white"
    }
  }

  const checkWinner = (i, j, list, update, pos, setWin) => {
    if (list.indexOf(i + "" + j) !== -1) {
      for (const [dx, dy] of directions) {
        let count = 1;
        let currentWinnerSet = [i + "" + j]
        for (let k = 1; k < 4; k++) {
          const newI = i + k * dx
          const newJ = j + k * dy
          if (newI < 0 || newI >= 6 || newJ < 0 || newJ >= 7 || list.indexOf(newI + "" + newJ) === -1) {
            break;
          }
          count++;
          currentWinnerSet.push(newI + "" + newJ)
          if (count === 4) {
            if (!game.p1LastMove) {
              if (setWin) {
                setWinnerSet(currentWinnerSet)
                dispatch(setWinner(game.p2.username + "\nis the Winner!"))
              }
              if (update) {
                if (username === game.p1.username) {
                  dispatch(updateMoves("p2_Moves", [...game.p2_Moves, pos]))
                } else {
                  dispatch(updateMoves("p1_Moves", [...game.p1_Moves, pos]))
                }
                updateTurn({
                  next: false,
                  score: true,
                  p1: false,
                  value: pos,
                  username: username === game.p1.username ? game.p2.username : game.p1.username
                })
              }
            } else {
              if (setWin) {
                setWinnerSet(currentWinnerSet)
                dispatch(setWinner(game.p1.username + "\nis the Winner!"))
              }
              if (update) {
                if (username === game.p1.username) {
                  dispatch(updateMoves("p2_Moves", [...game.p2_Moves, pos]))
                } else {
                  dispatch(updateMoves("p1_Moves", [...game.p1_Moves, pos]))
                }
                updateTurn({
                  next: false,
                  score: true,
                  p1: true,
                  value: pos,
                  username: username === game.p1.username ? game.p2.username : game.p1.username
                })
              }
            }
            return true;
          }
        }
      }
    }
  }

  const check = (list, update, pos, setWin) => {
    let res = false;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        res = res || checkWinner(i, j, list, update, pos, setWin)
      }
    }
    return res;
  }

  const { play, muted, toggleMute } = useGameSound()
  useEffect(() => {
    if (winner) {
      play()
    }
  }, [winner, play])

  return (
    <div className="relative border-[#646cff] border-[1px] rounded-xl pb-20 pt-2 mt-14 max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
      <div className="relative z-10 min-h-[3rem] mb-2">
        <button
          type="button"
          onClick={toggleMute}
          className="absolute left-2 top-2 z-20 text-[#646cff] p-2 rounded-lg hover:bg-[#646cff]/15 border border-transparent hover:border-[#646cff]/30"
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        >
          {muted ? <HiSpeakerXMark className="w-6 h-6" /> : <HiSpeakerWave className="w-6 h-6" />}
        </button>
        {!loading && username === game.p1.username && (
          <button
            type="button"
            onClick={copyToClipboard}
            className="absolute right-2 top-2 z-10 flex max-w-[calc(100%-4.5rem)] items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left text-xs text-[#646cff] hover:border-[#646cff]/40 hover:bg-[#646cff]/10 sm:top-2.5 sm:max-w-[min(100%,18rem)] sm:text-sm"
          >
            <span className="min-w-0 leading-snug">Copy ID for friend</span>
            <FaRegCopy className="h-5 w-5 shrink-0 fill-[#646cff]" />
          </button>
        )}
      </div>
      {loading
        ? <Loading className="pt-20 pb-12 flex justify-center" w="8" h="8" />
        : <>
          {!!winner && game.p2 && (
            <div className='flex justify-center gap-3 mb-5'>
              {rematchPending && rematchRequester !== username
                ? <>
                    <p className='text-sm text-gray-400 self-center'><span className='text-[#646cff] font-bold'>{rematchRequester}</span> wants a rematch!</p>
                    <button onClick={() => { dispatch(clearRematchPending()); next(); }}>Accept</button>
                    <button onClick={() => dispatch(clearRematchPending())} className='text-red-400'>Decline</button>
                  </>
                : <button
                    onClick={() => requestRematch(id)}
                    disabled={rematchPending}
                    className={rematchPending ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {rematchPending ? 'Rematch Requested...' : 'Rematch?'}
                  </button>
              }
            </div>
          )}
          {game.p2
            ? <>
              <div className="text-[#646cff] font-bold text-xl sm:text-2xl md:text-4xl mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 px-1">
                <FaCircle className='fill-blue-500 h-4 inline-block shrink-0' />
                <UserAvatar avatarId={game.p1?.avatar} sizePx={40} className='rounded-full' />
                <span>{game.p1.username}</span>
                <span className='text-gray-500'>—</span>
                <span>{game.p2.username}</span>
                <UserAvatar avatarId={game.p2?.avatar} sizePx={40} className='rounded-full' />
                <FaCircle className='fill-red-500 h-4 inline-block shrink-0' />
              </div>
              <div className="text-[#646cff] font-bold text-2xl md:text-4xl mb-6 sm:mb-8">
                {game.score.p1} - {game.score.p2}
              </div>
              <div className={boardOuter}>
                <div className={boardRow}>
                {[...Array(columns)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={boardCol}
                    onMouseEnter={() => setHoveredCol(colIndex)}
                    onMouseLeave={() => setHoveredCol(null)}
                    onClick={() => (winner || movePending) ? null : handleClick(colIndex)}
                  >
                    {[...Array(rows)].map((_, rowIndex) => {
                      const pos = rowIndex.toString() + colIndex.toString();
                      const isDropping = pos === lastDroppedPos;
                      return (
                        <div
                          key={rowIndex}
                          className={pieceClass(color(pos), winner || movePending ? '' : 'cursor-pointer')}
                          style={isDropping ? {
                            animation: `dropPiece ${0.12 + rowIndex * 0.055}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                          } : {}}
                        />
                      )
                    })}
                  </div>
                ))}
                </div>
              </div>
              {!winner && (
                <div className='mt-10 flex flex-col items-center gap-2'>
                  <div className='text-sm font-semibold text-gray-400'>
                    {isMyTurn ? "Your Turn" : "Opponent's Turn"}
                  </div>
                  <div className={`text-4xl font-mono font-bold transition-colors ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[#646cff]'}`}>
                    {timeLeft}s
                  </div>
                </div>
              )}
            </>
            : <div className="text-[#646cff] font-bold text-xl sm:text-3xl md:text-4xl mt-8 mb-8 px-2 text-center">Waiting for Player 2</div>
          }
          {game.p2 && (
            <GameChat
              username={username}
              opponentUsername={username === game.p1.username ? game.p2.username : game.p1.username}
            />
          )}
        </>
      }

      {winner && <Winner winner={winner} />}
    </div>
  )
}

export default OnlineGameBoard