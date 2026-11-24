// Funciones pequeñas para mostrar datos de forma amigable (reutilizadas en varios componentes).

// "Grupo Cónsul" -> "GC"
export function iniciales(nombre = '') {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(palabra => palabra[0].toUpperCase())
    .join('')
}

// 12000 -> "$12,000"
export function moneda(cantidad) {
  return Number(cantidad).toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  })
}

// "2026-11-06T..." -> "06/11/2026"
export function fecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// "Hace 2 horas", "Hace 3 días"...
export function hace(fechaISO) {
  const minutos = Math.floor((Date.now() - new Date(fechaISO).getTime()) / 60000)
  if (minutos < 60) return minutos <= 1 ? 'Hace un momento' : `Hace ${minutos} minutos`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas`
  const dias = Math.floor(horas / 24)
  return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`
}

// Una vacante es "nueva" si se publicó hace menos de 48 horas
export function esNueva(fechaISO) {
  return Date.now() - new Date(fechaISO).getTime() < 48 * 60 * 60 * 1000
}
