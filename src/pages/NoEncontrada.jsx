import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o cambió de lugar.</p>
      <p><Link className="boton boton-azul" to="/">Ver empleos</Link></p>
    </>
  )
}
