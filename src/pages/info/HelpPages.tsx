import { MessageCircle, Package, RefreshCcw, Search, Store, Truck } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { OrderStatusTrack } from '../../components/account/OrderCard'
import { Field } from '../../components/checkout/CheckoutFields'
import { AccordionItem } from '../../components/common/Accordion'
import { Button, ButtonLink } from '../../components/common/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { Reveal } from '../../components/common/Reveal'
import { SizeGuideContent } from '../../components/product/SizeGuideContent'
import { contact, faqs } from '../../data/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getAccountOrders } from '../../utils/accountOrders'
import { formatDate, formatPrice } from '../../utils/format'

/* ─────────────────────────── Size guide ─────────────────────────── */
export function SizeGuidePage() {
  useDocumentTitle('Size guide')
  return (
    <div className="pb-20 md:pb-28">
      <PageHeader
        crumb="Size guide"
        eyebrow="Find your fit"
        title="Size guide"
        description="All measurements are garment measurements, taken flat. Cut for South Asian proportions — slightly shorter sleeves and body than most international brands."
      />
      <div className="container-x">
        <SizeGuideContent />
        <div className="mt-16 flex flex-col items-start gap-4 border border-line bg-paper p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div>
            <p className="serif text-3xl">Still unsure?</p>
            <p className="mt-1 text-sm text-smoke">Send us your height, weight and usual size on WhatsApp — we’ll recommend one in minutes.</p>
          </div>
          <ButtonLink to="/contact" variant="secondary" icon={<MessageCircle className="h-4 w-4" strokeWidth={1.5} />}>
            Ask a stylist
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── FAQ ─────────────────────────── */
export function FAQPage() {
  useDocumentTitle('FAQ')
  const [q, setQ] = useState('')
  const groups = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return faqs
    return faqs.map((g) => ({ ...g, items: g.items.filter((i) => (i.q + i.a).toLowerCase().includes(t)) })).filter((g) => g.items.length)
  }, [q])

  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="FAQ" eyebrow="Help centre" title="Questions, answered" description="Delivery, exchanges, sizing and everything in between. Can’t find it? We’re a message away." />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <label htmlFor="faq-search" className="field-label">
              Search help
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-taupe" strokeWidth={1.5} />
              <input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. exchange, bKash" className="field pl-11" />
            </div>
            <nav className="mt-8 hidden space-y-2 lg:block" aria-label="FAQ sections">
              {faqs.map((g) => (
                <a key={g.group} href={`#${g.group.replace(/\W+/g, '-').toLowerCase()}`} className="link-u block text-sm text-smoke hover:text-ink">
                  {g.group}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {groups.length === 0 && <p className="text-sm text-smoke">No answers match “{q}”. Try another word or contact us.</p>}
          {groups.map((g) => (
            <section key={g.group} id={g.group.replace(/\W+/g, '-').toLowerCase()} className="mb-14 scroll-mt-32">
              <h2 className="serif mb-4 text-3xl">{g.group}</h2>
              <div className="border-t border-line">
                {g.items.map((i) => (
                  <AccordionItem key={i.q} title={<span className="normal-case tracking-normal text-[0.9375rem] font-normal">{i.q}</span>} defaultOpen={!!q}>
                    {i.a}
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Delivery & returns ─────────────────────────── */
export function DeliveryReturnsPage() {
  useDocumentTitle('Delivery & returns')
  const rates = [
    { zone: 'Inside Dhaka', time: '1–2 working days', fee: '৳70' },
    { zone: 'Outside Dhaka', time: '3–5 working days', fee: '৳130' },
    { zone: 'Express (Dhaka only)', time: 'Same day, order before 2pm', fee: '৳150' },
    { zone: 'Store pickup', time: 'Next day after 2pm', fee: 'Free' },
  ]
  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Delivery & returns" eyebrow="Service" title="Delivery & exchange" description="Fast delivery across all 64 districts, cash on delivery everywhere, and 7 days to change your mind." />
      <div className="container-x space-y-20">
        <section aria-labelledby="delivery">
          <Reveal className="mb-8 flex items-center gap-3">
            <Truck className="h-5 w-5" strokeWidth={1.3} />
            <h2 id="delivery" className="serif text-4xl">
              Delivery
            </h2>
          </Reveal>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="border-b border-ink text-left">
                  <th scope="col" className="label py-3 font-medium text-smoke">
                    Zone
                  </th>
                  <th scope="col" className="label py-3 font-medium text-smoke">
                    Time
                  </th>
                  <th scope="col" className="label py-3 text-right font-medium text-smoke">
                    Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.zone} className="border-b border-line">
                    <th scope="row" className="py-4 text-left font-medium">
                      {r.zone}
                    </th>
                    <td className="py-4 text-smoke">{r.time}</td>
                    <td className="tabular py-4 text-right">{r.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-smoke">Standard delivery is free on all orders above ৳2,500. Orders placed before 2pm (Saturday–Thursday) leave our studio the same day.</p>
        </section>

        <section id="exchange" aria-labelledby="exchange-title" className="scroll-mt-32">
          <Reveal className="mb-8 flex items-center gap-3">
            <RefreshCcw className="h-5 w-5" strokeWidth={1.3} />
            <h2 id="exchange-title" className="serif text-4xl">
              7-day easy exchange
            </h2>
          </Reveal>
          <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
            {[
              { icon: Package, t: 'Keep the tags on', d: 'Unworn, unwashed, with tags attached — within 7 days of delivery.' },
              { icon: Store, t: 'Visit a store', d: 'Exchange instantly at Banani, Dhanmondi or Chattogram. Always free.' },
              { icon: Truck, t: 'Or send it back', d: `Message us with your order number and we’ll arrange a pickup. ৳70 inside Dhaka, ৳130 outside.` },
            ].map(({ icon: Icon, t, d }, i) => (
              <li key={t} className="bg-ivory p-6 md:p-8">
                <p className="label tabular text-taupe">0{i + 1}</p>
                <Icon className="mt-4 h-5 w-5" strokeWidth={1.3} />
                <h3 className="mt-4 font-medium">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-smoke">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-smoke">
            Items that arrive damaged or incorrect are refunded in full to your original payment method within 5 working days. Change-of-mind returns are
            offered as store credit. Limited-edition pieces may be exchanged for size only, subject to availability.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/contact">Start an exchange</ButtonLink>
            <ButtonLink to="/faq" variant="secondary">
              Read the FAQ
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  )
}

/* ─────────────────────────── Order tracking ─────────────────────────── */
export function TrackOrderPage() {
  useDocumentTitle('Track your order')
  const [params, setParams] = useSearchParams()
  const [id, setId] = useState(params.get('id') ?? '')
  const [phone, setPhone] = useState('')
  const query = params.get('id')
  const order = useMemo(() => (query ? getAccountOrders().find((o) => o.id.toLowerCase() === query.toLowerCase()) : undefined), [query])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (id.trim()) setParams({ id: id.trim() })
  }

  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Track order" eyebrow="Where’s my parcel?" title="Track your order" description="Enter your order number — you’ll find it in your confirmation SMS or email." />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <form onSubmit={submit} className="space-y-5 lg:col-span-4">
          <Field label="Order number" id="t-id" placeholder="SU-260918-4471" value={id} onChange={(e) => setId(e.target.value)} />
          <Field label="Mobile number" id="t-phone" type="tel" placeholder="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button type="submit" full size="lg">
            Track
          </Button>
          <p className="text-xs text-taupe">
            Try <button type="button" className="underline underline-offset-4" onClick={() => setParams({ id: 'SU-260918-4471' })}>SU-260918-4471</button> to see a live example.
          </p>
        </form>
        <div className="lg:col-span-7 lg:col-start-6">
          {query && !order && (
            <div className="border border-line bg-paper p-8">
              <p className="serif text-3xl">We couldn’t find {query}.</p>
              <p className="mt-2 text-sm text-smoke">
                Double-check the number, or call us on {contact.phone}. <Link to="/contact" className="underline underline-offset-4">Contact support</Link>
              </p>
            </div>
          )}
          {order && (
            <div className="border border-line bg-paper p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="label text-taupe">Order</p>
                  <p className="serif text-3xl">{order.id}</p>
                </div>
                <p className="text-sm text-smoke">
                  Placed {formatDate(order.date)} · {formatPrice(order.total)}
                </p>
              </div>
              <div className="mt-8">
                {order.status === 'Exchanged' ? <p className="text-sm">This order was exchanged. Your replacement was delivered.</p> : <OrderStatusTrack status={order.status} />}
              </div>
              <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
                {[
                  { t: 'Order confirmed by phone', d: formatDate(order.date) },
                  ...(order.status !== 'Processing' ? [{ t: 'Handed to courier — Dhaka hub', d: formatDate(new Date(new Date(order.date).getTime() + 864e5).toISOString()) }] : []),
                  ...(order.status === 'Out for delivery' || order.status === 'Delivered' ? [{ t: 'Out for delivery with rider Kamal (01819-XXXXXX)', d: 'Today, 10:42am' }] : []),
                  ...(order.status === 'Delivered' ? [{ t: 'Delivered and signed for', d: formatDate(new Date(new Date(order.date).getTime() + 2 * 864e5).toISOString()) }] : []),
                ]
                  .reverse()
                  .map((e, i) => (
                    <li key={e.t} className="flex gap-4">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? 'bg-brick' : 'bg-stone'}`} />
                      <div className="flex-1">
                        <p className={i === 0 ? 'font-medium' : 'text-smoke'}>{e.t}</p>
                        <p className="text-xs text-taupe">{e.d}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
