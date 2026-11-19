import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscape } from '../../hooks/useEscape'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBody } from '../../hooks/useLockBody'
import { cn } from '../../utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  hideTitle?: boolean
}

export function Modal({ open, onClose, title, children, className, hideTitle }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null)
  useLockBody(open)
  useEscape(open, onClose)
  useFocusTrap(panel, open)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn('relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain bg-paper outline-none sm:max-w-3xl', className)}
          >
            <div className={cn('sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 sm:px-8', hideTitle ? 'h-0 border-0' : 'h-16')}>
              <h2 className={cn('label text-xs', hideTitle && 'sr-only')}>{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className={cn('grid h-10 w-10 place-items-center bg-paper transition-colors hover:bg-bone', hideTitle ? 'absolute top-3 right-3' : '-mr-2')}
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
