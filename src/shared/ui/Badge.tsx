import type { ReactNode } from 'react'

type Tone = 'brand' | 'success' | 'neutral' | 'danger'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  success: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  neutral: 'bg-white text-slate-700 ring-1 ring-brand-100 dark:bg-black dark:text-slate-200 dark:ring-brand-800',
  danger: 'bg-[#ffe1e1] text-[#b71c1c] dark:bg-[#5a0f10]/70 dark:text-[#ffb3b3]',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
