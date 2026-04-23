import React, { useEffect, useState } from 'react'
import Winner from '../components/Winner'
import { useGameSound } from '../hooks/useGameSound'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { boardOuter, boardRow, boardCol, pieceClass } from '../game/boardLayout'

function LocalGame() {

  const [p1, setP1] = useState([])
  const [p2, setP2] = useState([])
  const [winner, setWinner] = useState()
  const [winnerSet, setWinnerSet] = useState([])
  const [lastDroppedPos, setLastDroppedPos] = useState(null)
  const [hoveredCol, setHoveredCol] = useState(null)

  const rows = 6
  const columns = 7
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
  ]

  const getDownPos = (colIndex) => {
    let pos = "5" + colIndex;
    p1.map(pos1 => {
      if (pos1[1] === pos[1] && pos1[0] <= pos[0]) {
        pos = (+pos1[0] - 1).toString() + pos[1];
      }
    })
    p2.map(pos2 => {
      if (pos2[1] === pos[1] && pos2[0] <= pos[0]) {
        pos = (+pos2[0] - 1).toString() + pos[1];
      }
    })
    return (pos)
  }

  const handleClick = (colIndex) => {
    const pos = getDownPos(colIndex);
    if ((p1.indexOf(pos) === -1) && (p2.indexOf(pos) === -1)) {
      if (+pos[0] >= 0) {
        setLastDroppedPos(pos);
        if (p1.length === p2.length) {
          setP1((prevP1) => [...prevP1, pos]);
        } else {
          setP2((prevP2) => [...prevP2, pos]);
        }
      }
    }
  }

  const previewPos = (() => {
    if (hoveredCol === null || winner) return null;
    const pos = getDownPos(hoveredCol);
    return parseInt(pos[0]) >= 0 ? pos : null;
  })()

  const color = (pos) => {
    if (p1.indexOf(pos) != -1) {
      if (winnerSet.indexOf(pos) != -1)
        return "border-blue-500 bg-green-500"
      return "border-opacity-50 border-blue-700 bg-blue-500"
    } else if (p2.indexOf(pos) != -1) {
      if (winnerSet.indexOf(pos) != -1)
        return "border-red-500 bg-green-500"
      return "border-opacity-50 border-red-700 bg-red-500"
    } else if (pos === previewPos) {
      return p1.length === p2.length
        ? "border-blue-500 bg-blue-400 opacity-40"
        : "border-red-500 bg-red-400 opacity-40"
    } else {
      return "border-opacity-20 border-white"
    }
  }

  const reset = () => {
    setP1([])
    setP2([])
    setWinner(null)
    setWinnerSet([])
    setLastDroppedPos(null)
  }

  const checkWinner = (i, j, list) => {
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
            setWinnerSet(currentWinnerSet)
            if (p1.length === p2.length) {
              setWinner("Player 2\nis the Winner!")
            } else {
              setWinner("Player 1\nis the Winner!")
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (p1.length + p2.length === 42) {
      setWinner("It's a Draw!")
    } else {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
          checkWinner(i, j, p1)
          checkWinner(i, j, p2)
        }
      }
    }
  }, [p1, p2])

  const { play, muted, toggleMute } = useGameSound()
  useEffect(() => {
    if (winner) {
      play()
    }
  }, [winner, play])

  return (
    <div className='relative border-[#646cff] border-[1px] rounded-xl pb-16 mt-14 max-w-4xl mx-auto px-2 sm:px-6 lg:px-10'>
      <button
        type="button"
        onClick={toggleMute}
        className="absolute left-2 top-2 z-20 text-[#646cff] p-2 rounded-lg hover:bg-[#646cff]/15 border border-transparent hover:border-[#646cff]/30"
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      >
        {muted ? <HiSpeakerXMark className="w-6 h-6" /> : <HiSpeakerWave className="w-6 h-6" />}
      </button>
      <button className='mb-8 mt-12 ms-auto block' onClick={reset}>Reset</button>
      <div className={boardOuter}>
        <div className={boardRow}>
        {[...Array(columns)].map((_, colIndex) => (
          <div
            key={colIndex}
            className={boardCol}
            onMouseEnter={() => setHoveredCol(colIndex)}
            onMouseLeave={() => setHoveredCol(null)}
            onClick={() => winner ? null : handleClick(colIndex)}
          >
            {[...Array(rows)].map((_, rowIndex) => {
              const pos = rowIndex.toString() + colIndex.toString();
              const isDropping = pos === lastDroppedPos;
              return (
                <div
                  key={rowIndex}
                  className={pieceClass(color(pos), winner ? '' : 'cursor-pointer')}
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
      {winner && <Winner winner={winner} />}
    </div>
  )
}

export default LocalGame