// Listado de vacantes (RF-001) con búsqueda (RF-007) y filtros por horario y categoría (RF-002).
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { HORARIOS, CATEGORIAS } from '../lib/catalogos'
import TarjetaVacante from '../components/TarjetaVacante'
import Icono from '../components/Icono'

// Quita caracteres que romperían el filtro .or() de Supabase (comas, paréntesis, comodines)
const limpiar = texto => texto.replace(/[,()%*\\]/g, ' ').trim()

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [texto, setTexto] = useState('')        // lo que la persona escribe
  const [busqueda, setBusqueda] = useState('')  // lo que se busca al presionar "Buscar"
  const [horario, setHorario] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('recientes')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Se vuelve a consultar cada vez que cambia la búsqueda, un filtro o el orden
  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError('')

      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)') // JOIN con la empresa que publicó
        .eq('estado', 'activa')                // RF-001: solo vacantes activas

      const palabra = limpiar(busqueda)
      if (palabra) {
        // ilike = sin distinguir mayúsculas; busca en título O ubicación
        consulta = consulta.or(`titulo.ilike.%${palabra}%,ubicacion.ilike.%${palabra}%`)
      }
      if (horario) consulta = consulta.eq('horario', horario)
      if (categoria) consulta = consulta.eq('categoria', categoria)

      consulta = orden === 'sueldo'
        ? consulta.order('sueldo', { ascending: false })
        : consulta.order('creada_en', { ascending: false })

      const { data, error } = await consulta
      if (error) setError('No pudimos cargar las vacantes. Intenta de nuevo en un momento.')
      else setVacantes(data)
      setCargando(false)
    }
    cargar()
  }, [busqueda, horario, categoria, orden])

  function buscar(evento) {
    evento.preventDefault()
    setBusqueda(texto)
  }

  function limpiarFiltros() {
    setTexto('')
    setBusqueda('')
    setHorario('')
    setCategoria('')
  }

  const hayFiltros = busqueda || horario || categoria

  return (
    <>
      <section className="hero sangrado">
        <h1>Empleos para ti</h1>
        <p>Encuentra trabajo fácil y rápido</p>
      </section>

      <form onSubmit={buscar} role="search" aria-label="Buscar vacantes">
        <div className="barra-filtros sangrado">
          <details open={Boolean(horario || categoria)}>
            <summary>
              <Icono nombre="filtro" />
              Filtrar resultados
              <Icono nombre="chevronDerecha" tamano={20} className="chevron" />
            </summary>
            <div className="contenido-filtros">
              <div className="campo">
                <label htmlFor="categoria">Categoría</label>
                <select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)}>
                  <option value="">Todas las áreas</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="campo">
                <label htmlFor="horario">Horario</label>
                <select id="horario" value={horario} onChange={e => setHorario(e.target.value)}>
                  <option value="">Cualquier horario</option>
                  {HORARIOS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <button type="submit" className="boton boton-naranja">Buscar empleos</button>
            </div>
          </details>
          {hayFiltros && (
            <button type="button" className="limpiar" onClick={limpiarFiltros}>
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>

        <div className="buscador">
          <button type="submit" aria-label="Buscar">
            <Icono nombre="lupa" />
          </button>
          <label htmlFor="buscar" className="solo-lectores">Buscar por empleo o ubicación</label>
          <input
            type="search"
            id="buscar"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Empleo o ubicación"
          />
        </div>
      </form>

      <div className="resultados">
        <h2 aria-live="polite">
          {cargando ? 'Buscando…' : `${vacantes.length} ${vacantes.length === 1 ? 'vacante' : 'vacantes'}`}
        </h2>
        <div className="campo">
          <label htmlFor="orden" className="solo-lectores">Ordenar por</label>
          <select id="orden" value={orden} onChange={e => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="sueldo">Mayor sueldo</option>
          </select>
        </div>
      </div>

      {cargando && <p role="status">Cargando vacantes…</p>}
      {error && <p role="alert" className="vacio">{error}</p>}
      {!cargando && !error && vacantes.length === 0 && (
        <p className="vacio">No hay vacantes para mostrar.</p>
      )}

      {!cargando && vacantes.length > 0 && (
        <ul className="lista">
          {vacantes.map(v => (
            <li key={v.id}><TarjetaVacante vacante={v} /></li>
          ))}
        </ul>
      )}
    </>
  )
}
