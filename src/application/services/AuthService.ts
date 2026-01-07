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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('[AuthService] Error de Supabase:', error);
        
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
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
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

