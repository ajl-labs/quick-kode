import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { HomeStackScreens, HomeTabScreens } from './navigation.constants';

export type HomeTabParamList = {
  [HomeTabScreens.Home]: undefined;
  [HomeTabScreens.USSDCode]: undefined;
  [HomeTabScreens.Settings]: undefined;
};

export type HomeStackParamList = {
  [HomeStackScreens.Home]: undefined;
  [HomeStackScreens.AllTransactions]: undefined; // AllHistory screen takes no params
};

declare global {
  namespace ReactNavigation {
    // This interface must extend your root navigator's param list.
    // In your case, HomeStackParamList is your root.
    interface RootParamList extends HomeStackParamList {}
  }
}

// 4. Create helper types for screen components
// These make it easy to type the props of your individual screens.

// For Stack Screens:
export type AllHistoryScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  HomeStackScreens.AllTransactions
>;

// For Tab Screens (these are nested, so we use CompositeScreenProps)
export type HomeScreenInTabProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabScreens.Home>,
  NativeStackScreenProps<HomeStackParamList>
>;

export type HistoryScreenInTabProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabScreens.USSDCode>,
  NativeStackScreenProps<HomeStackParamList>
>;

export type SettingsScreenInTabProps = CompositeScreenProps<
  BottomTabScreenProps<HomeTabParamList, HomeTabScreens.Settings>,
  NativeStackScreenProps<HomeStackParamList>
>;

// You can also create a generic helper for any HomeStack screen
export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

// And a generic helper for any HomeTab screen
export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  BottomTabScreenProps<HomeTabParamList, T>;
