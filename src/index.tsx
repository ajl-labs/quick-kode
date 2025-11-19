import React from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { Navigation } from './navigation';
import { darkTheme, lightTheme } from './config/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { useAppInitialization } from './common/hooks/useAppInitialization';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const AppRoot = () => {
  useAppInitialization();
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PersistGate
      loading={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
          }}
        >
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      }
      persistor={persistor}
    >
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
          translucent
        />
        <GestureHandlerRootView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <PaperProvider theme={theme}>
            <BottomSheetModalProvider>
              <Navigation theme={theme} />
            </BottomSheetModalProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PersistGate>
  );
};
