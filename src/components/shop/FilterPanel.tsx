import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { categories, collections, subcategoryName } from '../../data/categories'
import { ALL_FITS } from '../../data/products'
import type { Product, Size } from '../../types'
import { cn } from '../../utils/cn'
import { applyFilters, AVAILABILITY, COLOR_FAMILIES, matchesSub, PRICE_RANGES, productFamilies, type FilterKey, type Filters } from '../../utils/filters'
import { AccordionItem } from '../common/Accordion'

interface FilterPanelProps {
  base: Product[]
  filters: Filters
  onToggle: (key: FilterKey, value: string) => void
  /** Subcategory options when browsing a single category */
  subcategories?: { slug: string; name: string }[]
  showCategory?: boolean
}

function CheckRow({ checked, label, count, onChange, swatch }: { checked: boolean; label: string; count: number; onChange: () => void; swatch?: string }) {
  const disabled = count === 0 && !checked
  return (
    <label className={cn('flex cursor-pointer items-center gap-3 py-1.5 text-sm transition-colors', disabled ? 'cursor-not-allowed text-sand' : 'text-ink/85 hover:text-ink')}>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} disabled={disabled} />
      <span
        className={cn(
          'grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brick',
          checked ? 'border-ink bg-ink text-paper' : 'border-line-strong',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </span>
      {swatch && <span className="h-3.5 w-3.5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(20_20_18/0.15)]" style={{ background: swatch }} aria-hidden="true" />}
      <span className="flex-1">{label}</span>
      <span className="tabular text-xs text-taupe">{count}</span>
    </label>
  )
}

function Group({ title, active, children, defaultOpen }: { title: string; active: number; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <AccordionItem
      defaultOpen={defaultOpen || active > 0}
      title={
        <span className="flex items-center gap-2">
          {title}
          {active > 0 && <span className="tabular grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[0.5625rem] text-paper">{active}</span>}
        </span>
      }
    >
      {children}
    </AccordionItem>
  )
}

const TOP_SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL']
const WAIST_SIZES: Size[] = ['28', '30', '32', '34', '36', '38']

export function FilterPanel({ base, filters, onToggle, subcategories, showCategory }: FilterPanelProps) {
  // Facet counts respect every other active filter
  const facet = (key: FilterKey) => applyFilters(base, filters, key)

  const catPool = facet('category')
  const subPool = facet('sub')
  const sizePool = facet('size')
  const colorPool = facet('color')
  const pricePool = facet('price')
  const availPool = facet('availability')
  const fitPool = facet('fit')
  const colPool = facet('collection')

  const hasBottoms = base.some((p) => p.category === 'pants')
  const hasTops = base.some((p) => p.category !== 'pants' || p.sizes.includes('M'))
  const fits = ALL_FITS.filter((f) => base.some((p) => p.fit === f))
  const cols = collections.filter((c) => base.some((p) => p.collection === c.slug))

  return (
    <div className="border-t border-line">
      {showCategory && (
        <Group title="Category" active={filters.category.length} defaultOpen>
          {categories
            .filter((c) => base.some((p) => p.category === c.slug))
            .map((c) => (
              <CheckRow
                key={c.slug}
                label={c.name}
                checked={filters.category.includes(c.slug)}
                count={catPool.filter((p) => p.category === c.slug).length}
                onChange={() => onToggle('category', c.slug)}
              />
            ))}
        </Group>
      )}

      {subcategories && subcategories.length > 0 && (
        <Group title="Style" active={filters.sub.length} defaultOpen>
          {subcategories.map((s) => (
            <CheckRow
              key={s.slug}
              label={s.name ?? subcategoryName(s.slug)}
              checked={filters.sub.includes(s.slug)}
              count={subPool.filter((p) => matchesSub(p, s.slug)).length}
              onChange={() => onToggle('sub', s.slug)}
            />
          ))}
        </Group>
      )}

      <Group title="Size" active={filters.size.length} defaultOpen>
        {[hasTops && TOP_SIZES, hasBottoms && WAIST_SIZES].filter(Boolean).map((set, i) => (
          <div key={i} className={cn(i > 0 && 'mt-4')}>
            {hasTops && hasBottoms && <p className="mb-2 text-xs text-taupe">{i === 0 ? 'Tops' : 'Waist'}</p>}
            <div className="grid grid-cols-5 gap-1.5">
              {(set as Size[]).map((s) => {
                const on = filters.size.includes(s)
                const count = sizePool.filter((p) => p.sizes.includes(s) && !p.soldOutSizes?.includes(s)).length
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    disabled={!count && !on}
                    onClick={() => onToggle('size', s)}
                    className={cn(
                      'tabular h-10 border text-xs transition-colors disabled:border-line disabled:text-sand',
                      on ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink',
                    )}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </Group>

      <Group title="Colour" active={filters.color.length}>
        <div className="grid grid-cols-2 gap-x-4">
          {COLOR_FAMILIES.map((c) => {
            const count = colorPool.filter((p) => productFamilies(p).has(c.id)).length
            if (!count && !filters.color.includes(c.id)) return null
            return <CheckRow key={c.id} label={c.label} swatch={c.swatch} checked={filters.color.includes(c.id)} count={count} onChange={() => onToggle('color', c.id)} />
          })}
        </div>
      </Group>

      <Group title="Price" active={filters.price.length}>
        {PRICE_RANGES.map((r) => (
          <CheckRow
            key={r.id}
            label={r.label}
            checked={filters.price.includes(r.id)}
            count={pricePool.filter((p) => p.price >= r.min && p.price <= r.max).length}
            onChange={() => onToggle('price', r.id)}
          />
        ))}
      </Group>

      <Group title="Availability" active={filters.availability.length}>
        {AVAILABILITY.map((a) => {
          const count = availPool.filter((p) =>
            a.id === 'in-stock' ? p.stock > 0 : a.id === 'sale' ? !!p.discount : a.id === 'new' ? !!p.newArrival : !!p.limited,
          ).length
          return <CheckRow key={a.id} label={a.label} checked={filters.availability.includes(a.id)} count={count} onChange={() => onToggle('availability', a.id)} />
        })}
      </Group>

      {fits.length > 1 && (
        <Group title="Fit" active={filters.fit.length}>
          {fits.map((f) => (
            <CheckRow key={f} label={f} checked={filters.fit.includes(f)} count={fitPool.filter((p) => p.fit === f).length} onChange={() => onToggle('fit', f)} />
          ))}
        </Group>
      )}

      {cols.length > 1 && (
        <Group title="Collection" active={filters.collection.length}>
          {cols.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              checked={filters.collection.includes(c.slug)}
              count={colPool.filter((p) => p.collection === c.slug).length}
              onChange={() => onToggle('collection', c.slug)}
            />
          ))}
        </Group>
      )}
    </div>
  )
}
