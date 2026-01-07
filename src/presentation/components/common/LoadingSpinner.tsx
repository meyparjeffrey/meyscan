/**
 * Componente LoadingSpinner
 */
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  fullScreen = false,
}) => {
  const { theme } = useAppContext();

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={theme.colors.primary} />;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

