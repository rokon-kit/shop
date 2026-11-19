import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Badge } from '../components/common/Badge'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { Button } from '../components/common/Button'
import { Price } from '../components/common/Price'
import { SectionHeader } from '../components/common/SectionHeader'
import { SmartImage } from '../components/common/SmartImage'
import { ImageGallery } from '../components/product/ImageGallery'
import { ProductCarousel } from '../components/product/ProductCarousel'
import { ProductInfo } from '../components/product/ProductInfo'
import { ProductReviews } from '../components/product/ProductReviews'
import { RecentlyViewed } from '../components/product/RecentlyViewed'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { categoryBySlug } from '../data/categories'
import { getProduct, isSoldOut, relatedProducts } from '../data/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NotFound from './NotFound'

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const [params, setParams] = useSearchParams()
  const { track } = useRecentlyViewed()
  const [ctaVisible, setCtaVisible] = useState(true)
  const addRef = useRef<{ add: () => void } | null>(null)

  const colorParam = params.get('color')
  const color = product?.colors.find((c) => c.name === colorParam)?.name ?? product?.colors[0]?.name ?? ''
  const images = useMemo(() => product?.colors.find((c) => c.name === color)?.images ?? product?.images ?? [], [product, color])

  useDocumentTitle(product ? product.name : 'Product not found')

  useEffect(() => {
    if (product) track(product.id)
  }, [product, track])

  const setColor = useCallback(
    (c: string) => {
      const next = new URLSearchParams(params)
      if (c === product?.colors[0]?.name) next.delete('color')
      else next.set('color', c)
      setParams(next, { replace: true, preventScrollReset: true })
    },
    [params, product, setParams],
  )

  if (!product) return <NotFound />

  const category = categoryBySlug[product.category]
  const related = relatedProducts(product, 10)
  const soldOut = isSoldOut(product)

  const badges = (
    <>
      {soldOut && <Badge tone="sold">Sold out</Badge>}
      {!soldOut && product.discount && <Badge tone="sale">−{product.discount}%</Badge>}
    </>
  )

  return (
    <>
      <div className="container-x pt-5 pb-16 md:pt-8 md:pb-24">
        <Breadcrumb
          className="mb-5 md:mb-8"
          items={[
            { label: 'Home', to: '/' },
            { label: category.name, to: `/shop/${category.slug}` },
            { label: product.name },
          ]}
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:sticky lg:top-24 lg:col-span-7 lg:self-start">
            <ImageGallery images={images} alt={`${product.name} in ${color}`} badges={badges} />
          </div>
          <div className="lg:col-span-5">
            <ProductInfo product={product} color={color} onColor={setColor} onMainCtaVisible={setCtaVisible} addRef={addRef} />
          </div>
        </div>
      </div>

      <section className="container-x border-t border-line py-16 md:py-24" aria-label="You may also like">
        <SectionHeader size="md" eyebrow="Pairs well with" title="You may also like" action={{ label: `More ${category.name.toLowerCase()}`, to: `/shop/${category.slug}` }} />
        <ProductCarousel products={related} label="You may also like" />
      </section>

      <ProductReviews product={product} />

      <RecentlyViewed excludeId={product.id} />

      {/* Sticky add-to-bag (mobile) once the main button scrolls away */}
      <AnimatePresence>
        {!ctaVisible && !soldOut && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <SmartImage src={images[0]} alt="" className="aspect-[4/5] w-10 shrink-0" sizes="40px" widths={[120]} baseWidth={120} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs">{product.name}</p>
                <Price price={product.price} originalPrice={product.originalPrice} className="text-xs" />
              </div>
              <Button size="md" onClick={() => addRef.current?.add()}>
                Add to bag
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sr-only">
        <Link to={`/shop/${category.slug}`}>Back to {category.name}</Link>
      </div>
    </>
  )
}
