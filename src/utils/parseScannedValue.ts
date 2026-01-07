/**
 * Parsea un valor escaneado y extrae el código de búsqueda
 * 
 * Maneja diferentes formatos:
 * - Código directo: "CODE123"
 * - QR con separador: "CODE123|Nombre Producto"
 * - Códigos con separadores especiales (GS/FS/RS/US)
 * 
 * @param raw - Valor crudo recibido del escáner
 * @returns Objeto con el código de búsqueda y el valor crudo
 * 
 * @example
 * parseScannedValue('CODE123|Nombre Producto')
 * // Returns: { lookupKey: 'CODE123', raw: 'CODE123|Nombre Producto' }
 */
export function parseScannedValue(raw: string): { lookupKey: string; raw: string } {
  if (!raw || typeof raw !== 'string') {
    return { lookupKey: '', raw: raw || '' };
  }

  // Limpiar espacios al inicio y final
  const cleaned = raw.trim();

  // Si viene en formato CODE|NOMBRE, extraer solo el código
  // Separadores comunes: |, \t, GS (0x1D), FS (0x1C), RS (0x1E), US (0x1F)
  const separators = ['|', '\t', '\x1D', '\x1C', '\x1E', '\x1F'];
  
  let lookupKey = cleaned;
  
  for (const separator of separators) {
    if (cleaned.includes(separator)) {
      lookupKey = cleaned.split(separator)[0].trim();
      break;
    }
  }

  // Limpiar caracteres de control adicionales
  lookupKey = lookupKey.replace(/[\x00-\x1F\x7F]/g, '').trim();

  return {
    lookupKey,
    raw: cleaned,
  };
}

