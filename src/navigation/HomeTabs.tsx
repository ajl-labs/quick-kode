import * as React from 'react';
import { USSDCodeScreen } from '../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../common/components';
import { ThemeSpacings } from '../config/theme';
import { HomeTabScreens, USSDCodeStackScreens } from './navigation.constants';
import { HomeTabParamList } from './types';
import { SettingsStack } from './SettingsStack';
import { HomeStack } from './HomeStack';
import { USSDCodeStack } from './USSDCodeStack';
import { CustomAppHeader } from '../common/components/Header/CustomAppHeader';

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          marginVertical: ThemeSpacings.sm,
        },
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name={HomeTabScreens.Home}
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="Home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name={HomeTabScreens.USSDCode}
        component={USSDCodeStack}
        options={{
          tabBarLabel: 'Codes',
          headerTitle: 'USSD Code',
          tabBarIcon: ({ color, size }) => (
            <Icon name="Hash" color={color} size={size} />
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
