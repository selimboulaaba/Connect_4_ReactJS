import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuPlus, LuLogIn, LuClipboard, LuUsers, LuSwords } from 'react-icons/lu'
import { errorMessage, gamesApi } from '../lib/api'
import { Alert, Button, Card, CardHeader, Input, Page, PageHeader } from '../ui'

// Accepts a raw game code or a full invite link.
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
    if (!id) return setError('Paste a game code or invite link.')
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
      setError("Couldn't read the clipboard. Paste the code manually.")
    }
  }

  return (
    <Page size="md">
      <PageHeader eyebrow="Online" title="Play a friend" subtitle="Start a new game and share the link, or join a game someone sent you." />
      {error && <Alert className="mb-4">{error}</Alert>}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader icon={LuPlus} title="New game" subtitle="You’ll play Red and move first." />
          <p className="mb-5 text-sm text-muted">
            We’ll create a private game with a shareable link. Rounds have a 30-second turn timer and you can play as many as you like.
          </p>
          <Button onClick={create} loading={creating} size="lg" className="mt-auto" block>Create game</Button>
        </Card>
        <Card className="flex flex-col">
          <CardHeader icon={LuLogIn} title="Join a game" subtitle="Paste a code or link from a friend." />
          <form onSubmit={join} className="mt-auto space-y-3">
            <Input
              aria-label="Game code or link"
              placeholder="Game code or invite link"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              trailing={<Button size="sm" variant="ghost" icon={LuClipboard} onClick={paste}>Paste</Button>}
            />
            <Button type="submit" size="lg" variant="secondary" loading={joining} block>Join game</Button>
          </form>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Button to="/friends" variant="secondary" icon={LuUsers}>Invite a friend directly</Button>
        <Button to="/tournament" variant="secondary" icon={LuSwords}>Host a tournament</Button>
      </div>
    </Page>
  )
}
