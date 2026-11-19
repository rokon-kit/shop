import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { mainNav } from '../../data/content'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../utils/cn'
import { Logo } from '../common/Logo'
import { MegaMenu } from './MegaMenu'

function CountBadge({ count, tone }: { count: number; tone: 'ink' | 'paper' }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={cn(
            'tabular absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.5625rem] font-semibold',
            tone === 'paper' ? 'bg-paper text-ink' : 'bg-brick text-paper',
          )}
          aria-hidden="true"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const { scrolled } = useScrolled(40)
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { user } = useAuth()
  const { openCart, openSearch, setMenuOpen } = useUI()
  const [active, setActive] = useState<string | null>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => setActive(null), [pathname])

  const overlay = pathname === '/' && !scrolled && !active
  const tone = overlay ? 'paper' : 'ink'

  const open = (label: string) => {
    window.clearTimeout(closeTimer.current)
    setActive(label)
  }
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setActive(null), 140)
  }

  const iconBtn = cn(
    'relative grid h-10 w-10 place-items-center transition-colors duration-300',
    overlay ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-bone',
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500',
        overlay ? 'border-b border-transparent bg-transparent' : 'border-b border-line bg-ivory/92 backdrop-blur-md',
      )}
      onMouseLeave={scheduleClose}
      onKeyDown={(e) => e.key === 'Escape' && setActive(null)}
    >
      {overlay && <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/35 to-transparent" aria-hidden="true" />}
      <div
        className={cn(
          'container-x relative grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ease-[var(--ease-out-expo)] lg:grid-cols-[auto_1fr_auto]',
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20',
        )}
      >
        {/* Mobile: menu trigger */}
        <div className="flex items-center lg:hidden">
          <button type="button" className={cn(iconBtn, '-ml-2')} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
          <button type="button" className={iconBtn} onClick={openSearch} aria-label="Search">
            <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
          </button>
        </div>

        <Link to="/" className="justify-self-center lg:justify-self-start" aria-label="SUTO home">
          <Logo tone={tone} className={cn('transition-[font-size] duration-500', scrolled ? 'text-[1.35rem] lg:text-2xl' : 'text-[1.5rem] lg:text-[1.75rem]')} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-5 xl:gap-8">
            {mainNav.map((item) => {
              const menuId = `mega-${item.label.toLowerCase().replace(/\s+/g, '-')}`
              const isSale = item.label === 'Sale'
              return (
                <li key={item.label} onMouseEnter={() => (item.mega ? open(item.label) : setActive(null))}>
                  <RouterNavLink
                    to={item.to}
                    onFocus={() => item.mega && open(item.label)}
                    aria-expanded={item.mega ? active === item.label : undefined}
                    aria-controls={item.mega ? menuId : undefined}
                    className={({ isActive }) =>
                      cn(
                        'label link-u relative block py-3 text-[0.6875rem] transition-colors',
                        overlay ? 'text-paper' : isSale ? 'text-brick' : 'text-ink',
                        (isActive || active === item.label) && 'bg-[length:100%_1px]',
                      )
                    }
                  >
                    {item.label}
                  </RouterNavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <button type="button" className={cn(iconBtn, 'hidden lg:grid')} onClick={openSearch} aria-label="Search">
            <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
          </button>
          <Link to={user ? '/account' : '/login'} className={cn(iconBtn, 'hidden lg:grid')} aria-label={user ? 'My account' : 'Sign in'}>
            <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
          </Link>
          <Link to="/wishlist" className={cn(iconBtn, 'hidden sm:grid')} aria-label={`Wishlist, ${wishCount} items`}>
            <Heart className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
            <CountBadge count={wishCount} tone={tone} />
          </Link>
          <button type="button" className={cn(iconBtn, '-mr-2')} onClick={openCart} aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
            <CountBadge count={count} tone={tone} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <div onMouseEnter={() => open(active)} className="hidden lg:block">
            <MegaMenu
              key={active}
              id={`mega-${active.toLowerCase().replace(/\s+/g, '-')}`}
              item={mainNav.find((n) => n.label === active)!}
              onNavigate={() => setActive(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
