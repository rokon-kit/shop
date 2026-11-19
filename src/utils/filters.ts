import type { Product, ProductColor, SortKey } from '../types'

/* ───────────────────────── Colour families ───────────────────────── */

export const COLOR_FAMILIES = [
  { id: 'black', label: 'Black', swatch: '#151515' },
  { id: 'white', label: 'White & Ecru', swatch: '#f3efe6' },
  { id: 'neutral', label: 'Sand & Stone', swatch: '#c9b99d' },
  { id: 'grey', label: 'Grey', swatch: '#8f918e' },
  { id: 'brown', label: 'Brown', swatch: '#6f4e37' },
  { id: 'blue', label: 'Blue & Navy', swatch: '#2f4a7a' },
  { id: 'green', label: 'Green', swatch: '#4f6b4c' },
  { id: 'red', label: 'Red & Rust', swatch: '#9e3b1e' },
  { id: 'yellow', label: 'Yellow', swatch: '#e9c54a' },
  { id: 'pink', label: 'Pink & Plum', swatch: '#c48a9a' },
] as const

export type ColorFamily = (typeof COLOR_FAMILIES)[number]['id']

function hsl(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = ((n >> 16) & 255) / 255
  const g = ((n >> 8) & 255) / 255
  const b = (n & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}

export function colorFamily(c: ProductColor): ColorFamily {
  const { h, s, l } = hsl(c.hex)
  if (l < 0.17) return 'black'
  if (l > 0.86 && s < 0.45) return 'white'
  if (s < 0.1) return 'grey'
  if ((h >= 330 || h < 15) && l < 0.5) return h >= 330 && l < 0.3 ? 'pink' : 'red'
  if (h >= 300 || h < 15) return 'pink'
  if (h < 32) return l < 0.45 ? 'red' : l < 0.7 ? 'brown' : 'neutral'
  if (h < 48) return l < 0.5 ? 'brown' : 'neutral'
  if (h < 62) return s > 0.55 && l < 0.85 ? 'yellow' : 'neutral'
  if (h < 175) return s < 0.16 ? 'grey' : 'green'
  if (h < 260) return 'blue'
  return 'pink'
}

export const productFamilies = (p: Product) => new Set(p.colors.map(colorFamily))

/* ───────────────────────── Price buckets ───────────────────────── */

export const PRICE_RANGES = [
  { id: 'u1000', label: 'Under ৳1,000', min: 0, max: 999 },
  { id: '1000-1500', label: '৳1,000 – ৳1,500', min: 1000, max: 1500 },
  { id: '1500-2000', label: '৳1,500 – ৳2,000', min: 1501, max: 2000 },
  { id: '2000-2500', label: '৳2,000 – ৳2,500', min: 2001, max: 2500 },
  { id: 'o2500', label: 'Above ৳2,500', min: 2501, max: Infinity },
] as const

/* ───────────────────────── Filter model ───────────────────────── */

export const FILTER_KEYS = ['category', 'sub', 'size', 'color', 'price', 'availability', 'fit', 'collection'] as const
export type FilterKey = (typeof FILTER_KEYS)[number]
export type Filters = Record<FilterKey, string[]>

export const AVAILABILITY = [
  { id: 'in-stock', label: 'In stock' },
  { id: 'sale', label: 'On sale' },
  { id: 'new', label: 'New arrival' },
  { id: 'limited', label: 'Limited edition' },
] as const

export function readFilters(params: URLSearchParams): Filters {
  const out = {} as Filters
  for (const k of FILTER_KEYS) out[k] = params.get(k)?.split(',').filter(Boolean) ?? []
  return out
}

export function matchesSub(p: Product, sub: string) {
  if (sub === 'straight-fit') return p.category === 'pants' && p.fit === 'Straight'
  return p.subcategory === sub
}

export function applyFilters(list: Product[], f: Filters, ignore?: FilterKey): Product[] {
  return list.filter((p) => {
    if (ignore !== 'category' && f.category.length && !f.category.includes(p.category)) return false
    if (ignore !== 'sub' && f.sub.length && !f.sub.some((s) => matchesSub(p, s))) return false
    if (ignore !== 'size' && f.size.length && !f.size.some((s) => p.sizes.includes(s as never) && !p.soldOutSizes?.includes(s as never))) return false
    if (ignore !== 'color' && f.color.length) {
      const fam = productFamilies(p)
      if (!f.color.some((c) => fam.has(c as ColorFamily))) return false
    }
    if (ignore !== 'price' && f.price.length) {
      const ok = f.price.some((id) => {
        const r = PRICE_RANGES.find((x) => x.id === id)
        return r ? p.price >= r.min && p.price <= r.max : false
      })
      if (!ok) return false
    }
    if (ignore !== 'availability' && f.availability.length) {
      for (const a of f.availability) {
        if (a === 'in-stock' && p.stock <= 0) return false
        if (a === 'sale' && !p.discount) return false
        if (a === 'new' && !p.newArrival) return false
        if (a === 'limited' && !p.limited) return false
      }
    }
    if (ignore !== 'fit' && f.fit.length && !f.fit.includes(p.fit)) return false
    if (ignore !== 'collection' && f.collection.length && !f.collection.includes(p.collection)) return false
    return true
  })
}

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'best-selling', label: 'Best selling' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
]

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const arr = [...list]
  const soldOutLast = (a: Product, b: Product) => Number(a.stock <= 0) - Number(b.stock <= 0)
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => soldOutLast(a, b) || Number(!!b.newArrival) - Number(!!a.newArrival) || b.id.localeCompare(a.id))
    case 'best-selling':
      return arr.sort((a, b) => soldOutLast(a, b) || Number(!!b.bestSeller) - Number(!!a.bestSeller) || b.reviewCount - a.reviewCount)
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    default:
      return arr.sort(
        (a, b) =>
          soldOutLast(a, b) ||
          Number(!!b.featured) - Number(!!a.featured) ||
          Number(!!b.newArrival) - Number(!!a.newArrival) ||
          b.reviewCount - a.reviewCount,
      )
  }
}
