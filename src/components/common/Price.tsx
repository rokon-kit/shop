import { cn } from '../../utils/cn'
import { discountPercent, formatPrice } from '../../utils/format'

interface PriceProps {
  price: number
  originalPrice?: number
  size?: 'sm' | 'md' | 'lg'
  showBadge?: boolean
  className?: string
}

export function Price({ price, originalPrice, size = 'sm', showBadge = false, className }: PriceProps) {
  const off = discountPercent(price, originalPrice)
  const text = { sm: 'text-[0.8125rem]', md: 'text-base', lg: 'text-xl' }[size]
  return (
    <div className={cn('tabular flex flex-wrap items-baseline gap-x-2 gap-y-1', text, className)}>
      <span className={cn('font-medium', off ? 'text-brick' : 'text-ink')}>
        <span className="sr-only">{off ? 'Sale price ' : 'Price '}</span>
        {formatPrice(price)}
      </span>
      {off && originalPrice && (
        <>
          <s className="text-taupe decoration-taupe/70">
            <span className="sr-only">Original price </span>
            {formatPrice(originalPrice)}
          </s>
          {showBadge && <span className="label bg-brick-wash px-1.5 py-0.5 text-brick">−{off}%</span>}
        </>
      )}
    </div>
  )
}
