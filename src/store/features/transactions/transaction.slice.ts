import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import {
  fetchTransactionData,
  postTransactionData,
  updateTransactionData,
} from './transaction.thunk';

const initialState: {
  transactions: Record<string, IDataBaseRecord<ITransaction>>;
} = {
  transactions: {},
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
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
        const { data, total, page, limit } =
          action.payload as PaginatedResponse<ITransaction>;
        if (data && Array.isArray(data)) {
          state.transactions = {
            ...state.transactions,
            ...data.reduce((acc, transaction) => {
              acc[transaction.id] = transaction;
              return acc;
            }, {} as Record<string, IDataBaseRecord<ITransaction>>),
          };
        }
      })
      .addCase(updateTransactionData.fulfilled, (state, action) => {
        if (action.payload?.id) {
          state.transactions[action.payload.id] = {
            ...state.transactions[action.payload.id],
            ...action.payload,
          };
        }
      });
  },
});

const { reducer } = historySlice;

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
