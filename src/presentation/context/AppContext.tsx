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
  const [themeType, setThemeType] = useState<ThemeType>(DEFAULTS.THEME);
  const [language, setLanguageState] = useState<LanguageType>(DEFAULTS.LANGUAGE);
  const [activeUser, setActiveUserState] = useState<ScannerUser | null>(null);

  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    const loadPreferences = async () => {
      const savedTheme = await LocalStorage.getTheme();
      const savedLanguage = await LocalStorage.getLanguage();
      
      // Solo cargar usuario activo en Android/iOS, NO en web
      // En web, el usuario se resetea al refrescar (F5)
      // En la APK, el usuario persiste al cerrar/abrir la app
      const savedUser = Platform.OS !== 'web' 
        ? await LocalStorage.getActiveUser() 
        : null;

      if (savedTheme) {
        setThemeType(savedTheme);
      }
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
      if (savedUser) {
        setActiveUserState(savedUser);
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

