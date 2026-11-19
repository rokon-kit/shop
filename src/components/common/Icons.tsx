import type { SVGProps } from 'react'
import { cn } from '../../utils/cn'

type IconProps = SVGProps<SVGSVGElement>

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.46A21 21 0 0 0 14.27 4.3c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1Z" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 3c.3 2.1 1.6 3.6 3.6 3.9v3a7 7 0 0 1-3.6-1.1v6.3A5.9 5.9 0 1 1 10.7 9.2v3.1a2.9 2.9 0 1 0 2.9 2.9V3h3Z" />
    </svg>
  )
}

export const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
} as const

/** Neutral payment-method marks — typographic stand-ins, not official logos. */
export function PaymentBadges({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const methods = ['bKash', 'Nagad', 'VISA', 'Mastercard', 'AMEX', 'COD']
  return (
    <ul className={cn('flex flex-wrap items-center gap-1.5', className)} aria-label="Accepted payment methods">
      {methods.map((m) => (
        <li
          key={m}
          className={cn(
            'grid h-7 min-w-11 place-items-center border px-2 text-[0.625rem] font-semibold tracking-wide',
            tone === 'dark' ? 'border-paper/20 text-paper/80' : 'border-line-strong text-smoke',
          )}
        >
          {m === 'Mastercard' ? (
            <span className="flex items-center" aria-label="Mastercard">
              <span className="h-3.5 w-3.5 rounded-full bg-current opacity-60" />
              <span className="-ml-1.5 h-3.5 w-3.5 rounded-full border border-current" />
            </span>
          ) : (
            m
          )}
        </li>
      ))}
    </ul>
  )
}
