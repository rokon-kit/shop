const taka = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })

/** ৳1,290 — Bangladeshi convention uses lakh grouping (1,00,000) */
export function formatPrice(value: number): string {
  return `৳${taka.format(Math.round(value))}`
}

export function discountPercent(price: number, original?: number): number | undefined {
  if (!original || original <= price) return undefined
  return Math.round(((original - price) / original) * 100)
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(iso).toLocaleDateString('en-GB', opts)
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Delivery estimate window, skipping Fridays (weekly holiday in Bangladesh). */
export function deliveryWindow(insideDhaka: boolean, from = new Date()): string {
  const addBusinessDays = (date: Date, days: number) => {
    const d = new Date(date)
    let added = 0
    while (added < days) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 5) added++
    }
    return d
  }
  const [min, max] = insideDhaka ? [1, 2] : [3, 5]
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${fmt(addBusinessDays(from, min))} – ${fmt(addBusinessDays(from, max))}`
}
