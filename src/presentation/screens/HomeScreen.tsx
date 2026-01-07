/**
 * Pantalla Home (Principal)
 * 
 * Muestra logo, selectores de idioma/tema, y botón para seleccionar usuario
 */
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { UserPickerModal } from '../components/modals/UserPickerModal';
import { AdminModal } from '../components/modals/AdminModal';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ADMIN_TAPS_REQUIRED, ADMIN_TAPS_TIMEOUT_MS } from '../../utils/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, themeType, language, activeUser, setTheme, setLanguage, setActiveUser } = useAppContext();
  const { t } = useTranslation();
  const { logout } = useAuth();
  
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener dimensiones de la pantalla para responsive
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isSmallScreen = screenWidth < 400;
  const isNewlandSize = screenWidth >= 500 && screenWidth < 800; // Ajustado rango Newland
  const isSmallHeight = screenHeight < 500;
  const isMobileVertical = screenHeight > screenWidth && screenWidth < 500;
  const isMobileHorizontal = screenWidth > screenHeight && screenHeight < 500;
  
  // Tamaño dinámico del logo basado en la altura de la pantalla
  const getLogoSize = () => {
    if (screenHeight < 400) return 'small';
    if (screenHeight < 600) return 'medium';
    return 'large';
  };
  
  // Sistema de espaciado basado en 8px (8-point grid system)
  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const handleLogoPress = () => {
    tapCountRef.current += 1;

    // Limpiar timer anterior
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    // Si alcanza el número requerido, abrir admin
    if (tapCountRef.current >= ADMIN_TAPS_REQUIRED) {
      setShowAdmin(true);
      tapCountRef.current = 0;
      return;
    }

    // Resetear contador después del timeout
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, ADMIN_TAPS_TIMEOUT_MS);
  };

  const handleStartScanning = () => {
    if (activeUser) {
      navigation.navigate('Scanner');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[HomeScreen] Iniciando logout...');
      await logout();
      console.log('[HomeScreen] Logout exitoso, limpiando estado...');
      setActiveUser(null);
      setShowAdmin(false);
      // Navegar explícitamente a Login después del logout
      navigation.replace('Login');
    } catch (error) {
      console.error('[HomeScreen] Error durante logout:', error);
      // Aún así, intentar navegar a Login
      setActiveUser(null);
      setShowAdmin(false);
      navigation.replace('Login');
    }
  };

  // Estilos dinámicos basados en el tamaño de pantalla
  const dynamicStyles = {
    scrollContent: {
      flex: 1,
      paddingHorizontal: isSmallScreen ? spacing.md : isMobileHorizontal ? spacing.sm : isNewlandSize ? spacing.lg : spacing.md,
      paddingTop: isSmallHeight ? spacing.sm : spacing.md,
      paddingBottom: spacing.sm, 
      alignItems: 'center' as const,
      justifyContent: 'center' as const, // Siempre centrado para aprovechar mejor el espacio
    },
    logoContainer: {
      marginBottom: isSmallHeight ? spacing.sm : spacing.md,
      paddingHorizontal: isSmallScreen ? spacing.sm : spacing.md,
      alignItems: 'center' as const,
      flexShrink: 0,
      width: '100%',
    },
    appName: {
      fontSize: isSmallHeight ? 18 : isSmallScreen ? 20 : isNewlandSize ? 28 : 24,
      fontWeight: '700' as const,
      letterSpacing: 1,
      marginTop: isSmallHeight ? 4 : 8,
      textAlign: 'center' as const,
      color: theme.colors.text,
    },
    selectorsContainer: {
      width: '100%',
      maxWidth: isSmallScreen ? '100%' : isMobileHorizontal ? '95%' : isNewlandSize ? 600 : 500,
      marginBottom: isSmallHeight ? spacing.sm : spacing.lg,
      flexShrink: 1, // Permitir que se encoja un poco si es necesario
    },
    selectorRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: isSmallHeight ? spacing.xs : spacing.md,
    },
    selectorLabel: {
      flex: 1,
      fontSize: isSmallHeight ? 14 : isSmallScreen ? 16 : 18,
      fontWeight: '600' as const,
    },
    selectorButtons: {
      flexDirection: 'row' as const,
      gap: isSmallHeight ? 4 : 8,
    },
    selectorButton: {
      paddingVertical: isSmallHeight ? 8 : 12,
      paddingHorizontal: isSmallHeight ? 12 : 20,
      borderRadius: 12,
      borderWidth: 2,
      minWidth: isSmallHeight ? 60 : 80,
      minHeight: isSmallHeight ? 40 : 48,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    selectorButtonText: {
      fontSize: isSmallHeight ? 14 : 16,
      fontWeight: '600' as const,
    },
    userButton: {
      width: '100%',
      maxWidth: isSmallScreen ? '100%' : isMobileHorizontal ? '95%' : isNewlandSize ? 600 : 500,
      marginBottom: isSmallHeight ? spacing.xs : spacing.md,
      minHeight: isSmallHeight ? 48 : 64,
      flexShrink: 0,
    },
    userButtonText: {
      fontSize: isSmallHeight ? 18 : 22,
      fontWeight: '700' as const,
    },
    currentUserContainer: {
      width: '100%',
      maxWidth: isSmallScreen ? '100%' : isNewlandSize ? 600 : 500,
      padding: isSmallHeight ? spacing.xs : spacing.md,
      borderRadius: 8,
      marginBottom: isSmallHeight ? spacing.xs : spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexShrink: 0,
    },
    currentUserLabel: {
      fontSize: isSmallHeight ? 12 : 14,
      marginBottom: 2,
      fontWeight: '500' as const,
    },
    currentUserName: {
      fontSize: isSmallHeight ? 16 : 18,
      fontWeight: '600' as const,
    },
    startButton: {
      width: '100%',
      maxWidth: isSmallScreen ? '100%' : isNewlandSize ? 600 : 500,
      minHeight: isSmallHeight ? 48 : 64,
      flexShrink: 0,
    },
    message: {
      fontSize: isSmallHeight ? 14 : 16,
      textAlign: 'center' as const,
      marginTop: isSmallHeight ? spacing.xs : spacing.md,
      flexShrink: 0,
      paddingHorizontal: spacing.sm,
      width: '100%',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View 
        style={[
          dynamicStyles.scrollContent, 
          { backgroundColor: theme.colors.background },
          isMobileHorizontal && { justifyContent: 'center' as const } // Centrar en horizontal
        ]}
      >
        {/* Logo grande con gesto oculto */}
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.7}
          style={dynamicStyles.logoContainer}
        >
          <Logo size={getLogoSize()} />
          <Text style={dynamicStyles.appName}>MEYPAR SCAN</Text>
        </TouchableOpacity>

        {/* Selectores de Idioma y Tema */}
        <View style={dynamicStyles.selectorsContainer}>
          {/* Selector de Idioma */}
          <View style={dynamicStyles.selectorRow}>
            <Text style={[dynamicStyles.selectorLabel, { color: theme.colors.text }]}>
              {language === 'ca' ? 'Idioma: CA' : 'Idioma: ES'}
            </Text>
            <View style={dynamicStyles.selectorButtons}>
              <TouchableOpacity
                style={[
                  dynamicStyles.selectorButton,
                  language === 'ca' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setLanguage('ca')}
              >
                <Text
                  style={[
                    dynamicStyles.selectorButtonText,
                    { color: language === 'ca' ? theme.colors.white : theme.colors.text },
                  ]}
                >
                  CA
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  dynamicStyles.selectorButton,
                  language === 'es' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setLanguage('es')}
              >
                <Text
                  style={[
                    dynamicStyles.selectorButtonText,
                    { color: language === 'es' ? theme.colors.white : theme.colors.text },
                  ]}
                >
                  ES
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Selector de Tema */}
          <View style={dynamicStyles.selectorRow}>
            <Text style={[dynamicStyles.selectorLabel, { color: theme.colors.text }]}>
              {themeType === 'light' ? 'Tema: Claro' : 'Tema: Oscuro'}
            </Text>
            <View style={dynamicStyles.selectorButtons}>
              <TouchableOpacity
                style={[
                  dynamicStyles.selectorButton,
                  themeType === 'light' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setTheme('light')}
              >
                <Text
                  style={[
                    dynamicStyles.selectorButtonText,
                    { color: themeType === 'light' ? theme.colors.white : theme.colors.text },
                  ]}
                >
                  ☀️
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  dynamicStyles.selectorButton,
                  themeType === 'dark' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setTheme('dark')}
              >
                <Text
                  style={[
                    dynamicStyles.selectorButtonText,
                    { color: themeType === 'dark' ? theme.colors.white : theme.colors.text },
                  ]}
                >
                  🌙
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Botón Usuario */}
        <Button
          title={t('home.user')}
          onPress={() => setShowUserPicker(true)}
          variant="primary"
          style={dynamicStyles.userButton}
          textStyle={dynamicStyles.userButtonText}
        />

        {/* Usuario actual */}
        {activeUser && (
          <View style={[dynamicStyles.currentUserContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[dynamicStyles.currentUserLabel, { color: theme.colors.textSecondary }]}>
              {t('home.currentUser')}:
            </Text>
            <Text style={[dynamicStyles.currentUserName, { color: theme.colors.text }]}>
              {activeUser.displayName}
            </Text>
          </View>
        )}

        {/* Botón Empezar a Escanear */}
        {activeUser && (
          <Button
            title={t('home.startScanning')}
            onPress={handleStartScanning}
            variant="primary"
            style={dynamicStyles.startButton}
          />
        )}

        {/* Mensaje si no hay usuario */}
        {!activeUser && (
          <Text style={[dynamicStyles.message, { color: theme.colors.textSecondary }]}>
            {t('home.selectUser')}
          </Text>
        )}
      </View>

      {/* Modales */}
      <UserPickerModal
        visible={showUserPicker}
        onClose={() => setShowUserPicker(false)}
        onSelectUser={(user) => {
          setActiveUser(user);
          setShowUserPicker(false);
          // Navegar automáticamente a la pantalla de escáner
          navigation.navigate('Scanner');
        }}
      />

      <AdminModal
        visible={showAdmin}
        onClose={() => setShowAdmin(false)}
        onLogout={handleLogout}
        onClearUser={() => {
          setActiveUser(null);
          setShowAdmin(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Evitar cambios de layout cuando se abre el modal
  },
});
