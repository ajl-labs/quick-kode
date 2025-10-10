import React from 'react';
import { icons } from '../../../assets/icons';
import { useTheme } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

export interface IconProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  ...props
}) => {
  const theme = useTheme();
  const IconComponent = icons[name];

  return (
    <IconComponent
      height={moderateScale(size)}
      width={moderateScale(size)}
      fill={color || theme.colors.onPrimary}
      {...props}
    />
  );
};
