import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsMenu, WebhookSettings } from '../screens/Settings';
import { SettingsStackScreens } from './navigation.constants';

const Stack = createNativeStackNavigator();

export const SettingsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={SettingsStackScreens.SettingsMenu}
      screenOptions={{
        animation: 'slide_from_right',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={SettingsStackScreens.SettingsMenu}
        component={SettingsMenu}
        options={{ headerTitle: 'Settings' }}
      />
      <Stack.Screen
        name={SettingsStackScreens.WebhookSettings}
        component={WebhookSettings}
        options={{ headerTitle: 'Webhook Settings' }}
      />
    </Stack.Navigator>
  );
};
