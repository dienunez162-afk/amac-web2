import { Routes, Route } from 'react-router-dom'

// Página temporal del Paso 1: se reemplaza por las páginas reales en los siguientes pasos.
function Inicio() {
  return (
    <>
      <h1>AMAC en React</h1>
      <p>El proyecto React está funcionando.</p>
    </>
  )
}

export default function App() {
  return (
    <main id="principal" className="principal contenedor">
      <Routes>
        <Route path="/" element={<Inicio />} />
      </Routes>
    </main>
  )
}
