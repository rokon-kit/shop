import { Heart, Home, LayoutGrid, Search, User } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../utils/cn'

const HIDDEN_ON = [/^\/product\//, /^\/checkout/, /^\/cart/]

/**
 * Thumb-reachable navigation for phones. Hides on product, bag and checkout
 * pages (which have their own sticky actions) and tucks away while scrolling down.
 */
export function MobileTabBar() {
  const { pathname } = useLocation()
  const { openSearch, searchOpen } = useUI()
  const { count } = useWishlist()
  const { user } = useAuth()
  const { direction, scrolled } = useScrolled(120)

  if (HIDDEN_ON.some((r) => r.test(pathname))) return null
  const hidden = scrolled && direction === 'down'

  const item = 'flex flex-1 flex-col items-center justify-center gap-1 pt-2 pb-1.5 text-[0.625rem] tracking-wide transition-colors'

  return (
    <nav
      aria-label="Quick navigation"
      className={cn(
        'safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] lg:hidden',
        hidden && 'translate-y-full',
      )}
    >
      <ul className="flex">
        <li className="flex flex-1">
          <NavLink to="/" end className={({ isActive }) => cn(item, isActive ? 'text-ink' : 'text-taupe')}>
            <Home className="h-5 w-5" strokeWidth={1.4} />
            Home
          </NavLink>
        </li>
        <li className="flex flex-1">
          <button type="button" onClick={openSearch} className={cn(item, searchOpen ? 'text-ink' : 'text-taupe')}>
            <Search className="h-5 w-5" strokeWidth={1.4} />
            Search
          </button>
        </li>
        <li className="flex flex-1">
          <NavLink to="/shop" className={({ isActive }) => cn(item, isActive || pathname.startsWith('/shop') ? 'text-ink' : 'text-taupe')}>
            <LayoutGrid className="h-5 w-5" strokeWidth={1.4} />
            Shop
          </NavLink>
        </li>
        <li className="flex flex-1">
          <NavLink to="/wishlist" className={({ isActive }) => cn(item, 'relative', isActive ? 'text-ink' : 'text-taupe')}>
            <span className="relative">
              <Heart className="h-5 w-5" strokeWidth={1.4} />
              {count > 0 && <span className="absolute -top-1 -right-1.5 h-2 w-2 rounded-full bg-brick" aria-hidden="true" />}
            </span>
            Wishlist
          </NavLink>
        </li>
        <li className="flex flex-1">
          <NavLink
            to={user ? '/account' : '/login'}
            className={({ isActive }) => cn(item, isActive || pathname.startsWith('/account') ? 'text-ink' : 'text-taupe')}
          >
            <User className="h-5 w-5" strokeWidth={1.4} />
            Account
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
