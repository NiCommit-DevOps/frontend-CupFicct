/**
 * Abre una ventana con el documento ya formateado y lanza el diálogo de
 * impresión del navegador (permite "Guardar como PDF"). Sin dependencias.
 */
export function imprimirDocumento(titulo: string, cuerpoHtml: string) {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return

  win.document.write(`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 32px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 24px 0 8px; color: #334155; }
  .sub { color: #64748b; font-size: 13px; margin: 0 0 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px; }
  th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
  th { background: #f1f5f9; text-transform: uppercase; font-size: 10px; letter-spacing: .04em; }
  td.num, th.num { text-align: right; }
  .meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
  .cert { max-width: 640px; margin: 0 auto; }
  .cert .campo { display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding: 8px 0; font-size: 14px; }
  .cert .campo b { color: #334155; }
  .pie { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; }
</style></head>
<body>${cuerpoHtml}
<p class="pie">Documento generado por el Sistema de Admisión CUP FICCT — UAGRM.</p>
</body></html>`)
  win.document.close()
  win.focus()
  // Da tiempo a renderizar antes de imprimir.
  setTimeout(() => win.print(), 250)
}

/** Dispara la descarga de un Blob (p. ej. un CSV) con el nombre indicado. */
export function descargarBlob(data: Blob, nombre: string) {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Escapa texto para insertarlo en el HTML de impresión. */
export function esc(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))
}
