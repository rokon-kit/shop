import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { photo } from '../../data/photos'
import { cn } from '../../utils/cn'
import { ButtonLink } from '../common/Button'
import { SmartImage } from '../common/SmartImage'

interface Slide {
  id: string
  label: string
  eyebrow: string
  headline: [string, string]
  sub: string
  image: string
  alt: string
  /** object-position for portrait (mobile) crops */
  focus: string
  primary: { label: string; to: string }
  secondary: { label: string; to: string }
}

const slides: Slide[] = [
  {
    id: 'soft-power',
    label: 'Soft Power',
    eyebrow: 'New season — AW/26',
    headline: ['Soft', 'Power.'],
    sub: 'Brushed twills, wool-touch overshirts and wide pleated trousers. Quiet clothes for a loud city.',
    image: photo.heroSoftPower,
    alt: 'Model in a stone wool-touch overshirt against a warm grey wall',
    focus: '54% 30%',
    primary: { label: 'Shop new arrivals', to: '/new-arrivals' },
    secondary: { label: 'Explore the collection', to: '/shop?collection=soft-power' },
  },
  {
    id: 'festive',
    label: 'Festive Edit',
    eyebrow: 'Puja · Weddings · Eid — 2026',
    headline: ['Festive,', 'recut.'],
    sub: 'Silk-blends, dobby weaves and hand-finished zari. The panjabi, considered again for this season’s celebrations.',
    image: photo.heroFestive,
    alt: 'Model in an emerald silk-blend panjabi seated in a lamplit room',
    focus: '64% 40%',
    primary: { label: 'Shop the festive edit', to: '/shop?collection=festive-edit' },
    secondary: { label: 'All panjabi', to: '/shop/panjabi' },
  },
  {
    id: 'blockwork',
    label: 'Blockwork',
    eyebrow: 'Limited — 150 numbered pieces',
    headline: ['Block', 'work.'],
    sub: 'Hand block-printed in indigo and madder, drawn from old kantha stitches. Numbered, and never repeated.',
    image: photo.heroBlockwork,
    alt: 'Model in a hand block-printed short panjabi by the sea',
    focus: '44% 30%',
    primary: { label: 'Shop Blockwork', to: '/product/blockwork-printed-short-panjabi' },
    secondary: { label: 'Limited edition', to: '/shop?availability=limited' },
  },
]

const DURATION = 7000

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const reduce = useReducedMotion()
  const slide = slides[index]
  const running = !paused && !userPaused && !reduce

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), DURATION)
    return () => window.clearTimeout(t)
  }, [index, running])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured campaigns"
      className="relative -mt-16 h-[calc(100svh-5.75rem)] max-h-[62rem] min-h-[34rem] overflow-hidden bg-ink text-paper lg:-mt-20 lg:h-[calc(100svh-2.25rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SmartImage
              src={slide.image}
              alt={slide.alt}
              className="absolute inset-0 bg-graphite"
              imgClassName="h-full w-full object-cover"
              style={{ objectPosition: slide.focus }}
              sizes="100vw"
              widths={[640, 960, 1280, 1600, 2000, 2560]}
              baseWidth={1600}
              quality={78}
              priority={index === 0}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10 lg:bg-gradient-to-r lg:from-ink/65 lg:via-ink/15 lg:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/50 to-transparent lg:hidden" />
        </motion.div>
      </AnimatePresence>

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-16 sm:pb-24 lg:pb-16">
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={slide.id} exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}>
              <motion.p
                className="label mb-5 flex items-center gap-3 text-paper/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="h-px w-8 bg-paper/60" aria-hidden="true" />
                {slide.eyebrow}
              </motion.p>
              <h1 className="display text-[clamp(3.5rem,14.5vw,10.5rem)] leading-[0.82]">
                {slide.headline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.04em]">
                    <motion.span
                      className={cn('block', i === 1 && 'text-paper/95')}
                      initial={{ y: reduce ? 0 : '105%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-paper/85 sm:text-base"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {slide.sub}
              </motion.p>
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <ButtonLink to={slide.primary.to} variant="paper" size="lg" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
                  {slide.primary.label}
                </ButtonLink>
                <span className="hidden sm:contents">
                  <ButtonLink to={slide.secondary.to} variant="outline-paper" size="lg">
                    {slide.secondary.label}
                  </ButtonLink>
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls */}
        <div className="absolute inset-x-4 bottom-5 flex items-end gap-4 sm:inset-x-6 lg:right-10 lg:left-auto lg:w-[30rem] lg:bottom-16">
          <ol className="grid flex-1 grid-cols-3 gap-3">
            {slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group block w-full text-left"
                  aria-label={`Show campaign ${i + 1}: ${s.label}`}
                  aria-current={i === index}
                >
                  <span className="label tabular mb-2 hidden text-[0.625rem] text-paper/60 transition-colors group-hover:text-paper sm:block">
                    0{i + 1} <span className={cn('ml-1', i === index && 'text-paper')}>{s.label}</span>
                  </span>
                  <span className="relative block h-[2px] overflow-hidden bg-paper/25">
                    {i === index ? (
                      <motion.span
                        key={`${s.id}-${running}`}
                        className="absolute inset-y-0 left-0 bg-paper"
                        initial={{ width: running ? '0%' : '100%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: running ? DURATION / 1000 : 0, ease: 'linear' }}
                      />
                    ) : (
                      i < index && <span className="absolute inset-0 bg-paper/60" />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            className="-mb-2 grid h-8 w-8 shrink-0 place-items-center text-paper/70 hover:text-paper"
            aria-label={userPaused ? 'Play campaign slideshow' : 'Pause campaign slideshow'}
          >
            {userPaused ? <Play className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Pause className="h-3.5 w-3.5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </section>
  )
}
