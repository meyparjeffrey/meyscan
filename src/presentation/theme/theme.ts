/**
 * Configuración del tema de la aplicación
 */
import { ThemeType } from '../../domain/types/ThemeType';
import { colors } from './colors';

export interface Theme {
  type: ThemeType;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    grayDark: string;
    grayLight: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    white: string;
    black: string;
  };
}

/**
 * Crea un tema basado en el tipo (light/dark)
 */
export function createTheme(type: ThemeType): Theme {
  const baseColors = type === 'light' ? colors.light : colors.dark;
  
  return {
    type,
    colors: {
      primary: colors.primary,
      primaryDark: colors.primaryDark,
      primaryLight: colors.primaryLight,
      grayDark: colors.grayDark,
      grayLight: colors.grayLight,
      white: colors.white,
      black: colors.black,
      ...baseColors,
    },
  };
}

/**
 * Tema claro por defecto
 */
export const lightTheme = createTheme('light');

/**
 * Tema oscuro
 */
export const darkTheme = createTheme('dark');

