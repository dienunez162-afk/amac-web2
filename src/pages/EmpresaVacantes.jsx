// Mis vacantes (RF-020) con número de solicitudes y botones pausar / reactivar / cerrar (RF-021).
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { moneda, fecha } from '../lib/formato'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'

// Cuántas solicitudes cuentan (las canceladas por el candidato no)
const contarSolicitudes = v => v.solicitudes.filter(s => s.estatus !== 'Cancelada').length

export default function EmpresaVacantes() {
  const { sesion, perfil } = useAuth()
  const ubicacion = useLocation()
  const [vacantes, setVacantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(
    ubicacion.state?.aviso ? { tipo: 'exito', texto: ubicacion.state.aviso } : null
  )
  const usuarioId = sesion?.user.id

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('vacantes')
      .select('id, titulo, sueldo, ubicacion, estado, creada_en, solicitudes(estatus)')
      .eq('empresa_id', usuarioId)
      .order('creada_en', { ascending: false })
    if (error) setMensaje({ tipo: 'error', texto: 'No pudimos cargar tus vacantes.' })
    else setVacantes(data)
    setCargando(false)
  }, [usuarioId])

  useEffect(() => { cargar() }, [cargar])

  async function cambiarEstado(vacante, estado, textoExito) {
    if (estado === 'cerrada' &&
        !window.confirm(`¿Seguro que quieres cerrar "${vacante.titulo}"? Ya no recibirá solicitudes y no se podrá reactivar.`)) {
      return
    }
    const { error } = await supabase.from('vacantes').update({ estado }).eq('id', vacante.id)
    setMensaje(error
      ? { tipo: 'error', texto: 'No se pudo cambiar el estado de la vacante.' }
      : { tipo: 'exito', texto: `"${vacante.titulo}" ${textoExito}.` })
    cargar()
  }

  return (
    <>
      <h1>Mis vacantes</h1>
      {perfil && <p>{perfil.nombre}{perfil.giro ? ` · ${perfil.giro}` : ''}</p>}

      <div className="formulario">
        <Link className="boton boton-naranja" to="/empresa/publicar">Publicar nueva vacante</Link>

        {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}
        {cargando && <p role="status">Cargando tus vacantes…</p>}
        {!cargando && vacantes.length === 0 && (
          <p className="vacio">Aún no has publicado vacantes.</p>
        )}

        {vacantes.map((v, i) => {
          const total = contarSolicitudes(v)
          return (
            <details className="panel" key={v.id} open={i === 0}>
              <summary>{v.titulo} · {total} {total === 1 ? 'solicitud' : 'solicitudes'}</summary>
              <div className="panel-contenido">
                <p className="lugar">{v.ubicacion} · {moneda(v.sueldo)} / mes</p>
                <p>
                  <EtiquetaEstatus estatus={v.estado} /> Publicada el {fecha(v.creada_en)}
                </p>

                <Link className="boton boton-azul" to={`/empresa/vacantes/${v.id}/solicitudes`}>
                  Ver solicitudes ({total})
                </Link>

                <div className="acciones">
                  {v.estado === 'activa' && (
                    <button type="button" className="boton boton-borde"
                      onClick={() => cambiarEstado(v, 'pausada', 'se pausó y ya no aparece en el listado')}>
                      Pausar
                    </button>
                  )}
                  {v.estado === 'pausada' && (
                    <button type="button" className="boton boton-borde"
                      onClick={() => cambiarEstado(v, 'activa', 'se reactivó y vuelve a aparecer en el listado')}>
                      Reactivar
                    </button>
                  )}
                  {v.estado !== 'cerrada' && (
                    <button type="button" className="boton boton-borde"
                      onClick={() => cambiarEstado(v, 'cerrada', 'se cerró')}>
                      Cerrar vacante
                    </button>
                  )}
                  {v.estado === 'activa' && (
                    <Link className="boton boton-texto" to={`/vacantes/${v.id}`}>Ver como candidato</Link>
                  )}
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </>
  )
}
