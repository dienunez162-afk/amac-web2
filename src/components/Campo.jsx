// Campo de formulario accesible: etiqueta unida al control, texto de ayuda y mensaje de error.
// Se reutiliza en registro, login y publicar vacante.
export default function Campo({
  id,
  etiqueta,
  etiquetaOculta = false, // la etiqueta existe para lectores de pantalla pero no se ve
  obligatorio = false,
  ayuda,
  error,
  como = 'input',   // 'input' | 'textarea' | 'select'
  children,         // opciones cuando como = 'select'
  ...props
}) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined
  const idError = error ? `${id}-error` : undefined
  const describedBy = [idAyuda, idError].filter(Boolean).join(' ') || undefined

  const comunes = {
    id,
    name: id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': obligatorio || undefined,
    ...props,
  }

  return (
    <div className="campo">
      <label htmlFor={id} className={etiquetaOculta ? 'solo-lectores' : undefined}>
        {etiqueta}{obligatorio && ' *'}
      </label>
      {como === 'textarea' && <textarea rows={4} {...comunes} />}
      {como === 'select' && <select {...comunes}>{children}</select>}
      {como === 'input' && <input {...comunes} />}
      {ayuda && <p id={idAyuda} className="ayuda-campo">{ayuda}</p>}
      {error && <p id={idError} className="error-campo">{error}</p>}
    </div>
  )
}
