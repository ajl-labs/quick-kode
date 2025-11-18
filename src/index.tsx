import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Navigation } from './navigation';
import { darkTheme, lightTheme } from './config/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useDispatch } from 'react-redux';
import {
  fetchTransactionData,
  postPendingTransactions,
} from './store/features/transactions/transaction.thunk';
import { AppDispatch } from './store';
import { retryPostTransactions } from './store/features/retryQueue/retry.queue.thunk';
import { useAppInitialization } from './common/hooks/useAppInitialization';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const AppRoot = () => {
  useAppInitialization();
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useColorScheme() === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    dispatch(retryPostTransactions());
    dispatch(postPendingTransactions());
    dispatch(fetchTransactionData());
  }, [dispatch]);

  SystemNavigationBar.setNavigationColor(
    theme.colors.background, // background color for system navigation bar
    isDarkMode ? 'light' : 'dark', // color for system navigation bar item (light if dark mode, dark if light mode)
  );

  return (
    <SafeAreaProvider>
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
            <GestureHandlerRootView>
              <Navigation theme={theme} />
            </GestureHandlerRootView>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};
