import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { announcements } from '../../data/content'

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setIndex((i) => (i + 1) % announcements.length), 4500)
    return () => window.clearInterval(t)
  }, [paused])

  return (
    <div
      className="relative z-[60] bg-ink text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x grid h-9 grid-cols-[1fr_auto_1fr] items-center">
        <div className="label hidden text-paper/60 md:block">
          <Link to="/stores" className="link-u hover:text-paper">
            Banani · Dhanmondi · Chattogram
          </Link>
        </div>
        <div className="relative col-span-3 h-4 overflow-hidden text-center md:col-span-1 md:min-w-[26rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="label absolute inset-0 truncate text-[0.625rem] sm:text-2xs"
            >
              {announcements[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="label hidden items-center justify-end gap-5 text-paper/60 md:flex">
          <Link to="/track-order" className="link-u hover:text-paper">
            Track order
          </Link>
          <Link to="/faq" className="link-u hover:text-paper">
            Help
          </Link>
        </div>
      </div>
    </div>
  )
}
