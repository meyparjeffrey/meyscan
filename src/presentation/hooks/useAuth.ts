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
      setLoading(true);
      const currentSession = await authService.getCurrentSession();
      setSession(currentSession);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar sesión');
    } finally {
      setLoading(false);
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

