import { LuHome, LuBot } from 'react-icons/lu'
import { MiniBoard } from '../components/game/Board'
import { Button, Page } from '../ui'

export default function NotFound() {
  return (
    <Page size="sm" className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
      <MiniBoard p1Moves={['54', '44', '34']} p2Moves={['53', '52', '43']} className="mb-8 w-40 rotate-6" />
      <p className="font-display text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold">This column is full</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button to="/" icon={LuHome}>Back home</Button>
        <Button to="/ai" variant="secondary" icon={LuBot}>Play vs CPU</Button>
      </div>
    </Page>
  )
}
