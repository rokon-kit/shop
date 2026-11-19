import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { categoryBySlug, collectionName, subcategoryName } from '../../data/categories'
import type { CategorySlug } from '../../types'
import { AVAILABILITY, COLOR_FAMILIES, FILTER_KEYS, PRICE_RANGES, type FilterKey, type Filters } from '../../utils/filters'

function chipLabel(key: FilterKey, value: string) {
  switch (key) {
    case 'category':
      return categoryBySlug[value as CategorySlug]?.name ?? value
    case 'sub':
      return value === 'straight-fit' ? 'Straight Fit' : subcategoryName(value)
    case 'size':
      return `Size ${value}`
    case 'color':
      return COLOR_FAMILIES.find((c) => c.id === value)?.label ?? value
    case 'price':
      return PRICE_RANGES.find((r) => r.id === value)?.label ?? value
    case 'availability':
      return AVAILABILITY.find((a) => a.id === value)?.label ?? value
    case 'fit':
      return `${value} fit`
    case 'collection':
      return collectionName(value)
  }
}

export function ActiveFilters({ filters, onRemove, onClear }: { filters: Filters; onRemove: (k: FilterKey, v: string) => void; onClear: () => void }) {
  const chips = FILTER_KEYS.flatMap((k) => filters[k].map((v) => ({ k, v })))
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <AnimatePresence initial={false}>
        {chips.map(({ k, v }) => (
          <motion.button
            layout
            key={`${k}-${v}`}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onRemove(k, v)}
            className="inline-flex h-8 items-center gap-1.5 border border-line-strong bg-paper pr-2 pl-3 text-xs transition-colors hover:border-ink"
            aria-label={`Remove filter ${chipLabel(k, v)}`}
          >
            {chipLabel(k, v)}
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </motion.button>
        ))}
      </AnimatePresence>
      <button type="button" onClick={onClear} className="ml-1 text-xs text-smoke underline underline-offset-4 hover:text-ink">
        Clear all
      </button>
    </div>
  )
}
