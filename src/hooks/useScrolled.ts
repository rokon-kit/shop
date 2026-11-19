import { useEffect, useRef, useState } from 'react'

/** Returns whether the page has scrolled past `threshold`, and the scroll direction. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const last = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > threshold)
        if (Math.abs(y - last.current) > 6) {
          setDirection(y > last.current ? 'down' : 'up')
          last.current = y
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return { scrolled, direction }
}
