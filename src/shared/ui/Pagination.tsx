import { Button } from './Button'

interface Props {
  page: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, lastPage, total, onPageChange }: Props) {
  if (lastPage <= 1) {
    return (
      <p className="px-4 py-3 text-xs text-slate-400">{total} registro(s)</p>
    )
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-xs text-slate-400">
        Página {page} de {lastPage} · {total} registro(s)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
