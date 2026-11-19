import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { photo } from '../../data/photos'
import { ButtonLink } from '../common/Button'
import { Reveal } from '../common/Reveal'
import { SmartImage } from '../common/SmartImage'

const facts = [
  { k: '100%', v: 'Designed & made in Bangladesh' },
  { k: '4', v: 'Partner workshops we visit monthly' },
  { k: '7 days', v: 'To change your mind, always' },
]

export function BrandStory() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-paper" aria-labelledby="story-title">
      <motion.div className="absolute -inset-y-[15%] inset-x-0" style={{ y }}>
        <SmartImage src={photo.dhakaSunset} alt="Dhaka skyline at sunset, seen through the haze" className="h-full w-full bg-graphite" sizes="100vw" widths={[960, 1600, 2400]} quality={70} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />

      <div className="container-x relative grid min-h-[80svh] content-end gap-12 py-20 md:min-h-[44rem] md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label mb-6 flex items-center gap-3 text-paper/70">
              <span className="tabular">03</span>
              <span className="h-px w-8 bg-paper/50" aria-hidden="true" />
              Our philosophy
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="story-title" className="display text-[clamp(2.75rem,8vw,7rem)]">
              Designed for Dhaka.
              <span className="serif mt-2 block text-[0.62em] tracking-normal normal-case italic text-paper/90">built for everywhere.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-paper/80">
              SUTO means thread. We start with fabric that breathes in 34°C and humidity, cut it for South Asian proportions, and finish it with the care of
              the tailors who taught us. Clothes that look considered at nine in the morning — and still do at midnight.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ButtonLink to="/about" variant="outline-paper" size="lg" className="mt-10" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
              Our story
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="self-end lg:col-span-4 lg:col-start-9">
          <dl className="grid grid-cols-3 gap-6 border-t border-paper/25 pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:pt-0">
            {facts.map((f) => (
              <div key={f.k} className="lg:border-t lg:border-paper/25 lg:py-5">
                <dt className="serif text-3xl md:text-5xl">{f.k}</dt>
                <dd className="mt-1 text-xs leading-snug text-paper/65 md:text-sm">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
