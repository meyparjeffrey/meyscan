/**
 * Hook para detectar el tipo de dispositivo
 */
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { isNewlandDevice } from '../../utils/deviceUtils';

export type DeviceType = 'newland' | 'mobile';

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    // En web, siempre usar HIDScanner (input de texto), no cámara
    if (Platform.OS === 'web') {
      return 'newland'; // Tratar web como Newland para usar HIDScanner
    }
    return isNewlandDevice() ? 'newland' : 'mobile';
  });

  useEffect(() => {
    // En web, siempre usar HIDScanner (input de texto), no cámara
    if (Platform.OS === 'web') {
      setDeviceType('newland'); // Tratar web como Newland para usar HIDScanner
    } else {
      setDeviceType(isNewlandDevice() ? 'newland' : 'mobile');
    }
  }, []);

  return {
    deviceType,
    isNewland: deviceType === 'newland',
    isMobile: deviceType === 'mobile',
    // En web, NO usar cámara (usar HIDScanner en su lugar)
    shouldUseCamera: Platform.OS !== 'web' && deviceType === 'mobile',
  };
}

