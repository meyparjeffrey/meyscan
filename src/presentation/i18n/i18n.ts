/**
 * Configuración de i18n (internacionalización)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './translations/es';
import ca from './translations/ca';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      ca: { translation: ca },
    },
    lng: 'ca', // Idioma por defecto: Catalán
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },
    compatibilityJSON: 'v3',
  });

export default i18n;

