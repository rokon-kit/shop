import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { User } from '../types'

interface AuthState {
  user: User | null
  signIn: (email: string) => void
  register: (data: { name: string; email: string; phone: string }) => void
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthState | null>(null)

/** Prototype-only auth: any email/password combination signs you in as a demo member. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('suto.user', null)

  const signIn = useCallback(
    (email: string) =>
      setUser({
        name: 'Tanvir Rahman',
        email,
        phone: '+880 1712-345678',
        memberSince: '2025-03-14',
      }),
    [setUser],
  )
  const register = useCallback<AuthState['register']>(
    ({ name, email, phone }) => setUser({ name, email, phone, memberSince: new Date().toISOString().slice(0, 10) }),
    [setUser],
  )
  const signOut = useCallback(() => setUser(null), [setUser])
  const updateProfile = useCallback((data: Partial<User>) => setUser((u) => (u ? { ...u, ...data } : u)), [setUser])

  const value = useMemo(() => ({ user, signIn, register, signOut, updateProfile }), [user, signIn, register, signOut, updateProfile])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
