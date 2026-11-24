// Validaciones de formularios (se revisan antes de enviar a Supabase).
export const esCorreo = texto => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto.trim())

// Teléfono de 10 dígitos (se ignoran espacios y guiones)
export const soloDigitos = texto => texto.replace(/\D/g, '')
export const esTelefono = texto => soloDigitos(texto).length === 10

export const MIN_CONTRASENA = 8
