/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('SmsListenerTask', () => async (data) => {
  const {message, sender} = data;
  console.log('📩 SMS received:>>>>>>>>>>>>>>>>>>', message, 'from', sender);
  // You can process it here or send to API
});
