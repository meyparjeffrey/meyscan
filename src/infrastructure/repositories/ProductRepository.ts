/**
 * Repositorio para operaciones con productos en Supabase
 */
import { supabase } from '../supabase/supabaseClient';
import { Product } from '../../domain/entities/Product';

export class ProductRepository {
  /**
   * Busca un producto por código exacto
   * @param code - Código del producto
   * @returns Producto encontrado o null
   */
  async findByCode(code: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No encontrado
          return null;
        }
        throw error;
      }

      return this.mapToProduct(data);
    } catch (error) {
      console.error('Error finding product by code:', error);
      return null;
    }
  }

  /**
   * Busca un producto por código de barras exacto
   * @param barcode - Código de barras del producto
   * @returns Producto encontrado o null
   */
  async findByBarcode(barcode: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No encontrado
          return null;
        }
        throw error;
      }

      return this.mapToProduct(data);
    } catch (error) {
      console.error('Error finding product by barcode:', error);
      return null;
    }
  }

  /**
   * Busca un producto por ID
   * @param id - ID del producto
   * @returns Producto encontrado o null
   */
  async findById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return this.mapToProduct(data);
    } catch (error) {
      console.error('Error finding product by id:', error);
      return null;
    }
  }

  /**
   * Busca un producto por código o código de barras (dos queries exactas)
   * Primero intenta por código, luego por código de barras
   * @param lookupKey - Código o código de barras a buscar
   * @returns Producto encontrado o null
   */
  async findByCodeOrBarcode(lookupKey: string): Promise<Product | null> {
    // Primero intentar por código
    const byCode = await this.findByCode(lookupKey);
    if (byCode) {
      return byCode;
    }

    // Si no se encuentra, intentar por código de barras
    return await this.findByBarcode(lookupKey);
  }

  /**
   * Búsqueda avanzada de productos por nombre o código (filtro parcial)
   * Sin límite de resultados para permitir scroll infinito
   * @param searchTerm - Término de búsqueda (nombre o código)
   * @returns Lista de productos que coinciden (sin límite)
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
      }

      const term = searchTerm.trim().toLowerCase();

      // Sin límite para permitir ver todos los productos con scroll
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${term}%,code.ilike.%${term}%,barcode.ilike.%${term}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching products:', error);
        return [];
      }

      return (data || []).map(item => this.mapToProduct(item));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Actualiza el stock actual de un producto
   * @param productId - ID del producto
   * @param newStock - Nuevo valor de stock
   */
  async updateStock(productId: string, newStock: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_current: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  /**
   * Mapea los datos de Supabase a la entidad Product
   */
  private mapToProduct(data: any): Product {
    return {
      id: data.id,
      code: data.code,
      barcode: data.barcode,
      name: data.name,
      description: data.description,
      stockCurrent: data.stock_current,
      stockMin: data.stock_min,
      stockMax: data.stock_max,
      aisle: data.aisle,
      shelf: data.shelf,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

