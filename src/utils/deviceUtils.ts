import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function getDeviceInfo() {
  return {
    modelName: Device.modelName,
    brand: Device.brand,
    osName: Platform.OS,
    osVersion: Device.osVersion,
  };
}

export function isNewlandDevice(): boolean {
  if (Platform.OS !== 'android') return false;
  const modelName = Device.modelName || '';
  const brand = Device.brand || '';
  return (
    modelName.toLowerCase().includes('newland') ||
    modelName.toLowerCase().includes('nls') ||
    brand.toLowerCase().includes('newland')
  );
}
