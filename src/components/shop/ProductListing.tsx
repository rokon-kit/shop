import { AnimatePresence, motion } from 'framer-motion'
import { Grid2X2, Grid3X3, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Product, SortKey } from '../../types'
import { cn } from '../../utils/cn'
import { applyFilters, FILTER_KEYS, readFilters, sortProducts, type FilterKey } from '../../utils/filters'
import { Breadcrumb, type Crumb } from '../common/Breadcrumb'
import { Button } from '../common/Button'
import { EmptyState } from '../common/EmptyState'
import { Reveal } from '../common/Reveal'
import { ProductCard } from '../product/ProductCard'
import { ActiveFilters } from './ActiveFilters'
import { FilterDrawer } from './FilterDrawer'
import { FilterPanel } from './FilterPanel'
import { SortSelect } from './SortSelect'

const PAGE_SIZE = 12

interface ProductListingProps {
  base: Product[]
  title: ReactNode
  eyebrow?: string
  description?: ReactNode
  crumbs: Crumb[]
  subcategories?: { slug: string; name: string }[]
  showCategory?: boolean
  quickLinks?: { label: string; to: string; active?: boolean }[]
  defaultSort?: SortKey
  tone?: 'default' | 'sale'
  aside?: ReactNode
}

export function ProductListing({
  base,
  title,
  eyebrow,
  description,
  crumbs,
  subcategories,
  showCategory,
  quickLinks,
  defaultSort = 'featured',
  tone = 'default',
  aside,
}: ProductListingProps) {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const [sidebar, setSidebar] = useState(true)

  const filters = useMemo(() => readFilters(params), [params])
  const sort = (params.get('sort') as SortKey) || defaultSort
  const view = params.get('view') === 'large' ? 'large' : 'grid'
  const shown = Number(params.get('show')) || PAGE_SIZE

  const results = useMemo(() => sortProducts(applyFilters(base, filters), sort), [base, filters, sort])
  const visible = results.slice(0, shown)
  const activeCount = FILTER_KEYS.reduce((n, k) => n + filters[k].length, 0)

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params)
    mutate(next)
    next.delete('show')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const toggle = (key: FilterKey, value: string) =>
    update((p) => {
      const cur = new Set(p.get(key)?.split(',').filter(Boolean))
      if (cur.has(value)) cur.delete(value)
      else cur.add(value)
      if (cur.size) p.set(key, [...cur].join(','))
      else p.delete(key)
    })

  const clear = () => update((p) => FILTER_KEYS.forEach((k) => p.delete(k)))
  const setSort = (s: SortKey) => update((p) => (s === defaultSort ? p.delete('sort') : p.set('sort', s)))
  const setView = (v: 'grid' | 'large') => update((p) => (v === 'grid' ? p.delete('view') : p.set('view', v)))
  const loadMore = () => {
    const next = new URLSearchParams(params)
    next.set('show', String(shown + PAGE_SIZE))
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const gridCols =
    view === 'large'
      ? 'grid-cols-1 sm:grid-cols-2'
      : sidebar
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div className="pb-20 md:pb-28">
      {/* Header */}
      <header className={cn('border-b border-line', tone === 'sale' && 'bg-brick text-paper')}>
        <div className="container-x pt-8 pb-8 md:pt-12 md:pb-12">
          <Breadcrumb items={crumbs} className={cn(tone === 'sale' && 'text-paper/70 [&_[aria-current]]:text-paper')} />
          <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              {eyebrow && <p className={cn('label mb-4', tone === 'sale' ? 'text-paper/70' : 'text-taupe')}>{eyebrow}</p>}
              <h1 className="display text-[clamp(3rem,10vw,8.5rem)]">{title}</h1>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
              {description && <p className={cn('text-[0.9375rem] leading-relaxed', tone === 'sale' ? 'text-paper/85' : 'text-smoke')}>{description}</p>}
              <p className={cn('label tabular mt-4', tone === 'sale' ? 'text-paper/70' : 'text-taupe')}>
                {base.length} {base.length === 1 ? 'style' : 'styles'}
              </p>
            </Reveal>
          </div>
          {quickLinks && quickLinks.length > 0 && (
            <nav aria-label="Subcategories" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={l.active ? 'page' : undefined}
                  className={cn(
                    'h-9 shrink-0 border px-4 text-xs leading-[2.15rem] tracking-[0.08em] uppercase transition-colors',
                    l.active ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink',
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {aside}

      {/* Toolbar */}
      <div className="sticky top-14 z-30 border-b border-line bg-ivory/95 backdrop-blur-md lg:top-16">
        <div className="container-x flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="label inline-flex h-10 items-center gap-2 lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              Filter & sort
              {activeCount > 0 && <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] text-paper">{activeCount}</span>}
            </button>
            <button
              type="button"
              onClick={() => setSidebar((s) => !s)}
              className="label hidden h-10 items-center gap-2 lg:inline-flex"
              aria-expanded={sidebar}
              aria-controls="filter-sidebar"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              {sidebar ? 'Hide filters' : 'Show filters'}
              {activeCount > 0 && <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] text-paper">{activeCount}</span>}
            </button>
            <p className="tabular hidden text-xs text-smoke sm:block" aria-live="polite">
              {results.length} {results.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SortSelect value={sort} onChange={setSort} className="hidden lg:flex" />
            <div className="flex items-center border-l border-line pl-3" role="group" aria-label="Grid density">
              <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} className={cn('grid h-9 w-9 place-items-center', view === 'grid' ? 'text-ink' : 'text-sand hover:text-ink')} aria-label="Compact grid">
                <Grid3X3 className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => setView('large')} aria-pressed={view === 'large'} className={cn('grid h-9 w-9 place-items-center', view === 'large' ? 'text-ink' : 'text-sand hover:text-ink')} aria-label="Large images">
                <Grid2X2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x mt-6 lg:mt-8 lg:flex lg:gap-10">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebar && (
            <motion.aside
              id="filter-sidebar"
              aria-label="Filters"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="hidden shrink-0 overflow-clip lg:block"
            >
              <div className="no-scrollbar sticky top-36 max-h-[calc(100vh-10rem)] w-64 overflow-y-auto pb-10">
                <FilterPanel base={base} filters={filters} onToggle={toggle} subcategories={subcategories} showCategory={showCategory} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <ActiveFilters filters={filters} onRemove={toggle} onClear={clear} />

          {results.length === 0 ? (
            <EmptyState
              title="Nothing matches — yet."
              description="Try removing a filter or two. New pieces land every Thursday."
              action={
                <Button variant="secondary" onClick={clear}>
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className={cn('grid gap-x-3 gap-y-10 sm:gap-x-4 md:gap-y-14', activeCount > 0 && 'mt-6', gridCols)}>
                {visible.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout="position"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i % PAGE_SIZE, 8) * 0.035, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard
                      product={p}
                      priority={i < 4}
                      aspect={view === 'large' ? 'aspect-[4/5]' : 'aspect-[4/5]'}
                      showCollection={view === 'large'}
                      sizes={view === 'large' ? '(min-width: 640px) 45vw, 100vw' : '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw'}
                    />
                  </motion.li>
                ))}
              </ul>

              <div className="mx-auto mt-16 flex max-w-xs flex-col items-center gap-4 text-center">
                <p className="tabular text-xs text-smoke">
                  Showing {visible.length} of {results.length}
                </p>
                <div className="h-px w-full bg-line" aria-hidden="true">
                  <div className="h-full bg-ink transition-[width] duration-500" style={{ width: `${(visible.length / results.length) * 100}%` }} />
                </div>
                {visible.length < results.length && (
                  <Button variant="secondary" size="lg" onClick={loadMore} className="mt-2">
                    Load more
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        base={base}
        filters={filters}
        onToggle={toggle}
        onClear={clear}
        sort={sort}
        onSort={setSort}
        resultCount={results.length}
        subcategories={subcategories}
        showCategory={showCategory}
      />
    </div>
  )
}
