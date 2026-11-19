import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Tone = 'new' | 'sale' | 'sold' | 'limited' | 'neutral'

const tones: Record<Tone, string> = {
  new: 'bg-paper text-ink',
  sale: 'bg-brick text-paper',
  sold: 'bg-ink text-paper',
  limited: 'bg-moss text-paper',
  neutral: 'bg-bone text-ink',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('label inline-flex h-6 items-center px-2 text-[0.625rem] leading-none', tones[tone], className)}>{children}</span>
}
