import { Minus, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

export function QuantityStepper({ value, onChange, min = 1, max = 10, size = 'md', label = 'Quantity', className }: QuantityStepperProps) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  const w = size === 'sm' ? 'w-9' : 'w-11'
  return (
    <div className={cn('inline-flex items-center border border-line-strong', h, className)} role="group" aria-label={label}>
      <button
        type="button"
        className={cn('grid h-full place-items-center transition-colors hover:bg-bone disabled:opacity-30', w)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
      <output className={cn('tabular min-w-8 text-center text-sm', size === 'sm' && 'text-xs')} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={cn('grid h-full place-items-center transition-colors hover:bg-bone disabled:opacity-30', w)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
