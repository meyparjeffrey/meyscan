/**
 * Servicio de autenticación
 * 
 * Gestiona el login del usuario técnico y la sesión de Supabase
 */
import { supabase } from '../../infrastructure/supabase/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   * @param email - Email del usuario técnico
   * @param password - Contraseña
   * @returns Sesión de Supabase
   * @throws Error si las credenciales son incorrectas o hay error de red
   */
  async login(email: string, password: string): Promise<Session> {
    try {
      console.log('[AuthService] Intentando login con email:', email);
      // DEBUG: Verificando longitud de password para detectar espacios accidentales
      console.log('[AuthService] Longitud email:', email.length);
      console.log('[AuthService] Longitud email (trim):', email.trim().length);
      console.log('[AuthService] Longitud password:', password.length);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password, // NO trim password por si la pass real tiene espacios
      });

      if (error) {
        console.error('[AuthService] Error de Supabase DETALLADO:', {
          status: error.status,
          message: error.message,
          name: error.name,
          error_description: (error as any).error_description
        });
        
        // Mapear errores de Supabase a mensajes más amigables
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          throw new Error('Credenciales incorrectas. Verifica que el email y contraseña sean los mismos que usas en INVENTARIOMEYPAR.');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('El email no está confirmado. Verifica tu correo electrónico.');
        }
        if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          throw new Error('No hay conexión a Supabase. Comprueba Wi‑Fi/datos e inténtalo de nuevo.');
        }
        // Mostrar el mensaje de error original para debugging
        throw new Error(`Error de autenticación: ${error.message}`);
      }

      if (!data.session) {
        console.error('[AuthService] No se recibió sesión en la respuesta');
        throw new Error('No se pudo iniciar sesión. Inténtalo de nuevo.');
      }

      console.log('[AuthService] Login exitoso, sesión obtenida');
      console.log('[AuthService] JWT:', data.session.access_token.substring(0, 15) + '...');
      console.log('[AuthService] User Role:', data.session.user.role);
      return data.session;
    } catch (error) {
      console.error('[AuthService] Error en login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al iniciar sesión.');
    }
  }

  /**
   * Cierra la sesión actual
   */
  async logout(): Promise<void> {
    try {
      console.log('[AuthService] Iniciando logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthService] Error en signOut:', error);
        throw error;
      }
      console.log('[AuthService] Logout exitoso');
    } catch (error) {
      console.error('[AuthService] Error logging out:', error);
      throw error;
    }
  }

  /**
   * Obtiene la sesión actual
   * @returns Sesión actual o null si no hay sesión
   */
  async getCurrentSession(): Promise<Session | null> {
    try {
      console.log('[AuthService] ========================================');
      console.log('[AuthService] getCurrentSession() INICIADO');
      console.log('[AuthService] Llamando a supabase.auth.getSession()...');
      const startTime = Date.now();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      const duration = Date.now() - startTime;
      console.log('[AuthService] getSession() completado en', duration, 'ms');
      
      if (error) {
        console.error('[AuthService] ❌ Error en getSession:', error);
        
        // Si hay un error de refresh token, limpiar la sesión
        if (error.message.includes('refresh_token') || error.message.includes('Refresh Token')) {
          console.log('[AuthService] Refresh token inválido detectado, limpiando sesión...');
          await supabase.auth.signOut();
        }
        
        return null;
      }
      
      console.log('[AuthService] ✅ Sesión obtenida:', session ? 'SÍ' : 'NO');
      if (session) {
        console.log('[AuthService] Detalles:', {
          userId: session.user?.id,
          email: session.user?.email,
          expiresAt: session.expires_at,
        });
      }
      console.log('[AuthService] ========================================');
      return session;
    } catch (error) {
      console.error('[AuthService] ❌ EXCEPCIÓN en getCurrentSession:', error);
      console.error('[AuthService] Error tipo:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[AuthService] Error mensaje:', error instanceof Error ? error.message : String(error));
      console.error('[AuthService] Error stack:', error instanceof Error ? error.stack : 'No stack');
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa
   * @returns true si hay sesión activa, false en caso contrario
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return session !== null;
  }
}

