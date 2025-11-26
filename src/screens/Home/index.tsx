import React, { useRef } from 'react';
import { Container } from '../../common/Container';
import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import globalStyles from '../../common/styles/global.styles';
import { ThemeSpacings } from '../../config/theme';
import { HomeQuickActions } from './components/HomeQuickActions';
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
import {
  HomeStatsTrends,
  HomeStatsTrendsHandles,
} from './components/HomeStatsTrends';
import { useFetch, useFetchList } from '../../common/hooks/useFetch';
import { CustomButton } from '../../common/components/CustomButton';
import {
  HomeStateSummary,
  HomeStateSummaryHandles,
} from './components/HomeStatsSummary';
import {
  selectReportPeriod,
  selectReportGranularity,
} from '../../store/features/appConfig/app.config.slice';

const styles = StyleSheet.create({
  quickActionContainer: {
    ...globalStyles.row,
    gap: ThemeSpacings.md,
    flexWrap: 'wrap',
  },
});

export const HomeScreen = () => {
  const navigation = useNavigation();
  const homeStatsSummaryRef = useRef<HomeStateSummaryHandles>(null);
  const homeStatsTrendsRef = useRef<HomeStatsTrendsHandles>(null);

  const reportPeriod = useSelector(selectReportPeriod);
  const reportGranularity = useSelector(selectReportGranularity);

  const {
    data: transactions,
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

  const handleRefresh = () => {
    onRefresh();
    homeStatsTrendsRef.current?.refresh();
    homeStatsSummaryRef.current?.refresh();
  };

  return (
    <Container style={globalStyles.noSpacing}>
      <TransactionsList
        data={transactions}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        title="Recent Transactions"
        ListHeaderComponent={
          <View
            style={[
              globalStyles.column,
              globalStyles.gap,
              globalStyles.fullWidth,
            ]}
          >
            <HomeStateSummary
              ref={homeStatsSummaryRef}
              granularity={reportGranularity}
              reportPeriod={reportPeriod}
            />
            <HomeStatsTrends
              ref={homeStatsTrendsRef}
              granularity={reportGranularity}
              reportPeriod={reportPeriod}
            />
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
