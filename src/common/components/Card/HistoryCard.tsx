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
  leftBorder?: boolean;
}
export const HistoryCard: React.FC<HistoryCardProps> = ({
  title,
  content,
  createdAt,
  leftBorder,
}) => {
  const theme = useTheme();
  const borderStyle = leftBorder
    ? {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.secondary,
        borderTopLeftRadius: moderateScale(13),
        borderBottomLeftRadius: moderateScale(13),
      }
    : {};
  return (
    <BasicCard roundness={moderateScale(3)} contentStyle={[borderStyle]}>
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
