/**
 * Hook para manejar timeouts
 */
import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook que ejecuta una función después de un timeout
 * Se reinicia automáticamente cuando cambian las dependencias
 * 
 * @param callback - Función a ejecutar
 * @param delay - Delay en milisegundos
 * @param dependencies - Dependencias que reinician el timeout
 */
export function useTimeout(
  callback: () => void,
  delay: number,
  dependencies: any[] = []
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Actualizar callback ref cuando cambia
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Configurar timeout
  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
    }, delay);

    // Limpiar al desmontar o cuando cambian las dependencias
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, ...dependencies]);

  // Función para limpiar manualmente
  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Función para reiniciar
  const reset = useCallback(() => {
    clear();
    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
      }, delay);
    }
  }, [delay]);

  return { clear, reset };
}

