/**
 * Entidad de dominio: ScannerUser
 * Representa un usuario/operario del escáner (no es usuario de Supabase Auth)
 */
export interface ScannerUser {
  id: string;
  displayName: string;
  enabled: boolean;
  notes: string | null;
  lastSeenAt: string | null;
  lastSeenDevice: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para actualizar last_seen de un usuario escáner
 */
export interface UpdateScannerUserLastSeenDTO {
  lastSeenAt: string;
  lastSeenDevice: string;
}

