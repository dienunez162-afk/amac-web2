// Registro de candidato (RF-011, RF-012, RF-013).
// Los datos extra viajan en options.data y el trigger crear_perfil() los guarda en la tabla perfiles.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { esCorreo, esTelefono, soloDigitos, MIN_CONTRASENA } from '../lib/validaciones'
import Campo from '../components/Campo'
import Mensaje from '../components/Mensaje'

const VACIO = {
  nombre: '', correo: '', contrasena: '', confirmar: '',
  telefono: '', edad: '', colonia: '', experiencia: '', terminos: false,
}

// Las validaciones van en el mismo orden que los campos en pantalla (el foco va al primer error)
function validar(d) {
  const e = {}
  if (!esCorreo(d.correo)) e.correo = 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  if (d.contrasena.length < MIN_CONTRASENA) e.contrasena = `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`
  if (d.confirmar !== d.contrasena) e.confirmar = 'Las contraseñas no coinciden.'
  if (!d.nombre.trim()) e.nombre = 'Escribe tu nombre completo.'
  if (!esTelefono(d.telefono)) e.telefono = 'El teléfono debe tener 10 dígitos.'
  const edad = Number(d.edad)
  if (!Number.isInteger(edad) || edad < 18 || edad > 120) e.edad = 'Escribe una edad entre 18 y 120 años.'
  if (!d.colonia.trim()) e.colonia = 'Escribe tu colonia.'
  if (!d.experiencia.trim()) e.experiencia = 'Cuéntanos brevemente tu experiencia laboral.'
  if (!d.terminos) e.terminos = 'Debes aceptar los términos y condiciones para crear tu cuenta.'
  return e
}

export default function RegistroCandidato() {
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [registrado, setRegistrado] = useState(false)

  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setDatos(d => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
  }

  async function enviar(e) {
    e.preventDefault()
    setMensaje('')
    const nuevos = validar(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      // Llevar el foco al primer campo con error
      document.getElementById(Object.keys(nuevos)[0])?.focus()
      return
    }

    setEnviando(true)
    const { error } = await supabase.auth.signUp({
      email: datos.correo.trim(),
      password: datos.contrasena,
      options: {
        data: {
          rol: 'candidato',
          nombre: datos.nombre.trim(),
          telefono: soloDigitos(datos.telefono),
          edad: datos.edad,
          colonia: datos.colonia.trim(),
          experiencia: datos.experiencia.trim(),
        },
      },
    })
    setEnviando(false)

    if (error) {
      setMensaje(error.code === 'user_already_exists'
        ? 'Ya existe una cuenta con ese correo. Intenta iniciar sesión.'
        : 'No pudimos crear tu cuenta. Revisa tus datos e intenta de nuevo.')
      return
    }
    setRegistrado(true)
  }

  if (registrado) {
    return (
      <section className="formulario-tarjeta">
        <h1>¡Tu cuenta fue creada!</h1>
        <Mensaje tipo="exito">Bienvenido(a), {datos.nombre.trim()}. Ya iniciaste sesión.</Mensaje>
        <p>
          Un empleado de AMAC revisará tu registro. Cuando seas aprobado(a) podrás postularte a las vacantes.
          Mientras tanto, ya puedes explorarlas.
        </p>
        <Link className="boton boton-naranja" to="/">Ver vacantes</Link>
      </section>
    )
  }

  return (
    <>
      <h1>Registro de candidato</h1>
      <p>Los campos con * son obligatorios.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        <fieldset className="panel">
          <legend>1. Datos de acceso</legend>
          <Campo id="correo" etiqueta="Correo electrónico" obligatorio type="email" autoComplete="email"
            value={datos.correo} onChange={cambiar} error={errores.correo} />
          <Campo id="contrasena" etiqueta="Contraseña" obligatorio type="password" autoComplete="new-password"
            ayuda={`Mínimo ${MIN_CONTRASENA} caracteres.`}
            value={datos.contrasena} onChange={cambiar} error={errores.contrasena} />
          <Campo id="confirmar" etiqueta="Confirmar contraseña" obligatorio type="password" autoComplete="new-password"
            value={datos.confirmar} onChange={cambiar} error={errores.confirmar} />
        </fieldset>

        <fieldset className="panel">
          <legend>2. Datos personales</legend>
          <Campo id="nombre" etiqueta="Nombre completo" obligatorio autoComplete="name"
            value={datos.nombre} onChange={cambiar} error={errores.nombre} />
          <Campo id="telefono" etiqueta="Teléfono celular" obligatorio type="tel" autoComplete="tel" inputMode="numeric"
            ayuda="10 dígitos, por ejemplo 8112345678."
            value={datos.telefono} onChange={cambiar} error={errores.telefono} />
          <Campo id="edad" etiqueta="Edad" obligatorio type="number" min="18" max="120" inputMode="numeric"
            value={datos.edad} onChange={cambiar} error={errores.edad} />
          <Campo id="colonia" etiqueta="Colonia" obligatorio
            value={datos.colonia} onChange={cambiar} error={errores.colonia} />
        </fieldset>

        <fieldset className="panel">
          <legend>3. Experiencia laboral</legend>
          <Campo id="experiencia" etiqueta="Describe tu experiencia laboral" obligatorio como="textarea"
            ayuda="Ejemplo: 20 años como contador; atención a clientes; manejo de caja."
            value={datos.experiencia} onChange={cambiar} error={errores.experiencia} />
        </fieldset>

        <fieldset className="panel">
          <legend>4. Términos y privacidad</legend>
          <div className="opcion">
            <input type="checkbox" id="terminos" name="terminos" checked={datos.terminos} onChange={cambiar}
              aria-invalid={errores.terminos ? true : undefined}
              aria-describedby={errores.terminos ? 'terminos-error' : undefined} />
            <label htmlFor="terminos">Acepto los Términos y Condiciones y el Aviso de Privacidad *</label>
          </div>
          {errores.terminos && <p id="terminos-error" className="error-campo">{errores.terminos}</p>}
        </fieldset>

        <Mensaje tipo="error">{mensaje}</Mensaje>
        <button type="submit" className="boton boton-naranja" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear mi cuenta'}
        </button>
        <Link className="boton boton-texto" to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </form>
    </>
  )
}
