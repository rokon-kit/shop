import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { STATUS_STEPS, type OrderView } from '../../utils/accountOrders'
import { formatDate, formatPrice, pluralize } from '../../utils/format'
import { SmartImage } from '../common/SmartImage'

const tone: Record<string, string> = {
  Processing: 'bg-bone text-ink',
  Shipped: 'bg-bone text-ink',
  'Out for delivery': 'bg-brick text-paper',
  Delivered: 'bg-moss text-paper',
  Exchanged: 'bg-stone text-ink',
  Cancelled: 'bg-line text-smoke',
}

export function OrderStatusTrack({ status }: { status: string }) {
  const idx = STATUS_STEPS.indexOf(status as never)
  if (idx < 0) return null
  return (
    <ol className="grid grid-cols-4 gap-1.5" aria-label={`Order status: ${status}`}>
      {STATUS_STEPS.map((s, i) => (
        <li key={s}>
          <span className={cn('block h-[3px]', i <= idx ? 'bg-ink' : 'bg-line-strong')} />
          <span className={cn('mt-2 block text-[0.6875rem]', i === idx ? 'font-medium text-ink' : 'text-taupe')}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

export function OrderCard({ order, defaultOpen = false }: { order: OrderView; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const count = order.items.reduce((n, i) => n + i.quantity, 0)
  return (
    <article className="border border-line bg-paper">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full flex-wrap items-center gap-4 p-5 text-left sm:flex-nowrap sm:p-6">
        <div className="flex -space-x-4">
          {order.items.slice(0, 3).map((i) => (
            <SmartImage key={i.slug + i.size} src={i.image} alt="" className="aspect-[4/5] w-12 border-2 border-paper" sizes="48px" widths={[120]} baseWidth={120} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{order.id}</p>
          <p className="mt-0.5 text-xs text-smoke">
            {formatDate(order.date)} · {pluralize(count, 'item')} · {formatPrice(order.total)}
          </p>
        </div>
        <span className={cn('label px-2.5 py-1 text-[0.625rem]', tone[order.status])}>{order.status}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} strokeWidth={1.5} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="border-t border-line p-5 sm:p-6">
              <OrderStatusTrack status={order.status} />
              <ul className="mt-6 divide-y divide-line">
                {order.items.map((i) => (
                  <li key={i.slug + i.size + i.color} className="flex items-center gap-4 py-3">
                    <SmartImage src={i.image} alt="" className="aspect-[4/5] w-12 shrink-0" sizes="48px" widths={[120]} baseWidth={120} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${i.slug}`} className="block truncate text-sm hover:underline hover:underline-offset-4">
                        {i.name}
                      </Link>
                      <p className="text-xs text-smoke">
                        {i.color} / {i.size} · Qty {i.quantity}
                      </p>
                    </div>
                    <p className="tabular text-sm">{formatPrice(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 grid gap-4 border-t border-line pt-4 text-xs sm:grid-cols-3">
                <div>
                  <dt className="label text-taupe">Delivered to</dt>
                  <dd className="mt-1 text-smoke">{order.address}</dd>
                </div>
                <div>
                  <dt className="label text-taupe">Payment</dt>
                  <dd className="mt-1 text-smoke">{order.payment}</dd>
                </div>
                <div>
                  <dt className="label text-taupe">Delivery</dt>
                  <dd className="mt-1 text-smoke">{order.delivery ? formatPrice(order.delivery) : 'Free'}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-4 text-xs">
                <Link to={`/track-order?id=${order.id}`} className="underline underline-offset-4">
                  Track parcel
                </Link>
                {order.status === 'Delivered' && (
                  <Link to="/delivery-returns#exchange" className="underline underline-offset-4">
                    Request an exchange
                  </Link>
                )}
                <Link to="/contact" className="text-smoke underline underline-offset-4">
                  Need help?
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
