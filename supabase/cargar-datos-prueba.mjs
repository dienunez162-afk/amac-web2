// Carga datos de ejemplo: 1 cuenta de empresa + 6 vacantes.
// Usa SOLO la publishable key: las vacantes se insertan con la sesión de la empresa,
// así que pasan por las mismas políticas RLS que la app.
//
// Uso (desde la raíz del proyecto):
//   node --env-file=.env.local supabase/cargar-datos-prueba.mjs
// Necesita en .env.local: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY,
// EMPRESA_PRUEBA_CORREO y EMPRESA_PRUEBA_CONTRASENA (no se suben a GitHub).
import { createClient } from '@supabase/supabase-js'

const {
  VITE_SUPABASE_URL: url,
  VITE_SUPABASE_PUBLISHABLE_KEY: llave,
  EMPRESA_PRUEBA_CORREO: correo,
  EMPRESA_PRUEBA_CONTRASENA: contrasena,
} = process.env

if (!url || !llave || !correo || !contrasena) {
  console.error('Faltan variables en .env.local')
  process.exit(1)
}

const supabase = createClient(url, llave, { auth: { persistSession: false } })

// 1) Crear la empresa (o iniciar sesión si ya existe)
let { data, error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena })
if (error) {
  ;({ data, error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: {
      data: { rol: 'empresa', nombre: 'Comercializadora Regia', giro: 'Comercio y servicios', telefono: '8110000000' },
    },
  }))
  if (error) throw error
  console.log('Empresa creada')
} else {
  console.log('La empresa ya existía; sesión iniciada')
}
const empresaId = data.user.id

// 2) No duplicar si ya se cargaron
const { count } = await supabase.from('vacantes').select('id', { count: 'exact', head: true }).eq('empresa_id', empresaId)
if (count > 0) {
  console.log(`La empresa ya tiene ${count} vacantes; no se insertó nada.`)
  process.exit(0)
}

// 3) Vacantes de ejemplo (basadas en la Entrega 2)
const comunes = {
  empresa_id: empresaId,
  prestaciones: 'Prestaciones de ley, vales de despensa y seguro de vida.',
}
const vacantes = [
  {
    titulo: 'Auxiliar administrativo', sueldo: 11000, ubicacion: 'Santa Catarina, N. L.',
    horario: 'Matutino', categoria: 'Administración', telefono_contacto: '8112345678',
    descripcion: 'Apoyo en archivo, captura de documentos y atención a proveedores.',
    requisitos: 'Secundaria terminada. Manejo básico de computadora.',
  },
  {
    titulo: 'Soporte técnico', sueldo: 18000, ubicacion: 'Monterrey, N. L.',
    horario: 'Vespertino', categoria: 'Tecnología', telefono_contacto: null,
    descripcion: 'Atención a usuarios por teléfono y correo para resolver dudas de equipos de cómputo.',
    requisitos: 'Experiencia en soporte o reparación de computadoras.',
  },
  {
    titulo: 'Intendente general', sueldo: 10000, ubicacion: 'San Nicolás, N. L.',
    horario: 'Medio tiempo', categoria: 'Limpieza', telefono_contacto: '8187654321',
    descripcion: 'Limpieza de oficinas y áreas comunes.',
    requisitos: 'Gusto por el orden y la limpieza. No se requiere experiencia.',
  },
  {
    titulo: 'Recepción de almacén', sueldo: 9000, ubicacion: 'Monterrey, N. L.',
    horario: 'Matutino', categoria: 'Logística', telefono_contacto: null,
    descripcion: 'Registro de entradas y salidas de mercancía.',
    requisitos: 'Saber leer y escribir. Atención al detalle.',
  },
  {
    titulo: 'Ayudante de carpintería', sueldo: 11000, ubicacion: 'Santa Catarina, N. L.',
    horario: 'Fines de semana', categoria: 'Servicios', telefono_contacto: '8111122233',
    descripcion: 'Apoyo en lijado, armado y acabado de muebles.',
    requisitos: 'Experiencia básica con herramientas manuales.',
  },
  {
    titulo: 'Recepcionista', sueldo: 9800, ubicacion: 'Centro, Monterrey, N. L.',
    horario: 'Vespertino', categoria: 'Servicios', telefono_contacto: null,
    descripcion: 'Recibir a visitantes, contestar el teléfono y agendar citas.',
    requisitos: 'Buena presentación y trato amable.',
  },
].map(v => ({ ...comunes, ...v }))

const { error: errorInsert } = await supabase.from('vacantes').insert(vacantes)
if (errorInsert) throw errorInsert
console.log(`${vacantes.length} vacantes insertadas`)
