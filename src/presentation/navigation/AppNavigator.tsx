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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isAuthenticated ? "Home" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

