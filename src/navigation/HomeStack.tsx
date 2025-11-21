import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllTransactions } from '../screens/AllTransactions';
import { HomeStackParamList } from './types';
import { HomeStackScreens } from './navigation.constants';
import { HomeScreen } from '../screens';
import { HomeScreenHeader } from '../common/components/Header/HomeScreenHeader';
import { CustomAppHeader } from '../common/components/Header/CustomAppHeader';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={HomeStackScreens.Home}
      screenOptions={{
        animation: 'slide_from_right',
        headerShadowVisible: false,
        header: props => <CustomAppHeader {...props} />,
      }}
    >
      <Stack.Screen
        name={HomeStackScreens.Home}
        component={HomeScreen}
        options={{
          headerTitle: 'Quick Kode',
          header: props => <HomeScreenHeader {...props} />,
        }}
      />
      <Stack.Screen
        name={HomeStackScreens.AllTransactions}
        component={AllTransactions}
        options={{
          title: 'All Transactions',
          presentation: 'containedModal',
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
        }}
      />
    </Stack.Navigator>
  );
};
