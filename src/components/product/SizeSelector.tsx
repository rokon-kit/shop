import { Ruler } from 'lucide-react'
import type { Size } from '../../types'
import { cn } from '../../utils/cn'

interface SizeSelectorProps {
  sizes: Size[]
  soldOut?: Size[]
  value: Size | null
  onChange: (size: Size) => void
  onSizeGuide?: () => void
  error?: boolean
  compact?: boolean
}

export function SizeSelector({ sizes, soldOut = [], value, onChange, onSizeGuide, error, compact }: SizeSelectorProps) {
  return (
    <fieldset>
      <div className="mb-3 flex items-center justify-between">
        <legend className={cn('text-xs tracking-wide', error ? 'text-brick' : 'text-smoke')}>
          {error ? 'Please select a size' : value ? <>Size: <span className="font-medium text-ink">{value}</span></> : 'Select size'}
        </legend>
        {onSizeGuide && (
          <button type="button" onClick={onSizeGuide} className="inline-flex items-center gap-1.5 text-xs text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} /> Size guide
          </button>
        )}
      </div>
      <div
        role="radiogroup"
        aria-label="Size"
        className={cn('grid gap-2', compact ? 'grid-cols-5' : sizes.length > 5 ? 'grid-cols-6' : 'grid-cols-5')}
      >
        {sizes.map((s) => {
          const unavailable = soldOut.includes(s)
          const selected = value === s
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={unavailable}
              aria-label={unavailable ? `${s}, sold out` : s}
              disabled={unavailable}
              onClick={() => onChange(s)}
              className={cn(
                'tabular relative h-11 overflow-hidden border text-[0.8125rem] transition-colors duration-200',
                selected ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink',
                unavailable && 'cursor-not-allowed border-line text-sand hover:border-line',
                error && !selected && !unavailable && 'border-brick/60',
              )}
            >
              {s}
              {unavailable && (
                <span aria-hidden="true" className="absolute inset-0">
                  <span className="absolute top-1/2 left-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] bg-line-strong" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
