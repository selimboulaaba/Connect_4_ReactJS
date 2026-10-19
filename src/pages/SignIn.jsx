import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AuthLayout } from '@/components/AuthLayout'
import { errorMessage, usersApi } from '@/lib/api'
import { signedIn } from '@/store/userSlice'
import { Alert, Button, Input } from '@/ui'

export default function SignIn() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'

  const submit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) return setError('Enter your username and password.')
    setError(null)
    setLoading(true)
    try {
      const { data } = await usersApi.signin({ username: form.username.trim(), password: form.password })
      dispatch(signedIn(data))
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Pick up where you left off."
      footer={<>No account yet? <Link to="/signup" state={{ from }} className="font-extrabold text-foreground underline decoration-board decoration-[3px] underline-offset-4">Create one</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Username" autoComplete="username" autoFocus value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <Input label="Password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" size="lg" block loading={loading} className="!mt-6">Sign in</Button>
      </form>
    </AuthLayout>
  )
}
