// Publicar vacante (RF-019): todos los campos obligatorios validados;
// el teléfono solo se pide (y se guarda) si la empresa acepta postulaciones por teléfono.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { HORARIOS, CATEGORIAS } from '../lib/catalogos'
import { esTelefono, soloDigitos } from '../lib/validaciones'
import Campo from '../components/Campo'
import Mensaje from '../components/Mensaje'

const VACIO = {
  titulo: '', sueldo: '', ubicacion: '', horario: '', categoria: '',
  descripcion: '', requisitos: '', prestaciones: '', postulacion: 'plataforma', telefono: '',
}

// Mismo orden que en pantalla (el foco va al primer error)
function validar(d) {
  const e = {}
  if (!d.titulo.trim()) e.titulo = 'Escribe el nombre del puesto.'
  const sueldo = Number(d.sueldo)
  if (!d.sueldo || !(sueldo > 0)) e.sueldo = 'Escribe un sueldo mensual mayor a 0.'
  if (!d.ubicacion.trim()) e.ubicacion = 'Escribe la ubicación del empleo.'
  if (!d.horario) e.horario = 'Elige un horario.'
  if (!d.categoria) e.categoria = 'Elige una categoría.'
  if (!d.descripcion.trim()) e.descripcion = 'Describe las actividades del puesto.'
  if (!d.requisitos.trim()) e.requisitos = 'Escribe los requisitos.'
  if (!d.prestaciones.trim()) e.prestaciones = 'Escribe las prestaciones.'
  if (d.postulacion === 'telefono' && !esTelefono(d.telefono)) {
    e.telefono = 'El teléfono de contacto debe tener 10 dígitos.'
  }
  return e
}

export default function PublicarVacante() {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  async function publicar(e) {
    e.preventDefault()
    setMensaje('')
    const nuevos = validar(datos)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      document.getElementById(Object.keys(nuevos)[0])?.focus()
      return
    }

    setEnviando(true)
    const { error } = await supabase.from('vacantes').insert({
      empresa_id: sesion.user.id, // RLS exige que sea la propia empresa
      titulo: datos.titulo.trim(),
      sueldo: Number(datos.sueldo),
      ubicacion: datos.ubicacion.trim(),
      horario: datos.horario,
      categoria: datos.categoria,
      descripcion: datos.descripcion.trim(),
      requisitos: datos.requisitos.trim(),
      prestaciones: datos.prestaciones.trim(),
      telefono_contacto: datos.postulacion === 'telefono' ? soloDigitos(datos.telefono) : null,
    })
    setEnviando(false)

    if (error) {
      setMensaje('No pudimos publicar la vacante. Intenta de nuevo.')
      return
    }
    navigate('/empresa/vacantes', { state: { aviso: `La vacante "${datos.titulo.trim()}" fue publicada.` } })
  }

  return (
    <>
      <h1>Publicar vacante</h1>
      <p>Los campos con * son obligatorios.</p>

      <form className="formulario" onSubmit={publicar} noValidate>
        <fieldset className="panel">
          <legend>1. Datos del puesto</legend>
          <Campo id="titulo" etiqueta="Puesto" obligatorio ayuda="Ejemplo: Auxiliar administrativo."
            value={datos.titulo} onChange={cambiar} error={errores.titulo} />
          <Campo id="sueldo" etiqueta="Sueldo mensual (pesos)" obligatorio type="number" min="1" step="1" inputMode="numeric"
            value={datos.sueldo} onChange={cambiar} error={errores.sueldo} />
          <Campo id="ubicacion" etiqueta="Ubicación" obligatorio ayuda="Colonia o municipio, por ejemplo: San Nicolás, N. L."
            value={datos.ubicacion} onChange={cambiar} error={errores.ubicacion} />
          <Campo id="horario" etiqueta="Horario" obligatorio como="select"
            value={datos.horario} onChange={cambiar} error={errores.horario}>
            <option value="">Elige un horario</option>
            {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
          </Campo>
          <Campo id="categoria" etiqueta="Categoría" obligatorio como="select"
            value={datos.categoria} onChange={cambiar} error={errores.categoria}>
            <option value="">Elige una categoría</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </Campo>
        </fieldset>

        <fieldset className="panel">
          <legend>2. Detalles</legend>
          <Campo id="descripcion" etiqueta="Descripción de actividades" obligatorio como="textarea"
            value={datos.descripcion} onChange={cambiar} error={errores.descripcion} />
          <Campo id="requisitos" etiqueta="Requisitos" obligatorio como="textarea"
            value={datos.requisitos} onChange={cambiar} error={errores.requisitos} />
          <Campo id="prestaciones" etiqueta="Prestaciones" obligatorio como="textarea"
            value={datos.prestaciones} onChange={cambiar} error={errores.prestaciones} />
        </fieldset>

        <fieldset className="panel">
          <legend>3. ¿Cómo quieres recibir postulaciones? *</legend>
          <div className="opcion">
            <input type="radio" id="post-plataforma" name="postulacion" value="plataforma"
              checked={datos.postulacion === 'plataforma'} onChange={cambiar} />
            <label htmlFor="post-plataforma">Solo por la plataforma</label>
          </div>
          <div className="opcion">
            <input type="radio" id="post-telefono" name="postulacion" value="telefono"
              checked={datos.postulacion === 'telefono'} onChange={cambiar} />
            <label htmlFor="post-telefono">Por la plataforma y por teléfono</label>
          </div>
          {/* El teléfono solo aparece si se elige postulación por teléfono */}
          {datos.postulacion === 'telefono' && (
            <Campo id="telefono" etiqueta="Teléfono de contacto" obligatorio type="tel" inputMode="numeric"
              ayuda="10 dígitos. Aparecerá en el botón “Llamar” de la vacante."
              value={datos.telefono} onChange={cambiar} error={errores.telefono} />
          )}
        </fieldset>

        <Mensaje tipo="error">{mensaje}</Mensaje>
        <button type="submit" className="boton boton-naranja" disabled={enviando}>
          {enviando ? 'Publicando…' : 'Publicar vacante'}
        </button>
        <Link className="boton boton-texto" to="/empresa/vacantes">Cancelar y volver a mis vacantes</Link>
      </form>
    </>
  )
}
