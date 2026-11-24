// Encabezado con logo, teléfono de ayuda y menú. El menú cambia según el rol de la sesión.
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// NavLink agrega aria-current="page" solo; aquí además ponemos la clase "actual" de la Entrega 2
const claseEnlace = ({ isActive }) => (isActive ? 'actual' : undefined)

export default function Encabezado() {
  const { perfil, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  async function salir() {
    await cerrarSesion()
    navigate('/')
  }

  return (
    <>
      <a className="saltar" href="#principal">Saltar al contenido</a>
      <header className="encabezado">
        <div className="contenedor fila">
          <Link className="logo" to="/">
            <img src="/img/logo.png" alt="AMAC, ir al inicio" width="103" height="38" />
          </Link>
          <a className="ayuda" href="tel:8100000000">Ayuda: 81 0000 0000</a>
          <nav className="menu" aria-label="Navegación principal">
            <ul>
              <li>
                <NavLink to="/" end className={claseEnlace}>
                  <img src="/img/empleos.svg" alt="" />Empleos
                </NavLink>
              </li>

              {perfil?.rol === 'candidato' && (
                <li>
                  <NavLink to="/mis-solicitudes" className={claseEnlace}>
                    <img src="/img/solicitudes.svg" alt="" />Solicitudes
                  </NavLink>
                </li>
              )}

              {perfil?.rol === 'empresa' && (
                <li>
                  <NavLink to="/empresa/vacantes" className={claseEnlace}>
                    <img src="/img/empresa.svg" alt="" />Mi empresa
                  </NavLink>
                </li>
              )}

              {perfil ? (
                <li>
                  <button type="button" onClick={salir}>
                    <img src="/img/ingresar.svg" alt="" />Salir
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink to="/login" className={claseEnlace}>
                    <img src="/img/ingresar.svg" alt="" />Ingresar
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
