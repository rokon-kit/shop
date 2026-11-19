import { BadgeCheck } from 'lucide-react'
import { useState } from 'react'
import { ratingBreakdown, reviewsFor } from '../../data/reviews'
import type { Product } from '../../types'
import { formatDate } from '../../utils/format'
import { Button } from '../common/Button'
import { Reveal } from '../common/Reveal'
import { Stars } from './Rating'

export function ProductReviews({ product }: { product: Product }) {
  const reviews = reviewsFor(product)
  const breakdown = ratingBreakdown(product)
  const [thanks, setThanks] = useState(false)

  return (
    <section id="reviews" className="container-x scroll-mt-28 border-t border-line py-16 md:py-24" aria-labelledby="reviews-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="label mb-4 text-taupe">Reviews</p>
          <h2 id="reviews-title" className="serif text-[5rem] leading-none">
            {product.rating.toFixed(1)}
          </h2>
          <Stars value={product.rating} size="md" className="mt-3" />
          <p className="mt-2 text-sm text-smoke">Based on {product.reviewCount} verified reviews</p>
          <ul className="mt-8 space-y-2" aria-label="Rating breakdown">
            {breakdown.map((n, i) => (
              <li key={i} className="flex items-center gap-3 text-xs">
                <span className="tabular w-3 text-smoke">{5 - i}</span>
                <span className="relative h-[3px] flex-1 bg-bone">
                  <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${(n / product.reviewCount) * 100}%` }} />
                </span>
                <span className="tabular w-8 text-right text-taupe">{n}</span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-8" onClick={() => setThanks(true)} disabled={thanks}>
            {thanks ? 'Review form sent to your email' : 'Write a review'}
          </Button>
        </Reveal>
        <ul className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.06} className="py-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Stars value={r.rating} />
                <time dateTime={r.date} className="text-xs text-taupe">
                  {formatDate(r.date)}
                </time>
              </div>
              <h3 className="serif mt-4 text-2xl">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-smoke">{r.body}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <span className="font-medium">
                  {r.author} <span className="font-normal text-taupe">— {r.location}</span>
                </span>
                {r.verified && (
                  <span className="inline-flex items-center gap-1 text-moss">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Verified buyer
                  </span>
                )}
                <span className="text-taupe">
                  Bought {r.size} · {r.fit}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
