/**
 * Hook para gestión de escaneo
 */
import { useState, useCallback } from 'react';
import { ScannerService } from '../../application/services/ScannerService';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { Product } from '../../domain/entities/Product';

const productRepository = new ProductRepository();
const scannerService = new ScannerService(productRepository);

export function useScanner() {
  const [scannedCode, setScannedCode] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processScannedCode = useCallback(async (rawValue: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await scannerService.processScannedCode(rawValue);
      
      // Guardar el lookupKey parseado (no el raw)
      setScannedCode(result.lookupKey);
      setProduct(result.product);

      if (!result.product) {
        setError('Producto no encontrado');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar código';
      setError(errorMessage);
      setProduct(null);
      setScannedCode('');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setScannedCode('');
    setProduct(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    scannedCode,
    product,
    loading,
    error,
    processScannedCode,
    clear,
  };
}

