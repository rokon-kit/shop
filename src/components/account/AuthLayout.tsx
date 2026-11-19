import type { ReactNode } from 'react'
import { SmartImage } from '../common/SmartImage'

interface AuthLayoutProps {
  image: string
  quote: ReactNode
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ image, quote, eyebrow, title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100svh-6rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-graphite lg:block">
        <SmartImage src={image} alt="" className="absolute inset-0 bg-graphite" sizes="50vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 text-paper">
          <p className="serif max-w-md text-4xl leading-tight">{quote}</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 md:py-20">
        <div className="w-full max-w-md">
          <p className="label text-taupe">{eyebrow}</p>
          <h1 className="display mt-4 text-5xl md:text-6xl">{title}</h1>
          {description && <p className="mt-4 text-[0.9375rem] leading-relaxed text-smoke">{description}</p>}
          <div className="mt-10">{children}</div>
          {footer && <div className="mt-10 border-t border-line pt-6 text-sm text-smoke">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export function PasswordStrength({ value }: { value: string }) {
  const score = [value.length >= 8, /[A-Z]/.test(value) && /[a-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  if (!value) return null
  return (
    <div className="mt-2" aria-live="polite">
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-[3px] transition-colors ${i < score ? (score >= 3 ? 'bg-moss' : 'bg-brick') : 'bg-bone'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-taupe">Password strength: {labels[score]}</p>
    </div>
  )
}
