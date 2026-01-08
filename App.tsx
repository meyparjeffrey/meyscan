/**
 * Componente principal de la aplicación - RESTAURANDO FUNCIONALIDAD
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Ignorar errores de refresh token de Supabase que son controlados
LogBox.ignoreLogs([
  'AuthApiError: Invalid Refresh Token: Refresh Token Not Found',
  'AuthApiError: Invalid Refresh Token: Refresh Token not found',
]);

import { AppProvider } from './src/presentation/context/AppContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { ErrorBoundary } from './src/presentation/components/common/ErrorBoundary';
import './src/presentation/i18n/i18n';
import i18n from './src/presentation/i18n/i18n';

console.log('[App.tsx] ========================================');
console.log('[App.tsx] RESTAURANDO CODIGO REAL');
console.log('[App.tsx] ========================================');

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('[App] 🚀 Iniciando aplicación...');
    
    // Pequeña espera para asegurar que i18n esté listo
    const checkI18n = setInterval(() => {
      if (i18n.isInitialized) {
        console.log('[App] ✅ i18n inicializado correctamente');
        clearInterval(checkI18n);
        setIsReady(true);
      }
    }, 100);

    // Timeout de seguridad
    const timer = setTimeout(() => {
      console.log('[App] ⚠️ i18n tardando mucho, forzando inicio...');
      clearInterval(checkI18n);
      setIsReady(true);
    }, 3000);

    return () => {
      clearInterval(checkI18n);
      clearTimeout(timer);
    };
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Iniciando MeyparScan...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020202',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
