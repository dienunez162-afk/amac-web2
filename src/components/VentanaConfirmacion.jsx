// Ventana de confirmación (prototipo: "Postulación exitosa" / "Postulación no válida").
// Al abrirse mueve el foco al título; se cierra con el botón "Cerrar" o con la tecla Escape.
import { useEffect, useRef } from 'react'
import Icono from './Icono'

export default function VentanaConfirmacion({ abierta, titulo, tipo = 'exito', children, onCerrar }) {
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
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-ventana">
      <div className="caja-modal">
        <div className="icono-modal">
          <Icono nombre={tipo === 'error' ? 'equis' : 'palomita'} tamano={44} grosor={3} />
        </div>
        <h2 id="titulo-ventana" ref={tituloRef} tabIndex={-1}>{titulo}</h2>
        {children}
        <button type="button" className="boton boton-texto" onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
