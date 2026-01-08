/**
 * Constantes de la aplicación
 */

/**
 * Tiempo de inactividad antes de volver a Home (en milisegundos)
 */
export const INACTIVITY_TIMEOUT_MS = 60000; // 60 segundos (1 minuto)

/**
 * Número de taps requeridos para abrir el menú de administración
 */
export const ADMIN_TAPS_REQUIRED = 5;

/**
 * Tiempo máximo entre taps para el gesto de administración (en milisegundos)
 */
export const ADMIN_TAPS_TIMEOUT_MS = 3000; // 3 segundos

/**
 * Nombre de la aplicación
 */
export const APP_NAME = 'MeyparScan';

/**
 * Source app identifier para movimientos creados desde la APK
 */
export const SOURCE_APP = 'APK_SCANNER';

/**
 * Almacén por defecto para movimientos realizados desde la APK
 */
export const WAREHOUSE_DEFAULT = 'MEYPAR';

/**
 * Valores por defecto
 */
export const DEFAULTS = {
  QUANTITY: 1,
  LANGUAGE: 'ca' as const,
  THEME: 'light' as const,
} as const;

/**
 * Breakpoints para responsive design
 */
export const BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024,
  NEWLAND_WIDTH: 800, // Aproximado para 5-5.5" horizontal
} as const;

