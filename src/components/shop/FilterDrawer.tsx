import type { Product, SortKey } from '../../types'
import { cn } from '../../utils/cn'
import { SORT_OPTIONS, type FilterKey, type Filters } from '../../utils/filters'
import { Button } from '../common/Button'
import { Drawer } from '../common/Drawer'
import { FilterPanel } from './FilterPanel'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  base: Product[]
  filters: Filters
  onToggle: (key: FilterKey, value: string) => void
  onClear: () => void
  sort: SortKey
  onSort: (s: SortKey) => void
  resultCount: number
  subcategories?: { slug: string; name: string }[]
  showCategory?: boolean
}

/** Mobile/tablet bottom sheet: sort + all filter groups + a sticky results CTA. */
export function FilterDrawer({ open, onClose, base, filters, onToggle, onClear, sort, onSort, resultCount, subcategories, showCategory }: FilterDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter & sort"
      side="bottom"
      footer={
        <div className="grid grid-cols-[auto_1fr] gap-2 p-4">
          <Button variant="secondary" size="lg" onClick={onClear}>
            Clear
          </Button>
          <Button size="lg" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </Button>
        </div>
      }
    >
      <div className="px-5 pb-4">
        <fieldset className="py-5">
          <legend className="label mb-3 text-xs">Sort by</legend>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={sort === o.id}
                onClick={() => onSort(o.id)}
                className={cn(
                  'h-9 border px-3.5 text-xs transition-colors',
                  sort === o.id ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
        <FilterPanel base={base} filters={filters} onToggle={onToggle} subcategories={subcategories} showCategory={showCategory} />
      </div>
    </Drawer>
  )
}
