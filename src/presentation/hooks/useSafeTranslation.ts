/**
 * Hook seguro para traducciones que maneja errores
 */
import { useTranslation } from 'react-i18next';

export function useSafeTranslation() {
  const { t: originalT, ...rest } = useTranslation();

  const t = (key: string, options?: any): string => {
    try {
      // Verificar que i18n esté inicializado
      if (!originalT) {
        console.warn('[useSafeTranslation] i18n no inicializado, devolviendo clave:', key);
        return key;
      }

      const result = originalT(key, options);
      
      // Si la traducción no existe o hay un error, devolver la clave
      if (!result || result === key) {
        console.warn('[useSafeTranslation] Traducción faltante o error para:', key);
        return key;
      }

      return result;
    } catch (error) {
      console.error('[useSafeTranslation] Error al traducir:', key, error);
      return key; // Devolver la clave como fallback
    }
  };

  return {
    t,
    ...rest,
  };
}

