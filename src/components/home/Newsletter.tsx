import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Reveal } from '../common/Reveal'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState('error')
    setState('done')
  }

  return (
    <section className="grain relative overflow-hidden bg-brick text-paper" aria-labelledby="newsletter-title">
      {/* A single thread running across the section */}
      <svg className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] h-40 w-full -translate-y-1/2 text-paper/15" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 110 C 260 20, 420 150, 720 80 S 1180 10, 1440 70" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <div className="container-x relative z-[2] grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="label mb-6 text-paper/70">The SUTO list</p>
          <h2 id="newsletter-title" className="display text-[clamp(3rem,11vw,7.25rem)]">
            Get first
            <br />
            access.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <ul className="serif space-y-1 text-2xl leading-tight md:text-3xl">
            <li>New drops.</li>
            <li>Private offers.</li>
            <li className="italic text-paper/80">Stories from the studio.</li>
          </ul>
          <AnimatePresence mode="wait" initial={false}>
            {state === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-10 flex items-start gap-3 border-t border-paper/30 pt-6" role="status">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-brick">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                <p className="text-sm leading-relaxed">
                  You’re on the list. Check your inbox for a welcome note — and <strong>FIRSTTHREAD</strong>, 10% off your first order.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate className="mt-10" exit={{ opacity: 0 }}>
                <label htmlFor="newsletter-email" className="label text-paper/70">
                  Email address
                </label>
                <div className="mt-2 flex items-center border-b border-paper/60 focus-within:border-paper">
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state === 'error') setState('idle')
                    }}
                    placeholder="you@example.com"
                    aria-invalid={state === 'error'}
                    aria-describedby="newsletter-hint"
                    className="min-w-0 flex-1 bg-transparent py-4 text-lg text-paper outline-none placeholder:text-paper/45"
                  />
                  <button type="submit" className="label group inline-flex h-12 items-center gap-2 pl-4 text-paper">
                    Join <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </button>
                </div>
                <p id="newsletter-hint" className="mt-3 text-xs text-paper/70">
                  {state === 'error' ? 'That email doesn’t look right — try again.' : 'One or two emails a month. Unsubscribe any time.'}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
