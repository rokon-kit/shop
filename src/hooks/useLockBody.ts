import { useEffect } from 'react'

let locks = 0

/** Prevents background scroll while overlays are open. Ref-counted so stacked overlays behave. */
export function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks++
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    if (locks === 1) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : ''
    }
    return () => {
      locks--
      if (locks === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [active])
}
