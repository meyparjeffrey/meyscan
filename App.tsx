/**
 * Componente principal de la aplicación
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/presentation/context/AppContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import './src/presentation/i18n/i18n'; // Inicializar i18n

export default function App() {
  return (
    <AppProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AppProvider>
  );
}
