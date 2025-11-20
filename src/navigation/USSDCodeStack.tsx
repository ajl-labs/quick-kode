import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { USSDCodeStackScreens } from './navigation.constants';
import { USSDCodeScreen } from '../screens';

const Stack = createNativeStackNavigator();

export const USSDCodeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={USSDCodeStackScreens.USSDCodeMenu}
      screenOptions={{
        animation: 'slide_from_right',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={USSDCodeStackScreens.USSDCodeMenu}
        component={USSDCodeScreen}
        options={{ headerTitle: 'USSD Code' }}
      />
    </Stack.Navigator>
  );
};
