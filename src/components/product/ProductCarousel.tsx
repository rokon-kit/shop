import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product } from '../../types'
import { cn } from '../../utils/cn'
import { ProductCard } from './ProductCard'

interface ProductCarouselProps {
  products: Product[]
  label: string
  className?: string
  /** Card width classes */
  itemClassName?: string
}

/**
 * Native scroll-snap carousel: swipeable on touch, arrow-driven on desktop,
 * with a hairline progress indicator. No slider library needed.
 */
export function ProductCarousel({
  products,
  label,
  className,
  itemClassName = 'w-[68vw] xs:w-[56vw] sm:w-[40vw] md:w-[30vw] lg:w-[23vw] 3xl:w-[20vw]',
}: ProductCarouselProps) {
  const track = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)
  const [thumb, setThumb] = useState(0.25)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setThumb(Math.min(1, el.clientWidth / el.scrollWidth))
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    update()
    const el = track.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el?.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step * (window.innerWidth >= 1024 ? 2 : 1), behavior: 'smooth' })
  }

  return (
    <div className={cn('relative', className)} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      >
        {products.map((p, i) => (
          <li key={p.id} className={cn('shrink-0 snap-start', itemClassName)} aria-roledescription="slide" aria-label={`${i + 1} of ${products.length}`}>
            <ProductCard product={p} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 68vw" />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-line" aria-hidden="true">
          <div
            className="absolute inset-y-0 bg-ink transition-[left] duration-300 ease-out"
            style={{ width: `${thumb * 100}%`, left: `${progress * (1 - thumb) * 100}%` }}
          />
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={edges.start}
            className="grid h-11 w-11 place-items-center border border-line-strong transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous products"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={edges.end}
            className="grid h-11 w-11 place-items-center border border-line-strong transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next products"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
