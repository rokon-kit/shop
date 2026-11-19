import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MAX_QTY, useCart } from '../../context/CartContext'
import type { CartItem } from '../../types'
import { cn } from '../../utils/cn'
import { Price } from '../common/Price'
import { QuantityStepper } from '../common/QuantityStepper'
import { SmartImage } from '../common/SmartImage'

export function CartLine({ item, onNavigate, size = 'sm' }: { item: CartItem; onNavigate?: () => void; size?: 'sm' | 'lg' }) {
  const { updateQuantity, removeItem } = useCart()
  const lg = size === 'lg'
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex gap-4', lg ? 'py-6 sm:gap-6' : 'py-5')}
    >
      <Link to={`/product/${item.slug}`} onClick={onNavigate} className="shrink-0">
        <SmartImage
          src={item.image}
          alt={item.name}
          className={cn('aspect-[4/5]', lg ? 'w-28 sm:w-36' : 'w-24')}
          sizes={lg ? '144px' : '96px'}
          widths={[200, 320]}
          baseWidth={320}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${item.slug}`} onClick={onNavigate} className={cn('block leading-snug hover:underline hover:underline-offset-4', lg ? 'text-[0.9375rem]' : 'text-sm')}>
              {item.name}
            </Link>
            <p className="mt-1.5 text-xs text-smoke">
              {item.color} <span className="mx-1 text-sand">/</span> Size {item.size}
            </p>
          </div>
          <Price price={item.price * item.quantity} originalPrice={item.originalPrice ? item.originalPrice * item.quantity : undefined} className="shrink-0 flex-col items-end gap-0.5 text-right" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper value={item.quantity} onChange={(q) => updateQuantity(item.key, q)} min={1} max={MAX_QTY} size="sm" label={`Quantity of ${item.name}`} />
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="text-xs text-smoke underline decoration-line-strong underline-offset-4 transition-colors hover:text-brick hover:decoration-brick"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.li>
  )
}
