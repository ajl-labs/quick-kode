import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { ThemeSpacings } from '../../config/theme';
import globalStyles from '../styles/global.styles';

export const screenContainerStyle = StyleSheet.create({
  container: {
    flex: 1,
    ...globalStyles.column,
    gap: ThemeSpacings.md,
  },
});

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
export const Container: React.FC<ContainerProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        screenContainerStyle.container,
        globalStyles.verticalSpacing,
        globalStyles.horizontalSpacingSm,
        { backgroundColor: theme.colors.background },
        style, // Allow additional styles to be passed in
      ]}
    >
      {children}
    </View>
  );
};
