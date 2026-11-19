import { ArrowRight, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { photo } from '../../data/photos'
import { byCollection, getProduct } from '../../data/products'
import { cn } from '../../utils/cn'
import { formatPrice } from '../../utils/format'
import { ButtonLink } from '../common/Button'
import { ImageReveal, Reveal } from '../common/Reveal'
import { SmartImage } from '../common/SmartImage'
import { ProductCarousel } from '../product/ProductCarousel'

/**
 * A thin running motif drawn from jamdani weave geometry — heritage
 * expressed as a single contemporary line rather than heavy ornament.
 */
export function JamdaniRule({ className }: { className?: string }) {
  return (
    <svg className={cn('h-4 w-full text-brick', className)} preserveAspectRatio="none" viewBox="0 0 240 16" aria-hidden="true">
      <defs>
        <pattern id="jamdani" width="24" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 8h6l6-6 6 6h6M12 2v12M6 8l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="240" height="16" fill="url(#jamdani)" />
    </svg>
  )
}

const looks = [
  { slug: 'rust-dobby-panjabi', image: photo.pjRust, caption: 'Rust Dobby', className: 'lg:mt-24' },
  { slug: 'emerald-silk-blend-panjabi', image: photo.pjEmerald2, caption: 'Emerald Silk-Blend', className: '' },
  { slug: 'seafoam-classic-panjabi', image: photo.pjSeafoam, caption: 'Seafoam Classic', className: 'lg:mt-40' },
]

export function FestiveEdit() {
  const { openSizeGuide } = useUI()
  const festive = byCollection('festive-edit')

  return (
    <section className="relative overflow-hidden bg-bone py-20 md:py-32" aria-labelledby="festive-title">
      <div className="container-x">
        <JamdaniRule className="mb-14 opacity-70 md:mb-20" />

        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label mb-6 flex items-center gap-3 text-taupe">
              <span className="tabular">06</span>
              <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
              Puja · Weddings · Eid — 2026
            </p>
            <h2 id="festive-title" className="display text-[clamp(3.25rem,9vw,8rem)]">
              The
              <br />
              Festive
              <span className="serif block text-[1.05em] tracking-normal normal-case italic text-brick">Edit</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
            <p className="serif text-2xl leading-snug md:text-3xl">Heritage, recut. The panjabi our fathers wore — lighter, cleaner, and made to be lived in.</p>
            <p className="mt-5 text-sm leading-relaxed text-smoke">
              Silk-cotton blends that glow under lamplight. Dobby weaves from Narayanganj. Zari finished by hand in Mirpur. Concealed plackets, deep side
              pockets and a length that works as well with denim as it does with pajama.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink to="/shop?collection=festive-edit" size="lg" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
                Shop the edit
              </ButtonLink>
              <button type="button" onClick={() => openSizeGuide('panjabi')} className="label link-u-static inline-flex items-center gap-2">
                <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} /> Panjabi size guide
              </button>
            </div>
          </Reveal>
        </div>

        {/* Triptych */}
        <ul className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:mt-20 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">
          {looks.map((look, i) => {
            const product = getProduct(look.slug)!
            return (
              <li key={look.slug} className={cn('w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-auto', look.className)}>
                <Link to={`/product/${look.slug}`} className="group block">
                  <ImageReveal className="aspect-[3/4]" delay={i * 0.1}>
                    <SmartImage
                      src={look.image}
                      alt={product.name}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 31vw, 78vw"
                    />
                  </ImageReveal>
                  <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-ink/20 pt-3">
                    <p>
                      <span className="label tabular mr-3 text-taupe">0{i + 1}</span>
                      <span className="serif text-2xl">{look.caption}</span>
                    </p>
                    <span className="tabular text-sm">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-20 md:mt-28">
          <div className="mb-8 flex items-end justify-between">
            <p className="label text-taupe">The full edit — {festive.length} pieces</p>
            <Link to="/shop/panjabi" className="label link-u-static">
              All panjabi
            </Link>
          </div>
          <ProductCarousel products={festive} label="The Festive Edit" />
        </div>
      </div>
    </section>
  )
}
