import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { LuLightbulb, LuPuzzle, LuCheckCircle } from 'react-icons/lu'
import { Board } from '../components/game/Board'
import { errorMessage, puzzlesApi } from '../lib/api'
import { evaluate, landingPos } from '../game/logic'
import { playChime, playDrop, playWin } from '../lib/sound'
import { Alert, Badge, Button, Card, EmptyState, Page, PageHeader, PageSpinner, toast } from '../ui'

export default function DailyChallenge() {
  const signedIn = useSelector((s) => !!s.user.token)
  const [puzzle, setPuzzle] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(null) // pos tried, shown on the board
  const [solved, setSolved] = useState(null) // winning pos once solved
  const [showHint, setShowHint] = useState(false)
  const [tries, setTries] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    puzzlesApi.today()
      .then((r) => {
        setPuzzle(r.data)
        if (r.data.alreadySolved && r.data.solution) setSolved(r.data.solution)
      })
      .catch((e) => setError(errorMessage(e)))
  }, [])

  const p1 = useMemo(() => {
    if (!puzzle) return []
    const extra = solved || attempt
    return extra ? [...puzzle.p1_Moves, extra] : puzzle.p1_Moves
  }, [puzzle, solved, attempt])
  const winLine = solved && puzzle ? evaluate(p1, puzzle.p2_Moves).line : null

  const tryColumn = async (col) => {
    if (!puzzle || solved || submitting) return
    const p = landingPos(puzzle.p1_Moves, puzzle.p2_Moves, col)
    if (!p) return
    setAttempt(p)
    playDrop()
    const wins = evaluate([...puzzle.p1_Moves, p], puzzle.p2_Moves).winner === 'p1'

    if (!signedIn) {
      // Guests can practise; the answer is checked locally.
      setTimeout(() => {
        if (wins) {
          setSolved(p)
          playWin()
        } else {
          setTries((t) => t + 1)
          playChime(false)
          setTimeout(() => setAttempt(null), 600)
        }
      }, 250)
      return
    }

    setSubmitting(true)
    try {
      const { data } = await puzzlesApi.solve(p)
      if (data.correct) {
        setSolved(p)
        playWin()
        toast.success(`+${data.xpAwarded} XP earned`, { title: 'Puzzle solved!' })
      } else {
        setTries((t) => t + 1)
        playChime(false)
        setTimeout(() => setAttempt(null), 600)
      }
    } catch (e) {
      toast.error(errorMessage(e))
      setAttempt(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (error) return <Page size="sm"><EmptyState icon={LuPuzzle} title="Couldn't load today's puzzle">{error}</EmptyState></Page>
  if (!puzzle) return <PageSpinner />

  const dateLabel = new Date(`${puzzle.date}T12:00:00Z`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Page size="md">
      <PageHeader
        eyebrow={dateLabel}
        title="Daily puzzle"
        subtitle="You're Red and it's your move. Find the one drop that connects four."
        actions={<Badge tone="warning" className="text-sm">+{puzzle.xpReward} XP</Badge>}
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="relative">
          <Board
            p1Moves={p1}
            p2Moves={puzzle.p2_Moves}
            lastMove={attempt || solved}
            winLine={winLine}
            interactive={!solved && !submitting && !attempt}
            previewPlayer="p1"
            onPlay={tryColumn}
            label="Puzzle board: choose the winning column"
          />
        </div>
        <div className="space-y-4">
          {solved ? (
            <Card className="border-success/40 bg-success/5">
              <LuCheckCircle className="mb-2 size-7 text-success" aria-hidden />
              <h2 className="text-lg font-semibold">Solved!</h2>
              <p className="mt-1 text-sm text-muted">
                {signedIn ? 'Come back tomorrow for a new puzzle.' : 'Nice! Create an account to earn XP for every puzzle you solve.'}
              </p>
              {!signedIn && <Button to="/signup" className="mt-4" block>Create account</Button>}
              {signedIn && <Button to="/ai" variant="secondary" className="mt-4" block>Keep practising vs CPU</Button>}
            </Card>
          ) : (
            <Card>
              <h2 className="font-semibold">How it works</h2>
              <p className="mt-1 text-sm text-muted">Tap a column to drop your disc. {signedIn ? 'Solve it to earn XP.' : 'Sign in to earn XP for solving it.'}</p>
              {tries > 0 && <Alert tone="info" className="mt-3">Not quite. That doesn&apos;t connect four. Try again!</Alert>}
              {showHint ? (
                <p className="mt-4 rounded-xl bg-warning/10 p-3 text-sm text-warning">💡 {puzzle.hint}</p>
              ) : (
                <Button variant="secondary" icon={LuLightbulb} className="mt-4" block onClick={() => setShowHint(true)}>Show hint</Button>
              )}
            </Card>
          )}
          <p className="text-center text-xs text-subtle">
            {puzzle.solvedCount ? `${puzzle.solvedCount} player${puzzle.solvedCount > 1 ? 's' : ''} solved it today` : 'Be the first to solve today’s puzzle'}
          </p>
        </div>
      </div>
    </Page>
  )
}
