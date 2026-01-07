/**
 * Componente para escaneo con cámara (Dispositivos móviles)
 * 
 * Por defecto utiliza la cámara trasera, pero permite cambiar
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

interface CameraScannerProps {
  onScan: (value: string) => void;
  active: boolean;
  onClose?: () => void;
  fullscreen?: boolean;
  onError?: (error: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, active, onClose, fullscreen = false, onError }) => {
  const { theme } = useAppContext();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back'); // Por defecto trasera
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    if (active && !permission?.granted) {
      requestPermission();
    }
  }, [active, permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned && data) {
      setScanned(true);
      setScanError(null);
      onScan(data);
      
      // Resetear después de 2 segundos para permitir otro escaneo
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {t('camera.requestingPermission')}
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {t('camera.permissionRequired')}
        </Text>
        <Text
          style={[styles.link, { color: theme.colors.primary }]}
          onPress={requestPermission}
        >
          {t('camera.grantPermission')}
        </Text>
      </View>
    );
  }

  if (!active) {
    return null;
  }

  return (
    <View style={[styles.cameraContainer, fullscreen && styles.fullscreen]}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
      />
      
      {/* Controles de cámara (solo en modo fullscreen) */}
      {fullscreen && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.surface + 'CC' }]}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>
              {t('camera.switchCamera')}
            </Text>
          </TouchableOpacity>
          
          {onClose && (
            <TouchableOpacity
              style={[styles.controlButton, styles.closeButton, { backgroundColor: theme.colors.error + 'CC' }]}
              onPress={onClose}
            >
              <Text style={[styles.controlButtonText, { color: theme.colors.white }]}>
                {t('camera.closeCamera')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Indicador de escaneo exitoso */}
      {scanned && (
        <View style={[styles.scanIndicator, { backgroundColor: '#4CAF50' + 'CC' }]}>
          <Text style={[styles.scanText, { color: '#FFFFFF', fontSize: 20 }]}>
            {t('camera.codeScanned')}
          </Text>
        </View>
      )}

      {/* Indicador de error */}
      {scanError && (
        <View style={[styles.scanIndicator, styles.errorIndicator, { backgroundColor: '#F44336' + 'CC' }]}>
          <Text style={[styles.scanText, { color: '#FFFFFF', fontSize: 18 }]}>
            {scanError}
          </Text>
        </View>
      )}

      {/* Reticle visual para guiar el escaneo */}
      {!scanned && fullscreen && (
        <View style={styles.reticle}>
          <View style={[styles.reticleCorner, styles.reticleTopLeft]} />
          <View style={[styles.reticleCorner, styles.reticleTopRight]} />
          <View style={[styles.reticleCorner, styles.reticleBottomLeft]} />
          <View style={[styles.reticleCorner, styles.reticleBottomRight]} />
          <Text style={[styles.reticleHint, { color: '#FFFFFF' }]}>
            {t('camera.alignCode')}
          </Text>
        </View>
      )}

      {/* Indicador de escaneo activo */}
      {!scanned && fullscreen && (
        <View style={styles.scanningIndicator}>
          <Text style={[styles.scanningText, { color: '#FFFFFF' }]}>
            {t('camera.scanning')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scanIndicator: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1001,
  },
  errorIndicator: {
    backgroundColor: '#F44336' + 'CC',
  },
  scanText: {
    fontSize: 18,
    fontWeight: '700',
  },
  scanningIndicator: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1001,
  },
  scanningText: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reticleHint: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reticle: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    bottom: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  reticleTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  reticleTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  reticleBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  reticleBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});

