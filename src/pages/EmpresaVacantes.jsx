// Mis vacantes (RF-020) con número de solicitudes, prospectos y botones pausar / reactivar / cerrar (RF-021).
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { fecha } from '../lib/formato'
import DatosVacante from '../components/DatosVacante'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Prospecto from '../components/Prospecto'
import Mensaje from '../components/Mensaje'
import Icono from '../components/Icono'

// Las solicitudes canceladas por el candidato no cuentan
const vigentes = v => v.solicitudes.filter(s => s.estatus !== 'Cancelada')

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
      .select(`id, titulo, sueldo, ubicacion, horario, categoria, estado, creada_en,
        solicitudes(id, estatus, creada_en, candidato:perfiles(nombre, edad, colonia, experiencia))`)
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
      <div className="barra-titulo sangrado">
        <div>
          <h1>Mis vacantes:</h1>
          {perfil && <p>{perfil.nombre}{perfil.giro ? ` · ${perfil.giro}` : ''}</p>}
        </div>
        <span className="avatar" aria-hidden="true"><Icono nombre="edificio" tamano={26} /></span>
      </div>

      <div className="detalle">
        <Link className="boton boton-naranja" to="/empresa/publicar">
          <Icono nombre="mas" tamano={22} /> Publicar nueva vacante
        </Link>

        {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}
        {cargando && <p role="status">Cargando tus vacantes…</p>}
        {!cargando && vacantes.length === 0 && (
          <p className="vacio">Aún no has publicado vacantes.</p>
        )}

        <div className="lista-vacantes">
          {vacantes.map((v, i) => {
            const prospectos = vigentes(v)
            const total = prospectos.length
            return (
              <details className="tarjeta-vacante" key={v.id} open={i === 0}>
                <summary>
                  <h2>{v.titulo}</h2>
                  <Icono nombre="circuloAbajo" tamano={40} grosor={1.8} className="flecha" />
                  <div><DatosVacante vacante={v} conEtiquetas={false} /></div>
                  <p>
                    <EtiquetaEstatus estatus={v.estado} />{' '}
                    <span className="por-mes">· {total} {total === 1 ? 'solicitud' : 'solicitudes'}</span>
                  </p>
                </summary>

                <div className="cuerpo-vacante">
                  <p className="nota">Publicada el {fecha(v.creada_en)} · {v.horario} · {v.categoria}</p>

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

                  <h3>Prospectos:</h3>
                  {total === 0 && <p className="vacio">Aún no hay solicitudes para esta vacante.</p>}
                  {prospectos.slice(0, 2).map(s => <Prospecto key={s.id} solicitud={s} />)}
                  {total > 0 && (
                    <Link className="boton boton-azul" to={`/empresa/vacantes/${v.id}/solicitudes`}>
                      Gestionar solicitudes ({total})
                    </Link>
                  )}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </>
  )
}
