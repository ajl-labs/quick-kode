import React, { useImperativeHandle, useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import globalStyles from '../../../common/styles/global.styles';
import { fetchTransactionStatsTrends } from '../../../store/features/transactions/transaction.thunk';
import { selectTransactionStatsTrends } from '../../../store/features/transactions/transaction.slice';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { darkTheme } from '../../../config/theme';
import { moderateScale } from 'react-native-size-matters';
import ReAnimated from 'react-native-reanimated';
import { LineChartData } from 'react-native-chart-kit/dist/line-chart/LineChart';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { StackedBarChartData } from 'react-native-chart-kit/dist/StackedBarChart';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';
import { colorOpacity } from '../../../common/helpers/utils';
import { formatMoneyShort } from '../../../common/helpers/currency.helpers';
import { useFetch } from '../../../common/hooks/useFetch';
import { useSelector } from 'react-redux';
import { selectReportGranularity } from '../../../store/features/appConfig/app.config.slice';

const STATS_CARD_CONTAINER_HEIGHT = moderateScale(200);
const STATS_CARD_HEIGTH = moderateScale(175);
const STATS_CARD_WIDTH = Dimensions.get('window').width * 0.9;

export interface HomeStatsTrendsHandles {
  refresh: () => void;
}
interface HomeStatsTrendsProps {
  granularity?: IAppConfig['report']['granularity'];
  reportPeriod?: IAppConfig['report']['months'];
}

export const HomeStatsTrends = React.forwardRef<
  HomeStatsTrendsHandles,
  HomeStatsTrendsProps
>(({ granularity, reportPeriod }, ref) => {
  const theme = useTheme();
  const { data: transactionTrends, refresh } = useFetch<
    Record<string, IStatsChartData>,
    IReportQueryParams
  >({
    dataSelector: selectTransactionStatsTrends,
    dataFetcher: fetchTransactionStatsTrends,
    queryParams: {
      granularity,
      months: reportPeriod,
    },
  });

  useImperativeHandle(ref, () => ({
    refresh: refresh,
  }));

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
    propsForLabels: {
      fontSize: moderateScale(8),
    },
  };
  const renderItem = ({ item }: { item: IStatsChartData }) => {
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
            chartConfig={{
              ...chartConfig,
              formatTopBarValue: value =>
                formatMoneyShort(parseFloat(value.toString())),
              formatXLabel: yLabel => {
                return formatMoneyShort(parseFloat(yLabel.toString()));
              },
            }}
            bezier
            style={styles.statsChartContainer}
            onDataPointClick={props => console.log(props)}
          />
        );
      case 'spendingByCategory':
        return (
          <BarChart
            data={restOfData as ChartData}
            width={STATS_CARD_WIDTH}
            height={STATS_CARD_CONTAINER_HEIGHT}
            yAxisLabel="Rw"
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) =>
                colorOpacity(theme.colors.secondary, opacity),
              labelColor: (opacity = 1) =>
                colorOpacity(theme.colors.secondary, opacity),
              barPercentage: 0.5,
              formatYLabel: yLabel => {
                return formatMoneyShort(parseFloat(yLabel));
              },
              formatTopBarValue: value => {
                return formatMoneyShort(parseFloat(value.toString()));
              },
            }}
            style={{
              ...styles.statsChartContainer,
              height: STATS_CARD_CONTAINER_HEIGHT,
            }}
            verticalLabelRotation={-80}
            xLabelsOffset={13}
            showValuesOnTopOfBars
            yLabelsOffset={25}
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
      contentContainerStyle={[globalStyles.gapSm, globalStyles.centered]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.key}
      snapToInterval={STATS_CARD_WIDTH}
      decelerationRate="fast"
      snapToAlignment="start"
    />
  );
});
const styles = StyleSheet.create({
  statsChartContainer: {
    borderRadius: darkTheme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
