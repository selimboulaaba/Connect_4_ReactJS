import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Lightbulb } from 'lucide-react'
import { Board } from '@/components/game/Board'
import { errorMessage, puzzlesApi } from '@/lib/api'
import { evaluate, landingPos } from '@/game/logic'
import { playChime, playDrop, playWin } from '@/lib/sound'
import { Alert, Badge, Button, Card, EmptyState, Page, PageHeader, PageSpinner, toast } from '@/ui'

export default function DailyChallenge() {
  const signedIn = useSelector((s) => !!s.user.token)
  const [puzzle, setPuzzle] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [solved, setSolved] = useState(null)
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

  const miss = () => {
    setTries((t) => t + 1)
    playChime(false)
    setTimeout(() => setAttempt(null), 650)
  }

  const tryColumn = async (col) => {
    if (!puzzle || solved || submitting) return
    const p = landingPos(puzzle.p1_Moves, puzzle.p2_Moves, col)
    if (!p) return
    setAttempt(p)
    playDrop()
    const wins = evaluate([...puzzle.p1_Moves, p], puzzle.p2_Moves).winner === 'p1'

    if (!signedIn) {
      // Without an account the answer is checked here, and no XP is awarded.
      setTimeout(() => (wins ? (setSolved(p), playWin()) : miss()), 250)
      return
    }
    setSubmitting(true)
    try {
      const { data } = await puzzlesApi.solve(p)
      if (data.correct) {
        setSolved(p)
        playWin()
        toast.success(`You earned ${data.xpAwarded} XP.`, { title: 'Puzzle solved' })
      } else {
        miss()
      }
    } catch (e) {
      toast.error(errorMessage(e))
      setAttempt(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (error) return <Page size="md"><EmptyState title="Today’s puzzle didn’t load">{error}</EmptyState></Page>
  if (!puzzle) return <PageSpinner />

  const dateLabel = new Date(`${puzzle.date}T12:00:00Z`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Page>
      <PageHeader title="Daily puzzle" subtitle={`${dateLabel}. You’re red and it’s your move. One drop wins the game: find it.`} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,34rem)_1fr] lg:items-start">
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
        <div className="max-w-md space-y-5">
          {solved ? (
            <Card>
              <h2 className="font-display text-display-sm">Solved</h2>
              <p className="mt-2 text-muted-foreground">
                {signedIn ? 'A new puzzle appears at midnight UTC.' : 'Create an account and solved puzzles earn you 50 XP each.'}
              </p>
              <div className="mt-5">
                {signedIn ? <Button to="/ai" variant="secondary">Practise against the computer</Button> : <Button to="/signup">Create an account</Button>}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold">Your move</h2>
                <Badge tone="yellow">+{puzzle.xpReward} XP</Badge>
              </div>
              <p className="mt-2 text-muted-foreground">
                Tap a column to drop a disc. {signedIn ? 'Wrong guesses cost nothing.' : 'Sign in if you want the XP.'}
              </p>
              {tries > 0 && <Alert tone="info" className="mt-4">That drop doesn’t connect four. Try another column.</Alert>}
              {showHint ? (
                <p className="mt-4 rounded-btn border-2 border-ink bg-yellow/40 px-4 py-3 font-medium">{puzzle.hint}</p>
              ) : (
                <Button variant="secondary" icon={Lightbulb} className="mt-5" onClick={() => setShowHint(true)}>Show a hint</Button>
              )}
            </Card>
          )}
          <p className="text-sm text-muted-foreground">
            {puzzle.solvedCount
              ? `${puzzle.solvedCount} ${puzzle.solvedCount === 1 ? 'player has' : 'players have'} solved it today.`
              : 'Nobody has solved today’s puzzle yet.'}
          </p>
        </div>
      </div>
    </Page>
  )
}
