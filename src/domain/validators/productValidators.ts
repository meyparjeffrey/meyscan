/**
 * Validadores para entidades de Product
 */

/**
 * Valida si una cantidad es válida (mayor que 0)
 * @param quantity - Cantidad a validar
 * @returns true si es válida, false en caso contrario
 */
export function validateQuantity(quantity: number): boolean {
  return quantity > 0 && Number.isInteger(quantity);
}

/**
 * Valida si hay stock suficiente para una salida
 * @param currentStock - Stock actual del producto
 * @param quantity - Cantidad a retirar
 * @returns true si hay stock suficiente, false en caso contrario
 */
export function validateStockForOut(currentStock: number, quantity: number): boolean {
  return currentStock >= quantity;
}

/**
 * Calcula el stock después de un movimiento
 * @param currentStock - Stock actual
 * @param movementType - Tipo de movimiento (IN/OUT)
 * @param quantity - Cantidad del movimiento
 * @returns Stock después del movimiento
 */
export function calculateStockAfter(
  currentStock: number,
  movementType: 'IN' | 'OUT',
  quantity: number
): number {
  if (movementType === 'IN') {
    return currentStock + quantity;
  } else {
    return currentStock - quantity;
  }
}

