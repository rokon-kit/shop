import { Search } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '../components/common/Breadcrumb'
import { EmptyState } from '../components/common/EmptyState'
import { ProductGrid } from '../components/product/ProductGrid'
import { POPULAR_SEARCHES } from '../components/search/SearchOverlay'
import { bestSellers, searchProducts } from '../data/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [value, setValue] = useState(q)
  useDocumentTitle(q ? `Search: ${q}` : 'Search')

  useEffect(() => setValue(q), [q])

  const results = useMemo(() => searchProducts(q), [q])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setParams(value.trim() ? { q: value.trim() } : {})
  }

  return (
    <div className="container-x pt-8 pb-20 md:pt-12 md:pb-28">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
      <form role="search" onSubmit={submit} className="mt-8 flex items-center gap-4 border-b border-ink pb-4 md:mt-12">
        <Search className="h-7 w-7 shrink-0 text-taupe md:h-10 md:w-10" strokeWidth={1.1} aria-hidden="true" />
        <label htmlFor="search-page-input" className="sr-only">
          Search
        </label>
        <input
          id="search-page-input"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search the collection"
          className="display min-w-0 flex-1 bg-transparent text-4xl outline-none placeholder:text-sand md:text-7xl"
          style={{ textTransform: 'none' }}
        />
        <button type="submit" className="label shrink-0">
          Search
        </button>
      </form>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label mr-2 text-taupe">Popular</span>
        {POPULAR_SEARCHES.map((t) => (
          <button key={t} type="button" onClick={() => setParams({ q: t })} className="border border-line-strong px-3.5 py-1.5 text-xs transition-colors hover:border-ink">
            {t}
          </button>
        ))}
      </div>

      {q && (
        <p className="mt-12 text-sm text-smoke" aria-live="polite">
          {results.length} {results.length === 1 ? 'result' : 'results'} for <span className="text-ink">“{q}”</span>
        </p>
      )}

      {q && results.length === 0 ? (
        <>
          <EmptyState title={`Nothing for “${q}”.`} description="Try a broader word — “shirt”, “linen”, “panjabi” — or browse our best sellers below." />
          <h2 className="label mb-6 text-taupe">Best sellers</h2>
          <ProductGrid products={bestSellers().slice(0, 8)} />
        </>
      ) : (
        <div className="mt-8">
          <ProductGrid products={q ? results : bestSellers().slice(0, 8)} />
        </div>
      )}
    </div>
  )
}
