import React, { useCallback, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import globalStyles from '../../../common/styles/global.styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionStatsTrends } from '../../../store/features/transactions/transaction.thunk';
import { AppDispatch } from '../../../store';
import { selectTransactionStatsTrends } from '../../../store/features/transactions/transaction.slice';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { ThemeSpacings } from '../../../config/theme';
import { moderateScale } from 'react-native-size-matters';
import ReAnimated from 'react-native-reanimated';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { StackedBarChartData } from 'react-native-chart-kit/dist/StackedBarChart';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';
import { colorOpacity } from '../../../common/helpers/utils';

const STATS_CARD_HEIGTH = moderateScale(200);
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

  const isEmpty = useMemo(() => {
    return (
      !Boolean(transactionTrends.spendingByPeriod.datasets?.length) ||
      !Boolean(transactionTrends.spendingByCategory.datasets?.length)
    );
  }, [transactionTrends]);

  const chartConfig: AbstractChartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surfaceVariant,
    backgroundGradientTo: theme.colors.inverseOnSurface,
    decimalPlaces: 0,
    color: (opacity = 1) => colorOpacity(theme.colors.primary, opacity),
    labelColor: (opacity = 1) => colorOpacity(theme.colors.primary, opacity),
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.surface,
    },
    propsForHorizontalLabels: {
      fontSize: moderateScale(8),
    },
    propsForVerticalLabels: {
      fontSize: moderateScale(8),
    },
  };
  const renderItem = ({
    item,
  }: {
    item: IStatCardPayload & (StackedBarChartData | LineChartData);
  }) => {
    const { key, ...restOfData } = item;
    switch (key) {
      case 'spendingByPeriod':
        return (
          <LineChart
            data={restOfData as LineChartData}
            width={STATS_CARD_WIDTH}
            height={STATS_CARD_HEIGTH}
            yAxisLabel="Rw"
            yAxisSuffix="k"
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: theme.roundness,
            }}
          />
        );
      case 'spendingByCategory':
        return (
          <BarChart
            data={restOfData as ChartData}
            width={STATS_CARD_WIDTH}
            height={STATS_CARD_HEIGTH}
            yAxisLabel="Rw"
            yAxisSuffix="k"
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) =>
                colorOpacity(theme.colors.secondary, opacity),
              labelColor: (opacity = 1) =>
                colorOpacity(theme.colors.secondary, opacity),
            }}
            style={{
              borderRadius: theme.roundness,
            }}
          />
        );

      default:
        return null;
    }
  };

  if (isEmpty) return null;
  return (
    <ReAnimated.FlatList
      data={[
        transactionTrends.spendingByPeriod,
        transactionTrends.spendingByCategory,
      ]}
      horizontal={true}
      renderItem={renderItem}
      contentContainerStyle={[globalStyles.gap, globalStyles.centered]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.key}
      snapToInterval={STATS_CARD_WIDTH}
      decelerationRate="fast"
      snapToAlignment="start"
    />
  );
};
