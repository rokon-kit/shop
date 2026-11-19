import { AnimatePresence, motion, type TargetAndTransition } from 'framer-motion'
import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscape } from '../../hooks/useEscape'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBody } from '../../hooks/useLockBody'
import { cn } from '../../utils/cn'

type Side = 'right' | 'left' | 'bottom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  side?: Side
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** Visually hide the header title but keep it for screen readers */
  hideHeader?: boolean
  headerExtra?: ReactNode
}

const motionBySide: Record<Side, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
}

const positionBySide: Record<Side, string> = {
  right: 'inset-y-0 right-0 h-full w-full max-w-[28rem]',
  left: 'inset-y-0 left-0 h-full w-[88vw] max-w-[24rem]',
  bottom: 'inset-x-0 bottom-0 max-h-[88dvh] w-full',
}

export function Drawer({ open, onClose, title, side = 'right', children, footer, className, hideHeader, headerExtra }: DrawerProps) {
  const panel = useRef<HTMLDivElement>(null)
  useLockBody(open)
  useEscape(open, onClose)
  useFocusTrap(panel, open)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            tabIndex={-1}
            {...motionBySide[side]}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn('absolute flex flex-col bg-paper outline-none', positionBySide[side], side === 'bottom' && 'safe-bottom', className)}
          >
            {side === 'bottom' && <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-stone" aria-hidden="true" />}
            <div className={cn('flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 sm:px-6', hideHeader ? 'sr-only' : 'h-16')}>
              <h2 className="label text-xs">{title}</h2>
              <div className="flex items-center gap-2">
                {headerExtra}
                <button type="button" onClick={onClose} className="-mr-2 grid h-10 w-10 place-items-center transition-colors hover:bg-bone" aria-label="Close">
                  <X className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <div className="shrink-0 border-t border-line">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
