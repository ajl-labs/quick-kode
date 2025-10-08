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
import { useUSSDEvent } from '../../common/hooks/useUSSDEvent';
import { formatCurrency } from '../../common/helpers/currency.helpers';
import { useSelector } from 'react-redux';
import { selectMoMoBalance } from '../../store/features/momo/momo.slice';
import {
  selectRecentHistoryEntries,
  selectTransactionHistoryFees,
} from '../../store/features/history/history.slice';
import { PayGoodsForm } from './components/PayGoodsForm';
import { TransactionsList } from './components/TransactionsList';
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../../navigation/navigation.constants';
import { useSMSListener } from '../../common/hooks/useSMSListener';

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
  const navigation = useNavigation();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { dismiss } = useBottomSheetModal();
  const { loading, action, setAction } = useUSSDEvent();
  const _response = useSMSListener();

  const [bottomSheetContentType, setBottomSheetContentType] =
    React.useState<BottomSheetContentType>();

  const momoBalance = useSelector(selectMoMoBalance);
  const transactionFee = useSelector(selectTransactionHistoryFees);
  const transactions = useSelector(selectRecentHistoryEntries);

  const handleDailUSSD = async (key: QuickActionType, ussdCode: string) => {
    setAction(key);
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
        <SendMoneyForm
          onCancel={dismiss}
          onConfirm={onConfirmSendMoney}
          loading={loading && action === 'SEND_MONEY'}
        />
      );
    }
    if (bottomSheetContentType === 'PAY_GOOD_SERVICE') {
      return (
        <PayGoodsForm
          onCancel={dismiss}
          onConfirm={onConfirmSendMoney}
          loading={loading && action === 'PAY_GOOD_SERVICE'}
        />
      );
    }

    return null;
  }, [action, bottomSheetContentType, loading]);

  return (
    <Container>
      <View style={styles.statSection}>
        <StatCard title="Balance" value={formatCurrency(momoBalance)} />
        <StatCard title="Fees" value={formatCurrency(transactionFee)} />
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
        currentCode={action}
        loading={loading}
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
