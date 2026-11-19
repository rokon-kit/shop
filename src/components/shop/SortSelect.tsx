import { ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { SortKey } from '../../types'
import { cn } from '../../utils/cn'
import { SORT_OPTIONS } from '../../utils/filters'

export function SortSelect({ value, onChange, className }: { value: SortKey; onChange: (v: SortKey) => void; className?: string }) {
  const id = useId()
  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <label htmlFor={id} className="label shrink-0 text-taupe">
        Sort
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="h-10 cursor-pointer appearance-none bg-transparent pr-7 pl-1 text-[0.8125rem] outline-none focus-visible:outline-2 focus-visible:outline-brick"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-1 h-4 w-4 -translate-y-1/2" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  )
}
