/**
 * Modal para seleccionar usuario/operario
 */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { ScannerUsersRepository } from '../../../infrastructure/repositories/ScannerUsersRepository';
import { ScannerUser } from '../../../domain/entities/ScannerUser';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';

interface UserPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: ScannerUser) => void;
}

export const UserPickerModal: React.FC<UserPickerModalProps> = ({
  visible,
  onClose,
  onSelectUser,
}) => {
  const { theme } = useAppContext();
  const { t } = useTranslation();
  const [users, setUsers] = useState<ScannerUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ScannerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const repository = new ScannerUsersRepository();

  useEffect(() => {
    if (visible) {
      loadUsers();
    } else {
      setSearchQuery('');
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter((user) =>
          user.displayName.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      console.log('[UserPickerModal] Iniciando carga de usuarios...');
      setLoading(true);
      setError(null);
      const allUsers = await repository.findAllEnabled();
      console.log('[UserPickerModal] Usuarios recibidos del repo:', allUsers.length);
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (err) {
      console.error('[UserPickerModal] ❌ Error en loadUsers:', err);
      setError(t('userPicker.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: ScannerUser) => {
    onSelectUser(user);
  };

  const renderUserItem = ({ item }: { item: ScannerUser }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => handleSelectUser(item)}
      activeOpacity={0.7}
    >
      <Text style={[styles.userName, { color: theme.colors.text }]}>
        {item.displayName}
      </Text>
      {item.notes && (
        <Text style={[styles.userNotes, { color: theme.colors.textSecondary }]}>
          {item.notes}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('userPicker.title')}
          </Text>

          {/* Búsqueda */}
          {users.length > 5 && (
            <TextInput
              style={[
                styles.searchInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder={t('userPicker.search')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          )}

          {/* Lista de usuarios */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
              <Button title={t('common.retry')} onPress={loadUsers} variant="primary" />
            </View>
          ) : filteredUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {t('userPicker.noUsers')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Botón Cancelar */}
          <Button
            title={t('common.cancel')}
            onPress={onClose}
            variant="secondary"
            style={styles.cancelButton}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '95%',
    maxWidth: 500,
    height: '85%', // Altura fija para evitar que colapse a 0
    borderRadius: 16,
    padding: 20,
    elevation: 5, // Sombra para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 64, // Aumentado para pantallas táctiles
    minHeight: 64,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 18, // Texto más grande
    marginBottom: 20,
  },
  list: {
    width: '100%',
    flexGrow: 1, // Asegurar que crezca para ocupar espacio
    minHeight: 200, // Altura mínima garantizada
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  userItem: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    minHeight: 64, // Aumentado para pantallas táctiles
  },
  userName: {
    fontSize: 20, // Aumentado para mejor legibilidad
    fontWeight: '600',
  },
  userNotes: {
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    minHeight: 56,
  },
});

