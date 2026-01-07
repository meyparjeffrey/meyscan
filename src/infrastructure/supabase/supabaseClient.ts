/**
 * Cliente de Supabase para la aplicación
 * 
 * IMPORTANTE: Las credenciales DEBEN venir de variables de entorno.
 * No se permiten valores hardcodeados por seguridad (RNF-03).
 * 
 * Variables requeridas:
 * - EXPO_PUBLIC_SUPABASE_URL
 * - EXPO_PUBLIC_SUPABASE_ANON_KEY
 */
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Obtener credenciales SOLO desde variables de entorno o Constants de Expo
// NO se permiten valores hardcodeados
const supabaseUrl = 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  Constants.expoConfig?.extra?.supabaseUrl;

const supabaseAnonKey = 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  Constants.expoConfig?.extra?.supabaseAnonKey;

// Validación estricta: las credenciales son obligatorias
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
⚠️ ERROR CRÍTICO: Credenciales de Supabase no configuradas.

Por favor, configura las variables de entorno:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

Crea un archivo .env en la raíz del proyecto scanner-apk/ con:
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

O configura las variables en app.json > extra > supabaseUrl y supabaseAnonKey
  `.trim();
  
  console.error(errorMessage);
  throw new Error('Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Cliente de Supabase configurado
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: undefined, // En web, usar localStorage automáticamente
  },
});

// Log para verificar que las credenciales se cargaron correctamente
console.log('[Supabase Client] Configurado con URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NO CONFIGURADO');
console.log('[Supabase Client] Anon Key configurado:', supabaseAnonKey ? 'SÍ' : 'NO');

