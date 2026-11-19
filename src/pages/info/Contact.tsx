import { Check, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Field, SelectField } from '../../components/checkout/CheckoutFields'
import { Button } from '../../components/common/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { contact } from '../../data/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Contact')
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: 'An order', order: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Your name, please.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (form.message.trim().length < 10) errs.message = 'Tell us a little more (10+ characters).'
    setErrors(errs)
    if (!Object.keys(errs).length) setSent(true)
  }

  const channels = [
    { icon: Phone, label: 'Call', value: contact.phone, href: `tel:${contact.phone.replace(/[^+\d]/g, '')}` },
    { icon: MessageCircle, label: 'WhatsApp', value: contact.whatsapp, href: 'https://wa.me/8801711786786' },
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: 'Studio', value: contact.studio },
    { icon: Clock, label: 'Hours', value: contact.hours },
  ]

  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Contact" eyebrow="We reply within the hour" title="Talk to us" description="Sizing questions, order help, or just want to know if the rust overshirt runs big? A real person in Banani will answer." />
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <ul className="space-y-px lg:col-span-4">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex gap-4 border-t border-line py-5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.3} />
              <div>
                <p className="label text-taupe">{label}</p>
                {href ? (
                  <a href={href} className="link-u mt-1 inline-block text-[0.9375rem]">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-[0.9375rem]">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-7 lg:col-start-6">
          {sent ? (
            <div className="border border-line bg-paper p-8" role="status">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-moss text-paper">
                <Check className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h2 className="serif mt-6 text-4xl">Message received.</h2>
              <p className="mt-3 text-sm text-smoke">Thanks, {form.name.split(' ')[0]}. We’ll reply to {form.email} shortly — usually within an hour during studio hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <Field label="Email" id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <SelectField label="Topic" id="c-topic" options={['An order', 'Sizing & fit', 'Exchange or return', 'Stores', 'Press & partnerships', 'Something else']} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
              <Field label="Order number" id="c-order" placeholder="Optional — e.g. SU-260918-4471" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="field-label">
                  Message<span className="text-brick"> *</span>
                </label>
                <textarea id="c-message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} className="field resize-none" />
                {errors.message && <p className="mt-1.5 text-xs text-brick">{errors.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">
                  Send message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
