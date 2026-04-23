import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getTodayPuzzle, solvePuzzle } from '../services/game.service'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { boardOuter, boardRow, boardCol, pieceClass } from '../game/boardLayout'

const rows = 6
const columns = 7

/** Build cell occupancy from alternating move lists (p1 moves first). */
function buildOccupancy(p1_Moves, p2_Moves) {
  const p1 = new Set()
  const p2 = new Set()
  for (let i = 0; i < p1_Moves.length; i++) {
    p1.add(p1_Moves[i])
    if (i < p2_Moves.length) p2.add(p2_Moves[i])
  }
  return { p1, p2 }
}

function getDownPos(colIndex, p1_Moves, p2_Moves) {
  let pos = '5' + colIndex
  p1_Moves.forEach((pos1) => {
    if (pos1[1] === pos[1] && pos1[0] <= pos[0]) pos = (+pos1[0] - 1).toString() + pos[1]
  })
  p2_Moves.forEach((pos2) => {
    if (pos2[1] === pos[1] && pos2[0] <= pos[0]) pos = (+pos2[0] - 1).toString() + pos[1]
  })
  return pos
}

function DailyChallenge() {
  const signedIn = useSelector((s) => s.user.signedIn)
  const [loading, setLoading] = useState(true)
  const [puzzle, setPuzzle] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTodayPuzzle()
      .then((res) => setPuzzle(res.data))
      .catch(() => toast.error('Could not load puzzle'))
      .finally(() => setLoading(false))
  }, [])

  const tryColumn = async (colIndex) => {
    if (!signedIn) {
      toast.info('Sign in to submit your answer and earn XP.')
      return
    }
    if (!puzzle || puzzle.alreadySolved || submitting) return
    const pos = getDownPos(colIndex, puzzle.p1_Moves, puzzle.p2_Moves)
    if (+pos[0] < 0) {
      toast.warn('Column is full.')
      return
    }
    setSubmitting(true)
    try {
      const res = await solvePuzzle(pos)
      if (res.data.correct) {
        toast.success(`Correct! +${res.data.xpAwarded} XP`)
        setPuzzle((p) => ({ ...p, alreadySolved: true }))
      } else {
        toast.error('Not the winning move — try another column.')
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const color = (pos) => {
    if (!puzzle) return 'border-opacity-20 border-white'
    const { p1, p2 } = buildOccupancy(puzzle.p1_Moves, puzzle.p2_Moves)
    if (p1.has(pos)) return 'border-opacity-50 border-blue-700 bg-blue-500'
    if (p2.has(pos)) return 'border-opacity-50 border-red-700 bg-red-500'
    return 'border-opacity-20 border-white'
  }

  if (loading || !puzzle) {
    return <Loading className='mt-24' w='8' h='8' />
  }

  return (
    <div className='mx-auto grid max-w-4xl gap-6 mb-6 mt-12 border border-[#646cff] rounded-xl py-10 px-4 sm:px-8'>
      <h1 className='font-bold text-[#646cff] underline text-3xl sm:text-5xl'>Daily puzzle</h1>
      <p className='text-gray-400 text-sm max-w-xl'>
        Blue moves first. Find the winning move for blue. Tap a column to submit (you must be signed in to earn XP).
      </p>
      {puzzle.alreadySolved ? (
        <p className='text-green-400 font-semibold'>Completed today ✓</p>
      ) : (
        <p className='text-yellow-200/80 text-sm'>Reward: {puzzle.xpReward} XP</p>
      )}
      <div className={boardOuter}>
        <div className={boardRow}>
        {[...Array(columns)].map((_, colIndex) => (
          <div
            key={colIndex}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && tryColumn(colIndex)}
            className={`${boardCol} ${puzzle.alreadySolved ? '' : 'cursor-pointer'}`}
            onClick={() => !puzzle.alreadySolved && tryColumn(colIndex)}
          >
            {[...Array(rows)].map((_, rowIndex) => {
              const pos = rowIndex.toString() + colIndex.toString()
              return (
                <div
                  key={rowIndex}
                  className={pieceClass(color(pos), '')}
                />
              )
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default DailyChallenge
