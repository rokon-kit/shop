import type { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { CartProvider } from './CartContext'
import { RecentlyViewedProvider } from './RecentlyViewedContext'
import { UIProvider } from './UIContext'
import { WishlistProvider } from './WishlistContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>{children}</RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  )
}
