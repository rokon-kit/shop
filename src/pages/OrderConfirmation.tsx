import { motion } from 'framer-motion'
import { Check, MessageSquare, Package, Truck } from 'lucide-react'
import { useMemo } from 'react'
import { ButtonLink } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { SmartImage } from '../components/common/SmartImage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate, formatPrice } from '../utils/format'
import { loadLastOrder, PAYMENT_LABELS } from '../utils/orders'

export default function OrderConfirmation() {
  useDocumentTitle('Order confirmed')
  const order = useMemo(() => loadLastOrder(), [])

  if (!order) {
    return (
      <EmptyState
        title="No recent order."
        description="Once you place an order, its confirmation will appear here."
        action={<ButtonLink to="/shop">Start shopping</ButtonLink>}
      />
    )
  }

  const firstName = order.info.name.split(' ')[0]
  const steps = [
    { icon: MessageSquare, title: 'Confirmation call or SMS', text: `We’ll confirm your order on ${order.info.phone} within the hour.` },
    { icon: Package, title: 'Packed in Banani', text: 'Folded, tissue-wrapped and sealed in our studio.' },
    { icon: Truck, title: order.deliveryMethod === 'pickup' ? 'Ready for pickup' : 'On its way', text: order.eta },
  ]

  return (
    <div className="container-x py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss text-paper"
        >
          <Check className="h-7 w-7" strokeWidth={1.8} />
        </motion.div>
        <p className="label mt-8 text-taupe">Order {order.id}</p>
        <h1 className="display mt-4 text-[clamp(2.75rem,8vw,6rem)]">Thank you, {firstName}.</h1>
        <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed text-smoke">
          Your order is confirmed{order.info.email ? <> — a receipt is on its way to <span className="text-ink">{order.info.email}</span></> : null}. Estimated delivery:{' '}
          <span className="text-ink">{order.eta}</span>.
        </p>
      </div>

      <ol className="mx-auto mt-14 grid max-w-4xl gap-px border border-line bg-line sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="bg-ivory p-6">
            <div className="flex items-center gap-3">
              <span className="tabular label text-taupe">0{i + 1}</span>
              <Icon className="h-4 w-4" strokeWidth={1.4} />
            </div>
            <p className="mt-4 text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-smoke">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-2">
        <div>
          <h2 className="label mb-5 text-xs">Your items</h2>
          <ul className="divide-y divide-line border-y border-line">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center gap-4 py-4">
                <SmartImage src={i.image} alt="" className="aspect-[4/5] w-14 shrink-0" sizes="56px" widths={[160]} baseWidth={160} />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate">{i.name}</p>
                  <p className="text-xs text-smoke">
                    {i.color} / {i.size} · Qty {i.quantity}
                  </p>
                </div>
                <p className="tabular text-sm">{formatPrice(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-smoke">Subtotal</dt>
              <dd className="tabular">{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-moss">
                <dt>Promo</dt>
                <dd className="tabular">−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-smoke">Delivery</dt>
              <dd className="tabular">{order.delivery ? formatPrice(order.delivery) : 'Free'}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd className="tabular">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-6 text-sm">
          <div>
            <h2 className="label mb-2 text-xs">Delivering to</h2>
            <p className="leading-relaxed text-smoke">
              {order.info.name}
              <br />
              {order.info.address}
              <br />
              {order.info.area}, {order.info.district}
            </p>
          </div>
          <div>
            <h2 className="label mb-2 text-xs">Delivery</h2>
            <p className="text-smoke">{order.deliveryLabel}</p>
          </div>
          <div>
            <h2 className="label mb-2 text-xs">Payment</h2>
            <p className="text-smoke">
              {PAYMENT_LABELS[order.payment]}
              {order.payment === 'cod' && ` — please keep ${formatPrice(order.total)} ready`}
            </p>
          </div>
          <div>
            <h2 className="label mb-2 text-xs">Placed</h2>
            <p className="text-smoke">{formatDate(order.date, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <ButtonLink to="/shop">Continue shopping</ButtonLink>
            <ButtonLink to={`/track-order?id=${order.id}`} variant="secondary">
              Track order
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}
