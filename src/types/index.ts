export type CategorySlug =
  | 'shirts'
  | 't-shirts'
  | 'polo-shirts'
  | 'pants'
  | 'panjabi'
  | 'katua'
  | 'outerwear'

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36' | '38'

export type Fit = 'Regular' | 'Relaxed' | 'Slim' | 'Oversized' | 'Straight' | 'Tapered' | 'Boxy' | 'Wide'

export interface ProductColor {
  name: string
  hex: string
  /** Gallery for this colourway. Falls back to the product's images. */
  images?: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  category: CategorySlug
  subcategory: string
  collection: string
  price: number
  originalPrice?: number
  /** Percentage, derived from price/originalPrice */
  discount?: number
  images: string[]
  colors: ProductColor[]
  sizes: Size[]
  /** Sizes currently out of stock */
  soldOutSizes?: Size[]
  description: string
  details: string[]
  material: string
  fit: Fit
  fitNote: string
  care: string[]
  stock: number
  featured?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  limited?: boolean
  rating: number
  reviewCount: number
  tags: string[]
  /** Model height / size worn, shown on PDP */
  modelInfo?: string
}

export interface Subcategory {
  slug: string
  name: string
}

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
  description: string
  image: string
  subcategories: Subcategory[]
}

export interface CartItem {
  key: string
  productId: string
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  color: string
  size: Size
  quantity: number
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Exchanged' | 'Cancelled'

export interface Order {
  id: string
  date: string
  status: OrderStatus
  items: { productId: string; size: Size; color: string; quantity: number; price: number }[]
  delivery: number
  payment: 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Card'
  address: string
}

export interface Address {
  id: string
  label: string
  name: string
  phone: string
  division: string
  district: string
  area: string
  address: string
  isDefault?: boolean
}

export interface User {
  name: string
  email: string
  phone: string
  memberSince: string
}

export type SortKey = 'featured' | 'newest' | 'best-selling' | 'price-asc' | 'price-desc' | 'rating'

export type DeliveryMethod = 'standard' | 'express' | 'pickup'
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card'

export interface ShippingInfo {
  name: string
  phone: string
  email: string
  division: string
  district: string
  area: string
  address: string
  note: string
}

/** An order placed through the prototype checkout (kept in localStorage). */
export interface PlacedOrder {
  id: string
  date: string
  items: CartItem[]
  subtotal: number
  discount: number
  delivery: number
  total: number
  info: ShippingInfo
  deliveryMethod: DeliveryMethod
  deliveryLabel: string
  payment: PaymentMethod
  eta: string
}
