import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { photo } from '../../data/photos'
import { byTag } from '../../data/products'
import { cn } from '../../utils/cn'
import { SectionHeader } from '../common/SectionHeader'
import { SmartImage } from '../common/SmartImage'

const trends = [
  { tag: 'relaxed fits', title: 'Relaxed Fits', note: 'Room to move. Dropped shoulders, wide legs, boxy bodies.', image: photo.fieldPair, position: '50% 40%' },
  { tag: 'textured shirts', title: 'Textured Shirts', note: 'Slub linen, seersucker, brushed twill — shirts you want to touch.', image: photo.overTaupe3, position: '50% 30%' },
  { tag: 'neutral tones', title: 'Neutral Tones', note: 'Stone, ecru, sand and taupe. The palette of the season.', image: photo.neutralStairs, position: '40% 50%' },
  { tag: 'straight pants', title: 'Straight Pants', note: 'Neither skinny nor baggy. The leg line we keep coming back to.', image: photo.chinoKhaki2, position: '50% 60%' },
  { tag: 'festive essentials', title: 'Festive Essentials', note: 'Panjabi and katua for every invitation on the calendar.', image: photo.festiveTrio, position: '50% 35%' },
]

/**
 * Expanding editorial panels. On desktop the hovered/focused panel opens up;
 * on touch devices it becomes a swipeable row of tall cards.
 */
export function TrendingNow() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-20 md:py-28" aria-labelledby="trend-title">
      <div className="container-x">
        <SectionHeader index="07" eyebrow="Trending now" title={<span id="trend-title">The edit, by mood</span>} />

        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:h-[36rem] lg:gap-2 lg:overflow-visible lg:px-0 xl:h-[40rem]">
          {trends.map((t, i) => {
            const isActive = active === i
            const count = byTag(t.tag).length
            return (
              <li
                key={t.tag}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  'relative w-[72vw] shrink-0 snap-start overflow-hidden transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)] sm:w-[44vw] lg:w-auto lg:min-w-0 lg:flex-1',
                  isActive ? 'lg:grow-[4]' : 'lg:grow',
                )}
              >
                <Link to={`/shop?tag=${encodeURIComponent(t.tag)}`} className="group relative block aspect-[3/4] h-full bg-graphite text-paper lg:aspect-auto">
                  <SmartImage
                    src={t.image}
                    alt=""
                    className="absolute inset-0 bg-graphite"
                    imgClassName={cn('transition-transform duration-[1.2s] ease-[var(--ease-out-expo)]', isActive ? 'lg:scale-100' : 'lg:scale-110')}
                    style={{ objectPosition: t.position }}
                    sizes="(min-width: 1024px) 50vw, 72vw"
                  />
                  <div className={cn('absolute inset-0 transition-colors duration-700', isActive ? 'bg-ink/25' : 'bg-ink/25 lg:bg-ink/55')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

                  {/* Collapsed (desktop): vertical title */}
                  <span
                    className={cn(
                      'label absolute bottom-6 left-1/2 hidden origin-center -translate-x-1/2 -rotate-180 whitespace-nowrap text-paper transition-opacity duration-500 [writing-mode:vertical-rl] lg:block',
                      isActive ? 'opacity-0' : 'opacity-100 delay-200',
                    )}
                    aria-hidden="true"
                  >
                    {t.title}
                  </span>

                  <div
                    className={cn(
                      'absolute inset-x-5 bottom-5 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] md:inset-x-7 md:bottom-7',
                      isActive ? 'opacity-100' : 'lg:translate-y-4 lg:opacity-0',
                    )}
                  >
                    <p className="label tabular mb-2 text-paper/70">
                      0{i + 1} — {count} pieces
                    </p>
                    <h3 className="display text-[2rem] sm:text-4xl lg:whitespace-nowrap xl:text-5xl">{t.title}</h3>
                    <p className="mt-3 max-w-xs text-sm text-paper/80">{t.note}</p>
                    <span className="label mt-5 inline-flex items-center gap-1.5">
                      Shop the trend <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
