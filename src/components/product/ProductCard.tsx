import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { collectionName } from '../../data/categories'
import { isLowStock, isSoldOut } from '../../data/products'
import type { Product, Size } from '../../types'
import { cn } from '../../utils/cn'
import { Badge } from '../common/Badge'
import { Price } from '../common/Price'
import { SmartImage } from '../common/SmartImage'
import { ColorSelector } from './ColorSelector'
import { WishlistButton } from './WishlistButton'

interface ProductCardProps {
  product: Product
  priority?: boolean
  sizes?: string
  aspect?: string
  showCollection?: boolean
  className?: string
}

export function ProductCard({
  product,
  priority,
  sizes = '(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw',
  aspect = 'aspect-[4/5]',
  showCollection = false,
  className,
}: ProductCardProps) {
  const { addItem } = useCart()
  const { openQuickAdd, toast } = useUI()
  const [color, setColor] = useState(product.colors[0]?.name ?? '')
  const [previewColor, setPreviewColor] = useState<string | null>(null)
  const [added, setAdded] = useState<Size | null>(null)

  const soldOut = isSoldOut(product)
  const shown = product.colors.find((c) => c.name === (previewColor ?? color))
  const images = shown?.images ?? product.images
  const [primary, secondary] = images

  const href = `/product/${product.slug}${color && color !== product.colors[0]?.name ? `?color=${encodeURIComponent(color)}` : ''}`

  const quickAdd = (size: Size) => {
    addItem(product, { size, color }, false)
    setAdded(size)
    toast({ title: 'Added to bag', description: `${product.name} — ${color}, ${size}`, image: primary, action: { label: 'View bag', to: '/cart' } })
    window.setTimeout(() => setAdded(null), 1600)
  }

  return (
    <article className={cn('group/card relative', className)}>
      <div className={cn('relative overflow-hidden bg-bone', aspect)}>
        <Link to={href} className="absolute inset-0 block" aria-label={product.name} tabIndex={-1}>
          <SmartImage
            src={primary}
            alt={`${product.name} in ${shown?.name ?? color}`}
            className="absolute inset-0"
            imgClassName={cn(
              'transition-[transform,opacity] duration-[1.1s] ease-[var(--ease-out-expo)] group-hover/card:scale-[1.035]',
              soldOut && 'opacity-70 grayscale-[35%]',
            )}
            sizes={sizes}
            priority={priority}
          />
          {secondary && !soldOut && (
            <SmartImage
              src={secondary}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 bg-transparent opacity-0 transition-opacity duration-700 ease-out pointer-fine:group-hover/card:opacity-100"
              imgClassName="scale-[1.035] transition-transform duration-[1.1s] ease-[var(--ease-out-expo)]"
              sizes={sizes}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <Badge tone="sold">Sold out</Badge>
          ) : (
            <>
              {product.discount && <Badge tone="sale">−{product.discount}%</Badge>}
              {product.limited && <Badge tone="limited">Limited</Badge>}
              {product.newArrival && !product.discount && !product.limited && <Badge tone="new">New</Badge>}
            </>
          )}
        </div>

        <WishlistButton product={product} className="absolute top-2 right-2" />

        {/* Desktop quick add — pick a size straight from the card */}
        {!soldOut && (
          <div className="absolute inset-x-2 bottom-2 hidden translate-y-[calc(100%+0.5rem)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within/card:translate-y-0 group-hover/card:translate-y-0 pointer-fine:block">
            <div className="bg-paper/95 p-3 backdrop-blur-sm">
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.p
                    key="added"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="label flex h-[3.25rem] items-center justify-center gap-2 text-ink"
                  >
                    <Check className="h-4 w-4" strokeWidth={1.5} /> Added — size {added}
                  </motion.p>
                ) : (
                  <motion.div key="sizes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="label mb-2 text-center text-[0.625rem] text-taupe">Quick add</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.sizes.map((s) => {
                        const out = product.soldOutSizes?.includes(s)
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={out}
                            onClick={() => quickAdd(s)}
                            className="tabular h-7 min-w-8 px-1.5 text-xs transition-colors hover:bg-ink hover:text-paper disabled:text-sand disabled:line-through disabled:hover:bg-transparent"
                            aria-label={`Add ${product.name}, size ${s}${out ? ' (sold out)' : ''}`}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Touch quick add */}
        {!soldOut && (
          <button
            type="button"
            onClick={() => openQuickAdd(product.id)}
            className="absolute right-2 bottom-2 grid h-9 w-9 place-items-center bg-paper/90 text-ink backdrop-blur-sm active:scale-95 pointer-fine:hidden"
            aria-label={`Quick add ${product.name}`}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1.5 md:mt-4">
        {showCollection && <p className="label text-[0.625rem] text-taupe">{collectionName(product.collection)}</p>}
        <h3 className="text-[0.8125rem] leading-snug sm:text-sm">
          <Link to={href} className="hover:underline hover:decoration-line-strong hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} originalPrice={product.originalPrice} />
        <div className="mt-1 flex min-h-5 items-center justify-between gap-2">
          {product.colors.length > 1 ? (
            <div className="flex items-center gap-2">
              <ColorSelector colors={product.colors} value={color} onChange={setColor} onHover={setPreviewColor} size="sm" showLabel={false} />
            </div>
          ) : (
            <span className="text-xs text-taupe">{product.colors[0]?.name}</span>
          )}
          {isLowStock(product) && <span className="text-[0.6875rem] text-brick">Only {product.stock} left</span>}
        </div>
      </div>
    </article>
  )
}
