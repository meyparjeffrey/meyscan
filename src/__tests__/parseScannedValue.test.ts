/**
 * Tests unitarios para parseScannedValue
 */
import { parseScannedValue } from '../utils/parseScannedValue';

describe('parseScannedValue', () => {
  it('debe extraer código de formato CODE|NOMBRE', () => {
    const result = parseScannedValue('CODE123|Nombre Producto');
    expect(result.lookupKey).toBe('CODE123');
    expect(result.raw).toBe('CODE123|Nombre Producto');
  });

  it('debe manejar códigos directos', () => {
    const result = parseScannedValue('CODE123');
    expect(result.lookupKey).toBe('CODE123');
    expect(result.raw).toBe('CODE123');
  });

  it('debe manejar separadores tab', () => {
    const result = parseScannedValue('CODE123\tNombre');
    expect(result.lookupKey).toBe('CODE123');
  });

  it('debe limpiar espacios', () => {
    const result = parseScannedValue('  CODE123  ');
    expect(result.lookupKey).toBe('CODE123');
  });
});
