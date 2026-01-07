/**
 * Pantalla de Login
 * 
 * Permite al usuario técnico iniciar sesión
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Logo } from '../components/common/Logo';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] 🎯 PANTALLA DE LOGIN MONTANDOSE');
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] ========================================');
  console.log('[LoginScreen] Timestamp:', new Date().toISOString());
  
  console.log('[LoginScreen] Obteniendo contexto...');
  const { theme } = useAppContext();
  console.log('[LoginScreen] ✅ Contexto obtenido, tema:', theme.type);
  
  console.log('[LoginScreen] Obteniendo traducciones...');
  const { t } = useTranslation();
  console.log('[LoginScreen] ✅ Traducciones cargadas');
  
  console.log('[LoginScreen] Obteniendo auth hook...');
  const { login, loading, error } = useAuth();
  console.log('[LoginScreen] ✅ Auth hook obtenido, loading:', loading, 'error:', error || 'Sin error');
  
  console.log('[LoginScreen] ✅✅✅ PANTALLA DE LOGIN LISTA PARA RENDERIZAR ✅✅✅');
  console.log('[LoginScreen] Iniciando renderizado del JSX...');
  
  // Obtener dimensiones para responsive
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLandscape = screenWidth > screenHeight;
  const isSmallHeight = screenHeight < 500;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setLocalError(t('login.errorCredentials'));
      return;
    }

    try {
      setLocalError(null);
      const session = await login(email.trim(), password);
      // Navegar explícitamente a Home después del login exitoso
      if (session) {
        navigation.replace('Home');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('login.errorServer');
      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isLandscape && { justifyContent: 'center', paddingVertical: 10 }
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isLandscape || isSmallHeight && screenHeight < 350} // Solo habilitar scroll si la pantalla es extremadamente pequeña
      >
        <View style={[
          styles.logoContainer,
          isLandscape && { marginBottom: 15 }
        ]}>
          <Logo size={isLandscape ? "small" : "medium"} />
        </View>

        <View style={styles.formContainer}>
          <Text style={[
            styles.title, 
            { color: theme.colors.text },
            isLandscape && { fontSize: 22, marginBottom: 15 }
          ]}>
            {t('login.title')}
          </Text>

          <Input
            label={isLandscape ? undefined : t('login.email')} // Quitar label en horizontal para ahorrar espacio
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder={t('login.email')}
            error={displayError && !password ? displayError : undefined}
            containerStyle={isLandscape ? { marginBottom: 8 } : undefined}
            style={isLandscape ? { height: 48, minHeight: 48 } : undefined}
          />

          <Input
            label={isLandscape ? undefined : t('login.password')} // Quitar label en horizontal para ahorrar espacio
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle={true}
            autoCapitalize="none"
            autoComplete="password"
            placeholder={t('login.password')}
            error={displayError && password ? displayError : undefined}
            containerStyle={isLandscape ? { marginBottom: 8 } : undefined}
            style={isLandscape ? { height: 48, minHeight: 48 } : undefined}
          />

          {displayError && (
            <Text style={[styles.errorText, { color: theme.colors.error }, isLandscape && { marginBottom: 5 }]}>
              {displayError}
            </Text>
          )}

          <Button
            title={loading ? t('login.connecting') : t('login.enter')}
            onPress={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            loading={loading}
            style={[
              styles.loginButton,
              isLandscape && { minHeight: 50, marginTop: 5 }
            ]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28, // Aumentado para mejor espaciado
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28, // Aumentado para mejor legibilidad
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
  },
});

