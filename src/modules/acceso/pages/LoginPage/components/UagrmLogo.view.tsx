/**
 * Marca institucional UAGRM (recreación autocontenida: sello SVG + wordmark).
 * Para usar el logo oficial, reemplaza el bloque <svg> del sello y/o el texto
 * por una imagen en `src/assets` (p. ej. <img src={logoUrl} />).
 */
export function UagrmLogo() {
  return (
    <div className="flex select-none items-center justify-center gap-4 text-slate-400 dark:text-slate-500">
      {/* Sello / escudo (placeholder heráldico) */}
      <svg viewBox="0 0 100 100" className="h-16 w-16 shrink-0" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="46" strokeWidth="2" />
        <circle cx="50" cy="50" r="38" strokeWidth="1" />
        {/* escudo central */}
        <path d="M50 26 L66 32 V54 C66 66 58 72 50 76 C42 72 34 66 34 54 V32 Z" strokeWidth="2" fill="currentColor" fillOpacity="0.12" />
        <path d="M50 26 V76 M34 44 H66" strokeWidth="1.5" />
        {/* destellos perimetrales */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          const x1 = 50 + Math.cos(a) * 39
          const y1 = 50 + Math.sin(a) * 39
          const x2 = 50 + Math.cos(a) * 43
          const y2 = 50 + Math.sin(a) * 43
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1" />
        })}
      </svg>

      {/* Wordmark */}
      <div className="font-serif leading-tight">
        <div className="text-[13px] uppercase tracking-[0.45em] sm:text-[15px]">
          Universidad&nbsp;Autónoma
        </div>
        <div className="-mt-1 text-3xl tracking-wide sm:text-4xl">Gabriel René Moreno</div>
      </div>
    </div>
  )
}
