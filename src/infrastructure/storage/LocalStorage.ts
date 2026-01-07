/**
 * Servicio de almacenamiento local usando AsyncStorage
 * 
 * Gestiona la persistencia de preferencias de usuario:
 * - Tema (light/dark)
 * - Idioma (ca/es)
 * - Usuario activo seleccionado
 * - Sesión de Supabase (manejada por Supabase)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType } from '../../domain/types/ThemeType';
import { LanguageType } from '../../domain/types/LanguageType';
import { ScannerUser } from '../../domain/entities/ScannerUser';

const STORAGE_KEYS = {
  THEME: '@meyparscan:theme',
  LANGUAGE: '@meyparscan:language',
  ACTIVE_USER: '@meyparscan:active_user',
} as const;

export class LocalStorage {
  /**
   * Guarda el tema seleccionado
   */
  static async saveTheme(theme: ThemeType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  /**
   * Obtiene el tema guardado
   */
  static async getTheme(): Promise<ThemeType | null> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return theme as ThemeType | null;
    } catch (error) {
      console.error('Error getting theme:', error);
      return null;
    }
  }

  /**
   * Guarda el idioma seleccionado
   */
  static async saveLanguage(language: LanguageType): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }

  /**
   * Obtiene el idioma guardado
   */
  static async getLanguage(): Promise<LanguageType | null> {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return language as LanguageType | null;
    } catch (error) {
      console.error('Error getting language:', error);
      return null;
    }
  }

  /**
   * Guarda el usuario activo seleccionado
   */
  static async saveActiveUser(user: ScannerUser | null): Promise<void> {
    try {
      if (user) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    } catch (error) {
      console.error('Error saving active user:', error);
    }
  }

  /**
   * Obtiene el usuario activo guardado
   */
  static async getActiveUser(): Promise<ScannerUser | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (userJson) {
        return JSON.parse(userJson) as ScannerUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting active user:', error);
      return null;
    }
  }

  /**
   * Limpia todos los datos guardados (útil para logout)
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.LANGUAGE,
        STORAGE_KEYS.ACTIVE_USER,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

