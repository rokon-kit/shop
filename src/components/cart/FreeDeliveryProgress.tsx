import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'
import { FREE_DELIVERY_THRESHOLD } from '../../context/CartContext'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

export function FreeDeliveryProgress({ subtotal, className }: { subtotal: number; className?: string }) {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  return (
    <div className={cn('', className)}>
      <p className="flex items-center gap-2 text-[0.8125rem]">
        <Truck className="h-4 w-4 shrink-0" strokeWidth={1.4} />
        {remaining > 0 ? (
          <span>
            You’re <strong className="tabular font-semibold">{formatPrice(remaining)}</strong> away from free delivery.
          </span>
        ) : (
          <span>
            <strong className="font-semibold">You’ve unlocked free delivery.</strong> Nicely done.
          </span>
        )}
      </p>
      <div
        className="mt-3 h-[3px] w-full overflow-hidden bg-bone"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_DELIVERY_THRESHOLD)}
        aria-label="Progress to free delivery"
      >
        <motion.div
          className={cn('h-full', remaining > 0 ? 'bg-ink' : 'bg-moss')}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
