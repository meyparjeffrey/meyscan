/**
 * Contexto global de la aplicación
 * 
 * Gestiona el estado global compartido:
 * - Tema (light/dark)
 * - Idioma (ca/es)
 * - Usuario activo seleccionado
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { ThemeType } from '../../domain/types/ThemeType';
import { LanguageType } from '../../domain/types/LanguageType';
import { ScannerUser } from '../../domain/entities/ScannerUser';
import { LocalStorage } from '../../infrastructure/storage/LocalStorage';
import { DEFAULTS } from '../../utils/constants';
import { createTheme, Theme } from '../theme/theme';
import i18n from '../i18n/i18n';

interface AppContextType {
  theme: Theme;
  themeType: ThemeType;
  language: LanguageType;
  activeUser: ScannerUser | null;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: LanguageType) => void;
  setActiveUser: (user: ScannerUser | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  console.log('[AppProvider] ========================================');
  console.log('[AppProvider] INICIALIZANDO PROVIDER');
  console.log('[AppProvider] ========================================');
  
  const [themeType, setThemeType] = useState<ThemeType>(DEFAULTS.THEME);
  const [language, setLanguageState] = useState<LanguageType>(DEFAULTS.LANGUAGE);
  const [activeUser, setActiveUserState] = useState<ScannerUser | null>(null);

  console.log('[AppProvider] Estado inicial:', { themeType, language, activeUser: activeUser ? 'Sí' : 'No' });

  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    console.log('[AppProvider] useEffect ejecutado, cargando preferencias...');
    const loadPreferences = async () => {
      try {
        console.log('[AppProvider] Iniciando carga de preferencias...');
        console.log('[AppProvider] Platform.OS:', Platform.OS);
        
        console.log('[AppProvider] Cargando tema...');
        const savedTheme = await LocalStorage.getTheme();
        console.log('[AppProvider] Tema cargado:', savedTheme);
        
        console.log('[AppProvider] Cargando idioma...');
        const savedLanguage = await LocalStorage.getLanguage();
        console.log('[AppProvider] Idioma cargado:', savedLanguage);
        
        // Solo cargar usuario activo en Android/iOS, NO en web
        // En web, el usuario se resetea al refrescar (F5)
        // En la APK, el usuario persiste al cerrar/abrir la app
        console.log('[AppProvider] Cargando usuario activo...');
        const savedUser = Platform.OS !== 'web' 
          ? await LocalStorage.getActiveUser() 
          : null;
        console.log('[AppProvider] Usuario cargado:', savedUser ? savedUser.displayName : 'No');

        if (savedTheme) {
          console.log('[AppContext] Aplicando tema:', savedTheme);
          setThemeType(savedTheme);
        }
        if (savedLanguage) {
          console.log('[AppContext] Aplicando idioma:', savedLanguage);
          setLanguageState(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
        if (savedUser) {
          console.log('[AppContext] Aplicando usuario:', savedUser.displayName);
          setActiveUserState(savedUser);
        }
        console.log('[AppContext] ✅ Preferencias cargadas correctamente');
      } catch (error) {
        console.error('[AppContext] ❌ Error al cargar preferencias:', error);
        console.error('[AppContext] Error stack:', error instanceof Error ? error.stack : 'No stack');
        // Continuar con valores por defecto si hay error
      }
    };

    loadPreferences();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeType(newTheme);
    await LocalStorage.saveTheme(newTheme);
  };

  const setLanguage = async (newLanguage: LanguageType) => {
    setLanguageState(newLanguage);
    i18n.changeLanguage(newLanguage);
    await LocalStorage.saveLanguage(newLanguage);
  };

  const setActiveUser = async (user: ScannerUser | null) => {
    setActiveUserState(user);
    // Solo guardar usuario activo en Android/iOS, NO en web
    // En web, el usuario se resetea al refrescar (F5)
    // En la APK, el usuario persiste al cerrar/abrir la app
    if (Platform.OS !== 'web') {
      await LocalStorage.saveActiveUser(user);
    }
  };

  const theme = createTheme(themeType);

  const value: AppContextType = {
    theme,
    themeType,
    language,
    activeUser,
    setTheme,
    setLanguage,
    setActiveUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook para acceder al contexto de la aplicación
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

