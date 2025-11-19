import { Badge, List, ListItemProps, Text, useTheme } from 'react-native-paper';
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

import {
  formatDate,
  formatRelativeTime,
  isToday,
} from '../../../common/helpers/date.helpers';
import { formatCurrency } from '../../../common/helpers/currency.helpers';
import { extractTransactionSummary } from '../../../common/helpers/transaction.helper';

interface TransactionListItemProps extends Omit<ListItemProps, 'title'> {
  item: IDataBaseRecord<ITransaction>;
  iconType?: TransactionCategory | TransactionType;
  onPress?: () => void;
  transactionLabels?: TransactionLabel[];
  showMessage?: boolean;
  title?: ListItemProps['title'];
}

type ItemExtraComponentProps = { color: string; style?: Style | undefined };
export const TransactionListItem: React.FC<TransactionListItemProps> = ({
  item,
  iconType,
  showMessage,
  ...props
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
    let iconName = item.type === 'DEBIT' ? iconNames.DEBIT : iconNames.CREDIT;
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
              ...(item.summary ? { alignSelf: 'flex-start' } : {}),
            },
          ]}
        >
          <Icon name={iconName} color={iconColor} size={28} />
        </View>
      );
    }
    return null;
  };

  const renderRightContent = () => {
    let transactionDate = item.completed_at || item.created_at;

    if (isToday(transactionDate)) {
      transactionDate = formatRelativeTime(transactionDate);
    } else {
      transactionDate = formatDate(transactionDate, 'DD/MM/YY');
    }

    return (
      <View style={[styles.rightContentContainer]}>
        <Text variant="bodySmall">{transactionDate}</Text>
        {item.label && (
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
            {item.label}
          </Badge>
        )}
      </View>
    );
  };
  return (
    <>
      <List.Item
        {...props}
        title={<Text variant="titleSmall">{formatCurrency(item.amount)}</Text>}
        description={props => (
          <View style={[globalStyles.column, globalStyles.gapSm]}>
            <Text variant="labelSmall" style={{ color: props.color }}>
              {item.summary || extractTransactionSummary(item)}
            </Text>
            {Boolean(item.message && showMessage) && (
              <Text variant="bodySmall" style={{ fontSize: moderateScale(10) }}>
                {item.message}
              </Text>
            )}
          </View>
        )}
        left={renderIcon}
        right={renderRightContent}
        containerStyle={[styles.containerStyle, props.containerStyle]}
        style={[globalStyles.removePadding, props.style]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: moderateScale(4),
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
