import { Routes, Route } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import Pie from './components/Pie'
import RutaProtegida from './components/RutaProtegida'
import NoEncontrada from './pages/NoEncontrada'
import ListadoVacantes from './pages/ListadoVacantes'

// TEMPORAL (Paso 3): marcador para las páginas que se construyen en los Pasos 4 y 5.
function EnConstruccion({ titulo }) {
  return (
    <>
      <h1>{titulo}</h1>
      <p role="status">Esta página está en construcción.</p>
    </>
  )
}

export default function App() {
  return (
    <>
      <Encabezado />
      <main id="principal" className="principal contenedor">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<ListadoVacantes />} />
          <Route path="/vacantes/:id" element={<EnConstruccion titulo="Detalle de vacante" />} />
          <Route path="/login" element={<EnConstruccion titulo="Iniciar sesión" />} />
          <Route path="/registro" element={<EnConstruccion titulo="Crear cuenta de candidato" />} />
          <Route path="/registro-empresa" element={<EnConstruccion titulo="Registrar mi empresa" />} />

          {/* Solo candidatos (RF-010) */}
          <Route path="/mis-solicitudes" element={
            <RutaProtegida rol="candidato"><EnConstruccion titulo="Mis solicitudes" /></RutaProtegida>
          } />

          {/* Solo empresas (RF-010) */}
          <Route path="/empresa/vacantes" element={
            <RutaProtegida rol="empresa"><EnConstruccion titulo="Mis vacantes" /></RutaProtegida>
          } />
          <Route path="/empresa/publicar" element={
            <RutaProtegida rol="empresa"><EnConstruccion titulo="Publicar vacante" /></RutaProtegida>
          } />
          <Route path="/empresa/vacantes/:id/solicitudes" element={
            <RutaProtegida rol="empresa"><EnConstruccion titulo="Solicitudes recibidas" /></RutaProtegida>
          } />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  )
}
