// Mis solicitudes (RF-005) y cancelar (RF-006).
// Solo se pueden cancelar las que están "Enviada" o "En revisión" (RLS también lo exige).
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { iniciales, moneda, fecha } from '../lib/formato'
import EtiquetaEstatus from '../components/EtiquetaEstatus'
import Mensaje from '../components/Mensaje'

const CANCELABLES = ['Enviada', 'En revisión']

export default function MisSolicitudes() {
  const { sesion, perfil } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null) // { tipo, texto }
  const usuarioId = sesion?.user.id

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('id, estatus, creada_en, vacante:vacantes(id, titulo, ubicacion, sueldo, empresa:perfiles(nombre))')
      .eq('candidato_id', usuarioId)
      .order('creada_en', { ascending: false })
    if (error) setMensaje({ tipo: 'error', texto: 'No pudimos cargar tus solicitudes.' })
    else setSolicitudes(data)
    setCargando(false)
  }, [usuarioId])

  useEffect(() => { cargar() }, [cargar])

  async function cancelar(solicitud) {
    const ok = window.confirm(`¿Seguro que quieres cancelar tu solicitud a "${solicitud.vacante.titulo}"?`)
    if (!ok) return
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estatus: 'Cancelada' })
      .eq('id', solicitud.id)
      .select()
    // Si RLS no permite el cambio, no hay error pero tampoco filas actualizadas
    if (error || data.length === 0) {
      setMensaje({ tipo: 'error', texto: 'No se pudo cancelar: la solicitud ya fue resuelta por la empresa.' })
    } else {
      setMensaje({ tipo: 'exito', texto: 'Tu solicitud fue cancelada.' })
    }
    cargar()
  }

  return (
    <>
      <h1>Mis solicitudes</h1>

      {perfil && !perfil.aprobado && (
        <Mensaje tipo="info">
          Tu registro está en revisión por AMAC. Cuando seas aprobado(a) podrás postularte a las vacantes.
        </Mensaje>
      )}
      {mensaje && <Mensaje tipo={mensaje.tipo}>{mensaje.texto}</Mensaje>}

      {cargando && <p role="status">Cargando tus solicitudes…</p>}

      {!cargando && solicitudes.length === 0 && (
        <div className="vacio">
          <p>Aún no te has postulado a ninguna vacante.</p>
          <p><Link className="boton boton-naranja" to="/">Buscar vacantes</Link></p>
        </div>
      )}

      {solicitudes.length > 0 && (
        <ul className="lista">
          {solicitudes.map(s => {
            const empresa = s.vacante?.empresa?.nombre ?? 'Empresa'
            const sePuedeCancelar = CANCELABLES.includes(s.estatus)
            return (
              <li key={s.id}>
                <article className="tarjeta">
                  <div className="tarjeta-arriba">
                    <span className="logo-empresa" aria-hidden="true">{iniciales(empresa)}</span>
                    <p className="empresa">
                      {empresa} <EtiquetaEstatus estatus={s.estatus} />
                      <span className="hora">Aplicaste el {fecha(s.creada_en)}</span>
                    </p>
                  </div>
                  <h2>
                    <Link to={`/vacantes/${s.vacante?.id}`}>{s.vacante?.titulo ?? 'Vacante'}</Link>
                  </h2>
                  {s.vacante && (
                    <>
                      <p className="lugar">{s.vacante.ubicacion}</p>
                      <p className="sueldo">{moneda(s.vacante.sueldo)} / mes</p>
                    </>
                  )}
                  {s.estatus !== 'Cancelada' && (
                    <button
                      type="button"
                      className="boton boton-borde"
                      onClick={() => cancelar(s)}
                      disabled={!sePuedeCancelar}
                      aria-label={`Cancelar solicitud a ${s.vacante?.titulo ?? 'la vacante'}`}
                    >
                      Cancelar
                    </button>
                  )}
                  {!sePuedeCancelar && s.estatus !== 'Cancelada' && (
                    <p className="ayuda-campo">Esta solicitud ya fue {s.estatus.toLowerCase()} y no se puede cancelar.</p>
                  )}
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
