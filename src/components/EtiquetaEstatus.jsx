// Etiqueta de color para el estatus de una solicitud o el estado de una vacante.
// Reutiliza las clases de la Entrega 2: .estado + .pendiente / .aceptada / .rechazada / .activa / .pausada / .cerrada
const CLASES = {
  // solicitudes
  'Enviada': 'pendiente',
  'En revisión': 'pendiente',
  'Aceptada': 'aceptada',
  'Rechazada': 'rechazada',
  'Cancelada': 'cerrada',
  // vacantes
  'activa': 'activa',
  'pausada': 'pausada',
  'cerrada': 'cerrada',
}

export default function EtiquetaEstatus({ estatus }) {
  const texto = estatus.charAt(0).toUpperCase() + estatus.slice(1)
  return <span className={`estado ${CLASES[estatus] ?? 'pausada'}`}>{texto}</span>
}
