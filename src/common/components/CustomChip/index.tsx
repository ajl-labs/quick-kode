import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { ThemeSpacings } from '../../../config/theme';
import { TouchableOpacity, View } from 'react-native';
import globalStyles from '../../styles/global.styles';
import { startCase } from 'lodash';
import { Icon, IconProps } from '../Icon';

interface CustomChipProps {
  label: string;
  onPress?: () => void;
  icon?: IconProps['name'] | null;
  closable?: boolean;
}
export const CustomChip: React.FC<CustomChipProps> = ({
  label,
  onPress,
  icon,
  closable,
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderColor: theme.colors.outline,
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(4),
        paddingVertical: ThemeSpacings.xs,
        paddingHorizontal: ThemeSpacings.sm,
        backgroundColor: theme.colors.surface,
      }}
    >
      <View style={[globalStyles.row, { gap: ThemeSpacings.sm }]}>
        {icon && (
          <Icon
            name={icon}
            color={theme.colors.primary}
            size={moderateScale(16)}
          />
        )}
        <Text variant="labelMedium">{startCase(label)}</Text>
        {closable && (
          <Icon
            name="Close"
            color={theme.colors.onSurface}
            size={moderateScale(16)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
