import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../..';
import { postTransactionData } from './history.thunk';

const initialState: {
  history: IHistoryData[];
  transaction: Record<string, any>[];
} = {
  history: [],
  transaction: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryEntry(state, action) {
      state.history.push(action.payload);
    },
    addLabelToTransaction(
      state,
      action: { payload: Pick<IHistoryData, 'id' | 'label'>; type: string },
    ) {
      const { id, label } = action.payload;
      const entry = state.history.find(entry => entry.id === id);
      if (entry) {
        entry.label = entry.label ? '' : label;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(postTransactionData.fulfilled, (state, action) => {
      state.transaction.push(action.payload);
    });
  },
});

const { actions, reducer } = historySlice;

export const { addHistoryEntry, addLabelToTransaction } = actions;
export default reducer;

export const selectHistoryEntries = createSelector(
  (state: RootState) => state.history.history,
  history => [...history].sort((a, b) => b.timestamp - a.timestamp),
);

export const selectRecentHistoryEntries = createSelector(
  selectHistoryEntries,
  sortedHistory => sortedHistory.slice(0, 5),
);

export const selectTransactionHistoryFees = (state: RootState) =>
  state.history.history.reduce((total, entry) => {
    if (entry.transaction?.fees) {
      const fees = parseFloat(entry.transaction.fees);
      return total + (isNaN(fees) ? 0 : fees);
    }
    return total;
  }, 0);
