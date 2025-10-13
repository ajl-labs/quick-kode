import React, { useCallback, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { FlatList, FlatListProps, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../../common/styles/global.styles';
import { TransactionListItem } from './TransactionListItem';

import {
  formatDate,
  formatRelativeTime,
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
import { to_snake_case } from '../../../common/helpers/utils';
import { updateTransactionData } from '../../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../../store';
import { extractTransactionSummary } from '../../../common/helpers/transaction.helper';

interface TransactionsListProps
  extends Partial<FlatListProps<IDataBaseRecord<ITransaction>>> {
  data: IDataBaseRecord<ITransaction>[];
  onViewAllPress?: () => void;
  title?: string;
  expanded?: boolean;
}
export const TransactionsList: React.FC<TransactionsListProps> = ({
  data,
  onViewAllPress,
  title,
  expanded,
  ...props
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
    const extraProps = { rightUpText: '', rightBottomText: '' };
    const transactionDate = item.completed_at || item.created_at;

    if (isToday(transactionDate)) {
      extraProps['rightUpText'] = formatRelativeTime(transactionDate);
    } else {
      extraProps['rightUpText'] = formatDate(transactionDate, 'DD/MM/YY');
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
          summary={extractTransactionSummary(item)}
          {...(expanded ? { description: item.message } : {})}
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
            payload: {
              label: selectedTransaction.label === label ? '' : label,
            },
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
        contentContainerStyle={[globalStyles.flatListContentSm, { gap: 0 }]}
        ListHeaderComponent={renderHeader}
        {...props}
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
