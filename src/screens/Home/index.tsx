import React, { useEffect, useMemo, useRef } from 'react';
import { Container } from '../../common/Container';
import { Text } from 'react-native-paper';
import { Alert, StyleSheet, View } from 'react-native';
import globalStyles from '../../common/styles/global.styles';
import { ThemeSpacings } from '../../config/theme';
import { dialUSSD } from '../../common/helpers/ussd.helpers';
import { MOMO_USSD_CODES } from '../../common/helpers/ussd.momo.helper';
import { CustomBottomSheet } from '../../common/components/CustomBottomSheet';
import { SendMoneyForm } from './components/SendMoneyForm';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { StatCard } from '../../common/components/Card/StatCard';
import { HomeQuickActions } from './components/HomeQuickActions';
import { formatCurrency } from '../../common/helpers/currency.helpers';
import { useDispatch, useSelector } from 'react-redux';
import { PayGoodsForm } from './components/PayGoodsForm';
import { TransactionsList } from './components/TransactionsList';
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../../navigation/navigation.constants';
import {
  selectRecentTransactions,
  selectTransactionStats,
} from '../../store/features/transactions/transaction.slice';
import { fetchTransactionStats } from '../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../store';

const styles = StyleSheet.create({
  quickActionContainer: {
    ...globalStyles.row,
    gap: ThemeSpacings.md,
    flexWrap: 'wrap',
    ...globalStyles.horizontalSpacing,
  },
  statSection: {
    ...globalStyles.row,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    ...globalStyles.horizontalSpacing,
    marginTop: ThemeSpacings.md,
  },
});

type QuickActionType = keyof typeof MOMO_USSD_CODES;
type BottomSheetContentType = QuickActionType | 'FULL_HISTORY_VIEW';

export const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();

  const [bottomSheetContentType, setBottomSheetContentType] =
    React.useState<BottomSheetContentType>();

  const transactions = useSelector(selectRecentTransactions);
  const transactionStats = useSelector(selectTransactionStats);

  const handleDailUSSD = async (key: QuickActionType, ussdCode: string) => {
    return dialUSSD(ussdCode);
  };

  const onConfirmSendMoney = async (data: {
    amount?: string;
    receiver?: string;
    ussCodeKey: QuickActionType;
  }) => {
    try {
      if (data.ussCodeKey === 'SEND_MONEY' && data.amount && data.receiver) {
        const ussdCode = MOMO_USSD_CODES.SEND_MONEY.replace(
          '{phoneNumber}',
          data.receiver,
        ).replace('{amount}', data.amount);
        await handleDailUSSD('SEND_MONEY', ussdCode);
      } else if (
        data.ussCodeKey === 'PAY_GOOD_SERVICE' &&
        data.amount &&
        data.receiver
      ) {
        const ussdCode = MOMO_USSD_CODES.PAY_GOOD_SERVICE.replace(
          '{paymentCode}',
          data.receiver,
        ).replace('{amount}', data.amount);
        await handleDailUSSD('PAY_GOOD_SERVICE', ussdCode);
      } else {
        Alert.alert(
          'Invalid USSD Code',
          'Please provide a valid amount and phone number for sending money.',
        );
      }
    } catch (error) {
      console.error('Error dialing USSD code:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchTransactionStats());
  }, []);

  const handleCheckBalance = () =>
    handleDailUSSD('CHECK_BALANCE', MOMO_USSD_CODES.CHECK_BALANCE);
  const handleBuyAirtime = () =>
    handleDailUSSD('BUY_AIRTIME', MOMO_USSD_CODES.BUY_AIRTIME);

  const handleOpenBottomSheet = async (actionType: BottomSheetContentType) => {
    setBottomSheetContentType(actionType);
    sheetRef.current?.present?.();
  };

  const renderBottomSheetContent = useMemo(() => {
    if (bottomSheetContentType === 'SEND_MONEY') {
      return (
        <SendMoneyForm onCancel={dismiss} onConfirm={onConfirmSendMoney} />
      );
    }
    if (bottomSheetContentType === 'PAY_GOOD_SERVICE') {
      return <PayGoodsForm onCancel={dismiss} onConfirm={onConfirmSendMoney} />;
    }

    return null;
  }, [bottomSheetContentType]);

  return (
    <Container style={globalStyles.noSpacing}>
      <View style={styles.statSection}>
        <StatCard
          title="Balance"
          value={formatCurrency(transactionStats.balance)}
        />
        <StatCard
          title="Fees"
          value={formatCurrency(transactionStats.totalFees)}
        />
      </View>
      <Text variant="titleMedium" style={globalStyles.horizontalSpacing}>
        Quick Actions
      </Text>
      <HomeQuickActions
        style={styles.quickActionContainer}
        handleBuyAirtime={handleBuyAirtime}
        handleCheckBalance={handleCheckBalance}
        handlePayGoodService={() => handleOpenBottomSheet('PAY_GOOD_SERVICE')}
        handleSendMoney={() => handleOpenBottomSheet('SEND_MONEY')}
      />
      <TransactionsList
        data={transactions}
        onViewAllPress={() =>
          navigation.navigate(HomeStackScreens.AllTransactions)
        }
        title="Recent Transactions"
      />
      <CustomBottomSheet ref={sheetRef}>
        {renderBottomSheetContent}
      </CustomBottomSheet>
    </Container>
  );
};
