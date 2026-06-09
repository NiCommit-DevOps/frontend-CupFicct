import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-brand-100 bg-panel-light shadow-sm dark:border-brand-800/60 dark:bg-panel-dark ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
