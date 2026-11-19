import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NavLink } from '../../data/content'
import { SmartImage } from '../common/SmartImage'

interface MegaMenuProps {
  item: NavLink
  id: string
  onNavigate: () => void
}

export function MegaMenu({ item, id, onNavigate }: MegaMenuProps) {
  if (!item.mega) return null
  const { columns, feature } = item.mega
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-full border-t border-line bg-paper text-ink shadow-[0_24px_48px_-24px_rgb(20_20_18/0.25)]"
    >
      <div className="container-x grid grid-cols-12 gap-8 py-10">
        <div className="col-span-2">
          <p className="label text-taupe">Shop</p>
          <p className="display mt-3 text-4xl">{item.label}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="col-span-3">
            <p className="label mb-5 text-taupe">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} onClick={onNavigate} className="link-u text-[0.9375rem] text-ink/80 transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link
          to={feature.to}
          onClick={onNavigate}
          className="group col-span-4 col-start-9 grid grid-cols-[1fr_9rem] items-end gap-5 bg-bone/60 p-4 xl:grid-cols-[1fr_11rem]"
        >
          <div className="pb-1">
            <p className="label text-taupe">Featured</p>
            <p className="serif mt-2 text-3xl leading-none xl:text-4xl">{feature.title}</p>
            <p className="mt-2 text-sm text-smoke">{feature.caption}</p>
            <span className="label mt-5 inline-flex items-center gap-1.5">
              Discover <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </span>
          </div>
          <SmartImage
            src={feature.image}
            alt={feature.title}
            className="aspect-[4/5]"
            imgClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            sizes="176px"
            widths={[240, 360]}
            baseWidth={360}
          />
        </Link>
      </div>
    </motion.div>
  )
}
