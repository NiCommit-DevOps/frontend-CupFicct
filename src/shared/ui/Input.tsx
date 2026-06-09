import { forwardRef, useState, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const fieldClasses =
  'w-full rounded-xl border border-slate-200/60 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700/40 dark:bg-panel-dark dark:text-slate-100 dark:placeholder:text-slate-500'

const eyeIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const eyeOffIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-6.5 0-10-7-10-7a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c6.5 0 10 7 10 7a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l22 22" />
  </svg>
)

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, type = 'text', ...props }, ref) => {
    const inputId = id ?? props.name
    const isPassword = type === 'password'
    const [reveal, setReveal] = useState(false)
    const inputType = isPassword && reveal ? 'text' : type

    const inputEl = (
      <input
        ref={ref}
        id={inputId}
        type={inputType}
        className={`${fieldClasses} ${isPassword ? 'pr-11' : ''} ${error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : ''} ${className}`}
        {...props}
      />
    )

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        {isPassword ? (
          <div className="relative">
            {inputEl}
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:hover:text-slate-200"
            >
              {reveal ? eyeOffIcon : eyeIcon}
            </button>
          </div>
        ) : (
          inputEl
        )}
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'
