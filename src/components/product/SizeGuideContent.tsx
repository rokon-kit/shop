import { useState } from 'react'
import type { SizeGuideTab } from '../../context/UIContext'
import { sizeCharts, type SizeChartKey } from '../../data/content'
import { cn } from '../../utils/cn'

const CM = 2.54

/** Size charts with an inch / cm toggle and a short measuring guide. */
export function SizeGuideContent({ initial = 'shirts' }: { initial?: SizeGuideTab }) {
  const [tab, setTab] = useState<SizeChartKey>(initial)
  const [unit, setUnit] = useState<'in' | 'cm'>('in')
  const chart = sizeCharts[tab]

  const fmt = (v: string | number, col: number) => {
    if (typeof v === 'string' || col === 0) return v
    return unit === 'in' ? v : Math.round(v * CM)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Garment" className="no-scrollbar -mx-1 flex overflow-x-auto">
          {(Object.keys(sizeCharts) as SizeChartKey[]).map((k) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                'label shrink-0 border-b px-3 py-3 transition-colors',
                tab === k ? 'border-ink text-ink' : 'border-transparent text-taupe hover:text-ink',
              )}
            >
              {sizeCharts[k].label}
            </button>
          ))}
        </div>
        <div className="inline-flex border border-line-strong p-0.5" role="group" aria-label="Units">
          {(['in', 'cm'] as const).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={cn('label h-8 px-3', unit === u ? 'bg-ink text-paper' : 'text-smoke hover:text-ink')}
            >
              {u === 'in' ? 'Inches' : 'cm'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto" role="tabpanel">
        <table className="tabular w-full min-w-[30rem] border-collapse text-sm">
          <caption className="sr-only">
            {chart.label} size chart in {unit === 'in' ? 'inches' : 'centimetres'}
          </caption>
          <thead>
            <tr className="border-b border-ink">
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="label py-3 pr-4 text-left font-medium text-smoke">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={String(row[0])} className="border-b border-line transition-colors hover:bg-bone/60">
                {row.map((v, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="py-3.5 pr-4 text-left font-medium">
                      {v}
                    </th>
                  ) : (
                    <td key={i} className="py-3.5 pr-4 text-smoke">
                      {fmt(v, i)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-taupe">{chart.note}</p>

      <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
        {[
          { t: 'Chest', d: 'Measure around the fullest part of your chest, under the arms, keeping the tape level.' },
          { t: tab === 'pants' ? 'Waist' : 'Length', d: tab === 'pants' ? 'Measure around your natural waistline, where you normally wear your trousers.' : 'From the highest point of the shoulder, next to the collar, down to the hem.' },
          { t: tab === 'pants' ? 'Inseam' : 'Sleeve', d: tab === 'pants' ? 'From the crotch seam to the bottom of the leg. We hem for free in store.' : 'From the shoulder seam to the end of the cuff, with the arm relaxed.' },
        ].map((m, i) => (
          <div key={m.t}>
            <p className="label text-taupe">0{i + 1}</p>
            <p className="serif mt-1 text-2xl">{m.t}</p>
            <p className="mt-2 text-sm leading-relaxed text-smoke">{m.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
