import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CartDrawer } from '../cart/CartDrawer'
import { Emblem } from '../common/Logo'
import { Toaster } from '../common/Toaster'
import { QuickAddSheet } from '../product/QuickAdd'
import { SizeGuideModal } from '../product/SizeGuideModal'
import { SearchOverlay } from '../search/SearchOverlay'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileMenu } from './MobileMenu'
import { MobileTabBar } from './MobileTabBar'
import { ScrollManager } from './ScrollManager'

function PageFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading">
      <Emblem className="h-10 w-10 animate-pulse text-ink" />
    </div>
  )
}

export function Layout() {
  const location = useLocation()
  const minimal = location.pathname.startsWith('/checkout')

  return (
    <>
      <a
        href="#main"
        className="label sr-only z-[200] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollManager />
      {!minimal && <AnnouncementBar />}
      {!minimal && <Header />}
      <main id="main" className="min-h-[60vh]">
        <Suspense fallback={<PageFallback />}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      {!minimal && <Footer />}
      <MobileTabBar />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <SizeGuideModal />
      <QuickAddSheet />
      <Toaster />
    </>
  )
}
