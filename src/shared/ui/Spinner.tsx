export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent ${className}`}
      role="status"
      aria-label="Cargando"
    />
  )
}

export function LoadingState({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 dark:text-slate-500">
      <Spinner />
      <span className="text-sm">{label}</span>
    </div>
  )
}
