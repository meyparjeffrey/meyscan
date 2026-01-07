/**
 * Componente LoadingSpinner
 */
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { colors } from '../../theme/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  fullScreen = false,
}) => {
  console.log('[LoadingSpinner] ========================================');
  console.log('[LoadingSpinner] RENDERIZANDO LoadingSpinner');
  console.log('[LoadingSpinner] ========================================');
  console.log('[LoadingSpinner] Props:', { fullScreen, size });
  console.log('[LoadingSpinner] Timestamp:', new Date().toISOString());
  
  // Intentar obtener el tema del contexto, pero usar valores por defecto si falla
  let themeColors;
  try {
    console.log('[LoadingSpinner] Intentando obtener contexto...');
    const { theme } = useAppContext();
    console.log('[LoadingSpinner] Contexto obtenido, tema:', theme.type);
    themeColors = theme.colors;
    console.log('[LoadingSpinner] Tema obtenido del contexto exitosamente');
  } catch (error) {
    // Si el contexto no está disponible, usar colores por defecto
    console.warn('[LoadingSpinner] ⚠️ Contexto no disponible, usando colores por defecto');
    console.warn('[LoadingSpinner] Error:', error);
    console.warn('[LoadingSpinner] Error tipo:', error instanceof Error ? error.constructor.name : typeof error);
    console.warn('[LoadingSpinner] Error mensaje:', error instanceof Error ? error.message : String(error));
    themeColors = {
      background: colors.light.background,
      primary: colors.primary,
    };
    console.log('[LoadingSpinner] Colores por defecto establecidos');
  }
  
  console.log('[LoadingSpinner] Renderizando componente...');

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size={size} color={themeColors.primary} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={themeColors.primary} />;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

