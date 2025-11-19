import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
  configureFonts,
} from 'react-native-paper';
import { MD3Type } from 'react-native-paper/lib/typescript/types';
import { moderateScale } from 'react-native-size-matters';
export * from './theme.utils';

const responsiveFonts = configureFonts({
  config: Object.keys(MD3LightTheme.fonts).reduce((acc, key) => {
    const font = (MD3LightTheme.fonts as any)[key] as MD3Type;
    return {
      ...acc,
      [key]: {
        ...font,
        fontSize: moderateScale(font.fontSize) ?? 12,
        lineHeight: moderateScale(font.lineHeight) ?? 16,
      },
    };
  }, {} as MD3Theme['fonts']),
  isV3: true,
});

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#764abc', //  purple for primary actions
  },
  fonts: responsiveFonts,
  roundness: moderateScale(4),
};

// Dark Theme
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#aff21e',
    primaryContainer: '#d7fb9b',
    onPrimary: '#e7fcc3',
    inversePrimary: '#baf54c',

    // primary100: '#f5fee7',
    // primary90: '#e7fcc3',
    // primary80: '#d7fb9b',
    // primary70: '#c7f870',
    // primary60: '#baf54c',
    // primary50: '#aff21e', // the base color
    // primary40: '#a5df11',
    // primary30: '#97c800',
    // primary20: '#8bb000',
    // primary10: '#768800',
  },
  fonts: responsiveFonts,
  roundness: moderateScale(4),
};
