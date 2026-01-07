/**
 * Tipos de tema disponibles en la aplicación
 */
export type ThemeType = 'light' | 'dark';

/**
 * Constantes para tipos de tema
 */
export const ThemeTypes = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
} as const;

