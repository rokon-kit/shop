import { AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { bestSellers } from '../../data/products'
import { pluralize, formatPrice } from '../../utils/format'
import { Button, ButtonLink } from '../common/Button'
import { Drawer } from '../common/Drawer'
import { SmartImage } from '../common/SmartImage'
import { CartLine } from './CartLine'
import { FreeDeliveryProgress } from './FreeDeliveryProgress'

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI()
  const { items, count, subtotal, savings } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    closeCart()
  }, [pathname, closeCart])

  const suggestions = bestSellers()
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 3)

  return (
    <Drawer
      open={cartOpen}
      onClose={closeCart}
      title={`Your bag${count ? ` (${count})` : ''}`}
      footer={
        items.length > 0 && (
          <div className="space-y-4 p-5 sm:p-6">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="tabular font-medium">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-brick">
                  <dt>You save</dt>
                  <dd className="tabular">{formatPrice(savings)}</dd>
                </div>
              )}
            </dl>
            <p className="text-xs text-taupe">Delivery and promo codes calculated at checkout. Cash on delivery available.</p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink to="/cart" variant="secondary" size="lg">
                View bag
              </ButtonLink>
              <Button size="lg" onClick={() => navigate('/checkout')}>
                Checkout
              </Button>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-taupe">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Secure checkout · 7-day easy exchange
            </p>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col">
          <div className="px-6 pt-12 pb-8 text-center">
            <p className="serif text-4xl">Your bag is empty.</p>
            <p className="mx-auto mt-3 max-w-xs text-sm text-smoke">Start with a shirt — we’ll take care of the rest.</p>
            <div className="mt-6 flex justify-center gap-2">
              <ButtonLink to="/new-arrivals" size="md">
                New arrivals
              </ButtonLink>
              <ButtonLink to="/best-sellers" size="md" variant="secondary">
                Best sellers
              </ButtonLink>
            </div>
          </div>
          <div className="mt-auto border-t border-line px-5 py-6 sm:px-6">
            <p className="label mb-4 text-taupe">Most wanted this week</p>
            <ul className="grid grid-cols-3 gap-3">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link to={`/product/${p.slug}`} className="group block">
                    <SmartImage src={p.images[0]} alt={p.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="120px" widths={[240]} baseWidth={240} />
                    <p className="mt-2 line-clamp-2 text-xs leading-snug">{p.name}</p>
                    <p className="tabular mt-0.5 text-xs text-smoke">{formatPrice(p.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="px-5 sm:px-6">
          <FreeDeliveryProgress subtotal={subtotal} className="border-b border-line py-5" />
          <ul className="divide-y divide-line" aria-label={pluralize(count, 'item')}>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartLine key={item.key} item={item} onNavigate={closeCart} />
              ))}
            </AnimatePresence>
          </ul>
          {suggestions.length > 0 && (
            <div className="border-t border-line py-6">
              <p className="label mb-4 text-taupe">Complete the look</p>
              <ul className="space-y-3">
                {suggestions.slice(0, 2).map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} className="group flex items-center gap-3">
                      <SmartImage src={p.images[0]} alt="" className="aspect-[4/5] w-14 shrink-0" sizes="56px" widths={[160]} baseWidth={160} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{p.name}</span>
                        <span className="tabular text-xs text-smoke">{formatPrice(p.price)}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-taupe transition-transform group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}
