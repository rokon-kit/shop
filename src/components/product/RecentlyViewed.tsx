import { useMemo } from 'react'
import { useRecentlyViewed } from '../../context/RecentlyViewedContext'
import { productById } from '../../data/products'
import type { Product } from '../../types'
import { SectionHeader } from '../common/SectionHeader'
import { ProductCarousel } from './ProductCarousel'

export function RecentlyViewed({ excludeId, title = 'Recently viewed' }: { excludeId?: string; title?: string }) {
  const { ids, clear } = useRecentlyViewed()
  const items = useMemo(
    () => ids.filter((id) => id !== excludeId).map((id) => productById.get(id)).filter((p): p is Product => !!p),
    [ids, excludeId],
  )
  if (items.length === 0) return null
  return (
    <section className="container-x border-t border-line py-16 md:py-24" aria-label={title}>
      <div className="flex items-start justify-between">
        <SectionHeader size="md" eyebrow="Your history" title={title} />
        <button type="button" onClick={clear} className="label mt-1 shrink-0 text-taupe underline-offset-4 hover:text-ink hover:underline">
          Clear
        </button>
      </div>
      <ProductCarousel products={items} label={title} itemClassName="w-[44vw] sm:w-[30vw] md:w-[22vw] lg:w-[16vw]" />
    </section>
  )
}
