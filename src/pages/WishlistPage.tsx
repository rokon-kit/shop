import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { ButtonLink } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ProductCard } from '../components/product/ProductCard'
import { RecentlyViewed } from '../components/product/RecentlyViewed'
import { useWishlist } from '../context/WishlistContext'
import { productById } from '../data/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { Product } from '../types'
import { pluralize } from '../utils/format'

export function WishlistGrid() {
  const { ids, remove } = useWishlist()
  const items = ids.map((id) => productById.get(id)).filter((p): p is Product => !!p)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-6 w-6" strokeWidth={1.3} />}
        title="Nothing saved yet."
        description="Tap the heart on anything you like — we’ll keep it here, even after you close the tab."
        action={<ButtonLink to="/new-arrivals">Discover new arrivals</ButtonLink>}
      />
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence initial={false}>
        {items.map((p) => (
          <motion.li key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }} className="relative">
            <ProductCard product={p} />
            <button type="button" onClick={() => remove(p.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-smoke underline-offset-4 hover:text-brick hover:underline">
              <X className="h-3.5 w-3.5" strokeWidth={1.5} /> Remove
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export default function WishlistPage() {
  useDocumentTitle('Wishlist')
  const { count } = useWishlist()
  return (
    <>
      <div className="container-x pt-8 pb-20 md:pt-12 md:pb-28">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <div className="mt-8 mb-10 flex flex-wrap items-end justify-between gap-4 md:mt-12 md:mb-14">
          <h1 className="display text-[clamp(3rem,9vw,7rem)]">Wishlist</h1>
          {count > 0 && <p className="label tabular text-taupe">{pluralize(count, 'piece')} saved</p>}
        </div>
        <WishlistGrid />
      </div>
      <RecentlyViewed />
    </>
  )
}
