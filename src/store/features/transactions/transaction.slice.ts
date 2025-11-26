import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import {
  fetchTransactionData,
  fetchTransactionStatsSummary,
  fetchTransactionStatsTrends,
  postTransactionData,
  updateTransactionData,
} from './transaction.thunk';
import { formatDate } from '../../../common/helpers/date.helpers';
import { startCase } from 'lodash';
import { TransactionGranularity } from '../../../common/constants';
import { selectReportGranularity } from '../appConfig/app.config.slice';

const initialState: {
  transactions: Record<string, IDataBaseRecord<ITransaction>>;
  pagination: IPagination;
  stats: {
    summary: ITransactionStatsSummary;
    trends: ITransactionStatsTrends;
  };
} = {
  transactions: {},
  pagination: {
    limit: 25,
  },
  stats: {
    summary: {
      totalTransactions: null,
      totalFees: null,
      balance: null,
      averagespending: null,
    },
    trends: {
      spendingByPeriod: [],
      spendingByCategory: [],
    },
  },
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    updateTransactionState(
      state,
      action: { payload: Partial<IDataBaseRecord<ITransaction>>; type: string },
    ) {
      const { id, ...restOfPayload } = action.payload;
      if (id && state.transactions[id]) {
        state.transactions[id] = {
          ...state.transactions[id],
          ...restOfPayload,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(postTransactionData.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.transactions = {
            ...state.transactions,
            [action.payload.id]: action.payload,
          };
        }
      })
      .addCase(fetchTransactionData.fulfilled, (state, action) => {
        if (action.payload) {
          const { data, nextCursor, currentCursor } =
            action.payload as PaginatedResponse<ITransaction>;
          if (data && Array.isArray(data)) {
            if (!currentCursor) {
              state.transactions = data.reduce((acc, transaction) => {
                acc[transaction.id] = transaction;
                return acc;
              }, {} as Record<string, IDataBaseRecord<ITransaction>>);
            } else {
              state.transactions = {
                ...state.transactions,
                ...data.reduce((acc, transaction) => {
                  acc[transaction.id] = transaction;
                  return acc;
                }, {} as Record<string, IDataBaseRecord<ITransaction>>),
              };
            }
            state.pagination['nextCursor'] = nextCursor || null;
            state.pagination['currentCursor'] = currentCursor || null;
          }
        }
      })
      .addCase(updateTransactionData.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.transactions[action.payload.id] = {
            ...state.transactions[action.payload.id],
            ...action.payload,
          };
        }
      })
      .addCase(fetchTransactionStatsSummary.fulfilled, (state, action) => {
        if (action.payload) {
          state.stats.summary = {
            ...state.stats.summary,
            ...action.payload,
          };
        }
      })
      .addCase(
        fetchTransactionStatsTrends.fulfilled,
        (
          state,
          action: {
            payload: {
              spendingByPeriod: ITransactionStatsTrends['spendingByPeriod'];
              spendingByCategory: ITransactionStatsTrends['spendingByCategory'];
            };
            type: string;
          },
        ) => {
          if (action.payload) {
            state.stats.trends = {
              spendingByPeriod: action.payload.spendingByPeriod,
              spendingByCategory: action.payload.spendingByCategory,
            };
          }
        },
      );
  },
});

const { actions, reducer } = historySlice;

export const { updateTransactionState } = actions;

export default reducer;

export const selectAllTransactions = createSelector(
  (state: RootState) => state.transactions.transactions,
  transactions =>
    Object.values(transactions).sort((a, b) => {
      if (a.completed_at && b.completed_at) {
        return (
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }),
);

export const selectRecentTransactions = createSelector(
  selectAllTransactions,
  transactions => transactions.slice(0, 5),
);

export const selectTransactionStatsSummary = (state: RootState) =>
  state.transactions.stats.summary;

export const selectTrends = (state: RootState) =>
  state.transactions.stats.trends;

export const selectTransactionStatsTrends = createSelector(
  [selectTrends, selectReportGranularity],
  (trends, granularity) => {
    const legendPrefix =
      granularity === TransactionGranularity.WEEK
        ? 'Weekly'
        : granularity === TransactionGranularity.YEAR
        ? 'Yearly'
        : 'Monthly';
    const spendingByPeriodDefault: IStatsChartData = {
      labels: [],
      datasets: [],
      key: 'spendingByPeriod',
      legend: [`${legendPrefix} Spending`],
    };

    const spendingByCategoryDefault: IStatsChartData = {
      labels: [],
      datasets: [],
      key: 'spendingByCategory',
    };

    // Pick date format once
    const dateFormat =
      granularity === TransactionGranularity.WEEK
        ? 'week'
        : granularity === TransactionGranularity.YEAR
        ? 'YYYY'
        : 'MMM-YY';

    // Spending by period
    const spendingByPeriod =
      trends.spendingByPeriod?.reduce((acc, curr) => {
        acc.labels.push(formatDate(curr.label, dateFormat));

        const value = (curr.total_amount || 0) / 1000;

        acc.datasets[0] = {
          ...(acc.datasets[0] ?? {}),
          data: [...(acc.datasets[0]?.data || []), value],
        };

        return acc;
      }, spendingByPeriodDefault) || spendingByPeriodDefault;

    // Spending by category
    const spendingByCategory =
      trends.spendingByCategory?.reduce((acc, curr) => {
        acc.labels.push(startCase(curr.label || 'Unknown').slice(0, 7));

        acc.datasets[0] = {
          ...(acc.datasets[0] ?? {}),
          data: [...(acc.datasets[0]?.data || []), curr.total_amount || 0],
        };

        return acc;
      }, spendingByCategoryDefault) || spendingByCategoryDefault;

    return { spendingByPeriod, spendingByCategory };
  },
);

export const selectTransactionPagination = (state: RootState) =>
  state.transactions.pagination;
