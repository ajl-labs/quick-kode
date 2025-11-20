import * as React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { MD3Theme } from 'react-native-paper';
import { USSDCodeHandlerProvider } from '../common/Context/USSDCodeHandler';
import { HomeTabs } from './HomeTabs';
interface NavigationProps {
  theme: MD3Theme;
}

export const Navigation: React.FC<NavigationProps> = ({ theme }) => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        dark: theme.dark,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.background,
          text: theme.colors.onBackground,
          border: theme.colors.outline,
          notification: DefaultTheme.colors.notification,
        },
      }}
    >
      <USSDCodeHandlerProvider>
        <HomeTabs />
      </USSDCodeHandlerProvider>
    </NavigationContainer>
  );
};
