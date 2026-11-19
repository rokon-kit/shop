import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react'
import { ButtonLink } from '../../components/common/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { ImageReveal, Reveal } from '../../components/common/Reveal'
import { SmartImage } from '../../components/common/SmartImage'
import { journal, stores } from '../../data/content'
import { photo } from '../../data/photos'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatDate } from '../../utils/format'

export function StoresPage() {
  useDocumentTitle('Stores')
  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Stores" eyebrow="Come and try it on" title="Our stores" description="Three stores, one studio. Free alterations, free exchanges, and someone who knows exactly how each piece fits." />
      <ul className="container-x space-y-16 md:space-y-24">
        {stores.map((s, i) => (
          <li key={s.name} className="grid items-center gap-8 md:grid-cols-12">
            <div className={`md:col-span-7 ${i % 2 ? 'md:order-2 md:col-start-6' : ''}`}>
              <ImageReveal className="aspect-[16/10]">
                <SmartImage src={s.image} alt={`Inside ${s.name}`} className="h-full w-full" sizes="(min-width: 768px) 58vw, 100vw" />
              </ImageReveal>
            </div>
            <Reveal className={`md:col-span-4 ${i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-9'}`}>
              <p className="label tabular text-taupe">0{i + 1}</p>
              <h2 className="serif mt-3 text-4xl leading-tight">{s.name}</h2>
              <p className="mt-3 text-sm text-smoke">{s.note}</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                  {s.address}
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                  {s.hours}
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
                  <a href={`tel:${s.phone.replace(/[^+\d]/g, '')}`} className="link-u">
                    {s.phone}
                  </a>
                </li>
              </ul>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="label link-u-static mt-8 inline-flex items-center gap-2">
                Get directions <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function JournalPage() {
  useDocumentTitle('Journal')
  const [lead, ...rest] = journal
  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Journal" eyebrow="Stories from the studio" title="Journal" description="Notes on making clothes in Dhaka — the fabrics, the workshops, and the people who wear them." />
      <div className="container-x">
        <article className="group grid gap-8 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <ImageReveal className="aspect-[4/3]">
              <SmartImage src={lead.image} alt="" className="h-full w-full" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" sizes="(min-width: 768px) 58vw, 100vw" />
            </ImageReveal>
          </div>
          <Reveal className="md:col-span-4 md:col-start-9 md:self-end">
            <p className="label text-taupe">
              {formatDate(lead.date)} · {lead.read} read
            </p>
            <h2 className="serif mt-4 text-4xl leading-tight md:text-5xl">{lead.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-smoke">{lead.excerpt}</p>
            <p className="label mt-6 text-taupe">Full story coming soon</p>
          </Reveal>
        </article>
        <ul className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2">
          {rest.map((j) => (
            <Reveal as="li" key={j.slug} className="group">
              <ImageReveal className="aspect-[3/2]">
                <SmartImage src={j.image} alt="" className="h-full w-full" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" sizes="(min-width: 640px) 45vw, 100vw" />
              </ImageReveal>
              <p className="label mt-5 text-taupe">
                {formatDate(j.date)} · {j.read} read
              </p>
              <h3 className="serif mt-2 text-3xl">{j.title}</h3>
              <p className="mt-2 text-sm text-smoke">{j.excerpt}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function CareersPage() {
  useDocumentTitle('Careers')
  const roles = [
    { title: 'Senior Pattern Cutter', team: 'Design', place: 'Banani studio', type: 'Full-time' },
    { title: 'Store Stylist', team: 'Retail', place: 'Dhanmondi', type: 'Full-time' },
    { title: 'Customer Care Associate', team: 'Service', place: 'Banani / hybrid', type: 'Full-time' },
    { title: 'Content Producer', team: 'Brand', place: 'Banani studio', type: 'Contract' },
  ]
  return (
    <div className="pb-20 md:pb-28">
      <PageHeader crumb="Careers" eyebrow="Join the studio" title="Work with us" description="We’re a team of 34 in Banani, Dhanmondi and Chattogram. We care about craft, honesty and getting the small things right." />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ImageReveal className="aspect-[4/5]">
            <SmartImage src={photo.sewing} alt="Sewing machine stitching pinstripe fabric" className="h-full w-full" style={{ objectPosition: '60% 50%' }} sizes="(min-width: 1024px) 40vw, 100vw" />
          </ImageReveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="label mb-6 text-xs">Open roles</h2>
          <ul className="divide-y divide-line border-y border-line">
            {roles.map((r) => (
              <li key={r.title} className="flex flex-wrap items-center justify-between gap-4 py-6">
                <div>
                  <p className="serif text-2xl">{r.title}</p>
                  <p className="mt-1 text-xs text-smoke">
                    {r.team} · {r.place} · {r.type}
                  </p>
                </div>
                <ButtonLink to="/contact" variant="secondary" size="sm">
                  Apply
                </ButtonLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-smoke">Don’t see your role? Send a portfolio or CV to careers@suto.com.bd — we read everything.</p>
        </div>
      </div>
    </div>
  )
}
