// Encabezado azul con el logo y la navegación. En celular la navegación es una barra fija abajo
// (como en el prototipo); en escritorio sube al encabezado. Las opciones cambian según el rol.
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icono from './Icono'

// NavLink agrega aria-current="page" solo; además ponemos la clase "actual"
const claseEnlace = ({ isActive }) => (isActive ? 'actual' : undefined)

function Opcion({ a, icono, texto, end }) {
  return (
    <li>
      <NavLink to={a} end={end} className={claseEnlace}>
        <Icono nombre={icono} />
        {texto}
      </NavLink>
    </li>
  )
}

export default function Encabezado() {
  const { perfil, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  // RF-009: primero ir al inicio y luego cerrar sesión
  // (si se cierra primero, la ruta protegida actual mandaría a /login)
  async function salir() {
    navigate('/')
    await cerrarSesion()
  }

  return (
    <>
      <a className="saltar" href="#principal">Saltar al contenido</a>
      <header className="encabezado">
        <div className="contenedor fila">
          <Link className="logo" to="/">
            <img src="/img/logo.png" alt="AMAC, ir al inicio" width="103" height="38" />
          </Link>
          <nav className="menu" aria-label="Navegación principal">
            <ul>
              <Opcion a="/" end icono="maletin" texto="Empleos" />

              {perfil?.rol === 'candidato' && (
                <Opcion a="/mis-solicitudes" icono="avion" texto="Solicitudes" />
              )}

              {perfil?.rol === 'empresa' && (
                <>
                  <Opcion a="/empresa/vacantes" icono="avion" texto="Vacantes" />
                  <Opcion a="/empresa/publicar" icono="mas" texto="Publicar" />
                </>
              )}

              {perfil ? (
                <li>
                  <button type="button" onClick={salir}>
                    <Icono nombre="salir" />
                    Salir
                  </button>
                </li>
              ) : (
                <Opcion a="/login" icono="usuario" texto="Ingresar" />
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
