import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AuthLayout } from '@/components/AuthLayout'
import { errorMessage, usersApi } from '@/lib/api'
import { signedIn } from '@/store/userSlice'
import { Alert, Button, Input } from '@/ui'

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,20}$/

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'

  const errors = {
    username: !USERNAME_RE.test(form.username.trim()) ? 'Use 3 to 20 letters, numbers, dots, dashes or underscores.' : null,
    password: form.password.length < 6 ? 'Use at least 6 characters.' : null,
    confirm: form.confirm !== form.password ? 'The two passwords are different.' : null,
  }
  const show = (k) => (touched[k] || touched.submit) && errors[k]
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }))

  const submit = async (e) => {
    e.preventDefault()
    setTouched({ submit: true })
    if (errors.username || errors.password || errors.confirm) return
    setError(null)
    setLoading(true)
    try {
      const { data } = await usersApi.signup({ username: form.username.trim(), password: form.password })
      dispatch(signedIn(data))
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Free. Your friends will find you by your username."
      footer={<>Already have one? <Link to="/signin" state={{ from }} className="font-extrabold text-foreground underline decoration-board decoration-[3px] underline-offset-4">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && <Alert>{error}</Alert>}
        <Input label="Username" autoComplete="username" autoFocus value={form.username} onChange={set('username')} onBlur={blur('username')} error={show('username')} hint="3 to 20 characters" />
        <Input label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} onBlur={blur('password')} error={show('password')} />
        <Input label="Repeat password" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} onBlur={blur('confirm')} error={show('confirm')} />
        <Button type="submit" size="lg" block loading={loading} className="!mt-6">Create account</Button>
      </form>
    </AuthLayout>
  )
}
