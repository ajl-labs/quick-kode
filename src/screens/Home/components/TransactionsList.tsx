import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button, Chip, Text, useTheme } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import globalStyles from '../../../common/styles/global.styles';
import { TransactionListItem } from './TransactionListItem';
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
import ReAnimated, { FlatListPropsWithLayout } from 'react-native-reanimated';

import {
  CustomBottomSheet,
  CustomBottomSheetHandles,
} from '../../../common/components/CustomBottomSheet';

interface TransactionsListProps
  extends Partial<FlatListPropsWithLayout<IDataBaseRecord<ITransaction>>> {
  data: IDataBaseRecord<ITransaction>[];
  onViewAllPress?: () => void;
  title?: string;
  showMessage?: boolean;
}
export const TransactionsList: React.FC<TransactionsListProps> = ({
  data,
  onViewAllPress,
  title,
  showMessage,
  ...props
}) => {
  const customBottomSheetRef = useRef<CustomBottomSheetHandles>(null);
  const customBottomSheetOpenRef = useRef<boolean>(null);
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
    return (
      <TouchableOpacity
        disabled={!transactionLabelEnabled}
        onLongPress={() => {
          setSelectedTransaction(item);
          setShowLabelDialog(true);
        }}
      >
        <TransactionListItem
          item={item}
          transactionLabels={Object.values(transactionLabels)}
          showMessage={showMessage}
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

  useEffect(() => {
    if (customBottomSheetOpenRef.current == showLabelDialog) {
      return;
    }
    if (showLabelDialog) {
      customBottomSheetRef.current?.present();
    } else {
      customBottomSheetRef.current?.dismiss();
    }
    customBottomSheetOpenRef.current = showLabelDialog;
  }, [showLabelDialog]);

  const renderLabelDialog = useMemo(() => {
    return (
      transactionLabelEnabled && (
        <CustomBottomSheet
          ref={customBottomSheetRef}
          onOpenChange={isOpen => {
            setShowLabelDialog(isOpen);
          }}
        >
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
                    setShowLabelDialog(false);
                    if (selectedTransaction?.id) {
                      handleAddLabelToTransaction(label.name);
                    }
                  }}
                >
                  {label.name}
                </Chip>
              );
            })}
          </View>
        </CustomBottomSheet>
      )
    );
  }, [selectedTransaction, showLabelDialog]);

  return (
    <>
      <ReAnimated.FlatList<IDataBaseRecord<ITransaction>>
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={[globalStyles.flatListContentSm, { gap: 0 }]}
        ListHeaderComponent={renderHeader}
        {...props}
      />
      {renderLabelDialog}
    </>
  );
};
