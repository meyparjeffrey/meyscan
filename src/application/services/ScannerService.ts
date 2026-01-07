/**
 * Servicio de escaneo
 * 
 * Gestiona la lógica de escaneo y búsqueda de productos
 */
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { parseScannedValue } from '../../utils/parseScannedValue';
import { Product } from '../../domain/entities/Product';

export class ScannerService {
  constructor(private productRepository: ProductRepository) {}

  /**
   * Parsea el valor escaneado y extrae el código de búsqueda
   * @param raw - Valor crudo recibido del escáner
   * @returns Objeto con el código de búsqueda y el valor crudo
   */
  parseScannedValue(raw: string): { lookupKey: string; raw: string } {
    return parseScannedValue(raw);
  }

  /**
   * Busca un producto por código o código de barras
   * @param code - Código o código de barras escaneado
   * @returns Producto encontrado o null
   */
  async findProductByCode(code: string): Promise<Product | null> {
    if (!code || code.trim() === '') {
      return null;
    }

    try {
      const product = await this.productRepository.findByCodeOrBarcode(code.trim());
      return product;
    } catch (error) {
      console.error('Error finding product:', error);
      return null;
    }
  }

  /**
   * Procesa un código escaneado completo:
   * 1. Parsea el valor escaneado
   * 2. Busca el producto
   * @param scannedValue - Valor crudo escaneado
   * @returns Objeto con el producto encontrado (o null) y el código parseado
   */
  async processScannedCode(scannedValue: string): Promise<{
    product: Product | null;
    lookupKey: string;
    raw: string;
  }> {
    const { lookupKey, raw } = this.parseScannedValue(scannedValue);
    const product = await this.findProductByCode(lookupKey);

    return {
      product,
      lookupKey,
      raw,
    };
  }
}

