import React, { useCallback, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { FlatList, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../../common/styles/global.styles';
import {
  getProviderFromPhone,
  removeCountryCode,
} from '../../../common/helpers/phone.helpers';
import { TransactionListItem } from './TransactionListItem';

import {
  formatDate,
  formatRelativeTime,
  formatTime,
  isToday,
} from '../../../common/helpers/date.helpers';
import { formatCurrency } from '../../../common/helpers/currency.helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTransactionLabelEnabled,
  selectTransactionLabels,
} from '../../../store/features/settings/settings.slice';
import { ThemeSpacings } from '../../../config/theme';
import { Icon } from '../../../common/components';
import { addLabelToTransaction } from '../../../store/features/history/history.slice';
import { to_snake_case } from '../../../common/helpers/utils';
import {
  TransactionCategory,
  TransactionType,
} from '../../../common/constants/enum';
import { capitalize } from 'lodash';
import { updateTransactionData } from '../../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../../store';

interface TransactionsListProps {
  data: IDataBaseRecord<ITransaction>[];
  onViewAllPress?: () => void;
  title?: string;
}
export const TransactionsList: React.FC<TransactionsListProps> = ({
  data,
  onViewAllPress,
  title,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const transactionLabels = useSelector(selectTransactionLabels);
  const transactionLabelEnabled = useSelector(selectTransactionLabelEnabled);
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<IDataBaseRecord<ITransaction> | null>(null);

  const renderTransactionItem = ({
    item,
  }: {
    item: IDataBaseRecord<ITransaction>;
  }) => {
    const phoneNumber = removeCountryCode(item?.phone_number || '');

    let description: string = '';
    if (item.transaction_category === TransactionCategory.TRANSFER) {
      description = `Sent to ${item?.recipient}`;
      if (phoneNumber) {
        description += ` - ${removeCountryCode(phoneNumber)}`;
      }
    } else if (
      item.transaction_category === TransactionCategory.AIRTIME_PURCHASE
    ) {
      description = `Airtime purchase from ${
        getProviderFromPhone(phoneNumber) || 'Unknown'
      }`;
    } else if (
      item.transaction_category === TransactionCategory.GOODS_PAYMENT
    ) {
      description = `Paid to ${item.recipient}, Code: ${
        item?.payment_code || 'N/A'
      }`;
    } else if (item.transaction_category === TransactionCategory.WITHDRAWAL) {
      description = `You have withdrawn money`;
    } else {
      description = `${capitalize(item.type)} transaction of unknown nature.`;
    }

    const extraProps = { rightUpText: '', rightBottomText: '' };
    if (isToday(item.completed_at)) {
      extraProps['rightUpText'] = formatRelativeTime(item.completed_at);
    } else {
      extraProps['rightUpText'] = formatDate(item.completed_at, 'DD/MM/YY');
    }

    if (item.label) {
      extraProps['rightBottomText'] = item.label;
    }

    return (
      <TouchableOpacity
        onLongPress={() => {
          setShowLabelDialog(true);
          setSelectedTransaction(item);
        }}
        disabled={!transactionLabelEnabled}
      >
        <TransactionListItem
          type={item.type}
          title={formatCurrency(item.amount)}
          description={description}
          {...extraProps}
        />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    if (title || onViewAllPress) {
      return (
        <View style={globalStyles.spacedRow}>
          {title && <Text variant="titleMedium">{title}</Text>}
          {onViewAllPress && (
            <Button
              mode="text"
              style={globalStyles.horizontalSpacing}
              onPress={onViewAllPress}
            >
              View All
            </Button>
          )}
        </View>
      );
    }
    return null;
  };

  const handleAddLabelToTransaction = useCallback(
    (label: string) => {
      if (selectedTransaction)
        dispatch(
          updateTransactionData({
            record: selectedTransaction,
            payload: { label },
          }),
        );
    },
    [dispatch, selectedTransaction],
  );

  return (
    <>
      <FlatList<IDataBaseRecord<ITransaction>>
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={[globalStyles.flatListContent, { gap: 0 }]}
        ListHeaderComponent={renderHeader}
      />
      <Portal>
        <Dialog
          visible={showLabelDialog}
          onDismiss={() => setShowLabelDialog(false)}
          style={{ borderRadius: theme.roundness }}
        >
          <Dialog.Content>
            <View
              style={[
                globalStyles.row,
                { gap: ThemeSpacings.md, flexWrap: 'wrap' },
              ]}
            >
              {Object.values(transactionLabels).map(label => {
                return (
                  <Chip
                    key={label.name}
                    icon={() =>
                      to_snake_case(selectedTransaction?.label || '') ===
                      to_snake_case(label.name) ? (
                        <Icon name="Check" color={theme.colors.primary} />
                      ) : null
                    }
                    onPress={() => {
                      if (selectedTransaction?.id) {
                        handleAddLabelToTransaction(label.name);
                      }
                      setShowLabelDialog(false);
                    }}
                  >
                    {label.name}
                  </Chip>
                );
              })}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLabelDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
