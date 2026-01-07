/**
 * Tipos de idioma disponibles en la aplicación
 */
export type LanguageType = 'ca' | 'es';

/**
 * Constantes para tipos de idioma
 */
export const LanguageTypes = {
  CATALAN: 'ca' as const,
  SPANISH: 'es' as const,
} as const;

