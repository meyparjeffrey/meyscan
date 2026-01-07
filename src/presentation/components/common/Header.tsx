/**
 * Componente Header con Logo
 * 
 * Header que se mantiene visible en toda la app con el logo
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { Logo } from './Logo';

interface HeaderProps {
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({ style }) => {
  const { theme } = useAppContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }, style]}>
      <Logo size="small" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
