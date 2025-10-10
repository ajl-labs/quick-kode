import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { postTransactionData } from './transaction.thunk';

const initialState: {
  transactions: Record<string, ITransaction>;
} = {
  transactions: {},
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(postTransactionData.fulfilled, (state, action) => {
      // state.transactions.push(action.payload.body);
      // state.transactions = {
      //   ...state.transactions,
      //   [action.payload.boy.id]: action.payload.body,
      // };
    });
  },
});

const { actions, reducer } = historySlice;

export default reducer;

export const selectAllTransactions = createSelector(
  (state: RootState) => state.transactions.transactions,
  transactions => Object.values(transactions),
);
