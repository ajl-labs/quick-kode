import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
export * from './theme.utils';

// Light Theme
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#000000', // Black for primary actions
    primaryContainer: '#E0E0E0', // Light gray container
    onPrimary: '#FFFFFF', // White text on black

    secondary: '#4422EF', // Purple
    onSecondary: '#FFFFFF',

    tertiary: '#F6CCCC', // Pink
    onTertiary: '#000000',

    background: '#F8F9FA', // Light background
    onBackground: '#000000',

    surface: '#FFFFFF', // Card background
    onSurface: '#000000',

    surfaceVariant: '#FFFFFF',
    outline: '#737373', // Gray for borders

    error: '#D32F2F',
    onError: '#FFFFFF',
  },
  roundness: moderateScale(4),
};

// Dark Theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#AFF21E', // Same green, still works on dark
    primaryContainer: '#2D3A00', // Dark container variation
    onPrimary: '#000000', // Black text on light green

    secondary: '#4422EF',
    onSecondary: '#FFFFFF',

    tertiary: '#F6CCCC',
    onTertiary: '#000000',

    background: '#121212',
    onBackground: '#FFFFFF',

    surface: '#000000',
    onSurface: '#FFFFFF',

    surfaceVariant: '#1E1E1E',
    outline: '#737373', // Same gray, still readable

    error: '#CF6679',
    onError: '#000000',
  },
  roundness: moderateScale(4),
};
