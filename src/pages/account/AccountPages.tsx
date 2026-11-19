import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { OrderCard } from '../../components/account/OrderCard'
import { Field, SelectField } from '../../components/checkout/CheckoutFields'
import { Button, ButtonLink } from '../../components/common/Button'
import { Emblem } from '../../components/common/Logo'
import { Modal } from '../../components/common/Modal'
import { ProductCarousel } from '../../components/product/ProductCarousel'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { divisions, sampleAddresses } from '../../data/content'
import { newArrivals } from '../../data/products'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Address } from '../../types'
import { getAccountOrders } from '../../utils/accountOrders'
import { formatDate, formatPrice } from '../../utils/format'
import { isValidBdPhone } from '../../utils/orders'
import { WishlistGrid } from '../WishlistPage'

function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8 md:mb-10">
      <h1 className="display text-5xl md:text-6xl">{title}</h1>
      {sub && <p className="mt-3 text-sm text-smoke">{sub}</p>}
    </div>
  )
}

/* ─────────────────────────── Overview ─────────────────────────── */
export function AccountOverview() {
  useDocumentTitle('My account')
  const { user } = useAuth()
  const { count } = useWishlist()
  const orders = useMemo(() => getAccountOrders(), [])
  const [addresses] = useLocalStorage<Address[]>('suto.addresses', sampleAddresses)
  const latest = orders[0]
  const spent = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
  const points = Math.floor(spent / 100)
  const next = 1000

  return (
    <div>
      <PageTitle title={`Hello, ${user!.name.split(' ')[0]}.`} sub={`Member since ${formatDate(user!.memberSince, { month: 'long', year: 'numeric' })}`} />

      <div className="grid gap-4 md:grid-cols-5">
        {/* Membership card */}
        <div className="grain relative overflow-hidden bg-ink p-6 text-paper md:col-span-3 md:p-8">
          <div className="relative z-[2] flex h-full flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="label text-paper/60">SUTO Circle</p>
                <p className="serif mt-2 text-4xl">Thread member</p>
              </div>
              <Emblem className="h-10 w-10 text-paper" />
            </div>
            <div className="mt-auto pt-10">
              <div className="flex items-baseline justify-between text-sm">
                <span>
                  <span className="serif tabular text-3xl">{points}</span> <span className="text-paper/60">points</span>
                </span>
                <span className="text-xs text-paper/60">{next - points} to Weave tier</span>
              </div>
              <div className="mt-3 h-[3px] bg-paper/20">
                <div className="h-full bg-brick-light" style={{ width: `${Math.min(100, (points / next) * 100)}%` }} />
              </div>
              <p className="mt-3 text-xs text-paper/60">Weave members get free express delivery and early access to every drop.</p>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-px border border-line bg-line md:col-span-2 md:grid-cols-1">
          {[
            { k: orders.length, v: 'Orders', to: '/account/orders' },
            { k: count, v: 'Saved pieces', to: '/account/wishlist' },
            { k: addresses.length, v: 'Addresses', to: '/account/addresses' },
          ].map((s) => (
            <Link key={s.v} to={s.to} className="group flex flex-col justify-between bg-paper p-4 transition-colors hover:bg-ivory md:flex-row md:items-center md:p-5">
              <dt className="order-2 text-xs text-smoke md:order-1">{s.v}</dt>
              <dd className="serif tabular order-1 text-3xl md:order-2">{s.k}</dd>
            </Link>
          ))}
        </dl>
      </div>

      {latest && (
        <section className="mt-12" aria-labelledby="latest-order">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="latest-order" className="label text-xs">
              Latest order
            </h2>
            <Link to="/account/orders" className="label link-u-static">
              All orders
            </Link>
          </div>
          <OrderCard order={latest} defaultOpen />
        </section>
      )}

      <section className="mt-16" aria-label="New for you">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="label text-xs">New for you</h2>
          <Link to="/new-arrivals" className="label link-u-static inline-flex items-center gap-1.5">
            Shop new <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
        <ProductCarousel products={newArrivals().slice(0, 8)} label="New for you" itemClassName="w-[60vw] sm:w-[36vw] md:w-[26vw] lg:w-[18vw]" />
      </section>
    </div>
  )
}

