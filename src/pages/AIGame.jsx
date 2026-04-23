import React, { useEffect, useState } from 'react'
import Winner from '../components/Winner'
import { useGameSound } from '../hooks/useGameSound'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import { getBestMove } from '../utils/aiEngine'
import { boardOuter, boardRow, boardCol, pieceClass } from '../game/boardLayout'

const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   color: 'text-green-400'  },
  { id: 'medium', label: 'Medium', color: 'text-yellow-400' },
  { id: 'hard',   label: 'Hard',   color: 'text-red-400'    },
]

const rows = 6
const columns = 7
const directions = [[1, 0], [0, 1], [1, 1], [-1, 1]]

function AIGame() {
  const [p1, setP1] = useState([])
  const [p2, setP2] = useState([])
  const [winner, setWinner] = useState(null)
  const [winnerSet, setWinnerSet] = useState([])
  const [difficulty, setDifficulty] = useState('medium')
  const [cpuThinking, setCpuThinking] = useState(false)
  const [lastDroppedPos, setLastDroppedPos] = useState(null)
  const [hoveredCol, setHoveredCol] = useState(null)

  const isPlayerTurn = p1.length === p2.length

  const getDownPos = (colIndex, currentP1, currentP2) => {
    const usedP1 = currentP1 ?? p1
    const usedP2 = currentP2 ?? p2
    let pos = '5' + colIndex
    usedP1.forEach(pos1 => {
      if (pos1[1] === pos[1] && pos1[0] <= pos[0]) pos = (+pos1[0] - 1).toString() + pos[1]
    })
    usedP2.forEach(pos2 => {
      if (pos2[1] === pos[1] && pos2[0] <= pos[0]) pos = (+pos2[0] - 1).toString() + pos[1]
    })
    return pos
  }

  const findWinSet = (list) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (list.indexOf(i + '' + j) !== -1) {
          for (const [dx, dy] of directions) {
            let count = 1
            const currentSet = [i + '' + j]
            for (let k = 1; k < 4; k++) {
              const ni = i + k * dx, nj = j + k * dy
              if (ni < 0 || ni >= rows || nj < 0 || nj >= columns || list.indexOf(ni + '' + nj) === -1) break
              count++
              currentSet.push(ni + '' + nj)
              if (count === 4) return currentSet
            }
          }
        }
      }
    }
    return null
  }

  const handleClick = (colIndex) => {
    if (winner || cpuThinking || !isPlayerTurn) return
    const pos = getDownPos(colIndex)
    if (+pos[0] < 0) return

    const newP1 = [...p1, pos]
    setLastDroppedPos(pos)
    setP1(newP1)

    const winSet = findWinSet(newP1)
    if (winSet) { setWinnerSet(winSet); setWinner('You Win!'); return }
    if (newP1.length + p2.length === 42) { setWinner("It's a Draw!"); return }

    setCpuThinking(true)
    setTimeout(() => {
      const aiCol = getBestMove(newP1, p2, difficulty)
      const aiPos = getDownPos(aiCol, newP1, p2)
      const newP2 = [...p2, aiPos]
      setLastDroppedPos(aiPos)
      setP2(newP2)
      setCpuThinking(false)

      const aiWinSet = findWinSet(newP2)
      if (aiWinSet) { setWinnerSet(aiWinSet); setWinner('CPU Wins!'); return }
      if (newP1.length + newP2.length === 42) setWinner("It's a Draw!")
    }, 500)
  }

  const previewPos = (() => {
    if (hoveredCol === null || winner || !isPlayerTurn || cpuThinking) return null
    const pos = getDownPos(hoveredCol)
    return parseInt(pos[0]) >= 0 ? pos : null
  })()

  const color = (pos) => {
    if (p1.indexOf(pos) !== -1) {
      if (winnerSet.indexOf(pos) !== -1) return 'border-blue-500 bg-green-500'
      return 'border-opacity-50 border-blue-700 bg-blue-500'
    }
    if (p2.indexOf(pos) !== -1) {
      if (winnerSet.indexOf(pos) !== -1) return 'border-red-500 bg-green-500'
      return 'border-opacity-50 border-red-700 bg-red-500'
    }
    if (pos === previewPos) return 'border-blue-500 bg-blue-400 opacity-40'
    return 'border-opacity-20 border-white'
  }

  const reset = () => {
    setP1([]); setP2([]); setWinner(null); setWinnerSet([])
    setLastDroppedPos(null); setCpuThinking(false)
  }

  const changeDifficulty = (id) => {
    setDifficulty(id)
    reset()
  }

  const { play, muted, toggleMute } = useGameSound()
  useEffect(() => { if (winner) play() }, [winner, play])

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

      {/* Difficulty selector */}
      <div className='flex justify-center gap-3 mt-12 mb-2 flex-wrap'>
        {DIFFICULTIES.map(d => (
          <button
            key={d.id}
            onClick={() => changeDifficulty(d.id)}
            className={`${d.color} ${difficulty === d.id ? 'border-[#646cff]' : 'border-transparent opacity-50'}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <button className='mb-6 mt-2' onClick={reset}>Reset</button>

      {/* Status line */}
      <div className='text-lg font-semibold text-[#646cff] mb-4 h-7'>
        {!winner && (cpuThinking ? 'CPU is thinking...' : 'Your Turn')}
      </div>

      {/* Legend */}
      <div className='flex justify-center gap-6 mb-6 text-sm font-semibold'>
        <span className='flex items-center gap-2'><span className='inline-block w-4 h-4 rounded-full bg-blue-500'/>You</span>
        <span className='flex items-center gap-2'><span className='inline-block w-4 h-4 rounded-full bg-red-500'/>CPU</span>
      </div>

      {/* Board */}
      <div className={boardOuter}>
        <div className={boardRow}>
        {[...Array(columns)].map((_, colIndex) => (
          <div
            key={colIndex}
            className={boardCol}
            onMouseEnter={() => setHoveredCol(colIndex)}
            onMouseLeave={() => setHoveredCol(null)}
            onClick={() => handleClick(colIndex)}
          >
            {[...Array(rows)].map((_, rowIndex) => {
              const pos = rowIndex.toString() + colIndex.toString()
              const isDropping = pos === lastDroppedPos
              return (
                <div
                  key={rowIndex}
                  className={pieceClass(
                    color(pos),
                    winner || cpuThinking || !isPlayerTurn ? '' : 'cursor-pointer'
                  )}
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

export default AIGame
