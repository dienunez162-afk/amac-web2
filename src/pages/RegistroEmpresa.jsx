// Registro de empresa, versión simplificada (RF-015): nombre, giro, teléfono, correo y contraseña.
// El trigger crear_perfil() crea su perfil con rol 'empresa'.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { esCorreo, esTelefono, soloDigitos, MIN_CONTRASENA } from '../lib/validaciones'
import Campo from '../components/Campo'
import Mensaje from '../components/Mensaje'

const VACIO = { nombre: '', giro: '', telefono: '', correo: '', contrasena: '', confirmar: '' }

// Mismo orden que en pantalla (el foco va al primer error)
function validar(d) {
  const e = {}
  if (!d.nombre.trim()) e.nombre = 'Escribe el nombre de la empresa.'
  if (!d.giro.trim()) e.giro = 'Escribe el giro de la empresa.'
  if (!esTelefono(d.telefono)) e.telefono = 'El teléfono debe tener 10 dígitos.'
  if (!esCorreo(d.correo)) e.correo = 'Escribe un correo válido, por ejemplo contacto@empresa.com.'
  if (d.contrasena.length < MIN_CONTRASENA) e.contrasena = `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`
  if (d.confirmar !== d.contrasena) e.confirmar = 'Las contraseñas no coinciden.'
  return e
}

export default function RegistroEmpresa() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setMensaje('')
    const nuevos = validar(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      document.getElementById(Object.keys(nuevos)[0])?.focus()
      return
    }

    setEnviando(true)
    const { error } = await supabase.auth.signUp({
      email: datos.correo.trim(),
      password: datos.contrasena,
      options: {
        data: {
          rol: 'empresa',
          nombre: datos.nombre.trim(),
          giro: datos.giro.trim(),
          telefono: soloDigitos(datos.telefono),
        },
      },
    })
    setEnviando(false)

    if (error) {
      setMensaje(error.code === 'user_already_exists'
        ? 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.'
        : 'No pudimos registrar la empresa. Revisa los datos e intenta de nuevo.')
      return
    }
    navigate('/empresa/vacantes', { replace: true, state: { aviso: '¡Tu empresa quedó registrada! Ya puedes publicar vacantes.' } })
  }

  return (
    <>
      <h1 className="titulo-centrado">Registro de Empresa</h1>

      <form className="formulario" onSubmit={enviar} noValidate>
        <fieldset className="seccion-form">
          <legend>1. Datos de empresa</legend>
          <p className="nota">* Campo obligatorio</p>
          <Campo id="nombre" etiqueta="Nombre de empresa" obligatorio autoComplete="organization" placeholder="Nombre empresa"
            value={datos.nombre} onChange={cambiar} error={errores.nombre} />
          <Campo id="giro" etiqueta="Giro" obligatorio placeholder="Ej. restaurante, comercio"
            value={datos.giro} onChange={cambiar} error={errores.giro} />
          <Campo id="telefono" etiqueta="Teléfono" obligatorio type="tel" autoComplete="tel" inputMode="numeric"
            placeholder="10 dígitos"
            value={datos.telefono} onChange={cambiar} error={errores.telefono} />
        </fieldset>

        <fieldset className="seccion-form">
          <legend>2. Datos de acceso</legend>
          <Campo id="correo" etiqueta="Correo electrónico" obligatorio type="email" autoComplete="email" placeholder="ejemplo@mail.com"
            value={datos.correo} onChange={cambiar} error={errores.correo} />
          <Campo id="contrasena" etiqueta="Contraseña" obligatorio type="password" autoComplete="new-password"
            placeholder={`Mínimo ${MIN_CONTRASENA} caracteres`}
            value={datos.contrasena} onChange={cambiar} error={errores.contrasena} />
          <Campo id="confirmar" etiqueta="Confirmar contraseña" obligatorio type="password" autoComplete="new-password" placeholder="Repite tu contraseña"
            value={datos.confirmar} onChange={cambiar} error={errores.confirmar} />
        </fieldset>

        <Mensaje tipo="error">{mensaje}</Mensaje>
        <button type="submit" className="boton boton-naranja boton-pildora" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Crear mi cuenta'}
        </button>
        <Link className="boton boton-texto" to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </form>
    </>
  )
}
