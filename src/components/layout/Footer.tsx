import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contact, footerNav, social } from '../../data/content'
import { PaymentBadges, socialIcons } from '../common/Icons'
import { Mark } from '../common/Logo'

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink pb-24 text-paper lg:pb-0">
      <div className="container-x relative z-[2] pt-16 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-4">
            <p className="serif text-4xl leading-[1.05] md:text-5xl">
              Threaded <em className="text-brick-light">in Dhaka.</em>
              <br />
              Worn everywhere.
            </p>
            <dl className="mt-8 space-y-3 text-sm text-paper/70">
              <div>
                <dt className="label mb-1 text-paper/40">Studio</dt>
                <dd>{contact.studio}</dd>
              </div>
              <div>
                <dt className="label mb-1 text-paper/40">Talk to us</dt>
                <dd>
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="link-u hover:text-paper">
                    {contact.phone}
                  </a>
                  <span className="mx-2 text-paper/30">·</span>
                  <a href={`mailto:${contact.email}`} className="link-u hover:text-paper">
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label mb-1 text-paper/40">Hours</dt>
                <dd>{contact.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="label mb-5 text-paper/40">{col.title}</h2>
                <ul className="space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="link-u text-paper/80 transition-colors hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className="label mb-5 text-paper/40">Follow</h2>
              <ul className="space-y-3 text-sm">
                {social.map((s) => {
                  const Icon = socialIcons[s.label]
                  return (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2.5 text-paper/80 hover:text-paper">
                        <Icon className="h-4 w-4" />
                        <span className="link-u">{s.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="pointer-events-none mt-16 select-none md:mt-24" aria-hidden="true">
          <div
            className="flex items-end justify-between leading-[0.74] font-extrabold text-paper"
            style={{ fontVariationSettings: "'wdth' 125", fontSize: 'clamp(4rem, 24.5vw, 30rem)', letterSpacing: '-0.02em' }}
          >
            <span>SUT</span>
            <Mark tone="paper" className="mb-[0.005em] h-[0.72em] w-[1.1em] shrink-0" />
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-paper/15 py-8 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 SUTO Apparel Ltd.</span>
            <span>Bangladesh</span>
            <Link to="/faq" className="link-u hover:text-paper">
              Privacy
            </Link>
            <Link to="/faq" className="link-u hover:text-paper">
              Terms
            </Link>
          </div>
          <PaymentBadges />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="label hidden items-center gap-2 text-paper/70 hover:text-paper md:inline-flex"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  )
}
