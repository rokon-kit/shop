import { sampleOrders } from '../data/content'
import { productById } from '../data/products'
import type { OrderStatus } from '../types'
import { loadOrders, PAYMENT_LABELS } from './orders'

export interface OrderView {
  id: string
  date: string
  status: OrderStatus
  items: { name: string; slug: string; image: string; size: string; color: string; quantity: number; price: number }[]
  delivery: number
  total: number
  payment: string
  address: string
}

export const STATUS_STEPS: OrderStatus[] = ['Processing', 'Shipped', 'Out for delivery', 'Delivered']

/** Orders placed in this browser plus the demo history, newest first. */
export function getAccountOrders(): OrderView[] {
  const placed: OrderView[] = loadOrders().map((o) => ({
    id: o.id,
    date: o.date,
    status: 'Processing',
    items: o.items.map((i) => ({ name: i.name, slug: i.slug, image: i.image, size: i.size, color: i.color, quantity: i.quantity, price: i.price })),
    delivery: o.delivery,
    total: o.total,
    payment: PAYMENT_LABELS[o.payment],
    address: `${o.info.address}, ${o.info.area}, ${o.info.district}`,
  }))

  const demo: OrderView[] = sampleOrders.map((o) => {
    const items = o.items.flatMap((i) => {
      const p = productById.get(i.productId)
      if (!p) return []
      const img = p.colors.find((c) => c.name === i.color)?.images?.[0] ?? p.images[0]
      return [{ name: p.name, slug: p.slug, image: img, size: i.size, color: i.color, quantity: i.quantity, price: i.price }]
    })
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    return { id: o.id, date: o.date, status: o.status, items, delivery: o.delivery, total: subtotal + o.delivery, payment: o.payment, address: o.address }
  })

  return [...placed, ...demo]
}
