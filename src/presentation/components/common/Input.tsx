/**
 * Componente Input reutilizable
 */
import React, { useState } from 'react';
import { TextInput, Text, StyleSheet, View, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean; // Para mostrar/ocultar contraseña
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}) => {
  const { theme } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = showPasswordToggle && secureTextEntry;
  const finalSecureTextEntry = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: error ? theme.colors.error : theme.colors.border,
              paddingRight: isPassword ? 50 : 20, // Espacio para el icono
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={finalSecureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Text style={[styles.passwordToggleText, { color: theme.colors.textSecondary }]}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16, // Aumentado para mejor legibilidad
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 64, // Aumentado para pantallas táctiles
    minHeight: 64,
    borderWidth: 2, // Borde más visible
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18, // Texto más grande
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    minHeight: 64,
  },
  passwordToggleText: {
    fontSize: 24, // Icono grande y visible
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

