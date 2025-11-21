import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { ThemeSpacings } from '../../../config/theme';

export const CustomButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      labelStyle={{
        marginHorizontal: ThemeSpacings.sm,
        marginVertical: ThemeSpacings.sm,
      }}
      {...props}
      compact
    >
      {children}
    </Button>
  );
};
