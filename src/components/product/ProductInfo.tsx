import { AnimatePresence, motion } from 'framer-motion'
import { Check, MapPin, PackageCheck, RefreshCcw, Share2, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD, MAX_QTY, useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { collectionName, subcategoryName } from '../../data/categories'
import { isLowStock, isSoldOut } from '../../data/products'
import type { Product, Size } from '../../types'
import { cn } from '../../utils/cn'
import { deliveryWindow, formatPrice } from '../../utils/format'
import { AccordionItem } from '../common/Accordion'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Price } from '../common/Price'
import { QuantityStepper } from '../common/QuantityStepper'
import { ColorSelector } from './ColorSelector'
import { sizeGuideFor } from './QuickAdd'
import { Stars } from './Rating'
import { SizeSelector } from './SizeSelector'
import { WishlistButton } from './WishlistButton'

interface ProductInfoProps {
  product: Product
  color: string
  onColor: (c: string) => void
  onMainCtaVisible?: (visible: boolean) => void
  addRef?: React.RefObject<{ add: () => void } | null>
}

const FIT_SCALE = ['Runs small', 'True to size', 'Runs large'] as const

function fitPosition(p: Product) {
  const note = p.fitNote.toLowerCase()
  if (note.includes('true to size') || note.includes('usual size')) return 1
  if (note.includes('size down') && !note.includes('size up')) return 2
  if (note.includes('size up') && !note.includes('size down')) return 0
  return 1
}

