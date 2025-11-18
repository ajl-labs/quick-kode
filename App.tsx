import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { View, useColorScheme, AppRegistry, AppState } from 'react-native';
import { AppRoot } from './src';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { lightTheme, darkTheme } from './src/config/theme';
import { postTransactionData } from './src/store/features/transactions/transaction.thunk';
import { showAndroidToast } from './src/common/helpers/utils';
import { savePendingBackgroundTransactions } from './src/service/background.transaction';

AppRegistry.registerHeadlessTask('SmsReceiverTask', () => async data => {
  try {
    const payload: ITransactionPostPayload = {
      message: data.message,
      sender: data.sender,
      timestamp: Number.parseInt(data.timestamp),
      phoneNumber: '+250789277275',
      messageId: data.messageId,
    };
    if (AppState.currentState === 'active') {
      store.dispatch(postTransactionData(payload));
    } else {
      await savePendingBackgroundTransactions(payload);
    }
  } catch (err) {
    showAndroidToast('Error in the background');
  }
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ReduxProvider store={store}>
      <PersistGate
        loading={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkMode
                ? darkTheme.colors.background
                : lightTheme.colors.background,
            }}
          >
            <ActivityIndicator
              color={
                isDarkMode
                  ? darkTheme.colors.primary
                  : lightTheme.colors.primary
              }
            />
          </View>
        }
        persistor={persistor}
      >
        <AppRoot />
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
