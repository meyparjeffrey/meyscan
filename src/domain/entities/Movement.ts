import { MovementType } from '../types/MovementType';

/**
 * Entidad de dominio: Movement
 * Representa un movimiento de inventario
 */
export interface Movement {
  id: string;
  productId: string;
  userId: string | null;
  movementType: MovementType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  movementDate: string;
  requestReason: string;
  sourceApp: string;
  comments: string | null;
  createdAt: string;
}

/**
 * DTO para crear un movimiento
 */
export interface CreateMovementDTO {
  productId: string;
  movementType: MovementType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  requestReason: string;
  sourceApp: string;
  comments?: string;
}

