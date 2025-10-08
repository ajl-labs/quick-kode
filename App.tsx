import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme, Navigation } from './src';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { checkAccessibilityPermission } from './src/common/helpers';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;
  useEffect(() => {
    checkAccessibilityPermission();
  }, []);

  SystemNavigationBar.setNavigationColor(
    theme.colors.background, // background color for system navigation bar
    isDarkMode ? 'light' : 'dark', // color for system navigation bar item (light if dark mode, dark if light mode)
  );

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <SafeAreaProvider>
          {/* <SafeAreaView style={styles.container}> */}
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
            translucent
          />

          <PaperProvider theme={theme}>
            <GestureHandlerRootView
              style={[
                styles.container,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <BottomSheetModalProvider>
                <Navigation theme={theme} />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </PaperProvider>
          {/* </SafeAreaView> */}
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