/* ─────────────────────────── Orders ─────────────────────────── */
export function AccountOrders() {
  useDocumentTitle('My orders')
  const orders = useMemo(() => getAccountOrders(), [])
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all')
  const shown = orders.filter((o) => (filter === 'all' ? true : filter === 'active' ? !['Delivered', 'Exchanged', 'Cancelled'].includes(o.status) : ['Delivered', 'Exchanged', 'Cancelled'].includes(o.status)))
  return (
    <div>
      <PageTitle title="Orders" sub="Track parcels, request exchanges and reorder favourites." />
      <div className="mb-6 flex gap-2" role="tablist" aria-label="Filter orders">
        {(['all', 'active', 'past'] as const).map((f) => (
          <button
            key={f}
            role="tab"
            type="button"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`h-9 border px-4 text-xs capitalize transition-colors ${filter === f ? 'border-ink bg-ink text-paper' : 'border-line-strong hover:border-ink'}`}
          >
            {f}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="space-y-3">
          {shown.map((o, i) => (
            <OrderCard key={o.id} order={o} defaultOpen={i === 0 && filter !== 'past'} />
          ))}
        </div>
      ) : (
        <p className="border border-line bg-paper p-8 text-center text-sm text-smoke">No {filter} orders.</p>
      )}
    </div>
  )
}

/* ─────────────────────────── Wishlist ─────────────────────────── */
export function AccountWishlist() {
  useDocumentTitle('Wishlist')
  return (
    <div>
      <PageTitle title="Wishlist" sub="Saved on this device. Sign in on another device to see the same list." />
      <WishlistGrid />
    </div>
  )
}

/* ─────────────────────────── Addresses ─────────────────────────── */
const EMPTY: Address = { id: '', label: 'Home', name: '', phone: '', division: 'Dhaka', district: 'Dhaka', area: '', address: '' }

