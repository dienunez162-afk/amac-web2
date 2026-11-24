// Ubicación con ícono, sueldo "/ mes" y chips de horario y categoría.
import { moneda } from '../lib/formato'
import Icono from './Icono'

export default function DatosVacante({ vacante, conEtiquetas = true }) {
  return (
    <>
      <p className="lugar">
        <Icono nombre="ubicacion" tamano={18} />
        {vacante.ubicacion}
      </p>
      <p className="sueldo">
        {moneda(vacante.sueldo)} <span className="por-mes">/ mes</span>
      </p>
      {conEtiquetas && (
        <ul className="etiquetas" aria-label="Características">
          <li>{vacante.horario}</li>
          <li>{vacante.categoria}</li>
        </ul>
      )}
    </>
  )
}
