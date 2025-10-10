import * as React from 'react';
import { HomeScreen, HistoryScreen } from '../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../common/components';
import { ThemeSpacings } from '../config/theme';
import { HomeTabScreens } from './navigation.constants';
import { HomeTabParamList } from './types';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          marginVertical: ThemeSpacings.sm,
        },
      }}
    >
      <Tab.Screen
        name={HomeTabScreens.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'Quick Kode',
          tabBarIcon: ({ color, size }) => (
            <Icon name="Home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name={HomeTabScreens.History}
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          headerTitle: 'USSD History',
          tabBarIcon: ({ color, size }) => (
            <Icon name="History" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeTabScreens.Settings}
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="Settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
