import type { Address, Order } from '../types'
import { photo } from './photos'

export const announcements = [
  'Free delivery on orders above ৳2,500',
  'Easy exchange within 7 days — no questions asked',
  'The Festive Edit has landed — for Puja, weddings & Eid',
  'Pay with bKash, Nagad, card or cash on delivery',
]

export interface NavLink {
  label: string
  to: string
  mega?: {
    columns: { title: string; links: { label: string; to: string }[] }[]
    feature: { title: string; caption: string; image: string; to: string }
  }
}

export const mainNav: NavLink[] = [
  {
    label: 'New In',
    to: '/new-arrivals',
    mega: {
      columns: [
        {
          title: 'This week',
          links: [
            { label: 'All new arrivals', to: '/new-arrivals' },
            { label: 'Soft Power — AW/26', to: '/shop?collection=soft-power' },
            { label: 'The Festive Edit', to: '/shop?collection=festive-edit' },
            { label: 'Blockwork — Limited', to: '/shop?collection=blockwork' },
            { label: 'City Series 02', to: '/shop?collection=city-series' },
          ],
        },
        {
          title: 'Discover',
          links: [
            { label: 'Best sellers', to: '/best-sellers' },
            { label: 'Limited edition', to: '/shop?availability=limited' },
            { label: 'After Hours', to: '/shop?collection=after-hours' },
            { label: 'Monsoon Linen', to: '/shop?collection=monsoon-linen' },
          ],
        },
      ],
      feature: { title: 'Soft Power', caption: 'The AW/26 campaign', image: photo.overTaupe2, to: '/shop?collection=soft-power' },
    },
  },
  {
    label: 'Shirts',
    to: '/shop/shirts',
    mega: {
      columns: [
        {
          title: 'Shirts',
          links: [
            { label: 'All shirts', to: '/shop/shirts' },
            { label: 'Classic Shirts', to: '/shop/shirts?sub=classic-shirts' },
            { label: 'Formal Shirts', to: '/shop/shirts?sub=formal-shirts' },
            { label: 'Overshirts', to: '/shop/shirts?sub=overshirts' },
            { label: 'Half Sleeve Shirts', to: '/shop/shirts?sub=half-sleeve-shirts' },
          ],
        },
        {
          title: 'Also',
          links: [
            { label: 'Polo Shirts', to: '/shop/polo-shirts' },
            { label: 'Katua', to: '/shop/katua' },
            { label: 'Linen shirts', to: '/search?q=linen' },
            { label: 'The Office Edit', to: '/shop?collection=office-edit' },
          ],
        },
      ],
      feature: { title: 'Camp Collar', caption: 'Our most-loved summer shirt', image: photo.campSage2, to: '/product/relaxed-camp-collar-shirt' },
    },
  },
  {
    label: 'T-Shirts',
    to: '/shop/t-shirts',
    mega: {
      columns: [
        {
          title: 'T-Shirts',
          links: [
            { label: 'All T-shirts', to: '/shop/t-shirts' },
            { label: 'Basic', to: '/shop/t-shirts?sub=basic' },
            { label: 'Oversized', to: '/shop/t-shirts?sub=oversized' },
            { label: 'Drop Shoulder', to: '/shop/t-shirts?sub=drop-shoulder' },
            { label: 'Graphic', to: '/shop/t-shirts?sub=graphic' },
          ],
        },
        {
          title: 'Also',
          links: [
            { label: 'Polo Shirts', to: '/shop/polo-shirts' },
            { label: 'Sweatshirts', to: '/shop/outerwear?sub=sweatshirts' },
          ],
        },
      ],
      feature: { title: 'Boxy Oversized Tee', caption: '240 GSM. The studio uniform.', image: photo.boxyStone2, to: '/product/boxy-oversized-tee' },
    },
  },
  {
    label: 'Pants',
    to: '/shop/pants',
    mega: {
      columns: [
        {
          title: 'By style',
          links: [
            { label: 'All pants', to: '/shop/pants' },
            { label: 'Chino', to: '/shop/pants?sub=chino' },
            { label: 'Denim', to: '/shop/pants?sub=denim' },
            { label: 'Cargo', to: '/shop/pants?sub=cargo' },
            { label: 'Formal', to: '/shop/pants?sub=formal' },
            { label: 'Trouser', to: '/shop/pants?sub=trouser' },
            { label: 'Shorts', to: '/shop/pants?sub=shorts' },
          ],
        },
        {
          title: 'By fit',
          links: [
            { label: 'Straight Fit', to: '/shop/pants?sub=straight-fit' },
            { label: 'Wide', to: '/shop/pants?fit=Wide' },
            { label: 'Slim', to: '/shop/pants?fit=Slim' },
            { label: 'Tapered', to: '/shop/pants?fit=Tapered' },
          ],
        },
      ],
      feature: { title: 'Pleated Wide Trouser', caption: 'The silhouette of the season', image: photo.wideTrouser, to: '/product/pleated-wide-trouser' },
    },
  },
  {
    label: 'Panjabi',
    to: '/shop/panjabi',
    mega: {
      columns: [
        {
          title: 'Panjabi',
          links: [
            { label: 'All panjabi', to: '/shop/panjabi' },
            { label: 'Classic Panjabi', to: '/shop/panjabi?sub=classic-panjabi' },
            { label: 'Premium Panjabi', to: '/shop/panjabi?sub=premium-panjabi' },
            { label: 'Short Panjabi', to: '/shop/panjabi?sub=short-panjabi' },
            { label: 'Festive Collection', to: '/shop/panjabi?sub=festive-collection' },
          ],
        },
        {
          title: 'Also',
          links: [
            { label: 'Katua', to: '/shop/katua' },
            { label: 'Blockwork — Limited', to: '/shop?collection=blockwork' },
            { label: 'Size guide', to: '/size-guide' },
          ],
        },
      ],
      feature: { title: 'The Festive Edit', caption: 'Puja · Weddings · Eid', image: photo.pjEmerald2, to: '/shop?collection=festive-edit' },
    },
  },
  {
    label: 'Outerwear',
    to: '/shop/outerwear',
    mega: {
      columns: [
        {
          title: 'Outerwear',
          links: [
            { label: 'All outerwear', to: '/shop/outerwear' },
            { label: 'Jackets', to: '/shop/outerwear?sub=jackets' },
            { label: 'Shackets', to: '/shop/outerwear?sub=shackets' },
            { label: 'Sweatshirts', to: '/shop/outerwear?sub=sweatshirts' },
          ],
        },
        {
          title: 'Layer with',
          links: [
            { label: 'Overshirts', to: '/shop/shirts?sub=overshirts' },
            { label: 'Heavyweight tees', to: '/shop/t-shirts?sub=basic' },
          ],
        },
      ],
      feature: { title: 'Olive Flight Jacket', caption: 'For the twelve cool weeks', image: photo.flight1, to: '/product/olive-flight-jacket' },
    },
  },
  { label: 'Sale', to: '/sale' },
]

