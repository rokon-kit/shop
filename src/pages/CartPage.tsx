import { AnimatePresence } from 'framer-motion'
import { ArrowRight, Lock, RefreshCcw, Truck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartLine } from '../components/cart/CartLine'
import { FreeDeliveryProgress } from '../components/cart/FreeDeliveryProgress'
import { PromoCode, Totals } from '../components/cart/OrderSummary'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { Button, ButtonLink } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { PaymentBadges } from '../components/common/Icons'
import { SectionHeader } from '../components/common/SectionHeader'
import { ProductCarousel } from '../components/product/ProductCarousel'
import { RecentlyViewed } from '../components/product/RecentlyViewed'
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD, useCart } from '../context/CartContext'
import { bestSellers } from '../data/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { cn } from '../utils/cn'
import { pluralize } from '../utils/format'

export default function CartPage() {
  useDocumentTitle('Your bag')
  const { items, count, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [zone, setZone] = useState<'inside' | 'outside'>('inside')

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES[zone]
  const recommendations = bestSellers().filter((p) => !items.some((i) => i.productId === p.id))

  return (
    <div>
      <div className="container-x pt-8 pb-16 md:pt-12 md:pb-24">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Bag' }]} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4 md:mt-12">
          <h1 className="display text-[clamp(3rem,9vw,7rem)]">Your bag</h1>
          {items.length > 0 && <p className="label tabular text-taupe">{pluralize(count, 'item')}</p>}
        </div>

        {items.length === 0 ? (
          <EmptyState
            className="border-t border-line"
            title="Your bag is empty."
            description="Nothing in here yet. Our best sellers are a good place to start."
            action={
              <>
                <ButtonLink to="/new-arrivals">Shop new arrivals</ButtonLink>
                <ButtonLink to="/best-sellers" variant="secondary">
                  Best sellers
                </ButtonLink>
              </>
            }
          />
        ) : (
          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7 xl:col-span-8">
              <FreeDeliveryProgress subtotal={subtotal} className="border-y border-line py-5" />
              <ul className="divide-y divide-line border-b border-line">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartLine key={item.key} item={item} size="lg" />
                  ))}
                </AnimatePresence>
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <ButtonLink to="/shop" variant="ghost" size="sm" className="-ml-5">
                  ← Continue shopping
                </ButtonLink>
                <button type="button" onClick={clear} className="text-xs text-smoke underline underline-offset-4 hover:text-brick">
                  Empty bag
                </button>
              </div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4" aria-label="Order summary">
              <div className="space-y-6 bg-paper p-5 sm:p-7 lg:sticky lg:top-24">
                <h2 className="label text-xs">Order summary</h2>
                <fieldset>
                  <legend className="field-label">Estimate delivery</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['inside', 'outside'] as const).map((z) => (
                      <button
                        key={z}
                        type="button"
                        aria-pressed={zone === z}
                        onClick={() => setZone(z)}
                        className={cn('h-11 border text-xs transition-colors', zone === z ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink')}
                      >
                        {z === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <PromoCode />
                <Totals delivery={delivery} deliveryLabel={`Delivery (${zone === 'inside' ? 'inside Dhaka' : 'outside Dhaka'})`} />
                <Button full size="lg" onClick={() => navigate('/checkout')} icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
                  Checkout
                </Button>
                <ul className="space-y-2.5 border-t border-line pt-5 text-xs text-smoke">
                  <li className="flex items-center gap-2.5">
                    <Lock className="h-3.5 w-3.5" strokeWidth={1.5} /> Secure, encrypted checkout
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Truck className="h-3.5 w-3.5" strokeWidth={1.5} /> Cash on delivery across Bangladesh
                  </li>
                  <li className="flex items-center gap-2.5">
                    <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.5} /> 7-day easy exchange
                  </li>
                </ul>
                <PaymentBadges tone="light" />
              </div>
            </aside>
          </div>
        )}
      </div>

      <section className="container-x border-t border-line py-16 md:py-24" aria-label="Recommended for you">
        <SectionHeader size="md" eyebrow="Before you go" title={items.length ? 'Complete the look' : 'Most wanted'} action={{ label: 'Best sellers', to: '/best-sellers' }} />
        <ProductCarousel products={recommendations} label="Recommended" />
      </section>
      <RecentlyViewed />
    </div>
  )
}
