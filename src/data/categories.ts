import type { Category, CategorySlug } from '../types'
import { photo } from './photos'

export const categories: Category[] = [
  {
    slug: 'shirts',
    name: 'Shirts',
    tagline: 'The backbone of the wardrobe',
    description:
      'Linen for the long months, poplin for the office, brushed twill for the cooler evenings. Cut a little roomier through the body, finished with horn-effect buttons and a collar that holds its shape after a hundred washes.',
    image: photo.campSage1,
    subcategories: [
      { slug: 'classic-shirts', name: 'Classic Shirts' },
      { slug: 'formal-shirts', name: 'Formal Shirts' },
      { slug: 'overshirts', name: 'Overshirts' },
      { slug: 'half-sleeve-shirts', name: 'Half Sleeve Shirts' },
    ],
  },
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    tagline: 'Heavyweight, honest cotton',
    description:
      'Combed cotton jersey knitted to 220–240 GSM, garment-washed for softness and pre-shrunk so the fit you buy is the fit you keep. Basic, boxy, drop-shoulder and our City Series graphics.',
    image: photo.boxyStone1,
    subcategories: [
      { slug: 'basic', name: 'Basic' },
      { slug: 'oversized', name: 'Oversized' },
      { slug: 'drop-shoulder', name: 'Drop Shoulder' },
      { slug: 'graphic', name: 'Graphic' },
    ],
  },
  {
    slug: 'polo-shirts',
    name: 'Polo Shirts',
    tagline: 'Collared, never stiff',
    description:
      'Piqué and knitted polos with a clean placket and a collar that stays flat. The smartest thing you can wear without trying.',
    image: photo.poloBlack1,
    subcategories: [],
  },
  {
    slug: 'pants',
    name: 'Pants',
    tagline: 'Built from the ground up',
    description:
      'Straight, tapered and wide — chinos, denim, cargos and tailored trousers with a bit of stretch where it counts and a rise that sits where a man actually wears his waist.',
    image: photo.wideTrouser,
    subcategories: [
      { slug: 'chino', name: 'Chino' },
      { slug: 'denim', name: 'Denim' },
      { slug: 'cargo', name: 'Cargo' },
      { slug: 'formal', name: 'Formal' },
      { slug: 'trouser', name: 'Trouser' },
      { slug: 'straight-fit', name: 'Straight Fit' },
      { slug: 'shorts', name: 'Shorts' },
    ],
  },
  {
    slug: 'panjabi',
    name: 'Panjabi',
    tagline: 'Heritage, recut',
    description:
      'The panjabi, considered again. Silk-blends, dobby weaves and fine cotton with clean plackets, concealed pockets and a length that works with denim as well as it does with pajama.',
    image: photo.pjRust,
    subcategories: [
      { slug: 'classic-panjabi', name: 'Classic Panjabi' },
      { slug: 'premium-panjabi', name: 'Premium Panjabi' },
      { slug: 'short-panjabi', name: 'Short Panjabi' },
      { slug: 'festive-collection', name: 'Festive Collection' },
    ],
  },
  {
    slug: 'katua',
    name: 'Katua',
    tagline: 'Between a shirt and a panjabi',
    description:
      'Hip-length, band-collared and quietly traditional. The katua is the piece we reach for on Fridays, at dawats and everywhere in between.',
    image: photo.katuaSage,
    subcategories: [],
  },
  {
    slug: 'outerwear',
    name: 'Outerwear',
    tagline: 'For the twelve cool weeks',
    description:
      'Dhaka winters are short and the evenings are sharp. Lightweight jackets, shackets and loopback sweatshirts made for layering, not for hibernating.',
    image: photo.suedeTrucker,
    subcategories: [
      { slug: 'jackets', name: 'Jackets' },
      { slug: 'shackets', name: 'Shackets' },
      { slug: 'sweatshirts', name: 'Sweatshirts' },
    ],
  },
]

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<CategorySlug, Category>

export function getCategory(slug?: string) {
  return categories.find((c) => c.slug === slug)
}

export function subcategoryName(slug: string) {
  for (const c of categories) {
    const s = c.subcategories.find((s) => s.slug === slug)
    if (s) return s.name
  }
  return slug
}

/** Collections — editorial groupings across categories */
export const collections = [
  { slug: 'soft-power', name: 'Soft Power — AW/26' },
  { slug: 'after-hours', name: 'After Hours' },
  { slug: 'festive-edit', name: 'The Festive Edit' },
  { slug: 'monsoon-linen', name: 'Monsoon Linen' },
  { slug: 'essentials', name: 'Essentials' },
  { slug: 'office-edit', name: 'The Office Edit' },
  { slug: 'blockwork', name: 'Blockwork — Limited' },
  { slug: 'city-series', name: 'City Series' },
] as const

export function collectionName(slug: string) {
  return collections.find((c) => c.slug === slug)?.name ?? slug
}
