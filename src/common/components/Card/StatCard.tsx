import React from 'react';
import { Card, CardProps, Text } from 'react-native-paper';
import { BasicCard } from './BasicCard';
import globalStyles from '../../styles/global.styles';
import { ThemeSpacings } from '../../../config/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  style?: CardProps['style'];
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, style }) => {
  return (
    <BasicCard style={style} roundness={2}>
      <Card.Content
        style={[globalStyles.removePadding, { gap: ThemeSpacings.xs }]}
      >
        <Text variant="titleSmall">{title}</Text>
        <Text variant="titleLarge">{value}</Text>
      </Card.Content>
    </BasicCard>
  );
};
