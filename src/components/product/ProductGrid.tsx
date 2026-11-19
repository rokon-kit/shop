import type { Product } from '../../types'
import { cn } from '../../utils/cn'
import { Reveal } from '../common/Reveal'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  columns?: 3 | 4
  className?: string
  priorityCount?: number
}

export function ProductGrid({ products, columns = 4, className, priorityCount = 4 }: ProductGridProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:gap-y-14',
        columns === 4 ? 'md:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-3',
        className,
      )}
    >
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={Math.min(i % 4, 3) * 0.06} y={20}>
          <ProductCard
            product={p}
            priority={i < priorityCount}
            sizes={columns === 4 ? '(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw' : '(min-width: 768px) 31vw, 48vw'}
          />
        </Reveal>
      ))}
    </ul>
  )
}
