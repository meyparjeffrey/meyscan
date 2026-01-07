/**
 * Repositorio para operaciones con usuarios escáner en Supabase
 */
import { supabase } from '../supabase/supabaseClient';
import { ScannerUser, UpdateScannerUserLastSeenDTO } from '../../domain/entities/ScannerUser';

export class ScannerUsersRepository {
  /**
   * Obtiene todos los usuarios escáner habilitados
   * @returns Lista de usuarios escáner habilitados
   */
  async findAllEnabled(): Promise<ScannerUser[]> {
    try {
      const { data, error } = await supabase
        .from('scanner_users')
        .select('*')
        .eq('enabled', true)
        .order('display_name', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map(this.mapToScannerUser);
    } catch (error) {
      console.error('Error finding scanner users:', error);
      throw error;
    }
  }

  /**
   * Actualiza los campos last_seen de un usuario escáner
   * @param userId - ID del usuario escáner
   * @param updateData - Datos a actualizar
   */
  async updateLastSeen(
    userId: string,
    updateData: UpdateScannerUserLastSeenDTO
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('scanner_users')
        .update({
          last_seen_at: updateData.lastSeenAt,
          last_seen_device: updateData.lastSeenDevice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating scanner user last seen:', error);
      throw error;
    }
  }

  /**
   * Mapea los datos de Supabase a la entidad ScannerUser
   */
  private mapToScannerUser(data: any): ScannerUser {
    return {
      id: data.id,
      displayName: data.display_name,
      enabled: data.enabled,
      notes: data.notes,
      lastSeenAt: data.last_seen_at,
      lastSeenDevice: data.last_seen_device,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

