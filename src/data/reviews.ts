import type { Product } from '../types'

export interface Review {
  id: string
  author: string
  location: string
  date: string
  rating: number
  title: string
  body: string
  size: string
  fit: 'Runs small' | 'True to size' | 'Runs large'
  verified: boolean
}

const AUTHORS = [
  ['Rafiul H.', 'Dhanmondi'],
  ['Shafayat K.', 'Uttara'],
  ['Arif M.', 'Chattogram'],
  ['Nafis A.', 'Gulshan'],
  ['Tahmid R.', 'Sylhet'],
  ['Imran S.', 'Mirpur'],
  ['Sabbir J.', 'Bashundhara'],
  ['Fahim C.', 'Rajshahi'],
  ['Ornob D.', 'Banani'],
  ['Zubair I.', 'Khulna'],
] as const

const BY_CATEGORY: Record<string, { title: string; body: string }[]> = {
  shirts: [
    { title: 'Finally, a collar that stays put', body: 'Washed it six or seven times now and the collar still sits properly. The fabric breathes even on the bus in the afternoon. Ordering a second colour.' },
    { title: 'Fit is spot on', body: 'I’m 5′8″ and usually struggle with sleeves being too long. Medium fits perfectly through the shoulder and the sleeve ends right at the wrist.' },
    { title: 'Looks more expensive than it is', body: 'Wore it to a client lunch and got asked where it was from. The buttons and stitching are genuinely nice. Delivery to Uttara took one day.' },
    { title: 'Great shirt, slightly boxy', body: 'Love the material. It’s a little roomier than I expected so I exchanged for one size down — the exchange was quick at the Banani store.' },
  ],
  't-shirts': [
    { title: 'Heavy in the best way', body: 'This is the thickness I’ve been looking for. Not see-through at all, the neck hasn’t stretched after a month of wearing it twice a week.' },
    { title: 'My new uniform', body: 'Bought one, came back for three more. The fit is clean and it doesn’t shrink. Good with chinos for the office on Thursdays.' },
    { title: 'Oversized but not sloppy', body: 'The drop shoulder looks intentional, not like I’m wearing my brother’s tee. Colour is exactly as shown.' },
  ],
  'polo-shirts': [
    { title: 'Collar keeps its shape', body: 'Most polos I own curl at the collar after a few washes. This one hasn’t. Smart enough for work.' },
    { title: 'Quality piqué', body: 'Soft, breathable, and the embroidery is neat. Size L fits a 42″ chest comfortably.' },
  ],
  pants: [
    { title: 'Best chinos I own', body: 'The straight leg is exactly right — not skinny, not baggy. The stretch makes a long day at the desk comfortable. Got them hemmed free in store.' },
    { title: 'Rise sits where it should', body: 'Finally trousers that don’t sit too low. The fabric feels sturdy and the colour hasn’t faded.' },
    { title: 'Great fit, order your usual size', body: 'I was between 32 and 34 and went 32 — perfect. Pockets are deep enough for a phone.' },
  ],
  panjabi: [
    { title: 'Wore it for my cousin’s wedding', body: 'Got so many compliments. The fabric has a subtle shine under the lights without looking flashy. Comfortable through a very long evening.' },
    { title: 'Modern but still traditional', body: 'The length is perfect — works with pajama and with jeans. Concealed placket is a really clean detail.' },
    { title: 'Premium feel', body: 'The packaging alone felt like a gift. Fabric is soft and the colour is richer in person than in photos.' },
    { title: 'Perfect for Eid morning', body: 'Light enough for the heat after prayers, smart enough for family visits. Size M was right for me at 5′9″.' },
  ],
  katua: [
    { title: 'Ideal Friday wear', body: 'Shorter than a panjabi, smarter than a shirt. Exactly what I wanted. The fabric is soft from the first wear.' },
    { title: 'Lovely detailing', body: 'The piping and buttons make it feel special. Fits true to size.' },
  ],
  outerwear: [
    { title: 'Right weight for Dhaka winter', body: 'Warm enough for early mornings in January but I don’t overheat by noon. The lining is a nice touch.' },
    { title: 'Looks great layered', body: 'Wearing it over a tee and over a panjabi — works with both. Fits with room for a knit underneath.' },
    { title: 'Worth every taka', body: 'The details are excellent — zip, pockets, finishing. Delivered to Chattogram in three days.' },
  ],
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function reviewsFor(product: Product): Review[] {
  const pool = BY_CATEGORY[product.category] ?? BY_CATEGORY.shirts
  const seed = hash(product.slug)
  const count = Math.min(3, pool.length)
  const sizes = product.sizes
  return Array.from({ length: count }, (_, i) => {
    const r = pool[(seed + i) % pool.length]
    const [author, location] = AUTHORS[(seed + i * 3) % AUTHORS.length]
    const day = new Date(2026, 8 - i * 2, 1 + ((seed >> (i + 2)) % 27))
    const rating = i === 2 && product.rating < 4.8 ? 4 : 5
    return {
      id: `${product.id}-r${i}`,
      author,
      location,
      date: day.toISOString().slice(0, 10),
      rating,
      title: r.title,
      body: r.body,
      size: sizes[(seed + i) % sizes.length],
      fit: (['True to size', 'True to size', 'Runs large'] as const)[(seed + i) % 3],
      verified: true,
    }
  })
}

/** Distribution for the rating breakdown bars, consistent with the product's average. */
export function ratingBreakdown(product: Product) {
  const total = product.reviewCount
  const five = Math.round(total * Math.min(0.92, (product.rating - 3.6) / 1.5))
  const four = Math.round((total - five) * 0.7)
  const three = Math.round((total - five - four) * 0.7)
  const two = Math.max(0, Math.round((total - five - four - three) * 0.6))
  const one = Math.max(0, total - five - four - three - two)
  return [five, four, three, two, one]
}
