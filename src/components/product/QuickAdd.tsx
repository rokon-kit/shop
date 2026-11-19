import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useUI, type SizeGuideTab } from '../../context/UIContext'
import { productById } from '../../data/products'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import type { Product, Size } from '../../types'
import { Button } from '../common/Button'
import { Drawer } from '../common/Drawer'
import { Price } from '../common/Price'
import { SmartImage } from '../common/SmartImage'
import { ColorSelector } from './ColorSelector'
import { SizeSelector } from './SizeSelector'

export function sizeGuideFor(p: Product): SizeGuideTab {
  if (p.category === 'pants') return 'pants'
  if (p.category === 'panjabi' || p.category === 'katua') return 'panjabi'
  if (p.category === 't-shirts' || p.category === 'polo-shirts') return 't-shirts'
  return 'shirts'
}

function QuickAddBody({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { openSizeGuide, closeQuickAdd } = useUI()
  const [color, setColor] = useState(product.colors[0].name)
  const [size, setSize] = useState<Size | null>(null)
  const [error, setError] = useState(false)
  const images = product.colors.find((c) => c.name === color)?.images ?? product.images

  const add = () => {
    if (!size) return setError(true)
    addItem(product, { size, color })
  }

  return (
    <div className="p-5 sm:p-6">
      <div className="flex gap-4">
        <SmartImage src={images[0]} alt={product.name} className="aspect-[4/5] w-24 shrink-0 sm:w-28" sizes="112px" widths={[240]} baseWidth={240} />
        <div className="min-w-0">
          <h3 className="text-[0.9375rem] leading-snug">{product.name}</h3>
          <Price price={product.price} originalPrice={product.originalPrice} showBadge className="mt-2" />
          <Link to={`/product/${product.slug}`} onClick={closeQuickAdd} className="label mt-4 inline-flex items-center gap-1.5 text-smoke hover:text-ink">
            Full details <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        {product.colors.length > 1 && <ColorSelector colors={product.colors} value={color} onChange={setColor} />}
        <SizeSelector
          sizes={product.sizes}
          soldOut={product.soldOutSizes}
          value={size}
          onChange={(s) => {
            setSize(s)
            setError(false)
          }}
          error={error}
          onSizeGuide={() => openSizeGuide(sizeGuideFor(product))}
        />
        <Button full size="lg" onClick={add}>
          Add to bag
        </Button>
      </div>
    </div>
  )
}

export function QuickAddSheet() {
  const { quickAddId, closeQuickAdd } = useUI()
  const isDesktop = useIsDesktop()
  const [product, setProduct] = useState<Product | undefined>()

  // Keep the last product mounted during the exit animation
  useEffect(() => {
    if (quickAddId) setProduct(productById.get(quickAddId))
  }, [quickAddId])

  return (
    <Drawer open={!!quickAddId} onClose={closeQuickAdd} title="Quick add" side={isDesktop ? 'right' : 'bottom'}>
      {product && <QuickAddBody key={product.id} product={product} />}
    </Drawer>
  )
}
