import type { PlacedOrder } from '../types'

const LAST = 'suto.lastOrder'
const ALL = 'suto.orders'

export function saveOrder(order: PlacedOrder) {
  try {
    localStorage.setItem(LAST, JSON.stringify(order))
    const all = loadOrders()
    localStorage.setItem(ALL, JSON.stringify([order, ...all.filter((o) => o.id !== order.id)].slice(0, 20)))
  } catch {
    /* storage unavailable */
  }
}

export function loadLastOrder(): PlacedOrder | null {
  try {
    const raw = localStorage.getItem(LAST)
    return raw ? (JSON.parse(raw) as PlacedOrder) : null
  } catch {
    return null
  }
}

export function loadOrders(): PlacedOrder[] {
  try {
    const raw = localStorage.getItem(ALL)
    return raw ? (JSON.parse(raw) as PlacedOrder[]) : []
  } catch {
    return []
  }
}

export function newOrderId(d = new Date()) {
  const yy = String(d.getFullYear()).slice(2)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `SU-${yy}${mm}${dd}-${Math.floor(1000 + Math.random() * 9000)}`
}

export const PAYMENT_LABELS = { cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Card' } as const

export function normalizeBdPhone(raw: string) {
  const digits = raw.replace(/[^\d]/g, '')
  const local = digits.startsWith('880') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits
  return local
}

/** Valid Bangladeshi mobile: 1[3-9] followed by 8 digits (after +880 / 0 prefix). */
export function isValidBdPhone(raw: string) {
  return /^1[3-9]\d{8}$/.test(normalizeBdPhone(raw))
}
