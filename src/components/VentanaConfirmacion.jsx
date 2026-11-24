// Ventana de confirmación (diseño "modal" de la Entrega 2) controlada por React.
// Al abrirse mueve el foco al título; se cierra con el botón o con la tecla Escape.
import { useEffect, useRef } from 'react'

export default function VentanaConfirmacion({ abierta, titulo, children, onCerrar }) {
  const tituloRef = useRef(null)

  useEffect(() => {
    if (!abierta) return
    tituloRef.current?.focus()
    const alPresionar = e => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', alPresionar)
    return () => document.removeEventListener('keydown', alPresionar)
  }, [abierta, onCerrar])

  if (!abierta) return null

  return (
    <div className="modal abierto" role="dialog" aria-modal="true" aria-labelledby="titulo-ventana">
      <div className="caja-modal">
        <div className="palomita" aria-hidden="true">✓</div>
        <h2 id="titulo-ventana" ref={tituloRef} tabIndex={-1}>{titulo}</h2>
        {children}
        <button type="button" className="boton boton-texto" onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
