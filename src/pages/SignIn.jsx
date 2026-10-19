import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { LuUser, LuLock } from 'react-icons/lu'
import { AuthLayout } from '../components/AuthLayout'
import { errorMessage, usersApi } from '../lib/api'
import { signedIn } from '../store/userSlice'
import { Alert, Button, Input } from '../ui'

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
      title="Welcome back"
      subtitle="Sign in to play online, add friends and earn XP."
      footer={<>New here? <Link to="/signup" state={{ from }} className="font-semibold text-primary hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Username" icon={LuUser} autoComplete="username" autoFocus value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <Input label="Password" icon={LuLock} type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" size="lg" block loading={loading}>Sign in</Button>
      </form>
    </AuthLayout>
  )
}
