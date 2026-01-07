/**
 * Hook para detectar cambios de orientación
 */
import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(() => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      const isLandscape = window.width > window.height;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return orientation;
}

