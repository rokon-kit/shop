import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { newArrivals, products } from '../../data/products'
import type { CategorySlug } from '../../types'
import { cn } from '../../utils/cn'
import { SectionHeader } from '../common/SectionHeader'
import { ProductCarousel } from '../product/ProductCarousel'

const tabs: { label: string; match: CategorySlug[] | null }[] = [
  { label: 'All', match: null },
  { label: 'Shirts', match: ['shirts', 'polo-shirts', 't-shirts'] },
  { label: 'Panjabi', match: ['panjabi', 'katua'] },
  { label: 'Pants', match: ['pants'] },
  { label: 'Outerwear', match: ['outerwear'] },
]

export function NewArrivals() {
  const [tab, setTab] = useState(0)
  const items = useMemo(() => {
    const match = tabs[tab].match
    const fresh = newArrivals()
    if (!match) return fresh.slice(0, 10)
    const inCat = fresh.filter((p) => match.includes(p.category))
    // Top up with recent styles from the same categories so every tab feels full
    const extra = products.filter((p) => match.includes(p.category) && !p.newArrival && p.stock > 0)
    return [...inCat, ...extra].slice(0, 8)
  }, [tab])

  return (
    <section className="overflow-hidden border-t border-line py-20 md:py-28" aria-labelledby="new-title">
      <div className="container-x">
        <SectionHeader
          index="02"
          eyebrow="Just in"
          title={<span id="new-title">New arrivals</span>}
          action={{ label: 'View all new', to: '/new-arrivals' }}
          className="md:mb-8"
        />
        <div role="tablist" aria-label="Filter new arrivals" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:mb-10">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                'relative h-10 shrink-0 border px-5 text-xs tracking-[0.12em] uppercase transition-colors',
                tab === i ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink hover:border-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <ProductCarousel products={items} label="New arrivals" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
