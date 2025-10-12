import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { AppRoot } from './src';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';

function App(): React.JSX.Element {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <AppRoot />
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
