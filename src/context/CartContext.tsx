import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CartItem, Product, Size } from '../types'
import { useUI } from './UIContext'

export const FREE_DELIVERY_THRESHOLD = 2500
export const DELIVERY_FEES = { inside: 70, outside: 130 } as const

export const PROMO_CODES: Record<string, { label: string; apply: (subtotal: number) => number }> = {
  FIRSTTHREAD: { label: '10% off your first order', apply: (s) => Math.round(s * 0.1) },
  SUTO200: { label: '৳200 off orders above ৳2,000', apply: (s) => (s >= 2000 ? 200 : 0) },
}

interface CartState {
  items: CartItem[]
  count: number
  subtotal: number
  savings: number
  promo: string | null
  promoDiscount: number
  addItem: (product: Product, opts: { size: Size; color: string; quantity?: number }, openDrawer?: boolean) => void
  updateQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
  applyPromo: (code: string) => { ok: boolean; message: string }
  removePromo: () => void
}

const CartContext = createContext<CartState | null>(null)

export const MAX_QTY = 10

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('suto.cart', [])
  const [promo, setPromo] = useLocalStorage<string | null>('suto.promo', null)
  const { openCart } = useUI()

  const addItem = useCallback<CartState['addItem']>(
    (product, { size, color, quantity = 1 }, openDrawer = true) => {
      const key = `${product.id}:${color}:${size}`
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key)
        if (existing) {
          return prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i))
        }
        return [
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.colors.find((c) => c.name === color)?.images?.[0] ?? product.images[0],
            price: product.price,
            originalPrice: product.originalPrice,
            color,
            size,
            quantity: Math.min(MAX_QTY, quantity),
          },
          ...prev,
        ]
      })
      if (openDrawer) openCart()
    },
    [setItems, openCart],
  )

  const updateQuantity = useCallback(
    (key: string, quantity: number) =>
      setItems((prev) =>
        quantity <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
      ),
    [setItems],
  )

  const removeItem = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [setItems])
  const clear = useCallback(() => {
    setItems([])
    setPromo(null)
  }, [setItems, setPromo])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const savings = items.reduce((sum, i) => sum + ((i.originalPrice ?? i.price) - i.price) * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const promoDiscount = promo && PROMO_CODES[promo] ? PROMO_CODES[promo].apply(subtotal) : 0

  const applyPromo = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase()
      if (!code) return { ok: false, message: 'Enter a promo code.' }
      const def = PROMO_CODES[code]
      if (!def) return { ok: false, message: 'That code isn’t valid. Try FIRSTTHREAD.' }
      if (def.apply(subtotal) === 0) return { ok: false, message: `${code} needs a bag of ৳2,000 or more.` }
      setPromo(code)
      return { ok: true, message: `${code} applied — ${def.label}.` }
    },
    [subtotal, setPromo],
  )

  const value = useMemo<CartState>(
    () => ({
      items,
      count,
      subtotal,
      savings,
      promo,
      promoDiscount,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      applyPromo,
      removePromo: () => setPromo(null),
    }),
    [items, count, subtotal, savings, promo, promoDiscount, addItem, updateQuantity, removeItem, clear, applyPromo, setPromo],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
