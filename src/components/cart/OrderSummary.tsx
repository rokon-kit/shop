import { AnimatePresence, motion } from 'framer-motion'
import { Check, Tag, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useCart } from '../../context/CartContext'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'

/** Promo code input shared by the bag page and checkout. */
export function PromoCode({ className }: { className?: string }) {
  const { promo, applyPromo, removePromo } = useCart()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  // Not a <form>: this sits inside checkout step forms, and forms can't nest
  const submit = () => {
    const res = applyPromo(code)
    setMessage({ ok: res.ok, text: res.message })
    if (res.ok) setCode('')
  }

  if (promo) {
    return (
      <div className={cn('flex items-center justify-between border border-dashed border-moss/60 bg-moss/5 px-4 py-3 text-sm', className)}>
        <span className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-moss" strokeWidth={1.5} />
          <span className="font-medium tracking-wide">{promo}</span> applied
        </span>
        <button type="button" onClick={removePromo} className="grid h-8 w-8 place-items-center hover:bg-bone" aria-label={`Remove promo code ${promo}`}>
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  return (
    <div className={className} role="group" aria-labelledby="promo-label">
      <label htmlFor="promo" id="promo-label" className="field-label">
        Promo code
      </label>
      <div className="flex">
        <input
          id="promo"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setMessage(null)
          }}
          placeholder="e.g. FIRSTTHREAD"
          className="field h-12 border-r-0 py-0 uppercase placeholder:normal-case"
          aria-invalid={message ? !message.ok : undefined}
          aria-describedby="promo-msg"
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submit()
            }
          }}
        />
        <button type="button" onClick={submit} className="label h-12 shrink-0 border border-ink bg-ink px-5 text-paper hover:bg-graphite">
          Apply
        </button>
      </div>
      <AnimatePresence>
        {message && (
          <motion.p
            id="promo-msg"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('mt-2 flex items-center gap-1.5 text-xs', message.ok ? 'text-moss' : 'text-brick')}
            role="status"
          >
            {message.ok && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
            {message.text}
          </motion.p>
        )}
      </AnimatePresence>
      {!message && <p className="mt-2 text-xs text-taupe">Try FIRSTTHREAD for 10% off, or SUTO200.</p>}
    </div>
  )
}

interface TotalsProps {
  delivery: number | null
  deliveryLabel?: string
  children?: ReactNode
}

/** Subtotal / savings / promo / delivery / total stack. */
export function Totals({ delivery, deliveryLabel = 'Delivery', children }: TotalsProps) {
  const { subtotal, savings, promo, promoDiscount } = useCart()
  const total = subtotal - promoDiscount + (delivery ?? 0)
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-smoke">Subtotal</dt>
        <dd className="tabular">{formatPrice(subtotal)}</dd>
      </div>
      {promo && promoDiscount > 0 && (
        <div className="flex justify-between text-moss">
          <dt>Promo ({promo})</dt>
          <dd className="tabular">−{formatPrice(promoDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-smoke">{deliveryLabel}</dt>
        <dd className="tabular">{delivery === null ? 'Calculated next' : delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
      </div>
      {children}
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="label text-xs">Total</dt>
        <dd className="tabular text-xl font-medium">{formatPrice(total)}</dd>
      </div>
      <p className="flex justify-between gap-4 text-[0.6875rem] text-taupe">
        <span className="text-brick">{savings + promoDiscount > 0 && `You’re saving ${formatPrice(savings + promoDiscount)}`}</span>
        <span>Inclusive of VAT</span>
      </p>
    </dl>
  )
}
