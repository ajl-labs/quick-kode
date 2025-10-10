import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { postTransactionData } from './transaction.thunk';

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
    builder.addCase(postTransactionData.fulfilled, (state, action) => {
      state.transactions = {
        ...state.transactions,
        [action.payload.id]: action.payload,
      };
    });
  },
});

const { reducer } = historySlice;

export default reducer;

export const selectAllTransactions = createSelector(
  (state: RootState) => state.transactions.transactions,
  transactions => Object.values(transactions),
);
