/** Pie público de la landing FICCT. */
export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50 text-slate-500 dark:border-slate-700/40 dark:bg-panel-dark dark:text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-extrabold text-white">F</span>
              <span className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">FICCT</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">UAGRM</span>
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones de la
              Universidad Autónoma Gabriel René Moreno.
            </p>
            <p className="mt-4 text-sm">
              Av. Busch, Ciudad Universitaria, Módulo 236 — Santa Cruz de la Sierra, Bolivia
            </p>
            <p className="mt-1 text-sm">(591) 3 - 3553636 · f_icct@uagrm.edu.bo</p>
          </div>

          <div className="text-sm">
            <p className="font-semibold uppercase tracking-widest text-slate-400">Navegación</p>
            <ul className="mt-3 flex flex-col gap-2">
              <li><a href="#inicio" className="transition-colors hover:text-brand-600 dark:hover:text-white">Inicio</a></li>
              <li><a href="#convocatoria" className="transition-colors hover:text-brand-600 dark:hover:text-white">Convocatoria</a></li>
              <li><a href="#contacto" className="transition-colors hover:text-brand-600 dark:hover:text-white">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/70 pt-6 text-center text-xs dark:border-slate-700/40">
          <p className="italic text-slate-400">Por estudiantes, para estudiantes</p>
          <p className="mt-2">© 2026 FICCT — UAGRM. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
