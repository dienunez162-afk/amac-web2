import { Link } from 'react-router-dom'

export default function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <p><strong>AMAC</strong> · Bolsa de trabajo para personas adultas mayores.</p>
        <p>¿Dudas o problemas? Llama a un empleado de AMAC: <a href="tel:8100000000">81 0000 0000</a></p>
        <div className="pie-enlaces">
          <Link to="/">Empleos</Link>
          <Link to="/registro">Crear cuenta</Link>
          <Link to="/registro-empresa">Registrar mi empresa</Link>
          <a href="https://www.amac.org.mx/donativos">Donativos</a>
        </div>
      </div>
    </footer>
  )
}