export function ProductInfo({ product, color, onColor, onMainCtaVisible, addRef }: ProductInfoProps) {
  const { addItem } = useCart()
  const { openSizeGuide } = useUI()
  const navigate = useNavigate()
  const [size, setSize] = useState<Size | null>(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)
  const [notify, setNotify] = useState<'idle' | 'done'>('idle')
  const [copied, setCopied] = useState(false)
  const cta = useRef<HTMLDivElement>(null)
  const soldOut = isSoldOut(product)

  useEffect(() => {
    setSize(null)
    setQty(1)
    setError(false)
  }, [product.id])

  useEffect(() => {
    const el = cta.current
    if (!el || !onMainCtaVisible) return
    const io = new IntersectionObserver(([e]) => onMainCtaVisible(e.isIntersecting), { rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [onMainCtaVisible])

  const validate = () => {
    if (!size) {
      setError(true)
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const add = () => {
    if (!validate()) return
    addItem(product, { size: size!, color, quantity: qty })
  }
  const buyNow = () => {
    if (!validate()) return
    addItem(product, { size: size!, color, quantity: qty }, false)
    navigate('/checkout')
  }

  // Expose the validated add action to the page's sticky mobile bar
  useEffect(() => {
    if (addRef) addRef.current = { add }
  })

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: product.name, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* user dismissed share sheet */
    }
  }

  const fitPos = fitPosition(product)

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Link to={`/shop?collection=${product.collection}`} className="label link-u text-taupe hover:text-ink">
          {collectionName(product.collection)}
        </Link>
        <div className="flex gap-1.5">
          {product.limited && <Badge tone="limited">Limited</Badge>}
          {product.newArrival && <Badge tone="neutral">New</Badge>}
        </div>
      </div>

      <h1 className="serif mt-3 text-[2.5rem] leading-[1.02] md:text-5xl">{product.name}</h1>

      <a href="#reviews" className="mt-4 inline-flex items-center gap-2 text-xs text-smoke hover:text-ink">
        <Stars value={product.rating} />
        <span className="tabular">{product.rating.toFixed(1)}</span>
        <span className="underline decoration-line-strong underline-offset-4">{product.reviewCount} reviews</span>
      </a>

      <div className="mt-6 flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <Price price={product.price} originalPrice={product.originalPrice} size="lg" showBadge />
          <p className="mt-1.5 text-xs text-taupe">Inclusive of VAT · or 3 interest-free payments with select cards</p>
        </div>
        <button type="button" onClick={share} className="grid h-10 w-10 shrink-0 place-items-center text-smoke hover:bg-bone hover:text-ink" aria-label={copied ? 'Link copied' : 'Share this product'}>
          {copied ? <Check className="h-4 w-4" strokeWidth={1.5} /> : <Share2 className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>

      <div className="space-y-7 pt-6">
        <ColorSelector colors={product.colors} value={color} onChange={onColor} />

        <div id="size-selector">
          <SizeSelector
            sizes={product.sizes}
            soldOut={soldOut ? product.sizes : product.soldOutSizes}
            value={size}
            onChange={(s) => {
              setSize(s)
              setError(false)
            }}
            error={error}
            onSizeGuide={() => openSizeGuide(sizeGuideFor(product))}
          />
          {/* Fit scale */}
          <div className="mt-5">
            <div className="relative h-px bg-line-strong">
              <span className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${10 + fitPos * 40}%` }} aria-hidden="true" />
            </div>
            <div className="mt-2.5 flex justify-between text-[0.6875rem] text-taupe">
              {FIT_SCALE.map((f, i) => (
                <span key={f} className={cn(i === fitPos && 'font-medium text-ink')}>
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-smoke">
              <span className="font-medium text-ink">{product.fit} fit.</span> {product.fitNote}
            </p>
          </div>
        </div>

        {soldOut ? (
          <div ref={cta} className="border border-line-strong p-5">
            <p className="text-sm font-medium">This piece is sold out.</p>
            <p className="mt-1 text-xs text-smoke">We restock popular styles every few weeks. Leave your email and we’ll tell you first.</p>
            <AnimatePresence mode="wait" initial={false}>
              {notify === 'done' ? (
                <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-sm" role="status">
                  <Check className="h-4 w-4" strokeWidth={1.5} /> We’ll email you when it’s back.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  className="mt-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setNotify('done')
                  }}
                >
                  <label htmlFor="notify-email" className="sr-only">
                    Email
                  </label>
                  <input id="notify-email" type="email" required placeholder="Email address" className="field h-12 py-0" />
                  <Button type="submit" size="lg" className="shrink-0">
                    Notify me
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div ref={cta} className="space-y-3">
            <div className="flex gap-2">
              <QuantityStepper value={qty} onChange={setQty} min={1} max={Math.min(MAX_QTY, product.stock)} />
              <Button size="lg" full onClick={add} className="h-12 min-w-0 px-4 sm:px-9">
                Add to bag<span className="hidden xs:inline">&nbsp;— {formatPrice(product.price * qty)}</span>
              </Button>
              <WishlistButton product={product} variant="inline" className="shrink-0" />
            </div>
            <Button variant="secondary" size="lg" full onClick={buyNow} className="h-12">
              Buy now
            </Button>
            <p className={cn('flex items-center gap-2 text-xs', isLowStock(product) ? 'text-brick' : 'text-smoke')}>
              <span className={cn('h-1.5 w-1.5 rounded-full', isLowStock(product) ? 'bg-brick' : 'bg-moss')} aria-hidden="true" />
              {isLowStock(product) ? `Only ${product.stock} left — order soon` : 'In stock · ships from Dhaka within 24 hours'}
            </p>
          </div>
        )}

        {/* Delivery & exchange */}
        <ul className="divide-y divide-line border-y border-line text-[0.8125rem]">
          <li className="flex gap-3 py-4">
            <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
            <div>
              <p>
                <span className="font-medium">Inside Dhaka:</span> {deliveryWindow(true)} · {formatPrice(DELIVERY_FEES.inside)}
              </p>
              <p className="mt-0.5 text-smoke">
                <span className="font-medium text-ink">Outside Dhaka:</span> {deliveryWindow(false)} · {formatPrice(DELIVERY_FEES.outside)}
              </p>
              <p className="mt-1 text-xs text-taupe">Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}.</p>
            </div>
          </li>
          <li className="flex gap-3 py-4">
            <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
            <p>
              <span className="font-medium">7-day easy exchange.</span> <span className="text-smoke">Swap size or colour by courier or in any store.</span>
            </p>
          </li>
          <li className="flex gap-3 py-4">
            <PackageCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
            <p>
              <span className="font-medium">Check before you pay.</span> <span className="text-smoke">Cash on delivery available across Bangladesh.</span>
            </p>
          </li>
          <li className="flex gap-3 py-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
            <p>
              <span className="font-medium">Try it in store.</span>{' '}
              <Link to="/stores" className="text-smoke underline decoration-line-strong underline-offset-4 hover:text-ink">
                Banani, Dhanmondi & Chattogram
              </Link>
            </p>
          </li>
        </ul>

        <div className="border-t border-line">
          <AccordionItem title="Product details" defaultOpen>
            <p>{product.description}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-4 marker:text-sand">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="label mt-5 text-taupe">
              Style {product.id} · {subcategoryName(product.subcategory)}
            </p>
          </AccordionItem>
          <AccordionItem title="Material & care">
            <p className="font-medium text-ink">{product.material}</p>
            <ul className="mt-3 space-y-1.5">
              {product.care.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-sand">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title="Fit & size">
            <p>
              <span className="font-medium text-ink">{product.fit} fit.</span> {product.fitNote}
            </p>
            {product.modelInfo && <p className="mt-2">{product.modelInfo}</p>}
            <button type="button" onClick={() => openSizeGuide(sizeGuideFor(product))} className="mt-3 text-ink underline underline-offset-4">
              View size guide
            </button>
          </AccordionItem>
          <AccordionItem title="Delivery & returns">
            <p>
              Inside Dhaka in 1–2 working days ({formatPrice(DELIVERY_FEES.inside)}), outside Dhaka in 3–5 working days ({formatPrice(DELIVERY_FEES.outside)}). Free on
              orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}.
            </p>
            <p className="mt-2">
              Exchange any unworn item with tags within 7 days.{' '}
              <Link to="/delivery-returns" className="text-ink underline underline-offset-4">
                Full policy
              </Link>
            </p>
          </AccordionItem>
        </div>
      </div>
    </div>
  )
}
