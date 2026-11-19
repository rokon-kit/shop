import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Stars({ value, className, size = 'sm' }: { value: number; className?: string; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <span className={cn('relative inline-flex', className)} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="flex gap-0.5 text-stone">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn(s, 'fill-current')} strokeWidth={0} />
        ))}
      </span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-ink" style={{ width: `${(value / 5) * 100}%` }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn(s, 'shrink-0 fill-current')} strokeWidth={0} />
        ))}
      </span>
    </span>
  )
}
