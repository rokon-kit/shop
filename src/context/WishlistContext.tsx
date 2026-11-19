import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface WishlistState {
  ids: string[]
  count: number
  has: (id: string) => boolean
  toggle: (id: string) => boolean
  remove: (id: string) => void
}

const WishlistContext = createContext<WishlistState | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>('suto.wishlist', [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  /** Returns true when the item was added, false when removed. */
  const toggle = useCallback(
    (id: string) => {
      const adding = !ids.includes(id)
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
      return adding
    },
    [ids, setIds],
  )

  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), [setIds])

  const value = useMemo(() => ({ ids, count: ids.length, has, toggle, remove }), [ids, has, toggle, remove])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
