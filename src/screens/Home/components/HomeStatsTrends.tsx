import React, { useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import globalStyles from '../../../common/styles/global.styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionStatsTrends } from '../../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../../store';
import { selectTransactionStatsTrends } from '../../../store/features/transactions/transaction.slice';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { ThemeSpacings } from '../../../config/theme';
import { moderateScale } from 'react-native-size-matters';
import ReAnimated from 'react-native-reanimated';
import { startCase } from 'lodash';

const STATS_CARD_HEIGTH = moderateScale(250) || 250;
const STATS_CARD_WIDTH = Dimensions.get('window').width - ThemeSpacings.sm * 2;

interface HomeStatsTrendsProps {}

export const HomeStatsTrends: React.FC<HomeStatsTrendsProps> = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const transactionTrends = useSelector(selectTransactionStatsTrends);

  const fetchData = useCallback(() => {
    dispatch(fetchTransactionStatsTrends());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ReAnimated.ScrollView
      horizontal={true}
      style={[
        {
          minHeight: STATS_CARD_HEIGTH + ThemeSpacings.sm * 2,
        },
      ]}
      contentContainerStyle={[globalStyles.gap, globalStyles.centered]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <LineChart
        data={{
          labels: transactionTrends.monthlySpending.map(
            item => item.month || 'Unknown',
          ),
          datasets: [
            {
              data: transactionTrends.monthlySpending.map(
                item => item.total_amount / 1000 || 0,
              ),
            },
          ],
        }}
        width={STATS_CARD_WIDTH}
        height={STATS_CARD_HEIGTH}
        yAxisLabel="Rw"
        yAxisSuffix="k"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surfaceVariant,
          backgroundGradientTo: theme.colors.inverseOnSurface,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.colors.onSurface,
          labelColor: (opacity = 1) => theme.colors.onSurface,
          style: {
            borderRadius: theme.roundness,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: theme.colors.surface,
          },
        }}
        bezier
        style={{
          borderRadius: theme.roundness,
        }}
      />
      <ProgressChart
        data={{
          labels: transactionTrends.spendingByCategory.map(
            item => startCase(item.label) || 'Uknown',
          ),
          data: transactionTrends.spendingByCategory.map(
            item => item.total_amount,
          ),
        }}
        width={STATS_CARD_WIDTH}
        height={STATS_CARD_HEIGTH}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundColor: theme.colors.surface,
          backgroundGradientFrom: theme.colors.surfaceVariant,
          backgroundGradientTo: theme.colors.inverseOnSurface,
          decimalPlaces: 0,
          color: (opacity = 1) => {
            const c = theme.colors.primary;
            return (
              c +
              Math.round(opacity * 255)
                .toString(16)
                .padStart(2, '0')
            );
          },
          labelColor: (opacity = 1) => theme.colors.onSurface,
          style: {
            borderRadius: theme.roundness,
          },
          propsForBackgroundLines: {
            stroke: theme.colors.primary,
            strokeDasharray: '4 4',
          },
        }}
        hideLegend={false}
      />
    </ReAnimated.ScrollView>
  );
};
