import { StyleSheet } from 'react-native';
import { CardProps, Surface, SurfaceProps, useTheme } from 'react-native-paper';
import React from 'react';
import globalStyles from '../../styles/global.styles';

const styles = StyleSheet.create({
  content: {
    ...globalStyles.spacingSm,
    flexGrow: 1,
  },
});

interface BasicCardProps extends Partial<SurfaceProps> {
  children?: React.ReactNode;
  style?: CardProps['style'];
  roundness?: number;
}
export const BasicCard: React.FC<BasicCardProps> = ({
  children,
  style,
  roundness = 1,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Surface
      elevation={0}
      {...props}
      style={[
        {
          borderColor: theme.colors.outline,
          borderWidth: StyleSheet.hairlineWidth * 2,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * roundness,
        },
        styles.content,
        style,
      ]}
    >
      {children}
    </Surface>
  );
};
