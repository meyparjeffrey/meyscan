/**
 * Modal de Éxito - Diseño Profesional y Moderno
 * 
 * Muestra mensajes de éxito con animación suave y botón de aceptar
 */
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onAccept: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  message,
  onAccept,
}) => {
  const { theme } = useAppContext();
  const { t } = useTranslation();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isSmallHeight = screenHeight < 500;
  const isMobileHorizontal = screenWidth > screenHeight && screenHeight < 500;

  // Log para depuración
  React.useEffect(() => {
    if (visible) {
      console.log('[SuccessModal] ✅ Modal visible=true, renderizando...');
      console.log('[SuccessModal] Título:', title);
      console.log('[SuccessModal] Mensaje:', message);
    } else {
      console.log('[SuccessModal] Modal visible=false');
    }
  }, [visible, title, message]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onAccept}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.surface,
              maxWidth: isMobileHorizontal ? screenWidth * 0.8 : 400,
              padding: isSmallHeight ? 20 : 32,
            },
            Platform.OS === 'web' ? {
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
            } : {
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
          ]}
        >
          {/* Icono de éxito */}
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>

          {/* Título */}
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: isSmallHeight ? 22 : 26,
                marginTop: isSmallHeight ? 16 : 24,
              },
            ]}
          >
            {title}
          </Text>

          {/* Mensaje opcional */}
          {message && (
            <Text
              style={[
                styles.message,
                {
                  color: theme.colors.textSecondary,
                  fontSize: isSmallHeight ? 14 : 16,
                  marginTop: isSmallHeight ? 8 : 12,
                },
              ]}
            >
              {message}
            </Text>
          )}

          {/* Botón Aceptar */}
          <TouchableOpacity
            style={[
              styles.acceptButton,
              {
                backgroundColor: '#4CAF50',
                marginTop: isSmallHeight ? 20 : 28,
                paddingVertical: isSmallHeight ? 14 : 16,
                minHeight: isSmallHeight ? 52 : 56,
              },
            ]}
            onPress={onAccept}
            activeOpacity={0.8}
          >
            <Text style={[styles.acceptButtonText, { fontSize: isSmallHeight ? 18 : 20 }]}>
              {t('common.accept')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 48,
    color: '#2E7D32',
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  acceptButton: {
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 8px rgba(76, 175, 80, 0.3)',
    } : {
      elevation: 4,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    }),
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
