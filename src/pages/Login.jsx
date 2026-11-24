// Inicio de sesión (RF-008). Con credenciales inválidas se muestra un mensaje genérico
// (no se dice si falló el correo o la contraseña).
import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Campo from '../components/Campo'
import Mensaje from '../components/Mensaje'

// A dónde mandar a cada rol después de entrar
const inicioPorRol = rol => (rol === 'empresa' ? '/empresa/vacantes' : '/')

export default function Login() {
  const { perfil } = useAuth()
  const ubicacion = useLocation()
  const desde = ubicacion.state?.desde // página protegida que intentó abrir

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Cuando hay sesión (ya existía o se acaba de iniciar), AuthContext carga el perfil
  // y desde aquí se manda a cada rol a su página (o a la página protegida que quería abrir)
  if (perfil) return <Navigate to={desde ?? inicioPorRol(perfil.rol)} replace />

  async function entrar(e) {
    e.preventDefault()
    setMensaje('')
    if (!correo.trim() || !contrasena) {
      setMensaje('Escribe tu correo y tu contraseña.')
      return
    }

    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: contrasena,
    })
    if (error) {
      setEnviando(false)
      setMensaje('Correo o contraseña incorrectos.') // genérico a propósito
    }
    // Si no hubo error, el botón sigue en "Entrando…" hasta que llega el perfil y se redirige
  }

  return (
    <div className="login">
      <div className="login-encabezado">
        <h1>Iniciar sesión</h1>
        <p>Entra para postularte o publicar vacantes.</p>
      </div>

      <form className="tarjeta-login" onSubmit={entrar} noValidate>
        <Campo id="correo" etiqueta="Correo electrónico" etiquetaOculta obligatorio type="email" autoComplete="email"
          placeholder="Correo electrónico"
          value={correo} onChange={e => setCorreo(e.target.value)} />
        <Campo id="contrasena" etiqueta="Contraseña" etiquetaOculta obligatorio type="password" autoComplete="current-password"
          placeholder="Contraseña"
          value={contrasena} onChange={e => setContrasena(e.target.value)} />

        <Mensaje tipo="error">{mensaje}</Mensaje>
        <button type="submit" className="boton boton-azul boton-pildora" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Inicia sesión'}
        </button>
        <Link className="boton boton-texto" to="/registro">Crear una cuenta</Link>
      </form>

      <div className="login-pie">
        <Link className="enlace-naranja" to="/registro-empresa">¿Eres empresa? Regístrala aquí</Link>
      </div>
    </div>
  )
}
