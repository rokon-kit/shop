import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { SmartImage } from '../common/SmartImage'

interface CategoryCardProps {
  to: string
  name: string
  image: string
  index: string
  meta?: string
  className?: string
  imgPosition?: string
  sizes?: string
  large?: boolean
}

export function CategoryCard({ to, name, image, index, meta, className, imgPosition, sizes = '25vw', large }: CategoryCardProps) {
  return (
    <Link to={to} className={cn('group relative block overflow-hidden bg-graphite text-paper', className)}>
      <SmartImage
        src={image}
        alt=""
        className="absolute inset-0 bg-graphite"
        imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        style={imgPosition ? { objectPosition: imgPosition } : undefined}
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-ink/10 transition-opacity duration-700 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />

      <span className="label tabular absolute top-4 left-4 text-paper/80 md:top-5 md:left-5">{index}</span>
      <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-paper/40 opacity-0 transition-all duration-500 group-hover:opacity-100 md:top-4 md:right-4">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
      </span>

      <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
        {meta && <p className="label mb-2 text-paper/70">{meta}</p>}
        <h3 className={cn('display text-paper', large ? 'text-5xl sm:text-6xl lg:text-7xl xl:text-8xl' : 'text-[1.125rem] xs:text-[1.375rem] sm:text-4xl lg:text-[1.5rem] xl:text-[2rem] 2xl:text-[2.5rem]')}>{name}</h3>
        <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-paper/70 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden="true" />
      </div>
    </Link>
  )
}
