// Íconos de línea (estilo del prototipo de Figma). Son decorativos: aria-hidden,
// el texto que los acompaña es el que leen los lectores de pantalla.
const TRAZOS = {
  maletin: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
    </>
  ),
  marcador: <path d="M6 3h12v18l-6-4-6 4z" />,
  avion: <path d="M21 3 3 10.5l7 2.5 2.5 7zM21 3 10 13" />,
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  edificio: (
    <>
      <rect x="4" y="3" width="11" height="18" rx="1" />
      <path d="M15 9h5v12h-5M8 7h3M8 11h3M8 15h3" />
    </>
  ),
  salir: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />,
  ubicacion: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  filtro: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />,
  chevronDerecha: <path d="m9 5 7 7-7 7" />,
  chevronAbajo: <path d="m5 9 7 7 7-7" />,
  flechaAbajo: <path d="M12 4v16M6 14l6 6 6-6" />,
  circuloAbajo: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7v9M8 12.5l4 4 4-4" />
    </>
  ),
  lupa: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  telefono: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  palomita: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  equis: <path d="M6 6l12 12M18 6 6 18" />,
  mas: <path d="M12 5v14M5 12h14" />,
}

export default function Icono({ nombre, tamano = 24, grosor = 2, className }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRAZOS[nombre]}
    </svg>
  )
}
