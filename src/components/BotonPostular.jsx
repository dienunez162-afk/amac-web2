// Botón "Postularse" (RF-004) con los casos de RF-054:
// - sin sesión: invita a iniciar sesión
// - empresa: no se muestra
// - candidato: inserta la solicitud; RLS solo lo permite si está aprobado,
//   y la restricción unique impide postularse dos veces.
// El resultado se muestra en una ventana, como en el prototipo.
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import VentanaConfirmacion from './VentanaConfirmacion'

const RESULTADOS = {
  exito: {
    tipo: 'exito',
    titulo: 'Postulación exitosa',
    texto: 'Tu solicitud fue enviada correctamente. Revisa tus solicitudes para ver el estado.',
  },
  duplicada: {
    tipo: 'error',
    titulo: 'Postulación no válida',
    texto: 'Tu solicitud fue interrumpida debido a que ya estabas postulado a esta vacante.',
  },
  noAprobado: {
    tipo: 'error',
    titulo: 'Postulación no válida',
    texto: 'Tu registro aún no ha sido aprobado por AMAC. Por favor espera.',
  },
}

export default function BotonPostular({ vacante }) {
  const { sesion, perfil } = useAuth()
  const ubicacion = useLocation()
  const [yaAplico, setYaAplico] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null) // una de las llaves de RESULTADOS
  const cerrar = useCallback(() => setResultado(null), [])

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
    const { error } = await supabase
      .from('solicitudes')
      .insert({ vacante_id: vacante.id, candidato_id: usuarioId })
    setEnviando(false)

    if (error?.code === '23505') {          // unique (vacante_id, candidato_id)
      setYaAplico(true)
      setResultado('duplicada')
    } else if (error) {                     // la política RLS lo bloqueó: no está aprobado
      setResultado('noAprobado')
    } else {
      setYaAplico(true)
      setResultado('exito')
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

  const r = resultado && RESULTADOS[resultado]

  return (
    <>
      {yaAplico && !resultado ? (
        <Link className="boton boton-borde" to="/mis-solicitudes">Ya te postulaste · Ver solicitudes</Link>
      ) : (
        <button type="button" className="boton boton-naranja" onClick={postularme} disabled={enviando}>
          {enviando ? 'Enviando…' : 'Postularse'}
        </button>
      )}

      <VentanaConfirmacion abierta={Boolean(r)} tipo={r?.tipo} titulo={r?.titulo} onCerrar={cerrar}>
        <p>{r?.texto}</p>
        {resultado !== 'noAprobado' && (
          <Link className="boton boton-naranja" to="/mis-solicitudes">Ver solicitudes</Link>
        )}
      </VentanaConfirmacion>
    </>
  )
}
