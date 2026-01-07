/**
 * Componente para escaneo HID/Teclado (Newland)
 * 
 * El escáner Newland funciona como un teclado virtual,
 * por lo que capturamos el input desde un TextInput
 */
import React, { useRef, useEffect, useState } from 'react';
import { TextInput, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

interface HIDScannerProps {
  onScan: (value: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export const HIDScanner: React.FC<HIDScannerProps> = ({
  onScan,
  autoFocus = true,
  style,
}) => {
  const { theme } = useAppContext();
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Enfocar automáticamente al montar
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleChangeText = (text: string) => {
    setValue(text);
    
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // En web, procesar cuando se presiona Enter o después de un delay
    // En dispositivos físicos, procesar inmediatamente cuando hay Enter
    if (text.includes('\n')) {
      // Enter detectado - procesar inmediatamente
      const cleaned = text.replace(/\n/g, '').trim();
      if (cleaned) {
        onScan(cleaned);
        setValue('');
      }
    } else if (Platform.OS === 'web') {
      // En web, permitir escribir libremente y procesar con Enter o timeout
      // No procesar automáticamente mientras se escribe
    } else {
      // En dispositivos físicos (Newland), procesar después de un breve delay
      // para capturar el código completo del escáner
      timeoutRef.current = setTimeout(() => {
        const cleaned = text.trim();
        if (cleaned && cleaned.length > 0) {
          onScan(cleaned);
          setValue('');
        }
      }, 500); // 500ms de delay para capturar código completo
    }
  };

  const handleSubmitEditing = () => {
    // Procesar cuando se presiona Enter
    const cleaned = value.trim();
    if (cleaned) {
      onScan(cleaned);
      setValue('');
    }
  };

  return (
    <TextInput
      ref={inputRef}
      value={value}
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      placeholder={t('scanner.scanCode')}
      placeholderTextColor={theme.colors.textSecondary}
      onChangeText={handleChangeText}
      onSubmitEditing={handleSubmitEditing}
      autoFocus={autoFocus}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="done"
      blurOnSubmit={false}
      editable={true}
      // Mantener foco permanente solo en dispositivos físicos
      onBlur={() => {
        // Re-enfocar inmediatamente si pierde el foco (solo en dispositivos físicos)
        // En web, permitir que el usuario controle el foco
        if (Platform.OS !== 'web') {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
  },
});

