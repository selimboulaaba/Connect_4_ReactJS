import { Button, Page } from '@/ui'
import { MiniBoard } from '@/components/game/Board'

// A full column: the joke is the illustration.
const FULL_COL = ['53', '33', '13']
const FULL_COL_2 = ['43', '23', '03']

export default function NotFound() {
  return (
    <Page size="md" className="flex min-h-[70dvh] flex-col items-start justify-center">
      <MiniBoard p1Moves={FULL_COL} p2Moves={FULL_COL_2} className="mb-8 w-44" />
      <h1 className="font-display text-display-lg">This column is full</h1>
      <p className="mt-3 max-w-[44ch] text-lg text-muted-foreground">There’s no page at this address. It may have moved, or the link has a typo.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/">Go to the home page</Button>
        <Button to="/ai" variant="secondary">Play the computer</Button>
      </div>
    </Page>
  )
}
