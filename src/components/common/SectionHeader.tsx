import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Reveal } from './Reveal'

interface SectionHeaderProps {
  index?: string
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  action?: { label: string; to: string }
  className?: string
  tone?: 'ink' | 'paper'
  size?: 'lg' | 'md'
}

/** Editorial section heading: numbered eyebrow, display title, optional link. */
export function SectionHeader({ index, eyebrow, title, description, action, className, tone = 'ink', size = 'lg' }: SectionHeaderProps) {
  return (
    <Reveal className={cn('mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        {(index || eyebrow) && (
          <p className={cn('label mb-4 flex items-center gap-3', tone === 'paper' ? 'text-paper/60' : 'text-taupe')}>
            {index && <span className="tabular">{index}</span>}
            {index && eyebrow && <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        )}
        <h2 className={cn('display', size === 'lg' ? 'text-[2.5rem] sm:text-6xl lg:text-7xl' : 'text-[2rem] sm:text-5xl', tone === 'paper' && 'text-paper')}>{title}</h2>
        {description && <p className={cn('mt-5 max-w-xl text-[0.9375rem] leading-relaxed', tone === 'paper' ? 'text-paper/70' : 'text-smoke')}>{description}</p>}
      </div>
      {action && (
        <Link
          to={action.to}
          className={cn('group label inline-flex shrink-0 items-center gap-2 self-start md:self-auto', tone === 'paper' ? 'text-paper' : 'text-ink')}
        >
          <span className="link-u-static">{action.label}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </Link>
      )}
    </Reveal>
  )
}
