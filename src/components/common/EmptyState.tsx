import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Emblem } from './Logo'

interface EmptyStateProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-16 text-center md:py-24', className)}>
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border border-line text-ink">{icon ?? <Emblem className="h-8 w-8" />}</div>
      <h2 className="serif text-3xl md:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">{description}</p>}
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  )
}
