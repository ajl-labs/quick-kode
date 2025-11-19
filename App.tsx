import React from 'react';
import { AppRegistry, AppState } from 'react-native';
import { AppRoot } from './src';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store';
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
  return (
    <ReduxProvider store={store}>
      <AppRoot />
    </ReduxProvider>
  );
}

export default App;
