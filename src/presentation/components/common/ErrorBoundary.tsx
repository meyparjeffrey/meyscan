/**
 * Error Boundary para capturar errores de React
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] ========================================');
    console.error('[ErrorBoundary] ERROR CAPTURADO');
    console.error('[ErrorBoundary] ========================================');
    console.error('[ErrorBoundary] Mensaje:', error.message);
    console.error('[ErrorBoundary] Nombre:', error.name);
    console.error('[ErrorBoundary] Stack completo:', error.stack);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
    console.error('[ErrorBoundary] Error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Error en la aplicación</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Error desconocido'}
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.stack}>
              {this.state.error.stack}
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  stack: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
});

