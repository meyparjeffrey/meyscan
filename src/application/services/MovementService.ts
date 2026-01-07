/**
 * Servicio de movimientos
 * 
 * Gestiona la lógica de negocio para movimientos de inventario
 */
import { MovementRepository } from '../../infrastructure/repositories/MovementRepository';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { Movement, CreateMovementDTO } from '../../domain/entities/Movement';
import { MovementType } from '../../domain/types/MovementType';
import { 
  validateQuantity, 
  validateStockForOut, 
  calculateStockAfter 
} from '../../domain/validators/productValidators';
import { SOURCE_APP } from '../../utils/constants';

export class MovementService {
  constructor(
    private movementRepository: MovementRepository,
    private productRepository: ProductRepository
  ) {}

  /**
   * Registra un movimiento de inventario
   * 
   * Valida:
   * - Cantidad > 0
   * - Stock suficiente para salidas
   * 
   * Calcula:
   * - Stock antes y después del movimiento
   * 
   * Actualiza:
   * - Stock del producto en la BD
   * 
   * @param productId - ID del producto
   * @param movementType - Tipo de movimiento (IN/OUT)
   * @param quantity - Cantidad del movimiento
   * @param scannerUser - Nombre del usuario escáner (para request_reason)
   * @returns Movimiento creado
   * @throws Error si la validación falla
   */
  async recordMovement(
    productId: string,
    movementType: MovementType,
    quantity: number,
    scannerUser: string
  ): Promise<Movement> {
    // Validar cantidad
    if (!validateQuantity(quantity)) {
      throw new Error('La cantidad debe ser mayor que 0.');
    }

    // Obtener producto por ID (productId ya es el ID del producto encontrado)
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    const currentStock = product.stockCurrent;

    // Validar stock para salidas
    if (movementType === 'OUT') {
      if (!validateStockForOut(currentStock, quantity)) {
        throw new Error(`Stock insuficiente. Stock actual: ${currentStock}.`);
      }
    }

    // Calcular stock después
    const quantityAfter = calculateStockAfter(currentStock, movementType, quantity);

    // Crear movimiento
    const movementData: CreateMovementDTO = {
      productId: product.id,
      movementType,
      quantity,
      quantityBefore: currentStock,
      quantityAfter,
      requestReason: scannerUser,
      sourceApp: SOURCE_APP,
    };

    const movement = await this.movementRepository.create(movementData);

    // Actualizar stock del producto
    await this.productRepository.updateStock(product.id, quantityAfter);

    return movement;
  }
}
