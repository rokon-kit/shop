import type { ReactNode } from 'react'
import { Breadcrumb } from './Breadcrumb'
import { Reveal } from './Reveal'

export function PageHeader({ eyebrow, title, description, crumb }: { eyebrow?: string; title: ReactNode; description?: ReactNode; crumb: string }) {
  return (
    <header className="container-x pt-8 pb-12 md:pt-12 md:pb-16">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: crumb }]} />
      <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          {eyebrow && <p className="label mb-4 text-taupe">{eyebrow}</p>}
          <h1 className="display text-[clamp(3rem,9vw,7.5rem)]">{title}</h1>
        </Reveal>
        {description && (
          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-smoke">{description}</p>
          </Reveal>
        )}
      </div>
    </header>
  )
}
