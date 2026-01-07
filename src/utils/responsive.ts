import { Dimensions } from 'react-native';
import { BREAKPOINTS } from './constants';

const { width, height } = Dimensions.get('window');

export function responsiveWidth(percentage: number): number {
  return (width * percentage) / 100;
}

export function responsiveHeight(percentage: number): number {
  return (height * percentage) / 100;
}

export function isNewlandSize(): boolean {
  return width >= BREAKPOINTS.NEWLAND_WIDTH && width < BREAKPOINTS.MEDIUM;
}

export function isSmallScreen(): boolean {
  return width < BREAKPOINTS.SMALL;
}

export function isMediumScreen(): boolean {
  return width >= BREAKPOINTS.SMALL && width < BREAKPOINTS.MEDIUM;
}

export function isLargeScreen(): boolean {
  return width >= BREAKPOINTS.MEDIUM;
}
