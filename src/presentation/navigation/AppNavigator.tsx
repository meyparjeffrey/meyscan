/**
 * Configuración de navegación de la aplicación
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scanner: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  console.log('[AppNavigator] ========================================');
  console.log('[AppNavigator] RENDERIZANDO NAVEGADOR');
  console.log('[AppNavigator] ========================================');
  console.log('[AppNavigator] Timestamp:', new Date().toISOString());
  
  console.log('[AppNavigator] Llamando a useAuth()...');
  const { isAuthenticated, loading, error } = useAuth();
  console.log('[AppNavigator] useAuth() completado');

  console.log('[AppNavigator] Estado de autenticación:', { 
    loading, 
    isAuthenticated, 
    error: error || 'Sin error',
    timestamp: new Date().toISOString()
  });

  if (loading) {
    console.log('[AppNavigator] ⏳ Loading=true, mostrando LoadingSpinner...');
    console.log('[AppNavigator] LoadingSpinner se renderizara ahora');
    const spinner = <LoadingSpinner fullScreen />;
    console.log('[AppNavigator] LoadingSpinner creado, retornando...');
    return spinner;
  }

  const initialRoute = isAuthenticated ? "Home" : "Login";
  console.log('[AppNavigator] ✅ Loading=false, renderizando navegación');
  console.log('[AppNavigator] Ruta inicial:', initialRoute);
  console.log('[AppNavigator] Usuario autenticado:', isAuthenticated ? 'SÍ' : 'NO');
  console.log('[AppNavigator] Creando NavigationContainer...');

  const navContainer = (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
  console.log('[AppNavigator] NavigationContainer creado, retornando...');
  console.log('[AppNavigator] La pantalla', initialRoute, 'deberia renderizarse ahora');
  
  return navContainer;
}

