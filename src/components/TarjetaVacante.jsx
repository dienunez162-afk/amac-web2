// Tarjeta de vacante del listado. Recibe la vacante por props (con su empresa ya unida por el JOIN).
import { Link } from 'react-router-dom'
import EncabezadoEmpresa from './EncabezadoEmpresa'
import DatosVacante from './DatosVacante'

export default function TarjetaVacante({ vacante }) {
  return (
    <article className="tarjeta">
      <EncabezadoEmpresa vacante={vacante} />
      <h3><Link to={`/vacantes/${vacante.id}`}>{vacante.titulo}</Link></h3>
      <DatosVacante vacante={vacante} />
      <Link
        className="boton boton-naranja boton-mayus"
        to={`/vacantes/${vacante.id}`}
        aria-label={`Postularte a ${vacante.titulo}`}
      >
        Postularte
      </Link>
    </article>
  )
}
