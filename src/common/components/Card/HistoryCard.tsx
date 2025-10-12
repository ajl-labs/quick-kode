import { Card, Text, useTheme } from 'react-native-paper';
import React from 'react';
import globalStyles from '../../styles/global.styles';
import { BasicCard } from './BasicCard';
import { View } from 'react-native';
import { formatRelativeTime } from '../../helpers/date.helpers';
import { moderateScale } from 'react-native-size-matters';

interface HistoryCardProps {
  title: string;
  content: string;
  createdAt: Date;
  highlighted?: boolean;
}
export const HistoryCard: React.FC<HistoryCardProps> = ({
  title,
  content,
  createdAt,
  highlighted,
}) => {
  const theme = useTheme();

  return (
    <BasicCard
      roundness={moderateScale(3)}
      outlineColor={highlighted ? theme.colors.primary : theme.colors.outline}
    >
      <View style={[globalStyles.row, globalStyles.spacedRow]}>
        <Text variant="labelMedium">{title}</Text>
        {/* <Text variant="bodySmall">{formatRelativeTime(createdAt)}</Text> */}
      </View>
      <Card.Content style={[globalStyles.removePadding]}>
        <Text variant="bodySmall">{content}</Text>
        <Text variant="bodySmall" style={{ alignSelf: 'flex-end' }}>
          {formatRelativeTime(createdAt)}
        </Text>
      </Card.Content>
    </BasicCard>
  );
};
