// Botón "Postularme" (RF-004) con los casos de RF-054:
// - sin sesión: invita a iniciar sesión
// - empresa: no se muestra
// - candidato: inserta la solicitud; RLS solo lo permite si está aprobado,
//   y la restricción unique impide postularse dos veces.
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Mensaje from './Mensaje'
import VentanaConfirmacion from './VentanaConfirmacion'

export default function BotonPostular({ vacante }) {
  const { sesion, perfil } = useAuth()
  const ubicacion = useLocation()
  const [yaAplico, setYaAplico] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null) // { tipo, texto }
  const [exito, setExito] = useState(false)
  const cerrarExito = useCallback(() => setExito(false), [])

  const esCandidato = perfil?.rol === 'candidato'
  const usuarioId = sesion?.user.id

  // ¿Ya se postuló antes a esta vacante?
  useEffect(() => {
    if (!esCandidato) return
    supabase
      .from('solicitudes')
      .select('id')
      .eq('vacante_id', vacante.id)
      .eq('candidato_id', usuarioId)
      .maybeSingle()
      .then(({ data }) => setYaAplico(Boolean(data)))
  }, [esCandidato, usuarioId, vacante.id])

  async function postularme() {
    setEnviando(true)
    setMensaje(null)
    const { error } = await supabase
      .from('solicitudes')
      .insert({ vacante_id: vacante.id, candidato_id: usuarioId })
    setEnviando(false)

    if (error?.code === '23505') {
      setYaAplico(true)
      setMensaje({ tipo: 'info', texto: 'Ya te postulaste a esta vacante.' })
    } else if (error) {
      setMensaje({ tipo: 'error', texto: 'Tu registro aún no ha sido aprobado por AMAC. Por favor espera.' })
    } else {
      setYaAplico(true)
      setExito(true)
    }
  }

  if (!perfil) {
    return (
      <Link className="boton boton-naranja" to="/login" state={{ desde: ubicacion.pathname }}>
        Inicia sesión para postularte
      </Link>
    )
  }

  if (!esCandidato) return null

  return (
    <>
      {yaAplico ? (
        <Link className="boton boton-borde" to="/mis-solicitudes">Ya te postulaste · Ver mis solicitudes</Link>
      ) : (
        <button type="button" className="boton boton-naranja" onClick={postularme} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Postularme'}
        </button>
      )}
      {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}

      <VentanaConfirmacion abierta={exito} titulo="¡Listo! Tu solicitud fue enviada" onCerrar={cerrarExito}>
        <p>Te postulaste a <strong>{vacante.titulo}</strong>. Revisa tus solicitudes para ver el estatus.</p>
        <Link className="boton boton-naranja" to="/mis-solicitudes">Ver mis solicitudes</Link>
      </VentanaConfirmacion>
    </>
  )
}
