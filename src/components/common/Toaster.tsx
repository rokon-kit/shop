import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { SmartImage } from './SmartImage'

export function Toaster() {
  const { toasts, dismissToast } = useUI()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end lg:bottom-8"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 bg-ink p-3 pr-2 text-paper shadow-[0_10px_40px_-12px_rgb(0_0_0/0.4)]"
            role="status"
          >
            {t.image && <SmartImage src={t.image} alt="" className="h-14 w-11 shrink-0" sizes="44px" widths={[120]} baseWidth={120} />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="truncate text-xs text-paper/60">{t.description}</p>}
            </div>
            {t.action && (
              <Link to={t.action.to} onClick={() => dismissToast(t.id)} className="label shrink-0 px-2 py-2 text-paper underline-offset-4 hover:underline">
                {t.action.label}
              </Link>
            )}
            <button type="button" onClick={() => dismissToast(t.id)} className="grid h-8 w-8 shrink-0 place-items-center text-paper/60 hover:text-paper" aria-label="Dismiss">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