export const footerNav = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Shirts', to: '/shop/shirts' },
      { label: 'Pants', to: '/shop/pants' },
      { label: 'Panjabi', to: '/shop/panjabi' },
      { label: 'Best Sellers', to: '/best-sellers' },
      { label: 'Sale', to: '/sale' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery', to: '/delivery-returns' },
      { label: 'Exchange & Returns', to: '/delivery-returns#exchange' },
      { label: 'Size Guide', to: '/size-guide' },
      { label: 'Order Tracking', to: '/track-order' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Stores', to: '/stores' },
      { label: 'Journal', to: '/journal' },
      { label: 'Careers', to: '/careers' },
    ],
  },
]

export const social = [
  { label: 'Instagram', href: 'https://instagram.com', handle: '@suto.dhaka' },
  { label: 'Facebook', href: 'https://facebook.com', handle: 'SUTO Bangladesh' },
  { label: 'TikTok', href: 'https://tiktok.com', handle: '@suto.dhaka' },
] as const

export const contact = {
  phone: '+880 9612-786 786',
  whatsapp: '+880 1711-786 786',
  email: 'hello@suto.com.bd',
  hours: 'Saturday – Thursday, 10am – 9pm · Friday, 3pm – 9pm',
  studio: 'House 42, Road 11, Banani, Dhaka 1213',
}

export const stores = [
  {
    name: 'SUTO Banani — Flagship',
    address: 'House 42, Road 11, Block E, Banani, Dhaka 1213',
    hours: 'Daily 11am – 10pm',
    phone: '+880 9612-786 701',
    image: photo.storeRail,
    note: 'Our studio and flagship. Alterations while you wait.',
  },
  {
    name: 'SUTO Dhanmondi',
    address: 'Level 2, Rangs KB Square, Satmasjid Road, Dhanmondi 9/A, Dhaka 1209',
    hours: 'Daily 11am – 10pm',
    phone: '+880 9612-786 702',
    image: photo.storeKnits,
    note: 'Full panjabi and festive range.',
  },
  {
    name: 'SUTO Chattogram',
    address: 'Ground Floor, Finlay Square, 2 No. Gate, Nasirabad, Chattogram 4000',
    hours: 'Sat – Thu 11am – 9pm · Fri 3pm – 9pm',
    phone: '+880 9612-786 703',
    image: photo.atelier,
    note: 'Opened March 2026.',
  },
]

