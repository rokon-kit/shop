import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/** Fade-and-rise on first scroll into view. Respects reduced motion. */
export function Reveal({ children, delay = 0, y = 28, as = 'div', ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Image curtain reveal — a paper panel slides off the image. */
export function ImageReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="h-full w-full"
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-[2] origin-top bg-ivory"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.1, delay, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </div>
  )
}
