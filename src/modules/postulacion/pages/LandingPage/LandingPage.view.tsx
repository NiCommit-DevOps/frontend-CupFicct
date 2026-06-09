import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/shared/ui'
import { PublicNavbar } from '../../components/PublicNavbar.view'
import { PublicFooter } from '../../components/PublicFooter.view'
import type { ConvocatoriaPublica } from '../../types'

interface Props {
  convocatoria: ConvocatoriaPublica | null
  loading: boolean
}

/** Fecha ISO (YYYY-MM-DD) a texto legible en español, sin desfase de zona horaria. */
function formatearFecha(iso: string | null): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d} de ${meses[(m ?? 1) - 1]} de ${y}`
}

const flecha = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)

export function LandingPageView({ convocatoria, loading }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-panel-bgLight text-slate-600 dark:bg-panel-bgDark dark:text-slate-300">
      <PublicNavbar />

      {/* Hero */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[24rem] w-[24rem] rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600 shadow-sm dark:border-slate-700/50 dark:bg-panel-dark dark:text-brand-300">
            <span className={`h-2 w-2 rounded-full ${convocatoria ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'}`} />
            {convocatoria ? 'Admisión abierta' : 'UAGRM — Santa Cruz, Bolivia'}
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Facultad de Ingeniería en Ciencias de la Computación y Telecomunicaciones
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Formando profesionales altamente capacitados en computación, sistemas, redes y robótica
            desde 1987 en la Universidad Autónoma Gabriel René Moreno.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {convocatoria && (
              <button
                type="button"
                onClick={() => navigate('/postular')}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
              >
                Postular ahora {flecha}
              </button>
            )}
            <a
              href="#convocatoria"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/5"
            >
              {convocatoria ? 'Ver convocatoria' : 'Conócenos'}
            </a>
          </div>
        </div>
      </section>

      {/* Sección Convocatoria — solo aparece si hay una vigente dentro de fecha. */}
      <section id="convocatoria" className="border-t border-slate-200/70 bg-slate-50 dark:border-slate-700/40 dark:bg-panel-dark">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-accent-500">
            Admisión (CUP)
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Convocatoria de Postulación
          </h2>

          <div className="mx-auto mt-10 max-w-2xl">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner className="h-8 w-8" />
              </div>
            ) : convocatoria ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700/50 dark:bg-panel-bgDark">
                {/* Franja superior tricolor. */}
                <div className="flex h-1.5 w-full">
                  <span className="h-full flex-1 bg-brand-500" />
                  <span className="h-full flex-1 bg-accent-500" />
                  <span className="h-full flex-1 bg-emerald-500" />
                </div>
                <div className="p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Inscripciones abiertas
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{convocatoria.nombre}</h3>
                  <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Inscripciones desde</dt>
                      <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{formatearFecha(convocatoria.fecha_creacion)}</dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Fecha límite</dt>
                      <dd className="mt-1 font-semibold text-slate-900 dark:text-white">{formatearFecha(convocatoria.fecha_limite_inscripcion)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => navigate('/postular')}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    Llenar formulario de postulación {flecha}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700/50 dark:bg-panel-bgDark">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">No hay convocatorias abiertas en este momento</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Cuando se habilite una nueva convocatoria de admisión, aparecerá aquí con el
                  formulario de postulación. Vuelve a consultar más adelante.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="border-t border-slate-200/70 dark:border-slate-700/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">Comunícate</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Contáctanos</h2>
          <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
            Conéctate con nosotros a través de nuestros canales oficiales o visita nuestras instalaciones.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Dirección', valor: 'Av. Busch, Ciudad Universitaria, Módulo 236 — Santa Cruz de la Sierra, Bolivia', color: 'bg-brand-500' },
              { label: 'Teléfono', valor: '(591) 3 - 3553636', color: 'bg-accent-500' },
              { label: 'Correo', valor: 'f_icct@uagrm.edu.bo', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-panel-dark">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`} />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm text-slate-800 dark:text-white">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
