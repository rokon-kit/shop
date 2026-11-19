import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ProductListing } from '../components/shop/ProductListing'
import { categories, collectionName, getCategory } from '../data/categories'
import { bestSellers, byCategory, byTag, newArrivals, onSale, products } from '../data/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NotFound from './NotFound'

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())

/** /shop and /shop/:category */
export default function Shop() {
  const { category: slug } = useParams()
  const [params] = useSearchParams()
  const category = getCategory(slug)
  const tag = params.get('tag')
  const collection = params.get('collection')
  const activeSubs = params.get('sub')?.split(',') ?? []

  const base = useMemo(() => {
    if (category) return byCategory(category.slug)
    if (tag) return byTag(tag)
    return products
  }, [category, tag])

  useDocumentTitle(slug && !category ? 'Page not found' : (category?.name ?? (tag ? titleCase(tag) : collection ? collectionName(collection) : 'Shop all')))

  if (slug && !category) return <NotFound />

  if (category) {
    const quickLinks = category.subcategories.length
      ? [
          { label: `All ${category.name}`, to: `/shop/${category.slug}`, active: activeSubs.length === 0 },
          ...category.subcategories.map((s) => ({ label: s.name, to: `/shop/${category.slug}?sub=${s.slug}`, active: activeSubs.length === 1 && activeSubs[0] === s.slug })),
        ]
      : undefined
    return (
      <ProductListing
        key={category.slug}
        base={base}
        eyebrow={category.tagline}
        title={category.name}
        description={category.description}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: category.name }]}
        subcategories={category.subcategories}
        quickLinks={quickLinks}
      />
    )
  }

  const title = tag ? titleCase(tag) : collection ? collectionName(collection) : 'Shop all'
  return (
    <ProductListing
      key={tag ?? 'all'}
      base={base}
      eyebrow={tag ? 'Trending now' : collection ? 'Collection' : 'The full wardrobe'}
      title={title}
      description={
        tag
          ? `Everything in our ${tag} edit — picked by the studio this season.`
          : 'Every shirt, panjabi, trouser and jacket we make — from the everyday essentials to the limited runs.'
      }
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop', to: tag || collection ? '/shop' : undefined }, ...(tag || collection ? [{ label: title }] : [])]}
      showCategory
      quickLinks={categories.map((c) => ({ label: c.name, to: `/shop/${c.slug}` }))}
    />
  )
}

export function NewArrivalsPage() {
  useDocumentTitle('New arrivals')
  const base = useMemo(() => newArrivals(), [])
  return (
    <ProductListing
      base={base}
      eyebrow="Landing every Thursday"
      title="New in"
      description="The latest from the studio — Soft Power for the cooler months, the Festive Edit and our numbered Blockwork capsule."
      crumbs={[{ label: 'Home', to: '/' }, { label: 'New arrivals' }]}
      showCategory
      defaultSort="newest"
    />
  )
}

export function BestSellersPage() {
  useDocumentTitle('Best sellers')
  const base = useMemo(() => bestSellers(), [])
  return (
    <ProductListing
      base={base}
      eyebrow="Ranked by you"
      title="Best sellers"
      description="The pieces that sell out, get restocked and sell out again. Start here if you are new to SUTO."
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Best sellers' }]}
      showCategory
      defaultSort="best-selling"
    />
  )
}

export function SalePage() {
  useDocumentTitle('Sale')
  const base = useMemo(() => onSale(), [])
  return (
    <ProductListing
      base={base}
      tone="sale"
      eyebrow="Up to 30% off — while sizes last"
      title="Sale"
      description="Last sizes from previous drops, at their lowest prices. Sale items can still be exchanged for size within 7 days."
      crumbs={[{ label: 'Home', to: '/' }, { label: 'Sale' }]}
      showCategory
      defaultSort="price-asc"
    />
  )
}
