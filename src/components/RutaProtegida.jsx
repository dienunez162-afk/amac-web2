// RF-010: un candidato no entra a páginas de empresa y viceversa.
// OJO: esto solo esconde pantallas; la seguridad real está en las políticas RLS de la base de datos.
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ rol, children }) {
  const { perfil, cargando } = useAuth()
  const ubicacion = useLocation()

  if (cargando) return <p role="status">Cargando…</p>
  // Sin sesión: mandar a /login y recordar a dónde quería ir
  if (!perfil) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  // Con sesión pero con otro rol: mandar al inicio
  if (perfil.rol !== rol) return <Navigate to="/" replace />
  return children
}
