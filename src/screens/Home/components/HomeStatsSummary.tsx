import React, { useImperativeHandle } from 'react';
import { Dimensions, StyleProp, ViewStyle } from 'react-native';
import {
  StatCard,
  StatCardProps,
} from '../../../common/components/Card/StatCard';
import { formatCurrency } from '../../../common/helpers/currency.helpers';
import { useFetch } from '../../../common/hooks/useFetch';
import { fetchTransactionStatsSummary } from '../../../store/features/transactions/transaction.thunk';
import { selectTransactionStatsSummary } from '../../../store/features/transactions/transaction.slice';
import ReAnimated from 'react-native-reanimated';
import globalStyles from '../../../common/styles/global.styles';
import { useTheme } from 'react-native-paper';
import { TransactionGranularity } from '../../../common/constants';
import { startCase } from 'lodash';

const STATS_CARD_WIDTH = Dimensions.get('window').width / 2.3;

export interface HomeStateSummaryHandles {
  refresh: () => void;
}
interface HomeStateSummaryProps {
  style?: StyleProp<ViewStyle>;
  granularity?: IAppConfig['report']['granularity'];
  reportPeriod?: IAppConfig['report']['months'];
}
export const HomeStateSummary = React.forwardRef<
  HomeStateSummaryHandles,
  HomeStateSummaryProps
>(({ granularity, reportPeriod }, ref) => {
  const theme = useTheme();

  const {
    data: { balance, totalFees, averagespending, totalTransactions },
    refresh,
  } = useFetch<ITransactionStatsSummary, IReportQueryParams>({
    dataFetcher: fetchTransactionStatsSummary,
    dataSelector: selectTransactionStatsSummary,
    queryParams: {
      granularity,
      months: reportPeriod,
    },
  });
  useImperativeHandle(ref, () => ({
    refresh,
  }));
  const averageSpendingTitle = React.useMemo(() => {
    if (granularity === TransactionGranularity.MONTH) {
      return 'Monthly Spending';
    } else if (granularity === TransactionGranularity.WEEK) {
      return 'Weekly Spending';
    } else if (granularity === TransactionGranularity.YEAR) {
      return 'Yearly Spending';
    }
  }, [granularity]);
  return (
    <ReAnimated.FlatList<StatCardProps>
      data={[
        { title: 'Balance', value: formatCurrency(balance) },
        {
          title: startCase(averageSpendingTitle),
          value: formatCurrency(averagespending),
        },
        { title: 'Fees', value: formatCurrency(totalFees) },
        {
          title: 'Transactions',
          value: totalTransactions || 0,
          valueTextStyle: { alignSelf: 'flex-end' },
        },
      ]}
      horizontal
      renderItem={({ item }) => (
        <StatCard {...item} style={{ minWidth: STATS_CARD_WIDTH }} />
      )}
      keyExtractor={item => item.title}
      contentContainerStyle={[
        globalStyles.gapSm,
        { backgroundColor: theme.colors.background },
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToAlignment="start"
    />
  );
});
