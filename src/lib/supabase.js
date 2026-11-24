// Cliente único de Supabase para toda la app.
// Usa la publishable key (segura en el navegador): la protección real la hacen las políticas RLS.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const llave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !llave) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en .env.local')
}

export const supabase = createClient(url, llave)
