// Solicitudes recibidas de una vacante (RF-022) y cambio de estatus (RF-024).
// La empresa solo ve nombre, edad, colonia y experiencia del candidato (RLS: empresa_ve_candidato).
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'
import Prospecto from '../components/Prospecto'
import Icono from '../components/Icono'

// Botones de estatus que la empresa puede elegir (deben coincidir con la política RLS)
const OPCIONES = [
  { estatus: 'En revisión', texto: 'Marcar en revisión' },
  { estatus: 'Aceptada', texto: 'Aceptar' },
  { estatus: 'Rechazada', texto: 'Rechazar' },
]

export default function SolicitudesRecibidas() {
  const { id } = useParams()
  const { sesion } = useAuth()
  const usuarioId = sesion?.user.id
  const [vacante, setVacante] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)

  const cargar = useCallback(async () => {
    const [resVacante, resSolicitudes] = await Promise.all([
      // Solo vacantes propias (las activas de otras empresas también son visibles por RLS)
      supabase.from('vacantes').select('id, titulo, estado').eq('id', id).eq('empresa_id', usuarioId).maybeSingle(),
      supabase
        .from('solicitudes')
        .select('id, estatus, creada_en, candidato:perfiles(nombre, edad, colonia, experiencia)')
        .eq('vacante_id', id)
        .neq('estatus', 'Cancelada')
        .order('creada_en', { ascending: true }),
    ])
    setVacante(resVacante.data)
    setSolicitudes(resSolicitudes.data ?? [])
    setCargando(false)
  }, [id, usuarioId])

  useEffect(() => { cargar() }, [cargar])

  async function cambiarEstatus(solicitud, estatus) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estatus })
      .eq('id', solicitud.id)
      .select()
    const nombre = solicitud.candidato?.nombre ?? 'el candidato'
    setMensaje(error || data.length === 0
      ? { tipo: 'error', texto: 'No se pudo cambiar el estatus (el candidato pudo haber cancelado su solicitud).' }
      : { tipo: 'exito', texto: `La solicitud de ${nombre} ahora está: ${estatus}.` })
    cargar()
  }

  if (cargando) return <p role="status">Cargando solicitudes…</p>

  // Si la vacante no existe o no es de esta empresa, llega null
  if (!vacante) {
    return (
      <>
        <h1>Vacante no encontrada</h1>
        <p>Esta vacante no existe o no pertenece a tu empresa.</p>
        <p><Link className="boton boton-azul" to="/empresa/vacantes">Volver a mis vacantes</Link></p>
      </>
    )
  }

  return (
    <>
      <div className="barra-titulo sangrado">
        <div>
          <h1>Solicitudes:</h1>
          <p>{vacante.titulo} · <EtiquetaEstatus estatus={vacante.estado} /></p>
        </div>
        <span className="avatar" aria-hidden="true"><Icono nombre="usuario" tamano={26} /></span>
      </div>

      <div className="detalle">
        <Link className="volver" to="/empresa/vacantes">← Volver a mis vacantes</Link>
        <h2 className="subtitulo">Prospectos ({solicitudes.length})</h2>

        {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}
        {solicitudes.length === 0 && <p className="vacio">Aún no hay solicitudes para esta vacante.</p>}

        {solicitudes.map(s => (
          <Prospecto key={s.id} solicitud={s} nivel="h3">
            <div className="acciones" role="group" aria-label={`Cambiar estatus de ${s.candidato?.nombre ?? 'la solicitud'}`}>
              {OPCIONES.map(o => (
                <button
                  key={o.estatus}
                  type="button"
                  className={o.estatus === 'Aceptada' ? 'boton boton-naranja' : 'boton boton-borde'}
                  onClick={() => cambiarEstatus(s, o.estatus)}
                  disabled={s.estatus === o.estatus}
                  aria-pressed={s.estatus === o.estatus}
                >
                  {o.texto}
                </button>
              ))}
            </div>
          </Prospecto>
        ))}
      </div>
    </>
  )
}
