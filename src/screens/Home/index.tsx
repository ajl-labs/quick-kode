import React, { useEffect } from 'react';
import { Container } from '../../common/Container';
import { Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import globalStyles from '../../common/styles/global.styles';
import { ThemeSpacings } from '../../config/theme';
import { StatCard } from '../../common/components/Card/StatCard';
import { HomeQuickActions } from './components/HomeQuickActions';
import { formatCurrency } from '../../common/helpers/currency.helpers';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionsList } from './components/TransactionsList';
import { useNavigation } from '@react-navigation/native';
import { HomeStackScreens } from '../../navigation/navigation.constants';
import {
  selectRecentTransactions,
  selectTransactionStatsSummary,
} from '../../store/features/transactions/transaction.slice';
import { fetchTransactionStatsSummary } from '../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../store';
import { HomeStatsTrends } from './components/HomeStatsTrends';

const styles = StyleSheet.create({
  quickActionContainer: {
    ...globalStyles.row,
    gap: ThemeSpacings.md,
    flexWrap: 'wrap',
  },
  statSection: {
    ...globalStyles.row,
    flexWrap: 'wrap',
    rowGap: ThemeSpacings.sm,
    columnGap: ThemeSpacings.sm,
    ...globalStyles.spacingSm,
  },
});

export const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const transactions = useSelector(selectRecentTransactions);
  const transactionStats = useSelector(selectTransactionStatsSummary);

  useEffect(() => {
    dispatch(fetchTransactionStatsSummary());
  }, []);

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
      <TransactionsList
        data={transactions}
        title="Recent Transactions"
        ListHeaderComponent={
          <View
            style={[
              globalStyles.column,
              globalStyles.gapSm,
              globalStyles.fullWidth,
            ]}
          >
            <HomeStatsTrends />
            <Text variant="titleMedium">Quick Actions</Text>
            <HomeQuickActions style={styles.quickActionContainer} />
            <View style={[globalStyles.spacedRow, globalStyles.fullWidth]}>
              <Text variant="titleMedium">Recent Transactions</Text>
              <Button
                mode="text"
                style={globalStyles.horizontalSpacing}
                onPress={() =>
                  navigation.navigate(HomeStackScreens.AllTransactions)
                }
              >
                View All
              </Button>
            </View>
          </View>
        }
        style={[globalStyles.horizontalSpacingSm]}
      />
    </Container>
  );
};
