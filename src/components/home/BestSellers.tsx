import { ArrowRight, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { bestSellers } from '../../data/products'
import type { Product } from '../../types'
import { ButtonLink } from '../common/Button'
import { Price } from '../common/Price'
import { Reveal } from '../common/Reveal'
import { SmartImage } from '../common/SmartImage'
import { ProductCard } from '../product/ProductCard'
import { WishlistButton } from '../product/WishlistButton'

function Rating({ product }: { product: Product }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-smoke">
      <Star className="h-3 w-3 fill-ink text-ink" strokeWidth={0} aria-hidden="true" />
      <span className="tabular">{product.rating.toFixed(1)}</span>
      <span className="text-taupe">({product.reviewCount})</span>
      <span className="sr-only">out of 5 stars</span>
    </span>
  )
}

/** Ranked, editorial layout — deliberately different from the New Arrivals carousel. */
export function BestSellers() {
  const [first, ...others] = bestSellers().slice(0, 5)

  return (
    <section className="py-20 md:py-28" aria-labelledby="best-title">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left: title + Nº1 */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="label mb-4 flex items-center gap-3 text-taupe">
                <span className="tabular">04</span>
                <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
                What Dhaka is wearing
              </p>
              <h2 id="best-title" className="display text-[2.5rem] sm:text-6xl lg:text-7xl">
                Best
                <br />
                sellers
              </h2>
              <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-smoke">
                Ranked by what you bought and kept — the pieces that come back for a second colour.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <article className="group relative">
                <Link to={`/product/${first.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                    <SmartImage
                      src={first.images[0]}
                      alt={first.name}
                      className="absolute inset-0"
                      imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 38vw, 100vw"
                    />
                    <span className="serif absolute bottom-3 left-4 text-[7rem] leading-none text-paper drop-shadow-[0_2px_20px_rgb(0_0_0/0.25)] md:text-[9rem]">
                      Nº1
                    </span>
                  </div>
                </Link>
                <WishlistButton product={first} className="absolute top-3 right-3" />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base">
                      <Link to={`/product/${first.slug}`} className="hover:underline hover:underline-offset-4">
                        {first.name}
                      </Link>
                    </h3>
                    <div className="mt-1.5 flex items-center gap-3">
                      <Price price={first.price} originalPrice={first.originalPrice} />
                      <Rating product={first} />
                    </div>
                  </div>
                  <ButtonLink to={`/product/${first.slug}`} variant="secondary" size="sm" className="shrink-0">
                    Shop
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          </div>
        </div>

        {/* Right: ranked grid */}
        <div className="lg:col-span-7">
          <ol className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-4 md:gap-y-16">
            {others.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 2) * 0.08} className={i % 2 === 1 ? 'md:translate-y-16' : ''}>
                <div className="mb-3 flex items-baseline justify-between border-b border-line pb-2">
                  <span className="serif tabular text-3xl leading-none md:text-4xl">Nº{i + 2}</span>
                  <Rating product={p} />
                </div>
                <ProductCard product={p} sizes="(min-width: 1024px) 28vw, 48vw" />
              </Reveal>
            ))}
          </ol>
          <div className="mt-16 flex justify-center md:mt-28">
            <ButtonLink to="/best-sellers" variant="secondary" size="lg" icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}>
              All best sellers
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
