import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardPaste, Users, Swords } from 'lucide-react'
import { errorMessage, gamesApi } from '@/lib/api'
import { Alert, Button, Card, Input, Page, PageHeader } from '@/ui'

// Accepts a bare game code or a full invite link.
const extractId = (text) => {
  const m = String(text).trim().match(/[a-f0-9]{24}/i)
  return m ? m[0] : String(text).trim()
}

export default function OnlineMenu() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)

  const create = async () => {
    setError(null)
    setCreating(true)
    try {
      const { data } = await gamesApi.create()
      navigate(`/online/${data.game._id}`)
    } catch (e) {
      setError(errorMessage(e))
      setCreating(false)
    }
  }

  const join = async (e) => {
    e.preventDefault()
    const id = extractId(code)
    if (!id) return setError('Paste the link or code your friend sent you.')
    setError(null)
    setJoining(true)
    try {
      await gamesApi.join(id)
      navigate(`/online/${id}`)
    } catch (err) {
      setError(errorMessage(err))
      setJoining(false)
    }
  }

  const paste = async () => {
    try {
      setCode(await navigator.clipboard.readText())
    } catch {
      setError('This browser blocked pasting. Paste into the box with your keyboard instead.')
    }
  }

  return (
    <Page size="md">
      <PageHeader title="Play a friend" subtitle="Start a game and send the link, or open one a friend sent you." />
      {error && <Alert className="mb-5">{error}</Alert>}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <h2 className="text-xl font-extrabold">Start a game</h2>
          <p className="mt-1.5 text-muted-foreground">You play red and move first. Each turn has 30 seconds, and you can play as many rounds as you like.</p>
          <Button onClick={create} loading={creating} size="lg" className="mt-6 self-start">Start a game</Button>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-extrabold">Join a game</h2>
          <p className="mt-1.5 text-muted-foreground">Paste the link or code your friend sent you.</p>
          <form onSubmit={join} className="mt-5 space-y-3">
            <Input
              aria-label="Game link or code"
              placeholder="Link or code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              trailing={<Button size="sm" variant="ghost" icon={ClipboardPaste} onClick={paste}>Paste</Button>}
            />
            <Button type="submit" size="lg" variant="board" loading={joining}>Join game</Button>
          </form>
        </Card>
      </div>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-bold">
        <Button to="/friends" variant="ghost" icon={Users}>Invite someone from your friends</Button>
        <Button to="/tournament" variant="ghost" icon={Swords}>Host a four-player tournament</Button>
      </div>
    </Page>
  )
}
