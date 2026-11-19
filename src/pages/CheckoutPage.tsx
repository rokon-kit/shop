import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, ChevronDown, CreditCard, Loader2, Lock, Pencil, Smartphone, Store, Truck, Wallet, Zap } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PromoCode, Totals } from '../components/cart/OrderSummary'
import { Field, OptionCard, SelectField } from '../components/checkout/CheckoutFields'
import { Button, ButtonLink } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Logo } from '../components/common/Logo'
import { SmartImage } from '../components/common/SmartImage'
import { useAuth } from '../context/AuthContext'
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD, useCart } from '../context/CartContext'
import { dhakaAreas, divisions, sampleAddresses, stores } from '../data/content'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { DeliveryMethod, PaymentMethod, ShippingInfo } from '../types'
import { cn } from '../utils/cn'
import { deliveryWindow, formatPrice, pluralize } from '../utils/format'
import { isValidBdPhone, newOrderId, PAYMENT_LABELS, saveOrder } from '../utils/orders'

const STEPS = ['Information', 'Delivery', 'Payment', 'Review'] as const

const EMPTY_INFO: ShippingInfo = { name: '', phone: '', email: '', division: '', district: '', area: '', address: '', note: '' }

type Errors = Partial<Record<string, string>>

function formatCard(v: string) {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, subtotal, promoDiscount, count, clear } = useCart()

  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [info, setInfo] = useLocalStorage<ShippingInfo>('suto.checkout', EMPTY_INFO)
  const [method, setMethod] = useState<DeliveryMethod>('standard')
  const [pickup, setPickup] = useState(stores[0].name)
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [wallet, setWallet] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [placing, setPlacing] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  // Prefill for signed-in members
  useEffect(() => {
    if (user && !info.name) {
      const a = sampleAddresses[0]
      setInfo({ ...EMPTY_INFO, name: user.name, phone: user.phone, email: user.email, division: a.division, district: a.district, area: a.area, address: a.address })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const insideDhaka = info.district === 'Dhaka'
  const free = subtotal >= FREE_DELIVERY_THRESHOLD

  const deliveryFee = useMemo(() => {
    if (step === 0 && reached === 0) return null
    if (method === 'pickup') return 0
    if (method === 'express') return 150
    if (free) return 0
    return insideDhaka ? DELIVERY_FEES.inside : DELIVERY_FEES.outside
  }, [method, free, insideDhaka, step, reached])

  useEffect(() => {
    if (!insideDhaka && method === 'express') setMethod('standard')
  }, [insideDhaka, method])

  const set = (k: keyof ShippingInfo) => (e: { target: { value: string } }) => {
    setInfo((prev) => ({ ...prev, [k]: e.target.value, ...(k === 'division' ? { district: '' } : {}) }))
    setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const validate = (s: number): Errors => {
    const e: Errors = {}
    if (s === 0) {
      if (info.name.trim().length < 3) e.name = 'Please enter your full name.'
      if (!isValidBdPhone(info.phone)) e.phone = 'Enter a valid Bangladeshi mobile number, e.g. 01712-345678.'
      if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) e.email = 'That email doesn’t look right.'
      if (!info.division) e.division = 'Choose your division.'
      if (!info.district) e.district = 'Choose your district.'
      if (!info.area.trim()) e.area = 'Enter your area or thana.'
      if (info.address.trim().length < 8) e.address = 'Add house, road and any landmark so our rider can find you.'
    }
    if (s === 2) {
      if ((payment === 'bkash' || payment === 'nagad') && !isValidBdPhone(wallet)) e.wallet = `Enter the ${PAYMENT_LABELS[payment]} account number.`
      if (payment === 'card') {
        if (card.number.replace(/\s/g, '').length < 15) e.cardNumber = 'Enter a valid card number.'
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'MM/YY'
        if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = '3–4 digits'
        if (!card.name.trim()) e.cardName = 'Name on card'
      }
    }
    if (s === 3 && !agree) e.agree = 'Please accept the terms to place your order.'
    return e
  }

  const next = (e?: FormEvent) => {
    e?.preventDefault()
    const errs = validate(step)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(first === 'cardNumber' ? 'card-number' : first)?.focus()
      return
    }
    const n = step + 1
    setStep(n)
    setReached((r) => Math.max(r, n))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deliveryLabel =
    method === 'pickup'
      ? `Store pickup — ${pickup}`
      : method === 'express'
        ? 'Express — same day (order before 2pm)'
        : `Standard — ${insideDhaka ? '1–2' : '3–5'} working days`

  const place = () => {
    const errs = validate(3)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setPlacing(true)
    const fee = deliveryFee ?? 0
    const order = {
      id: newOrderId(),
      date: new Date().toISOString(),
      items,
      subtotal,
      discount: promoDiscount,
      delivery: fee,
      total: subtotal - promoDiscount + fee,
      info,
      deliveryMethod: method,
      deliveryLabel,
      payment,
      eta: method === 'pickup' ? 'Ready for pickup tomorrow after 2pm' : method === 'express' ? 'Today, by 10pm' : deliveryWindow(insideDhaka),
    }
    window.setTimeout(() => {
      saveOrder(order)
      clear()
      navigate('/order-confirmation', { replace: true })
    }, 1400)
  }

  if (items.length === 0 && !placing) {
    return (
      <div className="min-h-screen">
        <CheckoutHeader />
        <EmptyState
          title="Nothing to check out."
          description="Your bag is empty — add something you love and come back."
          action={<ButtonLink to="/shop">Continue shopping</ButtonLink>}
        />
      </div>
    )
  }

  const total = subtotal - promoDiscount + (deliveryFee ?? 0)

  return (
    <div className="min-h-screen bg-ivory">
      <CheckoutHeader />

      {/* Mobile summary toggle */}
      <div className="border-b border-line bg-paper lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} className="container-x flex h-14 w-full items-center justify-between text-sm" aria-expanded={summaryOpen}>
          <span className="flex items-center gap-2">
            {summaryOpen ? 'Hide' : 'Show'} order summary <ChevronDown className={cn('h-4 w-4 transition-transform', summaryOpen && 'rotate-180')} strokeWidth={1.5} />
          </span>
          <span className="tabular font-medium">{formatPrice(total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="container-x pb-6">
                <Summary deliveryFee={deliveryFee} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container-x grid gap-12 py-8 md:py-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* Stepper */}
          <nav aria-label="Checkout progress">
            <ol className="grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => {
                const done = i < step
                const current = i === step
                const reachable = i <= reached
                return (
                  <li key={s}>
                    <button
                      type="button"
                      disabled={!reachable || placing}
                      onClick={() => setStep(i)}
                      aria-current={current ? 'step' : undefined}
                      className="group w-full text-left disabled:cursor-default"
                    >
                      <span className={cn('block h-[2px] transition-colors duration-500', i <= step ? 'bg-ink' : 'bg-line-strong')} />
                      <span className={cn('label mt-3 flex items-center gap-1.5 text-[0.625rem] sm:text-2xs', current ? 'text-ink' : done ? 'text-smoke group-hover:text-ink' : 'text-sand')}>
                        {done ? <Check className="h-3 w-3" strokeWidth={2} /> : <span className="tabular">0{i + 1}</span>}
                        <span className="truncate">{s}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-10">
              {step === 0 && (
                <form onSubmit={next} noValidate>
                  <StepTitle n={1} title="Where should we deliver?" sub={user ? `Signed in as ${user.email}` : <>Have an account? <Link to="/login?next=/checkout" className="text-ink underline underline-offset-4">Sign in</Link> for faster checkout.</>} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" name="name" id="name" required autoComplete="name" value={info.name} onChange={set('name')} error={errors.name} className="sm:col-span-2" />
                    <Field label="Mobile number" name="phone" id="phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="01712-345678" value={info.phone} onChange={set('phone')} error={errors.phone} hint="Our rider will call this number." />
                    <Field label="Email" name="email" id="email" type="email" autoComplete="email" placeholder="For your receipt (optional)" value={info.email} onChange={set('email')} error={errors.email} />
                    <SelectField label="Division" name="division" id="division" required options={Object.keys(divisions)} value={info.division} onChange={set('division')} error={errors.division} placeholder="Select division" />
                    <SelectField
                      label="District"
                      name="district"
                      id="district"
                      required
                      options={info.division ? divisions[info.division] : []}
                      value={info.district}
                      onChange={set('district')}
                      error={errors.district}
                      disabled={!info.division}
                      placeholder={info.division ? 'Select district' : 'Choose division first'}
                    />
                    <Field
                      label="Area / Thana"
                      name="area"
                      id="area"
                      required
                      list={insideDhaka ? 'dhaka-areas' : undefined}
                      placeholder={insideDhaka ? 'e.g. Dhanmondi' : 'Area or thana'}
                      value={info.area}
                      onChange={set('area')}
                      error={errors.area}
                      className="sm:col-span-2"
                    />
                    <datalist id="dhaka-areas">
                      {dhakaAreas.map((a) => (
                        <option key={a} value={a} />
                      ))}
                    </datalist>
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="field-label">
                        Full address<span className="text-brick"> *</span>
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        autoComplete="street-address"
                        placeholder="House, road, flat, and a landmark — e.g. House 18, Road 7, Flat 4B, opposite Banani Lake Park"
                        value={info.address}
                        onChange={set('address')}
                        aria-invalid={!!errors.address}
                        aria-describedby={errors.address ? 'address-msg' : undefined}
                        className="field resize-none"
                      />
                      {errors.address && (
                        <p id="address-msg" className="mt-1.5 text-xs text-brick" role="alert">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <Field label="Delivery note" name="note" id="note" placeholder="Optional — e.g. call before arriving" value={info.note} onChange={set('note')} className="sm:col-span-2" />
                  </div>
                  <StepActions onBack={() => navigate('/cart')} backLabel="Back to bag" nextLabel="Continue to delivery" />
                </form>
              )}

              {step === 1 && (
                <form onSubmit={next} noValidate>
                  <StepTitle n={2} title="How would you like it?" sub={`Delivering to ${info.area}, ${info.district}`} />
                  <div className="space-y-3">
                    <OptionCard
                      name="delivery"
                      value="standard"
                      checked={method === 'standard'}
                      onChange={(v) => setMethod(v as DeliveryMethod)}
                      title={
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4" strokeWidth={1.5} /> Standard delivery
                        </span>
                      }
                      description={`${insideDhaka ? 'Inside Dhaka · 1–2 working days' : 'Outside Dhaka · 3–5 working days'} — arrives ${deliveryWindow(insideDhaka)}`}
                      aside={free ? 'Free' : formatPrice(insideDhaka ? DELIVERY_FEES.inside : DELIVERY_FEES.outside)}
                    />
                    <OptionCard
                      name="delivery"
                      value="express"
                      checked={method === 'express'}
                      disabled={!insideDhaka}
                      onChange={(v) => setMethod(v as DeliveryMethod)}
                      title={
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4" strokeWidth={1.5} /> Express — same day
                        </span>
                      }
                      description={insideDhaka ? 'Order before 2pm, delivered by 10pm tonight.' : 'Available inside Dhaka only.'}
                      aside={formatPrice(150)}
                    />
                    <OptionCard
                      name="delivery"
                      value="pickup"
                      checked={method === 'pickup'}
                      onChange={(v) => setMethod(v as DeliveryMethod)}
                      title={
                        <span className="flex items-center gap-2">
                          <Store className="h-4 w-4" strokeWidth={1.5} /> Pick up in store
                        </span>
                      }
                      description="Ready the next day after 2pm. Try on before you take it home."
                      aside="Free"
                    >
                      <fieldset className="space-y-2">
                        <legend className="sr-only">Choose a store</legend>
                        {stores.map((s) => (
                          <label key={s.name} className="flex cursor-pointer items-start gap-3 text-sm">
                            <input type="radio" name="store" checked={pickup === s.name} onChange={() => setPickup(s.name)} className="mt-1 accent-ink" />
                            <span>
                              {s.name}
                              <span className="block text-xs text-smoke">{s.address}</span>
                            </span>
                          </label>
                        ))}
                      </fieldset>
                    </OptionCard>
                  </div>
                  {!free && method === 'standard' && (
                    <p className="mt-4 text-xs text-smoke">Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free standard delivery.</p>
                  )}
                  <StepActions onBack={() => setStep(0)} nextLabel="Continue to payment" />
                </form>
              )}

              {step === 2 && (
                <form onSubmit={next} noValidate>
                  <StepTitle n={3} title="How would you like to pay?" sub="This is a prototype — no payment will be taken." />
                  <div className="space-y-3">
                    <OptionCard
                      name="payment"
                      value="cod"
                      checked={payment === 'cod'}
                      onChange={(v) => setPayment(v as PaymentMethod)}
                      title={
                        <span className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" strokeWidth={1.5} /> Cash on Delivery
                        </span>
                      }
                      description="Pay the rider in cash when your parcel arrives. Check it before you pay."
                    />
                    {(['bkash', 'nagad'] as const).map((w) => (
                      <OptionCard
                        key={w}
                        name="payment"
                        value={w}
                        checked={payment === w}
                        onChange={(v) => setPayment(v as PaymentMethod)}
                        title={
                          <span className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" strokeWidth={1.5} /> {PAYMENT_LABELS[w]}
                          </span>
                        }
                        description={`Approve the payment in your ${PAYMENT_LABELS[w]} app. Instant confirmation.`}
                      >
                        <Field
                          label={`${PAYMENT_LABELS[w]} account number`}
                          name="wallet"
                          id="wallet"
                          type="tel"
                          inputMode="tel"
                          placeholder="01XXX-XXXXXX"
                          value={wallet}
                          onChange={(e) => {
                            setWallet(e.target.value)
                            setErrors((p) => ({ ...p, wallet: undefined }))
                          }}
                          error={errors.wallet}
                          hint={`You’ll receive a ${PAYMENT_LABELS[w]} prompt to enter your PIN.`}
                        />
                      </OptionCard>
                    ))}
                    <OptionCard
                      name="payment"
                      value="card"
                      checked={payment === 'card'}
                      onChange={(v) => setPayment(v as PaymentMethod)}
                      title={
                        <span className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" strokeWidth={1.5} /> Credit or debit card
                        </span>
                      }
                      description="Visa, Mastercard and American Express. 3D Secure."
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Field
                          label="Card number"
                          name="cardNumber"
                          id="card-number"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="1234 5678 9012 3456"
                          value={card.number}
                          onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                          error={errors.cardNumber}
                          className="col-span-2"
                        />
                        <Field label="Expiry" name="expiry" id="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} error={errors.expiry} />
                        <Field label="CVC" name="cvc" id="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} error={errors.cvc} />
                        <Field label="Name on card" name="cardName" id="cardName" autoComplete="cc-name" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} error={errors.cardName} className="col-span-2" />
                      </div>
                    </OptionCard>
                  </div>
                  <div className="mt-8 lg:hidden">
                    <PromoCode />
                  </div>
                  <StepActions onBack={() => setStep(1)} nextLabel="Review order" />
                </form>
              )}

              {step === 3 && (
                <div>
                  <StepTitle n={4} title="Review & place order" sub="Please check everything before placing your order." />
                  <dl className="divide-y divide-line border-y border-line text-sm">
                    <ReviewRow label="Contact" onEdit={() => setStep(0)}>
                      {info.name} · {info.phone}
                      {info.email && <span className="block text-smoke">{info.email}</span>}
                    </ReviewRow>
                    <ReviewRow label="Ship to" onEdit={() => setStep(0)}>
                      {info.address}, {info.area}, {info.district}, {info.division}
                    </ReviewRow>
                    <ReviewRow label="Delivery" onEdit={() => setStep(1)}>
                      {deliveryLabel} · {deliveryFee ? formatPrice(deliveryFee) : 'Free'}
                    </ReviewRow>
                    <ReviewRow label="Payment" onEdit={() => setStep(2)}>
                      {PAYMENT_LABELS[payment]}
                      {payment === 'card' && card.number && <span className="text-smoke"> ending {card.number.replace(/\s/g, '').slice(-4)}</span>}
                      {(payment === 'bkash' || payment === 'nagad') && <span className="text-smoke"> · {wallet}</span>}
                    </ReviewRow>
                  </dl>

                  <ul className="mt-8 space-y-4">
                    {items.map((i) => (
                      <li key={i.key} className="flex items-center gap-4">
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

                  <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked)
                        setErrors((p) => ({ ...p, agree: undefined }))
                      }}
                      className="mt-0.5 h-4 w-4 accent-ink"
                      id="agree"
                      aria-invalid={!!errors.agree}
                    />
                    <span>
                      I agree to the{' '}
                      <Link to="/faq" className="underline underline-offset-4">
                        terms of sale
                      </Link>{' '}
                      and{' '}
                      <Link to="/delivery-returns" className="underline underline-offset-4">
                        exchange policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="mt-2 text-xs text-brick" role="alert">
                      {errors.agree}
                    </p>
                  )}

                  <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => setStep(2)} className="label inline-flex items-center gap-2 text-smoke hover:text-ink" disabled={placing}>
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back
                    </button>
                    <Button size="lg" onClick={place} disabled={placing} className="sm:min-w-72">
                      {placing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Placing order…
                        </span>
                      ) : (
                        `Place order — ${formatPrice(total)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="hidden lg:col-span-5 lg:block" aria-label="Order summary">
          <div className="sticky top-8 bg-paper p-7">
            <h2 className="label mb-6 text-xs">
              Order summary <span className="text-taupe">· {pluralize(count, 'item')}</span>
            </h2>
            <Summary deliveryFee={deliveryFee} withPromo />
          </div>
        </aside>
      </div>
    </div>
  )
}

function CheckoutHeader() {
  return (
    <header className="border-b border-line bg-ivory">
      <div className="container-x grid h-16 grid-cols-3 items-center">
        <Link to="/cart" className="label inline-flex items-center gap-2 text-smoke hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> <span className="hidden sm:inline">Back to bag</span>
        </Link>
        <Link to="/" className="justify-self-center" aria-label="SUTO home">
          <Logo className="text-2xl" />
        </Link>
        <span className="label inline-flex items-center gap-2 justify-self-end text-smoke">
          <Lock className="h-3.5 w-3.5" strokeWidth={1.5} /> <span className="hidden sm:inline">Secure checkout</span>
        </span>
      </div>
    </header>
  )
}

function Summary({ deliveryFee, withPromo }: { deliveryFee: number | null; withPromo?: boolean }) {
  const { items } = useCart()
  return (
    <div className="space-y-6">
      <ul className="max-h-[22rem] space-y-4 overflow-y-auto pt-2 pr-2">
        {items.map((i) => (
          <li key={i.key} className="flex items-center gap-4">
            <div className="relative shrink-0">
              <SmartImage src={i.image} alt="" className="aspect-[4/5] w-16" sizes="64px" widths={[160]} baseWidth={160} />
              <span className="tabular absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] text-paper">{i.quantity}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{i.name}</p>
              <p className="text-xs text-smoke">
                {i.color} / {i.size}
              </p>
            </div>
            <p className="tabular text-sm">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      {withPromo && <PromoCode />}
      <Totals delivery={deliveryFee} />
    </div>
  )
}

function StepTitle({ n, title, sub }: { n: number; title: string; sub?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="label tabular text-taupe">Step 0{n}</p>
      <h1 className="serif mt-2 text-4xl leading-tight md:text-5xl">{title}</h1>
      {sub && <p className="mt-2 text-sm text-smoke">{sub}</p>}
    </div>
  )
}

function StepActions({ onBack, backLabel = 'Back', nextLabel }: { onBack: () => void; backLabel?: string; nextLabel: string }) {
  return (
    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" onClick={onBack} className="label inline-flex items-center gap-2 self-start text-smoke hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> {backLabel}
      </button>
      <Button type="submit" size="lg" className="sm:min-w-64">
        {nextLabel}
      </Button>
    </div>
  )
}

function ReviewRow({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="grid grid-cols-[6rem_1fr_auto] items-start gap-4 py-4">
      <dt className="label pt-0.5 text-taupe">{label}</dt>
      <dd className="min-w-0 leading-relaxed">{children}</dd>
      <button type="button" onClick={onEdit} className="grid h-8 w-8 place-items-center text-smoke hover:bg-bone hover:text-ink" aria-label={`Edit ${label.toLowerCase()}`}>
        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}
