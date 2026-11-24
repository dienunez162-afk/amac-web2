// Detalle de vacante (RF-003) con botón "Llamar" solo si hay teléfono (RF-051) y "Postularme" (RF-004).
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { iniciales, moneda, hace, esNueva } from '../lib/formato'
import BotonPostular from '../components/BotonPostular'

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
      <>
        <h1>Vacante no disponible</h1>
        <p>Esta vacante no existe o ya no está recibiendo solicitudes.</p>
        <p><Link className="boton boton-azul" to="/">Ver otras vacantes</Link></p>
      </>
    )
  }

  const empresa = vacante.empresa?.nombre ?? 'Empresa'
  const activa = vacante.estado === 'activa'

  return (
    <article className="tarjeta">
      <p><Link to="/">← Volver a las vacantes</Link></p>

      <div className="tarjeta-arriba">
        <span className="logo-empresa" aria-hidden="true">{iniciales(empresa)}</span>
        <p className="empresa">
          {empresa}
          {esNueva(vacante.creada_en) && <span className="nueva">NUEVA</span>}
          <span className="hora">Publicada: {hace(vacante.creada_en).toLowerCase()}</span>
        </p>
      </div>

      <h1>{vacante.titulo}</h1>
      {!activa && <p className="mensaje mensaje-info">Esta vacante está {vacante.estado} y no recibe nuevas solicitudes.</p>}

      <ul className="lista-datos">
        <li className="sueldo">{moneda(vacante.sueldo)} mensuales</li>
        <li><strong>Ubicación:</strong> {vacante.ubicacion}</li>
        <li><strong>Horario:</strong> {vacante.horario}</li>
        <li><strong>Categoría:</strong> {vacante.categoria}</li>
        {vacante.empresa?.giro && <li><strong>Giro de la empresa:</strong> {vacante.empresa.giro}</li>}
      </ul>

      <section className="seccion-detalle" aria-labelledby="t-descripcion">
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

      <div className="acciones-detalle">
        {/* RF-051: el botón "Llamar" solo aparece si la vacante tiene teléfono */}
        {vacante.telefono_contacto && (
          <a className="boton boton-azul" href={`tel:${vacante.telefono_contacto}`}>
            Llamar a la empresa: {vacante.telefono_contacto}
          </a>
        )}
        {activa && <BotonPostular vacante={vacante} />}
      </div>
    </article>
  )
}
