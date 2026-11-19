import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'paper' | 'brick' | 'outline-paper'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-medium uppercase tracking-[0.14em] transition-[color,background-color,border-color,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.985] disabled:pointer-events-none disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-graphite',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:bg-bone',
  paper: 'bg-paper text-ink hover:bg-ivory',
  brick: 'bg-brick text-paper hover:bg-brick-deep',
  'outline-paper': 'border border-paper/70 text-paper hover:border-paper hover:bg-paper hover:text-ink',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[0.6875rem]',
  md: 'h-12 px-7 text-xs',
  lg: 'h-14 px-9 text-xs',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  full?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, full, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, cn(full && 'w-full', className))} {...rest}>
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-300 group-hover/btn:translate-x-0.5">{icon}</span>}
    </button>
  )
})

interface ButtonLinkProps extends LinkProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  full?: boolean
}

export function ButtonLink({ variant = 'primary', size = 'md', icon, full, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, cn(full && 'w-full', className))} {...rest}>
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-300 group-hover/btn:translate-x-0.5">{icon}</span>}
    </Link>
  )
}
