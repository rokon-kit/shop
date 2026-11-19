import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: ReactNode
  prefix?: string
}

export function Field({ label, error, hint, prefix, id, className, ...rest }: FieldProps) {
  const fid = id ?? rest.name
  return (
    <div className={className}>
      <label htmlFor={fid} className="field-label">
        {label}
        {rest.required && <span className="text-brick"> *</span>}
      </label>
      <div className="flex">
        {prefix && <span className="grid shrink-0 place-items-center border border-r-0 border-line-strong bg-bone px-3 text-sm text-smoke">{prefix}</span>}
        <input id={fid} aria-invalid={!!error} aria-describedby={error || hint ? `${fid}-msg` : undefined} className="field" {...rest} />
      </div>
      {(error || hint) && (
        <p id={`${fid}-msg`} className={cn('mt-1.5 text-xs', error ? 'text-brick' : 'text-taupe')} role={error ? 'alert' : undefined}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: string[]
  placeholder?: string
}

export function SelectField({ label, error, options, placeholder = 'Select', id, className, ...rest }: SelectFieldProps) {
  const fid = id ?? rest.name
  return (
    <div className={className}>
      <label htmlFor={fid} className="field-label">
        {label}
        {rest.required && <span className="text-brick"> *</span>}
      </label>
      <div className="relative">
        <select id={fid} aria-invalid={!!error} aria-describedby={error ? `${fid}-msg` : undefined} className="field cursor-pointer appearance-none pr-10" {...rest}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-smoke" strokeWidth={1.5} />
      </div>
      {error && (
        <p id={`${fid}-msg`} className="mt-1.5 text-xs text-brick" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface OptionCardProps {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
  disabled?: boolean
  children?: ReactNode
}

/** Large radio card used for delivery and payment choices. */
export function OptionCard({ name, value, checked, onChange, title, description, aside, disabled, children }: OptionCardProps) {
  return (
    <div className={cn('border transition-colors', checked ? 'border-ink bg-paper' : 'border-line-strong', disabled && 'opacity-45')}>
      <label className={cn('flex cursor-pointer items-start gap-4 p-4 sm:p-5', disabled && 'cursor-not-allowed')}>
        <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} className="peer sr-only" />
        <span
          className={cn(
            'mt-0.5 grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-full border peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brick',
            checked ? 'border-ink' : 'border-line-strong',
          )}
          aria-hidden="true"
        >
          {checked && <span className="h-2 w-2 rounded-full bg-ink" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{title}</span>
          {description && <span className="mt-1 block text-xs leading-relaxed text-smoke">{description}</span>}
        </span>
        {aside && <span className="tabular shrink-0 text-sm">{aside}</span>}
      </label>
      {checked && children && <div className="border-t border-line px-4 pt-4 pb-5 sm:px-5">{children}</div>}
    </div>
  )
}
