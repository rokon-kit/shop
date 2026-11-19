import { Heart, LayoutDashboard, LogOut, MapPin, Package, UserRound } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import { Breadcrumb } from '../common/Breadcrumb'

const links = [
  { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile', icon: UserRound },
]

export function AccountLayout() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />

  const current = links.find((l) => (l.end ? pathname === l.to : pathname.startsWith(l.to)))

  return (
    <div className="container-x pt-8 pb-20 md:pt-12 md:pb-28">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Account', to: '/account' }, ...(current && current.to !== '/account' ? [{ label: current.label }] : [])]} />
      <div className="mt-8 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="label text-taupe">My account</p>
            <p className="serif mt-2 text-3xl leading-tight">{user.name}</p>
            <nav aria-label="Account" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:mt-10 lg:block lg:space-y-1 lg:px-0">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 shrink-0 items-center gap-3 border px-4 text-sm transition-colors lg:h-11 lg:border-0 lg:border-l-2 lg:px-4',
                      isActive ? 'border-ink bg-ink text-paper lg:bg-bone lg:text-ink' : 'border-line-strong text-smoke hover:text-ink lg:border-transparent',
                    )
                  }
                >
                  <Icon className="h-4 w-4" strokeWidth={1.4} />
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => {
                  signOut()
                  navigate('/')
                }}
                className="flex h-10 shrink-0 items-center gap-3 border border-line-strong px-4 text-sm text-smoke hover:text-brick lg:mt-6 lg:h-11 lg:w-full lg:border-0 lg:border-t lg:border-line lg:pt-4"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.4} /> Sign out
              </button>
            </nav>
          </div>
        </aside>
        <div className="min-w-0 lg:col-span-9">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
