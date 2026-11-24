// Aviso en pantalla. Los errores usan role="alert" (se leen de inmediato);
// los demás role="status" (se leen sin interrumpir).
export default function Mensaje({ tipo = 'info', children }) {
  if (!children) return null
  return (
    <p className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
