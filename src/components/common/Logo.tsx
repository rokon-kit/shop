import { cn } from '../../utils/cn'

/**
 * SUTO wordmark. The "O" is drawn as the eye of a needle with a single
 * thread pulled through it — the brand's mark (সুতো = thread).
 */
export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'paper' }) {
  return (
    <span
      className={cn('inline-flex items-center leading-none font-extrabold select-none', tone === 'paper' ? 'text-paper' : 'text-ink', className)}
      style={{ fontVariationSettings: "'wdth' 125", letterSpacing: '0.04em' }}
      aria-label="SUTO"
      role="img"
    >
      <span aria-hidden="true">SUT</span>
      <Mark className="ml-[0.06em] h-[0.74em] w-[1.12em]" tone={tone} />
    </span>
  )
}

export function Mark({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'paper' }) {
  return (
    <svg viewBox="0 0 46 30" className={className} aria-hidden="true" focusable="false">
      <circle cx="15" cy="15" r="11.6" fill="none" stroke="currentColor" strokeWidth="6.2" />
      <path
        d="M0.5 15 H 45.5"
        stroke={tone === 'paper' ? '#d8693f' : 'var(--color-brick)'}
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  )
}

/** Square emblem for loaders, placeholders and avatars. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="4.5" />
      <path d="M2 20h36" stroke="var(--color-brick)" strokeWidth="1.4" />
    </svg>
  )
}
