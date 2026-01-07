/**
 * Configuración de i18n (internacionalización)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslations from './translations/es';
import caTranslations from './translations/ca';

// Validar que las traducciones existan con manejo de errores detallado
let es: any = {};
let ca: any = {};

try {
  console.log('[i18n] Importando traducciones es...');
  es = esTranslations || {};
  console.log('[i18n] Traducciones es importadas:', {
    type: typeof es,
    isObject: typeof es === 'object',
    keys: es ? Object.keys(es).slice(0, 5) : [],
    hasDefault: 'default' in (esTranslations as any),
  });
} catch (esError) {
  console.error('[i18n] ❌ Error al importar es:', esError);
  console.error('[i18n] Error tipo:', esError instanceof Error ? esError.constructor.name : typeof esError);
  console.error('[i18n] Error mensaje:', esError instanceof Error ? esError.message : String(esError));
  console.error('[i18n] Error stack:', esError instanceof Error ? esError.stack : 'No stack');
  es = {};
}

try {
  console.log('[i18n] Importando traducciones ca...');
  ca = caTranslations || {};
  console.log('[i18n] Traducciones ca importadas:', {
    type: typeof ca,
    isObject: typeof ca === 'object',
    keys: ca ? Object.keys(ca).slice(0, 5) : [],
    hasDefault: 'default' in (caTranslations as any),
  });
} catch (caError) {
  console.error('[i18n] ❌ Error al importar ca:', caError);
  console.error('[i18n] Error tipo:', caError instanceof Error ? caError.constructor.name : typeof caError);
  console.error('[i18n] Error mensaje:', caError instanceof Error ? caError.message : String(caError));
  console.error('[i18n] Error stack:', caError instanceof Error ? caError.stack : 'No stack');
  ca = {};
}

console.log('[i18n] Cargando traducciones...', {
  esLoaded: !!es && Object.keys(es).length > 0,
  caLoaded: !!ca && Object.keys(ca).length > 0,
  esKeys: es ? Object.keys(es).slice(0, 5) : [],
  caKeys: ca ? Object.keys(ca).slice(0, 5) : [],
});

// Nota: No podemos sobrescribir i18n.t aquí porque aún no está inicializado
// El manejo de errores se hará en un hook personalizado

// Validar estructura de traducciones antes de inicializar
const validateTranslations = (translations: any, name: string): boolean => {
  if (!translations || typeof translations !== 'object') {
    console.error(`[i18n] ${name} no es un objeto válido:`, translations);
    return false;
  }
  
  // Verificar que tenga las claves esperadas
  const expectedKeys = ['common', 'login', 'home', 'scanner', 'camera', 'userPicker', 'admin'];
  const hasKeys = expectedKeys.every(key => key in translations);
  
  if (!hasKeys) {
    console.warn(`[i18n] ${name} no tiene todas las claves esperadas`);
  }
  
  return true;
};

const esValid = validateTranslations(es, 'es');
const caValid = validateTranslations(ca, 'ca');

if (!esValid || !caValid) {
  console.error('[i18n] ❌ Traducciones inválidas, usando objetos vacíos');
}

// Asegurar que las traducciones sean objetos planos sin propiedades especiales
const flattenTranslations = (obj: any): any => {
  if (obj && typeof obj === 'object') {
    // Crear un nuevo objeto sin propiedades especiales
    const flattened: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        flattened[key] = obj[key];
      }
    }
    return flattened;
  }
  return obj;
};

const esFlat = flattenTranslations(esValid ? es : {});
const caFlat = flattenTranslations(caValid ? ca : {});

try {
  console.log('[i18n] Preparando inicialización...');
  console.log('[i18n] Verificando initReactI18next:', typeof initReactI18next);
  console.log('[i18n] Verificando i18n:', typeof i18n);
  
  // Inicializar i18n de forma síncrona y esperar a que esté listo
  console.log('[i18n] Llamando a i18n.use(initReactI18next)...');
  let initPromise;
  try {
    initPromise = i18n.use(initReactI18next);
    console.log('[i18n] i18n.use() exitoso');
  } catch (useError) {
    console.error('[i18n] ❌ Error en i18n.use():', useError);
    console.error('[i18n] Error tipo:', useError instanceof Error ? useError.constructor.name : typeof useError);
    console.error('[i18n] Error mensaje:', useError instanceof Error ? useError.message : String(useError));
    console.error('[i18n] Error stack:', useError instanceof Error ? useError.stack : 'No stack');
    throw useError;
  }
  
  console.log('[i18n] Llamando a .init()...');
  try {
    initPromise = initPromise.init({
      resources: {
        es: { translation: esFlat },
        ca: { translation: caFlat },
      },
      lng: 'ca', // Idioma por defecto: Catalán
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false, // React ya escapa los valores
      },
      compatibilityJSON: 'v3',
      react: {
        useSuspense: false, // Desactivar Suspense para evitar problemas
      },
      returnNull: false, // No devolver null si falta traducción
      returnEmptyString: false, // No devolver string vacío
      returnObjects: false, // No devolver objetos
      // Desactivar completamente el modo Suspense
      nsMode: 'fallback',
      missingKeyHandler: (lng, ns, key) => {
        console.warn(`[i18n] Traducción faltante: ${key} en ${lng}`);
        return key; // Devolver la clave como fallback
      },
      parseMissingKeyHandler: (key: string) => {
        console.warn(`[i18n] Clave de traducción no encontrada: ${key}`);
        return key;
      },
    });
    console.log('[i18n] .init() llamado exitosamente');
  } catch (initCallError) {
    console.error('[i18n] ❌ Error al llamar .init():', initCallError);
    console.error('[i18n] Error tipo:', initCallError instanceof Error ? initCallError.constructor.name : typeof initCallError);
    console.error('[i18n] Error mensaje:', initCallError instanceof Error ? initCallError.message : String(initCallError));
    console.error('[i18n] Error stack:', initCallError instanceof Error ? initCallError.stack : 'No stack');
    throw initCallError;
  }
  
  // Esperar a que la inicialización se complete
  initPromise.then(() => {
    console.log('[i18n] ✅ Inicializado correctamente');
    // @ts-ignore
    i18n.isInitialized = true;
  }).catch((initError: any) => {
    console.error('[i18n] ❌ Error en promesa de inicialización:', initError);
  });
  
} catch (error) {
  console.error('[i18n] ❌ Error al inicializar:', error);
  console.error('[i18n] Error stack:', error instanceof Error ? error.stack : 'No stack');
  // Inicializar con recursos vacíos para evitar crash
  try {
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          es: { translation: {} },
          ca: { translation: {} },
        },
        lng: 'ca',
        fallbackLng: 'es',
        interpolation: {
          escapeValue: false,
        },
        compatibilityJSON: 'v3',
        react: {
          useSuspense: false,
        },
        returnNull: false,
        returnEmptyString: false,
        returnObjects: false,
      });
    console.log('[i18n] Inicializado con recursos vacíos (fallback)');
  } catch (fallbackError) {
    console.error('[i18n] Error crítico al inicializar fallback:', fallbackError);
  }
}

export default i18n;

