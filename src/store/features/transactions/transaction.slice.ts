import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { postTransactionData } from './transaction.thunk';

const initialState: {
  transactions: ITransaction[];
} = {
  transactions: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(postTransactionData.fulfilled, (state, action) => {
      state.transactions.push(action.payload.body);
    });
  },
});

const { actions, reducer } = historySlice;

export default reducer;

export const selectAllTransactions = (state: RootState) =>
  state.transactions.transactions;
