/**
 * Entidad de dominio: Product
 * Representa un producto en el inventario
 */
export interface Product {
  id: string;
  code: string;
  barcode: string | null;
  name: string;
  description: string | null;
  stockCurrent: number;
  stockMin: number;
  stockMax: number | null;
  aisle: string;
  shelf: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear un producto (no usado en APK, solo para referencia)
 */
export interface CreateProductDTO {
  code: string;
  barcode?: string;
  name: string;
  description?: string;
  stockCurrent?: number;
  stockMin?: number;
  stockMax?: number;
  aisle: string;
  shelf: string;
}

