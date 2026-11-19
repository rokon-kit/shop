import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { photo } from '../../data/photos'
import { byCollection } from '../../data/products'
import { formatPrice } from '../../utils/format'
import { ButtonLink } from '../common/Button'
import { ImageReveal, Reveal } from '../common/Reveal'
import { SmartImage } from '../common/SmartImage'

/** "After Hours" — asymmetric campaign spread: hero portrait, supporting details, copy, shop-the-look. */
export function EditorialCollection() {
  const look = byCollection('after-hours').slice(0, 4)

  return (
    <section className="grain relative overflow-hidden bg-ink py-20 text-paper md:py-32" aria-labelledby="after-title">
      <div className="container-x relative z-[2]">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {/* Large portrait */}
          <div className="relative lg:col-span-5 lg:row-span-2">
            <ImageReveal className="aspect-[4/5] lg:aspect-[3/4]">
              <SmartImage src={photo.afterHoursWalk} alt="Model crossing a city street at dusk in a midnight poplin shirt and black trousers" className="h-full w-full bg-graphite" sizes="(min-width: 1024px) 40vw, 100vw" />
            </ImageReveal>
            <p className="label mt-3 flex justify-between text-paper/50">
              <span>Look 01 — Midnight Poplin Shirt</span>
              <span>Gulshan Ave, 11:40pm</span>
            </p>
          </div>

          {/* Title + copy */}
          <div className="lg:col-span-7 lg:pl-6">
            <Reveal>
              <p className="label mb-6 flex items-center gap-3 text-paper/60">
                <span className="tabular">05</span>
                <span className="h-px w-8 bg-paper/50" aria-hidden="true" />
                The editorial
              </p>
              <h2 id="after-title" className="display text-[clamp(4rem,14vw,9.5rem)]">
                After
                <br />
                <span className="lg:pl-[0.9em]">Hours</span>
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.1}>
                <p className="serif text-2xl leading-snug text-paper/90 md:text-3xl">
                  Black on black, for the city after dark — dinners that run late, rooftops, the long drive home.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-sm leading-relaxed text-paper/70">
                  Midnight poplin that doesn’t fade, a suede-touch trucker, the onyx panjabi for weddings that start at ten. Shot on the streets between
                  Gulshan and Old Dhaka over three nights in August.
                </p>
                <ButtonLink to="/shop?collection=after-hours" variant="paper" size="md" className="mt-6" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
                  Shop the edit
                </ButtonLink>
              </Reveal>
            </div>
          </div>

          {/* Supporting images + shop the look */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 lg:grid-cols-12 lg:pl-6">
            <div className="lg:col-span-5">
              <ImageReveal className="aspect-[4/5]" delay={0.1}>
                <SmartImage src={photo.afterHoursArcade} alt="Model in a black shirt and waistcoat under a brick-vaulted arcade" className="h-full w-full bg-graphite" sizes="(min-width: 1024px) 22vw, 50vw" />
              </ImageReveal>
            </div>
            <div className="mt-16 lg:col-span-4 lg:mt-24">
              <ImageReveal className="aspect-[3/4]" delay={0.2}>
                <SmartImage src={photo.afterHoursChair} alt="Model seated in a black shirt, studio portrait" className="h-full w-full bg-graphite" sizes="(min-width: 1024px) 18vw, 50vw" />
              </ImageReveal>
            </div>
            <Reveal delay={0.2} className="col-span-2 lg:col-span-3 lg:self-end">
              <p className="label mb-4 text-paper/50">Shop the look</p>
              <ul className="divide-y divide-paper/15 border-y border-paper/15">
                {look.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} className="group flex items-center gap-3 py-3">
                      <SmartImage src={p.images[0]} alt="" className="aspect-[4/5] w-11 shrink-0 bg-graphite" sizes="44px" widths={[120]} baseWidth={120} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8125rem] group-hover:underline group-hover:underline-offset-4">{p.name}</span>
                        <span className="tabular text-xs text-paper/60">{formatPrice(p.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
