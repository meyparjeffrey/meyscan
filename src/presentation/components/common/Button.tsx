/**
 * Componente Button reutilizable
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useAppContext } from '../../context/AppContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useAppContext();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 64, // Aumentado para pantallas táctiles de 5 pulgadas
    };

    if (variant === 'primary') {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
      };
    } else if (variant === 'secondary') {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      };
    }
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'primary') {
      return { color: theme.colors.white };
    } else if (variant === 'secondary') {
      return { color: theme.colors.text };
    } else {
      return { color: theme.colors.primary };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.white : theme.colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18, // Aumentado para mejor legibilidad en pantallas pequeñas
    fontWeight: '600',
  },
});

