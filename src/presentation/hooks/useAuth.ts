/**
 * Hook para gestión de autenticación
 */
import { useState, useEffect } from 'react';
import { AuthService } from '../../application/services/AuthService';
import type { Session } from '@supabase/supabase-js';

const authService = new AuthService();

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sesión al montar
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      console.log('[useAuth] ========================================');
      console.log('[useAuth] INICIANDO CARGA DE SESION');
      console.log('[useAuth] ========================================');
      console.log('[useAuth] Timestamp inicio:', new Date().toISOString());
      
      console.log('[useAuth] Estableciendo loading=true...');
      setLoading(true);
      console.log('[useAuth] loading=true establecido');
      
      console.log('[useAuth] Llamando a authService.getCurrentSession()...');
      const startTime = Date.now();
      const currentSession = await authService.getCurrentSession();
      const duration = Date.now() - startTime;
      console.log('[useAuth] getCurrentSession() completado en', duration, 'ms');
      
      console.log('[useAuth] ✅ Sesión obtenida:', currentSession ? 'SÍ (autenticado)' : 'NO (sin autenticar)');
      if (currentSession) {
        console.log('[useAuth] Detalles de sesión:', {
          user: currentSession.user?.email,
          expiresAt: currentSession.expires_at,
        });
      }
      
      console.log('[useAuth] Actualizando estado: setSession()...');
      setSession(currentSession);
      console.log('[useAuth] setSession() completado');
      
      console.log('[useAuth] Actualizando estado: setError(null)...');
      setError(null);
      console.log('[useAuth] setError(null) completado');
      
      console.log('[useAuth] Estado actualizado correctamente');
    } catch (err) {
      console.error('[useAuth] ❌ ERROR al cargar sesión:', err);
      console.error('[useAuth] Error tipo:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[useAuth] Error mensaje:', err instanceof Error ? err.message : String(err));
      console.error('[useAuth] Error stack:', err instanceof Error ? err.stack : 'No stack');
      console.error('[useAuth] Estableciendo error en estado...');
      setError(err instanceof Error ? err.message : 'Error al cargar sesión');
      console.error('[useAuth] Error establecido en estado');
    } finally {
      console.log('[useAuth] ========================================');
      console.log('[useAuth] ENTRANDO A FINALLY');
      console.log('[useAuth] Finalizando carga de sesión, estableciendo loading=false');
      console.log('[useAuth] Timestamp antes de setLoading(false):', new Date().toISOString());
      setLoading(false);
      console.log('[useAuth] setLoading(false) COMPLETADO');
      console.log('[useAuth] Timestamp despues de setLoading(false):', new Date().toISOString());
      console.log('[useAuth] ========================================');
      console.log('[useAuth] loadSession() FINALIZADO COMPLETAMENTE');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const newSession = await authService.login(email, password);
      setSession(newSession);
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('[useAuth] Iniciando logout...');
      setLoading(true);
      await authService.logout();
      console.log('[useAuth] Logout exitoso, limpiando sesión...');
      setSession(null);
      setError(null);
      console.log('[useAuth] Sesión limpiada correctamente');
    } catch (err) {
      console.error('[useAuth] Error durante logout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(errorMessage);
      // Aún así, limpiar la sesión local
      setSession(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    isAuthenticated: session !== null,
    loading,
    error,
    login,
    logout,
    refreshSession: loadSession,
  };
}

