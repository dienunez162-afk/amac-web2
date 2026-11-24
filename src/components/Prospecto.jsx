// Tarjeta de un candidato que se postuló (prototipo: "Prospectos").
// Se reutiliza en Mis vacantes y en Solicitudes recibidas; los botones llegan como children.
import { hace } from '../lib/formato'
import EtiquetaEstatus from './EtiquetaEstatus'
import Icono from './Icono'

export default function Prospecto({ solicitud, nivel = 'h4', children }) {
  const c = solicitud.candidato ?? {}
  const Titulo = nivel // h2 en su propia página, h4 dentro de una vacante

  return (
    <article className="prospecto">
      <div className="prospecto-arriba">
        <span className="avatar" aria-hidden="true"><Icono nombre="usuario" tamano={26} /></span>
        <div>
          <Titulo>{c.nombre ?? 'Candidato'}</Titulo>
          <span className="hora">Se postuló {hace(solicitud.creada_en).toLowerCase()}</span>
        </div>
      </div>
      <p><strong>Estatus:</strong> <EtiquetaEstatus estatus={solicitud.estatus} /></p>
      <p><strong>Edad: {c.edad ? `${c.edad} años` : 'No indicada'}</strong></p>
      <p className="lugar">
        <Icono nombre="ubicacion" tamano={18} />
        {c.colonia || 'Colonia no indicada'}
      </p>
      <p><strong>Experiencia:</strong></p>
      <p className="experiencia texto-multilinea">{c.experiencia || 'No indicada'}</p>
      {children}
    </article>
  )
}
