import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { Icon, IconProps } from '../Icon';
import { CustomButton } from '../CustomButton';

interface QuickActionProps extends ButtonProps {
  icon?: IconProps['name'];
}

export const QuickAction: React.FC<QuickActionProps> = ({
  children,
  icon,
  ...props
}) => {
  return (
    <CustomButton
      {...props}
      mode="outlined"
      icon={iconProps => {
        if (icon) {
          return <Icon name={icon} color={iconProps.color} />;
        }
      }}
    >
      {children}
    </CustomButton>
  );
};
