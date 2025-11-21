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
  selectTransactionPagination,
  selectTransactionStatsSummary,
} from '../../store/features/transactions/transaction.slice';
import {
  fetchTransactionData,
  fetchTransactionStatsSummary,
} from '../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../store';
import { HomeStatsTrends } from './components/HomeStatsTrends';
import { useFetchList } from '../../common/hooks/useFetch';
import { CustomButton } from '../../common/components/CustomButton';

const styles = StyleSheet.create({
  quickActionContainer: {
    ...globalStyles.row,
    gap: ThemeSpacings.md,
    flexWrap: 'wrap',
  },
  statSection: {
    ...globalStyles.row,
    flexWrap: 'wrap',
    rowGap: ThemeSpacings.md,
    columnGap: ThemeSpacings.md,
  },
});

export const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const {
    data: transactions,
    isLoading,
    isRefreshing,
    onRefresh,
  } = useFetchList({
    dataSelector: selectRecentTransactions,
    dataFetcher: fetchTransactionData,
    paginationSelector: selectTransactionPagination,
    queryParams: {
      limit: 25,
    },
  });

  const transactionStats = useSelector(selectTransactionStatsSummary);

  useEffect(() => {
    dispatch(fetchTransactionStatsSummary());
  }, []);

  return (
    <Container style={globalStyles.noSpacing}>
      <TransactionsList
        data={transactions}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        title="Recent Transactions"
        ListHeaderComponent={
          <View
            style={[
              globalStyles.column,
              globalStyles.gap,
              globalStyles.fullWidth,
            ]}
          >
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
            <HomeStatsTrends />
            <Text variant="titleMedium">Quick Actions</Text>
            <HomeQuickActions style={styles.quickActionContainer} />
            <View style={[globalStyles.spacedRow, globalStyles.fullWidth]}>
              <Text variant="titleMedium">Recent Transactions</Text>
              <CustomButton
                mode="text"
                onPress={() =>
                  navigation.navigate(HomeStackScreens.AllTransactions)
                }
              >
                View All
              </CustomButton>
            </View>
          </View>
        }
        style={[globalStyles.horizontalSpacing]}
      />
    </Container>
  );
};
