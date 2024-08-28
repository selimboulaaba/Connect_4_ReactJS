import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Winner from '../components/Winner'
import { getGame, updateMove } from '../services/game.service';
import { FaRegCopy } from "react-icons/fa";
import Loading from '../components/Loading'
import { setGame, nextGame, updateMoves, updateWinner, setWinner } from '../store/actions/gameActions';
import { FaCircle } from "react-icons/fa";

function OnlineGameBoard() {

  const username = useSelector(state => state.user.user.username);
  const game = useSelector(state => state.game.game);
  const winner = useSelector(state => state.game.winner);
  const dispatch = useDispatch();

  const { id } = useParams();
  const [loading, setLoading] = useState(true)

  const updateTurn = async (body) => {
    await updateMove(id, body)
  }

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
      dispatch(setWinner(null))
      check(game.p1_Moves, false, null, true)
      check(game.p2_Moves, false, null, true)
    }
  }, [game.p1LastMove])

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
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(id)
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
    const pos = getDownPos(colIndex);
    if ((game.p1_Moves.indexOf(pos) === -1) && (game.p2_Moves.indexOf(pos) === -1)) {
      if (+pos[0] >= 0) {
        if (game.p1.username === username && !game.p1LastMove) {
          const list = game.p1_Moves
          list.push(pos)
          if (!check(list, true, pos, false)) {
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

  const color = (pos) => {
    if (game.p1_Moves.indexOf(pos) != -1) {
      return "border-opacity-50 border-blue-700 bg-blue-500"
    } else if (game.p2_Moves.indexOf(pos) != -1) {
      return "border-opacity-50 border-red-700 bg-red-500"
    } else {
      return "border-opacity-20 border-white"
    }
  }

  const checkWinner = (i, j, list, update, pos, setWin) => {
    if (list.indexOf(i + "" + j) !== -1) {
      for (const [dx, dy] of directions) {
        let count = 1;
        for (let k = 1; k < 4; k++) {
          const newI = i + k * dx
          const newJ = j + k * dy
          if (newI < 0 || newI >= 6 || newJ < 0 || newJ >= 7 || list.indexOf(newI + "" + newJ) === -1) {
            break;
          }
          count++;
          if (count === 4) {
            if (!game.p1LastMove) {
              if (setWin)
                dispatch(setWinner(game.p2.username + " is the Winner!"))
              if (update) {
                dispatch(updateWinner("p2_Moves", [...game.p2_Moves, pos], "p2"))
                updateTurn({
                  next: false,
                  score: true,
                  p1: false,
                  value: pos,
                  username: username === game.p1.username ? game.p2.username : game.p1.username
                })
              }
            } else {
              if (setWin)
                dispatch(setWinner(game.p1.username + " is the Winner!"))
              if (update) {
                dispatch(updateWinner("p1_Moves", [...game.p1_Moves, pos], "p1"))
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

  return (
    <div className="border-[#646cff] border-[1px] rounded-xl pb-20 pt-4 lg:px-20 mt-14">
      {loading
        ? <Loading className="pt-28 pb-12 px-[45%]" w="8" h="8" />
        : <>
          {username === game.p1.username && <div onClick={copyToClipboard} className='flex text-sm sm:text-md items-center ms-auto justify-end cursor-pointer border-b-2 w-fit hover:rounded-lg border-transparent hover:border-[#646cff] text-[#646cff] p-3'>Copy this and send to your Friend <FaRegCopy className='ms-3 w-6 h-6 fill-[#646cff]' /></div>}
          {game.p2
            ? <>
              <div className="text-[#646cff] font-bold text-5xl mt-14 mb-10">
                <FaCircle className='fill-blue-500 h-4 inline-block' />
                {game.p1.username} {game.score.p1} - {game.score.p2} {game.p2.username}
                <FaCircle className='fill-red-500 h-4 inline-block' />
              </div>
              {!!winner && username === game.p1.username && <button className='mb-5' onClick={next}>Next</button>}
              {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className='flex justify-center items-center px-3'>
                  {[...Array(columns)].map((_, colIndex) => (
                    <div
                      key={rowIndex * columns + colIndex}
                      className={color(rowIndex.toString() + colIndex.toString()) + ` w-[20vw] sm:w-[10vw] md:w-16 lg:w-20 aspect-square m-[2px] sm:m-[3px] md:m-[5px] rounded-full border-4 ${winner ? '' : 'cursor-pointer'}`}
                      onClick={() => winner ? null : handleClick(colIndex)}
                    >
                    </div>
                  ))}
                </div>
              ))}
              {!winner && <div>Your {
                (username === game.p1.username && !game.p1LastMove)
                  ||
                  (username === game.p2.username && game.p1LastMove)
                  ? "" : "Opponent's"} Turn</div>}
            </>
            : <div className="text-[#646cff] font-bold text-3xl md:text-5xl mt-14 mb-10">Waiting for Player 2</div>
          }
        </>
      }

      {winner && <Winner winner={winner} />}
    </div>
  )
}

export default OnlineGameBoard