export function AccountAddresses() {
  useDocumentTitle('Addresses')
  const [addresses, setAddresses] = useLocalStorage<Address[]>('suto.addresses', sampleAddresses)
  const [editing, setEditing] = useState<Address | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useUI()

  const save = (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const errs: Record<string, string> = {}
    if (editing.name.trim().length < 3) errs.name = 'Enter the recipient’s name.'
    if (!isValidBdPhone(editing.phone)) errs.phone = 'Enter a valid mobile number.'
    if (!editing.area.trim()) errs.area = 'Enter area or thana.'
    if (editing.address.trim().length < 6) errs.address = 'Enter house and road.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setAddresses((all) => {
      const isNew = !editing.id
      const next = isNew ? [...all, { ...editing, id: `addr-${Date.now()}`, isDefault: all.length === 0 }] : all.map((a) => (a.id === editing.id ? editing : a))
      return next
    })
    toast({ title: editing.id ? 'Address updated' : 'Address added', description: `${editing.label} — ${editing.area}` })
    setEditing(null)
  }

  const makeDefault = (id: string) => setAddresses((all) => all.map((a) => ({ ...a, isDefault: a.id === id })))
  const remove = (id: string) => setAddresses((all) => all.filter((a) => a.id !== id))

  return (
    <div>
      <PageTitle title="Addresses" sub="Saved addresses appear at checkout so you never type them twice." />
      <ul className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {addresses.map((a) => (
            <motion.li key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <p className="label flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {a.label}
                </p>
                {a.isDefault && <span className="label bg-ink px-2 py-0.5 text-[0.5625rem] text-paper">Default</span>}
              </div>
              <p className="mt-4 text-sm font-medium">{a.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-smoke">
                {a.address}
                <br />
                {a.area}, {a.district}, {a.division}
                <br />
                {a.phone}
              </p>
              <div className="mt-auto flex flex-wrap gap-4 pt-5 text-xs">
                <button type="button" onClick={() => setEditing(a)} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} /> Edit
                </button>
                {!a.isDefault && (
                  <>
                    <button type="button" onClick={() => makeDefault(a.id)} className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline">
                      <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> Set as default
                    </button>
                    <button type="button" onClick={() => remove(a.id)} className="inline-flex items-center gap-1.5 text-smoke underline-offset-4 hover:text-brick hover:underline">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Remove
                    </button>
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        <li>
          <button
            type="button"
            onClick={() => {
              setErrors({})
              setEditing(EMPTY)
            }}
            className="flex h-full min-h-52 w-full flex-col items-center justify-center gap-3 border border-dashed border-line-strong text-sm text-smoke transition-colors hover:border-ink hover:text-ink"
          >
            <Plus className="h-5 w-5" strokeWidth={1.4} /> Add a new address
          </button>
        </li>
      </ul>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit address' : 'New address'}>
        {editing && (
          <form onSubmit={save} noValidate className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
            <fieldset className="sm:col-span-2">
              <legend className="field-label">Label</legend>
              <div className="flex gap-2">
                {['Home', 'Office', 'Other'].map((l) => (
                  <button key={l} type="button" aria-pressed={editing.label === l} onClick={() => setEditing({ ...editing, label: l })} className={`h-9 border px-4 text-xs ${editing.label === l ? 'border-ink bg-ink text-paper' : 'border-line-strong'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
            <Field label="Recipient name" id="addr-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} error={errors.name} />
            <Field label="Mobile number" id="addr-phone" type="tel" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} error={errors.phone} placeholder="01712-345678" />
            <SelectField label="Division" id="addr-division" options={Object.keys(divisions)} value={editing.division} onChange={(e) => setEditing({ ...editing, division: e.target.value, district: '' })} />
            <SelectField label="District" id="addr-district" options={divisions[editing.division] ?? []} value={editing.district} onChange={(e) => setEditing({ ...editing, district: e.target.value })} placeholder="Select district" />
            <Field label="Area / Thana" id="addr-area" value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} error={errors.area} className="sm:col-span-2" />
            <Field label="House, road, flat" id="addr-line" value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} error={errors.address} className="sm:col-span-2" />
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit">Save address</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

/* ─────────────────────────── Profile ─────────────────────────── */
export function AccountProfile() {
  useDocumentTitle('Profile')
  const { user, updateProfile } = useAuth()
  const { toast } = useUI()
  const [form, setForm] = useState({ name: user!.name, email: user!.email, phone: user!.phone })
  const [prefs, setPrefs] = useLocalStorage('suto.prefs', { top: 'M', waist: '32', fit: 'Regular', sms: true, email: true })

  const save = (e: FormEvent) => {
    e.preventDefault()
    updateProfile(form)
    toast({ title: 'Profile saved', description: 'Your details are up to date.' })
  }

  return (
    <div>
      <PageTitle title="Profile" sub="Your details and fit preferences — we use these to recommend sizes." />
      <form onSubmit={save} className="space-y-12">
        <section className="grid gap-5 sm:grid-cols-2">
          <h2 className="label text-xs sm:col-span-2">Personal details</h2>
          <Field label="Full name" id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="sm:col-span-2" />
          <Field label="Email" id="p-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field label="Mobile number" id="p-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          <h2 className="label text-xs sm:col-span-3">My fit</h2>
          <SelectField label="Usual top size" id="p-top" options={['S', 'M', 'L', 'XL', 'XXL']} value={prefs.top} onChange={(e) => setPrefs({ ...prefs, top: e.target.value })} />
          <SelectField label="Waist" id="p-waist" options={['28', '30', '32', '34', '36', '38']} value={prefs.waist} onChange={(e) => setPrefs({ ...prefs, waist: e.target.value })} />
          <SelectField label="Preferred fit" id="p-fit" options={['Slim', 'Regular', 'Relaxed', 'Oversized']} value={prefs.fit} onChange={(e) => setPrefs({ ...prefs, fit: e.target.value })} />
        </section>

        <section className="space-y-3">
          <h2 className="label mb-4 text-xs">Communication</h2>
          {(
            [
              ['sms', 'SMS updates about orders and deliveries'],
              ['email', 'Emails about new drops and private offers'],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="flex cursor-pointer items-center justify-between gap-4 border-b border-line py-3 text-sm">
              {label}
              <input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} className="peer sr-only" />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-stone transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brick after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-paper after:transition-transform peer-checked:after:translate-x-5" aria-hidden="true" />
            </label>
          ))}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <ButtonLink to="/forgot-password" variant="ghost" size="sm" className="-ml-5">
            Change password
          </ButtonLink>
          <Button type="submit" size="lg">
            Save changes
          </Button>
        </div>
      </form>
      <p className="mt-10 text-xs text-taupe">Lifetime spend: {formatPrice(getAccountOrders().reduce((s, o) => s + o.total, 0))}</p>
    </div>
  )
}