/* ─────────────────────── Bangladesh address data ─────────────────────── */
export const divisions: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Tangail', 'Faridpur', 'Kishoreganj'],
  Chattogram: ['Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Noakhali', 'Brahmanbaria', 'Chandpur', 'Lakshmipur', 'Rangamati'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rajshahi: ['Rajshahi', 'Bogura', 'Pabna', 'Naogaon', 'Natore', 'Sirajganj', 'Chapainawabganj', 'Joypurhat'],
  Khulna: ['Khulna', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah', 'Magura', 'Narail', 'Chuadanga', 'Meherpur'],
  Barishal: ['Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Barguna', 'Jhalokathi'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari', 'Lalmonirhat', 'Thakurgaon', 'Panchagarh'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
}

export const dhakaAreas = [
  'Banani', 'Gulshan', 'Baridhara', 'Dhanmondi', 'Mohammadpur', 'Mirpur', 'Uttara', 'Bashundhara R/A', 'Badda', 'Rampura',
  'Motijheel', 'Old Dhaka', 'Tejgaon', 'Farmgate', 'Lalmatia', 'Khilgaon', 'Malibagh', 'Mohakhali', 'Niketan', 'Wari',
]

/* ─────────────────────── Account sample data ─────────────────────── */
export const sampleOrders: Order[] = [
  {
    id: 'SU-260918-4471',
    date: '2026-09-18',
    status: 'Out for delivery',
    items: [
      { productId: 'SU2601', size: 'M', color: 'Sage', quantity: 1, price: 1490 },
      { productId: 'SU2622', size: '32', color: 'Khaki', quantity: 1, price: 1490 },
    ],
    delivery: 0,
    payment: 'bKash',
    address: 'House 18, Road 7, Banani, Dhaka 1213',
  },
  {
    id: 'SU-260802-3318',
    date: '2026-08-02',
    status: 'Delivered',
    items: [
      { productId: 'SU2615', size: 'L', color: 'Optic White', quantity: 2, price: 790 },
      { productId: 'SU2609', size: 'M', color: 'Midnight', quantity: 1, price: 1490 },
    ],
    delivery: 70,
    payment: 'Cash on Delivery',
    address: 'House 18, Road 7, Banani, Dhaka 1213',
  },
  {
    id: 'SU-260605-2054',
    date: '2026-06-05',
    status: 'Delivered',
    items: [
      { productId: 'SU2630', size: 'L', color: 'Rust', quantity: 1, price: 2490 },
      { productId: 'SU2636', size: 'L', color: 'Ivory', quantity: 1, price: 1590 },
    ],
    delivery: 0,
    payment: 'Card',
    address: 'House 18, Road 7, Banani, Dhaka 1213',
  },
  {
    id: 'SU-260411-1190',
    date: '2026-04-11',
    status: 'Exchanged',
    items: [{ productId: 'SU2616', size: 'L', color: 'Stone', quantity: 1, price: 990 }],
    delivery: 70,
    payment: 'Nagad',
    address: 'House 18, Road 7, Banani, Dhaka 1213',
  },
]

export const sampleAddresses: Address[] = [
  {
    id: 'home',
    label: 'Home',
    name: 'Tanvir Rahman',
    phone: '+880 1712-345678',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Banani',
    address: 'House 18, Road 7, Flat 4B',
    isDefault: true,
  },
  {
    id: 'office',
    label: 'Office',
    name: 'Tanvir Rahman',
    phone: '+880 1712-345678',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Tejgaon',
    address: 'Level 9, Shanta Western Tower, 186 Tejgaon I/A',
  },
]

/* ─────────────────────── Size guide (inches) ─────────────────────── */
export const sizeCharts = {
  shirts: {
    label: 'Shirts',
    note: 'Measured flat, garment measurements. Allow 2–3% variation.',
    columns: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve', 'Collar'],
    rows: [
      ['S', 40, 28, 17, 24.5, 15],
      ['M', 42, 29, 17.75, 25, 15.5],
      ['L', 44, 30, 18.5, 25.5, 16],
      ['XL', 46, 31, 19.25, 26, 16.5],
      ['XXL', 48, 31.5, 20, 26.5, 17],
    ],
  },
  't-shirts': {
    label: 'T-Shirts & Polos',
    note: 'Regular fit shown. Oversized styles run approximately 4″ wider in the chest.',
    columns: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
    rows: [
      ['S', 38, 27, 17, 8],
      ['M', 40, 28, 17.75, 8.25],
      ['L', 42, 29, 18.5, 8.5],
      ['XL', 44, 30, 19.25, 8.75],
      ['XXL', 46, 31, 20, 9],
    ],
  },
  pants: {
    label: 'Pants',
    note: 'Waist measured relaxed. Inseam is 32″ unhemmed — free hemming in store.',
    columns: ['Waist', 'Waist (actual)', 'Hip', 'Thigh', 'Leg opening', 'Inseam'],
    rows: [
      ['28', 29, 38, 23, 7.25, 32],
      ['30', 31, 40, 24, 7.5, 32],
      ['32', 33, 42, 25, 7.75, 32],
      ['34', 35, 44, 26, 8, 32],
      ['36', 37, 46, 27, 8.25, 32],
      ['38', 39, 48, 28, 8.5, 32],
    ],
  },
  panjabi: {
    label: 'Panjabi & Katua',
    note: 'Panjabi length shown. Short panjabi and katua are approximately 10″ shorter.',
    columns: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve', 'Collar'],
    rows: [
      ['S', 40, 38, 17, 23.5, 16],
      ['M', 42, 40, 17.75, 24, 16],
      ['L', 44, 42, 18.5, 24.5, 17],
      ['XL', 46, 44, 19.25, 25, 17],
      ['XXL', 48, 45, 20, 25.5, 18],
    ],
  },
} as const

export type SizeChartKey = keyof typeof sizeCharts

export const faqs = [
  {
    group: 'Orders & delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Inside Dhaka we deliver in 1–2 working days. Outside Dhaka takes 3–5 working days through our courier partners. Orders placed before 2pm are dispatched the same day.',
      },
      {
        q: 'How much is delivery?',
        a: 'Delivery is free on orders above ৳2,500. Below that, it is ৳70 inside Dhaka and ৳130 outside Dhaka.',
      },
      {
        q: 'Can I pay cash on delivery?',
        a: 'Yes. Cash on delivery is available everywhere in Bangladesh. You can also pay with bKash, Nagad or any Visa, Mastercard or Amex card.',
      },
      {
        q: 'Can I check the product before paying?',
        a: 'Absolutely. Our delivery partner will wait while you open the parcel and check size and colour. If something is not right, hand it back and pay only the delivery charge.',
      },
    ],
  },
  {
    group: 'Exchange & returns',
    items: [
      {
        q: 'What is your exchange policy?',
        a: 'You can exchange any unworn item with tags attached within 7 days of delivery — for a different size, colour or another product. Exchanges in our stores are always free.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'If an item arrives damaged or incorrect, we refund in full to your original payment method within 5 working days. For change-of-mind returns we offer store credit.',
      },
      {
        q: 'Are sale items exchangeable?',
        a: 'Yes — sale items can be exchanged for size within 7 days. Limited-edition pieces can be exchanged for size only, subject to availability.',
      },
    ],
  },
  {
    group: 'Product & sizing',
    items: [
      {
        q: 'How do your sizes run?',
        a: 'Our shirts and panjabi are cut for South Asian proportions — slightly shorter in the sleeve and body than most international brands. Each product page notes whether to size up or down.',
      },
      {
        q: 'Do you offer alterations?',
        a: 'Free hemming on all trousers and sleeve adjustments on shirts at our Banani and Dhanmondi stores, usually while you wait.',
      },
      {
        q: 'Where are your clothes made?',
        a: 'Everything is designed in our Banani studio and made by partner workshops in Narayanganj, Gazipur and Mirpur that we visit every month.',
      },
    ],
  },
]

