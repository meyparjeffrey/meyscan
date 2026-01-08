/**
 * Repositorio para operaciones con movimientos en Supabase
 */
import { supabase } from '../supabase/supabaseClient';
import { Movement, CreateMovementDTO } from '../../domain/entities/Movement';
import { WAREHOUSE_DEFAULT } from '../../utils/constants';

export class MovementRepository {
  /**
   * Crea un nuevo movimiento de inventario
   * @param movementData - Datos del movimiento a crear
   * @returns Movimiento creado
   */
  async create(movementData: CreateMovementDTO): Promise<Movement> {
    try {
      // Obtener el usuario actual de la sesión
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert({
          product_id: movementData.productId,
          user_id: user?.id || null,
          movement_type: movementData.movementType,
          quantity: movementData.quantity,
          quantity_before: movementData.quantityBefore,
          quantity_after: movementData.quantityAfter,
          movement_date: new Date().toISOString(),
          request_reason: movementData.requestReason,
          source_app: movementData.sourceApp,
          warehouse: movementData.warehouse || WAREHOUSE_DEFAULT,
          comments: movementData.comments || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.mapToMovement(data);
    } catch (error) {
      console.error('Error creating movement:', error);
      throw error;
    }
  }

  /**
   * Mapea los datos de Supabase a la entidad Movement
   */
  private mapToMovement(data: any): Movement {
    return {
      id: data.id,
      productId: data.product_id,
      userId: data.user_id,
      movementType: data.movement_type,
      quantity: data.quantity,
      quantityBefore: data.quantity_before,
      quantityAfter: data.quantity_after,
      movementDate: data.movement_date,
      requestReason: data.request_reason,
      sourceApp: data.source_app,
      warehouse: data.warehouse,
      comments: data.comments,
      createdAt: data.created_at,
    };
  }
}

