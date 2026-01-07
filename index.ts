import { registerRootComponent } from 'expo';
import App from './App';

console.log('[index.ts] ========================================');
console.log('[index.ts] INICIANDO REGISTRO DE COMPONENTE');
console.log('[index.ts] ========================================');
console.log('[index.ts] Timestamp:', new Date().toISOString());

try {
  console.log('[index.ts] Llamando a registerRootComponent(App)...');
  registerRootComponent(App);
  console.log('[index.ts] ✅ registerRootComponent completado');
} catch (error) {
  console.error('[index.ts] ❌ ERROR en registerRootComponent:', error);
  console.error('[index.ts] Error tipo:', error instanceof Error ? error.constructor.name : typeof error);
  console.error('[index.ts] Error mensaje:', error instanceof Error ? error.message : String(error));
  console.error('[index.ts] Error stack:', error instanceof Error ? error.stack : 'No stack');
  throw error;
}
