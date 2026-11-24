import { Routes, Route } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import Pie from './components/Pie'
import RutaProtegida from './components/RutaProtegida'
import NoEncontrada from './pages/NoEncontrada'
import ListadoVacantes from './pages/ListadoVacantes'
import DetalleVacante from './pages/DetalleVacante'
import Login from './pages/Login'
import RegistroCandidato from './pages/RegistroCandidato'
import MisSolicitudes from './pages/MisSolicitudes'
import RegistroEmpresa from './pages/RegistroEmpresa'
import PublicarVacante from './pages/PublicarVacante'
import EmpresaVacantes from './pages/EmpresaVacantes'
import SolicitudesRecibidas from './pages/SolicitudesRecibidas'

export default function App() {
  return (
    <>
      <Encabezado />
      <main id="principal" className="principal contenedor">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<ListadoVacantes />} />
          <Route path="/vacantes/:id" element={<DetalleVacante />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroCandidato />} />
          <Route path="/registro-empresa" element={<RegistroEmpresa />} />

          {/* Solo candidatos (RF-010) */}
          <Route path="/mis-solicitudes" element={
            <RutaProtegida rol="candidato"><MisSolicitudes /></RutaProtegida>
          } />

          {/* Solo empresas (RF-010) */}
          <Route path="/empresa/vacantes" element={
            <RutaProtegida rol="empresa"><EmpresaVacantes /></RutaProtegida>
          } />
          <Route path="/empresa/publicar" element={
            <RutaProtegida rol="empresa"><PublicarVacante /></RutaProtegida>
          } />
          <Route path="/empresa/vacantes/:id/solicitudes" element={
            <RutaProtegida rol="empresa"><SolicitudesRecibidas /></RutaProtegida>
          } />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Pie />
    </>
  )
}
