import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { categories } from '../../data/categories'
import { newArrivals, searchProducts } from '../../data/products'
import { useEscape } from '../../hooks/useEscape'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLockBody } from '../../hooks/useLockBody'
import { Price } from '../common/Price'
import { SmartImage } from '../common/SmartImage'

export const POPULAR_SEARCHES = ['Shirts', 'Panjabi', 'Straight Pants', 'Oversized Tee', 'Linen', 'Overshirt']

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI()
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const input = useRef<HTMLInputElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useLockBody(searchOpen)
  useEscape(searchOpen, closeSearch)
  useFocusTrap(panel, searchOpen, input)

  useEffect(() => {
    closeSearch()
  }, [pathname, search, closeSearch])

  const results = useMemo(() => searchProducts(deferred), [deferred])
  const matchingCategories = useMemo(() => {
    const q = deferred.trim().toLowerCase()
    if (!q) return []
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.subcategories.some((s) => s.name.toLowerCase().includes(q)))
  }, [deferred])
  const trending = useMemo(() => newArrivals().slice(0, 4), [])

  const submit = (q = query) => {
    if (!q.trim()) return
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[85]">
          <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSearch} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col overflow-hidden bg-ivory"
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
              className="container-x shrink-0 border-b border-line"
            >
              <div className="flex items-center gap-3 py-5 md:py-8">
                <Search className="h-6 w-6 shrink-0 text-taupe md:h-8 md:w-8" strokeWidth={1.2} aria-hidden="true" />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  ref={input}
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shirts, panjabi, linen…"
                  autoComplete="off"
                  className="display min-w-0 flex-1 bg-transparent text-3xl tracking-tight outline-none placeholder:text-sand md:text-6xl [&::-webkit-search-cancel-button]:hidden"
                  style={{ textTransform: 'none' }}
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="label hidden text-smoke hover:text-ink sm:block">
                    Clear
                  </button>
                )}
                <button type="button" onClick={closeSearch} className="grid h-11 w-11 shrink-0 place-items-center hover:bg-bone" aria-label="Close search">
                  <X className="h-6 w-6" strokeWidth={1.3} />
                </button>
              </div>
            </form>

            <div className="container-x min-h-0 flex-1 overflow-y-auto overscroll-contain py-8 md:py-10">
              {!deferred.trim() ? (
                <div className="grid gap-10 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="label mb-5 text-taupe">Popular searches</p>
                    <ul className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => setQuery(term)}
                            className="border border-line-strong px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="label mt-10 mb-4 text-taupe">Categories</p>
                    <ul className="space-y-2">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link to={`/shop/${c.slug}`} className="serif link-u text-2xl">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-8">
                    <p className="label mb-5 text-taupe">Just landed</p>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {trending.map((p) => (
                        <li key={p.id}>
                          <Link to={`/product/${p.slug}`} className="group block">
                            <SmartImage src={p.images[0]} alt={p.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 768px) 15vw, 45vw" widths={[240, 360, 540]} />
                            <p className="mt-2 text-[0.8125rem] leading-snug">{p.name}</p>
                            <Price price={p.price} originalPrice={p.originalPrice} className="mt-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : results.length === 0 && matchingCategories.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="serif text-3xl">Nothing for “{deferred}”.</p>
                  <p className="mt-3 text-sm text-smoke">Check the spelling, or try one of these:</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 4).map((t) => (
                      <button key={t} type="button" onClick={() => setQuery(t)} className="border border-line-strong px-4 py-2 text-sm hover:border-ink">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-10 md:grid-cols-12">
                  <div className="md:col-span-3">
                    {matchingCategories.length > 0 && (
                      <>
                        <p className="label mb-4 text-taupe">Categories</p>
                        <ul className="mb-8 space-y-2">
                          {matchingCategories.map((c) => (
                            <li key={c.slug}>
                              <Link to={`/shop/${c.slug}`} className="serif link-u text-2xl">
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <p className="text-sm text-smoke" aria-live="polite">
                      {results.length} {results.length === 1 ? 'product' : 'products'} for “{deferred}”
                    </p>
                    {results.length > 0 && (
                      <button type="button" onClick={() => submit(deferred)} className="label link-u-static mt-4 inline-flex items-center gap-2">
                        See all results <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:col-span-9 lg:grid-cols-4">
                    {results.slice(0, 8).map((p, i) => (
                      <motion.li key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.35 }}>
                        <Link to={`/product/${p.slug}`} className="group block">
                          <SmartImage src={p.images[0]} alt={p.name} className="aspect-[4/5]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 17vw, (min-width: 640px) 30vw, 45vw" widths={[240, 360, 540]} />
                          <p className="mt-2 text-[0.8125rem] leading-snug">{p.name}</p>
                          <Price price={p.price} originalPrice={p.originalPrice} className="mt-1" />
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
