/**
 * Colores de la aplicación basados en el logo de Meypar
 * 
 * Colores extraídos del logo:
 * - Rojo principal: #E62144 (rgb(90.19928%, 12.89978%, 26.699829%))
 * - Gris oscuro: #7F7F7F
 * - Gris claro: #020202
 */

export const colors = {
  // Colores del logo
  primary: '#E62144', // Rojo principal de Meypar
  primaryDark: '#C01A35',
  primaryLight: '#FF2D55',
  
  grayDark: '#7F7F7F', // Gris oscuro del logo
  grayLight: '#020202', // Gris claro del logo
  
  // Colores base
  white: '#FFFFFF',
  black: '#000000',
  
  // Colores para tema claro
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#7F7F7F',
    border: '#E0E0E0',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#0284C7',
  },
  
  // Colores para tema oscuro
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

