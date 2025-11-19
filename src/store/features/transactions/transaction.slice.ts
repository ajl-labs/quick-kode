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

const initialState: {
  transactions: Record<string, IDataBaseRecord<ITransaction>>;
  stats: {
    summary: ITransactionStatsSummary;
    trends: ITransactionStatsTrends;
  };
} = {
  transactions: {},
  stats: {
    summary: {
      totalTransactions: null,
      totalFees: null,
      balance: null,
    },
    trends: {
      monthlySpending: [],
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
          const { data } = action.payload as PaginatedResponse<ITransaction>;
          if (data && Array.isArray(data)) {
            state.transactions = data.reduce((acc, transaction) => {
              acc[transaction.id] = transaction;
              return acc;
            }, {} as Record<string, IDataBaseRecord<ITransaction>>);
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
              monthlySpending: ITransactionStatsTrends['monthlySpending'];
              spendingByCategory: ITransactionStatsTrends['spendingByCategory'];
            };
            type: string;
          },
        ) => {
          if (action.payload) {
            state.stats.trends = {
              ...state.stats.trends,
              monthlySpending: action.payload.monthlySpending,
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

export const selectTransactionStatsTrends = createSelector(
  (state: RootState) => state.transactions.stats.trends,
  trends => {
    const totalSpending = trends.spendingByCategory?.reduce(
      (acc, curr) => acc + curr.total_amount,
      0,
    );

    return {
      monthlySpending: trends.monthlySpending?.reduce(
        (acc: { labels: string[]; data: number[] }, curr) => {
          acc.labels.push(formatDate(curr.month, 'MMM YY'));
          acc.data.push((curr.total_amount || 0) / 1000);
          return acc;
        },
        { labels: [], data: [] },
      ) || { labels: [], data: [] },
      spendingByCategory: trends.spendingByCategory?.reduce(
        (acc: { labels: string[]; data: number[] }, curr) => {
          acc.labels.push(startCase(curr.label || 'Uknown'));
          acc.data.push((curr.total_amount || 0) / totalSpending);
          return acc;
        },
        { labels: [], data: [] },
      ),
    };
  },
);
