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
    primary: '#611ef2',
    primaryContainer: '#d5c2fa',
    inversePrimary: '#5319ec',

    secondary: '#f2611e',
    secondaryContainer: '#fbcdbb',
    //checkout this: https://m2.material.io/inline-tools/color/
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
    inversePrimary: '#baf54c',

    secondary: '#1ef261',
    secondaryContainer: '#e9feea',

    // checkout this: https://m2.material.io/inline-tools/color/
  },
  fonts: responsiveFonts,
  roundness: moderateScale(4),
};
