import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LIMIT = 12

interface RecentlyViewedState {
  ids: string[]
  track: (id: string) => void
  clear: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedState | null>(null)

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>('suto.recent', [])

  const track = useCallback(
    (id: string) => setIds((prev) => (prev[0] === id ? prev : [id, ...prev.filter((x) => x !== id)].slice(0, LIMIT))),
    [setIds],
  )
  const clear = useCallback(() => setIds([]), [setIds])

  const value = useMemo(() => ({ ids, track, clear }), [ids, track, clear])
  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
