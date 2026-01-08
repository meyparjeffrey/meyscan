/**
 * Modal de Administración (acceso oculto con 5 taps)
 */
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';
import { APP_NAME, SOURCE_APP } from '../../../utils/constants';
import Constants from 'expo-constants';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onClearUser?: () => void; // Opcional para mantener compatibilidad
}

export const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  onClose,
  onLogout,
}) => {
  const { theme } = useAppContext();
  const { session, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('admin.title')}
          </Text>

          {/* Diagnóstico - Fuera del ScrollView para que siempre sea visible */}
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('admin.diagnostics')}
            </Text>
            
            <View style={styles.diagnosticRow}>
              <Text style={[styles.diagnosticLabel, { color: theme.colors.textSecondary }]}>
                {t('admin.version')}:
              </Text>
              <Text style={[styles.diagnosticValue, { color: theme.colors.text }]}>
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>

            <View style={styles.diagnosticRow}>
              <Text style={[styles.diagnosticLabel, { color: theme.colors.textSecondary }]}>
                {t('admin.sessionStatus')}:
              </Text>
              <Text style={[styles.diagnosticValue, { color: isAuthenticated ? theme.colors.success : theme.colors.error }]}>
                {isAuthenticated ? 'OK' : 'Expirada'}
              </Text>
            </View>

            <View style={styles.diagnosticRow}>
              <Text style={[styles.diagnosticLabel, { color: theme.colors.textSecondary }]}>
                Source App:
              </Text>
              <Text style={[styles.diagnosticValue, { color: theme.colors.text }]}>
                {SOURCE_APP}
              </Text>
            </View>
          </View>

          {/* Botón de Cerrar Sesión - Fuera del ScrollView para que siempre sea visible */}
          <Button
            title={t('admin.logout')}
            onPress={onLogout}
            variant="primary"
            style={styles.logoutButton}
          />

          <Button
            title={t('common.cancel')}
            onPress={onClose}
            variant="outline"
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  diagnosticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diagnosticLabel: {
    fontSize: 14,
  },
  diagnosticValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 12,
    minHeight: 56,
  },
  closeButton: {
    minHeight: 56,
  },
});

