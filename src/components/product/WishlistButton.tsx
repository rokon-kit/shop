import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import type { Product } from '../../types'
import { cn } from '../../utils/cn'

interface WishlistButtonProps {
  product: Product
  className?: string
  variant?: 'floating' | 'inline'
}

export function WishlistButton({ product, className, variant = 'floating' }: WishlistButtonProps) {
  const { has, toggle } = useWishlist()
  const { toast } = useUI()
  const saved = has(product.id)

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggle(product.id)
    toast({
      title: added ? 'Saved to wishlist' : 'Removed from wishlist',
      description: product.name,
      image: product.images[0],
      action: added ? { label: 'View', to: '/wishlist' } : undefined,
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        'group/wish grid place-items-center transition-colors',
        variant === 'floating' ? 'h-9 w-9 bg-paper/0 hover:bg-paper/80' : 'h-12 w-12 border border-line-strong hover:border-ink',
        className,
      )}
    >
      <motion.span
        key={saved ? 'on' : 'off'}
        initial={{ scale: saved ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart
          className={cn('h-[1.1rem] w-[1.1rem] transition-colors', saved ? 'fill-brick text-brick' : 'text-ink group-hover/wish:fill-ink/10')}
          strokeWidth={1.4}
        />
      </motion.span>
    </button>
  )
}
