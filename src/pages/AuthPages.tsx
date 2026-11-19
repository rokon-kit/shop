import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout, PasswordStrength } from '../components/account/AuthLayout'
import { Field } from '../components/checkout/CheckoutFields'
import { Button } from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { photo } from '../data/photos'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { isValidBdPhone } from '../utils/orders'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function PasswordField({ value, onChange, error, label = 'Password', autoComplete, id = 'password' }: { value: string; onChange: (v: string) => void; error?: string; label?: string; autoComplete: string; id?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-msg` : undefined}
          className="field pr-12"
        />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center text-smoke hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-msg`} className="mt-1.5 text-xs text-brick" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function SocialButtons() {
  return (
    <>
      <div className="my-8 flex items-center gap-4 text-xs text-taupe">
        <span className="h-px flex-1 bg-line" /> or continue with <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="md" type="button">
          Google
        </Button>
        <Button variant="secondary" size="md" type="button">
          Facebook
        </Button>
      </div>
    </>
  )
}

export function LoginPage() {
  useDocumentTitle('Sign in')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!emailOk(email)) errs.email = 'Enter the email you registered with.'
    if (password.length < 6) errs.password = 'Password must be at least 6 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    window.setTimeout(() => {
      signIn(email)
      navigate(params.get('next') ?? '/account', { replace: true })
    }, 700)
  }

  return (
    <AuthLayout
      image={photo.camelCoat}
      quote={<>“The shirt that made me stop buying shirts.” <span className="mt-3 block text-base not-italic text-paper/70">— Nafis A., member since 2025</span></>}
      eyebrow="Welcome back"
      title="Sign in"
      description="Track orders, save addresses and get first access to new drops."
      footer={
        <>
          New to SUTO?{' '}
          <Link to="/register" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Email" id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-smoke">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-ink" /> Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-ink underline underline-offset-4">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" full size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : 'Sign in'}
        </Button>
        <p className="text-center text-xs text-taupe">Prototype: any email and a 6+ character password will sign you in.</p>
      </form>
      <SocialButtons />
    </AuthLayout>
  )
}

export function RegisterPage() {
  useDocumentTitle('Create account')
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [agree, setAgree] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 3) errs.name = 'Please enter your full name.'
    if (!emailOk(form.email)) errs.email = 'Enter a valid email address.'
    if (!isValidBdPhone(form.phone)) errs.phone = 'Enter a valid Bangladeshi mobile number.'
    if (form.password.length < 8) errs.password = 'Use at least 8 characters.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    window.setTimeout(() => {
      register(form)
      navigate('/account', { replace: true })
    }, 800)
  }

  return (
    <AuthLayout
      image={photo.fieldPair}
      quote="Members get new drops 48 hours early, private offers and free alterations in store."
      eyebrow="Join SUTO"
      title="Create account"
      description="It takes thirty seconds. We’ll never share your details."
      footer={
        <>
          Already a member?{' '}
          <Link to="/login" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Full name" id="reg-name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" id="reg-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Mobile number" id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01712-345678" value={form.phone} onChange={set('phone')} error={errors.phone} />
        <div>
          <PasswordField value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} error={errors.password} autoComplete="new-password" id="reg-password" />
          <PasswordStrength value={form.password} />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-smoke">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-ink" />
          Send me new drops and private offers. Unsubscribe any time.
        </label>
        <Button type="submit" full size="lg" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : 'Create account'}
        </Button>
      </form>
      <SocialButtons />
    </AuthLayout>
  )
}

export function ForgotPasswordPage() {
  useDocumentTitle('Reset password')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!emailOk(email)) return setError('Enter the email you registered with.')
    setSent(true)
  }

  return (
    <AuthLayout
      image={photo.tailorHands}
      quote="Every garment starts with a single thread."
      eyebrow="Account help"
      title={sent ? 'Check your inbox' : 'Reset password'}
      description={sent ? undefined : 'Enter your email and we’ll send you a link to choose a new password.'}
      footer={
        <Link to="/login" className="text-ink underline underline-offset-4">
          ← Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex gap-4 border border-line bg-paper p-5" role="status">
          <MailCheck className="h-6 w-6 shrink-0" strokeWidth={1.3} />
          <p className="text-sm leading-relaxed text-smoke">
            If an account exists for <span className="text-ink">{email}</span>, you’ll receive a reset link within a couple of minutes. Don’t forget to check
            your spam folder.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <Field
            label="Email"
            id="forgot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(undefined)
            }}
            error={error}
          />
          <Button type="submit" full size="lg">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
