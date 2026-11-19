import type { ProductColor } from '../../types'
import { cn } from '../../utils/cn'

interface ColorSelectorProps {
  colors: ProductColor[]
  value: string
  onChange: (name: string) => void
  size?: 'sm' | 'md'
  showLabel?: boolean
  onHover?: (name: string | null) => void
}

/** Light swatches get a hairline ring so they don't vanish on ivory. */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 200
}

export function ColorSelector({ colors, value, onChange, size = 'md', showLabel = true, onHover }: ColorSelectorProps) {
  const dim = size === 'sm' ? 'h-3.5 w-3.5' : 'h-7 w-7'
  return (
    <fieldset>
      {showLabel && (
        <legend className="mb-3 text-xs tracking-wide text-smoke">
          Colour: <span className="font-medium text-ink">{value}</span>
        </legend>
      )}
      <div className={cn('flex flex-wrap', size === 'sm' ? 'gap-1.5' : 'gap-2.5')} role="radiogroup" aria-label="Colour">
        {colors.map((c) => {
          const selected = c.name === value
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c.name}
              title={c.name}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange(c.name)
              }}
              onMouseEnter={() => onHover?.(c.name)}
              onMouseLeave={() => onHover?.(null)}
              className={cn(
                'relative grid place-items-center rounded-full transition-[box-shadow] duration-200',
                size === 'sm' ? 'h-5 w-5' : 'h-10 w-10',
                selected ? 'shadow-[0_0_0_1px_var(--color-ink)]' : 'hover:shadow-[0_0_0_1px_var(--color-sand)]',
              )}
            >
              <span
                className={cn('block rounded-full', dim, isLight(c.hex) && 'shadow-[inset_0_0_0_1px_rgb(20_20_18/0.18)]')}
                style={{ backgroundColor: c.hex }}
              />
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
