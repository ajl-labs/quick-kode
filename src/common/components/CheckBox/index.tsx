import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '../Icon';
import { Text, useTheme } from 'react-native-paper';
import globalStyles from '../../styles/global.styles';
import { ThemeSpacings } from '../../../config/theme';

const styles = StyleSheet.create({
  container: {
    paddingVertical: ThemeSpacings.xs,
  },
  checkBoxContainer: {
    borderWidth: StyleSheet.hairlineWidth * 1.8,
  },
});

interface CheckBoxProps {
  checked?: boolean;
  title: string;
  onPress?: () => void;
}
export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  title,
  onPress,
}) => {
  const theme = useTheme();
  const color = checked ? theme.colors.primary : theme.colors.outline;
  return (
    <TouchableOpacity
      style={[styles.container, globalStyles.row, globalStyles.gap]}
      onPress={onPress}
    >
      <View
        style={[
          styles.checkBoxContainer,
          { borderColor: color, borderRadius: theme.roundness },
        ]}
      >
        <Icon name="Check" color={checked ? color : '#ffffff0'} size={20} />
      </View>
      <Text variant="bodyLarge">{title}</Text>
    </TouchableOpacity>
  );
};
