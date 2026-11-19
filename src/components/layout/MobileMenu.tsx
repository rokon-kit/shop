import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Heart, MapPin, Package, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { useWishlist } from '../../context/WishlistContext'
import { mainNav, social } from '../../data/content'
import { photo } from '../../data/photos'
import { cn } from '../../utils/cn'
import { Drawer } from '../common/Drawer'
import { socialIcons } from '../common/Icons'
import { Logo } from '../common/Logo'
import { SmartImage } from '../common/SmartImage'

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUI()
  const { user } = useAuth()
  const { count } = useWishlist()
  const { pathname, search } = useLocation()
  const [expanded, setExpanded] = useState<string | null>(null)
  const close = () => setMenuOpen(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname, search, setMenuOpen])

  return (
    <Drawer open={menuOpen} onClose={close} title={<Logo className="text-xl" />} side="left">
      <nav aria-label="Mobile" className="flex min-h-full flex-col">
        <ul className="px-5 pt-2">
          {mainNav.map((item, i) => {
            const isOpen = expanded === item.label
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-line"
              >
                <div className="flex items-center justify-between">
                  <Link to={item.to} className={cn('display flex-1 py-4 text-[1.75rem]', item.label === 'Sale' && 'text-brick')}>
                    {item.label}
                  </Link>
                  {item.mega && (
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="grid h-11 w-11 place-items-center"
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                    >
                      <ChevronDown className={cn('h-5 w-5 transition-transform duration-300', isOpen && 'rotate-180')} strokeWidth={1.4} />
                    </button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && item.mega && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      {item.mega.columns[0].links.map((l) => (
                        <li key={l.to}>
                          <Link to={l.to} className="flex items-center justify-between py-2.5 pl-1 text-[0.9375rem] text-smoke">
                            {l.label}
                            <ArrowRight className="h-3.5 w-3.5 opacity-50" strokeWidth={1.5} />
                          </Link>
                        </li>
                      ))}
                      <li className="h-3" aria-hidden="true" />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>

        <Link to="/shop?collection=festive-edit" className="group relative mx-5 mt-6 block overflow-hidden">
          <SmartImage src={photo.pjEmerald2} alt="The Festive Edit" className="aspect-[16/10]" sizes="90vw" widths={[480, 720]} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 text-paper">
            <p className="label text-paper/70">Puja · Weddings · Eid</p>
            <p className="serif text-3xl">The Festive Edit</p>
          </div>
        </Link>

        <ul className="mt-6 grid grid-cols-2 gap-px border-y border-line bg-line text-sm">
          {[
            { to: user ? '/account' : '/login', label: user ? 'Account' : 'Sign in', icon: User },
            { to: '/wishlist', label: `Wishlist${count ? ` (${count})` : ''}`, icon: Heart },
            { to: '/track-order', label: 'Track order', icon: Package },
            { to: '/stores', label: 'Stores', icon: MapPin },
          ].map(({ to, label, icon: Icon }) => (
            <li key={to} className="bg-paper">
              <Link to={to} className="flex items-center gap-3 px-5 py-4">
                <Icon className="h-4 w-4" strokeWidth={1.4} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-2 px-5 py-6">
          {social.map((s) => {
            const Icon = socialIcons[s.label]
            return (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center border border-line" aria-label={s.label}>
                <Icon className="h-4 w-4" />
              </a>
            )
          })}
          <span className="label ml-auto text-taupe">Threaded in Dhaka</span>
        </div>
      </nav>
    </Drawer>
  )
}
