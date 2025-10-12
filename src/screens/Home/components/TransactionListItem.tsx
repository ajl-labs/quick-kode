import { Badge, List, Text, useTheme } from 'react-native-paper';
import { Icon, IconProps } from '../../../common/components/Icon';
import React from 'react';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import { StyleSheet, View } from 'react-native';
import globalStyles from '../../../common/styles/global.styles';
import { DEVICE_DIMENSIONS } from '../../../common/components/constants';
import { ThemeSpacings } from '../../../config/theme';
import {
  TransactionCategory,
  TransactionType,
} from '../../../common/constants/enum';
import { moderateScale } from 'react-native-size-matters';

interface TransactionListItemProps {
  type: ITransaction['type'];
  title: string;
  description: string;
  rightUpText?: string;
  rightBottomText?: string;
  iconType?: TransactionCategory | TransactionType;
}

type ItemExtraComponentProps = { color: string; style?: Style | undefined };
export const TransactionListItem: React.FC<TransactionListItemProps> = ({
  type,
  title,
  description,
  rightUpText,
  rightBottomText,
  iconType,
}) => {
  const theme = useTheme();
  const iconNames: Partial<
    Record<TransactionCategory | TransactionType | 'default', IconProps['name']>
  > = {
    DEBIT: 'ArrowTopRight',
    CREDIT: 'ArrowBottomRight',
    airtime_purchase: 'PhonePause',
    goods_payment: 'CreditCard',
    default: 'ArrowTopRight',
  };

  const iconBackground = `${theme.colors.primary}20`;
  const iconColor = theme.colors.primary;

  const renderIcon = (props: ItemExtraComponentProps) => {
    let iconName = type === 'DEBIT' ? iconNames.DEBIT : iconNames.CREDIT;
    if (iconType && iconNames[iconType]) {
      iconName = iconNames[iconType];
    }
    if (iconName) {
      return (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: iconBackground,
              borderRadius: theme.roundness,
            },
          ]}
        >
          <Icon name={iconName} color={iconColor} size={28} />
        </View>
      );
    }
    return null;
  };

  const renderRightContent = (props: ItemExtraComponentProps) => {
    if (rightUpText || rightBottomText) {
      return (
        <View style={[styles.rightContentContainer]}>
          {rightUpText && <Text variant="bodySmall">{rightUpText}</Text>}
          {rightBottomText && (
            <Badge
              size={20}
              theme={{
                colors: {
                  error: iconBackground,
                  onError: iconColor,
                },
              }}
              style={{
                borderRadius: theme.roundness / 2,
                fontSize: moderateScale(8),
              }}
            >
              {rightBottomText}
            </Badge>
          )}
        </View>
      );
    }
    return null;
  };
  return (
    <List.Item
      title={<Text variant="titleSmall">{title}</Text>}
      description={props => (
        <Text variant="bodySmall" style={{ color: props.color }}>
          {description}
        </Text>
      )}
      left={renderIcon}
      right={renderRightContent}
      containerStyle={styles.containerStyle}
      style={globalStyles.removePadding}
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 6,
    ...globalStyles.centered,
  },
  containerStyle: {
    ...globalStyles.centered,
    width: DEVICE_DIMENSIONS.width - ThemeSpacings.md * 2,
  },
  rightContentContainer: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
