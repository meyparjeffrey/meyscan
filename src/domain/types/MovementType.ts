/**
 * Tipos de movimiento de inventario permitidos en la APK
 */
export type MovementType = 'IN' | 'OUT';

/**
 * Constantes para tipos de movimiento
 */
export const MovementTypes = {
  IN: 'IN' as const,
  OUT: 'OUT' as const,
} as const;