export const instagramPosts = [
  { image: photo.neutralStairs, caption: 'Stone on stone. Ecru shacket, sand trouser.', likes: '2,184' },
  { image: photo.campSage2, caption: 'Camp collar season never really ends here.', likes: '3,920' },
  { image: photo.afterHoursArcade, caption: 'After Hours, New Market.', likes: '1,766' },
  { image: photo.festiveTrio, caption: 'Chand raat, three ways.', likes: '5,402' },
  { image: photo.shacketEcru1, caption: 'The ecru shacket, worn your way.', likes: '2,611' },
  { image: photo.bambooTee, caption: 'Heavyweight white, nothing else.', likes: '1,948' },
]

export const journal = [
  {
    slug: 'soft-power',
    title: 'Soft Power: notes on the AW/26 campaign',
    excerpt: 'Why we built a winter collection for a city that barely has one — and what we learned about texture along the way.',
    image: photo.overTaupe1,
    date: '2026-09-20',
    read: '6 min',
  },
  {
    slug: 'the-panjabi-recut',
    title: 'The panjabi, recut',
    excerpt: 'Three months with the cutters in Mirpur, rethinking a garment our grandfathers wore without a second thought.',
    image: photo.pjRust,
    date: '2026-08-14',
    read: '8 min',
  },
  {
    slug: 'linen-in-the-monsoon',
    title: 'Linen in the monsoon: a field guide',
    excerpt: 'How to wear the fabric that loves humidity as much as we do — and how to wash it so it lasts a decade.',
    image: photo.ecruLinen,
    date: '2026-07-02',
    read: '4 min',
  },
]
