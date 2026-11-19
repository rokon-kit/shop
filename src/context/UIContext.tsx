import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

export interface Toast {
  id: number
  title: string
  description?: string
  image?: string
  action?: { label: string; to: string }
}

export type SizeGuideTab = 'shirts' | 't-shirts' | 'pants' | 'panjabi'

interface UIState {
  cartOpen: boolean
  searchOpen: boolean
  menuOpen: boolean
  sizeGuide: SizeGuideTab | null
  quickAddId: string | null
  toasts: Toast[]
  openCart: () => void
  closeCart: () => void
  openSearch: () => void
  closeSearch: () => void
  setMenuOpen: (open: boolean) => void
  openSizeGuide: (tab?: SizeGuideTab) => void
  closeSizeGuide: () => void
  openQuickAdd: (productId: string) => void
  closeQuickAdd: () => void
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

const UIContext = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sizeGuide, setSizeGuide] = useState<SizeGuideTab | null>(null)
  const [quickAddId, setQuickAddId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismissToast = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), [])
  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = nextId.current++
      setToasts((all) => [...all.slice(-2), { ...t, id }])
      window.setTimeout(() => dismissToast(id), 3600)
    },
    [dismissToast],
  )

  // Stable action identities — consumers use these in effect dependencies
  const actions = useMemo(
    () => ({
      openCart: () => {
        setSearchOpen(false)
        setMenuOpen(false)
        setQuickAddId(null)
        setCartOpen(true)
      },
      closeCart: () => setCartOpen(false),
      openSearch: () => {
        setMenuOpen(false)
        setCartOpen(false)
        setSearchOpen(true)
      },
      closeSearch: () => setSearchOpen(false),
      setMenuOpen,
      openSizeGuide: (tab: SizeGuideTab = 'shirts') => setSizeGuide(tab),
      closeSizeGuide: () => setSizeGuide(null),
      openQuickAdd: (id: string) => setQuickAddId(id),
      closeQuickAdd: () => setQuickAddId(null),
    }),
    [],
  )

  const value = useMemo<UIState>(
    () => ({ cartOpen, searchOpen, menuOpen, sizeGuide, quickAddId, toasts, ...actions, toast, dismissToast }),
    [cartOpen, searchOpen, menuOpen, sizeGuide, quickAddId, toasts, actions, toast, dismissToast],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
