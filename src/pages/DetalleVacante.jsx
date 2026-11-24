// Detalle de vacante (RF-003) con botón "Llamar" solo si hay teléfono (RF-051) y "Postularse" (RF-004).
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import EncabezadoEmpresa from '../components/EncabezadoEmpresa'
import DatosVacante from '../components/DatosVacante'
import BotonPostular from '../components/BotonPostular'
import Icono from '../components/Icono'

export default function DetalleVacante() {
  const { id } = useParams()
  const [vacante, setVacante] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(true)
    supabase
      .from('vacantes')
      .select('*, empresa:perfiles(nombre, giro)')
      .eq('id', id)
      .maybeSingle() // RLS oculta las pausadas/cerradas: en ese caso llega null
      .then(({ data }) => {
        setVacante(data)
        setCargando(false)
      })
  }, [id])

  if (cargando) return <p role="status">Cargando vacante…</p>

  if (!vacante) {
    return (
      <div className="detalle">
        <h1>Vacante no disponible</h1>
        <p>Esta vacante no existe o ya no está recibiendo solicitudes.</p>
        <p><Link className="boton boton-azul" to="/">Ver otras vacantes</Link></p>
      </div>
    )
  }

  const activa = vacante.estado === 'activa'

  return (
    <>
      <div className="banner-vacante sangrado">
        <img src="/img/banner-vacante.png" alt="" />
      </div>

      <div className="detalle">
        <Link className="volver" to="/">← Volver a las vacantes</Link>

        <article className="tarjeta">
          <EncabezadoEmpresa vacante={vacante} />
          <h1>{vacante.titulo}</h1>
          {!activa && (
            <p className="mensaje mensaje-info">Esta vacante está {vacante.estado} y no recibe nuevas solicitudes.</p>
          )}
          <DatosVacante vacante={vacante} />

          {/* recuadro celeste del prototipo ("imagen descriptiva") con la descripción */}
          <section className="imagen-vacante" aria-labelledby="t-descripcion">
            <h2 id="t-descripcion">Descripción</h2>
            <p className="texto-multilinea">{vacante.descripcion}</p>
          </section>

          <section className="seccion-detalle" aria-labelledby="t-requisitos">
            <h2 id="t-requisitos">Requisitos</h2>
            <p className="texto-multilinea">{vacante.requisitos}</p>
          </section>

          <section className="seccion-detalle" aria-labelledby="t-prestaciones">
            <h2 id="t-prestaciones">Prestaciones</h2>
            <p className="texto-multilinea">{vacante.prestaciones}</p>
          </section>

          {vacante.empresa?.giro && (
            <p className="nota">Giro de la empresa: {vacante.empresa.giro}</p>
          )}

          {/* RF-051: el botón "Llamar" solo aparece si la vacante tiene teléfono */}
          {vacante.telefono_contacto && (
            <a
              className="boton boton-azul boton-angosto llamar"
              href={`tel:${vacante.telefono_contacto}`}
              aria-label={`Llamar a la empresa al ${vacante.telefono_contacto}`}
            >
              <Icono nombre="telefono" tamano={22} />
              Llamar
            </a>
          )}
        </article>
      </div>

      {activa && (
        <div className="barra-postular">
          <BotonPostular vacante={vacante} />
        </div>
      )}
    </>
  )
}
