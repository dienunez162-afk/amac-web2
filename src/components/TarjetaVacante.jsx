// Tarjeta de vacante para el listado. Recibe la vacante por props (con su empresa ya unida por el JOIN).
import { Link } from 'react-router-dom'
import { iniciales, moneda, hace, esNueva } from '../lib/formato'

export default function TarjetaVacante({ vacante }) {
  const empresa = vacante.empresa?.nombre ?? 'Empresa'

  return (
    <article className="tarjeta">
      <div className="tarjeta-arriba">
        <span className="logo-empresa" aria-hidden="true">{iniciales(empresa)}</span>
        <p className="empresa">
          {empresa}
          {esNueva(vacante.creada_en) && <span className="nueva">NUEVA</span>}
          <span className="hora">{hace(vacante.creada_en)}</span>
        </p>
      </div>
      <h3><Link to={`/vacantes/${vacante.id}`}>{vacante.titulo}</Link></h3>
      <p className="lugar">{vacante.ubicacion}</p>
      <p className="sueldo">{moneda(vacante.sueldo)} / mes</p>
      <ul className="etiquetas">
        <li>{vacante.horario}</li>
        <li>{vacante.categoria}</li>
      </ul>
      <Link
        className="boton boton-naranja"
        to={`/vacantes/${vacante.id}`}
        aria-label={`Ver y postularte a ${vacante.titulo}`}
      >
        Ver y postularte
      </Link>
    </article>
  )
}
