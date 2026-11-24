// Parte de arriba de las tarjetas: cuadro con iniciales, nombre de la empresa, "NUEVA" y hace cuánto.
// Se reutiliza en el listado, el detalle y Mis solicitudes.
import { iniciales, hace, esNueva } from '../lib/formato'
import Icono from './Icono'

export default function EncabezadoEmpresa({ vacante, extra, textoHora }) {
  const empresa = vacante.empresa?.nombre ?? 'Empresa'
  // Alterna el color del cuadro (celeste / durazno) como en el prototipo
  const alterno = Number(vacante.id) % 2 === 0 ? ' alterno' : ''

  return (
    <div className="tarjeta-arriba">
      <span className={`logo-empresa${alterno}`} aria-hidden="true">{iniciales(empresa)}</span>
      <p className="empresa">
        {empresa}
        {extra ?? (esNueva(vacante.creada_en) && <span className="nueva">NUEVA</span>)}
        <span className="hora">{textoHora ?? hace(vacante.creada_en)}</span>
      </p>
      <Icono nombre="marcador" className="icono-marcador" />
    </div>
  )
}
