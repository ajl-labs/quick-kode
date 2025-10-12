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
        fontSize: moderateScale(font.fontSize),
        lineHeight: moderateScale(font.lineHeight),
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
    primary: '#AFF21E', //  green on dark
  },
  fonts: responsiveFonts,
  roundness: moderateScale(4),
};
